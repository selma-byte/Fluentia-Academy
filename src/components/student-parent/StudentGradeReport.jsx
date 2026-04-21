import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

const Icons = {
  TrendingUp: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>,
  Award: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>,
  ExternalLink: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
};

const StudentGradeReport = () => {
  const [gradesData, setGradesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [average, setAverage] = useState(0);

  // ==========================================
  // 💡 Fetch Grades from Supabase
  // ==========================================
  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // 1. نجيبو اسم الطالب
        const { data: student } = await supabase
          .from('students')
          .select('first_name, last_name, level')
          .eq('email', user.email)
          .single();

        if (student) {
          const fullName = `${student.first_name || ''} ${student.last_name || ''}`.trim();

          // 2. نجيبو النقاط تاع الطالب
          const { data: grades, error } = await supabase
            .from('grades')
            .select('*')
            .eq('student_name', fullName)
            .order('created_at', { ascending: false });

          if (grades && grades.length > 0) {
            let totalMarksOn20 = 0;
            let validGradesCount = 0;

            const formattedGrades = grades.map((g, idx) => {
              // 💡 اللوجيك الذكي لحساب النقطة
              let mark = 0;
              
              // نشوفو إذا النقطة كاينة في score (أولوية)
              if (g.score !== null && g.score !== undefined && g.score !== '') {
                mark = parseFloat(g.score);
              } 
              // وإذا ماكانتش، نشوفو في grade ونفيتيو الحروف كيما 'F' ولا 'P'
              else if (g.grade !== null && g.grade !== undefined) {
                const parsed = parseFloat(g.grade);
                if (!isNaN(parsed)) mark = parsed;
              }

              // نجيبو النقطة القصوى max_grade، وإذا مكانش نعتبروها 20
              let max = parseFloat(g.max_grade) || 20;

              // نحولو النقطة لتولي على 20 باش يجي الحساب مريڨل
              let markOn20 = (mark / max) * 20;

              totalMarksOn20 += markOn20;
              validGradesCount++;

              // تقييم الحالة واللون أوتوماتيكياً
              let status = "Needs Work";
              let statusColor = "text-orange-500 bg-orange-50";
              
              if (markOn20 >= 16) { status = "Excellent"; statusColor = "text-green-500 bg-green-50"; }
              else if (markOn20 >= 14) { status = "Good"; statusColor = "text-blue-500 bg-blue-50"; }
              else if (markOn20 >= 10) { status = "Average"; statusColor = "text-purple-500 bg-purple-50"; }

              // تريڨال الفاصلة (إذا عدد صحيح ما نكتبوش .00)
              const displayGrade = Number.isInteger(markOn20) ? markOn20 : markOn20.toFixed(2);

              return {
                id: idx < 9 ? `0${idx + 1}` : `${idx + 1}`,
                course: g.course || g.exam_title || 'Language Course',
                level: student.level || 'N/A',
                date: new Date(g.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
                grade: `${displayGrade}/20`,
                status,
                statusColor
              };
            });

            setGradesData(formattedGrades);
            
            // حساب المعدل العام
            if (validGradesCount > 0) {
              const avg = (totalMarksOn20 / validGradesCount).toFixed(2);
              setAverage(avg);
            }
          } else {
            setGradesData([]);
            setAverage(0);
          }
        }
      } catch (err) {
        console.error("Error fetching grades:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, []);

  return (
    <div className="flex-1 flex flex-col xl:flex-row gap-10 animate-fadeIn pr-2 pb-12">
      
      {/* LEFT SIDE: Grade Content */}
      <div className="flex-1 flex flex-col space-y-10 min-w-0">
        
        {/* HERO HEADER */}
        <div className="bg-[#EBE9F1] rounded-[45px] p-12 flex justify-between items-center relative overflow-hidden min-h-[220px] shadow-sm">
          <div className="z-10 w-full md:w-3/5">
            <h2 className="text-3xl font-black text-[#1B254B] mb-4 uppercase tracking-tighter leading-none">Academic Transcript</h2>
            <p className="text-[#1B254B]/60 text-sm mb-10 leading-relaxed font-bold max-w-lg uppercase tracking-widest opacity-70">
              Validated performance metrics for the current term. Monitor your proficiency tracks and overall standing.
            </p>
            <button className="bg-[#111C44] text-white px-10 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-black transition-all">
              Request Official Copy
            </button>
          </div>
          <div className="absolute right-[-20px] bottom-[-20px] opacity-10 text-[240px] font-black pointer-events-none select-none italic leading-none">G</div>
        </div>

        {/* TOP STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-50 flex items-center justify-between group hover:shadow-lg transition-all">
             <div>
                <p className="text-[10px] uppercase font-black text-[#A3AED0] tracking-[0.2em] mb-2">Aggregate average</p>
                <p className="text-3xl font-black text-[#4318FF] italic">{average} / 20</p>
             </div>
             <div className="w-14 h-14 bg-[#F4F7FE] rounded-2xl flex items-center justify-center text-[#4318FF] shadow-inner group-hover:scale-110 transition-transform">
                <Icons.TrendingUp />
             </div>
           </div>
           
           <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-50 flex items-center justify-between group hover:shadow-lg transition-all">
             <div>
                <p className="text-[10px] uppercase font-black text-[#A3AED0] tracking-[0.2em] mb-2">Class Standing</p>
                <p className="text-3xl font-black text-[#1B254B] tracking-tighter uppercase italic">{average >= 14 ? 'Top 10%' : 'Average'}</p>
             </div>
             <div className="w-14 h-14 bg-[#F4F7FE] rounded-2xl flex items-center justify-center text-[#FFB547] shadow-inner group-hover:scale-110 transition-transform">
                <Icons.Award />
             </div>
           </div>
        </div>

        {/* RESULTS TABLE */}
        <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-50 overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
            <h3 className="text-xl font-black text-[#1B254B] uppercase tracking-widest leading-none">Detailed Results</h3>
            <div className="relative">
                <select className="bg-[#F4F7FE] border-none rounded-2xl px-6 py-3.5 text-[10px] font-black uppercase tracking-widest text-[#4318FF] outline-none cursor-pointer hover:bg-[#EEF2FF] transition-all shadow-sm">
                    <option>Term: Spring 2026</option>
                    <option>Term: Winter 2025</option>
                </select>
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center font-black text-[#A3AED0] animate-pulse uppercase tracking-widest">Loading Grades...</div>
          ) : gradesData.length > 0 ? (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="text-[#A3AED0] text-[10px] font-black uppercase tracking-[0.3em] border-b border-gray-100">
                    <th className="pb-6 pl-4">#</th>
                    <th className="pb-6">Course Path</th>
                    <th className="pb-6 text-center">Level</th>
                    <th className="pb-6 text-center">Mark</th>
                    <th className="pb-6 text-center">Evaluation</th>
                    <th className="pb-6 pr-4 text-right">View</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {gradesData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-all group">
                      <td className="py-7 pl-4 text-xs font-black text-[#A3AED0]">{item.id}</td>
                      <td className="py-7">
                        <span className="text-[15px] font-black text-[#1B254B] uppercase tracking-tight">{item.course}</span>
                        <p className="text-[9px] font-bold text-[#A3AED0] uppercase tracking-widest mt-1">Verified Record</p>
                      </td>
                      <td className="py-7 text-center">
                        <span className="text-xs font-black text-[#707EAE] uppercase tracking-widest">{item.level}</span>
                      </td>
                      <td className="py-7 text-center">
                        <span className="text-xl font-black text-[#1B254B] italic tracking-tighter leading-none">{item.grade}</span>
                      </td>
                      <td className="py-7 text-center">
                        <span className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm ${item.statusColor}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-7 pr-4 text-right">
                          <button className="w-10 h-10 inline-flex items-center justify-center bg-[#F4F7FE] rounded-xl text-[#4318FF] hover:bg-[#4318FF] hover:text-white transition-all shadow-sm">
                              <Icons.ExternalLink />
                          </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-10 text-center text-gray-400 font-bold uppercase tracking-widest">
               No grades published for you yet.
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SIDEBAR */}
      <div className="w-full xl:w-[350px] shrink-0 flex flex-col space-y-10">
        <div className="text-right text-[10px] font-black text-[#A3AED0] uppercase tracking-[0.3em]">
           {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
        </div>

        {/* PROGRESS CARD */}
        <div className="bg-white p-10 rounded-[45px] shadow-sm border border-gray-50">
          <p className="text-[11px] font-black text-[#1B254B] mb-8 uppercase tracking-[0.3em] border-b border-gray-50 pb-6 text-center">Semester Completion</p>
          <div className="space-y-4">
             <div className="flex justify-between text-[10px] font-black uppercase tracking-widest px-1">
                <span className="text-[#A3AED0]">Timeline</span>
                <span className="text-[#4318FF]">37%</span>
             </div>
             <div className="h-3 w-full bg-[#F4F7FE] rounded-full overflow-hidden p-0.5">
                <div className="h-full bg-gradient-to-r from-[#4318FF] to-[#300bf5] w-[37%] rounded-full shadow-[0_0_10px_rgba(67,24,255,0.4)] transition-all duration-1000"></div>
             </div>
          </div>
        </div>

        {/* ELIGIBILITY NOTICE */}
        <div className="bg-white rounded-[45px] p-10 shadow-sm border border-gray-100">
          <h4 className="text-[11px] font-black text-[#1B254B] uppercase mb-10 tracking-[0.2em] text-center border-b pb-4">Academic Status</h4>
          <div className="space-y-8">
            <div className="flex items-center gap-5">
              <div className={`w-3 h-3 rounded-full ${average >= 14 ? 'bg-[#01B574] shadow-[0_0_10px_rgba(1,181,116,0.4)]' : 'bg-orange-400 shadow-[0_0_10px_rgba(251,146,60,0.4)]'}`}></div>
              <span className="text-xs font-black text-[#1B254B] uppercase tracking-widest">
                 {average >= 14 ? "Dean's List Eligible" : "Regular Standing"}
              </span>
            </div>
            <div className="p-8 bg-[#F4F7FE] rounded-[35px] border border-[#4318FF]/5">
              <p className="text-[11px] font-bold text-[#A3AED0] leading-relaxed uppercase tracking-tight text-center">
                Your GPA of <span className="text-[#4318FF] font-black tracking-normal">{average}</span> 
                {average >= 14 ? " currently qualifies you for the academic excellence citation." : " requires improvement for academic excellence citation."}
              </p>
            </div>
          </div>
        </div>

        {/* BOTTOM ACTION */}
        <div className="bg-[#111C44] p-10 rounded-[45px] shadow-2xl text-white relative overflow-hidden group cursor-pointer active:scale-95 transition-all">
           <div className="relative z-10">
                <h4 className="text-xl font-black mb-2 uppercase tracking-tighter leading-tight">Exam Prep</h4>
                <p className="text-white/40 text-[10px] font-black mb-10 uppercase tracking-widest leading-relaxed">Review modules for upcoming final speaking assessments.</p>
                <button className="w-full py-5 bg-white/10 hover:bg-white/20 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-white/5">Launch Modules</button>
           </div>
           <div className="absolute -right-10 -bottom-10 opacity-5 font-black text-[180px] italic pointer-events-none group-hover:scale-110 transition-transform">?</div>
        </div>
      </div>

    </div>
  );
};

export default StudentGradeReport;
import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

const Icons = {
  TrendingUp: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>,
  Award: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>,
  ExternalLink: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>,
  Info: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
};

const StudentGradeReport = () => {
  const [gradesData, setGradesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [average, setAverage] = useState(0);

  // ==========================================
  // 💡 Database Logic - STRICTLY PRESERVED
  // ==========================================
  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: student } = await supabase
          .from('students')
          .select('first_name, last_name, level')
          .eq('email', user.email)
          .single();

        if (student) {
          const fullName = `${student.first_name || ''} ${student.last_name || ''}`.trim();

          const { data: grades, error } = await supabase
            .from('grades')
            .select('*')
            .eq('student_name', fullName)
            .order('created_at', { ascending: false });

          if (grades && grades.length > 0) {
            let totalMarksOn20 = 0;
            let validGradesCount = 0;

            const formattedGrades = grades.map((g, idx) => {
              let mark = 0;
              if (g.score !== null && g.score !== undefined && g.score !== '') {
                mark = parseFloat(g.score);
              } 
              else if (g.grade !== null && g.grade !== undefined) {
                const parsed = parseFloat(g.grade);
                if (!isNaN(parsed)) mark = parsed;
              }

              let max = parseFloat(g.max_grade) || 20;
              let markOn20 = (mark / max) * 20;

              totalMarksOn20 += markOn20;
              validGradesCount++;

              let status = "Needs Work";
              let statusColor = "text-orange-500 bg-orange-50";
              
              if (markOn20 >= 16) { status = "Excellent"; statusColor = "text-emerald-500 bg-emerald-50"; }
              else if (markOn20 >= 14) { status = "Good"; statusColor = "text-[#4318FF] bg-indigo-50"; }
              else if (markOn20 >= 10) { status = "Average"; statusColor = "text-purple-500 bg-purple-50"; }

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
    <div className="flex-1 flex flex-col xl:flex-row gap-6 animate-fadeIn pr-2 pb-8">
      
      {/* LEFT CONTENT AREA */}
      <div className="flex-1 flex flex-col space-y-6 min-w-0">
        
        {/* MATCHES "MY LEARNING PATH" HEADER STYLE */}
        <div className="flex flex-col space-y-1 px-1">
          <h2 className="text-xl font-black text-[#1B254B]">Academic Transcript</h2>
          <p className="text-[#A3AED0] text-[13px] font-medium leading-relaxed">
            Review your validated marks and proficiency tracks for the active semester.
          </p>
        </div>

        {/* TOP METRICS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-white p-6 rounded-[25px] shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-all active:scale-95 cursor-pointer">
             <div>
                <p className="text-[10px] uppercase font-black text-[#A3AED0] tracking-widest mb-1">Aggregate Average</p>
                <p className="text-2xl font-black text-[#1B254B] italic leading-none">{average} / 20</p>
             </div>
             <div className="w-10 h-10 bg-[#F4F7FE] rounded-xl flex items-center justify-center text-[#4318FF] shadow-inner group-hover:scale-110 transition-transform">
                <Icons.TrendingUp />
             </div>
           </div>
           
           <div className="bg-white p-6 rounded-[25px] shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-all active:scale-95 cursor-pointer">
             <div>
                <p className="text-[10px] uppercase font-black text-[#A3AED0] tracking-widest mb-1">Academic Status</p>
                <p className="text-2xl font-black text-[#1B254B] italic leading-none uppercase">{average >= 14 ? 'Top 10%' : 'Regular'}</p>
             </div>
             <div className="w-10 h-10 bg-[#F4F7FE] rounded-xl flex items-center justify-center text-[#FFB547] shadow-inner group-hover:scale-110 transition-transform">
                <Icons.Award />
             </div>
           </div>
        </div>

        {/* RESULTS TABLE CARD */}
        <div className="bg-white rounded-[25px] p-6 shadow-sm border border-gray-100 overflow-hidden min-h-[400px]">
          <div className="flex justify-between items-center mb-6 px-2">
            <h3 className="text-sm font-bold text-[#1B254B] uppercase tracking-widest italic">Evaluation Details</h3>
            <div className="relative">
                <select className="bg-[#F4F7FE] border-none rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-wider text-[#4318FF] outline-none cursor-pointer hover:bg-[#EEF2FF] transition-all">
                    <option>Spring 2026</option>
                    <option>Winter 2025</option>
                </select>
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center font-black text-[#A3AED0] text-[11px] animate-pulse uppercase tracking-widest">Validating Records...</div>
          ) : gradesData.length > 0 ? (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[#A3AED0] text-[10px] font-black uppercase tracking-widest border-b border-gray-50 pb-4">
                    <th className="pb-4 pl-2 w-12 text-center font-bold">#</th>
                    <th className="pb-4 font-bold">Course Track</th>
                    <th className="pb-4 text-center font-bold">Level</th>
                    <th className="pb-4 text-center font-bold">Mark</th>
                    <th className="pb-4 text-center font-bold">Protocol</th>
                    <th className="pb-4 pr-2 text-right">Info</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {gradesData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="py-5 pl-2 text-[11px] font-black text-[#A3AED0] text-center">{item.id}</td>
                      <td className="py-5">
                        <span className="text-[13px] font-black text-[#1B254B] uppercase group-hover:text-[#4318FF] transition-colors leading-none italic">{item.course}</span>
                        <p className="text-[9px] font-bold text-[#A3AED0] uppercase mt-1">Verified Record</p>
                      </td>
                      <td className="py-5 text-center">
                        <span className="text-[11px] font-black text-[#707EAE] uppercase italic">{item.level}</span>
                      </td>
                      <td className="py-5 text-center">
                        <span className="text-[16px] font-black text-[#1B254B] italic tracking-tight">{item.grade}</span>
                      </td>
                      <td className="py-5 text-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-tight shadow-sm border border-transparent ${item.statusColor}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-5 pr-2 text-right">
                          <button className="w-8 h-8 inline-flex items-center justify-center bg-[#F4F7FE] rounded-lg text-[#4318FF] hover:bg-[#4318FF] hover:text-white transition-all">
                              <Icons.ExternalLink />
                          </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-20 flex flex-col items-center justify-center space-y-4 opacity-40">
                <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-300">
                    <Icons.Info />
                </div>
                <p className="text-center text-gray-500 font-bold uppercase text-[11px] tracking-widest">No entries localized.</p>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SIDEBAR - MATCHED TO 280px */}
      <aside className="w-full xl:w-[280px] shrink-0 flex flex-col space-y-6">
        
        {/* SEMESTER COMPLETION */}
        <div className="bg-white p-6 rounded-[25px] shadow-sm border border-gray-100">
          <p className="text-[10px] font-black text-[#1B254B] mb-5 uppercase tracking-widest border-b border-gray-50 pb-3 italic">Curriculum Timeline</p>
          <div className="space-y-3">
             <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                <span className="text-[#A3AED0]">Timeline</span>
                <span className="text-[#4318FF]">37%</span>
             </div>
             <div className="h-2 w-full bg-[#F4F7FE] rounded-full overflow-hidden">
                <div className="h-full bg-[#4318FF] w-[37%] rounded-full shadow-[0_0_8px_rgba(67,24,255,0.3)]"></div>
             </div>
          </div>
        </div>

        {/* STATUS BOX */}
        <div className="bg-white rounded-[25px] p-6 shadow-sm border border-gray-100">
          <h4 className="text-[10px] font-black text-[#1B254B] uppercase mb-6 tracking-widest border-b border-gray-50 pb-3 italic">Academic Review</h4>
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${average >= 14 ? 'bg-[#01B574]' : 'bg-orange-400'} animate-pulse`}></div>
              <span className="text-[11px] font-black text-[#1B254B] uppercase tracking-tight">
                 {average >= 14 ? "Excellence Citation" : "Standard Standing"}
              </span>
            </div>
            <div className="p-4 bg-[#F4F7FE] rounded-2xl border border-indigo-50">
              <p className="text-[10px] font-bold text-[#A3AED0] leading-relaxed uppercase text-center">
                Your GPA of <span className="text-[#4318FF] font-black">{average}</span> 
                {average >= 14 ? " qualifies for official honors." : " is currently being verified."}
              </p>
            </div>
          </div>
        </div>

        {/* PREP ACTION BOX */}
        <div className="bg-[#111C44] p-6 rounded-[25px] shadow-lg text-white relative overflow-hidden group transition-all hover:bg-[#0B132B]">
           <div className="relative z-10">
                <h4 className="text-lg font-black mb-1 uppercase tracking-tighter italic leading-none">Assessment Prep</h4>
                <p className="text-white/40 text-[9px] font-black mb-6 uppercase tracking-widest opacity-80">Official guidance</p>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-md mb-6">
                    <p className="text-[10px] font-bold text-white/80 leading-relaxed uppercase tracking-widest">
                      Request an official transcript copy through the administrative office.
                    </p>
                </div>
                <button className="w-full py-3 bg-white text-[#1B254B] rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all">Request Copy</button>
           </div>
           <div className="absolute -right-8 -bottom-8 opacity-5 font-black text-[120px] italic select-none">G</div>
        </div>
      </aside>

    </div>
  );
};

export default StudentGradeReport;
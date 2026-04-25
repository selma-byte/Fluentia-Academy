import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

const Icons = {
  Search: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
  Calendar: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>,
  Clock: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>,
  Location: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>,
  Info: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
};

const ExamBoard = () => {
  const [selectedExam, setSelectedExam] = useState(null);
  const [examsData, setExamsData] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // 💡 Database Logic - STRICTLY PRESERVED
  // ==========================================
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: student } = await supabase
          .from('students')
          .select('language, level')
          .eq('email', user.email)
          .single();

        if (student && student.language && student.level) {
          const { data: exams, error } = await supabase
            .from('exams')
            .select('*')
            .ilike('language', `%${student.language}%`)
            .eq('level', student.level)
            .order('date', { ascending: true });

          if (exams) {
            const today = new Date();
            const formattedExams = exams.map((ex, idx) => {
              const examDate = new Date(ex.date);
              let status = ex.status || (examDate < today ? "Completed" : "Upcoming");
              let statusColor = status === 'Completed' ? "text-emerald-500 bg-emerald-50" : "text-orange-500 bg-orange-50";

              return {
                id: ex.id || `0${idx + 1}`,
                name: ex.exam_title || ex.name || "Scheduled Exam",
                course: ex.course || `${student.language} ${student.level}`,
                time: ex.time || "10:00 AM",
                date: ex.date ? new Date(ex.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : "TBA",
                location: ex.room || ex.location || "Main Hall",
                status: status,
                statusColor: statusColor
              };
            });
            setExamsData(formattedExams);
          }
        }
      } catch (err) {
        console.error("Error fetching exams:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  const pendingCount = examsData.filter(e => e.status === 'Upcoming').length;

  return (
    <div className="flex-1 flex flex-col xl:flex-row gap-6 animate-fadeIn pr-2 pb-8">
      
      {/* LEFT COLUMN: Main Schedule */}
      <div className="flex-1 flex flex-col space-y-6 min-w-0">
        
        {/* HEADER SECTION - Standardized Typography */}
        <div className="flex flex-col space-y-1 px-1">
          <h2 className="text-xl font-black text-[#1B254B] italic tracking-tight">Examination Board</h2>
          <p className="text-[#A3AED0] text-[13px] font-medium leading-relaxed">
            Monitor upcoming assessment cycles and track your final certification milestones.
          </p>
        </div>

        {/* ASSESSMENT TABLE CARD */}
        <div className="bg-white rounded-[25px] p-6 shadow-sm border border-gray-100 overflow-hidden min-h-[400px]">
          <div className="flex justify-between items-center mb-6 px-2">
            <h3 className="text-sm font-bold text-[#1B254B] uppercase tracking-widest italic">Assessment Schedule</h3>
            <div className="relative group w-52">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A3AED0]"><Icons.Search /></span>
              <input 
                type="text" 
                placeholder="Find session..." 
                className="w-full bg-[#F4F7FE] border-none rounded-full py-2 pl-10 pr-4 text-[11px] font-bold outline-none focus:ring-1 focus:ring-[#4318FF]/20 transition-all shadow-sm"
              />
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center font-black text-[#A3AED0] text-[11px] animate-pulse uppercase tracking-widest">Validating Board...</div>
          ) : examsData.length > 0 ? (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[#A3AED0] text-[10px] font-black uppercase tracking-widest border-b border-gray-50 pb-4">
                    <th className="pb-4 pl-2">Examination</th>
                    <th className="pb-4">Course Path</th>
                    <th className="pb-4 text-center">Schedule</th>
                    <th className="pb-4 text-center">Venue</th>
                    <th className="pb-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {examsData.map((exam) => (
                    <tr key={exam.id} onClick={() => setSelectedExam(exam)} className="hover:bg-gray-50/50 transition-colors group cursor-pointer">
                      <td className="py-6 pl-2">
                        <span className="text-[13px] font-black text-[#1B254B] uppercase group-hover:text-[#4318FF] transition-colors italic leading-none">{exam.name}</span>
                      </td>
                      <td className="py-6">
                        <span className="text-[11px] font-black text-[#707EAE] uppercase tracking-wider">{exam.course}</span>
                      </td>
                      <td className="py-6 text-center">
                        <div className="flex flex-col">
                           <span className="text-[11px] font-black text-[#1B254B] uppercase">{exam.date}</span>
                           <span className="text-[9px] font-bold text-[#A3AED0] uppercase tracking-tighter">{exam.time}</span>
                        </div>
                      </td>
                      <td className="py-6 text-center">
                        <span className="text-[10px] font-black text-[#707EAE] uppercase tracking-widest italic opacity-60">{exam.location}</span>
                      </td>
                      <td className="py-6 text-center">
                        <span className={`inline-flex items-center px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-tight shadow-sm border border-transparent ${exam.statusColor}`}>
                          {exam.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-20 flex flex-col items-center justify-center space-y-4 opacity-40">
                <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-300"><Icons.Info /></div>
                <p className="text-center text-gray-500 font-bold uppercase text-[11px] tracking-widest">No scheduled evaluationsLocalized.</p>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SIDEBAR - exactly 280px matched Sidebar */}
      <aside className="w-full xl:w-[280px] shrink-0 flex flex-col space-y-6">
        
        {/* READINESS CARD */}
        <div className="bg-white p-6 rounded-[30px] shadow-sm border border-gray-100 flex flex-col items-center">
          <h3 className="font-black text-[#1B254B] uppercase tracking-widest text-[10px] mb-8 w-full text-center border-b border-gray-50 pb-3 italic">Academic Readiness</h3>
          
          <div className="w-full space-y-8">
              <div className="text-center relative">
                 <p className="text-[10px] font-black text-[#A3AED0] uppercase mb-1">Prep Score</p>
                 <p className="text-4xl font-black text-[#1B254B] italic tracking-tighter">85%</p>
                 <div className="absolute top-0 right-0 w-2 h-2 bg-[#01B574] rounded-full animate-pulse shadow-lg"></div>
              </div>

              <div className="space-y-3 px-1">
                 <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                    <span className="text-[#A3AED0]">Syllabus</span>
                    <span className="text-[#4318FF]">100%</span>
                 </div>
                 <div className="h-2 w-full bg-[#F4F7FE] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#4318FF] to-[#300bf5] w-full rounded-full shadow-lg"></div>
                 </div>
              </div>

              <div className="p-4 bg-[#F4F7FE] rounded-2xl border border-indigo-50">
                 <p className="text-[10px] font-bold text-[#A3AED0] leading-relaxed uppercase text-center italic">
                   Cycle-specific curriculum modules completed.
                 </p>
              </div>
          </div>
        </div>

        {/* PENDING ACTIONS BOX */}
        <div className="bg-[#111C44] rounded-[30px] p-6 text-white relative overflow-hidden shadow-lg transition-all hover:bg-[#0B132B] group active:scale-95 cursor-pointer">
           <div className="relative z-10">
                <h4 className="text-lg font-black mb-1 uppercase tracking-tighter italic leading-none">Registrar</h4>
                <p className="text-white/40 text-[9px] font-black mb-6 uppercase tracking-widest opacity-80 leading-relaxed">Assistance regarding scheduling or hall entry.</p>
                <button className="w-full py-3 bg-white text-[#1B254B] rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl transition-all hover:opacity-90">
                  Contact Support
                </button>
           </div>
           <div className="absolute -right-8 -bottom-8 opacity-5 font-black text-[120px] italic select-none">E</div>
        </div>
      </aside>

      {/* EXAM TICKET MODAL */}
      {selectedExam && (
        <div className="fixed inset-0 bg-[#0B132B]/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fadeIn" onClick={() => setSelectedExam(null)}>
           <div className="bg-white rounded-[40px] p-10 max-w-md w-full shadow-2xl relative overflow-hidden" onClick={e => e.stopPropagation()}>
              <button onClick={() => setSelectedExam(null)} className="absolute top-6 right-6 text-[#A3AED0] hover:text-[#1B254B] transition-colors font-black text-sm uppercase">✕</button>
              <p className="text-[#4318FF] text-[9px] font-black tracking-widest uppercase mb-2">Verified Ticket</p>
              <h3 className="text-2xl font-black text-[#1B254B] uppercase tracking-tighter mb-8 italic leading-tight">{selectedExam.name}</h3>
              
              <div className="space-y-4 mb-10">
                  <div className="flex justify-between items-center py-4 border-b border-gray-50">
                    <span className="text-[10px] font-black text-[#A3AED0] uppercase">Venue</span>
                    <span className="text-xs font-bold text-[#1B254B]">{selectedExam.location}</span>
                  </div>
                  <div className="flex justify-between items-center py-4 border-b border-gray-50">
                    <span className="text-[10px] font-black text-[#A3AED0] uppercase">Start Time</span>
                    <span className="text-xs font-bold text-[#1B254B]">{selectedExam.time}</span>
                  </div>
                  <div className="flex justify-between items-center py-4">
                    <span className="text-[10px] font-black text-[#A3AED0] uppercase">Assigned Date</span>
                    <span className="text-xs font-black text-[#4318FF]">{selectedExam.date}</span>
                  </div>
              </div>
              <button className="w-full bg-[#111C44] text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl active:scale-95 transition-all">Download Entry Pass</button>
           </div>
        </div>
      )}

    </div>
  );
};

export default ExamBoard;
import React, { useState } from 'react';

const Icons = {
  Search: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
  Calendar: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>,
  Clock: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>,
  Location: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
};

const ExamBoard = () => {
  const [selectedExam, setSelectedExam] = useState(null);

  const exams = [
    { id: "01", name: "English Proficiency – B2", course: "Grammar & Communication", time: "10:00 AM", date: "20 May 2026", location: "Grand Hall A", status: "Upcoming", statusColor: "text-orange-500 bg-orange-50" },
    { id: "02", name: "German Listening Test", course: "A1 Intensive", time: "09:45 AM", date: "15 May 2026", location: "Lab 04", status: "Upcoming", statusColor: "text-orange-500 bg-orange-50" },
    { id: "03", name: "French Writing Cycle", course: "B1 Intermediate", time: "02:00 PM", date: "05 May 2026", location: "Room 12", status: "Completed", statusColor: "text-green-500 bg-green-50" },
    { id: "04", name: "Spanish Oral Exam", course: "A2 Basics", time: "01:00 PM", date: "28 Apr 2026", location: "Virtual Hub 01", status: "Completed", statusColor: "text-green-500 bg-green-50" },
    { id: "05", name: "Vocabulary Assessment", course: "Italian B1", time: "11:15 AM", date: "20 Apr 2026", location: "Room 03", status: "Completed", statusColor: "text-green-500 bg-green-50" },
  ];

  return (
    <div className="flex-1 flex flex-col xl:flex-row gap-10 animate-fadeIn pr-2 pb-12">
      
      {/* LEFT COLUMN */}
      <div className="flex-1 flex flex-col space-y-10 min-w-0">
        
        {/* HERO HEADER */}
        <div className="bg-[#EBE9F1] rounded-[45px] p-12 flex justify-between items-center relative overflow-hidden min-h-[220px] shadow-sm">
          <div className="z-10 w-full md:w-3/5 flex flex-col justify-center">
            <h2 className="text-3xl font-black text-[#1B254B] mb-4 uppercase tracking-tighter leading-none">Examination Board</h2>
            <p className="text-[#1B254B]/60 text-sm mb-10 leading-relaxed font-bold max-w-lg uppercase tracking-widest opacity-70">
              Access your upcoming assessment schedules, review testing protocols, and track your final certification milestones.
            </p>
            <div className="flex items-center gap-4">
                <button className="bg-[#111C44] text-white px-10 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-black active:scale-95 transition-all">
                    Testing Protocols
                </button>
                <div className="bg-white/60 px-5 py-3 rounded-2xl border border-white flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#4318FF] animate-ping"></div>
                    <span className="text-[10px] font-black text-[#1B254B] uppercase tracking-widest">2 Pending Evaluations</span>
                </div>
            </div>
          </div>
          <div className="absolute right-[-20px] bottom-[-20px] opacity-10 text-[240px] font-black pointer-events-none select-none italic">E</div>
        </div>

        {/* EXAM TABLE CONTAINER */}
        <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
            <h3 className="text-xl font-black text-[#1B254B] uppercase tracking-widest">Assessment Schedule</h3>
            <div className="relative w-full md:w-64 group">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold uppercase tracking-widest text-[9px]"><Icons.Search /></span>
              <input 
                type="text" 
                placeholder="Search session..." 
                className="w-full bg-[#F4F7FE] border-none rounded-2xl py-4 pl-14 pr-4 text-xs font-bold text-[#1B254B] outline-none focus:ring-2 focus:ring-[#4318FF]/10 transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="text-[#A3AED0] text-[10px] font-black uppercase tracking-[0.3em] border-b border-gray-100">
                  <th className="pb-6 pl-4">Examination</th>
                  <th className="pb-6">Course Path</th>
                  <th className="pb-6 text-center">Schedule</th>
                  <th className="pb-6 text-center">Hall / Link</th>
                  <th className="pb-6 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {exams.map((exam) => (
                  <tr key={exam.id} onClick={() => setSelectedExam(exam)} className="hover:bg-gray-50/50 transition-all group cursor-pointer">
                    <td className="py-8 pl-4">
                      <p className="text-[15px] font-black text-[#1B254B] uppercase tracking-tight leading-none group-hover:text-[#4318FF] transition-colors">{exam.name}</p>
                    </td>
                    <td className="py-8">
                      <span className="text-xs font-black text-[#707EAE] uppercase tracking-widest">{exam.course}</span>
                    </td>
                    <td className="py-8 text-center">
                      <div className="flex flex-col items-center">
                         <span className="text-[12px] font-black text-[#1B254B] uppercase">{exam.date}</span>
                         <span className="text-[9px] font-bold text-[#A3AED0] uppercase mt-1 tracking-widest">{exam.time}</span>
                      </div>
                    </td>
                    <td className="py-8 text-center">
                      <span className="text-[10px] font-black text-[#707EAE] uppercase tracking-widest italic opacity-60 group-hover:opacity-100 transition-opacity">
                        {exam.location}
                      </span>
                    </td>
                    <td className="py-8 text-center">
                      <span className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] shadow-sm border border-transparent ${exam.statusColor}`}>
                        {exam.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* RIGHT SIDEBAR */}
      <div className="w-full xl:w-[350px] shrink-0 flex flex-col space-y-10">
        <div className="text-right text-[10px] font-black text-[#A3AED0] uppercase tracking-[0.3em]">Tuesday, 14 Apr 2026</div>

        {/* READINESS STATUS */}
        <div className="bg-white p-10 rounded-[45px] shadow-sm border border-gray-50">
          <p className="text-[11px] font-black text-[#1B254B] mb-10 uppercase tracking-[0.3em] border-b border-gray-50 pb-6 text-center">Academic Readiness</p>
          
          <div className="space-y-12">
             <div className="text-center relative">
                <p className="text-[10px] font-black text-[#A3AED0] uppercase mb-2 tracking-[0.2em]">Prep Score</p>
                <p className="text-5xl font-black text-[#1B254B] tracking-tighter italic italic">85%</p>
                <div className="absolute top-0 right-4 w-3 h-3 bg-[#01B574] rounded-full border-2 border-white shadow-lg shadow-green-200"></div>
             </div>

             <div className="space-y-5">
                <div className="flex justify-between items-end px-1">
                   <p className="text-[10px] font-black text-[#1B254B] uppercase tracking-widest">Syllabus Review</p>
                   <span className="text-xs font-black text-[#4318FF]">100%</span>
                </div>
                <div className="h-3 w-full bg-[#F4F7FE] rounded-full overflow-hidden p-0.5">
                  <div className="h-full bg-gradient-to-r from-[#4318FF] to-[#300bf5] w-full rounded-full shadow-[0_0_15px_rgba(67,24,255,0.4)] transition-all duration-[2s]"></div>
                </div>
             </div>

             <div className="p-6 bg-[#F4F7FE] rounded-[32px] border border-[#4318FF]/5 text-center">
                <p className="text-[11px] font-bold text-[#A3AED0] leading-relaxed uppercase tracking-widest">
                   You have completed all curriculum modules required for the upcoming cycle.
                </p>
             </div>
          </div>
        </div>

        {/* SUPPORT CARD */}
        <div className="bg-[#111C44] p-10 rounded-[45px] shadow-2xl text-white relative overflow-hidden group cursor-pointer transition-all hover:bg-black">
           <div className="relative z-10">
                <h4 className="text-2xl font-black mb-2 uppercase tracking-tighter">Registrar</h4>
                <p className="text-white/40 text-[10px] font-black mb-10 uppercase tracking-widest leading-relaxed">Questions regarding examHall entry or scheduling conflicts?</p>
                <button className="w-full py-5 bg-white/10 hover:bg-white/20 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-white/5">Contact Support</button>
           </div>
           <div className="absolute -right-8 -bottom-8 opacity-5 font-black text-[180px] group-hover:scale-110 transition-transform duration-1000">?</div>
        </div>
      </div>

      {/* EXAM HALL DETAIL MODAL */}
      {selectedExam && (
        <div className="fixed inset-0 bg-[#0B132B]/80 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-fadeIn" onClick={() => setSelectedExam(null)}>
           <div className="bg-white rounded-[50px] p-14 max-w-lg w-full shadow-2xl relative overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="absolute top-10 right-10">
                 <button onClick={() => setSelectedExam(null)} className="text-[#A3AED0] hover:text-[#1B254B] transition-colors font-black text-lg p-2 uppercase tracking-tighter">✕</button>
              </div>
              <p className="text-[#4318FF] text-[10px] font-black tracking-[0.4em] uppercase mb-4 font-black">Official Exam Ticket</p>
              <h3 className="text-4xl font-black text-[#1B254B] uppercase tracking-tighter mb-10 leading-none">{selectedExam.name}</h3>
              
              <div className="space-y-8 mb-12">
                 <div className="flex justify-between items-center py-5 border-b border-gray-50 font-black uppercase tracking-widest">
                    <div className="flex items-center gap-3 text-[#A3AED0]"><Icons.Clock /> <span className="text-[10px]">Time</span></div>
                    <span className="text-xs text-[#1B254B]">{selectedExam.time}</span>
                 </div>
                 <div className="flex justify-between items-center py-5 border-b border-gray-100 font-black uppercase tracking-widest">
                    <div className="flex items-center gap-3 text-[#A3AED0]"><Icons.Location /> <span className="text-[10px]">Venue</span></div>
                    <span className="text-xs text-[#1B254B]">{selectedExam.location}</span>
                 </div>
                 <div className="flex justify-between items-center py-5 font-black uppercase tracking-widest">
                    <div className="flex items-center gap-3 text-[#A3AED0]"><Icons.Calendar /> <span className="text-[10px]">Date</span></div>
                    <span className="text-xs text-[#4318FF]">{selectedExam.date}</span>
                 </div>
              </div>
              <button className="w-full bg-[#111C44] text-white py-6 rounded-3xl font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl active:scale-95 transition-all">Download Entry Pass</button>
           </div>
        </div>
      )}

    </div>
  );
};

export default ExamBoard;
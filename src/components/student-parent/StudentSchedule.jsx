import React, { useState } from 'react';

const Icons = {
  Clock: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>,
  Calendar: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>,
  Download: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>,
  User: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>,
  ChevronDown: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"></path></svg>
};

const StudentSchedule = () => {
  const [selectedFilter, setSelectedFilter] = useState('Spanish B1');
  const [activeSession, setActiveSession] = useState(null);

  const timeSlots = ["10:00", "12:00", "14:00", "16:00", "18:00", "20:00"];
  const days = ["MON", "TUE", "WED", "THU", "FRI", "SUN"];

  const scheduleData = [
    { day: "MON", time: "10:00", type: "CLASSE 1", subject: "German A1", teacher: "Instructor Name", color: "border-[#00C566] bg-[#00C566]/10 text-[#00C566]" },
    { day: "MON", time: "16:00", type: "CLASSE 1", subject: "German A1", teacher: "Instructor Name", color: "border-[#00C566] bg-[#00C566]/10 text-[#00C566]" },
    { day: "WED", time: "14:00", type: "LECTURE", subject: "Spanish B2", teacher: "Instructor Name", color: "border-[#4318FF] bg-[#4318FF]/10 text-[#4318FF]" },
    { day: "THU", time: "10:00", type: "LECTURE", subject: "Spanish B1", teacher: "Instructor Name", color: "border-[#4318FF] bg-[#4318FF]/10 text-[#4318FF]" },
    { day: "FRI", time: "14:00", type: "SEMINAR", subject: "French B1", teacher: "Instructor Name", color: "border-[#A301EF] bg-[#A301EF]/10 text-[#A301EF]" },
    { day: "SUN", time: "10:00", type: "CLASSE 1", subject: "German A1", teacher: "Instructor Name", color: "border-[#00C566] bg-[#00C566]/10 text-[#00C566]" }
  ];

  const filteredData = scheduleData.filter(session => session.subject === selectedFilter);

  return (
    <div className="w-full flex flex-col xl:flex-row gap-10 animate-fadeIn pb-12 pr-2">
      
      {/* --- Main Content Area --- */}
      <div className="flex-1 flex flex-col space-y-10 min-w-0">
        
        {/* HERO HEADER - Proportional to Dashboard */}
        <div className="bg-[#EBE9F1] rounded-[45px] p-12 flex justify-between items-center relative overflow-hidden min-h-[220px] shadow-sm">
          <div className="z-10 w-full md:w-3/5">
            <h2 className="text-3xl font-black text-[#1B254B] mb-4 uppercase tracking-tighter leading-none">Academic Timetable</h2>
            <p className="text-[#1B254B]/60 text-sm mb-10 leading-relaxed font-bold max-w-lg uppercase tracking-widest opacity-70">
              Synchronized scheduling for <span className="text-[#4318FF] font-black uppercase tracking-normal">{selectedFilter}</span>. Access virtual links and onsite location data.
            </p>
            <button className="bg-[#111C44] text-white px-10 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-black transition-all">
              Export Monthly View
            </button>
          </div>
          <div className="absolute right-[-20px] bottom-[-20px] opacity-10 text-[240px] font-black pointer-events-none select-none">F</div>
        </div>

        {/* FILTER ROW */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="relative w-full md:w-[380px]">
            <select 
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-100 rounded-2xl px-8 py-4.5 text-xs font-black uppercase tracking-[0.1em] text-[#1B254B] shadow-sm outline-none cursor-pointer focus:ring-2 focus:ring-[#4318FF]/10 transition-all"
            >
              <option value="Spanish B1">Assigned Level - B1 (Intermediate)</option>
              <option value="Spanish B2">Assigned Level - B2 (Upper)</option>
              <option value="German A1">Assigned Level - A1 (Beginner)</option>
              <option value="French B1">Assigned Level - B1 (Intermediate)</option>
            </select>
            <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-[#4318FF]"><Icons.ChevronDown /></div>
          </div>

          <button className="bg-white px-8 py-4.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-[#1B254B] shadow-sm border border-gray-100 hover:bg-gray-50 transition-all flex items-center gap-4">
            <Icons.Download /> Save Offline Copy
          </button>
        </div>

        {/* TIMETABLE GRID - Fixed Width Algorithm */}
        <div className="bg-white rounded-[45px] p-8 shadow-sm border border-gray-50 overflow-hidden">
          <table className="w-full table-fixed border-separate border-spacing-2">
            <thead>
              <tr>
                <th className="p-4 bg-[#F4F7FE]/50 rounded-2xl w-24">
                   <div className="flex justify-center text-[#A3AED0]"><Icons.Clock /></div>
                </th>
                {days.map((day) => (
                  <th key={day} className="p-4 text-center text-[10px] font-black text-[#A3AED0] uppercase tracking-[0.2em] bg-[#F4F7FE]/50 rounded-2xl">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map(time => (
                <tr key={time}>
                  <td className="p-6 text-xs font-black text-[#1B254B] text-center bg-gray-50/40 rounded-2xl uppercase tracking-tighter">
                    {time}
                  </td>
                  {days.map(day => {
                    const session = filteredData.find(s => s.day === day && s.time === time);
                    return (
                      <td key={day + time} className="p-0 h-[130px]">
                        {session ? (
                          <div 
                            onClick={() => setActiveSession(session)}
                            className={`h-full w-full rounded-[24px] border-l-[4px] p-4 ${session.color} flex flex-col justify-between hover:scale-[1.02] hover:shadow-xl transition-all duration-300 cursor-pointer active:scale-95`}
                          >
                            <div className="space-y-1">
                              <div className="text-[8px] font-black uppercase tracking-widest opacity-60 truncate">{session.type}</div>
                              <div className="text-[12px] font-black uppercase tracking-tight leading-tight line-clamp-2">{session.subject}</div>
                            </div>
                            <div className="flex items-center gap-2 text-[9px] font-black opacity-80 mt-2 border-t border-current/10 pt-3 uppercase tracking-widest truncate">
                              <Icons.User /> {session.teacher.split(' ')[0]}
                            </div>
                          </div>
                        ) : (
                          <div className="h-full w-full rounded-[24px] border-2 border-dashed border-gray-50 flex items-center justify-center opacity-30">
                            <div className="w-1 h-1 bg-gray-200 rounded-full"></div>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- Right Sidebar: Precise 380px Width --- */}
      <div className="w-full xl:w-[380px] shrink-0 flex flex-col space-y-10">
        
        <div className="bg-white p-10 rounded-[50px] shadow-sm border border-gray-50">
          <p className="text-[11px] font-black text-[#1B254B] mb-10 uppercase tracking-[0.3em] border-b border-gray-50 pb-6 text-center">Week Overview</p>
          
          <div className="space-y-12">
             <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-[#4318FF] flex items-center justify-center text-white shadow-lg shadow-indigo-100 group-hover:rotate-12 transition-transform duration-500">
                   <Icons.Calendar />
                </div>
                <div>
                   <p className="text-[10px] font-black text-[#A3AED0] uppercase tracking-widest">Current Term</p>
                   <p className="text-sm font-black text-[#1B254B] uppercase tracking-tighter">W14 • APR 2026</p>
                </div>
             </div>

             <div className="p-8 bg-[#F4F7FE] rounded-[35px] border border-[#4318FF]/10 text-center">
                <h4 className="text-[10px] font-black text-[#4318FF] uppercase mb-4 tracking-widest border-b border-[#4318FF]/20 pb-2">Academic Notice</h4>
                <p className="text-[11px] font-bold text-[#A3AED0] leading-relaxed uppercase tracking-tight opacity-80">
                   Schedules are synchronized with GMT+1. Please refresh the portal 5 minutes prior to live modules.
                </p>
             </div>
          </div>
        </div>

        <div className="bg-[#111C44] p-10 rounded-[50px] shadow-2xl text-white relative overflow-hidden group cursor-pointer transition-all hover:bg-black">
           <div className="relative z-10">
                <h4 className="text-xl font-black mb-3 uppercase tracking-tighter leading-tight">Live Portal Access</h4>
                <p className="text-white/40 text-[10px] font-black mb-10 uppercase tracking-widest leading-relaxed">Session links activate only during scheduled timeframes.</p>
                <button className="w-full py-5 bg-white/10 hover:bg-white/20 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-white/5">Launch Session</button>
           </div>
           <div className="absolute -right-8 -bottom-8 opacity-5 font-black text-[160px] group-hover:scale-110 transition-transform duration-1000 italic">F</div>
        </div>

      </div>

      {/* --- Overlay Modal --- */}
      {activeSession && (
        <div className="fixed inset-0 bg-[#0B132B]/80 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-fadeIn" onClick={() => setActiveSession(null)}>
           <div className="bg-white rounded-[50px] p-14 max-w-lg w-full shadow-2xl relative overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="absolute top-10 right-10">
                 <button onClick={() => setActiveSession(null)} className="text-[#A3AED0] hover:text-[#1B254B] transition-colors font-black text-lg p-2 uppercase tracking-tighter">✕</button>
              </div>
              <p className="text-[#4318FF] text-[10px] font-black tracking-[0.4em] uppercase mb-4 font-black">Module Registration</p>
              <h3 className="text-4xl font-black text-[#1B254B] uppercase tracking-tighter mb-10 leading-none">{activeSession.subject}</h3>
              
              <div className="space-y-8 mb-12">
                 <div className="flex justify-between items-center py-5 border-b border-gray-50 font-black uppercase tracking-widest">
                    <span className="text-[10px] text-[#A3AED0]">Type</span>
                    <span className="text-xs text-[#1B254B]">{activeSession.type}</span>
                 </div>
                 <div className="flex justify-between items-center py-5 border-b border-gray-100 font-black uppercase tracking-widest">
                    <span className="text-[10px] text-[#A3AED0]">Certified Lecturer</span>
                    <span className="text-xs text-[#1B254B]">{activeSession.teacher}</span>
                 </div>
                 <div className="flex justify-between items-center py-5 font-black uppercase tracking-widest">
                    <span className="text-[10px] text-[#A3AED0]">Timeframe</span>
                    <span className="text-xs text-[#4318FF]">{activeSession.day} • {activeSession.time}</span>
                 </div>
              </div>
              <button className="w-full bg-[#111C44] text-white py-6 rounded-3xl font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl active:scale-95 transition-all">Go to Virtual Room</button>
           </div>
        </div>
      )}
    </div>
  );
};

export default StudentSchedule;
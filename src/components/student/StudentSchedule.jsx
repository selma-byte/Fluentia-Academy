import React, { useState } from 'react';

const StudentSchedule = () => {
  // --- Filtering State ---
  // Combined Language and Level into one selection
  const [selectedFilter, setSelectedFilter] = useState('Spanish B1');

  const timeSlots = ["10:00", "12:00", "2:00", "4:00", "6:00", "8:00"];
  const days = ["MON", "TUE", "WED", "THU", "FRI", "SUN"];

  // --- Data with Combined Keys for Filtering ---
  const scheduleData = [
    { day: "MON", time: "10:00", type: "CLASSE 1", subject: "German A1", teacher: "J. Lee", color: "border-[#00C566] bg-[#00C566]/10 text-[#00C566]" },
    { day: "MON", time: "4:00", time: "4:00", type: "CLASSE 1", subject: "German A1", teacher: "J. Lee", color: "border-[#00C566] bg-[#00C566]/10 text-[#00C566]" },
    { day: "WED", time: "2:00", type: "LECTURE", subject: "Spanish B2", teacher: "Er. Rahul", color: "border-[#4318FF] bg-[#4318FF]/10 text-[#4318FF]" },
    { day: "THU", time: "10:00", type: "LECTURE", subject: "Spanish B1", teacher: "Ar. Collins", color: "border-[#4318FF] bg-[#4318FF]/10 text-[#4318FF]" },
    { day: "FRI", time: "2:00", type: "SEMINAR", subject: "French B1", teacher: "Mme. Dupont", color: "border-[#A301EF] bg-[#A301EF]/10 text-[#A301EF]" },
    { day: "SUN", time: "10:00", type: "CLASSE 1", subject: "German A1", teacher: "J. Lee", color: "border-[#00C566] bg-[#00C566]/10 text-[#00C566]" }
  ];

  // Filter Logic: Only show sessions that match the selected "Subject Level"
  const filteredData = scheduleData.filter(session => session.subject === selectedFilter);

  return (
    <div className="flex-1 flex flex-col xl:flex-row gap-6 animate-fadeIn">
      {/* --- Main Content --- */}
      <div className="flex-1 flex flex-col space-y-6">
        
        {/* Unified Hero Card */}
        <div className="bg-[#EBE9F1] rounded-[30px] p-8 flex justify-between items-center relative overflow-hidden h-[180px] shadow-sm">
          <div className="z-10 w-2/3">
            <h2 className="text-2xl font-bold text-[#1B254B] mb-2 leading-tight">Your Weekly Schedule</h2>
            <p className="text-[#A3AED0] text-[13px] mb-5 leading-relaxed">
              Viewing schedule for <span className="text-[#4318FF] font-bold">{selectedFilter}</span>. Access your virtual classroom and materials.
            </p>
            <button className="bg-[#111C44] text-white px-5 py-2 rounded-lg text-sm font-bold flex items-center hover:bg-black transition-all">
              Full Overview <span className="ml-2">→</span>
            </button>
          </div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/40 p-4 rounded-full backdrop-blur-sm border border-white/50">
             <span className="text-3xl">📅</span>
          </div>
        </div>

        {/* Unified Filter Row */}
        <div className="flex items-center justify-between">
          <div className="flex bg-white px-6 py-4 rounded-[20px] shadow-sm border border-gray-100 min-w-[300px]">
            <div className="flex flex-col w-full">
              <label className="text-[10px] font-bold text-[#4318FF] uppercase mb-1 tracking-widest">Selected Course & Level</label>
              <select 
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="text-sm font-bold text-[#1B254B] bg-transparent outline-none cursor-pointer appearance-none"
              >
                <option value="Spanish B1">Spanish B1 - Intermediate</option>
                <option value="Spanish B2">Spanish B2 - Upper Intermediate</option>
                <option value="German A1">German A1 - Beginner</option>
                <option value="French B1">French B1 - Intermediate</option>
              </select>
            </div>
          </div>
          
          <div className="flex gap-3">
             <button className="bg-white border border-gray-200 text-[#1B254B] px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-gray-50 transition-all">
               📥 Export PDF
             </button>
             <button className="bg-[#4318FF] text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-indigo-100 hover:bg-[#3311CC] transition-all">
               ✏️ Edit
             </button>
          </div>
        </div>

        {/* Timetable Grid */}
        <div className="bg-white rounded-[25px] p-6 shadow-sm border border-gray-100 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-4 border-r border-gray-50 w-20">
                   <span className="text-gray-400">🕒</span>
                </th>
                {days.map((day, idx) => (
                  <th key={day} className="p-4 text-center border-b border-gray-50">
                    <div className="text-[10px] font-bold text-[#A3AED0] uppercase">{day}</div>
                    <div className="text-sm font-bold text-[#1B254B]">1{idx + 4} Apr</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map(time => (
                <tr key={time}>
                  <td className="p-6 text-xs font-bold text-[#1B254B] border-r border-gray-50 text-center">
                    {time}
                  </td>
                  {days.map(day => {
                    const session = filteredData.find(s => s.day === day && s.time === time);
                    return (
                      <td key={day + time} className="p-2 border-b border-r border-gray-50 min-w-[140px] h-[120px] align-top">
                        {session ? (
                          <div className={`h-full w-full rounded-xl border-l-[4px] p-3 ${session.color} flex flex-col justify-between hover:scale-[1.02] transition-transform cursor-pointer shadow-sm`}>
                            <div>
                              <div className="text-[9px] font-bold uppercase truncate opacity-80">{session.type}</div>
                              <div className="text-[11px] font-bold leading-tight mt-1">{session.subject}</div>
                            </div>
                            <div className="text-[10px] opacity-90 font-medium">👤 {session.teacher}</div>
                          </div>
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <div className="w-1 h-1 bg-gray-100 rounded-full"></div>
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

      {/* --- Right Sidebar: Matches Dashboard exactly --- */}
      <div className="w-full xl:w-[320px] shrink-0 flex flex-col space-y-6">
        <div className="text-right text-xs font-bold text-[#A3AED0]">Tuesday, 14 Apr 2026</div>

        {/* Semester Progress */}
        <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-50">
          <p className="text-[10px] font-bold text-[#1B254B] mb-2 uppercase tracking-widest">Semester Progress</p>
          <div className="h-2 w-full bg-[#F4F7FE] rounded-full overflow-hidden">
            <div className="h-full bg-[#4318FF] w-[37%] rounded-full shadow-[0_0_8px_rgba(67,24,255,0.3)]"></div>
          </div>
        </div>

        {/* Calendar Widget */}
        <div className="bg-white border border-gray-50 rounded-[20px] p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4 font-bold text-sm text-[#1B254B]">
            <button className="hover:text-[#4318FF]">{'<'}</button> 
            <span>April 2026</span> 
            <button className="hover:text-[#4318FF]">{'>'}</button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-[#A3AED0] font-bold mb-3 uppercase">
            {['Mo','Tu','We','Th','Fr','Sa','Su'].map(d => <div key={d}>{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-y-2 text-center text-[13px] font-bold text-[#1B254B]">
            {[...Array(30)].map((_, i) => (
              <div 
                key={i} 
                className={i+1 === 12 
                  ? "bg-[#4318FF] text-white rounded-full w-7 h-7 flex items-center justify-center mx-auto shadow-md" 
                  : "py-1 hover:text-[#4318FF] cursor-pointer"
                }
              >
                {i+1}
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Legend */}
        <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-50">
          <h4 className="text-[11px] font-bold text-[#1B254B] uppercase mb-4 tracking-wider">Status</h4>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#4318FF]"></div>
              <span className="text-xs font-bold text-[#1B254B]">Active Course</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl">
              <p className="text-[10px] text-[#A3AED0] leading-relaxed">
                You are currently viewing classes specifically for <strong>{selectedFilter}</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSchedule;
import React from 'react';

const ExamBoard = () => {
  // Mock data for upcoming and past exams
  const exams = [
    { id: "01", name: "English Final Exam", course: "English Grammar B2", time: "10:00 AM", date: "20 May 2026", location: "Room 12", status: "Upcoming", statusColor: "text-orange-500 bg-orange-50 border-orange-100" },
    { id: "02", name: "Listening Proficiency", course: "German A1", time: "09:45 AM", date: "15 May 2026", location: "Language Lab 1", status: "Upcoming", statusColor: "text-orange-500 bg-orange-50 border-orange-100" },
    { id: "03", name: "Grammar & Writing Test", course: "French B1", time: "02:00 PM", date: "05 May 2026", location: "Room 4", status: "Completed", statusColor: "text-green-500 bg-green-50 border-green-100" },
    { id: "04", name: "Oral Expression Test", course: "Spanish A2", time: "01:00 PM", date: "28 Apr 2026", location: "Online (Zoom)", status: "Completed", statusColor: "text-green-500 bg-green-50 border-green-100" },
    { id: "05", name: "Vocabulary Quiz - Unit 4", course: "Italian B1", time: "11:15 AM", date: "20 Apr 2026", location: "Room 3", status: "Completed", statusColor: "text-green-500 bg-green-50 border-green-100" },
  ];

  return (
    <div className="flex-1 flex flex-col xl:flex-row gap-6 animate-fadeIn">
      
      {/* LEFT SIDE: Exam Content */}
      <div className="flex-1 min-w-0 space-y-6">
        
        {/* Header Card (Exact Dashboard Header Match) */}
        <div className="bg-[#EBE9F1] rounded-[30px] p-8 flex justify-between items-center relative overflow-hidden h-[180px] shadow-sm">
          <div className="z-10 w-2/3">
            <h1 className="text-2xl font-bold text-[#1B254B] mb-2 leading-tight">Exam Board</h1>
            <p className="text-[#A3AED0] text-[13px] mb-5 leading-relaxed max-w-sm">
              View your upcoming exams, schedules, and past results. Stay prepared and track your testing milestones.
            </p>
            <div className="flex items-center gap-2 text-[#4318FF] font-bold text-xs bg-white/40 w-fit px-3 py-1.5 rounded-lg">
              <span className="animate-pulse text-[10px]">●</span> 2 Exams Scheduled this week
            </div>
          </div>
          <div className="absolute right-4 top-0 bottom-0 flex items-center justify-center text-6xl opacity-20 lg:opacity-100">
            📅
          </div>
        </div>

        {/* Main Exam Schedule Table (Exact Dashboard Table Style) */}
        <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h3 className="text-lg font-bold text-[#1B254B]">Exam Schedule</h3>
            <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  placeholder="Search by Course..." 
                  className="bg-[#F4F7FE] border-none rounded-full text-xs px-4 py-2 w-full sm:w-48 outline-none focus:ring-1 focus:ring-[#4318FF]"
                />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/50 text-[#A3AED0] text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3 pl-4">Exam Name</th>
                  <th className="py-3">Course</th>
                  <th className="py-3">Time</th>
                  <th className="py-3">Date</th>
                  <th className="py-3">Location</th>
                  <th className="py-3 pr-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {exams.map((exam) => (
                  <tr key={exam.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="py-4 pl-4 font-bold text-[#1B254B]">{exam.name}</td>
                    <td className="py-4 text-[#A3AED0] font-medium">{exam.course}</td>
                    <td className="py-4 text-[#1B254B] font-bold">{exam.time}</td>
                    <td className="py-4">
                       <span className="bg-[#F4F7FE] text-[#1B254B] px-2.5 py-1 rounded-md font-bold text-[11px] whitespace-nowrap">{exam.date}</span>
                    </td>
                    <td className="py-4 text-[#A3AED0] text-xs italic">{exam.location}</td>
                    <td className="py-4 pr-4 text-right">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${exam.statusColor.replace('border-', 'border-')}`}>
                        {exam.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 flex justify-between items-center">
             <span className="text-[11px] font-bold text-[#A3AED0]">5 Exams listed</span>
             <div className="flex gap-2">
                <button className="p-2 bg-[#F4F7FE] text-[#1B254B] rounded-lg text-xs font-bold hover:bg-gray-100 transition-all">{'<'}</button>
                <button className="p-2 bg-[#F4F7FE] text-[#1B254B] rounded-lg text-xs font-bold hover:bg-gray-100 transition-all">{'>'}</button>
             </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDEBAR: (Exact 320px Width and Calendar Style) */}
      <div className="w-full xl:w-[320px] shrink-0 space-y-6">
        
        {/* Exam Readiness Indicator (Matches Semester Progress Style) */}
        <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-50">
          <div className="flex justify-between items-center mb-3">
            <p className="text-[10px] font-bold text-[#1B254B] uppercase tracking-widest">Exam Readiness</p>
            <span className="text-xs font-bold text-green-500">85%</span>
          </div>
          <div className="h-2 w-full bg-[#F4F7FE] rounded-full overflow-hidden">
             <div className="h-full bg-green-500 w-[85%] rounded-full shadow-[0_0_8px_rgba(34,197,94,0.3)]"></div>
          </div>
          <p className="mt-4 text-[11px] text-[#A3AED0] font-medium leading-relaxed">
            Based on your attendance and homework scores, you are well-prepared for your tests.
          </p>
        </div>

        {/* Small Calendar Widget (EXACT Match to Dashboard Calendar) */}
        <div className="bg-white border border-gray-50 rounded-[20px] p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4 font-bold text-sm">
              <button className="hover:text-[#4318FF]">{'<'}</button> 
              <span>April 2026</span> 
              <button className="hover:text-[#4318FF]">{'>'}</button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-[#A3AED0] font-bold mb-3 uppercase">
            {['Mo','Tu','We','Th','Fr','Sa','Su'].map(d => <div key={d}>{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-y-2 text-center text-[13px] font-bold">
            {[...Array(30)].map((_, i) => {
              const day = i + 1;
              const isToday = day === 14;
              const hasExam = day === 20 || day === 15;
              return (
                <div key={i} className="relative flex items-center justify-center">
                  <div className={`w-7 h-7 flex items-center justify-center mx-auto rounded-full transition-all
                    ${isToday ? "bg-[#4318FF] text-white" : ""}
                    ${hasExam && !isToday ? "text-[#4318FF] font-black underline decoration-2 underline-offset-4" : ""}
                    ${!isToday && !hasExam ? "py-1" : ""}
                  `}>
                    {day}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Support Card (Matches sidebar tool cards) */}
        <div className="bg-[#4318FF] rounded-[20px] p-6 text-white shadow-lg relative overflow-hidden group cursor-pointer">
           <div className="relative z-10">
              <h4 className="text-sm font-bold mb-2">Exam Support</h4>
              <p className="text-[11px] opacity-80 leading-relaxed mb-4">Need to reschedule or have a technical issue with an online exam?</p>
              <button className="w-full bg-white text-[#4318FF] py-2 rounded-lg text-xs font-bold hover:bg-opacity-90 transition-all">Contact Registrar</button>
           </div>
           <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-white/10 rounded-full"></div>
        </div>
      </div>

    </div>
  );
};

export default ExamBoard;
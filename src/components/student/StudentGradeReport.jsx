import React, { useState } from 'react';

const StudentGradeReport = () => {
  // Mock data for student grades
  const grades = [
    { id: "01", course: "English Grammar", level: "B2", date: "20 May 2024", grade: "18/20", status: "Excellent", statusColor: "text-green-500 bg-green-50" },
    { id: "02", course: "French Intermediate", level: "B1", date: "15 May 2024", grade: "14/20", status: "Good", statusColor: "text-blue-500 bg-blue-50" },
    { id: "03", course: "Spanish Basics", level: "A2", date: "10 May 2024", grade: "12/20", status: "Almost Good", statusColor: "text-purple-500 bg-purple-50" },
    { id: "04", course: "German Beginner", level: "A1", date: "02 May 2024", grade: "08/20", status: "Needs Work", statusColor: "text-orange-500 bg-orange-50" },
    { id: "05", course: "Italian Conversation", level: "B1", date: "28 Apr 2024", grade: "19/20", status: "Excellent", statusColor: "text-green-500 bg-green-50" },
  ];

  return (
    <div className="flex-1 flex flex-col xl:flex-row gap-6 animate-fadeIn">
      
      {/* LEFT SIDE: Grade Report Content */}
      <div className="flex-1 flex flex-col space-y-6">
        
        {/* Sync with Dashboard Hero Card Style */}
        <div className="bg-[#EBE9F1] rounded-[30px] p-8 flex justify-between items-center relative overflow-hidden h-[180px] shadow-sm">
          <div className="z-10 w-2/3">
            <h2 className="text-2xl font-bold text-[#1B254B] mb-2 leading-tight">Your Academic Report</h2>
            <p className="text-[#A3AED0] text-[13px] mb-5 leading-relaxed">
              Great job this semester! You've maintained a high average. Your detailed performance metrics are below.
            </p>
            <button className="bg-[#111C44] text-white px-5 py-2 rounded-lg text-sm font-bold flex items-center hover:bg-black transition-all">
              Full Breakdown <span className="ml-2">→</span>
            </button>
          </div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/40 p-4 rounded-full backdrop-blur-sm border border-white/50">
             <span className="text-3xl">📊</span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4">
           <div className="bg-white p-5 rounded-[20px] shadow-sm border border-gray-50 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase font-bold text-[#A3AED0] tracking-widest">Overall GPA</p>
                <p className="text-xl font-black text-[#4318FF]">16.5 / 20</p>
              </div>
              <div className="w-10 h-10 bg-[#F4F7FE] rounded-lg flex items-center justify-center text-[#4318FF]">📈</div>
           </div>
           <div className="bg-white p-5 rounded-[20px] shadow-sm border border-gray-50 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase font-bold text-[#A3AED0] tracking-widest">Class Rank</p>
                <p className="text-xl font-black text-[#1B254B]">4th Place</p>
              </div>
              <div className="w-10 h-10 bg-[#F4F7FE] rounded-lg flex items-center justify-center text-orange-400">🏆</div>
           </div>
        </div>

        {/* Grades Table Section */}
        <div className="bg-white rounded-[25px] p-6 shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex justify-between items-center mb-6 px-2">
            <h3 className="text-sm font-bold text-[#1B254B] uppercase tracking-wider">📝 Detailed Results</h3>
            <select className="bg-[#F4F7FE] border-none rounded-lg text-[10px] font-bold p-2 text-[#4318FF] outline-none cursor-pointer">
               <option>Spring 2026</option>
               <option>Winter 2025</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#F4F7FE]/30 text-[#A3AED0] text-[10px] uppercase tracking-widest font-bold">
                <tr>
                  <th className="py-4 px-4 rounded-l-xl">No</th>
                  <th className="py-4">Course</th>
                  <th className="py-4">Level</th>
                  <th className="py-4">Grade</th>
                  <th className="py-4">Status</th>
                  <th className="py-4 px-4 rounded-r-xl text-right">Details</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {grades.map((item) => (
                  <tr key={item.id} className="border-b border-gray-50 last:border-0 hover:bg-[#F4F7FE]/40 transition-all group">
                    <td className="py-5 px-4 text-[#A3AED0] font-bold text-xs">{item.id}</td>
                    <td className="py-5 font-bold text-[#1B254B] text-[13px]">{item.course}</td>
                    <td className="py-5 text-[#A3AED0] font-bold text-[11px]">{item.level}</td>
                    <td className="py-5 font-black text-[#1B254B] text-base">{item.grade}</td>
                    <td className="py-5">
                      <span className={`text-[9px] font-black px-3 py-1 rounded-md ${item.statusColor}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-5 px-4 text-right">
                        <button className="w-7 h-7 inline-flex items-center justify-center bg-gray-50 rounded-lg text-[#4318FF] group-hover:bg-[#4318FF] group-hover:text-white transition-all">
                            <span className="text-sm font-bold">↗</span>
                        </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* RIGHT SIDEBAR: Synchronized with Dashboard Components */}
      <div className="w-full xl:w-[320px] shrink-0 flex flex-col space-y-6">
        <div className="text-right text-xs font-bold text-[#A3AED0]">Tuesday, 14 Apr 2026</div>

        {/* Matches Dashboard Progress Card exactly */}
        <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-50">
          <p className="text-[10px] font-bold text-[#1B254B] mb-2 uppercase tracking-widest">Semester Progress</p>
          <div className="h-2 w-full bg-[#F4F7FE] rounded-full overflow-hidden">
            <div className="h-full bg-[#4318FF] w-[37%] rounded-full shadow-[0_0_8px_rgba(67,24,255,0.3)]"></div>
          </div>
        </div>

        {/* Calendar Widget (Matched Size and Font Hierarchy) */}
        <div className="bg-white border border-gray-50 rounded-[20px] p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4 font-bold text-sm text-[#1B254B]">
            <button className="hover:text-[#4318FF] transition-colors">{'<'}</button> 
            <span>April 2026</span> 
            <button className="hover:text-[#4318FF] transition-colors">{'>'}</button>
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

        {/* Academic Note Section */}
        <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-50">
          <h4 className="text-[11px] font-bold text-[#1B254B] uppercase mb-4 tracking-wider">Academic Notice</h4>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"></div>
              <span className="text-[11px] font-bold text-[#1B254B]">Dean's List Eligibility</span>
            </div>
            <div className="p-3 bg-[#F4F7FE] rounded-xl border border-gray-100">
              <p className="text-[10px] text-[#A3AED0] leading-relaxed">
                Your current GPA of <span className="font-bold text-[#4318FF]">16.5</span> qualifies you for the academic excellence award this semester.
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default StudentGradeReport;
import React from 'react';

const StudentAttendance = () => {
  // Mock data for the attendance records
  const attendanceRecords = [
    { id: '01', course: 'English Grammar B2', language: 'English', date: '1 Mar 2022', status: 'Present', statusCol: 'text-green-500 bg-green-50' },
    { id: '02', course: 'French Conversation A2', language: 'French', date: '13 Mar 2022', status: 'Present', statusCol: 'text-green-500 bg-green-50' },
    { id: '03', course: 'Spanish Basics A1', language: 'Spanish', date: '22 Mar 2022', status: 'Absent', statusCol: 'text-red-500 bg-red-50' },
    { id: '04', course: 'German Intensive B1', language: 'German', date: '23 Mar 2022', status: 'Present', statusCol: 'text-green-500 bg-green-50' },
    { id: '05', course: 'Italian Conversation A2', language: 'Italian', date: '25 Mar 2022', status: 'Present', statusCol: 'text-green-500 bg-green-50' },
    { id: '06', course: 'English Speaking Skills', language: 'English', date: '26 Mar 2022', status: 'Absent', statusCol: 'text-red-500 bg-red-50' },
    { id: '07', course: 'French Writing Workshop', language: 'French', date: '30 Mar 2022', status: 'Present', statusCol: 'text-green-500 bg-green-50' },
  ];

  const stats = [
    { label: 'Attendance', value: '80%', icon: '👥', bg: 'bg-[#E3DAFF]' },
    { label: 'Task Completed', value: '258+', icon: '📝', bg: 'bg-[#E1F5FE]' },
    { label: 'In Progress', value: '64%', icon: '⚙️', bg: 'bg-[#FFF4E5]' },
    { label: 'Points', value: '245', icon: '🎗️', bg: 'bg-[#FFE5F1]' },
  ];

  return (
    <div className="flex-1 flex flex-col xl:flex-row gap-6 animate-fadeIn">
      {/* LEFT COLUMN */}
      <div className="flex-1 flex flex-col space-y-6">
        {/* MATCHED DASHBOARD HEADER */}
        <div className="bg-[#EBE9F1] rounded-[30px] p-8 flex justify-between items-center relative overflow-hidden h-[180px] shadow-sm">
          <div className="z-10 w-2/3">
            <h2 className="text-2xl font-bold text-[#1B254B] mb-2 leading-tight">Attendance Overview</h2>
            <p className="text-[#A3AED0] text-[13px] mb-5 leading-relaxed max-w-sm">
              Track and manage your presence across all enrolled language courses to ensure academic success.
            </p>
          </div>
          <div className="absolute right-8 top-0 bottom-0 flex items-center justify-center text-6xl">📊</div>
        </div>

        {/* ATTENDANCE RECORD TABLE - Sizing matched to Exam Board */}
        <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-[#1B254B]">📝 Attendance Record</h3>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search class..." 
                className="bg-[#F4F7FE] border-none rounded-full py-2 pl-4 pr-4 text-[11px] w-40 outline-none focus:ring-1 focus:ring-[#4318FF]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[#A3AED0] text-[11px] uppercase tracking-wider border-b border-gray-50">
                  <th className="py-3 pl-4 font-bold">#</th>
                  <th className="py-3 font-bold">Course Name</th>
                  <th className="py-3 font-bold text-center">Language</th>
                  <th className="py-3 font-bold">Date</th>
                  <th className="py-3 font-bold text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {attendanceRecords.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="py-4 pl-4 text-[13px] font-bold text-[#A3AED0]">{item.id}</td>
                    <td className="py-4">
                      <span className="text-sm font-bold text-[#1B254B]">{item.course}</span>
                    </td>
                    <td className="py-4 text-center">
                      <span className="text-[13px] font-medium text-[#A3AED0]">{item.language}</span>
                    </td>
                    <td className="py-4">
                      <span className="text-[13px] font-medium text-[#A3AED0]">{item.date}</span>
                    </td>
                    <td className="py-4 text-center">
                      <span className={`inline-flex items-center justify-center px-4 py-1 rounded-full text-[10px] font-bold min-w-[85px] ${item.statusCol}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-50">
             <button className="text-[10px] font-bold text-[#A3AED0] uppercase tracking-widest hover:text-[#4318FF]">Prev</button>
             <span className="text-[11px] font-bold text-[#A3AED0]">Page 1 of 12</span>
             <button className="text-[10px] font-bold text-[#A3AED0] uppercase tracking-widest hover:text-[#4318FF]">Next</button>
          </div>
        </div>
      </div>

      {/* RIGHT SIDEBAR - Sizing exactly as Dashboard */}
      <div className="w-full xl:w-[320px] shrink-0 flex flex-col space-y-6">
        <div className="text-right text-xs font-bold text-[#A3AED0]">Tuesday, 14 Apr 2026</div>

        {/* STAT CARDS */}
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white p-4 rounded-[20px] shadow-sm border border-gray-50 flex flex-col items-center justify-center text-center">
              <div className={`w-10 h-10 rounded-full ${stat.bg} flex items-center justify-center text-lg mb-2`}>
                {stat.icon}
              </div>
              <p className="text-lg font-bold text-[#1B254B]">{stat.value}</p>
              <p className="text-[9px] text-[#A3AED0] font-bold uppercase tracking-tight">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* CHART SECTION */}
        <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-100">
           <h3 className="font-bold text-[#1B254B] mb-4">Total Presence</h3>
           <div className="relative flex items-center justify-center py-2">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle cx="64" cy="64" r="54" stroke="#F4F7FE" strokeWidth="12" fill="transparent" />
                <circle 
                  cx="64" cy="64" r="54" 
                  stroke="#4318FF" strokeWidth="12" 
                  fill="transparent" 
                  strokeDasharray="339.29" 
                  strokeDashoffset="67.8" // 80%
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                 <span className="text-2xl font-bold text-[#1B254B]">80%</span>
              </div>
           </div>
           <div className="flex justify-center space-x-4 mt-6">
              <div className="flex items-center space-x-1.5">
                 <div className="w-2 h-2 rounded-full bg-[#4318FF]"></div>
                 <span className="text-[10px] text-[#A3AED0] font-bold uppercase">Present</span>
              </div>
              <div className="flex items-center space-x-1.5">
                 <div className="w-2 h-2 rounded-full bg-red-400"></div>
                 <span className="text-[10px] text-[#A3AED0] font-bold uppercase">Absent</span>
              </div>
           </div>
        </div>

        {/* MINI CALENDAR */}
        <div className="bg-white border border-gray-50 rounded-[20px] p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4 font-bold text-sm text-[#1B254B]">
              <button>{'<'}</button> <span>April 2026</span> <button>{'>'}</button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-[9px] text-[#A3AED0] font-bold mb-3 uppercase">
            {['Mo','Tu','We','Th','Fr','Sa','Su'].map(d => <div key={d}>{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-y-2 text-center text-[12px] font-bold">
            {[...Array(30)].map((_, i) => (
              <div key={i} className={i+1 === 14 ? "bg-[#4318FF] text-white rounded-full w-7 h-7 flex items-center justify-center mx-auto" : "py-1 text-[#1B254B]"}>{i+1}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAttendance;
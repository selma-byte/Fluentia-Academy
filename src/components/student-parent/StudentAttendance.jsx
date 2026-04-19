import React from 'react';

const Icons = {
  Search: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
  User: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
  Check: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>,
  Settings: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>,
  Award: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
};

const StudentAttendance = () => {
  const attendanceRecords = [
    { id: '01', course: 'English Grammar B2', language: 'English', date: '1 Mar 2026', status: 'Present', statusCol: 'text-green-500 bg-green-50' },
    { id: '02', course: 'French Conversation A2', language: 'French', date: '13 Mar 2026', status: 'Present', statusCol: 'text-green-500 bg-green-50' },
    { id: '03', course: 'Spanish Basics A1', language: 'Spanish', date: '22 Mar 2026', status: 'Absent', statusCol: 'text-red-500 bg-red-50' },
    { id: '04', course: 'German Intensive B1', language: 'German', date: '23 Mar 2026', status: 'Present', statusCol: 'text-green-500 bg-green-50' },
    { id: '05', course: 'Italian Conversation A2', language: 'Italian', date: '25 Mar 2026', status: 'Present', statusCol: 'text-green-500 bg-green-50' },
    { id: '06', course: 'English Speaking Skills', language: 'English', date: '26 Mar 2026', status: 'Absent', statusCol: 'text-red-500 bg-red-50' },
    { id: '07', course: 'French Writing Workshop', language: 'French', date: '30 Mar 2026', status: 'Present', statusCol: 'text-green-500 bg-green-50' },
  ];

  const stats = [
    { label: 'Attendance', value: '80%', icon: <Icons.User />, bg: 'bg-[#E3DAFF] text-[#4318FF]' },
    { label: 'Task Completed', value: '258+', icon: <Icons.Check />, bg: 'bg-[#E1F5FE] text-[#01B574]' },
    { label: 'In Progress', value: '64%', icon: <Icons.Settings />, bg: 'bg-[#FFF4E5] text-[#FFB547]' },
    { label: 'Points', value: '245', icon: <Icons.Award />, bg: 'bg-[#FFE5F1] text-[#E31A1A]' },
  ];

  return (
    <div className="flex-1 flex flex-col xl:flex-row gap-10 animate-fadeIn pr-2 pb-10">
      {/* LEFT COLUMN */}
      <div className="flex-1 flex flex-col space-y-10 min-w-0">
        {/* HEADER HERO */}
        <div className="bg-[#EBE9F1] rounded-[45px] p-12 flex justify-between items-center relative overflow-hidden min-h-[220px] shadow-sm">
          <div className="z-10 w-full md:w-3/5">
            <h2 className="text-3xl font-black text-[#1B254B] mb-4 uppercase tracking-tighter">Attendance Overview</h2>
            <p className="text-[#1B254B]/60 text-sm mb-8 leading-relaxed font-bold uppercase tracking-widest opacity-70">
              Monitor your session presence and manage course eligibility through real-time academic tracking.
            </p>
          </div>
          <div className="absolute right-[-20px] bottom-[-20px] opacity-10 text-[220px] font-black pointer-events-none select-none italic">A</div>
        </div>

        {/* ATTENDANCE TABLE */}
        <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-50 overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
            <h3 className="text-xl font-black text-[#1B254B] uppercase tracking-widest leading-none">Attendance Record</h3>
            <div className="relative w-full md:w-64 group">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#4318FF] transition-colors"><Icons.Search /></span>
              <input 
                type="text" 
                placeholder="Search module..." 
                className="w-full bg-[#F4F7FE] border-none rounded-2xl py-3.5 pl-14 pr-4 text-xs font-bold text-[#1B254B] outline-none focus:ring-2 focus:ring-[#4318FF]/10 transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="text-[#A3AED0] text-[10px] font-black uppercase tracking-[0.2em] border-b border-gray-100">
                  <th className="pb-6 pl-4">ID</th>
                  <th className="pb-6 uppercase">Course Module</th>
                  <th className="pb-6 text-center">Language</th>
                  <th className="pb-6 text-center">Date</th>
                  <th className="pb-6 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {attendanceRecords.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-all group">
                    <td className="py-6 pl-4 text-xs font-black text-[#A3AED0]">{item.id}</td>
                    <td className="py-6">
                      <span className="text-[14px] font-black text-[#1B254B] uppercase tracking-tight leading-none">{item.course}</span>
                    </td>
                    <td className="py-6 text-center">
                      <span className="text-xs font-black text-[#707EAE] uppercase tracking-widest">{item.language}</span>
                    </td>
                    <td className="py-6 text-center">
                      <span className="text-xs font-bold text-[#707EAE] uppercase tracking-widest">{item.date}</span>
                    </td>
                    <td className="py-6 text-center">
                      <span className={`inline-flex items-center gap-2 px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border border-transparent shadow-sm ${item.statusCol}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${item.status === 'Present' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="flex justify-between items-center mt-10 pt-8 border-t border-gray-50">
             <button className="px-6 py-3 rounded-xl text-[10px] font-black text-[#A3AED0] uppercase tracking-widest hover:bg-[#F4F7FE] hover:text-[#4318FF] transition-all border border-gray-50 shadow-sm active:scale-95">Previous</button>
             <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-[#1B254B] bg-[#F4F7FE] px-4 py-1.5 rounded-lg tracking-widest uppercase shadow-inner">Page 01</span>
                <span className="text-[10px] font-black text-[#A3AED0] uppercase tracking-widest italic opacity-50">of 12</span>
             </div>
             <button className="px-6 py-3 rounded-xl text-[10px] font-black text-[#A3AED0] uppercase tracking-widest hover:bg-[#F4F7FE] hover:text-[#4318FF] transition-all border border-gray-100 shadow-sm active:scale-95">Next Page</button>
          </div>
        </div>
      </div>

      {/* RIGHT SIDEBAR */}
      <div className="w-full xl:w-[350px] shrink-0 flex flex-col space-y-10">
        <p className="text-right text-[10px] font-black text-[#A3AED0] uppercase tracking-[0.3em]">Tuesday, 14 Apr 2026</p>

        {/* STAT CARDS */}
        <div className="grid grid-cols-2 gap-5">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-50 flex flex-col items-center justify-center text-center transition-all hover:shadow-lg active:scale-95">
              <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center shadow-inner mb-3`}>
                {stat.icon}
              </div>
              <p className="text-2xl font-black text-[#1B254B] tracking-tighter leading-none">{stat.value}</p>
              <p className="text-[8px] text-[#A3AED0] font-black uppercase tracking-[0.1em] mt-2">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* PROGRESS CHART */}
        <div className="bg-white p-10 rounded-[45px] shadow-sm border border-gray-100 flex flex-col items-center">
           <h3 className="font-black text-[#1B254B] uppercase tracking-[0.2em] text-[11px] mb-10 border-b border-gray-50 pb-4 w-full text-center">Attendance Benchmarks</h3>
           <div className="relative flex items-center justify-center p-3 rounded-full border-[10px] border-gray-50 shadow-inner">
              <svg className="w-44 h-44 transform -rotate-90">
                <circle cx="88" cy="88" r="76" stroke="#F4F7FE" strokeWidth="18" fill="transparent" />
                <circle 
                  cx="88" cy="88" r="76" 
                  stroke="#4318FF" strokeWidth="18" 
                  fill="transparent" 
                  strokeDasharray="477.52" 
                  strokeDashoffset="95.5" // 80%
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out shadow-2xl"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <span className="text-4xl font-black text-[#1B254B] tracking-tighter leading-none italic">80%</span>
                 <span className="text-[9px] font-black text-[#A3AED0] uppercase mt-2 tracking-widest">Aggregate</span>
              </div>
           </div>
           <div className="flex justify-center gap-8 mt-12 w-full">
              <div className="flex flex-col items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-[#4318FF] shadow-[0_0_10px_rgba(67,24,255,0.4)]"></div>
                 <span className="text-[10px] text-[#A3AED0] font-black uppercase tracking-widest">Present</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-red-400 shadow-[0_0_10px_rgba(239,68,68,0.4)]"></div>
                 <span className="text-[10px] text-[#A3AED0] font-black uppercase tracking-widest">Absent</span>
              </div>
           </div>
        </div>

        {/* POLICY NOTICE */}
        <div className="bg-[#111C44] rounded-[45px] p-10 text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <h4 className="text-2xl font-black mb-1 uppercase tracking-tighter">Academic Status</h4>
            <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mb-10">System Notification Active</p>
            <div className="p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md">
                <p className="text-[11px] font-bold text-white/70 leading-relaxed uppercase tracking-widest text-center">Attendance above 85% is mandatory for certification eligibility.</p>
            </div>
          </div>
          <div className="absolute -right-12 -bottom-12 opacity-5 font-black text-[200px] italic select-none">!</div>
        </div>
      </div>
    </div>
  );
};

export default StudentAttendance;
import React from 'react';

const TeacherSchedule = () => {
  // داتا تجريبية للكارطات الفوقانيين
  const myClasses = [
    { name: "English B2", bg: "bg-gradient-to-br from-[#E6E0F8] to-[#FFFFFF]", flag: "🇬🇧" },
    { name: "French B1", bg: "bg-gradient-to-br from-[#FFF5D1] to-[#FFFFFF]", flag: "🇫🇷" },
    { name: "Spanish A2", bg: "bg-gradient-to-br from-[#DCE8FF] to-[#FFFFFF]", flag: "🇪🇸" },
    { name: "German A1", bg: "bg-gradient-to-br from-[#D1F4E0] to-[#FFFFFF]", flag: "🇩🇪" }
  ];

  return (
    <div className="flex-1 bg-white p-8 overflow-y-auto custom-scrollbar">
      
      {/* =========================================
          🟢 الجزء العلوي: ديزاين الأستاذ (Figma)
          ========================================= */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1B254B] mb-6">👋 Welcome, [Teacher Name]</h1>
        
        {/* Banner */}
        <div className="bg-[#f8fafc] rounded-2xl p-6 flex justify-between items-center mb-8 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm text-3xl">
              🔔
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#1B254B] mb-1">My Teaching Schedule:</h2>
              <p className="text-gray-500 text-sm">Manage your classes and teaching sessions</p>
            </div>
          </div>
          <div className="hidden md:flex gap-4 items-center">
            {/* Illustration Placeholder */}
            <span className="text-5xl">👩‍🏫📅</span>
          </div>
        </div>

        {/* My Classes Horizontal Cards */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-[#1B254B]">My classes</h3>
            <span className="text-xs text-gray-400">Upcoming Classes/Events</span>
            <button className="text-[#4318FF] text-sm font-medium hover:underline">See all {'>'}</button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {myClasses.map((cls, idx) => (
              <div key={idx} className={`${cls.bg} rounded-2xl p-4 min-w-[140px] border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-md transition-shadow`}>
                <span className="text-2xl mb-2">{cls.flag}</span>
                <h4 className="font-bold text-[#1B254B] text-sm mb-2">{cls.name}</h4>
                <span className="text-[10px] text-gray-500 font-medium">View Plan</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================
          🟢 الجزء السفلي: ديزاين السكرتيرة (Timetable)
          ========================================= */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#1B254B]">Timetable & Schedule</h2>
          <div className="flex gap-3">
            <div className="bg-gray-100 rounded-lg p-1 flex">
              <button className="bg-white shadow-sm px-4 py-1.5 rounded-md text-sm font-bold text-[#1B254B]">Week</button>
              <button className="px-4 py-1.5 rounded-md text-sm font-medium text-gray-500 hover:text-[#1B254B]">Month</button>
            </div>
            <select className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none"><option>All Languages</option></select>
            <select className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none"><option>All Levels</option></select>
            <button className="bg-[#4318FF] text-white px-4 py-1.5 rounded-lg text-sm font-bold shadow-sm hover:bg-blue-700 transition-colors">+ Add New Class</button>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Left Column: Today's Focus */}
          <div className="w-[280px] shrink-0 flex flex-col gap-6">
            <div className="border border-gray-200 rounded-2xl p-5 bg-white">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-[#1B254B]">Today's Focus</h3>
                <span className="text-xs text-[#4318FF] font-bold bg-blue-50 px-2 py-1 rounded">MON ⌄</span>
              </div>
              
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[5px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gray-100">
                {/* Timeline Item 1 */}
                <div className="relative flex items-start gap-4">
                  <div className="w-3 h-3 rounded-full bg-[#00B087] ring-4 ring-white z-10 mt-1.5"></div>
                  <div>
                    <span className="text-xs text-gray-400 font-medium">10:00</span>
                    <h4 className="font-bold text-[#1B254B] text-sm">German A1</h4>
                    <p className="text-xs text-gray-500">J. Lee</p>
                  </div>
                </div>
                {/* Timeline Item 2 */}
                <div className="relative flex items-start gap-4">
                  <div className="w-3 h-3 rounded-full bg-[#4318FF] ring-4 ring-white z-10 mt-1.5"></div>
                  <div>
                    <span className="text-xs text-gray-400 font-medium">12:00</span>
                    <h4 className="font-bold text-[#1B254B] text-sm">Spanish B1</h4>
                    <p className="text-xs text-gray-500">Er. Rahul</p>
                  </div>
                </div>
                {/* Timeline Item 3 */}
                <div className="relative flex items-start gap-4">
                  <div className="w-3 h-3 rounded-full bg-[#00B087] ring-4 ring-white z-10 mt-1.5"></div>
                  <div>
                    <span className="text-xs text-gray-400 font-medium">4:00</span>
                    <h4 className="font-bold text-[#1B254B] text-sm">German A1</h4>
                    <p className="text-xs text-gray-500">J. Lee</p>
                  </div>
                </div>
              </div>
              <button className="w-full text-center text-[#4318FF] text-sm font-bold mt-6 hover:underline">View Full Daily</button>
            </div>

            {/* Class Health */}
            <div className="border border-gray-200 rounded-2xl p-5 bg-white">
              <h3 className="font-bold text-[#1B254B] mb-4">Class Health</h3>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden mb-4">
                <div className="h-full bg-[#1B254B] w-[70%] rounded-full"></div>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <h4 className="text-2xl font-bold text-[#1B254B]">24</h4>
                  <p className="text-xs text-gray-400">Hours/W</p>
                </div>
                <div className="text-right">
                  <h4 className="text-2xl font-bold text-[#E02424]">08</h4>
                  <p className="text-xs text-gray-400">Labs</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Calendar Grid */}
          <div className="flex-1 border border-gray-200 rounded-2xl p-6 bg-white overflow-x-auto custom-scrollbar">
            <div className="min-w-[800px]">
              {/* Header Days */}
              <div className="grid grid-cols-7 gap-4 mb-4 text-center border-b border-gray-100 pb-4">
                {['MON Oct 23', 'TUE Oct 24', 'WED Oct 25', 'THU Oct 26', 'FRI Oct 27', 'SAT Oct 28', 'SUN Oct 29'].map((day, i) => (
                  <div key={i} className="text-xs font-bold text-[#1B254B] uppercase">
                    {day.split(' ')[0]} <br/> <span className="text-gray-500 font-medium">{day.split(' ')[1]} {day.split(' ')[2]}</span>
                  </div>
                ))}
              </div>

              {/* Grid Body */}
              <div className="relative h-[500px] border-l border-gray-50">
                {/* Time indicators (Rows) */}
                {['10:00', '12:00', '2:00', '4:00', '6:00'].map((time, i) => (
                  <div key={i} className="absolute w-full border-b border-gray-50 flex items-start" style={{ top: `${i * 25}%` }}>
                    <span className="text-[10px] font-bold text-gray-400 absolute -left-10 bg-white pr-2">{time}</span>
                  </div>
                ))}

                {/* Class Blocks (Absolute positioned for flexibility like a real calendar) */}
                {/* German A1 (MON 10:00) */}
                <div className="absolute left-[0%] top-[0%] w-[13.5%] h-[20%] bg-[#f0fdf4] border-l-4 border-[#00B087] rounded p-2 m-1 shadow-sm">
                  <p className="text-[9px] font-bold text-[#00B087] uppercase mb-0.5">Classe 1</p>
                  <h4 className="text-xs font-bold text-[#1B254B]">German A1</h4>
                  <p className="text-[9px] text-gray-500">IT Lab 4 • J. Lee</p>
                </div>

                {/* English B2 (TUE 10:00) */}
                <div className="absolute left-[14.28%] top-[0%] w-[13.5%] h-[20%] bg-[#fff7ed] border-l-4 border-[#F6AD55] rounded p-2 m-1 shadow-sm">
                  <p className="text-[9px] font-bold text-[#F6AD55] uppercase mb-0.5">Studio</p>
                  <h4 className="text-xs font-bold text-[#1B254B]">English B2</h4>
                  <p className="text-[9px] text-gray-500">Open • Prof. Singh</p>
                </div>

                {/* Spanish B1 (MON 12:00) */}
                <div className="absolute left-[0%] top-[25%] w-[13.5%] h-[20%] bg-[#eff6ff] border-l-4 border-[#4318FF] rounded p-2 m-1 shadow-sm">
                  <p className="text-[9px] font-bold text-[#4318FF] uppercase mb-0.5">Lecture</p>
                  <h4 className="text-xs font-bold text-[#1B254B]">Spanish B1</h4>
                  <p className="text-[9px] text-gray-500">K-304 • Er. Rahul</p>
                </div>

                {/* Spanish B2 (WED 12:00) */}
                <div className="absolute left-[42.84%] top-[25%] w-[13.5%] h-[20%] bg-[#eff6ff] border-l-4 border-[#4318FF] rounded p-2 m-1 shadow-sm">
                  <p className="text-[9px] font-bold text-[#4318FF] uppercase mb-0.5">Lecture</p>
                  <h4 className="text-xs font-bold text-[#1B254B]">Spanish B2</h4>
                  <p className="text-[9px] text-gray-500">K-304 • Er. Rahul</p>
                </div>

                {/* French C1 (FRI 12:00) */}
                <div className="absolute left-[71.4%] top-[25%] w-[13.5%] h-[20%] bg-[#faf5ff] border-l-4 border-[#9F7AEA] rounded p-2 m-1 shadow-sm">
                  <p className="text-[9px] font-bold text-[#9F7AEA] uppercase mb-0.5">Seminar</p>
                  <h4 className="text-xs font-bold text-[#1B254B]">French C1</h4>
                  <p className="text-[9px] text-gray-500">Hall 5 • Dr. Gray</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default TeacherSchedule;
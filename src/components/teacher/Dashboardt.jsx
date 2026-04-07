import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboardt = () => {
  const [activeTab, setActiveTab] = useState('My Classes');
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  const studentsProgress = [
    { name: "Sarah Johnson", course: "English", level: "B2", grade: "16/20", status: "VERY GOOD", color: "text-[#38A169]" },
    { name: "Lucas Martin", course: "French", level: "B1", grade: "14/20", status: "GOOD", color: "text-[#48BB78]" },
    { name: "Maria Garcia", course: "Spanish", level: "A2", grade: "13/20", status: "ALMOST GOOD", color: "text-[#3182CE]" },
    { name: "Anna Schmidt", course: "German", level: "A1", grade: "10/20", status: "NEEDS WORK", color: "text-[#DD6B20]" },
    { name: "David Brown", course: "English", level: "B2", grade: "18/20", status: "EXCELLENT", color: "text-[#38A169]" },
  ];

  return (
    <div className="flex h-screen bg-[#F4F7FE] font-sans text-[#1B254B] overflow-hidden">
      
      {/* =======================================
          1. SIDEBAR (القائمة الجانبية)
          ======================================= */}
      <aside className="w-[250px] bg-[#111C44] text-[#A3AED0] flex flex-col justify-between shrink-0 overflow-y-auto custom-scrollbar">
        <div>
          {/* Logo */}
          <div className="p-6 flex items-center space-x-3 mb-2">
             <div className="w-8 h-8 bg-white text-black rounded flex items-center justify-center font-bold text-lg">🎓</div>
             <span className="text-xl font-bold tracking-wider text-white uppercase">UTOPIA</span>
          </div>

          <nav className="px-4 space-y-6">
            <button 
              onClick={() => setActiveTab('Dashboard')}
              className={`w-full flex items-center px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${activeTab === 'Dashboard' ? 'text-white' : 'hover:text-white'}`}
            >
              <span className="mr-3 text-lg">⊞</span> Dashboard
            </button>

            {/* ACADEMIC */}
            <div>
              <p className="text-[10px] font-bold text-[#A3AED0] mb-3 px-4 uppercase tracking-widest opacity-80">Academic</p>
              <div className="space-y-1">
                {[
                  { id: 'Schedule', icon: '📅' }, { id: 'My Students', icon: '👥' },
                  { id: 'My Classes', icon: '📚' }, { id: 'Enter Grades', icon: '📝' },
                  { id: 'Upload Course', icon: '📤' }, { id: 'Messages', icon: '💬' },
                  { id: 'Attendance', icon: '✅' }, { id: 'Libraries', icon: '🏛️' }
                ].map((item) => (
                  <button key={item.id} onClick={() => setActiveTab(item.id)} 
                    className={`w-full flex items-center px-4 py-2.5 rounded-xl text-sm font-medium transition-colors 
                    ${activeTab === item.id ? 'bg-white/10 text-white font-bold' : 'hover:text-white'}`}>
                    <span className="mr-3">{item.icon}</span> {item.id}
                  </button>
                ))}
              </div>
            </div>

            {/* ADMINISTRATIVE */}
            <div>
              <p className="text-[10px] font-bold text-[#A3AED0] mb-3 px-4 uppercase tracking-widest opacity-80">Administrative</p>
              <div className="space-y-1">
                <button className="w-full flex items-center px-4 py-2.5 rounded-xl text-sm font-medium transition-colors hover:text-white"><span className="mr-3">💲</span> Finance</button>
                <button className="w-full flex items-center px-4 py-2.5 rounded-xl text-sm font-medium transition-colors hover:text-white"><span className="mr-3">📢</span> Announcements</button>
              </div>
            </div>

            {/* SETTINGS */}
            <div>
              <p className="text-[10px] font-bold text-[#A3AED0] mb-3 px-4 uppercase tracking-widest opacity-80">Settings</p>
              <button className="w-full flex items-center px-4 py-2.5 rounded-xl text-sm font-medium transition-colors hover:text-white"><span className="mr-3">⚙️</span> Account Settings</button>
            </div>
          </nav>
        </div>

        {/* Logout */}
        <div className="p-4 mt-4 border-t border-white/10">
          <button onClick={handleLogout} className="flex items-center w-full px-4 py-3 text-[#A3AED0] rounded-xl text-sm font-bold hover:text-white transition-colors">
             <span className="mr-3 text-lg">↪️</span> Logout
          </button>
        </div>
      </aside>

      {/* =======================================
          2. MAIN CONTENT AREA
          ======================================= */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Search & Profile */}
        <header className="h-20 px-8 flex justify-between items-center bg-[#F4F7FE] shrink-0">
          <div className="relative w-80">
            <span className="absolute left-4 top-2.5 text-gray-400">🔍</span>
            <input 
              type="text" 
              placeholder="Search" 
              className="w-full bg-white border-none rounded-full py-2.5 pl-10 pr-4 text-sm outline-none shadow-sm text-[#1B254B]"
            />
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm cursor-pointer text-gray-500">🔔</div>
            <img src="https://i.pravatar.cc/150?img=47" alt="Profile" className="w-10 h-10 rounded-full object-cover cursor-pointer" />
          </div>
        </header>

        {/* Content Container (Center + Right) */}
        <div className="flex-1 overflow-y-auto px-8 pb-8 custom-scrollbar flex gap-6">
          
          {/* 🟢 الجزء الأوسط (البانر + الكارطات + الطابلو) */}
          <div className="flex-1 min-w-[650px] flex flex-col space-y-6">
            
            {/* Header Text */}
            <div className="flex justify-between items-end">
              <h1 className="text-[28px] font-bold text-[#1B254B] flex items-center">👋 Welcome, [Teacher Name]</h1>
            </div>

            {/* Banner */}
            <div className="bg-[#EBE9F1] rounded-[20px] p-8 flex justify-between items-center relative overflow-hidden h-[200px]">
              <div className="z-10 w-2/3">
                <h2 className="text-2xl font-bold text-[#1B254B] mb-3">Manage Your Classes Efficiently!</h2>
                <p className="text-[#A3AED0] text-sm mb-6 leading-relaxed">
                  Track student performance, manage assignments, and monitor attendance. Stay organized and ensure your students succeed.
                </p>
                <button className="bg-[#111C44] text-white px-6 py-2.5 rounded-lg text-sm font-bold flex items-center hover:bg-black transition-colors">
                  View My Classes <span className="ml-2">→</span>
                </button>
              </div>
              <div className="absolute right-0 top-0 bottom-0 w-1/3 flex items-center justify-center">
                 {/* Illustration placeholder */}
                 <span className="text-6xl">👨‍🏫👩‍🎓</span>
              </div>
            </div>

            {/* My Classes Cards */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-[#1B254B] flex items-center"><span className="mr-2 text-xl">📚</span> My Classes</h3>
                <button className="text-[#4318FF] text-sm font-medium hover:underline">View all {'>'}</button>
              </div>
              
              <div className="grid grid-cols-4 gap-4">
                {/* Card 1: Purple */}
                <div className="bg-[#C5B8D8] rounded-[20px] p-5 flex flex-col justify-between h-36">
                  <h4 className="font-bold text-[#35254A] text-[13px] leading-tight pr-4">English Communication – B2</h4>
                  <div>
                    <p className="text-[11px] text-[#35254A]/70 flex items-center mb-1.5"><span className="mr-1.5">👥</span> 20 Students</p>
                    <p className="text-[11px] font-bold text-[#35254A] flex items-center"><span className="mr-1.5">📖</span> English B2</p>
                  </div>
                </div>

                {/* Card 2: Yellow */}
                <div className="bg-[#E5D2A6] rounded-[20px] p-5 flex flex-col justify-between h-36">
                  <h4 className="font-bold text-[#4A3A17] text-[13px] leading-tight pr-4">French Intermediate – B1</h4>
                  <div>
                    <p className="text-[11px] text-[#4A3A17]/70 flex items-center mb-1.5"><span className="mr-1.5">👥</span> 24 Students</p>
                    <p className="text-[11px] font-bold text-[#4A3A17] flex items-center"><span className="mr-1.5">📖</span> French B1</p>
                  </div>
                </div>

                {/* Card 3: Blue */}
                <div className="bg-[#A4C2D1] rounded-[20px] p-5 flex flex-col justify-between h-36">
                  <h4 className="font-bold text-[#1F3340] text-[13px] leading-tight pr-4">Spanish Basics – A2</h4>
                  <div>
                    <p className="text-[11px] text-[#1F3340]/70 flex items-center mb-1.5"><span className="mr-1.5">👥</span> 25 Students</p>
                    <p className="text-[11px] font-bold text-[#1F3340] flex items-center"><span className="mr-1.5">📖</span> Spanish A2</p>
                  </div>
                </div>

                {/* Card 4: Green */}
                <div className="bg-[#A9C4A3] rounded-[20px] p-5 flex flex-col justify-between h-36">
                  <h4 className="font-bold text-[#23331E] text-[13px] leading-tight pr-4">German Beginner – A1</h4>
                  <div>
                    <p className="text-[11px] text-[#23331E]/70 flex items-center mb-1.5"><span className="mr-1.5">👥</span> 30 Students</p>
                    <p className="text-[11px] font-bold text-[#23331E] flex items-center"><span className="mr-1.5">📖</span> German A1</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Student Progress Table */}
            <div className="flex-1 bg-transparent">
              <div className="flex justify-between items-center mb-4 mt-2">
                <h3 className="text-lg font-bold text-[#1B254B] flex items-center"><span className="mr-2 text-xl">📈</span> Student Progress</h3>
                <button className="text-[#4318FF] text-sm font-medium hover:underline">View all {'>'}</button>
              </div>
              
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-[#A3AED0] text-[13px] font-medium border-b border-gray-200">
                    <th className="pb-3 font-medium">Student Name ↑↓</th>
                    <th className="pb-3 font-medium">Course ↑↓</th>
                    <th className="pb-3 font-medium">Level ↑↓</th>
                    <th className="pb-3 font-medium">Grade ↑↓</th>
                    <th className="pb-3 font-medium">Status ↑↓</th>
                    <th className="pb-3 text-right"></th>
                  </tr>
                </thead>
                <tbody>
                  {studentsProgress.map((student, idx) => (
                    <tr key={idx} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50">
                      <td className="py-3.5 font-bold text-[#1B254B]">{student.name}</td>
                      <td className="py-3.5 text-[#A3AED0] font-medium">{student.course}</td>
                      <td className="py-3.5 font-bold text-[#A3AED0]">{student.level}</td>
                      <td className="py-3.5 font-bold text-[#1B254B]">{student.grade}</td>
                      <td className="py-3.5">
                        <span className={`text-[10px] font-bold tracking-widest ${student.color}`}>
                          {student.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        <button className="text-[#A3AED0] hover:text-[#1B254B] text-xl font-bold cursor-pointer">⋮</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

          {/* 🟢 الجزء الأيمن (الرزنامة والمهام) */}
          <div className="w-[320px] shrink-0 flex flex-col space-y-6">
            
            <div className="flex justify-end text-xs font-bold text-[#A3AED0] pt-2">
              12 Jan 2024, Friday
            </div>

            {/* Semester Progress */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs font-bold text-[#1B254B]">Semester 3 of 8</p>
              </div>
              <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-[#111C44] w-[37%] rounded-full"></div>
              </div>
            </div>

            {/* Calendar Widget */}
            <div className="bg-transparent rounded-2xl pt-2">
              <div className="flex justify-between items-center mb-4">
                <button className="text-[#1B254B] font-bold">{'<'}</button>
                <h4 className="font-bold text-[#1B254B] text-sm">January 2024</h4>
                <button className="text-[#1B254B] font-bold">{'>'}</button>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-[#A3AED0] font-bold mb-3">
                <div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div><div>Su</div>
              </div>
              <div className="grid grid-cols-7 gap-y-3 gap-x-1 text-center text-[13px] font-medium text-[#1B254B]">
                <div className="text-gray-300">29</div><div className="text-gray-300">30</div><div className="text-gray-300">31</div>
                <div>1</div><div>2</div><div>3</div><div>4</div>
                <div>5</div><div>6</div><div>7</div><div>8</div><div>9</div><div>10</div><div>11</div>
                <div className="bg-[#111C44] text-white w-7 h-7 rounded-full flex items-center justify-center mx-auto shadow-md">12</div>
                <div>13</div><div>14</div><div>15</div><div>16</div><div>17</div><div>18</div>
              </div>
            </div>

            {/* Today's Schedule List */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-[#1B254B] flex items-center"><span className="mr-2 text-xl">💼</span> Today's Schedule</h3>
                <button className="text-[#4318FF] text-sm font-medium hover:underline">View all {'>'}</button>
              </div>
              
              <div className="space-y-3">
                {/* Task 1 */}
                <div className="bg-white p-4 rounded-[14px] border-l-[3px] border-[#ED8936] shadow-sm relative">
                  <span className="absolute top-4 right-4 text-[9px] font-bold text-[#ED8936] bg-[#FFEDD5] px-2 py-0.5 rounded tracking-wide">Not Submitted</span>
                  <p className="text-[13px] font-bold text-[#1B254B] mb-2 pr-20">Oral Presentation Submissions</p>
                  <p className="text-[11px] text-[#A3AED0] mb-1.5 leading-snug">Assignment: Oral Presentation - "My Future Goals"</p>
                  <p className="text-[10px] text-[#A3AED0] font-medium">Due Date: February 10, 2024</p>
                </div>

                {/* Task 2 */}
                <div className="bg-white p-4 rounded-[14px] border-l-[3px] border-[#48BB78] shadow-sm relative">
                  <span className="absolute top-4 right-4 text-[9px] font-bold text-[#48BB78] bg-[#C6F6D5] px-2 py-0.5 rounded tracking-wide">Completed</span>
                  <p className="text-[13px] font-bold text-[#1B254B] mb-2 pr-20">Essay Corrections</p>
                  <p className="text-[11px] text-[#A3AED0] mb-1.5 leading-snug">Assignment: Written Essay - "Une journée mémorable"</p>
                  <p className="text-[10px] text-[#A3AED0] font-medium">Due Date: March 9, 2024</p>
                </div>

                {/* Task 3 */}
                <div className="bg-white p-4 rounded-[14px] border-l-[3px] border-[#9F7AEA] shadow-sm relative">
                  <span className="absolute top-4 right-4 text-[9px] font-bold text-[#9F7AEA] bg-[#E9D8FD] px-2 py-0.5 rounded tracking-wide">In Progress</span>
                  <p className="text-[13px] font-bold text-[#1B254B] mb-2 pr-20">Vocabulary Quiz Results</p>
                  <p className="text-[11px] text-[#A3AED0] mb-1.5 leading-snug">Assignment: Vocabulary Quiz - Unit 3</p>
                  <p className="text-[10px] text-[#A3AED0] font-medium">Due Date: April 15, 2024</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboardt;
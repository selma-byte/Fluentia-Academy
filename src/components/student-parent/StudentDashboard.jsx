import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Import sub-components
import StudentCourses from './StudentCourses';
import StudentAnnouncements from './StudentAnnouncements'; 
import StudentHomeworks from './StudentHomeworks';
import ExamBoard from './ExamBoard'; 
import StudentGradeReport from './StudentGradeReport';
import StudentSchedule from './StudentSchedule';
import AccountSettings from './AccountSettings'; 
import StudentPayment from './StudentPayment'; 
import StudentMessages from './StudentMessages';
import StudentAttendance from './StudentAttendance';
import StudentLibraries from './StudentLibraries';

const Icons = {
  Dashboard: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>,
  Learning: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>,
  Tasks: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>,
  Messages: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>,
  Payment: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>,
  Settings: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>,
  Logout: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>,
  Search: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
  Bell: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>,
};

const navLinks = [
  { id: 'Dashboard', icon: Icons.Dashboard },
  { id: 'My Learning', icon: Icons.Learning },
  { id: 'Classroom Tasks', icon: Icons.Tasks },
  { id: 'Messages', icon: Icons.Messages },
  { id: 'Payment', icon: Icons.Payment },
  { id: 'Settings', icon: Icons.Settings },
];

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [learningSubTab, setLearningSubTab] = useState('Courses');
  const [tasksSubTab, setTasksSubTab] = useState('Attendance');
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);
  const navigate = useNavigate();

  const [studentInfo] = useState({ full_name: 'Harboula Selma', role: 'Student Account' });

  const [myClasses] = useState([
    { id: 1, name: "Language Course - Level B2", instructor: "Instructor Name", color: "bg-[#C1B2DA]", students: 30, time: "Mon & Wed 09:00", platform: "Online Learning" },
    { id: 2, name: "Language Course - Level B1", instructor: "Instructor Name", color: "bg-[#F3E5AB]", students: 22, time: "Tue & Thu 09:00", platform: "Online Learning" },
    { id: 3, name: "Language Course - Level A2", instructor: "Instructor Name", color: "bg-[#A6C9E2]", students: 25, time: "Fri 10:00", platform: "Online Learning" },
    { id: 4, name: "Language Course - Level A1", instructor: "Instructor Name", color: "bg-[#B4D9B0]", students: 27, time: "Wed 14:00", platform: "Online Learning" },
  ]);

  const homeworkData = [
    { title: "Course Assignment", desc: "Project Presentation", due: "Feb 10, 2024", status: "Pending", color: "border-[#C1B2DA]" },
    { title: "Written Exercise", desc: "Grammar Essay", due: "Mar 5, 2024", status: "Submitted", color: "border-[#F3E5AB]" },
  ];

  const examBoardData = [
    { name: "Final speaking assessment", course: "Level B2", date: "Jan 25, 2024", status: "Completed", statusCol: "text-green-500 bg-green-50" },
    { name: "Grammar & Writing Test", course: "Level B1", date: "Feb 5, 2024", status: "Completed", statusCol: "text-green-500 bg-green-50" },
  ];

  const notifications = [
    { id: 1, text: "New Grade published: English B2", time: "2 min ago", unread: true },
    { id: 2, text: "Your Payment PAY-8829 was verified", time: "1 hour ago", unread: true },
    { id: 3, text: "Exam Schedule updated for Spring 2026", time: "Yesterday", unread: false },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => navigate('/login');

  const renderMainContent = () => {
    if (activeTab === 'My Learning') {
      return (
        <div className="flex-1 flex flex-col space-y-6 min-w-0">
          <div className="flex items-center space-x-8 border-b border-gray-100 mb-2">
            {['Courses', 'Libraries', 'Schedule'].map((tab) => (
              <button key={tab} onClick={() => setLearningSubTab(tab)} className={`pb-4 text-sm font-bold transition-all relative ${learningSubTab === tab ? 'text-[#4318FF]' : 'text-[#A3AED0] hover:text-[#1B254B]'}`}>
                {tab}
                {learningSubTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#4318FF] rounded-t-full shadow-[0_-2px_10px_rgba(67,24,255,0.3)]"></div>}
              </button>
            ))}
          </div>
          {learningSubTab === 'Courses' && <StudentCourses />}
          {learningSubTab === 'Libraries' && <StudentLibraries />}
          {learningSubTab === 'Schedule' && <StudentSchedule />}
        </div>
      );
    }

    if (activeTab === 'Classroom Tasks') {
      return (
        <div className="flex-1 flex flex-col space-y-6 min-w-0">
          <div className="flex items-center space-x-8 border-b border-gray-100 mb-2">
            {['Attendance', 'Homeworks', 'Grade Report', 'Exam Board', 'Announcements'].map((tab) => (
              <button key={tab} onClick={() => setTasksSubTab(tab)} className={`pb-4 text-sm font-bold transition-all relative ${tasksSubTab === tab ? 'text-[#4318FF]' : 'text-[#A3AED0] hover:text-[#1B254B]'}`}>
                {tab}
                {tasksSubTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#4318FF] rounded-t-full shadow-[0_-2px_10px_rgba(67,24,255,0.3)]"></div>}
              </button>
            ))}
          </div>
          {tasksSubTab === 'Attendance' && <StudentAttendance />}
          {tasksSubTab === 'Homeworks' && <StudentHomeworks />}
          {tasksSubTab === 'Grade Report' && <StudentGradeReport />}
          {tasksSubTab === 'Exam Board' && <ExamBoard />}
          {tasksSubTab === 'Announcements' && <StudentAnnouncements />}
        </div>
      );
    }

    if (activeTab === 'Messages') return <div className="flex-1 min-w-0"><StudentMessages /></div>;
    if (activeTab === 'Payment') return <div className="flex-1 min-w-0"><StudentPayment /></div>;
    if (activeTab === 'Settings') return <div className="flex-1 min-w-0"><AccountSettings /></div>;

    return (
      <div className="flex-1 flex flex-col space-y-10 animate-fadeIn pr-2 min-w-0">
        <div className="flex flex-col space-y-1">
          <p className="text-[#A3AED0] text-sm font-black tracking-widest uppercase opacity-60">Overview</p>
          <h1 className="text-3xl font-black text-[#1B254B] uppercase tracking-tighter italic">Welcome, {studentInfo.full_name}</h1>
        </div>
        
        <div className="bg-[#EBE9F1] rounded-[45px] px-12 py-14 flex justify-between items-center relative overflow-hidden shadow-sm">
          <div className="z-10 w-full md:w-3/5">
            <h2 className="text-4xl font-black text-[#1B254B] mb-5 leading-tight uppercase tracking-tighter">Elevate Your Language Path</h2>
            <p className="text-[#1B254B]/60 text-base mb-10 leading-relaxed max-w-md font-bold uppercase tracking-widest opacity-80">Access synchronized modules, download academic assets, and track your global proficiency level.</p>
            <button className="bg-[#111C44] text-white px-10 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all shadow-2xl shadow-blue-900/20 active:scale-95">Explore Curriculum</button>
          </div>
          <div className="absolute right-[-20px] bottom-[-20px] opacity-10 text-[260px] font-black pointer-events-none select-none italic">F</div>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-end">
            <h3 className="text-xl font-black text-[#1B254B] uppercase tracking-widest italic">Academic Curriculums</h3>
            <button onClick={() => { setActiveTab('My Learning'); setLearningSubTab('Courses'); }} className="text-[#4318FF] text-[11px] font-black hover:underline tracking-[0.2em] uppercase">Browse catalog</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10">
            {myClasses.map((cls) => (
              <div key={cls.id} className="bg-white rounded-[40px] shadow-sm border border-gray-100 flex flex-col overflow-hidden hover:shadow-2xl transition-all duration-500 group active:scale-95">
                <div className={`${cls.color} p-10 h-32 flex flex-col justify-center border-b border-white/20`}>
                  <h4 className="font-black text-[18px] text-[#1B254B] leading-tight line-clamp-1 uppercase tracking-tight italic">{cls.name}</h4>
                  <div className="text-[10px] font-black text-[#1B254B]/50 mt-2 uppercase tracking-[0.2em]">{cls.instructor}</div>
                </div>
                <div className="p-10 space-y-6">
                  <div className="flex items-center text-[12px] text-[#A3AED0] font-black uppercase tracking-widest leading-none"><span className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center mr-5 text-[#1B254B] shadow-sm italic">#</span> {cls.students} Enrolled</div>
                  <div className="flex items-center text-[12px] text-[#A3AED0] font-black uppercase tracking-widest leading-none"><span className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center mr-5 text-[#1B254B] shadow-sm italic">@</span> {cls.time}</div>
                  <button className="w-full mt-4 py-5 bg-[#F4F7FE] text-[#4318FF] text-[11px] font-black rounded-2xl group-hover:bg-[#4318FF] group-hover:text-white transition-all uppercase tracking-[0.2em] shadow-sm">View Materials</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[45px] p-10 shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-black text-[#1B254B] uppercase tracking-widest">Exam Board Sync</h3>
            <button onClick={() => { setActiveTab('Classroom Tasks'); setTasksSubTab('Exam Board'); }} className="text-[#4318FF] text-[11px] font-black hover:underline tracking-[0.2em] uppercase">Full Schedule</button>
          </div>
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse table-fixed min-w-[700px]">
              <thead>
                <tr className="text-[#A3AED0] text-[10px] font-black uppercase tracking-[0.3em] border-b border-gray-100">
                  <th className="pb-6 pl-4 w-[40%]">Evaluation Profile</th>
                  <th className="pb-6 w-[25%]">Certified Path</th>
                  <th className="pb-6 w-[20%]">Deadline</th>
                  <th className="pb-6 w-[15%] text-center">Protocol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {examBoardData.map((exam, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 transition-all group">
                    <td className="py-7 pl-4 font-black text-[#1B254B] text-[15px] uppercase tracking-tight">{exam.name}</td>
                    <td className="py-7 text-[#707EAE] text-xs font-black uppercase tracking-widest">{exam.course}</td>
                    <td className="py-7 text-[#707EAE] text-xs font-black uppercase tracking-widest italic">{exam.date}</td>
                    <td className="py-7 text-center">
                      <span className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border shadow-sm ${exam.statusCol}`}>
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
    );
  };

  return (
    <div className="flex h-screen bg-[#F4F7FE] font-sans text-[#1B254B] overflow-hidden">
      <aside className="w-[300px] bg-[#0B132B] text-[#A3AED0] flex flex-col shrink-0 z-20 shadow-2xl h-full border-r border-white/5">
        <div className="p-10 flex items-center space-x-4 shrink-0">
          <div className="w-11 h-11 bg-[#4318FF] text-white rounded-2xl flex items-center justify-center font-black text-2xl shadow-2xl shadow-blue-500/40 italic">F</div>
          <span className="text-xl font-black tracking-tighter text-white uppercase italic">FLUENTIA</span>
        </div>
        <nav className="px-6 space-y-2 mt-6 overflow-y-auto custom-scrollbar flex-1 pb-10">
          {navLinks.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-6 py-4.5 rounded-[22px] text-[13px] font-black uppercase tracking-[0.1em] transition-all ${
                activeTab === item.id ? 'bg-[#4318FF] text-white shadow-2xl shadow-blue-900/40' : 'hover:bg-white/5 hover:text-white opacity-60'
              }`}
            >
              <span className="mr-5"><item.icon /></span> 
              {item.id}
            </button>
          ))}
        </nav>
        <div className="p-8 border-t border-white/5 shrink-0">
          <button onClick={handleLogout} className="w-full flex items-center px-6 py-5 text-red-400 font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl hover:bg-red-500/10 transition-colors">
            <span className="mr-5"><Icons.Logout /></span> Exit Portal
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-full bg-[#F4F7FE] overflow-hidden">
        <header className="h-24 px-12 flex justify-between items-center bg-white/80 backdrop-blur-md border-b border-gray-100 shrink-0 z-10 shadow-sm">
          <div className="relative w-full max-w-lg group">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 font-black uppercase tracking-widest text-[9px] group-focus-within:text-[#4318FF] transition-colors">Search</span>
            <input type="text" placeholder="Access Academic Archives..." className="w-full bg-[#F4F7FE] border-none rounded-2xl py-3.5 pl-20 pr-6 text-sm font-bold outline-none focus:ring-2 focus:ring-[#4318FF]/10 transition-all placeholder:uppercase placeholder:text-[10px] placeholder:tracking-widest" />
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative" ref={notificationRef}>
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`w-12 h-12 flex items-center justify-center rounded-2xl bg-[#F4F7FE] transition-all relative group shadow-sm border border-gray-50 ${showNotifications ? 'bg-[#4318FF] text-white shadow-blue-200 shadow-xl' : 'hover:bg-white hover:shadow-lg text-gray-600'}`}
                >
                  <Icons.Bell />
                  <span className={`absolute top-3 right-3 w-2.5 h-2.5 bg-[#E31A1A] rounded-full border-2 border-white animate-pulse ${showNotifications ? 'hidden' : 'block'}`}></span>
                </button>

                {showNotifications && (
                    <div className="absolute right-0 mt-4 w-[360px] bg-white rounded-[35px] shadow-2xl border border-gray-100 p-6 z-50 animate-fadeInUp">
                        <div className="flex justify-between items-center mb-6 px-2">
                            <h4 className="text-sm font-black text-[#1B254B] uppercase tracking-widest">Inbox Alerts</h4>
                            <span className="text-[10px] font-black text-[#4318FF] uppercase tracking-widest cursor-pointer hover:underline">Clear all</span>
                        </div>
                        <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-1">
                            {notifications.map(n => (
                                <div key={n.id} className={`p-5 rounded-3xl transition-all cursor-pointer border ${n.unread ? 'bg-[#F4F7FE]/50 border-[#4318FF]/10' : 'bg-white border-transparent hover:bg-gray-50'}`}>
                                    <div className="flex justify-between items-start mb-1">
                                        <p className={`text-[12px] ${n.unread ? 'font-black text-[#1B254B]' : 'font-bold text-[#707EAE]'} leading-tight uppercase tracking-tight`}>{n.text}</p>
                                        {n.unread && <div className="w-1.5 h-1.5 rounded-full bg-[#4318FF] shrink-0 mt-1"></div>}
                                    </div>
                                    <p className="text-[9px] font-black text-[#A3AED0] uppercase tracking-widest">{n.time}</p>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-6 py-4 bg-[#F4F7FE] text-[#4318FF] text-[10px] font-black rounded-2xl uppercase tracking-[0.2em] hover:bg-[#4318FF] hover:text-white transition-all">View All Activity</button>
                    </div>
                )}
            </div>

            <div className="flex items-center pl-6 border-l border-gray-100 group cursor-pointer" onClick={() => setActiveTab('Settings')}>
              <div className="mr-5 text-right">
                <p className="text-sm font-black text-[#1B254B] uppercase tracking-tighter group-hover:text-[#4318FF] transition-colors italic leading-none">{studentInfo.full_name}</p>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1 opacity-70">Verified Account</p>
              </div>
              <div className="relative">
                <img src="https://i.pravatar.cc/150?img=32" alt="Profile" className="w-14 h-14 rounded-2xl border-4 border-white shadow-xl group-hover:scale-105 transition-transform" />
                <div className="absolute bottom-[-2px] right-[-2px] w-4 h-4 bg-[#01B574] rounded-full border-2 border-white shadow-sm"></div>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-12 py-12 custom-scrollbar flex flex-col xl:flex-row gap-12">
          <div className="flex-1 min-w-0">{renderMainContent()}</div>

          {activeTab === 'Dashboard' && (
            <aside className="w-full xl:w-[350px] shrink-0 flex flex-col space-y-10">
              {/* --- COMPACT PREMIUM CALENDAR --- */}
              <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-50 flex flex-col items-center">
                <div className="w-full flex justify-between items-center mb-8 px-2 border-b border-gray-50 pb-5">
                    <button className="text-[#A3AED0] font-black text-xs hover:text-[#4318FF] transition-colors">Prev</button>
                    <h4 className="font-black text-[#1B254B] text-[14px] uppercase tracking-[0.2em] italic">April 2026</h4>
                    <button className="text-[#A3AED0] font-black text-xs hover:text-[#4318FF] transition-colors">Next</button>
                </div>
                <div className="w-full grid grid-cols-7 gap-y-4 text-center text-[10px] font-black uppercase tracking-[0.1em] text-[#A3AED0] mb-2">
                  {['M','T','W','T','F','S','S'].map(d => <div key={d}>{d}</div>)}
                </div>
                <div className="w-full grid grid-cols-7 gap-y-3 text-center text-[12px] font-bold text-[#1B254B]">
                  {[...Array(30)].map((_, i) => (
                    <div key={i} className="flex items-center justify-center h-8 w-full">
                      {i+1 === 14 ? (
                        <div className="bg-[#4318FF] text-white rounded-xl w-8 h-8 flex items-center justify-center shadow-lg shadow-blue-500/30 transform scale-110 font-black italic">{i+1}</div>
                      ) : (
                        <span className="opacity-40 hover:opacity-100 transition-opacity cursor-pointer font-black">{i+1}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* DASHBOARD TASK SNIPPETS */}
              <div className="space-y-8">
                <div className="flex justify-between items-center px-4">
                    <h3 className="text-xl font-black text-[#1B254B] uppercase tracking-widest leading-none italic">Task Hub</h3>
                    <button 
                        onClick={() => { setActiveTab('Classroom Tasks'); setTasksSubTab('Homeworks'); }}
                        className="text-[#4318FF] text-[10px] font-black uppercase tracking-widest hover:underline"
                    >
                        View All
                    </button>
                </div>
                <div className="space-y-5">
                  {homeworkData.map((hw, idx) => (
                    <div key={idx} className={`p-8 bg-white rounded-[40px] border-l-[10px] shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-1 ${hw.color} group cursor-pointer active:scale-95`}>
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="text-[14px] font-black text-[#1B254B] leading-tight uppercase tracking-tight italic group-hover:text-[#4318FF]">{hw.title}</h4>
                        <span className="text-[8px] font-black uppercase tracking-widest bg-[#F4F7FE] px-3 py-1.5 rounded-lg shadow-inner">{hw.status}</span>
                      </div>
                      <p className="text-[12px] font-bold text-[#A3AED0] mb-6 uppercase tracking-tight opacity-70 leading-relaxed">{hw.desc}</p>
                      <div className="flex items-center justify-between">
                        <div className="text-[10px] font-black text-[#1B254B] uppercase tracking-[0.2em] bg-gray-50 px-4 py-2 rounded-xl border border-white shadow-sm">Due: {hw.due}</div>
                        <span className="text-[#4318FF] text-lg opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0 font-black">→</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          )}
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Import your sub-components
import StudentClasses from './StudentClasses';
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
  Dashboard: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 13h9V3H3v10zm0 8h9v-6H3v6zm11 0h9V11h-9v10zm0-18v6h9V3h-9z" fill="currentColor"/></svg>,
  Schedule: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2-2zM19 20H5V10h14v10zm0-12H5V6h14v2z" fill="currentColor"/></svg>,
  ExamBoard: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" fill="currentColor"/></svg>,
  Homeworks: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 1.07V9c0 .55.45 1 1 1h7.93c.04-.33.07-.66.07-1s-.03-.67-.07-1H14V1.07c-.33-.04-.66-.07-1-.07s-.67.03-1 .07V9c0 .55.45 1 1 1h7.93c.04.33.07.66.07 1s-.03.67-.07 1H14V21c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2v2H6V5h6v1.07z" fill="currentColor"/></svg>,
  GradeReport: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" fill="currentColor"/></svg>,
  EnrolledCourses: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9h-4v4h-2v-4H9V9h4V5h2v4h4v2z" fill="currentColor"/></svg>,
  Messages: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" fill="currentColor"/></svg>,
  Attendance: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" fill="currentColor"/></svg>,
  Libraries: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z" fill="currentColor"/></svg>,
  Payment: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" fill="currentColor"/></svg>,
  Announcements: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 9h-2V5h2v6zm0 4h-2v-2h2v2z" fill="currentColor"/></svg>,
  Settings: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L3.64 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.21.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" fill="currentColor"/></svg>,
  Logout: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" fill="currentColor"/></svg>,
  Search: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
};

const navLinks = [
  { group: 'Academic', items: [
      { id: 'Dashboard', icon: Icons.Dashboard },
      { id: 'Schedule', icon: Icons.Schedule },
      { id: 'Exam Board', icon: Icons.ExamBoard },
      { id: 'Homeworks', icon: Icons.Homeworks },
      { id: 'Grade Report', icon: Icons.GradeReport },
      { id: 'Enrolled Courses', icon: Icons.EnrolledCourses },
      { id: 'Messages', icon: Icons.Messages },
      { id: 'Attendance', icon: Icons.Attendance },
      { id: 'Libraries', icon: Icons.Libraries },
  ]},
  { group: 'Administrative', items: [
      { id: 'Payment', icon: Icons.Payment },
      { id: 'Announcements', icon: Icons.Announcements },
      { id: 'Settings', icon: Icons.Settings },
  ]}
];

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);
  const navigate = useNavigate();

  const [studentInfo] = useState({ full_name: 'Harboula Selma' });
  
  const [myClasses] = useState([
    { id: 1, name: "English Communication – B2", instructor: "Mr. Adam Smith", color: "bg-[#C1B2DA] text-[#2A1B43]", students: 30, time: "Mon & Wed 9:00 AM", room: "Room 3" },
    { id: 2, name: "French Intermediate – B1", instructor: "Dr. Johnson", color: "bg-[#F3E5AB] text-[#4A3A17]", students: 22, time: "Tue & Thu 9:00 AM", room: "Room 2" },
    { id: 3, name: "Spanish Basics – A2", instructor: "Prof. Davis", color: "bg-[#A6C9E2] text-[#1F3340]", students: 25, time: "Fri 10:00 AM", room: "Room 5" },
    { id: 4, name: "German Beginner – A1", instructor: "Dr. Martinez", color: "bg-[#B4D9B0] text-[#23331E]", students: 27, time: "Wed 14:00 PM", room: "Room 14" },
  ]);

  const notificationsList = [
    { id: 1, text: "Your English homework was graded.", time: "2 hours ago", type: "grade" },
    { id: 2, text: "New announcement: Summer break schedule.", time: "5 hours ago", type: "announcement" },
    { id: 3, text: "Exam schedule for B1 French is out.", time: "Yesterday", type: "exam" },
  ];

  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const examBoardData = [
    { name: "Final Speaking Assessment", course: "English B2", date: "Jan 25, 2024", status: "Completed", statusCol: "text-green-500 bg-green-50" },
    { name: "Grammar & Writing Test", course: "French B1", date: "Feb 5, 2024", status: "Completed", statusCol: "text-green-500 bg-green-50" },
    { name: "Listening Comprehension", course: "German A1", date: "Apr 2, 2024", status: "Upcoming", statusCol: "text-blue-500 bg-blue-50" },
  ];

  const homeworkData = [
    { title: "English Communication", desc: "Oral Presentation", due: "Feb 10, 2024", status: "Not Submitted", color: "bg-[#C1B2DA] border-[#9b89b9] text-[#2A1B43]" },
    { title: "French Intermediate", desc: "Written Essay", due: "Mar 5, 2024", status: "Completed", color: "bg-[#F3E5AB] border-[#d4c27b] text-[#4A3A17]" },
  ];

  const handleLogout = () => navigate('/login');

  const renderMainContent = () => {
    if (activeTab === 'Enrolled Courses') return <StudentClasses />;
    if (activeTab === 'Homeworks') return <StudentHomeworks />;
    if (activeTab === 'Grade Report') return <StudentGradeReport />;
    if (activeTab === 'Announcements') return <StudentAnnouncements />;
    if (activeTab === 'Exam Board') return <ExamBoard />; 
    if (activeTab === 'Schedule') return <StudentSchedule />;
    if (activeTab === 'Settings') return <AccountSettings />; 
    if (activeTab === 'Payment') return <StudentPayment />;
    if (activeTab === 'Messages') return <StudentMessages />;
    if (activeTab === 'Attendance') return <StudentAttendance />;
    if (activeTab === 'Libraries') return <StudentLibraries />;

    return (
      <div className="flex-1 flex flex-col space-y-6 animate-fadeIn">
        <h1 className="text-[28px] font-bold text-[#1B254B]">👋 Welcome, {studentInfo.full_name}</h1>
        
        <div className="bg-[#EBE9F1] rounded-[30px] p-8 flex justify-between items-center relative overflow-hidden h-[180px] shadow-sm">
          <div className="z-10 w-2/3">
            <h2 className="text-2xl font-bold text-[#1B254B] mb-2 leading-tight">Discover Your Language Journey!</h2>
            <p className="text-[#A3AED0] text-[13px] mb-5 leading-relaxed">Improve your skills and track your progress in your enrolled languages.</p>
            <button className="bg-[#111C44] text-white px-5 py-2 rounded-lg text-sm font-bold flex items-center hover:bg-black transition-all">Learn More <span className="ml-2">→</span></button>
          </div>
          <div className="absolute right-4 top-0 bottom-0 flex items-center justify-center text-6xl">🎓📚</div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-[#1B254B]">📚 Enrolled Courses</h3>
            <button onClick={() => setActiveTab('Enrolled Courses')} className="text-[#4318FF] text-sm font-medium hover:underline">View all {'>'}</button>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {myClasses.map((cls) => (
              <div key={cls.id} className="bg-white rounded-[20px] shadow-sm border border-gray-100 flex flex-col overflow-hidden hover:shadow-md transition-all cursor-pointer group">
                <div className={`${cls.color} p-5 h-24 flex flex-col justify-center`}>
                  <h4 className="font-bold text-[13px] leading-tight mb-1">{cls.name}</h4>
                  <div className="text-[10px] font-bold opacity-80 uppercase">Instructor: {cls.instructor}</div>
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex items-center text-[11px] text-[#A3AED0] font-medium">
                    <span className="mr-2">👥</span> {cls.students} Students
                  </div>
                  <div className="flex items-center text-[11px] text-[#A3AED0] font-medium">
                    <span className="mr-2">🕒</span> {cls.time}
                  </div>
                  <div className="flex items-center text-[11px] text-[#A3AED0] font-medium">
                    <span className="mr-2">📍</span> {cls.room}
                  </div>
                  <button className="w-full mt-2 py-2 bg-[#F4F7FE] text-[#4318FF] text-[11px] font-bold rounded-xl group-hover:bg-[#4318FF] group-hover:text-white transition-all">
                    Enter Classroom
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* REFINED EXAM BOARD PREVIEW */}
        <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-lg font-bold text-[#1B254B]">📝 Exam Board Preview</h3>
            <button onClick={() => setActiveTab('Exam Board')} className="text-[#4318FF] text-sm font-medium hover:underline">View all {'>'}</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse table-fixed min-w-[600px]">
              <thead>
                <tr className="text-[#A3AED0] text-[11px] uppercase tracking-wider border-b border-gray-50">
                  <th className="py-3 pl-4 font-bold w-[35%]">Exam Name</th>
                  <th className="py-3 font-bold w-[25%]">Course</th>
                  <th className="py-3 font-bold w-[20%]">Date</th>
                  <th className="py-3 font-bold w-[20%] text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {examBoardData.map((exam, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="py-5 pl-4">
                      <span className="text-sm font-bold text-[#1B254B] block truncate">{exam.name}</span>
                    </td>
                    <td className="py-5">
                      <span className="text-sm font-medium text-[#A3AED0]">{exam.course}</span>
                    </td>
                    <td className="py-5">
                      <span className="text-sm font-medium text-[#A3AED0]">{exam.date}</span>
                    </td>
                    <td className="py-5 text-center">
                      <span className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full text-[10px] font-bold min-w-[95px] ${exam.statusCol}`}>
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
      <aside className="w-[260px] bg-[#111C44] text-[#A3AED0] flex flex-col shrink-0 z-20 shadow-2xl">
        <div className="p-6 flex items-center space-x-3 mb-2 border-b border-white/5">
          <div className="w-8 h-8 bg-white text-black rounded flex items-center justify-center font-bold text-lg">🎓</div>
          <span className="text-xl font-bold tracking-wider text-white uppercase">UTOPIA</span>
        </div>
        <nav className="px-4 space-y-1 mt-4 overflow-y-auto custom-scrollbar flex-1">
          {navLinks.map(group => (
            <div key={group.group}>
              <p className="text-[10px] font-bold text-white/30 px-4 mt-5 mb-2.5 tracking-widest uppercase">{group.group}</p>
              {group.items.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    activeTab === item.id ? 'bg-[#4318FF] text-white shadow-lg shadow-blue-900/20' : 'hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className={`mr-3.5 ${activeTab === item.id ? 'opacity-100' : 'opacity-60'}`}><item.icon /></span> 
                  {item.id}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div className="p-4 border-t border-white/5">
          <button onClick={handleLogout} className="w-full flex items-center px-4 py-2.5 text-red-400 font-bold text-sm rounded-xl hover:bg-red-500/10 transition-colors">
            <span className="mr-3.5 opacity-60"><Icons.Logout /></span> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 px-8 flex justify-between items-center bg-white/50 backdrop-blur-md border-b border-gray-100 z-30 shrink-0">
          <div className="relative w-96">
            <span className="absolute left-4 top-3 text-gray-400">
              <Icons.Search />
            </span>
            <input type="text" placeholder="Search..." className="w-full bg-white border border-gray-200 rounded-full py-2.5 pl-11 pr-4 text-sm outline-none focus:border-[#4318FF] transition-all" />
          </div>
          <div className="flex items-center space-x-6">
            <div className="relative" ref={notificationRef}>
              <div 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative cursor-pointer w-10 h-10 rounded-full flex items-center justify-center border border-gray-100 text-gray-600 transition-all ${showNotifications ? 'bg-gray-100' : 'bg-white hover:bg-gray-50'}`}
              >
                <span className="text-lg">🔔</span>
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              </div>

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-fadeIn">
                  <div className="p-4 border-b border-gray-50 flex justify-between items-center">
                    <h4 className="font-bold text-[#1B254B] text-sm">Notifications</h4>
                    <span className="text-[10px] text-[#4318FF] font-bold cursor-pointer">Mark all as read</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notificationsList.map((notif) => (
                      <div key={notif.id} className="p-4 hover:bg-gray-50 border-b border-gray-50 last:border-0 cursor-pointer transition-colors">
                        <p className="text-xs text-[#1B254B] font-medium leading-relaxed">{notif.text}</p>
                        <p className="text-[10px] text-[#A3AED0] mt-1">{notif.time}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 text-center bg-gray-50/50">
                    <button className="text-[11px] font-bold text-[#4318FF]">View all notifications</button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center pl-6 border-l border-gray-200">
              <div className="mr-3 text-right">
                <p className="text-sm font-bold text-[#1B254B]">{studentInfo.full_name}</p>
                <p className="text-[11px] text-gray-500">Student Account</p>
              </div>
              <img src="https://i.pravatar.cc/150?img=32" alt="Profile" className="w-10 h-10 rounded-full border-2 border-[#4318FF]" />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col xl:flex-row gap-6 custom-scrollbar">
          {renderMainContent()}

          {activeTab === 'Dashboard' && (
            <div className="w-full xl:w-[320px] shrink-0 flex flex-col space-y-6">
              <div className="text-right text-xs font-bold text-[#A3AED0]">Tuesday, 14 Apr 2026</div>
              
              <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-50">
                <p className="text-[10px] font-bold text-[#1B254B] mb-2 uppercase tracking-widest">Semester Progress</p>
                <div className="h-2 w-full bg-[#F4F7FE] rounded-full overflow-hidden">
                  <div className="h-full bg-[#4318FF] w-[37%] rounded-full shadow-[0_0_8px_rgba(67,24,255,0.3)]"></div>
                </div>
              </div>

              <div className="bg-white border border-gray-50 rounded-[20px] p-5 shadow-sm">
                <div className="flex justify-between items-center mb-4 font-bold text-sm">
                    <button>{'<'}</button> <span>April 2026</span> <button>{'>'}</button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-[#A3AED0] font-bold mb-3 uppercase">
                  {['Mo','Tu','We','Th','Fr','Sa','Su'].map(d => <div key={d}>{d}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-y-2 text-center text-[13px] font-bold">
                  {[...Array(30)].map((_, i) => (
                    <div key={i} className={i+1 === 14 ? "bg-[#4318FF] text-white rounded-full w-7 h-7 flex items-center justify-center mx-auto" : "py-1"}>{i+1}</div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-[#1B254B]">📋 Homeworks</h3>
                  <button onClick={() => setActiveTab('Homeworks')} className="text-[#4318FF] text-xs font-bold hover:underline">View all {'>'}</button>
                </div>
                <div className="space-y-3">
                  {homeworkData.map((hw, idx) => (
                    <div key={idx} className={`p-4 rounded-[18px] border-l-[6px] shadow-sm transition-transform hover:scale-[1.02] ${hw.color}`}>
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="text-[13px] font-bold truncate pr-2">{hw.title}</h4>
                        <span className="text-[9px] font-black uppercase opacity-60 shrink-0">{hw.status}</span>
                      </div>
                      <p className="text-[11px] font-medium mb-3 opacity-90 leading-tight">{hw.desc}</p>
                      <p className="text-[10px] font-bold opacity-70">Due: {hw.due}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
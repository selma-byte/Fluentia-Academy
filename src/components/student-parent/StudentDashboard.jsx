import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

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
  const navigate = useNavigate();

  // 💡 States الحقيقية
  const [studentInfo, setStudentInfo] = useState({ full_name: 'Loading...', role: 'Student Account', level: '' });
  const [currentUser, setCurrentUser] = useState(null);
  const [myClasses, setMyClasses] = useState([]);
  const [examBoardData, setExamBoardData] = useState([]); 
  
  // 💡 الإشعارات
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsList, setNotificationsList] = useState([]);
  
  const notificationRef = useRef(null);

  // Homeworks (ستاتيك مؤقتاً)
  const homeworkData = [
    { title: "Course Assignment", desc: "Project Presentation", due: "Feb 10, 2026", status: "Pending", color: "border-[#C1B2DA]" },
    { title: "Written Exercise", desc: "Grammar Essay", due: "Mar 5, 2026", status: "Submitted", color: "border-[#F3E5AB]" },
  ];

  // ==========================================
  // 💡 Fetch dynamic data from Supabase
  // ==========================================
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (user && user.email) {
          // 1. جلب بيانات الطالب
          const { data: studentData } = await supabase
            .from('students')
            .select('*')
            .eq('email', user.email)
            .single();

          if (studentData) {
            setCurrentUser(studentData);
            setStudentInfo({ 
              full_name: `${studentData.first_name || ''} ${studentData.last_name || ''}`.trim(), 
              role: 'Student Account',
              level: studentData.level || 'Enrolled Student'
            });

            // 💡 2. جلب قسم الطالب بالضبط (حسب group_name)
            if (studentData.group_name) {
              const { data: classData } = await supabase
                .from('classes')
                .select('*')
                .eq('name', studentData.group_name); // الفلترة باسم الڨروب حصراً

              if (classData && classData.length > 0) {
                const colors = ['bg-[#C1B2DA]', 'bg-[#F3E5AB]', 'bg-[#A6C9E2]', 'bg-[#B4D9B0]'];
                const formattedClasses = classData.map((cls, index) => ({
                  id: cls.id,
                  name: cls.name || cls.class_name || studentData.group_name,
                  instructor: cls.teacher_name || "Assigned Teacher",
                  color: colors[index % colors.length],
                  students: cls.capacity || 20,
                  time: cls.schedule || "Mon & Wed 09:00", 
                  platform: "In-Person Learning"
                }));
                setMyClasses(formattedClasses);
              }
            }

            // 💡 3. جلب الامتحانات (حسب اللغة والمستوى)
            if (studentData.language && studentData.level) {
              const { data: examData } = await supabase
                .from('exams')
                .select('*')
                .ilike('language', `%${studentData.language}%`)
                .eq('level', studentData.level);

              if (examData && examData.length > 0) {
                const formattedExams = examData.map(ex => ({
                  id: ex.id,
                  name: ex.title || ex.exam_name || "Scheduled Exam",
                  course: `Level ${ex.level || studentData.level}`,
                  date: new Date(ex.date || ex.created_at).toLocaleDateString(),
                  status: ex.status || "Pending",
                  statusCol: ex.status === 'Completed' ? "text-green-500 bg-green-50" : "text-orange-500 bg-orange-50"
                }));
                setExamBoardData(formattedExams);
              }
            }
          }

          // 4. جلب الإشعارات (فلترة للطلاب فقط)
          const { data: commsData } = await supabase
            .from('communications')
            .select('*')
            .in('type', ['announcement', 'notification', 'emergency'])
            .order('created_at', { ascending: false });

          if (commsData) {
            const myNotifs = commsData.filter(c => {
              const target = c.recipient_name?.toLowerCase() || '';
              return target.includes('students') || target.includes('all community');
            });
            setNotificationsList(myNotifs);
            setUnreadCount(myNotifs.length); 
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchStudentData();
  }, []);

  // Click outside close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const renderMainContent = () => {
    if (activeTab === 'My Learning') {
      return (
        <div className="flex-1 flex flex-col space-y-6 min-w-0">
          <div className="flex items-center space-x-8 border-b border-gray-100 mb-2">
            {['Courses', 'Libraries', 'Schedule'].map((tab) => (
              <button key={tab} onClick={() => setLearningSubTab(tab)} className={`pb-4 text-sm font-bold transition-all relative ${learningSubTab === tab ? 'text-[#4318FF]' : 'text-[#A3AED0] hover:text-[#1B254B]'}`}>
                {tab}
                {learningSubTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#4318FF] rounded-t-full shadow-md"></div>}
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
          <div className="flex items-center space-x-8 border-b border-gray-100 mb-2 overflow-x-auto custom-scrollbar shrink-0">
            {['Attendance', 'Homeworks', 'Grade Report', 'Exam Board', 'Announcements'].map((tab) => (
              <button key={tab} onClick={() => setTasksSubTab(tab)} className={`pb-4 text-sm font-bold transition-all relative whitespace-nowrap ${tasksSubTab === tab ? 'text-[#4318FF]' : 'text-[#A3AED0] hover:text-[#1B254B]'}`}>
                {tab}
                {tasksSubTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#4318FF] rounded-t-full"></div>}
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

    if (activeTab === 'Messages') return <StudentMessages />;
    if (activeTab === 'Payment') return <StudentPayment />;
    if (activeTab === 'Settings') return <AccountSettings />;

    // Dashboard View
    return (
      <div className="flex-1 flex flex-col space-y-10 animate-fadeIn pr-2">
        <div className="flex flex-col space-y-1">
          <p className="text-[#A3AED0] text-sm font-black tracking-widest uppercase opacity-60">Overview</p>
          <h1 className="text-3xl font-black text-[#1B254B] uppercase tracking-tighter italic">Welcome, {studentInfo.full_name}</h1>
        </div>
        
        <div className="bg-[#EBE9F1] rounded-[45px] px-12 py-14 flex justify-between items-center relative overflow-hidden shadow-sm">
          <div className="z-10 w-full md:w-3/5">
            <h2 className="text-4xl font-black text-[#1B254B] mb-5 leading-tight uppercase tracking-tighter">Elevate Your Language Path</h2>
            <p className="text-[#1B254B]/60 text-base mb-10 leading-relaxed max-w-md font-bold uppercase tracking-widest opacity-80">Access synchronized modules, download academic assets, and track your global proficiency level.</p>
            <button className="bg-[#111C44] text-white px-10 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all active:scale-95">Explore Curriculum</button>
          </div>
          <div className="absolute right-[-20px] bottom-[-20px] opacity-10 text-[260px] font-black pointer-events-none select-none italic">F</div>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-end">
            <h3 className="text-xl font-black text-[#1B254B] uppercase tracking-widest italic">My Enrolled Classes</h3>
            <button onClick={() => { setActiveTab('My Learning'); setLearningSubTab('Courses'); }} className="text-[#4318FF] text-[11px] font-black hover:underline uppercase tracking-widest">Browse catalog</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {myClasses.length > 0 ? myClasses.map((cls) => (
              <div key={cls.id} className="bg-white rounded-[40px] shadow-sm border border-gray-100 flex flex-col overflow-hidden hover:shadow-2xl transition-all duration-500 group">
                <div className={`${cls.color} p-10 h-32 flex flex-col justify-center`}>
                  <h4 className="font-black text-[18px] text-[#1B254B] leading-tight line-clamp-1 uppercase italic">{cls.name}</h4>
                  <div className="text-[10px] font-black text-[#1B254B]/50 mt-2 uppercase">{cls.instructor}</div>
                </div>
                <div className="p-10 space-y-6">
                  <div className="flex items-center text-[12px] text-[#A3AED0] font-black uppercase tracking-widest"><span className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center mr-5 text-[#1B254B] italic">#</span> {cls.students} Enrolled</div>
                  <div className="flex items-center text-[12px] text-[#A3AED0] font-black uppercase tracking-widest"><span className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center mr-5 text-[#1B254B] italic">@</span> {cls.time}</div>
                  <button className="w-full mt-4 py-5 bg-[#F4F7FE] text-[#4318FF] text-[11px] font-black rounded-2xl group-hover:bg-[#4318FF] group-hover:text-white transition-all uppercase tracking-widest shadow-sm">View Materials</button>
                </div>
              </div>
            )) : (
               <div className="col-span-2 bg-white rounded-[40px] p-10 text-center text-gray-400 border border-dashed">No classes found for your group.</div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-[45px] p-10 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-black text-[#1B254B] uppercase tracking-widest">My Exams Schedule</h3>
            <button onClick={() => { setActiveTab('Classroom Tasks'); setTasksSubTab('Exam Board'); }} className="text-[#4318FF] text-[11px] font-black hover:underline uppercase">Full Schedule</button>
          </div>
          {examBoardData.length > 0 ? (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left table-fixed min-w-[700px]">
                <thead>
                  <tr className="text-[#A3AED0] text-[10px] font-black uppercase border-b border-gray-100">
                    <th className="pb-6 pl-4 w-[40%]">Evaluation Profile</th>
                    <th className="pb-6 w-[25%]">Certified Path</th>
                    <th className="pb-6 w-[20%]">Deadline</th>
                    <th className="pb-6 w-[15%] text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {examBoardData.map((exam, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50 transition-all">
                      <td className="py-7 pl-4 font-black text-[#1B254B] text-[15px] uppercase">{exam.name}</td>
                      <td className="py-7 text-[#707EAE] text-xs font-black uppercase">{exam.course}</td>
                      <td className="py-7 text-[#707EAE] text-xs font-black uppercase italic">{exam.date}</td>
                      <td className="py-7 text-center">
                        <span className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase border shadow-sm ${exam.statusCol}`}>{exam.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-6 text-gray-400 font-bold uppercase text-xs">No exams scheduled for your level.</div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-[#F4F7FE] font-sans text-[#1B254B] overflow-hidden">
      <aside className="w-[300px] bg-[#0B132B] text-[#A3AED0] flex flex-col shrink-0 z-20 shadow-2xl h-full">
        <div className="p-10 flex items-center space-x-4 shrink-0">
          <div className="w-11 h-11 bg-[#4318FF] text-white rounded-2xl flex items-center justify-center font-black text-2xl shadow-xl italic">F</div>
          <span className="text-xl font-black tracking-tighter text-white uppercase italic">FLUENTIA</span>
        </div>
        <nav className="px-6 space-y-2 mt-6 overflow-y-auto custom-scrollbar flex-1 pb-10">
          {navLinks.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center px-6 py-4.5 rounded-[22px] text-[13px] font-black uppercase transition-all ${activeTab === item.id ? 'bg-[#4318FF] text-white shadow-2xl' : 'hover:bg-white/5 hover:text-white opacity-60'}`}>
              <span className="mr-5"><item.icon /></span> {item.id}
            </button>
          ))}
        </nav>
        <div className="p-8 border-t border-white/5 shrink-0">
          <button onClick={handleLogout} className="w-full flex items-center px-6 py-5 text-red-400 font-black text-[11px] uppercase rounded-2xl hover:bg-red-500/10 transition-colors">
            <span className="mr-5"><Icons.Logout /></span> Exit Portal
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="h-24 px-12 flex justify-between items-center bg-white/80 backdrop-blur-md border-b border-gray-100 shrink-0 z-10">
          <div className="relative w-full max-w-lg">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 font-black uppercase tracking-widest text-[9px]">Search</span>
            <input type="text" placeholder="Access Academic Archives..." className="w-full bg-[#F4F7FE] border-none rounded-2xl py-3.5 pl-20 pr-6 text-sm font-bold outline-none" />
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative" ref={notificationRef}>
              <button onClick={() => { setShowNotifications(!showNotifications); setUnreadCount(0); }} className={`relative z-50 w-12 h-12 flex items-center justify-center rounded-2xl transition-all shadow-sm border border-gray-50 ${showNotifications ? 'bg-[#4318FF] text-white' : 'bg-[#F4F7FE] text-gray-600 hover:bg-white'}`}>
                <Icons.Bell />
                {unreadCount > 0 && <span className="absolute top-3 right-3 min-w-[10px] h-[10px] bg-[#E31A1A] rounded-full border-2 border-white animate-pulse"></span>}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-4 w-[380px] bg-white rounded-[35px] shadow-2xl border border-gray-100 p-6 z-50 animate-fadeInUp">
                  <div className="flex justify-between items-center mb-6">
                      <h4 className="text-sm font-black text-[#1B254B] uppercase tracking-widest">Inbox Alerts</h4>
                      <span onClick={() => setShowNotifications(false)} className="text-[10px] font-black text-[#4318FF] uppercase cursor-pointer hover:underline">Close</span>
                  </div>
                  <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
                      {notificationsList.length > 0 ? notificationsList.map(n => (
                        <div key={n.id} className="p-5 rounded-3xl border bg-white hover:bg-gray-50 transition-all cursor-pointer">
                            <p className="text-[12px] font-black text-[#1B254B] uppercase tracking-tight">{n.subject || 'Announcement'}</p>
                            <p className="text-[10px] text-gray-500 mb-2 line-clamp-2">{n.content}</p>
                            <p className="text-[9px] font-black text-[#A3AED0] uppercase">{new Date(n.created_at).toLocaleDateString()}</p>
                        </div>
                      )) : (
                        <div className="p-8 text-center text-gray-400 font-bold uppercase tracking-widest">No new alerts</div>
                      )}
                  </div>
                  <button onClick={() => { setActiveTab('Classroom Tasks'); setTasksSubTab('Announcements'); setShowNotifications(false); }} className="w-full mt-6 py-4 bg-[#F4F7FE] text-[#4318FF] text-[10px] font-black rounded-2xl uppercase hover:bg-[#4318FF] hover:text-white transition-all">View All Activity</button>
                </div>
              )}
            </div>

            <div className="flex items-center pl-6 border-l border-gray-200 group cursor-pointer" onClick={() => setActiveTab('Settings')}>
              <div className="mr-5 text-right">
                <p className="text-sm font-black text-[#1B254B] uppercase italic leading-none">{studentInfo.full_name}</p>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1 opacity-70">{studentInfo.level}</p>
              </div>
              <div className="relative">
                <img src="https://i.pravatar.cc/150?img=32" alt="Profile" className="w-14 h-14 rounded-2xl border-4 border-white shadow-xl" />
                <div className="absolute bottom-[-2px] right-[-2px] w-4 h-4 bg-[#01B574] rounded-full border-2 border-white shadow-sm"></div>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-12 py-12 custom-scrollbar flex flex-col xl:flex-row gap-12">
          <div className="flex-1 min-w-0">{renderMainContent()}</div>

          {activeTab === 'Dashboard' && (
            <aside className="w-full xl:w-[350px] shrink-0 flex flex-col space-y-10">
              {/* Calendar */}
              <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-50 flex flex-col items-center">
                <h4 className="font-black text-[#1B254B] text-[14px] uppercase italic mb-8">{new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })}</h4>
                <div className="w-full grid grid-cols-7 gap-y-3 text-center text-[12px] font-bold text-[#1B254B]">
                  {['M','T','W','T','F','S','S'].map(d => <div key={d} className="text-[#A3AED0] text-[10px] font-black">{d}</div>)}
                  {[...Array(30)].map((_, i) => (
                    <div key={i} className={`flex items-center justify-center h-8 w-full ${i+1 === new Date().getDate() ? 'bg-[#4318FF] text-white rounded-xl shadow-lg' : 'opacity-40'}`}>{i+1}</div>
                  ))}
                </div>
              </div>

              {/* Task Snip */}
              <div className="space-y-8">
                <h3 className="text-xl font-black text-[#1B254B] uppercase italic px-4">Task Hub</h3>
                <div className="space-y-5">
                  {homeworkData.map((hw, idx) => (
                    <div key={idx} className={`p-8 bg-white rounded-[40px] border-l-[10px] shadow-sm ${hw.color}`}>
                      <h4 className="text-[14px] font-black text-[#1B254B] uppercase mb-4">{hw.title}</h4>
                      <p className="text-[12px] font-bold text-[#A3AED0] mb-6 uppercase leading-relaxed">{hw.desc}</p>
                      <div className="text-[10px] font-black text-[#1B254B] uppercase tracking-widest bg-gray-50 px-4 py-2 rounded-xl inline-block">Due: {hw.due}</div>
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
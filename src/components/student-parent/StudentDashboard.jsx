import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

// Import sub-components — UNCHANGED
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

// ─── SVG Icon System ───────────────────────────────────────────────────────────
const Icons = {
  Dashboard: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>
    </svg>
  ),
  Learning: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  ),
  Tasks: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
    </svg>
  ),
  Messages: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  Payment: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
    </svg>
  ),
  Settings: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
  Logout: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  Search: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  Bell: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  ),
  ChevronRight: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
  Globe: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  ),
  BookOpen: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
  ),
  Calendar: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  Clock: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  Users: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  Award: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="7"/>
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
    </svg>
  ),
};

// ─── School Logo ───────────────────────────────────────────────────────────────
const SchoolLogo = () => {
  const [branding, setBranding] = useState({ logo: null, name: 'POLYGLOT ACADEMY' });

  useEffect(() => {
    const fetchBranding = async () => {
      try {
        const { data, error } = await supabase
          .from('school_settings')
          .select('logo, name')
          .eq('id', 1)
          .single();

        if (data && !error) {
          setBranding({
            logo: data.logo,
            name: data.name || 'POLYGLOT ACADEMY'
          });
        }
      } catch (err) {
        console.error("Error fetching school branding:", err);
      }
    };
    fetchBranding();
  }, []);

  const nameParts = branding.name.split(' ');
  const topName = nameParts[0] || 'POLYGLOT';
  const bottomName = nameParts.slice(1).join(' ') || 'ACADEMY';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      
      {branding.logo ? (
        <img 
          src={branding.logo} 
          alt="School Logo" 
          style={{
            width: 36, height: 36,
            borderRadius: 10,
            objectFit: 'contain',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            boxShadow: '0 4px 12px rgba(67,24,255,0.4)',
            flexShrink: 0
          }} 
        />
      ) : (
        <div style={{
          width: 36, height: 36,
          background: 'linear-gradient(135deg, #4318FF 0%, #6B47FF 100%)',
          borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(67,24,255,0.4)',
          flexShrink: 0,
          position: 'relative' 
        }}>
          <svg style={{ position: 'absolute' }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="2" y1="12" x2="22" y2="12"/>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
        </div>
      )}

      <div>
        <p style={{ color: '#fff', fontSize: 13, fontWeight: 800, letterSpacing: '0.04em', lineHeight: 1.1, textTransform: 'uppercase' }}>
          {topName}
        </p>
        <p style={{ color: '#818cf8', fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          {bottomName}
        </p>
      </div>
    </div>
  );
};

// ─── Nav config ───────────────────────────────────────────────────────────────
const navLinks = [
  { id: 'Dashboard',       icon: Icons.Dashboard },
  { id: 'My Learning',     icon: Icons.Learning  },
  { id: 'Classroom Tasks', icon: Icons.Tasks     },
  { id: 'Messages',        icon: Icons.Messages  },
  { id: 'Payment',         icon: Icons.Payment   },
  { id: 'Settings',        icon: Icons.Settings  },
];

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, badge, badgeColor, icon: Icon, iconBg }) => (
  <div style={{
    background: '#fff',
    borderRadius: 16,
    padding: '20px 24px',
    border: '1px solid #f1f5f9',
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
    display: 'flex', flexDirection: 'column', gap: 8,
    flex: 1, minWidth: 0,
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div style={{
        width: 40, height: 40, borderRadius: 12,
        background: iconBg || '#EEF2FF',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#4318FF',
      }}>
        <Icon />
      </div>
      {badge && (
        <span style={{
          fontSize: 11, fontWeight: 700,
          color: badgeColor === 'green' ? '#059669' : badgeColor === 'blue' ? '#4318FF' : '#f59e0b',
          background: badgeColor === 'green' ? '#ecfdf5' : badgeColor === 'blue' ? '#eef2ff' : '#fffbeb',
          padding: '2px 8px', borderRadius: 20,
        }}>{badge}</span>
      )}
    </div>
    <p style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
    <p style={{ fontSize: 26, fontWeight: 800, color: '#1e293b', lineHeight: 1 }}>{value}</p>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const StudentDashboard = () => {
  const [activeTab, setActiveTab]           = useState('Dashboard');
  const [learningSubTab, setLearningSubTab] = useState('Courses');
  const [tasksSubTab, setTasksSubTab]       = useState('Attendance');
  const navigate = useNavigate();

  const [studentInfo, setStudentInfo]         = useState({ full_name: 'Loading...', role: 'Student Account', level: '' });
  const [currentUser, setCurrentUser]         = useState(null);
  const [myClasses, setMyClasses]             = useState([]);
  const [examBoardData, setExamBoardData]     = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount]         = useState(0);
  const [notificationsList, setNotificationsList] = useState([]);
  const notificationRef = useRef(null);

  // 💡 States for the Justification Modal
  const [isJustifyModalOpen, setIsJustifyModalOpen] = useState(false);
  const [justifyData, setJustifyData] = useState({ date: '', reason: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const homeworkData = [
    { title: "Course Assignment", desc: "Project Presentation",  due: "Feb 10, 2026", status: "Pending",   color: "#6366f1" },
    { title: "Written Exercise",  desc: "Grammar Essay",         due: "Mar 5, 2026",  status: "Submitted", color: "#f59e0b" },
  ];

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user && user.email) {
          
          const { data: studentData } = await supabase
            .from('students')
            .select(`
              *,
              inscriptions ( id, groupe, cours ( langue ) )
            `)
            .eq('email', user.email)
            .single();

          if (studentData) {
            setCurrentUser(studentData);
            setStudentInfo({
              full_name: `${studentData.first_name || ''} ${studentData.last_name || ''}`.trim(),
              role: 'Student Account',
              level: studentData.level || 'Enrolled Student'
            });

            const activeGroups = studentData.inscriptions?.map(i => i.groupe) || [];
            
            if (activeGroups.length > 0) {
              const { data: classData } = await supabase
                .from('classes')
                .select('*')
                .in('name', activeGroups);

              if (classData && classData.length > 0) {
                const colors = ['#EEF2FF', '#FFF7ED', '#ECFDF5', '#F0F9FF'];
                const accents = ['#4318FF', '#f59e0b', '#059669', '#0284c7'];
                
                const formattedClasses = classData.map((cls, index) => ({
                  id: cls.id,
                  name: cls.language ? `${cls.language} (${cls.level})` : cls.name,
                  instructor: cls.teacher_name || "Assigned Teacher",
                  color: colors[index % colors.length],
                  accent: accents[index % accents.length],
                  students: cls.capacity || 20,
                  time: cls.schedule || "Mon & Wed 09:00",
                  platform: "In-Person Learning",
                  rawName: cls.name
                }));
                setMyClasses(formattedClasses);
              }
            }

            const activeLanguages = studentData.inscriptions?.map(i => i.cours?.langue) || [studentData.language];
            if (activeLanguages.length > 0 && studentData.level) {
              const { data: examData } = await supabase
                .from('exams')
                .select('*')
                .in('language', activeLanguages)
                .eq('level', studentData.level);

              if (examData && examData.length > 0) {
                const formattedExams = examData.map(ex => ({
                  id: ex.id,
                  name: ex.title || ex.exam_name || "Scheduled Exam",
                  course: ex.language,
                  date: new Date(ex.date || ex.created_at).toLocaleDateString(),
                  status: ex.status || "Pending",
                  statusCol: ex.status === 'Completed' ? "completed" : "pending"
                }));
                setExamBoardData(formattedExams);
              }
            }
          }

          const { data: commsData } = await supabase
            .from('communications')
            .select('*')
            .in('type', ['announcement', 'notification', 'emergency'])
            .order('created_at', { ascending: false });

          if (commsData) {
            const myNotifs = commsData.filter(c => {
              const target = c.recipient_name?.toLowerCase() || '';
              return target.includes('students') || target.includes('all community') || c.recipient_id == user.id || c.recipient_id == studentData?.id;
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

  const submitJustification = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (!currentUser) throw new Error("User not found");
      
      const { error } = await supabase.from('communications').insert([{
        type: 'notification',
        subject: `Absence Justification: ${studentInfo.full_name} (${justifyData.date})`,
        content: justifyData.reason,
        sender_id: currentUser.id,
        sender_role: 'student',
        recipient_name: 'Admin / Secretary',
        recipient_id: 'all'
      }]);
      
      if (error) throw error;
      
      alert("✅ Justification submitted successfully. The administration will review it.");
      setIsJustifyModalOpen(false);
      setJustifyData({date: '', reason: ''});
    } catch (err) {
      alert("❌ Error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const today     = new Date();
  const todayDate = today.getDate();
  const monthName = today.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  const firstDay  = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
  const offset    = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

  const renderMainContent = () => {
    if (activeTab === 'My Learning') {
      return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0 }}>
          <div style={{ display: 'flex', gap: 28, borderBottom: '1px solid #f1f5f9', marginBottom: 28 }}>
            {['Courses', 'Libraries', 'Schedule'].map(tab => (
              <button key={tab} onClick={() => setLearningSubTab(tab)} style={{
                paddingBottom: 14, fontSize: 13, fontWeight: 700,
                color: learningSubTab === tab ? '#4318FF' : '#94a3b8',
                background: 'none', border: 'none', cursor: 'pointer',
                borderBottom: learningSubTab === tab ? '2px solid #4318FF' : '2px solid transparent',
                marginBottom: -1, transition: 'all .2s',
              }}>{tab}</button>
            ))}
          </div>
          {learningSubTab === 'Courses'   && <StudentCourses />}
          {learningSubTab === 'Libraries' && <StudentLibraries />}
          {learningSubTab === 'Schedule'  && <StudentSchedule />}
        </div>
      );
    }

    if (activeTab === 'Classroom Tasks') {
      return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0 }}>
          <div style={{ display: 'flex', gap: 24, borderBottom: '1px solid #f1f5f9', marginBottom: 28, overflowX: 'auto' }}>
            {['Attendance', 'Homeworks', 'Grade Report', 'Exam Board', 'Announcements'].map(tab => (
              <button key={tab} onClick={() => setTasksSubTab(tab)} style={{
                paddingBottom: 14, fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap',
                color: tasksSubTab === tab ? '#4318FF' : '#94a3b8',
                background: 'none', border: 'none', cursor: 'pointer',
                borderBottom: tasksSubTab === tab ? '2px solid #4318FF' : '2px solid transparent',
                marginBottom: -1, transition: 'all .2s',
              }}>{tab}</button>
            ))}
          </div>
          {tasksSubTab === 'Attendance'   && <StudentAttendance />}
          {tasksSubTab === 'Homeworks'    && <StudentHomeworks />}
          {tasksSubTab === 'Grade Report' && <StudentGradeReport />}
          {tasksSubTab === 'Exam Board'   && <ExamBoard />}
          {tasksSubTab === 'Announcements'&& <StudentAnnouncements />}
        </div>
      );
    }

    if (activeTab === 'Messages') return <StudentMessages />;
    if (activeTab === 'Payment')  return <StudentPayment />;
    if (activeTab === 'Settings') return <AccountSettings />;

    const needsGroup = currentUser && (!currentUser.inscriptions || currentUser.inscriptions.length === 0) && currentUser.status === 'Pending Group';

    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 28 }}>

        {needsGroup && (
          <div style={{
             background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
             borderRadius: 16, padding: '24px 32px', color: '#fff',
             boxShadow: '0 10px 25px rgba(16,185,129,0.3)', position: 'relative', overflow: 'hidden'
          }}>
             <span style={{ position: 'absolute', top: -20, right: -10, fontSize: 100, opacity: 0.2 }}>🏆</span>
             <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>🎉 Congratulations, {studentInfo.full_name}!</h2>
             <p style={{ margin: '8px 0 0', fontSize: 14, opacity: 0.9, maxWidth: '80%', lineHeight: 1.5 }}>
                You have successfully passed your previous level! You are now officially promoted to <strong>Level {studentInfo.level}</strong>.<br/>
                The administration will assign you to a new group shortly. Get ready for the next challenge! 🚀
             </p>
          </div>
        )}

        <div>
          <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 4 }}>
            {today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1e293b', margin: 0 }}>
            Welcome back, {studentInfo.full_name}
          </h1>
          <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
            Here's a snapshot of your academic progress today.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 16 }}>
          <StatCard label="My Classes" value={myClasses.length || 0} badge="+Active" badgeColor="blue" icon={Icons.BookOpen} iconBg="#EEF2FF" />
          <StatCard label="Exams Scheduled" value={examBoardData.length || 0} badge="View All" badgeColor="green" icon={Icons.Award} iconBg="#ECFDF5" />
          <StatCard label="Pending Tasks" value={homeworkData.filter(h => h.status === 'Pending').length} badge="Due Soon" badgeColor="orange" icon={Icons.Tasks} iconBg="#FFF7ED" />
        </div>

        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: '#1e293b', margin: 0 }}>My Enrolled Classes</h2>
            <button onClick={() => { setActiveTab('My Learning'); setLearningSubTab('Courses'); }}
              style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 700, color: '#4318FF', background: 'none', border: 'none', cursor: 'pointer' }}>
              Browse Catalog <Icons.ChevronRight />
            </button>
          </div>

          {myClasses.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
              {myClasses.map(cls => (
                <div key={cls.id} style={{
                  border: '1px solid #f1f5f9', borderRadius: 14, overflow: 'hidden',
                  transition: 'box-shadow .2s', cursor: 'pointer',
                }}>
                  <div style={{ background: cls.color, padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
                    <p style={{ fontSize: 13, fontWeight: 800, color: '#1e293b', margin: 0 }}>{cls.name}</p>
                    <p style={{ fontSize: 11, color: '#64748b', margin: '4px 0 0' }}>{cls.instructor}</p>
                  </div>
                  <div style={{ padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#64748b', fontSize: 12 }}>
                      <Icons.Users /> <span>{cls.students} students enrolled</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#64748b', fontSize: 12 }}>
                      <Icons.Clock /> <span>{cls.time}</span>
                    </div>
                    <button style={{
                      marginTop: 8, padding: '8px 0', borderRadius: 8, border: '1px solid #e0e7ff',
                      background: '#f5f3ff', color: '#4318FF', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                    }}>View Materials</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '32px 0', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
              {needsGroup ? "الرجاء الانتظار ريثما يتم تعيينك في الفوج الجديد." : "No classes found for your account."}
            </div>
          )}
        </div>

        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: '#1e293b', margin: 0 }}>Exam Schedule</h2>
            <button onClick={() => { setActiveTab('Classroom Tasks'); setTasksSubTab('Exam Board'); }}
              style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 700, color: '#4318FF', background: 'none', border: 'none', cursor: 'pointer' }}>
              Full Schedule <Icons.ChevronRight />
            </button>
          </div>

          {examBoardData.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    {['Exam', 'Course', 'Date', 'Status'].map(h => (
                      <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {examBoardData.map((exam, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f8fafc' }}>
                      <td style={{ padding: '12px', fontWeight: 700, color: '#1e293b' }}>{exam.name}</td>
                      <td style={{ padding: '12px', color: '#64748b' }}>{exam.course}</td>
                      <td style={{ padding: '12px', color: '#64748b' }}>{exam.date}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                          background: exam.statusCol === 'completed' ? '#ecfdf5' : '#fff7ed',
                          color:      exam.statusCol === 'completed' ? '#059669' : '#f59e0b',
                        }}>{exam.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 13, padding: '24px 0' }}>No exams scheduled for your level.</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f8fafc', fontFamily: "'Inter', 'Segoe UI', sans-serif", overflow: 'hidden' }}>
      <aside style={{ width: 240, background: '#0f172a', display: 'flex', flexDirection: 'column', flexShrink: 0, height: '100%', zIndex: 20 }}>
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <SchoolLogo />
        </div>
        <nav style={{ flex: 1, padding: '12px 12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {navLinks.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button key={item.id} onClick={() => setActiveTab(item.id)} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 14px', borderRadius: 10, border: 'none', cursor: 'pointer',
                fontSize: 13, fontWeight: 600, textAlign: 'left', transition: 'all .15s',
                background: isActive ? '#4318FF' : 'transparent',
                color: isActive ? '#fff' : '#94a3b8',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#e2e8f0'; }}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8'; } }}>
                <span style={{ flexShrink: 0 }}><item.icon /></span>
                {item.id}
              </button>
            );
          })}
        </nav>
        <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button onClick={handleLogout} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 14px', borderRadius: 10, border: 'none', cursor: 'pointer',
            fontSize: 13, fontWeight: 600, color: '#f87171', background: 'transparent', transition: 'all .15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.08)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
            <Icons.Logout /> Log Out
          </button>
        </div>
      </aside>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        <header style={{ height: 64, padding: '0 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', borderBottom: '1px solid #f1f5f9', flexShrink: 0, zIndex: 10 }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: 400 }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}><Icons.Search /></span>
            <input type="text" placeholder="Search students, classes, or resources..."
              style={{ width: '100%', background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: 10, padding: '9px 14px 9px 40px', fontSize: 13, color: '#1e293b', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ position: 'relative' }} ref={notificationRef}>
              <button onClick={() => { setShowNotifications(!showNotifications); setUnreadCount(0); }}
                style={{ width: 38, height: 38, borderRadius: 10, border: '1px solid #f1f5f9', background: showNotifications ? '#4318FF' : '#f8fafc', color: showNotifications ? '#fff' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative', transition: 'all .15s' }}>
                <Icons.Bell />
                {unreadCount > 0 && <span style={{ position: 'absolute', top: 8, right: 8, width: 8, height: 8, background: '#ef4444', borderRadius: '50%', border: '2px solid #fff' }} />}
              </button>
              {showNotifications && (
                <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 10px)', width: 340, background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', boxShadow: '0 8px 32px rgba(0,0,0,0.10)', padding: 20, zIndex: 50 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <h4 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#1e293b' }}>Inbox Alerts</h4>
                    <span onClick={() => setShowNotifications(false)} style={{ fontSize: 12, fontWeight: 700, color: '#4318FF', cursor: 'pointer' }}>Clear All</span>
                  </div>
                  <div style={{ maxHeight: 320, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {notificationsList.length > 0 ? notificationsList.map(n => (
                      <div key={n.id} style={{ padding: '12px 14px', borderRadius: 10, border: '1px solid #f1f5f9', cursor: 'pointer', transition: 'background .15s' }}>
                        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{n.subject || 'Announcement'}</p>
                        <p style={{ margin: '4px 0 0', fontSize: 12, color: '#64748b', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{n.content}</p>
                        <p style={{ margin: '6px 0 0', fontSize: 11, color: '#94a3b8' }}>{new Date(n.created_at).toLocaleDateString()}</p>
                      </div>
                    )) : (
                      <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 13, padding: '20px 0' }}>No new alerts</p>
                    )}
                  </div>
                  <button onClick={() => { setActiveTab('Classroom Tasks'); setTasksSubTab('Announcements'); setShowNotifications(false); }}
                    style={{ width: '100%', marginTop: 14, padding: '10px 0', borderRadius: 10, border: '1px solid #e0e7ff', background: '#f5f3ff', color: '#4318FF', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>View All Announcements</button>
                </div>
              )}
            </div>
            <div style={{ width: 1, height: 32, background: '#f1f5f9' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => setActiveTab('Settings')}>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{studentInfo.full_name}</p>
                <p style={{ margin: 0, fontSize: 11, color: '#94a3b8' }}>{studentInfo.level || 'Student'}</p>
              </div>
              <div style={{ position: 'relative' }}>
                <img src="https://i.pravatar.cc/150?img=32" alt="Profile" style={{ width: 38, height: 38, borderRadius: 10, objectFit: 'cover', display: 'block' }} />
                <div style={{ position: 'absolute', bottom: -2, right: -2, width: 10, height: 10, background: '#22c55e', borderRadius: '50%', border: '2px solid #fff' }} />
              </div>
            </div>
          </div>
        </header>

        <div style={{ flex: 1, overflowY: 'auto', padding: 28, display: 'flex', gap: 24 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            {renderMainContent()}
          </div>
          {activeTab === 'Dashboard' && (
            <aside style={{ width: 280, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h4 style={{ margin: 0, fontSize: 13, fontWeight: 800, color: '#1e293b' }}>{monthName}</h4>
                  <Icons.Calendar />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, textAlign: 'center' }}>
                  {['M','T','W','T','F','S','S'].map((d, i) => (
                    <div key={i} style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', paddingBottom: 8 }}>{d}</div>
                  ))}
                  {Array.from({ length: offset }).map((_, i) => <div key={'e'+i} />)}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const isToday = day === todayDate;
                    return (
                      <div key={day} style={{ height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: isToday ? 800 : 500, borderRadius: 6, background: isToday ? '#4318FF' : 'transparent', color: isToday ? '#fff' : '#1e293b', opacity: isToday ? 1 : 0.7, cursor: 'default' }}>{day}</div>
                    );
                  })}
                </div>
              </div>
              <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h4 style={{ margin: 0, fontSize: 13, fontWeight: 800, color: '#1e293b' }}>Task Hub</h4>
                  <button onClick={() => { setActiveTab('Classroom Tasks'); setTasksSubTab('Homeworks'); }} style={{ fontSize: 11, fontWeight: 700, color: '#4318FF', background: 'none', border: 'none', cursor: 'pointer' }}>View All</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {homeworkData.map((hw, idx) => (
                    <div key={idx} style={{ padding: '12px 14px', borderRadius: 12, border: '1px solid #f1f5f9', borderLeft: `3px solid ${hw.color}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                        <p style={{ margin: 0, fontSize: 12, fontWeight: 800, color: '#1e293b' }}>{hw.title}</p>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 20, background: hw.status === 'Pending' ? '#fff7ed' : '#ecfdf5', color: hw.status === 'Pending' ? '#f59e0b' : '#059669' }}>{hw.status}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: 11, color: '#64748b' }}>{hw.desc}</p>
                      <p style={{ margin: '8px 0 0', fontSize: 11, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4 }}><Icons.Clock /> Due: {hw.due}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', padding: 20 }}>
                <h4 style={{ margin: '0 0 14px', fontSize: 13, fontWeight: 800, color: '#1e293b' }}>Quick Actions</h4>
                {[
                  { label: 'View Schedule',    tab: 'My Learning',     subKey: 'learningSubTab',  subVal: 'Schedule' },
                  { label: 'Submit Homework',   tab: 'Classroom Tasks', subKey: 'tasksSubTab', subVal: 'Homeworks' },
                  { label: 'Check Grades',      tab: 'Classroom Tasks', subKey: 'tasksSubTab', subVal: 'Grade Report' },
                  { label: 'Submit Justification', action: () => setIsJustifyModalOpen(true) },
                ].map((action, idx) => (
                  <button key={idx} onClick={() => {
                    if (action.action) { action.action(); } else {
                      setActiveTab(action.tab);
                      if (action.subKey === 'tasksSubTab') setTasksSubTab(action.subVal);
                      if (action.subKey === 'learningSubTab') setLearningSubTab(action.subVal);
                    }
                  }} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: 10, border: '1px solid #f1f5f9', background: '#f8fafc', fontSize: 12, fontWeight: 700, color: '#1e293b', cursor: 'pointer', marginBottom: 8, transition: 'all .15s' }}>{action.label} <Icons.ChevronRight /></button>
                ))}
              </div>
            </aside>
          )}
        </div>
      </main>

      {isJustifyModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: 32, width: '100%', maxWidth: 480, boxShadow: '0 20px 60px rgba(0,0,0,0.2)', position: 'relative' }}>
            <button onClick={() => setIsJustifyModalOpen(false)} style={{ position: 'absolute', top: 18, right: 20, background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: 20, fontWeight: 700 }}>✕</button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ fontSize: 24 }}>📝</span>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#1e293b' }}>Absence Justification</h2>
            </div>
            <form onSubmit={submitJustification} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>If you were marked absent, submit your reason below. The administration will review it to schedule a recovery session.</p>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 8 }}>Date of Absence</label>
                <input type="date" required value={justifyData.date} onChange={e => setJustifyData({...justifyData, date: e.target.value})} 
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid #f1f5f9', background: '#f8fafc', fontSize: 13, outline: 'none', color: '#1e293b', fontFamily: 'inherit' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 8 }}>Reason & Explanation</label>
                <textarea required rows="4" placeholder="Explain your absence in detail..." value={justifyData.reason} onChange={e => setJustifyData({...justifyData, reason: e.target.value})} 
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid #f1f5f9', background: '#f8fafc', fontSize: 13, outline: 'none', resize: 'none', color: '#1e293b', fontFamily: 'inherit' }} />
              </div>
              <button type="submit" disabled={isSubmitting} 
                style={{ marginTop: 8, background: '#4318FF', color: '#fff', padding: '14px', borderRadius: 10, border: 'none', fontSize: 14, fontWeight: 700, cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.7 : 1, transition: 'all .2s' }}>
                {isSubmitting ? 'Sending...' : 'Send to Administration'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
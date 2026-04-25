import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

// Import sub-components — UNCHANGED
import TeacherClasses from './TeacherClasses';
import TeacherCommunications from './TeacherCommunications';
import ClassroomTasks from './ClassroomTasks';

// ─────────────────────────────────────────────────────────────────
// SVG ICON SYSTEM  — matches student dashboard exactly
// ─────────────────────────────────────────────────────────────────
const Icons = {
  Dashboard: () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>
    </svg>
  ),
  Classes: () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  ),
  Tasks: () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 11 12 14 22 4"/>
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
    </svg>
  ),
  Messages: () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  Logout: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  Search: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  Bell: () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  ),
  ChevronRight: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
  Globe: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  ),
  Users: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
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
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  Clock: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  Chart: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
      <line x1="2" y1="20" x2="22" y2="20"/>
    </svg>
  ),
  ArrowRight: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/>
      <polyline points="12 5 19 12 12 19"/>
    </svg>
  ),
  UsersSmall: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  BookSmall: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  ),
};

// ─── Nav items ────────────────────────────────────────────────────────────────
const navLinks = [
  { id: 'Dashboard',       Icon: Icons.Dashboard },
  { id: 'My Classes',      Icon: Icons.Classes   },
  { id: 'Classroom Tasks', Icon: Icons.Tasks     },
  { id: 'Messages',        Icon: Icons.Messages  },
];

// ─── Stat Card — identical to StudentDashboard ────────────────────────────────
const StatCard = ({ label, value, badge, badgeColor, Icon, iconBg }) => (
  <div style={{
    background: '#fff', borderRadius: 16,
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
          color:      badgeColor === 'green'  ? '#059669'
                    : badgeColor === 'blue'   ? '#4318FF'
                    : badgeColor === 'orange' ? '#f59e0b'
                    : '#94a3b8',
          background: badgeColor === 'green'  ? '#ecfdf5'
                    : badgeColor === 'blue'   ? '#eef2ff'
                    : badgeColor === 'orange' ? '#fffbeb'
                    : '#f1f5f9',
          padding: '2px 9px', borderRadius: 20,
        }}>{badge}</span>
      )}
    </div>
    <p style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', margin: 0 }}>{label}</p>
    <p style={{ fontSize: 28, fontWeight: 800, color: '#1e293b', lineHeight: 1, margin: 0 }}>{value}</p>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const Dashboardt = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const navigate = useNavigate();

  // ── All original state — UNTOUCHED ──────────────────────────────────────────
  const [teacherInfo, setTeacherInfo]             = useState(null);
  const [myClasses, setMyClasses]                 = useState([]);
  const [studentsProgress, setStudentsProgress]   = useState([]);
  const [dailyTasks, setDailyTasks]               = useState([]);
  const [loading, setLoading]                     = useState(true);
  const [unreadCount, setUnreadCount]             = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationsList, setNotificationsList] = useState([]);
  const [schoolBranding, setSchoolBranding]       = useState({ logo: null, name: 'Polyglot' });
  const notificationRef = useRef(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  // ── Branding ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchBranding = async () => {
      const { data, error } = await supabase
        .from('school_settings').select('logo, name').eq('id', 1).single();
      if (data && !error) setSchoolBranding({ logo: data.logo, name: data.name || 'Polyglot' });
    };
    fetchBranding();
  }, []);

  // ── Main data fetch — UNTOUCHED logic ────────────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user && user.email) {
          const { data: teacherData } = await supabase
            .from('staff').select('*').eq('email', user.email).single();

          if (teacherData) {
            setTeacherInfo(teacherData);
            const currentTeacherName = `${teacherData.first_name} ${teacherData.last_name}`.trim();
            const { data: classesData } = await supabase
              .from('classes').select('*').eq('teacher_name', currentTeacherName);

            let classNamesList = [];
            if (classesData && classesData.length > 0) {
              classNamesList = classesData.map(c => c.name);
              const colors = ['#EEF2FF', '#FFF7ED', '#ECFDF5', '#F0F9FF'];
              const accents = ['#4318FF', '#f59e0b', '#059669', '#0284c7'];
              const formattedClasses = classesData.map((c, index) => ({
                id: c.id,
                name: c.name || c.class_name || 'Unnamed Class',
                language: c.language || c.subject || 'Subject',
                studentsCount: c.capacity || Math.floor(Math.random() * 15) + 10,
                color: colors[index % colors.length],
                accent: accents[index % accents.length],
              }));
              setMyClasses(formattedClasses);
            } else {
              setMyClasses([]);
            }

            if (classNamesList.length > 0) {
              const { data: studentsData } = await supabase
                .from('students').select('*').in('group_name', classNamesList);
              if (studentsData && studentsData.length > 0) {
                const formattedStudents = studentsData.map(s => ({
                  name: `${s.first_name || ''} ${s.last_name || ''}`.trim(),
                  course: s.language || s.group_name || 'Course',
                  level: s.level || 'N/A',
                  grade: '-',
                  status: s.status === 'Active' ? 'ACTIVE' : (s.status || 'PENDING').toUpperCase(),
                  statusColor: s.status === 'Active' ? '#059669' : '#f59e0b',
                  statusBg:    s.status === 'Active' ? '#ecfdf5' : '#fffbeb',
                }));
                setStudentsProgress(formattedStudents);
              } else {
                setStudentsProgress(getFallbackProgress());
              }
            } else {
              setStudentsProgress(getFallbackProgress());
            }

            const { data: notifData } = await supabase
              .from('communications').select('*')
              .in('type', ['announcement', 'notification'])
              .order('created_at', { ascending: false });

            if (notifData) {
              const myNotifs = notifData.filter(a => {
                const target = a.recipient_name?.toLowerCase() || '';
                return (target.includes('all community') || target.includes('teachers') ||
                        target.includes('staff') || target.includes('all')) &&
                       a.sender_id !== teacherData.id;
              });
              setUnreadCount(myNotifs.length);
              setNotificationsList(myNotifs);
            }
          }
        }

        const { data: tasksData } = await supabase.from('tasks').select('*').limit(3);
        setDailyTasks(tasksData && tasksData.length > 0 ? tasksData : getFallbackTasks());
      } catch (err) {
        console.error('Fetch Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Close notifications on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getFallbackProgress = () => [
    { name: 'Sarah Johnson', course: 'English',  level: 'B2', grade: '16/20', status: 'VERY GOOD',   statusColor: '#059669', statusBg: '#ecfdf5' },
    { name: 'Lucas Martin',  course: 'French',   level: 'B1', grade: '14/20', status: 'GOOD',        statusColor: '#059669', statusBg: '#ecfdf5' },
    { name: 'Maria Garcia',  course: 'Spanish',  level: 'A2', grade: '13/20', status: 'ALMOST GOOD', statusColor: '#4318FF', statusBg: '#eef2ff' },
    { name: 'Anna Schmidt',  course: 'German',   level: 'A1', grade: '10/20', status: 'NEEDS WORK',  statusColor: '#f59e0b', statusBg: '#fffbeb' },
    { name: 'David Brown',   course: 'English',  level: 'B2', grade: '18/20', status: 'EXCELLENT',   statusColor: '#059669', statusBg: '#ecfdf5' },
  ];

  const getFallbackTasks = () => [
    { id: 1, title: 'Grade Mid-Terms',    subTitle: 'French B1 Intermediate', date: 'Today, 5:00 PM',       status: 'Pending',   accent: '#f59e0b', statusBg: '#fffbeb', statusColor: '#f59e0b' },
    { id: 2, title: 'Submit Attendance',  subTitle: 'Morning Session',        date: 'Completed: 09:30 AM',  status: 'Completed', accent: '#059669', statusBg: '#ecfdf5', statusColor: '#059669' },
    { id: 3, title: 'Prepare Lesson',     subTitle: 'English B2 Advanced',    date: 'Tomorrow, 9:00 AM',    status: 'Pending',   accent: '#4318FF', statusBg: '#eef2ff', statusColor: '#4318FF' },
  ];

  // ── Calendar ─────────────────────────────────────────────────────────────────
  const today       = new Date();
  const todayDate   = today.getDate();
  const monthName   = today.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  const firstDay    = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
  const offset      = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

  const teacherName = teacherInfo
    ? `Prof. ${teacherInfo.first_name} ${teacherInfo.last_name}`
    : 'Teacher Name';

  // ── Render sub-pages ──────────────────────────────────────────────────────────
  const renderContent = () => {
    if (activeTab === 'My Classes')      return <TeacherClasses />;
    if (activeTab === 'Messages')        return <TeacherCommunications />;
    if (activeTab === 'Classroom Tasks') return <ClassroomTasks />;

    // ── Dashboard view ──────────────────────────────────────────────────────────
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24, minWidth: 0 }}>

        {/* Page header */}
        <div>
          <p style={{ fontSize: 13, color: '#94a3b8', margin: '0 0 4px' }}>
            {today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1e293b', margin: 0 }}>
            Welcome back, {teacherName}
          </h1>
          <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0 0' }}>
            Here's a snapshot of your classes and students today.
          </p>
        </div>

        {/* Stat cards */}
        <div style={{ display: 'flex', gap: 16 }}>
          <StatCard
            label="My Classes"
            value={loading ? '...' : myClasses.length}
            badge="+Active"
            badgeColor="blue"
            Icon={Icons.BookOpen}
            iconBg="#EEF2FF"
          />
          <StatCard
            label="Total Students"
            value={loading ? '...' : studentsProgress.length}
            badge="View All"
            badgeColor="green"
            Icon={Icons.Users}
            iconBg="#ECFDF5"
          />
          <StatCard
            label="Pending Tasks"
            value={loading ? '...' : dailyTasks.filter(t => t.status === 'Pending').length}
            badge="Due Soon"
            badgeColor="orange"
            Icon={Icons.Tasks}
            iconBg="#FFF7ED"
          />
        </div>

        {/* My Classes grid */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: '#1e293b', margin: 0 }}>My Classes</h2>
            <button onClick={() => setActiveTab('My Classes')}
              style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 700, color: '#4318FF', background: 'none', border: 'none', cursor: 'pointer' }}>
              View All <Icons.ChevronRight />
            </button>
          </div>

          {loading ? (
            <p style={{ color: '#94a3b8', fontSize: 13, padding: '20px 0' }}>Loading classes...</p>
          ) : myClasses.length === 0 ? (
            <p style={{ color: '#94a3b8', fontSize: 13, padding: '20px 0', textAlign: 'center' }}>No classes assigned yet.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
              {myClasses.slice(0, 4).map((cls) => (
                <div key={cls.id} style={{
                  border: '1px solid #f1f5f9', borderRadius: 14, overflow: 'hidden',
                  cursor: 'pointer', transition: 'box-shadow .2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                >
                  <div style={{ background: cls.color, padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
                    <p style={{ fontSize: 13, fontWeight: 800, color: '#1e293b', margin: 0 }}>{cls.name}</p>
                    <p style={{ fontSize: 11, color: '#64748b', margin: '4px 0 0' }}>{cls.language}</p>
                  </div>
                  <div style={{ padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: '#64748b', fontSize: 12 }}>
                      <Icons.UsersSmall /> <span>{cls.studentsCount} students enrolled</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: '#64748b', fontSize: 12 }}>
                      <Icons.BookSmall /> <span>{cls.language}</span>
                    </div>
                    <button onClick={() => setActiveTab('My Classes')} style={{
                      marginTop: 6, padding: '8px 0', borderRadius: 8,
                      border: '1px solid #e0e7ff', background: '#f5f3ff',
                      color: '#4318FF', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                    }}>Manage Class</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Student Progress table */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: '#1e293b', margin: 0 }}>Student Progress</h2>
            <button style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 700, color: '#4318FF', background: 'none', border: 'none', cursor: 'pointer' }}>
              View All <Icons.ChevronRight />
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  {['Student Name', 'Course', 'Level', 'Grade', 'Status', ''].map((h, i) => (
                    <th key={i} style={{
                      padding: '10px 12px', textAlign: 'left',
                      fontSize: 11, fontWeight: 700, color: '#94a3b8',
                      textTransform: 'uppercase', letterSpacing: '0.05em'
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {studentsProgress.map((s, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #f8fafc', transition: 'background .15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '12px', fontWeight: 700, color: '#1e293b' }}>{s.name}</td>
                    <td style={{ padding: '12px', color: '#64748b' }}>{s.course}</td>
                    <td style={{ padding: '12px', color: '#64748b', fontWeight: 600 }}>{s.level}</td>
                    <td style={{ padding: '12px', fontWeight: 700, color: '#1e293b' }}>{s.grade}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 20,
                        background: s.statusBg, color: s.statusColor, letterSpacing: '0.05em'
                      }}>{s.status}</span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <button style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 18, fontWeight: 700 }}>⋮</button>
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

  // ── Full layout ────────────────────────────────────────────────────────────────
  return (
    <div style={{
      display: 'flex', height: '100vh',
      background: '#f8fafc',
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      overflow: 'hidden'
    }}>

      {/* ══════════ SIDEBAR — exact student style ══════════ */}
      <aside style={{
        width: 240, background: '#0f172a',
        display: 'flex', flexDirection: 'column',
        flexShrink: 0, height: '100%', zIndex: 20,
      }}>

        {/* Logo */}
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer' }}
          onClick={() => setActiveTab('Dashboard')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {schoolBranding.logo ? (
              <img src={schoolBranding.logo} alt="Logo" style={{
                width: 36, height: 36, borderRadius: 10,
                objectFit: 'contain', background: 'rgba(255,255,255,0.1)',
                boxShadow: '0 4px 12px rgba(67,24,255,0.35)', flexShrink: 0,
              }} />
            ) : (
              <div style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: 'linear-gradient(135deg, #4318FF 0%, #6B47FF 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(67,24,255,0.35)',
              }}>
                <Icons.Globe />
              </div>
            )}
            <div>
              <p style={{ color: '#fff', fontSize: 13, fontWeight: 800, letterSpacing: '0.04em', lineHeight: 1.1, margin: 0, textTransform: 'uppercase' }}>
                {(schoolBranding.name || 'Polyglot').toUpperCase()}
              </p>
              <p style={{ color: '#818cf8', fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', margin: 0 }}>
                ACADEMY
              </p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {navLinks.map(({ id, Icon }) => {
            const isActive = activeTab === id;
            return (
              <button key={id} onClick={() => setActiveTab(id)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 11,
                  padding: '10px 14px', borderRadius: 10, border: 'none', cursor: 'pointer',
                  fontSize: 13, fontWeight: 600, textAlign: 'left', transition: 'all .15s',
                  background: isActive ? '#4318FF' : 'transparent',
                  color: isActive ? '#fff' : '#94a3b8',
                }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#e2e8f0'; }}}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8'; }}}
              >
                <span style={{ flexShrink: 0 }}><Icon /></span>
                {id}
              </button>
            );
          })}
        </nav>

        {/* Log Out */}
        <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button onClick={handleLogout}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 11,
              padding: '10px 14px', borderRadius: 10, border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: 600, color: '#f87171', background: 'transparent', transition: 'all .15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(248,113,113,0.08)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <Icons.Logout /> Log Out
          </button>
        </div>
      </aside>

      {/* ══════════ MAIN ══════════ */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

        {/* ── Topbar — matches student exactly ── */}
        <header style={{
          height: 64, padding: '0 28px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: '#fff', borderBottom: '1px solid #f1f5f9',
          flexShrink: 0, zIndex: 10,
        }}>
          {/* Search */}
          <div style={{ position: 'relative', width: '100%', maxWidth: 400 }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
              <Icons.Search />
            </span>
            <input type="text" placeholder="Search students, classes, assignments..."
              style={{
                width: '100%', background: '#f8fafc',
                border: '1px solid #f1f5f9', borderRadius: 10,
                padding: '9px 14px 9px 40px', fontSize: 13, color: '#1e293b',
                outline: 'none', boxSizing: 'border-box',
              }} />
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>

            {/* Bell + dropdown */}
            <div style={{ position: 'relative' }} ref={notificationRef}>
              <button onClick={() => { setShowNotifications(!showNotifications); setUnreadCount(0); }}
                style={{
                  width: 38, height: 38, borderRadius: 10, border: '1px solid #f1f5f9',
                  background: showNotifications ? '#4318FF' : '#f8fafc',
                  color: showNotifications ? '#fff' : '#64748b',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', position: 'relative', transition: 'all .15s',
                }}>
                <Icons.Bell />
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute', top: 8, right: 8,
                    width: 8, height: 8, background: '#ef4444', borderRadius: '50%',
                    border: '2px solid #fff',
                  }} />
                )}
              </button>

              {showNotifications && (
                <div style={{
                  position: 'absolute', right: 0, top: 'calc(100% + 10px)',
                  width: 340, background: '#fff', borderRadius: 16,
                  border: '1px solid #f1f5f9', boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
                  padding: 20, zIndex: 50,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <h4 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#1e293b' }}>Notifications</h4>
                    <span onClick={() => setShowNotifications(false)}
                      style={{ fontSize: 12, fontWeight: 700, color: '#4318FF', cursor: 'pointer' }}>
                      Mark All Read
                    </span>
                  </div>
                  <div style={{ maxHeight: 300, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {notificationsList.length > 0 ? notificationsList.map((n, idx) => (
                      <div key={idx} onClick={() => { setActiveTab('Messages'); setShowNotifications(false); }}
                        style={{
                          padding: '12px 14px', borderRadius: 10, border: '1px solid #f1f5f9',
                          cursor: 'pointer', transition: 'background .15s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                        onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                      >
                        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{n.subject || 'New Notification'}</p>
                        <p style={{ margin: '4px 0 0', fontSize: 12, color: '#64748b', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{n.content}</p>
                        <p style={{ margin: '6px 0 0', fontSize: 11, color: '#94a3b8' }}>{new Date(n.created_at).toLocaleDateString()}</p>
                      </div>
                    )) : (
                      <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 13, padding: '20px 0' }}>No new notifications</p>
                    )}
                  </div>
                  <button onClick={() => { setActiveTab('Messages'); setShowNotifications(false); }}
                    style={{
                      width: '100%', marginTop: 14, padding: '10px 0', borderRadius: 10,
                      border: '1px solid #e0e7ff', background: '#f5f3ff', color: '#4318FF',
                      fontSize: 12, fontWeight: 700, cursor: 'pointer',
                    }}>View All Messages</button>
                </div>
              )}
            </div>

            {/* Divider */}
            <div style={{ width: 1, height: 32, background: '#f1f5f9' }} />

            {/* User info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{teacherName}</p>
                <p style={{ margin: 0, fontSize: 11, color: '#94a3b8' }}>{teacherInfo?.department || 'Instructor'}</p>
              </div>
              <div style={{ position: 'relative' }}>
                <img src="https://i.pravatar.cc/150?img=47" alt="Profile"
                  style={{ width: 38, height: 38, borderRadius: 10, objectFit: 'cover', display: 'block' }} />
                <div style={{
                  position: 'absolute', bottom: -2, right: -2,
                  width: 10, height: 10, background: '#22c55e', borderRadius: '50%', border: '2px solid #fff',
                }} />
              </div>
            </div>
          </div>
        </header>

        {/* ── Content area ── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 28, display: 'flex', gap: 24 }}>

          {/* Main content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {renderContent()}
          </div>

          {/* Right sidebar — Dashboard only, matches student exactly */}
          {activeTab === 'Dashboard' && (
            <aside style={{ width: 280, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Calendar */}
              <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h4 style={{ margin: 0, fontSize: 13, fontWeight: 800, color: '#1e293b' }}>{monthName}</h4>
                  <Icons.Calendar />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, textAlign: 'center' }}>
                  {['M','T','W','T','F','S','S'].map((d, i) => (
                    <div key={i} style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', paddingBottom: 8 }}>{d}</div>
                  ))}
                  {Array.from({ length: offset }).map((_, i) => <div key={'e' + i} />)}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const isToday = day === todayDate;
                    return (
                      <div key={day} style={{
                        height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 12, fontWeight: isToday ? 800 : 500,
                        borderRadius: 6,
                        background: isToday ? '#4318FF' : 'transparent',
                        color: isToday ? '#fff' : '#1e293b',
                        opacity: isToday ? 1 : 0.75,
                        cursor: 'default',
                      }}>{day}</div>
                    );
                  })}
                </div>
              </div>

              {/* Today's Schedule — teacher version of Task Hub */}
              <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h4 style={{ margin: 0, fontSize: 13, fontWeight: 800, color: '#1e293b' }}>Today's Schedule</h4>
                  <button onClick={() => setActiveTab('Classroom Tasks')}
                    style={{ fontSize: 11, fontWeight: 700, color: '#4318FF', background: 'none', border: 'none', cursor: 'pointer' }}>
                    View All
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {dailyTasks.map((task, idx) => (
                    <div key={idx} style={{
                      padding: '12px 14px', borderRadius: 12, border: '1px solid #f1f5f9',
                      borderLeft: `3px solid ${task.accent || '#4318FF'}`,
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                        <p style={{ margin: 0, fontSize: 12, fontWeight: 800, color: '#1e293b' }}>{task.title || 'Task'}</p>
                        <span style={{
                          fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 20,
                          background: task.statusBg || '#fffbeb',
                          color:      task.statusColor || '#f59e0b',
                        }}>{task.status || 'Pending'}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: 11, color: '#64748b' }}>{task.subTitle || 'Details'}</p>
                      <p style={{ margin: '6px 0 0', fontSize: 11, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Icons.Clock /> {task.date || 'Today'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', padding: 20 }}>
                <h4 style={{ margin: '0 0 14px', fontSize: 13, fontWeight: 800, color: '#1e293b' }}>Quick Actions</h4>
                {[
                  { label: 'View My Classes',    onClick: () => setActiveTab('My Classes') },
                  { label: 'Classroom Tasks',    onClick: () => setActiveTab('Classroom Tasks') },
                  { label: 'Message Students',   onClick: () => setActiveTab('Messages') },
                ].map((action, idx) => (
                  <button key={idx} onClick={action.onClick}
                    style={{
                      width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '10px 14px', borderRadius: 10, border: '1px solid #f1f5f9',
                      background: '#f8fafc', fontSize: 12, fontWeight: 700, color: '#1e293b',
                      cursor: 'pointer', marginBottom: 8, transition: 'all .15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#eef2ff'; e.currentTarget.style.borderColor = '#e0e7ff'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#f1f5f9'; }}
                  >
                    {action.label} <Icons.ChevronRight />
                  </button>
                ))}
              </div>

            </aside>
          )}
        </div>
      </main>

      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; }
        aside nav::-webkit-scrollbar { width: 3px; }
        aside nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.07); border-radius: 10px; }
        main > div::-webkit-scrollbar { width: 4px; }
        main > div::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default Dashboardt;
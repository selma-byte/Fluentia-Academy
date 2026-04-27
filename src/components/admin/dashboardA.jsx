import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

// --- CORE UI COMPONENTS — UNTOUCHED ---
import Topbar from './Topbar';
import StudentsManagement from './StudentsManagement';
import AttendanceRecords from './AttendanceRecords';
import SchedulingHub from './SchedulingHub';
import ParentPortal from './ParentPortal';
import Documents from './Documents';
import Exams from './exams';
import Payment from './payment';

// --- ADMIN SPECIFIC MODULES — UNTOUCHED ---
import TeacherManagement from './TeacherManagement';
import Reports from './reports';
import Users from './users';
import Settings from './settings';

// ─── Icon renderer — UNTOUCHED (all SVG, zero emojis) ────────────────────────
const renderIcon = (name, size = 16, color = 'currentColor') => {
  const sw = 1.8;
  const base = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: sw, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const map = {
    dashboard:   <svg {...base}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
    students:    <svg {...base}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    teachers:    <svg {...base}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    attendance:  <svg {...base}><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
    scheduling:  <svg {...base}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    parents:     <svg {...base}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    documents:   <svg {...base}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    exams:       <svg {...base}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    payment:     <svg {...base}><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
    reports:     <svg {...base}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>,
    users:       <svg {...base}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    school:      <svg {...base}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    logout:      <svg {...base}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    chevron:     <svg {...base} strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>,
    download:    <svg {...base}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
    alert:       <svg {...base}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
    actStudent:  <svg {...base}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M20 8v6M23 11h-6"/></svg>,
    actClock:    <svg {...base}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    actCalendar: <svg {...base}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    actDollar:   <svg {...base}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><path d="M9.5 10h4a1.5 1.5 0 0 1 0 3h-3a1.5 1.5 0 0 0 0 3H15"/></svg>,
    addStudent:  <svg {...base}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M20 8v6M23 11h-6"/></svg>,
    addTeacher:  <svg {...base}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M20 8v6M23 11h-6"/></svg>,
    newCourse:   <svg {...base}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><line x1="12" y1="7" x2="12" y2="13"/><line x1="9" y1="10" x2="15" y2="10"/></svg>,
    globe:       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  };
  return map[name] || null;
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ label, val, icon, iColor, iBg, badge, bColor, bBg, onClick }) => (
  <div
    onClick={onClick}
    style={{
      background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9',
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)', padding: '20px 24px',
      cursor: onClick ? 'pointer' : 'default', position: 'relative',
      transition: 'box-shadow .15s, transform .15s',
    }}
    onMouseEnter={e => { if (onClick) { e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-2px)'; } }}
    onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'none'; }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
      <div style={{ width: 40, height: 40, borderRadius: 12, background: iBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {renderIcon(icon, 18, iColor)}
      </div>
      {badge && (
        <span style={{ fontSize: 11, fontWeight: 700, color: bColor, background: bBg, padding: '3px 10px', borderRadius: 20 }}>
          {badge}
        </span>
      )}
    </div>
    <p style={{ margin: '0 0 4px', fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
    <p style={{ margin: 0, fontSize: 28, fontWeight: 800, color: '#1e293b', lineHeight: 1 }}>{val}</p>
  </div>
);

// ─── Activity Row ─────────────────────────────────────────────────────────────
const ActivityRow = ({ icon, iColor, iBg, title, sub, time, last }) => (
  <div style={{
    display: 'flex', alignItems: 'flex-start', gap: 14,
    padding: '12px 0', borderBottom: last ? 'none' : '1px solid #f8fafc',
  }}>
    <div style={{ width: 38, height: 38, borderRadius: '50%', background: iBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      {renderIcon(icon, 17, iColor)}
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{title}</p>
      <p style={{ margin: '3px 0 0', fontSize: 12, color: '#64748b' }}>{sub}</p>
    </div>
    <span style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', whiteSpace: 'nowrap', flexShrink: 0 }}>{time}</span>
  </div>
);

// ─── Quick Action Button ──────────────────────────────────────────────────────
const QuickAction = ({ icon, label, onClick, last }) => (
  <button
    onClick={onClick}
    style={{
      width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '11px 8px', borderRadius: 8, border: 'none', background: 'transparent',
      borderBottom: last ? 'none' : '1px solid #f8fafc',
      fontSize: 13, fontWeight: 600, color: '#1e293b', cursor: 'pointer', transition: 'background .15s',
    }}
    onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {renderIcon(icon, 14, '#4318FF')}
      </div>
      {label}
    </div>
    {renderIcon('chevron', 14, '#cbd5e1')}
  </button>
);

// ─── Dashboard Content ────────────────────────────────────────────────────────
const DashboardContent = ({ setActiveTab }) => {
  const [statsData, setStatsData] = useState({ students: 0, teachers: 0, courses: 0 });
  const [loading, setLoading]     = useState(true);

  // ── 💡 Supabase Logic ──────────────────────────────
  useEffect(() => {
    const fetchDashboardStats = async () => {
      setLoading(true);
      try {
        const { count: studentCount } = await supabase.from('students').select('*', { count: 'exact', head: true });
        const { count: teacherCount  } = await supabase.from('staff').select('*', { count: 'exact', head: true }).ilike('role', 'Teacher');
        const { count: courseCount  } = await supabase.from('classes').select('*', { count: 'exact', head: true });
        setStatsData({ students: studentCount || 0, teachers: teacherCount || 0, courses: courseCount || 0 });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardStats();
  }, []);

  const stats = [
    { label: 'Total Students', val: loading ? '...' : statsData.students.toLocaleString(), icon: 'actStudent', iColor: '#4318FF', iBg: '#eef2ff', badge: 'Active',  bColor: '#059669', bBg: '#ecfdf5', tab: 'Students Management' },
    { label: 'Total Teachers', val: loading ? '...' : statsData.teachers.toLocaleString(), icon: 'actClock',   iColor: '#f97316', iBg: '#fff7ed', badge: 'Active', bColor: '#92400e', bBg: '#fef3c7', tab: 'Teacher Management'  },
    { label: 'Total Courses',  val: loading ? '...' : statsData.courses.toLocaleString(),  icon: 'newCourse',  iColor: '#4318FF', iBg: '#eef2ff', badge: 'Running', bColor: '#1d4ed8', bBg: '#eff6ff', tab: 'Scheduling Hub'      },
  ];

  const activities = [
    { icon: 'actStudent',  iColor: '#4318FF', iBg: '#eef2ff', title: 'New student registered',     sub: 'A new student has joined the academy.',         time: '2H AGO'    },
    { icon: 'actClock',    iColor: '#f97316', iBg: '#fff7ed', title: 'Teacher attendance updated', sub: 'Attendance records for faculty members were finalized.', time: '5H AGO'    },
    { icon: 'actCalendar', iColor: '#7c3aed', iBg: '#f5f3ff', title: 'Exam schedule published',    sub: 'Mid-term schedules are now live.',          time: '6H AGO'    },
    { icon: 'actDollar',   iColor: '#059669', iBg: '#ecfdf5', title: 'Fee payment confirmed',      sub: 'Transaction verified for students.',             time: 'YESTERDAY' },
  ];

  const quickActions = [
    { name: 'Add Student', icon: 'addStudent', tab: 'Students Management' },
    { name: 'Add Teacher', icon: 'addTeacher', tab: 'Teacher Management'  },
    { name: 'New Course',  icon: 'newCourse',  tab: 'Scheduling Hub'      },
  ];

  return (
    <div>
      {/* Page header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#1e293b' }}>Welcome back, Admin</h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
            Here's a snapshot of the Academy's performance today.
          </p>
        </div>
        <button style={{
          display: 'flex', alignItems: 'center', gap: 7,
          padding: '9px 16px', borderRadius: 10, border: '1px solid #f1f5f9',
          background: '#fff', fontSize: 13, fontWeight: 700, color: '#1e293b',
          cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}>
          {renderIcon('download', 14, '#1e293b')} Download Report
        </button>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 24 }}>
        {stats.map((s, i) => (
          <StatCard key={i} {...s} onClick={() => setActiveTab(s.tab)} />
        ))}
      </div>

      {/* Bottom grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20 }}>

        {/* Recent Activities */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', padding: '20px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#1e293b' }}>Recent Activities</h2>
            <button style={{ background: 'none', border: 'none', fontSize: 12, fontWeight: 700, color: '#4318FF', cursor: 'pointer' }}>
              View All
            </button>
          </div>
          {activities.map((a, i) => (
            <ActivityRow key={i} {...a} last={i === activities.length - 1} />
          ))}
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Quick Actions */}
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', padding: '20px 16px' }}>
            <h2 style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 800, color: '#1e293b' }}>Quick Actions</h2>
            {quickActions.map((qa, i) => (
              <QuickAction key={i} icon={qa.icon} label={qa.name} last={i === quickActions.length - 1} onClick={() => setActiveTab(qa.tab)} />
            ))}
          </div>

          {/* Action Required */}
          <div style={{ background: '#fef2f2', borderRadius: 16, border: '1px solid #fecaca', padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              {renderIcon('alert', 14, '#dc2626')}
              <span style={{ fontSize: 13, fontWeight: 800, color: '#991b1b' }}>Action Required</span>
            </div>
            <p style={{ margin: '0 0 14px', fontSize: 12, color: '#b91c1c', lineHeight: 1.6 }}>
              Review pending teacher payrolls for this month.
            </p>
            <button
              onClick={() => setActiveTab('Payment')}
              style={{
                width: '100%', padding: '11px 0', borderRadius: 10, border: 'none',
                background: '#dc2626', color: '#fff', fontSize: 12, fontWeight: 700,
                cursor: 'pointer', transition: 'background .15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#b91c1c'}
              onMouseLeave={e => e.currentTarget.style.background = '#dc2626'}
            >
              GO TO PAYMENT
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

// ─── Admin Dashboard Shell ────────────────────────────────────────────────────
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const navigate = useNavigate();

  // ── Supabase Logic ──────────────────────────────
  const [schoolBranding, setSchoolBranding] = useState({ logo: null, name: 'Polyglot' });

  useEffect(() => {
    const fetchBranding = async () => {
      const { data, error } = await supabase
        .from('school_settings')
        .select('logo, name')
        .eq('id', 1)
        .single();
      if (data && !error) {
        setSchoolBranding({ logo: data.logo, name: data.name || 'Polyglot' });
      }
    };
    fetchBranding();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  // ── Menu ──────────────────────────────────────────────────────
  const menuItems = [
    { icon: 'dashboard',  text: 'Dashboard'           },
    { icon: 'students',   text: 'Students Management' },
    { icon: 'attendance', text: 'Attendance Records'  },
    { icon: 'scheduling', text: 'Scheduling Hub'      },
    { icon: 'parents',    text: 'Communicate Parents' },
    { icon: 'documents',  text: 'Documents'           },
    { icon: 'exams',      text: 'Exams'               },
    { icon: 'payment',    text: 'Payment'             },
    { icon: 'teachers',   text: 'Teacher Management'  },
    { icon: 'reports',    text: 'Reports'             },
    { icon: 'users',      text: 'Users'               },
    { icon: 'school',     text: 'School Profile'      },
  ];

  // ── Routing ───────────────────────────────────────────────────
  const renderTabContent = () => {
    switch (activeTab) {
      case 'Dashboard':           return <DashboardContent setActiveTab={setActiveTab} />;
      case 'Teacher Management':  return <TeacherManagement />;
      case 'Students Management': return <StudentsManagement />;
      case 'Attendance Records':  return <AttendanceRecords />;
      case 'Scheduling Hub':      return <SchedulingHub />;
      case 'Communicate Parents': return <ParentPortal />;
      case 'Documents':           return <Documents />;
      case 'Exams':               return <Exams />;
      case 'Payment':             return <Payment />;
      case 'Reports':             return <Reports />;
      case 'Users':               return <Users />;
      case 'School Profile':      return <Settings />;
      default:                    return <DashboardContent setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div style={{
      display: 'flex', height: '100vh', width: '100%',
      background: '#f8fafc',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      overflow: 'hidden',
    }}>

      {/* ── Sidebar ── */}
      <aside style={{
        width: 240, minWidth: 240, background: '#0f172a',
        display: 'flex', flexDirection: 'column',
        borderRight: '1px solid rgba(255,255,255,0.04)',
      }}>

        {/* Logo */}
        <div
          onClick={() => setActiveTab('Dashboard')}
          style={{ padding: '20px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer' }}>
          {schoolBranding.logo ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <img src={schoolBranding.logo} alt="Logo"
                style={{ width: 36, height: 36, borderRadius: 10, objectFit: 'contain', background: 'rgba(255,255,255,0.1)' }} />
              <div>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: '#fff', letterSpacing: '0.04em' }}>
                  {schoolBranding.name.toUpperCase()}
                </p>
                <p style={{ margin: 0, fontSize: 9, fontWeight: 700, color: '#818cf8', letterSpacing: '0.12em' }}>ACADEMY</p>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: 'linear-gradient(135deg, #4318FF 0%, #6b47ff 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(67,24,255,0.35)',
              }}>
                {renderIcon('globe', 20, '#fff')}
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: '#fff', letterSpacing: '0.04em', lineHeight: 1.1 }}>
                  {schoolBranding.name.toUpperCase()}
                </p>
                <p style={{ margin: 0, fontSize: 9, fontWeight: 700, color: '#818cf8', letterSpacing: '0.12em' }}>ACADEMY</p>
              </div>
            </div>
          )}
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {menuItems.map(item => {
            const active = activeTab === item.text;
            return (
              <button
                key={item.text}
                onClick={() => setActiveTab(item.text)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 11,
                  padding: '10px 14px', borderRadius: 10, border: 'none',
                  background: active ? '#4318FF' : 'transparent',
                  color: active ? '#fff' : '#94a3b8',
                  fontSize: 13, fontWeight: active ? 700 : 500,
                  cursor: 'pointer', textAlign: 'left', transition: 'all .15s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#e2e8f0'; } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8'; } }}
              >
                <span style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                  {renderIcon(item.icon, 16, active ? '#fff' : 'currentColor')}
                </span>
                {item.text}
              </button>
            );
          })}
        </nav>

        {/* Log Out */}
        <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 14px', borderRadius: 10, border: 'none', background: 'transparent',
              color: '#f87171', fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all .15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(248,113,113,0.08)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
              {renderIcon('logout', 16, '#f87171')} Log Out
            </div>
            {renderIcon('chevron', 13, '#f87171')}
          </button>
        </div>
      </aside>

      {/* ── Main area ── */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        <Topbar setActiveTab={setActiveTab} />
        <div className="page-scroll" style={{ flex: 1, overflowY: 'auto', padding: 28 }}>
          {renderTabContent()}
        </div>
      </main>

      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; }
        .page-scroll::-webkit-scrollbar { width: 4px; }
        .page-scroll::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        aside nav::-webkit-scrollbar { width: 3px; }
        aside nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.07); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
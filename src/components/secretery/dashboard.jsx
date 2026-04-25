// All imports — UNTOUCHED
import React, { useState, useEffect } from 'react';
import Payment from './payment';
import Topbar from './Topbar';
import Exams from './exams';
import Appointments from './Appointments';
import Enrollment from './Enrollment';
import ParentPortal from './ParentPortal';
import Documents from './Documents';
import SchoolSchedule from './SchoolSchedule';
import AttendanceRecords from './AttendanceRecords';
import StudentsManagement from './StudentsManagement';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import SchedulingHub from './SchedulingHub';

// ─── Icon System (replaces all emojis) ───────────────────────────────────────
const Icons = {
  Dashboard: () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>
    </svg>
  ),
  Students: () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  Attendance: () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 11 12 14 22 4"/>
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
    </svg>
  ),
  Schedule: () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  Messages: () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  Documents: () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
    </svg>
  ),
  Exams: () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  ),
  Payment: () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2"/>
      <line x1="1" y1="10" x2="23" y2="10"/>
    </svg>
  ),
  Logout: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  Download: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  ),
  UserPlus: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/>
      <line x1="23" y1="11" x2="17" y2="11"/>
    </svg>
  ),
  TeacherPlus: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  BookPlus: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      <line x1="12" y1="7" x2="12" y2="13"/><line x1="9" y1="10" x2="15" y2="10"/>
    </svg>
  ),
  Alert: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
  ChevronRight: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
  UserActivity: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  Clock: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  CalendarCheck: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
      <polyline points="9 16 11 18 15 14"/>
    </svg>
  ),
  DollarSign: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  ),
  Globe: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  ),
};

// ─── Nav items (icons replace emojis) ────────────────────────────────────────
const menuItems = [
  { icon: Icons.Dashboard,   text: 'Dashboard'           },
  { icon: Icons.Students,    text: 'Students Management' },
  { icon: Icons.Attendance,  text: 'Attendance Records'  },
  { icon: Icons.Schedule,    text: 'Scheduling Hub'      },
  { icon: Icons.Messages,    text: 'Communicate Parents' },
  { icon: Icons.Documents,   text: 'Documents'           },
  { icon: Icons.Exams,       text: 'Exams'               },
  { icon: Icons.Payment,     text: 'Payment'             },
];

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, iconBg, iconColor, badge, badgeColor, label, value, onClick }) => (
  <div
    onClick={onClick}
    style={{
      background: '#fff', borderRadius: 16, padding: '20px 24px',
      border: '1px solid #f1f5f9', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      cursor: onClick ? 'pointer' : 'default', flex: 1, minWidth: 0,
      transition: 'box-shadow .15s',
    }}
    onMouseEnter={e => { if (onClick) e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'; }}
    onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
      <div style={{ width: 40, height: 40, borderRadius: 12, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: iconColor }}>
        <Icon />
      </div>
      {badge && (
        <span style={{
          fontSize: 11, fontWeight: 700, padding: '2px 9px', borderRadius: 20,
          background: badgeColor === 'green' ? '#ecfdf5' : badgeColor === 'blue' ? '#eff6ff' : '#f1f5f9',
          color: badgeColor === 'green' ? '#059669' : badgeColor === 'blue' ? '#2563eb' : '#64748b',
        }}>{badge}</span>
      )}
    </div>
    <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
    <p style={{ margin: '4px 0 0', fontSize: 28, fontWeight: 800, color: '#1e293b', lineHeight: 1 }}>{value}</p>
  </div>
);

// ─── Activity Row ─────────────────────────────────────────────────────────────
const ActivityRow = ({ icon: Icon, iconBg, iconColor, title, desc, time, onClick }) => (
  <div
    onClick={onClick}
    style={{
      display: 'flex', alignItems: 'flex-start', gap: 14, padding: '10px 8px',
      borderRadius: 10, cursor: onClick ? 'pointer' : 'default', transition: 'background .15s',
    }}
    onMouseEnter={e => { if (onClick) e.currentTarget.style.background = '#f8fafc'; }}
    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
  >
    <div style={{ width: 38, height: 38, borderRadius: '50%', background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: iconColor, flexShrink: 0 }}>
      <Icon />
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{title}</p>
      <p style={{ margin: '3px 0 0', fontSize: 12, color: '#64748b' }}>{desc}</p>
    </div>
    <span style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', whiteSpace: 'nowrap', flexShrink: 0 }}>{time}</span>
  </div>
);

// ─── Quick Action Button ──────────────────────────────────────────────────────
const QuickAction = ({ icon: Icon, label, onClick }) => (
  <button
    onClick={onClick}
    style={{
      width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '12px 16px', borderRadius: 12, border: '1px solid #f1f5f9',
      background: '#fff', fontSize: 13, fontWeight: 700, color: '#1e293b',
      cursor: 'pointer', transition: 'all .15s', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    }}
    onMouseEnter={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#e0e7ff'; }}
    onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#f1f5f9'; }}
  >
    <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ color: '#4318FF' }}><Icon /></span> {label}
    </span>
    <span style={{ color: '#94a3b8' }}><Icons.ChevronRight /></span>
  </button>
);

// ─── School Logo ──────────────────────────────────────────────────────────────
const SchoolLogo = ({ name, logo, onClick }) => (
  <div onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
    {logo ? (
      <img src={logo} alt="Logo" style={{ width: 36, height: 36, borderRadius: 10, objectFit: 'contain', background: 'rgba(255,255,255,0.1)' }} />
    ) : (
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: 'linear-gradient(135deg, #4318FF, #6b47ff)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(67,24,255,0.35)', flexShrink: 0,
      }}>
        <Icons.Globe />
      </div>
    )}
    <div>
      <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: '#fff', letterSpacing: '0.04em', lineHeight: 1.1 }}>
        {(name || 'POLYGLOT').toUpperCase()}
      </p>
      <p style={{ margin: 0, fontSize: 9, fontWeight: 700, color: '#818cf8', letterSpacing: '0.12em' }}>ACADEMY</p>
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const SecretaryDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const navigate = useNavigate();

  // ── All original Supabase logic — UNTOUCHED ──────────────────────────────
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const [examView, setExamView] = useState('home');

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

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f8fafc', fontFamily: "'Inter','Segoe UI',sans-serif", overflow: 'hidden' }}>

      {/* ── Sidebar ── */}
      <aside style={{
        width: 240, background: '#0f172a',
        display: 'flex', flexDirection: 'column',
        flexShrink: 0, height: '100%', zIndex: 20,
      }}>
        {/* Logo */}
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <SchoolLogo
            name={schoolBranding.name}
            logo={schoolBranding.logo}
            onClick={() => setActiveTab('Dashboard')}
          />
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {menuItems.map((item) => {
            const isActive = activeTab === item.text;
            return (
              <button
                key={item.text}
                onClick={() => setActiveTab(item.text)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 11,
                  padding: '10px 14px', borderRadius: 10, border: 'none', cursor: 'pointer',
                  fontSize: 13, fontWeight: 600, textAlign: 'left', transition: 'all .15s',
                  background: isActive ? '#4318FF' : 'transparent',
                  color: isActive ? '#fff' : '#94a3b8',
                }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#e2e8f0'; } }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8'; } }}
              >
                <span style={{ flexShrink: 0 }}><item.icon /></span>
                {item.text}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 14px', borderRadius: 10, border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: 700, color: '#f87171', background: 'transparent', transition: 'all .15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(248,113,113,0.08)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 11 }}><Icons.Logout /> Log Out</span>
            <Icons.ChevronRight />
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

        {/* Topbar — UNTOUCHED (your existing component) */}
        <Topbar setActiveTab={setActiveTab} onLogout={onLogout} />

        {/* ── Dashboard content ── */}
        {activeTab === 'Dashboard' && (
          <div style={{ flex: 1, overflowY: 'auto', padding: 28 }}>

            {/* Page header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
              <div>
                <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#1e293b' }}>Welcome back, Marwa</h1>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
                  Here's a snapshot of the Polyglot Academy performance today.
                </p>
              </div>
              <button
                onClick={() => {}}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  padding: '9px 16px', borderRadius: 10, border: '1px solid #f1f5f9',
                  background: '#fff', fontSize: 13, fontWeight: 700, color: '#1e293b',
                  cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}>
                <Icons.Download /> Download Report
              </button>
            </div>

            {/* Stat cards */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
              <StatCard
                icon={Icons.Students}
                iconBg="#eff6ff" iconColor="#2563eb"
                badge="+12%" badgeColor="green"
                label="Total Students" value="2,450"
                onClick={() => setActiveTab('Students Management')}
              />
              <StatCard
                icon={Icons.TeacherPlus}
                iconBg="#fff7ed" iconColor="#f97316"
                badge="Stable" badgeColor="gray"
                label="Total Teachers" value="120"
              />
              <StatCard
                icon={Icons.BookPlus}
                iconBg="#eef2ff" iconColor="#4318FF"
                badge="+4 New" badgeColor="blue"
                label="Total Courses" value="45"
                onClick={() => setActiveTab('Scheduling Hub')}
              />
            </div>

            {/* Bottom grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>

              {/* Recent Activities */}
              <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', padding: '20px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                  <h2 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#1e293b' }}>Recent Activities</h2>
                  <button onClick={() => {}} style={{ fontSize: 12, fontWeight: 700, color: '#4318FF', background: 'none', border: 'none', cursor: 'pointer' }}>
                    View All
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <ActivityRow
                    icon={Icons.UserActivity} iconBg="#eff6ff" iconColor="#2563eb"
                    title="New student registered"
                    desc="Elena Gilbert has joined the English department."
                    time="2H AGO"
                    onClick={() => {}}
                  />
                  <ActivityRow
                    icon={Icons.Clock} iconBg="#fff7ed" iconColor="#f97316"
                    title="Teacher attendance updated"
                    desc="Attendance records for 12 faculty members were finalized."
                    time="5H AGO"
                    onClick={() => {}}
                  />
                  <ActivityRow
                    icon={Icons.CalendarCheck} iconBg="#f5f3ff" iconColor="#7c3aed"
                    title="Exam schedule published"
                    desc="Mid-term schedules for Semester 4 are now live."
                    time="6H AGO"
                    onClick={() => setActiveTab('Exams')}
                  />
                  <ActivityRow
                    icon={Icons.DollarSign} iconBg="#ecfdf5" iconColor="#059669"
                    title="Fee payment confirmed"
                    desc="Transaction #TX9842 verified for 45 students."
                    time="YESTERDAY"
                    onClick={() => setActiveTab('Payment')}
                  />
                </div>
              </div>

              {/* Quick Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', padding: '20px' }}>
                  <h2 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 800, color: '#1e293b' }}>Quick Actions</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <QuickAction icon={Icons.UserPlus}   label="Add Student"  onClick={() => setActiveTab('Students Management')} />
                    <QuickAction icon={Icons.TeacherPlus} label="Add Teacher"  onClick={() => {}} />
                    <QuickAction icon={Icons.BookPlus}   label="New Course"   onClick={() => setActiveTab('Scheduling Hub')} />
                  </div>
                </div>

                {/* Action Required */}
                <div style={{
                  background: '#fef2f2', border: '1px solid #fecaca',
                  borderRadius: 16, padding: '18px 20px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span style={{ color: '#dc2626' }}><Icons.Alert /></span>
                    <h4 style={{ margin: 0, fontSize: 13, fontWeight: 800, color: '#991b1b' }}>Action Required</h4>
                  </div>
                  <p style={{ margin: '0 0 14px', fontSize: 12, color: '#b91c1c', lineHeight: 1.5 }}>
                    3 teachers have not submitted their monthly attendance reports.
                  </p>
                  <button
                    onClick={() => {}}
                    style={{
                      width: '100%', padding: '10px 0', borderRadius: 10, border: 'none',
                      background: '#dc2626', color: '#fff', fontSize: 12, fontWeight: 700,
                      cursor: 'pointer', transition: 'background .15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#b91c1c'}
                    onMouseLeave={e => e.currentTarget.style.background = '#dc2626'}
                  >
                    NOTIFY NOW
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── All sub-pages — UNTOUCHED ── */}
        {activeTab === 'Payment'            && <Payment />}
        {activeTab === 'Exams'              && <Exams examView={examView} setExamView={setExamView} />}
        {activeTab === 'Scheduling Hub'     && <SchedulingHub />}
        {activeTab === 'Communicate Parents'&& <ParentPortal />}
        {activeTab === 'Documents'          && <Documents />}
        {activeTab === 'School Schedule'    && <SchoolSchedule />}
        {activeTab === 'Students Management'&& <StudentsManagement />}
        {activeTab === 'Attendance Records' && <AttendanceRecords />}

      </main>
    </div>
  );
};

export default SecretaryDashboard;
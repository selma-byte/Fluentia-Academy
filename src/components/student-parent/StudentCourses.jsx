import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icons = {
  Play: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z"/>
    </svg>
  ),
  CheckCircle: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
  Lock: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  ),
  Clock: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  BookOpen: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
  ),
  User: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  Calendar: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  Download: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  ),
  TrendingUp: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
      <polyline points="17 6 23 6 23 12"/>
    </svg>
  ),
  AlertCircle: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
};

// ─── Small reusable pieces ────────────────────────────────────────────────────
const InfoRow = ({ icon: Icon, label, value }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: '#f8fafc', borderRadius: 10, border: '1px solid #f1f5f9' }}>
    <span style={{ color: '#4318FF', flexShrink: 0 }}><Icon /></span>
    <span style={{ fontSize: 11, fontWeight: 600, color: '#64748b', minWidth: 70 }}>{label}</span>
    <span style={{ fontSize: 12, fontWeight: 700, color: '#1e293b' }}>{value}</span>
  </div>
);

const StatusBadge = ({ status }) => {
  const map = {
    Completed:   { bg: '#ecfdf5', color: '#059669', dot: '#059669' },
    'In Progress':{ bg: '#eef2ff', color: '#4318FF', dot: '#4318FF' },
    Locked:      { bg: '#f8fafc', color: '#94a3b8', dot: '#94a3b8' },
  };
  const s = map[status] || map.Locked;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 20, background: s.bg, fontSize: 10, fontWeight: 700, color: s.color }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot, animation: status === 'In Progress' ? 'pulse 2s infinite' : 'none' }} />
      {status}
    </span>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const StudentCourses = () => {
  const [activeClass, setActiveClass] = useState(null);
  const [loading, setLoading]         = useState(true);

  // ── All original Supabase logic — UNTOUCHED ───────────────────────────────
  useEffect(() => {
    const fetchMyCourse = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: student } = await supabase
          .from('students')
          .select('group_name, language, level')
          .eq('email', user.email)
          .single();

        if (student && student.group_name) {
          const { data: cls } = await supabase
            .from('classes')
            .select('*')
            .eq('name', student.group_name)
            .single();

          if (cls) {
            setActiveClass({
              name:               cls.name || student.group_name,
              subject:            `${student.language || 'Language'} - ${student.level || 'Level'}`,
              teacher:            cls.teacher_name || 'Assigned Professor',
              schedule:           cls.schedule || 'Mon & Wed - 14:00',
              completed_sessions: cls.completed_sessions || 0,
              total_sessions:     cls.total_sessions || 24,
            });
          }
        }
      } catch (err) {
        console.error("Error fetching course:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyCourse();
  }, []);

  // ── All original computed values — UNTOUCHED ─────────────────────────────
  const progressPercentage = activeClass && activeClass.total_sessions > 0
    ? Math.min(Math.round((activeClass.completed_sessions / activeClass.total_sessions) * 100), 100)
    : 0;

  const getModuleStatus = (threshold) => {
    if (progressPercentage >= threshold)      return "Completed";
    if (progressPercentage >= threshold - 20) return "In Progress";
    return "Locked";
  };

  const curriculum = [
    { id: 1, title: "Module 1: Foundations & Grammar",    duration: "20% of Course", status: getModuleStatus(20)  },
    { id: 2, title: "Module 2: Vocabulary Expansion",     duration: "20% of Course", status: getModuleStatus(40)  },
    { id: 3, title: "Module 3: Conversational Fluency",   duration: "20% of Course", status: getModuleStatus(60)  },
    { id: 4, title: "Module 4: Advanced Writing",         duration: "20% of Course", status: getModuleStatus(80)  },
    { id: 5, title: "Module 5: Final Assessment Prep",    duration: "20% of Course", status: getModuleStatus(100) },
  ];

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingBottom: 24 }}>

      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#1e293b' }}>My Learning Path</h2>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
            Track your progress, view scheduled sessions, and access your active modules.
          </p>
        </div>
        <button style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '9px 18px', borderRadius: 10, border: '1px solid #e0e7ff',
          background: '#f5f3ff', color: '#4318FF', fontSize: 12, fontWeight: 700, cursor: 'pointer',
        }}>
          <Icons.Download /> Download Curriculum PDF
        </button>
      </div>

      {/* ── Loading ──────────────────────────────────────────────────────── */}
      {loading && (
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', padding: '48px 0', textAlign: 'center' }}>
          <div style={{ width: 36, height: 36, border: '3px solid #e0e7ff', borderTopColor: '#4318FF', borderRadius: '50%', margin: '0 auto 12px', animation: 'spin 0.8s linear infinite' }} />
          <p style={{ color: '#94a3b8', fontSize: 13, fontWeight: 600 }}>Loading course data...</p>
        </div>
      )}

      {/* ── No course ────────────────────────────────────────────────────── */}
      {!loading && !activeClass && (
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', padding: '56px 0', textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', color: '#94a3b8' }}>
            <Icons.BookOpen />
          </div>
          <p style={{ color: '#94a3b8', fontSize: 14, fontWeight: 700, margin: 0 }}>No active courses assigned yet.</p>
          <p style={{ color: '#cbd5e1', fontSize: 12, margin: '6px 0 0' }}>Contact your secretary to get enrolled in a class.</p>
        </div>
      )}

      {/* ── Course content ───────────────────────────────────────────────── */}
      {!loading && activeClass && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, alignItems: 'start' }}>

          {/* LEFT col */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* ── Active Course Card ──────────────────────────────────── */}
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', overflow: 'hidden' }}>

              {/* Card top accent */}
              <div style={{ height: 4, background: 'linear-gradient(90deg, #4318FF, #818cf8)' }} />

              <div style={{ padding: 24 }}>
                {/* Status + title */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                  <div>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      padding: '3px 10px', borderRadius: 20, marginBottom: 10,
                      background: progressPercentage >= 100 ? '#ecfdf5' : '#eef2ff',
                      color:      progressPercentage >= 100 ? '#059669'  : '#4318FF',
                      fontSize: 10, fontWeight: 700,
                    }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: progressPercentage >= 100 ? '#059669' : '#4318FF' }} />
                      {progressPercentage >= 100 ? 'Completed' : 'Active Term'}
                    </span>
                    <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#1e293b' }}>{activeClass.name}</h3>
                    <p style={{ margin: '4px 0 0', fontSize: 12, color: '#64748b' }}>{activeClass.subject}</p>
                  </div>
                  {/* Sessions counter */}
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: 0, fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>Sessions</p>
                    <p style={{ margin: '2px 0 0', fontSize: 22, fontWeight: 800, color: '#1e293b' }}>
                      {activeClass.completed_sessions}
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#94a3b8' }}>/{activeClass.total_sessions}</span>
                    </p>
                  </div>
                </div>

                {/* Info rows */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
                  <InfoRow icon={Icons.User}     label="Instructor" value={activeClass.teacher} />
                  <InfoRow icon={Icons.Calendar} label="Schedule"   value={activeClass.schedule} />
                </div>

                {/* Progress */}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: '#64748b' }}>
                      <Icons.TrendingUp /> Course Completion
                    </div>
                    <span style={{ fontSize: 18, fontWeight: 800, color: progressPercentage >= 100 ? '#059669' : '#4318FF' }}>
                      {progressPercentage}%
                    </span>
                  </div>
                  {/* Track */}
                  <div style={{ height: 8, background: '#f1f5f9', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: 99,
                      width: `${progressPercentage}%`,
                      background: progressPercentage >= 100
                        ? 'linear-gradient(90deg, #059669, #34d399)'
                        : 'linear-gradient(90deg, #4318FF, #818cf8)',
                      transition: 'width 1s ease',
                    }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>

                {/* CTA button */}
                <button style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  padding: '12px 0', borderRadius: 10, border: 'none', cursor: 'pointer',
                  fontSize: 13, fontWeight: 700,
                  background: progressPercentage >= 100 ? '#059669' : '#4318FF',
                  color: '#fff',
                  boxShadow: progressPercentage >= 100
                    ? '0 4px 14px rgba(5,150,105,0.25)'
                    : '0 4px 14px rgba(67,24,255,0.25)',
                }}>
                  {progressPercentage >= 100
                    ? <><Icons.CheckCircle /> View Certificate</>
                    : <><Icons.Play /> Continue Learning</>}
                </button>
              </div>
            </div>

            {/* ── Progress Summary Stats ──────────────────────────────── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
              {[
                { label: 'Completed', value: curriculum.filter(m => m.status === 'Completed').length,   color: '#059669', bg: '#ecfdf5' },
                { label: 'In Progress', value: curriculum.filter(m => m.status === 'In Progress').length, color: '#4318FF', bg: '#eef2ff' },
                { label: 'Locked',    value: curriculum.filter(m => m.status === 'Locked').length,      color: '#94a3b8', bg: '#f8fafc' },
              ].map(s => (
                <div key={s.label} style={{ background: '#fff', borderRadius: 12, border: '1px solid #f1f5f9', padding: '16px', textAlign: 'center' }}>
                  <p style={{ margin: 0, fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</p>
                  <p style={{ margin: '4px 0 0', fontSize: 11, fontWeight: 600, color: '#64748b' }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT col — Curriculum map */}
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
            <div style={{ padding: '18px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ color: '#4318FF' }}><Icons.BookOpen /></span>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#1e293b' }}>Curriculum Map</h3>
            </div>

            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 0, position: 'relative' }}>
              {/* Vertical line */}
              <div style={{ position: 'absolute', left: 31, top: 32, bottom: 32, width: 2, background: 'linear-gradient(to bottom, #4318FF, #e2e8f0)', zIndex: 0 }} />

              {curriculum.map((mod, idx) => {
                const isCompleted   = mod.status === 'Completed';
                const isInProgress  = mod.status === 'In Progress';
                const isLocked      = mod.status === 'Locked';

                return (
                  <div key={mod.id} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', paddingBottom: idx < curriculum.length - 1 ? 20 : 0, position: 'relative', zIndex: 1 }}>
                    {/* Dot */}
                    <div style={{
                      width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginTop: 14,
                      background: isCompleted ? '#059669' : isInProgress ? '#4318FF' : '#f1f5f9',
                      color: isLocked ? '#94a3b8' : '#fff',
                      boxShadow: isInProgress ? '0 0 0 4px rgba(67,24,255,0.15)' : 'none',
                      border: isLocked ? '2px solid #e2e8f0' : 'none',
                    }}>
                      {isCompleted  && <Icons.CheckCircle />}
                      {isInProgress && <span style={{ width: 8, height: 8, background: '#fff', borderRadius: '50%' }} />}
                      {isLocked     && <Icons.Lock />}
                    </div>

                    {/* Card */}
                    <div style={{
                      flex: 1, padding: '12px 14px', borderRadius: 12, border: '1px solid',
                      borderColor: isInProgress ? '#c7d2fe' : '#f1f5f9',
                      background: isInProgress ? '#eef2ff' : isLocked ? '#f8fafc' : '#fff',
                      opacity: isLocked ? 0.6 : 1,
                      transform: isInProgress ? 'translateX(2px)' : 'none',
                      transition: 'all .2s',
                    }}>
                      <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: isInProgress ? '#4318FF' : '#1e293b' }}>{mod.title}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                        <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600 }}>{mod.duration}</span>
                        <StatusBadge status={mod.status} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Keyframes */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:.4; } }
      `}</style>
    </div>
  );
};

export default StudentCourses;
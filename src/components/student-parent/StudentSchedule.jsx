import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icons = {
  Clock: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  Calendar: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  Download: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  ),
  User: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  MapPin: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  ChevronDown: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  ),
  Refresh: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10"/>
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
    </svg>
  ),
  Video: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>
    </svg>
  ),
  X: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  TodayFocus: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
};

// ─── Language colour system (matches secretary palette) ───────────────────────
const LANG_COLORS = {
  english:  { border: '#f97316', bg: '#fff7ed', text: '#c2410c', dot: '#f97316', label: 'ENGLISH'  },
  french:   { border: '#a855f7', bg: '#faf5ff', text: '#7e22ce', dot: '#a855f7', label: 'FRENCH'   },
  spanish:  { border: '#3b82f6', bg: '#eff6ff', text: '#1d4ed8', dot: '#3b82f6', label: 'SPANISH'  },
  german:   { border: '#22c55e', bg: '#f0fdf4', text: '#15803d', dot: '#22c55e', label: 'GERMAN'   },
  arabic:   { border: '#ef4444', bg: '#fef2f2', text: '#b91c1c', dot: '#ef4444', label: 'ARABIC'   },
  italian:  { border: '#eab308', bg: '#fefce8', text: '#a16207', dot: '#eab308', label: 'ITALIAN'  },
  default:  { border: '#4318FF', bg: '#eef2ff', text: '#3730a3', dot: '#4318FF', label: 'COURSE'   },
};

const getLangColor = (lang = '') => {
  const key = lang.toLowerCase().split(' ')[0];
  return LANG_COLORS[key] || LANG_COLORS.default;
};

// ─── Constants ────────────────────────────────────────────────────────────────
const TIME_SLOTS = ['10:00', '12:00', '14:00', '16:00', '18:00', '20:00'];
const DAYS       = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SUN'];
const DAY_LABELS = { MON: 'Monday', TUE: 'Tuesday', WED: 'Wednesday', THU: 'Thursday', FRI: 'Friday', SUN: 'Sunday' };

// today's day abbreviation
const todayAbbr = () => {
  const map = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SUN'];
  return map[new Date().getDay()];
};

// ─── Session Card ─────────────────────────────────────────────────────────────
const SessionCard = ({ session, onClick }) => {
  const col = getLangColor(session.subject);
  return (
    <div
      onClick={onClick}
      style={{
        height: '100%', borderRadius: 10, padding: '10px 12px',
        background: col.bg,
        borderLeft: `3px solid ${col.border}`,
        border: `1px solid ${col.border}22`,
        borderLeftWidth: 3,
        cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        transition: 'box-shadow .15s, transform .15s',
        minHeight: 90,
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.10)'; e.currentTarget.style.transform = 'scale(1.02)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'scale(1)'; }}
    >
      <div>
        <p style={{ margin: 0, fontSize: 9, fontWeight: 700, color: col.text, textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.7 }}>COURSE</p>
        <p style={{ margin: '3px 0 0', fontSize: 12, fontWeight: 800, color: col.text, lineHeight: 1.3 }}>{session.subject}</p>
      </div>
      <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: col.text, opacity: 0.75 }}>
          <Icons.User />
          <span style={{ fontSize: 10, fontWeight: 600 }}>{session.teacher}</span>
        </div>
        {session.room && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: col.text, opacity: 0.75 }}>
            <Icons.MapPin />
            <span style={{ fontSize: 10, fontWeight: 600 }}>{session.room}</span>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Empty cell ───────────────────────────────────────────────────────────────
const EmptyCell = () => (
  <div style={{
    height: '100%', borderRadius: 10, minHeight: 90,
    border: '1px dashed #e2e8f0',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  }}>
    <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#e2e8f0' }} />
  </div>
);

// ─── Session Modal ────────────────────────────────────────────────────────────
const SessionModal = ({ session, onClose }) => {
  const col = getLangColor(session.subject);
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)',
        backdropFilter: 'blur(4px)', zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
      }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: '#fff', borderRadius: 20, width: '100%', maxWidth: 440,
        boxShadow: '0 24px 64px rgba(0,0,0,0.18)', overflow: 'hidden',
      }}>
        {/* Accent bar */}
        <div style={{ height: 4, background: col.border }} />
        <div style={{ padding: 28 }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
            <div>
              <span style={{ fontSize: 10, fontWeight: 700, color: col.text, background: col.bg, padding: '2px 10px', borderRadius: 20, textTransform: 'uppercase' }}>
                Course Session
              </span>
              <h3 style={{ margin: '10px 0 0', fontSize: 20, fontWeight: 800, color: '#1e293b' }}>{session.subject}</h3>
            </div>
            <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #f1f5f9', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}>
              <Icons.X />
            </button>
          </div>

          {/* Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
            {[
              { label: 'Instructor', value: session.teacher, icon: Icons.User },
              { label: 'Day', value: DAY_LABELS[session.day] || session.day, icon: Icons.Calendar },
              { label: 'Time', value: session.time, icon: Icons.Clock },
              ...(session.room ? [{ label: 'Room', value: session.room, icon: Icons.MapPin }] : []),
              { label: 'Type', value: session.type || 'In-Person', icon: Icons.Video },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#f8fafc', borderRadius: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#64748b', fontSize: 12, fontWeight: 600 }}>
                  <Icon /> {label}
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{value}</span>
              </div>
            ))}
          </div>

          <button style={{
            width: '100%', padding: '12px 0', borderRadius: 10, border: 'none',
            background: '#0f172a', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer',
          }}>
            Join Session
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const StudentSchedule = () => {
  const [activeSession, setActiveSession] = useState(null);
  const [mySchedule,    setMySchedule]    = useState([]);
  const [studentLevel,  setStudentLevel]  = useState('');
  const [loading,       setLoading]       = useState(true);
  const [langFilter,    setLangFilter]    = useState('All Languages');
  const [showFilter,    setShowFilter]    = useState(false);

  const today = todayAbbr();

  // ── All original Supabase logic — UNTOUCHED ───────────────────────────────
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: student } = await supabase
          .from('students')
          .select('language, level, group_name')
          .eq('email', user.email)
          .single();

        if (student) {
          setStudentLevel(`${student.language} ${student.level}`);

          const { data: classes } = await supabase
            .from('classes')
            .select('*')
            .ilike('language', `%${student.language}%`)
            .eq('level', student.level);

          if (classes) {
            const formatted = classes.map(cls => ({
              day:     cls.schedule?.split(' ')[0]?.toUpperCase() || 'MON',
              time:    cls.schedule?.match(/\d{2}:\d{2}/)?.[0] || '10:00',
              subject: `${cls.language} ${cls.level}`,
              teacher: cls.teacher_name || 'Instructor',
              room:    cls.room || cls.location || '',
              type:    cls.name || 'CLASSE',
            }));
            setMySchedule(formatted);
          }
        }
      } catch (err) {
        console.error('Error fetching schedule:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedule();
  }, []);

  // ── Derived data ──────────────────────────────────────────────────────────
  const uniqueLangs = ['All Languages', ...new Set(mySchedule.map(s => s.subject.split(' ')[0]))];

  const filtered = langFilter === 'All Languages'
    ? mySchedule
    : mySchedule.filter(s => s.subject.toLowerCase().startsWith(langFilter.toLowerCase()));

  const todaySessions = filtered.filter(s => s.day === today);

  const getSession = (day, time) =>
    filtered.find(s => s.day.includes(day) && s.time === time) || null;

  const totalToday = mySchedule.filter(s => s.day === today).length;

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', paddingBottom: 24 }}>

      {/* ── Main timetable ───────────────────────────────────────────────── */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Page header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#1e293b' }}>Academic Timetable</h2>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
              Personalized schedule for <span style={{ fontWeight: 700, color: '#4318FF' }}>{studentLevel || 'Your Level'}</span>. Only your assigned modules are shown.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Language filter */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowFilter(v => !v)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '8px 14px', borderRadius: 10, border: '1px solid #f1f5f9',
                  background: '#fff', color: '#1e293b', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                }}>
                {langFilter} <Icons.ChevronDown />
              </button>
              {showFilter && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 6px)', right: 0,
                  background: '#fff', borderRadius: 12, border: '1px solid #f1f5f9',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.10)', zIndex: 30, minWidth: 160, overflow: 'hidden',
                }}>
                  {uniqueLangs.map(lang => (
                    <button key={lang} onClick={() => { setLangFilter(lang); setShowFilter(false); }}
                      style={{
                        width: '100%', padding: '10px 16px', textAlign: 'left',
                        background: langFilter === lang ? '#f5f3ff' : 'transparent',
                        color: langFilter === lang ? '#4318FF' : '#1e293b',
                        fontSize: 13, fontWeight: langFilter === lang ? 700 : 600,
                        border: 'none', cursor: 'pointer',
                        borderBottom: '1px solid #f8fafc',
                      }}>
                      {lang}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Refresh */}
            <button
              onClick={() => window.location.reload()}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 14px', borderRadius: 10, border: '1px solid #f1f5f9',
                background: '#fff', color: '#64748b', fontSize: 12, fontWeight: 700, cursor: 'pointer',
              }}>
              <Icons.Refresh /> Refresh
            </button>
          </div>
        </div>

        {/* Timetable card */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#1e293b' }}>Classes Timetable</h3>
            <button style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 14px', borderRadius: 8, border: '1px solid #e0e7ff',
              background: '#f5f3ff', color: '#4318FF', fontSize: 12, fontWeight: 700, cursor: 'pointer',
            }}>
              <Icons.Download /> Save Offline Copy
            </button>
          </div>

          {loading ? (
            <div style={{ padding: '60px 0', textAlign: 'center' }}>
              <div style={{ width: 32, height: 32, border: '3px solid #e0e7ff', borderTopColor: '#4318FF', borderRadius: '50%', margin: '0 auto 12px', animation: 'spin .8s linear infinite' }} />
              <p style={{ color: '#94a3b8', fontSize: 13, fontWeight: 600 }}>Loading your schedule...</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto', padding: '0 0 4px' }}>
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 4, minWidth: 780 }}>
                <thead>
                  <tr>
                    {/* Time col header */}
                    <th style={{ width: 80, padding: '10px 8px', background: '#f8fafc', borderRadius: 8, textAlign: 'center' }}>
                      <Icons.Clock />
                    </th>
                    {DAYS.map(day => {
                      const isToday = day === today;
                      return (
                        <th key={day} style={{
                          padding: '10px 8px', textAlign: 'center',
                          background: isToday ? '#eef2ff' : '#f8fafc',
                          borderRadius: 8,
                        }}>
                          <p style={{ margin: 0, fontSize: 10, fontWeight: 800, color: isToday ? '#4318FF' : '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{day}</p>
                          <p style={{ margin: '2px 0 0', fontSize: 10, fontWeight: 600, color: isToday ? '#4318FF' : '#cbd5e1' }}>
                            {isToday ? 'Today' : 'Week Day'}
                          </p>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {TIME_SLOTS.map(time => (
                    <tr key={time}>
                      <td style={{ padding: '4px 8px', textAlign: 'center', verticalAlign: 'middle' }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8' }}>{time}</span>
                      </td>
                      {DAYS.map(day => {
                        const session = getSession(day, time);
                        return (
                          <td key={day + time} style={{ padding: 4, verticalAlign: 'top', height: 110 }}>
                            {session
                              ? <SessionCard session={session} onClick={() => setActiveSession(session)} />
                              : <EmptyCell />}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Language legend */}
          {!loading && mySchedule.length > 0 && (
            <div style={{ padding: '12px 20px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {[...new Set(mySchedule.map(s => s.subject.split(' ')[0]))].map(lang => {
                const col = getLangColor(lang);
                return (
                  <div key={lang} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: '#64748b' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: col.dot, display: 'inline-block' }} />
                    {lang.toUpperCase()}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Right sidebar ────────────────────────────────────────────────── */}
      <div style={{ width: 260, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Today's Focus */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icons.TodayFocus />
              <h4 style={{ margin: 0, fontSize: 13, fontWeight: 800, color: '#1e293b' }}>Today's Focus</h4>
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#4318FF', background: '#eef2ff', padding: '2px 8px', borderRadius: 20 }}>
              {today}
            </span>
          </div>
          <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {todaySessions.length > 0 ? todaySessions.map((s, i) => {
              const col = getLangColor(s.subject);
              return (
                <div key={i} onClick={() => setActiveSession(s)} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                  borderRadius: 10, border: `1px solid ${col.border}22`, background: col.bg, cursor: 'pointer',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: col.dot, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: col.text, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{s.subject}</p>
                    <p style={{ margin: '2px 0 0', fontSize: 11, color: '#64748b' }}>{s.time} · {s.teacher}</p>
                  </div>
                </div>
              );
            }) : (
              <p style={{ padding: '16px 0', textAlign: 'center', color: '#94a3b8', fontSize: 12, fontWeight: 600 }}>No classes today</p>
            )}
          </div>
        </div>

        {/* Class Health */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', padding: '18px' }}>
          <h4 style={{ margin: '0 0 14px', fontSize: 13, fontWeight: 800, color: '#1e293b' }}>Class Health</h4>
          {/* Progress bar */}
          <div style={{ height: 6, background: '#f1f5f9', borderRadius: 99, marginBottom: 14 }}>
            <div style={{
              height: '100%', borderRadius: 99,
              width: mySchedule.length > 0 ? '100%' : '0%',
              background: 'linear-gradient(90deg, #4318FF, #818cf8)',
              transition: 'width 1s ease',
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <p style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#1e293b' }}>{mySchedule.length}</p>
              <p style={{ margin: '2px 0 0', fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>Total Classes</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#4318FF' }}>{totalToday}</p>
              <p style={{ margin: '2px 0 0', fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>Today</p>
            </div>
          </div>
        </div>

        {/* Term Status */}
        <div style={{ background: '#0f172a', borderRadius: 16, padding: '18px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: -16, bottom: -16, fontSize: 80, fontWeight: 900, color: 'rgba(255,255,255,0.04)', fontStyle: 'italic', pointerEvents: 'none', lineHeight: 1 }}>F</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, position: 'relative' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#4318FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <Icons.Calendar />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: '#fff' }}>Academic Year 2026</p>
              <p style={{ margin: '2px 0 0', fontSize: 11, color: '#64748b', fontWeight: 600 }}>Active Semester</p>
            </div>
          </div>
          <p style={{ margin: '0 0 14px', fontSize: 11, color: '#475569', position: 'relative' }}>
            Session links activate only during scheduled timeframes. Refresh 5 minutes before class.
          </p>
          <button style={{
            width: '100%', padding: '10px 0', borderRadius: 10,
            border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.07)',
            color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', position: 'relative',
          }}>
            Enter Classroom
          </button>
        </div>

      </div>

      {/* Session Modal */}
      {activeSession && <SessionModal session={activeSession} onClose={() => setActiveSession(null)} />}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default StudentSchedule;
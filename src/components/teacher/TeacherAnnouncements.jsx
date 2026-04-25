import React, { useState } from 'react';

// ─────────────────────────────────────────────────────────────────
// SVG ICON SYSTEM — no emojis
// ─────────────────────────────────────────────────────────────────
const Ico = ({ d, size = 16, color = 'currentColor', sw = 2, extra = null }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {(Array.isArray(d) ? d : [d]).map((p, i) => <path key={i} d={p} />)}
    {extra}
  </svg>
);

const Icons = {
  Plus:     (c = '#fff')     => <Ico d={["M12 5v14","M5 12h14"]} color={c} sw={2.5} />,
  Calendar: (c = '#94a3b8')  => <Ico d={["M8 2v4","M16 2v4","M3 10h18","M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"]} color={c} />,
  X:        (c = '#94a3b8')  => <Ico d={["M18 6L6 18","M6 6l12 12"]} color={c} sw={2.5} />,
  User:     (c = '#4318FF')  => <Ico d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" color={c} extra={<circle cx="12" cy="7" r="4" fill="none" stroke={c} strokeWidth="2"/>} />,
  Megaphone:(c = '#4318FF')  => <Ico d={["M3 11l19-9-9 19-2-8-8-2z"]} color={c} />,
  ChevronL: (c = '#1e293b')  => <Ico d="M15 18l-6-6 6-6" color={c} sw={2.5} />,
  ChevronR: (c = '#1e293b')  => <Ico d="M9 18l6-6-6-6" color={c} sw={2.5} />,
};

// ─── Card wrapper ─────────────────────────────────────────────────
const Card = ({ children, style = {} }) => (
  <div style={{
    background: '#fff', borderRadius: 16,
    border: '1px solid #f1f5f9',
    boxShadow: '0 1px 4px rgba(15,23,42,0.05)',
    ...style,
  }}>{children}</div>
);

// ─── Type badge ───────────────────────────────────────────────────
const TypeBadge = ({ type }) => {
  const map = {
    Event:    { bg: '#ecfdf5', color: '#059669' },
    Reminder: { bg: '#fffbeb', color: '#f59e0b' },
    Urgent:   { bg: '#fef2f2', color: '#ef4444' },
    General:  { bg: '#eef2ff', color: '#4318FF' },
  };
  const s = map[type] || { bg: '#eef2ff', color: '#4318FF' };
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
      letterSpacing: '0.07em', padding: '3px 10px',
      borderRadius: 20, background: s.bg, color: s.color,
    }}>{type}</span>
  );
};

// ─────────────────────────────────────────────────────────────────
// MAIN COMPONENT  — all state & logic UNTOUCHED
// ─────────────────────────────────────────────────────────────────
const TeacherAnnouncements = () => {

  const [showModal, setShowModal]               = useState(false);
  const [newTitle, setNewTitle]                 = useState('');
  const [newContent, setNewContent]             = useState('');
  const [newPriority, setNewPriority]           = useState('General');
  const [newExpiry, setNewExpiry]               = useState('');
  const [selectedAudience, setSelectedAudience] = useState(['Students']);

  const [announcements, setAnnouncements] = useState([
    { id: 1, type: 'Event',    date: 'Oct 25, 2025', title: 'Winter Festival Planning Meeting',  content: 'We are organizing our annual Winter Festival! Teachers and staff interested in helping with planning, please join us this Thursday at 4 PM in the staff room.',                           author: 'Admin'   },
    { id: 2, type: 'Reminder', date: 'Oct 26, 2025', title: 'Homework Submission Deadline',      content: 'Reminder: All assignments for Mathematics (Grade 7) are due this Friday, November 1st. Please submit through the online portal before 3 PM.',                                          author: 'Teacher' },
    { id: 3, type: 'General',  date: 'Oct 27, 2025', title: 'New Library Books Available',       content: "We've added 150 new books to our library collection! Students can now browse and check out books in Danish, English, and other languages. Visit the library during lunch hours.",      author: 'Admin'   },
    { id: 4, type: 'Urgent',   date: 'Oct 29, 2025', title: 'School Closure - Weather Alert',    content: 'Due to severe weather conditions, the school will be closed tomorrow, October 30th. All classes will move to online learning.',                                                        author: 'Admin'   },
    { id: 5, type: 'Event',    date: 'Oct 28, 2025', title: 'Parent-Teacher Conference Schedule',content: 'Parent-teacher conferences are scheduled for November 15-16. Please use the online booking system to reserve your time slot. Conferences will be 15 minutes each.',                  author: 'Admin'   },
  ]);

  // ── All original logic — UNTOUCHED ───────────────────────────────
  const toggleAudience = (audience) => {
    if (selectedAudience.includes(audience)) {
      setSelectedAudience(selectedAudience.filter(a => a !== audience));
    } else {
      setSelectedAudience([...selectedAudience, audience]);
    }
  };

  const handlePublish = (e) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;
    const newAnnouncement = {
      id: announcements.length + 1,
      type: newPriority,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      title: newTitle,
      content: newContent,
      author: 'Teacher Name',
    };
    setAnnouncements([newAnnouncement, ...announcements]);
    setShowModal(false);
    setNewTitle('');
    setNewContent('');
    setNewPriority('General');
    setNewExpiry('');
    setSelectedAudience(['Students']);
  };

  // ── Shared styles ─────────────────────────────────────────────────
  const inputStyle = {
    width: '100%', background: '#f8fafc',
    border: '1px solid #f1f5f9', borderRadius: 10,
    padding: '10px 14px', fontSize: 13, color: '#1e293b',
    outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
    transition: 'border-color .15s',
  };

  const labelStyle = {
    display: 'block', fontSize: 11, fontWeight: 700,
    color: '#94a3b8', textTransform: 'uppercase',
    letterSpacing: '0.07em', marginBottom: 6,
  };

  // ── Calendar helpers (dynamic, same as student/teacher dashboards) ─
  const today       = new Date();
  const todayDate   = today.getDate();
  const monthName   = today.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  const firstDay    = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
  const offset      = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

  // ─────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ width: '100%', fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>

      {/* ── Page header ── */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#1e293b' }}>Announcements</h1>
        <p style={{ margin: '5px 0 0', fontSize: 13, color: '#94a3b8' }}>
          Stay updated with the latest news, events, and important notices.
        </p>
      </div>

      {/* ── Main layout: cards left, calendar right ── */}
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>

        {/* ══════════ LEFT: announcements ══════════ */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Section bar */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20,
          }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#1e293b' }}>All Announcements</h2>
              <p style={{ margin: '3px 0 0', fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                {announcements.length} total
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 7,
                padding: '10px 18px', borderRadius: 10, border: 'none',
                background: '#4318FF', color: '#fff',
                fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'background .15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#3730a3'}
              onMouseLeave={e => e.currentTarget.style.background = '#4318FF'}
            >
              {Icons.Plus()}
              Add Announcement
            </button>
          </div>

          {/* Announcement cards grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {announcements.map(ann => (
              <Card key={ann.id} style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', minHeight: 190 }}>

                {/* Top row: badge + date */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <TypeBadge type={ann.type} />
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>
                    {Icons.Calendar()}
                    {ann.date}
                  </span>
                </div>

                {/* Title */}
                <h3 style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 700, color: '#1e293b', lineHeight: 1.4 }}>
                  {ann.title}
                </h3>

                {/* Content */}
                <p style={{
                  margin: 0, fontSize: 13, color: '#64748b', lineHeight: 1.6, flex: 1,
                  display: '-webkit-box', WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical', overflow: 'hidden',
                }}>{ann.content}</p>

                {/* Author */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  borderTop: '1px solid #f8fafc', paddingTop: 12, marginTop: 14,
                }}>
                  <div style={{
                    width: 26, height: 26, borderRadius: '50%',
                    background: '#eef2ff', color: '#4318FF',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, fontWeight: 800, textTransform: 'uppercase',
                  }}>{ann.author.charAt(0)}</div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8' }}>{ann.author}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* ══════════ RIGHT: calendar ══════════ */}
        <div style={{ width: 268, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Date label */}
          <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: '#94a3b8', textAlign: 'right' }}>
            {today.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>

          {/* Semester progress */}
          <Card style={{ padding: '16px 18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#1e293b' }}>Semester Progress</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#4318FF' }}>Semester 3 / 8</span>
            </div>
            <div style={{ height: 6, background: '#f1f5f9', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: '37%', background: '#4318FF', borderRadius: 99 }} />
            </div>
          </Card>

          {/* Calendar — dynamic, matches teacher/student dashboards */}
          <Card style={{ padding: '18px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', color: '#1e293b' }}>
                {Icons.ChevronL()}
              </button>
              <h4 style={{ margin: 0, fontSize: 13, fontWeight: 800, color: '#1e293b' }}>{monthName}</h4>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', color: '#1e293b' }}>
                {Icons.ChevronR()}
              </button>
            </div>

            {/* Day headers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', textAlign: 'center', marginBottom: 8 }}>
              {['M','T','W','T','F','S','S'].map((d, i) => (
                <div key={i} style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', paddingBottom: 6 }}>{d}</div>
              ))}
            </div>

            {/* Days */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '4px 2px', textAlign: 'center' }}>
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
                    color: isToday ? '#fff' : day > 25 ? '#cbd5e1' : '#1e293b',
                    cursor: 'default',
                  }}>{day}</div>
                );
              })}
            </div>
          </Card>

        </div>
      </div>

      {/* ══════════════════════════════════════
          MODAL — Create New Announcement
      ══════════════════════════════════════ */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(15,23,42,0.5)',
          backdropFilter: 'blur(4px)',
          zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            background: '#fff', borderRadius: 20,
            padding: '32px', width: 540,
            boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
            position: 'relative', maxHeight: '90vh', overflowY: 'auto',
          }}>
            {/* Modal header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#1e293b' }}>Create New Announcement</h2>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: '#94a3b8' }}>Share important information with the school community.</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  width: 32, height: 32, borderRadius: 8, border: 'none',
                  background: '#f8fafc', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#94a3b8', flexShrink: 0, transition: 'background .15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                onMouseLeave={e => e.currentTarget.style.background = '#f8fafc'}
              >
                {Icons.X('#ef4444')}
              </button>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: '#f1f5f9', margin: '20px 0' }} />

            {/* Form */}
            <form onSubmit={handlePublish} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

              <div>
                <label style={labelStyle}>Title</label>
                <input type="text" required placeholder="e.g. Winter Festival Planning Meeting"
                  value={newTitle} onChange={e => setNewTitle(e.target.value)}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#4318FF'}
                  onBlur={e => e.target.style.borderColor = '#f1f5f9'}
                />
              </div>

              <div>
                <label style={labelStyle}>Content</label>
                <textarea required rows={4} placeholder="Write your announcement here..."
                  value={newContent} onChange={e => setNewContent(e.target.value)}
                  style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
                  onFocus={e => e.target.style.borderColor = '#4318FF'}
                  onBlur={e => e.target.style.borderColor = '#f1f5f9'}
                />
              </div>

              {/* Priority + Expiry row */}
              <div style={{ display: 'flex', gap: 14 }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Priority</label>
                  <select value={newPriority} onChange={e => setNewPriority(e.target.value)}
                    style={{ ...inputStyle, cursor: 'pointer' }}
                    onFocus={e => e.target.style.borderColor = '#4318FF'}
                    onBlur={e => e.target.style.borderColor = '#f1f5f9'}
                  >
                    <option value="General">General</option>
                    <option value="Event">Event</option>
                    <option value="Reminder">Reminder</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Expiry Date</label>
                  <input type="date" value={newExpiry} onChange={e => setNewExpiry(e.target.value)}
                    style={{ ...inputStyle, color: newExpiry ? '#1e293b' : '#94a3b8' }}
                    onFocus={e => e.target.style.borderColor = '#4318FF'}
                    onBlur={e => e.target.style.borderColor = '#f1f5f9'}
                  />
                </div>
              </div>

              {/* Target audience */}
              <div>
                <label style={labelStyle}>Target Audience</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {['Students', 'Teachers', 'Parents', 'Staff'].map(audience => {
                    const isSelected = selectedAudience.includes(audience);
                    return (
                      <button key={audience} type="button"
                        onClick={() => toggleAudience(audience)}
                        style={{
                          padding: '7px 16px', borderRadius: 20, fontSize: 12, fontWeight: 700,
                          cursor: 'pointer', transition: 'all .15s',
                          border: `1px solid ${isSelected ? '#4318FF' : '#f1f5f9'}`,
                          background: isSelected ? '#4318FF' : '#f8fafc',
                          color: isSelected ? '#fff' : '#64748b',
                        }}
                      >{audience}</button>
                    );
                  })}
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: '#f1f5f9' }} />

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button type="button" onClick={() => setShowModal(false)}
                  style={{
                    padding: '10px 20px', borderRadius: 10,
                    border: '1px solid #f1f5f9', background: '#f8fafc',
                    color: '#64748b', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                  }}>
                  Cancel
                </button>
                <button type="submit"
                  style={{
                    padding: '10px 24px', borderRadius: 10, border: 'none',
                    background: '#4318FF', color: '#fff',
                    fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'background .15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#3730a3'}
                  onMouseLeave={e => e.currentTarget.style.background = '#4318FF'}
                >
                  Publish Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`* { box-sizing: border-box; }`}</style>
    </div>
  );
};

export default TeacherAnnouncements;
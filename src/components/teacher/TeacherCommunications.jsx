import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

// ─────────────────────────────────────────────────────────────────
// SVG ICON SYSTEM
// ─────────────────────────────────────────────────────────────────
const Ico = ({ d, size = 16, color = 'currentColor', sw = 2, extra = null }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {(Array.isArray(d) ? d : [d]).map((p, i) => <path key={i} d={p} />)}
    {extra}
  </svg>
);

const Icons = {
  Search:    (c = '#94a3b8') => <Ico d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0" color={c} />,
  Megaphone: (c = '#4318FF') => <Ico d={["M3 11l19-9-9 19-2-8-8-2z"]} color={c} />,
  Message:   (c = '#4318FF') => <Ico d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" color={c} />,
  Plus:      (c = '#fff')    => <Ico d={["M12 5v14","M5 12h14"]} color={c} sw={2.5} />,
  ArrowLeft: (c = '#1e293b') => <Ico d={["M19 12H5","M12 19l-7-7 7-7"]} color={c} sw={2} />,
  Send:      (c = '#4318FF') => <Ico d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" color={c} />,
  Calendar:  (c = '#94a3b8') => <Ico d={["M8 2v4","M16 2v4","M3 10h18","M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"]} color={c} />,
  Bell:      (c = '#4318FF') => <Ico d={["M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9","M13.73 21a2 2 0 0 1-3.46 0"]} color={c} />,
  Inbox:     (c = '#94a3b8') => <Ico d={["M22 12h-6l-2 3h-4l-2-3H2","M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"]} color={c} />,
  User:      (c = '#4318FF') => <Ico d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" color={c} extra={<circle cx="12" cy="7" r="4" fill="none" stroke={c} strokeWidth="2"/>} />,
  ChevronR:  (c = '#94a3b8') => <Ico d="M9 18l6-6-6-6" color={c} sw={2.5} />,
  Paperclip: (c = '#94a3b8') => <Ico d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" color={c} />,
};

// ─── Reusable Tab Bar ─────────────────────────────────────────────
const TabBar = ({ tabs, active, onChange }) => (
  <div style={{ display: 'flex', borderBottom: '1px solid #f1f5f9', marginBottom: 28 }}>
    {tabs.map(tab => (
      <button key={tab} onClick={() => onChange(tab)} style={{
        padding: '12px 20px', fontSize: 13, fontWeight: 700,
        color: active === tab ? '#4318FF' : '#94a3b8',
        background: 'none', border: 'none', cursor: 'pointer',
        borderBottom: active === tab ? '2px solid #4318FF' : '2px solid transparent',
        marginBottom: -1, transition: 'all .2s',
      }}>{tab}</button>
    ))}
  </div>
);

// ─── Card wrapper ─────────────────────────────────────────────────
const Card = ({ children, style = {} }) => (
  <div style={{
    background: '#fff', borderRadius: 16,
    border: '1px solid #f1f5f9',
    boxShadow: '0 1px 4px rgba(15,23,42,0.05)',
    ...style
  }}>{children}</div>
);

// ─── Avatar circle ────────────────────────────────────────────────
const Avatar = ({ letter, bg = '#eef2ff', color = '#4318FF', size = 38 }) => (
  <div style={{
    width: size, height: size, borderRadius: '50%',
    background: bg, color,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: size * 0.35, fontWeight: 800, textTransform: 'uppercase', flexShrink: 0,
  }}>{letter}</div>
);

// ─── Type badge ───────────────────────────────────────────────────
const TypeBadge = ({ type }) => {
  const map = {
    Event:        { bg: '#ecfdf5', color: '#059669' },
    Reminder:     { bg: '#fffbeb', color: '#f59e0b' },
    notification: { bg: '#fffbeb', color: '#f59e0b' },
    emergency:    { bg: '#fef2f2', color: '#ef4444' },
    Urgent:       { bg: '#fef2f2', color: '#ef4444' },
    General:      { bg: '#eef2ff', color: '#4318FF' },
    announcement: { bg: '#eef2ff', color: '#4318FF' },
  };
  const s = map[type] || { bg: '#eef2ff', color: '#4318FF' };
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em',
      padding: '3px 10px', borderRadius: 20, background: s.bg, color: s.color,
    }}>{type}</span>
  );
};

// Avatar color palette (deterministic by index)
const AVATAR_COLORS = [
  { bg: '#fef3c7', color: '#92400e' },
  { bg: '#d1fae5', color: '#065f46' },
  { bg: '#dbeafe', color: '#1d4ed8' },
  { bg: '#fce7f3', color: '#9d174d' },
  { bg: '#ede9fe', color: '#6d28d9' },
];

// ─────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────
const TeacherCommunications = () => {

  // ── All original states — UNTOUCHED ──────────────────────────────
  const [activeTab, setActiveTab]         = useState('Announcements');
  const [showAddForm, setShowAddForm]     = useState(false);
  const [loading, setLoading]             = useState(true);
  const [currentUser, setCurrentUser]     = useState(null);
  const [teacherName, setTeacherName]     = useState('Teacher Name');
  const [teacherClasses, setTeacherClasses] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', type: 'Event', description: '', targetGroup: 'All' });
  const [contacts, setContacts]           = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages]           = useState([]);
  const [newMessage, setNewMessage]       = useState('');
  const [searchQuery, setSearchQuery]     = useState('');

  // ── All original Supabase logic — UNTOUCHED ───────────────────────
  useEffect(() => {
    const fetchGlobalData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user && user.email) {
          const { data: staffData } = await supabase.from('staff').select('*').eq('email', user.email).single();
          if (staffData) {
            setCurrentUser(staffData);
            let tName = `${staffData.first_name || ''} ${staffData.last_name || ''}`.trim();
            setTeacherName(tName);
            const { data: clsData } = await supabase.from('classes').select('*').eq('teacher_name', tName);
            if (clsData) setTeacherClasses(clsData.map(c => c.name || c.class_name));
          } else {
            setCurrentUser(user);
          }
          const { data: adminStaff } = await supabase.from('staff').select('*').neq('email', user.email);
          if (adminStaff && adminStaff.length > 0) {
            const formattedContacts = adminStaff.map((s, i) => ({
              id: s.id, email: s.email,
              name: `${s.first_name || ''} ${s.last_name || ''}`.trim() || 'Admin',
              role: s.department || s.role || 'Administration',
              avatar: (s.first_name ? s.first_name.charAt(0) : 'A').toUpperCase(),
              colorIdx: i % AVATAR_COLORS.length,
            }));
            setContacts(formattedContacts);
            setActiveContact(formattedContacts[0]);
          }
        }
      } catch (err) { console.error(err); }
    };
    fetchGlobalData();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const { data } = await supabase
        .from('communications').select('*')
        .in('type', ['announcement', 'notification', 'emergency', 'Event', 'Reminder', 'General'])
        .order('created_at', { ascending: false });

      if (data && data.length > 0) {
        const filteredAnnouncements = data.filter(a => {
          const target = a.recipient_name?.toLowerCase() || '';
          return target.includes('all community') || target.includes('teachers') ||
                 target.includes('staff') || target.includes('all') ||
                 a.sender_id === currentUser?.id;
        });
        setAnnouncements(filteredAnnouncements.map(a => ({
          id: a.id,
          title: a.subject || a.title || 'Announcement',
          content: a.content || a.message,
          type: a.type || 'General',
          author: a.sender_role === 'admin' ? 'Administration' : 'Teacher',
          date: new Date(a.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        })));
      } else {
        setAnnouncements([{ id: 1, title: 'Welcome', content: 'We are happy to have you here.', type: 'General', author: 'System', date: 'Today' }]);
      }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => {
    if (activeTab === 'Announcements' && !showAddForm) fetchAnnouncements();
  }, [activeTab, showAddForm, currentUser]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!currentUser || !activeContact || activeTab !== 'Messages') return;
      try {
        const { data: msgData, error } = await supabase
          .from('communications').select('*')
          .or(`and(sender_id.eq."${currentUser.id}",recipient_id.eq."${activeContact.id}"),and(sender_id.eq."${activeContact.id}",recipient_id.eq."${currentUser.id}")`)
          .order('created_at', { ascending: true });
        if (error) throw error;
        if (msgData && msgData.length > 0) {
          setMessages(msgData.map(m => ({
            id: m.id, text: m.content,
            time: new Date(m.created_at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
            isMe: m.sender_id === currentUser.id,
          })));
        } else { setMessages([]); }
      } catch (err) { console.error(err); }
    };
    fetchMessages();
  }, [activeContact, currentUser, activeTab]);

  const handleAddAnnouncement = async (e) => {
    e.preventDefault();
    if (!newAnnouncement.title || !newAnnouncement.description) return alert('Please fill in all fields.');
    try {
      await supabase.from('communications').insert([{
        subject: newAnnouncement.title, content: newAnnouncement.description,
        type: newAnnouncement.type, recipient_name: 'All Community',
        recipient_id: 'all', sender_id: currentUser?.id, sender_role: 'teacher',
        created_at: new Date().toISOString(),
      }]);
      alert('Announcement published successfully.');
      setShowAddForm(false);
      setNewAnnouncement({ title: '', type: 'Event', description: '', targetGroup: 'All' });
      fetchAnnouncements();
    } catch (error) { alert('Error publishing announcement.'); }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !activeContact || !currentUser) return;
    const text = newMessage;
    setNewMessage('');
    setMessages(prev => [...prev, { id: Date.now(), text, time: 'Now', isMe: true }]);
    await supabase.from('communications').insert([{
      sender_id: currentUser.id, recipient_id: activeContact.id,
      recipient_name: activeContact.name, content: text,
      type: 'staff_individual', sender_role: 'teacher',
      created_at: new Date().toISOString(),
    }]);
  };

  // ── Shared input style ────────────────────────────────────────────
  const inputStyle = {
    width: '100%', background: '#f8fafc',
    border: '1px solid #f1f5f9', borderRadius: 10,
    padding: '10px 14px', fontSize: 13, color: '#1e293b',
    outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
  };

  const labelStyle = {
    display: 'block', fontSize: 11, fontWeight: 700,
    color: '#94a3b8', textTransform: 'uppercase',
    letterSpacing: '0.07em', marginBottom: 6,
  };

  const filteredContacts = contacts.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ─────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ width: '100%', fontFamily: "'Inter', 'Segoe UI', sans-serif", display: 'flex', flexDirection: 'column' }}>

      {/* ── Page header ── */}
      {!showAddForm && (
        <div style={{ marginBottom: 4 }}>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#1e293b' }}>Communications Hub</h1>
          <p style={{ margin: '5px 0 0', fontSize: 13, color: '#94a3b8' }}>
            Manage announcements and messages with your administration team.
          </p>
        </div>
      )}

      {/* ── Tab bar (hidden when add form is open) ── */}
      {!showAddForm && (
        <TabBar
          tabs={['Announcements', 'Messages']}
          active={activeTab}
          onChange={setActiveTab}
        />
      )}

      {/* ══════════════════════════════════════
          ANNOUNCEMENTS LIST
      ══════════════════════════════════════ */}
      {activeTab === 'Announcements' && !showAddForm && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Section header + Add button */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#1e293b' }}>Announcements</h2>
              <p style={{ margin: '4px 0 0', fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                Latest news, events and important notices
              </p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '10px 20px', borderRadius: 10, border: 'none',
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

          {/* Cards grid */}
          {loading ? (
            <p style={{ color: '#94a3b8', fontSize: 13, padding: '40px 0', textAlign: 'center' }}>Loading announcements...</p>
          ) : announcements.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>
              {Icons.Inbox()}
              <p style={{ marginTop: 12, fontSize: 13, fontWeight: 600 }}>No announcements yet.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
              {announcements.map(a => (
                <Card key={a.id} style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', minHeight: 180 }}>
                  {/* Top row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <TypeBadge type={a.type} />
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>
                      {Icons.Calendar()}
                      {a.date}
                    </span>
                  </div>

                  {/* Title + content */}
                  <h3 style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 700, color: '#1e293b' }}>{a.title}</h3>
                  <p style={{
                    margin: 0, fontSize: 13, color: '#64748b', lineHeight: 1.6, flex: 1,
                    display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  }}>{a.content}</p>

                  {/* Author row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, borderTop: '1px solid #f8fafc', paddingTop: 12, marginTop: 14 }}>
                    <div style={{
                      width: 26, height: 26, borderRadius: '50%', background: '#eef2ff',
                      color: '#4318FF', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, fontWeight: 800, textTransform: 'uppercase',
                    }}>{a.author.charAt(0)}</div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8' }}>{a.author}</span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════
          ADD ANNOUNCEMENT FORM
      ══════════════════════════════════════ */}
      {activeTab === 'Announcements' && showAddForm && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* Back + title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button
              onClick={() => setShowAddForm(false)}
              style={{
                width: 38, height: 38, borderRadius: 10, border: '1px solid #f1f5f9',
                background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: '#1e293b', transition: 'background .15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#eef2ff'}
              onMouseLeave={e => e.currentTarget.style.background = '#f8fafc'}
            >
              {Icons.ArrowLeft()}
            </button>
            <div>
              <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#1e293b' }}>New Announcement</h1>
              <p style={{ margin: '3px 0 0', fontSize: 13, color: '#94a3b8' }}>Publish a notice to all community members.</p>
            </div>
          </div>

          {/* Form card */}
          <Card style={{ padding: '28px 32px', maxWidth: 600 }}>
            <form onSubmit={handleAddAnnouncement} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              <div>
                <label style={labelStyle}>Title</label>
                <input type="text" required placeholder="e.g. Next week field trip"
                  value={newAnnouncement.title}
                  onChange={e => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#4318FF'}
                  onBlur={e => e.target.style.borderColor = '#f1f5f9'}
                />
              </div>

              <div>
                <label style={labelStyle}>Type</label>
                <select value={newAnnouncement.type}
                  onChange={e => setNewAnnouncement({ ...newAnnouncement, type: e.target.value })}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                  onFocus={e => e.target.style.borderColor = '#4318FF'}
                  onBlur={e => e.target.style.borderColor = '#f1f5f9'}
                >
                  <option value="Event">Event</option>
                  <option value="Reminder">Reminder</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Description</label>
                <textarea required rows={5} placeholder="Write your announcement here..."
                  value={newAnnouncement.description}
                  onChange={e => setNewAnnouncement({ ...newAnnouncement, description: e.target.value })}
                  style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
                  onFocus={e => e.target.style.borderColor = '#4318FF'}
                  onBlur={e => e.target.style.borderColor = '#f1f5f9'}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 4 }}>
                <button type="button" onClick={() => setShowAddForm(false)}
                  style={{
                    padding: '10px 20px', borderRadius: 10, border: '1px solid #f1f5f9',
                    background: '#f8fafc', color: '#64748b', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                  }}>
                  Cancel
                </button>
                <button type="submit"
                  style={{
                    padding: '10px 24px', borderRadius: 10, border: 'none',
                    background: '#4318FF', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                    transition: 'background .15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#3730a3'}
                  onMouseLeave={e => e.currentTarget.style.background = '#4318FF'}
                >
                  Publish Announcement
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* ══════════════════════════════════════
          MESSAGES
      ══════════════════════════════════════ */}
      {activeTab === 'Messages' && (
        <Card style={{ display: 'flex', overflow: 'hidden', height: 580, padding: 0 }}>

          {/* ── Contacts sidebar ── */}
          <div style={{
            width: 280, borderRight: '1px solid #f1f5f9',
            display: 'flex', flexDirection: 'column', flexShrink: 0,
          }}>
            {/* Search */}
            <div style={{ padding: '16px', borderBottom: '1px solid #f8fafc' }}>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                  {Icons.Search()}
                </span>
                <input type="text" placeholder="Search contacts..."
                  value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  style={{
                    ...inputStyle,
                    paddingLeft: 36, borderRadius: 8,
                    fontSize: 12,
                  }}
                  onFocus={e => e.target.style.borderColor = '#4318FF'}
                  onBlur={e => e.target.style.borderColor = '#f1f5f9'}
                />
              </div>
            </div>

            {/* Contact list */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {filteredContacts.map((contact) => {
                const ac = AVATAR_COLORS[contact.colorIdx];
                const isActive = activeContact?.id === contact.id;
                return (
                  <div key={contact.id} onClick={() => setActiveContact(contact)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '12px 16px', cursor: 'pointer',
                      borderBottom: '1px solid #f8fafc',
                      background: isActive ? '#f5f3ff' : 'transparent',
                      transition: 'background .15s',
                    }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#f8fafc'; }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                  >
                    <Avatar letter={contact.avatar} bg={ac.bg} color={ac.color} size={40} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {contact.name}
                      </p>
                      <p style={{ margin: '2px 0 0', fontSize: 11, color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {contact.role}
                      </p>
                    </div>
                    {isActive && (
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4318FF', flexShrink: 0 }} />
                    )}
                  </div>
                );
              })}
              {filteredContacts.length === 0 && (
                <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 13, padding: '32px 0' }}>No contacts found.</p>
              )}
            </div>
          </div>

          {/* ── Chat area ── */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            {activeContact ? (
              <>
                {/* Chat header */}
                <div style={{
                  height: 64, padding: '0 24px',
                  display: 'flex', alignItems: 'center', gap: 12,
                  borderBottom: '1px solid #f1f5f9', flexShrink: 0, background: '#fff',
                }}>
                  {(() => {
                    const ac = AVATAR_COLORS[activeContact.colorIdx || 0];
                    return <Avatar letter={activeContact.avatar} bg={ac.bg} color={ac.color} size={36} />;
                  })()}
                  <div>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#1e293b' }}>{activeContact.name}</p>
                    <p style={{ margin: 0, fontSize: 11, color: '#94a3b8' }}>{activeContact.role}</p>
                  </div>
                </div>

                {/* Messages */}
                <div style={{
                  flex: 1, overflowY: 'auto', padding: '20px 24px',
                  display: 'flex', flexDirection: 'column', gap: 12,
                  background: '#f8fafc',
                }}>
                  {messages.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: 13, marginTop: 40 }}>
                      <p style={{ margin: 0, fontWeight: 600 }}>No messages yet.</p>
                      <p style={{ margin: '4px 0 0', fontSize: 12 }}>Start the conversation below.</p>
                    </div>
                  ) : messages.map(msg => {
                    const ac = AVATAR_COLORS[activeContact.colorIdx || 0];
                    return (
                      <div key={msg.id} style={{ display: 'flex', justifyContent: msg.isMe ? 'flex-end' : 'flex-start' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, maxWidth: '65%' }}>
                          {!msg.isMe && <Avatar letter={activeContact.avatar} bg={ac.bg} color={ac.color} size={28} />}
                          <div>
                            <div style={{
                              padding: '10px 14px', borderRadius: 14,
                              borderBottomRightRadius: msg.isMe ? 4 : 14,
                              borderBottomLeftRadius: msg.isMe ? 14 : 4,
                              background: msg.isMe ? '#4318FF' : '#fff',
                              color: msg.isMe ? '#fff' : '#1e293b',
                              fontSize: 13, lineHeight: 1.5,
                              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                              border: msg.isMe ? 'none' : '1px solid #f1f5f9',
                            }}>
                              {msg.text}
                            </div>
                            <p style={{ margin: '4px 0 0', fontSize: 10, color: '#94a3b8', textAlign: msg.isMe ? 'right' : 'left' }}>{msg.time}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Message input */}
                <div style={{ padding: '14px 20px', borderTop: '1px solid #f1f5f9', background: '#fff', flexShrink: 0 }}>
                  <form onSubmit={handleSendMessage}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      background: '#f8fafc', border: '1px solid #f1f5f9',
                      borderRadius: 12, padding: '8px 14px',
                    }}
                  >
                    <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex' }}>
                      {Icons.Paperclip()}
                    </button>
                    <input type="text" value={newMessage}
                      onChange={e => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      style={{
                        flex: 1, background: 'none', border: 'none', outline: 'none',
                        fontSize: 13, color: '#1e293b', fontFamily: 'inherit',
                      }}
                    />
                    <button type="submit" disabled={!newMessage.trim()}
                      style={{
                        width: 34, height: 34, borderRadius: 8, border: 'none',
                        background: newMessage.trim() ? '#4318FF' : '#f1f5f9',
                        color: newMessage.trim() ? '#fff' : '#94a3b8',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: newMessage.trim() ? 'pointer' : 'default', transition: 'all .15s', flexShrink: 0,
                      }}>
                      {Icons.Send(newMessage.trim() ? '#fff' : '#94a3b8')}
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', color: '#94a3b8', fontSize: 13, fontWeight: 600 }}>
                Select a contact to start messaging.
              </div>
            )}
          </div>
        </Card>
      )}

      <style>{`* { box-sizing: border-box; }`}</style>
    </div>
  );
};

export default TeacherCommunications;
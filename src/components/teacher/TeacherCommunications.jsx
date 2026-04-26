import React, { useState, useEffect, useRef } from 'react';
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
  Plus:      (c = '#fff')    => <Ico d={["M12 5v14","M5 12h14"]} color={c} sw={2.5} />,
  ArrowLeft: (c = '#1e293b') => <Ico d={["M19 12H5","M12 19l-7-7 7-7"]} color={c} />,
  Calendar:  (c = '#94a3b8') => <Ico d={["M8 2v4","M16 2v4","M3 10h18","M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"]} color={c} />,
  Inbox:     (c = '#94a3b8') => <Ico d={["M22 12h-6l-2 3h-4l-2-3H2","M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"]} color={c} />,
  // Chat icons
  Send:      (c = '#fff')    => <Ico d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" color={c} />,
  Paperclip: (c = '#94a3b8') => <Ico d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" color={c} />,
  Image:     (c = '#94a3b8') => <Ico d={["M21 19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z","M8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z","M21 15l-5-5L5 21"]} color={c} />,
  Smile:     (c = '#94a3b8') => <Ico d={["M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z","M8 14s1.5 2 4 2 4-2 4-2"]} color={c} extra={<><line x1="9" y1="9" x2="9.01" y2="9" stroke={c} strokeWidth="3"/><line x1="15" y1="9" x2="15.01" y2="9" stroke={c} strokeWidth="3"/></>} />,
  File:      (c = '#4318FF') => <Ico d={["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z","M14 2v6h6"]} color={c} />,
  Download:  (c = '#4318FF') => <Ico d={["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4","M7 10l5 5 5-5","M12 15V3"]} color={c} />,
  X:         (c = '#ef4444') => <Ico d={["M18 6L6 18","M6 6l12 12"]} color={c} sw={2.5} />,
  Phone:     (c = 'currentColor') => <Ico d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" color={c} />,
  Video:     (c = 'currentColor') => <Ico d={["M23 7l-7 5 7 5V7z","M1 5h15a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H1a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"]} color={c} />,
  MsgBubble: (c = '#4318FF') => <Ico d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" color={c} />,
};

// ─── Shared components ────────────────────────────────────────────
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

const Card = ({ children, style = {} }) => (
  <div style={{
    background: '#fff', borderRadius: 16,
    border: '1px solid #f1f5f9',
    boxShadow: '0 1px 4px rgba(15,23,42,0.05)',
    ...style,
  }}>{children}</div>
);

const TypeBadge = ({ type }) => {
  const map = {
    Event: { bg: '#ecfdf5', color: '#059669' }, Reminder: { bg: '#fffbeb', color: '#f59e0b' },
    notification: { bg: '#fffbeb', color: '#f59e0b' }, emergency: { bg: '#fef2f2', color: '#ef4444' },
    Urgent: { bg: '#fef2f2', color: '#ef4444' }, General: { bg: '#eef2ff', color: '#4318FF' },
    announcement: { bg: '#eef2ff', color: '#4318FF' },
  };
  const s = map[type] || { bg: '#eef2ff', color: '#4318FF' };
  return <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', padding: '3px 10px', borderRadius: 20, background: s.bg, color: s.color }}>{type}</span>;
};

// Avatar palette
const AV_COLORS = [
  { bg: '#fef3c7', color: '#92400e' }, { bg: '#d1fae5', color: '#065f46' },
  { bg: '#dbeafe', color: '#1d4ed8' }, { bg: '#fce7f3', color: '#9d174d' },
  { bg: '#ede9fe', color: '#6d28d9' },
];

const Avatar = ({ letter, idx = 0, size = 40, online }) => {
  const c = AV_COLORS[idx % AV_COLORS.length];
  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <div style={{
        width: size, height: size, borderRadius: Math.round(size * 0.27),
        background: c.bg, color: c.color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: size * 0.34, fontWeight: 800, textTransform: 'uppercase',
      }}>{letter}</div>
      {online !== undefined && (
        <div style={{ position: 'absolute', bottom: -2, right: -2, width: 10, height: 10, borderRadius: '50%', background: online ? '#22c55e' : '#d1d5db', border: '2px solid #fff' }} />
      )}
    </div>
  );
};

const EMOJIS = ['😊','👋','📚','✅','👍','🎉','📝','❓','🙏','💡','📌','⏰','😄','🤔','📖','✍️'];

// Shared input/label styles
const inputSt = {
  width: '100%', background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: 10,
  padding: '10px 14px', fontSize: 13, color: '#1e293b', outline: 'none',
  fontFamily: 'inherit', boxSizing: 'border-box', transition: 'border-color .15s',
};
const labelSt = {
  display: 'block', fontSize: 11, fontWeight: 700, color: '#94a3b8',
  textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6,
};

// Icon button helper
const IconBtn = ({ onClick, title, children, id, active = false }) => (
  <button id={id} type="button" onClick={onClick} title={title}
    style={{
      background: active ? '#eef2ff' : 'none', border: 'none',
      cursor: 'pointer', padding: '7px', borderRadius: 8,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: active ? '#4318FF' : '#94a3b8', transition: 'all .15s', flexShrink: 0,
    }}
    onMouseEnter={e => { if (!active) { e.currentTarget.style.background = '#eef2ff'; e.currentTarget.style.color = '#4318FF'; } }}
    onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#94a3b8'; } }}
  >{children}</button>
);

// ─────────────────────────────────────────────────────────────────
// MAIN COMPONENT — all original logic UNTOUCHED
// ─────────────────────────────────────────────────────────────────
const TeacherCommunications = () => {

  // ── All original states ───────────────────────────────────────────
  const [activeTab, setActiveTab]             = useState('Announcements');
  const [showAddForm, setShowAddForm]         = useState(false);
  const [loading, setLoading]                 = useState(true);
  const [currentUser, setCurrentUser]         = useState(null);
  const [teacherName, setTeacherName]         = useState('Teacher Name');
  const [teacherClasses, setTeacherClasses]   = useState([]);
  const [announcements, setAnnouncements]     = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', type: 'Event', description: '', targetGroup: 'All' });
  const [contacts, setContacts]               = useState([]);
  const [activeContact, setActiveContact]     = useState(null);
  const [messages, setMessages]               = useState([]);
  const [newMessage, setNewMessage]           = useState('');
  const [searchQuery, setSearchQuery]         = useState('');

  // ── New chat-enhancement states (UI only, no DB structure change) ──
  const [uploadPreview, setUploadPreview]     = useState(null);
  const [isSending, setIsSending]             = useState(false);
  const [showEmoji, setShowEmoji]             = useState(false);

  const scrollRef = useRef(null);
  const fileRef   = useRef(null);
  const imageRef  = useRef(null);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  // Close emoji on outside click
  useEffect(() => {
    const h = (e) => {
      if (!e.target.closest('#tc-emoji-btn') && !e.target.closest('#tc-emoji-panel'))
        setShowEmoji(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  // ── All original Supabase fetches — 100% UNTOUCHED ────────────────
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
          } else { setCurrentUser(user); }
          const { data: adminStaff } = await supabase.from('staff').select('*').neq('email', user.email);
          if (adminStaff && adminStaff.length > 0) {
            const fmt = adminStaff.map((s, i) => ({
              id: s.id, email: s.email,
              name: `${s.first_name || ''} ${s.last_name || ''}`.trim() || 'Admin',
              role: s.department || s.role || 'Administration',
              avatar: (s.first_name ? s.first_name.charAt(0) : 'A').toUpperCase(),
              colorIdx: i % AV_COLORS.length,
              online: Math.random() > 0.4,
            }));
            setContacts(fmt);
            setActiveContact(fmt[0]);
          }
        }
      } catch (err) { console.error(err); }
    };
    fetchGlobalData();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const { data } = await supabase.from('communications').select('*')
        .in('type', ['announcement', 'notification', 'emergency', 'Event', 'Reminder', 'General'])
        .order('created_at', { ascending: false });
      if (data && data.length > 0) {
        const filtered = data.filter(a => {
          const target = a.recipient_name?.toLowerCase() || '';
          return target.includes('all community') || target.includes('teachers') ||
                 target.includes('staff') || target.includes('all') ||
                 a.sender_id === currentUser?.id;
        });
        setAnnouncements(filtered.map(a => ({
          id: a.id, title: a.subject || a.title || 'Announcement',
          content: a.content || a.message, type: a.type || 'General',
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
        const { data: msgData, error } = await supabase.from('communications').select('*')
          .or(`and(sender_id.eq."${currentUser.id}",recipient_id.eq."${activeContact.id}"),and(sender_id.eq."${activeContact.id}",recipient_id.eq."${currentUser.id}")`)
          .order('created_at', { ascending: true });
        if (error) throw error;
        if (msgData && msgData.length > 0) {
          setMessages(msgData.map(m => ({
            id: m.id, text: m.content || '',
            fileUrl: m.file_url || null, fileName: m.file_name || null, fileType: m.file_type || null,
            time: new Date(m.created_at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
            isMe: m.sender_id === currentUser.id,
          })));
        } else { setMessages([]); }
      } catch (err) { console.error(err); }
    };
    fetchMessages();
  }, [activeContact, currentUser, activeTab]);

  // ── Handlers — original logic UNTOUCHED, file upload added ────────
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
    if ((!newMessage.trim() && !uploadPreview) || !activeContact || !currentUser || isSending) return;
    setIsSending(true);
    let fileUrl = null, fileName = null, fileType = null;
    try {
      // File upload (new, non-breaking — uses same communications table)
      if (uploadPreview) {
        const f = uploadPreview.file;
        const ext = f.name.split('.').pop();
        const path = `messages/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: upErr } = await supabase.storage.from('class_materials').upload(path, f);
        if (upErr) throw upErr;
        const { data: { publicUrl } } = supabase.storage.from('class_materials').getPublicUrl(path);
        fileUrl = publicUrl; fileName = f.name; fileType = f.type;
      }
      const text = newMessage.trim();
      // Original insert fields preserved, file fields added as optional columns
      const { data: inserted, error: insErr } = await supabase.from('communications').insert([{
        sender_id: currentUser.id, recipient_id: activeContact.id,
        recipient_name: activeContact.name,
        content: text || (fileName ? `Sent a file: ${fileName}` : ''),
        file_url: fileUrl, file_name: fileName, file_type: fileType,
        type: 'staff_individual', sender_role: 'teacher',
        created_at: new Date().toISOString(),
      }]).select();
      if (insErr) throw insErr;

      const m = inserted[0];
      setMessages(prev => [...prev, {
        id: m.id, isMe: true,
        text: m.content || '',
        fileUrl: m.file_url, fileName: m.file_name, fileType: m.file_type,
        time: new Date(m.created_at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
      }]);
      setContacts(prev => prev.map(c => c.id === activeContact.id
        ? { ...c, lastMsg: m.content || fileName, time: 'Now' } : c));
      setNewMessage('');
      setUploadPreview(null);
    } catch (err) {
      console.error(err);
      alert('Failed to send. Please try again.');
    } finally { setIsSending(false); }
  };

  const handleFileSelect = (e, isImage = false) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadPreview({ file, url: URL.createObjectURL(file), type: isImage ? 'image' : 'file' });
    e.target.value = '';
  };

  const filteredContacts = contacts.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ─────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ width: '100%', fontFamily: "'Inter','Segoe UI',sans-serif", display: 'flex', flexDirection: 'column' }}>

      {/* Page header */}
      {!showAddForm && (
        <div style={{ marginBottom: 4 }}>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#1e293b' }}>Communications Hub</h1>
          <p style={{ margin: '5px 0 0', fontSize: 13, color: '#94a3b8' }}>
            Manage announcements and messages with your administration team.
          </p>
        </div>
      )}

      {!showAddForm && (
        <TabBar tabs={['Announcements', 'Messages']} active={activeTab} onChange={setActiveTab} />
      )}

      {/* ══ ANNOUNCEMENTS LIST ══ */}
      {activeTab === 'Announcements' && !showAddForm && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#1e293b' }}>Announcements</h2>
              <p style={{ margin: '4px 0 0', fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                Latest news, events and important notices
              </p>
            </div>
            <button onClick={() => setShowAddForm(true)} style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '10px 20px', borderRadius: 10, border: 'none',
              background: '#4318FF', color: '#fff', fontSize: 13, fontWeight: 700,
              cursor: 'pointer', transition: 'background .15s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = '#3730a3'}
              onMouseLeave={e => e.currentTarget.style.background = '#4318FF'}
            >
              {Icons.Plus()} Add Announcement
            </button>
          </div>

          {loading ? (
            <p style={{ color: '#94a3b8', fontSize: 13, padding: '40px 0', textAlign: 'center' }}>Loading announcements...</p>
          ) : announcements.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>
              {Icons.Inbox()} <p style={{ marginTop: 12, fontSize: 13, fontWeight: 600 }}>No announcements yet.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
              {announcements.map(a => (
                <Card key={a.id} style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', minHeight: 180 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <TypeBadge type={a.type} />
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>
                      {Icons.Calendar()} {a.date}
                    </span>
                  </div>
                  <h3 style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 700, color: '#1e293b' }}>{a.title}</h3>
                  <p style={{ margin: 0, fontSize: 13, color: '#64748b', lineHeight: 1.6, flex: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{a.content}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, borderTop: '1px solid #f8fafc', paddingTop: 12, marginTop: 14 }}>
                    <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#eef2ff', color: '#4318FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, textTransform: 'uppercase' }}>
                      {a.author.charAt(0)}
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8' }}>{a.author}</span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ══ ADD FORM ══ */}
      {activeTab === 'Announcements' && showAddForm && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button onClick={() => setShowAddForm(false)} style={{
              width: 38, height: 38, borderRadius: 10, border: '1px solid #f1f5f9',
              background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#1e293b', transition: 'background .15s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = '#eef2ff'}
              onMouseLeave={e => e.currentTarget.style.background = '#f8fafc'}
            >{Icons.ArrowLeft()}</button>
            <div>
              <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#1e293b' }}>New Announcement</h1>
              <p style={{ margin: '3px 0 0', fontSize: 13, color: '#94a3b8' }}>Publish a notice to all community members.</p>
            </div>
          </div>
          <Card style={{ padding: '28px 32px', maxWidth: 600 }}>
            <form onSubmit={handleAddAnnouncement} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={labelSt}>Title</label>
                <input type="text" required placeholder="e.g. Next week field trip"
                  value={newAnnouncement.title} onChange={e => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                  style={inputSt} onFocus={e => e.target.style.borderColor = '#4318FF'} onBlur={e => e.target.style.borderColor = '#f1f5f9'} />
              </div>
              <div>
                <label style={labelSt}>Type</label>
                <select value={newAnnouncement.type} onChange={e => setNewAnnouncement({ ...newAnnouncement, type: e.target.value })}
                  style={{ ...inputSt, cursor: 'pointer' }} onFocus={e => e.target.style.borderColor = '#4318FF'} onBlur={e => e.target.style.borderColor = '#f1f5f9'}>
                  <option value="Event">Event</option>
                  <option value="Reminder">Reminder</option>
                  <option value="General">General</option>
                </select>
              </div>
              <div>
                <label style={labelSt}>Description</label>
                <textarea required rows={5} placeholder="Write your announcement here..."
                  value={newAnnouncement.description} onChange={e => setNewAnnouncement({ ...newAnnouncement, description: e.target.value })}
                  style={{ ...inputSt, resize: 'vertical', lineHeight: 1.6 }}
                  onFocus={e => e.target.style.borderColor = '#4318FF'} onBlur={e => e.target.style.borderColor = '#f1f5f9'} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 4 }}>
                <button type="button" onClick={() => setShowAddForm(false)}
                  style={{ padding: '10px 20px', borderRadius: 10, border: '1px solid #f1f5f9', background: '#f8fafc', color: '#64748b', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" style={{ padding: '10px 24px', borderRadius: 10, border: 'none', background: '#4318FF', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'background .15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#3730a3'} onMouseLeave={e => e.currentTarget.style.background = '#4318FF'}>
                  Publish Announcement
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* ══ MESSAGES — full interactive, matches StudentMessages ══ */}
      {activeTab === 'Messages' && (
        <Card style={{ display: 'flex', overflow: 'hidden', height: '68vh', minHeight: 520, padding: 0, position: 'relative' }}>

          {/* ── Contacts ── */}
          <div style={{ width: 280, borderRight: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
            {/* Header */}
            <div style={{ padding: '18px 16px 14px', borderBottom: '1px solid #f8fafc' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h2 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#1e293b' }}>Conversations</h2>
                <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.08em', background: '#4318FF', color: '#fff', padding: '2px 8px', borderRadius: 6 }}>LIVE</span>
              </div>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                  {Icons.Search()}
                </span>
                <input type="text" placeholder="Search contacts..."
                  value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  style={{ ...inputSt, paddingLeft: 34, borderRadius: 8, fontSize: 12 }}
                  onFocus={e => e.target.style.borderColor = '#4318FF'} onBlur={e => e.target.style.borderColor = '#f1f5f9'} />
              </div>
            </div>

            {/* Contact list */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {filteredContacts.length === 0 && (
                <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 12, padding: '32px 0' }}>No contacts found.</p>
              )}
              {filteredContacts.map((contact) => {
                const isActive = activeContact?.id === contact.id;
                return (
                  <div key={contact.id} onClick={() => setActiveContact(contact)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 11,
                      padding: '12px 16px', cursor: 'pointer',
                      borderBottom: '1px solid #f8fafc',
                      background: isActive ? '#f5f3ff' : 'transparent',
                      transition: 'background .15s',
                    }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#f8fafc'; }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                  >
                    <Avatar letter={contact.avatar} idx={contact.colorIdx} size={42} online={contact.online} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 2 }}>
                        <p style={{ margin: 0, fontSize: 13, fontWeight: isActive ? 700 : 600, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {contact.name}
                        </p>
                        {contact.time && <span style={{ fontSize: 10, color: '#94a3b8', flexShrink: 0, marginLeft: 6 }}>{contact.time}</span>}
                      </div>
                      <p style={{ margin: 0, fontSize: 11, color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {contact.lastMsg || contact.role}
                      </p>
                    </div>
                    {isActive && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4318FF', flexShrink: 0 }} />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Chat area ── */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            {activeContact ? (<>

              {/* Chat header */}
              <div style={{ height: 64, padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', flexShrink: 0, background: '#fff', zIndex: 5 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Avatar letter={activeContact.avatar} idx={activeContact.colorIdx || 0} size={38} online={activeContact.online} />
                  <div>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#1e293b' }}>{activeContact.name}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
                      <div style={{ width: 7, height: 7, borderRadius: '50%', background: activeContact.online ? '#22c55e' : '#d1d5db' }} />
                      <span style={{ fontSize: 10, fontWeight: 600, color: activeContact.online ? '#22c55e' : '#94a3b8' }}>
                        {activeContact.online ? 'Online' : 'Offline'}
                      </span>
                      <span style={{ fontSize: 10, color: '#94a3b8' }}>· {activeContact.role}</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[Icons.Phone, Icons.Video].map((Icon, i) => (
                    <button key={i} style={{ width: 36, height: 36, borderRadius: 10, border: '1px solid #f1f5f9', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b', transition: 'all .15s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#4318FF'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#4318FF'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#64748b'; e.currentTarget.style.borderColor = '#f1f5f9'; }}
                    ><Icon /></button>
                  ))}
                </div>
              </div>

              {/* Messages thread */}
              <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14, background: '#f8fafc' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ flex: 1, height: 1, background: '#f1f5f9' }} />
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8' }}>Today</span>
                  <div style={{ flex: 1, height: 1, background: '#f1f5f9' }} />
                </div>

                {messages.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '48px 0', color: '#94a3b8' }}>
                    <div style={{ width: 52, height: 52, borderRadius: 14, background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                      {Icons.MsgBubble()}
                    </div>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>No messages yet.</p>
                    <p style={{ margin: '4px 0 0', fontSize: 12 }}>Start the conversation with {activeContact.name}.</p>
                  </div>
                ) : messages.map(msg => (
                  <div key={msg.id} style={{ display: 'flex', justifyContent: msg.isMe ? 'flex-end' : 'flex-start' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, maxWidth: '65%' }}>
                      {!msg.isMe && <Avatar letter={activeContact.avatar} idx={activeContact.colorIdx || 0} size={28} />}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: msg.isMe ? 'flex-end' : 'flex-start', gap: 4 }}>
                        {/* Text bubble */}
                        {msg.text && (
                          <div style={{
                            padding: '10px 15px', borderRadius: 14,
                            borderBottomRightRadius: msg.isMe ? 4 : 14,
                            borderBottomLeftRadius: msg.isMe ? 14 : 4,
                            background: msg.isMe ? '#4318FF' : '#fff',
                            color: msg.isMe ? '#fff' : '#1e293b',
                            fontSize: 13, lineHeight: 1.55,
                            border: msg.isMe ? 'none' : '1px solid #f1f5f9',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                            wordBreak: 'break-word',
                          }}>{msg.text}</div>
                        )}
                        {/* Image */}
                        {msg.fileUrl && msg.fileType?.startsWith('image/') && (
                          <div style={{ borderRadius: 12, overflow: 'hidden', maxWidth: 220, cursor: 'pointer', marginTop: msg.text ? 4 : 0 }}
                            onClick={() => window.open(msg.fileUrl, '_blank')}>
                            <img src={msg.fileUrl} alt={msg.fileName || 'image'} style={{ width: '100%', display: 'block' }} />
                          </div>
                        )}
                        {/* File */}
                        {msg.fileUrl && msg.fileType && !msg.fileType.startsWith('image/') && (
                          <a href={msg.fileUrl} target="_blank" rel="noreferrer"
                            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 12, background: msg.isMe ? 'rgba(255,255,255,0.12)' : '#fff', border: msg.isMe ? '1px solid rgba(255,255,255,0.2)' : '1px solid #f1f5f9', textDecoration: 'none', maxWidth: 220, marginTop: msg.text ? 4 : 0 }}>
                            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              {Icons.File()}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: msg.isMe ? '#fff' : '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{msg.fileName || 'File'}</p>
                              <p style={{ margin: '2px 0 0', fontSize: 10, color: msg.isMe ? 'rgba(255,255,255,0.65)' : '#94a3b8' }}>Tap to download</p>
                            </div>
                            {Icons.Download(msg.isMe ? '#fff' : '#4318FF')}
                          </a>
                        )}
                        <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 500 }}>{msg.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Upload preview bar */}
              {uploadPreview && (
                <div style={{ padding: '10px 20px', borderTop: '1px solid #f1f5f9', background: '#fff', display: 'flex', alignItems: 'center', gap: 12 }}>
                  {uploadPreview.type === 'image' ? (
                    <img src={uploadPreview.url} alt="preview" style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: 48, height: 48, borderRadius: 8, background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {Icons.File()}
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{uploadPreview.file.name}</p>
                    <p style={{ margin: '2px 0 0', fontSize: 11, color: '#94a3b8' }}>{(uploadPreview.file.size / 1024).toFixed(0)} KB · Ready to send</p>
                  </div>
                  <button onClick={() => setUploadPreview(null)}
                    style={{ width: 28, height: 28, borderRadius: 8, border: 'none', background: '#fef2f2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    {Icons.X()}
                  </button>
                </div>
              )}

              {/* Emoji panel */}
              {showEmoji && (
                <div id="tc-emoji-panel" style={{ position: 'absolute', bottom: 84, right: 18, background: '#fff', borderRadius: 14, border: '1px solid #f1f5f9', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', padding: '14px 16px', display: 'flex', flexWrap: 'wrap', gap: 8, width: 232, zIndex: 20 }}>
                  {EMOJIS.map(em => (
                    <button key={em} type="button" onClick={() => setNewMessage(p => p + em)}
                      style={{ fontSize: 20, background: 'none', border: 'none', cursor: 'pointer', padding: 2, borderRadius: 6, transition: 'transform .1s' }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.3)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    >{em}</button>
                  ))}
                </div>
              )}

              {/* Input bar */}
              <div style={{ padding: '12px 18px 14px', borderTop: '1px solid #f1f5f9', background: '#fff', flexShrink: 0 }}>
                <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.txt,.zip" style={{ display: 'none' }} onChange={e => handleFileSelect(e, false)} />
                <input ref={imageRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleFileSelect(e, true)} />

                <form onSubmit={handleSendMessage}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: 12, padding: '6px 8px', transition: 'border-color .15s' }}
                  onFocus={e => e.currentTarget.style.borderColor = '#4318FF'}
                  onBlur={e => e.currentTarget.style.borderColor = '#f1f5f9'}
                >
                  <IconBtn onClick={() => fileRef.current.click()} title="Attach file">{Icons.Paperclip()}</IconBtn>
                  <IconBtn onClick={() => imageRef.current.click()} title="Send image">{Icons.Image()}</IconBtn>

                  <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)}
                    placeholder={`Message ${activeContact.name.split(' ')[0]}...`}
                    style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 13, color: '#1e293b', fontFamily: 'inherit', padding: '6px 4px' }}
                  />

                  <IconBtn id="tc-emoji-btn" onClick={() => setShowEmoji(s => !s)} title="Emoji" active={showEmoji}>{Icons.Smile()}</IconBtn>

                  <button type="submit" disabled={(!newMessage.trim() && !uploadPreview) || isSending}
                    style={{
                      width: 36, height: 36, borderRadius: 10, border: 'none', flexShrink: 0,
                      background: (newMessage.trim() || uploadPreview) && !isSending ? '#4318FF' : '#f1f5f9',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: (newMessage.trim() || uploadPreview) && !isSending ? 'pointer' : 'default',
                      transition: 'all .15s',
                    }}
                    onMouseEnter={e => { if ((newMessage.trim() || uploadPreview) && !isSending) e.currentTarget.style.background = '#3730a3'; }}
                    onMouseLeave={e => { if ((newMessage.trim() || uploadPreview) && !isSending) e.currentTarget.style.background = '#4318FF'; }}
                  >
                    {isSending ? (
                      <div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin .7s linear infinite' }} />
                    ) : Icons.Send()}
                  </button>
                </form>

                <p style={{ margin: '6px 0 0 4px', fontSize: 10, color: '#cbd5e1' }}>
                  Press Enter to send · Use icons to attach files or images
                </p>
              </div>

            </>) : (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', gap: 10 }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {Icons.MsgBubble()}
                </div>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#94a3b8' }}>Select a contact to start messaging.</p>
              </div>
            )}
          </div>
        </Card>
      )}

      <style>{`
        * { box-sizing: border-box; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default TeacherCommunications;
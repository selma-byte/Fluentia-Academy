import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

// ─── Design tokens (matches dashboard exactly) ────────────────────────────────
const C = {
  navy:        '#0f172a',
  primary:     '#4318FF',
  primaryLight:'#eef2ff',
  white:       '#ffffff',
  pageBg:      '#f8fafc',
  border:      '#f1f5f9',
  borderMid:   '#e2e8f0',
  textDark:    '#1e293b',
  textMid:     '#64748b',
  textMuted:   '#94a3b8',
  danger:      '#dc2626',
  dangerBg:    '#fef2f2',
  success:     '#059669',
  successBg:   '#ecfdf5',
  warning:     '#d97706',
  warningBg:   '#fffbeb',
  purple:      '#7c3aed',
  purpleBg:    '#f5f3ff',
};

// ─── Icons ────────────────────────────────────────────────────────────────────
const Ic = {
  Users: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Student: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 4 3 6 3s6-1 6-3v-5"/></svg>,
  Staff: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
  Megaphone: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg>,
  Comm: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  Plus: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Search: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Chat: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  Send: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  ArrowLeft: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  Close: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Pin: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  Bell: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  Trash: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
  Mail: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  Phone: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6.13 6.13l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  User: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Check: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  ChevronRight: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  Sparkle: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>,
  AlertCircle: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
};

// ─── Reusable components ──────────────────────────────────────────────────────
const SectionLabel = ({ children }) => (
  <p style={{ fontSize: 10.5, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 7 }}>
    {children}
  </p>
);

const inputCls = {
  width: '100%', background: '#f8fafc',
  border: `1.5px solid ${C.borderMid}`, borderRadius: 10,
  padding: '10px 14px', fontSize: 13.5,
  fontFamily: "'Inter','Segoe UI',sans-serif",
  color: C.textDark, outline: 'none', boxSizing: 'border-box',
  transition: 'border-color 0.2s, box-shadow 0.2s',
};

const focusInput  = e => { e.target.style.borderColor = C.primary; e.target.style.boxShadow = '0 0 0 3px rgba(67,24,255,0.09)'; e.target.style.background = '#fff'; };
const blurInput   = e => { e.target.style.borderColor = C.borderMid; e.target.style.boxShadow = 'none'; e.target.style.background = '#f8fafc'; };

const PrimaryBtn = ({ children, onClick, type = 'button', disabled, style = {} }) => (
  <button type={type} onClick={onClick} disabled={disabled}
    style={{
      display: 'inline-flex', alignItems: 'center', gap: 7,
      padding: '10px 18px', borderRadius: 9, border: 'none',
      background: disabled ? C.textMuted : C.primary,
      color: '#fff', fontSize: 13, fontWeight: 700,
      cursor: disabled ? 'not-allowed' : 'pointer',
      boxShadow: disabled ? 'none' : '0 3px 12px rgba(67,24,255,0.26)',
      transition: 'all 0.15s', ...style,
    }}
    onMouseEnter={e => { if (!disabled) { e.currentTarget.style.background = '#3510d4'; e.currentTarget.style.transform = 'translateY(-1px)'; }}}
    onMouseLeave={e => { e.currentTarget.style.background = disabled ? C.textMuted : C.primary; e.currentTarget.style.transform = 'none'; }}
  >
    {children}
  </button>
);

const OutlineBtn = ({ children, onClick, style = {} }) => (
  <button type="button" onClick={onClick}
    style={{
      display: 'inline-flex', alignItems: 'center', gap: 7,
      padding: '9px 16px', borderRadius: 9,
      border: `1.5px solid ${C.borderMid}`,
      background: C.white, color: C.textDark,
      fontSize: 13, fontWeight: 600, cursor: 'pointer',
      transition: 'all 0.15s', ...style,
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = '#c7d2fe'; e.currentTarget.style.background = C.primaryLight; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = C.borderMid; e.currentTarget.style.background = C.white; }}
  >
    {children}
  </button>
);

// ─── Toast notification ───────────────────────────────────────────────────────
const Toast = ({ message, onClose }) => (
  <div style={{
    position: 'fixed', bottom: 32, right: 32, zIndex: 300,
    background: C.navy, color: '#fff',
    padding: '14px 20px', borderRadius: 14,
    boxShadow: '0 8px 32px rgba(0,0,0,0.22)',
    border: '1px solid rgba(255,255,255,0.08)',
    display: 'flex', alignItems: 'center', gap: 12,
    minWidth: 320, maxWidth: 420,
    animation: 'slideUp 0.3s cubic-bezier(.4,0,.2,1) both',
    fontFamily: "'Inter','Segoe UI',sans-serif",
  }}>
    <span style={{ width: 34, height: 34, borderRadius: 9, background: C.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Ic.Sparkle />
    </span>
    <div style={{ flex: 1 }}>
      <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>System Update</p>
      <p style={{ margin: '2px 0 0', fontSize: 13, fontWeight: 600, color: '#fff' }}>{message}</p>
    </div>
    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', padding: 4, display: 'flex', alignItems: 'center' }}
      onMouseEnter={e => e.currentTarget.style.color = '#fff'}
      onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
    >
      <Ic.Close />
    </button>
  </div>
);

// ─── Modal wrapper ────────────────────────────────────────────────────────────
const Modal = ({ title, subtitle, onClose, children, accentColor }) => (
  <div
    onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    style={{
      position: 'fixed', inset: 0, zIndex: 200,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16, background: 'rgba(0,0,0,0.45)',
      backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
    }}
  >
    <div style={{
      background: C.white, borderRadius: 18, maxWidth: 560, width: '100%',
      boxShadow: '0 24px 80px rgba(0,0,0,0.20)',
      border: `1px solid ${C.border}`,
      overflow: 'hidden', maxHeight: '90vh', display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '20px 24px', borderBottom: `1px solid ${C.border}`,
        background: accentColor ? accentColor + '10' : C.pageBg,
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: C.textDark }}>{title}</h2>
          {subtitle && <p style={{ margin: '3px 0 0', fontSize: 12, color: C.textMuted }}>{subtitle}</p>}
        </div>
        <button onClick={onClose}
          style={{ width: 32, height: 32, borderRadius: '50%', background: C.border, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.textMid, transition: 'all 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.background = C.dangerBg; e.currentTarget.style.color = C.danger; }}
          onMouseLeave={e => { e.currentTarget.style.background = C.border; e.currentTarget.style.color = C.textMid; }}
        >
          <Ic.Close />
        </button>
      </div>
      <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
        {children}
      </div>
    </div>
  </div>
);

// ─── Table wrapper ────────────────────────────────────────────────────────────
const TableWrap = ({ children }) => (
  <div style={{ flex: 1, overflow: 'auto', background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
      {children}
    </table>
  </div>
);

const Th = ({ children, center }) => (
  <th style={{
    padding: '12px 18px', background: C.pageBg,
    borderBottom: `1px solid ${C.borderMid}`,
    textAlign: center ? 'center' : 'left',
    fontSize: 11, fontWeight: 700, color: C.textMuted,
    textTransform: 'uppercase', letterSpacing: '0.07em',
    position: 'sticky', top: 0,
  }}>
    {children}
  </th>
);

const Td = ({ children, center, style = {} }) => (
  <td style={{ padding: '13px 18px', borderBottom: `1px solid ${C.border}`, verticalAlign: 'middle', textAlign: center ? 'center' : 'left', ...style }}>
    {children}
  </td>
);

const StatusBadge = ({ label = 'Active', color = C.success, bg = C.successBg }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, color, background: bg, padding: '3px 10px', borderRadius: 20 }}>
    <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0 }} />
    {label}
  </span>
);

const ActionBtn = ({ icon: Icon, onClick, title, danger }) => (
  <button onClick={onClick} title={title}
    style={{
      width: 30, height: 30, borderRadius: 7,
      background: 'transparent', border: `1px solid ${C.border}`,
      cursor: 'pointer', display: 'inline-flex',
      alignItems: 'center', justifyContent: 'center',
      color: C.textMuted, transition: 'all 0.15s',
    }}
    onMouseEnter={e => { e.currentTarget.style.background = danger ? C.dangerBg : C.primaryLight; e.currentTarget.style.color = danger ? C.danger : C.primary; e.currentTarget.style.borderColor = danger ? '#fca5a5' : '#c7d2fe'; }}
    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.textMuted; e.currentTarget.style.borderColor = C.border; }}
  >
    <Icon />
  </button>
);

// ─── Search bar ───────────────────────────────────────────────────────────────
const SearchBar = ({ placeholder }) => (
  <div style={{ position: 'relative', width: 320, flexShrink: 0, marginBottom: 18 }}>
    <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: C.textMuted, display: 'flex', pointerEvents: 'none' }}>
      <Ic.Search />
    </span>
    <input
      type="text"
      placeholder={placeholder}
      style={{ ...inputCls, paddingLeft: 36, height: 38, fontSize: 13 }}
      onFocus={focusInput} onBlur={blurInput}
    />
  </div>
);

// ─── Tab bar ──────────────────────────────────────────────────────────────────
const TabBar = ({ tabs, active, onChange }) => (
  <div style={{
    display: 'flex', gap: 2,
    borderBottom: `1px solid ${C.border}`,
    marginBottom: 24, flexShrink: 0,
  }}>
    {tabs.map(tab => {
      const isActive = active === tab.key;
      return (
        <button key={tab.key} onClick={() => onChange(tab.key)}
          style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '10px 16px', border: 'none',
            borderBottom: isActive ? `2px solid ${C.primary}` : '2px solid transparent',
            marginBottom: -1,
            fontSize: 13, fontWeight: 700, cursor: 'pointer',
            transition: 'all 0.15s',
            background: 'transparent',
            color: isActive ? C.primary : C.textMuted,
          }}
          onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = C.textDark; }}
          onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = C.textMuted; }}
        >
          <span style={{ color: isActive ? C.primary : C.textMuted }}><tab.Icon /></span>
          {tab.label}
        </button>
      );
    })}
  </div>
);

// ─── Stat card ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon: Icon, iconBg, iconColor }) => (
  <div style={{
    background: C.white, borderRadius: 16, padding: '20px 24px',
    border: `1px solid ${C.border}`, boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
  }}>
    <div>
      <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{label}</p>
      <p style={{ margin: '6px 0 0', fontSize: 28, fontWeight: 800, color: C.textDark, lineHeight: 1 }}>{value}</p>
    </div>
    <div style={{ width: 40, height: 40, borderRadius: 12, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: iconColor }}>
      <Icon />
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const ParentPortal = () => {
  const [chatMessages,      setChatMessages]      = useState([]);
  const [recentComms,       setRecentComms]       = useState([]);
  const [announcements,     setAnnouncements]     = useState([]);
  const [feedbackList,      setFeedbackList]      = useState([]);
  const [mainView,          setMainView]          = useState('portal');
  const [activeTab,         setActiveTab]         = useState('parents');
  const [modalView,         setModalView]         = useState(null);
  const [chatType,          setChatType]          = useState(null);
  const [newMessage,        setNewMessage]        = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [studentsList,      setStudentsList]      = useState([]);
  const [staffList,         setStaffList]         = useState([]);
  const [parentsList,       setParentsList]       = useState([]);
  const [loading,           setLoading]           = useState(false);
  const [currentUser,       setCurrentUser]       = useState(null);
  const [toast,             setToast]             = useState(null);
  const [announcementForm,  setAnnouncementForm]  = useState({ title: '', content: '', priority: 'Medium' });
  const [notificationForm,  setNotificationForm]  = useState({ title: '', content: '' });
  const [parentForm,        setParentForm]        = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', occupation: '', relationship: 'Select relationship', emergency: false,
  });
  const [selectedAudiences, setSelectedAudiences] = useState({
    all: true, students: false, parents: false, staff: false, teacher: false, admin: false,
  });

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 4500); };

  // ── Fetch Data — UNTOUCHED ────────────────────────────────────────────────
  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.email) {
        const { data: staffData } = await supabase.from('staff').select('*').eq('email', user.email).single();
        if (staffData) {
          setCurrentUser({ id: staffData.id, name: `${staffData.first_name} ${staffData.last_name}`, role: staffData.role, email: staffData.email });
        } else {
          setCurrentUser({ id: 'admin_sys', name: 'Administration', role: 'Admin', email: user.email });
        }
      }
      const { data: sData }    = await supabase.from('staff').select('*');
      if (sData) setStaffList(sData);
      const { data: stData }   = await supabase.from('students').select('*');
      if (stData) {
        setStudentsList(stData.filter(s => s.exam_type !== 'Parent_Account'));
        const parentsMap = {};
        stData.forEach(s => {
          if (s.parent_email) {
            if (!parentsMap[s.parent_email]) {
              parentsMap[s.parent_email] = { email: s.parent_email, name: s.parent_name || `${s.first_name} ${s.last_name}`, phone: s.parent_contact || s.phone, kids: [] };
            }
            if (s.exam_type !== 'Parent_Account') parentsMap[s.parent_email].kids.push(`${s.first_name} (${s.level || '-'})`);
          }
        });
        setParentsList(Object.values(parentsMap));
      }
      const { data: annData }  = await supabase.from('communications').select('*').eq('type', 'announcement').order('created_at', { ascending: false });
      if (annData) setAnnouncements(annData);
      const { data: commData } = await supabase.from('communications').select('*').neq('type', 'announcement').neq('type', 'complaint').neq('type', 'feedback').order('created_at', { ascending: false }).limit(6);
      if (commData) setRecentComms(commData);
      const { data: feedData } = await supabase.from('communications').select('*').in('type', ['complaint', 'feedback']).order('created_at', { ascending: false });
      if (feedData) setFeedbackList(feedData);
      const { data: msgData }  = await supabase.from('communications').select('*').in('type', ['direct_message']).order('created_at', { ascending: true });
      if (msgData) setChatMessages(msgData);
    } catch (err) { console.error('Fetch Error:', err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  // ── All handlers — UNTOUCHED ──────────────────────────────────────────────
  const handleAudienceChange = (audience) => {
    if (audience === 'all') {
      setSelectedAudiences({ all: true, students: false, parents: false, staff: false, teacher: false, admin: false });
    } else {
      setSelectedAudiences(prev => {
        const newState = { ...prev, [audience]: !prev[audience], all: false };
        if (!Object.values(newState).some(v => v)) newState.all = true;
        return newState;
      });
    }
  };

  const getTargetAudienceString = () => {
    const g = [];
    if (selectedAudiences.students) g.push('students');
    if (selectedAudiences.teacher)  g.push('teachers');
    if (selectedAudiences.parents)  g.push('parents');
    if (selectedAudiences.staff)    g.push('staff');
    return g.length > 0 ? g.join(', ') : 'All Community';
  };

  const handlePublishAnnouncement = async () => {
    if (!announcementForm.title || !announcementForm.content) return showToast('Please fill in the title and content.');
    const { error } = await supabase.from('communications').insert([{
      subject: announcementForm.title, content: announcementForm.content,
      type: 'announcement', recipient_name: getTargetAudienceString(),
      recipient_id: 'all', sender_name: currentUser?.name || 'System',
      sender_id: currentUser?.id, sender_role: currentUser?.role || 'Admin',
    }]);
    if (!error) { showToast('Announcement published successfully.'); setModalView(null); setAnnouncementForm({ title: '', content: '', priority: 'Medium' }); fetchData(); }
    else { showToast('Error publishing announcement.'); console.error(error); }
  };

  const handleSendNotification = async () => {
    if (!notificationForm.title || !notificationForm.content) return showToast('Please fill in the title and content.');
    const { error } = await supabase.from('communications').insert([{
      subject: notificationForm.title, content: notificationForm.content,
      type: 'notification', recipient_name: getTargetAudienceString(),
      recipient_id: 'all', sender_name: currentUser?.name || 'System',
      sender_id: currentUser?.id, sender_role: currentUser?.role || 'Admin',
    }]);
    if (!error) { showToast('Notification sent successfully.'); setModalView(null); setNotificationForm({ title: '', content: '' }); fetchData(); }
    else { showToast('Error sending notification.'); console.error(error); }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentUser) return;
    const { error } = await supabase.from('communications').insert([{
      content: newMessage, type: 'direct_message',
      recipient_name: selectedRecipient?.name || 'Group',
      recipient_id: selectedRecipient?.id?.toString() || selectedRecipient?.email,
      sender_name: currentUser.name, sender_id: currentUser.id, sender_role: currentUser.role,
    }]);
    if (!error) { setNewMessage(''); fetchData(); }
    else { showToast('Error sending message.'); console.error(error); }
  };

  const handleAddParent = async (e) => {
    e.preventDefault();
    try {
      const { error: authError } = await supabase.auth.signUp({ email: parentForm.email, password: parentForm.phone });
      if (authError && authError.message !== 'User already registered') throw authError;
      const { error: dbError } = await supabase.from('students').insert([{
        first_name: parentForm.firstName, last_name: parentForm.lastName,
        email: parentForm.email, phone: parentForm.phone,
        parent_email: parentForm.email, parent_name: `${parentForm.firstName} ${parentForm.lastName}`,
        parent_contact: parentForm.phone, exam_type: 'Parent_Account',
        status: 'Active', enrollment_date: new Date().toISOString().split('T')[0],
      }]);
      if (dbError) throw dbError;
      showToast(`Parent ${parentForm.firstName} ${parentForm.lastName} added successfully.`);
      setModalView(null);
      setParentForm({ firstName: '', lastName: '', email: '', phone: '', address: '', occupation: '', relationship: 'Select relationship', emergency: false });
      fetchData();
    } catch (err) { showToast('Error: ' + err.message); }
  };

  const tabs = [
    { key: 'parents',        label: 'Parents',               Icon: Ic.Users       },
    { key: 'students',       label: 'Students',              Icon: Ic.Student     },
    { key: 'staff',          label: 'Staff',                 Icon: Ic.Staff       },
    { key: 'announcements',  label: 'Announcements',         Icon: Ic.Megaphone   },
    { key: 'communications', label: 'Communications',        Icon: Ic.Comm        },
    { key: 'feedback',       label: 'Feedback & Complaints', Icon: Ic.AlertCircle },
  ];

  const AudienceRow = ({ keys }) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, background: C.pageBg, padding: '12px 14px', borderRadius: 10, border: `1px solid ${C.border}` }}>
      {keys.map(({ key, label }) => (
        <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, fontWeight: 600, color: C.textDark, cursor: 'pointer', userSelect: 'none' }}>
          <input type="checkbox" checked={selectedAudiences[key]} onChange={() => handleAudienceChange(key)}
            style={{ width: 15, height: 15, accentColor: C.primary, cursor: 'pointer' }} />
          {label}
        </label>
      ))}
    </div>
  );

  // ── Tab renderers — UNTOUCHED logic, only wrapper spacing fixed ───────────
  const renderParentsTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: C.textDark }}>Parent Directory</h3>
          <p style={{ margin: '3px 0 0', fontSize: 12, color: C.textMuted }}>Manage parent and guardian information</p>
        </div>
        <PrimaryBtn onClick={() => setModalView('addParent')}><Ic.Plus /> Add Parent</PrimaryBtn>
      </div>
      <SearchBar placeholder="Search parents by name or student..." />
      <TableWrap>
        <thead><tr><Th>Parent / Guardian</Th><Th>Contact Info</Th><Th>Enrolled Students</Th><Th>Status</Th><Th center>Actions</Th></tr></thead>
        <tbody>
          {parentsList.length > 0 ? parentsList.map((parent, idx) => (
            <tr key={idx} onMouseEnter={e => e.currentTarget.style.background = C.pageBg} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <Td><p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: C.textDark }}>{parent.name}</p><p style={{ margin: '2px 0 0', fontSize: 11, color: C.textMuted }}>Parent / Guardian</p></Td>
              <Td><div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}><span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: C.textMid }}><Ic.Mail /> {parent.email}</span><span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: C.textMid }}><Ic.Phone /> {parent.phone}</span></div></Td>
              <Td><div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>{parent.kids.map((kid, kIdx) => (<span key={kIdx} style={{ background: C.primaryLight, color: C.primary, padding: '2px 9px', borderRadius: 6, fontSize: 11, fontWeight: 700 }}>{kid}</span>))}</div></Td>
              <Td><StatusBadge /></Td>
              <Td center><ActionBtn icon={Ic.Chat} title="Send message" onClick={() => { setMainView('chat'); setChatType('parent'); setSelectedRecipient({ id: parent.email, name: parent.name, role: 'Parent', email: parent.email, phone: parent.phone }); }} /></Td>
            </tr>
          )) : (
            <tr><td colSpan="5" style={{ padding: '48px 0', textAlign: 'center', color: C.textMuted, fontSize: 13, fontWeight: 600 }}>No parents found. Register students to auto-generate parents.</td></tr>
          )}
        </tbody>
      </TableWrap>
    </div>
  );

  const renderStudentsTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      <div style={{ marginBottom: 18 }}><h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: C.textDark }}>Student Directory</h3><p style={{ margin: '3px 0 0', fontSize: 12, color: C.textMuted }}>Manage student contact information</p></div>
      <SearchBar placeholder="Search students by name..." />
      <TableWrap>
        <thead><tr><Th>Student Name</Th><Th>Contact Info</Th><Th>Course</Th><Th>Group</Th><Th>Status</Th><Th center>Actions</Th></tr></thead>
        <tbody>
          {studentsList.map(student => (
            <tr key={student.id} onMouseEnter={e => e.currentTarget.style.background = C.pageBg} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <Td><p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: C.textDark }}>{student.first_name} {student.last_name}</p></Td>
              <Td><div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}><span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: C.textMid }}><Ic.Mail /> {student.email}</span><span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: C.textMid }}><Ic.Phone /> {student.phone}</span></div></Td>
              <Td><span style={{ fontSize: 13, fontWeight: 600, color: C.textDark }}>{student.language || 'N/A'} <span style={{ color: C.textMuted }}>({student.level || '-'})</span></span></Td>
              <Td><span style={{ fontSize: 13, color: C.textMid }}>{student.group_name || 'No Group'}</span></Td>
              <Td><StatusBadge /></Td>
              <Td center><ActionBtn icon={Ic.Chat} title="Send message" onClick={() => { setMainView('chat'); setChatType('student_individual'); setSelectedRecipient({ id: student.id, name: `${student.first_name} ${student.last_name}`, role: 'Student', email: student.email, phone: student.phone, level: student.level }); }} /></Td>
            </tr>
          ))}
        </tbody>
      </TableWrap>
    </div>
  );

  const renderStaffTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      <div style={{ marginBottom: 18 }}><h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: C.textDark }}>Staff Directory</h3><p style={{ margin: '3px 0 0', fontSize: 12, color: C.textMuted }}>Manage school staff information</p></div>
      <SearchBar placeholder="Search staff by name or role..." />
      <TableWrap>
        <thead><tr><Th>Staff Member</Th><Th>Contact</Th><Th>Role</Th><Th>Department</Th><Th>Status</Th><Th center>Actions</Th></tr></thead>
        <tbody>
          {staffList.map(staff => (
            <tr key={staff.id} onMouseEnter={e => e.currentTarget.style.background = C.pageBg} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <Td><p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: C.textDark }}>{staff.first_name} {staff.last_name}</p><p style={{ margin: '2px 0 0', fontSize: 11, color: C.textMuted }}>{staff.role}</p></Td>
              <Td><div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}><span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: C.textMid }}><Ic.Mail /> {staff.email}</span><span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: C.textMid }}><Ic.Phone /> {staff.phone}</span></div></Td>
              <Td><span style={{ fontSize: 13, fontWeight: 600, color: C.textDark }}>{staff.role}</span></Td>
              <Td><span style={{ fontSize: 13, color: C.textMid }}>{staff.department || 'General'}</span></Td>
              <Td><StatusBadge /></Td>
              <Td center><ActionBtn icon={Ic.Chat} title="Send message" onClick={() => { setMainView('chat'); setChatType('staff_individual'); setSelectedRecipient({ id: staff.id, name: `${staff.first_name} ${staff.last_name}`, role: staff.role, email: staff.email, phone: staff.phone, dept: staff.department }); }} /></Td>
            </tr>
          ))}
        </tbody>
      </TableWrap>
    </div>
  );

  const renderAnnouncementsTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div><h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: C.textDark }}>Announcements</h3><p style={{ margin: '3px 0 0', fontSize: 12, color: C.textMuted }}>School-wide announcements and notices</p></div>
        <PrimaryBtn onClick={() => setModalView('newAnnouncement')}><Ic.Plus /> New Announcement</PrimaryBtn>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, paddingRight: 2 }}>
        {announcements.length > 0 ? announcements.map(ann => (
          <div key={ann.id} style={{ background: C.warningBg, border: `1px solid #fde68a`, borderRadius: 12, padding: '16px 18px', borderLeft: `4px solid ${C.warning}`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ color: C.warning }}><Ic.Pin /></span>
                <h4 style={{ margin: 0, fontSize: 13.5, fontWeight: 700, color: '#92400e' }}>{ann.subject || 'No Title'}</h4>
                <span style={{ fontSize: 10, fontWeight: 700, background: '#fef3c7', color: C.warning, padding: '2px 8px', borderRadius: 6, border: '1px solid #fde68a' }}>Announcement</span>
              </div>
              <p style={{ margin: 0, fontSize: 13, color: '#a16207', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{ann.content}</p>
              <p style={{ margin: '8px 0 0', fontSize: 11, color: '#b45309' }}>Published by <strong style={{ textTransform: 'capitalize' }}>{ann.sender_name || ann.sender_role || 'System'}</strong> &nbsp;·&nbsp; {new Date(ann.created_at).toLocaleDateString()}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10, flexShrink: 0 }}>
              <ActionBtn icon={Ic.Trash} danger title="Delete" onClick={async () => { if (window.confirm('Delete this announcement?')) { await supabase.from('communications').delete().eq('id', ann.id); fetchData(); } }} />
              <span style={{ fontSize: 11, fontWeight: 700, background: 'rgba(255,255,255,0.6)', color: '#92400e', border: '1px solid #fde68a', padding: '2px 10px', borderRadius: 6 }}>{ann.recipient_name || 'All'}</span>
            </div>
          </div>
        )) : (
          <div style={{ textAlign: 'center', padding: '64px 0', color: C.textMuted, fontSize: 13, fontWeight: 600 }}>No announcements published yet.</div>
        )}
      </div>
    </div>
  );

  const renderCommunicationsTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      <div style={{ marginBottom: 20 }}><h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: C.textDark }}>Communications</h3><p style={{ margin: '3px 0 0', fontSize: 12, color: C.textMuted }}>Send messages and notifications to parents, students, or staff</p></div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <h4 style={{ margin: '0 0 14px', fontSize: 13, fontWeight: 700, color: C.textDark }}>Targeted Messages</h4>
          <PrimaryBtn style={{ width: '100%', justifyContent: 'center' }} onClick={() => { setMainView('chat'); setChatType('smart'); setSelectedRecipient(null); }}><Ic.Chat /> Send Message</PrimaryBtn>
        </div>
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <h4 style={{ margin: '0 0 14px', fontSize: 13, fontWeight: 700, color: C.textDark }}>Bulk Communications</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <OutlineBtn style={{ justifyContent: 'center', width: '100%' }} onClick={() => { setMainView('chat'); setChatType('staff'); setSelectedRecipient(null); }}><Ic.Staff /> Send to Staff</OutlineBtn>
            <button onClick={() => setModalView('newNotification')} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '9px 16px', borderRadius: 9, border: `1.5px solid #ddd6fe`, background: C.purpleBg, color: C.purple, fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s', fontFamily: "'Inter','Segoe UI',sans-serif" }} onMouseEnter={e => e.currentTarget.style.background = '#ede9fe'} onMouseLeave={e => e.currentTarget.style.background = C.purpleBg}>
              <Ic.Bell /> Send Notification
            </button>
          </div>
        </div>
      </div>
      <div style={{ flex: 1, background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <h4 style={{ margin: '0 0 14px', fontSize: 13, fontWeight: 700, color: C.textDark, flexShrink: 0 }}>Recent Communications</h4>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <tbody>
              {recentComms.map(comm => (
                <tr key={comm.id} style={{ borderBottom: `1px solid ${C.border}` }} onMouseEnter={e => e.currentTarget.style.background = C.pageBg} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '12px 8px' }}><p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: C.textDark }}>{comm.subject || comm.content}</p><p style={{ margin: '2px 0 0', fontSize: 11, color: C.textMuted, textTransform: 'capitalize' }}>To: {comm.recipient_name} &nbsp;·&nbsp; {comm.type} &nbsp;·&nbsp; By: {comm.sender_name || comm.sender_role}</p></td>
                  <td style={{ padding: '12px 8px', textAlign: 'right', fontSize: 11, color: C.textMuted, whiteSpace: 'nowrap' }}>{new Date(comm.created_at).toLocaleString()}</td>
                </tr>
              ))}
              {recentComms.length === 0 && <tr><td style={{ padding: '40px 0', textAlign: 'center', color: C.textMuted, fontSize: 13 }}>No recent communications</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderFeedbackTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div><h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: C.textDark }}>Feedback & Complaints</h3><p style={{ margin: '3px 0 0', fontSize: 12, color: C.textMuted }}>Review issues and suggestions submitted by parents or students</p></div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, paddingRight: 2 }}>
        {feedbackList.length > 0 ? feedbackList.map(item => (
          <div key={item.id} style={{ background: item.type === 'complaint' ? C.dangerBg : '#f0fdf4', border: `1px solid ${item.type === 'complaint' ? '#fecaca' : '#bbf7d0'}`, borderRadius: 12, padding: '16px 18px', borderLeft: `4px solid ${item.type === 'complaint' ? C.danger : C.success}`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ color: item.type === 'complaint' ? C.danger : C.success }}><Ic.AlertCircle /></span>
                <h4 style={{ margin: 0, fontSize: 13.5, fontWeight: 700, color: C.textDark }}>{item.subject || 'No Subject'}</h4>
                <span style={{ fontSize: 10, fontWeight: 700, background: '#fff', color: item.type === 'complaint' ? C.danger : C.success, padding: '2px 8px', borderRadius: 6, border: `1px solid ${item.type === 'complaint' ? '#fecaca' : '#bbf7d0'}` }}>{item.type.toUpperCase()}</span>
              </div>
              <p style={{ margin: 0, fontSize: 13, color: C.textDark, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{item.content}</p>
              <p style={{ margin: '8px 0 0', fontSize: 11, color: C.textMuted }}>Submitted by: <strong style={{ color: C.textDark }}>{item.sender_name || 'Anonymous'}</strong> &nbsp;·&nbsp; {new Date(item.created_at).toLocaleDateString()}</p>
            </div>
            <ActionBtn icon={Ic.Trash} danger title="Dismiss" onClick={async () => { if (window.confirm('Dismiss this feedback?')) { await supabase.from('communications').delete().eq('id', item.id); fetchData(); } }} />
          </div>
        )) : (
          <div style={{ textAlign: 'center', padding: '64px 0', color: C.textMuted, fontSize: 13, fontWeight: 600 }}>No feedback or complaints received yet.</div>
        )}
      </div>
    </div>
  );

  // ── Chat view — UNTOUCHED ─────────────────────────────────────────────────
  const renderChatView = () => {
    const isBulk = chatType === 'smart' || chatType === 'staff';
    const title  = isBulk ? (chatType === 'smart' ? 'Broadcast Message' : 'Send to All Staff') : selectedRecipient?.name || 'Conversation';
    const displayMessages = chatMessages.filter(msg => {
      if (selectedRecipient && currentUser) {
        const myId = currentUser.id; const theirId = selectedRecipient.id.toString();
        return (msg.sender_id === myId && msg.recipient_id === theirId) || (msg.sender_id === theirId && msg.recipient_id === myId);
      }
      return false;
    });
    return (
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: `1px solid ${C.border}`, background: C.pageBg, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <OutlineBtn onClick={() => setMainView('portal')} style={{ padding: '7px 12px' }}><Ic.ArrowLeft /> Back</OutlineBtn>
            {!isBulk && (<div style={{ width: 36, height: 36, borderRadius: '50%', background: C.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.primary, position: 'relative' }}><Ic.User /><span style={{ position: 'absolute', bottom: 1, right: 1, width: 9, height: 9, background: C.success, borderRadius: '50%', border: `2px solid ${C.white}` }} /></div>)}
            <div><p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: C.textDark }}>{title}</p><p style={{ margin: '1px 0 0', fontSize: 11, color: C.success, fontWeight: 600 }}>Online</p></div>
          </div>
        </div>
        <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            {isBulk && (
              <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.border}`, background: C.pageBg, flexShrink: 0 }}>
                <SectionLabel>Target Audience</SectionLabel>
                <AudienceRow keys={chatType === 'smart' ? [{ key: 'all', label: 'All' }, { key: 'students', label: 'Students' }, { key: 'parents', label: 'Parents' }, { key: 'staff', label: 'Staff' }] : [{ key: 'all', label: 'All' }, { key: 'teacher', label: 'Teachers' }, { key: 'admin', label: 'Admins' }]} />
              </div>
            )}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 12, background: '#f8fafc' }}>
              {displayMessages.length > 0 ? displayMessages.map(msg => {
                const isMine = msg.sender_id === currentUser?.id;
                return (
                  <div key={msg.id} style={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start' }}>
                    <div style={{ maxWidth: '60%', padding: '11px 15px', borderRadius: 14, borderBottomRightRadius: isMine ? 4 : 14, borderBottomLeftRadius: isMine ? 14 : 4, background: isMine ? C.primary : C.white, color: isMine ? '#fff' : C.textDark, boxShadow: '0 1px 4px rgba(0,0,0,0.07)', border: isMine ? 'none' : `1px solid ${C.border}` }}>
                      <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5 }}>{msg.content}</p>
                      <p style={{ margin: '5px 0 0', fontSize: 10, color: isMine ? 'rgba(255,255,255,0.55)' : C.textMuted, textAlign: 'right' }}>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} &nbsp;<Ic.Check /></p>
                    </div>
                  </div>
                );
              }) : (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: C.textMuted, gap: 10 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: C.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.primary }}><Ic.Chat /></div>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>{isBulk ? 'Select filters above and type your message to broadcast.' : 'No messages yet. Start the conversation!'}</p>
                </div>
              )}
            </div>
            <div style={{ padding: '14px 16px', borderTop: `1px solid ${C.border}`, background: C.white, display: 'flex', gap: 10, flexShrink: 0 }}>
              <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendMessage()} placeholder="Type your message..." style={{ ...inputCls, flex: 1, height: 42, fontSize: 13 }} onFocus={focusInput} onBlur={blurInput} />
              <PrimaryBtn onClick={handleSendMessage} style={{ height: 42, paddingLeft: 18, paddingRight: 18 }}><Ic.Send /> Send</PrimaryBtn>
            </div>
          </div>
          {selectedRecipient && (
            <div style={{ width: 260, borderLeft: `1px solid ${C.border}`, background: C.white, display: 'flex', flexDirection: 'column', padding: '24px 20px', overflowY: 'auto', flexShrink: 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: C.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.primary, marginBottom: 12, border: `3px solid ${C.white}`, boxShadow: `0 0 0 2px ${C.primary}20` }}><Ic.User /></div>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: C.textDark, textAlign: 'center' }}>{selectedRecipient.name}</p>
                <p style={{ margin: '3px 0 0', fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{selectedRecipient.role}</p>
              </div>
              <div style={{ background: C.pageBg, borderRadius: 10, border: `1px solid ${C.border}`, padding: '14px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <SectionLabel>Contact Info</SectionLabel>
                {[{ label: 'Phone', val: selectedRecipient.phone || 'N/A' }, { label: 'Email', val: selectedRecipient.email || 'N/A', primary: true }, ...(selectedRecipient.dept ? [{ label: 'Department', val: selectedRecipient.dept }] : [])].map((item, i) => (
                  <div key={i}><p style={{ margin: 0, fontSize: 10.5, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.label}</p><p style={{ margin: '3px 0 0', fontSize: 12.5, fontWeight: 600, color: item.primary ? C.primary : C.textDark, wordBreak: 'break-all' }}>{item.val}</p></div>
                ))}
              </div>
              {selectedRecipient.level && (<div style={{ marginTop: 12, background: C.primaryLight, borderRadius: 10, border: `1px solid #c7d2fe`, padding: '12px 14px' }}><SectionLabel>Academic Info</SectionLabel><p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: C.primary }}>Level: {selectedRecipient.level}</p></div>)}
            </div>
          )}
        </div>
      </div>
    );
  };

  const ModalField = ({ label, children }) => (
    <div><SectionLabel>{label}</SectionLabel>{children}</div>
  );

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @keyframes slideUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        * { box-sizing: border-box; }
        input::placeholder, textarea::placeholder { color: #94a3b8; }
        select option { color: #1e293b; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      {/* ── ROOT: matches the padding/overflow of every other page ── */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: 28,
        display: 'flex', flexDirection: 'column',
        fontFamily: "'Inter','Segoe UI',sans-serif",
        background: C.pageBg,
      }}>

        {/* ── Portal view ── */}
        {mainView === 'portal' && (
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>

            {/* Page header */}
            <div style={{ marginBottom: 24, flexShrink: 0 }}>
              <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: C.textDark }}>Communication Portal</h2>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: C.textMuted }}>Manage directories, announcements, and school communications</p>
            </div>

            {/* Stat cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24, flexShrink: 0 }}>
              <StatCard label="Total Students" value={studentsList.length} icon={Ic.Student}     iconBg="#eff6ff"    iconColor="#2563eb" />
              <StatCard label="Staff Members"  value={staffList.length}   icon={Ic.Staff}       iconBg="#ecfdf5"    iconColor={C.success} />
              <StatCard label="Broadcasts"     value={announcements.length} icon={Ic.Megaphone} iconBg={C.warningBg} iconColor={C.warning} />
              <StatCard label="Feedback"       value={feedbackList.length}  icon={Ic.AlertCircle} iconBg={C.dangerBg} iconColor={C.danger} />
            </div>

            {/* Tab bar */}
            <TabBar tabs={tabs} active={activeTab} onChange={setActiveTab} />

            {/* Tab content */}
            <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
              {activeTab === 'parents'        && renderParentsTab()}
              {activeTab === 'students'       && renderStudentsTab()}
              {activeTab === 'staff'          && renderStaffTab()}
              {activeTab === 'announcements'  && renderAnnouncementsTab()}
              {activeTab === 'communications' && renderCommunicationsTab()}
              {activeTab === 'feedback'       && renderFeedbackTab()}
            </div>
          </div>
        )}

        {/* ── Chat view ── */}
        {mainView === 'chat' && (
          <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            {renderChatView()}
          </div>
        )}

        {/* ══ MODALS ══ */}
        {modalView === 'addParent' && (
          <Modal title="Add New Parent / Guardian" subtitle="Enter parent or guardian information" onClose={() => setModalView(null)}>
            <form onSubmit={handleAddParent} style={{ display: 'flex', flexDirection: 'column', gap: 14 }} noValidate>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <ModalField label="First Name"><input type="text" required value={parentForm.firstName} onChange={e => setParentForm({ ...parentForm, firstName: e.target.value })} style={inputCls} onFocus={focusInput} onBlur={blurInput} placeholder="Jean" /></ModalField>
                <ModalField label="Last Name"><input type="text" required value={parentForm.lastName} onChange={e => setParentForm({ ...parentForm, lastName: e.target.value })} style={inputCls} onFocus={focusInput} onBlur={blurInput} placeholder="Dupont" /></ModalField>
                <ModalField label="Email Address"><input type="email" required value={parentForm.email} onChange={e => setParentForm({ ...parentForm, email: e.target.value })} style={inputCls} onFocus={focusInput} onBlur={blurInput} placeholder="name@email.com" /></ModalField>
                <ModalField label="Phone Number"><input type="tel" required value={parentForm.phone} onChange={e => setParentForm({ ...parentForm, phone: e.target.value })} style={inputCls} onFocus={focusInput} onBlur={blurInput} placeholder="+213 6 12 34 56 78" /></ModalField>
              </div>
              <ModalField label="Address"><input type="text" value={parentForm.address} onChange={e => setParentForm({ ...parentForm, address: e.target.value })} style={inputCls} onFocus={focusInput} onBlur={blurInput} placeholder="123 Main Street" /></ModalField>
              <ModalField label="Relationship">
                <select value={parentForm.relationship} onChange={e => setParentForm({ ...parentForm, relationship: e.target.value })}
                  style={{ ...inputCls, cursor: 'pointer', appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', paddingRight: 34 }}
                  onFocus={focusInput} onBlur={blurInput}>
                  <option>Select relationship</option><option>Father</option><option>Mother</option><option>Guardian</option>
                </select>
              </ModalField>
              <div style={{ paddingTop: 8 }}>
                <PrimaryBtn type="submit" style={{ width: '100%', justifyContent: 'center', height: 44 }}>Add Parent</PrimaryBtn>
              </div>
            </form>
          </Modal>
        )}

        {modalView === 'newAnnouncement' && (
          <Modal title="Create Announcement" subtitle="Share important information with the school community" onClose={() => setModalView(null)}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <ModalField label="Title"><input type="text" onChange={e => setAnnouncementForm({ ...announcementForm, title: e.target.value })} style={inputCls} onFocus={focusInput} onBlur={blurInput} placeholder="Announcement title..." /></ModalField>
              <ModalField label="Content"><textarea rows={4} onChange={e => setAnnouncementForm({ ...announcementForm, content: e.target.value })} style={{ ...inputCls, height: 'auto', resize: 'none', padding: '10px 14px', lineHeight: 1.6 }} onFocus={focusInput} onBlur={blurInput} placeholder="Write your announcement here..." /></ModalField>
              <ModalField label="Target Audience"><AudienceRow keys={[{ key: 'students', label: 'Students' }, { key: 'teacher', label: 'Teachers' }, { key: 'parents', label: 'Parents' }, { key: 'staff', label: 'Staff' }]} /></ModalField>
              <div style={{ paddingTop: 8 }}><PrimaryBtn onClick={handlePublishAnnouncement} style={{ width: '100%', justifyContent: 'center', height: 44 }}><Ic.Megaphone /> Publish Announcement</PrimaryBtn></div>
            </div>
          </Modal>
        )}

        {modalView === 'newNotification' && (
          <Modal title="Send Notification" subtitle="Send an instant alert to specific groups or everyone" onClose={() => setModalView(null)} accentColor={C.purple}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <ModalField label="Notification Title"><input type="text" onChange={e => setNotificationForm({ ...notificationForm, title: e.target.value })} style={inputCls} onFocus={focusInput} onBlur={blurInput} placeholder="e.g. Urgent: Class Rescheduled" /></ModalField>
              <ModalField label="Message Content"><textarea rows={4} onChange={e => setNotificationForm({ ...notificationForm, content: e.target.value })} style={{ ...inputCls, height: 'auto', resize: 'none', padding: '10px 14px', lineHeight: 1.6 }} onFocus={focusInput} onBlur={blurInput} placeholder="Type your notification message..." /></ModalField>
              <ModalField label="Target Audience"><AudienceRow keys={[{ key: 'students', label: 'Students' }, { key: 'teacher', label: 'Teachers' }, { key: 'parents', label: 'Parents' }, { key: 'staff', label: 'Staff' }]} /></ModalField>
              <div style={{ paddingTop: 8 }}>
                <button onClick={handleSendNotification} style={{ width: '100%', height: 44, border: 'none', borderRadius: 9, background: C.purple, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 3px 12px rgba(124,58,237,0.26)', transition: 'all 0.15s', fontFamily: "'Inter','Segoe UI',sans-serif" }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#6d28d9'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = C.purple; e.currentTarget.style.transform = 'none'; }}>
                  <Ic.Bell /> Send Notification Now
                </button>
              </div>
            </div>
          </Modal>
        )}

      </div>
    </>
  );
};

export default ParentPortal;
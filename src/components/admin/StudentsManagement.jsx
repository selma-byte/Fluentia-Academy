import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
  primary:      '#4318FF',
  primaryLight: '#eef2ff',
  primaryMid:   '#818cf8',
  navy:         '#0f172a',
  white:        '#ffffff',
  pageBg:       '#f8fafc',
  border:       '#f1f5f9',
  borderMid:    '#e2e8f0',
  textDark:     '#1e293b',
  textMid:      '#64748b',
  textMuted:    '#94a3b8',
  success:      '#059669',
  successBg:    '#ecfdf5',
  warning:      '#d97706',
  warningBg:    '#fffbeb',
  danger:       '#dc2626',
  dangerBg:     '#fef2f2',
  blue:         '#2563eb',
  blueBg:       '#eff6ff',
  orange:       '#f97316',
  orangeBg:     '#fff7ed',
  purple:       '#7c3aed',
  purpleBg:     '#f5f3ff',
};

// ─── Icon System ──────────────────────────────────────────────────────────────
const Ic = {
  Requests:  () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>,
  Records:   () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 4 3 6 3s6-1 6-3v-5"/></svg>,
  Archive:   () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg>,
  AddUser:   () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>,
  AddStaff:  () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Search:    () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Edit:      () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Trash:     () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
  Eye:       () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  Calendar:  () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  Check:     () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Enroll:    () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 4 3 6 3s6-1 6-3v-5"/></svg>,
  Close:     () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  ArrowLeft: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  Plus:      () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Restore:   () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.5"/></svg>,
  Print:     () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>,
  Process:   () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  Group:     () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  ChevronDown: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
  X:         () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
};

// ─── Shared Styles ────────────────────────────────────────────────────────────
const inputBase = {
  width: '100%', background: C.pageBg,
  border: `1.5px solid ${C.borderMid}`, borderRadius: 10,
  padding: '9px 13px', fontSize: 13,
  fontFamily: "'Inter','Segoe UI',sans-serif",
  color: C.textDark, outline: 'none', boxSizing: 'border-box',
  transition: 'border-color 0.2s, box-shadow 0.2s, background 0.2s',
};
const onFocus = e => { e.target.style.borderColor = C.primary; e.target.style.boxShadow = '0 0 0 3px rgba(67,24,255,0.09)'; e.target.style.background = C.white; };
const onBlur  = e => { e.target.style.borderColor = C.borderMid; e.target.style.boxShadow = 'none'; e.target.style.background = C.pageBg; };
const selectStyle = { ...inputBase, cursor: 'pointer', appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', paddingRight: 34 };

// ─── Reusable Primitives ──────────────────────────────────────────────────────
const PrimaryBtn = ({ children, onClick, type = 'button', disabled, style = {} }) => (
  <button type={type} onClick={onClick} disabled={disabled}
    style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 16px', borderRadius: 9, border: 'none', background: disabled ? C.textMuted : C.primary, color: '#fff', fontSize: 13, fontWeight: 700, cursor: disabled ? 'not-allowed' : 'pointer', boxShadow: disabled ? 'none' : '0 3px 12px rgba(67,24,255,0.24)', transition: 'all 0.15s', fontFamily: "'Inter','Segoe UI',sans-serif", ...style }}
    onMouseEnter={e => { if (!disabled) { e.currentTarget.style.background = '#3510d4'; e.currentTarget.style.transform = 'translateY(-1px)'; }}}
    onMouseLeave={e => { e.currentTarget.style.background = disabled ? C.textMuted : C.primary; e.currentTarget.style.transform = 'none'; }}
  >{children}</button>
);

const OutlineBtn = ({ children, onClick, style = {}, danger }) => (
  <button type="button" onClick={onClick}
    style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '8px 14px', borderRadius: 9, border: `1.5px solid ${danger ? '#fca5a5' : C.borderMid}`, background: danger ? C.dangerBg : C.white, color: danger ? C.danger : C.textDark, fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s', fontFamily: "'Inter','Segoe UI',sans-serif", ...style }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = danger ? C.danger : '#c7d2fe'; e.currentTarget.style.background = danger ? '#fecaca' : C.primaryLight; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = danger ? '#fca5a5' : C.borderMid; e.currentTarget.style.background = danger ? C.dangerBg : C.white; }}
  >{children}</button>
);

const ActionBtn = ({ icon: Icon, onClick, title, danger }) => (
  <button onClick={onClick} title={title}
    style={{ width: 30, height: 30, borderRadius: 7, background: 'transparent', border: `1px solid ${C.border}`, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: C.textMuted, transition: 'all 0.15s' }}
    onMouseEnter={e => { e.currentTarget.style.background = danger ? C.dangerBg : C.primaryLight; e.currentTarget.style.color = danger ? C.danger : C.primary; e.currentTarget.style.borderColor = danger ? '#fca5a5' : '#c7d2fe'; }}
    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.textMuted; e.currentTarget.style.borderColor = C.border; }}
  ><Icon /></button>
);

const StatusBadge = ({ status }) => {
  const map = { 'Active': { color: C.success, bg: C.successBg }, 'Passed': { color: C.success, bg: C.successBg }, 'Scheduled': { color: C.blue, bg: C.blueBg }, 'Pending': { color: C.warning, bg: C.warningBg }, 'Pending Group': { color: C.orange, bg: C.orangeBg }, 'Archived': { color: C.textMid, bg: C.border } };
  const s = map[status] || { color: C.textMid, bg: C.border };
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, color: s.color, background: s.bg, padding: '3px 10px', borderRadius: 20 }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.color, flexShrink: 0 }} />{status}
    </span>
  );
};

const Th = ({ children, center }) => (
  <th style={{ padding: '11px 16px', background: C.pageBg, borderBottom: `1px solid ${C.borderMid}`, textAlign: center ? 'center' : 'left', fontSize: 10.5, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', position: 'sticky', top: 0, whiteSpace: 'nowrap' }}>{children}</th>
);
const Td = ({ children, center, style = {} }) => (
  <td style={{ padding: '12px 16px', borderBottom: `1px solid ${C.border}`, verticalAlign: 'middle', textAlign: center ? 'center' : 'left', fontSize: 13, ...style }}>{children}</td>
);
const TableCard = ({ children }) => (
  <div style={{ flex: 1, overflow: 'auto', background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>{children}</table>
  </div>
);

const Modal = ({ title, subtitle, onClose, children, width = 520 }) => (
  <div onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)' }}>
    <div style={{ background: C.white, borderRadius: 18, maxWidth: width, width: '100%', boxShadow: '0 24px 80px rgba(0,0,0,0.18)', border: `1px solid ${C.border}`, overflow: 'hidden', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 22px', borderBottom: `1px solid ${C.border}`, background: C.pageBg, flexShrink: 0 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: C.textDark }}>{title}</h2>
          {subtitle && <p style={{ margin: '2px 0 0', fontSize: 11, color: C.textMuted }}>{subtitle}</p>}
        </div>
        <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: '50%', background: C.border, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.textMid, transition: 'all 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.background = C.dangerBg; e.currentTarget.style.color = C.danger; }}
          onMouseLeave={e => { e.currentTarget.style.background = C.border; e.currentTarget.style.color = C.textMid; }}
        ><Ic.Close /></button>
      </div>
      <div style={{ padding: '22px', overflowY: 'auto', flex: 1 }}>{children}</div>
    </div>
  </div>
);

const FieldLabel = ({ children }) => (
  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 7 }}>{children}</label>
);
const FormField = ({ label, children }) => (<div><FieldLabel>{label}</FieldLabel>{children}</div>);

const SectionCard = ({ title, children, style = {} }) => (
  <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', padding: '20px', marginBottom: 16, ...style }}>
    {title && <h3 style={{ margin: '0 0 16px', fontSize: 13.5, fontWeight: 800, color: C.textDark, paddingBottom: 12, borderBottom: `1px solid ${C.border}` }}>{title}</h3>}
    {children}
  </div>
);

const SearchBar = ({ value, onChange, placeholder, width = 280 }) => (
  <div style={{ position: 'relative', flexShrink: 0 }}>
    <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: C.textMuted, display: 'flex', pointerEvents: 'none' }}><Ic.Search /></span>
    <input type="text" value={value} onChange={onChange} placeholder={placeholder}
      style={{ ...inputBase, paddingLeft: 32, height: 36, fontSize: 12.5, width }}
      onFocus={onFocus} onBlur={onBlur}
    />
  </div>
);

const FilterSelect = ({ value, onChange, children }) => (
  <select value={value} onChange={onChange} style={{ ...selectStyle, height: 36, fontSize: 12.5, width: 'auto', minWidth: 140 }} onFocus={onFocus} onBlur={onBlur}>
    {children}
  </select>
);

const FilterBar = ({ children }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', flexShrink: 0, flexWrap: 'wrap' }}>
    {children}
  </div>
);

// ─── TAB 1: Registration Requests ─────────────────────────────────────────────
const RegistrationRequestsTab = () => {
  const [activeFilter,          setActiveFilter]          = useState('All');
  const [requests,              setRequests]              = useState([]);
  const [classesData,           setClassesData]           = useState([]);
  const [staffData,             setStaffData]             = useState([]);
  const [roomsData,             setRoomsData]             = useState([]);
  const [schedTeacher,          setSchedTeacher]          = useState('');
  const [isEnrollMode,          setIsEnrollMode]          = useState(false);
  const [isScheduleModalOpen,   setIsScheduleModalOpen]   = useState(false);
  const [isViewInfoModalOpen,   setIsViewInfoModalOpen]   = useState(false);
  const [selectedStudent,       setSelectedStudent]       = useState(null);
  const [loading,               setLoading]               = useState(false);
  const [enrollClassId,         setEnrollClassId]         = useState('');
  const [enrollGrade,           setEnrollGrade]           = useState('');
  const [enrollLevel,           setEnrollLevel]           = useState('A1');

  const getTodayString = () => { const t = new Date(); return new Date(t.getTime() - t.getTimezoneOffset() * 60000).toISOString().split('T')[0]; };
  const [schedDate, setSchedDate] = useState(getTodayString());
  const [schedTime, setSchedTime] = useState('10:00');
  const [schedRoom, setSchedRoom] = useState('');

  const fetchRequests = async () => {
    const { data } = await supabase.from('students').select('*').eq('exam_type', 'Placement').order('enrollment_date', { ascending: false });
    if (data) setRequests(data.map(req => ({ ...req, name: `${req.first_name} ${req.last_name}`, type: req.child_name ? 'Parent' : 'Student', parent: req.child_name ? 'Parent / Guardian' : null, status: req.status === 'Tested' ? 'Passed' : req.status === 'pending' ? 'Pending' : req.status })));
  };
  const fetchClasses      = async () => { const { data } = await supabase.from('classes').select('*'); if (data) setClassesData(data); };
  const fetchStaffAndRooms= async () => {
    const { data: staff } = await supabase.from('staff').select('*'); if (staff) setStaffData(staff);
    const { data: rooms } = await supabase.from('rooms').select('*'); if (rooms) setRoomsData(rooms);
  };
  useEffect(() => { fetchRequests(); fetchClasses(); fetchStaffAndRooms(); }, []);

  const filteredRequests = requests.filter(r => activeFilter === 'All' || r.type === activeFilter);

  const detectLevelFromScore = (scoreStr) => {
    if (!scoreStr) return 'A1';
    const upper = String(scoreStr).toUpperCase();
    for (let l of ['A1','A2','B1','B2','C1','C2']) { if (upper.includes(l)) return l; }
    const n = upper.match(/(\d+)/);
    if (n) { const s = parseFloat(n[1]); if (s < 10) return 'A1'; if (s < 13) return 'A2'; if (s < 16) return 'B1'; if (s < 18) return 'B2'; return 'C1'; }
    return 'A1';
  };

  const handleEnrollNow = (req) => { setSelectedStudent(req); setEnrollGrade(req.test_score || ''); setEnrollLevel(detectLevelFromScore(req.test_score || '')); setEnrollClassId(''); setIsEnrollMode(true); };
  const handleOpenScheduleModal = (req) => { setSelectedStudent(req); setIsScheduleModalOpen(true); };
  const handleOpenInfoModal     = (req) => { setSelectedStudent(req); setIsViewInfoModalOpen(true); };

  // ALL ORIGINAL SUPABASE HANDLERS — UNTOUCHED
  const handleSaveSchedule = async () => {
    setLoading(true);
    try {
      if (!schedRoom || !schedTeacher || !schedDate || !schedTime) { alert("Please fill in all scheduling fields."); setLoading(false); return; }
      const { data: existingTests } = await supabase.from('appointments').select('*').eq('appointment_date', schedDate).eq('start_time', schedTime).ilike('sub_title', '%Placement Test%');
      if (existingTests && existingTests.length > 0) {
        const ok = window.confirm(`${existingTests.length} students already scheduled at this time. Add this student too?`);
        if (!ok) { setLoading(false); return; }
      }
      const dateObj = new Date(schedDate);
      const daysMap = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
      const dayName = daysMap[dateObj.getDay()];
      const hourOnly = schedTime.substring(0, 2);
      const { data: conflicts } = await supabase.from('classes').select('*').ilike('schedule', `%${dayName}%`).ilike('schedule', `%${hourOnly}%`).ilike('schedule', `%${schedRoom}%`).limit(1);
      if (conflicts && conflicts.length > 0) { alert(`Room [${schedRoom}] is already booked by group: ${conflicts[0].name}`); setLoading(false); return; }
      await supabase.from('students').update({ status: 'Scheduled', appointment_date: `${schedDate} at ${schedTime}` }).eq('id', selectedStudent.id);
      await supabase.from('appointments').insert([{ title: selectedStudent.name, sub_title: `Placement Test: ${selectedStudent.language} (Prof: ${schedTeacher}, Room: ${schedRoom})`, appointment_date: schedDate, start_time: schedTime, status: 'Upcoming', phone: selectedStudent.phone }]);
      alert("Placement test scheduled successfully.");
      setIsScheduleModalOpen(false); fetchRequests();
    } catch (err) { alert("Error: " + err.message); } finally { setLoading(false); }
  };

  const handleFinalEnrollment = async () => {
    if (!enrollClassId) return alert("Please select a group.");
    if (!enrollGrade)   return alert("Please enter a test score.");
    try {
      const selectedClass = classesData.find(c => c.id === enrollClassId);
      const currentCount = selectedClass.enrolled_count || 0;
      if (currentCount >= selectedClass.capacity) return alert("This group is full.");
      const { error: authError } = await supabase.auth.signUp({ email: selectedStudent.email, password: selectedStudent.phone });
      if (authError && authError.message !== "User already registered") throw authError;
      await supabase.from('classes').update({ enrolled_count: currentCount + 1 }).eq('id', enrollClassId);
      await supabase.from('students').update({ status: 'Active', exam_type: 'Course', group_name: selectedClass.name, level: enrollLevel, test_score: enrollGrade }).eq('id', selectedStudent.id);
      alert(`${selectedStudent.name} enrolled in ${selectedClass.name} successfully.`);
      setIsEnrollMode(false); fetchRequests();
    } catch (err) { alert("Enrollment error: " + err.message); }
  };

  // Enroll Mode View
  if (isEnrollMode) {
    const matchingClasses = classesData.filter(c => c.language === selectedStudent?.language && c.level === enrollLevel);
    return (
      <div style={{ flex: 1, overflowY: 'auto', padding: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
          <button onClick={() => setIsEnrollMode(false)} style={{ width: 36, height: 36, borderRadius: '50%', background: C.white, border: `1px solid ${C.borderMid}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: C.textMid, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}><Ic.ArrowLeft /></button>
          <div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: C.textDark }}>Enroll Student</h2>
            <p style={{ margin: '3px 0 0', fontSize: 12, color: C.textMuted }}>Review test results and assign to a class group</p>
          </div>
        </div>
        <SectionCard title="Final Registration Decision">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
            <FormField label="Test Score">
              <input type="text" value={enrollGrade} onChange={e => { setEnrollGrade(e.target.value); setEnrollLevel(detectLevelFromScore(e.target.value)); setEnrollClassId(''); }} style={{ ...inputBase, fontWeight: 700, color: C.blue }} onFocus={onFocus} onBlur={onBlur} />
            </FormField>
            <FormField label="Assign Level">
              <select value={enrollLevel} onChange={e => { setEnrollLevel(e.target.value); setEnrollClassId(''); }} style={{ ...selectStyle, background: C.blueBg, borderColor: '#bfdbfe', color: C.blue }} onFocus={onFocus} onBlur={onBlur}>
                {['A1','A2','B1','B2','C1','C2'].map(l => <option key={l}>{l}</option>)}
              </select>
            </FormField>
            <FormField label="Available Groups">
              <select value={enrollClassId} onChange={e => setEnrollClassId(e.target.value)} style={{ ...selectStyle, background: C.successBg, borderColor: '#86efac', color: C.success }} onFocus={onFocus} onBlur={onBlur}>
                <option value="">— Select Group —</option>
                {matchingClasses.length === 0 && <option disabled>No classes for {enrollLevel}</option>}
                {matchingClasses.map(c => { const full = (c.enrolled_count||0) >= (c.capacity||20); return <option key={c.id} value={c.id} disabled={full}>{c.name} ({c.enrolled_count||0}/{c.capacity||20}){full?' — FULL':''}</option>; })}
              </select>
            </FormField>
          </div>
        </SectionCard>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <SectionCard title="Personal Info">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input type="text" defaultValue={selectedStudent?.first_name} placeholder="First Name" style={inputBase} onFocus={onFocus} onBlur={onBlur} />
              <input type="text" defaultValue={selectedStudent?.last_name}  placeholder="Last Name"  style={inputBase} onFocus={onFocus} onBlur={onBlur} />
            </div>
          </SectionCard>
          <SectionCard title="Contact Info">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input type="email" defaultValue={selectedStudent?.email} placeholder="Email Address" style={inputBase} onFocus={onFocus} onBlur={onBlur} />
              <input type="text"  defaultValue={selectedStudent?.phone} placeholder="Phone Number"  style={inputBase} onFocus={onFocus} onBlur={onBlur} />
            </div>
          </SectionCard>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <OutlineBtn onClick={() => setIsEnrollMode(false)}>Cancel</OutlineBtn>
          <PrimaryBtn onClick={handleFinalEnrollment}><Ic.Check /> Approve & Save Student</PrimaryBtn>
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 28, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexShrink: 0 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: C.textDark }}>Registration Requests</h2>
          <p style={{ margin: '4px 0 0', fontSize: 12, color: C.textMuted }}>Placement test applicants and enrollment pipeline</p>
        </div>
        <div style={{ display: 'flex', background: C.pageBg, borderRadius: 9, padding: 3, border: `1px solid ${C.border}`, gap: 2 }}>
          {['All','Student','Parent'].map(f => (
            <button key={f} onClick={() => setActiveFilter(f)}
              style={{ padding: '6px 16px', borderRadius: 7, border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s', background: activeFilter === f ? C.white : 'transparent', color: activeFilter === f ? C.primary : C.textMuted, boxShadow: activeFilter === f ? '0 1px 4px rgba(0,0,0,0.08)' : 'none', fontFamily: "'Inter','Segoe UI',sans-serif" }}
            >{f}</button>
          ))}
        </div>
      </div>

      <TableCard>
        <thead><tr><Th>Applicant</Th><Th center>Type</Th><Th>Course Info</Th><Th center>Status</Th><Th center>Actions</Th></tr></thead>
        <tbody>
          {filteredRequests.map(req => (
            <tr key={req.id} onMouseEnter={e => e.currentTarget.style.background = C.pageBg} onMouseLeave={e => e.currentTarget.style.background = 'transparent'} style={{ transition: 'background 0.12s' }}>
              <Td>
                <p style={{ margin: 0, fontWeight: 700, color: C.textDark, fontSize: 13.5 }}>{req.name}</p>
                {req.parent && <p style={{ margin: '2px 0 0', fontSize: 10.5, fontWeight: 700, color: C.blue, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Parent / Guardian</p>}
              </Td>
              <Td center>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: req.type === 'Student' ? C.blueBg : C.purpleBg, color: req.type === 'Student' ? C.blue : C.purple }}>
                  {req.type}
                </span>
              </Td>
              <Td>
                <p style={{ margin: 0, fontWeight: 700, color: C.textDark }}>{req.language}</p>
                <p style={{ margin: '2px 0 0', fontSize: 10.5, color: C.textMuted, fontWeight: 600, textTransform: 'uppercase' }}>Level: {req.level}</p>
              </Td>
              <Td center><StatusBadge status={req.status} /></Td>
              <Td center>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <ActionBtn icon={Ic.Eye} onClick={() => handleOpenInfoModal(req)} title="View Details" />
                  {req.status === 'Passed' ? (
                    <PrimaryBtn onClick={() => handleEnrollNow(req)} style={{ padding: '6px 14px', fontSize: 12, background: C.success, boxShadow: '0 2px 8px rgba(5,150,105,0.25)' }}>
                      <Ic.Enroll /> Enroll Now
                    </PrimaryBtn>
                  ) : (
                    <button onClick={() => handleOpenScheduleModal(req)} disabled={req.status === 'Scheduled'}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 8, border: 'none', fontSize: 12, fontWeight: 700, cursor: req.status === 'Scheduled' ? 'not-allowed' : 'pointer', background: req.status === 'Scheduled' ? C.border : C.textDark, color: req.status === 'Scheduled' ? C.textMuted : '#fff', transition: 'all 0.15s', fontFamily: "'Inter','Segoe UI',sans-serif" }}
                    ><Ic.Calendar /> {req.status === 'Scheduled' ? 'Scheduled' : 'Schedule Test'}</button>
                  )}
                </div>
              </Td>
            </tr>
          ))}
          {filteredRequests.length === 0 && (
            <tr><td colSpan="5" style={{ padding: '52px 0', textAlign: 'center', color: C.textMuted, fontSize: 13, fontWeight: 600 }}>No registration requests found.</td></tr>
          )}
        </tbody>
      </TableCard>

      {isViewInfoModalOpen && selectedStudent && (
        <Modal title="Applicant Details" onClose={() => setIsViewInfoModalOpen(false)} width={440}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ background: C.pageBg, padding: '12px 14px', borderRadius: 10, border: `1px solid ${C.border}` }}>
              <FieldLabel>Full Name</FieldLabel>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: C.textDark }}>{selectedStudent?.name}</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[{ label: 'Phone', val: selectedStudent?.phone || 'N/A' }, { label: 'Email', val: selectedStudent?.email || 'N/A' }].map(i => (
                <div key={i.label} style={{ background: C.pageBg, padding: '12px 14px', borderRadius: 10, border: `1px solid ${C.border}` }}>
                  <FieldLabel>{i.label}</FieldLabel>
                  <p style={{ margin: 0, fontSize: 12.5, fontWeight: 700, color: C.textDark, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{i.val}</p>
                </div>
              ))}
            </div>
            {selectedStudent?.test_score && (
              <div style={{ background: C.successBg, padding: '14px', borderRadius: 10, border: '1px solid #86efac' }}>
                <FieldLabel>Test Score</FieldLabel>
                <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: C.success }}>{selectedStudent?.test_score}</p>
              </div>
            )}
            <PrimaryBtn onClick={() => setIsViewInfoModalOpen(false)} style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}>Close</PrimaryBtn>
          </div>
        </Modal>
      )}

      {isScheduleModalOpen && selectedStudent && (
        <Modal title="Schedule Placement Test" subtitle={`Applicant: ${selectedStudent?.name}`} onClose={() => setIsScheduleModalOpen(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <FormField label="Language"><select style={selectStyle} onFocus={onFocus} onBlur={onBlur}><option>{selectedStudent?.language}</option></select></FormField>
              <FormField label="Level"><input type="text" defaultValue={selectedStudent?.level} readOnly style={{ ...inputBase, background: C.border, color: C.textMid }} /></FormField>
              <FormField label="Date"><input type="date" value={schedDate} onChange={e => setSchedDate(e.target.value)} style={inputBase} onFocus={onFocus} onBlur={onBlur} /></FormField>
              <FormField label="Time"><input type="time" value={schedTime} onChange={e => setSchedTime(e.target.value)} style={inputBase} onFocus={onFocus} onBlur={onBlur} /></FormField>
              <FormField label="Teacher">
                <select value={schedTeacher} onChange={e => setSchedTeacher(e.target.value)} style={selectStyle} onFocus={onFocus} onBlur={onBlur}>
                  <option value="">— Select Teacher —</option>
                  {staffData.map(s => <option key={s.id} value={`${s.first_name} ${s.last_name}`}>{s.first_name} {s.last_name}</option>)}
                </select>
              </FormField>
              <FormField label="Room">
                <select value={schedRoom} onChange={e => setSchedRoom(e.target.value)} style={selectStyle} onFocus={onFocus} onBlur={onBlur}>
                  <option value="">— Select Room —</option>
                  {roomsData.map(r => <option key={r.id} value={r.name || r.room_name || r.id}>{r.name || r.room_name || `Room ${r.id}`}</option>)}
                </select>
              </FormField>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 8 }}>
              <OutlineBtn onClick={() => setIsScheduleModalOpen(false)}>Cancel</OutlineBtn>
              <PrimaryBtn onClick={handleSaveSchedule} disabled={loading}><Ic.Calendar /> {loading ? 'Saving…' : 'Save & Notify'}</PrimaryBtn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ─── TAB 2: Active Records ─────────────────────────────────────────────────────
const StudentRecordsTab = () => {
  const [currentView,           setCurrentView]           = useState('list');
  const [selectedStudent,       setSelectedStudent]       = useState(null);
  const [searchQuery,           setSearchQuery]           = useState('');
  const [filterLang,            setFilterLang]            = useState('All');
  const [filterLevel,           setFilterLevel]           = useState('All');
  const [studentsData,          setStudentsData]          = useState([]);
  const [classesData,           setClassesData]           = useState([]);
  const [loading,               setLoading]               = useState(false);
  const [isProcessModalOpen,    setIsProcessModalOpen]    = useState(false);
  const [processData,           setProcessData]           = useState({ newLevel: 'A1' });
  const [isAssignGroupModalOpen,setIsAssignGroupModalOpen]= useState(false);
  const [assignGroupData,       setAssignGroupData]       = useState({ classId: '' });
  const [isEditModalOpen,       setIsEditModalOpen]       = useState(false);
  const [editFormData,          setEditFormData]          = useState({ id: null, firstName: '', lastName: '', email: '', phone: '', level: '' });

  const fetchActiveStudents = async () => {
    const { data } = await supabase.from('students').select('*').or('status.eq.Active,status.eq.Pending Group');
    if (data) setStudentsData(data.map(s => ({ ...s, firstName: s.first_name || '', lastName: s.last_name || '', language: s.language || '', level: s.level || '', group: s.group_name || '', status: s.status || '', phone: s.phone || '', email: s.email || '', address: s.address || '', parentName: s.parent_name || '', parentContact: s.parent_contact || '', enrollmentDate: s.enrollment_date || '', test_score: s.test_score || '' })));
  };
  const fetchClasses = async () => { const { data } = await supabase.from('classes').select('*'); if (data) setClassesData(data); };
  useEffect(() => { fetchActiveStudents(); fetchClasses(); }, []);

  const filteredStudents = studentsData.filter(s => {
    const matchLang   = filterLang === 'All' || s.language === filterLang;
    const matchLevel  = filterLevel === 'All' || s.level === filterLevel;
    const matchSearch = s.firstName.toLowerCase().includes(searchQuery.toLowerCase()) || s.lastName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchLang && matchLevel && matchSearch;
  });

  // ALL ORIGINAL HANDLERS — UNTOUCHED
  const handleProcessResult = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const score = parseFloat(selectedStudent.test_score);
      await supabase.from('enrollment_history').insert([{ student_id: selectedStudent.id, student_name: `${selectedStudent.firstName} ${selectedStudent.lastName}`, level_completed: selectedStudent.level, group_name: selectedStudent.group, grade: isNaN(score) ? null : score }]);
      const isArchiving = processData.newLevel === 'Archived';
      const { error: updateError } = await supabase.from('students').update({ level: isArchiving ? selectedStudent.level : processData.newLevel, group_name: null, status: isArchiving ? 'Archived' : 'Pending Group', test_score: selectedStudent.test_score }).eq('id', selectedStudent.id);
      if (updateError) throw updateError;
      alert(isArchiving ? `${selectedStudent.firstName} has been archived.` : `${selectedStudent.firstName} moved to level ${processData.newLevel} — awaiting group assignment.`);
      setIsProcessModalOpen(false); fetchActiveStudents();
    } catch (err) { alert("Error: " + err.message); } finally { setLoading(false); }
  };

  const handleAssignGroup = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      if (!assignGroupData.classId) throw new Error("Please select a group.");
      const selectedClass = classesData.find(c => c.id === assignGroupData.classId);
      const currentCount = selectedClass.enrolled_count || 0;
      if (currentCount >= selectedClass.capacity) throw new Error("This group is full.");
      await supabase.from('classes').update({ enrolled_count: currentCount + 1 }).eq('id', assignGroupData.classId);
      await supabase.from('students').update({ group_name: selectedClass.name, status: 'Active' }).eq('id', selectedStudent.id);
      alert(`${selectedStudent.firstName} assigned to ${selectedClass.name}.`);
      setIsAssignGroupModalOpen(false); fetchActiveStudents();
    } catch (err) { alert(err.message); } finally { setLoading(false); }
  };

  const handleDeleteStudent = async (id, name) => {
    if (window.confirm(`Permanently delete ${name}? This cannot be undone.`)) {
      try {
        const { error } = await supabase.from('students').delete().eq('id', id);
        if (error) throw error;
        alert(`${name} deleted successfully.`); fetchActiveStudents();
      } catch (err) { alert("Error: " + err.message); }
    }
  };

  const openEditModal = (student) => { setEditFormData({ id: student.id, firstName: student.firstName, lastName: student.lastName, email: student.email, phone: student.phone, level: student.level }); setIsEditModalOpen(true); };

  const handleSaveEdit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const { error } = await supabase.from('students').update({ first_name: editFormData.firstName, last_name: editFormData.lastName, email: editFormData.email, phone: editFormData.phone, level: editFormData.level }).eq('id', editFormData.id);
      if (error) throw error;
      alert('Student updated successfully.'); setIsEditModalOpen(false); fetchActiveStudents();
    } catch (err) { alert("Error: " + err.message); } finally { setLoading(false); }
  };

  if (currentView === 'profile' && selectedStudent) {
    return (
      <div style={{ flex: 1, overflowY: 'auto', padding: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button onClick={() => setCurrentView('list')} style={{ width: 36, height: 36, borderRadius: '50%', background: C.white, border: `1px solid ${C.borderMid}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: C.textMid, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}><Ic.ArrowLeft /></button>
            <div>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: C.textDark }}>Student Profile</h2>
              <p style={{ margin: '3px 0 0', fontSize: 12, color: C.textMuted }}>Full academic record</p>
            </div>
          </div>
          <OutlineBtn onClick={() => window.print()}><Ic.Print /> Print Record</OutlineBtn>
        </div>
        <SectionCard>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: C.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800, color: C.primary, flexShrink: 0 }}>
              {selectedStudent.firstName[0]}{selectedStudent.lastName[0]}
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: '0 0 4px', fontSize: 17, fontWeight: 800, color: C.textDark }}>{selectedStudent.firstName} {selectedStudent.lastName}</h3>
              <p style={{ margin: 0, fontSize: 12, color: C.textMuted }}>ID: {selectedStudent.id} · Enrolled: {selectedStudent.enrollmentDate}</p>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: C.blue, background: C.blueBg, padding: '2px 9px', borderRadius: 20 }}>{selectedStudent.language}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: C.purple, background: C.purpleBg, padding: '2px 9px', borderRadius: 20 }}>Level {selectedStudent.level}</span>
                <StatusBadge status={selectedStudent.status} />
              </div>
            </div>
          </div>
        </SectionCard>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 28, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexShrink: 0 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: C.textDark }}>Student Records</h2>
          <p style={{ margin: '4px 0 0', fontSize: 12, color: C.textMuted }}>{filteredStudents.length} active students</p>
        </div>
      </div>

      <FilterBar>
        <SearchBar value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search by name…" width={260} />
        <FilterSelect value={filterLang} onChange={e => setFilterLang(e.target.value)}>
          <option value="All">All Languages</option>
          <option value="English">English</option><option value="Français">Français</option>
          <option value="Deutsch">Deutsch</option><option value="Español">Español</option>
        </FilterSelect>
        <FilterSelect value={filterLevel} onChange={e => setFilterLevel(e.target.value)}>
          <option value="All">All Levels</option>
          {['A1','A2','B1','B2','C1','C2'].map(l => <option key={l}>{l}</option>)}
        </FilterSelect>
        {(filterLang !== 'All' || filterLevel !== 'All' || searchQuery !== '') && (
          <button onClick={() => { setFilterLang('All'); setFilterLevel('All'); setSearchQuery(''); }}
            style={{ fontSize: 11, fontWeight: 700, color: C.danger, background: C.dangerBg, border: '1px solid #fca5a5', borderRadius: 8, padding: '5px 12px', cursor: 'pointer', fontFamily: "'Inter','Segoe UI',sans-serif" }}>
            Clear Filters
          </button>
        )}
      </FilterBar>

      <TableCard>
        <thead><tr><Th>Student ID</Th><Th>Name</Th><Th>Language</Th><Th>Level / Group</Th><Th center>Actions</Th></tr></thead>
        <tbody>
          {filteredStudents.length > 0 ? filteredStudents.map(student => (
            <tr key={student.id} onMouseEnter={e => e.currentTarget.style.background = C.pageBg} onMouseLeave={e => e.currentTarget.style.background = 'transparent'} style={{ transition: 'background 0.12s' }}>
              <Td><span style={{ fontSize: 12, fontWeight: 700, color: C.textMuted }}>#{student.id}</span></Td>
              <Td>
                <p style={{ margin: 0, fontWeight: 700, color: C.textDark }}>{student.firstName} {student.lastName}</p>
                {student.status === 'Pending Group' && <span style={{ fontSize: 10.5, fontWeight: 700, color: C.orange }}>Needs Group Assignment</span>}
              </Td>
              <Td><span style={{ fontSize: 13, fontWeight: 600, color: C.textDark }}>{student.language}</span></Td>
              <Td>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.textDark }}>{student.level}</span>
                <span style={{ fontSize: 12, color: C.textMuted }}> · {student.group || '—'}</span>
              </Td>
              <Td center>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <OutlineBtn onClick={() => { setSelectedStudent(student); setCurrentView('profile'); }} style={{ padding: '5px 12px', fontSize: 12 }}>Open Record</OutlineBtn>
                  {student.status === 'Pending Group' ? (
                    <button onClick={() => { setSelectedStudent(student); setAssignGroupData({ classId: '' }); setIsAssignGroupModalOpen(true); }}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 8, border: `1px solid #bfdbfe`, background: C.blueBg, color: C.blue, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: "'Inter','Segoe UI',sans-serif" }}>
                      <Ic.Group /> Assign Group
                    </button>
                  ) : (
                    <button onClick={() => { setSelectedStudent(student); setProcessData({ newLevel: student.level }); setIsProcessModalOpen(true); }}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 8, border: `1px solid #fed7aa`, background: C.orangeBg, color: C.orange, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: "'Inter','Segoe UI',sans-serif" }}>
                      <Ic.Process /> Process Result
                    </button>
                  )}
                  <ActionBtn icon={Ic.Edit}  onClick={() => openEditModal(student)}                        title="Edit Student" />
                  <ActionBtn icon={Ic.Trash} onClick={() => handleDeleteStudent(student.id, student.firstName)} title="Delete Student" danger />
                </div>
              </Td>
            </tr>
          )) : (
            <tr><td colSpan="5" style={{ padding: '52px 0', textAlign: 'center', color: C.textMuted, fontSize: 13, fontWeight: 600 }}>No students found matching your criteria.</td></tr>
          )}
        </tbody>
      </TableCard>

      {isProcessModalOpen && (
        <Modal title="Process Result" subtitle={`Student: ${selectedStudent?.firstName} ${selectedStudent?.lastName}`} onClose={() => setIsProcessModalOpen(false)} width={400}>
          <div style={{ background: C.pageBg, borderRadius: 12, border: `1px solid ${C.border}`, padding: '16px', textAlign: 'center', marginBottom: 18 }}>
            <FieldLabel>Teacher's Final Grade</FieldLabel>
            <p style={{ margin: 0, fontSize: 26, fontWeight: 800, color: parseFloat(selectedStudent?.test_score) >= 10 ? C.success : selectedStudent?.test_score ? C.danger : C.warning }}>
              {selectedStudent?.test_score ? `${selectedStudent?.test_score} / 20` : 'Awaiting Teacher…'}
            </p>
          </div>
          <form onSubmit={handleProcessResult} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <FormField label="Decision / Set Next Level">
              <select value={processData.newLevel} onChange={e => setProcessData({ ...processData, newLevel: e.target.value })} style={selectStyle} onFocus={onFocus} onBlur={onBlur}>
                <option value="A1">Keep in A1 (Retake)</option>
                <option value="A2">Promote to A2</option><option value="B1">Promote to B1</option>
                <option value="B2">Promote to B2</option><option value="C1">Promote to C1</option>
                <option value="C2">Promote to C2</option>
                <option value="Archived">Leave School (Archive)</option>
              </select>
            </FormField>
            <PrimaryBtn type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', background: C.success, boxShadow: '0 3px 12px rgba(5,150,105,0.24)', marginTop: 4 }}>
              <Ic.Check /> {loading ? 'Processing…' : 'Confirm Decision'}
            </PrimaryBtn>
          </form>
        </Modal>
      )}

      {isAssignGroupModalOpen && (
        <Modal title="Assign to Class" subtitle={`Assign a group to ${selectedStudent?.firstName}`} onClose={() => setIsAssignGroupModalOpen(false)} width={400}>
          <form onSubmit={handleAssignGroup} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <FormField label={`Available Groups — Level ${selectedStudent?.level}`}>
              <select value={assignGroupData.classId} onChange={e => setAssignGroupData({ classId: e.target.value })} style={selectStyle} onFocus={onFocus} onBlur={onBlur}>
                <option value="">— Choose Group —</option>
                {classesData.filter(c => c.language === selectedStudent?.language && c.level === selectedStudent?.level).map(c => { const full = (c.enrolled_count||0) >= (c.capacity||20); return <option key={c.id} value={c.id} disabled={full}>{c.name}{full ? ' (FULL)' : ''}</option>; })}
              </select>
            </FormField>
            <PrimaryBtn type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}>
              <Ic.Check /> {loading ? 'Saving…' : 'Assign Group'}
            </PrimaryBtn>
          </form>
        </Modal>
      )}

      {isEditModalOpen && (
        <Modal title="Edit Student Details" onClose={() => setIsEditModalOpen(false)}>
          <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <FormField label="First Name"><input type="text" value={editFormData.firstName} onChange={e => setEditFormData({ ...editFormData, firstName: e.target.value })} style={inputBase} onFocus={onFocus} onBlur={onBlur} required /></FormField>
              <FormField label="Last Name"><input type="text" value={editFormData.lastName} onChange={e => setEditFormData({ ...editFormData, lastName: e.target.value })} style={inputBase} onFocus={onFocus} onBlur={onBlur} required /></FormField>
            </div>
            <FormField label="Email"><input type="email" value={editFormData.email} onChange={e => setEditFormData({ ...editFormData, email: e.target.value })} style={inputBase} onFocus={onFocus} onBlur={onBlur} required /></FormField>
            <FormField label="Phone"><input type="tel" value={editFormData.phone} onChange={e => setEditFormData({ ...editFormData, phone: e.target.value })} style={inputBase} onFocus={onFocus} onBlur={onBlur} required /></FormField>
            <FormField label="Level">
              <select value={editFormData.level} onChange={e => setEditFormData({ ...editFormData, level: e.target.value })} style={selectStyle} onFocus={onFocus} onBlur={onBlur}>
                {['A1','A2','B1','B2','C1','C2'].map(l => <option key={l}>{l}</option>)}
              </select>
            </FormField>
            <PrimaryBtn type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}>
              <Ic.Check /> {loading ? 'Saving…' : 'Save Changes'}
            </PrimaryBtn>
          </form>
        </Modal>
      )}
    </div>
  );
};

// ─── TAB 3: Archived Students ─────────────────────────────────────────────────
const StudentArchiveTab = () => {
  const [archivedStudents, setArchivedStudents] = useState([]);
  const [searchQuery,      setSearchQuery]      = useState('');
  const [selectedStudent,  setSelectedStudent]  = useState(null);
  const [studentHistory,   setStudentHistory]   = useState([]);
  const [currentView,      setCurrentView]      = useState('list');
  const [loading,          setLoading]          = useState(false);

  const fetchArchived = async () => {
    const { data } = await supabase.from('students').select('*').eq('status', 'Archived');
    if (data) setArchivedStudents(data.map(s => ({ ...s, name: `${s.first_name || ''} ${s.last_name || ''}`.trim() })));
  };
  useEffect(() => { fetchArchived(); }, []);

  const handleViewProfile = async (student) => {
    setSelectedStudent(student);
    const { data } = await supabase.from('enrollment_history').select('*').eq('student_id', student.id).order('completion_date', { ascending: false });
    if (data) setStudentHistory(data);
    setCurrentView('profile');
  };

  // ORIGINAL HANDLER — UNTOUCHED
  const handleRestore = async (student) => {
    if (window.confirm(`Restore ${student.name} to Active Records?`)) {
      setLoading(true);
      try {
        await supabase.from('students').update({ status: 'Pending Group' }).eq('id', student.id);
        alert(`${student.name} restored. They are now in Active Records awaiting a group.`);
        setCurrentView('list'); fetchArchived();
      } catch (err) { alert(err.message); } finally { setLoading(false); }
    }
  };

  const filteredArchived = archivedStudents.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || String(s.id).includes(searchQuery));

  if (currentView === 'profile' && selectedStudent) {
    return (
      <div style={{ flex: 1, overflowY: 'auto', padding: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button onClick={() => setCurrentView('list')} style={{ width: 36, height: 36, borderRadius: '50%', background: C.white, border: `1px solid ${C.borderMid}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: C.textMid, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}><Ic.ArrowLeft /></button>
            <div>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: C.textDark }}>Archived Record</h2>
              <p style={{ margin: '3px 0 0', fontSize: 12, color: C.textMuted }}>Past student academic history</p>
            </div>
          </div>
          <PrimaryBtn onClick={() => handleRestore(selectedStudent)} disabled={loading} style={{ background: C.blue, boxShadow: '0 3px 12px rgba(37,99,235,0.24)' }}>
            <Ic.Restore /> Restore Student
          </PrimaryBtn>
        </div>

        <SectionCard>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: C.border, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800, color: C.textMid, flexShrink: 0 }}>
              {selectedStudent.first_name?.[0]}{selectedStudent.last_name?.[0]}
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: '0 0 4px', fontSize: 17, fontWeight: 800, color: C.textDark }}>{selectedStudent.name}</h3>
              <p style={{ margin: 0, fontSize: 12, color: C.textMuted }}>ID: {selectedStudent.id} · Language: {selectedStudent.language} · Enrolled: {selectedStudent.enrollment_date}</p>
            </div>
            <StatusBadge status="Archived" />
          </div>
        </SectionCard>

        <SectionCard title="Academic History">
          {studentHistory.length > 0 ? (
            <TableCard>
              <thead><tr><Th>Date Completed</Th><Th>Level</Th><Th>Group</Th><Th>Final Grade</Th></tr></thead>
              <tbody>
                {studentHistory.map(hist => (
                  <tr key={hist.id} onMouseEnter={e => e.currentTarget.style.background = C.pageBg} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <Td><span style={{ color: C.textMid }}>{hist.completion_date ? new Date(hist.completion_date).toLocaleDateString() : 'N/A'}</span></Td>
                    <Td><span style={{ fontWeight: 700, color: C.textDark }}>{hist.level_completed}</span></Td>
                    <Td><span style={{ color: C.textMid }}>{hist.group_name || 'N/A'}</span></Td>
                    <Td><span style={{ fontWeight: 800, fontSize: 14, color: hist.grade >= 10 ? C.success : C.danger }}>{hist.grade ? `${hist.grade} / 20` : '—'}</span></Td>
                  </tr>
                ))}
              </tbody>
            </TableCard>
          ) : (
            <div style={{ textAlign: 'center', padding: '36px 0', color: C.textMuted, fontSize: 13, fontWeight: 600, background: C.pageBg, borderRadius: 10, border: `1px dashed ${C.borderMid}` }}>
              No historical records found for this student.
            </div>
          )}
        </SectionCard>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 28, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ flexShrink: 0 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: C.textDark }}>Archived Students</h2>
        <p style={{ margin: '4px 0 0', fontSize: 12, color: C.textMuted }}>View past students and their academic history</p>
      </div>
      <FilterBar>
        <SearchBar value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search archive by name or ID…" width={300} />
      </FilterBar>
      <TableCard>
        <thead><tr><Th>Student ID</Th><Th>Name</Th><Th>Language</Th><Th>Last Level</Th><Th center>Actions</Th></tr></thead>
        <tbody>
          {filteredArchived.length > 0 ? filteredArchived.map(student => (
            <tr key={student.id} onMouseEnter={e => e.currentTarget.style.background = C.pageBg} onMouseLeave={e => e.currentTarget.style.background = 'transparent'} style={{ transition: 'background 0.12s' }}>
              <Td><span style={{ fontSize: 12, fontWeight: 700, color: C.textMuted }}>#{student.id}</span></Td>
              <Td><span style={{ fontWeight: 700, color: C.textDark }}>{student.name}</span></Td>
              <Td><span style={{ color: C.textMid }}>{student.language || 'N/A'}</span></Td>
              <Td><span style={{ color: C.textMid }}>{student.level || 'N/A'}</span></Td>
              <Td center>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
                  <OutlineBtn onClick={() => handleViewProfile(student)} style={{ padding: '5px 12px', fontSize: 12 }}>View History</OutlineBtn>
                  <button onClick={() => handleRestore(student)} disabled={loading}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 8, border: `1px solid #bfdbfe`, background: C.blueBg, color: C.blue, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: "'Inter','Segoe UI',sans-serif" }}>
                    <Ic.Restore /> Restore
                  </button>
                </div>
              </Td>
            </tr>
          )) : (
            <tr><td colSpan="5" style={{ padding: '52px 0', textAlign: 'center', color: C.textMuted, fontSize: 13, fontWeight: 600 }}>Archive is empty.</td></tr>
          )}
        </tbody>
      </TableCard>
    </div>
  );
};

// ─── TAB 4: Manual Registration ───────────────────────────────────────────────
const StudentRegistrationTab = () => {
  const [loading,     setLoading]     = useState(false);
  const [regMode,     setRegMode]     = useState('Single');
  const [classesData, setClassesData] = useState([]);
  const [singleData,  setSingleData]  = useState({ firstName: '', lastName: '', language: 'English', level: 'A1', classId: '', phone: '', email: '', parentEmail: '', exam_type: 'Course' });
  const [parentData,  setParentData]  = useState({ firstName: '', lastName: '', email: '', phone: '' });
  const [kidsList,    setKidsList]    = useState([{ firstName: '', lastName: '', language: 'English', level: 'A1', classId: '', phone: '', email: '', exam_type: 'Course' }]);

  useEffect(() => { const f = async () => { const { data } = await supabase.from('classes').select('*'); if (data) setClassesData(data); }; f(); }, []);

  const addKid    = () => setKidsList([...kidsList, { firstName: '', lastName: '', language: 'English', level: 'A1', classId: '', phone: '', email: '', exam_type: 'Course' }]);
  const removeKid = (index) => setKidsList(kidsList.filter((_, i) => i !== index));
  const handleKidChange = (index, field, value) => { const n = [...kidsList]; n[index][field] = value; setKidsList(n); };

  // ALL ORIGINAL HANDLERS — UNTOUCHED
  const handleSave = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      if (regMode === 'Single') {
        const isPlacement = singleData.exam_type === 'Placement';
        let selectedClassName = null;
        if (!isPlacement) {
          if (!singleData.classId) return alert("Please select a group.");
          const selectedClass = classesData.find(c => c.id === singleData.classId);
          selectedClassName = selectedClass.name;
          const currentCount = selectedClass.enrolled_count || 0;
          if (currentCount >= selectedClass.capacity) return alert("This group is full.");
          await supabase.from('classes').update({ enrolled_count: currentCount + 1 }).eq('id', singleData.classId);
        }
        const { error: authError } = await supabase.auth.signUp({ email: singleData.email, password: singleData.phone });
        if (authError && authError.message !== "User already registered") throw authError;
        if (singleData.parentEmail) { const { error: pErr } = await supabase.auth.signUp({ email: singleData.parentEmail, password: singleData.phone }); if (pErr && pErr.message !== "User already registered") console.error(pErr); }
        const { error: dbError } = await supabase.from('students').insert([{ first_name: singleData.firstName, last_name: singleData.lastName, email: singleData.email, phone: singleData.phone, parent_email: singleData.parentEmail || null, language: singleData.language, level: singleData.level, group_name: selectedClassName, exam_type: singleData.exam_type, status: isPlacement ? 'Pending' : 'Active', enrollment_date: new Date().toISOString().split('T')[0] }]);
        if (dbError) throw dbError;
        alert(isPlacement ? "Placement test request submitted." : "Student registered successfully.");
        setSingleData({ firstName: '', lastName: '', language: 'English', level: 'A1', classId: '', phone: '', email: '', parentEmail: '', exam_type: 'Course' });
      } else {
        if (!parentData.email) return alert("Parent email is required.");
        if (kidsList.length === 0) return alert("Please add at least one child.");
        const { error: pErr } = await supabase.auth.signUp({ email: parentData.email, password: parentData.phone });
        if (pErr && pErr.message !== "User already registered") console.error(pErr);
        for (let i = 0; i < kidsList.length; i++) {
          const kid = kidsList[i];
          const isPlacement = kid.exam_type === 'Placement';
          let selectedClassName = null;
          if (!isPlacement) {
            if (!kid.classId) return alert(`Please select a group for child ${i + 1}.`);
            const selectedClass = classesData.find(c => c.id === kid.classId);
            selectedClassName = selectedClass.name;
            const currentCount = selectedClass.enrolled_count || 0;
            if (currentCount >= selectedClass.capacity) return alert(`Group for ${kid.firstName} is full.`);
            await supabase.from('classes').update({ enrolled_count: currentCount + 1 }).eq('id', kid.classId);
          }
          const { error: authErr } = await supabase.auth.signUp({ email: kid.email, password: kid.phone });
          if (authErr && authErr.message !== "User already registered") throw authErr;
          const { error: dbErr } = await supabase.from('students').insert([{ first_name: kid.firstName, last_name: kid.lastName, email: kid.email, phone: kid.phone, parent_email: parentData.email, parent_name: `${parentData.firstName} ${parentData.lastName}`, parent_contact: parentData.phone, language: kid.language, level: kid.level, group_name: selectedClassName, exam_type: kid.exam_type, status: isPlacement ? 'Pending' : 'Active', enrollment_date: new Date().toISOString().split('T')[0] }]);
          if (dbErr) throw dbErr;
        }
        alert(`Family registered successfully (${kidsList.length} children).`);
        setParentData({ firstName: '', lastName: '', email: '', phone: '' });
        setKidsList([{ firstName: '', lastName: '', language: 'English', level: 'A1', classId: '', phone: '', email: '', exam_type: 'Course' }]);
      }
    } catch (err) { alert("Error: " + err.message); } finally { setLoading(false); }
  };

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: C.textDark }}>Manual Registration</h2>
          <p style={{ margin: '4px 0 0', fontSize: 12, color: C.textMuted }}>Register a single student or an entire family</p>
        </div>
        <div style={{ display: 'flex', background: C.pageBg, borderRadius: 9, padding: 3, border: `1px solid ${C.border}`, gap: 2 }}>
          {['Single','Family'].map(m => (
            <button key={m} onClick={() => setRegMode(m)}
              style={{ padding: '7px 20px', borderRadius: 7, border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s', background: regMode === m ? C.white : 'transparent', color: regMode === m ? C.primary : C.textMuted, boxShadow: regMode === m ? '0 1px 4px rgba(0,0,0,0.08)' : 'none', fontFamily: "'Inter','Segoe UI',sans-serif" }}
            >{m === 'Single' ? 'Single Student' : 'Family (Parent & Kids)'}</button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSave}>
        {regMode === 'Single' ? (
          <>
            <SectionCard title="Academic Details">
              <div style={{ display: 'grid', gridTemplateColumns: singleData.exam_type === 'Course' ? 'repeat(4,1fr)' : 'repeat(2,1fr)', gap: 14 }}>
                <FormField label="Registration Type">
                  <select value={singleData.exam_type} onChange={e => setSingleData({ ...singleData, exam_type: e.target.value })} style={selectStyle} onFocus={onFocus} onBlur={onBlur}>
                    <option value="Course">Direct Course</option><option value="Placement">Placement Test</option>
                  </select>
                </FormField>
                <FormField label="Language">
                  <select value={singleData.language} onChange={e => setSingleData({ ...singleData, language: e.target.value })} style={selectStyle} onFocus={onFocus} onBlur={onBlur}>
                    <option>English</option><option>Français</option><option>Deutsch</option><option>Español</option>
                  </select>
                </FormField>
                {singleData.exam_type === 'Course' && (
                  <>
                    <FormField label="Level">
                      <select value={singleData.level} onChange={e => setSingleData({ ...singleData, level: e.target.value })} style={selectStyle} onFocus={onFocus} onBlur={onBlur}>
                        {['A1','A2','B1','B2','C1','C2'].map(l => <option key={l}>{l}</option>)}
                      </select>
                    </FormField>
                    <FormField label="Available Groups">
                      <select value={singleData.classId} onChange={e => setSingleData({ ...singleData, classId: e.target.value })} style={{ ...selectStyle, borderColor: '#bfdbfe', color: C.blue, background: C.blueBg }} onFocus={onFocus} onBlur={onBlur}>
                        <option value="">— Select Group —</option>
                        {classesData.filter(c => c.language === singleData.language && c.level.includes(singleData.level)).map(c => { const full = (c.enrolled_count||0) >= (c.capacity||20); return <option key={c.id} value={c.id} disabled={full}>{c.name}{full?' — FULL':''}</option>; })}
                      </select>
                    </FormField>
                  </>
                )}
              </div>
            </SectionCard>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <SectionCard title="Personal Info">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <input type="text"  value={singleData.firstName}   onChange={e => setSingleData({ ...singleData, firstName: e.target.value })}   placeholder="First Name"  style={inputBase} onFocus={onFocus} onBlur={onBlur} required />
                  <input type="text"  value={singleData.lastName}    onChange={e => setSingleData({ ...singleData, lastName: e.target.value })}    placeholder="Last Name"   style={inputBase} onFocus={onFocus} onBlur={onBlur} required />
                </div>
              </SectionCard>
              <SectionCard title="Contact & Login">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <input type="email" value={singleData.email}       onChange={e => setSingleData({ ...singleData, email: e.target.value })}       placeholder="Student Email"                    style={inputBase} onFocus={onFocus} onBlur={onBlur} required />
                  <input type="tel"   value={singleData.phone}       onChange={e => setSingleData({ ...singleData, phone: e.target.value })}       placeholder="Phone (Becomes Password)"         style={inputBase} onFocus={onFocus} onBlur={onBlur} required />
                  <input type="email" value={singleData.parentEmail} onChange={e => setSingleData({ ...singleData, parentEmail: e.target.value })} placeholder="Parent Email (Optional)"          style={{ ...inputBase, borderColor: '#bfdbfe', background: C.blueBg }} onFocus={onFocus} onBlur={onBlur} />
                </div>
              </SectionCard>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Parent Card */}
            <div style={{ background: C.navy, borderRadius: 14, padding: '20px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <h3 style={{ margin: '0 0 16px', fontSize: 13.5, fontWeight: 800, color: '#e2e8f0', paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>Parent / Guardian Details</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
                {[{ ph: 'First Name', k: 'firstName' }, { ph: 'Last Name', k: 'lastName' }, { ph: 'Parent Email (Login)', k: 'email', type: 'email' }, { ph: 'Phone (Password)', k: 'phone', type: 'tel' }].map(f => (
                  <input key={f.k} type={f.type || 'text'} value={parentData[f.k]} onChange={e => setParentData({ ...parentData, [f.k]: e.target.value })} placeholder={f.ph}
                    style={{ ...inputBase, background: 'rgba(255,255,255,0.07)', borderColor: 'rgba(255,255,255,0.12)', color: '#e2e8f0' }}
                    onFocus={e => { e.target.style.borderColor = C.primaryMid; e.target.style.background = 'rgba(255,255,255,0.12)'; }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.12)'; e.target.style.background = 'rgba(255,255,255,0.07)'; }}
                    required
                  />
                ))}
              </div>
            </div>

            {/* Kids */}
            {kidsList.map((kid, index) => (
              <div key={index} style={{ background: C.white, borderRadius: 14, padding: '20px', border: `1.5px solid ${C.borderMid}`, position: 'relative', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <div style={{ position: 'absolute', top: -12, left: 16, width: 28, height: 28, borderRadius: '50%', background: C.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#fff' }}>{index + 1}</div>
                {kidsList.length > 1 && (
                  <button type="button" onClick={() => removeKid(index)} style={{ position: 'absolute', top: 14, right: 16, background: C.dangerBg, border: '1px solid #fca5a5', borderRadius: 7, color: C.danger, fontSize: 11, fontWeight: 700, cursor: 'pointer', padding: '3px 10px', fontFamily: "'Inter','Segoe UI',sans-serif", display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Ic.X /> Remove
                  </button>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 12, marginTop: 8 }}>
                  <input type="text"  value={kid.firstName} onChange={e => handleKidChange(index, 'firstName', e.target.value)} placeholder="First Name"  style={inputBase} onFocus={onFocus} onBlur={onBlur} required />
                  <input type="text"  value={kid.lastName}  onChange={e => handleKidChange(index, 'lastName', e.target.value)}  placeholder="Last Name"   style={inputBase} onFocus={onFocus} onBlur={onBlur} required />
                  <input type="email" value={kid.email}     onChange={e => handleKidChange(index, 'email', e.target.value)}     placeholder="Email"       style={inputBase} onFocus={onFocus} onBlur={onBlur} required />
                  <input type="tel"   value={kid.phone}     onChange={e => handleKidChange(index, 'phone', e.target.value)}     placeholder="Phone"       style={inputBase} onFocus={onFocus} onBlur={onBlur} required />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: kid.exam_type === 'Course' ? 'repeat(4,1fr)' : '1fr 1fr', gap: 10, padding: '12px', background: C.blueBg, borderRadius: 10, border: `1px solid #bfdbfe` }}>
                  <select value={kid.exam_type} onChange={e => handleKidChange(index, 'exam_type', e.target.value)} style={{ ...selectStyle, fontSize: 12 }} onFocus={onFocus} onBlur={onBlur}>
                    <option value="Course">Direct Course</option><option value="Placement">Placement Test</option>
                  </select>
                  <select value={kid.language} onChange={e => handleKidChange(index, 'language', e.target.value)} style={{ ...selectStyle, fontSize: 12 }} onFocus={onFocus} onBlur={onBlur}>
                    <option>English</option><option>Français</option><option>Deutsch</option><option>Español</option>
                  </select>
                  {kid.exam_type === 'Course' && (
                    <>
                      <select value={kid.level} onChange={e => handleKidChange(index, 'level', e.target.value)} style={{ ...selectStyle, fontSize: 12 }} onFocus={onFocus} onBlur={onBlur}>
                        {['A1','A2','B1','B2','C1','C2'].map(l => <option key={l}>{l}</option>)}
                      </select>
                      <select value={kid.classId} onChange={e => handleKidChange(index, 'classId', e.target.value)} style={{ ...selectStyle, fontSize: 12 }} onFocus={onFocus} onBlur={onBlur}>
                        <option value="">— Assign Group —</option>
                        {classesData.filter(c => c.language === kid.language && c.level.includes(kid.level)).map(c => { const full = (c.enrolled_count||0) >= (c.capacity||20); return <option key={c.id} value={c.id} disabled={full}>{c.name}{full?' — FULL':''}</option>; })}
                      </select>
                    </>
                  )}
                </div>
              </div>
            ))}

            <button type="button" onClick={addKid}
              style={{ width: '100%', padding: '14px', borderRadius: 12, border: `2px dashed ${C.primary}`, background: C.primaryLight, color: C.primary, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: "'Inter','Segoe UI',sans-serif", transition: 'all 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#e0e7ff'}
              onMouseLeave={e => e.currentTarget.style.background = C.primaryLight}
            >
              + Add Another Child to this Family
            </button>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 20, marginTop: 8, borderTop: `1px solid ${C.border}` }}>
          <PrimaryBtn type="submit" disabled={loading} style={{ padding: '11px 28px', fontSize: 13.5 }}>
            <Ic.Check /> {loading ? 'Processing…' : regMode === 'Single' ? 'Save & Register Student' : `Register Family (${kidsList.length} Kids)`}
          </PrimaryBtn>
        </div>
      </form>
    </div>
  );
};

// ─── TAB 5: Add Staff ─────────────────────────────────────────────────────────
const StaffRegistrationTab = () => {
  const [loading,  setLoading]  = useState(false);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '', department: 'English', role: 'Teacher' });

  const handleInputChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };

  // ORIGINAL HANDLER — UNTOUCHED
  const handleSave = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({ email: formData.email, password: formData.phone });
      if (authError && authError.message !== "User already registered") throw authError;
      const uid = authData.user?.id;
      const { error: dbError } = await supabase.from('staff').insert([{ auth_id: uid, first_name: formData.firstName, last_name: formData.lastName, email: formData.email, phone: formData.phone, department: formData.department, role: formData.role }]);
      if (dbError) throw dbError;
      alert(`${formData.firstName} added successfully. They can log in using their email and phone number.`);
      setFormData({ firstName: '', lastName: '', email: '', phone: '', department: 'English', role: 'Teacher' });
    } catch (err) { alert("Error: " + err.message); } finally { setLoading(false); }
  };

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 28 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: C.textDark }}>Add New Staff Member</h2>
        <p style={{ margin: '4px 0 0', fontSize: 12, color: C.textMuted }}>Create a staff account and set their system role</p>
      </div>
      <form onSubmit={handleSave}>
        <SectionCard title="Professional Details">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <FormField label="Department">
              <select name="department" value={formData.department} onChange={handleInputChange} style={selectStyle} onFocus={onFocus} onBlur={onBlur}>
                <option>English</option><option>Français</option><option>Deutsch</option><option>Español</option><option>Administration</option><option>Maintenance</option>
              </select>
            </FormField>
            <FormField label="System Role">
              <select name="role" value={formData.role} onChange={handleInputChange} style={selectStyle} onFocus={onFocus} onBlur={onBlur}>
                <option value="Teacher">Teacher</option>
                <option value="Secretary">Secretary</option>
                <option value="Clean Lady">Clean Lady</option>
              </select>
            </FormField>
          </div>
        </SectionCard>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <SectionCard title="Personal Info">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="First Name" style={inputBase} onFocus={onFocus} onBlur={onBlur} required />
              <input type="text" name="lastName"  value={formData.lastName}  onChange={handleInputChange} placeholder="Last Name"  style={inputBase} onFocus={onFocus} onBlur={onBlur} required />
            </div>
          </SectionCard>
          <SectionCard title="Login Credentials">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Work Email"                 style={inputBase}               onFocus={onFocus} onBlur={onBlur} required />
              <input type="tel"   name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone Number (Becomes Password)" style={{ ...inputBase, borderColor: '#bfdbfe', background: C.blueBg }} onFocus={onFocus} onBlur={onBlur} required />
            </div>
          </SectionCard>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 20, marginTop: 8, borderTop: `1px solid ${C.border}` }}>
          <PrimaryBtn type="submit" disabled={loading} style={{ padding: '11px 28px' }}>
            <Ic.Check /> {loading ? 'Processing…' : 'Create Staff Account'}
          </PrimaryBtn>
        </div>
      </form>
    </div>
  );
};

// ─── Master Hub ───────────────────────────────────────────────────────────────
const StudentsManagement = () => {
  const [activeTab, setActiveTab] = useState('requests');

  const tabs = [
    { key: 'requests', label: 'Requests Pipeline', Icon: Ic.Requests },
    { key: 'records',  label: 'Active Records',    Icon: Ic.Records  },
    { key: 'archive',  label: 'Archive',           Icon: Ic.Archive  },
    { key: 'add',      label: 'Manual Registration', Icon: Ic.AddUser },
    { key: 'addStaff', label: 'Add Staff',         Icon: Ic.AddStaff },
  ];

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        input::placeholder, textarea::placeholder { color: #94a3b8; }
        select option { color: #1e293b; background: #fff; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: C.pageBg, fontFamily: "'Inter','Segoe UI',sans-serif" }}>

        {/* ── Page header ── */}
        <div style={{ padding: '24px 28px 0', flexShrink: 0 }}>
          <h1 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 800, color: C.textDark }}>Students Management</h1>
          <p style={{ margin: '0 0 20px', fontSize: 13, color: C.textMuted }}>Registration pipeline, records, archive and staff management</p>

          {/* Tab bar */}
          <div style={{ display: 'flex', borderBottom: `1px solid ${C.border}` }}>
            {tabs.map((tab, i) => {
              const isActive = activeTab === tab.key;
              const isStaff  = tab.key === 'addStaff';
              return (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 7,
                    padding: '10px 18px', border: 'none',
                    borderBottom: isActive ? `2px solid ${isStaff ? C.blue : C.primary}` : '2px solid transparent',
                    marginBottom: -1,
                    fontSize: 12.5, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s',
                    background: 'transparent',
                    color: isActive ? (isStaff ? C.blue : C.primary) : C.textMuted,
                    marginLeft: isStaff && i > 0 ? 'auto' : 0,
                    fontFamily: "'Inter','Segoe UI',sans-serif",
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = C.textDark; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = C.textMuted; }}
                >
                  <span style={{ color: isActive ? (isStaff ? C.blue : C.primary) : C.textMuted }}><tab.Icon /></span>
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Tab content ── */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {activeTab === 'requests' && <RegistrationRequestsTab />}
          {activeTab === 'records'  && <StudentRecordsTab />}
          {activeTab === 'archive'  && <StudentArchiveTab />}
          {activeTab === 'add'      && <StudentRegistrationTab />}
          {activeTab === 'addStaff' && <StaffRegistrationTab />}
        </div>
      </div>
    </>
  );
};

export default StudentsManagement;
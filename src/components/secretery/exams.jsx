import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

// ─── Design Tokens ────────────────────────────────────────────────────────────
const T = {
  navy:       '#0f172a',
  primary:    '#4318FF',
  primaryLt:  '#eef2ff',
  white:      '#ffffff',
  pageBg:     '#f8fafc',
  border:     '#f1f5f9',
  borderMid:  '#e2e8f0',
  textDark:   '#1e293b',
  textMid:    '#64748b',
  textMuted:  '#94a3b8',
  danger:     '#dc2626',
  dangerBg:   '#fef2f2',
  success:    '#059669',
  successBg:  '#ecfdf5',
  warning:    '#d97706',
  warningBg:  '#fffbeb',
};

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icons = {
  Refresh:    () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
  Plus:       () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Settings:   () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M4.93 19.07l1.41-1.41M19.07 19.07l-1.41-1.41M12 2v2M12 20v2M2 12h2M20 12h2"/></svg>,
  BarChart:   () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  Calendar:   () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  ChevronRight:()=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  ChevronLeft:()=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
  Search:     () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Edit:       () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Trash:      () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
  Check:      () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Clock:      () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  FileText:   () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  Users:      () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Download:   () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Eye:        () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  Medal:      () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>,
  ArrowLeft:  () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
};

// ─── Shared sub-components ────────────────────────────────────────────────────
const Card = ({ children, style = {} }) => (
  <div style={{
    background: T.white, borderRadius: 14,
    border: `1px solid ${T.border}`,
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
    ...style,
  }}>{children}</div>
);

const StatCard = ({ label, value, icon: Icon, iconBg, iconColor, loading }) => (
  <Card style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
    <div>
      <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>{label}</p>
      <p style={{ margin: 0, fontSize: 28, fontWeight: 800, color: T.textDark, lineHeight: 1 }}>
        {loading ? <span style={{ color: T.borderMid }}>—</span> : value}
      </p>
    </div>
    <div style={{ width: 38, height: 38, borderRadius: 10, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: iconColor }}>
      <Icon />
    </div>
  </Card>
);

const Badge = ({ status }) => {
  const s = status?.toLowerCase() || 'draft';
  const map = {
    active:    { bg: '#ecfdf5', color: '#059669', label: 'Active'     },
    scheduled: { bg: '#fffbeb', color: '#d97706', label: 'Scheduled'  },
    completed: { bg: '#eef2ff', color: '#4318FF', label: 'Completed'  },
    draft:     { bg: '#f8fafc', color: '#94a3b8', label: 'Draft'      },
  };
  const cfg = map[s] || map.draft;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      fontSize: 10, fontWeight: 700, padding: '3px 10px',
      borderRadius: 20, background: cfg.bg, color: cfg.color,
      textTransform: 'uppercase', letterSpacing: '0.06em',
    }}>{cfg.label}</span>
  );
};

const ActionBtn = ({ icon: Icon, color, title, onClick }) => (
  <button
    title={title} onClick={onClick}
    style={{
      width: 30, height: 30, borderRadius: 8, border: 'none',
      background: 'transparent', cursor: 'pointer',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      color: T.textMuted, transition: 'all 0.15s',
    }}
    onMouseEnter={e => { e.currentTarget.style.background = color + '18'; e.currentTarget.style.color = color; }}
    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = T.textMuted; }}
  >
    <Icon />
  </button>
);

const PrimaryBtn = ({ children, onClick, disabled, style = {} }) => (
  <button
    onClick={onClick} disabled={disabled}
    style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      padding: '9px 18px', borderRadius: 10, border: 'none',
      background: disabled ? T.textMuted : T.primary,
      color: '#fff', fontSize: 13, fontWeight: 700,
      cursor: disabled ? 'not-allowed' : 'pointer',
      boxShadow: disabled ? 'none' : '0 4px 14px rgba(67,24,255,0.28)',
      transition: 'all 0.15s', ...style,
    }}
    onMouseEnter={e => { if (!disabled) { e.currentTarget.style.background = '#3510d4'; e.currentTarget.style.transform = 'translateY(-1px)'; }}}
    onMouseLeave={e => { e.currentTarget.style.background = disabled ? T.textMuted : T.primary; e.currentTarget.style.transform = 'none'; }}
  >
    {children}
  </button>
);

const GhostBtn = ({ children, onClick, style = {} }) => (
  <button
    onClick={onClick}
    style={{
      display: 'inline-flex', alignItems: 'center', gap: 7,
      padding: '8px 16px', borderRadius: 10,
      border: `1px solid ${T.borderMid}`,
      background: T.white, color: T.textDark,
      fontSize: 13, fontWeight: 600, cursor: 'pointer',
      transition: 'all 0.15s', ...style,
    }}
    onMouseEnter={e => { e.currentTarget.style.background = T.pageBg; e.currentTarget.style.borderColor = '#c7d2fe'; }}
    onMouseLeave={e => { e.currentTarget.style.background = T.white; e.currentTarget.style.borderColor = T.borderMid; }}
  >
    {children}
  </button>
);

const FieldLabel = ({ children, required }) => (
  <label style={{
    display: 'block', fontSize: 11, fontWeight: 700,
    color: T.textMuted, textTransform: 'uppercase',
    letterSpacing: '0.08em', marginBottom: 7,
  }}>
    {children}{required && <span style={{ color: T.danger, marginLeft: 3 }}>*</span>}
  </label>
);

const inputStyle = (focused = false) => ({
  width: '100%', height: 44,
  background: focused ? T.white : T.pageBg,
  border: `1.5px solid ${focused ? T.primary : T.borderMid}`,
  borderRadius: 10, padding: '0 14px',
  fontSize: 13.5, fontFamily: "'Inter','Segoe UI',sans-serif",
  color: T.textDark, outline: 'none',
  boxShadow: focused ? '0 0 0 3px rgba(67,24,255,0.09)' : 'none',
  transition: 'all 0.2s', boxSizing: 'border-box',
});

const selectStyle = () => ({
  ...inputStyle(),
  cursor: 'pointer', appearance: 'none', WebkitAppearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center',
  paddingRight: 36,
});

const SectionHeading = ({ title, sub }) => (
  <div style={{ marginBottom: 20 }}>
    <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: T.textDark, letterSpacing: '-0.01em' }}>{title}</h2>
    {sub && <p style={{ margin: '4px 0 0', fontSize: 13, color: T.textMid }}>{sub}</p>}
  </div>
);

const getSubjectColors = (subject) => {
  const s = subject?.toLowerCase() || '';
  if (s.includes('german'))  return { bg: '#ecfdf5', border: '#059669', text: '#059669' };
  if (s.includes('english')) return { bg: '#eff6ff', border: '#2563eb', text: '#2563eb' };
  if (s.includes('spanish')) return { bg: '#fff7ed', border: '#f97316', text: '#f97316' };
  if (s.includes('french'))  return { bg: '#f5f3ff', border: '#7c3aed', text: '#7c3aed' };
  return { bg: '#f8fafc', border: '#94a3b8', text: '#94a3b8' };
};

// ─── Main Component ───────────────────────────────────────────────────────────
const Exams = ({ examView, setExamView }) => {
  const [examsData, setExamsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [classesData, setClassesData] = useState([]);
  const [teachersData, setTeachersData] = useState([]);
  const [roomsData, setRoomsData] = useState([]);

  const [focused, setFocused] = useState({});
  const onFocus = k => setFocused(f => ({ ...f, [k]: true  }));
  const onBlur  = k => setFocused(f => ({ ...f, [k]: false }));

  const getTodayString = () => {
    const today = new Date();
    return new Date(today.getTime() - (today.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
  };

  // 💡 State for Exam Form
  const initialExamState = {
    id: null, title: '', subject: 'English', class_name: '',
    teacher_id: '', room_name: '', duration: 60,
    date: getTodayString(), time: '10:00', instructions: '',
  };
  const [newExam, setNewExam] = useState(initialExamState);

  const [resultsData,         setResultsData]         = useState([]);
  const [selectedResultExam,  setSelectedResultExam]  = useState('');
  const [resultStats,         setResultStats]          = useState({ total: 0, completed: 0, avg: 0, passRate: 0 });

  const getStartOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay() || 7;
    if (day !== 1) d.setHours(-24 * (day - 1));
    d.setHours(0, 0, 0, 0);
    return d;
  };
  const [currentWeekStart, setCurrentWeekStart] = useState(getStartOfWeek(new Date()));

  // ── FETCH DATA ──────────────────────────────────────────────────────────────
  const fetchExams = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('exams').select('*').order('created_at', { ascending: false });
    if (!error && data) setExamsData(data);
    setLoading(false);
  };

  const fetchClassesAndTeachersAndRooms = async () => {
    const { data: cData } = await supabase.from('classes').select('*');
    if (cData) {
      setClassesData(cData);
      if (cData.length > 0) setNewExam(prev => ({ ...prev, class_name: cData[0].name }));
    }
    const { data: tData } = await supabase.from('staff').select('*');
    if (tData) {
      setTeachersData(tData);
      if (tData.length > 0) setNewExam(prev => ({ ...prev, teacher_id: tData[0].id }));
    }
    const { data: rData } = await supabase.from('rooms').select('*');
    if (rData) {
      setRoomsData(rData);
      if (rData.length > 0) setNewExam(prev => ({ ...prev, room_name: rData[0].name || rData[0].room_name }));
    }
  };

  const fetchExamResults = async (examTitle) => {
    if (!examTitle) return;
    try {
      const { data, error } = await supabase.from('grades').select('*').eq('exam_title', examTitle);
      if (error) { console.error('Supabase Error:', error); return; }
      if (data && data.length > 0) {
        setResultsData(data);
        const total = data.length;
        const completed = data.filter(d => d.score != null).length;
        let sumScores = 0, passedCount = 0;
        data.forEach(d => {
          const scoreNum = parseFloat(d.score) || 0;
          sumScores += scoreNum;
          if (scoreNum >= 50 || d.status === 'Passed') passedCount++;
        });
        setResultStats({ total, completed, avg: total ? (sumScores / total).toFixed(1) : 0, passRate: total ? ((passedCount / total) * 100).toFixed(1) : 0 });
      } else {
        setResultsData([]);
        setResultStats({ total: 0, completed: 0, avg: 0, passRate: 0 });
      }
    } catch (err) { console.log('Error fetching grades', err); }
  };

  useEffect(() => { fetchExams(); fetchClassesAndTeachersAndRooms(); }, []);

  useEffect(() => {
    if (examView === 'results') {
      const completedExams = examsData.filter(e => e.status?.toLowerCase() === 'completed');
      if (completedExams.length > 0 && !selectedResultExam) {
        setSelectedResultExam(completedExams[0].title);
        fetchExamResults(completedExams[0].title);
      } else if (selectedResultExam) {
        fetchExamResults(selectedResultExam);
      }
    }
  }, [examView, selectedResultExam, examsData]);

  // ── ACTIONS ──────────────────────────────────────────────────────────────
  const handleSaveExam = async () => {
    if (!newExam.title || !newExam.class_name || !newExam.teacher_id || !newExam.room_name) {
      alert('Please fill all required fields (Title, Class, Teacher, Room)!'); return;
    }
    setLoading(true);
    try {
      // Conflict Validation
      let conflictQuery = supabase
        .from('exams')
        .select('*')
        .eq('exam_date', newExam.date)
        .eq('start_time', newExam.time)
        .or(`teacher_id.eq.${newExam.teacher_id},room_name.eq.${newExam.room_name},class_name.eq.${newExam.class_name}`);
        
      if (newExam.id) conflictQuery = conflictQuery.neq('id', newExam.id); // Ignore current exam if editing
      
      const { data: conflicts, error: checkError } = await conflictQuery;

      if (checkError) throw checkError;

      if (conflicts && conflicts.length > 0) {
        const conflict = conflicts[0];
        let errorMsg = "Conflict detected! \n";
        if (conflict.teacher_id === newExam.teacher_id) errorMsg += "• This teacher already has an exam at this time.\n";
        if (conflict.room_name === newExam.room_name) errorMsg += `• The room "${newExam.room_name}" is already booked.\n`;
        if (conflict.class_name === newExam.class_name) errorMsg += `• The class "${newExam.class_name}" already has an exam scheduled.`;
        
        alert(errorMsg);
        setLoading(false); return;
      }

      // Save or Update
      const payload = {
        title: newExam.title, subject: newExam.subject,
        class_name: newExam.class_name, teacher_id: newExam.teacher_id,
        room_name: newExam.room_name, duration_minutes: parseInt(newExam.duration),
        status: 'Scheduled', exam_date: newExam.date,
        start_time: newExam.time, instructions: newExam.instructions,
      };

      if (newExam.id) {
        // Edit Existing Exam
        const { error } = await supabase.from('exams').update(payload).eq('id', newExam.id);
        if (error) throw error;
        alert('Exam Updated Successfully!');
      } else {
        // Create New Exam
        const { error } = await supabase.from('exams').insert([payload]);
        if (error) throw error;
        alert('Exam Created Successfully! No conflicts detected.');
        
        // 💡 Auto Notify Students
        await supabase.from('communications').insert([{
            type: 'notification',
            subject: `New Exam Scheduled: ${newExam.title}`,
            content: `A new ${newExam.subject} exam has been scheduled on ${newExam.date} at ${newExam.time} in ${newExam.room_name}.`,
            recipient_name: `Group: ${newExam.class_name}`,
            sender_role: 'system'
        }]);
      }
      
      setNewExam(initialExamState);
      setExamView('manage'); 
      fetchExams();
    } catch (err) { alert('Error: ' + err.message); }
    finally { setLoading(false); }
  };

  const handleEditExam = (exam) => {
    setNewExam({
      id: exam.id, title: exam.title, subject: exam.subject, class_name: exam.class_name,
      teacher_id: exam.teacher_id, room_name: exam.room_name || '', duration: exam.duration_minutes || 60,
      date: exam.exam_date, time: exam.start_time || '10:00', instructions: exam.instructions || ''
    });
    setExamView('create');
  };

  const handleMarkAsCompleted = async (id) => {
    if (window.confirm('Mark this exam as Completed?')) {
      const { error } = await supabase.from('exams').update({ status: 'Completed' }).eq('id', id);
      if (!error) setExamsData(examsData.map(e => e.id === id ? { ...e, status: 'Completed' } : e));
      else alert('Error: ' + error.message);
    }
  };

  const handleDeleteExam = async (id) => {
    if (window.confirm('Are you sure you want to delete this exam? This action cannot be undone.')) {
      const { error } = await supabase.from('exams').delete().eq('id', id);
      if (!error) {
        setExamsData(examsData.filter(e => e.id !== id));
        alert('Exam deleted successfully.');
      }
      else alert('Error deleting exam: ' + error.message);
    }
  };

  const resetFormAndGoBack = () => {
    setNewExam(initialExamState);
    setExamView('manage');
  };

  // ─────────────────────────────────────────────────────────────────────────

  const totalExams     = examsData.length;
  const activeExams    = examsData.filter(e => e.status?.toLowerCase() === 'active').length;
  const scheduledExams = examsData.filter(e => e.status?.toLowerCase() === 'scheduled').length;
  const completedExams = examsData.filter(e => e.status?.toLowerCase() === 'completed').length;

  const filteredExams = examsData.filter(exam => {
    const q = searchTerm.toLowerCase();
    const matchSearch = (exam.title?.toLowerCase() || '').includes(q) ||
      (exam.subject?.toLowerCase() || '').includes(q) ||
      (exam.class_name?.toLowerCase() || '').includes(q);
    const matchStatus = statusFilter === 'All Status' ||
      (exam.status?.toLowerCase() || 'draft') === statusFilter.toLowerCase();
    return matchSearch && matchStatus;
  });

  // ══════════════════════════════════════════════════════════════════════════
  // VIEW 1 — HOME
  // ══════════════════════════════════════════════════════════════════════════
  const renderHome = () => (
    <div style={{ paddingBottom: 40 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 26 }}>
        <SectionHeading title="Exam Management" sub="Overview of all exams across the academy" />
        <GhostBtn onClick={fetchExams}><Icons.Refresh /> Refresh</GhostBtn>
      </div>

      {/* Stat row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        <StatCard label="Total Exams"   value={totalExams}     icon={Icons.FileText} iconBg="#eef2ff" iconColor={T.primary}  loading={loading} />
        <StatCard label="Active Exams"  value={activeExams}    icon={Icons.Check}    iconBg="#ecfdf5" iconColor={T.success}  loading={loading} />
        <StatCard label="Scheduled"     value={scheduledExams} icon={Icons.Calendar} iconBg="#fffbeb" iconColor={T.warning}  loading={loading} />
        <StatCard label="Completed"     value={completedExams} icon={Icons.Medal}    iconBg="#f5f3ff" iconColor="#7c3aed"    loading={loading} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20 }}>

        {/* Recent exams */}
        <Card style={{ padding: '22px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: T.textDark }}>Recent Exams</h3>
            <button onClick={() => setExamView('manage')} style={{ fontSize: 12, fontWeight: 700, color: T.primary, background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: 6 }}
              onMouseEnter={e => e.currentTarget.style.background = T.primaryLt}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >View All</button>
          </div>
          {loading ? (
            <p style={{ color: T.textMuted, fontSize: 13 }}>Loading...</p>
          ) : examsData.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0', border: `1.5px dashed ${T.borderMid}`, borderRadius: 12 }}>
              <p style={{ color: T.textMuted, fontSize: 13, fontWeight: 600 }}>No exams created yet.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {examsData.slice(0, 5).map(exam => {
                const col = getSubjectColors(exam.subject);
                return (
                  <div
                    key={exam.id}
                    onClick={() => exam.status?.toLowerCase() === 'completed' ? setExamView('results') : setExamView('manage')}
                    style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '12px 14px', borderRadius: 10, cursor: 'pointer',
                      border: `1px solid ${T.border}`, transition: 'all 0.15s',
                      borderLeft: `3px solid ${col.border}`,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = T.pageBg; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = T.white; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: T.textDark }}>{exam.title}</p>
                        <Badge status={exam.status} />
                      </div>
                      <p style={{ margin: 0, fontSize: 12, color: T.textMid }}>{exam.subject} · {exam.class_name}</p>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <p style={{ margin: 0, fontSize: 11, color: T.textMuted, marginBottom: 2 }}>Date</p>
                      <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: T.textMid }}>{exam.exam_date || 'TBD'}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Quick Actions */}
        <Card style={{ padding: '22px 20px' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: T.textDark }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              { icon: Icons.Plus,     label: 'Create New Exam',    view: 'create'   },
              { icon: Icons.Settings, label: 'Manage Exams',       view: 'manage'   },
              { icon: Icons.BarChart, label: 'View Exam Results',  view: 'results'  },
              { icon: Icons.Calendar, label: 'Exam Schedule',      view: 'schedule' },
            ].map(({ icon: Icon, label, view }) => (
              <button
                key={view}
                onClick={() => { setExamView(view); if (view === 'create') setNewExam(initialExamState); }}
                style={{
                  width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '11px 14px', borderRadius: 10, border: `1px solid ${T.border}`,
                  background: T.white, fontSize: 13, fontWeight: 600, color: T.textDark,
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = T.primaryLt; e.currentTarget.style.borderColor = '#c7d2fe'; e.currentTarget.style.color = T.primary; }}
                onMouseLeave={e => { e.currentTarget.style.background = T.white; e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textDark; }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span><Icon /></span>{label}
                </span>
                <Icons.ChevronRight />
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );

  // ══════════════════════════════════════════════════════════════════════════
  // VIEW 2 — MANAGE EXAMS
  // ══════════════════════════════════════════════════════════════════════════
  const renderManageExams = () => (
    <div style={{ paddingBottom: 40 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
        <SectionHeading title="Exam Management" sub="Manage all exams across the school" />
        <PrimaryBtn onClick={() => { setNewExam(initialExamState); setExamView('create'); }}>
          <Icons.Plus /> New Exam
        </PrimaryBtn>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 22 }}>
        <StatCard label="Total Exams"   value={totalExams}     icon={Icons.FileText} iconBg="#eef2ff" iconColor={T.primary}  loading={loading} />
        <StatCard label="Active Exams"  value={activeExams}    icon={Icons.Check}    iconBg="#ecfdf5" iconColor={T.success}  loading={loading} />
        <StatCard label="Scheduled"     value={scheduledExams} icon={Icons.Calendar} iconBg="#fffbeb" iconColor={T.warning}  loading={loading} />
        <StatCard label="Completed"     value={completedExams} icon={Icons.Medal}    iconBg="#f5f3ff" iconColor="#7c3aed"    loading={loading} />
      </div>

      {/* Search + filter bar */}
      <Card style={{ padding: '10px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ color: T.textMuted, display: 'flex', alignItems: 'center' }}><Icons.Search /></span>
        <input
          type="text"
          placeholder="Search by title, subject or class..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ flex: 1, border: 'none', outline: 'none', fontSize: 13.5, color: T.textDark, background: 'transparent', fontFamily: "'Inter','Segoe UI',sans-serif" }}
        />
        <div style={{ width: 1, height: 20, background: T.borderMid }}/>
        <select
          value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          style={{ border: 'none', outline: 'none', fontSize: 13, fontWeight: 600, color: T.textMid, background: 'transparent', cursor: 'pointer', fontFamily: "'Inter','Segoe UI',sans-serif" }}
        >
          <option>All Status</option>
          <option>Active</option>
          <option>Scheduled</option>
          <option>Completed</option>
          <option>Draft</option>
        </select>
      </Card>

      {/* Table */}
      <Card style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: T.pageBg, borderBottom: `1px solid ${T.border}` }}>
                {['Title', 'Subject', 'Class', 'Status', 'Duration', 'Date & Time', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '13px 16px', textAlign: h === 'Actions' ? 'center' : 'left', fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.07em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredExams.length === 0 ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '40px 0', color: T.textMuted, fontSize: 13, fontWeight: 600 }}>No exams found.</td></tr>
              ) : filteredExams.map(row => {
                const col = getSubjectColors(row.subject);
                return (
                  <tr key={row.id} style={{ borderBottom: `1px solid ${T.border}`, transition: 'background 0.12s' }}
                    onMouseEnter={e => e.currentTarget.style.background = T.pageBg}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '14px 16px' }}>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: T.textDark }}>{row.title}</p>
                      <p style={{ margin: '3px 0 0', fontSize: 11, color: T.textMuted }}>Created: {new Date(row.created_at).toLocaleDateString()}</p>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: col.bg, color: col.text }}>{row.subject}</span>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: T.textMid, fontWeight: 500 }}>{row.class_name}</td>
                    <td style={{ padding: '14px 16px' }}><Badge status={row.status} /></td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, color: T.textMid, fontWeight: 500 }}>
                        <Icons.Clock /> {row.duration_minutes}m
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: T.textDark }}>{row.exam_date || 'TBD'}</p>
                      {row.start_time && <p style={{ margin: '2px 0 0', fontSize: 11, color: T.textMuted }}>at {row.start_time}</p>}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                        {row.status?.toLowerCase() === 'active' && (
                          <ActionBtn icon={Icons.Check} color={T.success} title="Mark as Completed"
                            onClick={e => { e.stopPropagation(); handleMarkAsCompleted(row.id); }} />
                        )}
                        <ActionBtn icon={Icons.Edit}  color={T.primary} title="Edit" onClick={() => handleEditExam(row)} />
                        <ActionBtn icon={Icons.Trash} color={T.danger}  title="Delete"
                          onClick={e => { e.stopPropagation(); handleDeleteExam(row.id); }} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  // ══════════════════════════════════════════════════════════════════════════
  // VIEW 3 — CREATE / EDIT EXAM
  // ══════════════════════════════════════════════════════════════════════════
  const renderCreateExam = () => (
    <div style={{ maxWidth: 720, margin: '0 auto', paddingBottom: 40 }}>
      <div style={{ marginBottom: 28, display: 'flex', alignItems: 'center', gap: 16 }}>
        <button onClick={resetFormAndGoBack} style={{ background: 'none', border: 'none', color: T.textMuted, cursor: 'pointer', padding: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = T.textDark} onMouseLeave={e => e.currentTarget.style.color = T.textMuted}>
            <Icons.ArrowLeft />
        </button>
        <SectionHeading title={newExam.id ? "Edit Exam" : "Create New Exam"} sub={newExam.id ? "Update exam details below" : "Provide exam details"} />
      </div>

      <Card style={{ padding: '32px 36px' }}>
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 20px', marginBottom: 16 }}>
            {/* Title */}
            <div>
              <FieldLabel required>Exam Title</FieldLabel>
              <input type="text" value={newExam.title}
                onChange={e => setNewExam({ ...newExam, title: e.target.value })}
                onFocus={() => onFocus('title')} onBlur={() => onBlur('title')}
                placeholder="e.g. English Mid-Term"
                style={inputStyle(focused.title)} />
            </div>
            {/* Subject */}
            <div>
              <FieldLabel>Subject</FieldLabel>
              <select value={newExam.subject}
                onChange={e => setNewExam({ ...newExam, subject: e.target.value })}
                onFocus={() => onFocus('subject')} onBlur={() => onBlur('subject')}
                style={selectStyle(focused.subject)}>
                <option>English</option><option>French</option><option>German</option>
                <option>Spanish</option><option>Physics</option><option>Mathematics</option>
              </select>
            </div>
            {/* Class */}
            <div>
              <FieldLabel required>Class / Group</FieldLabel>
              <select value={newExam.class_name}
                onChange={e => setNewExam({ ...newExam, class_name: e.target.value })}
                onFocus={() => onFocus('class')} onBlur={() => onBlur('class')}
                style={selectStyle(focused.class)}>
                <option value="">— Select Class —</option>
                {classesData.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            {/* Teacher */}
            <div>
              <FieldLabel required>Assign Teacher</FieldLabel>
              <select value={newExam.teacher_id}
                onChange={e => setNewExam({ ...newExam, teacher_id: e.target.value })}
                onFocus={() => onFocus('teacher')} onBlur={() => onBlur('teacher')}
                style={selectStyle(focused.teacher)}>
                <option value="">— Select Teacher —</option>
                {teachersData.map(t => <option key={t.id} value={t.id}>{t.first_name} {t.last_name}</option>)}
              </select>
            </div>
            {/* Room Selection */}
            <div>
              <FieldLabel required>Assign Room</FieldLabel>
              <select value={newExam.room_name}
                onChange={e => setNewExam({ ...newExam, room_name: e.target.value })}
                onFocus={() => onFocus('room')} onBlur={() => onBlur('room')}
                style={selectStyle(focused.room)}>
                <option value="">— Select Room —</option>
                {roomsData.map(r => <option key={r.id} value={r.name || r.room_name}>{r.name || r.room_name}</option>)}
              </select>
            </div>
            {/* Date */}
            <div>
              <FieldLabel required>Exam Date</FieldLabel>
              <input type="date" value={newExam.date}
                onChange={e => setNewExam({ ...newExam, date: e.target.value })}
                onFocus={() => onFocus('date')} onBlur={() => onBlur('date')}
                style={inputStyle(focused.date)} />
            </div>
            {/* Time */}
            <div>
              <FieldLabel required>Start Time</FieldLabel>
              <input type="time" value={newExam.time}
                onChange={e => setNewExam({ ...newExam, time: e.target.value })}
                onFocus={() => onFocus('time')} onBlur={() => onBlur('time')}
                style={inputStyle(focused.time)} />
            </div>
            {/* Duration */}
            <div>
              <FieldLabel>Duration (minutes)</FieldLabel>
              <input type="number" value={newExam.duration}
                onChange={e => setNewExam({ ...newExam, duration: e.target.value })}
                onFocus={() => onFocus('duration')} onBlur={() => onBlur('duration')}
                placeholder="60" style={inputStyle(focused.duration)} />
            </div>
          </div>

          {/* Instructions */}
          <div style={{ marginBottom: 28 }}>
            <FieldLabel>Exam Instructions</FieldLabel>
            <textarea
              value={newExam.instructions}
              onChange={e => setNewExam({ ...newExam, instructions: e.target.value })}
              onFocus={() => onFocus('instr')} onBlur={() => onBlur('instr')}
              rows={4} placeholder="Instructions for students..."
              style={{
                width: '100%', padding: '12px 14px', resize: 'none',
                background: focused.instr ? T.white : T.pageBg,
                border: `1.5px solid ${focused.instr ? T.primary : T.borderMid}`,
                borderRadius: 10, fontSize: 13.5, outline: 'none',
                fontFamily: "'Inter','Segoe UI',sans-serif",
                color: T.textDark, lineHeight: 1.6, boxSizing: 'border-box',
                boxShadow: focused.instr ? '0 0 0 3px rgba(67,24,255,0.09)' : 'none',
                transition: 'all 0.2s',
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: `1px solid ${T.border}`, paddingTop: 24, gap: 12 }}>
            <button onClick={resetFormAndGoBack}
              style={{ background: 'none', border: 'none', fontSize: 13, fontWeight: 600, color: T.textMid, cursor: 'pointer', padding: '8px 12px', borderRadius: 8 }}
              onMouseEnter={e => e.currentTarget.style.color = T.textDark}
              onMouseLeave={e => e.currentTarget.style.color = T.textMid}
            >
              Cancel
            </button>
            <PrimaryBtn onClick={handleSaveExam} disabled={loading}>
              {loading ? 'Saving...' : newExam.id ? 'Save Changes' : 'Publish Exam'}
            </PrimaryBtn>
          </div>
        </div>
      </Card>
    </div>
  );

  // ══════════════════════════════════════════════════════════════════════════
  // VIEW 4 — RESULTS
  // ══════════════════════════════════════════════════════════════════════════
  const renderResults = () => {
    const completedExamsList = examsData.filter(e => e.status?.toLowerCase() === 'completed');
    const currentExamDetails = completedExamsList.find(e => e.title === selectedResultExam);
    return (
      <div style={{ paddingBottom: 40 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
          <SectionHeading title="Exam Results" sub="View and analyze student performance" />
          <div style={{ display: 'flex', gap: 10 }}>
            <GhostBtn onClick={() => {}}><Icons.Download /> Export CSV</GhostBtn>
            <GhostBtn onClick={() => {}}><Icons.Download /> Export PDF</GhostBtn>
          </div>
        </div>

        {/* Exam selector */}
        <Card style={{ padding: '12px 18px', marginBottom: 22, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.07em', whiteSpace: 'nowrap' }}>Showing results for</span>
          <select
            value={selectedResultExam}
            onChange={e => setSelectedResultExam(e.target.value)}
            style={{ border: 'none', outline: 'none', fontSize: 14, fontWeight: 700, color: T.textDark, background: 'transparent', cursor: 'pointer', flex: 1, fontFamily: "'Inter','Segoe UI',sans-serif" }}
          >
            {completedExamsList.length === 0
              ? <option value="">No completed exams yet</option>
              : completedExamsList.map(e => <option key={e.id} value={e.title}>{e.title} — {e.class_name}</option>)
            }
          </select>
        </Card>

        {/* Result stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 22 }}>
          <StatCard label="Total Students"  value={resultStats.total}     icon={Icons.Users}    iconBg="#eff6ff" iconColor="#2563eb"   loading={false} />
          <StatCard label="Completed"        value={resultStats.completed} icon={Icons.FileText} iconBg="#eef2ff" iconColor={T.primary} loading={false} />
          <StatCard label="Average Score"    value={`${resultStats.avg}%`} icon={Icons.BarChart} iconBg="#ecfdf5" iconColor={T.success} loading={false} />
          <StatCard label="Pass Rate"        value={`${resultStats.passRate}%`} icon={Icons.Medal} iconBg="#fffbeb" iconColor={T.warning} loading={false} />
        </div>

        {/* Exam details strip */}
        {currentExamDetails && (
          <Card style={{ padding: '18px 24px', marginBottom: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: T.textDark }}>{currentExamDetails.title}</p>
                <p style={{ margin: '3px 0 0', fontSize: 12, color: T.textMid }}>{currentExamDetails.subject} · {currentExamDetails.class_name} · {currentExamDetails.exam_date}</p>
              </div>
              {[
                { label: 'Duration',         value: `${currentExamDetails.duration_minutes} min` },
                { label: 'Passing Score',    value: '50%' },
                { label: 'Completion Rate',  value: `${resultStats.total > 0 ? Math.round((resultStats.completed / resultStats.total) * 100) : 0}%` },
              ].map(item => (
                <div key={item.label} style={{ textAlign: 'center', padding: '0 20px', borderLeft: `1px solid ${T.border}` }}>
                  <p style={{ margin: 0, fontSize: 11, color: T.textMuted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>{item.label}</p>
                  <p style={{ margin: 0, fontSize: 18, fontWeight: 800, color: T.textDark }}>{item.value}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Results table */}
        <Card style={{ overflow: 'hidden' }}>
          <div style={{ padding: '18px 24px', borderBottom: `1px solid ${T.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: T.textDark }}>Student Results</h3>
              <p style={{ margin: '3px 0 0', fontSize: 12, color: T.textMid }}>Detailed results for each student</p>
            </div>
            <Card style={{ padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 8, border: `1px solid ${T.borderMid}`, boxShadow: 'none' }}>
              <span style={{ color: T.textMuted }}><Icons.Search /></span>
              <input type="text" placeholder="Search students..." style={{ border: 'none', outline: 'none', fontSize: 13, color: T.textDark, background: 'transparent', width: 180, fontFamily: "'Inter','Segoe UI',sans-serif" }} />
            </Card>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: T.pageBg, borderBottom: `1px solid ${T.border}` }}>
                  {['Student', 'Score', 'Percentage', 'Grade', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: h === 'Actions' ? 'center' : 'left', fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {resultsData.length === 0 ? (
                  <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px 0', color: T.textMuted, fontSize: 13, fontWeight: 600 }}>No results recorded yet for this exam.</td></tr>
                ) : resultsData.map((s, i) => {
                  const name     = s.student_name || 'Unknown Student';
                  const sid      = s.student_id   || '—';
                  const scoreNum = parseFloat(s.score) || 0;
                  const passed   = scoreNum >= 50 || s.status === 'Passed';
                  return (
                    <tr key={i} style={{ borderBottom: `1px solid ${T.border}`, transition: 'background 0.12s' }}
                      onMouseEnter={e => e.currentTarget.style.background = T.pageBg}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '14px 16px' }}>
                        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: T.textDark }}>{name}</p>
                        <p style={{ margin: '2px 0 0', fontSize: 11, color: T.textMuted }}>{sid}</p>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 700, color: T.textDark }}>{s.score != null ? `${s.score}/100` : '—'}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color: T.textDark, minWidth: 38 }}>{scoreNum}%</span>
                          <div style={{ flex: 1, maxWidth: 80, height: 6, background: T.border, borderRadius: 4, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${Math.min(scoreNum, 100)}%`, background: passed ? T.success : T.danger, borderRadius: 4, transition: 'width 0.4s' }} />
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 800, color: s.grade === 'F' ? T.danger : T.success }}>{s.grade || '—'}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.05em', background: passed ? T.successBg : T.dangerBg, color: passed ? T.success : T.danger }}>
                          {s.status || (passed ? 'Passed' : 'Failed')}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                        <ActionBtn icon={Icons.Eye} color={T.primary} title="View" onClick={() => {}} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    );
  };

  // ══════════════════════════════════════════════════════════════════════════
  // VIEW 5 — SCHEDULE (weekly calendar)
  // ══════════════════════════════════════════════════════════════════════════
  const renderSchedule = () => {
    const weekDays = Array.from({ length: 5 }).map((_, i) => {
      const d = new Date(currentWeekStart);
      d.setDate(d.getDate() + i);
      return d;
    });
    const START_HOUR  = 8;
    const HOUR_HEIGHT = 70;
    const timeToFloat = (t) => {
      if (!t) return 10;
      const [h, m] = t.split(':');
      return parseInt(h) + (parseInt(m || 0) / 60);
    };

    return (
      <div style={{ paddingBottom: 40 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
          <SectionHeading title="Exam Schedule" sub="Weekly overview of all scheduled exams" />
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <GhostBtn onClick={() => { const d = new Date(currentWeekStart); d.setDate(d.getDate() - 7); setCurrentWeekStart(getStartOfWeek(d)); }}>
              <Icons.ChevronLeft />
            </GhostBtn>
            <GhostBtn onClick={() => setCurrentWeekStart(getStartOfWeek(new Date()))}>This Week</GhostBtn>
            <GhostBtn onClick={() => { const d = new Date(currentWeekStart); d.setDate(d.getDate() + 7); setCurrentWeekStart(getStartOfWeek(d)); }}>
              <Icons.ChevronRight />
            </GhostBtn>
          </div>
        </div>

        <Card style={{ padding: '24px', overflowX: 'auto' }}>
          <div style={{ minWidth: 860 }}>
            {/* Header row */}
            <div style={{ display: 'grid', gridTemplateColumns: '72px repeat(5,1fr)', gap: 8, marginBottom: 16, paddingBottom: 16, borderBottom: `1px solid ${T.border}` }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 4 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Time</span>
              </div>
              {weekDays.map(date => {
                const isToday = date.toDateString() === new Date().toDateString();
                return (
                  <div key={date.toISOString()} style={{ textAlign: 'center' }}>
                    <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: isToday ? T.primary : T.textMuted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>
                      {date.toLocaleDateString('en-US', { weekday: 'short' })}
                    </p>
                    <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: isToday ? T.primary : T.textDark }}>
                      {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                    {isToday && <div style={{ width: 6, height: 6, borderRadius: '50%', background: T.primary, margin: '4px auto 0' }} />}
                  </div>
                );
              })}
            </div>

            {/* Calendar grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '72px repeat(5,1fr)', gap: 8, position: 'relative' }}>
              {/* Time column */}
              <div style={{ position: 'relative', minHeight: 500 }}>
                {[8, 9, 10, 11, 12, 13, 14, 15, 16].map(hour => (
                  <div key={hour} style={{ position: 'absolute', top: (hour - START_HOUR) * HOUR_HEIGHT, right: 0, width: '100%', paddingRight: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: T.textMuted }}>
                      {hour > 12 ? hour - 12 : hour}:00 {hour >= 12 ? 'PM' : 'AM'}
                    </span>
                  </div>
                ))}
              </div>

              {/* Day columns */}
              {weekDays.map((date, idx) => {
                const dateStr  = date.toISOString().split('T')[0];
                const dayExams = examsData.filter(e => e.exam_date === dateStr && e.status?.toLowerCase() !== 'draft');
                const isToday  = date.toDateString() === new Date().toDateString();
                return (
                  <div key={dateStr} style={{
                    position: 'relative', minHeight: 630,
                    borderLeft: `1px dashed ${T.border}`,
                    background: isToday ? 'rgba(67,24,255,0.015)' : 'transparent',
                  }}>
                    {/* Hour lines */}
                    {[8, 9, 10, 11, 12, 13, 14, 15, 16].map(h => (
                      <div key={h} style={{ position: 'absolute', top: (h - START_HOUR) * HOUR_HEIGHT, left: 0, right: 0, borderTop: `1px solid ${T.border}`, opacity: 0.6 }} />
                    ))}

                    {dayExams.map(exam => {
                      const col = getSubjectColors(exam.subject);
                      const startFloat  = timeToFloat(exam.start_time);
                      const topPosition = (startFloat - START_HOUR) * HOUR_HEIGHT;
                      return (
                        <div
                          key={exam.id}
                          style={{
                            position: 'absolute', top: topPosition,
                            left: 4, right: 4,
                            background: col.bg,
                            borderLeft: `3px solid ${col.border}`,
                            borderRadius: '0 8px 8px 0',
                            padding: '8px 10px', zIndex: 10,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                            cursor: 'pointer', transition: 'box-shadow 0.15s',
                          }}
                          onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)'}
                          onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'}
                        >
                          <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: col.text, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>
                            {exam.subject} · {exam.start_time || 'TBD'}
                          </p>
                          <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: T.textDark, lineHeight: 1.3 }}>{exam.title}</p>
                          <p style={{ margin: '2px 0 0', fontSize: 11, color: T.textMid, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{exam.class_name}</p>
                        </div>
                      );
                    })}

                    {dayExams.length === 0 && (
                      <div style={{ position: 'absolute', top: '40%', left: 0, right: 0, textAlign: 'center' }}>
                        <p style={{ fontSize: 11, fontWeight: 700, color: T.borderMid, textTransform: 'uppercase', letterSpacing: '0.07em' }}>No Exams</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      </div>
    );
  };

  // ── Render routing ────────────────────────────────────────────────────────
  return (
    <div style={{
      padding: '28px 32px', height: '100%',
      overflowY: 'auto', background: T.pageBg,
      fontFamily: "'Inter','Segoe UI',sans-serif",
    }}>
      {examView === 'home'     && renderHome()}
      {examView === 'manage'   && renderManageExams()}
      {examView === 'results'  && renderResults()}
      {examView === 'create'   && renderCreateExam()}
      {examView === 'schedule' && renderSchedule()}
    </div>
  );
};

export default Exams;
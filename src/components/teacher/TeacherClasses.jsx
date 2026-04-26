import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../supabaseClient';

// ─────────────────────────────────────────────────────────────────
// SVG ICONS
// ─────────────────────────────────────────────────────────────────
const Ico = ({ d, size = 16, color = 'currentColor', sw = 2, extra = null, fill = 'none' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
    stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {(Array.isArray(d) ? d : [d]).map((p, i) => <path key={i} d={p} />)}
    {extra}
  </svg>
);

const Icons = {
  Search:    (c='#94a3b8') => <Ico d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0" color={c} />,
  Book:      (c='#4318FF') => <Ico d={["M4 19.5A2.5 2.5 0 0 1 6.5 17H20","M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"]} color={c} />,
  Video:     (c='#059669') => <Ico d={["M23 7l-7 5 7 5V7z","M1 5h15a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H1a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"]} color={c} />,
  Notes:     (c='#9b51e0') => <Ico d={["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z","M14 2v6h6","M16 13H8","M16 17H8"]} color={c} />,
  Homework:  (c='#4318FF') => <Ico d={["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z","M14 2v6h6","M16 13H8","M16 17H8"]} color={c} />,
  Upload:    (c='#4318FF') => <Ico d={["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4","M17 8l-5-5-5 5","M12 3v12"]} color={c} />,
  ArrowLeft: (c='#1e293b') => <Ico d={["M19 12H5","M12 19l-7-7 7-7"]} color={c} />,
  Play:      (c='#fff')    => <Ico d="M5 3l14 9-14 9V3z" color={c} fill={c} />,
  Download:  (c='#4318FF') => <Ico d={["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4","M7 10l5 5 5-5","M12 15V3"]} color={c} />,
  Users:     (c='#4318FF') => <Ico d={["M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2","M23 21v-2a4 4 0 0 0-3-3.87","M16 3.13a4 4 0 0 1 0 7.75"]} color={c} extra={<circle cx="9" cy="7" r="4" fill="none" stroke={c} strokeWidth="2"/>} />,
  Plus:      (c='#fff')    => <Ico d={["M12 5v14","M5 12h14"]} color={c} sw={2.5} />,
  Paperclip: (c='#94a3b8') => <Ico d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" color={c} />,
  Clock:     (c='#f97316') => <Ico d="M12 6v6l4 2" color={c} extra={<circle cx="12" cy="12" r="10" fill="none" stroke={c} strokeWidth="2"/>} />,
  Check:     (c='#059669') => <Ico d="M20 6L9 17l-5-5" color={c} sw={2.5} />,
  File:      (c='#4318FF') => <Ico d={["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z","M14 2v6h6"]} color={c} />,
  Star:      (c='#f59e0b') => <Ico d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" color={c} fill={c} />,
  Hash:      (c='#4318FF') => <Ico d={["M4 9h16","M4 15h16","M10 3L8 21","M16 3l-2 18"]} color={c} />,
  Calendar:  (c='#4318FF') => <Ico d={["M8 2v4","M16 2v4","M3 10h18","M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"]} color={c} />,
  Globe:     (c='#4318FF') => <Ico d={["M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z","M2 12h20","M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"]} color={c} />,
  FilePdf:   (c='#4318FF') => <Ico d={["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z","M14 2v6h6","M9 13h6","M9 17h3"]} color={c} />,
};

// ─── Shared UI primitives ─────────────────────────────────────────
const Card = ({ children, style = {} }) => (
  <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', boxShadow: '0 1px 4px rgba(15,23,42,0.05)', ...style }}>{children}</div>
);

const TabBar = ({ tabs, active, onChange }) => (
  <div style={{ display: 'flex', borderBottom: '1px solid #f1f5f9', marginBottom: 24, overflowX: 'auto' }}>
    {tabs.map(tab => (
      <button key={tab} onClick={() => onChange(tab)} style={{
        padding: '12px 20px', fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap',
        color: active === tab ? '#4318FF' : '#94a3b8',
        background: 'none', border: 'none', cursor: 'pointer',
        borderBottom: active === tab ? '2px solid #4318FF' : '2px solid transparent',
        marginBottom: -1, transition: 'all .2s',
      }}>{tab}</button>
    ))}
  </div>
);

const Label = ({ children }) => (
  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>{children}</label>
);

const Input = ({ style = {}, ...props }) => (
  <input {...props} style={{ width: '100%', background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#1e293b', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'border-color .15s', ...style }}
    onFocus={e => e.target.style.borderColor = '#4318FF'} onBlur={e => e.target.style.borderColor = '#f1f5f9'} />
);

const Textarea = ({ rows = 4, style = {}, ...props }) => (
  <textarea rows={rows} {...props} style={{ width: '100%', background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#1e293b', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', resize: 'vertical', lineHeight: 1.6, transition: 'border-color .15s', ...style }}
    onFocus={e => e.target.style.borderColor = '#4318FF'} onBlur={e => e.target.style.borderColor = '#f1f5f9'} />
);

const BtnPrimary = ({ children, style = {}, ...props }) => (
  <button {...props} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 10, border: 'none', background: '#4318FF', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'background .15s', whiteSpace: 'nowrap', opacity: props.disabled ? 0.6 : 1, ...style }}
    onMouseEnter={e => { if (!props.disabled) e.currentTarget.style.background = '#3730a3'; }}
    onMouseLeave={e => { if (!props.disabled) e.currentTarget.style.background = '#4318FF'; }}
  >{children}</button>
);

const BackBtn = ({ onClick, label = '' }) => (
  <button onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', padding: 0 }}
    onMouseEnter={e => e.currentTarget.style.color = '#4318FF'}
    onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
  >
    {Icons.ArrowLeft('#94a3b8')} {label}
  </button>
);

const UploadZone = ({ file, onFile, accept, hint, icon }) => (
  <div style={{ width: '100%', minHeight: 180, border: '2px dashed #e2e8f0', borderRadius: 14, background: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', cursor: 'pointer', transition: 'all .15s', overflow: 'hidden' }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = '#4318FF'; e.currentTarget.style.background = '#f5f3ff'; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#f8fafc'; }}
  >
    <input type="file" accept={accept} onChange={e => onFile(e.target.files[0])} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', zIndex: 2 }} />
    {file ? (
      <div style={{ textAlign: 'center', padding: 20, zIndex: 1 }}>
        <div style={{ width: 44, height: 44, borderRadius: 10, background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>{Icons.File()}</div>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{file.name}</p>
        <p style={{ margin: '3px 0 0', fontSize: 11, color: '#94a3b8' }}>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
      </div>
    ) : (
      <div style={{ textAlign: 'center', padding: 24, zIndex: 1, pointerEvents: 'none' }}>
        <div style={{ width: 44, height: 44, borderRadius: 10, background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>{icon || Icons.Upload()}</div>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#64748b' }}>Click to upload</p>
        <p style={{ margin: '3px 0 0', fontSize: 11, color: '#94a3b8' }}>{hint}</p>
      </div>
    )}
  </div>
);

const CLASS_COLORS = [
  { bg: '#EEF2FF', accent: '#4318FF', border: '#e0e7ff' },
  { bg: '#FFF7ED', accent: '#f97316', border: '#fed7aa' },
  { bg: '#ECFDF5', accent: '#059669', border: '#bbf7d0' },
  { bg: '#F0F9FF', accent: '#0284c7', border: '#bae6fd' },
];

// ─────────────────────────────────────────────────────────────────
// MAIN COMPONENT — all DB logic UNTOUCHED
// ─────────────────────────────────────────────────────────────────
const TeacherClasses = () => {
  // views: 'main' | 'lecture_list' | 'lecture_player' | 'library' | 'homeworks' | 'students'
  // 'create_lecture' | 'create_resource' | 'create_homework'
  const [currentView, setCurrentView]       = useState('main');
  const [selectedClass, setSelectedClass]   = useState(null);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [activeSubTab, setActiveSubTab]     = useState('Lectures');
  const [resourceFilter, setResourceFilter] = useState('all');

  const [classes, setClasses]         = useState([]);
  const [students, setStudents]       = useState([]);
  const [lectures, setLectures]       = useState([]);
  const [library, setLibrary]         = useState([]);
  const [homeworks, setHomeworks]     = useState([]);
  const [loading, setLoading]         = useState(true);
  const [teacherName, setTeacherName] = useState('Teacher');

  const [newLecture, setNewLecture]     = useState({ title: '', duration: '45', type: 'video' });
  const [lectureFile, setLectureFile]   = useState(null);
  const [newResource, setNewResource]   = useState({ title: '', author: '', type: 'book' });
  const [resourceFile, setResourceFile] = useState(null);
  const [newHomework, setNewHomework]   = useState({ title: '', description: '', selectedGroups: [] });
  const [homeworkFile, setHomeworkFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const videoRef = useRef(null);

  // ── All original Supabase logic — UNTOUCHED ──────────────────────
  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: prof } = await supabase.from('staff').select('*').eq('email', user.email).single();
        if (prof) setTeacherName(`${prof.first_name} ${prof.last_name}`);
        const fullName = prof ? `${prof.first_name} ${prof.last_name}` : '';
        const { data: cls } = await supabase.from('classes').select('*').eq('teacher_name', fullName);
        if (cls) setClasses(cls.map((c, i) => ({ ...c, colorIdx: i % CLASS_COLORS.length })));
      }
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    if (selectedClass) {
      const fetchDetails = async () => {
        const { data: lecData } = await supabase.from('lectures').select('*').eq('class_name', selectedClass.name);
        setLectures(lecData || []);
        const { data: libData } = await supabase.from('library_resources').select('*').eq('class_name', selectedClass.name);
        setLibrary(libData || []);
        const { data: hwData }  = await supabase.from('homeworks').select('*').eq('class_name', selectedClass.name).order('created_at', { ascending: false });
        setHomeworks(hwData || []);
        const { data: stdData } = await supabase.from('students').select('*').eq('group_name', selectedClass.name);
        setStudents(stdData || []);
      };
      fetchDetails();
    }
  }, [selectedClass]);

  const handleAddLecture = async (e) => {
    e.preventDefault(); setIsSubmitting(true);
    try {
      let finalFileUrl = '';
      if (lectureFile) {
        const fileExt = lectureFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `lectures/${fileName}`;
        const { error: uploadError } = await supabase.storage.from('class_materials').upload(filePath, lectureFile);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('class_materials').getPublicUrl(filePath);
        finalFileUrl = publicUrl;
      }
      const insertData = { class_name: selectedClass.name, title: newLecture.title || 'Untitled Lecture', duration: newLecture.duration, type: newLecture.type, thumbnail_url: finalFileUrl };
      const { data, error } = await supabase.from('lectures').insert([insertData]).select();
      if (error) throw error;
      setLectures([...lectures, data[0]]);
      setCurrentView('lecture_list');
      setNewLecture({ title: '', duration: '45', type: 'video' });
      setLectureFile(null);
      alert('Lecture uploaded successfully.');
    } catch (err) { alert('Error: ' + err.message); } finally { setIsSubmitting(false); }
  };

  const handleAddResource = async (e) => {
    e.preventDefault(); setIsSubmitting(true);
    try {
      let finalImgUrl = '';
      if (resourceFile) {
        const fileExt = resourceFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `covers/${fileName}`;
        const { error: uploadError } = await supabase.storage.from('class_materials').upload(filePath, resourceFile);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('class_materials').getPublicUrl(filePath);
        finalImgUrl = publicUrl;
      } else { finalImgUrl = 'https://images.unsplash.com/photo-1544716278-e513176f20b5?q=80&w=400'; }
      const insertData = { class_name: selectedClass.name, title: newResource.title || 'Untitled Resource', author: newResource.author || teacherName, type: newResource.type, img_url: finalImgUrl };
      const { data, error } = await supabase.from('library_resources').insert([insertData]).select();
      if (error) throw error;
      setLibrary([data[0], ...library]);
      setCurrentView('library');
      setNewResource({ title: '', author: '', type: 'book' });
      setResourceFile(null);
      alert('Library resource uploaded successfully.');
    } catch (err) { alert('Error: ' + err.message); } finally { setIsSubmitting(false); }
  };

  const handleAddHomework = async (e) => {
    e.preventDefault();
    if (newHomework.selectedGroups.length === 0) { alert('Please select at least one group.'); return; }
    setIsSubmitting(true);
    try {
      let finalFileUrl = null;
      if (homeworkFile) {
        const fileExt = homeworkFile.name.split('.').pop();
        const fileName = `${Date.now()}_hw_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `homeworks/${fileName}`;
        const { error: uploadError } = await supabase.storage.from('class_materials').upload(filePath, homeworkFile);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('class_materials').getPublicUrl(filePath);
        finalFileUrl = publicUrl;
      }
      const inserts = newHomework.selectedGroups.map(grpName => ({ class_name: grpName, title: newHomework.title, description: newHomework.description, file_url: finalFileUrl, teacher_name: teacherName }));
      const { error } = await supabase.from('homeworks').insert(inserts);
      if (error) throw error;
      if (newHomework.selectedGroups.includes(selectedClass.name)) {
        const { data: hwData } = await supabase.from('homeworks').select('*').eq('class_name', selectedClass.name).order('created_at', { ascending: false });
        setHomeworks(hwData || []);
      }
      setCurrentView('homeworks');
      setNewHomework({ title: '', description: '', selectedGroups: [] });
      setHomeworkFile(null);
      alert('Homework assigned successfully.');
    } catch (err) { alert('Error: ' + err.message); } finally { setIsSubmitting(false); }
  };

  const toggleGroupSelection = (grpName) => {
    setNewHomework(prev => ({
      ...prev,
      selectedGroups: prev.selectedGroups.includes(grpName)
        ? prev.selectedGroups.filter(g => g !== grpName)
        : [...prev.selectedGroups, grpName],
    }));
  };

  // ─────────────────────────────────────────────────────────────────
  // VIEW 1: MAIN — Course cards like screenshot 1
  // ─────────────────────────────────────────────────────────────────
  const renderMain = () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>

      {/* Left: main content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#1e293b' }}>My Classes</h1>
          <p style={{ margin: '5px 0 0', fontSize: 13, color: '#94a3b8' }}>Select a class to manage lectures, library, homework, and students.</p>
        </div>

        {/* Hero banner — "ACTIVE CURRICULUMS" matching screenshot 1 */}
        <div style={{ background: '#f1f5f9', borderRadius: 20, padding: '32px 36px', marginBottom: 28, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: 200, height: '100%', background: 'linear-gradient(to left, rgba(255,255,255,0.4), transparent)', pointerEvents: 'none' }} />
          <h2 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px' }}>ACTIVE CURRICULUMS</h2>
          <p style={{ margin: '0 0 20px', fontSize: 13, color: '#64748b' }}>Track your teaching schedule and manage your class content.</p>
          <button style={{ background: '#1e293b', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 22px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
            Teaching Guide
          </button>
        </div>

        {/* Class cards grid */}
        {loading ? (
          <p style={{ color: '#94a3b8', fontSize: 13 }}>Loading your classes...</p>
        ) : classes.length === 0 ? (
          <Card style={{ padding: '48px 24px', textAlign: 'center' }}>
            <p style={{ color: '#94a3b8', fontSize: 13, fontWeight: 600 }}>No classes assigned to you yet.</p>
          </Card>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
            {classes.map((cls, idx) => {
              const c = CLASS_COLORS[cls.colorIdx ?? idx % CLASS_COLORS.length];
              return (
                <div key={cls.id}
                  style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1px solid #f1f5f9', boxShadow: '0 1px 4px rgba(15,23,42,0.05)', cursor: 'pointer', transition: 'box-shadow .2s, transform .2s' }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(15,23,42,0.05)'; e.currentTarget.style.transform = 'none'; }}
                  onClick={() => { setSelectedClass(cls); setCurrentView('lecture_list'); setActiveSubTab('Lectures'); }}
                >
                  {/* Cover image / color block */}
                  <div style={{ height: 160, background: c.bg, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {/* Rating badge */}
                    <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(255,255,255,0.9)', borderRadius: 20, padding: '3px 10px', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 700, color: '#1e293b', backdropFilter: 'blur(4px)' }}>
                      {Icons.Star()} 4.8
                    </div>
                    <div style={{ width: 56, height: 56, borderRadius: 14, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                      {Icons.Book(c.accent)}
                    </div>
                  </div>

                  {/* Card body */}
                  <div style={{ padding: '18px 20px' }}>
                    <h3 style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 800, color: '#0f172a' }}>{cls.name}</h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#64748b' }}>
                        {Icons.Hash(c.accent)}
                        <span>{cls.capacity || '—'} Students</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#64748b' }}>
                        {Icons.Calendar(c.accent)}
                        <span>{cls.schedule || cls.language || 'Schedule TBD'}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: c.accent, fontWeight: 700 }}>
                        {Icons.Globe(c.accent)}
                        <span>Online Classroom</span>
                      </div>
                    </div>

                    <button style={{
                      width: '100%', padding: '11px 0', borderRadius: 10, border: 'none',
                      background: '#4318FF', color: '#fff', fontSize: 12, fontWeight: 800,
                      letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer',
                      transition: 'background .15s',
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = '#3730a3'}
                      onMouseLeave={e => e.currentTarget.style.background = '#4318FF'}
                    >
                      Open Class
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Right: status panel */}
      <div style={{ width: 240, flexShrink: 0 }}>
        <Card style={{ padding: '20px 22px' }}>
          <p style={{ margin: '0 0 12px', fontSize: 11, fontWeight: 800, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid #f1f5f9', paddingBottom: 12 }}>
            Status Notice
          </p>
          <p style={{ margin: '0 0 6px', fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Classes Assigned</p>
          <p style={{ margin: '0 0 16px', fontSize: 36, fontWeight: 800, color: '#0f172a', letterSpacing: '-1px' }}>{classes.length}</p>
          <p style={{ margin: 0, fontSize: 12, color: '#94a3b8', lineHeight: 1.6 }}>
            Click any class card to manage lectures, resources, homework and students.
          </p>
        </Card>
      </div>
    </div>
  );

  // ─────────────────────────────────────────────────────────────────
  // VIEW 2: CLASS DETAIL with tab navigation
  // ─────────────────────────────────────────────────────────────────
  const renderClassDetail = () => {
    return (
      <div>
        {/* Back + title */}
        <div style={{ marginBottom: 20 }}>
          <BackBtn onClick={() => setCurrentView('main')} label="Course Catalog" />
        </div>

        {/* Tab bar */}
        <TabBar
          tabs={['Lectures', 'Library', 'Homeworks', 'Students']}
          active={activeSubTab}
          onChange={(tab) => {
            setActiveSubTab(tab);
            if (tab === 'Lectures')  setCurrentView('lecture_list');
            if (tab === 'Library')   setCurrentView('library');
            if (tab === 'Homeworks') setCurrentView('homeworks');
            if (tab === 'Students')  setCurrentView('students');
          }}
        />

        {currentView === 'lecture_list' && renderLectureList()}
        {currentView === 'library'      && renderLibrary()}
        {currentView === 'homeworks'    && renderHomeworks()}
        {currentView === 'students'     && renderStudents()}
      </div>
    );
  };

  // ─────────────────────────────────────────────────────────────────
  // LECTURE LIST — matches screenshot 2 exactly
  // ─────────────────────────────────────────────────────────────────
  const renderLectureList = () => (
    <div>
      {/* Class title block */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: '0 0 8px', fontSize: 26, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px', textTransform: 'uppercase' }}>
          {selectedClass?.name}
        </h1>
        <div style={{ height: 2, background: '#4318FF', width: '100%', marginBottom: 20 }} />
        <p style={{ margin: 0, fontSize: 10, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Unit Curriculum</p>
      </div>

      {/* Upload button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <BtnPrimary onClick={() => setCurrentView('create_lecture')}>
          {Icons.Upload()} Upload Lecture
        </BtnPrimary>
      </div>

      {/* Lecture rows — numbered list matching screenshot 2 */}
      {lectures.length === 0 ? (
        <Card style={{ padding: '48px 24px', textAlign: 'center' }}>
          <p style={{ color: '#94a3b8', fontSize: 13, fontWeight: 600 }}>No lectures uploaded yet. Upload your first lecture above.</p>
        </Card>
      ) : (
        <Card style={{ padding: '8px 0', overflow: 'hidden' }}>
          {lectures.map((lec, idx) => (
            <div key={lec.id}
              style={{
                display: 'flex', alignItems: 'center', gap: 20,
                padding: '20px 28px',
                borderBottom: idx < lectures.length - 1 ? '1px solid #f8fafc' : 'none',
                transition: 'background .15s', cursor: 'pointer',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              onClick={() => { setSelectedLecture(lec); setCurrentView('lecture_player'); }}
            >
              {/* Number */}
              <span style={{ fontSize: 20, fontWeight: 800, color: '#e2e8f0', width: 32, flexShrink: 0, textAlign: 'right' }}>
                {String(idx + 1).padStart(2, '0')}
              </span>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                  {lec.title}
                </p>
                <p style={{ margin: '4px 0 0', fontSize: 10, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  RUNTIME: {lec.duration}:00
                </p>
              </div>

              {/* Available badge */}
              <span style={{ fontSize: 11, fontWeight: 700, color: '#4318FF', letterSpacing: '0.06em', textTransform: 'uppercase', flexShrink: 0 }}>
                AVAILABLE
              </span>

              {/* Play button */}
              <button style={{
                width: 42, height: 42, borderRadius: 12, border: 'none',
                background: '#4318FF', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', flexShrink: 0, transition: 'background .15s',
                boxShadow: '0 4px 12px rgba(67,24,255,0.3)',
              }}
                onMouseEnter={e => e.currentTarget.style.background = '#3730a3'}
                onMouseLeave={e => e.currentTarget.style.background = '#4318FF'}
                onClick={(e) => { e.stopPropagation(); setSelectedLecture(lec); setCurrentView('lecture_player'); }}
              >
                {Icons.Play()}
              </button>
            </div>
          ))}
        </Card>
      )}
    </div>
  );

  // ─────────────────────────────────────────────────────────────────
  // LECTURE PLAYER — matches screenshot 3 exactly
  // ─────────────────────────────────────────────────────────────────
  const renderLecturePlayer = () => {
    if (!selectedLecture) return null;
    const isPdf = selectedLecture.type === 'pdf';

    return (
      <div>
        {/* Tab bar stays visible */}
        <TabBar
          tabs={['Lectures', 'Library', 'Homeworks', 'Students']}
          active="Lectures"
          onChange={(tab) => {
            setActiveSubTab(tab);
            if (tab === 'Lectures')  setCurrentView('lecture_list');
            if (tab === 'Library')   setCurrentView('library');
            if (tab === 'Homeworks') setCurrentView('homeworks');
            if (tab === 'Students')  setCurrentView('students');
          }}
        />

        {/* Back link */}
        <div style={{ marginBottom: 24 }}>
          <BackBtn onClick={() => setCurrentView('lecture_list')} label="Back to Lectures" />
        </div>

        {/* Main grid: video left, assets right */}
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>

          {/* Left: video player */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Video player card */}
            <div style={{ background: '#0f172a', borderRadius: 18, overflow: 'hidden', position: 'relative', marginBottom: 24 }}>
              {isPdf ? (
                /* PDF viewer embed */
                <div style={{ width: '100%', height: 440, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
                  <div style={{ width: 64, height: 64, borderRadius: 16, background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {Icons.FilePdf('#818cf8')}
                  </div>
                  <p style={{ margin: 0, fontSize: 13, color: '#94a3b8', fontWeight: 600 }}>PDF Document</p>
                  <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>{selectedLecture.title}</p>
                  <a href={selectedLecture.thumbnail_url} target="_blank" rel="noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#4318FF', color: '#fff', padding: '10px 20px', borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: 'none', marginTop: 8 }}>
                    {Icons.Download('#fff')} Open PDF
                  </a>
                </div>
              ) : (
                /* Native HTML5 video player */
                <div style={{ position: 'relative' }}>
                  <video
                    ref={videoRef}
                    controls
                    style={{ width: '100%', height: 440, objectFit: 'contain', display: 'block', background: '#000' }}
                    src={selectedLecture.thumbnail_url || ''}
                  >
                    Your browser does not support the video tag.
                  </video>
                  {/* Currently streaming label */}
                  {selectedLecture.thumbnail_url && (
                    <div style={{ position: 'absolute', bottom: 16, left: 16, background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: 10, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '4px 12px', borderRadius: 6 }}>
                      CURRENTLY STREAMING: {selectedLecture.title}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Lecture info below player */}
            <div>
              <h2 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 900, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '-0.3px' }}>
                {selectedLecture.title}
              </h2>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                {selectedClass?.name} · Prof. {teacherName}
              </p>
            </div>
          </div>

          {/* Right: Lecture Assets panel — screenshot 3 */}
          <div style={{ width: 260, flexShrink: 0 }}>
            <Card style={{ padding: '20px 22px' }}>
              <p style={{ margin: '0 0 12px', fontSize: 11, fontWeight: 800, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: '1px solid #f1f5f9', paddingBottom: 12 }}>
                Lecture Assets
              </p>

              {/* Video file */}
              {selectedLecture.thumbnail_url && !isPdf && (
                <div style={{ background: '#f8fafc', borderRadius: 12, padding: '14px 16px', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {Icons.Video('#4318FF')}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {selectedLecture.title.toUpperCase().replace(/ /g, '_')}.MP4
                      </p>
                    </div>
                  </div>
                  <a href={selectedLecture.thumbnail_url} target="_blank" rel="noreferrer" download
                    style={{ display: 'block', textAlign: 'center', fontSize: 11, fontWeight: 800, color: '#4318FF', textTransform: 'uppercase', letterSpacing: '0.07em', textDecoration: 'none', padding: '6px 0' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#3730a3'}
                    onMouseLeave={e => e.currentTarget.style.color = '#4318FF'}
                  >
                    DOWNLOAD VIDEO
                  </a>
                </div>
              )}

              {/* PDF file — shown for both pdf type OR alongside video */}
              {(isPdf || selectedLecture.thumbnail_url) && (
                <div style={{ background: '#f8fafc', borderRadius: 12, padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {Icons.FilePdf()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {isPdf ? selectedLecture.title.toUpperCase().replace(/ /g, '_') + '.PDF' : 'LECTURE_NOTES.PDF'}
                      </p>
                    </div>
                  </div>
                  <a href={isPdf ? selectedLecture.thumbnail_url : '#'} target="_blank" rel="noreferrer" download
                    style={{ display: 'block', textAlign: 'center', fontSize: 11, fontWeight: 800, color: '#4318FF', textTransform: 'uppercase', letterSpacing: '0.07em', textDecoration: 'none', padding: '6px 0' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#3730a3'}
                    onMouseLeave={e => e.currentTarget.style.color = '#4318FF'}
                  >
                    DOWNLOAD PDF
                  </a>
                </div>
              )}

              {!selectedLecture.thumbnail_url && (
                <p style={{ fontSize: 12, color: '#94a3b8', textAlign: 'center', padding: '16px 0' }}>No assets available for this lecture.</p>
              )}
            </Card>

            {/* Navigation between lectures */}
            {lectures.length > 1 && (
              <Card style={{ padding: '16px 20px', marginTop: 14 }}>
                <p style={{ margin: '0 0 12px', fontSize: 11, fontWeight: 800, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Other Lectures</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {lectures.filter(l => l.id !== selectedLecture.id).slice(0, 4).map((lec, i) => (
                    <button key={lec.id} onClick={() => setSelectedLecture(lec)}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer', padding: '8px 10px', borderRadius: 8, textAlign: 'left', transition: 'background .15s', width: '100%' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    >
                      <div style={{ width: 28, height: 28, borderRadius: 8, background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {Icons.Play('#4318FF')}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lec.title}</p>
                        <p style={{ margin: 0, fontSize: 10, color: '#94a3b8' }}>{lec.duration} mins</p>
                      </div>
                    </button>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ─────────────────────────────────────────────────────────────────
  // LIBRARY
  // ─────────────────────────────────────────────────────────────────
  const renderLibrary = () => {
    const filteredLibrary = resourceFilter === 'all'
      ? library : library.filter(item => (item.type || 'book').toLowerCase() === resourceFilter.toLowerCase());
    return (
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}>{Icons.Search()}</span>
              <input type="text" placeholder="Search library..." style={{ width: '100%', background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: 10, padding: '10px 14px 10px 38px', fontSize: 13, color: '#1e293b', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <BtnPrimary onClick={() => setCurrentView('create_resource')}>{Icons.Plus()} Add Resource</BtnPrimary>
          </div>
          {filteredLibrary[0] ? (
            <Card style={{ overflow: 'hidden', position: 'relative', height: 240 }}>
              <img src={filteredLibrary[0].img_url} alt="Hero" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '20px 24px' }}>
                <p style={{ margin: '0 0 4px', fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>{filteredLibrary[0].author}</p>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#fff' }}>{filteredLibrary[0].title}</h2>
              </div>
            </Card>
          ) : (
            <Card style={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p style={{ color: '#94a3b8', fontSize: 13, fontWeight: 600 }}>No resources yet.</p>
            </Card>
          )}
          {filteredLibrary.length > 1 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 14 }}>
              {filteredLibrary.slice(1).map(item => (
                <div key={item.id}>
                  <div style={{ aspectRatio: '3/4', borderRadius: 10, overflow: 'hidden', background: '#f1f5f9', position: 'relative', marginBottom: 6 }}>
                    {item.img_url ? <img src={item.img_url} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{Icons.File()}</div>}
                    <span style={{ position: 'absolute', top: 6, right: 6, fontSize: 9, fontWeight: 700, textTransform: 'uppercase', padding: '2px 6px', borderRadius: 5, background: 'rgba(0,0,0,0.5)', color: '#fff' }}>{item.type || 'book'}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</p>
                  <p style={{ margin: '2px 0 0', fontSize: 11, color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.author}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{ width: 190, flexShrink: 0 }}>
          <p style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 700, color: '#1e293b' }}>Filter</p>
          {[{ key: 'book', label: 'Books', icon: Icons.Book('#4318FF'), bg: '#eef2ff', ab: '#4318FF' }, { key: 'video', label: 'Videos', icon: Icons.Video('#059669'), bg: '#ecfdf5', ab: '#059669' }, { key: 'note', label: 'Notes', icon: Icons.Notes('#9b51e0'), bg: '#f5f3ff', ab: '#9b51e0' }].map(({ key, label, icon, bg, ab }) => {
            const isA = resourceFilter === key;
            return (
              <div key={key} onClick={() => setResourceFilter(isA ? 'all' : key)}
                style={{ padding: '12px', borderRadius: 10, border: `2px solid ${isA ? ab : '#f1f5f9'}`, background: isA ? bg : '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, cursor: 'pointer', transition: 'all .15s', marginBottom: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>{icon}</div>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b' }}>{label}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ─────────────────────────────────────────────────────────────────
  // HOMEWORKS
  // ─────────────────────────────────────────────────────────────────
  const renderHomeworks = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
        <BtnPrimary onClick={() => { setNewHomework({ ...newHomework, selectedGroups: [selectedClass.name] }); setCurrentView('create_homework'); }}>
          {Icons.Plus()} Assign Homework
        </BtnPrimary>
      </div>
      {homeworks.length === 0 ? (
        <Card style={{ padding: '48px 24px', textAlign: 'center' }}>
          <p style={{ color: '#94a3b8', fontSize: 13, fontWeight: 600 }}>No homework assigned yet.</p>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {homeworks.map(hw => (
            <Card key={hw.id} style={{ padding: '20px 22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{Icons.Homework()}</div>
                <span style={{ fontSize: 11, color: '#94a3b8' }}>{new Date(hw.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <h4 style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 700, color: '#1e293b' }}>{hw.title}</h4>
              <p style={{ margin: '0 0 14px', fontSize: 13, color: '#64748b', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{hw.description}</p>
              {hw.file_url ? (
                <a href={hw.file_url} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '9px 0', borderRadius: 8, background: '#eef2ff', fontSize: 12, fontWeight: 700, color: '#4318FF', textDecoration: 'none' }}>
                  {Icons.Download()} Download Attachment
                </a>
              ) : (
                <div style={{ padding: '9px 0', borderRadius: 8, background: '#f8fafc', border: '1px dashed #e2e8f0', textAlign: 'center', fontSize: 12, fontWeight: 600, color: '#94a3b8' }}>No Attachment</div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  // ─────────────────────────────────────────────────────────────────
  // STUDENTS
  // ─────────────────────────────────────────────────────────────────
  const renderStudents = () => (
    <Card>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
            <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Student Name</th>
            <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Email</th>
            <th style={{ padding: '14px 20px', textAlign: 'right', fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {students.length === 0 ? (
            <tr><td colSpan="3" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>No students enrolled in this class.</td></tr>
          ) : students.map(s => (
            <tr key={s.id} style={{ borderBottom: '1px solid #f8fafc', transition: 'background .15s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <td style={{ padding: '14px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#eef2ff', color: '#4318FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', flexShrink: 0 }}>{s.first_name?.charAt(0)}</div>
                  <span style={{ fontWeight: 600, color: '#1e293b' }}>{s.first_name} {s.last_name}</span>
                </div>
              </td>
              <td style={{ padding: '14px 20px', color: '#64748b' }}>{s.email}</td>
              <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: '#ecfdf5', color: '#059669' }}>Active</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );

  // ─────────────────────────────────────────────────────────────────
  // CREATE LECTURE form
  // ─────────────────────────────────────────────────────────────────
  const renderCreateLecture = () => (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
        <button onClick={() => setCurrentView('lecture_list')} style={{ width: 36, height: 36, borderRadius: 10, border: '1px solid #f1f5f9', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
          onMouseEnter={e => e.currentTarget.style.background = '#eef2ff'} onMouseLeave={e => e.currentTarget.style.background = '#f8fafc'}>
          {Icons.ArrowLeft()}
        </button>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#1e293b' }}>Upload Lecture</h1>
          <p style={{ margin: '3px 0 0', fontSize: 13, color: '#94a3b8' }}>Add a new lecture for {selectedClass?.name}.</p>
        </div>
      </div>
      <Card style={{ padding: '28px 32px' }}>
        <form onSubmit={handleAddLecture} style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 260, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <Label>Class</Label>
              <div style={{ background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#64748b', fontWeight: 600 }}>{selectedClass?.name}</div>
            </div>
            <div>
              <Label>Lecture File (PDF or Video)</Label>
              <UploadZone file={lectureFile} onFile={setLectureFile} accept="video/*,application/pdf" hint="PDF or video files" icon={Icons.Upload()} />
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 260, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div><Label>Lecture Title</Label><Input type="text" required placeholder="e.g. Chapter 1: Introduction" value={newLecture.title} onChange={e => setNewLecture({ ...newLecture, title: e.target.value })} /></div>
            <div><Label>Duration (minutes)</Label><Input type="number" required value={newLecture.duration} onChange={e => setNewLecture({ ...newLecture, duration: e.target.value })} /></div>
            <div>
              <Label>File Type</Label>
              <div style={{ display: 'flex', gap: 12 }}>
                {['pdf', 'video'].map(t => (
                  <div key={t} onClick={() => setNewLecture({ ...newLecture, type: t })}
                    style={{ flex: 1, padding: '16px', borderRadius: 12, cursor: 'pointer', border: `2px solid ${newLecture.type === t ? '#4318FF' : '#f1f5f9'}`, background: newLecture.type === t ? '#eef2ff' : '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, transition: 'all .15s' }}>
                    {t === 'pdf' ? Icons.File('#4318FF') : Icons.Video('#4318FF')}
                    <span style={{ fontSize: 12, fontWeight: 700, color: newLecture.type === t ? '#4318FF' : '#94a3b8', textTransform: 'uppercase' }}>{t}</span>
                  </div>
                ))}
              </div>
            </div>
            <BtnPrimary type="submit" disabled={isSubmitting || !lectureFile} style={{ marginTop: 8, justifyContent: 'center' }}>
              {isSubmitting ? 'Uploading...' : !lectureFile ? 'Select a file first' : 'Upload & Save'}
            </BtnPrimary>
          </div>
        </form>
      </Card>
    </div>
  );

  // ─────────────────────────────────────────────────────────────────
  // CREATE RESOURCE form
  // ─────────────────────────────────────────────────────────────────
  const renderCreateResource = () => (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
        <button onClick={() => setCurrentView('library')} style={{ width: 36, height: 36, borderRadius: 10, border: '1px solid #f1f5f9', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
          onMouseEnter={e => e.currentTarget.style.background = '#eef2ff'} onMouseLeave={e => e.currentTarget.style.background = '#f8fafc'}>
          {Icons.ArrowLeft()}
        </button>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#1e293b' }}>Add Library Resource</h1>
          <p style={{ margin: '3px 0 0', fontSize: 13, color: '#94a3b8' }}>Upload a book, video, or notes for {selectedClass?.name}.</p>
        </div>
      </div>
      <Card style={{ padding: '28px 32px' }}>
        <form onSubmit={handleAddResource} style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 260, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div><Label>Class</Label><div style={{ background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#64748b', fontWeight: 600 }}>{selectedClass?.name}</div></div>
            <div>
              <Label>Cover Image</Label>
              <div style={{ width: '100%', minHeight: 180, borderRadius: 14, overflow: 'hidden', border: '2px dashed #e2e8f0', background: '#f8fafc', position: 'relative', cursor: 'pointer' }}>
                <input type="file" accept="image/*" onChange={e => setResourceFile(e.target.files[0])} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', zIndex: 2 }} />
                {resourceFile ? <img src={URL.createObjectURL(resourceFile)} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', minHeight: 180 }} /> : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, gap: 8, pointerEvents: 'none' }}>
                    {Icons.Book()}<p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#64748b' }}>Upload cover image</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 260, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div><Label>Resource Title</Label><Input type="text" required placeholder="e.g. Cambridge English Grammar" value={newResource.title} onChange={e => setNewResource({ ...newResource, title: e.target.value })} /></div>
            <div><Label>Author / Publisher</Label><Input type="text" required placeholder="e.g. Raymond Murphy" value={newResource.author} onChange={e => setNewResource({ ...newResource, author: e.target.value })} /></div>
            <div>
              <Label>Resource Type</Label>
              <div style={{ display: 'flex', gap: 10 }}>
                {[{ key: 'book', label: 'Book', icon: Icons.Book('#4318FF') }, { key: 'video', label: 'Video', icon: Icons.Video('#059669') }, { key: 'note', label: 'Notes', icon: Icons.Notes('#9b51e0') }].map(({ key, label, icon }) => (
                  <div key={key} onClick={() => setNewResource({ ...newResource, type: key })}
                    style={{ flex: 1, padding: '14px 8px', borderRadius: 12, cursor: 'pointer', border: `2px solid ${newResource.type === key ? '#4318FF' : '#f1f5f9'}`, background: newResource.type === key ? '#eef2ff' : '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, transition: 'all .15s' }}>
                    {icon}<span style={{ fontSize: 11, fontWeight: 700, color: newResource.type === key ? '#4318FF' : '#94a3b8' }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <BtnPrimary type="submit" disabled={isSubmitting} style={{ marginTop: 8, justifyContent: 'center' }}>{isSubmitting ? 'Uploading...' : 'Upload Resource'}</BtnPrimary>
          </div>
        </form>
      </Card>
    </div>
  );

  // ─────────────────────────────────────────────────────────────────
  // CREATE HOMEWORK form
  // ─────────────────────────────────────────────────────────────────
  const renderCreateHomework = () => (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
        <button onClick={() => setCurrentView('homeworks')} style={{ width: 36, height: 36, borderRadius: 10, border: '1px solid #f1f5f9', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
          onMouseEnter={e => e.currentTarget.style.background = '#eef2ff'} onMouseLeave={e => e.currentTarget.style.background = '#f8fafc'}>
          {Icons.ArrowLeft()}
        </button>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#1e293b' }}>Assign Homework</h1>
          <p style={{ margin: '3px 0 0', fontSize: 13, color: '#94a3b8' }}>Assign tasks to one or more class groups.</p>
        </div>
      </div>
      <Card style={{ padding: '28px 32px' }}>
        <form onSubmit={handleAddHomework} style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 260, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <Label>Select Groups</Label>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#4318FF', background: '#eef2ff', padding: '2px 10px', borderRadius: 20 }}>{newHomework.selectedGroups.length} selected</span>
              </div>
              <Card style={{ padding: '14px', border: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {classes.map(cls => {
                    const isSel = newHomework.selectedGroups.includes(cls.name);
                    return (
                      <label key={cls.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, cursor: 'pointer', border: `1px solid ${isSel ? '#4318FF' : '#f1f5f9'}`, background: isSel ? '#eef2ff' : '#f8fafc', transition: 'all .15s' }}>
                        <input type="checkbox" checked={isSel} onChange={() => toggleGroupSelection(cls.name)} style={{ width: 15, height: 15, accentColor: '#4318FF', cursor: 'pointer' }} />
                        <span style={{ fontSize: 13, fontWeight: 600, color: isSel ? '#4318FF' : '#1e293b' }}>{cls.name}</span>
                        {isSel && <span style={{ marginLeft: 'auto' }}>{Icons.Check()}</span>}
                      </label>
                    );
                  })}
                </div>
              </Card>
            </div>
            <div><Label>Attachment (Optional)</Label><UploadZone file={homeworkFile} onFile={setHomeworkFile} accept="application/pdf,image/*,.doc,.docx" hint="PDF, Word, or image" icon={Icons.Paperclip()} /></div>
          </div>
          <div style={{ flex: 1, minWidth: 260, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div><Label>Homework Title</Label><Input type="text" required placeholder="e.g. Grammar Exercises Unit 4" value={newHomework.title} onChange={e => setNewHomework({ ...newHomework, title: e.target.value })} /></div>
            <div><Label>Instructions / Description</Label><Textarea required rows={7} placeholder="Write instructions for students..." value={newHomework.description} onChange={e => setNewHomework({ ...newHomework, description: e.target.value })} /></div>
            <BtnPrimary type="submit" disabled={isSubmitting} style={{ justifyContent: 'center' }}>{isSubmitting ? 'Assigning...' : 'Send to Selected Groups'}</BtnPrimary>
          </div>
        </form>
      </Card>
    </div>
  );

  // ─────────────────────────────────────────────────────────────────
  // ROOT RENDER — view router
  // ─────────────────────────────────────────────────────────────────

  // Class detail sub-views that show tab bar
  const classDetailViews = ['lecture_list', 'library', 'homeworks', 'students'];

  return (
    <div style={{ width: '100%', fontFamily: "'Inter','Segoe UI',sans-serif" }}>

      {/* Main class listing */}
      {currentView === 'main' && renderMain()}

      {/* Class detail with tab bar (lecture list, library, homeworks, students) */}
      {classDetailViews.includes(currentView) && renderClassDetail()}

      {/* Lecture player — has its own tab bar inline */}
      {currentView === 'lecture_player' && (
        <div>
          <div style={{ marginBottom: 16 }}>
            <BackBtn onClick={() => setCurrentView('main')} label="Course Catalog" />
          </div>
          {renderLecturePlayer()}
        </div>
      )}

      {/* Create forms */}
      {currentView === 'create_lecture'  && renderCreateLecture()}
      {currentView === 'create_resource' && renderCreateResource()}
      {currentView === 'create_homework' && renderCreateHomework()}

      <style>{`* { box-sizing: border-box; }`}</style>
    </div>
  );
};

export default TeacherClasses;
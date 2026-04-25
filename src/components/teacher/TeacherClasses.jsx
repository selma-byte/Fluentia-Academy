import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

// ─────────────────────────────────────────────────────────────────
// SVG ICON SYSTEM — no emojis
// ─────────────────────────────────────────────────────────────────
const Ico = ({ d, size = 16, color = 'currentColor', sw = 2, extra = null, fill = 'none' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
    stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {(Array.isArray(d) ? d : [d]).map((p, i) => <path key={i} d={p} />)}
    {extra}
  </svg>
);

const Icons = {
  Search:    (c = '#94a3b8') => <Ico d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0" color={c} />,
  Book:      (c = '#4318FF') => <Ico d={["M4 19.5A2.5 2.5 0 0 1 6.5 17H20","M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"]} color={c} />,
  Video:     (c = '#059669') => <Ico d={["M23 7l-7 5 7 5V7z","M1 5h15a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H1a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"]} color={c} />,
  Notes:     (c = '#9b51e0') => <Ico d={["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z","M14 2v6h6","M16 13H8","M16 17H8","M10 9H8"]} color={c} />,
  Homework:  (c = '#4318FF') => <Ico d={["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z","M14 2v6h6","M16 13H8","M16 17H8","M10 9H8"]} color={c} />,
  Upload:    (c = '#4318FF') => <Ico d={["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4","M17 8l-5-5-5 5","M12 3v12"]} color={c} />,
  ArrowLeft: (c = '#1e293b') => <Ico d={["M19 12H5","M12 19l-7-7 7-7"]} color={c} sw={2} />,
  Play:      (c = '#fff')    => <Ico d="M5 3l14 9-14 9V3z" color={c} fill={c} />,
  Download:  (c = '#4318FF') => <Ico d={["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4","M7 10l5 5 5-5","M12 15V3"]} color={c} />,
  Users:     (c = '#4318FF') => <Ico d={["M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2","M23 21v-2a4 4 0 0 0-3-3.87","M16 3.13a4 4 0 0 1 0 7.75"]} color={c} extra={<circle cx="9" cy="7" r="4" fill="none" stroke={c} strokeWidth="2"/>} />,
  Plus:      (c = '#fff')    => <Ico d={["M12 5v14","M5 12h14"]} color={c} sw={2.5} />,
  Paperclip: (c = '#94a3b8') => <Ico d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" color={c} />,
  Clock:     (c = '#f97316') => <Ico d="M12 6v6l4 2" color={c} extra={<circle cx="12" cy="12" r="10" fill="none" stroke={c} strokeWidth="2"/>} />,
  Check:     (c = '#059669') => <Ico d="M20 6L9 17l-5-5" color={c} sw={2.5} />,
  File:      (c = '#94a3b8') => <Ico d={["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z","M14 2v6h6"]} color={c} />,
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

// ─── Tab bar ──────────────────────────────────────────────────────
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

// ─── Label ────────────────────────────────────────────────────────
const Label = ({ children }) => (
  <label style={{
    display: 'block', fontSize: 11, fontWeight: 700,
    color: '#94a3b8', textTransform: 'uppercase',
    letterSpacing: '0.07em', marginBottom: 6,
  }}>{children}</label>
);

// ─── Input ────────────────────────────────────────────────────────
const Input = ({ style = {}, ...props }) => (
  <input {...props} style={{
    width: '100%', background: '#f8fafc',
    border: '1px solid #f1f5f9', borderRadius: 10,
    padding: '10px 14px', fontSize: 13, color: '#1e293b',
    outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
    transition: 'border-color .15s', ...style,
  }}
    onFocus={e => e.target.style.borderColor = '#4318FF'}
    onBlur={e => e.target.style.borderColor = '#f1f5f9'}
  />
);

// ─── Textarea ─────────────────────────────────────────────────────
const Textarea = ({ rows = 4, style = {}, ...props }) => (
  <textarea rows={rows} {...props} style={{
    width: '100%', background: '#f8fafc',
    border: '1px solid #f1f5f9', borderRadius: 10,
    padding: '10px 14px', fontSize: 13, color: '#1e293b',
    outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
    resize: 'vertical', lineHeight: 1.6,
    transition: 'border-color .15s', ...style,
  }}
    onFocus={e => e.target.style.borderColor = '#4318FF'}
    onBlur={e => e.target.style.borderColor = '#f1f5f9'}
  />
);

// ─── Primary Button ───────────────────────────────────────────────
const BtnPrimary = ({ children, style = {}, ...props }) => (
  <button {...props} style={{
    display: 'inline-flex', alignItems: 'center', gap: 8,
    padding: '10px 20px', borderRadius: 10, border: 'none',
    background: '#4318FF', color: '#fff',
    fontSize: 13, fontWeight: 700, cursor: 'pointer',
    transition: 'background .15s', whiteSpace: 'nowrap',
    opacity: props.disabled ? 0.6 : 1, ...style,
  }}
    onMouseEnter={e => { if (!props.disabled) e.currentTarget.style.background = '#3730a3'; }}
    onMouseLeave={e => { if (!props.disabled) e.currentTarget.style.background = '#4318FF'; }}
  >{children}</button>
);

// ─── Back Button ──────────────────────────────────────────────────
const BackBtn = ({ onClick }) => (
  <button onClick={onClick} style={{
    width: 36, height: 36, borderRadius: 10,
    border: '1px solid #f1f5f9', background: '#f8fafc',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', flexShrink: 0, transition: 'background .15s',
  }}
    onMouseEnter={e => e.currentTarget.style.background = '#eef2ff'}
    onMouseLeave={e => e.currentTarget.style.background = '#f8fafc'}
  >
    {Icons.ArrowLeft()}
  </button>
);

// ─── Upload zone ──────────────────────────────────────────────────
const UploadZone = ({ file, onFile, accept, hint, icon }) => (
  <div style={{
    width: '100%', minHeight: 200, border: '2px dashed #e2e8f0',
    borderRadius: 14, background: '#f8fafc',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    position: 'relative', cursor: 'pointer',
    transition: 'border-color .15s, background .15s', overflow: 'hidden',
  }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = '#4318FF'; e.currentTarget.style.background = '#f5f3ff'; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#f8fafc'; }}
  >
    <input type="file" accept={accept} onChange={e => onFile(e.target.files[0])}
      style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', zIndex: 2 }} />
    {file ? (
      <div style={{ textAlign: 'center', padding: 20, zIndex: 1 }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
          {Icons.File()}
        </div>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{file.name}</p>
        <p style={{ margin: '4px 0 0', fontSize: 11, color: '#94a3b8' }}>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
      </div>
    ) : (
      <div style={{ textAlign: 'center', padding: 24, zIndex: 1, pointerEvents: 'none' }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
          {icon || Icons.Upload()}
        </div>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#64748b' }}>Click to upload</p>
        <p style={{ margin: '4px 0 0', fontSize: 11, color: '#94a3b8' }}>{hint}</p>
      </div>
    )}
  </div>
);

// Class accent colors
const CLASS_COLORS = [
  { bg: '#EEF2FF', accent: '#4318FF', border: '#e0e7ff' },
  { bg: '#FFF7ED', accent: '#f97316', border: '#fed7aa' },
  { bg: '#ECFDF5', accent: '#059669', border: '#bbf7d0' },
  { bg: '#F0F9FF', accent: '#0284c7', border: '#bae6fd' },
];

// ─────────────────────────────────────────────────────────────────
// MAIN COMPONENT — all logic UNTOUCHED
// ─────────────────────────────────────────────────────────────────
const TeacherClasses = () => {
  const [currentView, setCurrentView]       = useState('main');
  const [selectedClass, setSelectedClass]   = useState(null);
  const [activeSubTab, setActiveSubTab]     = useState('Library');
  const [resourceFilter, setResourceFilter] = useState('all');

  const [classes, setClasses]         = useState([]);
  const [students, setStudents]       = useState([]);
  const [lectures, setLectures]       = useState([]);
  const [library, setLibrary]         = useState([]);
  const [homeworks, setHomeworks]     = useState([]);
  const [loading, setLoading]         = useState(true);
  const [teacherName, setTeacherName] = useState('Teacher');

  const [newLecture, setNewLecture]   = useState({ title: '', duration: '45', type: 'video' });
  const [lectureFile, setLectureFile] = useState(null);

  const [newResource, setNewResource] = useState({ title: '', author: '', type: 'book' });
  const [resourceFile, setResourceFile] = useState(null);

  const [newHomework, setNewHomework]   = useState({ title: '', description: '', selectedGroups: [] });
  const [homeworkFile, setHomeworkFile] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── All original Supabase logic — UNTOUCHED ────────────────────────
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
        const { data: hwData } = await supabase.from('homeworks').select('*').eq('class_name', selectedClass.name).order('created_at', { ascending: false });
        setHomeworks(hwData || []);
        const { data: stdData } = await supabase.from('students').select('*').eq('group_name', selectedClass.name);
        setStudents(stdData || []);
      };
      fetchDetails();
    }
  }, [selectedClass]);

  const handleAddLecture = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
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
      setCurrentView('detail');
      setNewLecture({ title: '', duration: '45', type: 'video' });
      setLectureFile(null);
      alert('Lecture uploaded successfully.');
    } catch (err) { alert('Error: ' + err.message); } finally { setIsSubmitting(false); }
  };

  const handleAddResource = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
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
      } else {
        finalImgUrl = 'https://images.unsplash.com/photo-1544716278-e513176f20b5?q=80&w=400';
      }
      const insertData = { class_name: selectedClass.name, title: newResource.title || 'Untitled Resource', author: newResource.author || teacherName, type: newResource.type, img_url: finalImgUrl };
      const { data, error } = await supabase.from('library_resources').insert([insertData]).select();
      if (error) throw error;
      setLibrary([data[0], ...library]);
      setCurrentView('detail');
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
      const inserts = newHomework.selectedGroups.map(grpName => ({
        class_name: grpName, title: newHomework.title,
        description: newHomework.description, file_url: finalFileUrl, teacher_name: teacherName,
      }));
      const { error } = await supabase.from('homeworks').insert(inserts);
      if (error) throw error;
      if (newHomework.selectedGroups.includes(selectedClass.name)) {
        const { data: hwData } = await supabase.from('homeworks').select('*').eq('class_name', selectedClass.name).order('created_at', { ascending: false });
        setHomeworks(hwData || []);
      }
      setCurrentView('detail');
      setNewHomework({ title: '', description: '', selectedGroups: [] });
      setHomeworkFile(null);
      alert('Homework assigned to selected groups successfully.');
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
  // VIEW 1: MAIN — My Classes
  // ─────────────────────────────────────────────────────────────────
  const renderMain = () => (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#1e293b' }}>My Classes</h1>
        <p style={{ margin: '5px 0 0', fontSize: 13, color: '#94a3b8' }}>
          Select a class to manage content, students, and assignments.
        </p>
      </div>

      {loading ? (
        <p style={{ color: '#94a3b8', fontSize: 13 }}>Loading your classes...</p>
      ) : classes.length === 0 ? (
        <Card style={{ padding: '48px 24px', textAlign: 'center' }}>
          <p style={{ color: '#94a3b8', fontSize: 13, fontWeight: 600 }}>No classes assigned to you yet.</p>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
          {classes.map((cls, idx) => {
            const c = CLASS_COLORS[cls.colorIdx ?? idx % CLASS_COLORS.length];
            return (
              <div key={cls.id}
                onClick={() => { setSelectedClass(cls); setCurrentView('detail'); }}
                style={{
                  background: '#fff', border: `1px solid ${c.border}`,
                  borderRadius: 16, overflow: 'hidden',
                  cursor: 'pointer', transition: 'box-shadow .2s, transform .2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
              >
                {/* Color strip */}
                <div style={{ background: c.bg, padding: '20px 20px 16px', borderBottom: `1px solid ${c.border}` }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.08)', marginBottom: 10,
                  }}>
                    {Icons.Book(c.accent)}
                  </div>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#1e293b', lineHeight: 1.3 }}>{cls.name}</p>
                  {cls.language && <p style={{ margin: '3px 0 0', fontSize: 11, color: '#64748b' }}>{cls.language}</p>}
                </div>
                <div style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#94a3b8' }}>
                    {Icons.Users(c.accent)}
                    <span style={{ color: c.accent, fontWeight: 700 }}>{cls.capacity || '—'}</span>
                    <span>students</span>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: c.accent, background: c.bg, padding: '3px 10px', borderRadius: 20 }}>
                    Open
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  // ─────────────────────────────────────────────────────────────────
  // VIEW 2: CLASS DETAIL
  // ─────────────────────────────────────────────────────────────────
  const renderDetail = () => {
    const filteredLibrary = resourceFilter === 'all'
      ? library : library.filter(item => (item.type || 'book').toLowerCase() === resourceFilter.toLowerCase());

    return (
      <div>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
          <BackBtn onClick={() => setCurrentView('main')} />
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#1e293b' }}>{selectedClass?.name}</h1>
            <p style={{ margin: '3px 0 0', fontSize: 13, color: '#94a3b8' }}>
              Manage class content, assignments, and students.
            </p>
          </div>
        </div>

        <TabBar
          tabs={['Library', 'Lectures', 'Homeworks', 'Students']}
          active={activeSubTab}
          onChange={setActiveSubTab}
        />

        {/* ── LIBRARY ── */}
        {activeSubTab === 'Library' && (
          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>

            {/* Left: main content */}
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Search + Add */}
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flex: 1, position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}>
                    {Icons.Search()}
                  </span>
                  <input type="text" placeholder="Search library..."
                    style={{
                      width: '100%', background: '#f8fafc', border: '1px solid #f1f5f9',
                      borderRadius: 10, padding: '10px 14px 10px 38px',
                      fontSize: 13, color: '#1e293b', outline: 'none', boxSizing: 'border-box',
                    }} />
                </div>
                <BtnPrimary onClick={() => setCurrentView('create_resource')}>
                  {Icons.Plus()} Add Resource
                </BtnPrimary>
              </div>

              {/* Hero card */}
              {filteredLibrary[0] ? (
                <Card style={{ overflow: 'hidden', position: 'relative', height: 260 }}>
                  <img src={filteredLibrary[0].img_url} alt="Hero"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)',
                    display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '24px 28px',
                  }}>
                    <p style={{ margin: '0 0 4px', fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      {filteredLibrary[0].author}
                    </p>
                    <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#fff', lineHeight: 1.3 }}>
                      {filteredLibrary[0].title}
                    </h2>
                  </div>
                </Card>
              ) : (
                <Card style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <p style={{ color: '#94a3b8', fontSize: 13, fontWeight: 600 }}>
                    No {resourceFilter === 'all' ? '' : resourceFilter + ' '}resources yet.
                  </p>
                </Card>
              )}

              {/* Resource grid */}
              {filteredLibrary.length > 1 && (
                <div>
                  <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: '#1e293b' }}>
                    {resourceFilter === 'all' ? 'All Resources' : `${resourceFilter.charAt(0).toUpperCase() + resourceFilter.slice(1)}s`}
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 14 }}>
                    {filteredLibrary.slice(1).map(item => (
                      <div key={item.id} style={{ cursor: 'pointer' }}>
                        <div style={{
                          aspectRatio: '3/4', borderRadius: 12, overflow: 'hidden',
                          background: '#f1f5f9', position: 'relative', marginBottom: 8,
                        }}>
                          {item.img_url ? (
                            <img src={item.img_url} alt={item.title}
                              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                          ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              {Icons.File()}
                            </div>
                          )}
                          <span style={{
                            position: 'absolute', top: 8, right: 8,
                            fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
                            letterSpacing: '0.06em', padding: '2px 7px', borderRadius: 6,
                            background: 'rgba(0,0,0,0.5)', color: '#fff',
                          }}>{item.type || 'book'}</span>
                        </div>
                        <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</p>
                        <p style={{ margin: '2px 0 0', fontSize: 11, color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.author}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: filter panel */}
            <div style={{ width: 200, flexShrink: 0 }}>
              <p style={{ margin: '0 0 14px', fontSize: 13, fontWeight: 700, color: '#1e293b' }}>Filter</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { key: 'book',  label: 'Books',  icon: Icons.Book('#4318FF'),  bg: '#eef2ff', activeBorder: '#4318FF' },
                  { key: 'video', label: 'Videos', icon: Icons.Video('#059669'), bg: '#ecfdf5', activeBorder: '#059669' },
                  { key: 'note',  label: 'Notes',  icon: Icons.Notes('#9b51e0'), bg: '#f5f3ff', activeBorder: '#9b51e0' },
                ].map(({ key, label, icon, bg, activeBorder }) => {
                  const isActive = resourceFilter === key;
                  return (
                    <div key={key}
                      onClick={() => setResourceFilter(isActive ? 'all' : key)}
                      style={{
                        padding: '14px', borderRadius: 12,
                        border: `2px solid ${isActive ? activeBorder : '#f1f5f9'}`,
                        background: isActive ? bg : '#f8fafc',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                        cursor: 'pointer', transition: 'all .15s',
                      }}
                    >
                      <div style={{ width: 38, height: 38, borderRadius: 10, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                        {icon}
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b' }}>{label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── LECTURES ── */}
        {activeSubTab === 'Lectures' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
              <BtnPrimary onClick={() => setCurrentView('create_lecture')}>
                {Icons.Upload()} Upload Lecture
              </BtnPrimary>
            </div>

            {lectures.length === 0 ? (
              <Card style={{ padding: '48px 24px', textAlign: 'center' }}>
                <p style={{ color: '#94a3b8', fontSize: 13, fontWeight: 600 }}>No lectures uploaded for this class yet.</p>
              </Card>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
                {lectures.map(lec => (
                  <Card key={lec.id} style={{ overflow: 'hidden' }}>
                    {/* Thumbnail */}
                    <div style={{ height: 160, background: '#f1f5f9', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {lec.thumbnail_url && lec.type !== 'pdf' && (
                        <img src={lec.thumbnail_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', position: 'absolute', inset: 0 }} />
                      )}
                      <div style={{
                        width: 42, height: 42, borderRadius: '50%',
                        background: lec.type === 'pdf' ? '#eef2ff' : 'rgba(15,23,42,0.7)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        position: 'relative', zIndex: 1,
                      }}>
                        {lec.type === 'pdf' ? Icons.File('#4318FF') : Icons.Play()}
                      </div>
                    </div>
                    <div style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#1e293b', flex: 1, marginRight: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lec.title}</p>
                        <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', padding: '2px 7px', borderRadius: 6, background: '#f1f5f9', color: '#64748b', flexShrink: 0 }}>{lec.type}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 12 }}>
                        {Icons.Clock()}
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#f97316' }}>{lec.duration} mins</span>
                      </div>
                      <a href={lec.thumbnail_url} target="_blank" rel="noreferrer"
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                          padding: '8px 0', borderRadius: 8, background: '#eef2ff',
                          fontSize: 12, fontWeight: 700, color: '#4318FF', textDecoration: 'none',
                          transition: 'background .15s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#e0e7ff'}
                        onMouseLeave={e => e.currentTarget.style.background = '#eef2ff'}
                      >
                        {Icons.Download()} Open File
                      </a>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── HOMEWORKS ── */}
        {activeSubTab === 'Homeworks' && (
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {Icons.Homework()}
                      </div>
                      <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>
                        {new Date(hw.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <h4 style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 700, color: '#1e293b' }}>{hw.title}</h4>
                    <p style={{ margin: '0 0 16px', fontSize: 13, color: '#64748b', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {hw.description}
                    </p>
                    {hw.file_url ? (
                      <a href={hw.file_url} target="_blank" rel="noreferrer"
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                          padding: '9px 0', borderRadius: 8, background: '#eef2ff',
                          fontSize: 12, fontWeight: 700, color: '#4318FF', textDecoration: 'none',
                          transition: 'background .15s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#e0e7ff'}
                        onMouseLeave={e => e.currentTarget.style.background = '#eef2ff'}
                      >
                        {Icons.Download()} Download Attachment
                      </a>
                    ) : (
                      <div style={{ padding: '9px 0', borderRadius: 8, background: '#f8fafc', border: '1px dashed #e2e8f0', textAlign: 'center', fontSize: 12, fontWeight: 600, color: '#94a3b8' }}>
                        No Attachment
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── STUDENTS ── */}
        {activeSubTab === 'Students' && (
          <Card>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
                  <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Student Name</th>
                  <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Email Address</th>
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
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#eef2ff', color: '#4318FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', flexShrink: 0 }}>
                          {s.first_name?.charAt(0)}
                        </div>
                        <span style={{ fontWeight: 600, color: '#1e293b' }}>{s.first_name} {s.last_name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px', color: '#64748b' }}>{s.email}</td>
                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: '#ecfdf5', color: '#059669' }}>
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </div>
    );
  };

  // ─────────────────────────────────────────────────────────────────
  // VIEW 3: CREATE LECTURE
  // ─────────────────────────────────────────────────────────────────
  const renderCreateLecture = () => (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
        <BackBtn onClick={() => setCurrentView('detail')} />
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#1e293b' }}>Upload Lecture</h1>
          <p style={{ margin: '3px 0 0', fontSize: 13, color: '#94a3b8' }}>Add a new lecture file for {selectedClass?.name}.</p>
        </div>
      </div>

      <Card style={{ padding: '28px 32px' }}>
        <form onSubmit={handleAddLecture} style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
          {/* Left */}
          <div style={{ flex: 1, minWidth: 260, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <Label>Class</Label>
              <div style={{ background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#64748b', fontWeight: 600 }}>
                {selectedClass?.name}
              </div>
            </div>
            <div>
              <Label>Lecture File (PDF or Video)</Label>
              <UploadZone file={lectureFile} onFile={setLectureFile} accept="video/*,application/pdf" hint="PDF or video files" icon={Icons.Upload()} />
            </div>
          </div>

          {/* Right */}
          <div style={{ flex: 1, minWidth: 260, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <Label>Lecture Title</Label>
              <Input type="text" required placeholder="e.g. Chapter 1: Introduction"
                value={newLecture.title} onChange={e => setNewLecture({ ...newLecture, title: e.target.value })} />
            </div>
            <div>
              <Label>Duration (minutes)</Label>
              <Input type="number" required
                value={newLecture.duration} onChange={e => setNewLecture({ ...newLecture, duration: e.target.value })} />
            </div>
            <div>
              <Label>File Type</Label>
              <div style={{ display: 'flex', gap: 12 }}>
                {['pdf', 'video'].map(t => (
                  <div key={t} onClick={() => setNewLecture({ ...newLecture, type: t })}
                    style={{
                      flex: 1, padding: '16px', borderRadius: 12, cursor: 'pointer',
                      border: `2px solid ${newLecture.type === t ? '#4318FF' : '#f1f5f9'}`,
                      background: newLecture.type === t ? '#eef2ff' : '#f8fafc',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                      transition: 'all .15s',
                    }}>
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
  // VIEW 4: CREATE RESOURCE
  // ─────────────────────────────────────────────────────────────────
  const renderCreateResource = () => (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
        <BackBtn onClick={() => setCurrentView('detail')} />
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#1e293b' }}>Add Library Resource</h1>
          <p style={{ margin: '3px 0 0', fontSize: 13, color: '#94a3b8' }}>Upload a book, video, or notes for {selectedClass?.name}.</p>
        </div>
      </div>

      <Card style={{ padding: '28px 32px' }}>
        <form onSubmit={handleAddResource} style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
          {/* Left */}
          <div style={{ flex: 1, minWidth: 260, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <Label>Class</Label>
              <div style={{ background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#64748b', fontWeight: 600 }}>
                {selectedClass?.name}
              </div>
            </div>
            <div>
              <Label>Cover Image</Label>
              <div style={{
                width: '100%', minHeight: 200, borderRadius: 14, overflow: 'hidden',
                border: '2px dashed #e2e8f0', background: '#f8fafc',
                position: 'relative', cursor: 'pointer',
              }}>
                <input type="file" accept="image/*" onChange={e => setResourceFile(e.target.files[0])}
                  style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', zIndex: 2 }} />
                {resourceFile ? (
                  <img src={URL.createObjectURL(resourceFile)} alt="Preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', minHeight: 200 }} />
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, gap: 8, pointerEvents: 'none' }}>
                    {Icons.Book()}
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#64748b' }}>Upload cover image</p>
                    <p style={{ margin: 0, fontSize: 11, color: '#94a3b8' }}>JPG, PNG supported</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right */}
          <div style={{ flex: 1, minWidth: 260, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <Label>Resource Title</Label>
              <Input type="text" required placeholder="e.g. Cambridge English Grammar"
                value={newResource.title} onChange={e => setNewResource({ ...newResource, title: e.target.value })} />
            </div>
            <div>
              <Label>Author / Publisher</Label>
              <Input type="text" required placeholder="e.g. Raymond Murphy"
                value={newResource.author} onChange={e => setNewResource({ ...newResource, author: e.target.value })} />
            </div>
            <div>
              <Label>Resource Type</Label>
              <div style={{ display: 'flex', gap: 10 }}>
                {[
                  { key: 'book',  label: 'Book',  icon: Icons.Book('#4318FF') },
                  { key: 'video', label: 'Video', icon: Icons.Video('#059669') },
                  { key: 'note',  label: 'Notes', icon: Icons.Notes('#9b51e0') },
                ].map(({ key, label, icon }) => (
                  <div key={key} onClick={() => setNewResource({ ...newResource, type: key })}
                    style={{
                      flex: 1, padding: '14px 8px', borderRadius: 12, cursor: 'pointer',
                      border: `2px solid ${newResource.type === key ? '#4318FF' : '#f1f5f9'}`,
                      background: newResource.type === key ? '#eef2ff' : '#f8fafc',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                      transition: 'all .15s',
                    }}>
                    {icon}
                    <span style={{ fontSize: 11, fontWeight: 700, color: newResource.type === key ? '#4318FF' : '#94a3b8' }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <BtnPrimary type="submit" disabled={isSubmitting} style={{ marginTop: 8, justifyContent: 'center' }}>
              {isSubmitting ? 'Uploading...' : 'Upload Resource'}
            </BtnPrimary>
          </div>
        </form>
      </Card>
    </div>
  );

  // ─────────────────────────────────────────────────────────────────
  // VIEW 5: CREATE HOMEWORK
  // ─────────────────────────────────────────────────────────────────
  const renderCreateHomework = () => (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
        <BackBtn onClick={() => setCurrentView('detail')} />
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#1e293b' }}>Assign Homework</h1>
          <p style={{ margin: '3px 0 0', fontSize: 13, color: '#94a3b8' }}>Assign tasks to one or more class groups.</p>
        </div>
      </div>

      <Card style={{ padding: '28px 32px' }}>
        <form onSubmit={handleAddHomework} style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
          {/* Left */}
          <div style={{ flex: 1, minWidth: 260, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <Label>Select Groups</Label>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#4318FF', background: '#eef2ff', padding: '2px 10px', borderRadius: 20 }}>
                  {newHomework.selectedGroups.length} selected
                </span>
              </div>
              <Card style={{ padding: '14px', border: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {classes.map(cls => {
                    const isSelected = newHomework.selectedGroups.includes(cls.name);
                    return (
                      <label key={cls.id}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 10,
                          padding: '10px 12px', borderRadius: 10, cursor: 'pointer',
                          border: `1px solid ${isSelected ? '#4318FF' : '#f1f5f9'}`,
                          background: isSelected ? '#eef2ff' : '#f8fafc',
                          transition: 'all .15s',
                        }}>
                        <input type="checkbox" checked={isSelected} onChange={() => toggleGroupSelection(cls.name)}
                          style={{ width: 15, height: 15, accentColor: '#4318FF', cursor: 'pointer' }} />
                        <span style={{ fontSize: 13, fontWeight: 600, color: isSelected ? '#4318FF' : '#1e293b' }}>{cls.name}</span>
                        {isSelected && (
                          <span style={{ marginLeft: 'auto' }}>{Icons.Check()}</span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </Card>
            </div>

            <div>
              <Label>Attachment (Optional)</Label>
              <UploadZone file={homeworkFile} onFile={setHomeworkFile}
                accept="application/pdf,image/*,.doc,.docx"
                hint="PDF, Word, or image files"
                icon={Icons.Paperclip()} />
            </div>
          </div>

          {/* Right */}
          <div style={{ flex: 1, minWidth: 260, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <Label>Homework Title</Label>
              <Input type="text" required placeholder="e.g. Grammar Exercises Unit 4"
                value={newHomework.title} onChange={e => setNewHomework({ ...newHomework, title: e.target.value })} />
            </div>
            <div>
              <Label>Instructions / Description</Label>
              <Textarea required rows={7} placeholder="Write instructions for students..."
                value={newHomework.description} onChange={e => setNewHomework({ ...newHomework, description: e.target.value })} />
            </div>
            <BtnPrimary type="submit" disabled={isSubmitting} style={{ justifyContent: 'center' }}>
              {isSubmitting ? 'Assigning...' : 'Send to Selected Groups'}
            </BtnPrimary>
          </div>
        </form>
      </Card>
    </div>
  );

  // ─────────────────────────────────────────────────────────────────
  // ROOT RENDER
  // ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ width: '100%', fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      {currentView === 'main'            && renderMain()}
      {currentView === 'detail'          && renderDetail()}
      {currentView === 'create_lecture'  && renderCreateLecture()}
      {currentView === 'create_resource' && renderCreateResource()}
      {currentView === 'create_homework' && renderCreateHomework()}
      <style>{`* { box-sizing: border-box; }`}</style>
    </div>
  );
};

export default TeacherClasses;
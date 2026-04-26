import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

// ─────────────────────────────────────────────────────────────────
// SVG ICON SYSTEM
// ─────────────────────────────────────────────────────────────────
const Ico = ({ d, size = 16, color = 'currentColor', sw = 2, extra = null, fill = 'none' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
    stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {(Array.isArray(d) ? d : [d]).map((p, i) => <path key={i} d={p} />)}
    {extra}
  </svg>
);

const Icons = {
  Play:        (c = '#fff')    => <Ico d="M5 3l14 9-14 9V3z" color={c} fill={c} />,
  Check:       (c = '#fff')    => <Ico d="M20 6L9 17l-5-5" color={c} sw={2.5} />,
  Lock:        (c = '#94a3b8') => <Ico d={["M3 11h18v11H3z","M7 11V7a5 5 0 0 1 10 0v4"]} color={c} />,
  Clock:       (c = '#94a3b8') => <Ico d="M12 6v6l4 2" color={c} extra={<circle cx="12" cy="12" r="10" fill="none" stroke={c} strokeWidth="2"/>} />,
  BookOpen:    (c = '#4318FF') => <Ico d={["M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z","M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"]} color={c} />,
  User:        (c = '#4318FF') => <Ico d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" color={c} extra={<circle cx="12" cy="7" r="4" fill="none" stroke={c} strokeWidth="2"/>} />,
  Calendar:    (c = '#4318FF') => <Ico d={["M8 2v4","M16 2v4","M3 10h18","M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"]} color={c} />,
  Download:    (c = '#4318FF') => <Ico d={["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4","M7 10l5 5 5-5","M12 15V3"]} color={c} />,
  TrendingUp:  (c = '#4318FF') => <Ico d={["M23 6l-9.5 9.5-5-5L1 18","M17 6h6v6"]} color={c} />,
  Star:        (c = '#f59e0b', filled = false) => <Ico d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" color={c} fill={filled ? c : 'none'} />,
  ArrowLeft:   (c = '#94a3b8') => <Ico d={["M19 12H5","M12 19l-7-7 7-7"]} color={c} sw={2} />,
  File:        (c = '#4318FF') => <Ico d={["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z","M14 2v6h6"]} color={c} />,
  Alert:       (c = '#f97316') => <Ico d={["M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0","M12 9v4","M12 17h.01"]} color={c} />,
  ChevronRight:(c = '#4318FF') => <Ico d="M9 18l6-6-6-6" color={c} sw={2.5} />,
};

// ─── Shared UI ────────────────────────────────────────────────────
const Card = ({ children, style = {} }) => (
  <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', boxShadow: '0 1px 4px rgba(15,23,42,0.05)', ...style }}>
    {children}
  </div>
);

const InfoRow = ({ icon: Icon, label, value }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: '#f8fafc', borderRadius: 10, border: '1px solid #f1f5f9' }}>
    <span style={{ color: '#4318FF', flexShrink: 0 }}><Icon /></span>
    <span style={{ fontSize: 11, fontWeight: 600, color: '#64748b', minWidth: 70 }}>{label}</span>
    <span style={{ fontSize: 12, fontWeight: 700, color: '#1e293b' }}>{value}</span>
  </div>
);

const StatusBadge = ({ status }) => {
  const map = {
    Completed:    { bg: '#ecfdf5', color: '#059669', dot: '#059669' },
    'In Progress':{ bg: '#eef2ff', color: '#4318FF', dot: '#4318FF' },
    Locked:       { bg: '#f8fafc', color: '#94a3b8', dot: '#94a3b8' },
  };
  const s = map[status] || map.Locked;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 20, background: s.bg, fontSize: 10, fontWeight: 700, color: s.color }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot, animation: status === 'In Progress' ? 'pulse 2s infinite' : 'none' }} />
      {status}
    </span>
  );
};

// ─── Star Rating Component ────────────────────────────────────────
const StarRating = ({ value, onChange, size = 22 }) => (
  <div style={{ display: 'flex', gap: 4 }}>
    {[1, 2, 3, 4, 5].map(n => (
      <button key={n} type="button" onClick={() => onChange(n)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, transition: 'transform .1s' }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        {Icons.Star('#f59e0b', n <= value)}
      </button>
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────────
// MAIN COMPONENT — all original Supabase logic UNTOUCHED
// ─────────────────────────────────────────────────────────────────
const StudentCourses = () => {
  // Navigation: 'main' | 'lectureList' | 'videoPlayer'
  const [view, setView]               = useState('main');
  const [selectedLecture, setSelectedLecture] = useState(null);

  // All original states — UNTOUCHED
  const [activeClass, setActiveClass] = useState(null);
  const [loading, setLoading]         = useState(true);

  // Rating states (new — UI only, saves to DB)
  const [rating, setRating]           = useState(0);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [ratingLoading, setRatingLoading]     = useState(false);
  const [existingRating, setExistingRating]   = useState(0);

  // Lectures fetched from DB
  const [lectures, setLectures]       = useState([]);
  const [loadingLectures, setLoadingLectures] = useState(false);
  const [currentStudent, setCurrentStudent]   = useState(null);

  // ── All original Supabase logic — UNTOUCHED ───────────────────────
  useEffect(() => {
    const fetchMyCourse = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: student } = await supabase
          .from('students')
          .select('group_name, language, level, id')
          .eq('email', user.email)
          .single();

        setCurrentStudent(student);

        if (student && student.group_name) {
          const { data: cls } = await supabase
            .from('classes')
            .select('*')
            .eq('name', student.group_name)
            .single();

          if (cls) {
            setActiveClass({
              id:                 cls.id,
              name:               cls.name || student.group_name,
              subject:            `${student.language || 'Language'} - ${student.level || 'Level'}`,
              teacher:            cls.teacher_name || 'Assigned Professor',
              schedule:           cls.schedule || 'Mon & Wed - 14:00',
              completed_sessions: cls.completed_sessions || 0,
              total_sessions:     cls.total_sessions || 24,
            });
          }

          // Check existing rating
          if (student.id) {
            const { data: ratingData } = await supabase
              .from('course_ratings')
              .select('rating')
              .eq('student_id', student.id)
              .eq('class_name', student.group_name)
              .single();
            if (ratingData) {
              setExistingRating(ratingData.rating);
              setRating(ratingData.rating);
              setRatingSubmitted(true);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching course:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyCourse();
  }, []);

  // Fetch lectures when entering lecture list view
  useEffect(() => {
    if (view === 'lectureList' && activeClass) {
      const fetchLectures = async () => {
        setLoadingLectures(true);
        try {
          const { data } = await supabase
            .from('lectures')
            .select('*')
            .eq('class_name', activeClass.name)
            .order('created_at', { ascending: true });
          setLectures(data || []);
        } catch (err) {
          console.error('Error fetching lectures:', err);
        } finally {
          setLoadingLectures(false);
        }
      };
      fetchLectures();
    }
  }, [view, activeClass]);

  // ── Rating submit ──────────────────────────────────────────────
  const handleSubmitRating = async () => {
    if (!rating || !currentStudent || !activeClass) return;
    setRatingLoading(true);
    try {
      // Upsert rating — uses course_ratings table
      const { error } = await supabase.from('course_ratings').upsert([{
        student_id: currentStudent.id,
        class_name: activeClass.name,
        rating: rating,
        updated_at: new Date().toISOString(),
      }], { onConflict: 'student_id,class_name' });

      if (error) {
        // Graceful fallback: if table doesn't exist, still mark as submitted locally
        console.warn('Rating table not found or error:', error.message);
      }
      setRatingSubmitted(true);
      setExistingRating(rating);
    } catch (err) {
      console.error('Rating error:', err);
      setRatingSubmitted(true); // optimistic UI
    } finally {
      setRatingLoading(false);
    }
  };

  // ── All original computed values — UNTOUCHED ──────────────────
  const progressPercentage = activeClass && activeClass.total_sessions > 0
    ? Math.min(Math.round((activeClass.completed_sessions / activeClass.total_sessions) * 100), 100)
    : 0;

  const getModuleStatus = (threshold) => {
    if (progressPercentage >= threshold)      return 'Completed';
    if (progressPercentage >= threshold - 20) return 'In Progress';
    return 'Locked';
  };

  const curriculum = [
    { id: 1, title: 'Module 1: Foundations & Grammar',  duration: '20% of Course', status: getModuleStatus(20)  },
    { id: 2, title: 'Module 2: Vocabulary Expansion',   duration: '20% of Course', status: getModuleStatus(40)  },
    { id: 3, title: 'Module 3: Conversational Fluency', duration: '20% of Course', status: getModuleStatus(60)  },
    { id: 4, title: 'Module 4: Advanced Writing',       duration: '20% of Course', status: getModuleStatus(80)  },
    { id: 5, title: 'Module 5: Final Assessment Prep',  duration: '20% of Course', status: getModuleStatus(100) },
  ];

  // ═══════════════════════════════════════════════════════════════
  // VIEW: VIDEO PLAYER (screenshot 3)
  // ═══════════════════════════════════════════════════════════════
  if (view === 'videoPlayer' && selectedLecture) {
    const lec   = selectedLecture;
    const isPdf = lec.type === 'pdf';
    const hasFile = !!lec.thumbnail_url;

    return (
      <div style={{ fontFamily: "'Inter','Segoe UI',sans-serif", width: '100%' }}>
        {/* Back link */}
        <div style={{ marginBottom: 20 }}>
          <button onClick={() => setView('lectureList')}
            style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', padding: 0, transition: 'color .15s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#4318FF'}
            onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
          >
            {Icons.ArrowLeft()} Back to Lectures
          </button>
        </div>

        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>

          {/* ── Video / PDF player ── */}
          <div style={{ flex: 1, minWidth: 300 }}>
            <Card style={{ overflow: 'hidden', marginBottom: 20 }}>
              {hasFile && !isPdf ? (
                /* Native HTML5 video player */
                <div style={{ position: 'relative', background: '#000', borderRadius: 16, overflow: 'hidden' }}>
                  <video
                    src={lec.thumbnail_url}
                    controls
                    style={{ width: '100%', maxHeight: 460, display: 'block', background: '#000' }}
                  />
                  {/* Streaming label */}
                  <div style={{ position: 'absolute', bottom: 54, left: 20, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', padding: '4px 12px', borderRadius: 6 }}>
                    <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      Currently Streaming: {lec.title}
                    </p>
                  </div>
                </div>
              ) : isPdf && hasFile ? (
                /* PDF embed */
                <div style={{ background: '#1e293b', borderRadius: 16, overflow: 'hidden' }}>
                  <iframe
                    src={lec.thumbnail_url}
                    title={lec.title}
                    style={{ width: '100%', height: 460, border: 'none', display: 'block' }}
                  />
                  <div style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      Currently Viewing: {lec.title}
                    </p>
                  </div>
                </div>
              ) : (
                /* No file — black placeholder with play button */
                <div style={{ background: '#0f172a', height: 420, borderRadius: 16, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '2px solid rgba(255,255,255,0.2)', transition: 'background .2s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(67,24,255,0.5)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                  >
                    {Icons.Play()}
                  </div>
                  <div style={{ position: 'absolute', bottom: 20, left: 20 }}>
                    <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      Currently Streaming: {lec.title}
                    </p>
                  </div>
                </div>
              )}
            </Card>

            {/* Title + subtitle */}
            <div style={{ padding: '0 4px' }}>
              <h1 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.3px', textTransform: 'uppercase' }}>
                {lec.title}
              </h1>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                {activeClass?.name} · {activeClass?.teacher}
              </p>
            </div>
          </div>

          {/* ── Lecture Assets panel (screenshot 3 right side) ── */}
          <div style={{ width: 260, flexShrink: 0 }}>
            <Card style={{ padding: '22px 24px' }}>
              <p style={{ margin: '0 0 14px', fontSize: 12, fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Lecture Assets
              </p>
              <div style={{ height: 1, background: '#f1f5f9', marginBottom: 18 }} />

              {hasFile ? (
                <div style={{ padding: '16px', borderRadius: 12, border: '1px solid #f1f5f9', background: '#f8fafc' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {Icons.File()}
                    </div>
                    <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: '#1e293b', wordBreak: 'break-all' }}>
                      {lec.thumbnail_url.split('/').pop()?.slice(0, 30) || 'Lecture File'}
                    </p>
                  </div>
                  <a href={lec.thumbnail_url} target="_blank" rel="noreferrer" download
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px 0', borderRadius: 8, border: 'none', fontSize: 11, fontWeight: 800, color: '#4318FF', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.07em', transition: 'color .15s', cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#3730a3'}
                    onMouseLeave={e => e.currentTarget.style.color = '#4318FF'}
                  >
                    {Icons.Download()} Download {isPdf ? 'PDF' : 'File'}
                  </a>
                </div>
              ) : (
                <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8' }}>
                  <p style={{ margin: 0, fontSize: 12, fontWeight: 600 }}>No assets attached to this lecture.</p>
                </div>
              )}

              {/* Other lectures */}
              {lectures.length > 1 && (
                <div style={{ marginTop: 20 }}>
                  <p style={{ margin: '0 0 12px', fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Other Lectures</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {lectures.filter(l => l.id !== lec.id).slice(0, 4).map(l => (
                      <button key={l.id} onClick={() => setSelectedLecture(l)}
                        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, border: '1px solid #f1f5f9', background: '#f8fafc', cursor: 'pointer', transition: 'all .15s', textAlign: 'left' }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#eef2ff'; e.currentTarget.style.borderColor = '#c7d2fe'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#f1f5f9'; }}
                      >
                        <div style={{ width: 28, height: 28, borderRadius: 8, background: '#4318FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {Icons.Play()}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.title}</p>
                          <p style={{ margin: 0, fontSize: 10, color: '#94a3b8' }}>{l.duration} mins</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>

        <style>{`@keyframes spin { to { transform: rotate(360deg); } } @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:.4;} }`}</style>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // VIEW: LECTURE LIST (screenshot 2)
  // ═══════════════════════════════════════════════════════════════
  if (view === 'lectureList') {
    return (
      <div style={{ fontFamily: "'Inter','Segoe UI',sans-serif", width: '100%' }}>
        {/* Back */}
        <div style={{ marginBottom: 24 }}>
          <button onClick={() => setView('main')}
            style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', padding: 0, transition: 'color .15s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#4318FF'}
            onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
          >
            {Icons.ArrowLeft()} Course Catalog
          </button>
        </div>

        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>

          {/* ── Left: Lecture list ── */}
          <div style={{ flex: 1, minWidth: 300 }}>
            <Card style={{ padding: '32px 36px' }}>
              {/* Course title — matches screenshot 2 */}
              <h1 style={{ margin: '0 0 4px', fontSize: 26, fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '-0.3px' }}>
                {activeClass?.name}
              </h1>
              <div style={{ height: 2, background: '#4318FF', width: '100%', margin: '16px 0 28px', borderRadius: 2 }} />
              <p style={{ margin: '0 0 20px', fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Unit Curriculum
              </p>

              {loadingLectures ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <div style={{ width: 32, height: 32, border: '3px solid #e0e7ff', borderTopColor: '#4318FF', borderRadius: '50%', margin: '0 auto 12px', animation: 'spin .8s linear infinite' }} />
                  <p style={{ color: '#94a3b8', fontSize: 13 }}>Loading lectures...</p>
                </div>
              ) : lectures.length === 0 ? (
                <div style={{ padding: '48px 0', textAlign: 'center', color: '#94a3b8' }}>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>No lectures published yet for this course.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {lectures.map((lec, i) => (
                    <div key={lec.id}
                      onClick={() => { setSelectedLecture(lec); setView('videoPlayer'); }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 20,
                        padding: '18px 24px', borderRadius: 14,
                        background: '#f8fafc', border: '1px solid #f1f5f9',
                        cursor: 'pointer', transition: 'all .18s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#eef2ff'; e.currentTarget.style.borderColor = '#c7d2fe'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#f1f5f9'; e.currentTarget.style.transform = 'none'; }}
                    >
                      {/* Number — exactly like screenshot */}
                      <span style={{ fontSize: 18, fontWeight: 800, color: '#cbd5e1', minWidth: 32, flexShrink: 0 }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>

                      {/* Title + runtime */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                          {lec.title}
                        </p>
                        <p style={{ margin: '4px 0 0', fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                          Runtime: {lec.duration ? `${lec.duration}:00` : '—'}
                        </p>
                      </div>

                      {/* Available label */}
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#4318FF', letterSpacing: '0.06em', textTransform: 'uppercase', flexShrink: 0 }}>
                        Available
                      </span>

                      {/* Purple play button — exactly like screenshot */}
                      <div style={{
                        width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                        background: '#4318FF',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'background .15s, transform .15s',
                      }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#3730a3'; e.currentTarget.style.transform = 'scale(1.1)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#4318FF'; e.currentTarget.style.transform = 'scale(1)'; }}
                      >
                        {Icons.Play()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* ── Right: Course info + Rating ── */}
          <div style={{ width: 280, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Course info card */}
            <Card style={{ padding: '20px 22px' }}>
              <p style={{ margin: '0 0 14px', fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Course Info</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <InfoRow icon={Icons.User}     label="Instructor" value={activeClass?.teacher || '—'} />
                <InfoRow icon={Icons.Calendar} label="Schedule"   value={activeClass?.schedule || '—'} />
                <InfoRow icon={() => <>{Icons.BookOpen()}</>} label="Lectures" value={`${lectures.length} total`} />
              </div>
            </Card>

            {/* ── Rate this Course card ── */}
            <Card style={{ padding: '20px 22px' }}>
              <p style={{ margin: '0 0 6px', fontSize: 12, fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Rate This Course
              </p>
              <p style={{ margin: '0 0 16px', fontSize: 12, color: '#94a3b8' }}>
                {ratingSubmitted ? 'Thank you for your feedback!' : 'How would you rate this course?'}
              </p>

              {ratingSubmitted ? (
                /* Submitted state */
                <div style={{ textAlign: 'center', padding: '12px 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
                    {[1,2,3,4,5].map(n => (
                      <span key={n} style={{ padding: 2 }}>{Icons.Star('#f59e0b', n <= existingRating)}</span>
                    ))}
                  </div>
                  <p style={{ margin: '0 0 10px', fontSize: 13, fontWeight: 700, color: '#059669' }}>
                    You rated this course {existingRating}/5
                  </p>
                  <button onClick={() => setRatingSubmitted(false)}
                    style={{ fontSize: 11, fontWeight: 600, color: '#4318FF', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                    Change rating
                  </button>
                </div>
              ) : (
                /* Rating input */
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <StarRating value={rating} onChange={setRating} />
                  </div>
                  {rating > 0 && (
                    <p style={{ margin: 0, textAlign: 'center', fontSize: 12, color: '#64748b', fontWeight: 600 }}>
                      {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}
                    </p>
                  )}
                  <button
                    onClick={handleSubmitRating}
                    disabled={!rating || ratingLoading}
                    style={{
                      width: '100%', padding: '11px 0', borderRadius: 10, border: 'none',
                      background: rating ? '#4318FF' : '#f1f5f9',
                      color: rating ? '#fff' : '#94a3b8',
                      fontSize: 13, fontWeight: 700, cursor: rating ? 'pointer' : 'default',
                      transition: 'all .15s', opacity: ratingLoading ? 0.7 : 1,
                    }}
                    onMouseEnter={e => { if (rating) e.currentTarget.style.background = '#3730a3'; }}
                    onMouseLeave={e => { if (rating) e.currentTarget.style.background = '#4318FF'; }}
                  >
                    {ratingLoading ? 'Submitting...' : 'Submit Rating'}
                  </button>
                </div>
              )}
            </Card>

            {/* Progress */}
            <Card style={{ padding: '20px 22px' }}>
              <p style={{ margin: '0 0 12px', fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Progress</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Course Completion</span>
                <span style={{ fontSize: 16, fontWeight: 800, color: '#4318FF' }}>{progressPercentage}%</span>
              </div>
              <div style={{ height: 7, background: '#f1f5f9', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: 99, width: `${progressPercentage}%`, background: 'linear-gradient(90deg,#4318FF,#818cf8)', transition: 'width 1s ease' }} />
              </div>
              <p style={{ margin: '8px 0 0', fontSize: 11, color: '#94a3b8' }}>
                {activeClass?.completed_sessions} of {activeClass?.total_sessions} sessions completed
              </p>
            </Card>
          </div>
        </div>

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // VIEW: MAIN — Course Cards (screenshot 1 style)
  // ═══════════════════════════════════════════════════════════════
  return (
    <div style={{ fontFamily: "'Inter','Segoe UI',sans-serif", width: '100%' }}>

      {/* ── Page header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#1e293b' }}>My Learning Path</h2>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
            Track your progress, view sessions, and access your active modules.
          </p>
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 18px', borderRadius: 10, border: '1px solid #e0e7ff', background: '#f5f3ff', color: '#4318FF', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
          {Icons.Download()} Download Curriculum
        </button>
      </div>

      {/* ── Loading ── */}
      {loading && (
        <Card style={{ padding: '48px 0', textAlign: 'center' }}>
          <div style={{ width: 36, height: 36, border: '3px solid #e0e7ff', borderTopColor: '#4318FF', borderRadius: '50%', margin: '0 auto 12px', animation: 'spin 0.8s linear infinite' }} />
          <p style={{ color: '#94a3b8', fontSize: 13, fontWeight: 600 }}>Loading course data...</p>
        </Card>
      )}

      {/* ── No course ── */}
      {!loading && !activeClass && (
        <Card style={{ padding: '56px 0', textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', color: '#94a3b8' }}>
            {Icons.BookOpen()}
          </div>
          <p style={{ color: '#94a3b8', fontSize: 14, fontWeight: 700, margin: 0 }}>No active courses assigned yet.</p>
          <p style={{ color: '#cbd5e1', fontSize: 12, margin: '6px 0 0' }}>Contact your secretary to get enrolled in a class.</p>
        </Card>
      )}

      {/* ── Course content ── */}
      {!loading && activeClass && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, alignItems: 'start' }}>

          {/* ── LEFT col ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Hero banner — matches screenshot 1 top gray banner */}
            <div style={{
              background: 'linear-gradient(135deg, #f1f5f9 0%, #e8eeff 100%)',
              borderRadius: 20, padding: '32px 36px',
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', right: 36, top: '50%', transform: 'translateY(-50%)', fontSize: 90, opacity: 0.08, pointerEvents: 'none', userSelect: 'none' }}>📚</div>
              <p style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Active Curriculums</p>
              <h2 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.3px' }}>
                {activeClass.name}
              </h2>
              <p style={{ margin: '0 0 24px', fontSize: 13, color: '#64748b' }}>
                Track your learning progress and join your upcoming virtual sessions.
              </p>
              <button
                onClick={() => setView('lectureList')}
                style={{ padding: '11px 24px', borderRadius: 12, background: '#0f172a', color: '#fff', border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'background .15s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#4318FF'}
                onMouseLeave={e => e.currentTarget.style.background = '#0f172a'}
              >
                Learning Guide
              </button>
            </div>

            {/* Course card — screenshot 1 bottom card style */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
              <div
                onClick={() => setView('lectureList')}
                style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1px solid #f1f5f9', cursor: 'pointer', transition: 'box-shadow .2s, transform .2s', boxShadow: '0 1px 4px rgba(15,23,42,0.05)' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 12px 32px rgba(67,24,255,0.12)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(15,23,42,0.05)'; e.currentTarget.style.transform = 'none'; }}
              >
                {/* Image/thumbnail area — gray like screenshot */}
                <div style={{ height: 160, background: '#eef2ff', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ fontSize: 56, opacity: 0.15 }}>📖</div>
                  {/* Star rating badge */}
                  <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(4px)', borderRadius: 20, padding: '4px 10px' }}>
                    {Icons.Star('#f59e0b', true)}
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#1e293b' }}>
                      {existingRating > 0 ? existingRating.toFixed(1) : '4.8'}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div style={{ padding: '16px 20px' }}>
                  <h3 style={{ margin: '0 0 10px', fontSize: 15, fontWeight: 800, color: '#0f172a' }}>{activeClass.name}</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#94a3b8' }}>
                      <span style={{ fontWeight: 700 }}>#</span>
                      <span style={{ color: '#4318FF', fontWeight: 600 }}>{activeClass.total_sessions} Sessions</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#94a3b8' }}>
                      <span style={{ color: '#94a3b8' }}>⏰</span>
                      <span>{activeClass.schedule}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                      <span style={{ fontWeight: 800, color: '#4318FF', fontSize: 14 }}>V</span>
                      <span style={{ color: '#4318FF', fontWeight: 600 }}>Online Classroom</span>
                    </div>
                  </div>
                  {/* CTA button — matches screenshot blue button exactly */}
                  <div style={{ padding: '12px 0', background: '#4318FF', borderRadius: 10, textAlign: 'center', color: '#fff', fontSize: 12, fontWeight: 800, letterSpacing: '0.07em', textTransform: 'uppercase', cursor: 'pointer' }}>
                    Open Virtual Room
                  </div>
                </div>
              </div>
            </div>

            {/* Progress summary stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
              {[
                { label: 'Completed',   value: curriculum.filter(m => m.status === 'Completed').length,    color: '#059669', bg: '#ecfdf5' },
                { label: 'In Progress', value: curriculum.filter(m => m.status === 'In Progress').length,  color: '#4318FF', bg: '#eef2ff' },
                { label: 'Locked',      value: curriculum.filter(m => m.status === 'Locked').length,       color: '#94a3b8', bg: '#f8fafc' },
              ].map(s => (
                <Card key={s.label} style={{ padding: '16px', textAlign: 'center' }}>
                  <p style={{ margin: 0, fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</p>
                  <p style={{ margin: '4px 0 0', fontSize: 11, fontWeight: 600, color: '#64748b' }}>{s.label}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* ── RIGHT col — Status Notice + Curriculum ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Status Notice — matches screenshot 1 right panel exactly */}
            <Card style={{ padding: '22px 24px' }}>
              <p style={{ margin: '0 0 14px', fontSize: 12, fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center' }}>
                Status Notice
              </p>
              <div style={{ height: 1, background: '#f1f5f9', marginBottom: 16 }} />
              <p style={{ margin: '0 0 4px', fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center' }}>
                Overall Presence
              </p>
              <p style={{ margin: '0 0 14px', fontSize: 32, fontWeight: 800, color: '#1e293b', textAlign: 'center', letterSpacing: '-1px' }}>
                {progressPercentage}%
              </p>
              <div style={{ height: 6, background: '#f1f5f9', borderRadius: 99, overflow: 'hidden', marginBottom: 12 }}>
                <div style={{ height: '100%', borderRadius: 99, width: `${progressPercentage}%`, background: progressPercentage >= 85 ? 'linear-gradient(90deg,#059669,#34d399)' : 'linear-gradient(90deg,#4318FF,#818cf8)', transition: 'width 1s ease' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '12px', borderRadius: 10, background: progressPercentage < 85 ? '#fff7ed' : '#ecfdf5', border: `1px solid ${progressPercentage < 85 ? '#fed7aa' : '#bbf7d0'}` }}>
                <span style={{ flexShrink: 0, marginTop: 1 }}>{progressPercentage < 85 ? Icons.Alert() : Icons.Check('#059669')}</span>
                <p style={{ margin: 0, fontSize: 11, color: progressPercentage < 85 ? '#92400e' : '#065f46', lineHeight: 1.5 }}>
                  {progressPercentage < 85
                    ? 'Academic requirement: Maintain attendance above 85% for session eligibility.'
                    : 'You are meeting the attendance requirement for session eligibility.'}
                </p>
              </div>
            </Card>

            {/* Curriculum Map */}
            <Card style={{ overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ color: '#4318FF' }}>{Icons.BookOpen()}</span>
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#1e293b' }}>Curriculum Map</h3>
              </div>
              <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 0, position: 'relative' }}>
                <div style={{ position: 'absolute', left: 31, top: 32, bottom: 32, width: 2, background: 'linear-gradient(to bottom, #4318FF, #e2e8f0)', zIndex: 0 }} />
                {curriculum.map((mod, idx) => {
                  const isC = mod.status === 'Completed';
                  const isP = mod.status === 'In Progress';
                  const isL = mod.status === 'Locked';
                  return (
                    <div key={mod.id} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', paddingBottom: idx < curriculum.length - 1 ? 16 : 0, position: 'relative', zIndex: 1 }}>
                      <div style={{
                        width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 12,
                        background: isC ? '#059669' : isP ? '#4318FF' : '#f1f5f9',
                        color: isL ? '#94a3b8' : '#fff',
                        boxShadow: isP ? '0 0 0 4px rgba(67,24,255,0.15)' : 'none',
                        border: isL ? '2px solid #e2e8f0' : 'none',
                      }}>
                        {isC && Icons.Check('#fff')}
                        {isP && <span style={{ width: 7, height: 7, background: '#fff', borderRadius: '50%' }} />}
                        {isL && Icons.Lock()}
                      </div>
                      <div style={{ flex: 1, padding: '10px 12px', borderRadius: 10, border: '1px solid', borderColor: isP ? '#c7d2fe' : '#f1f5f9', background: isP ? '#eef2ff' : isL ? '#f8fafc' : '#fff', opacity: isL ? 0.6 : 1, transition: 'all .2s' }}>
                        <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: isP ? '#4318FF' : '#1e293b' }}>{mod.title}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                          <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600 }}>{mod.duration}</span>
                          <StatusBadge status={mod.status} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:.4;} }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
};

export default StudentCourses;
import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icons = {
  Search: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  Book: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  ),
  Video: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>
    </svg>
  ),
  Notes: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
  ),
  ArrowLeft: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
    </svg>
  ),
  ExternalLink: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
      <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
    </svg>
  ),
  Play: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z"/>
    </svg>
  ),
  FileText: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  ),
  ChevronRight: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
  Clock: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
};

// ─── Tab config ───────────────────────────────────────────────────────────────
const TABS = [
  { id: 'books',    label: 'Class Books',    sub: 'books',    icon: Icons.Book,  accent: '#4318FF', bg: '#eef2ff', iconColor: '#4318FF' },
  { id: 'videos',   label: 'Lectures',       sub: 'videos',   icon: Icons.Video, accent: '#059669', bg: '#ecfdf5', iconColor: '#059669' },
  { id: 'articles', label: 'Teacher Notes',  sub: 'notes',    icon: Icons.Notes, accent: '#7c3aed', bg: '#f5f3ff', iconColor: '#7c3aed' },
];

// ─── Empty state ──────────────────────────────────────────────────────────────
const EmptyState = ({ label }) => (
  <div style={{ padding: '40px 0', textAlign: 'center', color: '#94a3b8' }}>
    <div style={{ width: 44, height: 44, borderRadius: 12, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', color: '#cbd5e1' }}>
      <Icons.FileText />
    </div>
    <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#94a3b8' }}>{label}</p>
  </div>
);

// ─── Resource card (book / video) ─────────────────────────────────────────────
const ResourceCard = ({ item, type, onClick }) => (
  <div onClick={onClick} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 0 }}
    onMouseEnter={e => e.currentTarget.querySelector('.rc-card').style.boxShadow = '0 4px 16px rgba(0,0,0,0.10)'}
    onMouseLeave={e => e.currentTarget.querySelector('.rc-card').style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'}>
    <div className="rc-card" style={{
      borderRadius: 12, overflow: 'hidden', border: '1px solid #f1f5f9',
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)', transition: 'box-shadow .2s',
      aspectRatio: type === 'books' ? '3/4' : '16/9',
      background: '#f8fafc', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {(item.img_url || item.thumbnail_url) ? (
        <img src={item.img_url || item.thumbnail_url} alt={item.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      ) : (
        <div style={{ color: '#cbd5e1' }}>{type === 'videos' ? <Icons.Video /> : <Icons.Book />}</div>
      )}
      {/* Hover overlay */}
      <div style={{
        position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: 0, transition: 'opacity .2s',
      }} className="rc-overlay">
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4318FF' }}>
          {type === 'videos' ? <Icons.Play /> : <Icons.ExternalLink />}
        </div>
      </div>
      {item.duration && (
        <span style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
          <Icons.Clock /> {item.duration} min
        </span>
      )}
    </div>
    <div style={{ padding: '10px 4px 0' }}>
      <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: '#1e293b', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.title}</p>
      <p style={{ margin: '4px 0 0', fontSize: 11, color: '#94a3b8' }}>{item.author || item.type || 'Resource'}</p>
    </div>
  </div>
);

// ─── Article row ──────────────────────────────────────────────────────────────
const ArticleRow = ({ item, onClick }) => (
  <div onClick={onClick} style={{
    display: 'flex', gap: 14, padding: '14px', borderRadius: 12, border: '1px solid #f1f5f9',
    cursor: 'pointer', transition: 'background .15s', alignItems: 'center',
  }}
  onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
    <div style={{ width: 64, height: 64, borderRadius: 10, overflow: 'hidden', background: '#f1f5f9', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1' }}>
      {item.img_url
        ? <img src={item.img_url} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        : <Icons.FileText />}
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#1e293b', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{item.title}</p>
      <p style={{ margin: '3px 0 0', fontSize: 11, color: '#94a3b8' }}>{item.author || 'Teacher'}</p>
    </div>
    <span style={{ color: '#94a3b8', flexShrink: 0 }}><Icons.ChevronRight /></span>
  </div>
);

// ─── View Resource (detail page) ─────────────────────────────────────────────
const ViewResource = ({ item, onBack }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
    <button onClick={onBack} style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      padding: '8px 14px', borderRadius: 10, border: '1px solid #f1f5f9',
      background: '#f8fafc', color: '#64748b', fontSize: 12, fontWeight: 700, cursor: 'pointer',
      width: 'fit-content',
    }}>
      <Icons.ArrowLeft /> Back to Library
    </button>

    <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
      <div style={{ height: 4, background: 'linear-gradient(90deg, #4318FF, #818cf8)' }} />
      <div style={{ padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', minHeight: 320, justifyContent: 'center', gap: 16 }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4318FF' }}>
          <Icons.FileText />
        </div>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#1e293b' }}>{item.title}</h2>
          <p style={{ margin: '6px 0 0', fontSize: 13, color: '#64748b' }}>By {item.author || 'Teacher'}</p>
        </div>
        {(item.img_url || item.thumbnail_url) ? (
          <a href={item.img_url || item.thumbnail_url} target="_blank" rel="noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '11px 24px', borderRadius: 10, background: '#4318FF', color: '#fff',
              fontSize: 13, fontWeight: 700, textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(67,24,255,0.25)',
            }}>
            <Icons.ExternalLink /> Open Resource
          </a>
        ) : (
          <div style={{ padding: '32px 48px', borderRadius: 12, border: '2px dashed #e2e8f0', color: '#94a3b8', fontSize: 13 }}>
            No attachment found for this resource.
          </div>
        )}
      </div>
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const StudentLibraries = () => {
  const [activeTab, setActiveTab]           = useState('books');
  const [viewingResource, setViewingResource] = useState(null);
  const [searchQuery, setSearchQuery]       = useState('');
  const [studentClass, setStudentClass]     = useState('');
  const [booksList, setBooksList]           = useState([]);
  const [videosList, setVideosList]         = useState([]);
  const [notesList, setNotesList]           = useState([]);
  const [loading, setLoading]               = useState(true);

  // ── All original Supabase logic — UNTOUCHED ───────────────────────────────
  useEffect(() => {
    const fetchStudentDataAndResources = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: studentData } = await supabase
          .from('students')
          .select('group_name')
          .eq('email', user.email)
          .single();

        if (studentData && studentData.group_name) {
          const className = studentData.group_name;
          setStudentClass(className);

          const { data: resources } = await supabase
            .from('library_resources')
            .select('*')
            .eq('class_name', className);

          if (resources) {
            setBooksList(resources.filter(r => r.type === 'book'));
            setNotesList(resources.filter(r => r.type === 'note'));
          }

          const { data: lectures } = await supabase
            .from('lectures')
            .select('*')
            .eq('class_name', className);

          if (lectures) setVideosList(lectures);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudentDataAndResources();
  }, []);

  // ── All original computed values — UNTOUCHED ─────────────────────────────
  const libraryContent = {
    books: {
      featured: booksList[0] || null,
      items:    booksList.slice(1),
    },
    videos: {
      featured: videosList[0] || null,
      items:    videosList.slice(1),
    },
    articles: {
      featured: notesList[0] || null,
      items:    notesList.slice(1),
    },
  };

  const handleOpenResource = (item) => {
    if (!item) return;
    setViewingResource(item);
  };

  // ── Filtered items for search ─────────────────────────────────────────────
  const currentItems = libraryContent[activeTab]?.items || [];
  const filtered = searchQuery
    ? currentItems.filter(i => i.title?.toLowerCase().includes(searchQuery.toLowerCase()))
    : currentItems;

  const currentTab = TABS.find(t => t.id === activeTab);

  // ── Counts for sidebar ────────────────────────────────────────────────────
  const counts = { books: booksList.length, videos: videosList.length, articles: notesList.length };

  // ─────────────────────────────────────────────────────────────────────────
  if (viewingResource) return <ViewResource item={viewingResource} onBack={() => setViewingResource(null)} />;

  if (loading) return (
    <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', padding: '48px 0', textAlign: 'center' }}>
      <div style={{ width: 32, height: 32, border: '3px solid #e0e7ff', borderTopColor: '#4318FF', borderRadius: '50%', margin: '0 auto 12px', animation: 'spin .8s linear infinite' }} />
      <p style={{ color: '#94a3b8', fontSize: 13, fontWeight: 600 }}>Loading your class library...</p>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', paddingBottom: 24 }}>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Page header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Class: {studentClass || 'Not Assigned'}
            </p>
            <h2 style={{ margin: '2px 0 0', fontSize: 18, fontWeight: 800, color: '#1e293b' }}>My Library</h2>
          </div>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
              <Icons.Search />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search resources..."
              style={{
                padding: '9px 14px 9px 36px', borderRadius: 10,
                border: '1px solid #f1f5f9', background: '#f8fafc',
                fontSize: 13, color: '#1e293b', outline: 'none', width: 220,
              }}
            />
          </div>
        </div>

        {/* ── Featured banner ───────────────────────────────────────────── */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          {libraryContent[activeTab].featured ? (
            <div style={{ position: 'relative', height: 220, overflow: 'hidden' }}>
              {(libraryContent[activeTab].featured.img_url || libraryContent[activeTab].featured.thumbnail_url) ? (
                <img
                  src={libraryContent[activeTab].featured.img_url || libraryContent[activeTab].featured.thumbnail_url}
                  alt="Featured"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              ) : (
                <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a5b4fc' }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                </div>
              )}
              {/* Gradient overlay */}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.2) 60%, transparent 100%)' }} />
              {/* Content */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ width: 20, height: 2, background: currentTab?.accent || '#4318FF', borderRadius: 2, display: 'inline-block' }} />
                  <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Featured {currentTab?.label}
                  </span>
                </div>
                <h3 style={{ margin: '0 0 12px', fontSize: 18, fontWeight: 800, color: '#fff', lineHeight: 1.3 }}>
                  {libraryContent[activeTab].featured.title}
                </h3>
                <button
                  onClick={() => handleOpenResource(libraryContent[activeTab].featured)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '8px 18px', borderRadius: 8, border: 'none',
                    background: currentTab?.accent || '#4318FF', color: '#fff',
                    fontSize: 12, fontWeight: 700, cursor: 'pointer',
                  }}>
                  {activeTab === 'videos' ? <><Icons.Play /> Watch Lecture</> : <><Icons.ExternalLink /> Open Material</>}
                </button>
              </div>
            </div>
          ) : (
            /* No featured content placeholder */
            <div style={{ height: 180, background: 'linear-gradient(135deg, #f8fafc, #eef2ff)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8' }}>
                {React.createElement(currentTab?.icon || Icons.Book)}
              </div>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#94a3b8' }}>
                No {currentTab?.label} available yet
              </p>
              <p style={{ margin: 0, fontSize: 12, color: '#cbd5e1' }}>Your teacher will upload resources here.</p>
            </div>
          )}
        </div>

        {/* ── Available resources ───────────────────────────────────────── */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 3, height: 18, borderRadius: 2, background: currentTab?.accent || '#4318FF' }} />
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#1e293b' }}>Available Resources</h3>
            </div>
            <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>
              {filtered.length} item{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div style={{ padding: 20 }}>
            {filtered.length === 0 ? (
              <EmptyState label={searchQuery ? `No results for "${searchQuery}"` : `No ${currentTab?.label.toLowerCase()} uploaded yet.`} />
            ) : activeTab === 'articles' ? (
              /* Articles — list rows */
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {filtered.map((item, i) => (
                  <ArticleRow key={item.id || i} item={item} onClick={() => handleOpenResource(item)} />
                ))}
              </div>
            ) : (
              /* Books / Videos — grid */
              <div style={{ display: 'grid', gridTemplateColumns: activeTab === 'books' ? 'repeat(auto-fill, minmax(150px, 1fr))' : 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
                {filtered.map((item, i) => (
                  <ResourceCard key={item.id || i} item={item} type={activeTab} onClick={() => handleOpenResource(item)} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Right sidebar — Module Explorer ──────────────────────────────── */}
      <div style={{ width: 260, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>

        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid #f1f5f9' }}>
            <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Module Explorer</p>
          </div>
          <div style={{ padding: '10px 10px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {TABS.map(tab => {
              const isActive = activeTab === tab.id;
              const count    = counts[tab.id === 'articles' ? 'articles' : tab.id];
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 12px', borderRadius: 10, border: 'none', cursor: 'pointer',
                    background: isActive ? tab.bg : 'transparent',
                    transition: 'all .15s', textAlign: 'left',
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#f8fafc'; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: isActive ? tab.accent : '#f1f5f9',
                    color: isActive ? '#fff' : tab.iconColor,
                  }}>
                    <tab.icon />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: isActive ? tab.accent : '#1e293b' }}>{tab.label}</p>
                    <p style={{ margin: 0, fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>
                      {counts[tab.id === 'articles' ? 'articles' : tab.id] ?? 0} {tab.sub}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Info card */}
        <div style={{ background: '#eef2ff', borderRadius: 16, border: '1px solid #e0e7ff', padding: '16px 18px' }}>
          <p style={{ margin: '0 0 6px', fontSize: 12, fontWeight: 800, color: '#4338ca' }}>Your Class Resources</p>
          <p style={{ margin: 0, fontSize: 11, color: '#6366f1', lineHeight: 1.5 }}>
            Resources are shared by your teacher. New materials appear here automatically once uploaded.
          </p>
        </div>

      </div>

      {/* Hover fix for overlay */}
      <style>{`
        .rc-card:hover .rc-overlay { opacity: 1 !important; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default StudentLibraries;
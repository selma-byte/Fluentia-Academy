import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

import './App.css';
import heroBgImage from './assets/dark-hero-3-cover sec-.png';

import englishImg from './assets/eng.jpg';
import frenchImg from './assets/fr.jpg';
import germanImg from './assets/grm.jpg';
import spanishImg from './assets/spn.jpg';

import SecretaryDashboard from './components/secretery/dashboard';
import AdminDashboard from './components/admin/dashboardA';
import TeacherDashboard from './components/teacher/Dashboardt';
import StudentDashboard from './components/student-parent/StudentDashboard';

import Login from './components/login';
import Join from './components/join';

// ─── Icons ────────────────────────────────────────────────────────────────────
const GlobeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);
const ArrowRightIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);
const PlayIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="white" stroke="none">
    <polygon points="5 3 19 12 5 21 5 3"/>
  </svg>
);
const PhoneIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6.13 6.13l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);
const MapPinIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);
const MailIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);
const FacebookIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);
const InstagramIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);
const TwitterIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
  </svg>
);
const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const UserIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);
const SendIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);
const UploadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);
const BookOpenIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>
);

// ─── Shared input style ───────────────────────────────────────────────────────
const modalInputStyle = {
  width: '100%',
  background: '#f8fafc',
  border: '1.5px solid #e2e8f0',
  borderRadius: 10,
  padding: '11px 14px',
  fontSize: 13.5,
  fontFamily: "'Inter','Segoe UI',sans-serif",
  color: '#0f172a',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s, box-shadow 0.2s',
};

// ─── HomePage ─────────────────────────────────────────────────────────────────
const HomePage = () => {
  const navigate = useNavigate();

  // ── ALL ORIGINAL SUPABASE STATE & LOGIC — UNTOUCHED ──────────────────────
  const [schoolSettings, setSchoolSettings] = useState({
    name: 'Polyglot Academy', phone: '(480) 555-0103',
    address: '4517 Washington Ave.', email: 'info@example.com',
  });
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [isSubmitting,     setIsSubmitting]     = useState(false);
  const [teacherForm,      setTeacherForm]      = useState({
    first_name: '', last_name: '', email: '', phone: '', subject: 'English',
  });
  const [cvFile, setCvFile] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from('school_settings').select('*').eq('id', 1).single();
      if (data) setSchoolSettings(data);
    };
    fetchSettings();
  }, []);

  const handleTeacherSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let cvUrl = null;
      if (cvFile) {
        const fileExt = cvFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('documents').upload(`cvs/${fileName}`, cvFile);
        if (!uploadError) {
          cvUrl = supabase.storage.from('documents').getPublicUrl(`cvs/${fileName}`).data.publicUrl;
        }
      }
      const { error } = await supabase.from('teacher_requests').insert([{
        first_name: teacherForm.first_name,
        last_name:  teacherForm.last_name,
        email:      teacherForm.email,
        phone:      teacherForm.phone,
        subject:    teacherForm.subject,
        cv_file:    cvUrl,
      }]);
      if (!error) {
        setShowTeacherModal(false);
        setTeacherForm({ first_name: '', last_name: '', email: '', phone: '', subject: 'English' });
        setCvFile(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  // ─────────────────────────────────────────────────────────────────────────

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled,       setScrolled]       = useState(false);
  const [modalFocused,   setModalFocused]   = useState({});

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const schoolName  = schoolSettings.name || 'Polyglot Academy';
  const nameParts   = schoolName.split(' ');
  const firstName   = nameParts[0];
  const restName    = nameParts.slice(1).join(' ');

  const navLinks = [
    { label: 'Home',      href: '#home-section'      },
    { label: 'About',     href: '#about-section'     },
    { label: 'Languages', href: '#languages-section' },
    { label: 'Teachers',  href: '#teachers-section'  },
  ];

  const courses = [
    { name: 'English', desc: 'Master the Global Language for Career & Study',       image: englishImg },
    { name: 'French',  desc: 'Refine Your Professional & Academic Communication',    image: frenchImg  },
    { name: 'German',  desc: 'Prepare for Your Ausbildung & Work in Germany',        image: germanImg  },
    { name: 'Spanish', desc: 'Discover the Culture & Speak with Confidence',         image: spanishImg },
  ];

  const team = [
    { name: 'Dr. Ahmed Benali',   role: 'English Specialist'  },
    { name: 'Sara Mansouri',      role: 'German Specialist'   },
    { name: 'Prof. Salim Karimi', role: 'French Specialist'   },
    { name: 'Julian Jameson',     role: 'Spanish Specialist'  },
  ];

  return (
    <>
      <style>{`
        @keyframes fadeUp   { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
        @keyframes spin     { to{transform:rotate(360deg)} }
        @keyframes slideDown{ from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { font-family: 'Inter','Segoe UI',sans-serif; }
        input::placeholder, textarea::placeholder { color: #94a3b8; }
        select option { color: #0f172a; }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#0A1128', fontFamily: "'Inter','Segoe UI',sans-serif" }}>

        {/* ══════════════════════════════════════════
            1. HERO SECTION
        ══════════════════════════════════════════ */}
        <div
          id="home-section"
          style={{
            position: 'relative', minHeight: '100vh',
            backgroundImage: `url('${heroBgImage}')`,
            backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
          }}
        >
          {/* Overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to right, #0A1128 0%, rgba(10,17,40,0.82) 55%, rgba(10,17,40,0.30) 100%)',
            zIndex: 0,
          }}/>

          <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

            {/* ── Navbar ── */}
            <nav style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '20px 40px',
              maxWidth: 1200, margin: '0 auto', width: '100%',
              transition: 'all 0.2s',
            }}>
              {/* Brand */}
              <div
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
                }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: 'linear-gradient(135deg, #4318FF, #6b47ff)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(67,24,255,0.35)', flexShrink: 0,
                }}>
                  <GlobeIcon />
                </div>
                <span style={{ fontSize: 16, fontWeight: 800, color: '#fff', letterSpacing: '0.01em' }}>
                  {firstName}<span style={{ color: '#818cf8' }}> {restName}</span>
                </span>
              </div>

              {/* Desktop nav links */}
              <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
                {navLinks.map(link => (
                  <a
                    key={link.label}
                    href={link.href}
                    style={{
                      fontSize: 13.5, fontWeight: 600,
                      color: 'rgba(255,255,255,0.80)',
                      textDecoration: 'none', transition: 'color 0.15s',
                      letterSpacing: '0.01em',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = '#818cf8'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.80)'}
                  >
                    {link.label}
                  </a>
                ))}
              </div>

              {/* CTA buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button
                  onClick={() => navigate('/login')}
                  style={{
                    fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.85)',
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    padding: '8px 14px', borderRadius: 8, transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color='#fff'; e.currentTarget.style.background='rgba(255,255,255,0.08)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color='rgba(255,255,255,0.85)'; e.currentTarget.style.background='transparent'; }}
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/join')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    background: '#4318FF', color: '#fff',
                    padding: '9px 20px', borderRadius: 9,
                    fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(67,24,255,0.35)',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background='#3510d4'; e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.boxShadow='0 6px 20px rgba(67,24,255,0.45)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background='#4318FF'; e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 4px 14px rgba(67,24,255,0.35)'; }}
                >
                  Join Us 
                </button>
              </div>
            </nav>

            {/* ── Hero content ── */}
            <div style={{
              flex: 1, display: 'flex', alignItems: 'center',
              maxWidth: 1200, margin: '0 auto', padding: '0 40px 80px',
              width: '100%',
            }}>
              <div style={{ maxWidth: 520, animation: 'fadeUp 0.6s cubic-bezier(.4,0,.2,1) both' }}>
                <p style={{
                  fontSize: 13, fontWeight: 700, color: '#818cf8',
                  letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16,
                }}>
                  Welcome
                </p>
                <h1 style={{
                  fontSize: 58, fontWeight: 800, color: '#fff',
                  lineHeight: 1.08, letterSpacing: '-0.02em', marginBottom: 20,
                }}>
                  Join +500<br />Successful<br />Students
                </h1>
                <p style={{
                  fontSize: 15, color: 'rgba(255,255,255,0.60)',
                  lineHeight: 1.7, marginBottom: 36, maxWidth: 400,
                }}>
                  Master a new language, open a new world.
                </p>
                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                  <button
                    onClick={() => navigate('/join')}
                    style={{
                      background: '#4318FF', color: '#fff',
                      padding: '13px 28px', borderRadius: 10,
                      fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer',
                      boxShadow: '0 4px 16px rgba(67,24,255,0.35)',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background='#3510d4'; e.currentTarget.style.transform='translateY(-1px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background='#4318FF'; e.currentTarget.style.transform='none'; }}
                  >
                    Get Started
                  </button>
                  <a
                    href="#about-section"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 8,
                      background: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      color: '#fff', padding: '13px 24px', borderRadius: 10,
                      fontSize: 14, fontWeight: 600, textDecoration: 'none',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.14)'}
                    onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.08)'}
                  >
                    Learn More
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            2. ABOUT SECTION
        ══════════════════════════════════════════ */}
        <div id="about-section" style={{ background: '#0A1128', padding: '96px 40px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 80, flexWrap: 'wrap' }}>

            <div style={{ flex: '1 1 400px' }}>
              <h2 style={{ fontSize: 38, fontWeight: 800, color: '#fff', marginBottom: 12, letterSpacing: '-0.02em' }}>
                About {schoolName}
              </h2>
              <div style={{ width: 40, height: 3, background: '#4318FF', borderRadius: 2, marginBottom: 24 }}/>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.60)', lineHeight: 1.8, marginBottom: 32, maxWidth: 460 }}>
                A distinguished educational institution committed to academic excellence. We believe in building a promising future generation through language mastery and cultural understanding.
              </p>
              <div style={{ display: 'flex', gap: 32 }}>
                {[{ num: '500+', label: 'Students' }, { num: '4', label: 'Languages' }, { num: '10+', label: 'Expert Teachers' }].map((s, i) => (
                  <div key={i}>
                    <p style={{ fontSize: 26, fontWeight: 800, color: '#818cf8', margin: 0 }}>{s.num}</p>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', fontWeight: 600, margin: '3px 0 0', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Video placeholder — SAME dimensions as original */}
            <div style={{ flex: '1 1 380px' }}>
              <div style={{
                width: '100%', height: 288,
                background: 'linear-gradient(135deg, #1e2a4a, #2D428B)',
                borderRadius: 20,
                border: '1px solid rgba(255,255,255,0.10)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.40)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative', overflow: 'hidden',
              }}>
                {/* Subtle pattern */}
                <div style={{ position:'absolute', top:-40, right:-40, width:180, height:180, borderRadius:'50%', background:'rgba(67,24,255,0.12)', pointerEvents:'none' }}/>
                <div style={{ position:'absolute', bottom:-30, left:-30, width:130, height:130, borderRadius:'50%', background:'rgba(67,24,255,0.09)', pointerEvents:'none' }}/>
                <button
                  style={{
                    width: 64, height: 64, borderRadius: '50%',
                    background: '#4318FF',
                    border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 0 0 12px rgba(67,24,255,0.18)',
                    position: 'relative', zIndex: 1,
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform='scale(1.08)'; e.currentTarget.style.boxShadow='0 0 0 16px rgba(67,24,255,0.22)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform='scale(1)'; e.currentTarget.style.boxShadow='0 0 0 12px rgba(67,24,255,0.18)'; }}
                >
                  <PlayIcon />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            3. PROGRAMS SECTION
        ══════════════════════════════════════════ */}
        <div id="languages-section" style={{ background: '#0A1128', padding: '0 40px 96px' }}>
          <div style={{ width: '85%', maxWidth: 1200, margin: '0 auto', height: 1, background: 'rgba(255,255,255,0.08)', marginBottom: 64 }}/>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>

            <div style={{ marginBottom: 52 }}>
              <h2 style={{ fontSize: 38, fontWeight: 800, color: '#fff', marginBottom: 12, letterSpacing: '-0.02em' }}>
                Explore Our Programs
              </h2>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.50)', lineHeight: 1.6 }}>
                Enhancing linguistic abilities to open global horizons
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
              {courses.map((course, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#fff', borderRadius: 16,
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                    transition: 'transform 0.25s, box-shadow 0.25s',
                    cursor: 'default',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform='translateY(-6px)'; e.currentTarget.style.boxShadow='0 12px 36px rgba(0,0,0,0.22)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 4px 20px rgba(0,0,0,0.15)'; }}
                >
                  {/* Image — SAME height as original (h-44 = 176px) */}
                  <div style={{ height: 176, overflow: 'hidden', background: '#e2e8f0' }}>
                    <img
                      src={course.image}
                      alt={course.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  </div>
                  <div style={{ padding: '20px 20px 32px' }}>
                    <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0A1128', marginBottom: 8 }}>
                      {course.name}
                    </h3>
                    <p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.6 }}>
                      {course.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 56, textAlign: 'center' }}>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.60)' }}>
                Not sure which level you are?{' '}
                <span
                  onClick={() => navigate('/join')}
                  style={{ color: '#818cf8', fontWeight: 700, cursor: 'pointer', transition: 'color 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.color='#fff'}
                  onMouseLeave={e => e.currentTarget.style.color='#818cf8'}
                >
                  Take our Free Placement Test 
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            4. TEAM SECTION
        ══════════════════════════════════════════ */}
        <div id="teachers-section" style={{ background: '#0A1128', padding: '0 40px 96px' }}>
          <div style={{ width: '85%', maxWidth: 1200, margin: '0 auto', height: 1, background: 'rgba(255,255,255,0.08)', marginBottom: 64 }}/>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>

            <div style={{ marginBottom: 52 }}>
              <h2 style={{ fontSize: 38, fontWeight: 800, color: '#fff', marginBottom: 12, letterSpacing: '-0.02em' }}>
                Our Team
              </h2>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.50)' }}>
                Guided by Passionate Educators
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 64 }}>
              {team.map((member, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#fff', borderRadius: 16,
                    overflow: 'hidden', textAlign: 'center',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                    transition: 'transform 0.25s, box-shadow 0.25s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 10px 32px rgba(0,0,0,0.20)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 4px 20px rgba(0,0,0,0.15)'; }}
                >
                  {/* Photo placeholder — SAME height as original (h-56 = 224px) */}
                  <div style={{
                    height: 224, background: 'linear-gradient(135deg, #e2e8f0, #cbd5e1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <div style={{
                      width: 64, height: 64, borderRadius: '50%',
                      background: '#94a3b8',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <UserIcon />
                    </div>
                  </div>
                  <div style={{ padding: '20px 16px 24px' }}>
                    <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0A1128', marginBottom: 4 }}>
                      {member.name}
                    </h3>
                    <p style={{ fontSize: 12, color: '#64748b', marginBottom: 16 }}>
                      {member.role}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
                      {[FacebookIcon, InstagramIcon, TwitterIcon].map((Icon, i) => (
                        <button
                          key={i}
                          style={{
                            width: 30, height: 30, borderRadius: '50%',
                            background: '#eef2ff', border: 'none', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#4318FF', transition: 'all 0.15s',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background='#4318FF'; e.currentTarget.style.color='#fff'; }}
                          onMouseLeave={e => { e.currentTarget.style.background='#eef2ff'; e.currentTarget.style.color='#4318FF'; }}
                        >
                          <Icon />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Join faculty CTA */}
            <div style={{
              textAlign: 'center',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.10)',
              borderRadius: 20, padding: '48px 40px',
              maxWidth: 680, margin: '0 auto',
            }}>
              <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: 'linear-gradient(135deg, #4318FF, #6b47ff)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px',
                boxShadow: '0 6px 20px rgba(67,24,255,0.30)',
              }}>
                <BookOpenIcon />
              </div>
              <h3 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 12, letterSpacing: '-0.01em' }}>
                Are you a language expert?
              </h3>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.50)', marginBottom: 28, lineHeight: 1.7 }}>
                We are always looking for passionate educators to join our growing academy.
              </p>
              <button
                onClick={() => setShowTeacherModal(true)}
                style={{
                  background: 'transparent',
                  border: '2px solid #4318FF',
                  color: '#fff', padding: '12px 28px',
                  borderRadius: 10, fontSize: 13, fontWeight: 700,
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background='#4318FF'; e.currentTarget.style.boxShadow='0 4px 14px rgba(67,24,255,0.35)'; }}
                onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.boxShadow='none'; }}
              >
                Join Our Team
              </button>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            5. FOOTER
        ══════════════════════════════════════════ */}
        <footer style={{ background: '#060d1f', padding: '64px 40px 32px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 2fr', gap: 48, marginBottom: 48 }}>

              {/* Brand col */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 9,
                    background: 'linear-gradient(135deg, #4318FF, #6b47ff)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <GlobeIcon />
                  </div>
                  <span style={{ fontSize: 15, fontWeight: 800, color: '#fff' }}>
                    {firstName}<span style={{ color: '#818cf8' }}> {restName}</span>
                  </span>
                </div>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.40)', lineHeight: 1.8, maxWidth: 280 }}>
                  Empowering students to communicate globally. Join us to start learning your favorite languages today.
                </p>
              </div>

              {/* Legal col */}
              <div>
                <h4 style={{ fontSize: 12, fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 20 }}>
                  Legal
                </h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {['Terms of Service', 'Privacy Policy', 'Cookie Policy'].map(item => (
                    <li key={item}>
                      <a href="#" style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', textDecoration: 'none', transition: 'color 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.color='#fff'}
                        onMouseLeave={e => e.currentTarget.style.color='rgba(255,255,255,0.45)'}
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact col */}
              <div>
                <h4 style={{ fontSize: 12, fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 20 }}>
                  Get In Touch
                </h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {[
                    { icon: <PhoneIcon />,  text: schoolSettings.phone   },
                    { icon: <MapPinIcon />, text: schoolSettings.address  },
                    { icon: <MailIcon />,   text: schoolSettings.email    },
                  ].map((item, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <span style={{ color: '#818cf8', flexShrink: 0, marginTop: 1 }}>{item.icon}</span>
                      <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.50)', lineHeight: 1.5 }}>{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom row */}
            <div style={{
              borderTop: '1px solid rgba(255,255,255,0.07)',
              paddingTop: 24,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              flexWrap: 'wrap', gap: 12,
            }}>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.30)' }}>
                Made with care by Marwa, Malak &amp; Selma — All Rights Reserved
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                {[FacebookIcon, InstagramIcon, TwitterIcon].map((Icon, i) => (
                  <button
                    key={i}
                    style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.10)',
                      cursor: 'pointer', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      color: 'rgba(255,255,255,0.45)', transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background='#4318FF'; e.currentTarget.style.color='#fff'; e.currentTarget.style.borderColor='#4318FF'; }}
                    onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.06)'; e.currentTarget.style.color='rgba(255,255,255,0.45)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.10)'; }}
                  >
                    <Icon />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </footer>

        {/* ══════════════════════════════════════════
            6. TEACHER APPLICATION MODAL
        ══════════════════════════════════════════ */}
        {showTeacherModal && (
          <div
            onClick={(e) => { if (e.target === e.currentTarget) setShowTeacherModal(false); }}
            style={{
              position: 'fixed', inset: 0, zIndex: 200,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 16, background: 'rgba(0,0,0,0.72)',
              backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
              animation: 'fadeIn 0.2s ease both',
            }}
          >
            <div style={{
              background: '#fff', borderRadius: 20,
              padding: '36px 36px 32px', maxWidth: 520, width: '100%',
              boxShadow: '0 24px 80px rgba(0,0,0,0.40)',
              position: 'relative',
              animation: 'fadeUp 0.3s cubic-bezier(.4,0,.2,1) both',
              maxHeight: '90vh', overflowY: 'auto',
            }}>
              {/* Close */}
              <button
                onClick={() => setShowTeacherModal(false)}
                style={{
                  position: 'absolute', top: 20, right: 20,
                  width: 32, height: 32, borderRadius: '50%',
                  background: '#f1f5f9', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#64748b', transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background='#fef2f2'; e.currentTarget.style.color='#dc2626'; }}
                onMouseLeave={e => { e.currentTarget.style.background='#f1f5f9'; e.currentTarget.style.color='#64748b'; }}
              >
                <CloseIcon />
              </button>

              {/* Header */}
              <div style={{ marginBottom: 28 }}>
                <div style={{
                  width: 46, height: 46, borderRadius: 12,
                  background: 'linear-gradient(135deg, #4318FF, #6b47ff)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 14, boxShadow: '0 4px 14px rgba(67,24,255,0.30)',
                }}>
                  <BookOpenIcon />
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>
                  Join Our Faculty
                </h2>
                <p style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>
                  Fill out the form below and attach your CV (PDF).
                </p>
              </div>

              {/* Form — ALL SUPABASE LOGIC UNTOUCHED */}
              <form onSubmit={handleTeacherSubmit} noValidate>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                  <div>
                    <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:7 }}>First Name</label>
                    <input
                      type="text" placeholder="Jean" required
                      value={teacherForm.first_name}
                      onChange={e => setTeacherForm({ ...teacherForm, first_name: e.target.value })}
                      style={modalInputStyle}
                      onFocus={e => { e.target.style.borderColor='#4318FF'; e.target.style.boxShadow='0 0 0 3px rgba(67,24,255,0.09)'; e.target.style.background='#fff'; }}
                      onBlur={e  => { e.target.style.borderColor='#e2e8f0'; e.target.style.boxShadow='none'; e.target.style.background='#f8fafc'; }}
                    />
                  </div>
                  <div>
                    <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:7 }}>Last Name</label>
                    <input
                      type="text" placeholder="Dupont" required
                      value={teacherForm.last_name}
                      onChange={e => setTeacherForm({ ...teacherForm, last_name: e.target.value })}
                      style={modalInputStyle}
                      onFocus={e => { e.target.style.borderColor='#4318FF'; e.target.style.boxShadow='0 0 0 3px rgba(67,24,255,0.09)'; e.target.style.background='#fff'; }}
                      onBlur={e  => { e.target.style.borderColor='#e2e8f0'; e.target.style.boxShadow='none'; e.target.style.background='#f8fafc'; }}
                    />
                  </div>
                </div>

                {[
                  { label: 'Email Address', type: 'email', key: 'email', placeholder: 'name@fluentia.com' },
                  { label: 'Phone Number',  type: 'tel',   key: 'phone', placeholder: '+213 6 12 34 56 78' },
                ].map(field => (
                  <div key={field.key} style={{ marginBottom: 12 }}>
                    <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:7 }}>{field.label}</label>
                    <input
                      type={field.type} placeholder={field.placeholder} required
                      value={teacherForm[field.key]}
                      onChange={e => setTeacherForm({ ...teacherForm, [field.key]: e.target.value })}
                      style={modalInputStyle}
                      onFocus={e => { e.target.style.borderColor='#4318FF'; e.target.style.boxShadow='0 0 0 3px rgba(67,24,255,0.09)'; e.target.style.background='#fff'; }}
                      onBlur={e  => { e.target.style.borderColor='#e2e8f0'; e.target.style.boxShadow='none'; e.target.style.background='#f8fafc'; }}
                    />
                  </div>
                ))}

                <div style={{ marginBottom: 12 }}>
                  <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:7 }}>Specialty</label>
                  <select
                    value={teacherForm.subject}
                    onChange={e => setTeacherForm({ ...teacherForm, subject: e.target.value })}
                    style={{
                      ...modalInputStyle,
                      cursor: 'pointer', appearance: 'none', WebkitAppearance: 'none',
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center',
                      paddingRight: 36,
                    }}
                    onFocus={e => { e.target.style.borderColor='#4318FF'; e.target.style.boxShadow='0 0 0 3px rgba(67,24,255,0.09)'; }}
                    onBlur={e  => { e.target.style.borderColor='#e2e8f0'; e.target.style.boxShadow='none'; }}
                  >
                    <option value="English">English Teacher</option>
                    <option value="French">French Teacher</option>
                    <option value="German">German Teacher</option>
                    <option value="Spanish">Spanish Teacher</option>
                  </select>
                </div>

                {/* CV Upload */}
                <div style={{ marginBottom: 24 }}>
                  <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:7 }}>
                    Upload CV (PDF)
                  </label>
                  <label style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '11px 14px', borderRadius: 10,
                    border: `1.5px dashed ${cvFile ? '#4318FF' : '#e2e8f0'}`,
                    background: cvFile ? '#f5f3ff' : '#f8fafc',
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}>
                    <span style={{ color: cvFile ? '#4318FF' : '#94a3b8' }}><UploadIcon /></span>
                    <span style={{ fontSize: 13, color: cvFile ? '#4318FF' : '#94a3b8', fontWeight: 500 }}>
                      {cvFile ? cvFile.name : 'Click to upload your CV'}
                    </span>
                    <input
                      type="file" accept=".pdf"
                      onChange={e => setCvFile(e.target.files[0])}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>

                {/* Submit */}
                <button
                  type="submit" disabled={isSubmitting}
                  style={{
                    width: '100%', height: 48, border: 'none', borderRadius: 10,
                    background: isSubmitting ? '#94a3b8' : '#4318FF',
                    color: '#fff', fontSize: 14, fontWeight: 700,
                    fontFamily: "'Inter','Segoe UI',sans-serif",
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    boxShadow: isSubmitting ? 'none' : '0 4px 16px rgba(67,24,255,0.28)',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { if (!isSubmitting) { e.currentTarget.style.background='#3510d4'; e.currentTarget.style.transform='translateY(-1px)'; }}}
                  onMouseLeave={e => { e.currentTarget.style.background=isSubmitting?'#94a3b8':'#4318FF'; e.currentTarget.style.transform='none'; }}
                >
                  {isSubmitting ? (
                    <>
                      <span style={{ width:16, height:16, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'#fff', borderRadius:'50%', display:'inline-block', animation:'spin 0.7s linear infinite' }}/>
                      Submitting...
                    </>
                  ) : (
                    <><SendIcon /> Submit Application</>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </>
  );
};

// ─── App Router — UNTOUCHED ───────────────────────────────────────────────────
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/"                  element={<HomePage />}         />
        <Route path="/login"             element={<Login />}            />
        <Route path="/join"              element={<Join />}             />
        <Route path="/secretary/dashboard" element={<SecretaryDashboard />} />
        <Route path="/admin/dashboard"   element={<AdminDashboard />}   />
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/student-parent"    element={<StudentDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
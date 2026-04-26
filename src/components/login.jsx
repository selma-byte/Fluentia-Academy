import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

// ─── Icons ────────────────────────────────────────────────────────────────────
const ArrowLeftIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);
const GlobeIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);
const MailIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);
const LockIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const EyeIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
const EyeOffIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);
const AlertIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);
const ArrowRightIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);
const ShieldIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

// ─── Login Component ──────────────────────────────────────────────────────────
const Login = () => {
  const navigate = useNavigate();

  const [email,       setEmail]       = useState('');
  const [password,   setPassword]   = useState('');
  const [loading,    setLoading]    = useState(false);
  const [errorMsg,   setErrorMsg]   = useState('');
  const [showPw,     setShowPw]     = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);
  const [pwFocus,    setPwFocus]    = useState(false);
  const [backHover,  setBackHover]  = useState(false);

  // 💡 State for dynamic school settings
  const [schoolSettings, setSchoolSettings] = useState({
    name: 'POLYGLOT ACADEMY',
    logo: null
  });

  // 💡 Fetch school settings from DB on mount
  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from('school_settings').select('*').eq('id', 1).single();
      if (data) {
        setSchoolSettings({
          name: data.name || 'POLYGLOT ACADEMY',
          logo: data.logo || null
        });
      }
    };
    fetchSettings();
  }, []);

  // Split name for styling (e.g., "POLYGLOT" and "ACADEMY")
  const nameParts = schoolSettings.name.split(' ');
  const firstName = nameParts[0] || 'POLYGLOT';
  const lastName = nameParts.slice(1).join(' ') || 'ACADEMY';

  // ── ALL ORIGINAL SUPABASE LOGIC — COMPLETELY UNTOUCHED ───────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password,
    });

    if (authError) {
      setErrorMsg("Incorrect email or password. Please try again.");
      setLoading(false);
      return;
    }

    const userEmail = authData.user.email;

    try {
      const { data: staffData, error: staffError } = await supabase
        .from('staff')
        .select('role')
        .eq('email', userEmail)
        .maybeSingle();

      if (staffData && staffData.role) {
        const role = staffData.role.toLowerCase();
        if (role === 'admin')          navigate('/admin/dashboard');
        else if (role === 'secretary') navigate('/secretary/dashboard');
        else if (role === 'teacher')   navigate('/teacher/dashboard');
        else {
          setErrorMsg(`Your role (${staffData.role}) is not configured in the system.`);
          await supabase.auth.signOut();
        }
        setLoading(false);
        return;
      }

      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .select('exam_type, status')
        .eq('email', userEmail)
        .maybeSingle();

      if (studentData) {
        if (studentData.exam_type === 'Placement') {
          setErrorMsg("You must complete your placement exam before accessing the portal.");
          await supabase.auth.signOut();
          setLoading(false);
          return;
        }
        navigate('/student-parent');
        setLoading(false);
        return;
      }

      setErrorMsg("This account is not linked to any role in the system.");
      await supabase.auth.signOut();

    } catch (err) {
      setErrorMsg("A system error occurred. Please try again.");
      await supabase.auth.signOut();
    }

    setLoading(false);
  };
  // ─────────────────────────────────────────────────────────────────────────

  const inputStyle = (focused) => ({
    width: '100%',
    height: 48,
    background: focused ? '#fff' : '#f8fafc',
    border: `1.5px solid ${focused ? '#4318FF' : '#e2e8f0'}`,
    borderRadius: 10,
    padding: '0 44px',
    fontSize: 14,
    fontFamily: "'Inter','Segoe UI',sans-serif",
    color: '#0f172a',
    outline: 'none',
    boxShadow: focused ? '0 0 0 3px rgba(67,24,255,0.10)' : 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s, background 0.2s',
    boxSizing: 'border-box',
  });

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(18px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input::placeholder { color: #94a3b8; }
      `}</style>

      <div style={{
        minHeight: '100vh',
        width: '100%',
        background: '#f8fafc',
        fontFamily: "'Inter','Segoe UI',sans-serif",
        display: 'flex',
        flexDirection: 'column',
      }}>

        {/* ── Top bar — matches dashboard topbar style ── */}
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0,
          height: 58,
          background: '#fff',
          borderBottom: '1px solid #f1f5f9',
          display: 'flex', alignItems: 'center',
          padding: '0 28px', zIndex: 100,
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}>
          <button
            onClick={() => navigate('/')}
            onMouseEnter={() => setBackHover(true)}
            onMouseLeave={() => setBackHover(false)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              fontSize: 13, fontWeight: 600,
              color: backHover ? '#4318FF' : '#64748b',
              background: backHover ? 'rgba(67,24,255,0.06)' : 'transparent',
              border: 'none', cursor: 'pointer',
              padding: '7px 12px', borderRadius: 8,
              transition: 'all 0.15s',
              transform: backHover ? 'translateX(-2px)' : 'none',
            }}
          >
            <ArrowLeftIcon />
            Back to Home
          </button>
        </div>

        {/* ── Page center ── */}
        <div style={{
          flex: 1, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          padding: '80px 16px 32px', minHeight: '100vh',
        }}>

          {/* ── Card ── */}
          <div style={{
            display: 'flex',
            width: '100%',
            maxWidth: 860,
            background: '#fff',
            borderRadius: 20,
            boxShadow: '0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
            overflow: 'hidden',
            border: '1px solid #f1f5f9',
            animation: 'fadeUp 0.4s cubic-bezier(.4,0,.2,1) both',
            minHeight: 520,
          }}>

            {/* ════ LEFT PANEL — exact same dark navy as sidebar ════ */}
            <div style={{
              flex: '0 0 300px',
              background: '#0f172a',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '52px 36px',
              position: 'relative',
              overflow: 'hidden',
            }}>
              {/* Subtle glow circles matching dashboard sidebar feel */}
              <div style={{
                position: 'absolute', top: -100, right: -100,
                width: 280, height: 280, borderRadius: '50%',
                background: 'rgba(67,24,255,0.08)',
                pointerEvents: 'none',
              }}/>
              <div style={{
                position: 'absolute', bottom: -80, left: -80,
                width: 220, height: 220, borderRadius: '50%',
                background: 'rgba(67,24,255,0.06)',
                pointerEvents: 'none',
              }}/>

              {/* 💡 Dynamic Logo mark */}
              <div style={{
                width: 68, height: 68, borderRadius: 16,
                background: schoolSettings.logo ? '#fff' : 'linear-gradient(135deg, #4318FF, #6b47ff)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 22, position: 'relative', zIndex: 1,
                boxShadow: '0 8px 24px rgba(67,24,255,0.35)',
                overflow: 'hidden'
              }}>
                {schoolSettings.logo ? (
                  <img src={schoolSettings.logo} alt="School Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <GlobeIcon />
                )}
              </div>

              {/* 💡 Dynamic School name */}
              <p style={{
                margin: 0,
                fontSize: 13, fontWeight: 800,
                color: '#fff',
                letterSpacing: '0.05em',
                textAlign: 'center',
                lineHeight: 1.1,
                position: 'relative', zIndex: 1,
                textTransform: 'uppercase',
              }}>
                {firstName}
              </p>
              <p style={{
                margin: 0,
                fontSize: 9, fontWeight: 700,
                color: '#818cf8',
                letterSpacing: '0.14em',
                textAlign: 'center',
                position: 'relative', zIndex: 1,
                marginBottom: 28,
              }}>
                {lastName}
              </p>

              {/* Divider */}
              <div style={{
                width: 32, height: 1,
                background: 'rgba(255,255,255,0.1)',
                marginBottom: 28,
                position: 'relative', zIndex: 1,
              }}/>

              {/* Tagline */}
              <p style={{
                fontSize: 13, fontWeight: 500,
                color: 'rgba(255,255,255,0.45)',
                textAlign: 'center',
                lineHeight: 1.6,
                position: 'relative', zIndex: 1,
                letterSpacing: '0.01em',
              }}>
                Language Excellence Platform
              </p>
            </div>

            {/* ════ RIGHT PANEL ════ */}
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '52px 48px',
            }}>

              {/* Header */}
              <div style={{ marginBottom: 28 }}>
                <h1 style={{
                  margin: 0, fontSize: 24, fontWeight: 800,
                  color: '#1e293b', letterSpacing: '-0.02em', lineHeight: 1.2,
                }}>
                  Welcome back
                </h1>
                <p style={{ margin: '6px 0 0', fontSize: 13, color: '#64748b', fontWeight: 500 }}>
                  Sign in to access your portal
                </p>
              </div>

              {/* Error banner */}
              {errorMsg && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '11px 14px',
                  background: '#fef2f2', border: '1px solid #fecaca',
                  borderRadius: 10, marginBottom: 20,
                  fontSize: 13, color: '#dc2626', fontWeight: 600,
                  animation: 'fadeUp 0.2s ease both',
                }}>
                  <AlertIcon />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>

                {/* Email */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{
                    display: 'block', fontSize: 11, fontWeight: 700,
                    color: '#94a3b8', textTransform: 'uppercase',
                    letterSpacing: '0.08em', marginBottom: 8,
                  }}>
                    Email Address
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span style={{
                      position: 'absolute', left: 15, top: '50%',
                      transform: 'translateY(-50%)',
                      color: emailFocus ? '#4318FF' : '#94a3b8',
                      pointerEvents: 'none', transition: 'color 0.2s',
                      display: 'flex', alignItems: 'center',
                    }}>
                      <MailIcon />
                    </span>
                    <input
                      type="email" required
                      value={email}
                      onChange={e => { setEmail(e.target.value); setErrorMsg(''); }}
                      onFocus={() => setEmailFocus(true)}
                      onBlur={()  => setEmailFocus(false)}
                      placeholder="name@Fluentia.com"
                      style={inputStyle(emailFocus)}
                      autoComplete="email"
                    />
                  </div>
                </div>

                {/* Password */}
                <div style={{ marginBottom: 4 }}>
                  <label style={{
                    display: 'block', fontSize: 11, fontWeight: 700,
                    color: '#94a3b8', textTransform: 'uppercase',
                    letterSpacing: '0.08em', marginBottom: 8,
                  }}>
                    Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span style={{
                      position: 'absolute', left: 15, top: '50%',
                      transform: 'translateY(-50%)',
                      color: pwFocus ? '#4318FF' : '#94a3b8',
                      pointerEvents: 'none', transition: 'color 0.2s',
                      display: 'flex', alignItems: 'center',
                    }}>
                      <LockIcon />
                    </span>
                    <input
                      type={showPw ? 'text' : 'password'} required
                      value={password}
                      onChange={e => { setPassword(e.target.value); setErrorMsg(''); }}
                      onFocus={() => setPwFocus(true)}
                      onBlur={()  => setPwFocus(false)}
                      placeholder="••••••••"
                      style={{ ...inputStyle(pwFocus), paddingRight: 46 }}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(v => !v)}
                      style={{
                        position: 'absolute', right: 13, top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: '#94a3b8', padding: 4, borderRadius: 4,
                        display: 'flex', alignItems: 'center',
                        transition: 'color 0.2s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.color = '#4318FF'}
                      onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
                    >
                      {showPw ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>

                {/* Options row */}
                <div style={{
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', margin: '14px 0 22px',
                }}>
                  <label style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    fontSize: 13, color: '#64748b',
                    cursor: 'pointer', fontWeight: 500, userSelect: 'none',
                  }}>
                    <input
                      type="checkbox"
                      style={{ width: 15, height: 15, accentColor: '#4318FF', cursor: 'pointer' }}
                    />
                    Remember me
                  </label>
                  <a href="#"
                    style={{ fontSize: 13, fontWeight: 700, color: '#4318FF', textDecoration: 'none' }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                  >
                    Forgot Password?
                  </a>
                </div>

                {/* Submit button — same purple as active nav */}
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%', height: 48, border: 'none', borderRadius: 10,
                    background: loading ? '#94a3b8' : '#4318FF',
                    color: '#fff', fontSize: 14, fontWeight: 700,
                    fontFamily: "'Inter','Segoe UI',sans-serif",
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    boxShadow: loading ? 'none' : '0 4px 16px rgba(67,24,255,0.30)',
                    transition: 'all 0.15s', letterSpacing: '0.01em',
                  }}
                  onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = '#3510d4'; e.currentTarget.style.boxShadow = '0 6px 22px rgba(67,24,255,0.40)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}}
                  onMouseLeave={e => { e.currentTarget.style.background = loading ? '#94a3b8' : '#4318FF'; e.currentTarget.style.boxShadow = loading ? 'none' : '0 4px 16px rgba(67,24,255,0.30)'; e.currentTarget.style.transform = 'none'; }}
                  onMouseDown={e  => { if (!loading) e.currentTarget.style.transform = 'scale(0.985)'; }}
                  onMouseUp={e    => { if (!loading) e.currentTarget.style.transform = 'translateY(-1px)'; }}
                >
                  {loading ? (
                    <>
                      <span style={{
                        width: 16, height: 16,
                        border: '2px solid rgba(255,255,255,0.3)',
                        borderTopColor: '#fff', borderRadius: '50%',
                        display: 'inline-block',
                        animation: 'spin 0.7s linear infinite',
                      }}/>
                      Authenticating...
                    </>
                  ) : (
                    <> Sign In  </>
                  )}
                </button>

              </form>

              {/* Footer */}
              <p style={{
                textAlign: 'center', marginTop: 20,
                fontSize: 12, color: '#94a3b8', fontWeight: 500,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
              }}>
                <ShieldIcon />
                Secured connection &nbsp;·&nbsp; {firstName} {lastName} &copy; {new Date().getFullYear()}
              </p>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
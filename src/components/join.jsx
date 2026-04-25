import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

// ─── Icons ────────────────────────────────────────────────────────────────────
const ArrowLeftIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);
const GlobeIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);
const UserIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);
const MailIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);
const PhoneIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6.13 6.13l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);
const BookIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
);
const StarIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const MessageIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);
const ChildIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4"/>
    <path d="M6 20v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>
  </svg>
);
const CalendarIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const SendIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);
const StudentIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
    <path d="M6 12v5c0 2 4 3 6 3s6-1 6-3v-5"/>
  </svg>
);
const ParentIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const AlertIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

// ─── Reusable field components ────────────────────────────────────────────────
const FieldLabel = ({ children, required }) => (
  <label style={{
    display: 'block', fontSize: 11, fontWeight: 700,
    color: '#94a3b8', textTransform: 'uppercase',
    letterSpacing: '0.08em', marginBottom: 7,
  }}>
    {children}{required && <span style={{ color: '#f87171', marginLeft: 3 }}>*</span>}
  </label>
);

const InputWrap = ({ icon: Icon, children, focused }) => (
  <div style={{ position: 'relative' }}>
    <span style={{
      position: 'absolute', left: 14, top: '50%',
      transform: 'translateY(-50%)',
      color: focused ? '#4318FF' : '#94a3b8',
      pointerEvents: 'none', transition: 'color 0.2s',
      display: 'flex', alignItems: 'center',
    }}>
      <Icon />
    </span>
    {children}
  </div>
);

const inputStyle = (focused, small = false) => ({
  width: '100%',
  height: small ? 42 : 44,
  background: focused ? '#fff' : '#f8fafc',
  border: `1.5px solid ${focused ? '#4318FF' : '#e2e8f0'}`,
  borderRadius: 10,
  padding: '0 14px 0 40px',
  fontSize: 13.5,
  fontFamily: "'Inter','Segoe UI',sans-serif",
  color: '#0f172a',
  outline: 'none',
  boxShadow: focused ? '0 0 0 3px rgba(67,24,255,0.09)' : 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s, background 0.2s',
  boxSizing: 'border-box',
});

const selectStyle = (focused) => ({
  ...inputStyle(focused),
  cursor: 'pointer',
  appearance: 'none',
  WebkitAppearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 14px center',
  paddingRight: 36,
});

// ─── Section header ───────────────────────────────────────────────────────────
const SectionHeading = ({ icon: Icon, title, accent }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 8,
    paddingBottom: 10, marginBottom: 16,
    borderBottom: `1.5px solid ${accent ? '#e0e7ff' : '#f1f5f9'}`,
  }}>
    <span style={{ color: accent ? '#4318FF' : '#64748b', display: 'flex', alignItems: 'center' }}>
      <Icon />
    </span>
    <h3 style={{
      margin: 0, fontSize: 12.5, fontWeight: 700,
      color: accent ? '#3730a3' : '#475569',
      textTransform: 'uppercase', letterSpacing: '0.06em',
    }}>
      {title}
    </h3>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const Join = ({ onBack }) => {
  const [selectedRole, setSelectedRole] = useState('student');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted,    setSubmitted]    = useState(false);
  const [errorMsg,     setErrorMsg]     = useState('');
  const [backHover,    setBackHover]    = useState(false);

  // Focus states
  const [focused, setFocused] = useState({});
  const onFocus = (k) => setFocused(f => ({ ...f, [k]: true  }));
  const onBlur  = (k) => setFocused(f => ({ ...f, [k]: false }));

  // ── ALL ORIGINAL SUPABASE FORMDATA STATE — UNTOUCHED ─────────────────────
  const [formData, setFormData] = useState({
    firstName: '',
    lastName:  '',
    email:     '',
    phone:     '',
    childName: '',
    childAge:  '',
    course:    '',
    level:     '',
    message:   '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg('');
  };

  // ── ALL ORIGINAL SUPABASE SUBMIT LOGIC — UNTOUCHED ───────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const { error } = await supabase
        .from('students')
        .insert([{
          first_name:      formData.firstName,
          last_name:       formData.lastName,
          email:           formData.email,
          phone:           formData.phone,
          language:        formData.course,
          level:           formData.level,
          child_name:      selectedRole === 'parent' ? formData.childName : null,
          child_age:       selectedRole === 'parent' ? formData.childAge  : null,
          exam_type:       'Placement',
          status:          'Pending',
          enrollment_date: new Date().toISOString().split('T')[0],
        }]);

      if (error) throw error;

      setSubmitted(true);
      setFormData({ firstName: '', lastName: '', email: '', phone: '', childName: '', childAge: '', course: '', level: '', message: '' });
      setSelectedRole('student');

    } catch (err) {
      setErrorMsg("Submission failed: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(18px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes popIn {
          0%   { opacity:0; transform:scale(0.85); }
          100% { opacity:1; transform:scale(1); }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input::placeholder, textarea::placeholder { color: #94a3b8; }
        select option { color: #0f172a; }
        textarea { resize: none; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>

      <div style={{
        minHeight: '100vh', width: '100%',
        background: '#f8fafc',
        fontFamily: "'Inter','Segoe UI',sans-serif",
        display: 'flex', flexDirection: 'column',
      }}>

        {/* ── Top bar — identical to Login topbar ── */}
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, height: 58,
          background: '#fff', borderBottom: '1px solid #f1f5f9',
          display: 'flex', alignItems: 'center', padding: '0 28px',
          zIndex: 100, boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}>
          <button
            onClick={onBack}
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
            <ArrowLeftIcon /> Back to Home
          </button>
        </div>

        {/* ── Page center ── */}
        <div style={{
          flex: 1, display: 'flex', alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '80px 16px 48px', minHeight: '100vh',
        }}>

          {/* ── Success state ── */}
          {submitted ? (
            <div style={{
              marginTop: 40, background: '#fff',
              borderRadius: 20, padding: '56px 48px',
              boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
              border: '1px solid #f1f5f9',
              textAlign: 'center', maxWidth: 480, width: '100%',
              animation: 'popIn 0.4s cubic-bezier(.4,0,.2,1) both',
            }}>
              <div style={{
                width: 72, height: 72, borderRadius: '50%',
                background: '#ecfdf5', border: '2px solid #6ee7b7',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px', color: '#059669',
              }}>
                <CheckIcon />
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1e293b', margin: '0 0 10px' }}>
                Request Submitted!
              </h2>
              <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6, margin: '0 0 28px' }}>
                Your enrollment request has been received. Our team will contact you shortly to finalize your registration.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                style={{
                  padding: '11px 28px', borderRadius: 10, border: 'none',
                  background: '#4318FF', color: '#fff', fontSize: 13,
                  fontWeight: 700, cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(67,24,255,0.28)',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#3510d4'}
                onMouseLeave={e => e.currentTarget.style.background = '#4318FF'}
              >
                Submit Another Request
              </button>
            </div>
          ) : (

          // ── Main card ──
          <div style={{
            width: '100%', maxWidth: 680,
            background: '#fff', borderRadius: 20,
            boxShadow: '0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
            border: '1px solid #f1f5f9',
            overflow: 'hidden',
            animation: 'fadeUp 0.4s cubic-bezier(.4,0,.2,1) both',
          }}>

            {/* ── Card top banner — same navy as sidebar ── */}
            <div style={{
              background: '#0f172a',
              padding: '28px 36px',
              display: 'flex', alignItems: 'center', gap: 18,
              position: 'relative', overflow: 'hidden',
            }}>
              {/* Glow circles */}
              <div style={{ position:'absolute', top:-60, right:-60, width:180, height:180, borderRadius:'50%', background:'rgba(67,24,255,0.10)', pointerEvents:'none' }}/>
              <div style={{ position:'absolute', bottom:-50, left:200, width:140, height:140, borderRadius:'50%', background:'rgba(67,24,255,0.07)', pointerEvents:'none' }}/>

              <div style={{
                width: 52, height: 52, borderRadius: 14, flexShrink: 0,
                background: 'linear-gradient(135deg, #4318FF, #6b47ff)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 6px 20px rgba(67,24,255,0.35)',
                position: 'relative', zIndex: 1,
              }}>
                <GlobeIcon />
              </div>

              <div style={{ position: 'relative', zIndex: 1 }}>
                <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }}>
                  Enrollment Request
                </h1>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: 'rgba(255,255,255,0.50)', fontWeight: 500 }}>
                  Join Polyglot Academy — complete the form below
                </p>
              </div>
            </div>

            {/* ── Form body ── */}
            <div style={{ padding: '32px 36px 36px' }}>

              {/* Role toggle */}
              <div style={{
                display: 'flex', background: '#f8fafc',
                borderRadius: 12, padding: 4,
                border: '1px solid #f1f5f9', marginBottom: 28,
              }}>
                {[
                  { key: 'student', label: 'I am a Student', Icon: StudentIcon },
                  { key: 'parent',  label: 'I am a Parent',  Icon: ParentIcon  },
                ].map(({ key, label, Icon }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedRole(key)}
                    style={{
                      flex: 1, display: 'flex', alignItems: 'center',
                      justifyContent: 'center', gap: 8,
                      padding: '10px 16px', borderRadius: 9, border: 'none',
                      fontSize: 13, fontWeight: 700, cursor: 'pointer',
                      transition: 'all 0.15s',
                      background: selectedRole === key ? '#fff' : 'transparent',
                      color: selectedRole === key ? '#4318FF' : '#94a3b8',
                      boxShadow: selectedRole === key ? '0 1px 6px rgba(0,0,0,0.08)' : 'none',
                    }}
                  >
                    <span style={{ color: selectedRole === key ? '#4318FF' : '#94a3b8' }}><Icon /></span>
                    {label}
                  </button>
                ))}
              </div>

              {/* Error banner */}
              {errorMsg && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '11px 14px', background: '#fef2f2',
                  border: '1px solid #fecaca', borderRadius: 10,
                  marginBottom: 20, fontSize: 13, color: '#dc2626', fontWeight: 600,
                  animation: 'fadeUp 0.2s ease both',
                }}>
                  <AlertIcon /><span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>

                {/* ── Personal Information ── */}
                <div style={{ marginBottom: 28 }}>
                  <SectionHeading icon={UserIcon} title="Personal Information" />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>

                    {/* First name */}
                    <div>
                      <FieldLabel required>First Name</FieldLabel>
                      <InputWrap icon={UserIcon} focused={focused.firstName}>
                        <input
                          type="text" name="firstName" required
                          value={formData.firstName} onChange={handleChange}
                          onFocus={() => onFocus('firstName')} onBlur={() => onBlur('firstName')}
                          placeholder="Jean"
                          style={inputStyle(focused.firstName)}
                        />
                      </InputWrap>
                    </div>

                    {/* Last name */}
                    <div>
                      <FieldLabel required>Last Name</FieldLabel>
                      <InputWrap icon={UserIcon} focused={focused.lastName}>
                        <input
                          type="text" name="lastName" required
                          value={formData.lastName} onChange={handleChange}
                          onFocus={() => onFocus('lastName')} onBlur={() => onBlur('lastName')}
                          placeholder="Dupont"
                          style={inputStyle(focused.lastName)}
                        />
                      </InputWrap>
                    </div>

                    {/* Email */}
                    <div>
                      <FieldLabel required>Email Address</FieldLabel>
                      <InputWrap icon={MailIcon} focused={focused.email}>
                        <input
                          type="email" name="email" required
                          value={formData.email} onChange={handleChange}
                          onFocus={() => onFocus('email')} onBlur={() => onBlur('email')}
                          placeholder="name@fluentia.com"
                          style={inputStyle(focused.email)}
                        />
                      </InputWrap>
                    </div>

                    {/* Phone */}
                    <div>
                      <FieldLabel required>Phone Number</FieldLabel>
                      <InputWrap icon={PhoneIcon} focused={focused.phone}>
                        <input
                          type="tel" name="phone" required
                          value={formData.phone} onChange={handleChange}
                          onFocus={() => onFocus('phone')} onBlur={() => onBlur('phone')}
                          placeholder="+213 6 12 34 56 78"
                          style={inputStyle(focused.phone)}
                        />
                      </InputWrap>
                    </div>
                  </div>
                </div>

                {/* ── Child Information (parent only) ── */}
                {selectedRole === 'parent' && (
                  <div style={{
                    marginBottom: 28,
                    background: '#f5f3ff',
                    border: '1.5px solid #e0e7ff',
                    borderRadius: 14, padding: '20px 20px 6px',
                    animation: 'fadeUp 0.25s ease both',
                  }}>
                    <SectionHeading icon={ChildIcon} title="Child's Information" accent />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>

                      <div>
                        <FieldLabel required>Child's Full Name</FieldLabel>
                        <InputWrap icon={ChildIcon} focused={focused.childName}>
                          <input
                            type="text" name="childName" required
                            value={formData.childName} onChange={handleChange}
                            onFocus={() => onFocus('childName')} onBlur={() => onBlur('childName')}
                            placeholder="Child's full name"
                            style={inputStyle(focused.childName)}
                          />
                        </InputWrap>
                      </div>

                      <div>
                        <FieldLabel required>Child's Age</FieldLabel>
                        <InputWrap icon={CalendarIcon} focused={focused.childAge}>
                          <input
                            type="number" name="childAge" required min="3" max="18"
                            value={formData.childAge} onChange={handleChange}
                            onFocus={() => onFocus('childAge')} onBlur={() => onBlur('childAge')}
                            placeholder="Age"
                            style={inputStyle(focused.childAge)}
                          />
                        </InputWrap>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Course Selection ── */}
                <div style={{ marginBottom: 28 }}>
                  <SectionHeading icon={BookIcon} title="Course Selection" />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>

                    <div>
                      <FieldLabel required>Desired Course</FieldLabel>
                      <div style={{ position: 'relative' }}>
                        <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color: focused.course ? '#4318FF' : '#94a3b8', pointerEvents:'none', display:'flex', alignItems:'center', transition:'color 0.2s' }}>
                          <BookIcon />
                        </span>
                        <select
                          name="course" required
                          value={formData.course} onChange={handleChange}
                          onFocus={() => onFocus('course')} onBlur={() => onBlur('course')}
                          style={selectStyle(focused.course)}
                        >
                          <option value="">Select a course</option>
                          <option value="English">English</option>
                          <option value="German">German</option>
                          <option value="French">French</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <FieldLabel>Current Level</FieldLabel>
                      <div style={{ position: 'relative' }}>
                        <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color: focused.level ? '#4318FF' : '#94a3b8', pointerEvents:'none', display:'flex', alignItems:'center', transition:'color 0.2s' }}>
                          <StarIcon />
                        </span>
                        <select
                          name="level"
                          value={formData.level} onChange={handleChange}
                          onFocus={() => onFocus('level')} onBlur={() => onBlur('level')}
                          style={selectStyle(focused.level)}
                        >
                          <option value="">Select your level</option>
                          <option value="Beginner">Beginner (A1)</option>
                          <option value="Intermediate">Intermediate (B1)</option>
                          <option value="Advanced">Advanced (C1)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Message ── */}
                <div style={{ marginBottom: 28 }}>
                  <FieldLabel>Additional Message (optional)</FieldLabel>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position:'absolute', left:14, top:14, color: focused.message ? '#4318FF' : '#94a3b8', pointerEvents:'none', display:'flex', alignItems:'center', transition:'color 0.2s' }}>
                      <MessageIcon />
                    </span>
                    <textarea
                      name="message"
                      value={formData.message} onChange={handleChange}
                      onFocus={() => onFocus('message')} onBlur={() => onBlur('message')}
                      rows={3}
                      placeholder="Any questions or additional information..."
                      style={{
                        width: '100%', padding: '12px 14px 12px 40px',
                        background: focused.message ? '#fff' : '#f8fafc',
                        border: `1.5px solid ${focused.message ? '#4318FF' : '#e2e8f0'}`,
                        borderRadius: 10, fontSize: 13.5, outline: 'none',
                        fontFamily: "'Inter','Segoe UI',sans-serif",
                        color: '#0f172a', lineHeight: 1.6, boxSizing: 'border-box',
                        boxShadow: focused.message ? '0 0 0 3px rgba(67,24,255,0.09)' : 'none',
                        transition: 'border-color 0.2s, box-shadow 0.2s, background 0.2s',
                      }}
                    />
                  </div>
                </div>

                {/* ── Submit ── */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    width: '100%', height: 50, border: 'none', borderRadius: 10,
                    background: isSubmitting ? '#94a3b8' : '#4318FF',
                    color: '#fff', fontSize: 14, fontWeight: 700,
                    fontFamily: "'Inter','Segoe UI',sans-serif",
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    boxShadow: isSubmitting ? 'none' : '0 4px 16px rgba(67,24,255,0.28)',
                    transition: 'all 0.15s', letterSpacing: '0.01em',
                  }}
                  onMouseEnter={e => { if (!isSubmitting) { e.currentTarget.style.background='#3510d4'; e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.boxShadow='0 6px 22px rgba(67,24,255,0.38)'; }}}
                  onMouseLeave={e => { e.currentTarget.style.background=isSubmitting?'#94a3b8':'#4318FF'; e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow=isSubmitting?'none':'0 4px 16px rgba(67,24,255,0.28)'; }}
                  onMouseDown={e  => { if (!isSubmitting) e.currentTarget.style.transform='scale(0.985)'; }}
                  onMouseUp={e    => { if (!isSubmitting) e.currentTarget.style.transform='translateY(-1px)'; }}
                >
                  {isSubmitting ? (
                    <>
                      <span style={{ width:16, height:16, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'#fff', borderRadius:'50%', display:'inline-block', animation:'spin 0.7s linear infinite' }}/>
                      Submitting...
                    </>
                  ) : (
                    <> <SendIcon /> Submit Enrollment Request </>
                  )}
                </button>

              </form>
            </div>
          </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Join;
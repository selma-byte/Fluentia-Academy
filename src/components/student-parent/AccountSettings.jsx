import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../supabaseClient';

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icons = {
  User: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Phone: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  Academic: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>,
  Bell: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  File: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  Edit: () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Download: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Print: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>,
  X: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Camera: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>,
  Save: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>,
  ChevronRight: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  Qr: () => <svg width="76" height="76" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="3" height="3"/><rect x="7" y="14" width="3" height="3"/><rect x="3" y="18" width="3" height="3"/><rect x="7" y="18" width="3" height="3"/></svg>,
  Shield: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Check: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
};

// ─── Reusable: Info field ─────────────────────────────────────────────────────
const InfoItem = ({ label, value }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <span style={{ fontSize: 9, fontWeight: 800, color: '#A3AED0', textTransform: 'uppercase', letterSpacing: '0.25em' }}>{label}</span>
    <span style={{ fontSize: 13, fontWeight: 800, color: '#1B254B', textTransform: 'uppercase', letterSpacing: '0.02em' }}>{value || 'Not Provided'}</span>
  </div>
);

// ─── Reusable: Stat card ──────────────────────────────────────────────────────
const StatCard = ({ label, value }) => (
  <div style={{
    background: '#F4F7FE', padding: '20px 12px', borderRadius: 24,
    border: '2px solid transparent', textAlign: 'center',
    cursor: 'pointer', transition: 'all .2s', display: 'flex', flexDirection: 'column', justifyContent: 'center',
  }}
  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(67,24,255,0.2)'}
  onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}>
    <span style={{ fontSize: 8, fontWeight: 800, color: '#A3AED0', textTransform: 'uppercase', letterSpacing: '0.2em', display: 'block', marginBottom: 10 }}>{label}</span>
    <span style={{ fontSize: 14, fontWeight: 900, color: '#1B254B', fontStyle: 'italic', letterSpacing: '-0.02em' }}>{value}</span>
  </div>
);

// ─── Reusable: Toggle switch ──────────────────────────────────────────────────
const ToggleSwitch = ({ label, enabled, onToggle }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px' }}>
    <span
      onClick={onToggle}
      style={{ fontSize: 11, fontWeight: 800, color: '#1B254B', textTransform: 'uppercase', letterSpacing: '0.12em', cursor: 'pointer' }}>
      {label}
    </span>
    <button
      onClick={onToggle}
      style={{
        width: 48, height: 24, borderRadius: 99, padding: 3, border: 'none',
        background: enabled ? '#4318FF' : '#E2E8F0',
        cursor: 'pointer', display: 'flex', alignItems: 'center',
        transition: 'background .3s', flexShrink: 0,
      }}>
      <div style={{
        width: 18, height: 18, borderRadius: '50%', background: '#fff',
        boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
        transform: enabled ? 'translateX(24px)' : 'translateX(0)',
        transition: 'transform .3s',
      }} />
    </button>
  </div>
);

// ─── Reusable: Doc link ───────────────────────────────────────────────────────
const DocLink = ({ title, onClick }) => (
  <div
    onClick={onClick}
    style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 16px', borderRadius: 22, border: '2px solid #f1f5f9',
      cursor: 'pointer', transition: 'all .25s', background: '#fff',
    }}
    onMouseEnter={e => { e.currentTarget.style.background = '#4318FF'; e.currentTarget.style.borderColor = '#4318FF'; e.currentTarget.querySelector('.dl-icon').style.background = 'rgba(255,255,255,0.2)'; e.currentTarget.querySelector('.dl-icon').style.color = '#fff'; e.currentTarget.querySelector('.dl-title').style.color = '#fff'; e.currentTarget.querySelector('.dl-arrow').style.color = '#fff'; }}
    onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#f1f5f9'; e.currentTarget.querySelector('.dl-icon').style.background = '#F4F7FE'; e.currentTarget.querySelector('.dl-icon').style.color = '#4318FF'; e.currentTarget.querySelector('.dl-title').style.color = '#1B254B'; e.currentTarget.querySelector('.dl-arrow').style.color = '#4318FF'; }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div className="dl-icon" style={{ background: '#F4F7FE', padding: 9, borderRadius: 12, color: '#4318FF', display: 'flex', transition: 'all .25s' }}>
        <Icons.File />
      </div>
      <span className="dl-title" style={{ fontSize: 11, fontWeight: 800, color: '#1B254B', textTransform: 'uppercase', letterSpacing: '0.05em', transition: 'color .25s' }}>{title}</span>
    </div>
    <span className="dl-arrow" style={{ color: '#4318FF', fontWeight: 900, fontSize: 14, transition: 'color .25s' }}>→</span>
  </div>
);

// ─── Section header ───────────────────────────────────────────────────────────
const SectionHeader = ({ icon: Icon, label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28, paddingBottom: 20, borderBottom: '1px solid #f8fafc' }}>
    <div style={{ width: 40, height: 40, borderRadius: 14, background: '#F4F7FE', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4318FF', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.06)' }}>
      <Icon />
    </div>
    <h3 style={{ margin: 0, fontSize: 15, fontWeight: 900, color: '#1B254B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</h3>
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────
const AccountSettings = () => {
  const [selectedDoc,  setSelectedDoc]  = useState(null);
  const [showIdCard,   setShowIdCard]   = useState(false);
  const [loading,      setLoading]      = useState(true);
  const [saveSuccess,  setSaveSuccess]  = useState(false);
  const [avatarUrl,    setAvatarUrl]    = useState('https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300');
  const fileInputRef = useRef(null);

  // ── All original state — UNTOUCHED ───────────────────────────────────────
  const [profile, setProfile] = useState({
    full_name: 'Loading...', student_id: '---', program: '---',
    email: '---', phone: '---', dob: 'Not Provided',
    gender: 'Not Provided', blood_group: 'Not Provided',
    address: 'Not Provided', level: '---', enrollment_year: '---', average: 'N/A',
  });

  const [notifications, setNotifications] = useState({
    email: true, assignments: false, schedule: true, exams: true,
  });

  // ── All original Supabase logic — UNTOUCHED ───────────────────────────────
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: student } = await supabase
          .from('students').select('*').eq('email', user.email).single();

        if (student) {
          const fullName = `${student.first_name || ''} ${student.last_name || ''}`.trim();

          let avgStr = 'N/A';
          const { data: grades } = await supabase.from('grades').select('*').eq('student_name', fullName);
          if (grades && grades.length > 0) {
            let total = 0, count = 0;
            grades.forEach(g => {
              let mark = g.score ? parseFloat(g.score) : (parseFloat(g.grade) || 0);
              let max  = parseFloat(g.max_grade) || 20;
              total += (mark / max) * 20;
              count++;
            });
            if (count > 0) avgStr = `${(total / count).toFixed(2)} / 20`;
          }

          setProfile({
            full_name:       fullName,
            student_id:      `STD-${student.id || Math.floor(Math.random() * 9000 + 1000)}`,
            program:         `${student.language || 'Language'} (${student.level || 'Level'})`,
            email:           student.email || user.email,
            phone:           student.phone || 'Not Provided',
            dob:             student.dob || 'Not Provided',
            gender:          student.gender || 'Not Provided',
            blood_group:     student.blood_group || 'Not Provided',
            address:         student.address || 'Not Provided',
            level:           student.level || 'N/A',
            enrollment_year: student.enrollment_date
              ? new Date(student.enrollment_date).getFullYear()
              : (student.created_at ? new Date(student.created_at).getFullYear() : '2026'),
            average: avgStr,
          });
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleToggle = (s) => setNotifications(prev => ({ ...prev, [s]: !prev[s] }));

  // ── Photo change (interactive) ────────────────────────────────────────────
  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
    }
  };

  // ── Save profile (interactive feedback) ──────────────────────────────────
  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  // ── Download doc ──────────────────────────────────────────────────────────
  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = '#';
    a.download = `${selectedDoc?.title || 'document'}.pdf`;
    a.click();
  };

  // ── ID CARD VIEW ──────────────────────────────────────────────────────────
  if (showIdCard) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 8px 40px', gap: 24 }}>
        <div style={{ background: '#fff', borderRadius: 40, padding: '40px 48px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid #e5e7eb', width: '100%', maxWidth: 860 }}>
          {/* Title */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 36 }}>
            <h2 style={{ margin: 0, fontSize: 28, fontWeight: 900, color: '#1B254B', textTransform: 'uppercase', letterSpacing: '-0.02em', fontStyle: 'italic' }}>Official Student ID</h2>
            <div style={{ height: 5, width: 80, background: '#4318FF', borderRadius: 99, marginTop: 12 }} />
          </div>

          {/* Card */}
          <div style={{
            background: 'linear-gradient(135deg, #D8DDEB 0%, #F4F7FE 100%)',
            borderRadius: 32, border: '8px solid #fff',
            boxShadow: '0 8px 32px rgba(67,24,255,0.12)',
            display: 'flex', overflow: 'hidden', minHeight: 240,
          }}>
            {/* Left */}
            <div style={{ flex: 1, padding: '32px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start' }}>
                {/* Photo */}
                <div style={{ width: 110, height: 135, borderRadius: 22, border: '4px solid #fff', boxShadow: '0 4px 16px rgba(0,0,0,0.14)', overflow: 'hidden', background: '#e2e8f0', flexShrink: 0 }}>
                  <img src={avatarUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Student" />
                </div>
                {/* Info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingTop: 4 }}>
                  {[
                    { label: 'Full Name',           value: profile.full_name },
                    { label: 'Departments',          value: profile.program  },
                    { label: 'Institutional Email',  value: profile.email    },
                    { label: 'Campus Location',      value: 'Polyglot Academy, Algiers' },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p style={{ margin: 0, fontSize: 8, fontWeight: 800, color: '#4318FF', textTransform: 'uppercase', letterSpacing: '0.25em' }}>{label}</p>
                      <p style={{ margin: '3px 0 0', fontSize: label === 'Full Name' ? 17 : 12, fontWeight: label === 'Full Name' ? 900 : 700, color: '#1B254B', fontStyle: label === 'Full Name' ? 'italic' : 'normal', opacity: label === 'Full Name' ? 1 : 0.85 }}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>
              {/* Footer */}
              <div style={{ display: 'flex', gap: 16, alignItems: 'center', color: '#A3AED0', fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.18em', paddingTop: 16 }}>
                <span>Student ID: {profile.student_id}</span>
                <span>•</span>
                <span>{profile.program} Department</span>
              </div>
            </div>

            {/* Right — QR */}
            <div style={{ width: '30%', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)', borderLeft: '1px solid rgba(255,255,255,0.3)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 }}>
              <div style={{ background: '#fff', padding: 14, borderRadius: 22, boxShadow: '0 4px 16px rgba(0,0,0,0.10)' }}>
                <Icons.Qr />
              </div>
              <p style={{ margin: 0, fontSize: 8, fontWeight: 800, color: '#1B254B', textTransform: 'uppercase', letterSpacing: '0.15em', textAlign: 'center', opacity: 0.45 }}>Scan to Verify Credentials</p>
            </div>
          </div>

          {/* Actions */}
          <div style={{ marginTop: 32, display: 'flex', justifyContent: 'center', gap: 12 }}>
            <button
              onClick={() => setShowIdCard(false)}
              style={{ padding: '14px 36px', borderRadius: 22, background: '#111C44', color: '#fff', border: 'none', fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.18em', cursor: 'pointer', transition: 'background .2s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#000'}
              onMouseLeave={e => e.currentTarget.style.background = '#111C44'}>
              Go Back
            </button>
            <button
              onClick={() => window.print()}
              style={{ padding: '14px 36px', borderRadius: 22, background: '#4318FF', color: '#fff', border: 'none', fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.18em', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, transition: 'background .2s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#3311CC'}
              onMouseLeave={e => e.currentTarget.style.background = '#4318FF'}>
              <Icons.Print /> Print ID Card
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Main Settings View ────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingBottom: 32 }}>

      {/* ── Profile header ───────────────────────────────────────────────── */}
      <div style={{ background: '#fff', padding: '28px 32px', borderRadius: 36, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          {/* Avatar */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{ width: 88, height: 88, borderRadius: 26, overflow: 'hidden', border: '5px solid #fff', boxShadow: '0 4px 20px rgba(67,24,255,0.12)', background: '#F4F7FE' }}>
              <img src={avatarUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{ position: 'absolute', bottom: -4, right: -4, width: 28, height: 28, borderRadius: 10, background: '#4318FF', color: '#fff', border: '3px solid #fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(67,24,255,0.3)', transition: 'background .2s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#3311CC'}
              onMouseLeave={e => e.currentTarget.style.background = '#4318FF'}>
              <Icons.Camera />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoChange} />
          </div>

          {/* Name + meta */}
          <div>
            <span style={{ background: '#EEF2FF', color: '#4318FF', fontSize: 9, fontWeight: 900, padding: '4px 12px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.2em', display: 'inline-flex', alignItems: 'center', gap: 5, border: '1px solid rgba(67,24,255,0.1)' }}>
              <Icons.Shield /> Certified Profile
            </span>
            <h1 style={{ margin: '8px 0 0', fontSize: 26, fontWeight: 900, color: '#1B254B', textTransform: 'uppercase', letterSpacing: '-0.02em', fontStyle: 'italic', lineHeight: 1.1 }}>
              {loading ? 'Loading...' : profile.full_name}
            </h1>
            <div style={{ display: 'flex', gap: 20, marginTop: 6, fontSize: 10, fontWeight: 900, color: '#A3AED0', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
              <span style={{ textDecoration: 'underline', textDecorationColor: '#4318FF', textDecorationThickness: 2, textUnderlineOffset: 3 }}>Ref: {profile.student_id}</span>
              <span>Campus: Algiers Central</span>
            </div>
          </div>
        </div>

        {/* Save / Update */}
        <button
          onClick={handleSave}
          style={{
            padding: '13px 28px', borderRadius: 18, border: 'none', cursor: 'pointer',
            background: saveSuccess ? '#059669' : '#111C44',
            color: '#fff', fontSize: 10, fontWeight: 900,
            textTransform: 'uppercase', letterSpacing: '0.18em',
            display: 'flex', alignItems: 'center', gap: 8,
            transition: 'background .3s', boxShadow: '0 4px 16px rgba(17,28,68,0.2)',
          }}
          onMouseEnter={e => { if (!saveSuccess) e.currentTarget.style.background = '#000'; }}
          onMouseLeave={e => { if (!saveSuccess) e.currentTarget.style.background = '#111C44'; }}>
          {saveSuccess ? <><Icons.Check /> Saved!</> : 'Update Profile'}
        </button>
      </div>

      {/* ── Body grid ───────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, alignItems: 'start' }}>

        {/* LEFT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <div style={{ background: '#fff', padding: '32px 36px', borderRadius: 36, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' }}>

            {/* Identification + Contact — side by side */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 48px', marginBottom: 36, paddingBottom: 36, borderBottom: '1px solid #f8fafc' }}>

              {/* Identification */}
              <div>
                <SectionHeader icon={Icons.User} label="Identification" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
                  <InfoItem label="Full Legal Name" value={profile.full_name} />
                  {/* Birth date + gender on SAME row, equal columns */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <InfoItem label="Birth Date"     value={profile.dob}    />
                    <InfoItem label="Gender Identity" value={profile.gender} />
                  </div>
                  <InfoItem label="Language Proficiency" value={profile.level} />
                </div>
              </div>

              {/* Contact */}
              <div>
                <SectionHeader icon={Icons.Phone} label="Contact Registry" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
                  <InfoItem label="Institutional Email"  value={profile.email}   />
                  <InfoItem label="Verified Mobile"      value={profile.phone}   />
                  <InfoItem label="Residential Address"  value={profile.address} />
                </div>
              </div>
            </div>

            {/* Academic Overview */}
            <div>
              <SectionHeader icon={Icons.Academic} label="Academic Overview" />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
                <StatCard label="Enrollment Year"  value={profile.enrollment_year} />
                <StatCard label="Active Modules"   value="1"                       />
                <StatCard label="Aggregate Avg"    value={profile.average}         />
                <StatCard label="Account Grade"    value="PRO"                     />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Preferences */}
          <div style={{ background: '#fff', padding: '28px', borderRadius: 36, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, paddingBottom: 18, borderBottom: '1px solid #f8fafc', justifyContent: 'center' }}>
              <span style={{ color: '#4318FF' }}><Icons.Bell /></span>
              <h3 style={{ margin: 0, fontSize: 13, fontWeight: 900, color: '#1B254B', textTransform: 'uppercase', letterSpacing: '0.18em' }}>Preferences</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
              <ToggleSwitch label="Email Logs"        enabled={notifications.email}       onToggle={() => handleToggle('email')}       />
              <ToggleSwitch label="Assignment Alerts" enabled={notifications.assignments} onToggle={() => handleToggle('assignments')} />
              <ToggleSwitch label="Schedule Sync"     enabled={notifications.schedule}    onToggle={() => handleToggle('schedule')}    />
              <ToggleSwitch label="Exam Alerts"       enabled={notifications.exams}       onToggle={() => handleToggle('exams')}       />
            </div>
          </div>

          {/* Document Hub */}
          <div style={{ background: '#fff', padding: '28px', borderRadius: 36, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, paddingBottom: 18, borderBottom: '1px solid #f8fafc', justifyContent: 'center' }}>
              <span style={{ color: '#4318FF' }}><Icons.File /></span>
              <h3 style={{ margin: 0, fontSize: 13, fontWeight: 900, color: '#1B254B', textTransform: 'uppercase', letterSpacing: '0.18em' }}>Document Hub</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <DocLink title="Digital Student ID"  onClick={() => setShowIdCard(true)} />
              <DocLink title="Enrollment Contract" onClick={() => setSelectedDoc({ title: 'Enrollment Contract',    code: 'CTR-2023-F'   })} />
              <DocLink title="Payment Receipt"     onClick={() => setSelectedDoc({ title: 'Latest Payment Receipt', code: 'REC-8829-Ver' })} />
              <DocLink title="Academic Transcript" onClick={() => setSelectedDoc({ title: 'Official Transcript',    code: 'TRN-2026-S'  })} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Document viewer modal ─────────────────────────────────────────── */}
      {selectedDoc && (
        <div
          onClick={() => setSelectedDoc(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(11,19,43,0.8)', backdropFilter: 'blur(6px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 40, padding: '44px 48px', maxWidth: 480, width: '100%', boxShadow: '0 24px 64px rgba(0,0,0,0.2)', position: 'relative' }}>
            {/* Close */}
            <button
              onClick={() => setSelectedDoc(null)}
              style={{ position: 'absolute', top: 20, right: 20, width: 32, height: 32, borderRadius: 10, border: '1px solid #f1f5f9', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}>
              <Icons.X />
            </button>

            <p style={{ margin: '0 0 10px', fontSize: 9, fontWeight: 900, color: '#4318FF', textTransform: 'uppercase', letterSpacing: '0.35em' }}>Official Document Vault</p>
            <h3 style={{ margin: '0 0 28px', fontSize: 22, fontWeight: 900, color: '#1B254B', textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 1.1 }}>{selectedDoc.title}</h3>

            {/* Preview */}
            <div style={{ padding: '36px 24px', background: '#F4F7FE', borderRadius: 32, border: '3px dashed #fff', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, marginBottom: 28 }}>
              <div style={{ width: 56, height: 56, borderRadius: 18, background: '#4318FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 900, fontStyle: 'italic', boxShadow: '0 4px 16px rgba(67,24,255,0.3)' }}>
                PDF
              </div>
              <p style={{ margin: 0, fontSize: 11, fontWeight: 900, color: '#1B254B', textTransform: 'uppercase', letterSpacing: '0.15em', textAlign: 'center' }}>Securely Generated Academic Record</p>
              <p style={{ margin: 0, fontSize: 9, fontWeight: 800, color: '#A3AED0', textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.7 }}>REF: {selectedDoc.code}</p>
            </div>

            <button
              onClick={handleDownload}
              style={{ width: '100%', padding: '16px 0', borderRadius: 26, background: '#111C44', color: '#fff', border: 'none', fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.18em', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background .2s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#000'}
              onMouseLeave={e => e.currentTarget.style.background = '#111C44'}>
              <Icons.Download /> Download Verified Copy
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountSettings;
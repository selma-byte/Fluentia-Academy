import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../supabaseClient';

// ─── Design tokens (match dashboard exactly) ──────────────────────────────────
const C = {
  navy:        '#0f172a',
  primary:     '#4318FF',
  primaryLight:'#eef2ff',
  white:       '#ffffff',
  pageBg:      '#f8fafc',
  border:      '#f1f5f9',
  borderMid:   '#e2e8f0',
  textDark:    '#1e293b',
  textMid:     '#64748b',
  textMuted:   '#94a3b8',
  success:     '#059669',
  successBg:   '#ecfdf5',
  danger:      '#dc2626',
  dangerBg:    '#fef2f2',
};

// ─── Icons ────────────────────────────────────────────────────────────────────
const Ic = {
  School:    () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 4 3 6 3s6-1 6-3v-5"/></svg>,
  Phone:     () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6.13 6.13l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  Mail:      () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  Globe:     () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  MapPin:    () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  Facebook:  () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
  Instagram: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>,
  WhatsApp:  () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>,
  Edit:      () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Close:     () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Save:      () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>,
  Upload:    () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  Stamp:     () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  Sparkle:   () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>,
  GlobeLogo: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
};

// ─── Toast ────────────────────────────────────────────────────────────────────
const Toast = ({ message, show, onClose }) => (
  <div style={{
    position: 'fixed', bottom: 28, right: 28, zIndex: 300,
    background: C.navy, color: '#fff',
    padding: '14px 18px', borderRadius: 14,
    boxShadow: '0 8px 32px rgba(0,0,0,0.22)',
    border: '1px solid rgba(255,255,255,0.08)',
    display: 'flex', alignItems: 'center', gap: 12,
    minWidth: 300,
    fontFamily: "'Inter','Segoe UI',sans-serif",
    transition: 'opacity 0.3s, transform 0.3s',
    opacity: show ? 1 : 0,
    transform: show ? 'translateY(0)' : 'translateY(16px)',
    pointerEvents: show ? 'auto' : 'none',
  }}>
    <span style={{ width: 32, height: 32, borderRadius: 8, background: C.success, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Ic.Sparkle />
    </span>
    <div style={{ flex: 1 }}>
      <p style={{ margin: 0, fontSize: 10.5, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>System Update</p>
      <p style={{ margin: '2px 0 0', fontSize: 13, fontWeight: 600 }}>{message}</p>
    </div>
    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', padding: 4, display: 'flex' }}
      onMouseEnter={e => e.currentTarget.style.color = '#fff'}
      onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
    ><Ic.Close /></button>
  </div>
);

// ─── Field label ──────────────────────────────────────────────────────────────
const FieldLabel = ({ children }) => (
  <p style={{ margin: '0 0 7px', fontSize: 10.5, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.09em' }}>
    {children}
  </p>
);

const inputBase = (focused) => ({
  width: '100%', background: focused ? '#fff' : C.pageBg,
  border: `1.5px solid ${focused ? C.primary : C.borderMid}`,
  borderRadius: 10, padding: '10px 14px 10px 38px',
  fontSize: 13.5, fontFamily: "'Inter','Segoe UI',sans-serif",
  color: C.textDark, outline: 'none', boxSizing: 'border-box',
  transition: 'border-color 0.2s, box-shadow 0.2s, background 0.2s',
  boxShadow: focused ? '0 0 0 3px rgba(67,24,255,0.09)' : 'none',
});

const displayBase = {
  width: '100%', background: C.pageBg,
  border: `1.5px solid ${C.border}`,
  borderRadius: 10, padding: '10px 14px 10px 38px',
  fontSize: 13.5, color: C.textDark, boxSizing: 'border-box',
  minHeight: 44,
};

// ─── InputField ───────────────────────────────────────────────────────────────
const InputField = ({ label, value, icon: Icon, isEdit, onChange, textarea }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <div style={{ position: 'relative' }}>
        <span style={{ position: 'absolute', left: 12, top: textarea ? 12 : '50%', transform: textarea ? 'none' : 'translateY(-50%)', color: focused ? C.primary : C.textMuted, pointerEvents: 'none', transition: 'color 0.2s', display: 'flex' }}>
          <Icon />
        </span>
        {isEdit ? (
          textarea ? (
            <textarea
              value={value}
              onChange={e => onChange(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              rows={3}
              style={{ ...inputBase(focused), resize: 'none', lineHeight: 1.6 }}
            />
          ) : (
            <input
              type="text"
              value={value}
              onChange={e => onChange(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              style={inputBase(focused)}
            />
          )
        ) : (
          <div style={displayBase}>{value || <span style={{ color: C.textMuted }}>—</span>}</div>
        )}
      </div>
    </div>
  );
};

// ─── SocialField ──────────────────────────────────────────────────────────────
const SocialField = ({ label, value, icon: Icon, color, isEdit, onChange }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <div style={{ position: 'relative' }}>
        <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: focused ? color : C.textMuted, pointerEvents: 'none', display: 'flex', transition: 'color 0.2s' }}>
          <Icon />
        </span>
        {isEdit ? (
          <input
            type="text"
            value={value}
            onChange={e => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={{ ...inputBase(focused), borderColor: focused ? color : C.borderMid, boxShadow: focused ? `0 0 0 3px ${color}18` : 'none' }}
          />
        ) : (
          <div style={displayBase}>{value || <span style={{ color: C.textMuted }}>—</span>}</div>
        )}
      </div>
    </div>
  );
};

// ─── Section card ─────────────────────────────────────────────────────────────
const Card = ({ children, style = {} }) => (
  <div style={{
    background: C.white, borderRadius: 16,
    border: `1px solid ${C.border}`,
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
    padding: '24px 26px', ...style,
  }}>
    {children}
  </div>
);

const SectionTitle = ({ children }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, paddingBottom: 14, borderBottom: `1px solid ${C.border}` }}>
    <span style={{ width: 3, height: 18, background: C.primary, borderRadius: 2, flexShrink: 0 }}/>
    <h3 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: C.textDark, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{children}</h3>
  </div>
);

// ─── Upload zone ──────────────────────────────────────────────────────────────
const UploadZone = ({ label, note, preview, isEdit, inputRef, onClick, icon: Icon, dark }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div style={{
      background: dark ? C.navy : C.pageBg,
      borderRadius: 14,
      border: `1.5px dashed ${dark ? 'rgba(255,255,255,0.12)' : C.borderMid}`,
      padding: '22px 20px',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', gap: 10,
      cursor: isEdit ? 'pointer' : 'default',
      transition: 'all 0.2s',
      background: isEdit && hovered
        ? dark ? 'rgba(67,24,255,0.15)' : C.primaryLight
        : dark ? C.navy : C.pageBg,
      borderColor: isEdit && hovered ? C.primary : dark ? 'rgba(255,255,255,0.12)' : C.borderMid,
    }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {preview ? (
        <img src={preview} alt={label} style={{ maxHeight: 100, maxWidth: '100%', objectFit: 'contain', borderRadius: 8 }} />
      ) : (
        <>
          <span style={{ color: dark ? 'rgba(255,255,255,0.35)' : C.textMuted }}>
            <Icon />
          </span>
          <p style={{ margin: 0, fontSize: 11.5, fontWeight: 600, color: dark ? 'rgba(255,255,255,0.45)' : C.textMuted, textAlign: 'center' }}>
            {isEdit ? `Click to upload ${label.toLowerCase()}` : label}
          </p>
        </>
      )}
      {isEdit && (
        <span style={{ fontSize: 10.5, fontWeight: 600, color: dark ? 'rgba(255,255,255,0.3)' : C.textMuted }}>
          PNG, JPG, SVG
        </span>
      )}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const Settings = () => {
  const [isEditMode, setIsEditMode]   = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '' });
  const [loading, setLoading]         = useState(true);
  const logoInputRef  = useRef(null);
  const stampInputRef = useRef(null);

  // ── ALL ORIGINAL STATE — UNTOUCHED ──────────────────────────────────────
  const [schoolData, setSchoolData] = useState({
    name:      'Fluentia Academy',
    phone:     '+213 555 00 00 00',
    email:     'contact@fluentia.com',
    website:   'www.fluentia-academy.dz',
    address:   '123 Education Street, Jijel, Algeria',
    facebook:  '@fluentia.academy',
    instagram: 'fluentia_edu',
    whatsapp:  '+213 666 11 22 33',
    logo:      null,
    stamp:     null,
  });

  const [tempData, setTempData] = useState({ ...schoolData });

  // ── ALL ORIGINAL SUPABASE LOGIC — COMPLETELY UNTOUCHED ──────────────────
  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('school_settings')
          .select('*')
          .eq('id', 1)
          .single();

        if (data && !error) {
          const fetchedData = {
            name:      data.name      || '',
            phone:     data.phone     || '',
            email:     data.email     || '',
            website:   data.website   || '',
            address:   data.address   || '',
            facebook:  data.facebook  || '',
            instagram: data.instagram || '',
            whatsapp:  data.whatsapp  || '',
            logo:      data.logo      || null,
            stamp:     data.stamp     || null,
          };
          setSchoolData(fetchedData);
          setTempData(fetchedData);
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleInputChange = (key, value) => {
    setTempData(prev => ({ ...prev, [key]: value }));
  };

  const handleFileChange = (e, key) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempData(prev => ({ ...prev, [key]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublish = async () => {
    try {
      const { error } = await supabase
        .from('school_settings')
        .upsert({ id: 1, ...tempData });

      if (error) throw error;

      setSchoolData({ ...tempData });
      setIsEditMode(false);
      setNotification({ show: true, message: `School identity updated for ${tempData.name}` });
      setTimeout(() => setNotification({ show: false, message: '' }), 4000);
    } catch (err) {
      alert('Error saving settings: ' + err.message);
    }
  };
  // ─────────────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: C.textMuted, fontFamily: "'Inter','Segoe UI',sans-serif", fontSize: 13, fontWeight: 600 }}>
        Loading settings…
      </div>
    );
  }

  return (
    <>
      <style>{`* { box-sizing: border-box; } input::placeholder, textarea::placeholder { color: #94a3b8; } textarea { resize: none; }`}</style>

      <div style={{ width: '100%', fontFamily: "'Inter','Segoe UI',sans-serif", position: 'relative' }}>

        <Toast message={notification.message} show={notification.show} onClose={() => setNotification({ show: false, message: '' })} />

        {/* ── Page header ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: C.textDark, letterSpacing: '-0.01em' }}>
              School Identity
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: C.textMuted }}>
              {isEditMode
                ? "Modify the school's public profile and branding."
                : 'Official school information and credentials.'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            {isEditMode ? (
              <>
                <button
                  onClick={() => { setTempData({ ...schoolData }); setIsEditMode(false); }}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 7,
                    padding: '9px 18px', borderRadius: 9,
                    border: `1.5px solid ${C.borderMid}`,
                    background: C.white, color: C.textMid,
                    fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                    fontFamily: "'Inter','Segoe UI',sans-serif",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = C.danger; e.currentTarget.style.color = C.danger; e.currentTarget.style.background = C.dangerBg; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.borderMid; e.currentTarget.style.color = C.textMid; e.currentTarget.style.background = C.white; }}
                >
                  <Ic.Close /> Cancel
                </button>
                <button
                  onClick={handlePublish}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 7,
                    padding: '9px 20px', borderRadius: 9, border: 'none',
                    background: C.primary, color: '#fff',
                    fontSize: 13, fontWeight: 700, cursor: 'pointer',
                    boxShadow: '0 3px 12px rgba(67,24,255,0.28)',
                    transition: 'all 0.15s', fontFamily: "'Inter','Segoe UI',sans-serif",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#3510d4'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = C.primary; e.currentTarget.style.transform = 'none'; }}
                >
                  <Ic.Save /> Save Changes
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditMode(true)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 7,
                  padding: '9px 18px', borderRadius: 9,
                  border: `1.5px solid ${C.primary}`,
                  background: C.primaryLight, color: C.primary,
                  fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s',
                  fontFamily: "'Inter','Segoe UI',sans-serif",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = C.primary; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = C.primaryLight; e.currentTarget.style.color = C.primary; }}
              >
                <Ic.Edit /> Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* ── Main grid ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20, alignItems: 'start' }}>

          {/* ════ LEFT COLUMN — branding ════ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Logo card */}
            <Card>
              <SectionTitle>Institution Logo</SectionTitle>
              <input type="file" hidden ref={logoInputRef} onChange={e => handleFileChange(e, 'logo')} accept="image/*" />

              {/* Logo preview / placeholder */}
              {tempData.logo ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                  <img src={tempData.logo} alt="School logo" style={{ maxHeight: 110, maxWidth: '100%', objectFit: 'contain', borderRadius: 10 }} />
                  {isEditMode && (
                    <button
                      onClick={() => logoInputRef.current.click()}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, border: `1.5px solid ${C.borderMid}`, background: C.pageBg, color: C.textMid, fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s', fontFamily: "'Inter','Segoe UI',sans-serif" }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = C.primary; e.currentTarget.style.color = C.primary; e.currentTarget.style.background = C.primaryLight; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = C.borderMid; e.currentTarget.style.color = C.textMid; e.currentTarget.style.background = C.pageBg; }}
                    >
                      <Ic.Upload /> Replace Logo
                    </button>
                  )}
                </div>
              ) : (
                <>
                  {/* Default branded placeholder */}
                  <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '20px 0',
                  }}>
                    <div style={{
                      width: 72, height: 72, borderRadius: 18,
                      background: `linear-gradient(135deg, ${C.primary}, #6b47ff)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 6px 20px rgba(67,24,255,0.30)',
                    }}>
                      <Ic.GlobeLogo />
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: C.textDark }}>
                        {(tempData.name || 'POLYGLOT').split(' ')[0].toUpperCase()}
                      </p>
                      <p style={{ margin: 0, fontSize: 9, fontWeight: 700, color: C.textMuted, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                        {(tempData.name || '').split(' ').slice(1).join(' ') || 'ACADEMY'}
                      </p>
                    </div>
                    <p style={{ margin: '4px 0 0', fontSize: 11, color: C.textMuted, textAlign: 'center' }}>
                      Default logo — upload a custom one
                    </p>
                  </div>
                  {isEditMode && (
                    <button
                      onClick={() => logoInputRef.current.click()}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                        padding: '10px 0', borderRadius: 9,
                        border: `1.5px dashed ${C.borderMid}`,
                        background: C.pageBg, color: C.textMid,
                        fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                        marginTop: 10, fontFamily: "'Inter','Segoe UI',sans-serif",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = C.primary; e.currentTarget.style.color = C.primary; e.currentTarget.style.background = C.primaryLight; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = C.borderMid; e.currentTarget.style.color = C.textMid; e.currentTarget.style.background = C.pageBg; }}
                    >
                      <Ic.Upload /> Upload Logo
                    </button>
                  )}
                </>
              )}
            </Card>

            {/* Official stamp card — dark */}
            <div style={{
              background: C.navy, borderRadius: 16,
              border: '1px solid rgba(255,255,255,0.07)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
              padding: '22px 24px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <span style={{ width: 3, height: 16, background: '#818cf8', borderRadius: 2 }}/>
                <h3 style={{ margin: 0, fontSize: 12, fontWeight: 700, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Official Stamp</h3>
              </div>

              <input type="file" hidden ref={stampInputRef} onChange={e => handleFileChange(e, 'stamp')} accept="image/*" />
              <UploadZone
                label="Official Stamp"
                note=""
                preview={tempData.stamp}
                isEdit={isEditMode}
                inputRef={stampInputRef}
                onClick={() => isEditMode && stampInputRef.current.click()}
                icon={Ic.Stamp}
                dark
              />

              {isEditMode && (
                <button
                  onClick={() => stampInputRef.current.click()}
                  style={{
                    width: '100%', marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                    padding: '9px 0', borderRadius: 9,
                    border: '1.5px dashed rgba(255,255,255,0.12)',
                    background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)',
                    fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                    fontFamily: "'Inter','Segoe UI',sans-serif",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#818cf8'; e.currentTarget.style.color = '#818cf8'; e.currentTarget.style.background = 'rgba(129,140,248,0.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                >
                  <Ic.Upload /> Upload Stamp
                </button>
              )}

              <p style={{ margin: '14px 0 0', fontSize: 10.5, color: 'rgba(255,255,255,0.35)', textAlign: 'center', lineHeight: 1.5, fontWeight: 500 }}>
                This stamp appears on all generated student certificates and official documents.
              </p>
            </div>
          </div>

          {/* ════ RIGHT COLUMN — details ════ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Basic information */}
            <Card>
              <SectionTitle>Basic Information</SectionTitle>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <InputField label="School Name"       value={tempData.name}    icon={Ic.School} isEdit={isEditMode} onChange={v => handleInputChange('name', v)} />
                <InputField label="Contact Number"    value={tempData.phone}   icon={Ic.Phone}  isEdit={isEditMode} onChange={v => handleInputChange('phone', v)} />
                <InputField label="Email Address"     value={tempData.email}   icon={Ic.Mail}   isEdit={isEditMode} onChange={v => handleInputChange('email', v)} />
                <InputField label="Portal Website"    value={tempData.website} icon={Ic.Globe}  isEdit={isEditMode} onChange={v => handleInputChange('website', v)} />
                <div style={{ gridColumn: '1 / -1' }}>
                  <InputField label="Physical Address" value={tempData.address} icon={Ic.MapPin} isEdit={isEditMode} onChange={v => handleInputChange('address', v)} textarea />
                </div>
              </div>
            </Card>

            {/* Social connections */}
            <Card>
              <SectionTitle>Public Connections</SectionTitle>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
                <SocialField label="Facebook"  value={tempData.facebook}  icon={Ic.Facebook}  color="#2563eb" isEdit={isEditMode} onChange={v => handleInputChange('facebook', v)} />
                <SocialField label="Instagram" value={tempData.instagram} icon={Ic.Instagram} color="#db2777" isEdit={isEditMode} onChange={v => handleInputChange('instagram', v)} />
                <SocialField label="WhatsApp"  value={tempData.whatsapp}  icon={Ic.WhatsApp}  color="#059669" isEdit={isEditMode} onChange={v => handleInputChange('whatsapp', v)} />
              </div>
            </Card>

            {/* Identity preview card — read-only, always visible */}
            <Card style={{ background: `linear-gradient(135deg, ${C.navy} 0%, #1e2a4a 100%)`, border: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <span style={{ width: 3, height: 16, background: '#818cf8', borderRadius: 2 }}/>
                <h3 style={{ margin: 0, fontSize: 12, fontWeight: 700, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Identity Preview</h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                {tempData.logo ? (
                  <img src={tempData.logo} alt="Logo" style={{ width: 52, height: 52, objectFit: 'contain', borderRadius: 12, background: 'rgba(255,255,255,0.08)', padding: 6 }} />
                ) : (
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: `linear-gradient(135deg, ${C.primary}, #6b47ff)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Ic.GlobeLogo />
                  </div>
                )}
                <div>
                  <p style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }}>
                    {tempData.name || 'Fluentia Academy'}
                  </p>
                  <p style={{ margin: '3px 0 0', fontSize: 12, color: 'rgba(255,255,255,0.50)' }}>{tempData.email}</p>
                  <p style={{ margin: '2px 0 0', fontSize: 12, color: 'rgba(255,255,255,0.40)' }}>{tempData.phone}</p>
                </div>
              </div>
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {[
                  { icon: <Ic.MapPin />, val: tempData.address },
                  { icon: <Ic.Globe />, val: tempData.website },
                ].map((item, i) => item.val && (
                  <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11.5, color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>
                    {item.icon} {item.val}
                  </span>
                ))}
              </div>
            </Card>

          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
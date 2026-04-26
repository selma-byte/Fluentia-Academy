import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../supabaseClient';

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icons = {
  User:     () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Phone:    () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  Academic: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>,
  Bell:     () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  File:     () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  Camera:   () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>,
  Check:    () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Download: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Print:    () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>,
  X:        () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Qr:       () => <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="3" height="3"/><rect x="7" y="14" width="3" height="3"/><rect x="3" y="18" width="3" height="3"/><rect x="7" y="18" width="3" height="3"/></svg>,
  Shield:   () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Classes:  () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  Star:     () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
};

// ─── Language → colour mapping ────────────────────────────────────────────────
const LANG_COLORS = {
  english:  { border: '#f97316', bg: '#fff7ed', text: '#c2410c', dot: '#f97316' },
  français: { border: '#a855f7', bg: '#faf5ff', text: '#7e22ce', dot: '#a855f7' },
  deutsch:  { border: '#22c55e', bg: '#f0fdf4', text: '#15803d', dot: '#22c55e' },
  español:  { border: '#3b82f6', bg: '#eff6ff', text: '#1d4ed8', dot: '#3b82f6' },
  default:  { border: '#4318FF', bg: '#eef2ff', text: '#3730a3', dot: '#4318FF' },
};
const getLangColor = (lang = '') =>
  LANG_COLORS[lang.toLowerCase()] || LANG_COLORS.default;

// ─── Reusable: Info row ───────────────────────────────────────────────────────
const InfoItem = ({ label, value }) => (
  <div className="flex flex-col gap-2 group cursor-help">
    <span className="text-[9px] font-black text-[#A3AED0] uppercase tracking-[0.3em] group-hover:text-[#4318FF] transition-colors">{label}</span>
    <span className="text-[13px] font-black text-[#1B254B] uppercase tracking-tight">{value || 'Not Provided'}</span>
  </div>
);

// ─── Reusable: Stat card ──────────────────────────────────────────────────────
const StatCard = ({ label, value }) => (
  <div className="bg-[#F4F7FE] p-5 rounded-[24px] border-2 border-transparent hover:border-[#4318FF]/20 transition-all text-center group cursor-default flex flex-col justify-center">
    <span className="text-[8px] font-black text-[#A3AED0] uppercase block mb-2 tracking-widest group-hover:text-[#4318FF] transition-colors">{label}</span>
    <span className="text-[14px] font-black text-[#1B254B] italic tracking-tighter leading-tight">{value || '—'}</span>
  </div>
);

// ─── Reusable: Toggle switch ──────────────────────────────────────────────────
const ToggleSwitch = ({ label, enabled, onToggle }) => (
  <div className="flex items-center justify-between group px-2">
    <span
      className="text-[11px] font-black text-[#1B254B] uppercase tracking-widest group-hover:text-[#4318FF] transition-colors cursor-pointer"
      onClick={onToggle}>
      {label}
    </span>
    <button onClick={onToggle} style={{
      width: 48, height: 24, borderRadius: 99, padding: 3, border: 'none',
      background: enabled ? '#4318FF' : '#E2E8F0', cursor: 'pointer',
      display: 'flex', alignItems: 'center', transition: 'background .3s', flexShrink: 0,
    }}>
      <div style={{
        width: 18, height: 18, borderRadius: '50%', background: '#fff',
        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
        transform: enabled ? 'translateX(24px)' : 'translateX(0)',
        transition: 'transform .3s',
      }} />
    </button>
  </div>
);

// ─── Reusable: Doc link ───────────────────────────────────────────────────────
const DocLink = ({ title, onClick }) => (
  <div onClick={onClick}
    className="group flex items-center justify-between p-4 rounded-[22px] border-2 border-gray-50 hover:bg-[#4318FF] transition-all duration-300 cursor-pointer shadow-sm hover:shadow-xl hover:shadow-indigo-200 active:scale-95">
    <div className="flex items-center gap-3">
      <div className="bg-[#F4F7FE] p-2 rounded-xl text-[#4318FF] group-hover:bg-white/20 group-hover:text-white transition-all flex items-center justify-center">
        <Icons.File />
      </div>
      <span className="text-[11px] font-black text-[#1B254B] group-hover:text-white uppercase tracking-tight transition-colors">{title}</span>
    </div>
    <span className="text-[#4318FF] group-hover:text-white font-black text-base transition-colors">→</span>
  </div>
);

// ─── Reusable: Section header ─────────────────────────────────────────────────
const SectionHeader = ({ icon: Icon, label }) => (
  <div className="flex items-center gap-3 mb-7 pb-5 border-b border-gray-50">
    <div className="w-9 h-9 rounded-xl bg-[#F4F7FE] flex items-center justify-center text-[#4318FF] shadow-inner shrink-0">
      <Icon />
    </div>
    <h3 className="text-[15px] font-black text-[#1B254B] uppercase tracking-tighter">{label}</h3>
  </div>
);

// ─── Role badge ───────────────────────────────────────────────────────────────
const RoleBadge = ({ role }) => {
  const map = {
    Teacher:   { bg: '#eef2ff', text: '#4318FF', dot: '#6366f1' },
    Admin:     { bg: '#fef3c7', text: '#92400e', dot: '#f59e0b' },
    Secretary: { bg: '#ecfdf5', text: '#059669', dot: '#10b981' },
  };
  const c = map[role] || map.Teacher;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 9, fontWeight: 800, padding: '3px 10px', borderRadius: 20, background: c.bg, color: c.text, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.dot, display: 'inline-block' }} />
      {role}
    </span>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const TeacherAccountSettings = () => {
  const [showIdCard,  setShowIdCard]  = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [avatarUrl,   setAvatarUrl]   = useState(
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300'
  );
  const fileInputRef = useRef(null);

  // ── State pulled from staff table ─────────────────────────────────────────
  const [profile, setProfile] = useState({
    full_name: 'Loading...', staff_id: '---', role: 'Teacher',
    department: '---', email: '---', phone: '---',
    auth_id: null,
  });

  // ── Classes taught (from classes table) ───────────────────────────────────
  const [classes, setClasses] = useState([]);

  // ── Notification preferences (local only) ────────────────────────────────
  const [notifications, setNotifications] = useState({
    schedule: true, newStudents: true, announcements: false, grades: true,
  });

  // ── Fetch all data ────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // 1. Staff profile (staff table — same structure as TeacherManagement)
        const { data: staff } = await supabase
          .from('staff').select('*').eq('email', user.email).single();

        if (staff) {
          const fullName = `${staff.first_name || ''} ${staff.last_name || ''}`.trim();

          setProfile({
            full_name:  fullName,
            staff_id:   `STF-${staff.id || Math.floor(Math.random() * 9000 + 1000)}`,
            role:       staff.role       || 'Teacher',
            department: staff.department || '---',
            email:      staff.email      || user.email,
            phone:      staff.phone      || 'Not Provided',
            auth_id:    staff.auth_id    || null,
          });

          // 2. Classes assigned to this teacher (classes table — teacher_name)
          const { data: classRows } = await supabase
            .from('classes')
            .select('*')
            .or(`teacher_name.ilike.%${fullName}%,teacher_id.eq.${staff.id}`);

          if (classRows) setClasses(classRows);
        }
      } catch (err) {
        console.error('Error fetching teacher profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleToggle = (s) =>
    setNotifications(prev => ({ ...prev, [s]: !prev[s] }));

  // ── Photo change (local preview) ─────────────────────────────────────────
  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setAvatarUrl(URL.createObjectURL(file));
  };

  // ── Save (visual feedback) ────────────────────────────────────────────────
  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  // ── Download doc ──────────────────────────────────────────────────────────
  const handleDownload = (title) => {
    const a = document.createElement('a');
    a.href = '#';
    a.download = `${title}.pdf`;
    a.click();
  };

  // ── Total students across all classes ─────────────────────────────────────
  const totalStudents = classes.reduce((sum, c) => sum + (c.enrolled_count || 0), 0);

  // ─────────────────────────────────────────────────────────────────────────
  // STAFF ID CARD VIEW
  // ─────────────────────────────────────────────────────────────────────────
  if (showIdCard) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center animate-fadeIn p-4">
        <div className="bg-white rounded-[50px] p-12 shadow-2xl border border-gray-100 w-full max-w-4xl relative overflow-hidden">
          <div className="flex flex-col items-center mb-10">
            <h2 className="text-4xl font-black text-[#1B254B] uppercase tracking-tighter italic">Official Staff ID</h2>
            <div className="h-1.5 w-24 bg-[#4318FF] rounded-full mt-4" />
          </div>

          {/* Physical card */}
          <div
            className="relative mx-auto bg-gradient-to-br from-[#1B254B] to-[#4318FF] w-full max-w-3xl rounded-[40px] shadow-2xl border-[10px] border-white flex overflow-hidden group"
            style={{ aspectRatio: '1.6 / 1' }}>
            <div className="flex-1 p-10 flex flex-col justify-between relative z-10">
              <div className="flex items-start gap-8">
                {/* Photo */}
                <div className="w-36 h-44 rounded-[28px] border-[5px] border-white/30 shadow-xl overflow-hidden bg-white/10 shrink-0">
                  <img src={avatarUrl} className="w-full h-full object-cover" alt="Staff" />
                </div>
                {/* Info */}
                <div className="space-y-3 pt-2">
                  {[
                    { label: 'Full Name',         value: profile.full_name, big: true },
                    { label: 'Role',              value: profile.role               },
                    { label: 'Department',        value: profile.department         },
                    { label: 'Institutional Email', value: profile.email            },
                    { label: 'Campus',            value: 'Polyglot Academy, Algiers' },
                  ].map(({ label, value, big }) => (
                    <div key={label} className="space-y-0.5">
                      <p className="text-[9px] font-black text-white/50 uppercase tracking-[0.3em]">{label}</p>
                      <p className={`font-black text-white ${big ? 'text-xl italic' : 'text-xs opacity-90'}`}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>
              {/* Footer */}
              <div className="flex items-center gap-6 text-white/40 text-[9px] font-black uppercase tracking-widest pt-4">
                <span>Staff ID: {profile.staff_id}</span>
                <span>•</span>
                <span>{profile.department} Department</span>
                <span>•</span>
                <span>{profile.role}</span>
              </div>
            </div>

            {/* QR panel */}
            <div className="w-1/3 bg-white/10 backdrop-blur-sm flex flex-col items-center justify-center p-8 border-l border-white/10">
              <div className="bg-white p-4 rounded-3xl shadow-xl mb-4 group-hover:scale-105 transition-transform">
                <Icons.Qr />
              </div>
              <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] text-center">
                Scan to Verify Credentials
              </p>
            </div>

            {/* Decoration */}
            <div className="absolute -right-20 -top-20 text-[300px] font-black opacity-[0.04] select-none italic pointer-events-none text-white">T</div>
          </div>

          {/* Actions */}
          <div className="mt-10 flex justify-center gap-4">
            <button onClick={() => setShowIdCard(false)}
              className="bg-[#111C44] text-white px-12 py-4 rounded-3xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl active:scale-95">
              Go Back
            </button>
            <button onClick={() => window.print()}
              className="bg-[#4318FF] text-white px-12 py-4 rounded-3xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-[#3311CC] transition-all shadow-xl active:scale-95 flex items-center gap-2">
              <Icons.Print /> Print Staff ID
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // MAIN VIEW
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="flex-1 flex flex-col gap-8 animate-fadeIn pr-2 pb-12">

      {/* ── Profile hero ────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
        <div className="flex items-center gap-7">

          {/* Avatar */}
          <div className="relative shrink-0">
            <div
              className="w-24 h-24 rounded-[28px] bg-[#F4F7FE] overflow-hidden border-[5px] border-white shadow-xl shadow-blue-900/10 cursor-pointer"
              onClick={() => fileInputRef.current?.click()}>
              <img src={avatarUrl} alt="Profile"
                className="w-full h-full object-cover hover:opacity-90 transition-opacity" />
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-2 -right-2 bg-[#4318FF] text-white p-2 rounded-xl border-4 border-white shadow-lg hover:bg-[#3311CC] transition-all flex items-center justify-center">
              <Icons.Camera />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
          </div>

          {/* Name block */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-[#EEF2FF] text-[#4318FF] text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-[#4318FF]/10 shadow-sm inline-flex items-center gap-1.5">
                <Icons.Shield /> Verified Staff
              </span>
              <RoleBadge role={profile.role} />
            </div>
            <h1 className="text-3xl font-black text-[#1B254B] uppercase tracking-tighter italic mt-1">
              {loading ? 'Loading...' : profile.full_name}
            </h1>
            <div className="flex flex-wrap gap-5 text-[#A3AED0] text-[10px] font-black uppercase tracking-widest pt-1">
              <span className="underline decoration-[#4318FF] decoration-2 underline-offset-4">
                {profile.staff_id}
              </span>
              <span>{profile.department} Department</span>
              <span>{classes.length} Class{classes.length !== 1 ? 'es' : ''} Assigned</span>
            </div>
          </div>
        </div>

        {/* Save */}
        <div className="flex gap-3 mt-6 md:mt-0">
          <button
            onClick={handleSave}
            className="text-white px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-2xl shadow-blue-900/20 active:scale-95 flex items-center gap-2"
            style={{ background: saveSuccess ? '#059669' : '#111C44' }}>
            {saveSuccess ? <><Icons.Check /> Saved!</> : 'Update Profile'}
          </button>
        </div>
      </div>

      {/* ── Body grid ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        {/* LEFT — info panels */}
        <div className="xl:col-span-2 space-y-8">

          {/* Professional + Contact */}
          <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-14 pb-8 border-b border-gray-50">

              {/* Professional */}
              <div className="space-y-7">
                <SectionHeader icon={Icons.User} label="Professional Details" />
                <InfoItem label="Full Legal Name"  value={profile.full_name}  />
                <div className="grid grid-cols-2 gap-5">
                  <InfoItem label="Role"           value={profile.role}       />
                  <InfoItem label="Department"     value={profile.department} />
                </div>
                <InfoItem label="Staff ID"         value={profile.staff_id}   />
              </div>

              {/* Contact */}
              <div className="space-y-7">
                <SectionHeader icon={Icons.Phone} label="Contact Registry" />
                <InfoItem label="Institutional Email" value={profile.email} />
                <InfoItem label="Verified Mobile"     value={profile.phone} />
              </div>
            </div>

            {/* Stats row */}
            <div className="mt-8">
              <SectionHeader icon={Icons.Academic} label="Teaching Overview" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                <StatCard label="Classes Assigned" value={classes.length}    />
                <StatCard label="Total Students"   value={totalStudents}     />
                <StatCard label="Department"       value={profile.department} />
                <StatCard label="Role"             value={profile.role}       />
              </div>
            </div>
          </div>

          {/* My Classes ─ from classes table */}
          <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100">
            <SectionHeader icon={Icons.Classes} label="My Assigned Classes" />

            {classes.length === 0 ? (
              <div className="py-8 text-center text-[#A3AED0] font-black uppercase text-[11px] tracking-widest">
                No classes assigned yet.
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-gray-100">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F4F7FE]">
                    <tr>
                      {['Class Name', 'Language', 'Level', 'Schedule', 'Students', 'Capacity'].map(h => (
                        <th key={h} className="py-3 px-4 font-black text-[#A3AED0] uppercase text-[9px] tracking-widest">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {classes.map((cls, i) => {
                      const col = getLangColor(cls.language);
                      const pct = cls.capacity
                        ? Math.round(((cls.enrolled_count || 0) / cls.capacity) * 100)
                        : 0;
                      return (
                        <tr key={i} className="hover:bg-gray-50/60 transition-colors">
                          <td className="py-3 px-4 font-black text-[#1B254B] uppercase text-[11px]">
                            {cls.name || `Class ${i + 1}`}
                          </td>
                          <td className="py-3 px-4">
                            <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 20, background: col.bg, color: col.text }}>
                              {cls.language || '—'}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-black text-[#1B254B]">{cls.level || '—'}</td>
                          <td className="py-3 px-4 font-bold text-[#A3AED0] text-[10px]">
                            {cls.schedule || '—'}
                          </td>
                          <td className="py-3 px-4 font-black text-[#1B254B]">
                            {cls.enrolled_count || 0}
                          </td>
                          <td className="py-3 px-4">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <div style={{ flex: 1, height: 5, background: '#f1f5f9', borderRadius: 99, overflow: 'hidden', minWidth: 48 }}>
                                <div style={{
                                  height: '100%', borderRadius: 99,
                                  width: `${pct}%`,
                                  background: pct > 80 ? '#ef4444' : pct > 50 ? '#f97316' : '#4318FF',
                                  transition: 'width 1s ease',
                                }} />
                              </div>
                              <span style={{ fontSize: 9, fontWeight: 800, color: '#94a3b8' }}>
                                {cls.capacity || '—'}
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT — sidebar */}
        <div className="space-y-8">

          {/* Preferences */}
          <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
            <h3 className="flex items-center justify-center gap-3 text-[#1B254B] font-black text-[13px] uppercase tracking-widest border-b border-gray-50 pb-5 mb-7">
              <span className="text-[#4318FF]"><Icons.Bell /></span> Preferences
            </h3>
            <div className="space-y-6">
              <ToggleSwitch label="Schedule Changes"  enabled={notifications.schedule}     onToggle={() => handleToggle('schedule')}     />
              <ToggleSwitch label="New Students"      enabled={notifications.newStudents}  onToggle={() => handleToggle('newStudents')}  />
              <ToggleSwitch label="Announcements"     enabled={notifications.announcements} onToggle={() => handleToggle('announcements')} />
              <ToggleSwitch label="Grade Submissions" enabled={notifications.grades}       onToggle={() => handleToggle('grades')}       />
            </div>
          </div>

          {/* Document Hub */}
          <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
            <h3 className="flex items-center justify-center gap-3 text-[#1B254B] font-black text-[13px] uppercase tracking-widest border-b border-gray-50 pb-5 mb-7">
              <span className="text-[#4318FF]"><Icons.File /></span> Document Hub
            </h3>
            <div className="space-y-3">
              <DocLink title="Official Staff ID"
                onClick={() => setShowIdCard(true)} />
              <DocLink title="Work Certificate"
                onClick={() => setSelectedDoc({ title: 'Work Certificate',        code: `WRK-${profile.staff_id}` })} />
              <DocLink title="Monthly Schedule"
                onClick={() => setSelectedDoc({ title: 'Monthly Teaching Schedule', code: `SCH-${new Date().getMonth() + 1}-2026` })} />
              <DocLink title="Class Roster"
                onClick={() => setSelectedDoc({ title: 'Class Roster Report',     code: `RST-${profile.staff_id}` })} />
              <DocLink title="Employment Contract"
                onClick={() => setSelectedDoc({ title: 'Employment Contract',     code: `CTR-${profile.staff_id}` })} />
            </div>
          </div>

          {/* Dark standing card */}
          <div className="bg-[#111C44] p-8 rounded-[40px] shadow-2xl relative overflow-hidden">
            <div className="absolute -right-12 -bottom-12 opacity-[0.04] font-black text-[160px] italic select-none pointer-events-none">T</div>
            <p className="text-[9px] font-black text-[#818cf8] uppercase tracking-[0.25em] mb-4 relative">
              Your Standing
            </p>
            <div className="space-y-3 relative">
              {[
                { label: 'Role',         value: profile.role        },
                { label: 'Department',   value: profile.department  },
                { label: 'Classes',      value: classes.length      },
                { label: 'Students',     value: totalStudents       },
                { label: 'Email',        value: profile.email       },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-[#94a3b8] uppercase tracking-widest">{label}</span>
                  <span className="text-[11px] font-black text-white uppercase italic truncate max-w-[140px]">{value || '—'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Document viewer modal ────────────────────────────────────────── */}
      {selectedDoc && (
        <div
          className="fixed inset-0 bg-[#0B132B]/80 backdrop-blur-md z-[100] flex items-center justify-center p-6"
          onClick={() => setSelectedDoc(null)}>
          <div
            className="bg-white rounded-[50px] p-12 max-w-lg w-full shadow-2xl relative overflow-hidden"
            onClick={e => e.stopPropagation()}>
            {/* Close */}
            <button onClick={() => setSelectedDoc(null)}
              className="absolute top-8 right-8 text-[#A3AED0] hover:text-[#1B254B] transition-colors font-black text-xl p-2">
              ✕
            </button>

            <p className="text-[#4318FF] text-[9px] font-black tracking-[0.4em] uppercase mb-3">
              Official Document Vault
            </p>
            <h3 className="text-2xl font-black text-[#1B254B] uppercase tracking-tighter mb-8 leading-none">
              {selectedDoc.title}
            </h3>

            {/* Contextual summary */}
            <div className="mb-6 bg-[#F4F7FE] rounded-3xl p-6 space-y-2">
              {[
                { label: 'Staff Member', value: profile.full_name  },
                { label: 'Staff ID',     value: profile.staff_id   },
                { label: 'Role',         value: profile.role        },
                { label: 'Department',   value: profile.department  },
                { label: 'Email',        value: profile.email       },
                ...(selectedDoc.title.toLowerCase().includes('roster') && classes.length > 0
                  ? [{ label: 'Classes', value: `${classes.length} assigned` }]
                  : []),
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-[11px]">
                  <span className="font-black text-[#A3AED0] uppercase tracking-widest">{label}</span>
                  <span className="font-black text-[#1B254B] uppercase truncate max-w-[200px]">{value || '—'}</span>
                </div>
              ))}
            </div>

            {/* PDF placeholder */}
            <div className="p-8 bg-[#F4F7FE] rounded-[36px] border-4 border-dashed border-white flex flex-col items-center gap-3 mb-8">
              <div className="bg-[#4318FF] text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg font-black text-sm italic">
                PDF
              </div>
              <p className="text-xs font-black text-[#1B254B] uppercase tracking-widest text-center">
                Securely Generated Official Record
              </p>
              <p className="text-[9px] font-bold text-[#A3AED0] uppercase tracking-widest opacity-60">
                REF: {selectedDoc.code}
              </p>
            </div>

            <button
              onClick={() => handleDownload(selectedDoc.title)}
              className="w-full bg-[#111C44] text-white py-5 rounded-3xl font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl active:scale-95 transition-all hover:bg-black flex items-center justify-center gap-2">
              <Icons.Download /> Download Verified Copy
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherAccountSettings;
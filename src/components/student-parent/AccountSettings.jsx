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
  Payment:  () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  Shield:   () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  ChevronRight: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  History:  () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="12 8 12 12 14 14"/><path d="M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5"/></svg>,
};

// ─── Reusable: Info row ───────────────────────────────────────────────────────
const InfoItem = ({ label, value }) => (
  <div className="flex flex-col gap-2 group cursor-help">
    <span className="text-[9px] font-black text-[#A3AED0] uppercase tracking-[0.3em] group-hover:text-[#4318FF] transition-colors">{label}</span>
    <span className="text-[13px] font-black text-[#1B254B] uppercase tracking-tight">{value || 'Not Provided'}</span>
  </div>
);

// ─── Reusable: Stat card ──────────────────────────────────────────────────────
const StatCard = ({ label, value, sub }) => (
  <div className="bg-[#F4F7FE] p-5 rounded-[24px] border-2 border-transparent hover:border-[#4318FF]/20 transition-all text-center group cursor-default flex flex-col justify-center">
    <span className="text-[8px] font-black text-[#A3AED0] uppercase block mb-2 tracking-widest group-hover:text-[#4318FF] transition-colors">{label}</span>
    <span className="text-[14px] font-black text-[#1B254B] italic tracking-tighter leading-tight">{value}</span>
    {sub && <span className="text-[9px] text-[#A3AED0] font-bold mt-1">{sub}</span>}
  </div>
);

// ─── Reusable: Toggle switch ──────────────────────────────────────────────────
const ToggleSwitch = ({ label, enabled, onToggle }) => (
  <div className="flex items-center justify-between group px-2">
    <span className="text-[11px] font-black text-[#1B254B] uppercase tracking-widest group-hover:text-[#4318FF] transition-colors cursor-pointer" onClick={onToggle}>
      {label}
    </span>
    <button onClick={onToggle} style={{ width: 48, height: 24, borderRadius: 99, padding: 3, border: 'none', background: enabled ? '#4318FF' : '#E2E8F0', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'background .3s', flexShrink: 0 }}>
      <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', boxShadow: '0 2px 6px rgba(0,0,0,0.2)', transform: enabled ? 'translateX(24px)' : 'translateX(0)', transition: 'transform .3s' }} />
    </button>
  </div>
);

// ─── Reusable: Doc link row ───────────────────────────────────────────────────
const DocLink = ({ title, onClick }) => (
  <div onClick={onClick} className="group flex items-center justify-between p-4 rounded-[22px] border-2 border-gray-50 hover:bg-[#4318FF] transition-all duration-300 cursor-pointer shadow-sm hover:shadow-xl hover:shadow-indigo-200 active:scale-95">
    <div className="flex items-center gap-3">
      <div className="bg-[#F4F7FE] p-2 rounded-xl text-[#4318FF] group-hover:bg-white/20 group-hover:text-white transition-all flex items-center justify-center">
        <Icons.File />
      </div>
      <span className="text-[11px] font-black text-[#1B254B] group-hover:text-white uppercase tracking-tight transition-colors">{title}</span>
    </div>
    <span className="text-[#4318FF] group-hover:text-white font-black text-base transition-colors">→</span>
  </div>
);

// ─── Section header ───────────────────────────────────────────────────────────
const SectionHeader = ({ icon: Icon, label }) => (
  <div className="flex items-center gap-3 mb-7 pb-5 border-b border-gray-50">
    <div className="w-9 h-9 rounded-xl bg-[#F4F7FE] flex items-center justify-center text-[#4318FF] shadow-inner shrink-0">
      <Icon />
    </div>
    <h3 className="text-[15px] font-black text-[#1B254B] uppercase tracking-tighter">{label}</h3>
  </div>
);

// ─── Status badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const colors = {
    Paid:    { bg: '#ecfdf5', text: '#059669', dot: '#10b981' },
    Active:  { bg: '#eff6ff', text: '#2563eb', dot: '#3b82f6' },
    Overdue: { bg: '#fef2f2', text: '#dc2626', dot: '#ef4444' },
    Pending: { bg: '#fff7ed', text: '#c2410c', dot: '#f97316' },
  };
  const c = colors[status] || colors.Active;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 9, fontWeight: 800, padding: '3px 10px', borderRadius: 20, background: c.bg, color: c.text, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.dot, display: 'inline-block' }} />
      {status}
    </span>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const AccountSettings = () => {
  const [showIdCard,   setShowIdCard]   = useState(false);
  const [selectedDoc,  setSelectedDoc]  = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [saveSuccess,  setSaveSuccess]  = useState(false);
  const [avatarUrl,    setAvatarUrl]    = useState(
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300'
  );
  const fileInputRef = useRef(null);

  // ── State: profile pulled from students table ─────────────────────────────
  const [profile, setProfile] = useState({
    full_name: 'Loading...', student_id: '---', program: '---',
    email: '---', phone: '---', dob: 'Not Provided',
    gender: 'Not Provided', address: 'Not Provided',
    language: '---', level: '---', group_name: '---',
    enrollment_year: '---', average: 'N/A',
    payment_status: 'Pending', exam_type: '---',
  });

  // ── State: payment history pulled from payments table ────────────────────
  const [payments, setPayments] = useState([]);

  // ── State: grades pulled from grades table ────────────────────────────────
  const [grades, setGrades] = useState([]);

  // ── State: notification preferences (local only) ─────────────────────────
  const [notifications, setNotifications] = useState({
    email: true, assignments: false, schedule: true, exams: true,
  });

  // ── Fetch all data ────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // 1. Student profile (students table)
        const { data: student } = await supabase
          .from('students').select('*').eq('email', user.email).single();

        if (student) {
          const fullName = `${student.first_name || ''} ${student.last_name || ''}`.trim();

          // 2. Grades (grades table) — avg over /20
          let avgStr = 'N/A';
          const { data: gradeRows } = await supabase
            .from('grades').select('*').eq('student_name', fullName);

          if (gradeRows && gradeRows.length > 0) {
            let total = 0, count = 0;
            gradeRows.forEach(g => {
              const mark = g.score ? parseFloat(g.score) : (parseFloat(g.grade) || 0);
              const max  = parseFloat(g.max_grade) || 20;
              total += (mark / max) * 20;
              count++;
            });
            if (count > 0) avgStr = `${(total / count).toFixed(2)} / 20`;
            setGrades(gradeRows.slice(0, 5)); // last 5 grades
          }

          // 3. Payment history (payments table) — by student_id
          const { data: payRows } = await supabase
            .from('payments')
            .select('*')
            .eq('student_id', student.id)
            .order('payment_date', { ascending: false });

          if (payRows) {
            setPayments(payRows.map(p => ({
              id:     p.id,
              date:   p.payment_date
                        ? new Date(p.payment_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                        : 'N/A',
              amount: `${p.amount || 0} DZD`,
              method: p.payment_method || 'Cash',
              status: p.status || 'Paid',
              notes:  p.notes || '',
            })));
          }

          setProfile({
            full_name:       fullName,
            student_id:      `STD-${student.id || Math.floor(Math.random() * 9000 + 1000)}`,
            program:         `${student.language || 'Language'} — ${student.level || 'Level'}`,
            email:           student.email || user.email,
            phone:           student.phone || 'Not Provided',
            dob:             student.dob || 'Not Provided',
            gender:          student.gender || 'Not Provided',
            address:         student.address || 'Not Provided',
            language:        student.language || '---',
            level:           student.level || '---',
            group_name:      student.group_name || '---',
            exam_type:       student.exam_type || '---',
            payment_status:  student.status === 'Paid' ? 'Paid' : student.status === 'Overdue' ? 'Overdue' : 'Active',
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
    fetchAll();
  }, []);

  const handleToggle = (s) => setNotifications(prev => ({ ...prev, [s]: !prev[s] }));

  // ── Photo change — local preview (no DB change) ───────────────────────────
  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setAvatarUrl(URL.createObjectURL(file));
  };

  // ── Save profile (visual feedback only — no extra DB writes) ─────────────
  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  // ── Download trigger ──────────────────────────────────────────────────────
  const handleDownload = (title) => {
    const a = document.createElement('a');
    a.href = '#';
    a.download = `${title}.pdf`;
    a.click();
  };

  // ─────────────────────────────────────────────────────────────────────────
  // ID CARD VIEW
  // ─────────────────────────────────────────────────────────────────────────
  if (showIdCard) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center animate-fadeIn p-4">
        <div className="bg-white rounded-[50px] p-12 shadow-2xl border border-gray-100 w-full max-w-4xl relative overflow-hidden">
          <div className="flex flex-col items-center mb-10">
            <h2 className="text-4xl font-black text-[#1B254B] uppercase tracking-tighter italic">Official Student ID</h2>
            <div className="h-1.5 w-24 bg-[#4318FF] rounded-full mt-4" />
          </div>

          {/* The physical card */}
          <div className="relative mx-auto bg-gradient-to-br from-[#D8DDEB] to-[#F4F7FE] w-full max-w-3xl rounded-[40px] shadow-2xl border-[10px] border-white flex overflow-hidden group" style={{ aspectRatio: '1.6 / 1' }}>
            <div className="flex-1 p-10 flex flex-col justify-between relative z-10">
              <div className="flex items-start gap-8">
                <div className="w-36 h-44 rounded-[28px] border-[5px] border-white shadow-xl overflow-hidden bg-white shrink-0">
                  <img src={avatarUrl} className="w-full h-full object-cover" alt="Student" />
                </div>
                <div className="space-y-3 pt-2">
                  {[
                    { label: 'Full Name',          value: profile.full_name, big: true },
                    { label: 'Language & Level',   value: profile.program              },
                    { label: 'Institutional Email',value: profile.email                },
                    { label: 'Group',              value: profile.group_name           },
                    { label: 'Campus Location',    value: 'Polyglot Academy, Algiers'  },
                  ].map(({ label, value, big }) => (
                    <div key={label} className="space-y-0.5">
                      <p className="text-[9px] font-black text-[#4318FF] uppercase tracking-[0.3em]">{label}</p>
                      <p className={`font-black text-[#1B254B] uppercase ${big ? 'text-xl italic' : 'text-xs opacity-80'}`}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-6 text-[#A3AED0] text-[9px] font-black uppercase tracking-widest pt-4">
                <span>ID: {profile.student_id}</span>
                <span>•</span>
                <span>{profile.language} Department</span>
                <span>•</span>
                <span>Year {profile.enrollment_year}</span>
              </div>
            </div>

            {/* QR panel */}
            <div className="w-1/3 bg-white/20 backdrop-blur-sm flex flex-col items-center justify-center p-8 border-l border-white/30">
              <div className="bg-white p-4 rounded-3xl shadow-xl mb-4 group-hover:scale-105 transition-transform">
                <Icons.Qr />
              </div>
              <p className="text-[9px] font-black text-[#1B254B] uppercase tracking-[0.2em] text-center opacity-40">
                Scan to Verify Credentials
              </p>
            </div>

            {/* Decoration */}
            <div className="absolute -right-20 -top-20 text-[300px] font-black opacity-[0.03] select-none italic pointer-events-none">F</div>
          </div>

          <div className="mt-10 flex justify-center gap-4">
            <button onClick={() => setShowIdCard(false)} className="bg-[#111C44] text-white px-12 py-4 rounded-3xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl active:scale-95">
              Go Back
            </button>
            <button onClick={() => window.print()} className="bg-[#4318FF] text-white px-12 py-4 rounded-3xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-[#3311CC] transition-all shadow-xl active:scale-95 flex items-center gap-2">
              <Icons.Print /> Print ID Card
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

      {/* ── Profile hero card ───────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
        <div className="flex items-center gap-7">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-24 h-24 rounded-[28px] bg-[#F4F7FE] overflow-hidden border-[5px] border-white shadow-xl shadow-blue-900/10 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover hover:opacity-90 transition-opacity" />
            </div>
            <button onClick={() => fileInputRef.current?.click()} className="absolute -bottom-2 -right-2 bg-[#4318FF] text-white p-2 rounded-xl border-4 border-white shadow-lg hover:bg-[#3311CC] transition-all flex items-center justify-center">
              <Icons.Camera />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
          </div>

          {/* Name block */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-[#EEF2FF] text-[#4318FF] text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-[#4318FF]/10 shadow-sm inline-flex items-center gap-1.5">
                <Icons.Shield /> Certified Profile
              </span>
              <StatusBadge status={profile.payment_status} />
            </div>
            <h1 className="text-3xl font-black text-[#1B254B] uppercase tracking-tighter italic mt-1">
              {loading ? 'Loading...' : profile.full_name}
            </h1>
            <div className="flex flex-wrap gap-5 text-[#A3AED0] text-[10px] font-black uppercase tracking-widest pt-1">
              <span className="underline decoration-[#4318FF] decoration-2 underline-offset-4">
                {profile.student_id}
              </span>
              <span>{profile.language} · {profile.level} · {profile.group_name}</span>
              <span>Type: {profile.exam_type}</span>
            </div>
          </div>
        </div>

        {/* Save */}
        <div className="flex gap-3 mt-6 md:mt-0">
          <button onClick={handleSave}
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

          {/* Personal + Contact */}
          <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-14 pb-8 border-b border-gray-50">

              {/* Identification */}
              <div className="space-y-7">
                <SectionHeader icon={Icons.User} label="Identification" />
                <InfoItem label="Full Legal Name"      value={profile.full_name} />
                {/* ✅ Birth Date + Gender on SAME row */}
                <div className="grid grid-cols-2 gap-5">
                  <InfoItem label="Birth Date"         value={profile.dob}    />
                  <InfoItem label="Gender"             value={profile.gender} />
                </div>
                <InfoItem label="Language"             value={profile.language} />
                <InfoItem label="Level"                value={profile.level}    />
                <InfoItem label="Group"                value={profile.group_name} />
                <InfoItem label="Registration Type"    value={profile.exam_type} />
              </div>

              {/* Contact */}
              <div className="space-y-7">
                <SectionHeader icon={Icons.Phone} label="Contact Registry" />
                <InfoItem label="Institutional Email"  value={profile.email}   />
                <InfoItem label="Verified Mobile"      value={profile.phone}   />
                <InfoItem label="Residential Address"  value={profile.address} />
              </div>
            </div>

            {/* Academic Overview */}
            <div className="mt-8">
              <SectionHeader icon={Icons.Academic} label="Academic Overview" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
                <StatCard label="Enrolled"        value={profile.enrollment_year} />
                <StatCard label="Language"        value={profile.language}        />
                <StatCard label="Current Level"   value={profile.level}           />
                <StatCard label="Avg Grade"       value={profile.average}         />
              </div>

              {/* Recent grades inline table */}
              {grades.length > 0 && (
                <div>
                  <p className="text-[9px] font-black text-[#A3AED0] uppercase tracking-[0.25em] mb-4">Recent Assessment Records</p>
                  <div className="overflow-hidden rounded-2xl border border-gray-100">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#F4F7FE]">
                        <tr>
                          {['Assessment', 'Score', 'Max', 'Remarks'].map(h => (
                            <th key={h} className="py-3 px-4 font-black text-[#A3AED0] uppercase text-[9px] tracking-widest">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {grades.map((g, i) => {
                          const score = parseFloat(g.score || g.grade || 0);
                          const max   = parseFloat(g.max_grade || 20);
                          const pct   = max > 0 ? ((score / max) * 100).toFixed(0) : 0;
                          return (
                            <tr key={i} className="hover:bg-gray-50/60 transition-colors">
                              <td className="py-3 px-4 font-black text-[#1B254B] uppercase text-[11px]">
                                {g.subject || g.course || `Assessment ${i + 1}`}
                              </td>
                              <td className="py-3 px-4">
                                <span className={`font-black text-[12px] ${pct >= 70 ? 'text-green-600' : 'text-red-500'}`}>
                                  {score}
                                </span>
                              </td>
                              <td className="py-3 px-4 font-bold text-[#A3AED0]">{max}</td>
                              <td className="py-3 px-4 font-bold text-[#A3AED0] text-[10px]">
                                {g.remarks || g.notes || (pct >= 70 ? 'Good standing' : 'Needs improvement')}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Payment History */}
          <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100">
            <SectionHeader icon={Icons.Payment} label="Payment History" />

            {payments.length === 0 ? (
              <div className="py-8 text-center text-[#A3AED0] font-black uppercase text-[11px] tracking-widest">
                No payment records found.
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-gray-100">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F4F7FE]">
                    <tr>
                      {['Date', 'Amount', 'Method', 'Status', 'Notes'].map(h => (
                        <th key={h} className="py-3 px-4 font-black text-[#A3AED0] uppercase text-[9px] tracking-widest">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {payments.map((p, i) => (
                      <tr key={i} className="hover:bg-gray-50/60 transition-colors">
                        <td className="py-3 px-4 font-bold text-[#A3AED0]">{p.date}</td>
                        <td className="py-3 px-4 font-black text-[#1B254B]">{p.amount}</td>
                        <td className="py-3 px-4 font-bold text-[#A3AED0]">{p.method}</td>
                        <td className="py-3 px-4"><StatusBadge status={p.status} /></td>
                        <td className="py-3 px-4 font-bold text-[#A3AED0] text-[10px]">{p.notes || '—'}</td>
                      </tr>
                    ))}
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
              <ToggleSwitch label="Email Logs"        enabled={notifications.email}       onToggle={() => handleToggle('email')}       />
              <ToggleSwitch label="Assignment Alerts" enabled={notifications.assignments} onToggle={() => handleToggle('assignments')} />
              <ToggleSwitch label="Schedule Sync"     enabled={notifications.schedule}    onToggle={() => handleToggle('schedule')}    />
              <ToggleSwitch label="Exam Alerts"       enabled={notifications.exams}       onToggle={() => handleToggle('exams')}       />
            </div>
          </div>

          {/* Document Hub */}
          <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
            <h3 className="flex items-center justify-center gap-3 text-[#1B254B] font-black text-[13px] uppercase tracking-widest border-b border-gray-50 pb-5 mb-7">
              <span className="text-[#4318FF]"><Icons.File /></span> Document Hub
            </h3>
            <div className="space-y-3">
              <DocLink title="Digital Student ID"
                onClick={() => setShowIdCard(true)} />
              <DocLink title="Enrollment Certificate"
                onClick={() => setSelectedDoc({ title: 'Enrollment Certificate',    code: `CTR-${profile.enrollment_year}-F`   })} />
              <DocLink title="Payment Receipt"
                onClick={() => setSelectedDoc({ title: 'Latest Payment Receipt',    code: payments[0] ? `REC-${payments[0].id}` : 'REC-N/A' })} />
              <DocLink title="Academic Transcript"
                onClick={() => setSelectedDoc({ title: 'Official Grade Transcript',  code: `TRN-${profile.enrollment_year}-S`  })} />
              <DocLink title="Level Completion Cert."
                onClick={() => setSelectedDoc({ title: 'Level Completion Certificate', code: `COMP-${profile.level}-${profile.enrollment_year}` })} />
            </div>
          </div>

          {/* Quick summary card */}
          <div className="bg-[#111C44] p-8 rounded-[40px] shadow-2xl relative overflow-hidden">
            <div className="absolute -right-12 -bottom-12 opacity-[0.04] font-black text-[160px] italic select-none pointer-events-none">F</div>
            <p className="text-[9px] font-black text-[#818cf8] uppercase tracking-[0.25em] mb-4 relative">Your Standing</p>
            <div className="space-y-3 relative">
              {[
                { label: 'Language', value: profile.language },
                { label: 'Level',    value: profile.level    },
                { label: 'Group',    value: profile.group_name },
                { label: 'Avg',      value: profile.average  },
                { label: 'Payments', value: `${payments.filter(p => p.status === 'Paid').length} / ${payments.length} paid` },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-[#94a3b8] uppercase tracking-widest">{label}</span>
                  <span className="text-[11px] font-black text-white uppercase italic">{value || '---'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Document viewer modal ────────────────────────────────────────── */}
      {selectedDoc && (
        <div className="fixed inset-0 bg-[#0B132B]/80 backdrop-blur-md z-[100] flex items-center justify-center p-6"
          onClick={() => setSelectedDoc(null)}>
          <div className="bg-white rounded-[50px] p-12 max-w-lg w-full shadow-2xl relative overflow-hidden"
            onClick={e => e.stopPropagation()}>
            {/* Close */}
            <button onClick={() => setSelectedDoc(null)}
              className="absolute top-8 right-8 text-[#A3AED0] hover:text-[#1B254B] transition-colors font-black text-xl p-2">
              ✕
            </button>

            <p className="text-[#4318FF] text-[9px] font-black tracking-[0.4em] uppercase mb-3">Official Document Vault</p>
            <h3 className="text-2xl font-black text-[#1B254B] uppercase tracking-tighter mb-8 leading-none">
              {selectedDoc.title}
            </h3>

            {/* Contextual summary */}
            <div className="mb-6 bg-[#F4F7FE] rounded-3xl p-6 space-y-2">
              {[
                { label: 'Student',     value: profile.full_name   },
                { label: 'ID',          value: profile.student_id  },
                { label: 'Language',    value: profile.language     },
                { label: 'Level',       value: profile.level        },
                { label: 'Group',       value: profile.group_name   },
                ...(selectedDoc.title.toLowerCase().includes('payment') && payments[0]
                  ? [
                      { label: 'Last Payment', value: payments[0].date   },
                      { label: 'Amount',       value: payments[0].amount },
                      { label: 'Method',       value: payments[0].method },
                    ]
                  : []),
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-[11px]">
                  <span className="font-black text-[#A3AED0] uppercase tracking-widest">{label}</span>
                  <span className="font-black text-[#1B254B] uppercase">{value || '---'}</span>
                </div>
              ))}
            </div>

            {/* PDF placeholder */}
            <div className="p-8 bg-[#F4F7FE] rounded-[36px] border-4 border-dashed border-white flex flex-col items-center gap-3 mb-8">
              <div className="bg-[#4318FF] text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg font-black text-sm italic">PDF</div>
              <p className="text-xs font-black text-[#1B254B] uppercase tracking-widest text-center">Securely Generated Academic Record</p>
              <p className="text-[9px] font-bold text-[#A3AED0] uppercase tracking-widest opacity-60">REF: {selectedDoc.code}</p>
            </div>

            <button onClick={() => handleDownload(selectedDoc.title)}
              className="w-full bg-[#111C44] text-white py-5 rounded-3xl font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl active:scale-95 transition-all hover:bg-black flex items-center justify-center gap-2">
              <Icons.Download /> Download Verified Copy
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountSettings;
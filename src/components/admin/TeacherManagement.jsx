import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

// ─────────────────────────────────────────────────────────────────
// SVG ICON SYSTEM
// ─────────────────────────────────────────────────────────────────
const Ico = ({ d, size = 16, color = 'currentColor', sw = 2, extra = null }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {(Array.isArray(d) ? d : [d]).map((p, i) => <path key={i} d={p} />)}
    {extra}
  </svg>
);

const Icons = {
  Check:    (c = '#fff')    => <Ico d="M20 6L9 17l-5-5" color={c} sw={2.5} />,
  X:        (c = '#ef4444') => <Ico d={["M18 6L6 18","M6 6l12 12"]} color={c} sw={2.5} />,
  Plus:     (c = '#fff')    => <Ico d={["M12 5v14","M5 12h14"]} color={c} sw={2.5} />,
  User:     (c = '#4318FF') => <Ico d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" color={c} extra={<circle cx="12" cy="7" r="4" fill="none" stroke={c} strokeWidth="2"/>} />,
  Mail:     (c = '#94a3b8') => <Ico d={["M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z","M22 6l-10 7L2 6"]} color={c} />,
  Phone:    (c = '#94a3b8') => <Ico d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" color={c} />,
  File:     (c = '#4318FF') => <Ico d={["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z","M14 2v6h6"]} color={c} />,
  Arrow:    (c = '#1e293b') => <Ico d={["M5 12h14","M12 5l7 7-7 7"]} color={c} />,
  Users:    (c = '#4318FF') => <Ico d={["M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2","M23 21v-2a4 4 0 0 0-3-3.87","M16 3.13a4 4 0 0 1 0 7.75"]} color={c} extra={<circle cx="9" cy="7" r="4" fill="none" stroke={c} strokeWidth="2"/>} />,
  Briefcase:(c = '#4318FF') => <Ico d={["M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z","M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"]} color={c} />,
  Clock:    (c = '#94a3b8') => <Ico d="M12 6v6l4 2" color={c} extra={<circle cx="12" cy="12" r="10" fill="none" stroke={c} strokeWidth="2"/>} />,
  Bell:     (c = '#4318FF') => <Ico d={["M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9","M13.73 21a2 2 0 0 1-3.46 0"]} color={c} />,
};

// ─── Shared UI ────────────────────────────────────────────────────
const Card = ({ children, style = {} }) => (
  <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', boxShadow: '0 1px 4px rgba(15,23,42,0.05)', ...style }}>
    {children}
  </div>
);

const inputSt = {
  width: '100%', background: '#f8fafc', border: '1px solid #f1f5f9',
  borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#1e293b',
  outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'border-color .15s',
};

const labelSt = {
  display: 'block', fontSize: 11, fontWeight: 700, color: '#94a3b8',
  textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6,
};

// ─── Toast notification ───────────────────────────────────────────
const Toast = ({ message, onClose }) => (
  <div style={{ position: 'fixed', bottom: 32, right: 32, zIndex: 250, animation: 'slideIn .3s ease' }}>
    <div style={{ background: '#0f172a', color: '#fff', padding: '14px 20px', borderRadius: 14, boxShadow: '0 8px 32px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: 12, minWidth: 320, border: '1px solid rgba(255,255,255,0.08)' }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: '#4318FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {Icons.Bell('#fff')}
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>System Update</p>
        <p style={{ margin: '2px 0 0', fontSize: 13, fontWeight: 600, color: '#fff' }}>{message}</p>
      </div>
      <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex' }}>
        {Icons.X('#64748b')}
      </button>
    </div>
    <style>{`@keyframes slideIn { from { opacity:0; transform:translateY(16px);} to { opacity:1; transform:none; } }`}</style>
  </div>
);

// ─────────────────────────────────────────────────────────────────
// TAB 1: ADD TEACHER — all logic UNTOUCHED
// ─────────────────────────────────────────────────────────────────
const TeacherRegistrationTab = ({ showToast, prefillData, clearPrefill }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    department: 'English', role: 'Teacher', requestId: null,
  });

  useEffect(() => {
    if (prefillData) setFormData(prefillData);
  }, [prefillData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email, password: formData.phone,
      });
      if (authError && authError.message !== 'User already registered') throw authError;
      const uid = authData.user?.id;

      const { error: dbError } = await supabase.from('staff').insert([{
        auth_id: uid, first_name: formData.firstName, last_name: formData.lastName,
        email: formData.email, phone: formData.phone, department: formData.department, role: formData.role,
      }]);
      if (dbError) throw dbError;

      if (formData.requestId) {
        await supabase.from('teacher_requests').update({ status: 'Accepted' }).eq('id', formData.requestId);
      }

      showToast(`${formData.firstName} ${formData.lastName} added successfully.`);
      setFormData({ firstName: '', lastName: '', email: '', phone: '', department: 'English', role: 'Teacher', requestId: null });
      if (clearPrefill) clearPrefill();
    } catch (err) {
      showToast('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Page header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#1e293b' }}>Add New Staff</h1>
        <p style={{ margin: '5px 0 0', fontSize: 13, color: '#94a3b8' }}>
          Register a new teacher or administrator to the system.
        </p>
      </div>

      {/* Auto-fill notice */}
      {prefillData && (
        <div style={{ marginBottom: 20, padding: '12px 16px', borderRadius: 10, background: '#ecfdf5', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', gap: 10 }}>
          {Icons.Check('#059669')}
          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#059669' }}>
            Form auto-filled from applicant data. Review and confirm to complete hiring.
          </p>
        </div>
      )}

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Professional details */}
        <Card style={{ padding: '22px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18, paddingBottom: 14, borderBottom: '1px solid #f8fafc' }}>
            <div style={{ width: 4, height: 18, borderRadius: 99, background: '#4318FF' }} />
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#1e293b' }}>Professional Details</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={labelSt}>Department</label>
              <select name="department" value={formData.department} onChange={handleInputChange}
                style={{ ...inputSt, cursor: 'pointer' }}
                onFocus={e => e.target.style.borderColor = '#4318FF'}
                onBlur={e => e.target.style.borderColor = '#f1f5f9'}
              >
                <option>English</option>
                <option>Français</option>
                <option>Deutsch</option>
                <option>Español</option>
                <option>Administration</option>
              </select>
            </div>
            <div>
              <label style={labelSt}>System Role</label>
              <select name="role" value={formData.role} onChange={handleInputChange}
                style={{ ...inputSt, cursor: 'pointer' }}
                onFocus={e => e.target.style.borderColor = '#4318FF'}
                onBlur={e => e.target.style.borderColor = '#f1f5f9'}
              >
                <option value="Teacher">Teacher</option>
                <option value="Admin">Admin</option>
                <option value="Secretary">Secretary</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Personal + Login side by side */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

          {/* Personal info */}
          <Card style={{ padding: '22px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18, paddingBottom: 14, borderBottom: '1px solid #f8fafc' }}>
              <span style={{ display: 'flex' }}>{Icons.User()}</span>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#1e293b' }}>Personal Info</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={labelSt}>First Name</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange}
                  placeholder="First Name" required style={inputSt}
                  onFocus={e => e.target.style.borderColor = '#4318FF'}
                  onBlur={e => e.target.style.borderColor = '#f1f5f9'}
                />
              </div>
              <div>
                <label style={labelSt}>Last Name</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange}
                  placeholder="Last Name" required style={inputSt}
                  onFocus={e => e.target.style.borderColor = '#4318FF'}
                  onBlur={e => e.target.style.borderColor = '#f1f5f9'}
                />
              </div>
            </div>
          </Card>

          {/* Login info */}
          <Card style={{ padding: '22px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18, paddingBottom: 14, borderBottom: '1px solid #f8fafc' }}>
              <span style={{ display: 'flex' }}>{Icons.Mail()}</span>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#1e293b' }}>Login Credentials</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={labelSt}>Work Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange}
                  placeholder="teacher@school.com" required style={inputSt}
                  onFocus={e => e.target.style.borderColor = '#4318FF'}
                  onBlur={e => e.target.style.borderColor = '#f1f5f9'}
                />
              </div>
              <div>
                <label style={labelSt}>Phone (becomes password)</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange}
                  placeholder="+213 ..." required style={inputSt}
                  onFocus={e => e.target.style.borderColor = '#4318FF'}
                  onBlur={e => e.target.style.borderColor = '#f1f5f9'}
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Submit */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 4 }}>
          <button type="submit" disabled={loading}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 28px', borderRadius: 12, border: 'none',
              background: loading ? '#94a3b8' : '#4318FF', color: '#fff',
              fontSize: 13, fontWeight: 700, cursor: loading ? 'default' : 'pointer',
              transition: 'background .15s', boxShadow: '0 4px 14px rgba(67,24,255,0.25)',
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#3730a3'; }}
            onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#4318FF'; }}
          >
            {loading ? 'Processing...' : <>{Icons.Arrow()} Create Account</>}
          </button>
        </div>
      </form>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────
// TAB 2: TEACHER APPLICANTS — all logic UNTOUCHED
// ─────────────────────────────────────────────────────────────────
const TeacherApplicantTab = ({ showToast, onAcceptApplicant }) => {
  const [applicants, setApplicants]   = useState([]);
  const [loading, setLoading]         = useState(true);
  const [viewingCV, setViewingCV]     = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      const { data, error } = await supabase
        .from('teacher_requests').select('*')
        .eq('status', 'Pending')
        .order('created_at', { ascending: false });
      if (data) setApplicants(data);
      setLoading(false);
    };
    fetchRequests();
  }, []);

  const handleReject = async (id) => {
    if (window.confirm('Are you sure you want to reject this applicant?')) {
      await supabase.from('teacher_requests').update({ status: 'Rejected' }).eq('id', id);
      setApplicants(applicants.filter(a => a.id !== id));
      showToast('Applicant has been rejected.');
    }
  };

  if (loading) return (
    <div style={{ padding: '48px 0', textAlign: 'center' }}>
      <div style={{ width: 32, height: 32, border: '3px solid #e0e7ff', borderTopColor: '#4318FF', borderRadius: '50%', margin: '0 auto 10px', animation: 'spin .8s linear infinite' }} />
      <p style={{ color: '#94a3b8', fontSize: 13 }}>Loading applicants...</p>
    </div>
  );

  return (
    <div style={{ width: '100%' }}>
      {/* Page header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#1e293b' }}>Teacher Applicants</h1>
        <p style={{ margin: '5px 0 0', fontSize: 13, color: '#94a3b8' }}>
          Review pending applications and hire qualified candidates.
        </p>
      </div>

      {/* Table */}
      <Card>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
              {['Applicant', 'Subject / Department', 'Applied On', 'CV', 'Decision'].map((h, i) => (
                <th key={h} style={{
                  padding: '14px 20px', textAlign: i === 4 ? 'right' : 'left',
                  fontSize: 11, fontWeight: 700, color: '#94a3b8',
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {applicants.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '48px', textAlign: 'center', color: '#94a3b8', fontSize: 13, fontWeight: 600 }}>
                  No pending teacher applications at the moment.
                </td>
              </tr>
            ) : applicants.map(app => (
              <tr key={app.id}
                style={{ borderBottom: '1px solid #f8fafc', transition: 'background .15s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {/* Applicant */}
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: '#eef2ff', color: '#4318FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, textTransform: 'uppercase', flexShrink: 0 }}>
                      {app.first_name?.charAt(0)}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontWeight: 700, color: '#1e293b' }}>{app.first_name} {app.last_name}</p>
                      <p style={{ margin: '2px 0 0', fontSize: 11, color: '#94a3b8' }}>{app.email}</p>
                    </div>
                  </div>
                </td>

                {/* Subject */}
                <td style={{ padding: '14px 20px' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: '#eef2ff', color: '#4318FF' }}>
                    {app.subject || 'General'}
                  </span>
                </td>

                {/* Date */}
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748b' }}>
                    {Icons.Clock()}
                    {new Date(app.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </td>

                {/* CV */}
                <td style={{ padding: '14px 20px' }}>
                  <button onClick={() => setViewingCV(app)}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, border: '1px solid #e0e7ff', background: '#f5f3ff', color: '#4318FF', fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all .15s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#4318FF'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#f5f3ff'; e.currentTarget.style.color = '#4318FF'; }}
                  >
                    {Icons.File('#currentColor')} View Profile
                  </button>
                </td>

                {/* Actions */}
                <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                    <button onClick={() => onAcceptApplicant(app)}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8, border: 'none', background: '#ecfdf5', color: '#059669', fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all .15s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#059669'; e.currentTarget.style.color = '#fff'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#ecfdf5'; e.currentTarget.style.color = '#059669'; }}
                    >
                      {Icons.Check('#059669')} Accept
                    </button>
                    <button onClick={() => handleReject(app.id)}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8, border: 'none', background: '#fef2f2', color: '#ef4444', fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all .15s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = '#fff'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.color = '#ef4444'; }}
                    >
                      {Icons.X('#ef4444')} Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* ─── CV / Profile Modal ─────────────────────────────────── */}
      {viewingCV && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 150,
          background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
        }}>
          <div style={{ background: '#fff', width: '100%', maxWidth: 760, borderRadius: 22, boxShadow: '0 24px 64px rgba(0,0,0,0.18)', overflow: 'hidden', position: 'relative' }}>

            {/* Close */}
            <button onClick={() => setViewingCV(null)}
              style={{ position: 'absolute', top: 18, right: 20, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', color: '#94a3b8', transition: 'color .15s', zIndex: 10 }}
              onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
              onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
            >
              {Icons.X()}
            </button>

            <div style={{ display: 'flex' }}>

              {/* ── Left: Profile panel ── */}
              <div style={{ width: 260, background: '#f8fafc', padding: '36px 28px', display: 'flex', flexDirection: 'column', alignItems: 'center', borderRight: '1px solid #f1f5f9', textAlign: 'center', flexShrink: 0 }}>
                {/* Avatar */}
                <div style={{ width: 80, height: 80, borderRadius: 20, background: '#4318FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 800, color: '#fff', textTransform: 'uppercase', marginBottom: 16, boxShadow: '0 8px 24px rgba(67,24,255,0.3)' }}>
                  {viewingCV.first_name?.charAt(0)}
                </div>
                <h3 style={{ margin: '0 0 4px', fontSize: 18, fontWeight: 800, color: '#1e293b' }}>
                  {viewingCV.first_name} {viewingCV.last_name}
                </h3>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 12px', borderRadius: 20, background: '#eef2ff', color: '#4318FF', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  {viewingCV.subject || 'General'} Specialist
                </span>

                {/* Contact */}
                <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid #f1f5f9', width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ textAlign: 'left' }}>
                    <p style={{ margin: '0 0 3px', fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Phone</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {Icons.Phone()}
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{viewingCV.phone || '—'}</p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <p style={{ margin: '0 0 3px', fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Email</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {Icons.Mail()}
                      <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: '#1e293b', wordBreak: 'break-all' }}>{viewingCV.email}</p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <p style={{ margin: '0 0 3px', fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Status</p>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#f59e0b' }}>Pending Review</span>
                  </div>
                </div>
              </div>

              {/* ── Right: CV details ── */}
              <div style={{ flex: 1, padding: '36px 32px', display: 'flex', flexDirection: 'column' }}>
                <p style={{ margin: '0 0 20px', fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Resume / CV Document
                </p>

                <div style={{ padding: '16px 20px', borderRadius: 12, background: '#f8fafc', border: '1px solid #f1f5f9', borderLeft: '4px solid #4318FF', marginBottom: 24 }}>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#1e293b', lineHeight: 1.6 }}>
                    {viewingCV.cv_file ? 'Applicant has attached a CV document.' : 'No CV file provided by the applicant.'}
                  </p>
                </div>

                {viewingCV.cv_file && (
                  <a href={viewingCV.cv_file} target="_blank" rel="noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 10, background: '#eef2ff', color: '#4318FF', fontSize: 13, fontWeight: 700, textDecoration: 'none', marginBottom: 24, transition: 'background .15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#e0e7ff'}
                    onMouseLeave={e => e.currentTarget.style.background = '#eef2ff'}
                  >
                    {Icons.File()} Open Full CV File
                  </a>
                )}

                <div style={{ marginBottom: 24 }}>
                  <p style={{ margin: '0 0 4px', fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Application Date</p>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#1e293b' }}>
                    {new Date(viewingCV.created_at).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>

                {/* Actions */}
                <div style={{ marginTop: 'auto', display: 'flex', gap: 12, paddingTop: 20, borderTop: '1px solid #f1f5f9' }}>
                  <button onClick={() => setViewingCV(null)}
                    style={{ padding: '10px 20px', borderRadius: 10, border: '1px solid #f1f5f9', background: '#f8fafc', color: '#64748b', fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all .15s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.borderColor = '#fecaca'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#64748b'; e.currentTarget.style.borderColor = '#f1f5f9'; }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => { setViewingCV(null); onAcceptApplicant(viewingCV); }}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px 0', borderRadius: 12, border: 'none', background: '#4318FF', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'background .15s', boxShadow: '0 4px 14px rgba(67,24,255,0.25)' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#3730a3'}
                    onMouseLeave={e => e.currentTarget.style.background = '#4318FF'}
                  >
                    {Icons.Arrow('#fff')} Proceed to Hire
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────
// MASTER COMPONENT — all logic UNTOUCHED
// ─────────────────────────────────────────────────────────────────
const TeacherManagement = ({ initialAction }) => {
  const [activeTab, setActiveTab]   = useState('applicants');
  const [toast, setToast]           = useState(null);
  const [prefillData, setPrefillData] = useState(null);

  useEffect(() => {
    if (initialAction === 'add') setActiveTab('add');
  }, [initialAction]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const handleAcceptApplicant = (applicant) => {
    setPrefillData({
      firstName: applicant.first_name, lastName: applicant.last_name,
      email: applicant.email, phone: applicant.phone,
      department: applicant.subject || 'English',
      role: 'Teacher', requestId: applicant.id,
    });
    setActiveTab('add');
    showToast(`Proceeding to hire ${applicant.first_name}. Form auto-filled.`);
  };

  return (
    <div style={{ width: '100%', fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      {/* ── Tab bar — matches site underline style ── */}
      <div style={{ display: 'flex', borderBottom: '1px solid #f1f5f9', marginBottom: 28 }}>
        {[
          { key: 'applicants', label: 'Teacher Applicants', icon: Icons.Users() },
          { key: 'add',        label: 'Add Teacher',        icon: Icons.Briefcase() },
        ].map(tab => (
          <button key={tab.key}
            onClick={() => { setActiveTab(tab.key); if (tab.key === 'add') setPrefillData(null); }}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '12px 20px', fontSize: 13, fontWeight: 700,
              color: activeTab === tab.key ? '#4318FF' : '#94a3b8',
              background: 'none', border: 'none', cursor: 'pointer',
              borderBottom: activeTab === tab.key ? '2px solid #4318FF' : '2px solid transparent',
              marginBottom: -1, transition: 'all .2s', whiteSpace: 'nowrap',
            }}
          >
            <span style={{ color: activeTab === tab.key ? '#4318FF' : '#94a3b8' }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'applicants' && (
        <TeacherApplicantTab showToast={showToast} onAcceptApplicant={handleAcceptApplicant} />
      )}
      {activeTab === 'add' && (
        <TeacherRegistrationTab showToast={showToast} prefillData={prefillData} clearPrefill={() => setPrefillData(null)} />
      )}

      <style>{`
        * { box-sizing: border-box; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default TeacherManagement;
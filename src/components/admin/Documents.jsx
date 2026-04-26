import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
  navy:        '#0f172a',
  primary:     '#4318FF',
  primaryLight:'#eef2ff',
  primaryMid:  '#818cf8',
  white:       '#ffffff',
  pageBg:      '#f8fafc',
  border:      '#f1f5f9',
  borderMid:   '#e2e8f0',
  textDark:    '#1e293b',
  textMid:     '#64748b',
  textMuted:   '#94a3b8',
  success:     '#059669',
  successBg:   '#ecfdf5',
  blue:        '#2563eb',
  blueBg:      '#eff6ff',
};

// ─── Icon System ──────────────────────────────────────────────────────────────
const Ic = {
  Search:   () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  File:     () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  Download: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Print:    () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>,
  Generate: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>,
  User:     () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Calendar: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  BookOpen: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  Eye:      () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  CheckCircle: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  Close:    () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Globe:    () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
};

// ─── Shared input styles & handlers ──────────────────────────────────────────
const inputBase = {
  width: '100%', background: C.pageBg,
  border: `1.5px solid ${C.borderMid}`,
  borderRadius: 10, padding: '10px 14px',
  fontSize: 13, fontFamily: "'Inter','Segoe UI',sans-serif",
  color: C.textDark, outline: 'none', boxSizing: 'border-box',
  transition: 'border-color 0.2s, box-shadow 0.2s, background 0.2s',
};
const handleFocus = e => { e.target.style.borderColor = C.primary; e.target.style.boxShadow = '0 0 0 3px rgba(67,24,255,0.09)'; e.target.style.background = '#fff'; };
const handleBlur  = e => { e.target.style.borderColor = C.borderMid; e.target.style.boxShadow = 'none'; e.target.style.background = C.pageBg; };

// ─── Toast ────────────────────────────────────────────────────────────────────
const Toast = ({ message, onClose }) => (
  <div style={{
    position: 'fixed', bottom: 28, right: 28, zIndex: 300,
    background: C.navy, color: '#fff',
    padding: '14px 18px', borderRadius: 14,
    boxShadow: '0 8px 32px rgba(0,0,0,0.22)',
    border: '1px solid rgba(255,255,255,0.08)',
    display: 'flex', alignItems: 'center', gap: 12,
    minWidth: 300, maxWidth: 400,
    fontFamily: "'Inter','Segoe UI',sans-serif",
    animation: 'slideUp 0.3s cubic-bezier(.4,0,.2,1) both',
  }}>
    <span style={{ width: 32, height: 32, borderRadius: 8, background: C.success, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#fff' }}>
      <Ic.CheckCircle />
    </span>
    <div style={{ flex: 1 }}>
      <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Document Center</p>
      <p style={{ margin: '2px 0 0', fontSize: 12.5, fontWeight: 600 }}>{message}</p>
    </div>
    <button onClick={onClose}
      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', display: 'flex', padding: 3, transition: 'color 0.15s' }}
      onMouseEnter={e => e.currentTarget.style.color = '#fff'}
      onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
    ><Ic.Close /></button>
  </div>
);

// ─── Field label ──────────────────────────────────────────────────────────────
const FieldLabel = ({ icon: Icon, children }) => (
  <label style={{
    display: 'flex', alignItems: 'center', gap: 6,
    fontSize: 11, fontWeight: 700, color: C.textMuted,
    textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8,
  }}>
    {Icon && <span style={{ color: C.primary, display: 'flex' }}><Icon /></span>}
    {children}
  </label>
);

// ─── Document Previews ────────────────────────────────────────────────────────
const PreviewCompletion = ({ formData }) => (
  <div style={{ background: '#f0ebe1', padding: 32, outline: '10px solid #e6decb', boxShadow: '0 4px 24px rgba(0,0,0,0.10)', maxWidth: 580, width: '100%', margin: '0 auto', fontFamily: 'Georgia, serif' }}>
    <div style={{ border: '1px solid #c2b28f', padding: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
      <p style={{ color: '#888', fontStyle: 'italic', margin: '0 0 3px', fontSize: 11 }}>Polyglot Academy</p>
      <p style={{ fontSize: 9, letterSpacing: '0.2em', color: '#aaa', textTransform: 'uppercase', margin: '0 0 24px' }}>Language Excellence Platform</p>
      <h1 style={{ fontSize: 34, fontWeight: 400, color: '#111', letterSpacing: '0.1em', margin: '0 0 6px' }}>CERTIFICATE</h1>
      <h2 style={{ fontSize: 20, fontWeight: 400, color: '#111', margin: '0 0 24px' }}>OF COMPLETION</h2>
      <p style={{ fontSize: 12, color: '#666', margin: '0 0 14px', lineHeight: 1.7 }}>This certificate is proudly presented to</p>
      <h3 style={{ fontSize: 30, fontStyle: 'italic', color: '#111', borderBottom: '1px solid #bbb', paddingBottom: 10, marginBottom: 14, width: '76%', fontWeight: 400 }}>
        {formData.fullName || 'Student Full Name'}
      </h3>
      <p style={{ fontSize: 12, color: '#666', margin: '0 0 32px', lineHeight: 1.7 }}>
        Upon the successful completion of<br />
        <strong style={{ color: '#333' }}>{formData.courseLevel || 'Language Course — Level'}</strong>
      </p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%', padding: '0 8px' }}>
        <div style={{ textAlign: 'center', width: '33%' }}>
          <p style={{ fontSize: 12, fontWeight: 700, borderBottom: '1px solid #bbb', paddingBottom: 4, marginBottom: 4 }}>{formData.date || 'Date Awarded'}</p>
          <p style={{ fontSize: 10, fontStyle: 'italic', color: '#999' }}>Date</p>
        </div>
        <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#c9b585', border: '3px solid #fff', boxShadow: '0 2px 8px rgba(0,0,0,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 800, color: '#fff', letterSpacing: '0.05em' }}>SEAL</div>
        <div style={{ textAlign: 'center', width: '33%' }}>
          <div style={{ width: '100%', borderBottom: '1px solid #bbb', marginBottom: 4 }} />
          <p style={{ fontSize: 10, fontStyle: 'italic', color: '#999' }}>Director / Instructor</p>
        </div>
      </div>
    </div>
  </div>
);

const PreviewReceipt = ({ formData }) => (
  <div style={{ background: '#fff', padding: 40, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', maxWidth: 580, width: '100%', margin: '0 auto', border: `1px solid ${C.borderMid}`, fontFamily: "'Inter','Segoe UI',sans-serif" }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: `5px solid ${C.textDark}`, paddingBottom: 16, marginBottom: 28 }}>
      <div>
        <div style={{ width: 38, height: 38, background: C.primary, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
          <Ic.Globe />
        </div>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: C.textDark }}>POLYGLOT ACADEMY</p>
        <p style={{ margin: '2px 0 0', fontSize: 10, color: C.textMuted }}>Languages School</p>
      </div>
      <div style={{ textAlign: 'right', fontSize: 11, color: C.textMid, lineHeight: 1.8 }}>
        <p style={{ margin: 0, fontWeight: 700, color: C.textDark, textTransform: 'uppercase' }}>Payment Receipt</p>
        <p style={{ margin: '4px 0 0' }}>contact@polyglot.academy</p>
        <p style={{ margin: 0 }}>www.polyglot.academy</p>
      </div>
    </div>
    <h2 style={{ textAlign: 'center', fontSize: 16, fontWeight: 800, color: C.textDark, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 20 }}>School Receipt</h2>
    <div style={{ fontSize: 12.5, marginBottom: 18, lineHeight: 1.8 }}>
      <p style={{ margin: '2px 0' }}><strong>Date:</strong> {formData.date || '[Date]'}</p>
      <p style={{ margin: '2px 0' }}><strong>Receipt No.:</strong> #PA-2025-001</p>
      <p style={{ margin: '10px 0 2px' }}><strong>Received From:</strong></p>
      <p style={{ margin: 0, fontWeight: 700, color: C.textDark, fontSize: 14 }}>{formData.fullName || '[Student Name]'}</p>
    </div>
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5, marginBottom: 20 }}>
      <thead>
        <tr style={{ background: C.pageBg }}>
          <th style={{ textAlign: 'left', padding: '8px 12px', color: C.textMuted, fontWeight: 700, fontSize: 11, borderBottom: `1px solid ${C.borderMid}` }}>Description</th>
          <th style={{ textAlign: 'right', padding: '8px 12px', color: C.textMuted, fontWeight: 700, fontSize: 11, borderBottom: `1px solid ${C.borderMid}` }}>Amount</th>
        </tr>
      </thead>
      <tbody>
        {[['Tuition Fee', '12,000 DZD'], ['Registration Fee', '1,500 DZD'], ['Materials Fee', '500 DZD']].map(([d, a]) => (
          <tr key={d} style={{ borderBottom: `1px solid ${C.border}` }}>
            <td style={{ padding: '10px 12px' }}>{d}</td>
            <td style={{ padding: '10px 12px', textAlign: 'right' }}>{a}</td>
          </tr>
        ))}
        <tr style={{ borderTop: `2px solid ${C.textDark}` }}>
          <td style={{ padding: '12px 12px', fontWeight: 800, color: C.textDark }}>Total</td>
          <td style={{ padding: '12px 12px', textAlign: 'right', fontWeight: 800, color: C.textDark }}>14,000 DZD</td>
        </tr>
      </tbody>
    </table>
    <p style={{ fontSize: 10.5, color: C.textMuted, borderTop: `1px solid ${C.border}`, paddingTop: 14, margin: 0, lineHeight: 1.6 }}>
      Thank you for your payment. Please retain this receipt for your records. For inquiries, contact us at contact@polyglot.academy.
    </p>
  </div>
);

const PreviewEnrollment = ({ formData }) => (
  <div style={{ background: '#fff', padding: 40, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', maxWidth: 580, width: '100%', margin: '0 auto', border: `1px solid ${C.borderMid}`, textAlign: 'center', fontFamily: 'Georgia, serif' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, paddingBottom: 20, borderBottom: `2px solid ${C.textDark}` }}>
      <div style={{ width: 52, height: 52, background: C.primaryLight, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Ic.Globe />
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ margin: 0, fontSize: 9, fontWeight: 700, color: C.textMid, textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: "'Inter',sans-serif" }}>Polyglot Academy</p>
        <p style={{ margin: '4px 0 0', fontSize: 11, fontWeight: 700, color: C.textDark, textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: "'Inter',sans-serif" }}>Languages School</p>
        <p style={{ margin: '2px 0 0', fontSize: 9, color: C.textMuted, fontFamily: "'Inter',sans-serif" }}>Official Academic Document</p>
      </div>
      <div style={{ fontSize: 11, fontWeight: 800, color: C.primary, fontFamily: "'Inter',sans-serif" }}>PA</div>
    </div>
    <h2 style={{ margin: '0 0 28px', fontSize: 17, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.textDark }}>Certificate of Enrollment</h2>
    <p style={{ fontSize: 13, lineHeight: 1.85, color: '#374151', textAlign: 'justify', marginBottom: 12 }}>
      This is to certify that <strong style={{ color: C.textDark }}>{formData.fullName ? formData.fullName.toUpperCase() : '[STUDENT FULL NAME]'}</strong> is officially enrolled as a student at <strong>Polyglot Academy</strong> and is duly registered for the current academic term.
    </p>
    <p style={{ fontSize: 13, lineHeight: 1.85, color: '#374151', textAlign: 'justify', marginBottom: 44 }}>
      Issued on: <strong>{formData.date || '[Date]'}</strong>
    </p>
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 130, borderBottom: `1px solid ${C.borderMid}`, marginBottom: 6 }} />
        <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: C.textDark, fontFamily: "'Inter',sans-serif" }}>Academy Director</p>
        <p style={{ margin: '2px 0 0', fontSize: 10, color: C.textMuted, fontFamily: "'Inter',sans-serif" }}>Authorized Signatory</p>
      </div>
    </div>
  </div>
);

const PreviewGeneric = ({ formData, doc }) => (
  <div style={{ background: '#fff', padding: 40, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', maxWidth: 580, width: '100%', margin: '0 auto', border: `1px solid ${C.borderMid}`, fontFamily: "'Inter','Segoe UI',sans-serif" }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 18, marginBottom: 24, borderBottom: `2px solid ${C.textDark}` }}>
      <div>
        <p style={{ margin: 0, fontSize: 12, fontWeight: 800, color: C.textDark }}>POLYGLOT ACADEMY</p>
        <p style={{ margin: '2px 0 0', fontSize: 10, color: C.textMuted }}>Official Document</p>
      </div>
      <div style={{ width: 36, height: 36, background: C.primary, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Ic.Globe />
      </div>
    </div>
    <h2 style={{ textAlign: 'center', fontSize: 18, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.textDark, margin: '0 0 28px' }}>{doc?.title}</h2>
    <div style={{ background: C.pageBg, padding: '16px 20px', borderLeft: `4px solid ${C.primary}`, borderRadius: '0 8px 8px 0', marginBottom: 24, fontSize: 13, lineHeight: 1.8 }}>
      <p style={{ margin: '0 0 6px' }}><strong>Name:</strong> {formData.fullName || '[Name]'}</p>
      {formData.courseLevel && <p style={{ margin: '0 0 6px' }}><strong>Course / Level:</strong> {formData.courseLevel}</p>}
      <p style={{ margin: 0 }}><strong>Date:</strong> {formData.date || '[Date]'}</p>
    </div>
    <p style={{ fontSize: 13, lineHeight: 1.8, color: '#374151', textAlign: 'justify', marginBottom: 40 }}>
      This official document has been issued by Polyglot Academy and certifies the above information as accurate and duly recorded in the school's official records.
    </p>
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 130, borderBottom: `1px solid ${C.borderMid}`, marginBottom: 6 }} />
        <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: C.textDark }}>Authorized Signatory</p>
      </div>
    </div>
  </div>
);

// ─── Document List ────────────────────────────────────────────────────────────
const documentsList = [
  { id: 'enrollment', category: 'Academic Documents',       title: 'Enrollment Certificate',       desc: 'Official certificate confirming student enrollment.',          target: 'Student' },
  { id: 'completion', category: 'Academic Documents',       title: 'Level Completion Certificate', desc: 'Certificate for a successfully completed language level.',      target: 'Student' },
  { id: 'transcript', category: 'Academic Documents',       title: 'Grade Report / Transcript',    desc: 'Official academic transcript and grades record.',              target: 'Student' },
  { id: 'placement',  category: 'Academic Documents',       title: 'Placement Test Result',        desc: 'Student placement test results and assigned level.',           target: 'Student' },
  { id: 'receipt',    category: 'Administrative Documents', title: 'Payment Receipt',              desc: 'Official payment receipt for tuition and fees.',               target: 'Admin'   },
  { id: 'warning',    category: 'Administrative Documents', title: 'Absence Warning Letter',       desc: 'Formal warning letter for excessive absences.',               target: 'Admin'   },
  { id: 'schedule',   category: 'Administrative Documents', title: 'Personal Schedule',            desc: 'Personalized class schedule issued to a student.',            target: 'Student' },
  { id: 'work_cert',  category: 'Faculty Documents',        title: 'Work Certificate',             desc: 'Official employment verification for faculty members.',       target: 'Faculty' },
  { id: 'payslip',    category: 'Faculty Documents',        title: 'Payslip',                      desc: 'Monthly salary statement and detailed breakdown.',            target: 'Faculty' },
];

const categoryBadge = {
  'Academic Documents':       { bg: C.primaryLight, color: C.primary   },
  'Administrative Documents': { bg: '#ecfdf5',      color: '#059669'   },
  'Faculty Documents':        { bg: '#fff7ed',      color: '#f97316'   },
};

// ─── Main Component ───────────────────────────────────────────────────────────
const Documents = () => {
  const [activeTab,      setActiveTab]      = useState('All');
  const [selectedDocId,  setSelectedDocId]  = useState('enrollment');
  const [isGenerated,    setIsGenerated]    = useState(false);
  const [docSearchQuery, setDocSearchQuery] = useState('');
  const [toast,          setToast]          = useState({ show: false, message: '' });
  const [currentUser,    setCurrentUser]    = useState(null);
  const [formData,       setFormData]       = useState({ searchQuery: '', fullName: '', courseLevel: '', date: '' });
  
  // 💡 States للبحث المباشر في قاعدة البيانات
  const [suggestionsList, setSuggestionsList] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const fetchUserAndSuggestions = async () => {
      // 1. جلب معلومات المستخدم الحالي
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.email) {
        const { data: staffData } = await supabase.from('staff').select('*').eq('email', user.email).single();
        setCurrentUser(staffData || user);
      }

      // 2. 💡 جلب جميع الأسماء (طلبة وأساتذة) لاستعمالها في البحث
      let allSuggestions = [];
      
      const { data: students } = await supabase.from('students').select('first_name, last_name');
      if (students) {
        students.forEach(s => allSuggestions.push({ name: `${s.first_name} ${s.last_name}`, type: 'Student' }));
      }

      const { data: staff } = await supabase.from('staff').select('first_name, last_name, role');
      if (staff) {
        staff.forEach(s => allSuggestions.push({ name: `${s.first_name} ${s.last_name}`, type: s.role }));
      }
      
      setSuggestionsList(allSuggestions);
    };
    fetchUserAndSuggestions();
  }, []);

  const showNotification = (msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: '' }), 4500);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // 💡 لوجيك البحث المباشر
    if (name === 'fullName') {
      if (value.length > 0) {
        const filtered = suggestionsList.filter(item => item.name.toLowerCase().includes(value.toLowerCase()));
        setFilteredSuggestions(filtered);
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    }
  };

  // 💡 اختيار اسم من قائمة الاقتراحات
  const handleSelectSuggestion = (name) => {
    setFormData(prev => ({ ...prev, fullName: name }));
    setShowSuggestions(false);
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!formData.fullName) {
      showNotification('Please enter a name to generate the document.');
      return;
    }
    setIsGenerated(true);
    try {
      const logData = {
        document_type: selectedDocDetails.title,
        target_person: formData.fullName,
        generated_by: currentUser ? `${currentUser.first_name || ''} ${currentUser.last_name || ''}`.trim() : 'System Admin',
        generated_at: new Date().toISOString(),
      };
      const { error } = await supabase.from('document_logs').insert([logData]);
      if (error) console.warn("Log warning: Make sure 'document_logs' table exists.", error.message);
      showNotification(`Document generated successfully for ${formData.fullName}.`);
    } catch (err) {
      console.error('Failed to log document generation:', err);
    }
  };

  const handlePrint = () => window.print();

  const filteredDocs = documentsList.filter(doc => {
    const matchesTab    = activeTab === 'All' || doc.target === activeTab;
    const matchesSearch = doc.title.toLowerCase().includes(docSearchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const groupedDocs = filteredDocs.reduce((acc, doc) => {
    if (!acc[doc.category]) acc[doc.category] = [];
    acc[doc.category].push(doc);
    return acc;
  }, {});

  const selectedDocDetails = documentsList.find(d => d.id === selectedDocId);

  const handleSelectDoc = (id) => {
    setSelectedDocId(id);
    setIsGenerated(false);
    setFormData({ searchQuery: '', fullName: '', courseLevel: '', date: '' });
    setShowSuggestions(false); // إخفاء الاقتراحات عند تغيير الوثيقة
  };

  const renderPreview = () => {
    if (selectedDocId === 'completion') return <PreviewCompletion formData={formData} />;
    if (selectedDocId === 'receipt')    return <PreviewReceipt    formData={formData} />;
    if (selectedDocId === 'enrollment') return <PreviewEnrollment formData={formData} />;
    return <PreviewGeneric formData={formData} doc={selectedDocDetails} />;
  };

  const tabs = ['All', 'Student', 'Faculty', 'Admin'];

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @keyframes slideUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        * { box-sizing: border-box; }
        input::placeholder { color: #94a3b8; font-size: 13px; }
        .doc-sb::-webkit-scrollbar { width: 4px; }
        .doc-sb::-webkit-scrollbar-track { background: transparent; }
        .doc-sb::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .doc-sb::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
        @media print {
          body > *:not(#doc-print-area) { display: none !important; }
          #doc-print-area { display: block !important; position: fixed; top:0; left:0; width:100%; }
        }
      `}</style>

      {toast.show && <Toast message={toast.message} onClose={() => setToast({ show: false, message: '' })} />}

      {/* ── Page wrapper (fits inside main content area) ── */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden',
        padding: 28, background: C.pageBg,
        fontFamily: "'Inter','Segoe UI',sans-serif",
      }}>

        {/* Page header */}
        <div style={{ marginBottom: 20, flexShrink: 0 }}>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: C.textDark }}>Document Center</h2>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: C.textMuted }}>
            Generate, preview and export official school documents.
          </p>
        </div>

        {/* ── 3-panel card ── */}
        <div style={{
          flex: 1, minHeight: 0, display: 'flex',
          background: C.white, borderRadius: 16,
          border: `1px solid ${C.borderMid}`,
          boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
          overflow: 'hidden',
        }}>

          {/* ═══ LEFT SIDEBAR ═══════════════════════════════════════════════ */}
          <aside style={{
            width: 264, flexShrink: 0,
            background: C.pageBg,
            borderRight: `1px solid ${C.border}`,
            display: 'flex', flexDirection: 'column',
            height: '100%',
          }}>
            {/* Search + Tabs */}
            <div style={{ padding: '16px 14px 12px', borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
              {/* Search */}
              <div style={{ position: 'relative', marginBottom: 10 }}>
                <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: C.textMuted, pointerEvents: 'none', display: 'flex' }}>
                  <Ic.Search />
                </span>
                <input
                  type="text"
                  placeholder="Search documents…"
                  value={docSearchQuery}
                  onChange={e => setDocSearchQuery(e.target.value)}
                  style={{ ...inputBase, paddingLeft: 32, height: 36, fontSize: 12.5, borderRadius: 9 }}
                  onFocus={handleFocus} onBlur={handleBlur}
                />
              </div>

              {/* Tab strip */}
              <div style={{ display: 'flex', gap: 3, background: C.border, borderRadius: 8, padding: 3 }}>
                {tabs.map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    style={{
                      flex: 1, padding: '5px 0', borderRadius: 6, border: 'none',
                      fontSize: 11, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s',
                      background: activeTab === tab ? C.white : 'transparent',
                      color: activeTab === tab ? C.primary : C.textMuted,
                      boxShadow: activeTab === tab ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                    }}
                  >{tab}</button>
                ))}
              </div>
            </div>

            {/* Document list */}
            <div className="doc-sb" style={{ flex: 1, overflowY: 'auto', padding: '10px 10px' }}>
              {Object.keys(groupedDocs).length === 0 ? (
                <div style={{ textAlign: 'center', padding: '36px 16px', color: C.textMuted }}>
                  <div style={{ marginBottom: 8, opacity: 0.5, display: 'flex', justifyContent: 'center' }}><Ic.File /></div>
                  <p style={{ margin: 0, fontSize: 12, fontWeight: 600 }}>No documents found</p>
                </div>
              ) : (
                Object.keys(groupedDocs).map(category => {
                  const badge = categoryBadge[category] || { bg: C.pageBg, color: C.textMuted };
                  return (
                    <div key={category} style={{ marginBottom: 18 }}>
                      {/* Category badge */}
                      <div style={{ padding: '0 4px', marginBottom: 6 }}>
                        <span style={{
                          display: 'inline-block',
                          fontSize: 10, fontWeight: 700,
                          padding: '2px 9px', borderRadius: 20,
                          background: badge.bg, color: badge.color,
                          textTransform: 'uppercase', letterSpacing: '0.05em',
                        }}>{category}</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {groupedDocs[category].map(doc => {
                          const isActive = selectedDocId === doc.id;
                          return (
                            <button key={doc.id} onClick={() => handleSelectDoc(doc.id)}
                              style={{
                                width: '100%', textAlign: 'left', padding: '9px 11px',
                                borderRadius: 9, border: 'none', cursor: 'pointer',
                                display: 'flex', alignItems: 'flex-start', gap: 9,
                                background: isActive ? C.primary : 'transparent',
                                transition: 'all 0.15s',
                              }}
                              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = C.primaryLight; }}
                              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                            >
                              <span style={{ color: isActive ? 'rgba(255,255,255,0.75)' : C.primary, marginTop: 1, flexShrink: 0 }}>
                                <Ic.File />
                              </span>
                              <div style={{ minWidth: 0 }}>
                                <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: isActive ? '#fff' : C.textDark, lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {doc.title}
                                </p>
                                <p style={{ margin: '3px 0 0', fontSize: 10.5, color: isActive ? 'rgba(255,255,255,0.62)' : C.textMuted, lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                  {doc.desc}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </aside>

          {/* ═══ CENTER PANEL — FORM ════════════════════════════════════════ */}
          <div style={{
            width: 304, flexShrink: 0,
            borderRight: `1px solid ${C.border}`,
            display: 'flex', flexDirection: 'column',
            height: '100%', background: C.white,
          }}>
            {/* Panel header */}
            <div style={{ padding: '18px 20px 14px', borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: C.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.primary, flexShrink: 0 }}>
                  <Ic.Generate />
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: 13.5, fontWeight: 800, color: C.textDark, lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {selectedDocDetails?.title}
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: 10.5, color: C.textMuted, lineHeight: 1.3 }}>{selectedDocDetails?.desc}</p>
                </div>
              </div>
            </div>

            {/* Form body */}
            <div className="doc-sb" style={{ flex: 1, overflowY: 'auto', padding: '22px 20px' }}>
              <form onSubmit={handleGenerate} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 20, height: '100%' }}>

                {/* 💡 Full name + Smart Search Dropdown */}
                <div>
                  <FieldLabel icon={Ic.User}>Person Name</FieldLabel>
                  <div style={{ position: 'relative' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <div style={{ position: 'relative', flex: 1 }}>
                        <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: C.textMuted, pointerEvents: 'none', display: 'flex' }}>
                          <Ic.Search />
                        </span>
                        <input
                          type="text" name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          placeholder="Search registered name…"
                          style={{ ...inputBase, paddingLeft: 32, height: 40, fontSize: 13 }}
                          onFocus={handleFocus} 
                          onBlur={(e) => {
                            handleBlur(e);
                            // تأخير صغير باش نقدر نكليكي على الاقتراح قبل ما يختفي
                            setTimeout(() => setShowSuggestions(false), 200); 
                          }}
                        />
                      </div>
                    </div>
                    
                    {/* 💡 الاقتراحات اللي تخرج تحت الخانة */}
                    {showSuggestions && filteredSuggestions.length > 0 && (
                      <div style={{ 
                        position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4, 
                        background: '#fff', border: `1px solid ${C.borderMid}`, borderRadius: 10, 
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 50, maxHeight: 200, overflowY: 'auto' 
                      }}>
                        {filteredSuggestions.map((s, idx) => (
                          <div 
                            key={idx} 
                            onClick={() => handleSelectSuggestion(s.name)}
                            style={{ 
                              padding: '10px 14px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                              borderBottom: idx !== filteredSuggestions.length - 1 ? `1px solid ${C.border}` : 'none',
                              transition: 'background 0.15s'
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = C.pageBg}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                          >
                            <span style={{ fontSize: 13, fontWeight: 600, color: C.textDark }}>{s.name}</span>
                            <span style={{ fontSize: 10, fontWeight: 700, color: s.type === 'Student' ? C.primary : C.success, background: s.type === 'Student' ? C.primaryLight : C.successBg, padding: '2px 8px', borderRadius: 12 }}>
                              {s.type}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Course & Level */}
                <div>
                  <FieldLabel icon={Ic.BookOpen}>Course &amp; Level / Role</FieldLabel>
                  <input
                    type="text" name="courseLevel"
                    value={formData.courseLevel}
                    onChange={handleInputChange}
                    placeholder="e.g. English — Level B2"
                    style={inputBase}
                    onFocus={handleFocus} onBlur={handleBlur}
                  />
                </div>

                {/* Date */}
                <div>
                  <FieldLabel icon={Ic.Calendar}>Issue Date</FieldLabel>
                  <input
                    type="text" name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    placeholder="e.g. April 26, 2026"
                    style={inputBase}
                    onFocus={handleFocus} onBlur={handleBlur}
                  />
                </div>

                {/* Generate CTA */}
                <div style={{ marginTop: 'auto', paddingTop: 16 }}>
                  <button type="submit"
                    style={{
                      width: '100%', height: 44, border: 'none', borderRadius: 10,
                      background: C.primary, color: '#fff',
                      fontSize: 13.5, fontWeight: 700, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      boxShadow: '0 4px 14px rgba(67,24,255,0.28)',
                      transition: 'all 0.15s',
                      fontFamily: "'Inter','Segoe UI',sans-serif",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#3510d4'; e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(67,24,255,0.38)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = C.primary; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(67,24,255,0.28)'; }}
                    onMouseDown={e => e.currentTarget.style.transform = 'scale(0.985)'}
                    onMouseUp={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                  >
                    <Ic.Generate /> Generate Document
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* ═══ RIGHT — PREVIEW PANEL ══════════════════════════════════════ */}
          <div style={{
            flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column',
            height: '100%', background: '#f1f5f9',
          }}>
            {/* Preview toolbar */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '12px 20px', background: C.white,
              borderBottom: `1px solid ${C.border}`, flexShrink: 0,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: C.textMuted, display: 'flex' }}><Ic.Eye /></span>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: C.textMid }}>Document Preview</span>
                {isGenerated && (
                  <span style={{
                    fontSize: 10, fontWeight: 700,
                    background: C.successBg, color: C.success,
                    padding: '2px 9px', borderRadius: 20,
                  }}>Ready</span>
                )}
              </div>

              {/* Export / Print */}
              <div style={{ display: 'flex', gap: 8 }}>
                {[
                  { icon: Ic.Download, label: 'Export PDF' },
                  { icon: Ic.Print,    label: 'Print'      },
                ].map(({ icon: Icon, label }) => (
                  <button key={label} onClick={handlePrint} disabled={!isGenerated}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '7px 14px', borderRadius: 9,
                      border: `1px solid ${isGenerated ? C.borderMid : C.border}`,
                      background: isGenerated ? C.white : C.pageBg,
                      color: isGenerated ? C.textDark : C.textMuted,
                      fontSize: 12, fontWeight: 700,
                      cursor: isGenerated ? 'pointer' : 'not-allowed',
                      transition: 'all 0.15s',
                      fontFamily: "'Inter','Segoe UI',sans-serif",
                    }}
                    onMouseEnter={e => { if (isGenerated) { e.currentTarget.style.borderColor = '#c7d2fe'; e.currentTarget.style.color = C.primary; } }}
                    onMouseLeave={e => { if (isGenerated) { e.currentTarget.style.borderColor = C.borderMid; e.currentTarget.style.color = C.textDark; } }}
                  >
                    <span style={{ color: isGenerated ? C.primary : C.textMuted, display: 'flex' }}><Icon /></span>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview area */}
            <div id="doc-print-area" className="doc-sb"
              style={{ flex: 1, overflowY: 'auto', padding: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              {!isGenerated ? (
                <div style={{
                  flex: 1, display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  gap: 16, color: C.textMuted, width: '100%',
                }}>
                  <div style={{
                    width: 64, height: 64, borderRadius: 16,
                    background: C.white, border: `1.5px solid ${C.borderMid}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: C.textMuted, boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
                    </svg>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: C.textDark }}>No Document Generated</p>
                    <p style={{ margin: '6px 0 0', fontSize: 12.5, color: C.textMuted, maxWidth: 260, lineHeight: 1.6 }}>
                      Select a template, fill in the details, then click{' '}
                      <strong style={{ color: C.primary }}>Generate Document</strong>.
                    </p>
                  </div>
                </div>
              ) : (
                <div style={{ width: '100%', animation: 'fadeIn 0.3s ease both' }}>
                  {renderPreview()}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Documents;
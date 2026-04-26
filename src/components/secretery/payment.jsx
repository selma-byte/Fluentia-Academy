import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icons = {
  Dollar:    () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  Users:     () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Alert:     () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  Calendar:  () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  Bell:      () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  Check:     () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  X:         () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Search:    () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Download:  () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  ChevronDown: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
  User:      () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  CreditCard:() => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  Cash:      () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="6" width="22" height="12" rx="2"/><circle cx="12" cy="12" r="3"/></svg>,
  Transfer:  () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 16V4m0 0L3 8m4-4l4 4"/><path d="M17 8v12m0 0l4-4m-4 4l-4-4"/></svg>,
  Receipt:   () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  Plus:      () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Checkmark: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
};

// ─── Toast notification ───────────────────────────────────────────────────────
const Toast = ({ message, onClose }) => (
  <div style={{ position: 'fixed', bottom: 32, right: 32, zIndex: 1000 }}>
    <div style={{
      background: '#0f172a', color: '#fff', padding: '16px 24px',
      borderRadius: 16, boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
      display: 'flex', alignItems: 'center', gap: 14,
      border: '1px solid rgba(255,255,255,0.08)', minWidth: 340,
    }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: '#4318FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icons.Check />
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontSize: 12, fontWeight: 800, color: '#fff' }}>Financial Update</p>
        <p style={{ margin: '3px 0 0', fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>{message}</p>
      </div>
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}>
        <Icons.X />
      </button>
    </div>
  </div>
);

// ─── Status badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    Paid:     { bg: '#ecfdf5', text: '#059669', dot: '#10b981' },
    Overdue:  { bg: '#fef2f2', text: '#dc2626', dot: '#ef4444' },
    'Due Soon': { bg: '#fff7ed', text: '#c2410c', dot: '#f97316' },
    Pending:  { bg: '#fff7ed', text: '#c2410c', dot: '#f97316' },
    Active:   { bg: '#eff6ff', text: '#2563eb', dot: '#3b82f6' },
  };
  const c = map[status] || map.Active;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 20, background: c.bg, color: c.text }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.dot }} />
      {status}
    </span>
  );
};

// ─── Stat card ────────────────────────────────────────────────────────────────
const StatCard = ({ title, value, icon: Icon, iconColor, iconBg, accent }) => (
  <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div style={{ width: 38, height: 38, borderRadius: 10, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: iconColor }}>
        <Icon />
      </div>
    </div>
    <div>
      <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{title}</p>
      <p style={{ margin: '4px 0 0', fontSize: 26, fontWeight: 800, color: accent || '#1e293b', lineHeight: 1 }}>{value}</p>
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const Payment = () => {
  const [currentView,          setCurrentView]          = useState('student');
  const [showAddPaymentModal,  setShowAddPaymentModal]  = useState(false);
  const [showReceiptModal,     setShowReceiptModal]     = useState(false);
  const [toast,                setToast]                = useState({ show: false, message: '' });
  const [loading,              setLoading]              = useState(true);

  // ── Data ─────────────────────────────────────────────────────────────────
  const [members,        setMembers]        = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [staffList,      setStaffList]      = useState([]);
  const [staffHistory,   setStaffHistory]   = useState([]);

  // ── Form ─────────────────────────────────────────────────────────────────
  const [selectedId, setSelectedId] = useState('');
  const [payAmount,  setPayAmount]  = useState('3000');
  const [payMethod,  setPayMethod]  = useState('Cash');
  const [payNotes,   setPayNotes]   = useState('');
  const [receiptData,setReceiptData]= useState(null);

  // ── Filters ───────────────────────────────────────────────────────────────
  const [searchTerm,    setSearchTerm]    = useState('');
  const [statusFilter,  setStatusFilter]  = useState('All');
  const [langFilter,    setLangFilter]    = useState('All');
  const [staffSearch,   setStaffSearch]   = useState('');
  const [roleFilter,    setRoleFilter]    = useState('All');
  const [monthFilter,   setMonthFilter]   = useState('April 2026');

  const monthsList = ['January','February','March','April','May','June','July','August','September','October','November','December'].map(m => `${m} 2026`);

  const showNotification = (msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: '' }), 4500);
  };

  // ── Fetch ─────────────────────────────────────────────────────────────────
  // All original Supabase logic — UNTOUCHED
  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: studentsData } = await supabase.from('students').select('*').neq('status', 'Archived');
      const { data: paymentsData } = await supabase
        .from('payments').select('*, students(first_name, last_name)').order('payment_date', { ascending: false });

      const sData = studentsData || [];
      const pData = paymentsData || [];

      const studentPayments = pData.filter(p => p.student_id != null || (p.notes && !p.notes.includes('Payroll')));
      const staffPayments   = pData.filter(p => p.notes && p.notes.includes('Payroll'));

      setMembers(sData.map(s => ({
        id:          s.id,
        name:        `${s.first_name || ''} ${s.last_name || ''}`.trim(),
        language:    s.language || 'English',
        group:       s.level || s.group_name || 'Standard',
        status:      s.status === 'Paid' ? 'Paid' : s.status === 'Overdue' ? 'Overdue' : 'Due Soon',
        balance:     s.status === 'Paid' ? 0 : 3000,
        dueDate:     'End of Month',
        overdueText: s.status === 'Overdue' ? 'Needs attention' : '',
      })));

      setPaymentHistory(studentPayments.map(p => ({
        id:         p.id,
        date:       new Date(p.payment_date || p.created_at).toLocaleDateString('en-GB'),
        rawDate:    new Date(p.payment_date || p.created_at),
        member:     p.students ? `${p.students.first_name} ${p.students.last_name}` : p.member_name,
        student_id: p.student_id,
        amount:     `${p.amount} DZD`,
        status:     p.status,
        method:     p.payment_method || 'Cash',
      })));

      const { data: staffData } = await supabase.from('staff').select('*');
      if (staffData) {
        setStaffList(staffData.map(s => ({
          id:     s.id,
          name:   `${s.first_name} ${s.last_name}`,
          role:   s.role || 'Staff',
          salary: s.salary || 35000,
        })));
      }

      setStaffHistory(staffPayments.map(p => ({
        id:     p.id,
        date:   new Date(p.payment_date || p.created_at).toLocaleDateString('en-GB'),
        name:   p.member_name,
        month:  p.notes.replace('Payroll for ', ''),
        amount: `${p.amount} DZD`,
        method: p.payment_method || 'Cash',
      })));

    } catch (err) { showNotification('Sync Error: ' + err.message); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  // ── All original payment logic — UNTOUCHED ────────────────────────────────
  const processStudentPayment = async () => {
    try {
      if (!selectedId) return showNotification('Please select a student!');
      const student = members.find(m => m.id.toString() === selectedId.toString());
      if (!student) return;

      const currentMonth = new Date().getMonth();
      const currentYear  = new Date().getFullYear();
      const hasPaid = paymentHistory.some(p =>
        p.student_id === selectedId &&
        p.rawDate.getMonth() === currentMonth &&
        p.rawDate.getFullYear() === currentYear
      );
      if (hasPaid) {
        alert('This student has already paid for the current month!');
        return;
      }

      const { error: payError } = await supabase.from('payments').insert([{
        student_id: selectedId, member_name: student.name,
        amount: parseFloat(payAmount), status: 'Paid',
        payment_method: payMethod, notes: payNotes,
      }]);
      if (payError) throw payError;
      await supabase.from('students').update({ status: 'Paid' }).eq('id', selectedId);

      setReceiptData({ name: student.name, amount: payAmount, method: payMethod, date: new Date().toLocaleString('en-GB'), txn: `TXN-${Math.floor(Math.random() * 90000) + 10000}` });
      setShowAddPaymentModal(false);
      setShowReceiptModal(true);
      fetchData();
    } catch (err) { showNotification('Payment Error: ' + err.message); }
  };

  const processStaffPayment = async (id, amount, method, month) => {
    const staff = staffList.find(s => s.id === id);
    if (!staff) return;
    const hasPaid = staffHistory.some(h => h.name === staff.name && h.month === month);
    if (hasPaid) { alert(`${staff.name} has already received payroll for ${month}!`); return; }
    try {
      const { error } = await supabase.from('payments').insert([{
        member_name: staff.name, amount: parseFloat(amount),
        status: 'Paid', payment_method: method, notes: `Payroll for ${month}`,
      }]);
      if (error) throw error;
      setReceiptData({ name: staff.name, amount, method, date: new Date().toLocaleString('en-GB'), txn: `TXN-${Math.floor(Math.random() * 90000) + 10000}` });
      setShowAddPaymentModal(false);
      setShowReceiptModal(true);
      showNotification(`Salary disbursed to ${staff.name} for ${month}`);
      fetchData();
    } catch (err) { showNotification('Payroll Error: ' + err.message); }
  };

  const notifyStudent = async (name, id) => {
    try {
      await supabase.from('communications').insert([{
        type: 'notification', subject: 'Payment Reminder',
        content: `Dear ${name}, your monthly tuition payment is currently overdue. Please proceed to the administration desk to clear your balance.`,
        recipient_name: name, recipient_id: id, sender_role: 'system',
      }]);
      showNotification(`Reminder sent to: ${name}`);
    } catch (err) { console.error(err); }
  };

  const notifyAllOverdue = async () => {
    const overdue = members.filter(m => m.status === 'Overdue');
    if (!overdue.length) { alert('No overdue students found.'); return; }
    try {
      await supabase.from('communications').insert(
        overdue.map(s => ({
          type: 'emergency', subject: 'URGENT: Overdue Payment',
          content: `Dear ${s.name}, your account is overdue. Failure to clear your balance of ${s.balance} DZD may result in suspension.`,
          recipient_name: s.name, recipient_id: s.id, sender_role: 'system',
        }))
      );
      showNotification(`Automated reminders sent to ${overdue.length} students`);
    } catch (err) { console.error(err); }
  };

  // ── Derived ───────────────────────────────────────────────────────────────
  const totalIncome  = paymentHistory.reduce((sum, p) => sum + parseInt(p.amount.replace(/\D/g, '') || 0), 0);
  const unpaidCount  = members.filter(m => m.status !== 'Paid').length;
  const overdueCount = members.filter(m => m.status === 'Overdue').length;
  const dueSoonCount = members.filter(m => m.status === 'Due Soon').length;

  const filteredMembers = members.filter(m =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (statusFilter === 'All' || m.status === statusFilter) &&
    (langFilter   === 'All' || m.language === langFilter)
  );

  const staffWithStatus = staffList.map(s => ({
    ...s,
    status: staffHistory.some(h => h.name === s.name && h.month === monthFilter) ? 'Paid' : 'Pending',
  }));
  const filteredStaff = staffWithStatus.filter(s =>
    s.name.toLowerCase().includes(staffSearch.toLowerCase()) &&
    (roleFilter === 'All' || s.role.toLowerCase() === roleFilter.toLowerCase())
  );

  const uniqueLanguages = [...new Set(members.map(m => m.language).filter(Boolean))];

  const selectedMember = (currentView === 'student' ? members : staffList)
    .find(m => m.id?.toString() === selectedId?.toString());

  const methodIcon = { Cash: Icons.Cash, Card: Icons.CreditCard, Transfer: Icons.Transfer };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div style={{ flex: 1, height: '100%', overflowY: 'auto', background: '#f8fafc', padding: 28, fontFamily: 'inherit' }}>
      {toast.show && <Toast message={toast.message} onClose={() => setToast({ show: false, message: '' })} />}

      {/* ── Page header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#1e293b' }}>Financial Dashboard</h2>
          <p style={{ margin: '3px 0 0', fontSize: 13, color: '#64748b' }}>
            Manage student fees and staff payroll
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {/* View toggle */}
          <div style={{ display: 'flex', background: '#fff', padding: 4, borderRadius: 12, border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            {[{ id: 'student', label: 'Students' }, { id: 'staff', label: 'Staff Payroll' }].map(v => (
              <button key={v.id} onClick={() => setCurrentView(v.id)}
                style={{
                  padding: '8px 18px', borderRadius: 9, border: 'none', cursor: 'pointer',
                  fontSize: 12, fontWeight: 700, transition: 'all .15s',
                  background: currentView === v.id ? '#0f172a' : 'transparent',
                  color: currentView === v.id ? '#fff' : '#64748b',
                  boxShadow: currentView === v.id ? '0 2px 6px rgba(0,0,0,0.12)' : 'none',
                }}>
                {v.label}
              </button>
            ))}
          </div>

          {/* Add payment */}
          <button
            onClick={() => { setSelectedId(''); setPayNotes(''); setShowAddPaymentModal(true); }}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '9px 18px', borderRadius: 10, border: 'none',
              background: '#4318FF', color: '#fff', fontSize: 13, fontWeight: 700,
              cursor: 'pointer', boxShadow: '0 4px 14px rgba(67,24,255,0.25)',
            }}>
            <Icons.Plus /> Add Payment
          </button>
        </div>
      </div>

      {/* ════════════════ STUDENT VIEW ════════════════ */}
      {currentView === 'student' && (
        <>
          {/* Stat cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
            <StatCard title="Total Income"    value={`${totalIncome.toLocaleString()} DZD`} icon={Icons.Dollar}   iconBg="#ecfdf5" iconColor="#059669" accent="#059669" />
            <StatCard title="Unpaid Members"  value={unpaidCount}  icon={Icons.Users}    iconBg="#fff7ed" iconColor="#f97316" accent="#f97316" />
            <StatCard title="Overdue"         value={overdueCount} icon={Icons.Alert}    iconBg="#fef2f2" iconColor="#dc2626" accent="#dc2626" />
            <StatCard title="Due Soon"        value={dueSoonCount} icon={Icons.Calendar} iconBg="#eff6ff" iconColor="#3b82f6" />
          </div>

          {/* Overdue alert */}
          {overdueCount > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 14, padding: '14px 20px', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <span style={{ color: '#dc2626', marginTop: 1 }}><Icons.Alert /></span>
                <div>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#991b1b' }}>{overdueCount} member{overdueCount > 1 ? 's' : ''} have overdue payments</p>
                  <p style={{ margin: '3px 0 0', fontSize: 12, color: '#b91c1c' }}>Send automated reminders to notify all affected students.</p>
                </div>
              </div>
              <button onClick={notifyAllOverdue}
                style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px', borderRadius: 10, border: 'none', background: '#dc2626', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}>
                <Icons.Bell /> Notify All
              </button>
            </div>
          )}

          {/* Filters */}
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', padding: '14px 18px', marginBottom: 20, display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
              <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}><Icons.Search /></span>
              <input
                type="text" placeholder="Search student..." value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ width: '100%', padding: '8px 12px 8px 34px', borderRadius: 10, border: '1px solid #f1f5f9', background: '#f8fafc', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: 10, border: '1px solid #f1f5f9', background: '#f8fafc', fontSize: 13, fontWeight: 600, cursor: 'pointer', outline: 'none' }}>
              <option value="All">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Overdue">Overdue</option>
              <option value="Due Soon">Due Soon</option>
            </select>
            <select value={langFilter} onChange={e => setLangFilter(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: 10, border: '1px solid #f1f5f9', background: '#f8fafc', fontSize: 13, fontWeight: 600, cursor: 'pointer', outline: 'none' }}>
              <option value="All">All Languages</option>
              {uniqueLanguages.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            {(searchTerm || statusFilter !== 'All' || langFilter !== 'All') && (
              <button
                onClick={() => { setSearchTerm(''); setStatusFilter('All'); setLangFilter('All'); }}
                style={{ padding: '8px 12px', borderRadius: 10, border: 'none', background: 'transparent', color: '#ef4444', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                Clear filters ×
              </button>
            )}
          </div>

          {/* Student cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, marginBottom: 24 }}>
            {loading ? (
              <p style={{ color: '#94a3b8', fontWeight: 600, fontSize: 13, gridColumn: '1/-1' }}>Loading members...</p>
            ) : filteredMembers.length === 0 ? (
              <div style={{ gridColumn: '1/-1', background: '#fff', borderRadius: 16, border: '1px dashed #e2e8f0', padding: '40px 0', textAlign: 'center', color: '#94a3b8', fontWeight: 600, fontSize: 13 }}>
                No students found matching your filters.
              </div>
            ) : filteredMembers.map(m => (
              <div key={m.id} style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', padding: 20, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
                {/* Left accent */}
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, borderRadius: '16px 0 0 16px', background: m.status === 'Overdue' ? '#ef4444' : m.status === 'Due Soon' ? '#f97316' : '#10b981' }} />
                <div style={{ paddingLeft: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <div>
                      <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#1e293b' }}>{m.name}</p>
                      <p style={{ margin: '3px 0 0', fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>{m.language} · {m.group}</p>
                    </div>
                    <StatusBadge status={m.status} />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '12px 0', borderTop: '1px solid #f8fafc', borderBottom: '1px solid #f8fafc', margin: '12px 0' }}>
                    <div>
                      <p style={{ margin: 0, fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>Current Balance</p>
                      <p style={{ margin: 0, fontSize: 11, color: '#94a3b8', fontWeight: 600, marginTop: 2 }}>Due: {m.dueDate}</p>
                    </div>
                    <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: m.balance > 0 ? '#ef4444' : '#059669' }}>
                      {m.balance.toLocaleString()} DZD
                    </p>
                  </div>

                  {m.status !== 'Paid' ? (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => { setSelectedId(m.id); setPayAmount(String(m.balance)); setShowAddPaymentModal(true); }}
                        style={{ flex: 1, padding: '10px 0', borderRadius: 10, border: 'none', background: '#4318FF', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, boxShadow: '0 4px 12px rgba(67,24,255,0.2)' }}>
                        <Icons.Check /> Mark Paid
                      </button>
                      <button
                        onClick={() => notifyStudent(m.name, m.id)}
                        style={{ width: 42, height: 42, borderRadius: 10, border: '1px solid #f1f5f9', background: '#f8fafc', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', flexShrink: 0 }}>
                        <Icons.Bell />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setReceiptData({ name: m.name, amount: '3000', method: 'Cash', date: new Date().toLocaleString(), txn: `TXN-${m.id}` }); setShowReceiptModal(true); }}
                      style={{ width: '100%', padding: '10px 0', borderRadius: 10, border: '1px solid #f1f5f9', background: '#f8fafc', color: '#64748b', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                      <Icons.Receipt /> View Receipt
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Payment history table */}
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#1e293b' }}>Payment History</h3>
              <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>{paymentHistory.length} records</span>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    {['Date', 'Member', 'Amount', 'Method', 'Status', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 10, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paymentHistory.length === 0 ? (
                    <tr><td colSpan={6} style={{ padding: '32px 0', textAlign: 'center', color: '#94a3b8', fontWeight: 600, fontSize: 13 }}>No payments recorded yet.</td></tr>
                  ) : paymentHistory.map((row, i) => (
                    <tr key={i} style={{ borderTop: '1px solid #f8fafc' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '12px 16px', fontSize: 12, color: '#64748b', fontWeight: 600 }}>{row.date}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{row.member}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{row.amount}</td>
                      <td style={{ padding: '12px 16px', fontSize: 12, color: '#64748b', fontWeight: 600 }}>{row.method}</td>
                      <td style={{ padding: '12px 16px' }}><StatusBadge status={row.status} /></td>
                      <td style={{ padding: '12px 16px' }}>
                        <button
                          onClick={() => { setReceiptData({ name: row.member, amount: row.amount.replace(/\D/g,''), method: row.method, date: row.date, txn: `TXN-${row.id}` }); setShowReceiptModal(true); }}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700, color: '#4318FF', display: 'flex', alignItems: 'center', gap: 5 }}>
                          <Icons.Receipt /> Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ════════════════ STAFF VIEW ════════════════ */}
      {currentView === 'staff' && (
        <>
          {/* Month + stats */}
          <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#fff', padding: '10px 16px', borderRadius: 12, border: '1px solid #f1f5f9', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <Icons.Calendar />
              <select value={monthFilter} onChange={e => setMonthFilter(e.target.value)}
                style={{ border: 'none', background: 'transparent', fontSize: 13, fontWeight: 700, color: '#1e293b', cursor: 'pointer', outline: 'none' }}>
                {monthsList.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', gap: 12, flex: 1, flexWrap: 'wrap' }}>
              <StatCard
                title="Disbursed This Month"
                value={`${staffWithStatus.filter(s => s.status === 'Paid').reduce((sum, s) => sum + Number(s.salary), 0).toLocaleString()} DZD`}
                icon={Icons.Dollar} iconBg="#ecfdf5" iconColor="#059669" accent="#059669"
              />
              <StatCard
                title="Pending Staff"
                value={staffWithStatus.filter(s => s.status === 'Pending').length}
                icon={Icons.Users} iconBg="#fff7ed" iconColor="#f97316" accent="#f97316"
              />
            </div>
          </div>

          {/* Staff filters */}
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', padding: '14px 18px', marginBottom: 20, display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
              <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}><Icons.Search /></span>
              <input type="text" placeholder="Search staff name..." value={staffSearch} onChange={e => setStaffSearch(e.target.value)}
                style={{ width: '100%', padding: '8px 12px 8px 34px', borderRadius: 10, border: '1px solid #f1f5f9', background: '#f8fafc', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            {['All', 'Teacher', 'Secretary', 'Admin'].map(role => (
              <button key={role} onClick={() => setRoleFilter(role)}
                style={{
                  padding: '8px 14px', borderRadius: 10, border: '1px solid #f1f5f9',
                  background: roleFilter === role ? '#0f172a' : '#f8fafc',
                  color: roleFilter === role ? '#fff' : '#64748b',
                  fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all .15s',
                }}>
                {role}
              </button>
            ))}
          </div>

          {/* Staff cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, marginBottom: 24 }}>
            {filteredStaff.map(staff => (
              <div key={staff.id} style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', padding: 20, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, borderRadius: '16px 0 0 16px', background: staff.status === 'Paid' ? '#10b981' : '#f97316' }} />
                <div style={{ paddingLeft: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <div>
                      <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#1e293b' }}>{staff.name}</p>
                      <p style={{ margin: '3px 0 0', fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>{staff.role}</p>
                    </div>
                    <StatusBadge status={staff.status} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '12px 0', borderTop: '1px solid #f8fafc', margin: '12px 0' }}>
                    <p style={{ margin: 0, fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>Monthly Salary</p>
                    <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#1e293b' }}>{Number(staff.salary).toLocaleString()} DZD</p>
                  </div>
                  {staff.status === 'Pending' ? (
                    <button
                      onClick={() => processStaffPayment(staff.id, staff.salary, 'Cash', monthFilter)}
                      style={{ width: '100%', padding: '10px 0', borderRadius: 10, border: 'none', background: '#4318FF', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, boxShadow: '0 4px 12px rgba(67,24,255,0.2)' }}>
                      <Icons.Dollar /> Disburse Salary
                    </button>
                  ) : (
                    <div style={{ width: '100%', padding: '10px 0', borderRadius: 10, background: '#ecfdf5', color: '#059669', fontSize: 12, fontWeight: 700, textAlign: 'center', border: '1px solid #d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                      <Icons.Checkmark /> Paid for {monthFilter}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Staff history table */}
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#1e293b' }}>Staff Disbursement History</h3>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 540 }}>
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    {['Date', 'Employee', 'Period', 'Amount', 'Method'].map(h => (
                      <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 10, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {staffHistory.length === 0 ? (
                    <tr><td colSpan={5} style={{ padding: '32px 0', textAlign: 'center', color: '#94a3b8', fontWeight: 600, fontSize: 13 }}>No disbursements recorded yet.</td></tr>
                  ) : staffHistory.map((row, i) => (
                    <tr key={i} style={{ borderTop: '1px solid #f8fafc' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '12px 16px', fontSize: 12, color: '#64748b', fontWeight: 600 }}>{row.date}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{row.name}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ background: '#eff6ff', color: '#3b82f6', fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 20 }}>{row.month}</span>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{row.amount}</td>
                      <td style={{ padding: '12px 16px', fontSize: 12, color: '#64748b', fontWeight: 600 }}>{row.method}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ════════════════ ADD PAYMENT MODAL ════════════════ */}
      {showAddPaymentModal && (
        <div onClick={() => setShowAddPaymentModal(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div onClick={e => e.stopPropagation()}
            style={{ background: '#fff', width: '100%', maxWidth: 480, borderRadius: 20, boxShadow: '0 24px 64px rgba(0,0,0,0.18)', overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4318FF' }}>
                  <Icons.Dollar />
                </div>
                <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#1e293b' }}>
                  Add {currentView === 'student' ? 'Student' : 'Staff'} Payment
                </h2>
              </div>
              <button onClick={() => setShowAddPaymentModal(false)}
                style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #f1f5f9', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}>
                <Icons.X />
              </button>
            </div>

            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
              {/* Select member */}
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                  Select {currentView === 'student' ? 'Student' : 'Staff Member'}
                </label>
                <select value={selectedId} onChange={e => setSelectedId(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: 13, fontWeight: 600, outline: 'none', cursor: 'pointer' }}>
                  <option value="">Choose target...</option>
                  {(currentView === 'student' ? members : staffList).map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              {/* Selected member preview */}
              {selectedMember && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: '#f8fafc', borderRadius: 12, border: '1px solid #f1f5f9' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4318FF' }}>
                    <Icons.User />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{selectedMember.name}</p>
                    <p style={{ margin: '2px 0 0', fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>
                      {currentView === 'student' ? `${selectedMember.language} · Due: End of Month` : `${selectedMember.role} · Salary: ${Number(selectedMember.salary).toLocaleString()} DZD`}
                    </p>
                  </div>
                </div>
              )}

              {/* Amount */}
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                  Payment Amount (DZD)
                </label>
                <input type="number" value={payAmount} onChange={e => setPayAmount(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: 14, fontWeight: 700, color: '#1e293b', outline: 'none', boxSizing: 'border-box' }}
                />
                <button type="button"
                  onClick={() => setPayAmount(currentView === 'student' ? '3000' : '35000')}
                  style={{ marginTop: 6, padding: '5px 12px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: 11, fontWeight: 700, color: '#64748b', cursor: 'pointer' }}>
                  Standard ({currentView === 'student' ? '3000' : '35000'} DZD)
                </button>
              </div>

              {/* Method */}
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                  Payment Method
                </label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[{ value: 'Cash', Icon: Icons.Cash }, { value: 'Card', Icon: Icons.CreditCard }, { value: 'Transfer', Icon: Icons.Transfer }].map(({ value, Icon }) => (
                    <button key={value} onClick={() => setPayMethod(value)}
                      style={{
                        flex: 1, padding: '10px 0', borderRadius: 10, cursor: 'pointer',
                        border: payMethod === value ? '2px solid #4318FF' : '1px solid #e2e8f0',
                        background: payMethod === value ? '#eef2ff' : '#f8fafc',
                        color: payMethod === value ? '#4318FF' : '#64748b',
                        fontSize: 12, fontWeight: 700,
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
                      }}>
                      <Icon />
                      {value}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                  Notes (Optional)
                </label>
                <input type="text" value={payNotes} onChange={e => setPayNotes(e.target.value)} placeholder="e.g. Monthly fee for April..."
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              {/* Summary */}
              <div style={{ background: '#f8fafc', borderRadius: 12, padding: '12px 14px', border: '1px solid #f1f5f9' }}>
                <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Summary</p>
                {[{ label: 'Amount', value: `${Number(payAmount).toLocaleString()} DZD` }, { label: 'Method', value: payMethod }, { label: 'New Balance', value: '0 DZD', accent: '#059669' }].map(({ label, value, accent }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                    <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>{label}</span>
                    <span style={{ fontSize: 12, fontWeight: 800, color: accent || '#1e293b' }}>{value}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setShowAddPaymentModal(false)}
                  style={{ flex: 1, padding: '12px 0', borderRadius: 10, border: '1px solid #f1f5f9', background: '#f8fafc', color: '#64748b', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                  Cancel
                </button>
                <button
                  onClick={currentView === 'student' ? processStudentPayment : () => processStaffPayment(selectedId, payAmount, payMethod, monthFilter)}
                  style={{ flex: 2, padding: '12px 0', borderRadius: 10, border: 'none', background: '#0f172a', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <Icons.Check /> Record Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════ RECEIPT MODAL ════════════════ */}
      {showReceiptModal && receiptData && (
        <div onClick={() => setShowReceiptModal(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 600, background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div onClick={e => e.stopPropagation()}
            style={{ background: '#fff', width: '100%', maxWidth: 380, borderRadius: 20, boxShadow: '0 24px 64px rgba(0,0,0,0.18)', overflow: 'hidden' }}>
            {/* Green accent */}
            <div style={{ height: 4, background: 'linear-gradient(90deg, #10b981, #059669)' }} />
            <div style={{ padding: '28px 28px 24px', textAlign: 'center' }}>
              {/* Icon */}
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#059669' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>

              <h2 style={{ margin: '0 0 4px', fontSize: 18, fontWeight: 800, color: '#1e293b' }}>Payment Recorded</h2>
              <p style={{ margin: '0 0 20px', fontSize: 13, color: '#64748b' }}>
                Payment confirmed for <strong style={{ color: '#1e293b' }}>{receiptData.name}</strong>
              </p>

              {/* Amount */}
              <div style={{ background: '#f8fafc', borderRadius: 14, padding: '16px 0', marginBottom: 20 }}>
                <p style={{ margin: '0 0 4px', fontSize: 10, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Total Amount</p>
                <p style={{ margin: 0, fontSize: 32, fontWeight: 800, color: '#1e293b' }}>{Number(receiptData.amount).toLocaleString()} DZD</p>
              </div>

              {/* Details grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
                {[
                  { label: 'Ref Number', value: receiptData.txn },
                  { label: 'Date & Time', value: receiptData.date },
                  { label: 'Method',      value: receiptData.method },
                  { label: 'Processed By', value: 'Admin Desk' },
                ].map(({ label, value }) => (
                  <div key={label} style={{ background: '#f8fafc', borderRadius: 10, padding: '10px 12px', textAlign: 'left', border: '1px solid #f1f5f9' }}>
                    <p style={{ margin: '0 0 3px', fontSize: 9, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
                    <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: '#1e293b', wordBreak: 'break-all' }}>{value}</p>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => showNotification('Generating PDF receipt...')}
                  style={{ flex: 1, padding: '11px 0', borderRadius: 10, border: '1px solid #f1f5f9', background: '#f8fafc', color: '#1e293b', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <Icons.Download /> Download
                </button>
                <button
                  onClick={() => setShowReceiptModal(false)}
                  style={{ flex: 1, padding: '11px 0', borderRadius: 10, border: 'none', background: '#0f172a', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;
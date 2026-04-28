import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icons = {
  Download: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Search:   () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Check:    () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Clock:    () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  File:     () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  Info:     () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
  User:     () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Trending: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
};

// ─── Status badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const ok = status === 'Verified';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 10,
      fontWeight: 700, padding: '3px 10px', borderRadius: 20, letterSpacing: '0.06em',
      textTransform: 'uppercase',
      background: ok ? '#ecfdf5' : '#fff7ed',
      color:      ok ? '#059669' : '#c2410c',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: ok ? '#10b981' : '#f97316' }} />
      {ok ? 'Verified' : 'Pending'}
    </span>
  );
};

// ─── Info row ─────────────────────────────────────────────────────────────────
const InfoRow = ({ label, value, accent }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid #f8fafc' }}>
    <span style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8' }}>{label}</span>
    <span style={{ fontSize: 13, fontWeight: 800, color: accent || '#1e293b' }}>{value || '—'}</span>
  </div>
);

// ─── Stat card ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon: Icon, accent }) => (
  <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', padding: '18px 20px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: `${accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: accent }}>
        <Icon />
      </div>
    </div>
    <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
    <p style={{ margin: '4px 0 0', fontSize: 22, fontWeight: 800, color: accent || '#1e293b', lineHeight: 1 }}>{value}</p>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const TeacherFinance = () => {
  const [loading,        setLoading]        = useState(true);
  const [teacherInfo,    setTeacherInfo]    = useState({ name: 'Loading...', id: '...', department: '...', role: '...', baseSalary: 0 });
  const [earnings,       setEarnings]       = useState({ totalEarned: 0, paidThisMonth: 0, pendingThisMonth: 0, currentMonthName: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }) });
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [searchQuery,    setSearchQuery]    = useState('');
  const [statusFilter,   setStatusFilter]   = useState('All Payments');
  const [yearFilter,     setYearFilter]     = useState('2025-26');
  const [selectedRow,    setSelectedRow]    = useState(null);

  // ── All original Supabase logic — UNTOUCHED ───────────────────────────────
  useEffect(() => {
    const fetchFinanceData = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || !user.email) return;

        const { data: staffData, error: staffError } = await supabase
          .from('staff').select('*').eq('email', user.email).single();
        if (staffError) throw staffError;

        const teacherName = `${staffData.first_name} ${staffData.last_name}`;
        const baseSalary  = parseFloat(staffData.salary) || 0;

        setTeacherInfo({
          name:       teacherName,
          id:         `TCH-${staffData.id.substring(0, 8).toUpperCase()}`,
          department: staffData.department || 'N/A',
          role:       staffData.role       || 'Teacher',
          baseSalary,
        });

        const { data: paymentsData, error: payError } = await supabase
          .from('payments').select('*')
          .eq('member_name', teacherName)
          .ilike('notes', '%Payroll%')
          .order('payment_date', { ascending: false });

        if (payError && payError.code !== 'PGRST116') throw payError;

        let formattedHistory   = [];
        let totalEarned        = 0;
        let paidThisMonth      = 0;
        let pendingThisMonth   = baseSalary;
        const currentMonthString = new Date().toLocaleString('default', { month: 'long' }) + ' 2026';

        if (paymentsData && paymentsData.length > 0) {
          formattedHistory = paymentsData.map(p => {
            const amount = parseFloat(p.amount) || 0;
            totalEarned += amount;
            if (p.notes.includes(currentMonthString)) {
              paidThisMonth      += amount;
              pendingThisMonth    = baseSalary - paidThisMonth;
              if (pendingThisMonth < 0) pendingThisMonth = 0;
            }
            return {
              id:            p.id,
              date:          new Date(p.payment_date || p.created_at).toLocaleDateString('en-GB'),
              rawDate:       new Date(p.payment_date || p.created_at),
              amount:        `${amount.toLocaleString()} DZD`,
              amountRaw:     amount,
              transactionId: `TXN-${p.id.substring(0, 8).toUpperCase()}`,
              status:        p.status === 'Paid' ? 'Verified' : 'Pending',
              receipt:       `${p.notes.replace('Payroll for ', '')}-Payslip.pdf`,
              month:         p.notes.replace('Payroll for ', ''),
            };
          });
        }

        setEarnings({ totalEarned, paidThisMonth, pendingThisMonth, currentMonthName: currentMonthString });
        setPaymentHistory(formattedHistory);
      } catch (err) {
        console.error('Error fetching finance data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFinanceData();
  }, []);

  // ── Filtering — UNTOUCHED ─────────────────────────────────────────────────
  const filteredHistory = paymentHistory.filter(item => {
    const matchesSearch = item.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.receipt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All Payments' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const isPaidThisMonth = earnings.paidThisMonth > 0;

  if (loading) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 32, height: 32, border: '3px solid #e0e7ff', borderTopColor: '#4318FF', borderRadius: '50%', margin: '0 auto 12px', animation: 'spin .8s linear infinite' }} />
          <p style={{ color: '#94a3b8', fontSize: 13, fontWeight: 600 }}>Loading Finance Data...</p>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: '#f8fafc', padding: 28, fontFamily: "'Inter','Segoe UI',sans-serif" }}>

      {/* ── Page Header ──────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#1e293b' }}>
          Welcome, {teacherInfo.name.split(' ')[0]}
        </h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
          View your payroll, earnings breakdown, and disbursement history.
        </p>
      </div>

      {/* ── Status banner ────────────────────────────────────────────────── */}
      <div style={{
        borderRadius: 16, padding: '18px 24px', marginBottom: 24,
        background: isPaidThisMonth ? 'linear-gradient(135deg,#ecfdf5,#d1fae5)' : 'linear-gradient(135deg,#fff7ed,#fef3c7)',
        border: `1px solid ${isPaidThisMonth ? '#a7f3d0' : '#fed7aa'}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0, background: isPaidThisMonth ? '#059669' : '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            {isPaidThisMonth ? <Icons.Check /> : <Icons.Clock />}
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#1e293b' }}>
              {isPaidThisMonth
                ? `Your salary for ${earnings.currentMonthName} has been disbursed.`
                : `Your salary for ${earnings.currentMonthName} is pending.`}
            </p>
            <p style={{ margin: '3px 0 0', fontSize: 12, color: isPaidThisMonth ? '#059669' : '#c2410c', fontWeight: 600 }}>
              {isPaidThisMonth ? 'Processed by the administration.' : 'Salaries are processed on the 28th of each month.'}
            </p>
          </div>
        </div>
        <StatusBadge status={isPaidThisMonth ? 'Verified' : 'Pending'} />
      </div>

      {/* ── Stat cards ───────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        <StatCard label="Total Earned (All Time)"  value={`${earnings.totalEarned.toLocaleString()} DZD`}   icon={Icons.Trending} accent="#4318FF" />
        <StatCard label="Paid This Month"          value={`${earnings.paidThisMonth.toLocaleString()} DZD`} icon={Icons.Check}    accent="#059669" />
        <StatCard label="Pending This Month"       value={`${earnings.pendingThisMonth.toLocaleString()} DZD`} icon={Icons.Clock} accent={earnings.pendingThisMonth > 0 ? '#f97316' : '#059669'} />
        <StatCard label="Base Monthly Salary"      value={`${teacherInfo.baseSalary.toLocaleString()} DZD`} icon={Icons.User}     accent="#1e293b" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>

        {/* ── Card 1: Earnings Status ─────────────────────────────────── */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18, paddingBottom: 14, borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4318FF' }}>
              <Icons.User />
            </div>
            <h3 style={{ margin: 0, fontSize: 13, fontWeight: 800, color: '#1e293b' }}>Earnings Status</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 28px' }}>
            {/* Left: identity */}
            <div>
              <InfoRow label="Name"       value={teacherInfo.name}       />
              <InfoRow label="Teacher ID" value={teacherInfo.id}         />
              <InfoRow label="Department" value={teacherInfo.department} />
              <InfoRow label="Role"       value={teacherInfo.role}       />
            </div>
            {/* Right: financials */}
            <div>
              <InfoRow label="Current Month"   value={earnings.currentMonthName}                                            />
              <InfoRow label="Total Earned"    value={`${earnings.totalEarned.toLocaleString()} DZD`}                       />
              <InfoRow label="Paid"            value={`${earnings.paidThisMonth.toLocaleString()} DZD`}    accent="#059669" />
              <InfoRow label="Pending"         value={`${earnings.pendingThisMonth.toLocaleString()} DZD`} accent={earnings.pendingThisMonth > 0 ? '#dc2626' : '#059669'} />
            </div>
          </div>
        </div>

        {/* ── Card 2: Salary Breakdown ────────────────────────────────── */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18, paddingBottom: 14, borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4318FF' }}>
              <Icons.Trending />
            </div>
            <h3 style={{ margin: 0, fontSize: 13, fontWeight: 800, color: '#1e293b' }}>Salary Breakdown</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
            {[
              { label: `Base Salary — ${teacherInfo.department}`, value: `${teacherInfo.baseSalary.toLocaleString()} DZD`, accent: '#1e293b' },
              { label: 'Extra Hours / Overtime',                  value: 'Subject to approval',                            accent: '#94a3b8' },
              { label: 'Bonuses & Incentives',                    value: 'Subject to approval',                            accent: '#94a3b8' },
              { label: 'Tax & Deductions',                        value: 'Inclusive',                                      accent: '#94a3b8' },
            ].map(({ label, value, accent }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: 12, background: '#f8fafc', border: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#1e293b' }}>{label}</span>
                <span style={{ fontSize: 12, fontWeight: 800, color: accent || '#1e293b', flexShrink: 0, marginLeft: 10 }}>{value}</span>
              </div>
            ))}
          </div>

          <div style={{ padding: '11px 14px', borderRadius: 12, background: '#f8fafc', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: '#94a3b8', flexShrink: 0 }}><Icons.Info /></span>
            <p style={{ margin: 0, fontSize: 11, color: '#64748b', fontWeight: 600 }}>
              Salaries are processed on the 28th of each month by Administration.
            </p>
          </div>
        </div>
      </div>

      {/* ── Card 3: Payment History ───────────────────────────────────────── */}
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
        {/* Card header */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#1e293b' }}>Payment History</h3>

          {/* Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            {/* Year */}
            <select value={yearFilter} onChange={e => setYearFilter(e.target.value)}
              style={{ padding: '7px 12px', borderRadius: 10, border: '1px solid #e0e7ff', background: '#f5f3ff', color: '#4318FF', fontSize: 12, fontWeight: 700, cursor: 'pointer', outline: 'none' }}>
              <option value="2025-26">2025 – 26</option>
              <option value="2024-25">2024 – 25</option>
            </select>

            {/* Status */}
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              style={{ padding: '7px 12px', borderRadius: 10, border: '1px solid #f1f5f9', background: '#f8fafc', color: '#1e293b', fontSize: 12, fontWeight: 700, cursor: 'pointer', outline: 'none' }}>
              <option value="All Payments">All Payments</option>
              <option value="Verified">Verified</option>
              <option value="Pending">Pending</option>
            </select>

            {/* Search */}
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}><Icons.Search /></span>
              <input
                type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search transaction ID..."
                style={{ padding: '7px 12px 7px 32px', borderRadius: 10, border: '1px solid #f1f5f9', background: '#f8fafc', color: '#1e293b', fontSize: 12, fontWeight: 600, outline: 'none', width: 190 }}
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
            <thead>
              <tr style={{ background: '#0f172a' }}>
                {['Date', 'Amount', 'Transaction ID', 'Verification Status', 'Payslip'].map((h, i, arr) => (
                  <th key={h} style={{
                    padding: '12px 20px', textAlign: i > 0 ? 'center' : 'left',
                    fontSize: 11, fontWeight: 700, color: '#fff',
                    textTransform: 'uppercase', letterSpacing: '0.06em',
                    borderRadius: i === 0 ? '0' : i === arr.length - 1 ? '0' : '0',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '40px 0', textAlign: 'center', color: '#94a3b8', fontSize: 13, fontWeight: 600 }}>
                    No payment history found.
                  </td>
                </tr>
              ) : filteredHistory.map((item, idx) => (
                <tr
                  key={item.id}
                  onClick={() => setSelectedRow(item)}
                  style={{ background: idx % 2 === 0 ? '#f8fafc' : '#fff', borderBottom: '1px solid #f1f5f9', cursor: 'pointer', transition: 'background .12s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#eef2ff'}
                  onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? '#f8fafc' : '#fff'}
                >
                  <td style={{ padding: '13px 20px', fontSize: 12, fontWeight: 600, color: '#64748b' }}>{item.date}</td>
                  <td style={{ padding: '13px 20px', fontSize: 13, fontWeight: 800, color: '#1e293b', textAlign: 'center' }}>{item.amount}</td>
                  <td style={{ padding: '13px 20px', fontSize: 11, fontFamily: 'monospace', fontWeight: 700, color: '#94a3b8', textAlign: 'center' }}>{item.transactionId}</td>
                  <td style={{ padding: '13px 20px', textAlign: 'center' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: 12, color: item.status === 'Verified' ? '#059669' : '#64748b' }}>
                      {item.status === 'Verified'
                        ? <span style={{ width: 18, height: 18, borderRadius: '50%', background: '#ecfdf5', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}><Icons.Check /></span>
                        : <span style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff7ed', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#f97316' }}><Icons.Clock /></span>}
                      {item.status}
                    </span>
                  </td>
                  <td style={{ padding: '13px 20px', textAlign: 'center' }}>
                    <button
                      onClick={e => { e.stopPropagation(); alert(`Downloading ${item.receipt}...`); }}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#4318FF', background: '#eef2ff', border: 'none', borderRadius: 8, padding: '5px 10px', fontSize: 11, fontWeight: 700, cursor: 'pointer', transition: 'background .12s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#e0e7ff'}
                      onMouseLeave={e => e.currentTarget.style.background = '#eef2ff'}>
                      <Icons.File /> {item.receipt}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Row detail modal ─────────────────────────────────────────────── */}
      {selectedRow && (
        <div
          onClick={() => setSelectedRow(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 420, boxShadow: '0 24px 64px rgba(0,0,0,0.18)', overflow: 'hidden' }}>
            <div style={{ height: 4, background: selectedRow.status === 'Verified' ? 'linear-gradient(90deg,#059669,#34d399)' : 'linear-gradient(90deg,#f97316,#fbbf24)' }} />
            <div style={{ padding: '24px 28px' }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div>
                  <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: '#4318FF', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Payslip Detail</p>
                  <h3 style={{ margin: '6px 0 2px', fontSize: 20, fontWeight: 800, color: '#1e293b' }}>{selectedRow.month}</h3>
                  <p style={{ margin: 0, fontSize: 11, fontFamily: 'monospace', color: '#94a3b8' }}>{selectedRow.transactionId}</p>
                </div>
                <button onClick={() => setSelectedRow(null)}
                  style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #f1f5f9', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b', fontSize: 16, fontWeight: 700, flexShrink: 0 }}>
                  ✕
                </button>
              </div>

              {/* Amount */}
              <div style={{ background: '#f8fafc', borderRadius: 14, padding: '18px', textAlign: 'center', marginBottom: 18, border: '1px solid #f1f5f9' }}>
                <p style={{ margin: '0 0 4px', fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Amount Disbursed</p>
                <p style={{ margin: 0, fontSize: 30, fontWeight: 800, color: '#1e293b', lineHeight: 1 }}>{selectedRow.amount}</p>
              </div>

              {/* Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                {[
                  { label: 'Date',   value: selectedRow.date   },
                  { label: 'Status', value: selectedRow.status },
                  { label: 'File',   value: selectedRow.receipt },
                ].map(({ label, value }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 13px', background: '#f8fafc', borderRadius: 10 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>{label}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{value}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setSelectedRow(null)}
                  style={{ flex: 1, padding: '11px 0', borderRadius: 10, border: '1px solid #f1f5f9', background: '#f8fafc', color: '#64748b', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                  Close
                </button>
                <button
                  onClick={() => { alert(`Downloading ${selectedRow.receipt}...`); setSelectedRow(null); }}
                  style={{ flex: 2, padding: '11px 0', borderRadius: 10, border: 'none', background: '#0f172a', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <Icons.Download /> Download Payslip
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherFinance;
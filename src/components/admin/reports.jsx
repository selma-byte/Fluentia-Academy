import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, LineChart, Line,
} from 'recharts';

// ─── Icon System ──────────────────────────────────────────────────────────────
const Icons = {
  Download: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  ),
  Print: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 6 2 18 2 18 9"/>
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
      <rect x="6" y="14" width="12" height="8"/>
    </svg>
  ),
  ArrowLeft: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
    </svg>
  ),
  ChevronRight: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
  BarChart2: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
    </svg>
  ),
  DollarSign: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  ),
  Users: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  GraduationCap: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
      <path d="M6 12v5c3 3 9 3 12 0v-5"/>
    </svg>
  ),
  TrendingUp: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
      <polyline points="17 6 23 6 23 12"/>
    </svg>
  ),
  Loader: () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4318FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
    </svg>
  ),
  CheckCircle: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
  X: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
};

// ─── Theme ────────────────────────────────────────────────────────────────────
const C = {
  purple:     '#4318FF',
  purpleLight:'#eef2ff',
  dark:       '#1e293b',
  mid:        '#64748b',
  light:      '#94a3b8',
  border:     '#f1f5f9',
  bg:         '#f8fafc',
  white:      '#fff',
  green:      '#059669',
  greenBg:    '#ecfdf5',
  orange:     '#f97316',
  orangeBg:   '#fff7ed',
  red:        '#dc2626',
  redBg:      '#fef2f2',
};

// ─── Toast ────────────────────────────────────────────────────────────────────
const Toast = ({ message, onClose }) => (
  <div style={{
    position: 'fixed', bottom: 32, right: 32, zIndex: 999,
    background: '#0f172a', color: '#fff',
    padding: '14px 20px', borderRadius: 14,
    boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
    display: 'flex', alignItems: 'center', gap: 12,
    minWidth: 300, border: '1px solid rgba(255,255,255,0.08)',
    animation: 'fadeSlideIn 0.3s ease',
  }}>
    <span style={{ color: C.green, display: 'flex' }}><Icons.CheckCircle /></span>
    <span style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{message}</span>
    <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', padding: 2 }}>
      <Icons.X />
    </button>
  </div>
);

// ─── Action Buttons ───────────────────────────────────────────────────────────
const ActionButtons = ({ name, onExport, onPrint }) => (
  <div style={{ display: 'flex', gap: 8 }}>
    <button
      onClick={onExport}
      style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '7px 14px', borderRadius: 9, border: `1px solid ${C.border}`,
        background: C.white, fontSize: 12, fontWeight: 700, color: C.dark,
        cursor: 'pointer', transition: 'all .15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = '#e0e7ff'; e.currentTarget.style.color = C.purple; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.dark; }}
    >
      <span style={{ color: C.purple, display: 'flex' }}><Icons.Download /></span> Export PDF
    </button>
    <button
      onClick={onPrint}
      style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '7px 14px', borderRadius: 9, border: `1px solid ${C.border}`,
        background: C.white, fontSize: 12, fontWeight: 700, color: C.dark,
        cursor: 'pointer', transition: 'all .15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = '#e0e7ff'; e.currentTarget.style.color = C.purple; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.dark; }}
    >
      <span style={{ color: C.mid, display: 'flex' }}><Icons.Print /></span> Print
    </button>
  </div>
);

// ─── Section Header ───────────────────────────────────────────────────────────
const SectionHeader = ({ title, onBack, name, showToast }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
    <div>
      <button
        onClick={onBack}
        style={{
          display: 'flex', alignItems: 'center', gap: 7,
          background: 'none', border: 'none', color: C.purple,
          fontSize: 12, fontWeight: 700, cursor: 'pointer',
          padding: 0, marginBottom: 8, transition: 'opacity .15s',
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
      >
        <Icons.ArrowLeft /> Back to Reports
      </button>
      <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: C.dark }}>{title}</h2>
    </div>
    <ActionButtons
      name={name}
      onExport={() => showToast(`Exporting ${name} as PDF…`)}
      onPrint={() => showToast(`Preparing ${name} for print…`)}
    />
  </div>
);

// ─── Chart Card ───────────────────────────────────────────────────────────────
const ChartCard = ({ title, subtitle, children, style }) => (
  <div style={{
    background: C.white, borderRadius: 16,
    border: `1px solid ${C.border}`,
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
    padding: '24px', ...style,
  }}>
    <div style={{ marginBottom: 20 }}>
      <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: C.dark }}>{title}</p>
      {subtitle && <p style={{ margin: '3px 0 0', fontSize: 12, color: C.light }}>{subtitle}</p>}
    </div>
    {children}
  </div>
);

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: C.dark, color: '#fff', padding: '10px 14px',
      borderRadius: 10, fontSize: 12, fontWeight: 600,
      boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
    }}>
      <p style={{ margin: '0 0 6px', color: C.light, fontSize: 11 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ margin: '2px 0', color: p.color || '#fff' }}>
          {p.name}: <strong>{typeof p.value === 'number' && p.value > 1000 ? `${(p.value/1000).toFixed(1)}k` : p.value}</strong>
        </p>
      ))}
    </div>
  );
};

// ─── Legend Dot ──────────────────────────────────────────────────────────────
const Legend = ({ items }) => (
  <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
    {items.map(({ color, label }) => (
      <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        <div style={{ width: 10, height: 10, borderRadius: 3, background: color }} />
        <span style={{ fontSize: 12, fontWeight: 600, color: C.mid }}>{label}</span>
      </div>
    ))}
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const Reports = () => {
  const [reportView, setReportView]             = useState('main');
  const [toast, setToast]                       = useState(null);
  const [loading, setLoading]                   = useState(true);

  const [attendanceMonthly, setAttendanceMonthly] = useState([]);
  const [genderData, setGenderData]               = useState([]);
  const [ageGroups, setAgeGroups]                 = useState([]);
  const [teacherLanguageData, setTeacherLanguageData] = useState([]);
  const [studentFlowData, setStudentFlowData]     = useState([]);
  const [financeData, setFinanceData]             = useState([]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // ─── Supabase Fetch ────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchReportData = async () => {
      setLoading(true);
      try {
        const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        const currentYear = new Date().getFullYear();

        // Students
        const { data: students } = await supabase.from('students').select('*');
        if (students) {
          let boys = 0, girls = 0, a6_12 = 0, a13_18 = 0, a19_25 = 0, a26_plus = 0;
          let flowMap = { Jan:{a:0,d:0}, Feb:{a:0,d:0}, Mar:{a:0,d:0}, Apr:{a:0,d:0}, May:{a:0,d:0}, Jun:{a:0,d:0} };

          students.forEach(s => {
            if (s.gender?.toLowerCase() === 'female' || s.gender?.toLowerCase() === 'girl') girls++;
            else boys++;

            let age = 15;
            if (s.date_of_birth) {
              const diff = Date.now() - new Date(s.date_of_birth).getTime();
              age = Math.abs(new Date(diff).getUTCFullYear() - 1970);
            }
            if (age <= 12) a6_12++;
            else if (age <= 18) a13_18++;
            else if (age <= 25) a19_25++;
            else a26_plus++;

            if (s.enrollment_date) {
              const d = new Date(s.enrollment_date);
              if (d.getFullYear() === currentYear) {
                const mName = monthNames[d.getMonth()];
                if (flowMap[mName]) flowMap[mName].a++;
              }
            }
          });

          setGenderData([{ name: 'Female', value: girls }, { name: 'Male', value: boys }]);
          setAgeGroups([
            { group: '6–12 yrs', count: a6_12 },
            { group: '13–18 yrs', count: a13_18 },
            { group: '19–25 yrs', count: a19_25 },
            { group: '26+ yrs', count: a26_plus },
          ]);
          setStudentFlowData(Object.keys(flowMap).map(k => ({ month: k, applicants: flowMap[k].a, drops: flowMap[k].d })));
        }

        // Staff
        const { data: staff } = await supabase.from('staff').select('*').ilike('role', 'Teacher');
        if (staff) {
          const langCounts = {};
          staff.forEach(t => {
            const dept = t.department || 'General';
            langCounts[dept] = (langCounts[dept] || 0) + 1;
          });
          const facultyData = Object.keys(langCounts).map(k => ({ lang: k, count: langCounts[k] }));
          setTeacherLanguageData(facultyData.length > 0 ? facultyData : [{ lang: 'No Data', count: 0 }]);
        }

        // Finance (مع حماية Error Handling باش إذا مكانش طابلو Expenses مايحبسش الكود)
        let finMap = { Jan:{r:0,e:0}, Feb:{r:0,e:0}, Mar:{r:0,e:0}, Apr:{r:0,e:0}, May:{r:0,e:0}, Jun:{r:0,e:0} };
        
        const { data: payments } = await supabase.from('payments').select('amount, created_at, status').eq('status', 'Paid');
        if (payments) payments.forEach(p => {
          const d = new Date(p.created_at);
          if (d.getFullYear() === currentYear) { const m = monthNames[d.getMonth()]; if (finMap[m]) finMap[m].r += Number(p.amount); }
        });

        try {
          const { data: expenses } = await supabase.from('expenses').select('amount, expense_date');
          if (expenses) expenses.forEach(x => {
            const d = new Date(x.expense_date);
            if (d.getFullYear() === currentYear) { const m = monthNames[d.getMonth()]; if (finMap[m]) finMap[m].e += Number(x.amount); }
          });
        } catch (expErr) {
          console.log("Expenses table not found, skipping expenses data.");
        }
        
        setFinanceData(Object.keys(finMap).map(k => ({ month: k, revenue: finMap[k].r, expenses: finMap[k].e })));

        // Attendance
        const { data: attData } = await supabase.from('attendance').select('*');
        let attMap = { Jan:{p:0,a:0}, Feb:{p:0,a:0}, Mar:{p:0,a:0}, Apr:{p:0,a:0} };
        if (attData) attData.forEach(a => {
          const d = new Date(a.date);
          if (d.getFullYear() === currentYear) {
            const m = monthNames[d.getMonth()];
            if (attMap[m]) { if (a.status === 'present') attMap[m].p++; else if (a.status === 'absent') attMap[m].a++; }
          }
        });
        setAttendanceMonthly(Object.keys(attMap).map(k => ({ month: k, present: attMap[k].p, absent: attMap[k].a })));

      } catch (err) {
        console.error('Reports fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReportData();
  }, []);

  // ─── Colors ────────────────────────────────────────────────────────────────
  const PURPLE   = '#4318FF';
  const PURPLE2  = '#818cf8';
  const SLATE    = '#e2e8f0';
  const RED_SOFT = '#f87171';

  // ─── Report Cards (Main Menu) ──────────────────────────────────────────────
  const reportCards = [
    {
      id: 'attendance',
      title: 'Attendance',
      desc: 'Monthly presence vs. absence tracking across all classes.',
      icon: Icons.BarChart2,
      iconBg: '#eef2ff',
      iconColor: PURPLE,
      badge: 'Updated today',
      badgeBg: '#ecfdf5',
      badgeColor: C.green,
    },
    {
      id: 'finance',
      title: 'Financials',
      desc: 'Revenue vs. expenses overview and cash flow analysis.',
      icon: Icons.DollarSign,
      iconBg: '#ecfdf5',
      iconColor: C.green,
      badge: 'Current year',
      badgeBg: '#eff6ff',
      badgeColor: '#2563eb',
    },
    {
      id: 'demographics',
      title: 'Student Demographics',
      desc: 'Gender balance and age group distribution breakdown.',
      icon: Icons.Users,
      iconBg: '#fff7ed',
      iconColor: C.orange,
      badge: 'Live data',
      badgeBg: '#fff7ed',
      badgeColor: C.orange,
    },
    {
      id: 'faculty',
      title: 'Faculty Distribution',
      desc: 'Teacher counts organized by language department.',
      icon: Icons.GraduationCap,
      iconBg: '#f5f3ff',
      iconColor: '#7c3aed',
      badge: 'All staff',
      badgeBg: '#f5f3ff',
      badgeColor: '#7c3aed',
    },
    {
      id: 'flow',
      title: 'Student Flow',
      desc: 'Applicants vs. drop-off rate analysis over time.',
      icon: Icons.TrendingUp,
      iconBg: '#ecfdf5',
      iconColor: C.green,
      badge: '6-month view',
      badgeBg: '#ecfdf5',
      badgeColor: C.green,
    },
  ];

  // ─── Views ─────────────────────────────────────────────────────────────────

  const renderMainMenu = () => (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: C.dark }}>Reports Center</h1>
        <p style={{ margin: '5px 0 0', fontSize: 13, color: C.mid }}>School performance and demographic overview.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {reportCards.map((card) => {
          const IconComp = card.icon;
          return (
            <div
              key={card.id}
              onClick={() => setReportView(card.id)}
              style={{
                background: C.white, borderRadius: 16,
                border: `1px solid ${C.border}`,
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                padding: '24px', cursor: 'pointer',
                transition: 'all .2s',
                display: 'flex', flexDirection: 'column', gap: 16,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(67,24,255,0.10)';
                e.currentTarget.style.borderColor = '#e0e7ff';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)';
                e.currentTarget.style.borderColor = C.border;
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {/* Top row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{
                  width: 46, height: 46, borderRadius: 12,
                  background: card.iconBg, color: card.iconColor,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <IconComp />
                </div>
                <span style={{
                  fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20,
                  background: card.badgeBg, color: card.badgeColor,
                }}>{card.badge}</span>
              </div>

              {/* Text */}
              <div>
                <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: C.dark }}>{card.title}</p>
                <p style={{ margin: '5px 0 0', fontSize: 12, color: C.mid, lineHeight: 1.5 }}>{card.desc}</p>
              </div>

              {/* Footer */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: PURPLE }}>View Report</span>
                <span style={{ color: PURPLE, display: 'flex' }}><Icons.ChevronRight /></span>
              </div>
            </div>
          );
        })}

        {/* Summary card — spans remaining space */}
        <div style={{
          background: `linear-gradient(135deg, #4318FF 0%, #6b47ff 100%)`,
          borderRadius: 16, padding: '24px',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          boxShadow: '0 8px 24px rgba(67,24,255,0.25)',
        }}>
          <div>
            <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Polyglot Academy</p>
            <p style={{ margin: '8px 0 0', fontSize: 20, fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>Full School<br />Analytics Suite</p>
          </div>
          <p style={{ margin: '16px 0 0', fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
            Select any report category to view detailed charts and export data for your records.
          </p>
        </div>
      </div>
    </div>
  );

  // Attendance
  const renderAttendance = () => (
    <div>
      <SectionHeader title="Attendance Records" onBack={() => setReportView('main')} name="Attendance Report" showToast={showToast} />
      <ChartCard
        title="Monthly Attendance Status"
        subtitle="Present vs. absent count per month"
        style={{ height: 420, display: 'flex', flexDirection: 'column' }}
      >
        <div style={{ marginBottom: 16 }}>
          <Legend items={[{ color: PURPLE, label: 'Present' }, { color: RED_SOFT, label: 'Absent' }]} />
        </div>
        <div style={{ flex: 1 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={attendanceMonthly} barGap={6}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: C.mid }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: C.light }} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
              <Bar dataKey="present" fill={PURPLE} radius={[6,6,0,0]} name="Present" />
              <Bar dataKey="absent"  fill={RED_SOFT} radius={[6,6,0,0]} name="Absent" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </div>
  );

  // Finance
  const renderFinance = () => (
    <div>
      <SectionHeader title="Financial Summary" onBack={() => setReportView('main')} name="Financial Report" showToast={showToast} />
      <ChartCard
        title="Revenue vs. Expenses"
        subtitle="Monthly financial flow — current year"
        style={{ height: 420, display: 'flex', flexDirection: 'column' }}
      >
        <div style={{ marginBottom: 16 }}>
          <Legend items={[{ color: PURPLE, label: 'Revenue' }, { color: C.green, label: 'Expenses' }]} />
        </div>
        <div style={{ flex: 1 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={financeData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={PURPLE} stopOpacity={0.15}/>
                  <stop offset="95%" stopColor={PURPLE} stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={C.green} stopOpacity={0.15}/>
                  <stop offset="95%" stopColor={C.green} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: C.mid }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: C.light }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue"  stroke={PURPLE}   fill="url(#revGrad)" strokeWidth={2.5} name="Revenue" />
              <Area type="monotone" dataKey="expenses" stroke={C.green}  fill="url(#expGrad)" strokeWidth={2.5} name="Expenses" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </div>
  );

  // Demographics
  const renderDemographics = () => (
    <div>
      <SectionHeader title="Student Demographics" onBack={() => setReportView('main')} name="Demographics Report" showToast={showToast} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <ChartCard
          title="Gender Distribution"
          subtitle="Female vs. male enrollment ratio"
          style={{ height: 340, display: 'flex', flexDirection: 'column' }}
        >
          <div style={{ flex: 1, position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={genderData} innerRadius={70} outerRadius={100} paddingAngle={4} dataKey="value" nameKey="name">
                  <Cell fill={PURPLE} />
                  <Cell fill={PURPLE2} />
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%,-50%)',
              textAlign: 'center', pointerEvents: 'none',
            }}>
              <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: C.dark }}>
                {genderData.reduce((s,d) => s + d.value, 0)}
              </p>
              <p style={{ margin: 0, fontSize: 11, color: C.light, fontWeight: 600 }}>Total</p>
            </div>
          </div>
          <div style={{ paddingTop: 12 }}>
            <Legend items={[{ color: PURPLE, label: 'Female' }, { color: PURPLE2, label: 'Male' }]} />
          </div>
        </ChartCard>

        <ChartCard
          title="Age Distribution"
          subtitle="Student count by age group"
          style={{ height: 340, display: 'flex', flexDirection: 'column' }}
        >
          <div style={{ flex: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageGroups} layout="vertical" barSize={22}>
                <XAxis type="number" hide axisLine={false} tickLine={false} />
                <YAxis
                  dataKey="group" type="category"
                  axisLine={false} tickLine={false}
                  tick={{ fontSize: 12, fontWeight: 600, fill: C.mid }}
                  width={80}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="count" fill={PURPLE} radius={[0,6,6,0]} name="Students" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
    </div>
  );

  // Faculty
  const renderFaculty = () => (
    <div>
      <SectionHeader title="Faculty Distribution" onBack={() => setReportView('main')} name="Faculty Report" showToast={showToast} />
      <ChartCard
        title="Teachers per Language Department"
        subtitle="Headcount by assigned department"
        style={{ height: 420, display: 'flex', flexDirection: 'column' }}
      >
        <div style={{ flex: 1 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={teacherLanguageData} barSize={40}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="lang" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: C.mid }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: C.light }} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
              <Bar dataKey="count" fill={PURPLE} radius={[8,8,0,0]} name="Teachers" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </div>
  );

  // Flow
  const renderFlow = () => (
    <div>
      <SectionHeader title="Student Flow Analysis" onBack={() => setReportView('main')} name="Flow Report" showToast={showToast} />
      <ChartCard
        title="Applicants vs. Drop-offs"
        subtitle="6-month enrollment and attrition trend"
        style={{ height: 420, display: 'flex', flexDirection: 'column' }}
      >
        <div style={{ marginBottom: 16 }}>
          <Legend items={[{ color: PURPLE, label: 'Applicants' }, { color: RED_SOFT, label: 'Drop-offs' }]} />
        </div>
        <div style={{ flex: 1 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={studentFlowData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: C.mid }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: C.light }} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="applicants" stroke={PURPLE}   strokeWidth={3} dot={{ r: 5, fill: PURPLE,   strokeWidth: 0 }} activeDot={{ r: 7 }} name="Applicants" />
              <Line type="monotone" dataKey="drops"      stroke={RED_SOFT} strokeWidth={3} dot={{ r: 5, fill: RED_SOFT, strokeWidth: 0 }} activeDot={{ r: 7 }} name="Drop-offs" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </div>
  );

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div style={{ flex: 1, overflowY: 'auto', padding: 28, fontFamily: "'Inter','Segoe UI',sans-serif" }}>
        {toast && <Toast message={toast} onClose={() => setToast(null)} />}

        {loading ? (
          <div style={{ height: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
            <Icons.Loader />
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: C.mid }}>Loading report data…</p>
          </div>
        ) : (
          <>
            {reportView === 'main'         && renderMainMenu()}
            {reportView === 'attendance'   && renderAttendance()}
            {reportView === 'finance'      && renderFinance()}
            {reportView === 'demographics' && renderDemographics()}
            {reportView === 'faculty'      && renderFaculty()}
            {reportView === 'flow'         && renderFlow()}
          </>
        )}
      </div>
    </>
  );
};

export default Reports;
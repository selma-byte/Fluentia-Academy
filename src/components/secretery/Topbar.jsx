import React, { useState, useRef, useEffect } from 'react';

// ─── Icon System ──────────────────────────────────────────────────────────────
const Icons = {
  Search: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  Bell: () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  ),
  AlertTriangle: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  DollarSign: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  ),
  Clock: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  UserPlus: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="8.5" cy="7" r="4"/>
      <line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/>
    </svg>
  ),
  GraduationCap: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
      <path d="M6 12v5c3 3 9 3 12 0v-5"/>
    </svg>
  ),
  User: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  Logout: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  X: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  Send: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"/>
      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  ),
  ChevronRight: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
};

// ─── Notification item ────────────────────────────────────────────────────────
const NotifItem = ({ icon: Icon, iconBg, iconColor, title, desc, badge, onClick }) => (
  <div
    onClick={onClick}
    style={{
      display: 'flex', alignItems: 'flex-start', gap: 12,
      padding: '12px 16px', cursor: 'pointer', transition: 'background .15s',
      borderBottom: '1px solid #f8fafc',
    }}
    onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
  >
    <div style={{
      width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
      background: iconBg, color: iconColor,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <Icon />
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{title}</p>
      {desc && <p style={{ margin: '3px 0 0', fontSize: 12, color: '#64748b' }}>{desc}</p>}
      {badge && (
        <span style={{
          display: 'inline-block', marginTop: 5,
          fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20,
          background: '#fee2e2', color: '#dc2626',
        }}>{badge}</span>
      )}
    </div>
    <span style={{ color: '#cbd5e1', flexShrink: 0 }}><Icons.ChevronRight /></span>
  </div>
);

// ─── Modal base ───────────────────────────────────────────────────────────────
const Modal = ({ isOpen, onClose, accentColor, title, children }) => {
  if (!isOpen) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
      }}
    >
      <div onClick={e => e.stopPropagation()} style={{
        background: '#fff', borderRadius: 20, width: '100%', maxWidth: 460,
        boxShadow: '0 24px 64px rgba(0,0,0,0.18)', overflow: 'hidden',
      }}>
        {/* Modal header */}
        <div style={{
          padding: '18px 24px', background: accentColor,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#fff' }}>{title}</h3>
          <button onClick={onClose} style={{
            width: 30, height: 30, borderRadius: 8, border: 'none',
            background: 'rgba(255,255,255,0.2)', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}>
            <Icons.X />
          </button>
        </div>
        <div style={{ padding: '20px 24px' }}>{children}</div>
      </div>
    </div>
  );
};

// ─── Tab toggle ───────────────────────────────────────────────────────────────
const TabToggle = ({ value, onChange, options }) => (
  <div style={{
    display: 'flex', background: '#f1f5f9', borderRadius: 10, padding: 3, marginBottom: 16,
  }}>
    {options.map(opt => (
      <button key={opt.value} onClick={() => onChange(opt.value)} style={{
        flex: 1, padding: '8px 0', borderRadius: 8, border: 'none', cursor: 'pointer',
        fontSize: 12, fontWeight: 700, transition: 'all .15s',
        background: value === opt.value ? '#fff' : 'transparent',
        color: value === opt.value ? '#dc2626' : '#94a3b8',
        boxShadow: value === opt.value ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
      }}>
        {opt.label}
      </button>
    ))}
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const Topbar = ({ setActiveTab }) => {
  const [activeDropdown, setActiveDropdown]         = useState(null);
  const [hasUnread, setHasUnread]                   = useState(true);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedData, setSelectedData]             = useState({ name: '', amount: '', course: '', hasParent: true });

  const notifRef  = useRef(null);
  const profileRef = useRef(null);

  // Close dropdowns on outside click — preserves original logic
  useEffect(() => {
    const handler = e => {
      if (notifRef.current  && !notifRef.current.contains(e.target))  setActiveDropdown(prev => prev === 'notifications' ? null : prev);
      if (profileRef.current && !profileRef.current.contains(e.target)) setActiveDropdown(prev => prev === 'profile' ? null : prev);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── All original logic — UNTOUCHED ──────────────────────────────────────
  const toggleDropdown = (e, name) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const handleNavigation = (tabName) => {
    if (setActiveTab) setActiveTab(tabName);
    setActiveDropdown(null);
  };

  const handleLogout = () => {
    setActiveDropdown(null);
    if (setActiveTab) setActiveTab('Landing');
  };

  const markAllAsRead = (e) => {
    e.stopPropagation();
    setHasUnread(false);
    setActiveDropdown(null);
  };

  const triggerAttendanceAlert = (name, hasParent = true) => {
    setSelectedData({ name, amount: '', course: '', hasParent });
    setIsAttendanceModalOpen(true);
    setActiveDropdown(null);
  };

  const triggerPaymentAlert = (name, amount, course, hasParent = false) => {
    setSelectedData({ name, amount, course, hasParent });
    setIsPaymentModalOpen(true);
    setActiveDropdown(null);
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      <header style={{
        height: 64, padding: '0 28px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: '#fff', borderBottom: '1px solid #f1f5f9',
        flexShrink: 0, zIndex: 50, position: 'sticky', top: 0,
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}>

        {/* ── Search ── */}
        <div style={{ position: 'relative', width: '100%', maxWidth: 400 }}>
          <span style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
            <Icons.Search />
          </span>
          <input
            type="text"
            placeholder="Search students, teachers, or invoices..."
            style={{
              width: '100%', background: '#f8fafc', border: '1px solid #f1f5f9',
              borderRadius: 10, padding: '9px 14px 9px 38px',
              fontSize: 13, color: '#1e293b', outline: 'none',
              boxSizing: 'border-box', fontFamily: 'inherit',
            }}
            onFocus={e => { e.target.style.borderColor = '#c7d2fe'; e.target.style.background = '#fff'; }}
            onBlur={e => { e.target.style.borderColor = '#f1f5f9'; e.target.style.background = '#f8fafc'; }}
          />
        </div>

        {/* ── Right side ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>

          {/* ── Bell / Notifications ── */}
          <div ref={notifRef} style={{ position: 'relative' }}>
            <button
              onClick={e => toggleDropdown(e, 'notifications')}
              style={{
                width: 38, height: 38, borderRadius: 10,
                border: '1px solid #f1f5f9',
                background: activeDropdown === 'notifications' ? '#4318FF' : '#f8fafc',
                color: activeDropdown === 'notifications' ? '#fff' : '#64748b',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', position: 'relative', transition: 'all .15s',
              }}>
              <Icons.Bell />
              {hasUnread && (
                <span style={{
                  position: 'absolute', top: 8, right: 8,
                  width: 8, height: 8, background: '#ef4444',
                  borderRadius: '50%', border: '2px solid #fff',
                }} />
              )}
            </button>

            {/* Notifications dropdown */}
            {activeDropdown === 'notifications' && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                width: 360, background: '#fff', borderRadius: 16,
                border: '1px solid #f1f5f9', boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                zIndex: 60, overflow: 'hidden',
              }}>
                {/* Dropdown header */}
                <div style={{
                  padding: '14px 16px', borderBottom: '1px solid #f1f5f9',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  background: '#fafafa',
                }}>
                  <h3 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#1e293b' }}>Notifications</h3>
                  <button
                    onClick={markAllAsRead}
                    style={{ fontSize: 11, fontWeight: 700, color: '#4318FF', background: 'none', border: 'none', cursor: 'pointer' }}>
                    Mark all read
                  </button>
                </div>

                {/* Items — all original triggers preserved */}
                <div style={{ maxHeight: 380, overflowY: 'auto' }}>
                  <NotifItem
                    icon={Icons.AlertTriangle} iconBg="#fee2e2" iconColor="#dc2626"
                    title="Repeated absence detected"
                    desc="Omar Al-Khalil missed 3 consecutive sessions."
                    badge="Send alert"
                    onClick={() => triggerAttendanceAlert('Omar Al-Khalil', true)}
                  />
                  <NotifItem
                    icon={Icons.DollarSign} iconBg="#fff7ed" iconColor="#f97316"
                    title="Late payment — Amine Ben Ali"
                    desc="4500 DZD outstanding for English B1."
                    onClick={() => triggerPaymentAlert('Amine Ben Ali', '4500 DZD', 'English B1', false)}
                  />
                  <NotifItem
                    icon={Icons.Clock} iconBg="#fff7ed" iconColor="#f97316"
                    title="Teacher Ben Mohamed late (15 min)"
                    desc="Attendance record updated automatically."
                    onClick={() => handleNavigation('Attendance Records')}
                  />
                  <NotifItem
                    icon={Icons.UserPlus} iconBg="#f5f3ff" iconColor="#7c3aed"
                    title="New student registered"
                    desc="New enrollment in English A1."
                    onClick={() => handleNavigation('Students Management')}
                  />
                  <NotifItem
                    icon={Icons.GraduationCap} iconBg="#eff6ff" iconColor="#2563eb"
                    title="Results ready — Group 4"
                    desc="Exam results have been published."
                    onClick={() => handleNavigation('Exams')}
                  />
                </div>

                <div style={{ padding: '10px 16px', borderTop: '1px solid #f1f5f9' }}>
                  <button
                    onClick={() => setActiveDropdown(null)}
                    style={{
                      width: '100%', padding: '9px 0', borderRadius: 10,
                      border: '1px solid #e0e7ff', background: '#f5f3ff',
                      color: '#4318FF', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                    }}>
                    View All Activity
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div style={{ width: 1, height: 28, background: '#f1f5f9' }} />

          {/* ── Profile ── */}
          <div ref={profileRef} style={{ position: 'relative' }}>
            <div
              onClick={e => toggleDropdown(e, 'profile')}
              style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#1e293b' }}>Marwa</p>
                <p style={{ margin: 0, fontSize: 11, color: '#94a3b8' }}>Secretary</p>
              </div>
              <div style={{
                width: 38, height: 38, borderRadius: 10,
                background: 'linear-gradient(135deg, #4318FF, #6366f1)',
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 800, boxShadow: '0 2px 8px rgba(67,24,255,0.25)',
              }}>
                MA
              </div>
            </div>

            {/* Profile dropdown */}
            {activeDropdown === 'profile' && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                width: 200, background: '#fff', borderRadius: 14,
                border: '1px solid #f1f5f9', boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
                zIndex: 60, overflow: 'hidden',
              }}>
                <button
                  onClick={() => setActiveDropdown(null)}
                  style={{
                    width: '100%', padding: '12px 16px', textAlign: 'left',
                    background: 'transparent', border: 'none', borderBottom: '1px solid #f8fafc',
                    fontSize: 13, fontWeight: 600, color: '#1e293b', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 10,
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <span style={{ color: '#4318FF' }}><Icons.User /></span>
                  My Profile
                </button>
                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%', padding: '12px 16px', textAlign: 'left',
                    background: 'transparent', border: 'none',
                    fontSize: 13, fontWeight: 700, color: '#ef4444', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 10,
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <Icons.Logout />
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── Attendance Alert Modal ── */}
      <Modal
        isOpen={isAttendanceModalOpen}
        onClose={() => setIsAttendanceModalOpen(false)}
        accentColor="#dc2626"
        title="Attendance Alert"
      >
        <TabToggle
          value={selectedData.hasParent ? 'parent' : 'student'}
          onChange={v => setSelectedData(prev => ({ ...prev, hasParent: v === 'parent' }))}
          options={[
            { value: 'student', label: 'Direct to Student' },
            { value: 'parent',  label: 'To Parent / Guardian' },
          ]}
        />
        <div style={{ marginBottom: 12 }}>
          <p style={{ margin: 0, fontSize: 12, color: '#64748b', fontWeight: 600 }}>
            Recipient:&nbsp;
            <span style={{ fontWeight: 800, color: '#dc2626' }}>
              {selectedData.hasParent ? `Parent of ${selectedData.name}` : selectedData.name}
            </span>
          </p>
        </div>
        <textarea
          readOnly
          value={selectedData.hasParent
            ? `Dear Parent, we would like to inform you that ${selectedData.name} has been absent for 3 consecutive sessions. Please provide justification.`
            : `Dear ${selectedData.name}, we have noticed repeated absences from your sessions. Please contact the administration.`}
          style={{
            width: '100%', height: 104, background: '#f8fafc', borderRadius: 10,
            border: '1px solid #f1f5f9', padding: '12px 14px', fontSize: 13,
            resize: 'none', outline: 'none', fontFamily: 'inherit', color: '#1e293b',
            boxSizing: 'border-box',
          }}
        />
        <button
          onClick={() => { setIsAttendanceModalOpen(false); handleNavigation('Communicate Parents'); }}
          style={{
            width: '100%', marginTop: 14, padding: '12px 0', borderRadius: 10, border: 'none',
            background: '#dc2626', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            transition: 'background .15s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#b91c1c'}
          onMouseLeave={e => e.currentTarget.style.background = '#dc2626'}
        >
          <Icons.Send /> Send Alert
        </button>
      </Modal>

      {/* ── Payment Reminder Modal ── */}
      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        accentColor="#f97316"
        title="Payment Reminder"
      >
        {!selectedData.hasParent && (
          <div style={{
            background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 10,
            padding: '8px 12px', marginBottom: 14, fontSize: 12, color: '#c2410c', fontWeight: 700,
          }}>
            Note: No parent registered for this student. Message will be sent directly.
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
          {[
            { label: 'Course', value: selectedData.course },
            { label: 'Amount', value: selectedData.amount },
          ].map(({ label, value }) => (
            <div key={label} style={{ background: '#fff7ed', borderRadius: 10, padding: '10px 14px', border: '1px solid #fed7aa', textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
              <p style={{ margin: '4px 0 0', fontSize: 13, fontWeight: 800, color: '#c2410c' }}>{value || '—'}</p>
            </div>
          ))}
        </div>
        <textarea
          readOnly
          value={`Please be reminded that the amount of ${selectedData.amount} for the ${selectedData.course} course is outstanding. Kindly proceed with the payment at your earliest convenience.`}
          style={{
            width: '100%', height: 88, background: '#f8fafc', borderRadius: 10,
            border: '1px solid #f1f5f9', padding: '12px 14px', fontSize: 13,
            resize: 'none', outline: 'none', fontFamily: 'inherit', color: '#1e293b',
            boxSizing: 'border-box',
          }}
        />
        <button
          onClick={() => { setIsPaymentModalOpen(false); handleNavigation('Payment'); }}
          style={{
            width: '100%', marginTop: 14, padding: '12px 0', borderRadius: 10, border: 'none',
            background: '#f97316', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            transition: 'background .15s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#ea580c'}
          onMouseLeave={e => e.currentTarget.style.background = '#f97316'}
        >
          <Icons.Send /> Send Reminder
        </button>
      </Modal>
    </>
  );
};

export default Topbar;
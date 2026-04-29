import React, { useState } from 'react';

// ─── Component imports — paths UNTOUCHED ─────────────────────────────────────
import Enrollment    from '../secretery/Enrollment';
import SchoolSchedule from '../secretery/SchoolSchedule';
import Appointments  from '../secretery/Appointments';

// ─── Icons ────────────────────────────────────────────────────────────────────
const Ic = {
  Users: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  Calendar: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  Clock: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
};

// ─── Tab definitions ──────────────────────────────────────────────────────────
const TABS = [
  { key: 'enrollment',   label: 'Groups & Enrollment', Icon: Ic.Users    },
  { key: 'classes',      label: 'Classes Timetable',   Icon: Ic.Calendar },
  { key: 'appointments', label: 'Appointments',         Icon: Ic.Clock    },
];

// ─── Main Component ───────────────────────────────────────────────────────────
const SchedulingHub = () => {
  // ── ALL ORIGINAL STATE — UNTOUCHED ──────────────────────────────────────
  const [mainTab, setMainTab] = useState('enrollment');
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <>
      <style>{`* { box-sizing: border-box; }`}</style>

      <div style={{
        width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column',
        fontFamily: "'Inter','Segoe UI',sans-serif",
      }}>

        {/* ── Page header ── */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'flex-start', marginBottom: 22, flexShrink: 0,
        }}>
          <div>
            <h2 style={{
              margin: 0, fontSize: 22, fontWeight: 800,
              color: '#1e293b', letterSpacing: '-0.01em',
            }}>
              Scheduling &amp; Management Hub
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>
              Manage groups, class timetables and private appointments
            </p>
          </div>

          {/* ── Tab bar — matches dashboard style exactly ── */}
          <div style={{
            display: 'flex', gap: 2,
            background: '#f8fafc',
            border: '1px solid #f1f5f9',
            borderRadius: 12, padding: 4,
            flexShrink: 0,
          }}>
            {TABS.map(({ key, label, Icon }) => {
              const isActive = mainTab === key;
              return (
                <button
                  key={key}
                  onClick={() => setMainTab(key)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 7,
                    padding: '9px 18px', borderRadius: 9, border: 'none',
                    fontSize: 13, fontWeight: 700, cursor: 'pointer',
                    transition: 'all 0.15s',
                    background:  isActive ? '#fff'         : 'transparent',
                    color:       isActive ? '#4318FF'      : '#94a3b8',
                    boxShadow:   isActive ? '0 1px 6px rgba(0,0,0,0.09)' : 'none',
                    fontFamily: "'Inter','Segoe UI',sans-serif",
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      e.currentTarget.style.color      = '#1e293b';
                      e.currentTarget.style.background = 'rgba(255,255,255,0.6)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      e.currentTarget.style.color      = '#94a3b8';
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  <span style={{ color: isActive ? '#4318FF' : '#94a3b8', transition: 'color 0.15s' }}>
                    <Icon />
                  </span>
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Active indicator bar under header ── */}
        <div style={{
          height: 1, background: '#f1f5f9',
          marginBottom: 22, flexShrink: 0,
        }}>
          <div style={{
            height: '100%',
            width: mainTab === 'enrollment'   ? '33.3%'
                 : mainTab === 'classes'      ? '33.3%'
                 : '33.3%',
            background: '#4318FF',
            borderRadius: 1,
            transition: 'transform 0.25s cubic-bezier(.4,0,.2,1)',
            transform: mainTab === 'enrollment'   ? 'translateX(0%)'
                     : mainTab === 'classes'      ? 'translateX(100%)'
                     : 'translateX(200%)',
          }}/>
        </div>

        {/* ── Sub-page content — ALL ORIGINAL ROUTING UNTOUCHED ── */}
        <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', position: 'relative' }}>
          {mainTab === 'enrollment'   && <Enrollment />}
          {mainTab === 'classes'      && <SchoolSchedule />}
          {mainTab === 'appointments' && <Appointments />}
        </div>

      </div>
    </>
  );
};

export default SchedulingHub;
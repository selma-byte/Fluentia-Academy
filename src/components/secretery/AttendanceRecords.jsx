import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
  primary:      '#4318FF',
  primaryLight: '#eef2ff',
  navy:         '#0f172a',
  white:        '#ffffff',
  pageBg:       '#f8fafc',
  border:       '#f1f5f9',
  borderMid:    '#e2e8f0',
  textDark:     '#1e293b',
  textMid:      '#64748b',
  textMuted:    '#94a3b8',
  success:      '#059669',
  successBg:    '#ecfdf5',
  danger:       '#dc2626',
  dangerBg:     '#fef2f2',
  warning:      '#d97706',
  warningBg:    '#fffbeb',
  blue:         '#2563eb',
  blueBg:       '#eff6ff',
  orange:       '#f97316',
  orangeBg:     '#fff7ed',
};

// ─── Icon System ──────────────────────────────────────────────────────────────
const Ic = {
  Search:     () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  User:       () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  ArrowLeft:  () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  ChevronRight: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  Lock:       () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  Clock:      () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Calendar:   () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  AlertTriangle: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
};

// ─── Shared Input Styles ──────────────────────────────────────────────────────
const inputBase = {
  width: '100%', background: C.pageBg,
  border: `1.5px solid ${C.borderMid}`, borderRadius: 10,
  padding: '8px 12px', fontSize: 12.5,
  fontFamily: "'Inter','Segoe UI',sans-serif",
  color: C.textDark, outline: 'none', boxSizing: 'border-box',
  transition: 'border-color 0.2s, box-shadow 0.2s, background 0.2s',
};
const onFocus = e => { e.target.style.borderColor = C.primary; e.target.style.boxShadow = '0 0 0 3px rgba(67,24,255,0.09)'; e.target.style.background = C.white; };
const onBlur  = e => { e.target.style.borderColor = C.borderMid; e.target.style.boxShadow = 'none'; e.target.style.background = C.pageBg; };
const selectStyle = { ...inputBase, cursor: 'pointer', appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center', paddingRight: 30 };

// ─── Table Primitives ─────────────────────────────────────────────────────────
const Th = ({ children, center }) => (
  <th style={{ padding: '11px 16px', background: C.pageBg, borderBottom: `1px solid ${C.borderMid}`, textAlign: center ? 'center' : 'left', fontSize: 10.5, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap', position: 'sticky', top: 0 }}>
    {children}
  </th>
);
const Td = ({ children, center, style = {} }) => (
  <td style={{ padding: '12px 16px', borderBottom: `1px solid ${C.border}`, verticalAlign: 'middle', textAlign: center ? 'center' : 'left', fontSize: 13, ...style }}>
    {children}
  </td>
);
const TableWrap = ({ children }) => (
  <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', overflow: 'auto' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>{children}</table>
  </div>
);

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, accentColor }) => (
  <div style={{
    background: C.white, borderRadius: 16, padding: '20px 24px',
    border: `1px solid ${C.border}`, boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
    borderBottom: `3px solid ${accentColor}`,
  }}>
    <p style={{ margin: '0 0 8px', fontSize: 10.5, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{label}</p>
    <p style={{ margin: 0, fontSize: 30, fontWeight: 800, color: C.textDark, lineHeight: 1 }}>{value}</p>
  </div>
);

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    'Present': { color: C.success,  bg: C.successBg  },
    'Absent':  { color: C.danger,   bg: C.dangerBg   },
    'Late':    { color: C.orange,   bg: C.orangeBg   },
  };
  const s = map[status] || { color: C.textMid, bg: C.border };
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, color: s.color, background: s.bg, padding: '3px 10px', borderRadius: 20 }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.color, flexShrink: 0 }} />{status}
    </span>
  );
};

// ─── Filter Bar ───────────────────────────────────────────────────────────────
const FieldLabel = ({ children, highlight }) => (
  <label style={{ display: 'block', fontSize: 10.5, fontWeight: 700, color: highlight ? C.primary : C.textMuted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>
    {children}
  </label>
);

// ─── Avatar ───────────────────────────────────────────────────────────────────
const Avatar = ({ firstName, lastName, size = 36 }) => (
  <div style={{
    width: size, height: size, borderRadius: '50%', flexShrink: 0,
    background: C.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: size * 0.35, fontWeight: 800, color: C.primary,
  }}>
    {(firstName?.[0] || '?').toUpperCase()}{(lastName?.[0] || '').toUpperCase()}
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const AttendanceRecords = () => {
  const [activeMode,        setActiveMode]        = useState('daily');
  const [currentView,       setCurrentView]       = useState('list');
  const [selectedStudent,   setSelectedStudent]   = useState(null);

  // ALL ORIGINAL STATE — UNTOUCHED
  const [filterLang,        setFilterLang]        = useState('All');
  const [filterLevel,       setFilterLevel]       = useState('All');
  const [filterGroup,       setFilterGroup]       = useState('All');
  const [filterTime,        setFilterTime]        = useState('All');
  const [attendanceDate,    setAttendanceDate]    = useState(new Date().toISOString().split('T')[0]);
  const [studentsData,      setStudentsData]      = useState([]);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [attendanceState,   setAttendanceState]   = useState({});

  // ALL ORIGINAL SUPABASE LOGIC — COMPLETELY UNTOUCHED
  const fetchAttendanceData = async () => {
    try {
      const { data: students } = await supabase.from('students').select('*').eq('status', 'Active');
      if (students) {
        setStudentsData(students.map(s => ({
          id: s.id, firstName: s.first_name || '', lastName: s.last_name || '',
          email: s.email || '', language: s.language || '', level: s.level || '', group: s.group_name || '',
        })));
      }

      const { data: attendanceLogs } = await supabase.from('attendance').select('*').order('date', { ascending: true });
      if (attendanceLogs) {
        let groupSessionsCount = {};
        const formattedLogs = attendanceLogs.map(a => {
          const cleanDate     = a.date      ? a.date.split('T')[0].split(' ')[0] : '';
          const cleanTimeSlot = a.time_slot ? a.time_slot.trim() : '';
          const cleanStatus   = a.status    ? a.status.charAt(0).toUpperCase() + a.status.slice(1).toLowerCase() : '';
          const groupKey      = `${a.course}_${cleanDate}_${cleanTimeSlot}`;
          if (!groupSessionsCount[a.course]) groupSessionsCount[a.course] = [];
          if (!groupSessionsCount[a.course].includes(groupKey)) groupSessionsCount[a.course].push(groupKey);
          const sessionNum = groupSessionsCount[a.course].indexOf(groupKey) + 1;
          return { studentId: a.student_id, studentName: a.student_name, language: a.course, date: cleanDate, timeSlot: cleanTimeSlot, status: cleanStatus, sessionNumber: `Session ${sessionNum.toString().padStart(2, '0')}` };
        });
        setAttendanceHistory(formattedLogs);
      }
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    }
  };

  useEffect(() => { fetchAttendanceData(); }, []);

  useEffect(() => {
    const todayLogs = attendanceHistory.filter(log => {
      const dbDate    = log.date           ? String(log.date).substring(0, 10)           : '';
      const uiDate    = attendanceDate     ? String(attendanceDate).substring(0, 10)     : '';
      const isDateMatch = dbDate === uiDate;
      const isTimeMatch = filterTime === 'All' || (log.timeSlot && log.timeSlot.trim() === filterTime.trim());
      return isDateMatch && isTimeMatch;
    });
    const todayState = {};
    todayLogs.forEach(log => {
      if (log.studentId)   todayState[`id_${log.studentId}`]                                    = log.status;
      if (log.studentName) todayState[`name_${log.studentName.trim().toLowerCase()}`]           = log.status;
    });
    setAttendanceState(todayState);
  }, [attendanceDate, filterTime, attendanceHistory]);

  const handleStatusToggle = () => {
    alert("Read-only view: Only the assigned teacher may record or modify attendance.");
  };

  // ALL ORIGINAL DERIVED DATA — UNTOUCHED
  const uniqueLanguages  = [...new Set(studentsData.map(s => s.language).filter(Boolean))];
  const uniqueLevels     = [...new Set(studentsData.map(s => s.level).filter(Boolean))];
  const uniqueGroups     = [...new Set(studentsData.map(s => s.group).filter(Boolean))];
  const uniqueTimeSlots  = [...new Set(attendanceHistory.map(a => a.timeSlot).filter(Boolean))];

  const filteredStudents = studentsData.filter(s =>
    (filterLang  === 'All' || s.language === filterLang) &&
    (filterLevel === 'All' || s.level    === filterLevel) &&
    (filterGroup === 'All' || s.group    === filterGroup)
  );

  const filteredLogs = attendanceHistory.filter(log =>
    (filterLang  === 'All' || log.language === filterLang) &&
    (filterLevel === 'All' || log.level    === filterLevel) &&
    (filterGroup === 'All' || log.language === filterGroup) &&
    (filterTime  === 'All' || log.timeSlot === filterTime)
  );

  const totalStudents        = filteredStudents.length;
  const presentCount         = filteredStudents.filter(s => attendanceState[`id_${s.id}`] === 'Present').length;
  const absentCount          = filteredStudents.filter(s => attendanceState[`id_${s.id}`] === 'Absent').length;
  const lateCount            = filteredStudents.filter(s => attendanceState[`id_${s.id}`] === 'Late').length;
  const attendancePercentage = totalStudents === 0 ? 0 : Math.round(((presentCount + lateCount) / totalStudents) * 100);

  const openStudentProfile = (student) => {
    if (!student) return;
    setSelectedStudent(student);
    setCurrentView('profile');
  };

  // ─── Fixed time slots fallback (original logic) ───────────────────────────
  const fallbackSlots = ['08:00 - 10:00', '10:00 - 12:00', '14:00 - 16:00', '16:00 - 18:00'];
  const allTimeSlots  = [...new Set([...uniqueTimeSlots, ...fallbackSlots.filter(t => !uniqueTimeSlots.includes(t))])];

  // ─── View: Student Profile ────────────────────────────────────────────────
  const renderStudentProfile = () => {
    if (!selectedStudent) return null;
    const fullName   = `${selectedStudent.firstName} ${selectedStudent.lastName}`.trim().toLowerCase();
    const studentLogs = attendanceHistory.filter(log =>
      String(log.studentId) === String(selectedStudent.id) ||
      (log.studentName && log.studentName.trim().toLowerCase() === fullName)
    );
    const stdTotal   = studentLogs.length;
    const stdPresent = studentLogs.filter(l => l.status === 'Present').length;
    const stdAbsent  = studentLogs.filter(l => l.status === 'Absent').length;
    const stdLate    = studentLogs.filter(l => l.status === 'Late').length;
    const stdRate    = stdTotal === 0 ? 0 : Math.round(((stdPresent + stdLate) / stdTotal) * 100);

    return (
      <div style={{ flex: 1, overflowY: 'auto', padding: 28 }}>
        {/* Back */}
        <button onClick={() => setCurrentView('list')}
          style={{ width: 36, height: 36, borderRadius: '50%', background: C.white, border: `1px solid ${C.borderMid}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: C.textMid, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: 24 }}>
          <Ic.ArrowLeft />
        </button>

        {/* Profile header */}
        <div style={{ background: C.white, borderRadius: 16, border: `1px solid ${C.border}`, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', padding: '24px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 20 }}>
          <Avatar firstName={selectedStudent.firstName} lastName={selectedStudent.lastName} size={64} />
          <div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: C.textDark }}>{selectedStudent.firstName} {selectedStudent.lastName}</h2>
            <p style={{ margin: '4px 0 0', fontSize: 12, color: C.textMuted }}>
              ID: {selectedStudent.id} &nbsp;·&nbsp; {selectedStudent.language} {selectedStudent.level} &nbsp;·&nbsp; {selectedStudent.group || 'No Group'}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 20 }}>
          <StatCard label="Total Present"    value={stdPresent} accentColor={C.success} />
          <StatCard label="Total Absent"     value={stdAbsent}  accentColor={C.danger} />
          <StatCard label="Total Late"       value={stdLate}    accentColor={C.orange} />
          <div style={{ background: C.primary, borderRadius: 16, padding: '20px 24px', boxShadow: '0 4px 14px rgba(67,24,255,0.22)' }}>
            <p style={{ margin: '0 0 8px', fontSize: 10.5, fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Attendance Rate</p>
            <p style={{ margin: 0, fontSize: 30, fontWeight: 800, color: '#fff', lineHeight: 1 }}>{stdRate}%</p>
          </div>
        </div>

        {/* History table */}
        <div style={{ background: C.white, borderRadius: 16, border: `1px solid ${C.border}`, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', padding: '20px' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 800, color: C.textDark }}>Personal Attendance Log</h3>
          <TableWrap>
            <thead>
              <tr><Th>Session</Th><Th>Date</Th><Th>Time Slot</Th><Th center>Status</Th></tr>
            </thead>
            <tbody>
              {studentLogs.length === 0 ? (
                <tr><td colSpan="4" style={{ padding: '48px 0', textAlign: 'center', color: C.textMuted, fontSize: 13, fontWeight: 600 }}>No attendance records found for this student.</td></tr>
              ) : (
                [...studentLogs].reverse().map((log, idx) => (
                  <tr key={idx}
                    onMouseEnter={e => e.currentTarget.style.background = C.pageBg}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    style={{ transition: 'background 0.12s' }}
                  >
                    <Td>
                      <span style={{ fontSize: 11, fontWeight: 700, color: C.primary, background: C.primaryLight, padding: '3px 10px', borderRadius: 20 }}>
                        {log.sessionNumber}
                      </span>
                    </Td>
                    <Td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ color: C.textMuted, display: 'flex' }}><Ic.Calendar /></span>
                        <span style={{ fontWeight: 600, color: C.textDark }}>{log.date}</span>
                      </div>
                    </Td>
                    <Td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ color: C.textMuted, display: 'flex' }}><Ic.Clock /></span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: C.blue, background: C.blueBg, padding: '3px 10px', borderRadius: 20 }}>{log.timeSlot}</span>
                      </div>
                    </Td>
                    <Td center><StatusBadge status={log.status} /></Td>
                  </tr>
                ))
              )}
            </tbody>
          </TableWrap>
        </div>
      </div>
    );
  };

  // ─── View: Daily Tracking ─────────────────────────────────────────────────
  const renderDailyTracking = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, flexShrink: 0 }}>
        <StatCard label="Total Students"  value={totalStudents}        accentColor={C.blue}    />
        <StatCard label="Present Today"   value={presentCount}         accentColor={C.success} />
        <StatCard label="Absent Today"    value={absentCount}          accentColor={C.danger}  />
        <StatCard label="Attendance Rate" value={`${attendancePercentage}%`} accentColor={C.primary} />
      </div>

      {/* Warning if no time slot selected */}
      {filterTime === 'All' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: C.warningBg, borderRadius: 10, border: `1px solid #fde68a` }}>
          <span style={{ color: C.warning, display: 'flex', flexShrink: 0 }}><Ic.AlertTriangle /></span>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: C.warning }}>
            Please select a <strong>Time Slot</strong> from the filters above to view attendance status.
          </p>
        </div>
      )}

      {/* Roster table */}
      <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}` }}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: C.textDark }}>Student Roster</h3>
          <p style={{ margin: '3px 0 0', fontSize: 12, color: C.textMuted }}>{filteredStudents.length} students listed</p>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr><Th>Student</Th><Th>Student ID</Th><Th center>Attendance Status</Th><Th center>History</Th></tr>
          </thead>
          <tbody>
            {filteredStudents.map(student => {
              const fullName   = `${student.firstName} ${student.lastName}`.trim().toLowerCase();
              const status     = attendanceState[`id_${student.id}`] || attendanceState[`name_${fullName}`] || null;
              const isDisabled = filterTime === 'All';

              return (
                <tr key={student.id}
                  onMouseEnter={e => e.currentTarget.style.background = C.pageBg}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  style={{ transition: 'background 0.12s', opacity: isDisabled ? 0.5 : 1 }}
                >
                  <Td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }} onClick={() => openStudentProfile(student)}>
                      <Avatar firstName={student.firstName} lastName={student.lastName} />
                      <div>
                        <p style={{ margin: 0, fontWeight: 700, color: C.textDark }}>{student.firstName} {student.lastName}</p>
                        <p style={{ margin: '2px 0 0', fontSize: 11, color: C.textMuted }}>{student.language} · {student.level}</p>
                      </div>
                    </div>
                  </Td>
                  <Td>
                    <span style={{ fontSize: 12, fontWeight: 700, color: C.textMuted }}>STD-{student.id}</span>
                  </Td>
                  <Td center>
                    {/* Read-only status toggle — original logic preserved */}
                    <div style={{ display: 'inline-flex', background: C.pageBg, borderRadius: 10, padding: 3, gap: 2, border: `1px solid ${C.border}` }}>
                      {['Present', 'Absent', 'Late'].map(s => {
                        const isActive = status === s;
                        const colMap   = { Present: C.success, Absent: C.danger, Late: C.orange };
                        return (
                          <button
                            key={s}
                            onClick={handleStatusToggle}
                            title="Read-only — assigned teacher only"
                            style={{
                              padding: '5px 12px', borderRadius: 7, border: 'none', fontSize: 11, fontWeight: 700,
                              cursor: 'not-allowed',
                              background: isActive ? C.white : 'transparent',
                              color: isActive ? colMap[s] : C.textMuted,
                              boxShadow: isActive ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                              transition: 'all 0.15s',
                              fontFamily: "'Inter','Segoe UI',sans-serif",
                              display: 'inline-flex', alignItems: 'center', gap: 4,
                            }}
                          >
                            {isActive && <span style={{ width: 6, height: 6, borderRadius: '50%', background: colMap[s], flexShrink: 0 }} />}
                            {s}
                          </button>
                        );
                      })}
                    </div>
                    {!status && !isDisabled && (
                      <p style={{ margin: '4px 0 0', fontSize: 10, color: C.textMuted, fontWeight: 600 }}>Not recorded</p>
                    )}
                  </Td>
                  <Td center>
                    <button
                      onClick={() => openStudentProfile(student)}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700, color: C.primary, background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: 6, transition: 'all 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = C.primaryLight}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    >
                      View History <Ic.ChevronRight />
                    </button>
                  </Td>
                </tr>
              );
            })}
            {filteredStudents.length === 0 && (
              <tr><td colSpan="4" style={{ padding: '48px 0', textAlign: 'center', color: C.textMuted, fontSize: 13, fontWeight: 600 }}>No students match the selected filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  // ─── View: Global History ─────────────────────────────────────────────────
  const renderGlobalHistory = () => (
    <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
      <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}` }}>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: C.textDark }}>Past Attendance Records</h3>
        <p style={{ margin: '3px 0 0', fontSize: 12, color: C.textMuted }}>{filteredLogs.length} records found</p>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr><Th>Date & Time</Th><Th>Session</Th><Th>Student Name</Th><Th>Language / ID</Th><Th center>Status</Th></tr>
        </thead>
        <tbody>
          {filteredLogs.length > 0 ? [...filteredLogs].reverse().map((log, idx) => (
            <tr key={idx}
              onMouseEnter={e => e.currentTarget.style.background = C.pageBg}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              style={{ transition: 'background 0.12s' }}
            >
              <Td>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ color: C.textMuted, display: 'flex' }}><Ic.Calendar /></span>
                    <span style={{ fontWeight: 700, color: C.textDark, fontSize: 12.5 }}>{log.date}</span>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: C.blue, background: C.blueBg, padding: '2px 8px', borderRadius: 20, width: 'fit-content' }}>{log.timeSlot}</span>
                </div>
              </Td>
              <Td>
                <span style={{ fontSize: 11, fontWeight: 700, color: C.primary, background: C.primaryLight, padding: '3px 10px', borderRadius: 20 }}>
                  {log.sessionNumber}
                </span>
              </Td>
              <Td>
                <button
                  onClick={() => openStudentProfile(studentsData.find(s => s.id === log.studentId))}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, color: C.textDark, fontSize: 13, padding: 0, transition: 'color 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.color = C.primary}
                  onMouseLeave={e => e.currentTarget.style.color = C.textDark}
                >
                  {log.studentName}
                </button>
              </Td>
              <Td>
                <span style={{ fontSize: 11, color: C.textMuted, fontWeight: 600 }}>{log.language} · #{log.studentId}</span>
              </Td>
              <Td center><StatusBadge status={log.status} /></Td>
            </tr>
          )) : (
            <tr><td colSpan="5" style={{ padding: '48px 0', textAlign: 'center', color: C.textMuted, fontSize: 13, fontWeight: 600 }}>No historical records found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        input::placeholder { color: #94a3b8; }
        select option { color: #1e293b; background: #fff; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: C.pageBg, fontFamily: "'Inter','Segoe UI',sans-serif" }}>

        {currentView === 'profile' ? (
          renderStudentProfile()
        ) : (
          <>
            {/* ── Page header + tabs + filters ── */}
            <div style={{ padding: '24px 28px 0', flexShrink: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 }}>
                <div>
                  <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: C.textDark }}>Attendance Tracking</h1>
                  <p style={{ margin: '4px 0 0', fontSize: 13, color: C.textMuted }}>Monitor student presence and absence records</p>
                </div>

                {/* Mode toggle */}
                <div style={{ display: 'flex', background: C.pageBg, borderRadius: 9, padding: 3, border: `1px solid ${C.border}`, gap: 2 }}>
                  {[
                    { key: 'daily',   label: 'Daily Tracking'      },
                    { key: 'history', label: 'Absence History Log'  },
                  ].map(m => (
                    <button key={m.key} onClick={() => setActiveMode(m.key)}
                      style={{
                        padding: '7px 18px', borderRadius: 7, border: 'none', fontSize: 12.5, fontWeight: 700,
                        cursor: 'pointer', transition: 'all 0.15s',
                        background: activeMode === m.key ? C.white : 'transparent',
                        color: activeMode === m.key ? C.primary : C.textMuted,
                        boxShadow: activeMode === m.key ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                        fontFamily: "'Inter','Segoe UI',sans-serif",
                      }}
                    >{m.label}</button>
                  ))}
                </div>
              </div>

              {/* Filter bar */}
              <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', padding: '16px 20px', marginBottom: 20, display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 16 }}>
                <div>
                  <FieldLabel>Language</FieldLabel>
                  <select value={filterLang} onChange={e => setFilterLang(e.target.value)} style={selectStyle} onFocus={onFocus} onBlur={onBlur}>
                    <option value="All">All</option>
                    {uniqueLanguages.map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <FieldLabel>Level</FieldLabel>
                  <select value={filterLevel} onChange={e => setFilterLevel(e.target.value)} style={selectStyle} onFocus={onFocus} onBlur={onBlur}>
                    <option value="All">All</option>
                    {uniqueLevels.map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <FieldLabel>Group</FieldLabel>
                  <select value={filterGroup} onChange={e => setFilterGroup(e.target.value)} style={selectStyle} onFocus={onFocus} onBlur={onBlur}>
                    <option value="All">All</option>
                    {uniqueGroups.map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <FieldLabel>Date</FieldLabel>
                  <input type="date" value={attendanceDate} onChange={e => setAttendanceDate(e.target.value)} style={inputBase} onFocus={onFocus} onBlur={onBlur} />
                </div>
                <div>
                  <FieldLabel highlight>Time Slot *</FieldLabel>
                  <select value={filterTime} onChange={e => setFilterTime(e.target.value)}
                    style={{ ...selectStyle, borderColor: filterTime === 'All' ? '#fde68a' : C.primary, background: filterTime === 'All' ? C.warningBg : C.primaryLight, color: filterTime === 'All' ? C.warning : C.primary }}
                    onFocus={onFocus} onBlur={onBlur}
                  >
                    <option value="All">— Select Time —</option>
                    {allTimeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* ── Tab content ── */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '0 28px 28px', display: 'flex', flexDirection: 'column', gap: 0 }}>
              {activeMode === 'daily'   && renderDailyTracking()}
              {activeMode === 'history' && renderGlobalHistory()}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default AttendanceRecords;
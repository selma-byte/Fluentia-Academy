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
  Search:   (c='#94a3b8') => <Ico d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0" color={c} />,
  Check:    (c='#059669') => <Ico d="M20 6L9 17l-5-5" color={c} sw={2.5} />,
  X:        (c='#ef4444') => <Ico d={["M18 6L6 18","M6 6l12 12"]} color={c} sw={2.5} />,
  ChevronR: (c='#94a3b8') => <Ico d="M9 18l6-6-6-6" color={c} sw={2.5} />,
  Save:     () => <Ico d={["M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z","M17 21v-8H7v8","M7 3v5h8"]} color="#fff" />,
  Clipboard:() => <Ico d={["M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2","M9 2h6a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z"]} color="#4318FF" />,
  Trophy:   () => <Ico d={["M8 21h8","M12 17v4","M6.5 3h11","M17.5 3C17.5 9 12 13 12 13S6.5 9 6.5 3"]} color="#4318FF" extra={<path d="M17.5 3c0 0 1.5 1.5 1.5 4s-3.5 6-7 6S5 10.5 5 7s1.5-4 1.5-4" fill="none" stroke="#4318FF" strokeWidth="2"/>} />,
  BarChart: () => <Ico d={["M18 20V10","M12 20V4","M6 20v-6"]} color="#4318FF" extra={<line x1="2" y1="20" x2="22" y2="20" stroke="#4318FF" strokeWidth="2"/>} />,
  Alert:    (c='#ef4444') => <Ico d={["M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0","M12 9v4","M12 17h.01"]} color={c} />,
  User:     (c='#4318FF') => <Ico d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" color={c} extra={<circle cx="12" cy="7" r="4" fill="none" stroke={c} strokeWidth="2"/>} />,
  Clock:    (c='#94a3b8') => <Ico d="M12 6v6l4 2" color={c} extra={<circle cx="12" cy="12" r="10" fill="none" stroke={c} strokeWidth="2"/>} />,
  Eye:      () => <Ico d={["M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8"]} color="#4318FF" extra={<circle cx="12" cy="12" r="3" fill="none" stroke="#4318FF" strokeWidth="2"/>} />,
};

// ─── Reusable Tab Bar ─────────────────────────────────────────────
const TabBar = ({ tabs, active, onChange }) => (
  <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid #f1f5f9', marginBottom: 28 }}>
    {tabs.map(tab => (
      <button key={tab} onClick={() => onChange(tab)} style={{
        padding: '12px 20px', fontSize: 13, fontWeight: 700,
        color: active === tab ? '#4318FF' : '#94a3b8',
        background: 'none', border: 'none', cursor: 'pointer',
        borderBottom: active === tab ? '2px solid #4318FF' : '2px solid transparent',
        marginBottom: -1, transition: 'all .2s', whiteSpace: 'nowrap',
      }}>{tab}</button>
    ))}
  </div>
);

// ─── Page Section Header ──────────────────────────────────────────
const SectionHeader = ({ title, subtitle }) => (
  <div style={{ marginBottom: 24 }}>
    <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#1e293b' }}>{title}</h2>
    {subtitle && <p style={{ margin: '4px 0 0', fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{subtitle}</p>}
  </div>
);

// ─── Card wrapper ─────────────────────────────────────────────────
const Card = ({ children, style = {} }) => (
  <div style={{
    background: '#fff', borderRadius: 16,
    border: '1px solid #f1f5f9',
    boxShadow: '0 1px 4px rgba(15,23,42,0.05)',
    ...style
  }}>{children}</div>
);

// ─────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────
const ClassroomTasks = () => {

  // ── All original states — UNTOUCHED ──────────────────────────────
  const [activeTab, setActiveTab]               = useState('Attendance');
  const [selectedClass, setSelectedClass]       = useState('');
  const [timeSlot, setTimeSlot]                 = useState('08:00 - 10:00');
  const [classes, setClasses]                   = useState([]);
  const [students, setStudents]                 = useState([]);
  const [loading, setLoading]                   = useState(false);
  const [attendanceData, setAttendanceData]     = useState({});
  const [gradesDataInput, setGradesDataInput]   = useState({});
  const [currentTeacherId, setCurrentTeacherId] = useState(null);
  const [currentTeacher, setCurrentTeacher]     = useState('Teacher Name');
  const [assignedExams, setAssignedExams]       = useState([]);
  const [placementStudents, setPlacementStudents] = useState([]);
  const [selectedExamId, setSelectedExamId]     = useState('');
  const [completedExams, setCompletedExams]     = useState([]);
  const [selectedViewExamId, setSelectedViewExamId] = useState('');
  const [viewExamGrades, setViewExamGrades]     = useState([]);
  const [selectedStudent, setSelectedStudent]   = useState(null);
  const [searchTerm, setSearchTerm]             = useState('');

  // ── All original Supabase logic — UNTOUCHED ───────────────────────
  useEffect(() => {
    const fetchTeacherData = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        let tName = 'Teacher Name';
        let tId = null;
        let classNamesList = [];

        if (user && user.email) {
          const { data: staffData } = await supabase.from('staff').select('*').eq('email', user.email).single();
          if (staffData) {
            tName = `${staffData.first_name || ''} ${staffData.last_name || ''}`.trim();
            tId = staffData.id;
            setCurrentTeacher(tName);
            setCurrentTeacherId(tId);
          }
        }

        const { data: clsData } = await supabase.from('classes').select('*').eq('teacher_name', tName);
        if (clsData && clsData.length > 0) {
          setClasses(clsData);
          classNamesList = clsData.map(c => c.name || c.class_name);
        }

        if (classNamesList.length > 0) {
          const { data } = await supabase.from('students').select('*').in('group_name', classNamesList);
          setStudents(data || []);
        }

        if (tName !== 'Teacher Name') {
          const { data: apps } = await supabase.from('appointments').select('*')
            .ilike('sub_title', `%Prof: ${tName}%`).eq('status', 'Upcoming');
          const { data: pStudents } = await supabase.from('students').select('*')
            .eq('exam_type', 'Placement').eq('status', 'Scheduled');
          if (pStudents && apps) {
            const myPlacementStudents = pStudents.filter(s =>
              apps.some(a => a.title === `${s.first_name} ${s.last_name}` || a.phone === s.phone)
            );
            setPlacementStudents(myPlacementStudents);
          }
        }

        if (tId) {
          const { data: activeExams } = await supabase.from('exams').select('*')
            .eq('teacher_id', tId).eq('status', 'Active');
          if (activeExams) setAssignedExams(activeExams);

          const { data: compExams } = await supabase.from('exams').select('*')
            .eq('teacher_id', tId).eq('status', 'Completed');
          if (compExams) setCompletedExams(compExams);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeacherData();
  }, []);

  const activeClassObject = classes.find(c => (c.name || c.class_name) === selectedClass);

  const handleExamChange = (e) => {
    const exId = e.target.value;
    setSelectedExamId(exId);
    if (exId && exId !== 'placement_tests') {
      const selectedEx = assignedExams.find(ex => ex.id.toString() === exId);
      if (selectedEx) setSelectedClass(selectedEx.class_name);
    } else {
      setSelectedClass('');
    }
  };

  const handleViewExamChange = async (e) => {
    const exId = e.target.value;
    setSelectedViewExamId(exId);
    if (!exId) { setViewExamGrades([]); return; }
    const selectedEx = completedExams.find(ex => ex.id.toString() === exId);
    if (selectedEx) {
      setLoading(true);
      try {
        const { data: grData, error } = await supabase
          .from('grades').select('*, students!fk_grades_students(*)')
          .eq('exam_title', selectedEx.title);
        if (error) { console.error('Supabase Error:', error); setLoading(false); return; }
        if (grData) {
          const mapped = grData.map(g => {
            const s = g.students || {};
            return {
              id: g.id,
              name: g.student_name || `${s.first_name || ''} ${s.last_name || ''}`.trim() || 'Unknown',
              email: s.email || '-',
              course: g.course || '-',
              language: s.language || '-',
              type: g.exam_title || '-',
              level: s.level || '-',
              group: s.group_name || '-',
              date: new Date(g.created_at).toLocaleDateString('en-GB'),
              grade: g.score != null ? g.score : 0,
              status: g.status || 'Failed',
            };
          });
          setViewExamGrades(mapped);
        }
      } catch (err) {
        console.error('Error formatting grades:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const saveAttendance = async () => {
    if (!selectedClass) return alert('Select a class first!');
    setLoading(true);
    const records = students.filter(s => s.group_name === selectedClass).map(s => ({
      date: new Date().toISOString().split('T')[0],
      student_name: `${s.first_name} ${s.last_name}`,
      student_id: s.id,
      course: selectedClass,
      teacher_name: currentTeacher,
      status: attendanceData[s.id] || 'Present',
      time_slot: timeSlot,
    }));
    if (records.length === 0) { setLoading(false); return alert('No students found in this class!'); }
    try {
      const { error } = await supabase.from('attendance').insert(records);
      if (error) throw error;
      if (activeClassObject) {
        const newCompleted = (activeClassObject.completed_sessions || 0) + 1;
        const total = activeClassObject.total_sessions || 24;
        if (newCompleted <= total) {
          const { error: classError } = await supabase.from('classes')
            .update({ completed_sessions: newCompleted }).eq('id', activeClassObject.id);
          if (!classError) {
            setClasses(classes.map(c => c.id === activeClassObject.id
              ? { ...c, completed_sessions: newCompleted } : c));
          }
        }
      }
      alert('Attendance saved and class progress updated successfully.');
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const saveGrades = async () => {
    if (!selectedExamId) return alert('Please select an assessment first.');
    setLoading(true);
    try {
      if (selectedExamId === 'placement_tests') {
        const updates = Object.entries(gradesDataInput).map(async ([sId, gradeValue]) => {
          const st = placementStudents.find(s => s.id.toString() === sId);
          if (!st) return;
          await supabase.from('students').update({ status: 'Tested', test_score: gradeValue }).eq('id', sId);
          await supabase.from('appointments').update({ status: 'Completed' })
            .ilike('sub_title', `%Prof: ${currentTeacher}%`)
            .eq('title', `${st.first_name} ${st.last_name}`);
        });
        await Promise.all(updates);
        alert('Placement test grades submitted. The secretary can now enroll the students.');
        const remaining = placementStudents.filter(s => !gradesDataInput[s.id]);
        setPlacementStudents(remaining);
        setGradesDataInput({});
        if (remaining.length === 0) setSelectedExamId('');
      } else {
        const examObj = assignedExams.find(ex => ex.id.toString() === selectedExamId);
        if (!examObj) return;
        const records = Object.entries(gradesDataInput).map(([sId, gradeValue]) => {
          const student = students.find(s => s.id.toString() === sId);
          const scoreNum = parseFloat(gradeValue) || 0;
          const gradeLetter = scoreNum >= 80 ? 'A' : scoreNum >= 60 ? 'B' : scoreNum >= 50 ? 'C' : 'F';
          const passStatus = scoreNum >= 50 ? 'Passed' : 'Failed';
          return {
            student_id: sId,
            student_name: `${student.first_name} ${student.last_name}`,
            course: examObj.subject,
            exam_title: examObj.title,
            score: scoreNum,
            grade: gradeLetter,
            status: passStatus,
            created_at: new Date().toISOString(),
          };
        });
        if (records.length === 0) { setLoading(false); return alert('Please enter grades before submitting.'); }
        const { error: gradesError } = await supabase.from('grades').insert(records);
        if (gradesError) throw gradesError;
        const { error: examError } = await supabase.from('exams').update({ status: 'Completed' }).eq('id', selectedExamId);
        if (examError) throw examError;
        alert('Grades submitted successfully.');
        const completedExam = { ...examObj, status: 'Completed' };
        setAssignedExams(assignedExams.filter(ex => ex.id.toString() !== selectedExamId));
        setCompletedExams([completedExam, ...completedExams]);
        setGradesDataInput({});
        setSelectedExamId('');
      }
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredGrades = viewExamGrades.filter(g =>
    g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  let displayStudents = [];
  if (activeTab === 'Attendance') {
    displayStudents = students.filter(s => s.group_name === selectedClass);
  } else if (activeTab === 'Enter Grades') {
    if (selectedExamId === 'placement_tests') displayStudents = placementStudents;
    else if (selectedClass) displayStudents = students.filter(s => s.group_name === selectedClass);
  }

  // ── Shared input style ────────────────────────────────────────────
  const inputStyle = {
    width: '100%', background: '#f8fafc',
    border: '1px solid #f1f5f9', borderRadius: 10,
    padding: '10px 14px', fontSize: 13, color: '#1e293b',
    outline: 'none', boxSizing: 'border-box',
    fontFamily: 'inherit', cursor: 'pointer',
  };

  const labelStyle = {
    display: 'block', fontSize: 11, fontWeight: 700,
    color: '#94a3b8', textTransform: 'uppercase',
    letterSpacing: '0.07em', marginBottom: 6,
  };

  const btnPrimary = {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    padding: '10px 22px', borderRadius: 10, border: 'none',
    background: '#4318FF', color: '#fff',
    fontSize: 13, fontWeight: 700, cursor: 'pointer',
    transition: 'background .15s', whiteSpace: 'nowrap',
  };

  const btnSuccess = {
    ...btnPrimary, background: '#059669',
  };

  // ─────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ width: '100%', fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>

      {/* ── Page header ── */}
      <div style={{ marginBottom: 4 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#1e293b' }}>Classroom Tasks</h1>
        <p style={{ margin: '5px 0 0', fontSize: 13, color: '#94a3b8' }}>
          Manage attendance, grades, and exam results for your classes.
        </p>
      </div>

      {/* ── Tab bar ── */}
      <TabBar
        tabs={['Attendance', 'Enter Grades', 'View Grades']}
        active={activeTab}
        onChange={setActiveTab}
      />

      {/* ══════════════════════════════════════
          TAB: ATTENDANCE
      ══════════════════════════════════════ */}
      {activeTab === 'Attendance' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <SectionHeader
            title="Attendance Register"
            subtitle="Mark student presence for today's session"
          />

          {/* Controls */}
          <Card style={{ padding: '20px 24px' }}>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <label style={labelStyle}>Select Class</label>
                <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} style={inputStyle}>
                  <option value="">Choose a class...</option>
                  {classes.map(c => (
                    <option key={c.id} value={c.name || c.class_name}>{c.name || c.class_name}</option>
                  ))}
                </select>
                {activeClassObject && (
                  <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{
                      fontSize: 11, fontWeight: 700, color: '#4318FF',
                      background: '#eef2ff', padding: '4px 12px', borderRadius: 20,
                      border: '1px solid #e0e7ff',
                    }}>
                      Session {(activeClassObject.completed_sessions || 0) + 1} / {activeClassObject.total_sessions || 24}
                    </span>
                    <div style={{ height: 6, width: 100, background: '#f1f5f9', borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', background: '#4318FF', borderRadius: 99,
                        width: `${Math.min((((activeClassObject.completed_sessions || 0) + 1) / (activeClassObject.total_sessions || 24)) * 100, 100)}%`,
                      }} />
                    </div>
                  </div>
                )}
              </div>

              <div style={{ flex: 1, minWidth: 200 }}>
                <label style={labelStyle}>Time Slot</label>
                <select value={timeSlot} onChange={e => setTimeSlot(e.target.value)} style={inputStyle}>
                  <option>08:00 - 10:00</option>
                  <option>10:00 - 12:00</option>
                  <option>13:00 - 15:00</option>
                  <option>15:00 - 17:00</option>
                </select>
              </div>

              <button onClick={saveAttendance} disabled={loading}
                style={{ ...btnSuccess, opacity: loading ? 0.7 : 1 }}>
                {Icons.Save()}
                {loading ? 'Saving...' : 'Save Attendance'}
              </button>
            </div>
          </Card>

          {/* Student table */}
          <Card>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Student Name</th>
                  <th style={{ padding: '14px 20px', textAlign: 'center', fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Attendance Status</th>
                </tr>
              </thead>
              <tbody>
                {!selectedClass ? (
                  <tr><td colSpan="2" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
                    Select a class above to load students.
                  </td></tr>
                ) : displayStudents.length === 0 ? (
                  <tr><td colSpan="2" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
                    No students found in this class.
                  </td></tr>
                ) : displayStudents.map(s => (
                  <tr key={s.id} style={{ borderBottom: '1px solid #f8fafc', transition: 'background .15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 34, height: 34, borderRadius: '50%',
                          background: '#eef2ff', color: '#4318FF',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 12, fontWeight: 800, flexShrink: 0, textTransform: 'uppercase',
                        }}>{s.first_name?.charAt(0)}</div>
                        <span style={{ fontWeight: 600, color: '#1e293b' }}>{s.first_name} {s.last_name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
                        {['Present', 'Absent', 'Late'].map(status => {
                          const isActive = attendanceData[s.id] === status;
                          const colors = {
                            Present: { bg: '#ecfdf5', color: '#059669', border: '#059669' },
                            Absent:  { bg: '#fef2f2', color: '#ef4444', border: '#ef4444' },
                            Late:    { bg: '#fffbeb', color: '#f59e0b', border: '#f59e0b' },
                          };
                          const c = colors[status];
                          return (
                            <button key={status}
                              onClick={() => setAttendanceData({ ...attendanceData, [s.id]: status })}
                              style={{
                                padding: '6px 14px', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer',
                                border: `1px solid ${isActive ? c.border : '#f1f5f9'}`,
                                background: isActive ? c.bg : '#f8fafc',
                                color: isActive ? c.color : '#94a3b8',
                                transition: 'all .15s',
                              }}
                            >{status}</button>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}

      {/* ══════════════════════════════════════
          TAB: ENTER GRADES
      ══════════════════════════════════════ */}
      {activeTab === 'Enter Grades' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <SectionHeader
            title="Enter Grades"
            subtitle="Submit scores for active exams and placement tests"
          />

          {/* Controls */}
          <Card style={{ padding: '20px 24px' }}>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div style={{ flex: 1, minWidth: 280 }}>
                <label style={labelStyle}>Pending Assessments</label>
                <select value={selectedExamId} onChange={handleExamChange} style={inputStyle}>
                  <option value="">Select an exam to grade...</option>
                  {placementStudents.length > 0 && (
                    <option value="placement_tests">
                      Placement Tests ({placementStudents.length} students pending)
                    </option>
                  )}
                  {assignedExams.map(ex => (
                    <option key={ex.id} value={ex.id}>{ex.title} — {ex.class_name}</option>
                  ))}
                </select>
              </div>

              <button onClick={saveGrades} disabled={loading}
                style={{ ...btnPrimary, opacity: loading ? 0.7 : 1 }}>
                {Icons.Save()}
                {loading ? 'Submitting...' : 'Submit Grades'}
              </button>
            </div>
          </Card>

          {/* Student grades table */}
          <Card>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Student</th>
                  <th style={{ padding: '14px 20px', textAlign: 'center', fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {selectedExamId === 'placement_tests' ? 'Level / Score' : 'Score / 100'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {!selectedExamId ? (
                  <tr><td colSpan="2" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
                    Select an assessment above to load students.
                  </td></tr>
                ) : displayStudents.length === 0 ? (
                  <tr><td colSpan="2" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
                    No students found for this assessment.
                  </td></tr>
                ) : displayStudents.map(s => (
                  <tr key={s.id} style={{ borderBottom: '1px solid #f8fafc', transition: 'background .15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 34, height: 34, borderRadius: '50%',
                          background: '#eef2ff', color: '#4318FF',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 12, fontWeight: 800, textTransform: 'uppercase', flexShrink: 0,
                        }}>{s.first_name?.charAt(0)}</div>
                        <div>
                          <p style={{ margin: 0, fontWeight: 600, color: '#1e293b', fontSize: 13 }}>{s.first_name} {s.last_name}</p>
                          {s.group_name && <p style={{ margin: 0, fontSize: 11, color: '#94a3b8' }}>{s.group_name}</p>}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <input
                          type="text"
                          placeholder={selectedExamId === 'placement_tests' ? 'e.g. B1 or 15/20' : 'e.g. 78'}
                          onChange={e => setGradesDataInput({ ...gradesDataInput, [s.id]: e.target.value })}
                          style={{
                            width: 130, background: '#f8fafc',
                            border: '1px solid #f1f5f9', borderRadius: 8,
                            padding: '8px 12px', textAlign: 'center',
                            fontSize: 13, fontWeight: 700, color: '#1e293b',
                            outline: 'none', fontFamily: 'inherit',
                          }}
                          onFocus={e => e.target.style.borderColor = '#4318FF'}
                          onBlur={e => e.target.style.borderColor = '#f1f5f9'}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}

      {/* ══════════════════════════════════════
          TAB: VIEW GRADES
      ══════════════════════════════════════ */}
      {activeTab === 'View Grades' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <SectionHeader
            title="Completed Exam Results"
            subtitle="Select a completed exam to review student scores and performance"
          />

          {/* Controls */}
          <Card style={{ padding: '20px 24px' }}>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div style={{ flex: 1, minWidth: 260 }}>
                <label style={labelStyle}>Select Completed Exam</label>
                <select value={selectedViewExamId} onChange={handleViewExamChange} style={inputStyle}>
                  <option value="">Choose an exam...</option>
                  {completedExams.length === 0 && <option disabled>No completed exams yet.</option>}
                  {completedExams.map(ex => (
                    <option key={ex.id} value={ex.id}>{ex.title} — {ex.class_name}</option>
                  ))}
                </select>
              </div>

              <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
                <label style={labelStyle}>Search Student</label>
                <span style={{ position: 'absolute', left: 12, top: 36, color: '#94a3b8' }}>
                  {Icons.Search()}
                </span>
                <input type="text" placeholder="Search by name or course..."
                  value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                  style={{ ...inputStyle, paddingLeft: 36 }}
                  onFocus={e => e.target.style.borderColor = '#4318FF'}
                  onBlur={e => e.target.style.borderColor = '#f1f5f9'}
                />
              </div>
            </div>
          </Card>

          {/* Grades table */}
          <Card>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 760 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
                    {['#', 'Student Name', 'Course', 'Level', 'Date', 'Score / 100', 'Status'].map((h, i) => (
                      <th key={i} style={{
                        padding: '14px 16px', textAlign: i === 0 ? 'center' : 'left',
                        fontSize: 11, fontWeight: 700, color: '#94a3b8',
                        textTransform: 'uppercase', letterSpacing: '0.06em',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="7" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>Loading results...</td></tr>
                  ) : filteredGrades.length === 0 ? (
                    <tr><td colSpan="7" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                      {selectedViewExamId ? 'No students match your search.' : 'Please select an exam to view grades.'}
                    </td></tr>
                  ) : filteredGrades.map((g, idx) => (
                    <tr key={g.id}
                      onClick={() => setSelectedStudent(g)}
                      style={{ borderBottom: '1px solid #f8fafc', cursor: 'pointer', transition: 'background .15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '14px 16px', textAlign: 'center', color: '#94a3b8', fontSize: 12 }}>
                        {String(idx + 1).padStart(2, '0')}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{
                            width: 32, height: 32, borderRadius: '50%', background: '#eef2ff',
                            color: '#4318FF', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 11, fontWeight: 800, textTransform: 'uppercase', flexShrink: 0,
                          }}>{g.name.charAt(0)}</div>
                          <span style={{ fontWeight: 600, color: '#1e293b' }}>{g.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', color: '#64748b' }}>{g.course}</td>
                      <td style={{ padding: '14px 16px', color: '#64748b' }}>{g.level}</td>
                      <td style={{ padding: '14px 16px', color: '#64748b' }}>{g.date}</td>
                      <td style={{ padding: '14px 16px', fontWeight: 700, color: '#1e293b' }}>{g.grade}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: 5,
                          fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20,
                          background: g.status === 'Passed' ? '#ecfdf5' : '#fef2f2',
                          color:      g.status === 'Passed' ? '#059669' : '#ef4444',
                        }}>
                          <span style={{
                            width: 6, height: 6, borderRadius: '50%',
                            background: g.status === 'Passed' ? '#059669' : '#ef4444',
                            display: 'inline-block',
                          }} />
                          {g.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ══════════════════════════════════════
          STUDENT PROFILE MODAL — UNTOUCHED logic, restyled
      ══════════════════════════════════════ */}
      {selectedStudent && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)',
          backdropFilter: 'blur(4px)', zIndex: 50,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            background: '#fff', borderRadius: 20, padding: 32,
            width: 560, boxShadow: '0 20px 60px rgba(0,0,0,0.2)', position: 'relative',
          }}>
            {/* Close */}
            <button onClick={() => setSelectedStudent(null)} style={{
              position: 'absolute', top: 18, right: 20,
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#94a3b8', fontSize: 20, fontWeight: 700, lineHeight: 1,
            }}>✕</button>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid #f1f5f9' }}>
              {Icons.User()}
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#1e293b' }}>Student Profile</h2>
            </div>

            {/* Avatar + name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%', background: '#eef2ff',
                border: '2px solid #4318FF', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 24, fontWeight: 800,
                color: '#4318FF', textTransform: 'uppercase',
              }}>{selectedStudent.name.charAt(0)}</div>
              <div>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#1e293b' }}>{selectedStudent.name}</h3>
                <p style={{ margin: '3px 0 0', fontSize: 12, color: '#94a3b8' }}>{selectedStudent.email}</p>
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <span style={{ background: '#eef2ff', color: '#4318FF', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>{selectedStudent.language}</span>
                  <span style={{ background: '#ecfdf5', color: '#059669', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>Level {selectedStudent.level}</span>
                </div>
              </div>
            </div>

            {/* Detail grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { label: 'Course',     val: selectedStudent.course },
                { label: 'Group',      val: selectedStudent.group  },
                { label: 'Exam Title', val: selectedStudent.type   },
              ].map(({ label, val }) => (
                <div key={label} style={{ background: '#f8fafc', border: '1px solid #f1f5f9', padding: '14px 16px', borderRadius: 12 }}>
                  <p style={{ margin: '0 0 4px', fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</p>
                  <p style={{ margin: 0, fontWeight: 700, color: '#1e293b', fontSize: 14 }}>{val}</p>
                </div>
              ))}
              {/* Score card */}
              <div style={{
                background: selectedStudent.status === 'Passed' ? '#ecfdf5' : '#fef2f2',
                border: `1px solid ${selectedStudent.status === 'Passed' ? '#bbf7d0' : '#fecaca'}`,
                padding: '14px 16px', borderRadius: 12,
              }}>
                <p style={{ margin: '0 0 4px', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: selectedStudent.status === 'Passed' ? '#059669' : '#ef4444' }}>Score</p>
                <p style={{ margin: 0, fontSize: 28, fontWeight: 800, color: selectedStudent.status === 'Passed' ? '#059669' : '#ef4444', lineHeight: 1 }}>
                  {selectedStudent.grade} <span style={{ fontSize: 13, opacity: 0.5 }}>/ 100</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`* { box-sizing: border-box; }`}</style>
    </div>
  );
};

export default ClassroomTasks;
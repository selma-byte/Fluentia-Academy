import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient'; 

const ClassroomTasks = () => {
  // --- Shared States ---
  // بدلنا activeTab باش ترفد 3 حالات: 'Attendance', 'Enter Grades', 'View Grades'
  const [activeTab, setActiveTab] = useState('Attendance');
  const [loading, setLoading] = useState(false);
  const [currentTeacher, setCurrentTeacher] = useState("Teacher Name"); 

  // --- States for Entry (Attendance & Entering Grades) ---
  const [selectedClass, setSelectedClass] = useState('');
  const [timeSlot, setTimeSlot] = useState('08:00 - 10:00');
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState({}); 
  const [gradesInputData, setGradesInputData] = useState({}); 
  const [examType, setExamType] = useState('Quiz 1');

  // --- States for View (Viewing Grades & Profiles) ---
  const [fetchedGrades, setFetchedGrades] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [examTab, setExamTab] = useState('Course'); 
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLang, setFilterLang] = useState('All');
  const [filterLevel, setFilterLevel] = useState('All');
  const [filterGroup, setFilterGroup] = useState('All');

  // ==========================================
  // 💡 Fetch dynamic data from Supabase (Real Auth)
  // ==========================================
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        let classNamesList = [];

        if (user && user.email) {
          // 1. نجيبو معلومات الأستاذ
          const { data: teacherData } = await supabase.from('staff').select('*').eq('email', user.email).single();
          
          if (teacherData) {
            const tName = `${teacherData.first_name || ''} ${teacherData.last_name || ''}`.trim();
            setCurrentTeacher(tName);

            // 2. نجيبو الأقسام تاعو
            const { data: clsData } = await supabase.from('classes').select('*').eq('teacher_name', tName);
            if (clsData && clsData.length > 0) {
              setClasses(clsData);
              classNamesList = clsData.map(c => c.name || c.class_name);
            }
          }
        }

        // 3. نجيبو التلاميذ تاع هاد الأستاذ باش نعمرو الغياب/النقاط
        if (classNamesList.length > 0) {
          const { data: stdData } = await supabase.from('students').select('*').in('group_name', classNamesList);
          if (stdData) setStudents(stdData);

          // 4. نجيبو النقاط تاع العرض (View Grades)
          const { data: gradesData } = await supabase.from('grades').select('*, students(*)').limit(10);
          if (gradesData && gradesData.length > 0) {
            const realGrades = gradesData.map(g => ({
              id: g.id,
              student_id: g.student_id,
              name: g.students ? `${g.students.first_name || ''} ${g.students.last_name || ''}`.trim() : 'Unknown Student',
              email: g.students?.email || 'No email',
              course: g.exam_type || 'Course',
              language: g.students?.language || 'English', 
              type: g.exam_type || 'Course', 
              level: g.students?.level || 'B2',
              group: g.students?.group_name || 'Group 1',
              date: new Date(g.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
              grade: g.grade || 0,
              status: (g.grade || 0) >= ((g.max_grade || 20) / 2) ? 'Passed' : 'Failed'
            }));
            setFetchedGrades(realGrades);
          } else {
            setFetchedGrades(getFallbackGrades());
          }
        } else {
          setFetchedGrades(getFallbackGrades());
        }
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getFallbackGrades = () => [
    { id: 1, name: 'Sarah Johnson', email: 'sarah@example.com', course: 'Communication Skills', language: 'English', type: 'Course Exam', level: 'B2', group: 'Group 1', date: '14 Apr 2026', grade: 16, status: 'Passed' },
    { id: 2, name: 'Lucas Martin', email: 'lucas@example.com', course: 'Grammar', language: 'French', type: 'Placement Test', level: 'B1', group: 'Group 2', date: '12 Apr 2026', grade: 14, status: 'Passed' },
  ];

  // --- دالة حفظ الغياب ---
  const saveAttendance = async () => {
    if (!selectedClass) return alert("Select Class!");
    setLoading(true);
    const records = students.filter(s => s.group_name === selectedClass).map(s => ({
      date: new Date().toISOString().split('T')[0],
      student_id: s.id, // الربط الصحيح في قاعدة البيانات
      course: selectedClass,
      status: attendanceData[s.id] || 'Present',
      time_slot: timeSlot
    }));
    
    if(records.length === 0) { setLoading(false); return alert("No students in this class!"); }

    const { error } = await supabase.from('attendance').insert(records);
    setLoading(false);
    if (error) alert(error.message); else alert("Attendance Shared! ✅");
  };

  // --- دالة حفظ النقاط ---
  const saveGrades = async () => {
    if (!selectedClass) return alert("Select Class!");
    setLoading(true);

    const records = Object.entries(gradesInputData).map(([sId, gradeValue]) => {
      return {
        student_id: sId,
        exam_type: examType,
        grade: parseFloat(gradeValue), 
        max_grade: 20, 
        created_at: new Date().toISOString()
      };
    });

    if (records.length === 0) {
      setLoading(false);
      return alert("عمر النقاط قبل ما تسجل!");
    }

    const { error } = await supabase.from('grades').insert(records);
    setLoading(false);
    if (error) alert("Grades Error: " + error.message); else {
      alert("Grades Submitted! 📊");
      setGradesInputData({}); // تفريغ الخانات بعد الحفظ
    }
  };

  // --- فلترة قائمة العرض (View Grades) ---
  const filteredGrades = fetchedGrades.filter(g => {
    const matchesTab = examTab === 'Course' ? g.type !== 'Placement Test' : g.type === 'Placement Test';
    const matchesSearch = g.name.toLowerCase().includes(searchTerm.toLowerCase()) || g.course.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLang = filterLang === 'All' ? true : g.language === filterLang;
    const matchesLevel = filterLevel === 'All' ? true : g.level === filterLevel;
    const matchesGroup = filterGroup === 'All' ? true : g.group === filterGroup;
    return matchesTab && matchesSearch && matchesLang && matchesLevel && matchesGroup;
  });

  return (
    <div className="h-screen w-full flex flex-col bg-[#F4F7FE] overflow-hidden p-4 md:p-8 animate-fadeIn relative">
      
      {/* =======================================
          Modal (نافذة بروفايل التلميذ)
          ======================================= */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center animate-fadeIn">
          <div className="bg-white rounded-3xl p-8 w-[600px] shadow-2xl relative">
            <button 
              onClick={() => setSelectedStudent(null)} 
              className="absolute top-5 right-6 text-gray-400 hover:text-red-500 font-bold text-2xl"
            >
              ✕
            </button>
            
            <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
              <span className="text-2xl">🎓</span>
              <h2 className="text-2xl font-bold text-[#1B254B]">Student Profile</h2>
            </div>
            
            <div className="flex items-center gap-5 mb-8">
              <div className="w-20 h-20 rounded-full bg-[#f0f7ff] border-2 border-[#4318FF] flex items-center justify-center text-3xl font-bold text-[#4318FF] uppercase shadow-sm">
                {selectedStudent.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#1B254B]">{selectedStudent.name}</h3>
                <p className="text-gray-500 text-sm mb-1">📧 {selectedStudent.email}</p>
                <div className="flex gap-2 mt-2">
                  <span className="bg-blue-50 text-[#4318FF] px-2 py-1 rounded text-xs font-bold">{selectedStudent.language}</span>
                  <span className="bg-green-50 text-green-600 px-2 py-1 rounded text-xs font-bold">Level {selectedStudent.level}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 border border-gray-100 p-4 rounded-2xl">
                <p className="text-xs text-gray-400 font-bold mb-1 uppercase tracking-wider">Course</p>
                <p className="font-bold text-[#1B254B]">{selectedStudent.course}</p>
              </div>
              <div className="bg-gray-50 border border-gray-100 p-4 rounded-2xl">
                <p className="text-xs text-gray-400 font-bold mb-1 uppercase tracking-wider">Group</p>
                <p className="font-bold text-[#1B254B]">{selectedStudent.group}</p>
              </div>
              <div className="bg-gray-50 border border-gray-100 p-4 rounded-2xl">
                <p className="text-xs text-gray-400 font-bold mb-1 uppercase tracking-wider">Exam Type</p>
                <p className="font-bold text-[#1B254B]">{selectedStudent.type}</p>
              </div>
              <div className="bg-[#e6fbf2] border border-[#00a65e]/20 p-4 rounded-2xl">
                <p className="text-xs text-[#00a65e] font-bold mb-1 uppercase tracking-wider">Current Grade</p>
                <p className="text-2xl font-black text-[#00a65e]">{selectedStudent.grade} <span className="text-sm text-gray-500">/ 20</span></p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-[#1B254B] mb-1 flex items-center gap-2">👋 Welcome, {currentTeacher}</h1>
          <p className="text-sm text-[#A3AED0]">Manage your class activities and student grades.</p>
        </div>
        <div className="flex bg-gray-200/50 p-1 rounded-xl shadow-sm border border-gray-100">
          {['Attendance', 'Enter Grades', 'View Grades'].map(t => (
            <button key={t} onClick={() => setActiveTab(t)} className={`px-6 py-2.5 rounded-lg font-bold text-xs transition-all ${activeTab === t ? 'bg-white text-[#4318FF] shadow-md' : 'text-gray-500 hover:text-gray-700'}`}>{t}</button>
          ))}
        </div>
      </div>

      {/* =======================================
          VIEW 1 & 2: ATTENDANCE & ENTER GRADES
          ======================================= */}
      {(activeTab === 'Attendance' || activeTab === 'Enter Grades') && (
        <>
          {/* Controls */}
          <div className="bg-white p-6 rounded-[24px] shadow-sm mb-6 flex flex-wrap gap-4 items-end shrink-0 border border-gray-50">
            <div className="flex-1 min-w-[200px]">
              <label className="text-[10px] font-black text-[#1B254B] mb-2 block uppercase tracking-wider">Your Class</label>
              <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="w-full bg-[#F4F7FE] rounded-xl p-3 text-xs font-bold outline-none cursor-pointer border border-transparent focus:border-[#4318FF]">
                <option value="">Select Class...</option>
                {classes.map(c => <option key={c.id} value={c.name || c.class_name}>{c.name || c.class_name}</option>)}
              </select>
            </div>

            {activeTab === 'Attendance' ? (
              <div className="flex-1 min-w-[200px]">
                <label className="text-[10px] font-black text-[#1B254B] mb-2 block uppercase tracking-wider">Time Slot</label>
                <select value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)} className="w-full bg-[#F4F7FE] rounded-xl p-3 text-xs font-bold outline-none cursor-pointer border border-transparent focus:border-[#4318FF]">
                  <option>08:00 - 10:00</option><option>10:00 - 12:00</option><option>13:00 - 15:00</option><option>15:00 - 17:00</option>
                </select>
              </div>
            ) : (
              <div className="flex-1 min-w-[200px]">
                <label className="text-[10px] font-black text-[#1B254B] mb-2 block uppercase tracking-wider">Exam Type</label>
                <input type="text" value={examType} onChange={(e) => setExamType(e.target.value)} className="w-full bg-[#F4F7FE] rounded-xl p-3 text-xs font-bold outline-none border border-transparent focus:border-[#4318FF]" placeholder="e.g. Mid-term, Quiz 1..." />
              </div>
            )}

            <button onClick={activeTab === 'Attendance' ? saveAttendance : saveGrades} disabled={loading} className="bg-[#4318FF] text-white h-[44px] px-10 rounded-xl font-bold text-xs hover:bg-blue-700 shadow-md active:scale-95 transition-all">
              {loading ? 'Processing...' : `Save ${activeTab}`}
            </button>
          </div>

          {/* Table Area (Entry) */}
          <div className="flex-1 bg-white rounded-[24px] shadow-sm overflow-hidden flex flex-col border border-gray-50">
            <div className="overflow-y-auto h-full custom-scrollbar">
              <table className="w-full text-left">
                <thead className="sticky top-0 bg-white z-10 shadow-sm">
                  <tr>
                    <th className="p-5 pl-10 text-[#A3AED0] text-[10px] font-black uppercase tracking-wider border-b border-gray-100">Student Name</th>
                    <th className="p-5 text-[#A3AED0] text-[10px] font-black uppercase text-center border-b border-gray-100 tracking-wider">{activeTab === 'Attendance' ? 'Status' : 'Grade / 20'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {!selectedClass ? (
                    <tr><td colSpan="2" className="py-10 text-center text-gray-400 font-bold">Please select a class from the top menu first.</td></tr>
                  ) : students.filter(s => s.group_name === selectedClass).length === 0 ? (
                    <tr><td colSpan="2" className="py-10 text-center text-gray-400 font-bold">No students found in this class.</td></tr>
                  ) : students.filter(s => s.group_name === selectedClass).map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 pl-10 font-bold text-[#1B254B] text-sm">{s.first_name} {s.last_name}</td>
                      <td className="p-4">
                        {activeTab === 'Attendance' ? (
                          <div className="flex justify-center gap-2">
                            {['Present', 'Absent', 'Late'].map(status => (
                              <button key={status} onClick={() => setAttendanceData({...attendanceData, [s.id]: status})}
                                className={`px-4 py-1.5 rounded-lg text-[10px] font-black border transition-all ${attendanceData[s.id] === status ? 'bg-[#4318FF] text-white border-[#4318FF]' : 'bg-white text-gray-400 border-gray-200 hover:border-gray-300'}`}>{status}</button>
                            ))}
                          </div>
                        ) : (
                          <div className="flex justify-center">
                            <input type="number" placeholder="--" max="20" min="0" value={gradesInputData[s.id] || ''} onChange={(e) => setGradesInputData({...gradesInputData, [s.id]: e.target.value})}
                                   className="w-24 bg-[#F4F7FE] rounded-lg p-2 text-center font-bold text-[#1B254B] outline-none border-2 border-transparent focus:border-[#4318FF] transition-all" />
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* =======================================
          VIEW 3: VIEW GRADES & PROFILES
          ======================================= */}
      {activeTab === 'View Grades' && (
        <div className="flex-1 flex flex-col animate-fadeIn">
          <div className="flex gap-8 border-b border-gray-200 mb-6">
            <button onClick={() => setExamTab('Course')} className={`text-lg font-bold pb-3 relative transition-colors ${examTab === 'Course' ? 'text-[#4318FF]' : 'text-gray-400 hover:text-gray-600'}`}>
              📚 Course Grades
              {examTab === 'Course' && <div className="absolute bottom-[-1px] left-0 w-full h-1 bg-[#4318FF] rounded-t-md"></div>}
            </button>
            <button onClick={() => setExamTab('Placement')} className={`text-lg font-bold pb-3 relative transition-colors ${examTab === 'Placement' ? 'text-[#4318FF]' : 'text-gray-400 hover:text-gray-600'}`}>
              🎯 Placement Tests
              {examTab === 'Placement' && <div className="absolute bottom-[-1px] left-0 w-full h-1 bg-[#4318FF] rounded-t-md"></div>}
            </button>
          </div>

          <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm mb-6 flex flex-wrap gap-3 items-center shrink-0">
            <div className="relative flex-1 min-w-[200px]">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input type="text" placeholder="Search by student name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#4318FF] w-full transition-all" />
            </div>
            
            <select value={filterLang} onChange={(e) => setFilterLang(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 outline-none cursor-pointer hover:border-gray-300">
              <option value="All">🌐 All Languages</option><option value="English">English</option><option value="French">French</option><option value="German">German</option><option value="Spanish">Spanish</option>
            </select>

            <select value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 outline-none cursor-pointer hover:border-gray-300">
              <option value="All">📊 All Levels</option><option value="A1">A1</option><option value="A2">A2</option><option value="B1">B1</option><option value="B2">B2</option><option value="C1">C1</option>
            </select>

            <select value={filterGroup} onChange={(e) => setFilterGroup(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 outline-none cursor-pointer hover:border-gray-300">
              <option value="All">👥 All Groups</option>
              {classes.map(c => <option key={c.id} value={c.name || c.class_name}>{c.name || c.class_name}</option>)}
            </select>
          </div>

          <div className="flex-1 bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm flex flex-col">
            <div className="overflow-y-auto h-full custom-scrollbar">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead className="sticky top-0 bg-[#f0f7ff] shadow-sm z-10">
                  <tr className="text-[#2D428B] text-[13px] border-b border-gray-100">
                    <th className="py-4 px-6 font-semibold w-12"><input type="checkbox" className="rounded" /></th>
                    <th className="py-4 px-6 font-semibold">No</th>
                    <th className="py-4 px-6 font-semibold">Student Name</th>
                    <th className="py-4 px-6 font-semibold">Course Name</th>
                    <th className="py-4 px-6 font-semibold">Level</th>
                    <th className="py-4 px-6 font-semibold">Date</th>
                    <th className="py-4 px-6 font-semibold">Grade</th>
                    <th className="py-4 px-6 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGrades.map((g, index) => (
                    <tr key={g.id} onClick={() => setSelectedStudent(g)} className="border-b border-gray-50 hover:bg-blue-50 cursor-pointer transition-colors">
                      <td className="py-3 px-6" onClick={(e) => e.stopPropagation()}><input type="checkbox" className="rounded border-gray-300" /></td>
                      <td className="py-3 px-6 text-sm text-gray-500">{(index + 1).toString().padStart(2, '0')}</td>
                      
                      <td className="py-3 px-6 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 text-[#4318FF] flex items-center justify-center text-xs font-bold shrink-0 uppercase">
                          {g.name.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-[#1B254B]">{g.name}</span>
                      </td>

                      <td className="py-3 px-6 text-sm text-gray-500">{g.course}</td>
                      <td className="py-3 px-6 text-sm text-gray-500">{g.level}</td>
                      <td className="py-3 px-6 text-sm text-gray-500">{g.date}</td>
                      
                      <td className="py-3 px-6">
                        <span className="text-sm font-bold text-[#1B254B]">{g.grade}/20</span>
                      </td>

                      <td className="py-3 px-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold flex items-center w-max gap-1 uppercase tracking-wider ${g.status === 'Passed' ? 'bg-[#e6fbf2] text-[#00a65e]' : 'bg-red-50 text-red-500'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${g.status === 'Passed' ? 'bg-[#00a65e]' : 'bg-red-500'}`}></span>
                          {g.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  
                  {filteredGrades.length === 0 && (
                    <tr>
                      <td colSpan="8" className="py-12 text-center text-gray-400 font-bold">
                        {loading ? 'Loading...' : 'No students found matching your filters.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassroomTasks;
import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

const ClassroomTasks = () => {
  // ==========================================
  // STATES
  // ==========================================
  // 💡 هنا رديناهم 3 قفالي باش ندمجو الخدمة كامل
  const [activeTab, setActiveTab] = useState('Attendance'); 
  const [selectedClass, setSelectedClass] = useState('');
  const [timeSlot, setTimeSlot] = useState('08:00 - 10:00');
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [attendanceData, setAttendanceData] = useState({}); 
  const [gradesDataInput, setGradesDataInput] = useState({}); 
  const [examType, setExamType] = useState('Quiz 1');
  const [currentTeacher, setCurrentTeacher] = useState("Teacher Name"); 

  // States تاع باجة العرض (View Grades)
  const [grades, setGrades] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [examTab, setExamTab] = useState('Course'); 
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLang, setFilterLang] = useState('All');
  const [filterLevel, setFilterLevel] = useState('All');
  const [filterGroup, setFilterGroup] = useState('All');

  // ==========================================
  // 💡 جلب البيانات من Supabase (مفيلتريين صح)
  // ==========================================
  useEffect(() => {
    const fetchTeacherData = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        let tName = "Teacher Name";
        let classNamesList = [];
        
        if (user && user.email) {
          const { data: staffData } = await supabase.from('staff').select('*').eq('email', user.email).single();
          if (staffData) {
            tName = `${staffData.first_name || ''} ${staffData.last_name || ''}`.trim();
            setCurrentTeacher(tName);
          }
        }

        // 1. جلب أقسام هاد الأستاذ
        const { data: clsData } = await supabase.from('classes').select('*').eq('teacher_name', tName);
        if (clsData && clsData.length > 0) {
          setClasses(clsData);
          classNamesList = clsData.map(c => c.name || c.class_name); // نخبيو أسماء الأقسام باش نجبدو بيهم الطلبة
        }

        // 2. جلب الطلبة اللي يقراو في هادوك الأقسام برك
        let stdData = [];
        if (classNamesList.length > 0) {
          const { data } = await supabase.from('students').select('*').in('group_name', classNamesList);
          stdData = data || [];
          setStudents(stdData);
        }

        // 3. جلب النقاط تاع العرض أو توليد داتا وهمية للديزاين
        const { data: grData } = await supabase.from('grades').select('*, students(*)');
        if (grData && grData.length > 0) {
          const mappedGrades = grData.map(g => {
            const s = g.students || {};
            return {
              id: g.id,
              name: `${s.first_name || ''} ${s.last_name || ''}`.trim() || 'Unknown',
              email: s.email || 'No email',
              course: g.course || 'Communication Skills',
              language: s.language || 'English',
              type: g.exam_type?.includes('Placement') ? 'Placement Test' : 'Course Exam',
              level: s.level || 'B2',
              group: s.group_name || 'Group 1',
              date: new Date(g.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
              grade: g.grade || 0,
              status: (g.grade || 0) >= 10 ? 'Passed' : 'Failed'
            }
          });
          setGrades(mappedGrades);
        } else if (stdData.length > 0) {
          // داتا وهمية باش الديزاين يبقى معمر قدام لي جيري
          const mockGrades = stdData.map((student) => ({
            id: student.id,
            name: `${student.first_name || ''} ${student.last_name || ''}`.trim() || 'New Student',
            email: student.email || 'No email provided',
            course: 'Communication Skills',
            language: student.language || 'English', 
            type: student.exam_type || 'Course Exam', 
            level: student.level || 'B2', 
            group: student.group_name || 'Group 1',
            date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            grade: Math.floor(Math.random() * 10) + 10,
            status: 'Passed'
          }));
          setGrades(mockGrades);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeacherData();
  }, []);

  // --- دالة حفظ الغياب ---
  const saveAttendance = async () => {
    if (!selectedClass) return alert("Select Class!");
    setLoading(true);
    // 💡 الفيلتر هنا باش يبعث غير غياب طلبة القسم اللي خيرتيه
    const records = students.filter(s => s.group_name === selectedClass).map(s => ({
      date: new Date().toISOString().split('T')[0],
      student_name: `${s.first_name} ${s.last_name}`,
      course: selectedClass,
      teacher_name: currentTeacher,
      status: attendanceData[s.id] || 'Present',
      time_slot: timeSlot
    }));
    
    if(records.length === 0) {
        setLoading(false);
        return alert("No students found in this class!");
    }

    const { error } = await supabase.from('attendance').insert(records);
    setLoading(false);
    if (error) alert(error.message); else alert("Attendance Shared! ✅");
  };

  // --- دالة حفظ النقاط ---
  const saveGrades = async () => {
    if (!selectedClass) return alert("Select Class!");
    setLoading(true);

    const records = Object.entries(gradesDataInput).map(([sId, gradeValue]) => {
      const student = students.find(s => s.id.toString() === sId);
      return {
        student_name: `${student.first_name} ${student.last_name}`,
        course: selectedClass,
        grade: parseFloat(gradeValue),
        exam_type: examType,
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
      setGradesDataInput({});
    }
  };

  const filteredGrades = grades.filter(g => {
    // 💡 صلحنا الفيلتر: دركا يقبل أي امتحان في الـ Course (quiz, mid-term, course...)
    // ويخبي غير اللي فيهم كلمة "placement" يحطهم في التاب الدوزيام
    const isPlacement = g.type?.toLowerCase().includes('placement');
    const matchesTab = examTab === 'Course' ? !isPlacement : isPlacement;
    
    const matchesSearch = g.name.toLowerCase().includes(searchTerm.toLowerCase()) || g.course.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLang = filterLang === 'All' ? true : g.language === filterLang;
    const matchesLevel = filterLevel === 'All' ? true : g.level === filterLevel;
    const matchesGroup = filterGroup === 'All' ? true : g.group === filterGroup;
    
    return matchesTab && matchesSearch && matchesLang && matchesLevel && matchesGroup;
  });

  return (
    <div className="h-full w-full flex flex-col bg-[#F4F7FE] overflow-y-auto custom-scrollbar p-4 md:p-8 space-y-12 animate-fadeIn relative">
      
      {/* =======================================
          Modal (نافذة بروفايل التلميذ)
          ======================================= */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center animate-fadeIn">
          <div className="bg-white rounded-3xl p-8 w-[600px] shadow-2xl relative">
            <button onClick={() => setSelectedStudent(null)} className="absolute top-5 right-6 text-gray-400 hover:text-red-500 font-bold text-2xl">✕</button>
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

      {/* =======================================
          PART 1: CLASSROOM TASKS (ENTRY)
          ======================================= */}
      <div className="flex flex-col shrink-0">
        <div className="flex justify-between items-center mb-6 shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-[#1B254B]">📋 Classroom Tasks</h1>
            <p className="text-xs text-[#A3AED0]">Manage your class activities.</p>
          </div>
          <div className="flex bg-gray-200/50 p-1 rounded-xl">
            {['Attendance', 'Enter Grades', 'View Grades'].map(t => (
              <button key={t} onClick={() => setActiveTab(t)} className={`px-6 py-2.5 rounded-lg font-bold text-xs transition-all ${activeTab === t ? 'bg-white text-[#4318FF] shadow-md' : 'text-gray-500 hover:text-gray-700'}`}>{t}</button>
            ))}
          </div>
        </div>

        {(activeTab === 'Attendance' || activeTab === 'Enter Grades') && (
            <>
                <div className="bg-white p-6 rounded-[24px] shadow-sm mb-6 flex flex-wrap gap-4 items-end shrink-0">
                  <div className="flex-1 min-w-[200px]">
                    <label className="text-[10px] font-black text-[#1B254B] mb-2 block uppercase">Your Class</label>
                    <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="w-full bg-[#F4F7FE] rounded-xl p-3 text-xs font-bold outline-none">
                      <option value="">Select Class...</option>
                      {classes.map(c => <option key={c.id} value={c.name || c.class_name}>{c.name || c.class_name}</option>)}
                    </select>
                  </div>
                  {activeTab === 'Attendance' ? (
                    <div className="flex-1 min-w-[200px]">
                      <label className="text-[10px] font-black text-[#1B254B] mb-2 block uppercase">Time Slot</label>
                      <select value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)} className="w-full bg-[#F4F7FE] rounded-xl p-3 text-xs font-bold outline-none">
                        <option>08:00 - 10:00</option><option>10:00 - 12:00</option><option>13:00 - 15:00</option><option>15:00 - 17:00</option>
                      </select>
                    </div>
                  ) : (
                    <div className="flex-1 min-w-[200px]">
                      <label className="text-[10px] font-black text-[#1B254B] mb-2 block uppercase">Exam Type</label>
                      <input type="text" value={examType} onChange={(e) => setExamType(e.target.value)} className="w-full bg-[#F4F7FE] rounded-xl p-3 text-xs font-bold outline-none" />
                    </div>
                  )}
                  <button onClick={activeTab === 'Attendance' ? saveAttendance : saveGrades} disabled={loading} className="bg-[#4318FF] text-white h-[48px] px-10 rounded-xl font-bold text-xs hover:bg-blue-700 shadow-lg active:scale-95">
                    {loading ? 'Processing...' : `Save ${activeTab}`}
                  </button>
                </div>

                <div className="flex-1 bg-white rounded-[24px] shadow-sm overflow-hidden flex flex-col min-h-[300px]">
                  <div className="overflow-y-auto h-full custom-scrollbar">
                    <table className="w-full text-left">
                      <thead className="sticky top-0 bg-white z-10 shadow-sm border-b border-gray-100">
                        <tr>
                          <th className="p-5 pl-10 text-[#A3AED0] text-[10px] font-black uppercase">Student Name</th>
                          <th className="p-5 text-[#A3AED0] text-[10px] font-black uppercase text-center">{activeTab === 'Attendance' ? 'Status' : 'Grade / 20'}</th>
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
                                      className={`px-4 py-1.5 rounded-lg text-[10px] font-black border ${attendanceData[s.id] === status ? 'bg-[#4318FF] text-white' : 'bg-white text-gray-400'}`}>{status}</button>
                                  ))}
                                </div>
                              ) : (
                                <div className="flex justify-center">
                                  <input type="number" placeholder="--" onChange={(e) => setGradesDataInput({...gradesDataInput, [s.id]: e.target.value})}
                                         className="w-20 bg-[#F4F7FE] rounded-lg p-2 text-center font-bold text-[#1B254B] outline-none border-2 border-transparent focus:border-[#4318FF]" />
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
      </div>

      {/* =======================================
          PART 2: TEACHER GRADES (VIEW)
          ======================================= */}
      {activeTab === 'View Grades' && (
        <div className="flex flex-col h-[800px] shrink-0 bg-white p-8 rounded-3xl shadow-sm animate-fadeIn">
            <div className="bg-[#f8fafc] rounded-2xl p-6 flex justify-between items-center mb-8 border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="z-10">
                <h2 className="text-2xl font-bold text-[#1B254B] mb-2">Grade Management</h2>
                <p className="text-gray-500 text-sm">Click on any student to view their detailed profile and grades.</p>
            </div>
            <div className="hidden md:flex gap-4 items-center z-10 opacity-80">
                <span className="text-6xl">📝👩‍🎓</span>
            </div>
            </div>

            <div className="flex gap-8 border-b border-gray-200 mb-6 shrink-0">
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
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#4318FF] w-full" />
            </div>
            
            <select value={filterLang} onChange={(e) => setFilterLang(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 outline-none cursor-pointer">
                <option value="All">🌐 All Languages</option><option value="English">English</option><option value="French">French</option><option value="German">German</option><option value="Spanish">Spanish</option>
            </select>

            <select value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 outline-none cursor-pointer">
                <option value="All">📊 All Levels</option><option value="A1">A1</option><option value="A2">A2</option><option value="B1">B1</option><option value="B2">B2</option><option value="C1">C1</option>
            </select>

            <select value={filterGroup} onChange={(e) => setFilterGroup(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 outline-none cursor-pointer">
                <option value="All">👥 All Groups</option>
                {classes.map(c => <option key={c.id} value={c.name || c.class_name}>{c.name || c.class_name}</option>)}
            </select>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm flex-1 flex flex-col min-h-[300px]">
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
                        <td colSpan="8" className="py-8 text-center text-gray-400">
                        No students found matching your filters.
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
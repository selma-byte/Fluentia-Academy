import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

const ClassroomTasks = () => {
  // ==========================================
  // STATES
  // ==========================================
  const [activeTab, setActiveTab] = useState('Attendance'); 
  const [selectedClass, setSelectedClass] = useState('');
  const [timeSlot, setTimeSlot] = useState('08:00 - 10:00');
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [attendanceData, setAttendanceData] = useState({}); 
  const [gradesDataInput, setGradesDataInput] = useState({}); 
  
  // States للامتحانات
  const [currentTeacherId, setCurrentTeacherId] = useState(null);
  const [currentTeacher, setCurrentTeacher] = useState("Teacher Name"); 
  const [assignedExams, setAssignedExams] = useState([]); 
  const [selectedExamId, setSelectedExamId] = useState('');

  // States لباجة العرض (View Grades)
  const [completedExams, setCompletedExams] = useState([]); 
  const [selectedViewExamId, setSelectedViewExamId] = useState(''); 
  const [viewExamGrades, setViewExamGrades] = useState([]); 
  
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // ==========================================
  // 💡 جلب البيانات من Supabase 
  // ==========================================
  useEffect(() => {
    const fetchTeacherData = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        let tName = "Teacher Name";
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

        // 1. جلب أقسام هاد الأستاذ
        const { data: clsData } = await supabase.from('classes').select('*').eq('teacher_name', tName);
        if (clsData && clsData.length > 0) {
          setClasses(clsData);
          classNamesList = clsData.map(c => c.name || c.class_name); 
        }

        // 2. جلب الطلبة
        let stdData = [];
        if (classNamesList.length > 0) {
          const { data } = await supabase.from('students').select('*').in('group_name', classNamesList);
          stdData = data || [];
          setStudents(stdData);
        }

        if (tId) {
          // 3. جلب الامتحانات النشطة
          const { data: activeExams } = await supabase
            .from('exams')
            .select('*')
            .eq('teacher_id', tId)
            .eq('status', 'Active');
          if (activeExams) setAssignedExams(activeExams);

          // 4. جلب الامتحانات المكتملة
          const { data: compExams } = await supabase
            .from('exams')
            .select('*')
            .eq('teacher_id', tId)
            .eq('status', 'Completed');
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

  // جلب القسم المختار باش نأفيشيو الحصة الحالية
  const activeClassObject = classes.find(c => (c.name || c.class_name) === selectedClass);

  // كي الأستاذ يخير امتحان باش ينقطو
  const handleExamChange = (e) => {
    const exId = e.target.value;
    setSelectedExamId(exId);
    if (exId) {
      const selectedEx = assignedExams.find(ex => ex.id.toString() === exId);
      if (selectedEx) setSelectedClass(selectedEx.class_name);
    } else {
      setSelectedClass('');
    }
  };

  // كي الأستاذ يخير امتحان مكتمل باش يشوف نقاطو
  const handleViewExamChange = async (e) => {
    const exId = e.target.value;
    setSelectedViewExamId(exId);
    
    if (!exId) {
      setViewExamGrades([]);
      return;
    }
    
    const selectedEx = completedExams.find(ex => ex.id.toString() === exId);
    if (selectedEx) {
      setLoading(true);
      try {
        const { data: grData, error } = await supabase
          .from('grades')
          .select('*, students!fk_grades_students(*)')
          .eq('exam_title', selectedEx.title);
          
        if (error) {
          console.error("🚨 Supabase Error:", error);
          alert("تأكدي بلي درتي الربط (Relation) في Supabase بين grades و students!");
          setLoading(false);
          return;
        }
          
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
              status: g.status || 'Failed'
            };
          });
          setViewExamGrades(mapped);
        }
      } catch (err) {
        console.error("Error formatting grades:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  // 💡 دالة تسجيل الغياب + زيادة الحصة أوتوماتيكياً
  const saveAttendance = async () => {
    if (!selectedClass) return alert("Select Class!");
    setLoading(true);
    
    const records = students.filter(s => s.group_name === selectedClass).map(s => ({
      date: new Date().toISOString().split('T')[0],
      student_name: `${s.first_name} ${s.last_name}`,
      student_id: s.id, 
      course: selectedClass,
      teacher_name: currentTeacher,
      status: attendanceData[s.id] || 'Present',
      time_slot: timeSlot
    }));
    
    if(records.length === 0) {
        setLoading(false);
        return alert("No students found in this class!");
    }

    try {
      // 1. نسجلو الغياب
      const { error } = await supabase.from('attendance').insert(records);
      if (error) throw error;

      // 💡 2. السحر: نزيدو الحصة للقسم في الداتا باز أوتوماتيكياً
      if (activeClassObject) {
        const newCompleted = (activeClassObject.completed_sessions || 0) + 1;
        const total = activeClassObject.total_sessions || 24;

        if (newCompleted <= total) {
          const { error: classError } = await supabase
            .from('classes')
            .update({ completed_sessions: newCompleted })
            .eq('id', activeClassObject.id);
            
          if (!classError) {
            // نحدثو الـ State باش تبان الزيادة في الشاشة ديراكت
            setClasses(classes.map(c => c.id === activeClassObject.id ? { ...c, completed_sessions: newCompleted } : c));
          }
        }
      }

      alert("Attendance Saved & Class Progress Updated! ✅📈");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const saveGrades = async () => {
    if (!selectedExamId) return alert("Please select an Exam first!");
    const examObj = assignedExams.find(ex => ex.id.toString() === selectedExamId);
    if (!examObj) return;

    setLoading(true);
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
        created_at: new Date().toISOString()
      };
    });

    if (records.length === 0) {
      setLoading(false);
      return alert("عمر النقاط قبل ما تسجل!");
    }

    try {
      const { error: gradesError } = await supabase.from('grades').insert(records);
      if (gradesError) throw gradesError;

      const { error: examError } = await supabase.from('exams').update({ status: 'Completed' }).eq('id', selectedExamId);
      if (examError) throw examError;

      alert("Grades Submitted Successfully! 🎉");
      
      const completedExam = { ...examObj, status: 'Completed' };
      setAssignedExams(assignedExams.filter(ex => ex.id.toString() !== selectedExamId)); 
      setCompletedExams([completedExam, ...completedExams]);
      
      setGradesDataInput({});
      setSelectedExamId('');
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredGrades = viewExamGrades.filter(g => 
    g.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    g.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full w-full flex flex-col bg-[#F4F7FE] overflow-y-auto custom-scrollbar p-4 md:p-8 space-y-12 animate-fadeIn relative">
      
      {/* Modal Profile ... */}
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
                <p className="text-xs text-gray-400 font-bold mb-1 uppercase tracking-wider">Exam Title</p>
                <p className="font-bold text-[#1B254B]">{selectedStudent.type}</p>
              </div>
              <div className={`border p-4 rounded-2xl ${selectedStudent.status === 'Passed' ? 'bg-[#e6fbf2] border-[#00a65e]/20' : 'bg-red-50 border-red-500/20'}`}>
                <p className={`text-xs font-bold mb-1 uppercase tracking-wider ${selectedStudent.status === 'Passed' ? 'text-[#00a65e]' : 'text-red-500'}`}>Score</p>
                <p className={`text-2xl font-black ${selectedStudent.status === 'Passed' ? 'text-[#00a65e]' : 'text-red-500'}`}>{selectedStudent.grade} <span className="text-sm opacity-50">/ 100</span></p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PART 1: CLASSROOM TASKS (ENTRY) */}
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
                  
                  {activeTab === 'Attendance' ? (
                    <>
                      <div className="flex-1 min-w-[200px]">
                        <label className="text-[10px] font-black text-[#1B254B] mb-2 block uppercase">Your Class</label>
                        <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="w-full bg-[#F4F7FE] rounded-xl p-3 text-xs font-bold outline-none border border-transparent focus:border-[#4318FF]">
                          <option value="">Select Class...</option>
                          {classes.map(c => <option key={c.id} value={c.name || c.class_name}>{c.name || c.class_name}</option>)}
                        </select>
                        
                        {/* 💡 هنا الأستاذ يشوف رقم الحصة الحالية */}
                        {activeClassObject && (
                          <div className="mt-3 flex items-center gap-3">
                            <span className="bg-[#eef2ff] text-[#4318FF] px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border border-[#4318FF]/10 shadow-sm">
                              Session: {(activeClassObject.completed_sessions || 0) + 1} / {activeClassObject.total_sessions || 24}
                            </span>
                            <div className="h-1.5 w-24 bg-gray-100 rounded-full overflow-hidden">
                               <div className="h-full bg-[#4318FF] transition-all" style={{ width: `${Math.min((((activeClassObject.completed_sessions || 0) + 1) / (activeClassObject.total_sessions || 24)) * 100, 100)}%`}}></div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-[200px]">
                        <label className="text-[10px] font-black text-[#1B254B] mb-2 block uppercase">Time Slot</label>
                        <select value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)} className="w-full bg-[#F4F7FE] rounded-xl p-3 text-xs font-bold outline-none border border-transparent focus:border-[#4318FF]">
                          <option>08:00 - 10:00</option><option>10:00 - 12:00</option><option>13:00 - 15:00</option><option>15:00 - 17:00</option>
                        </select>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 min-w-[300px]">
                      <label className="text-[10px] font-black text-[#1B254B] mb-2 block uppercase">Pending Exams</label>
                      <select value={selectedExamId} onChange={handleExamChange} className="w-full bg-[#F4F7FE] rounded-xl p-3 text-xs font-bold outline-none border border-transparent focus:border-[#4318FF]">
                        <option value="">-- Select an Exam to Grade --</option>
                        {assignedExams.length === 0 && <option disabled>No active exams assigned to you.</option>}
                        {assignedExams.map(ex => (
                          <option key={ex.id} value={ex.id}>{ex.title} (Class: {ex.class_name})</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <button onClick={activeTab === 'Attendance' ? saveAttendance : saveGrades} disabled={loading} className={`h-[48px] px-10 rounded-xl font-bold text-xs shadow-lg active:scale-95 transition-all ${activeTab === 'Attendance' && activeClassObject ? 'bg-[#01B574] hover:bg-green-700 text-white mt-8' : 'bg-[#4318FF] text-white hover:bg-blue-700'}`}>
                    {loading ? 'Processing...' : `Submit ${activeTab}`}
                  </button>
                </div>

                <div className="flex-1 bg-white rounded-[24px] shadow-sm overflow-hidden flex flex-col min-h-[300px]">
                  <div className="overflow-y-auto h-full custom-scrollbar">
                    <table className="w-full text-left">
                      <thead className="sticky top-0 bg-white z-10 shadow-sm border-b border-gray-100">
                        <tr>
                          <th className="p-5 pl-10 text-[#A3AED0] text-[10px] font-black uppercase">Student Name</th>
                          <th className="p-5 text-[#A3AED0] text-[10px] font-black uppercase text-center">{activeTab === 'Attendance' ? 'Status' : 'Score / 100'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {(!selectedClass && activeTab === 'Attendance') || (!selectedExamId && activeTab === 'Enter Grades') ? (
                            <tr><td colSpan="2" className="py-10 text-center text-gray-400 font-bold">Please select {activeTab === 'Attendance' ? 'a class' : 'an exam'} from the menu above.</td></tr>
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
                                         className="w-24 bg-[#F4F7FE] rounded-lg p-2 text-center font-bold text-[#1B254B] outline-none border-2 border-transparent focus:border-[#4318FF]" />
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

      {/* PART 2: TEACHER GRADES (VIEW) */}
      {activeTab === 'View Grades' && (
        <div className="flex flex-col h-[800px] shrink-0 bg-white p-8 rounded-3xl shadow-sm animate-fadeIn">
            <div className="bg-[#f8fafc] rounded-2xl p-6 flex justify-between items-center mb-8 border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="z-10">
                <h2 className="text-2xl font-bold text-[#1B254B] mb-2">Completed Exams Results</h2>
                <p className="text-gray-500 text-sm">Select a completed exam to view student scores and performance.</p>
            </div>
            <div className="hidden md:flex gap-4 items-center z-10 opacity-80">
                <span className="text-6xl">📊🎓</span>
            </div>
            </div>

            <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm mb-6 flex gap-4 items-center shrink-0">
                <div className="flex-1 min-w-[300px]">
                    <label className="text-[10px] font-black text-[#1B254B] mb-2 block uppercase">Select Completed Exam</label>
                    <select value={selectedViewExamId} onChange={handleViewExamChange} className="w-full bg-[#F4F7FE] rounded-xl p-3 text-xs font-bold outline-none border border-transparent focus:border-[#4318FF]">
                        <option value="">-- Choose an Exam --</option>
                        {completedExams.length === 0 && <option disabled>No completed exams yet.</option>}
                        {completedExams.map(ex => (
                            <option key={ex.id} value={ex.id}>{ex.title} (Class: {ex.class_name})</option>
                        ))}
                    </select>
                </div>
                
                <div className="relative flex-1 min-w-[200px]">
                    <label className="text-[10px] font-black text-[#1B254B] mb-2 block uppercase">Search Student</label>
                    <span className="absolute left-3 top-[38px] text-gray-400">🔍</span>
                    <input type="text" placeholder="Search by name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                           className="pl-9 pr-4 py-3 bg-[#F4F7FE] rounded-xl text-xs font-bold focus:outline-none focus:border-[#4318FF] w-full" />
                </div>
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
                    <th className="py-4 px-6 font-semibold">Score / 100</th>
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
                        <span className="text-sm font-bold text-[#1B254B]">{g.grade}</span>
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
                        <td colSpan="8" className="py-8 text-center text-gray-400 font-bold">
                          {selectedViewExamId ? 'No students found matching your search.' : 'Please select an exam to view grades.'}
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
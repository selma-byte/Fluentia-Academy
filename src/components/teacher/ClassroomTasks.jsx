import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

const ClassroomTasks = () => {
  const [activeTab, setActiveTab] = useState('Attendance');
  const [selectedClass, setSelectedClass] = useState('');
  const [timeSlot, setTimeSlot] = useState('08:00 - 10:00');
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Data States
  const [attendanceData, setAttendanceData] = useState({}); 
  const [gradesData, setGradesData] = useState({}); 
  const [examType, setExamType] = useState('Quiz 1');

  const currentTeacher = "Teacher Name"; 

  useEffect(() => {
    const fetchTeacherData = async () => {
      setLoading(true);
      // جلب أقسام الأستاذ برك
      const { data: clsData } = await supabase.from('classes').select('*').eq('teacher_name', currentTeacher);
      if (clsData) setClasses(clsData);
      
      // جلب التلاميذ
      const { data: stdData } = await supabase.from('students').select('*');
      if (stdData) setStudents(stdData);
      setLoading(false);
    };
    fetchTeacherData();
  }, []);

  // --- دالة حفظ الغياب (Attendance) ---
  const saveAttendance = async () => {
    if (!selectedClass) return alert("Select Class!");
    setLoading(true);
    const records = students.map(s => ({
      date: new Date().toISOString().split('T')[0],
      student_name: `${s.first_name} ${s.last_name}`,
      course: selectedClass,
      teacher_name: currentTeacher,
      status: attendanceData[s.id] || 'Present',
      time_slot: timeSlot
    }));
    const { error } = await supabase.from('attendance').insert(records);
    setLoading(false);
    if (error) alert(error.message); else alert("Attendance Shared! ✅");
  };

  // --- دالة حفظ النقاط (Grades) المصححة ---
  const saveGrades = async () => {
    if (!selectedClass) return alert("Select Class!");
    setLoading(true);

    // نمروا على كل تلميذ عنده نقطة في الـ State
    const records = Object.entries(gradesData).map(([sId, gradeValue]) => {
      const student = students.find(s => s.id.toString() === sId);
      return {
        student_name: `${student.first_name} ${student.last_name}`,
        course: selectedClass,
        grade: parseFloat(gradeValue), // التأكد أنها رقم
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
    if (error) alert("Grades Error: " + error.message); else alert("Grades Submitted! 📊");
  };

  return (
    <div className="h-screen w-full flex flex-col bg-[#F4F7FE] overflow-hidden p-4 md:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-[#1B254B]">📋 Classroom Tasks</h1>
          <p className="text-xs text-[#A3AED0]">Manage your class activities.</p>
        </div>
        <div className="flex bg-gray-200/50 p-1 rounded-xl">
          {['Attendance', 'Grades'].map(t => (
            <button key={t} onClick={() => setActiveTab(t)} className={`px-8 py-2 rounded-lg font-bold text-xs transition-all ${activeTab === t ? 'bg-white text-[#4318FF] shadow-md' : 'text-gray-500'}`}>{t}</button>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white p-6 rounded-[24px] shadow-sm mb-6 flex flex-wrap gap-4 items-end shrink-0">
        <div className="flex-1 min-w-[200px]">
          <label className="text-[10px] font-black text-[#1B254B] mb-2 block uppercase">Your Class</label>
          <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="w-full bg-[#F4F7FE] rounded-xl p-3 text-xs font-bold outline-none">
            <option value="">Select Class...</option>
            {classes.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
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

      {/* Table Area */}
      <div className="flex-1 bg-white rounded-[24px] shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-y-auto h-full custom-scrollbar">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-white z-10 shadow-sm">
              <tr>
                <th className="p-5 pl-10 text-[#A3AED0] text-[10px] font-black uppercase">Student Name</th>
                <th className="p-5 text-[#A3AED0] text-[10px] font-black uppercase text-center">{activeTab === 'Attendance' ? 'Status' : 'Grade / 20'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {students.map((s) => (
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
                        <input type="number" placeholder="--" onChange={(e) => setGradesData({...gradesData, [s.id]: e.target.value})}
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
    </div>
  );
};

export default ClassroomTasks;
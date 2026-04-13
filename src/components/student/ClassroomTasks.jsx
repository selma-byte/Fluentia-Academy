import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

const ClassroomTasks = () => {
  const [activeTab, setActiveTab] = useState('Attendance');
  const [selectedClass, setSelectedClass] = useState('');
  const [timeSlot, setTimeSlot] = useState('08:00 - 10:00');

  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  // student view data (read-only)
  const [attendanceData, setAttendanceData] = useState({});
  const [gradesData, setGradesData] = useState({});

  const currentStudent = "Student Name";

  // ==========================================
  // FETCH DATA (STUDENT VERSION)
  // ==========================================
  useEffect(() => {
    const fetchStudentData = async () => {
      setLoading(true);

      // classes (no teacher filter anymore)
      const { data: clsData } = await supabase.from('classes').select('*');
      if (clsData) setClasses(clsData);

      // students (classmates)
      const { data: stdData } = await supabase.from('students').select('*');
      if (stdData) setStudents(stdData);

      // attendance (READ ONLY)
      const { data: attData } = await supabase.from('attendance').select('*');
      if (attData) {
        const map = {};
        attData.forEach(a => {
          map[a.student_name] = a.status;
        });
        setAttendanceData(map);
      }

      // grades (READ ONLY)
      const { data: grData } = await supabase.from('grades').select('*');
      if (grData) {
        const map = {};
        grData.forEach(g => {
          map[g.student_name] = g.grade;
        });
        setGradesData(map);
      }

      setLoading(false);
    };

    fetchStudentData();
  }, []);

  // ==========================================
  // STUDENT VERSION → NO SAVE FUNCTIONS
  // ==========================================

  // ==========================================
  // UI (UNCHANGED EXACTLY)
  // ==========================================
  return (
    <div className="h-screen w-full flex flex-col bg-[#F4F7FE] overflow-hidden p-4 md:p-8">

      {/* Header */}
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-[#1B254B]">📋 Classroom Tasks</h1>
          <p className="text-xs text-[#A3AED0]">View your class activities.</p>
        </div>

        <div className="flex bg-gray-200/50 p-1 rounded-xl">
          {['Attendance', 'Grades'].map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-8 py-2 rounded-lg font-bold text-xs transition-all ${
                activeTab === t
                  ? 'bg-white text-[#4318FF] shadow-md'
                  : 'text-gray-500'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Controls (same UI, simplified) */}
      <div className="bg-white p-6 rounded-[24px] shadow-sm mb-6 flex flex-wrap gap-4 items-end shrink-0">

        <div className="flex-1 min-w-[200px]">
          <label className="text-[10px] font-black text-[#1B254B] mb-2 block uppercase">
            Your Class
          </label>

          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full bg-[#F4F7FE] rounded-xl p-3 text-xs font-bold outline-none"
          >
            <option value="">Select Class...</option>
            {classes.map(c => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* student: no exam input editing, just display */}
        <div className="flex-1 min-w-[200px]">
          <label className="text-[10px] font-black text-[#1B254B] mb-2 block uppercase">
            Time Slot
          </label>

          <select
            value={timeSlot}
            onChange={(e) => setTimeSlot(e.target.value)}
            className="w-full bg-[#F4F7FE] rounded-xl p-3 text-xs font-bold outline-none"
          >
            <option>08:00 - 10:00</option>
            <option>10:00 - 12:00</option>
            <option>13:00 - 15:00</option>
            <option>15:00 - 17:00</option>
          </select>
        </div>

        {/* NO SAVE BUTTON FOR STUDENT */}
        <div className="h-[48px] px-10 flex items-center text-xs font-bold text-gray-400">
          View Only Mode
        </div>
      </div>

      {/* TABLE (same design, read-only logic) */}
      <div className="flex-1 bg-white rounded-[24px] shadow-sm overflow-hidden flex flex-col">

        <div className="overflow-y-auto h-full custom-scrollbar">
          <table className="w-full text-left">

            <thead className="sticky top-0 bg-white z-10 shadow-sm">
              <tr>
                <th className="p-5 pl-10 text-[#A3AED0] text-[10px] font-black uppercase">
                  Student Name
                </th>

                <th className="p-5 text-[#A3AED0] text-[10px] font-black uppercase text-center">
                  {activeTab === 'Attendance' ? 'Status' : 'Grade / 20'}
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">

              {students.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">

                  <td className="p-4 pl-10 font-bold text-[#1B254B] text-sm">
                    {s.first_name} {s.last_name}
                  </td>

                  <td className="p-4">

                    {activeTab === 'Attendance' ? (
                      <div className="flex justify-center">
                        <span className="px-4 py-1.5 rounded-lg text-[10px] font-black bg-[#F4F7FE] text-[#1B254B]">
                          {attendanceData[`${s.first_name} ${s.last_name}`] || 'Pending'}
                        </span>
                      </div>

                    ) : (
                      <div className="flex justify-center">
                        <span className="px-4 py-1.5 rounded-lg text-sm font-bold text-[#1B254B] bg-[#F4F7FE]">
                          {gradesData[`${s.first_name} ${s.last_name}`] ?? '--'}
                        </span>
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
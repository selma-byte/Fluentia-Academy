import React, { useState } from 'react';

const TeacherAttendance = () => {
  // داتا تجريبية للتلاميذ (تقدري تبدليها مبعد بالداتا تاع سوبابيز)
  const [students, setStudents] = useState([
    { id: '01', name: 'Sophia Wilson', course: 'English Grammar B2', level: 'B2', date: '07 Apr 2026', status: 'Absent' },
    { id: '02', name: 'Liam Johnson', course: 'English Grammar B2', level: 'B2', date: '07 Apr 2026', status: 'Present' },
    { id: '03', name: 'Emma Brown', course: 'English Grammar B2', level: 'B2', date: '07 Apr 2026', status: 'Absent' },
    { id: '04', name: 'Noah Davis', course: 'English Grammar B2', level: 'B2', date: '07 Apr 2026', status: 'Present' },
    { id: '05', name: 'Olivia Garcia', course: 'English Grammar B2', level: 'B2', date: '07 Apr 2026', status: 'Present' },
  ]);

  // دالة باش الأستاذ يبدل حالة التلميذ (حاضر / غايب)
  const toggleAttendance = (id) => {
    setStudents(students.map(student => 
      student.id === id 
        ? { ...student, status: student.status === 'Present' ? 'Absent' : 'Present' }
        : student
    ));
  };

  return (
    <div className="flex-1 bg-white p-8 overflow-y-auto">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0A1128] flex items-center gap-2">
          👋 Welcome, [Teacher Name]
        </h1>
      </div>

      {/* Banner Section (Matching Figma) */}
      <div className="bg-[#f8fafc] rounded-2xl p-6 flex justify-between items-center mb-8 border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-[#0A1128] mb-2">Mark Attendance:</h2>
          <p className="text-gray-500 text-sm">Track and manage student attendance for each session.</p>
        </div>
        {/* Placeholder for the illustration & calendar in Figma */}
        <div className="hidden md:flex gap-4 items-center">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-center">
            <span className="text-2xl">📅</span>
            <div className="ml-3">
              <p className="text-xs text-gray-400 font-semibold uppercase">Semester 2</p>
              <p className="text-sm font-bold text-[#0A1128]">April 2026</p>
            </div>
          </div>
          <div className="w-32 h-24 bg-blue-50 rounded-xl flex items-center justify-center text-4xl">
            👩‍🏫
          </div>
        </div>
      </div>

      {/* Table Controls */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-[#0A1128]">Attendance List</h3>
        <div className="flex gap-3">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input 
              type="text" 
              placeholder="Search by student" 
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2D428B] w-64"
            />
          </div>
          <select className="border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600 outline-none">
            <option>📅 Today</option>
          </select>
          <select className="border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600 outline-none">
            <option>All Classes</option>
          </select>
          <select className="border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600 outline-none">
            <option>All Status</option>
          </select>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#f0f7ff] text-[#2D428B] text-sm border-b border-gray-100">
              <th className="py-4 px-6 font-semibold w-12"><input type="checkbox" className="rounded" /></th>
              <th className="py-4 px-6 font-semibold">No</th>
              <th className="py-4 px-6 font-semibold">Student Name</th>
              <th className="py-4 px-6 font-semibold">Course Name</th>
              <th className="py-4 px-6 font-semibold">Level</th>
              <th className="py-4 px-6 font-semibold">Date</th>
              <th className="py-4 px-6 font-semibold">Status</th>
              <th className="py-4 px-6 font-semibold text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={index} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="py-3 px-6"><input type="checkbox" className="rounded border-gray-300" /></td>
                <td className="py-3 px-6 text-sm text-gray-500">{student.id}</td>
                <td className="py-3 px-6 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                    {student.name.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-[#0A1128]">{student.name}</span>
                </td>
                <td className="py-3 px-6 text-sm text-gray-500">{student.course}</td>
                <td className="py-3 px-6 text-sm text-gray-500">{student.level}</td>
                <td className="py-3 px-6 text-sm text-gray-500">{student.date}</td>
                <td className="py-3 px-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center w-max gap-1
                    ${student.status === 'Present' ? 'bg-[#e6fbf2] text-[#00a65e]' : 'bg-[#fdeaea] text-[#e02424]'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${student.status === 'Present' ? 'bg-[#00a65e]' : 'bg-[#e02424]'}`}></span>
                    {student.status}
                  </span>
                </td>
                <td className="py-3 px-6 text-center">
                  {/* Button to toggle attendance */}
                  <button 
                    onClick={() => toggleAttendance(student.id)}
                    className="p-2 text-gray-400 hover:text-[#2D428B] bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow transition-all"
                    title="Mark/Change Status"
                  >
                    ✏️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Pagination Placeholder */}
        <div className="flex justify-between items-center p-4 border-t border-gray-50 text-sm text-gray-500">
          <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">Previous</button>
          <span>Page 1 of 12</span>
          <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">Next</button>
        </div>
      </div>
    </div>
  );
};

export default TeacherAttendance;
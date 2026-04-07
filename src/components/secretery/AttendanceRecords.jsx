import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient'; // زيدي هادا برك

const AttendanceRecords = () => {
  const [activeMode, setActiveMode] = useState('daily');
  const [currentView, setCurrentView] = useState('list');
  const [selectedStudent, setSelectedStudent] = useState(null);

  // 1. الفلاتر الأساسية (بما فيها توقيت الحصة الجديد)
  const [filterLang, setFilterLang] = useState('All');
  const [filterLevel, setFilterLevel] = useState('All');
  const [filterGroup, setFilterGroup] = useState('All');
  const [filterTime, setFilterTime] = useState('All'); // فلتر توقيت الحصة
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);

  // جلب بيانات الطلاب الأساسية
  const [studentsData, setStudentsData] = useState(() => {
    try {
      const saved = localStorage.getItem('languageStudentsData');
      if (saved) return JSON.parse(saved);
    } catch (error) { console.error(error); }
    return [
      { id: 'STU-2026-001', firstName: 'Alex', lastName: 'Sterling', email: 'alex.sterling@university.edu', language: 'English', level: 'B1', group: 'Grp 1' },
      { id: 'STU-2026-002', firstName: 'Fatima', lastName: 'Al-Rahman', email: 'fatima.rahman@email.com', language: 'Spanish', level: 'A2', group: 'Grp 2' },
      { id: 'STU-2026-003', firstName: 'Mohammed', lastName: 'Al-Sayed', email: 'mohammed.sayed@email.com', language: 'German', level: 'B2', group: 'Grp 1' },
      { id: 'STU-2026-004', firstName: 'Aisha', lastName: 'Mansour', email: 'aisha.m@university.edu', language: 'English', level: 'B1', group: 'Grp 1' }
    ];
  });

  // جلب السجل التاريخي الحقيقي من الذاكرة
  const [attendanceHistory, setAttendanceHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('languageAttendanceHistory');
      if (saved) return JSON.parse(saved);
    } catch (error) { console.error(error); }
    return [];
  });

  // حالة حضور اليوم المعروض حالياً
  const [attendanceState, setAttendanceState] = useState({});

  // 2. تحديث الحضور عند تغيير الفلاتر (التاريخ أو التوقيت)
  useEffect(() => {
    // نجلب السجلات لنفس اليوم ونفس التوقيت
    const todayLogs = attendanceHistory.filter(log => 
      log.date === attendanceDate && 
      (filterTime === 'All' || log.timeSlot === filterTime)
    );
    const todayState = {};
    todayLogs.forEach(log => {
      todayState[log.studentId] = log.status;
    });
    setAttendanceState(todayState);
  }, [attendanceDate, filterTime, attendanceHistory]);


  // ==========================================
  // الدالة الأساسية: تسجيل الحضور وحفظه مع توقيت الحصة
  // ==========================================
  const handleStatusToggle = async (student, status) => {
  if (filterTime === 'All') {
    alert("⚠️ Please select a specific 'Time Slot' before recording attendance.");
    return;
  }

  // إرسال البيانات لـ Supabase
  const { error } = await supabase
    .from('attendance')
    .upsert({ 
      student_name: `${student.firstName} ${student.lastName}`,
      course: student.language,
      teacher_name: "Sarah Jamel", // تقدري تبدليه
      date: attendanceDate,
      status: status,
      time_slot: filterTime 
    });

  if (error) {
    console.error("Error saving to Supabase:", error.message);
  } else {
    // هنا نخليوه يحدث الـ State المحلي باش يبان التغيير تم تم في الشاشة
    setAttendanceState(prev => ({ ...prev, [student.id]: status }));
    // نزيدوه في التاريخ المحلي (History) كيما كان الكود ديالك يدير
    const newLog = { studentId: student.id, studentName: `${student.firstName} ${student.lastName}`, language: student.language, date: attendanceDate, timeSlot: filterTime, status: status };
    setAttendanceHistory(prev => [newLog, ...prev.filter(log => !(log.studentId === student.id && log.date === attendanceDate && log.timeSlot === filterTime))]);
  }
};


  // الفلترة
  const filteredStudents = studentsData.filter(s => 
    (filterLang === 'All' || s.language === filterLang) &&
    (filterLevel === 'All' || s.level === filterLevel) &&
    (filterGroup === 'All' || s.group === filterGroup)
  );

  const filteredLogs = attendanceHistory.filter(log => 
    (filterLang === 'All' || log.language === filterLang) &&
    (filterLevel === 'All' || log.level === filterLevel) &&
    (filterGroup === 'All' || log.group === filterGroup) &&
    (filterTime === 'All' || log.timeSlot === filterTime)
  );

  // إحصائيات
  const totalStudents = filteredStudents.length;
  const presentCount = filteredStudents.filter(s => attendanceState[s.id] === 'Present').length;
  const absentCount = filteredStudents.filter(s => attendanceState[s.id] === 'Absent').length;
  const lateCount = filteredStudents.filter(s => attendanceState[s.id] === 'Late').length;
  const attendancePercentage = totalStudents === 0 ? 0 : Math.round(((presentCount + lateCount) / totalStudents) * 100);

  const openStudentProfile = (student) => { setSelectedStudent(student); setCurrentView('profile'); };

  // ==========================================
  // 1. واجهة قائمة الحضور (Daily)
  // ==========================================
  const renderDailyTracking = () => (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm border-b-4 border-b-blue-500">
          <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Total Students</p>
          <h2 className="text-4xl font-bold text-[#0A1128]">{totalStudents}</h2>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm border-b-4 border-b-green-500">
          <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Present Today</p>
          <h2 className="text-4xl font-bold text-[#0A1128]">{presentCount}</h2>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm border-b-4 border-b-red-500">
          <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Absent Today</p>
          <h2 className="text-4xl font-bold text-[#0A1128]">{absentCount}</h2>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm border-b-4 border-b-indigo-500">
          <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Attendance %</p>
          <h2 className="text-4xl font-bold text-[#0A1128]">{attendancePercentage}%</h2>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6">
        <h3 className="font-bold text-lg text-[#0A1128] mb-6">Student Roster</h3>
        
        {filterTime === 'All' && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-xl text-sm font-bold flex items-center">
            <span className="mr-2">⚠️</span> Please select a 'Time Slot' from the top filters to start recording attendance.
          </div>
        )}

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-100">
              <tr>
                <th className="py-4 px-4 font-bold text-gray-400 text-[10px] uppercase">Student Name</th>
                <th className="py-4 px-4 font-bold text-gray-400 text-[10px] uppercase">ID Number</th>
                <th className="py-4 px-4 font-bold text-gray-400 text-[10px] uppercase text-center">Status Toggle</th>
                <th className="py-4 px-4 font-bold text-gray-400 text-[10px] uppercase text-right">Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredStudents.map((student) => {
                const todayLog = attendanceHistory.find(log => log.studentId === student.id && log.date === attendanceDate && log.timeSlot === filterTime);
                
                return (
                  <tr key={student.id} className={`hover:bg-blue-50/50 transition-colors ${filterTime === 'All' ? 'opacity-50 pointer-events-none' : ''}`}>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => openStudentProfile(student)}>
                        <img src={`https://ui-avatars.com/api/?name=${student.firstName}+${student.lastName}&background=f1f5f9&color=0f172a`} className="w-10 h-10 rounded-full border border-gray-200 group-hover:border-blue-400" />
                        <p className="font-bold text-[#0A1128] group-hover:text-blue-600">{student.firstName} {student.lastName}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-500 font-medium text-xs">{student.id}</td>
                    <td className="py-4 px-4 text-center">
                      <div className="inline-flex bg-gray-100 rounded-xl p-1 shadow-inner">
                        {['Present', 'Absent', 'Late'].map(s => (
                          <button key={s} onClick={() => handleStatusToggle(student, s)} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${attendanceState[student.id] === s ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>{s}</button>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button onClick={() => openStudentProfile(student)} className="text-xs font-bold text-blue-600 hover:underline">View History →</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // ==========================================
  // 2. واجهة السجل التاريخي الكامل (Global History)
  // ==========================================
  const renderGlobalHistory = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-8">
        <h3 className="font-bold text-xl text-[#0A1128] mb-8">Past Attendance Records</h3>
        <div className="overflow-x-auto custom-scrollbar border border-gray-100 rounded-xl">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="py-4 px-6 text-gray-400 text-[10px] uppercase font-bold">Date & Session Time</th>
                <th className="py-4 px-6 text-gray-400 text-[10px] uppercase font-bold">Student Name</th>
                <th className="py-4 px-6 text-gray-400 text-[10px] uppercase font-bold">Language / ID</th>
                <th className="py-4 px-6 text-gray-400 text-[10px] uppercase font-bold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredLogs.length > 0 ? [...filteredLogs].reverse().map((log, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <span className="font-bold text-gray-600 mr-2">{log.date}</span>
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">{log.timeSlot}</span>
                  </td>
                  <td className="py-4 px-6">
                    <button onClick={() => openStudentProfile(studentsData.find(s => s.id === log.studentId))} className="font-bold text-[#0A1128] hover:text-blue-600">
                      {log.studentName}
                    </button>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-xs font-bold text-gray-400">{log.language} • {log.studentId}</span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-bold ${log.status === 'Absent' ? 'bg-red-50 text-red-600' : log.status === 'Late' ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'}`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="4" className="py-12 text-center text-gray-400 font-bold">No historical records found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // ==========================================
  // 3. ملف حضور الطالب الفردي
  // ==========================================
  const renderStudentProfile = () => {
    if (!selectedStudent) return null;
    
    const studentLogs = attendanceHistory.filter(log => log.studentId === selectedStudent.id);
    const stdTotal = studentLogs.length;
    const stdPresent = studentLogs.filter(l => l.status === 'Present').length;
    const stdAbsent = studentLogs.filter(l => l.status === 'Absent').length;
    const stdLate = studentLogs.filter(l => l.status === 'Late').length;
    const stdRate = stdTotal === 0 ? 100 : Math.round(((stdPresent + stdLate) / stdTotal) * 100);

    return (
      <div className="max-w-5xl mx-auto w-full space-y-8 animate-fade-in pb-10">
        <button onClick={() => setCurrentView('list')} className="w-10 h-10 bg-white border border-gray-200 rounded-full font-bold flex items-center justify-center hover:bg-gray-100 shadow-sm text-gray-600">←</button>
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex items-center space-x-6">
          <img src={`https://ui-avatars.com/api/?name=${selectedStudent.firstName}+${selectedStudent.lastName}&background=eff6ff&color=2563eb`} className="w-24 h-24 rounded-full border-4 border-white shadow-md" />
          <div>
            <h2 className="text-3xl font-bold text-[#0A1128]">{selectedStudent.firstName} {selectedStudent.lastName}</h2>
            <p className="text-gray-500 font-medium">ID: {selectedStudent.id} • {selectedStudent.language} {selectedStudent.level}</p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm text-center border-b-4 border-green-500">
            <h3 className="text-3xl font-bold text-green-600">{stdPresent}</h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase">Total Present</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm text-center border-b-4 border-red-500">
            <h3 className="text-3xl font-bold text-red-600">{stdAbsent}</h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase">Total Absent</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm text-center border-b-4 border-orange-500">
            <h3 className="text-3xl font-bold text-orange-500">{stdLate}</h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase">Total Late</p>
          </div>
          <div className="bg-[#0A1128] p-6 rounded-2xl shadow-sm text-center text-white">
            <h3 className="text-3xl font-bold">{stdRate}%</h3>
            <p className="text-[10px] font-bold text-white/70 uppercase">Attendance Rate</p>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6">
          <h3 className="font-bold text-lg text-[#0A1128] mb-6">Personal History Log</h3>
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-100">
              <tr>
                <th className="py-4 px-6 text-gray-400 text-[10px] uppercase font-bold">Date & Session Time</th>
                <th className="py-4 px-6 text-gray-400 text-[10px] uppercase font-bold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[...studentLogs].reverse().map((log, index) => (
                <tr key={index}>
                  <td className="py-4 px-6">
                    <span className="font-bold text-gray-600 mr-2">{log.date}</span>
                    <span className="text-[10px] text-blue-600 bg-blue-50 font-bold px-2 py-1 rounded">{log.timeSlot}</span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-bold ${log.status === 'Absent' ? 'bg-red-50 text-red-600' : log.status === 'Late' ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'}`}>{log.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full bg-[#f8fafc] p-8 overflow-y-auto custom-scrollbar">
      {currentView === 'profile' ? renderStudentProfile() : (
        <div className="max-w-6xl mx-auto w-full space-y-8 animate-fade-in">
          <div className="flex justify-between items-end">
            <h1 className="text-3xl font-bold text-[#0A1128]">Attendance Tracking</h1>
            <div className="flex bg-gray-200/50 p-1 rounded-xl">
              <button onClick={() => setActiveMode('daily')} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeMode === 'daily' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}>Daily Tracking</button>
              <button onClick={() => setActiveMode('history')} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeMode === 'history' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}>Absence History Log</button>
            </div>
          </div>

          {/* الفلاتر مدمجة مع توقيت الحصة */}
          <div className="grid grid-cols-5 gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div>
               <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Language</label>
               <select value={filterLang} onChange={(e) => setFilterLang(e.target.value)} className="w-full bg-transparent border-b-2 border-gray-200 py-2 text-sm font-bold text-[#0A1128] outline-none cursor-pointer"><option value="All">All</option><option value="English">English</option><option value="Spanish">Spanish</option><option value="German">German</option></select>
            </div>
            <div>
               <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Level</label>
               <select value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)} className="w-full bg-transparent border-b-2 border-gray-200 py-2 text-sm font-bold text-[#0A1128] outline-none cursor-pointer"><option value="All">All</option><option value="A1">A1</option><option value="A2">A2</option><option value="B1">B1</option></select>
            </div>
            <div>
               <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Group</label>
               <select value={filterGroup} onChange={(e) => setFilterGroup(e.target.value)} className="w-full bg-transparent border-b-2 border-gray-200 py-2 text-sm font-bold text-[#0A1128] outline-none cursor-pointer"><option value="All">All</option><option value="Grp 1">Grp 1</option><option value="Grp 2">Grp 2</option></select>
            </div>
            <div>
               <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Date</label>
               <input type="date" value={attendanceDate} onChange={(e) => setAttendanceDate(e.target.value)} className="w-full bg-transparent border-b-2 border-gray-200 py-2 text-sm font-bold text-[#0A1128] outline-none cursor-pointer" />
            </div>
            {/* فلتر توقيت الحصة الجديد */}
            <div>
               <label className="block text-[10px] font-bold text-blue-500 uppercase mb-2">Time Slot *</label>
               <select value={filterTime} onChange={(e) => setFilterTime(e.target.value)} className="w-full bg-transparent border-b-2 border-blue-400 py-2 text-sm font-bold text-blue-700 outline-none cursor-pointer">
                 <option value="All">- Select Time -</option>
                 <option value="08:00 - 10:00">08:00 - 10:00</option>
                 <option value="10:00 - 12:00">10:00 - 12:00</option>
                 <option value="14:00 - 16:00">14:00 - 16:00</option>
                 <option value="16:00 - 18:00">16:00 - 18:00</option>
               </select>
            </div>
          </div>

          {activeMode === 'daily' ? renderDailyTracking() : renderGlobalHistory()}
        </div>
      )}
    </div>
  );
};

export default AttendanceRecords;
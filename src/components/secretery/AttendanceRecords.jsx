import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../supabaseClient';

const Icons = {
  Search: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
  User: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
  Check: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>,
  Settings: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle></svg>,
  Award: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
};

const AttendanceRecords = () => {
  const [activeMode, setActiveMode] = useState('daily');
  const [currentView, setCurrentView] = useState('list');
  const [selectedStudent, setSelectedStudent] = useState(null);

  // 1. الفلاتر الأساسية
  const [filterLang, setFilterLang] = useState('All');
  const [filterLevel, setFilterLevel] = useState('All');
  const [filterGroup, setFilterGroup] = useState('All');
  const [filterTime, setFilterTime] = useState('All'); 
  
  const getTodayString = () => {
    const today = new Date();
    return new Date(today.getTime() - (today.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
  };
  const [attendanceDate, setAttendanceDate] = useState(getTodayString());

  const [studentsData, setStudentsData] = useState([]);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [classesData, setClassesData] = useState([]); 
  const [attendanceState, setAttendanceState] = useState({});

  // 💡 States for Justifications & Recovery Session
  const [justifications, setJustifications] = useState([]);
  const [roomsData, setRoomsData] = useState([]);
  const [staffData, setStaffData] = useState([]);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [selectedJustification, setSelectedJustification] = useState(null);
  
  const [recoveryForm, setRecoveryForm] = useState({
    date: getTodayString(),
    time: '14:00',
    teacher: '',
    room: ''
  });

  // ==========================================
  // 💡 جلب البيانات من السوبابيز
  // ==========================================
  const fetchAttendanceData = async () => {
    try {
      // أ. جلب الطلبة النشطين
      const { data: students } = await supabase.from('students').select('*').eq('status', 'Active');
      if (students) {
        const formattedStudents = students.map(s => ({
          id: s.id,
          firstName: s.first_name || '',
          lastName: s.last_name || '',
          email: s.email || '',
          phone: s.phone || '',
          language: s.language || '',
          level: s.level || '',
          group: s.group_name || ''
        }));
        setStudentsData(formattedStudents);
      }

      // ب. جلب سجلات الغياب مع إصلاح التكرار (Deduplication) 💡🔥
      const { data: rawLogs } = await supabase.from('attendance').select('*').order('created_at', { ascending: false }); 
      if (rawLogs) {
        // فلترة التكرار (نحكمو غير التسجيل الأخير لكل طالب في نفس اليوم والوقت)
        const uniqueLogsMap = new Map();
        rawLogs.forEach(a => {
           const cleanDate = a.date ? new Date(a.date).toISOString().split('T')[0] : '';
           const cleanTimeSlot = a.time_slot ? a.time_slot.trim() : '';
           const key = `${a.student_id}_${cleanDate}_${cleanTimeSlot}`;
           if (!uniqueLogsMap.has(key)) {
               uniqueLogsMap.set(key, a);
           }
        });

        // ترتيب السجلات زمنياً باش حساب الحصص يجي صحيح
        const sortedLogs = Array.from(uniqueLogsMap.values()).sort((a, b) => new Date(a.date) - new Date(b.date));

        let groupSessionsCount = {};
        const formattedLogs = sortedLogs.map(a => {
          const cleanDate = a.date ? new Date(a.date).toISOString().split('T')[0] : '';
          const cleanTimeSlot = a.time_slot ? a.time_slot.trim() : '';
          const cleanStatus = a.status ? a.status.charAt(0).toUpperCase() + a.status.slice(1).toLowerCase() : '';
          
          const groupKey = `${a.course}_${cleanDate}_${cleanTimeSlot}`;
          if (!groupSessionsCount[a.course]) groupSessionsCount[a.course] = [];
          if (!groupSessionsCount[a.course].includes(groupKey)) {
              groupSessionsCount[a.course].push(groupKey);
          }
          const sessionNum = groupSessionsCount[a.course].indexOf(groupKey) + 1;

          return {
            studentId: a.student_id, 
            studentName: a.student_name,
            language: a.course, 
            date: cleanDate, 
            timeSlot: cleanTimeSlot,
            status: cleanStatus,
            sessionNumber: `Session ${sessionNum.toString().padStart(2, '0')}` 
          };
        });
        setAttendanceHistory(formattedLogs);
      }

      // ج. جلب الأقسام لمعرفة الأوقات (Schedule)
      const { data: classes } = await supabase.from('classes').select('*');
      if (classes) setClassesData(classes);

      // د. جلب الأساتذة والقاعات (للبرمجة الاستدراكية)
      const { data: staff } = await supabase.from('staff').select('*');
      if (staff) setStaffData(staff.filter(s => s.role === 'Teacher' || s.department === 'English' || s.department === 'French'));
      
      const { data: rooms } = await supabase.from('rooms').select('*');
      if (rooms) setRoomsData(rooms);

      // هـ. جلب التبريرات (Justifications) من جدول communications
      const { data: comms } = await supabase.from('communications').select('*').eq('type', 'justification').order('created_at', { ascending: false });
      if (comms) setJustifications(comms);

    } catch (error) {
      console.error("Error fetching attendance data:", error);
    }
  };

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  // تحديث الحضور عند تغيير الفلاتر
  useEffect(() => {
    const todayLogs = attendanceHistory.filter(log => {
      const isDateMatch = log.date === attendanceDate;
      const isTimeMatch = filterTime === 'All' || (log.timeSlot && log.timeSlot === filterTime);
      return isDateMatch && isTimeMatch;
    });

    const todayState = {};
    todayLogs.forEach(log => {
      if (log.studentId) todayState[`id_${log.studentId}`] = log.status;
      if (log.studentName) todayState[`name_${log.studentName.trim().toLowerCase()}`] = log.status;
    });
    setAttendanceState(todayState);
  }, [attendanceDate, filterTime, attendanceHistory]);

  const handleStatusToggle = (student, status) => {
    alert("🔒 صلاحية الرؤية فقط: الأستاذ المعني هو من يحق له تسجيل أو تعديل الغيابات.");
  };

  // ==========================================
  // 💡 استخراج الخيارات والديناميكية للأوقات (Dynamic Time Slots)
  // ==========================================
  const uniqueLanguages = [...new Set(studentsData.map(s => s.language).filter(Boolean))];
  const uniqueLevels = [...new Set(studentsData.map(s => s.level).filter(Boolean))];
  const uniqueGroups = [...new Set(studentsData.map(s => s.group).filter(Boolean))];

  const availableTimeSlots = useMemo(() => {
    let slots = [];
    
    if (filterGroup !== 'All') {
      const selectedDayIndex = new Date(attendanceDate).getDay();
      const daysMap = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const dayName = daysMap[selectedDayIndex];

      const groupClass = classesData.find(c => c.name === filterGroup);
      if (groupClass && groupClass.schedule && groupClass.schedule.includes(dayName)) {
        const timeMatch = groupClass.schedule.match(/\d{2}:\d{2}\s*-\s*\d{2}:\d{2}/);
        if (timeMatch) slots.push(timeMatch[0]);
      }
      
      if (slots.length === 0) {
        const histTimes = attendanceHistory
          .filter(l => l.language === filterGroup || l.group === filterGroup)
          .map(l => l.timeSlot)
          .filter(Boolean);
        slots = [...new Set(histTimes)];
      }
    } else {
      slots = [...new Set(attendanceHistory.map(a => a.timeSlot).filter(Boolean))];
    }

    if (slots.length === 0) {
      slots = ['08:00 - 10:00', '10:00 - 12:00', '14:00 - 16:00', '16:00 - 18:00'];
    }
    
    return slots;
  }, [filterGroup, attendanceDate, classesData, attendanceHistory]);

  useEffect(() => {
    if (filterGroup !== 'All' && availableTimeSlots.length > 0) {
      if (!availableTimeSlots.includes(filterTime)) {
        setFilterTime(availableTimeSlots[0]); 
      }
    }
  }, [filterGroup, attendanceDate, availableTimeSlots]);

  const filteredStudents = studentsData.filter(s => 
    (filterLang === 'All' || s.language === filterLang) &&
    (filterLevel === 'All' || s.level === filterLevel) &&
    (filterGroup === 'All' || s.group === filterGroup)
  );

  const filteredLogs = attendanceHistory.filter(log => 
    (filterLang === 'All' || log.language === filterLang) &&
    (filterLevel === 'All' || log.level === filterLevel) &&
    (filterGroup === 'All' || log.language === filterGroup) && 
    (filterTime === 'All' || log.timeSlot === filterTime) &&
    (activeMode === 'daily' ? log.date === attendanceDate : true) 
  );

  const totalStudents = filteredStudents.length;
  const presentCount = filteredStudents.filter(s => attendanceState[`id_${s.id}`] === 'Present' || attendanceState[`name_${s.firstName.toLowerCase()} ${s.lastName.toLowerCase()}`] === 'Present').length;
  const absentCount = filteredStudents.filter(s => attendanceState[`id_${s.id}`] === 'Absent' || attendanceState[`name_${s.firstName.toLowerCase()} ${s.lastName.toLowerCase()}`] === 'Absent').length;
  const lateCount = filteredStudents.filter(s => attendanceState[`id_${s.id}`] === 'Late' || attendanceState[`name_${s.firstName.toLowerCase()} ${s.lastName.toLowerCase()}`] === 'Late').length;
  const attendancePercentage = totalStudents === 0 ? 0 : Math.round(((presentCount + lateCount) / totalStudents) * 100);

  const openStudentProfile = (student) => { setSelectedStudent(student); setCurrentView('profile'); };

  // ==========================================
  // 💡 برمجة حصة استدراكية (Recovery Session)
  // ==========================================
  const handleApproveJustification = (justif) => {
    setSelectedJustification(justif);
    setShowRecoveryModal(true);
  };

  const handleRejectJustification = async (justif) => {
    if (window.confirm("Are you sure you want to reject this justification?")) {
      await supabase.from('communications').update({ subject: `[REJECTED] ${justif.subject}` }).eq('id', justif.id);
      alert("Justification rejected.");
      fetchAttendanceData();
    }
  };

  const handleSaveRecoverySession = async (e) => {
    e.preventDefault();
    if (!recoveryForm.teacher || !recoveryForm.room || !recoveryForm.date || !recoveryForm.time) {
      return alert("⚠️ Please fill in all fields (Teacher, Room, Date, Time).");
    }

    try {
      // 1. Check Conflicts (Room / Teacher)
      const dateObj = new Date(recoveryForm.date);
      const daysMap = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const dayName = daysMap[dateObj.getDay()];
      const hourOnly = recoveryForm.time.substring(0, 2);

      const { data: conflicts } = await supabase.from('classes').select('*')
        .ilike('schedule', `%${dayName}%`)
        .ilike('schedule', `%${hourOnly}%`)
        .ilike('schedule', `%${recoveryForm.room}%`)
        .limit(1);

      if (conflicts && conflicts.length > 0) {
        return alert(`⚠️ Conflict! The room [${recoveryForm.room}] is booked by class: ${conflicts[0].name} at this time.`);
      }

      const { data: appConflicts } = await supabase.from('appointments').select('*')
        .eq('appointment_date', recoveryForm.date)
        .eq('start_time', recoveryForm.time)
        .or(`sub_title.ilike.%${recoveryForm.teacher}%,sub_title.ilike.%${recoveryForm.room}%`);

      if (appConflicts && appConflicts.length > 0) {
        return alert(`⚠️ Conflict! The teacher or room is already scheduled for another appointment.`);
      }

      // 2. Save the Recovery Session
      const studentName = selectedJustification.subject.split(':')[1].split('(')[0].trim();
      const stdObj = studentsData.find(s => `${s.firstName} ${s.lastName}`.includes(studentName));

      await supabase.from('appointments').insert([{
        title: studentName,
        sub_title: `Recovery Session (Prof: ${recoveryForm.teacher}, Room: ${recoveryForm.room})`,
        appointment_date: recoveryForm.date,
        start_time: recoveryForm.time,
        status: 'Upcoming',
        phone: stdObj ? stdObj.phone : ''
      }]);

      // 3. Mark Justification as Approved
      await supabase.from('communications').update({ subject: `[APPROVED] ${selectedJustification.subject}` }).eq('id', selectedJustification.id);

      alert(`✅ Recovery session successfully scheduled for ${studentName}!`);
      setShowRecoveryModal(false);
      fetchAttendanceData();

    } catch (err) {
      alert("Error scheduling recovery session: " + err.message);
    }
  };

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
        <h3 className="font-bold text-lg text-[#0A1128] mb-6">Student Roster ({new Date(attendanceDate).toLocaleDateString()})</h3>
        
        {filterTime === 'All' && filterGroup !== 'All' && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-xl text-sm font-bold flex items-center">
            <span className="mr-2">⚠️</span> Please confirm the 'Time Slot' from the top filters to view attendance.
          </div>
        )}

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-100">
              <tr>
                <th className="py-4 px-4 font-bold text-gray-400 text-[10px] uppercase">Student Name</th>
                <th className="py-4 px-4 font-bold text-gray-400 text-[10px] uppercase">ID Number</th>
                <th className="py-4 px-4 font-bold text-gray-400 text-[10px] uppercase text-center">Status (Read-Only)</th>
                <th className="py-4 px-4 font-bold text-gray-400 text-[10px] uppercase text-right">Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredStudents.map((student) => {
                const fullName = `${student.firstName} ${student.lastName}`.trim().toLowerCase();
                
                return (
                  <tr key={student.id} className={`hover:bg-blue-50/50 transition-colors ${filterTime === 'All' ? 'opacity-50' : ''}`}>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => openStudentProfile(student)}>
                        <img src={`https://ui-avatars.com/api/?name=${student.firstName}+${student.lastName}&background=f1f5f9&color=0f172a`} className="w-10 h-10 rounded-full border border-gray-200 group-hover:border-blue-400" alt="avatar" />
                        <p className="font-bold text-[#0A1128] group-hover:text-blue-600">{student.firstName} {student.lastName}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-500 font-medium">STD-{student.id || '2026'}</td>
                    <td className="py-4 px-4 text-center">
                      <div className="inline-flex bg-gray-100 rounded-xl p-1 shadow-inner opacity-80">
                        {['Present', 'Absent', 'Late'].map(s => {
                          const isMatched = attendanceState[`id_${student.id}`] === s || attendanceState[`name_${fullName}`] === s;
                          return (
                            <button 
                              key={s} 
                              onClick={() => handleStatusToggle(student, s)} 
                              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-not-allowed ${isMatched ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'}`}
                            >
                              {s}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button onClick={() => openStudentProfile(student)} className="text-xs font-bold text-blue-600 hover:underline">View History →</button>
                    </td>
                  </tr>
                );
              })}
              {filteredStudents.length === 0 && (
                 <tr><td colSpan="4" className="py-8 text-center text-gray-400 font-bold">No students found for this filter.</td></tr>
              )}
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
                <th className="py-4 px-6 text-gray-400 text-[10px] uppercase font-bold">Date & Time</th>
                <th className="py-4 px-6 text-gray-400 text-[10px] uppercase font-bold">Session</th>
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
                     <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-xs font-bold">{log.sessionNumber}</span>
                  </td>
                  <td className="py-4 px-6">
                    <button onClick={() => {
                        const std = studentsData.find(s => s.id === log.studentId);
                        if (std) openStudentProfile(std);
                      }} className="font-bold text-[#0A1128] hover:text-blue-600">
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
                <tr><td colSpan="5" className="py-12 text-center text-gray-400 font-bold">No historical records found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // ==========================================
  // 3. 💡 واجهة التبريرات (Justifications & Recovery) 
  // ==========================================
  const renderJustifications = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-8">
        <h3 className="font-bold text-xl text-[#0A1128] mb-2">Pending Justifications</h3>
        <p className="text-sm text-gray-500 mb-8">Review student absence excuses and schedule recovery sessions if approved.</p>
        
        <div className="space-y-4">
          {justifications.length === 0 ? (
             <div className="py-12 text-center border-2 border-dashed border-gray-200 rounded-2xl">
               <span className="text-4xl">📬</span>
               <p className="mt-4 text-gray-400 font-bold">No pending justifications.</p>
             </div>
          ) : (
            justifications.map((justif) => {
              const isApproved = justif.subject.includes('[APPROVED]');
              const isRejected = justif.subject.includes('[REJECTED]');
              const isPending = !isApproved && !isRejected;

              return (
                <div key={justif.id} className={`p-6 rounded-2xl border ${isApproved ? 'bg-green-50/50 border-green-100' : isRejected ? 'bg-red-50/50 border-red-100' : 'bg-white border-gray-200'} shadow-sm`}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                       <h4 className={`font-bold text-lg ${isApproved ? 'text-green-800' : isRejected ? 'text-red-800' : 'text-[#0A1128]'}`}>
                         {justif.subject.replace(/\[.*?\]\s*/, '')}
                       </h4>
                       <p className="text-xs text-gray-400 mt-1 font-bold">{new Date(justif.created_at).toLocaleString()}</p>
                    </div>
                    {isPending ? (
                      <div className="flex space-x-2">
                        <button onClick={() => handleApproveJustification(justif)} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-colors cursor-pointer">
                           ✓ Approve & Schedule
                        </button>
                        <button onClick={() => handleRejectJustification(justif)} className="bg-gray-100 hover:bg-red-100 hover:text-red-600 text-gray-600 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer">
                           ✕ Reject
                        </button>
                      </div>
                    ) : (
                      <span className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest border ${isApproved ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                        {isApproved ? 'Approved' : 'Rejected'}
                      </span>
                    )}
                  </div>
                  <div className="bg-gray-50/80 p-4 rounded-xl text-sm text-gray-700 leading-relaxed border border-gray-100">
                    <span className="font-bold text-gray-400 text-[10px] uppercase block mb-1">Student Message:</span>
                    {justif.content}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* نافذة الحصة الاستدراكية (Recovery Session Modal) */}
      {showRecoveryModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#F8F9FA] w-full max-w-lg rounded-3xl shadow-2xl p-8 font-sans">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#0A1128]">Schedule Recovery Session</h2>
              <button onClick={() => setShowRecoveryModal(false)} className="text-gray-400 hover:text-red-500 font-bold text-xl cursor-pointer">✕</button>
            </div>
            
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-6">
               <p className="text-xs text-blue-800 font-bold">Scheduling for: {selectedJustification?.subject.replace(/\[.*?\]\s*/, '')}</p>
            </div>

            <form onSubmit={handleSaveRecoverySession} className="grid grid-cols-2 gap-x-6 gap-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Date</label>
                <input 
                  type="date" 
                  value={recoveryForm.date} 
                  onChange={(e) => setRecoveryForm({...recoveryForm, date: e.target.value})} 
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-bold text-[#0A1128] outline-none focus:border-blue-500 cursor-pointer shadow-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Time</label>
                <input 
                  type="time" 
                  value={recoveryForm.time} 
                  onChange={(e) => setRecoveryForm({...recoveryForm, time: e.target.value})} 
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-bold text-[#0A1128] outline-none focus:border-blue-500 cursor-pointer shadow-sm"
                />
              </div>
              <div className="space-y-1.5 col-span-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Assign Teacher</label>
                <select value={recoveryForm.teacher} onChange={(e) => setRecoveryForm({...recoveryForm, teacher: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-bold text-[#0A1128] outline-none focus:border-blue-500 cursor-pointer shadow-sm">
                  <option value="">-- Select Teacher --</option>
                  {staffData.map(staff => <option key={staff.id} value={`${staff.first_name} ${staff.last_name}`}>{staff.first_name} {staff.last_name}</option>)}
                </select>
              </div>
              <div className="space-y-1.5 col-span-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Assign Room</label>
                <select value={recoveryForm.room} onChange={(e) => setRecoveryForm({...recoveryForm, room: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-bold text-[#0A1128] outline-none focus:border-blue-500 cursor-pointer shadow-sm">
                  <option value="">-- Select Room --</option>
                  {roomsData.map(room => <option key={room.id} value={room.name || room.room_name || room.id}>{room.name || room.room_name || `Room ${room.id}`}</option>)}
                </select>
              </div>

              <div className="col-span-2 flex justify-end items-center gap-4 mt-4 pt-4 border-t border-gray-200">
                <button type="button" onClick={() => setShowRecoveryModal(false)} className="text-sm font-bold text-gray-500 hover:text-gray-900 cursor-pointer px-4">Cancel</button>
                <button type="submit" className="bg-[#2563eb] text-white px-8 py-3 rounded-xl text-sm font-bold shadow-md hover:bg-blue-700 transition-colors cursor-pointer">Save & Schedule Session</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  // ==========================================
  // 4. ملف حضور الطالب الفردي (Profile View)
  // ==========================================
  const renderStudentProfile = () => {
    if (!selectedStudent) return null;
    
    const fullName = `${selectedStudent.firstName} ${selectedStudent.lastName}`.trim().toLowerCase();

    const studentLogs = attendanceHistory.filter(log => 
      String(log.studentId) === String(selectedStudent.id) || 
      (log.studentName && log.studentName.trim().toLowerCase() === fullName)
    );

    const stdTotal = studentLogs.length;
    const stdPresent = studentLogs.filter(l => l.status === 'Present').length;
    const stdAbsent = studentLogs.filter(l => l.status === 'Absent').length;
    const stdLate = studentLogs.filter(l => l.status === 'Late').length;
    const stdRate = stdTotal === 0 ? 0 : Math.round(((stdPresent + stdLate) / stdTotal) * 100);

    return (
      <div className="max-w-5xl mx-auto w-full space-y-8 animate-fade-in pb-10">
        <button onClick={() => setCurrentView('list')} className="w-10 h-10 bg-white border border-gray-200 rounded-full font-bold flex items-center justify-center hover:bg-gray-100 shadow-sm text-gray-600 cursor-pointer">←</button>
        
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex items-center space-x-6">
          <img src={`https://ui-avatars.com/api/?name=${selectedStudent.firstName}+${selectedStudent.lastName}&background=eff6ff&color=2563eb`} className="w-24 h-24 rounded-full border-4 border-white shadow-md" alt="avatar" />
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
          <div className="overflow-x-auto custom-scrollbar border border-gray-50 rounded-xl">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="py-4 px-6 text-gray-400 text-[10px] uppercase font-bold">Session</th> 
                    <th className="py-4 px-6 text-gray-400 text-[10px] uppercase font-bold">Date & Session Time</th>
                    <th className="py-4 px-6 text-gray-400 text-[10px] uppercase font-bold text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {studentLogs.length === 0 ? (
                    <tr><td colSpan="3" className="text-center py-8 text-gray-400 font-bold">No attendance records found.</td></tr>
                  ) : (
                    [...studentLogs].reverse().map((log, index) => (
                      <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-6">
                            <span className="bg-[#F4F7FE] text-[#4318FF] px-3 py-1.5 rounded-lg text-xs font-bold uppercase">{log.sessionNumber}</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="font-bold text-gray-600 mr-2">{log.date}</span>
                          <span className="text-[10px] text-blue-600 bg-blue-50 font-bold px-2 py-1 rounded">{log.timeSlot}</span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className={`px-3 py-1 rounded-lg text-[10px] font-bold ${log.status === 'Absent' ? 'bg-red-50 text-red-600' : log.status === 'Late' ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'}`}>{log.status}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
          </div>
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
              <button onClick={() => setActiveMode('daily')} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${activeMode === 'daily' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}>Daily Tracking</button>
              <button onClick={() => setActiveMode('history')} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${activeMode === 'history' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}>Absence History Log</button>
              {/* 💡 Button الجديد تاع التبريرات */}
              <button onClick={() => setActiveMode('justifications')} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer flex items-center ${activeMode === 'justifications' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}>
                 Justifications 
                 {justifications.filter(j => !j.subject.includes('[APPROVED]') && !j.subject.includes('[REJECTED]')).length > 0 && (
                   <span className="ml-2 bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full">{justifications.filter(j => !j.subject.includes('[APPROVED]') && !j.subject.includes('[REJECTED]')).length}</span>
                 )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div>
               <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Language</label>
               <select value={filterLang} onChange={(e) => setFilterLang(e.target.value)} className="w-full bg-transparent border-b-2 border-gray-200 py-2 text-sm font-bold text-[#0A1128] outline-none cursor-pointer">
                 <option value="All">All</option>
                 {uniqueLanguages.map(lang => <option key={lang} value={lang}>{lang}</option>)}
               </select>
            </div>
            <div>
               <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Level</label>
               <select value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)} className="w-full bg-transparent border-b-2 border-gray-200 py-2 text-sm font-bold text-[#0A1128] outline-none cursor-pointer">
                 <option value="All">All</option>
                 {uniqueLevels.map(level => <option key={level} value={level}>{level}</option>)}
               </select>
            </div>
            <div>
               <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Group</label>
               <select value={filterGroup} onChange={(e) => setFilterGroup(e.target.value)} className="w-full bg-transparent border-b-2 border-gray-200 py-2 text-sm font-bold text-[#0A1128] outline-none cursor-pointer">
                 <option value="All">All</option>
                 {uniqueGroups.map(group => <option key={group} value={group}>{group}</option>)}
               </select>
            </div>
            <div>
               <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Date</label>
               <input type="date" value={attendanceDate} onChange={(e) => setAttendanceDate(e.target.value)} className="w-full bg-transparent border-b-2 border-gray-200 py-2 text-sm font-bold text-[#0A1128] outline-none cursor-pointer" />
            </div>
            <div>
               <label className="block text-[10px] font-bold text-blue-500 uppercase mb-2">Time Slot *</label>
               <select value={filterTime} onChange={(e) => setFilterTime(e.target.value)} className="w-full bg-transparent border-b-2 border-blue-400 py-2 text-sm font-bold text-blue-700 outline-none cursor-pointer">
                 <option value="All">- Select Time -</option>
                 {availableTimeSlots.map(time => <option key={time} value={time}>{time}</option>)}
               </select>
            </div>
          </div>

          {activeMode === 'daily' && renderDailyTracking()}
          {activeMode === 'history' && renderGlobalHistory()}
          {activeMode === 'justifications' && renderJustifications()}
        </div>
      )}
    </div>
  );
};

export default AttendanceRecords;
import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

// ==========================================
// 🔔 MODERN NOTIFICATION COMPONENT (ENLARGED)
// ==========================================
const Toast = ({ message, onClose }) => (
  <div className="fixed bottom-12 right-12 z-[250] animate-in slide-in-from-right duration-500">
    <div className="bg-[#1A2252] text-white px-10 py-6 rounded-[2.5rem] shadow-2xl flex items-center gap-6 border border-blue-400/30 backdrop-blur-xl min-w-[400px]">
      <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-blue-500/40 animate-pulse">✨</div>
      <div className="flex-1 text-left">
        <p className="text-lg font-black italic tracking-tight leading-none mb-1">System Update</p>
        <p className="text-sm font-bold text-blue-200/80 italic">{message}</p>
      </div>
      <button onClick={onClose} className="ml-6 text-white/30 hover:text-white transition-colors text-2xl p-2 cursor-pointer">✕</button>
    </div>
  </div>
);

const Icons = {
  Search: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
  Book: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>,
};

// ==========================================
// 1. الرواق الأول: طلبات التسجيل (Registration Requests)
// ==========================================
const RegistrationRequestsTab = ({ showToast }) => {
  const [requests, setRequests] = useState([]);
  const [classesData, setClassesData] = useState([]); 
  const [staffData, setStaffData] = useState([]); 
  const [roomsData, setRoomsData] = useState([]); 
  const [filter, setFilter] = useState('All'); 

  const fetchRequests = async () => {
    const { data } = await supabase.from('students').select('*').eq('exam_type', 'Placement').order('enrollment_date', { ascending: false });
    if (data) {
      const formattedData = data.map(req => ({
        ...req, id: req.id, name: `${req.first_name} ${req.last_name}`,
        type: req.child_name || req.parent_email ? 'Parent' : 'Student',
        parent: req.child_name || req.parent_email ? 'Parent / Guardian' : null,
        language: req.language, level: req.level || "Placement Test", 
        status: req.status === 'Tested' ? 'Passed' : req.status === 'pending' ? 'Pending' : req.status
      }));
      setRequests(formattedData);
    }
  };

  const fetchClasses = async () => { const { data } = await supabase.from('classes').select('*'); if (data) setClassesData(data); };
  const fetchStaffAndRooms = async () => {
    const { data: staff } = await supabase.from('staff').select('*'); if (staff) setStaffData(staff);
    const { data: rooms } = await supabase.from('rooms').select('*'); if (rooms) setRoomsData(rooms);
  };

  useEffect(() => { fetchRequests(); fetchClasses(); fetchStaffAndRooms(); }, []);

  const [isEnrollMode, setIsEnrollMode] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isViewInfoModalOpen, setIsViewInfoModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(false); 
  
  const [schedDay, setSchedDay] = useState('Mon');
  const [schedTime, setSchedTime] = useState('10:00');
  const [schedDate, setSchedDate] = useState('');
  const [schedRoom, setSchedRoom] = useState('');
  const [schedTeacher, setSchedTeacher] = useState('');

  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyWhatsApp, setNotifyWhatsApp] = useState(false);

  const [enrollClassId, setEnrollClassId] = useState('');
  const [enrollGrade, setEnrollGrade] = useState('');
  const [enrollLevel, setEnrollLevel] = useState('A1');

  const getDayNumber = (dayStr) => { const days = { 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6, 'Sun': 0 }; return days[dayStr] || 1; };
  const parseTimeToFloat = (timeStr) => { const [hours, minutes] = timeStr.split(':'); return parseInt(hours) + parseInt(minutes)/60; };

  const detectLevelFromScore = (scoreStr) => {
    if (!scoreStr) return 'A1';
    const upper = String(scoreStr).toUpperCase();
    const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    for (let l of levels) { if (upper.includes(l)) return l; }
    const numMatch = upper.match(/(\d+)/);
    if (numMatch) {
       const score = parseFloat(numMatch[1]);
       if (score < 10) return 'A1'; if (score < 13) return 'A2'; if (score < 16) return 'B1'; if (score < 18) return 'B2'; return 'C1';
    }
    return 'A1';
  };

  const handleEnrollNow = (req) => { 
    setSelectedStudent(req); 
    const score = req.test_score || '';
    setEnrollGrade(score); 
    setEnrollLevel(detectLevelFromScore(score));
    setEnrollClassId(''); 
    setIsEnrollMode(true); 
  };
  const handleOpenScheduleModal = (req) => { setSelectedStudent(req); setIsScheduleModalOpen(true); };
  const handleOpenInfoModal = (req) => { setSelectedStudent(req); setIsViewInfoModalOpen(true); };

  const handleSaveSchedule = async () => {
    setLoading(true);
    try {
      if (!schedRoom || !schedTeacher) {
        showToast("⚠️ Teacher and Room are required to schedule!");
        setLoading(false); return;
      }

      const { data: existingTests } = await supabase.from('appointments').select('*').eq('appointment_day', getDayNumber(schedDay)).eq('start_time_float', parseTimeToFloat(schedTime)).ilike('sub_title', '%Placement Test%');
      if (existingTests && existingTests.length > 0) {
        if (!window.confirm(`⚠️ There are already ${existingTests.length} students scheduled for a Placement Test at this time! \n\nDo you want to add this student to the same session?`)) {
          setLoading(false); return; 
        }
      }

      const { data: conflicts } = await supabase.from('classes').select('*').ilike('schedule', `%${schedDay}%`).ilike('schedule', `%${schedTime}%`).ilike('schedule', `%${schedRoom}%`).limit(1);
      if (conflicts && conflicts.length > 0) {
        showToast(`⚠️ Room [${schedRoom}] is occupied by class: ${conflicts[0].name} at this time.`);
        setLoading(false); return; 
      }

      const fullAppointmentDate = `${schedDay}, ${schedTime}`;
      await supabase.from('students').update({ status: 'Scheduled', appointment_date: fullAppointmentDate }).eq('id', selectedStudent.id);
      await supabase.from('appointments').insert([{
          title: selectedStudent.name, sub_title: `Placement Test: ${selectedStudent.language} (Prof: ${schedTeacher}, Room: ${schedRoom})`, 
          appointment_day: getDayNumber(schedDay), start_time_float: parseTimeToFloat(schedTime), status: 'Upcoming', phone: selectedStudent.phone
      }]);

      showToast("✅ Placement test scheduled successfully!");
      setIsScheduleModalOpen(false); fetchRequests(); 
    } catch (err) { showToast("Error: " + err.message); } finally { setLoading(false); }
  };

  const handleFinalEnrollment = async () => {
    if (!enrollClassId) return showToast("⚠️ Please select a group!");
    if (!enrollGrade) return showToast("⚠️ Please enter the test score!");
    try {
      const selectedClass = classesData.find(c => c.id === enrollClassId);
      const currentCount = selectedClass.enrolled_count || 0;
      if (currentCount >= selectedClass.capacity) return showToast("❌ This group is full!");

      const { error: authError } = await supabase.auth.signUp({ email: selectedStudent.email, password: selectedStudent.phone });
      if (authError && authError.message !== "User already registered") throw authError;

      await supabase.from('classes').update({ enrolled_count: currentCount + 1 }).eq('id', enrollClassId);
      await supabase.from('students').update({ status: 'Active', exam_type: 'Course', group_name: selectedClass.name, level: enrollLevel, test_score: enrollGrade }).eq('id', selectedStudent.id);
      
      showToast(`🎉 ${selectedStudent.name} is now officially enrolled in ${selectedClass.name}!`);
      setIsEnrollMode(false); fetchRequests();
    } catch (err) { showToast("Enrollment Error: " + err.message); }
  };

  const filteredRequestsList = requests.filter(req => { if (filter === 'All') return true; return req.type === filter; });

  if (isEnrollMode) {
    const matchingClasses = classesData.filter(c => c.language === selectedStudent?.language && c.level === enrollLevel);
    return (
      <div className="min-h-screen bg-[#F8F9FA] p-12 font-sans text-left transition-all duration-300">
        <div className="flex items-center mb-12">
          <button onClick={() => setIsEnrollMode(false)} className="w-10 h-10 bg-white shadow-sm rounded-full flex items-center justify-center mr-6 hover:bg-gray-100 cursor-pointer text-gray-400">←</button>
          <h1 className="text-3xl font-bold text-[#0A1128]">Enroll Student</h1>
        </div>
        <div className="max-w-6xl space-y-16">
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-sm font-bold text-[#0A1128] mb-6 uppercase tracking-wide border-b border-gray-100 pb-2 w-max">🎓 Final Registration Decision</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                   <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Test Score</label>
                   <input type="text" value={enrollGrade} onChange={(e) => { setEnrollGrade(e.target.value); setEnrollLevel(detectLevelFromScore(e.target.value)); setEnrollClassId(''); }} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-black text-blue-600 outline-none focus:border-[#0A1128]" />
                </div>
                <div>
                   <label className="block text-[10px] font-bold text-[#2563eb] uppercase tracking-widest mb-2">Assign Level</label>
                   <select value={enrollLevel} onChange={(e) => { setEnrollLevel(e.target.value); setEnrollClassId(''); }} className="w-full bg-blue-50 border border-blue-200 text-blue-700 rounded-xl p-3 text-sm font-bold outline-none cursor-pointer">
                      <option value="A1">A1</option><option value="A2">A2</option><option value="B1">B1</option><option value="B2">B2</option><option value="C1">C1</option><option value="C2">C2</option>
                   </select>
                </div>
                <div>
                   <label className="block text-[10px] font-bold text-[#00a65e] uppercase tracking-widest mb-2">Available Groups</label>
                   <select value={enrollClassId} onChange={(e) => setEnrollClassId(e.target.value)} className="w-full bg-green-50 border border-green-200 text-green-700 rounded-xl p-3 text-sm font-bold outline-none cursor-pointer">
                      <option value="">-- Select Group --</option>
                      {matchingClasses.length === 0 && <option disabled>❌ No classes found</option>}
                      {matchingClasses.map(c => {
                          const isFull = (c.enrolled_count || 0) >= (c.capacity || 20);
                          return <option key={c.id} value={c.id} disabled={isFull}>{c.name} ({(c.enrolled_count || 0)}/{c.capacity || 20}) {isFull ? '🔴 FULL' : ''}</option>
                      })}
                   </select>
                </div>
            </div>
          </section>
          <div className="flex justify-end space-x-4 pt-12 text-left">
            <button onClick={() => setIsEnrollMode(false)} className="px-10 py-3 bg-gray-100 text-gray-500 rounded-xl text-sm font-bold hover:bg-gray-200 cursor-pointer">Cancel</button>
            <button onClick={handleFinalEnrollment} className="px-10 py-3 bg-[#0A1128] text-white rounded-xl text-sm font-bold hover:bg-blue-900 shadow-lg cursor-pointer">Approve & Save</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-[#F8F9FA] h-full font-sans text-left text-[#0A1128] overflow-y-auto custom-scrollbar">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold uppercase tracking-tight text-[#0A1128]">Registration Requests</h1>
        <div className="flex bg-[#0A1128] text-white rounded-2xl p-1 text-[11px] font-bold shadow-xl border border-white/5">
          <button onClick={() => setFilter('All')} className={`px-8 py-2 rounded-xl transition-all cursor-pointer ${filter === 'All' ? 'bg-[#3E4668] text-white' : 'opacity-40 hover:opacity-100'}`}>All</button>
          <button onClick={() => setFilter('Student')} className={`px-8 py-2 rounded-xl transition-all cursor-pointer ${filter === 'Student' ? 'bg-[#3E4668] text-white' : 'opacity-40 hover:opacity-100'}`}>Students</button>
          <button onClick={() => setFilter('Parent')} className={`px-8 py-2 rounded-xl transition-all cursor-pointer ${filter === 'Parent' ? 'bg-[#3E4668] text-white' : 'opacity-40 hover:opacity-100'}`}>Parents</button>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#0A1128] text-white text-[10px] font-bold uppercase tracking-[0.2em]">
              <th className="p-6">Applicant Details</th><th className="p-6 text-center">Type</th><th className="p-6">Course Info</th><th className="p-6 text-center">Status</th><th className="p-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredRequestsList.map((req) => (
              <tr key={req.id} className="hover:bg-blue-50/5 transition-colors">
                <td className="p-6">
                  <div className="font-bold text-[#0A1128] text-lg">{req.name}</div>
                  {req.parent && <div className="text-[10px] text-blue-600 font-bold uppercase mt-1">{req.parent}</div>}
                </td>
                <td className="p-6 text-center">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold mx-auto flex items-center justify-center w-max gap-2 ${req.type === "Student" ? "bg-blue-50 text-blue-700" : "bg-purple-50 text-purple-700"}`}>
                    {req.type === "Student" ? "🎓 Student" : "👥 Parent"}
                  </span>
                </td>
                <td className="p-6 text-gray-700"><div className="text-sm font-bold">{req.language}</div><div className="text-[10px] text-gray-400 font-bold uppercase">Level: {req.level}</div></td>
                <td className="p-6 text-center">
                  <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black border ${req.status === 'Passed' ? 'bg-green-50 text-green-600 border-green-100' : req.status === 'Scheduled' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                    {req.status.toUpperCase()}
                  </span>
                </td>
                <td className="p-6 flex justify-center gap-3 items-center">
                  <button onClick={() => handleOpenInfoModal(req)} className="px-3 py-2 bg-gray-50 text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors shadow-sm" title="View Details">👁️</button>
                  {req.status === 'Passed' ? (
                    <button onClick={() => handleEnrollNow(req)} className="px-6 py-2 bg-green-600 text-white rounded-xl text-[11px] font-bold hover:bg-green-700 cursor-pointer shadow-md">Enroll Now ✅</button>
                  ) : (
                    <button onClick={() => handleOpenScheduleModal(req)} disabled={req.status === 'Scheduled'} className={`px-4 py-2 rounded-xl text-[11px] font-bold transition-all shadow-sm ${req.status === 'Scheduled' ? 'bg-gray-100 text-gray-300 cursor-not-allowed border border-gray-100' : 'bg-[#0A1128] text-white hover:bg-blue-900 cursor-pointer'}`}>
                      {req.status === 'Scheduled' ? 'Scheduled 📅' : 'Schedule Test 📅'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredRequestsList.length === 0 && <div className="p-20 text-center text-gray-300 font-bold italic">No requests found.</div>}
      </div>

      {isViewInfoModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 font-sans border border-gray-100">
            <div className="flex justify-between items-center mb-6">
               <h2 className="text-xl font-bold text-[#0A1128]">Applicant Details</h2>
               <button onClick={() => setIsViewInfoModalOpen(false)} className="text-gray-400 hover:text-red-500 font-bold text-xl">×</button>
            </div>
            <div className="space-y-4">
               <div className="bg-gray-50 p-4 rounded-xl border border-gray-100"><p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Full Name</p><p className="text-sm font-bold text-[#0A1128]">{selectedStudent?.name}</p></div>
               <div className="grid grid-cols-2 gap-4">
                 <div className="bg-gray-50 p-4 rounded-xl border border-gray-100"><p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Phone</p><p className="text-sm font-bold text-[#0A1128]">{selectedStudent?.phone || 'N/A'}</p></div>
                 <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 overflow-hidden"><p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Email</p><p className="text-sm font-bold text-[#0A1128] truncate">{selectedStudent?.email || 'N/A'}</p></div>
               </div>
               {selectedStudent?.test_score && <div className="bg-green-50 p-4 rounded-xl border border-green-100"><p className="text-[10px] text-green-600 font-bold uppercase tracking-widest mb-1">Test Score</p><p className="text-lg font-black text-green-700">{selectedStudent?.test_score}</p></div>}
            </div>
            <button onClick={() => setIsViewInfoModalOpen(false)} className="w-full mt-6 bg-[#0A1128] text-white py-3 rounded-xl font-bold text-sm hover:bg-black transition-colors">Close</button>
          </div>
        </div>
      )}

      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#F8F9FA] w-full max-w-lg rounded-3xl shadow-2xl p-8 font-sans text-left">
            <h2 className="text-xl font-bold text-[#0A1128] mb-8">Schedule Placement Test</h2>
            <div className="grid grid-cols-2 gap-x-6 gap-y-6">
              <div className="space-y-1.5"><label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Day</label>
                <div className="relative"><select value={schedDay} onChange={(e) => setSchedDay(e.target.value)} className="w-full bg-transparent border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-bold outline-none appearance-none cursor-pointer"><option value="Mon">Mon</option><option value="Tue">Tue</option><option value="Wed">Wed</option><option value="Thu">Thu</option></select><span className="absolute right-4 top-3 text-gray-500 text-[10px]">▼</span></div>
              </div>
              <div className="space-y-1.5"><label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Time Block</label>
                <div className="relative"><select value={schedTime} onChange={(e) => setSchedTime(e.target.value)} className="w-full bg-transparent border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-bold outline-none appearance-none cursor-pointer"><option value="10:00">10:00</option><option value="14:00">14:00</option></select><span className="absolute right-4 top-3 text-gray-500 text-[10px]">▼</span></div>
              </div>
              <div className="space-y-1.5"><label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Teacher</label>
                <div className="relative"><select value={schedTeacher} onChange={(e) => setSchedTeacher(e.target.value)} className="w-full bg-transparent border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-bold outline-none appearance-none cursor-pointer"><option value="">-- Select --</option>{staffData.map(s => <option key={s.id} value={`${s.first_name} ${s.last_name}`}>{s.first_name} {s.last_name}</option>)}</select><span className="absolute right-4 top-3 text-gray-500 text-[10px]">▼</span></div>
              </div>
              <div className="space-y-1.5"><label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Room</label>
                <div className="relative"><select value={schedRoom} onChange={(e) => setSchedRoom(e.target.value)} className="w-full bg-transparent border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-bold outline-none appearance-none cursor-pointer"><option value="">-- Select --</option>{roomsData.map(r => <option key={r.id} value={r.name || r.id}>{r.name || `Room ${r.id}`}</option>)}</select><span className="absolute right-4 top-3 text-gray-500 text-[10px]">▼</span></div>
              </div>
            </div>
            <div className="flex justify-end items-center gap-6 mt-8">
              <button onClick={() => setIsScheduleModalOpen(false)} className="text-sm font-bold text-gray-600 hover:text-gray-900 cursor-pointer">Cancel</button>
              <button onClick={handleSaveSchedule} className="bg-[#0A1128] text-white px-8 py-3 rounded-xl text-sm font-bold shadow-md hover:bg-blue-900 transition-colors cursor-pointer">Save & Notify</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 2. الرواق الثاني: السجل الرسمي (Active Records)
// ==========================================
const StudentRecordsTab = ({ showToast }) => {
  const [currentView, setCurrentView] = useState('list');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLang, setFilterLang] = useState('All');
  const [filterLevel, setFilterLevel] = useState('All');
  const [filterGroup, setFilterGroup] = useState('All');
  const [studentsData, setStudentsData] = useState([]);
  
  const fetchActiveStudents = async () => {
    const { data } = await supabase.from('students').select('*').eq('status', 'Active');
    if (data) {
      const formatted = data.map(s => ({
        ...s, id: s.id, firstName: s.first_name || '', lastName: s.last_name || '', language: s.language || '', level: s.level || '', group: s.group_name || '', status: s.status || '', phone: s.phone || '', email: s.email || '', address: s.address || '', parentName: s.parent_name || '', parentContact: s.parent_contact || '', enrollmentDate: s.enrollment_date || ''
      }));
      setStudentsData(formatted);
    }
  };
  useEffect(() => { fetchActiveStudents(); }, []);

  const [academicEntry, setAcademicEntry] = useState({ subject: '', grade: '', attendance: '', remarks: '' });
  const [contactEntry, setContactEntry] = useState({ phone: '', email: '', address: '', parentName: '', parentContact: '' });

  const filteredStudents = studentsData.filter(student => {
    const matchLang = filterLang === 'All' || student.language === filterLang;
    const matchLevel = filterLevel === 'All' || student.level === filterLevel;
    const matchGroup = filterGroup === 'All' || student.group === filterGroup;
    const matchSearch = student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) || student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) || String(student.id).toLowerCase().includes(searchQuery.toLowerCase());
    return matchLang && matchLevel && matchGroup && matchSearch;
  });

  const handleViewProfile = (student) => {
    setSelectedStudent(student);
    setContactEntry({ phone: student.phone || '', email: student.email || '', address: student.address || '', parentName: student.parentName || '', parentContact: student.parentContact || '' });
    setCurrentView('profile');
  };

  const handleUpdateAcademic = (e) => { e.preventDefault(); showToast(`✅ Academic record saved for ${selectedStudent.firstName}! Grade: ${academicEntry.grade}`); setAcademicEntry({ subject: '', grade: '', attendance: '', remarks: '' }); };
  const handleUpdateContact = (e) => { e.preventDefault(); showToast(`✅ Contact info updated for ${selectedStudent.firstName}!`); };
  const handlePrint = () => { window.print(); };

  const renderList = () => (
    <div className="w-full flex flex-col min-h-full animate-fade-in p-8 text-left">
      <div className="flex justify-between items-center mb-8 shrink-0">
        <div><h2 className="text-3xl font-bold text-[#0A1128] mb-1">Student Records</h2><p className="text-sm font-bold text-gray-500">Manage academic performance for {filteredStudents.length} students</p></div>
      </div>
      <div className="flex flex-wrap items-center gap-4 mb-6 shrink-0 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="relative flex-1 min-w-[250px]">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">🔍</span>
          <input type="text" placeholder="Search by name or ID..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 transition-all" />
        </div>
        <select value={filterLang} onChange={(e) => setFilterLang(e.target.value)} className="bg-gray-50 border border-gray-200 text-sm rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 font-bold text-gray-600 cursor-pointer"><option value="All">🌐 All Languages</option><option value="English">English</option><option value="Spanish">Spanish</option><option value="German">German</option><option value="French">French</option></select>
        <select value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)} className="bg-gray-50 border border-gray-200 text-sm rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 font-bold text-gray-600 cursor-pointer"><option value="All">📊 All Levels</option><option value="A1">A1</option><option value="A2">A2</option><option value="B1">B1</option><option value="B2">B2</option><option value="C1">C1</option></select>
      </div>
      <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr><th className="py-4 px-6 font-bold text-gray-600 uppercase text-xs">Student ID</th><th className="py-4 px-6 font-bold text-gray-600 uppercase text-xs">Name</th><th className="py-4 px-6 font-bold text-gray-600 uppercase text-xs">Language</th><th className="py-4 px-6 font-bold text-gray-600 uppercase text-xs">Level / Grp</th><th className="py-4 px-6 font-bold text-gray-600 uppercase text-xs text-center">Manage Record</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredStudents.length > 0 ? filteredStudents.map((student) => (
              <tr key={student.id} className="hover:bg-blue-50/5 transition-colors group">
                <td className="py-4 px-6 font-bold text-gray-500">{student.id}</td>
                <td className="py-4 px-6"><p className="font-bold text-[#0A1128]">{student.firstName} {student.lastName}</p></td>
                <td className="py-4 px-6 font-medium text-gray-700">{student.language}</td>
                <td className="py-4 px-6 font-medium text-gray-700">{student.level} • {student.group}</td>
                <td className="py-4 px-6 flex justify-center">
                  <button onClick={() => handleViewProfile(student)} className="bg-white border border-gray-200 hover:bg-[#2563eb] hover:text-white hover:border-[#2563eb] text-gray-700 font-bold py-1.5 px-4 rounded-lg transition-all cursor-pointer text-xs shadow-sm">Open Record</button>
                </td>
              </tr>
            )) : <tr><td colSpan="5" className="py-12 text-center text-gray-400"><p className="text-4xl mb-2">🔍</p><p className="font-bold">No students found.</p></td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderProfile = () => {
    if (!selectedStudent) return null;
    return (
      <div className="w-full flex flex-col min-h-full animate-fade-in pb-12 p-8 text-left">
        <div className="flex justify-between items-center mb-6 max-w-6xl mx-auto w-full">
          <div className="flex items-center">
            <button onClick={() => setCurrentView('list')} className="mr-4 w-10 h-10 bg-white border border-gray-200 rounded-full font-bold flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer shadow-sm text-gray-600">←</button>
            <h2 className="text-2xl font-bold text-[#0A1128]">Student Profile</h2>
          </div>
        </div>
        <div className="max-w-6xl mx-auto w-full space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex justify-between items-center">
               <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold">
                     {selectedStudent.firstName[0]}{selectedStudent.lastName[0]}
                  </div>
                  <div>
                     <h3 className="text-xl font-bold text-[#0A1128]">{selectedStudent.firstName} {selectedStudent.lastName}</h3>
                     <p className="text-xs text-gray-500 font-medium">ID: {selectedStudent.id} • Enrolled: {selectedStudent.enrollmentDate}</p>
                     <div className="flex space-x-3 mt-2">
                        <span className="text-xs font-bold text-blue-600">{selectedStudent.language}</span><span className="text-xs font-bold text-purple-600">Level {selectedStudent.level}</span><span className="text-xs font-bold text-green-600">{selectedStudent.status}</span>
                     </div>
                  </div>
               </div>
               <button onClick={handlePrint} className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors cursor-pointer flex items-center"><span className="mr-2">🖨️</span> Print Record</button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex flex-col">
                   <h4 className="font-bold text-sm text-[#0A1128] mb-4 flex items-center"><span className="mr-2">🎓</span> Update Academic Info</h4>
                   <form onSubmit={handleUpdateAcademic} className="space-y-4 flex-1 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div><label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Course / Assessment</label><input type="text" placeholder="e.g. Midterm Exam" value={academicEntry.subject} onChange={(e) => setAcademicEntry({...academicEntry, subject: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500" required /></div>
                        <div className="grid grid-cols-2 gap-4">
                           <div><label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Grade / Score</label><input type="text" placeholder="e.g. 85%" value={academicEntry.grade} onChange={(e) => setAcademicEntry({...academicEntry, grade: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500" required /></div>
                           <div><label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Attendance Rate</label><input type="text" placeholder="e.g. 95%" value={academicEntry.attendance} onChange={(e) => setAcademicEntry({...academicEntry, attendance: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500" /></div>
                        </div>
                        <div><label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Teacher Remarks</label><textarea rows="2" placeholder="Add comments here..." value={academicEntry.remarks} onChange={(e) => setAcademicEntry({...academicEntry, remarks: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500 resize-none"></textarea></div>
                      </div>
                      <button type="submit" className="w-full bg-[#2563eb] hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg transition-colors shadow-sm cursor-pointer mt-4 text-sm">Save Academic Record</button>
                   </form>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex flex-col">
                   <h4 className="font-bold text-sm text-[#0A1128] mb-4 flex items-center"><span className="mr-2">📞</span> Update Contact Info</h4>
                   <form onSubmit={handleUpdateContact} className="space-y-4 flex-1 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                           <div><label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Student Phone</label><input type="tel" value={contactEntry.phone} onChange={(e) => setContactEntry({...contactEntry, phone: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500" /></div>
                           <div><label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Email</label><input type="email" value={contactEntry.email} onChange={(e) => setContactEntry({...contactEntry, email: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500" /></div>
                        </div>
                        <div><label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Home Address</label><input type="text" value={contactEntry.address} onChange={(e) => setContactEntry({...contactEntry, address: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500" /></div>
                        <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4 mt-2">
                           <div><label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Parent/Guardian Name</label><input type="text" value={contactEntry.parentName} onChange={(e) => setContactEntry({...contactEntry, parentName: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500" /></div>
                           <div><label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Parent Contact</label><input type="tel" value={contactEntry.parentContact} onChange={(e) => setContactEntry({...contactEntry, parentContact: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500" /></div>
                        </div>
                      </div>
                      <button type="submit" className="w-full bg-[#0A1128] hover:bg-gray-800 text-white font-bold py-2.5 rounded-lg transition-colors shadow-sm cursor-pointer mt-4 text-sm">Update Contact Details</button>
                   </form>
                </div>
            </div>
        </div>
      </div>
    );
  };
  return <div className="h-full w-full">{currentView === 'list' ? renderList() : renderProfile()}</div>;
};

// ==========================================
// 3. الرواق الثالث: تسجيل جديد مباشر (Add Student & Family)
// ==========================================
const StudentRegistrationTab = ({ showToast }) => {
  const [loading, setLoading] = useState(false);
  const [regMode, setRegMode] = useState('Single'); 
  const [classesData, setClassesData] = useState([]);

  const [singleData, setSingleData] = useState({ 
    firstName: '', lastName: '', language: 'English', level: 'A1', classId: '', 
    phone: '', email: '', parentEmail: '', exam_type: 'Course'
  });

  const [parentData, setParentData] = useState({ firstName: '', lastName: '', email: '', phone: '' });
  const [kidsList, setKidsList] = useState([
    { firstName: '', lastName: '', language: 'English', level: 'A1', classId: '', phone: '', email: '', exam_type: 'Course' }
  ]);

  useEffect(() => { const fetchClasses = async () => { const { data } = await supabase.from('classes').select('*'); if (data) setClassesData(data); }; fetchClasses(); }, []);

  const addKid = () => setKidsList([...kidsList, { firstName: '', lastName: '', language: 'English', level: 'A1', classId: '', phone: '', email: '', exam_type: 'Course' }]);
  const removeKid = (index) => setKidsList(kidsList.filter((_, i) => i !== index));
  const handleKidChange = (index, field, value) => { const newKids = [...kidsList]; newKids[index][field] = value; setKidsList(newKids); };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (regMode === 'Single') {
        const isPlacement = singleData.exam_type === 'Placement';
        let selectedClassName = null;

        if (!isPlacement) {
          if (!singleData.classId) { showToast("⚠️ Please select a group!"); setLoading(false); return; }
          const selectedClass = classesData.find(c => c.id === singleData.classId);
          selectedClassName = selectedClass.name;
          const currentCount = selectedClass.enrolled_count || 0;
          if (currentCount >= selectedClass.capacity) { showToast("❌ This group is full!"); setLoading(false); return; }
          await supabase.from('classes').update({ enrolled_count: currentCount + 1 }).eq('id', singleData.classId);
        }

        const { error: authError } = await supabase.auth.signUp({ email: singleData.email, password: singleData.phone });
        if (authError && authError.message !== "User already registered") throw authError; 

        if (singleData.parentEmail) {
          const { error: parentAuthError } = await supabase.auth.signUp({ email: singleData.parentEmail, password: singleData.phone });
          if (parentAuthError && parentAuthError.message !== "User already registered") console.error(parentAuthError);
        }

        const { error: dbError } = await supabase.from('students').insert([{
          first_name: singleData.firstName, last_name: singleData.lastName, email: singleData.email, phone: singleData.phone, parent_email: singleData.parentEmail || null, language: singleData.language, level: singleData.level, group_name: selectedClassName, exam_type: singleData.exam_type, status: isPlacement ? 'Pending' : 'Active', enrollment_date: new Date().toISOString().split('T')[0]
        }]);

        if (dbError) throw dbError;
        showToast(isPlacement ? "✅ Registration request saved for test!" : `🎉 Student ${singleData.firstName} registered successfully!`);
        setSingleData({ firstName: '', lastName: '', language: 'English', level: 'A1', classId: '', phone: '', email: '', parentEmail: '', exam_type: 'Course' });

      } else {
        if (!parentData.email) { showToast("⚠️ Parent email is required!"); setLoading(false); return; }
        if (kidsList.length === 0) { showToast("⚠️ Add at least one child!"); setLoading(false); return; }

        const { error: parentAuthError } = await supabase.auth.signUp({ email: parentData.email, password: parentData.phone });
        if (parentAuthError && parentAuthError.message !== "User already registered") console.error(parentAuthError);

        for (let i = 0; i < kidsList.length; i++) {
          const kid = kidsList[i];
          const isPlacement = kid.exam_type === 'Placement';
          let selectedClassName = null;

          if (!isPlacement) {
            if (!kid.classId) { showToast(`⚠️ Select a group for ${kid.firstName}`); setLoading(false); return; }
            const selectedClass = classesData.find(c => c.id === kid.classId);
            selectedClassName = selectedClass.name;
            const currentCount = selectedClass.enrolled_count || 0;
            if (currentCount >= selectedClass.capacity) { showToast(`❌ Group for ${kid.firstName} is full!`); setLoading(false); return; }
            await supabase.from('classes').update({ enrolled_count: currentCount + 1 }).eq('id', kid.classId);
          }

          const { error: authError } = await supabase.auth.signUp({ email: kid.email, password: kid.phone });
          if (authError && authError.message !== "User already registered") throw authError;

          const { error: dbError } = await supabase.from('students').insert([{
            first_name: kid.firstName, last_name: kid.lastName, email: kid.email, phone: kid.phone, parent_email: parentData.email, parent_name: `${parentData.firstName} ${parentData.lastName}`, parent_contact: parentData.phone, language: kid.language, level: kid.level, group_name: selectedClassName, exam_type: kid.exam_type, status: isPlacement ? 'Pending' : 'Active', enrollment_date: new Date().toISOString().split('T')[0]
          }]);

          if (dbError) throw dbError;
        }

        showToast(`🎉 Family registered successfully (${kidsList.length} kids)!`);
        setParentData({ firstName: '', lastName: '', email: '', phone: '' });
        setKidsList([{ firstName: '', lastName: '', language: 'English', level: 'A1', classId: '', phone: '', email: '', exam_type: 'Course' }]);
      }
    } catch (err) { showToast("Error: " + err.message); } finally { setLoading(false); }
  };

  return (
    <div className="w-full flex flex-col h-full p-8 animate-fade-in text-left">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-[#0A1128]">Manual Registration</h2>
        <div className="flex bg-gray-200 p-1 rounded-xl">
          <button onClick={() => setRegMode('Single')} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${regMode === 'Single' ? 'bg-white text-[#2563eb] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Single Student</button>
          <button onClick={() => setRegMode('Family')} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${regMode === 'Family' ? 'bg-white text-[#2563eb] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Family (Parent & Kids)</button>
        </div>
      </div>

      <form onSubmit={handleSave} className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
        {regMode === 'Single' ? (
          <>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
              <h3 className="font-bold text-lg mb-4 border-b border-gray-100 pb-2">Academic Details</h3>
              <div className={`grid gap-4 ${singleData.exam_type === 'Course' ? 'grid-cols-4' : 'grid-cols-2'}`}>
                  <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Registration Type</label><select value={singleData.exam_type} onChange={e=>setSingleData({...singleData, exam_type: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-lg p-3 text-sm cursor-pointer"><option value="Course">Direct Course</option><option value="Placement">Placement Test</option></select></div>
                  <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Language</label><select value={singleData.language} onChange={e=>setSingleData({...singleData, language: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-lg p-3 text-sm cursor-pointer"><option>English</option><option>Français</option><option>Deutsch</option><option>Español</option></select></div>
                  {singleData.exam_type === 'Course' && (
                    <>
                      <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Level</label><select value={singleData.level} onChange={e=>setSingleData({...singleData, level: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-lg p-3 text-sm cursor-pointer"><option>A1</option><option>A2</option><option>B1</option><option>B2</option><option>C1</option><option>C2</option></select></div>
                      <div><label className="block text-xs font-bold text-[#2563eb] uppercase mb-1">Available Groups</label><select value={singleData.classId} onChange={e=>setSingleData({...singleData, classId: e.target.value})} className="w-full bg-white border border-blue-200 rounded-lg p-3 text-sm font-bold cursor-pointer"><option value="">-- Select Group --</option>{classesData.filter(c => c.language === singleData.language && c.level.includes(singleData.level)).map(c => { const isFull = (c.enrolled_count || 0) >= (c.capacity || 20); return <option key={c.id} value={c.id} disabled={isFull}>{c.name} {isFull ? '🔴 FULL' : ''}</option>})}</select></div>
                    </>
                  )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"><h3 className="font-bold text-lg mb-4 border-b border-gray-100 pb-2">Personal Info</h3><div className="space-y-4"><input type="text" value={singleData.firstName} onChange={e=>setSingleData({...singleData, firstName: e.target.value})} placeholder="First Name" className="w-full bg-gray-50 border border-gray-100 p-3 rounded-lg text-sm" required /><input type="text" value={singleData.lastName} onChange={e=>setSingleData({...singleData, lastName: e.target.value})} placeholder="Last Name" className="w-full bg-gray-50 border border-gray-100 p-3 rounded-lg text-sm" required /></div></div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"><h3 className="font-bold text-lg mb-4 border-b border-gray-100 pb-2">Contact & Login</h3><div className="space-y-4"><input type="email" value={singleData.email} onChange={e=>setSingleData({...singleData, email: e.target.value})} placeholder="Student Email" className="w-full bg-gray-50 border border-gray-100 p-3 rounded-lg text-sm" required /><input type="tel" value={singleData.phone} onChange={e=>setSingleData({...singleData, phone: e.target.value})} placeholder="Phone Number (Password)" className="w-full bg-gray-50 border border-gray-100 p-3 rounded-lg text-sm" required /><input type="email" value={singleData.parentEmail} onChange={e=>setSingleData({...singleData, parentEmail: e.target.value})} placeholder="Parent Email (Optional for linking)" className="w-full bg-blue-50 border border-blue-100 p-3 rounded-lg text-sm" /></div></div>
            </div>
          </>
        ) : (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-[#0A1128] p-6 rounded-2xl shadow-md text-white border border-[#111C44]">
              <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-3"><span className="text-2xl">👥</span><h3 className="font-bold text-lg uppercase tracking-widest text-blue-300">Parent / Guardian Details</h3></div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4"><input type="text" value={parentData.firstName} onChange={e=>setParentData({...parentData, firstName: e.target.value})} placeholder="First Name" className="bg-white/10 border border-white/20 p-3 rounded-lg text-sm text-white placeholder-gray-400" required /><input type="text" value={parentData.lastName} onChange={e=>setParentData({...parentData, lastName: e.target.value})} placeholder="Last Name" className="bg-white/10 border border-white/20 p-3 rounded-lg text-sm text-white placeholder-gray-400" required /><input type="email" value={parentData.email} onChange={e=>setParentData({...parentData, email: e.target.value})} placeholder="Parent Email (Login)" className="bg-white/10 border border-white/20 p-3 rounded-lg text-sm text-white placeholder-gray-400" required /><input type="tel" value={parentData.phone} onChange={e=>setParentData({...parentData, phone: e.target.value})} placeholder="Phone (Password)" className="bg-white/10 border border-white/20 p-3 rounded-lg text-sm text-white placeholder-gray-400" required /></div>
            </div>
            <div className="space-y-6">
              {kidsList.map((kid, index) => (
                <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border-2 border-blue-50 relative">
                  <div className="absolute -top-3 -left-3 bg-[#2563eb] text-white w-8 h-8 rounded-full flex items-center justify-center font-black border-4 border-[#F8F9FA]">{index + 1}</div>
                  {kidsList.length > 1 && <button type="button" onClick={() => removeKid(index)} className="absolute top-4 right-4 text-red-400 hover:text-red-600 font-bold text-xs cursor-pointer">✕ Remove</button>}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 mt-2"><input type="text" value={kid.firstName} onChange={e=>handleKidChange(index, 'firstName', e.target.value)} placeholder="Kid First Name" className="bg-gray-50 border border-gray-200 p-3 rounded-lg text-sm font-bold" required /><input type="text" value={kid.lastName} onChange={e=>handleKidChange(index, 'lastName', e.target.value)} placeholder="Kid Last Name" className="bg-gray-50 border border-gray-200 p-3 rounded-lg text-sm font-bold" required /><input type="email" value={kid.email} onChange={e=>handleKidChange(index, 'email', e.target.value)} placeholder="Kid Email" className="bg-gray-50 border border-gray-200 p-3 rounded-lg text-sm" required /><input type="tel" value={kid.phone} onChange={e=>handleKidChange(index, 'phone', e.target.value)} placeholder="Kid Phone" className="bg-gray-50 border border-gray-200 p-3 rounded-lg text-sm" required /></div>
                  <div className="grid grid-cols-4 gap-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100"><select value={kid.exam_type} onChange={e=>handleKidChange(index, 'exam_type', e.target.value)} className="bg-white border border-blue-200 rounded-lg p-2.5 text-xs font-bold text-blue-800 cursor-pointer"><option value="Course">Direct Course</option><option value="Placement">Placement Test</option></select><select value={kid.language} onChange={e=>handleKidChange(index, 'language', e.target.value)} className="bg-white border border-blue-200 rounded-lg p-2.5 text-xs font-bold text-blue-800 cursor-pointer"><option>English</option><option>Français</option><option>Deutsch</option><option>Español</option></select>
                    {kid.exam_type === 'Course' && (
                      <><select value={kid.level} onChange={e=>handleKidChange(index, 'level', e.target.value)} className="bg-white border border-blue-200 rounded-lg p-2.5 text-xs font-bold text-blue-800 cursor-pointer"><option>A1</option><option>A2</option><option>B1</option><option>B2</option><option>C1</option></select><select value={kid.classId} onChange={e=>handleKidChange(index, 'classId', e.target.value)} className="bg-white border border-blue-500 rounded-lg p-2.5 text-xs font-bold text-blue-800 cursor-pointer"><option value="">-- Assign Group --</option>{classesData.filter(c => c.language === kid.language && c.level.includes(kid.level)).map(c => { const isFull = (c.enrolled_count || 0) >= (c.capacity || 20); return <option key={c.id} value={c.id} disabled={isFull}>{c.name} {isFull ? '🔴 FULL' : ''}</option>})}</select></>
                    )}
                  </div>
                </div>
              ))}
              <button type="button" onClick={addKid} className="w-full py-4 border-2 border-dashed border-[#2563eb] text-[#2563eb] font-black rounded-2xl hover:bg-blue-50 transition-colors uppercase tracking-widest text-xs cursor-pointer">+ Add Another Child to this Family</button>
            </div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end space-x-4">
          <button type="submit" disabled={loading} className="px-10 py-4 bg-[#0A1128] hover:bg-blue-900 text-white font-black uppercase tracking-widest rounded-xl shadow-xl transition-all active:scale-95 cursor-pointer">
            {loading ? 'Processing...' : (regMode === 'Single' ? 'Save & Register Student' : `Register Family (${kidsList.length} Kids)`)}
          </button>
        </div>
      </form>
    </div>
  );
};

// ==========================================
// 4. الرواق الرابع: إضافة موظف جديد (Add Staff)
// ==========================================
const StaffRegistrationTab = ({ showToast }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '', department: 'English', role: 'Teacher' });

  const handleInputChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        const { data: authData, error: authError } = await supabase.auth.signUp({ email: formData.email, password: formData.phone });
        if (authError && authError.message !== "User already registered") throw authError; 
        const uid = authData.user?.id; 

        const { error: dbError } = await supabase.from('staff').insert([{
            auth_id: uid, first_name: formData.firstName, last_name: formData.lastName, email: formData.email, phone: formData.phone, department: formData.department, role: formData.role
        }]);

        if (dbError) throw dbError;
        showToast(`🎉 Staff member ${formData.firstName} added successfully!`);
        setFormData({ firstName: '', lastName: '', email: '', phone: '', department: 'English', role: 'Teacher' });
    } catch (err) { showToast("Error: " + err.message); } finally { setLoading(false); }
  };

  return (
    <div className="w-full flex flex-col h-full p-8 animate-fade-in text-left">
      <h2 className="text-3xl font-bold text-[#0A1128] mb-8">Add New Staff</h2>
      <form onSubmit={handleSave} className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
           <h3 className="font-bold text-lg mb-4 border-b border-gray-100 pb-2">Professional Details</h3>
           <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Department</label><select name="department" value={formData.department} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-100 rounded-lg p-3 text-sm outline-none focus:border-blue-500 cursor-pointer"><option>English</option><option>Français</option><option>Deutsch</option><option>Español</option><option>Administration</option><option>Maintenance</option></select></div>
              <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">System Role</label><select name="role" value={formData.role} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-100 rounded-lg p-3 text-sm outline-none focus:border-blue-500 cursor-pointer"><option value="Teacher">Teacher</option><option value="Secretary">Secretary</option><option value="Clean Lady">Clean Lady</option></select></div>
           </div>
        </div>
        <div className="grid grid-cols-2 gap-8">
           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"><h3 className="font-bold text-lg mb-4 border-b border-gray-100 pb-2">Personal Info</h3><div className="space-y-4"><input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="First Name" className="w-full bg-gray-50 border border-gray-100 p-3 rounded-lg text-sm" required /><input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Last Name" className="w-full bg-gray-50 border border-gray-100 p-3 rounded-lg text-sm" required /></div></div>
           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"><h3 className="font-bold text-lg mb-4 border-b border-gray-100 pb-2">Login Info</h3><div className="space-y-4"><input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Work Email" className="w-full bg-gray-50 border border-gray-100 p-3 rounded-lg text-sm" required /><input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone Number (Becomes Password)" className="w-full bg-gray-50 border border-gray-100 p-3 rounded-lg text-sm" required /></div></div>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end space-x-4">
          <button type="submit" disabled={loading} className="px-8 py-3 bg-[#2563eb] hover:bg-blue-800 text-white font-bold rounded-lg shadow-md transition-colors cursor-pointer">{loading ? 'Processing...' : 'Create Staff Account'}</button>
        </div>
      </form>
    </div>
  );
};

// ==========================================
// 🌟 الكومبوننت الأم (The Master Hub) 🌟
// ==========================================
const StudentsManagement = ({ initialAction }) => {
  const [activeTab, setActiveTab] = useState('requests');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (initialAction === 'add') {
      setActiveTab('add');
    }
  }, [initialAction]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4500);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans">
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      <div className="pt-8 px-8 pb-2">
        <div className="flex space-x-2 bg-white p-2 rounded-2xl shadow-sm border border-gray-200 w-max overflow-x-auto custom-scrollbar">
          <button onClick={() => setActiveTab('requests')} className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${activeTab === 'requests' ? 'bg-[#0A1128] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>📥 Requests Pipeline</button>
          <button onClick={() => setActiveTab('records')} className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${activeTab === 'records' ? 'bg-[#0A1128] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>🎓 Active Records</button>
          <button onClick={() => setActiveTab('add')} className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${activeTab === 'add' ? 'bg-[#0A1128] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>➕ Manual Registration</button>
          <button onClick={() => setActiveTab('addStaff')} className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ml-4 cursor-pointer ${activeTab === 'addStaff' ? 'bg-[#2563eb] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 border border-gray-100'}`}>👥 Add Staff</button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        {activeTab === 'requests' && <RegistrationRequestsTab showToast={showToast} />}
        {activeTab === 'records' && <StudentRecordsTab showToast={showToast} />}
        {activeTab === 'add' && <StudentRegistrationTab showToast={showToast} />}
        {activeTab === 'addStaff' && <StaffRegistrationTab showToast={showToast} />}
      </div>
    </div>
  );
};

export default StudentsManagement;
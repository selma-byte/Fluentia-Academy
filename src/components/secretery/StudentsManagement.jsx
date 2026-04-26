import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

const Icons = {
  Search: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
  Book: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>,
  Video: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line></svg>,
  Notes: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>,
  Pdf: () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><text x="9" y="18" fontSize="6" fontWeight="bold">PDF</text></svg>,
  Back: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 8 8 12 12 16"></polyline><line x1="16" y1="12" x2="8" y2="12"></line></svg>,
  Homework: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline><circle cx="10" cy="13" r="1"></circle><circle cx="10" cy="17" r="1"></circle></svg>,
  Edit: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>,
  Trash: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path><path d="M10 11v6M14 11v6"></path><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path></svg>
};

// ==========================================
// 1. الرواق الأول: طلبات التسجيل (Registration Requests)
// ==========================================
const RegistrationRequestsTab = () => {
  const [activeFilter, setActiveFilter] = useState('All'); 
  const [requests, setRequests] = useState([]);
  const [classesData, setClassesData] = useState([]);
  const [staffData, setStaffData] = useState([]); 
  const [roomsData, setRoomsData] = useState([]); 
  const [schedTeacher, setSchedTeacher] = useState(''); 

  const fetchRequests = async () => {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('exam_type', 'Placement')
      .order('enrollment_date', { ascending: false });

    if (data) {
      const formattedData = data.map(req => ({
        ...req,
        id: req.id,
        name: `${req.first_name} ${req.last_name}`,
        type: req.child_name ? 'Parent' : 'Student',
        parent: req.child_name ? 'Parent / Guardian' : null,
        language: req.language,
        level: req.level || "Placement Test", 
        status: req.status === 'Tested' ? 'Passed' : req.status === 'pending' ? 'Pending' : req.status
      }));
      setRequests(formattedData);
    }
  };

  const fetchClasses = async () => {
    const { data } = await supabase.from('classes').select('*');
    if (data) setClassesData(data);
  };
  const fetchStaffAndRooms = async () => {
    const { data: staff } = await supabase.from('staff').select('*');
    if (staff) setStaffData(staff);
    
    const { data: rooms } = await supabase.from('rooms').select('*');
    if (rooms) setRoomsData(rooms);
  };

  useEffect(() => { fetchRequests(); fetchClasses();fetchStaffAndRooms(); }, []);

  const [isEnrollMode, setIsEnrollMode] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isViewInfoModalOpen, setIsViewInfoModalOpen] = useState(false); 
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(false); 
  
  const getTodayString = () => {
    const today = new Date();
    return new Date(today.getTime() - (today.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
  };

  const [schedDate, setSchedDate] = useState(getTodayString());
  const [schedTime, setSchedTime] = useState('10:00');
  const [schedRoom, setSchedRoom] = useState('');

  const [enrollClassId, setEnrollClassId] = useState('');
  const [enrollGrade, setEnrollGrade] = useState('');
  const [enrollLevel, setEnrollLevel] = useState('A1'); 
  
  const filteredRequests = requests.filter(req => {
    if (activeFilter === 'All') return true;
    return req.type === activeFilter;
  });

  const detectLevelFromScore = (scoreStr) => {
    if (!scoreStr) return 'A1';
    const upper = String(scoreStr).toUpperCase();
    const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    for (let l of levels) {
      if (upper.includes(l)) return l;
    }
    const numMatch = upper.match(/(\d+)/);
    if (numMatch) {
       const score = parseFloat(numMatch[1]);
       if (score < 10) return 'A1';
       if (score < 13) return 'A2';
       if (score < 16) return 'B1';
       if (score < 18) return 'B2';
       return 'C1';
    }
    return 'A1';
  };

  const handleEnrollNow = (req) => { 
    setSelectedStudent(req); 
    const score = req.test_score || '';
    setEnrollGrade(score); 
    
    const detectedLevel = detectLevelFromScore(score);
    setEnrollLevel(detectedLevel);
    setEnrollClassId(''); 

    setIsEnrollMode(true); 
  };
  
  const handleOpenScheduleModal = (req) => { setSelectedStudent(req); setIsScheduleModalOpen(true); };
  const handleOpenInfoModal = (req) => { setSelectedStudent(req); setIsViewInfoModalOpen(true); };

  const handleSaveSchedule = async () => {
    setLoading(true);
    try {
      if (!schedRoom || !schedTeacher || !schedDate || !schedTime) {
        alert("⚠️ من فضلك خيري التاريخ، الوقت، الأستاذ والقاعة!");
        setLoading(false);
        return;
      }

      const { data: existingTests } = await supabase
        .from('appointments')
        .select('*')
        .eq('appointment_date', schedDate)
        .eq('start_time', schedTime)
        .ilike('sub_title', '%Placement Test%');

      if (existingTests && existingTests.length > 0) {
        const confirmJoin = window.confirm(`⚠️ كاين ديجا ${existingTests.length} تلاميذ راهم مبرمجين لـ Placement Test في هاد الوقت! \n\nتحبي تزيدي هاد التلميذ معاهم في نفس الفوج؟`);
        if (!confirmJoin) {
          setLoading(false); return; 
        }
      }

      const dateObj = new Date(schedDate);
      const daysMap = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const dayName = daysMap[dateObj.getDay()];
      const hourOnly = schedTime.substring(0, 2);

      const { data: conflicts } = await supabase
        .from('classes')
        .select('*')
        .ilike('schedule', `%${dayName}%`)
        .ilike('schedule', `%${hourOnly}%`)
        .ilike('schedule', `%${schedRoom}%`)
        .limit(1);

      if (conflicts && conflicts.length > 0) {
        alert(`⚠️ القاعة [${schedRoom}] محجوزة! راهم يقراو فيها فوج: ${conflicts[0].name} في هاد الوقت.`);
        setLoading(false); return; 
      }

      const fullAppointmentDate = `${schedDate} at ${schedTime}`;
      
      await supabase.from('students').update({ status: 'Scheduled', appointment_date: fullAppointmentDate }).eq('id', selectedStudent.id);

      await supabase.from('appointments').insert([{
          title: selectedStudent.name,
          sub_title: `Placement Test: ${selectedStudent.language} (Prof: ${schedTeacher}, Room: ${schedRoom})`, 
          appointment_date: schedDate, 
          start_time: schedTime,
          status: 'Upcoming',
          phone: selectedStudent.phone
        }]);

      alert("✅ تم برمجة التاست بنجاح!");
      setIsScheduleModalOpen(false);
      fetchRequests(); 
    } catch (err) { alert("إيرور: " + err.message); } finally { setLoading(false); }
  };

  const handleFinalEnrollment = async () => {
    if (!enrollClassId) return alert("⚠️ من فضلك خيري الفوج!");
    if (!enrollGrade) return alert("⚠️ من فضلك أدخلي علامة التاست!");

    try {
      const selectedClass = classesData.find(c => c.id === enrollClassId);
      const currentCount = selectedClass.enrolled_count || 0;
      if (currentCount >= selectedClass.capacity) return alert("❌ هاد الفوج معمر!");

      const { error: authError } = await supabase.auth.signUp({ email: selectedStudent.email, password: selectedStudent.phone });
      if (authError && authError.message !== "User already registered") throw authError;

      await supabase.from('classes').update({ enrolled_count: currentCount + 1 }).eq('id', enrollClassId);
      
      await supabase.from('students').update({ 
        status: 'Active', 
        exam_type: 'Course',
        group_name: selectedClass.name,
        level: enrollLevel, 
        test_score: enrollGrade
      }).eq('id', selectedStudent.id);
      
      alert(`🎉 تم ترسيم ${selectedStudent.name} بنجاح في فوج ${selectedClass.name}! يقدر يدخل للسيت دركا.`);
      setIsEnrollMode(false);
      fetchRequests();
    } catch (err) { alert("إيرور في الترسيم: " + err.message); }
  };

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
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Test Score (By Teacher)</label>
                  <input 
                    type="text" 
                    value={enrollGrade} 
                    onChange={(e) => {
                      setEnrollGrade(e.target.value);
                      setEnrollLevel(detectLevelFromScore(e.target.value));
                      setEnrollClassId('');
                    }} 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-black text-blue-600 outline-none focus:border-[#0A1128] shadow-sm" 
                  />
               </div>
               <div>
                  <label className="block text-[10px] font-bold text-[#2563eb] uppercase tracking-widest mb-2">Assign Level</label>
                  <select 
                    value={enrollLevel} 
                    onChange={(e) => {
                      setEnrollLevel(e.target.value); 
                      setEnrollClassId('');
                    }} 
                    className="w-full bg-blue-50 border border-blue-200 text-blue-700 rounded-xl p-3 text-sm font-bold outline-none focus:border-[#2563eb] shadow-sm cursor-pointer"
                  >
                     <option value="A1">A1</option><option value="A2">A2</option><option value="B1">B1</option>
                     <option value="B2">B2</option><option value="C1">C1</option><option value="C2">C2</option>
                  </select>
               </div>
               <div>
                  <label className="block text-[10px] font-bold text-[#00a65e] uppercase tracking-widest mb-2">Available Groups</label>
                  <select 
                    value={enrollClassId} 
                    onChange={(e) => setEnrollClassId(e.target.value)} 
                    className="w-full bg-green-50 border border-green-200 text-green-700 rounded-xl p-3 text-sm font-bold outline-none focus:border-[#00a65e] shadow-sm cursor-pointer"
                  >
                     <option value="">-- Select Group --</option>
                     {matchingClasses.length === 0 && <option disabled>❌ No classes found for {enrollLevel}</option>}
                     {matchingClasses.map(c => {
                         const isFull = (c.enrolled_count || 0) >= (c.capacity || 20);
                         return (
                           <option key={c.id} value={c.id} disabled={isFull}>
                             {c.name} ({(c.enrolled_count || 0)}/{c.capacity || 20}) {isFull ? '🔴 FULL' : ''}
                           </option>
                         );
                     })}
                  </select>
               </div>
            </div>
          </section>

          <section>
            <h2 className="text-sm font-bold text-gray-800 mb-8 uppercase tracking-wide border-b border-gray-100 pb-2 w-max">Academic Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[{ label: "Language", v: selectedStudent?.language }, { label: "Level", v: enrollLevel }, { label: "Group", v: enrollClassId ? classesData.find(c=>c.id===enrollClassId)?.name : "Pending..." }].map((item) => (
                <div key={item.label} className="space-y-2 border-b border-gray-200 pb-2 relative">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.label}</label>
                  <div className="text-sm font-bold text-[#0A1128]">{item.v}</div>
                </div>
              ))}
            </div>
          </section>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
            <section className="space-y-10">
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Personal Info</h2>
              <div className="space-y-8">
                <input type="text" defaultValue={selectedStudent?.first_name} placeholder="First Name" className="w-full bg-transparent border-b border-gray-200 py-3 text-sm font-bold outline-none" />
                <input type="text" defaultValue={selectedStudent?.last_name} placeholder="Last Name" className="w-full bg-transparent border-b border-gray-200 py-3 text-sm font-bold outline-none" />
              </div>
            </section>
            <section className="space-y-10">
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Contact Info</h2>
              <div className="space-y-8">
                <input type="email" defaultValue={selectedStudent?.email} placeholder="Email Address" className="w-full bg-transparent border-b border-gray-200 py-3 text-sm font-bold outline-none" />
                <input type="text" defaultValue={selectedStudent?.phone} placeholder="Phone Number" className="w-full bg-transparent border-b border-gray-200 py-3 text-sm font-bold outline-none" />
              </div>
            </section>
          </div>

          <div className="flex justify-end space-x-4 pt-12">
            <button onClick={() => setIsEnrollMode(false)} className="px-10 py-3 bg-gray-100 text-gray-500 rounded-xl text-sm font-bold hover:bg-gray-200 transition-all cursor-pointer">Cancel</button>
            <button onClick={handleFinalEnrollment} className="px-10 py-3 bg-[#0A1128] text-white rounded-xl text-sm font-bold hover:bg-blue-900 shadow-lg cursor-pointer">Approve & Save Student</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-[#F8F9FA] h-full font-sans text-left text-[#0A1128] overflow-y-auto custom-scrollbar">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold uppercase tracking-tight text-[#0A1128]">Registration Requests</h1>
        <div className="flex bg-[#0A1128] text-white rounded-2xl p-1 text-[11px] font-bold">
          <span onClick={() => setActiveFilter('All')} className={`px-6 py-2 rounded-xl cursor-pointer transition-all ${activeFilter === 'All' ? 'bg-white/20' : 'opacity-40 hover:opacity-80'}`}>All</span>
          <span onClick={() => setActiveFilter('Student')} className={`px-6 py-2 rounded-xl cursor-pointer transition-all ${activeFilter === 'Student' ? 'bg-white/20' : 'opacity-40 hover:opacity-80'}`}>Students</span>
          <span onClick={() => setActiveFilter('Parent')} className={`px-6 py-2 rounded-xl cursor-pointer transition-all ${activeFilter === 'Parent' ? 'bg-white/20' : 'opacity-40 hover:opacity-80'}`}>Parents</span>
        </div>
        </div>

      <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#0A1128] text-white text-[10px] font-bold uppercase tracking-[0.2em]">
              <th className="p-6">Applicant Details</th>
              <th className="p-6 text-center">Type</th>
              <th className="p-6">Course Info</th>
              <th className="p-6 text-center">Status</th>
              <th className="p-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
          {filteredRequests.map((req) => (
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
                <td className="p-6 text-gray-700">
                  <div className="text-sm font-bold">{req.language}</div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase">Level: {req.level}</div>
                </td>
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
      </div>

      {isViewInfoModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 font-sans border border-gray-100">
            <div className="flex justify-between items-center mb-6">
               <h2 className="text-xl font-bold text-[#0A1128]">Applicant Details</h2>
               <button onClick={() => setIsViewInfoModalOpen(false)} className="text-gray-400 hover:text-red-500 font-bold text-xl">×</button>
            </div>
            <div className="space-y-4">
               <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Full Name</p>
                  <p className="text-sm font-bold text-[#0A1128]">{selectedStudent?.name}</p>
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Phone</p>
                    <p className="text-sm font-bold text-[#0A1128]">{selectedStudent?.phone || 'N/A'}</p>
                 </div>
                 <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 overflow-hidden">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Email</p>
                    <p className="text-sm font-bold text-[#0A1128] truncate">{selectedStudent?.email || 'N/A'}</p>
                 </div>
               </div>
               {selectedStudent?.test_score && (
                 <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                    <p className="text-[10px] text-green-600 font-bold uppercase tracking-widest mb-1">Test Score / Note</p>
                    <p className="text-lg font-black text-green-700">{selectedStudent?.test_score}</p>
                 </div>
               )}
            </div>
            <button onClick={() => setIsViewInfoModalOpen(false)} className="w-full mt-6 bg-[#0A1128] text-white py-3 rounded-xl font-bold text-sm hover:bg-black transition-colors">Close</button>
          </div>
        </div>
      )}

      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#F8F9FA] w-full max-w-lg rounded-3xl shadow-2xl p-8 font-sans">
            <h2 className="text-xl font-bold text-[#0A1128] mb-8">Schedule Placement Test</h2>
            <div className="grid grid-cols-2 gap-x-6 gap-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Language</label>
                <div className="relative">
                  <select className="w-full bg-transparent border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 outline-none appearance-none cursor-pointer"><option>{selectedStudent?.language}</option></select>
                  <span className="absolute right-4 top-3 text-gray-500 text-[10px]">▼</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Level</label>
                <input type="text" defaultValue={selectedStudent?.level} className="w-full bg-transparent border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 outline-none" readOnly/>
              </div>
              <div className="space-y-1.5 col-span-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Applicant</label>
                <input type="text" defaultValue={selectedStudent?.name} className="w-full bg-transparent border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 outline-none" readOnly />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Date</label>
                <input 
                  type="date" 
                  value={schedDate} 
                  onChange={(e) => setSchedDate(e.target.value)} 
                  className="w-full bg-transparent border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 outline-none cursor-pointer"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Time Block</label>
                <input 
                  type="time" 
                  value={schedTime} 
                  onChange={(e) => setSchedTime(e.target.value)} 
                  className="w-full bg-transparent border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 outline-none cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Teacher</label>
                <div className="relative">
                  <select value={schedTeacher} onChange={(e) => setSchedTeacher(e.target.value)} className="w-full bg-transparent border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 outline-none appearance-none cursor-pointer">
                    <option value="">-- Select Teacher --</option>
                    {staffData.map(staff => <option key={staff.id} value={`${staff.first_name} ${staff.last_name}`}>{staff.first_name} {staff.last_name}</option>)}
                  </select>
                  <span className="absolute right-4 top-3 text-gray-500 text-[10px]">▼</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Room</label>
                <div className="relative">
                  <select value={schedRoom} onChange={(e) => setSchedRoom(e.target.value)} className="w-full bg-transparent border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 outline-none appearance-none cursor-pointer">
                    <option value="">-- Select Room --</option>
                    {roomsData.map(room => <option key={room.id} value={room.name || room.room_name || room.id}>{room.name || room.room_name || `Room ${room.id}`}</option>)}
                  </select>
                  <span className="absolute right-4 top-3 text-gray-500 text-[10px]">▼</span>
                </div>
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
const StudentRecordsTab = () => {
  const [currentView, setCurrentView] = useState('list');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLang, setFilterLang] = useState('All');
  const [filterLevel, setFilterLevel] = useState('All');
  const [filterGroup, setFilterGroup] = useState('All');

  const [studentsData, setStudentsData] = useState([]);
  const [classesData, setClassesData] = useState([]); 
  const [loading, setLoading] = useState(false);
  
  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false);
  const [processData, setProcessData] = useState({ newLevel: 'A1' }); 

  const [isAssignGroupModalOpen, setIsAssignGroupModalOpen] = useState(false);
  const [assignGroupData, setAssignGroupData] = useState({ classId: '' });

  // 💡 Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({ id: null, firstName: '', lastName: '', email: '', phone: '', level: '' });

  const fetchActiveStudents = async () => {
    const { data } = await supabase.from('students')
      .select('*')
      .or('status.eq.Active,status.eq.Pending Group'); 
      
    if (data) {
      const formatted = data.map(s => ({
        ...s, id: s.id, firstName: s.first_name || '', lastName: s.last_name || '', language: s.language || '', level: s.level || '', group: s.group_name || '', status: s.status || '', phone: s.phone || '', email: s.email || '', address: s.address || '', parentName: s.parent_name || '', parentContact: s.parent_contact || '', enrollmentDate: s.enrollment_date || '',
        test_score: s.test_score || '' 
      }));
      setStudentsData(formatted);
    }
  };

  const fetchClasses = async () => {
    const { data } = await supabase.from('classes').select('*');
    if (data) setClassesData(data);
  };

  useEffect(() => { 
    fetchActiveStudents(); 
    fetchClasses();
  }, []);

  const filteredStudents = studentsData.filter(student => {
    const matchLang = filterLang === 'All' || student.language === filterLang;
    const matchLevel = filterLevel === 'All' || student.level === filterLevel;
    const matchGroup = filterGroup === 'All' || student.group === filterGroup;
    const matchSearch = student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) || student.lastName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchLang && matchLevel && matchGroup && matchSearch;
  });

  const handleViewProfile = (student) => {
    setSelectedStudent(student);
    setCurrentView('profile');
  };

  const handleProcessResult = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const score = parseFloat(selectedStudent.test_score);
      await supabase.from('enrollment_history').insert([{
        student_id: selectedStudent.id,
        student_name: `${selectedStudent.firstName} ${selectedStudent.lastName}`,
        level_completed: selectedStudent.level,
        group_name: selectedStudent.group,
        grade: isNaN(score) ? null : score
      }]);

      const isArchiving = processData.newLevel === 'Archived';

      const { error: updateError } = await supabase.from('students').update({
        level: isArchiving ? selectedStudent.level : processData.newLevel, 
        group_name: null, 
        status: isArchiving ? 'Archived' : 'Pending Group',  
        test_score: selectedStudent.test_score
      }).eq('id', selectedStudent.id);

      if (updateError) throw updateError;

      if (isArchiving) {
        alert(`✅ تم أرشفة ${selectedStudent.firstName} بنجاح. ما بقاش يقرا معانا.`);
      } else {
        alert(`✅ تم معالجة نتيجة ${selectedStudent.firstName} بنجاح! راهو دركا "يستنى فوج" في المستوى ${processData.newLevel}.`);
      }
      
      setIsProcessModalOpen(false);
      fetchActiveStudents();
    } catch (err) {
      alert("إيرور: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignGroup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!assignGroupData.classId) throw new Error("⚠️ من فضلك خيري فوج باش تحطيه فيه!");
      
      const selectedClass = classesData.find(c => c.id === assignGroupData.classId);
      const currentCount = selectedClass.enrolled_count || 0;
      if (currentCount >= selectedClass.capacity) throw new Error("❌ هاد الفوج معمر، شوفي فوج واحد أخر!");

      await supabase.from('classes').update({ enrolled_count: currentCount + 1 }).eq('id', assignGroupData.classId);
      
      await supabase.from('students').update({
        group_name: selectedClass.name,
        status: 'Active'
      }).eq('id', selectedStudent.id);

      alert(`✅ تم إدخال ${selectedStudent.firstName} بنجاح في فوج ${selectedClass.name}!`);
      setIsAssignGroupModalOpen(false);
      fetchActiveStudents();
    } catch(err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 💡 وظيفة الحذف (Delete)
  const handleDeleteStudent = async (id, name) => {
    if (window.confirm(`⚠️ Are you absolutely sure you want to PERMANENTLY DELETE ${name}? This action cannot be undone.`)) {
      try {
        const { error } = await supabase.from('students').delete().eq('id', id);
        if (error) throw error;
        alert(`✅ ${name} has been successfully deleted.`);
        fetchActiveStudents();
      } catch (err) {
        alert("Error deleting student: " + err.message);
      }
    }
  };

  // 💡 وظيفة فتح نافذة التعديل (Edit)
  const openEditModal = (student) => {
    setEditFormData({
      id: student.id,
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      phone: student.phone,
      level: student.level
    });
    setIsEditModalOpen(true);
  };

  // 💡 وظيفة حفظ التعديلات (Update)
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from('students').update({
        first_name: editFormData.firstName,
        last_name: editFormData.lastName,
        email: editFormData.email,
        phone: editFormData.phone,
        level: editFormData.level
      }).eq('id', editFormData.id);

      if (error) throw error;
      
      alert('✅ Student details updated successfully!');
      setIsEditModalOpen(false);
      fetchActiveStudents();
    } catch (err) {
      alert("Error updating student: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderList = () => (
    <div className="w-full flex flex-col min-h-full animate-fade-in p-8">
      <div className="flex justify-between items-center mb-8 shrink-0">
        <div>
          <h2 className="text-3xl font-bold text-[#0A1128] mb-1">Student Records</h2>
          <p className="text-sm font-bold text-gray-500">Manage academic performance and tracking for {filteredStudents.length} students</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-4 mb-6 shrink-0 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="relative flex-1 min-w-[250px]">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">🔍</span>
          <input type="text" placeholder="Search by name or ID..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 transition-all" />
        </div>
        <select value={filterLang} onChange={(e) => setFilterLang(e.target.value)} className="bg-gray-50 border border-gray-200 text-sm rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 font-bold text-gray-600 cursor-pointer">
          <option value="All">🌐 All Languages</option><option value="English">English</option><option value="Français">Français</option><option value="Deutsch">Deutsch</option><option value="Español">Español</option>
        </select>
        <select value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)} className="bg-gray-50 border border-gray-200 text-sm rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 font-bold text-gray-600 cursor-pointer">
          <option value="All">📊 All Levels</option><option value="A1">A1</option><option value="A2">A2</option><option value="B1">B1</option><option value="B2">B2</option><option value="C1">C1</option><option value="C2">C2</option>
        </select>
        {(filterLang !== 'All' || filterLevel !== 'All' || filterGroup !== 'All' || searchQuery !== '') && (
          <button onClick={() => { setFilterLang('All'); setFilterLevel('All'); setFilterGroup('All'); setSearchQuery(''); }} className="text-xs font-bold text-red-500 hover:text-red-700 underline cursor-pointer px-2">Clear Filters</button>
        )}
      </div>
      <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="py-4 px-6 font-bold text-gray-600 uppercase text-xs">Student ID</th>
              <th className="py-4 px-6 font-bold text-gray-600 uppercase text-xs">Name</th>
              <th className="py-4 px-6 font-bold text-gray-600 uppercase text-xs">Language</th>
              <th className="py-4 px-6 font-bold text-gray-600 uppercase text-xs">Level / Grp</th>
              <th className="py-4 px-6 font-bold text-gray-600 uppercase text-xs text-center">Manage Record</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredStudents.length > 0 ? filteredStudents.map((student) => (
              <tr key={student.id} className="hover:bg-blue-50/50 transition-colors group">
                <td className="py-4 px-6 font-bold text-gray-500">{student.id}</td>
                <td className="py-4 px-6">
                  <p className="font-bold text-[#0A1128]">{student.firstName} {student.lastName}</p>
                  {student.status === 'Pending Group' && <span className="text-[10px] text-orange-500 font-bold">Needs Group</span>}
                </td>
                <td className="py-4 px-6 font-medium text-gray-700">{student.language}</td>
                <td className="py-4 px-6 font-medium text-gray-700">{student.level} • {student.group || '---'}</td>
                <td className="py-4 px-6 flex justify-center gap-2 items-center">
                  <button onClick={() => handleViewProfile(student)} className="bg-white border border-gray-200 hover:bg-[#2563eb] hover:text-white hover:border-[#2563eb] text-gray-700 font-bold py-1.5 px-4 rounded-lg transition-all cursor-pointer text-xs shadow-sm">Open Record</button>
                  
                  {student.status === 'Pending Group' ? (
                     <button onClick={() => { setSelectedStudent(student); setAssignGroupData({classId: ''}); setIsAssignGroupModalOpen(true); }} className="bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-600 hover:text-white font-bold py-1.5 px-3 rounded-lg transition-all cursor-pointer text-xs shadow-sm">🏫 Assign Group</button>
                  ) : (
                     <button onClick={() => { setSelectedStudent(student); setProcessData({ newLevel: student.level }); setIsProcessModalOpen(true); }} className="bg-orange-50 border border-orange-200 text-orange-700 hover:bg-orange-600 hover:text-white font-bold py-1.5 px-3 rounded-lg transition-all cursor-pointer text-xs shadow-sm">📝 Process Result</button>
                  )}

                  {/* 💡 أزرار التعديل والحذف */}
                  <button onClick={() => openEditModal(student)} className="p-2 text-blue-500 hover:bg-blue-100 rounded-lg cursor-pointer transition-colors" title="Edit Student">
                    <Icons.Edit />
                  </button>
                  <button onClick={() => handleDeleteStudent(student.id, student.firstName)} className="p-2 text-red-500 hover:bg-red-100 rounded-lg cursor-pointer transition-colors" title="Delete Student">
                    <Icons.Trash />
                  </button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="5" className="py-12 text-center text-gray-400"><p className="text-4xl mb-2">🔍</p><p className="font-bold">No students found matching your criteria.</p></td></tr>
            )}
          </tbody>
        </table>
      </div>

      {isProcessModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-8 font-sans border border-gray-100">
            <div className="flex justify-between items-center mb-6">
               <h2 className="text-xl font-bold text-[#0A1128]">Process Result</h2>
               <button onClick={() => setIsProcessModalOpen(false)} className="text-gray-400 hover:text-red-500 font-bold text-xl">×</button>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6 text-center">
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Teacher's Final Grade</p>
               <p className={`text-2xl font-black ${parseFloat(selectedStudent?.test_score) >= 10 ? 'text-green-600' : selectedStudent?.test_score ? 'text-red-600' : 'text-orange-500'}`}>
                 {selectedStudent?.test_score ? `${selectedStudent?.test_score} / 20` : '⏳ Waiting for Teacher...'}
               </p>
            </div>

            <form onSubmit={handleProcessResult} className="space-y-4">
               <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Decision / Set Next Level</label>
                  <select value={processData.newLevel} onChange={(e) => setProcessData({...processData, newLevel: e.target.value})} className="w-full bg-blue-50 border border-blue-200 text-blue-700 rounded-xl p-3 text-sm font-bold outline-none focus:border-[#2563eb] cursor-pointer">
                     <option value="A1">Keep in A1 (Retake)</option>
                     <option value="A2">Promote to A2</option>
                     <option value="B1">Promote to B1</option>
                     <option value="B2">Promote to B2</option>
                     <option value="C1">Promote to C1</option>
                     <option value="C2">Promote to C2</option>
                     <option value="Archived" className="text-red-600 font-bold">🛑 Leave School (Archive)</option>
                  </select>
               </div>
               <button type="submit" disabled={loading} className="w-full mt-4 bg-[#10b981] hover:bg-green-700 text-white font-bold py-3 rounded-xl shadow-md transition-colors text-sm">
                 {loading ? 'Processing...' : 'Confirm Decision'}
               </button>
            </form>
          </div>
        </div>
      )}

      {isAssignGroupModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-8 font-sans border border-gray-100">
            <div className="flex justify-between items-center mb-6">
               <h2 className="text-xl font-bold text-[#0A1128]">Assign to Class</h2>
               <button onClick={() => setIsAssignGroupModalOpen(false)} className="text-gray-400 hover:text-red-500 font-bold text-xl">×</button>
            </div>
            <p className="text-sm text-gray-600 mb-6">Select a new <b>{selectedStudent?.level}</b> group for <b>{selectedStudent?.firstName}</b>.</p>
            <form onSubmit={handleAssignGroup} className="space-y-4">
               <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Available Groups ({selectedStudent?.level})</label>
                  <select value={assignGroupData.classId} onChange={(e) => setAssignGroupData({classId: e.target.value})} className="w-full bg-blue-50 border border-blue-200 text-blue-700 rounded-xl p-3 text-sm font-bold outline-none focus:border-[#2563eb] cursor-pointer">
                     <option value="">-- Choose Group --</option>
                     {classesData.filter(c => c.language === selectedStudent?.language && c.level === selectedStudent?.level).map(c => {
                       const isFull = (c.enrolled_count || 0) >= (c.capacity || 20);
                       return <option key={c.id} value={c.id} disabled={isFull}>{c.name} {isFull ? '(FULL)' : ''}</option>
                     })}
                  </select>
               </div>
               <button type="submit" disabled={loading} className="w-full mt-4 bg-[#2563eb] hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-md transition-colors text-sm">
                 {loading ? 'Saving...' : 'Assign Group'}
               </button>
            </form>
          </div>
        </div>
      )}

      {/* 💡 نافذة التعديل (Edit Modal) */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 font-sans border border-gray-100">
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
               <h2 className="text-xl font-bold text-[#0A1128]">Edit Student Details</h2>
               <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-red-500 font-bold text-xl">×</button>
            </div>
            <form onSubmit={handleSaveEdit} className="space-y-4">
               <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">First Name</label>
                    <input type="text" value={editFormData.firstName} onChange={(e) => setEditFormData({...editFormData, firstName: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500" required />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Last Name</label>
                    <input type="text" value={editFormData.lastName} onChange={(e) => setEditFormData({...editFormData, lastName: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500" required />
                 </div>
               </div>
               <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
                  <input type="email" value={editFormData.email} onChange={(e) => setEditFormData({...editFormData, email: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500" required />
               </div>
               <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone</label>
                  <input type="tel" value={editFormData.phone} onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500" required />
               </div>
               <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Level</label>
                  <select value={editFormData.level} onChange={(e) => setEditFormData({...editFormData, level: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500 cursor-pointer">
                    <option value="A1">A1</option><option value="A2">A2</option><option value="B1">B1</option>
                    <option value="B2">B2</option><option value="C1">C1</option><option value="C2">C2</option>
                  </select>
               </div>
               <button type="submit" disabled={loading} className="w-full mt-4 bg-[#0A1128] hover:bg-blue-900 text-white font-bold py-3 rounded-xl shadow-md transition-colors text-sm">
                 {loading ? 'Saving...' : 'Save Changes'}
               </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );

  const renderProfile = () => {
    if (!selectedStudent) return null;
    return (
      <div className="w-full flex flex-col min-h-full animate-fade-in pb-12 p-8">
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
                        <span className="text-xs font-bold text-blue-600">{selectedStudent.language}</span>
                        <span className="text-xs font-bold text-purple-600">Level {selectedStudent.level}</span>
                        <span className="text-xs font-bold text-green-600">{selectedStudent.status}</span>
                     </div>
                  </div>
               </div>
               <button onClick={() => window.print()} className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors cursor-pointer flex items-center">
                  <span className="mr-2">🖨️</span> Print Record
               </button>
            </div>
        </div>
      </div>
    );
  };

  return <div className="h-full w-full">{currentView === 'list' ? renderList() : renderProfile()}</div>;
};

// ==========================================
// 🌟 الرواق الجديد 🗄️: أرشيف الطلاب (Archived Students) 🌟
// ==========================================
const StudentArchiveTab = () => {
  const [archivedStudents, setArchivedStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentHistory, setStudentHistory] = useState([]);
  const [currentView, setCurrentView] = useState('list');
  const [loading, setLoading] = useState(false);

  const fetchArchived = async () => {
    const { data } = await supabase.from('students').select('*').eq('status', 'Archived');
    if (data) {
      setArchivedStudents(data.map(s => ({
        ...s, 
        name: `${s.first_name || ''} ${s.last_name || ''}`.trim()
      })));
    }
  };

  useEffect(() => { fetchArchived(); }, []);

  const handleViewProfile = async (student) => {
    setSelectedStudent(student);
    const { data } = await supabase
      .from('enrollment_history')
      .select('*')
      .eq('student_id', student.id)
      .order('completion_date', { ascending: false });
    
    if (data) setStudentHistory(data);
    setCurrentView('profile');
  };

  const handleRestore = async (student) => {
    if(window.confirm(`Are you sure you want to restore ${student.name} to Active learning?`)) {
       setLoading(true);
       try {
         await supabase.from('students').update({ status: 'Pending Group' }).eq('id', student.id);
         alert(`✅ ${student.name} has been restored! They are now in "Active Records" waiting for a group.`);
         setCurrentView('list');
         fetchArchived();
       } catch (err) {
         alert(err.message);
       } finally {
         setLoading(false);
       }
    }
  };

  const filteredArchived = archivedStudents.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    String(s.id).includes(searchQuery)
  );

  const renderList = () => (
    <div className="w-full flex flex-col min-h-full animate-fade-in p-8">
      <div className="flex justify-between items-center mb-8 shrink-0">
        <div>
          <h2 className="text-3xl font-bold text-[#0A1128] mb-1">Archived Students</h2>
          <p className="text-sm font-bold text-gray-500">View past students and their academic history</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4 mb-6 shrink-0 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">🔍</span>
          <input type="text" placeholder="Search archive by name or ID..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 transition-all" />
        </div>
      </div>

      <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="py-4 px-6 font-bold text-gray-600 uppercase text-xs">Student ID</th>
              <th className="py-4 px-6 font-bold text-gray-600 uppercase text-xs">Name</th>
              <th className="py-4 px-6 font-bold text-gray-600 uppercase text-xs">Language</th>
              <th className="py-4 px-6 font-bold text-gray-600 uppercase text-xs">Last Level</th>
              <th className="py-4 px-6 font-bold text-gray-600 uppercase text-xs text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredArchived.length > 0 ? filteredArchived.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50/80 transition-colors">
                <td className="py-4 px-6 font-bold text-gray-500">{student.id}</td>
                <td className="py-4 px-6 font-bold text-[#0A1128]">{student.name}</td>
                <td className="py-4 px-6 font-medium text-gray-700">{student.language || 'N/A'}</td>
                <td className="py-4 px-6 font-medium text-gray-700">{student.level || 'N/A'}</td>
                <td className="py-4 px-6 flex justify-center gap-2">
                  <button onClick={() => handleViewProfile(student)} className="bg-white border border-gray-200 hover:bg-[#0A1128] hover:text-white text-gray-700 font-bold py-1.5 px-4 rounded-lg transition-all cursor-pointer text-xs shadow-sm">View History</button>
                  <button onClick={() => handleRestore(student)} disabled={loading} className="bg-blue-50 border border-blue-200 hover:bg-blue-600 hover:text-white text-blue-700 font-bold py-1.5 px-4 rounded-lg transition-all cursor-pointer text-xs shadow-sm">♻️ Restore</button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="5" className="py-12 text-center text-gray-400"><p className="text-4xl mb-2">🗄️</p><p className="font-bold">Archive is empty.</p></td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderProfile = () => {
    if (!selectedStudent) return null;
    return (
      <div className="w-full flex flex-col min-h-full animate-fade-in pb-12 p-8">
        <div className="flex justify-between items-center mb-6 max-w-5xl mx-auto w-full">
          <div className="flex items-center">
            <button onClick={() => setCurrentView('list')} className="mr-4 w-10 h-10 bg-white border border-gray-200 rounded-full font-bold flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer shadow-sm text-gray-600">←</button>
            <h2 className="text-2xl font-bold text-[#0A1128]">Archived Record</h2>
          </div>
          <button onClick={() => handleRestore(selectedStudent)} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-md transition-colors cursor-pointer">
            ♻️ Restore Student
          </button>
        </div>

        <div className="max-w-5xl mx-auto w-full space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex items-center space-x-6">
               <div className="w-16 h-16 bg-gray-100 text-gray-500 rounded-full flex items-center justify-center text-2xl font-black border-2 border-gray-200">
                  {selectedStudent.first_name?.[0]}{selectedStudent.last_name?.[0]}
               </div>
               <div>
                  <h3 className="text-2xl font-bold text-[#0A1128]">{selectedStudent.name}</h3>
                  <p className="text-sm text-gray-500 font-medium mt-1">ID: {selectedStudent.id} • Language: {selectedStudent.language} • Enrolled: {selectedStudent.enrollment_date}</p>
               </div>
               <div className="ml-auto bg-gray-100 text-gray-600 font-bold px-4 py-2 rounded-xl text-xs uppercase tracking-widest border border-gray-200">
                 Status: Archived
               </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
               <h4 className="font-bold text-lg text-[#0A1128] mb-6 flex items-center"><span className="mr-2">📚</span> Academic History (Past Levels)</h4>
               
               {studentHistory.length > 0 ? (
                 <div className="overflow-hidden border border-gray-100 rounded-xl">
                   <table className="w-full text-left text-sm">
                     <thead className="bg-gray-50 border-b border-gray-100">
                       <tr>
                         <th className="py-3 px-4 font-bold text-gray-600 uppercase text-[10px] tracking-widest">Date Completed</th>
                         <th className="py-3 px-4 font-bold text-gray-600 uppercase text-[10px] tracking-widest">Level</th>
                         <th className="py-3 px-4 font-bold text-gray-600 uppercase text-[10px] tracking-widest">Group Name</th>
                         <th className="py-3 px-4 font-bold text-gray-600 uppercase text-[10px] tracking-widest">Final Grade</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-50">
                       {studentHistory.map((hist) => (
                         <tr key={hist.id} className="hover:bg-gray-50/50">
                           <td className="py-3 px-4 text-gray-500 font-medium">{new Date(hist.completion_date).toLocaleDateString()}</td>
                           <td className="py-3 px-4 font-bold text-[#0A1128]">{hist.level_completed}</td>
                           <td className="py-3 px-4 text-gray-600">{hist.group_name || 'N/A'}</td>
                           <td className="py-3 px-4">
                             <span className={`font-black ${hist.grade >= 10 ? 'text-green-600' : 'text-red-500'}`}>
                               {hist.grade ? `${hist.grade} / 20` : 'No Grade'}
                             </span>
                           </td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>
               ) : (
                 <div className="text-center py-10 bg-gray-50 rounded-xl border border-gray-100 border-dashed">
                   <p className="text-gray-400 font-bold text-sm">No historical records found for this student.</p>
                 </div>
               )}
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
const StudentRegistrationTab = () => {
  const [loading, setLoading] = useState(false);
  const [regMode, setRegMode] = useState('Single'); // 'Single' or 'Family'
  const [classesData, setClassesData] = useState([]);

  const [singleData, setSingleData] = useState({ 
    firstName: '', lastName: '', language: 'English', level: 'A1', classId: '', 
    phone: '', email: '', parentEmail: '', exam_type: 'Course'
  });

  const [parentData, setParentData] = useState({ firstName: '', lastName: '', email: '', phone: '' });
  const [kidsList, setKidsList] = useState([
    { firstName: '', lastName: '', language: 'English', level: 'A1', classId: '', phone: '', email: '', exam_type: 'Course' }
  ]);

  useEffect(() => {
    const fetchClasses = async () => {
      const { data } = await supabase.from('classes').select('*');
      if (data) setClassesData(data);
    };
    fetchClasses();
  }, []);

  const addKid = () => {
    setKidsList([...kidsList, { firstName: '', lastName: '', language: 'English', level: 'A1', classId: '', phone: '', email: '', exam_type: 'Course' }]);
  };
  const removeKid = (index) => {
    setKidsList(kidsList.filter((_, i) => i !== index));
  };
  const handleKidChange = (index, field, value) => {
    const newKids = [...kidsList];
    newKids[index][field] = value;
    setKidsList(newKids);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (regMode === 'Single') {
        const isPlacement = singleData.exam_type === 'Placement';
        let selectedClassName = null;

        if (!isPlacement) {
          if (!singleData.classId) return alert("⚠️ من فضلك خيري الفوج!");
          const selectedClass = classesData.find(c => c.id === singleData.classId);
          selectedClassName = selectedClass.name;
          const currentCount = selectedClass.enrolled_count || 0;
          if (currentCount >= selectedClass.capacity) return alert("❌ هاد الفوج معمر!");
          await supabase.from('classes').update({ enrolled_count: currentCount + 1 }).eq('id', singleData.classId);
        }

        const { error: authError } = await supabase.auth.signUp({ email: singleData.email, password: singleData.phone });
        if (authError && authError.message !== "User already registered") throw authError; 

        if (singleData.parentEmail) {
          const { error: parentAuthError } = await supabase.auth.signUp({ email: singleData.parentEmail, password: singleData.phone });
          if (parentAuthError && parentAuthError.message !== "User already registered") console.error(parentAuthError);
        }

        const { error: dbError } = await supabase.from('students').insert([{
          first_name: singleData.firstName, last_name: singleData.lastName, email: singleData.email, 
          phone: singleData.phone, parent_email: singleData.parentEmail || null, language: singleData.language, 
          level: singleData.level, group_name: selectedClassName, exam_type: singleData.exam_type, 
          status: isPlacement ? 'Pending' : 'Active', enrollment_date: new Date().toISOString().split('T')[0]
        }]);

        if (dbError) throw dbError;
        alert(isPlacement ? "✅ تم تسجيل الطلب للتاست!" : `🎉 تم ترسيم الطالب بنجاح!`);
        setSingleData({ firstName: '', lastName: '', language: 'English', level: 'A1', classId: '', phone: '', email: '', parentEmail: '', exam_type: 'Course' });

      } else {
        if (!parentData.email) return alert("⚠️ إيميل الولي ضروري!");
        if (kidsList.length === 0) return alert("⚠️ لازم تسجلي طفل واحد على الأقل!");

        const { error: parentAuthError } = await supabase.auth.signUp({ email: parentData.email, password: parentData.phone });
        if (parentAuthError && parentAuthError.message !== "User already registered") console.error(parentAuthError);

        for (let i = 0; i < kidsList.length; i++) {
          const kid = kidsList[i];
          const isPlacement = kid.exam_type === 'Placement';
          let selectedClassName = null;

          if (!isPlacement) {
            if (!kid.classId) return alert(`⚠️ خيري الفوج للطفل رقم ${i + 1}`);
            const selectedClass = classesData.find(c => c.id === kid.classId);
            selectedClassName = selectedClass.name;
            const currentCount = selectedClass.enrolled_count || 0;
            if (currentCount >= selectedClass.capacity) return alert(`❌ الفوج المختار للطفل ${kid.firstName} معمر!`);
            
            await supabase.from('classes').update({ enrolled_count: currentCount + 1 }).eq('id', kid.classId);
          }

          const { error: authError } = await supabase.auth.signUp({ email: kid.email, password: kid.phone });
          if (authError && authError.message !== "User already registered") throw authError;

          const { error: dbError } = await supabase.from('students').insert([{
            first_name: kid.firstName, last_name: kid.lastName, email: kid.email, phone: kid.phone, 
            parent_email: parentData.email, parent_name: `${parentData.firstName} ${parentData.lastName}`, parent_contact: parentData.phone,
            language: kid.language, level: kid.level, group_name: selectedClassName, exam_type: kid.exam_type, 
            status: isPlacement ? 'Pending' : 'Active', enrollment_date: new Date().toISOString().split('T')[0]
          }]);

          if (dbError) throw dbError;
        }

        alert(`🎉 تم تسجيل العائلة بنجاح (${kidsList.length} أولاد)!`);
        setParentData({ firstName: '', lastName: '', email: '', phone: '' });
        setKidsList([{ firstName: '', lastName: '', language: 'English', level: 'A1', classId: '', phone: '', email: '', exam_type: 'Course' }]);
      }
    } catch (err) { alert("إيرور: " + err.message); } finally { setLoading(false); }
  };

  return (
    <div className="w-full flex flex-col h-full p-8 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-[#0A1128]">Manual Registration</h2>
        <div className="flex bg-gray-200 p-1 rounded-xl">
          <button onClick={() => setRegMode('Single')} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${regMode === 'Single' ? 'bg-white text-[#2563eb] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Single Student</button>
          <button onClick={() => setRegMode('Family')} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${regMode === 'Family' ? 'bg-white text-[#2563eb] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Family (Parent & Kids)</button>
        </div>
      </div>

      <form onSubmit={handleSave} className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
        
        {regMode === 'Single' ? (
          <>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
              <h3 className="font-bold text-lg mb-4 border-b border-gray-100 pb-2">Academic Details</h3>
              <div className={`grid gap-4 ${singleData.exam_type === 'Course' ? 'grid-cols-4' : 'grid-cols-2'}`}>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Registration Type</label>
                    <select value={singleData.exam_type} onChange={e=>setSingleData({...singleData, exam_type: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-lg p-3 text-sm">
                      <option value="Course">Direct Course</option><option value="Placement">Placement Test</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Language</label>
                    <select value={singleData.language} onChange={e=>setSingleData({...singleData, language: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-lg p-3 text-sm">
                      <option>English</option><option>Français</option><option>Deutsch</option><option>Español</option>
                    </select>
                  </div>
                  {singleData.exam_type === 'Course' && (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Level</label>
                        <select value={singleData.level} onChange={e=>setSingleData({...singleData, level: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-lg p-3 text-sm">
                          <option>A1</option><option>A2</option><option>B1</option><option>B2</option><option>C1</option><option>C2</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#2563eb] uppercase mb-1">Available Groups</label>
                        <select value={singleData.classId} onChange={e=>setSingleData({...singleData, classId: e.target.value})} className="w-full bg-white border border-blue-200 rounded-lg p-3 text-sm font-bold">
                          <option value="">-- Select Group --</option>
                          {classesData.filter(c => c.language === singleData.language && c.level.includes(singleData.level)).map(c => {
                            const isFull = (c.enrolled_count || 0) >= (c.capacity || 20);
                            return <option key={c.id} value={c.id} disabled={isFull}>{c.name} {isFull ? '🔴 FULL' : ''}</option>
                          })}
                        </select>
                      </div>
                    </>
                  )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="font-bold text-lg mb-4 border-b border-gray-100 pb-2">Personal Info</h3>
                <div className="space-y-4">
                  <input type="text" value={singleData.firstName} onChange={e=>setSingleData({...singleData, firstName: e.target.value})} placeholder="First Name" className="w-full bg-gray-50 border border-gray-100 p-3 rounded-lg text-sm" required />
                  <input type="text" value={singleData.lastName} onChange={e=>setSingleData({...singleData, lastName: e.target.value})} placeholder="Last Name" className="w-full bg-gray-50 border border-gray-100 p-3 rounded-lg text-sm" required />
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="font-bold text-lg mb-4 border-b border-gray-100 pb-2">Contact & Login</h3>
                <div className="space-y-4">
                  <input type="email" value={singleData.email} onChange={e=>setSingleData({...singleData, email: e.target.value})} placeholder="Student Email" className="w-full bg-gray-50 border border-gray-100 p-3 rounded-lg text-sm" required />
                  <input type="tel" value={singleData.phone} onChange={e=>setSingleData({...singleData, phone: e.target.value})} placeholder="Phone Number (Becomes Password)" className="w-full bg-gray-50 border border-gray-100 p-3 rounded-lg text-sm" required />
                  <input type="email" value={singleData.parentEmail} onChange={e=>setSingleData({...singleData, parentEmail: e.target.value})} placeholder="Parent Email (Optional for linking)" className="w-full bg-blue-50 border border-blue-100 p-3 rounded-lg text-sm" />
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-[#0A1128] p-6 rounded-2xl shadow-md text-white border border-[#111C44]">
              <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-3">
                <span className="text-2xl">👥</span>
                <h3 className="font-bold text-lg uppercase tracking-widest text-blue-300">Parent / Guardian Details</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <input type="text" value={parentData.firstName} onChange={e=>setParentData({...parentData, firstName: e.target.value})} placeholder="First Name" className="bg-white/10 border border-white/20 p-3 rounded-lg text-sm text-white placeholder-gray-400" required />
                <input type="text" value={parentData.lastName} onChange={e=>setParentData({...parentData, lastName: e.target.value})} placeholder="Last Name" className="bg-white/10 border border-white/20 p-3 rounded-lg text-sm text-white placeholder-gray-400" required />
                <input type="email" value={parentData.email} onChange={e=>setParentData({...parentData, email: e.target.value})} placeholder="Parent Email (Login)" className="bg-white/10 border border-white/20 p-3 rounded-lg text-sm text-white placeholder-gray-400" required />
                <input type="tel" value={parentData.phone} onChange={e=>setParentData({...parentData, phone: e.target.value})} placeholder="Phone (Password)" className="bg-white/10 border border-white/20 p-3 rounded-lg text-sm text-white placeholder-gray-400" required />
              </div>
            </div>

            <div className="space-y-6">
              {kidsList.map((kid, index) => (
                <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border-2 border-blue-50 relative">
                  <div className="absolute -top-3 -left-3 bg-[#2563eb] text-white w-8 h-8 rounded-full flex items-center justify-center font-black border-4 border-[#F8F9FA]">
                    {index + 1}
                  </div>
                  {kidsList.length > 1 && (
                    <button type="button" onClick={() => removeKid(index)} className="absolute top-4 right-4 text-red-400 hover:text-red-600 font-bold text-xs">✕ Remove</button>
                  )}
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 mt-2">
                    <input type="text" value={kid.firstName} onChange={e=>handleKidChange(index, 'firstName', e.target.value)} placeholder="Kid First Name" className="bg-gray-50 border border-gray-200 p-3 rounded-lg text-sm font-bold" required />
                    <input type="text" value={kid.lastName} onChange={e=>handleKidChange(index, 'lastName', e.target.value)} placeholder="Kid Last Name" className="bg-gray-50 border border-gray-200 p-3 rounded-lg text-sm font-bold" required />
                    <input type="email" value={kid.email} onChange={e=>handleKidChange(index, 'email', e.target.value)} placeholder="Kid Email" className="bg-gray-50 border border-gray-200 p-3 rounded-lg text-sm" required />
                    <input type="tel" value={kid.phone} onChange={e=>handleKidChange(index, 'phone', e.target.value)} placeholder="Kid Phone" className="bg-gray-50 border border-gray-200 p-3 rounded-lg text-sm" required />
                  </div>

                  <div className="grid grid-cols-4 gap-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                    <select value={kid.exam_type} onChange={e=>handleKidChange(index, 'exam_type', e.target.value)} className="bg-white border border-blue-200 rounded-lg p-2.5 text-xs font-bold text-blue-800">
                      <option value="Course">Direct Course</option><option value="Placement">Placement Test</option>
                    </select>
                    <select value={kid.language} onChange={e=>handleKidChange(index, 'language', e.target.value)} className="bg-white border border-blue-200 rounded-lg p-2.5 text-xs font-bold text-blue-800">
                      <option>English</option><option>Français</option><option>Deutsch</option><option>Español</option>
                    </select>
                    {kid.exam_type === 'Course' && (
                      <>
                        <select value={kid.level} onChange={e=>handleKidChange(index, 'level', e.target.value)} className="bg-white border border-blue-200 rounded-lg p-2.5 text-xs font-bold text-blue-800">
                          <option>A1</option><option>A2</option><option>B1</option><option>B2</option><option>C1</option>
                        </select>
                        <select value={kid.classId} onChange={e=>handleKidChange(index, 'classId', e.target.value)} className="bg-white border border-blue-500 rounded-lg p-2.5 text-xs font-bold text-blue-800">
                          <option value="">-- Assign Group --</option>
                          {classesData.filter(c => c.language === kid.language && c.level.includes(kid.level)).map(c => {
                            const isFull = (c.enrolled_count || 0) >= (c.capacity || 20);
                            return <option key={c.id} value={c.id} disabled={isFull}>{c.name} {isFull ? '🔴 FULL' : ''}</option>
                          })}
                        </select>
                      </>
                    )}
                  </div>
                </div>
              ))}
              
              <button type="button" onClick={addKid} className="w-full py-4 border-2 border-dashed border-[#2563eb] text-[#2563eb] font-black rounded-2xl hover:bg-blue-50 transition-colors uppercase tracking-widest text-xs">
                + Add Another Child to this Family
              </button>
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
const StaffRegistrationTab = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ 
    firstName: '', lastName: '', email: '', phone: '', department: 'English', role: 'Teacher' 
  });

  const handleInputChange = (e) => { 
    const { name, value } = e.target; 
    setFormData(prev => ({ ...prev, [name]: value })); 
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        const { data: authData, error: authError } = await supabase.auth.signUp({ 
            email: formData.email, 
            password: formData.phone 
        });
        if (authError && authError.message !== "User already registered") throw authError; 

        const uid = authData.user?.id; 

        const { error: dbError } = await supabase.from('staff').insert([{
            auth_id: uid, 
            first_name: formData.firstName, 
            last_name: formData.lastName, 
            email: formData.email, 
            phone: formData.phone, 
            department: formData.department,
            role: formData.role
        }]);

        if (dbError) throw dbError;

        alert(`🎉 تم إضافة ${formData.firstName} بنجاح! يقدر دركا يدخل للسيت بالإيميل ورقم الهاتف.`);
        setFormData({ firstName: '', lastName: '', email: '', phone: '', department: 'English', role: 'Teacher' });
        
    } catch (err) { alert("إيرور: " + err.message); } finally { setLoading(false); }
  };

  return (
    <div className="w-full flex flex-col h-full p-8 animate-fade-in">
      <h2 className="text-3xl font-bold text-[#0A1128] mb-8">Add New Staff</h2>
      <form onSubmit={handleSave} className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
           <h3 className="font-bold text-lg mb-4 border-b border-gray-100 pb-2">Professional Details</h3>
           <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Department</label>
                <select name="department" value={formData.department} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-100 rounded-lg p-3 text-sm outline-none focus:border-blue-500">
                  <option>English</option><option>Français</option><option>Deutsch</option><option>Español</option><option>Administration</option><option>Maintenance</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">System Role</label>
                <select name="role" value={formData.role} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-100 rounded-lg p-3 text-sm outline-none focus:border-blue-500">
                  <option value="Teacher">Teacher</option>
                  <option value="Secretary">Secretary</option>
                  <option value="Clean Lady">Clean Lady</option>
                </select>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
             <h3 className="font-bold text-lg mb-4 border-b border-gray-100 pb-2">Personal Info</h3>
             <div className="space-y-4">
               <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="First Name" className="w-full bg-gray-50 border border-gray-100 p-3 rounded-lg text-sm" required />
               <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Last Name" className="w-full bg-gray-50 border border-gray-100 p-3 rounded-lg text-sm" required />
             </div>
           </div>
           
           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
             <h3 className="font-bold text-lg mb-4 border-b border-gray-100 pb-2">Login Info</h3>
             <div className="space-y-4">
               <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Work Email" className="w-full bg-gray-50 border border-gray-100 p-3 rounded-lg text-sm" required />
               <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone Number (Becomes Password)" className="w-full bg-gray-50 border border-gray-100 p-3 rounded-lg text-sm" required />
             </div>
           </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end space-x-4">
          <button type="submit" disabled={loading} className="px-8 py-3 bg-[#2563eb] hover:bg-blue-800 text-white font-bold rounded-lg shadow-md transition-colors cursor-pointer">
            {loading ? 'Processing...' : 'Create Staff Account'}
          </button>
        </div>
      </form>
    </div>
  );
};

// ==========================================
// 🌟 الكومبوننت الأم (The Master Hub) 🌟
// ==========================================
const StudentsManagement = () => {
  const [activeTab, setActiveTab] = useState('requests');

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans">
      
      <div className="pt-8 px-8 pb-2">
        <div className="flex space-x-2 bg-white p-2 rounded-2xl shadow-sm border border-gray-200 w-max">
          <button onClick={() => setActiveTab('requests')} className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'requests' ? 'bg-[#0A1128] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 cursor-pointer'}`}>📥 Requests Pipeline</button>
          <button onClick={() => setActiveTab('records')} className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'records' ? 'bg-[#0A1128] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 cursor-pointer'}`}>🎓 Active Records</button>
          <button onClick={() => setActiveTab('archive')} className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'archive' ? 'bg-[#0A1128] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 cursor-pointer'}`}>🗄️ Archive</button>
          <button onClick={() => setActiveTab('add')} className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'add' ? 'bg-[#0A1128] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 cursor-pointer'}`}>➕ Manual Registration</button>
          <button onClick={() => setActiveTab('addStaff')} className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ml-4 ${activeTab === 'addStaff' ? 'bg-[#2563eb] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 cursor-pointer border border-gray-100'}`}>👥 Add Staff</button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {activeTab === 'requests' && <RegistrationRequestsTab />}
        {activeTab === 'records' && <StudentRecordsTab />}
        {activeTab === 'archive' && <StudentArchiveTab />}
        {activeTab === 'add' && <StudentRegistrationTab />}
        {activeTab === 'addStaff' && <StaffRegistrationTab />}
      </div>

    </div>
  );
};

export default StudentsManagement;
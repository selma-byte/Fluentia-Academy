import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

// ==========================================
// 1. الرواق الأول: طلبات التسجيل (Registration Requests)
// ==========================================
const RegistrationRequestsTab = () => {
  const [activeFilter, setActiveFilter] = useState('All'); // 💡 يقدر يكون 'All', 'Student', أو 'Parent'
  const [requests, setRequests] = useState([]);
  const [classesData, setClassesData] = useState([]);
  const [staffData, setStaffData] = useState([]); // 💡 جلب الأساتذة
  const [roomsData, setRoomsData] = useState([]); // 💡 جلب القاعات
  const [schedTeacher, setSchedTeacher] = useState(''); // 💡 الأستاذ المختار // 💡 إضافة لجلب الأقسام

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
    // جلب الأساتذة
    const { data: staff } = await supabase.from('staff').select('*');
    if (staff) setStaffData(staff);
    
    // جلب القاعات
    const { data: rooms } = await supabase.from('rooms').select('*');
    if (rooms) setRoomsData(rooms);
  };

  useEffect(() => { fetchRequests(); fetchClasses();fetchStaffAndRooms(); }, []);

  const [isEnrollMode, setIsEnrollMode] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(false); // 💡 إضافة اللودينغ
  
  const [schedDay, setSchedDay] = useState('Mon');
  const [schedTime, setSchedTime] = useState('10:00');
  const [schedDate, setSchedDate] = useState('');
  const [schedRoom, setSchedRoom] = useState('');

  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyWhatsApp, setNotifyWhatsApp] = useState(false);

  // 💡 State for Final Enrollment Decision
  const [enrollClassId, setEnrollClassId] = useState('');
  const [enrollGrade, setEnrollGrade] = useState('');
  // 💡 هادي تفيلتري الداتا على حساب البوطون اللي كليكيتي عليه
  const filteredRequests = requests.filter(req => {
    if (activeFilter === 'All') return true;
    return req.type === activeFilter;
  });
  // دوال مساعدة للتوقيت
  const getDayNumber = (dayStr) => {
      const days = { 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6, 'Sun': 0 };
      return days[dayStr] || 1;
  };
  const parseTimeToFloat = (timeStr) => {
      const [hours, minutes] = timeStr.split(':');
      return parseInt(hours) + parseInt(minutes)/60;
  };

  const handleEnrollNow = (req) => { setSelectedStudent(req); setIsEnrollMode(true); };
  const handleOpenScheduleModal = (req) => { setSelectedStudent(req); setIsScheduleModalOpen(true); };

  const handleSaveSchedule = async () => {
    setLoading(true);

    try {
      if (!schedRoom || !schedTeacher) {
        alert("⚠️ من فضلك خيري الأستاذ والقاعة!");
        setLoading(false);
        return;
      }

      // 💡 1. التحقق: هل كاين Placement Test في نفس الوقت؟
      const { data: existingTests } = await supabase
        .from('appointments')
        .select('*')
        .eq('appointment_day', getDayNumber(schedDay))
        .eq('start_time_float', parseTimeToFloat(schedTime))
        .ilike('sub_title', '%Placement Test%');

      if (existingTests && existingTests.length > 0) {
        // يخرجلك ميساج فيه وي ولا للا
        const confirmJoin = window.confirm(`⚠️ كاين ديجا ${existingTests.length} تلاميذ راهم مبرمجين لـ Placement Test في هاد الوقت! \n\nتحبي تزيدي هاد التلميذ معاهم في نفس الفوج؟`);
        
        if (!confirmJoin) {
          setLoading(false);
          return; // إذا قلتي للا، يحبس وميسجلش
        }
      }

      // 💡 2. التحقق من القاعات (نفس الكود ديالك)
      const { data: conflicts } = await supabase
        .from('classes')
        .select('*')
        .ilike('schedule', `%${schedDay}%`)
        .ilike('schedule', `%${schedTime}%`)
        .ilike('schedule', `%${schedRoom}%`)
        .limit(1);

      if (conflicts && conflicts.length > 0) {
        alert(`⚠️ القاعة [${schedRoom}] محجوزة! راهم يقراو فيها فوج: ${conflicts[0].name} في هاد الوقت.`);
        setLoading(false);
        return; 
      }

      const fullAppointmentDate = `${schedDay}, ${schedTime}`;
      
      const { error: stuError } = await supabase
        .from('students')
        .update({ status: 'Scheduled', appointment_date: fullAppointmentDate })
        .eq('id', selectedStudent.id);

      if (stuError) throw stuError;

      const { error: appError } = await supabase
        .from('appointments')
        .insert([{
          title: selectedStudent.name,
          sub_title: `Placement Test: ${selectedStudent.language} (Prof: ${schedTeacher}, Room: ${schedRoom})`, // 💡 زدنا اسم الأستاذ والقاعة هنا باش يبانو
          appointment_day: getDayNumber(schedDay), 
          start_time_float: parseTimeToFloat(schedTime),
          status: 'Upcoming',
          phone: selectedStudent.phone
        }]);

      if (appError) throw appError;

      alert("✅ تم برمجة التاست بنجاح!");
      setIsScheduleModalOpen(false);
      fetchRequests(); 

    } catch (err) {
      alert("إيرور: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFinalEnrollment = async () => {
    if (!enrollClassId) return alert("⚠️ من فضلك خيري الفوج!");
    if (!enrollGrade) return alert("⚠️ من فضلك أدخلي علامة التاست!");

    try {
      const selectedClass = classesData.find(c => c.id === enrollClassId);
      const currentCount = selectedClass.enrolled_count || 0;
      if (currentCount >= selectedClass.capacity) return alert("❌ هاد الفوج معمر!");

      // 💡 السحر هنا: نكرييولو الحساب باش يولي يقدر يدير Login
      const { error: authError } = await supabase.auth.signUp({ email: selectedStudent.email, password: selectedStudent.phone });
      if (authError && authError.message !== "User already registered") throw authError;

      await supabase.from('classes').update({ enrolled_count: currentCount + 1 }).eq('id', enrollClassId);
      
      const { error: dbError } = await supabase.from('students').update({ 
        status: 'Active', 
        exam_type: 'Course',
        group_name: selectedClass.name,
        level: selectedClass.level,
        test_score: enrollGrade
      }).eq('id', selectedStudent.id);
      
      if (dbError) throw dbError;
      
      alert(`🎉 تم ترسيم ${selectedStudent.name} بنجاح في فوج ${selectedClass.name}! يقدر يدخل للسيت دركا.`);
      setIsEnrollMode(false);
      fetchRequests();
    } catch (err) { alert("إيرور في الترسيم: " + err.message); }
  };

  if (isEnrollMode) {
    const matchingClasses = classesData.filter(c => c.language === selectedStudent?.language);
    return (
      <div className="min-h-screen bg-[#F8F9FA] p-12 font-sans text-left transition-all duration-300">
        <div className="flex items-center mb-12">
          <button onClick={() => setIsEnrollMode(false)} className="w-10 h-10 bg-white shadow-sm rounded-full flex items-center justify-center mr-6 hover:bg-gray-100 cursor-pointer text-gray-400">←</button>
          <h1 className="text-3xl font-bold text-[#0A1128]">Enroll Student</h1>
        </div>
        <div className="max-w-6xl space-y-16">
          
          {/* 💡 الإضافة الجديدة: قسم القرار النهائي (علامة التاست وتحديد الفوج) بنفس ستايلك */}
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-sm font-bold text-[#0A1128] mb-6 uppercase tracking-wide border-b border-gray-100 pb-2 w-max">🎓 Final Registration Decision</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Assign to Group (Based on Test)</label>
                  <select value={enrollClassId} onChange={(e) => setEnrollClassId(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-bold outline-none focus:border-[#0A1128] shadow-sm cursor-pointer">
                     <option value="">-- Select Group --</option>
                     {matchingClasses.map(c => {
                         const isFull = (c.enrolled_count || 0) >= (c.capacity || 20);
                         return <option key={c.id} value={c.id} disabled={isFull}>{c.name} - Lvl: {c.level} ({(c.enrolled_count || 0)}/{c.capacity || 20}) {isFull ? '🔴 FULL' : ''}</option>
                     })}
                  </select>
               </div>
               <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Test Score / Note</label>
                  <input type="text" value={enrollGrade} onChange={(e)=>setEnrollGrade(e.target.value)} placeholder="e.g. 18/20 or B2+" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-bold outline-none focus:border-[#0A1128]" />
               </div>
            </div>
          </section>

          <section>
            <h2 className="text-sm font-bold text-gray-800 mb-8 uppercase tracking-wide border-b border-gray-100 pb-2 w-max">Academic Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[{ label: "Language", v: selectedStudent?.language }, { label: "Level", v: selectedStudent?.level }, { label: "Group", v: enrollClassId ? classesData.find(c=>c.id===enrollClassId)?.name : "Pending..." }].map((item) => (
                <div key={item.label} className="space-y-2 border-b border-gray-200 pb-2 relative">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.label}</label>
                  <div className="text-sm font-bold text-gray-700">{item.v}</div>
                  <span className="absolute right-0 bottom-2 text-gray-300 text-[10px]">▼</span>
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
                <input type="text" placeholder="jj/mm/aaaa 📅" className="w-full bg-transparent border-b border-gray-200 py-3 text-sm font-bold outline-none" />
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
        {/* 💡 أزرار الفلترة الديناميكية */}
        <div className="flex bg-[#0A1128] text-white rounded-2xl p-1 text-[11px] font-bold">
          <span 
            onClick={() => setActiveFilter('All')} 
            className={`px-6 py-2 rounded-xl cursor-pointer transition-all ${activeFilter === 'All' ? 'bg-white/20' : 'opacity-40 hover:opacity-80'}`}
          >
            All
          </span>
          <span 
            onClick={() => setActiveFilter('Student')} 
            className={`px-6 py-2 rounded-xl cursor-pointer transition-all ${activeFilter === 'Student' ? 'bg-white/20' : 'opacity-40 hover:opacity-80'}`}
          >
            Students
          </span>
          <span 
            onClick={() => setActiveFilter('Parent')} 
            className={`px-6 py-2 rounded-xl cursor-pointer transition-all ${activeFilter === 'Parent' ? 'bg-white/20' : 'opacity-40 hover:opacity-80'}`}
          >
            Parents
          </span>
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
                  <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black border ${
                    req.status === 'Passed' ? 'bg-green-50 text-green-600 border-green-100' : 
                    req.status === 'Scheduled' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                    'bg-orange-50 text-orange-600 border-orange-100'
                  }`}>
                    {req.status.toUpperCase()}
                  </span>
                </td>
                <td className="p-6 flex justify-center gap-3">
                  {req.status === 'Passed' ? (
                    <button onClick={() => handleEnrollNow(req)} className="px-8 py-2.5 bg-green-600 text-white rounded-xl text-[11px] font-bold hover:bg-green-700 cursor-pointer shadow-md">
                      Enroll Now ✅
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleOpenScheduleModal(req)}
                      disabled={req.status === 'Scheduled'}
                      className={`px-6 py-2.5 rounded-xl text-[11px] font-bold transition-all shadow-sm ${
                        req.status === 'Scheduled' ? 'bg-gray-100 text-gray-300 cursor-not-allowed border border-gray-100' : 'bg-[#0A1128] text-white hover:bg-blue-900 cursor-pointer'
                      }`}
                    >
                      {req.status === 'Scheduled' ? 'Scheduled 📅' : 'Schedule Test 📅'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Applicant</label>
                <input type="text" defaultValue={selectedStudent?.name} className="w-full bg-transparent border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 outline-none" readOnly />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Test Type</label>
                <input type="text" defaultValue="PLACEMENT TEST" className="w-full bg-transparent border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 outline-none" readOnly/>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Day</label>
                <div className="relative">
                  <select value={schedDay} onChange={(e) => setSchedDay(e.target.value)} className="w-full bg-transparent border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 outline-none appearance-none cursor-pointer"><option value="Mon">Mon</option><option value="Tue">Tue</option><option value="Wed">Wed</option><option value="Thu">Thu</option></select>
                  <span className="absolute right-4 top-3 text-gray-500 text-[10px]">▼</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Time Block</label>
                <div className="relative">
                  <select value={schedTime} onChange={(e) => setSchedTime(e.target.value)} className="w-full bg-transparent border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 outline-none appearance-none cursor-pointer"><option value="10:00">10:00</option><option value="14:00">14:00</option></select>
                  <span className="absolute right-4 top-3 text-gray-500 text-[10px]">▼</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Teacher / Interviewer</label>
                <div className="relative">
                  <select 
                    value={schedTeacher} 
                    onChange={(e) => setSchedTeacher(e.target.value)} 
                    className="w-full bg-transparent border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 outline-none appearance-none cursor-pointer"
                  >
                    <option value="">-- Select Teacher --</option>
                    {staffData.map(staff => (
                      <option key={staff.id} value={`${staff.first_name} ${staff.last_name}`}>
                        {staff.first_name} {staff.last_name}
                      </option>
                    ))}
                  </select>
                  <span className="absolute right-4 top-3 text-gray-500 text-[10px]">▼</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Room / Lab</label>
                <div className="relative">
                  <select 
                    value={schedRoom} 
                    onChange={(e) => setSchedRoom(e.target.value)} 
                    className="w-full bg-transparent border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 outline-none appearance-none cursor-pointer"
                  >
                    <option value="">-- Select Room --</option>
                    {roomsData.map(room => (
                      <option key={room.id} value={room.name || room.room_name || room.id}>
                        {room.name || room.room_name || `Room ${room.id}`}
                      </option>
                    ))}
                  </select>
                  <span className="absolute right-4 top-3 text-gray-500 text-[10px]">▼</span>
                </div>
              </div>
              <div className="col-span-2 space-y-1.5 mt-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Date (For Calendar)</label>
                <input type="text" value={schedDate} onChange={(e) => setSchedDate(e.target.value)} placeholder="e.g. 23 May" className="w-full bg-transparent border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 outline-none" />
              </div>
              <div className="col-span-2 mt-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#0A1128]">Notify Applicant</p>
                  <p className="text-[10px] text-gray-500 font-bold mt-1">Send an automated message with date & time.</p>
                </div>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1.5 text-xs font-bold text-gray-700 cursor-pointer">
                    <input type="checkbox" checked={notifyEmail} onChange={(e) => setNotifyEmail(e.target.checked)} className="w-4 h-4 accent-[#0A1128] cursor-pointer" /> Email 📧
                  </label>
                  <label className="flex items-center gap-1.5 text-xs font-bold text-gray-700 cursor-pointer">
                    <input type="checkbox" checked={notifyWhatsApp} onChange={(e) => setNotifyWhatsApp(e.target.checked)} className="w-4 h-4 accent-[#0A1128] cursor-pointer" /> WhatsApp 💬
                  </label>
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
  
  const fetchActiveStudents = async () => {
    const { data, error } = await supabase.from('students').select('*').eq('status', 'Active');
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

  const handleUpdateAcademic = (e) => {
    e.preventDefault();
    alert(`✅ Academic Record Saved Successfully for ${selectedStudent.firstName}!\nAssessment: ${academicEntry.subject}\nGrade: ${academicEntry.grade}`);
    setAcademicEntry({ subject: '', grade: '', attendance: '', remarks: '' });
  };

  const handleUpdateContact = (e) => { e.preventDefault(); alert(`✅ Contact Info Updated Successfully for ${selectedStudent.firstName}!`); };
  const handlePrint = () => { window.print(); };

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
          <option value="All">🌐 All Languages</option><option value="English">English</option><option value="Spanish">Spanish</option><option value="German">German</option><option value="French">French</option>
        </select>
        <select value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)} className="bg-gray-50 border border-gray-200 text-sm rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 font-bold text-gray-600 cursor-pointer">
          <option value="All">📊 All Levels</option><option value="A1">A1</option><option value="A2">A2</option><option value="B1">B1</option><option value="B2">B2</option><option value="C1">C1</option>
        </select>
        <select value={filterGroup} onChange={(e) => setFilterGroup(e.target.value)} className="bg-gray-50 border border-gray-200 text-sm rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 font-bold text-gray-600 cursor-pointer">
          <option value="All">👥 All Groups</option><option value="Grp 1">Grp 1</option><option value="Grp 2">Grp 2</option><option value="Grp 3">Grp 3</option>
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
                <td className="py-4 px-6"><p className="font-bold text-[#0A1128]">{student.firstName} {student.lastName}</p></td>
                <td className="py-4 px-6 font-medium text-gray-700">{student.language}</td>
                <td className="py-4 px-6 font-medium text-gray-700">{student.level} • {student.group}</td>
                <td className="py-4 px-6 flex justify-center">
                  <button onClick={() => handleViewProfile(student)} className="bg-white border border-gray-200 hover:bg-[#2563eb] hover:text-white hover:border-[#2563eb] text-gray-700 font-bold py-1.5 px-4 rounded-lg transition-all cursor-pointer text-xs shadow-sm">Open Record</button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="5" className="py-12 text-center text-gray-400"><p className="text-4xl mb-2">🔍</p><p className="font-bold">No students found matching your criteria.</p></td></tr>
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
               <button onClick={handlePrint} className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors cursor-pointer flex items-center">
                  <span className="mr-2">🖨️</span> Print Record
               </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex flex-col">
                   <h4 className="font-bold text-sm text-[#0A1128] mb-4 flex items-center"><span className="mr-2">🎓</span> Update Academic Info</h4>
                   <form onSubmit={handleUpdateAcademic} className="space-y-4 flex-1 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div>
                           <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Course / Assessment</label>
                           <input type="text" placeholder="e.g. Midterm Exam" value={academicEntry.subject} onChange={(e) => setAcademicEntry({...academicEntry, subject: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500" required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div>
                              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Grade / Score</label>
                              <input type="text" placeholder="e.g. 85%" value={academicEntry.grade} onChange={(e) => setAcademicEntry({...academicEntry, grade: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500" required />
                           </div>
                           <div>
                              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Attendance Rate</label>
                              <input type="text" placeholder="e.g. 95%" value={academicEntry.attendance} onChange={(e) => setAcademicEntry({...academicEntry, attendance: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500" />
                           </div>
                        </div>
                        <div>
                           <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Teacher Remarks</label>
                           <textarea rows="2" placeholder="Add comments here..." value={academicEntry.remarks} onChange={(e) => setAcademicEntry({...academicEntry, remarks: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500 resize-none"></textarea>
                        </div>
                      </div>
                      <button type="submit" className="w-full bg-[#2563eb] hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg transition-colors shadow-sm cursor-pointer mt-4 text-sm">Save Academic Record</button>
                   </form>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex flex-col">
                   <h4 className="font-bold text-sm text-[#0A1128] mb-4 flex items-center"><span className="mr-2">📞</span> Update Contact Info</h4>
                   <form onSubmit={handleUpdateContact} className="space-y-4 flex-1 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                           <div>
                              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Student Phone</label>
                              <input type="tel" value={contactEntry.phone} onChange={(e) => setContactEntry({...contactEntry, phone: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500" />
                           </div>
                           <div>
                              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Email</label>
                              <input type="email" value={contactEntry.email} onChange={(e) => setContactEntry({...contactEntry, email: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500" />
                           </div>
                        </div>
                        <div>
                           <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Home Address</label>
                           <input type="text" value={contactEntry.address} onChange={(e) => setContactEntry({...contactEntry, address: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500" />
                        </div>
                        <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4 mt-2">
                           <div>
                              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Parent/Guardian Name</label>
                              <input type="text" value={contactEntry.parentName} onChange={(e) => setContactEntry({...contactEntry, parentName: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500" />
                           </div>
                           <div>
                              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Parent Contact</label>
                              <input type="tel" value={contactEntry.parentContact} onChange={(e) => setContactEntry({...contactEntry, parentContact: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500" />
                           </div>
                        </div>
                      </div>
                      <button type="submit" className="w-full bg-[#0A1128] hover:bg-gray-800 text-white font-bold py-2.5 rounded-lg transition-colors shadow-sm cursor-pointer mt-4 text-sm">Update Contact Details</button>
                   </form>
                </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
               <h4 className="font-bold text-sm text-[#0A1128] mb-4">Academic History</h4>
               <div className="overflow-x-auto border border-gray-100 rounded-xl">
                  <table className="w-full text-left text-sm min-w-[600px]">
                     <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                           <th className="py-3 px-4 font-bold text-gray-500 text-[10px] uppercase">Date</th><th className="py-3 px-4 font-bold text-gray-500 text-[10px] uppercase">Assessment</th><th className="py-3 px-4 font-bold text-gray-500 text-[10px] uppercase">Grade</th><th className="py-3 px-4 font-bold text-gray-500 text-[10px] uppercase">Remarks</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-100">
                        <tr className="hover:bg-gray-50"><td className="py-3 px-4 text-gray-500 text-xs">Oct 12, 2025</td><td className="py-3 px-4 font-medium text-[#0A1128] text-xs">Speaking Test 1</td><td className="py-3 px-4 text-green-600 font-bold text-xs">92%</td><td className="py-3 px-4 text-gray-600 text-xs">Excellent pronunciation.</td></tr>
                     </tbody>
                  </table>
               </div>
            </div>
        </div>
      </div>
    );
  };

  return <div className="h-full w-full">{currentView === 'list' ? renderList() : renderProfile()}</div>;
};

// ==========================================
// 3. الرواق الثالث: تسجيل جديد مباشر (Add Student)
// ==========================================
const StudentRegistrationTab = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ 
    firstName: '', lastName: '', language: 'English', level: 'A1', classId: '', 
    phone: '', email: '', exam_type: 'Course', password: '' 
  });

  const [classesData, setClassesData] = useState([]);
  
  useEffect(() => {
    const fetchClasses = async () => {
      const { data } = await supabase.from('classes').select('*');
      if (data) setClassesData(data);
    };
    fetchClasses();
  }, []);

  const availableClasses = classesData.filter(c => 
    c.language === formData.language && 
    (formData.exam_type === 'Placement' || c.level.includes(formData.level))
  );

  const handleInputChange = (e) => { 
    const { name, value } = e.target; 
    setFormData(prev => ({ ...prev, [name]: value })); 
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        const isPlacement = formData.exam_type === 'Placement';
        const finalStatus = isPlacement ? 'Pending' : 'Active';

        let selectedClassName = null;

        if (!isPlacement) {
            if (!formData.classId) return alert("⚠️ من فضلك خيري الفوج (Class)!");
            
            const selectedClass = classesData.find(c => c.id === formData.classId);
            selectedClassName = selectedClass.name;
            const currentCount = selectedClass.enrolled_count || 0;

            if (currentCount >= selectedClass.capacity) return alert("❌ هاد الفوج معمر!");

            // 💡 السحر هنا: نكرييولو الحساب باش يولي يقدر يدير Login
            const { error: authError } = await supabase.auth.signUp({ email: formData.email, password: formData.phone });
            if (authError && authError.message !== "User already registered") throw authError; 

            await supabase.from('classes').update({ enrolled_count: currentCount + 1 }).eq('id', formData.classId);
        } else {
            // حتى لو Placement, نكرييولو حساب
            const { error: authError } = await supabase.auth.signUp({ email: formData.email, password: formData.phone });
            if (authError && authError.message !== "User already registered") throw authError; 
        }

        const { error: dbError } = await supabase.from('students').insert([{
            first_name: formData.firstName, 
            last_name: formData.lastName, 
            email: formData.email, 
            phone: formData.phone, 
            language: formData.language, 
            level: formData.level, 
            group_name: selectedClassName, 
            exam_type: formData.exam_type, 
            status: finalStatus, 
            enrollment_date: new Date().toISOString().split('T')[0]
        }]);

        if (dbError) throw dbError;

        alert(isPlacement ? "تم تسجيل الطلب للتاست!" : `🎉 تم ترسيم الطالب! يقدر دركا يدخل للسيت للإيميل ورقم الهاتف كمودباس.`);
        
        setFormData({ firstName: '', lastName: '', language: 'English', level: 'A1', classId: '', phone: '', email: '', exam_type: 'Course', password: '' });
        
    } catch (err) { alert("إيرور: " + err.message); } finally { setLoading(false); }
  };

  return (
    <div className="w-full flex flex-col h-full p-8 animate-fade-in">
      <h2 className="text-3xl font-bold text-[#0A1128] mb-8">Manual Student Registration</h2>
      <form onSubmit={handleSave} className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
           <h3 className="font-bold text-lg mb-4 border-b border-gray-100 pb-2">Academic Details</h3>
           <div className={`grid gap-4 ${formData.exam_type === 'Course' ? 'grid-cols-4' : 'grid-cols-2'}`}>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Registration Type</label>
                <select name="exam_type" value={formData.exam_type} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-100 rounded-lg p-3 text-sm outline-none focus:border-blue-500">
                  <option value="Course">Direct Course</option><option value="Placement">Placement Test</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Language</label>
                <select name="language" value={formData.language} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-100 rounded-lg p-3 text-sm">
                  <option>English</option><option>Français</option><option>Deutsch</option><option>Español</option>
                </select>
              </div>

              {formData.exam_type === 'Course' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Level</label>
                    <select name="level" value={formData.level} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-100 rounded-lg p-3 text-sm">
                      <option>A1</option><option>A2</option><option>B1</option><option>B2</option><option>C1</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-[#2563eb] uppercase mb-1">Available Groups</label>
                    <select name="classId" value={formData.classId} onChange={handleInputChange} className="w-full bg-white border border-blue-200 rounded-lg p-3 text-sm font-bold outline-none focus:border-blue-500 shadow-sm cursor-pointer">
                      <option value="">-- Select Group --</option>
                      {availableClasses.length > 0 ? availableClasses.map(c => {
                        const isFull = (c.enrolled_count || 0) >= (c.capacity || 20);
                        return (
                          <option key={c.id} value={c.id} disabled={isFull}>
                            {c.name} ({(c.enrolled_count || 0)}/{c.capacity || 20}) {isFull ? '🔴 FULL' : ''}
                          </option>
                        );
                      }) : <option value="" disabled>❌ No groups available</option>}
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
               <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="First Name" className="w-full bg-gray-50 border border-gray-100 p-3 rounded-lg text-sm" required />
               <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Last Name" className="w-full bg-gray-50 border border-gray-100 p-3 rounded-lg text-sm" required />
             </div>
           </div>
           
           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
             <h3 className="font-bold text-lg mb-4 border-b border-gray-100 pb-2">Contact Info</h3>
             <div className="space-y-4">
               <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email Address" className="w-full bg-gray-50 border border-gray-100 p-3 rounded-lg text-sm" required />
               <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone Number (Becomes Password)" className="w-full bg-gray-50 border border-gray-100 p-3 rounded-lg text-sm" required />
             </div>
           </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end space-x-4">
          <button type="submit" disabled={loading} className="px-8 py-3 bg-[#0A1128] hover:bg-gray-800 text-white font-bold rounded-lg shadow-md transition-colors cursor-pointer">
            {loading ? 'Processing...' : 'Save & Register Student'}
          </button>
        </div>
      </form>
    </div>
  );
};

// ==========================================
// 4. الرواق الرابع: إضافة أستاذ جديد (Add Teacher) 👨‍🏫
// ==========================================
const TeacherRegistrationTab = () => {
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
        // 💡 نكرييولو الحساب في Auth باش يدير Login ديريكت
        const { data: authData, error: authError } = await supabase.auth.signUp({ 
            email: formData.email, 
            password: formData.phone // الباسورد هو رقم التيليفون
        });
        if (authError && authError.message !== "User already registered") throw authError; 

        const uid = authData.user?.id; // جلب الـ UID

        // 💡 نحطوه في طابلو الأساتذة ونربطوه بالـ ID
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

        alert(`🎉 تم إضافة الأستاذ ${formData.firstName}! يقدر دركا يدخل للسيت بالإيميل ورقم الهاتف.`);
        setFormData({ firstName: '', lastName: '', email: '', phone: '', department: 'English', role: 'Teacher' });
        
    } catch (err) { alert("إيرور: " + err.message); } finally { setLoading(false); }
  };

  return (
    <div className="w-full flex flex-col h-full p-8 animate-fade-in">
      <h2 className="text-3xl font-bold text-[#0A1128] mb-8">Add New Staff / Teacher</h2>
      <form onSubmit={handleSave} className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
           <h3 className="font-bold text-lg mb-4 border-b border-gray-100 pb-2">Professional Details</h3>
           <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Department</label>
                <select name="department" value={formData.department} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-100 rounded-lg p-3 text-sm outline-none focus:border-blue-500">
                  <option>English</option><option>Français</option><option>Deutsch</option><option>Español</option><option>Administration</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">System Role</label>
                <select name="role" value={formData.role} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-100 rounded-lg p-3 text-sm outline-none focus:border-blue-500">
                  <option value="Teacher">Teacher</option><option value="Admin">Admin</option><option value="Secretary">Secretary</option>
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
      
      {/* 🚀 Navigation Tabs - شريط التبديل */}
      <div className="pt-8 px-8 pb-2">
        <div className="flex space-x-2 bg-white p-2 rounded-2xl shadow-sm border border-gray-200 w-max">
          <button 
            onClick={() => setActiveTab('requests')} 
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'requests' ? 'bg-[#0A1128] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 cursor-pointer'}`}
          >
            📥 Requests Pipeline
          </button>
          <button 
            onClick={() => setActiveTab('records')} 
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'records' ? 'bg-[#0A1128] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 cursor-pointer'}`}
          >
            🎓 Active Records
          </button>
          <button 
            onClick={() => setActiveTab('add')} 
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'add' ? 'bg-[#0A1128] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 cursor-pointer'}`}
          >
            ➕ Manual Registration
          </button>
          {/* 💡 قفلة جديدة باش تروح لباجة إضافة الأستاذ */}
          <button 
            onClick={() => setActiveTab('addTeacher')} 
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ml-4 ${activeTab === 'addTeacher' ? 'bg-[#2563eb] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 cursor-pointer border border-gray-100'}`}
          >
            👨‍🏫 Add Teacher
          </button>
        </div>
      </div>

      {/* 📺 عرض المحتوى حسب الرواق المختار */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'requests' && <RegistrationRequestsTab />}
        {activeTab === 'records' && <StudentRecordsTab />}
        {activeTab === 'add' && <StudentRegistrationTab />}
        {activeTab === 'addTeacher' && <TeacherRegistrationTab />}
      </div>

    </div>
  );
};

export default StudentsManagement;
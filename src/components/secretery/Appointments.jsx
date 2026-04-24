import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient'; 

const Appointments = () => {
  const [activeTab, setActiveTab] = useState('calendar'); // 'calendar', 'pending', 'history'
  const [sideModalView, setSideModalView] = useState(null); // null, 'details', 'new'
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(false);

  // =======================================
  // 💡 1. جلب البيانات والدمج والترجمة
  // =======================================
  const [events, setEvents] = useState([]);
  const [teachersList, setTeachersList] = useState([]);
  const [roomsList, setRoomsList] = useState([]);
  
  // لضبط التقويم على الأسبوع الحالي
  const [currentWeekStart, setCurrentWeekStart] = useState(getStartOfWeek(new Date()));

  useEffect(() => {
    const fetchTeachers = async () => {
      const { data } = await supabase.from('staff').select('*').ilike('role', 'teacher');
      if (data) setTeachersList(data);
    };

    const fetchRooms = async () => {
      const { data } = await supabase.from('rooms').select('*');
      if (data) setRoomsList(data);
    };

    fetchTeachers();
    fetchRooms();
  }, []);

  // دالة مساعدة لتحديد بداية الأسبوع (الاثنين)
  function getStartOfWeek(date) {
    const d = new Date(date);
    const day = d.getDay() || 7; 
    if (day !== 1) d.setHours(-24 * (day - 1));
    d.setHours(0, 0, 0, 0);
    return d;
  }

  // تحويل الوقت "HH:MM" إلى رقم عشري لعرضه في التقويم (مثال: "10:30" -> 10.5)
  const timeToFloat = (timeString) => {
    if (!timeString) return 10;
    const [h, m] = timeString.split(':');
    return parseInt(h) + (parseInt(m || 0) / 60);
  };

  // تحديد اليوم في الأسبوع (1 = الاثنين، 7 = الأحد) لعرضه في الشبكة
  const getDayOfWeek = (dateString) => {
    if (!dateString) return 1;
    const day = new Date(dateString).getDay();
    return day === 0 ? 7 : day;
  };

  const fetchEvents = async () => {
    let mergedEvents = [];

    // أ. جلب المواعيد
    const { data: appData, error: appError } = await supabase.from('appointments').select('*');
    if (!appError && appData) {
      const formattedApps = appData.map(ev => ({
        id: ev.id,
        title: ev.title,
        sub: ev.sub_title,
        realDate: ev.appointment_date, // تاريخ حقيقي
        realTime: ev.start_time, // وقت حقيقي
        day: getDayOfWeek(ev.appointment_date), // للتقويم
        start: timeToFloat(ev.start_time), // للتقويم
        duration: Number(ev.duration_minutes) || 60,
        type: ev.status,
        teacher: ev.teacher_name,
        room: ev.room || 'TBD',
        phone: ev.phone,
        email: ev.email,
        notes: ev.notes,
        isClass: false,
        created_at: ev.created_at
      }));
      mergedEvents = [...mergedEvents, ...formattedApps];
    }

    // ب. جلب الأقسام (بقيت كما هي، نعتبرها تتكرر كل أسبوع)
    const { data: classData } = await supabase.from('classes').select('*').not('schedule', 'eq', 'TBD');
    if (classData) {
      const dayMap = { 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6, 'Sun': 7 };
      const formattedClasses = classData.map(c => {
        const dayMatch = c.schedule.match(/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)/);
        const timeMatch = c.schedule.match(/\d{2}:\d{2}/);
        let startFloat = 10; 
        if (timeMatch) {
          const [h, m] = timeMatch[0].split(':');
          startFloat = parseInt(h) + (parseInt(m) / 60);
        }
        return {
          id: `class_${c.id}`,
          title: c.name,
          sub: `Language Course: ${c.language}`,
          day: dayMap[dayMatch ? dayMatch[0] : 'Mon'] || 1,
          start: startFloat,
          duration: 120, 
          type: 'Class', 
          teacher: c.teacher_name,
          room: c.schedule.split('- ')[1] || 'TBD',
          isClass: true,
          realDate: null, // كلاس متكرر
          realTime: timeMatch ? timeMatch[0] : '10:00'
        };
      });
      mergedEvents = [...mergedEvents, ...formattedClasses];
    }

    setEvents(mergedEvents);
  };

  useEffect(() => { fetchEvents(); }, []);

  // =======================================
  // 2. دوال التحكم (Save & Update)
  // =======================================
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  // تهيئة النموذج بوقت حقيقي
  const getTodayString = () => new Date().toISOString().split('T')[0];
  const [formData, setFormData] = useState({ 
    title: '', sub: 'Placement Test', date: getTodayString(), time: '10:00', duration: 60, 
    teacher: '', room: '', phone: '', email: '', notes: '' 
  });

  const handleSave = async (e) => {
    e.preventDefault(); 
    setLoading(true);

    try {
      // التحقق من التعارض
      const newStartFloat = timeToFloat(formData.time);
      const newRoom = formData.room.trim().toLowerCase();
      const newDate = formData.date;

      const conflict = events.find(ev => 
        (ev.realDate === newDate || ev.isClass) && // كلاسات ديما نحسبوهم
        (ev.isClass ? ev.day === getDayOfWeek(newDate) : true) &&
        ev.start === newStartFloat && 
        ev.room.trim().toLowerCase() === newRoom &&
        ev.type !== 'Missed' && ev.type !== 'Completed'
      );

      if (conflict) {
        alert(`⚠️ لا يمكن الحجز!\nالقاعة "${formData.room}" محجوزة في هذا الوقت لـ: ${conflict.title}`);
        setLoading(false);
        return; 
      }

      const { error } = await supabase.from('appointments').insert([{
        title: formData.title,
        sub_title: formData.sub,
        appointment_date: formData.date, // 💡 حقيقي
        start_time: formData.time, // 💡 حقيقي
        duration_minutes: parseInt(formData.duration),
        teacher_name: formData.teacher,
        room: formData.room,
        phone: formData.phone,
        email: formData.email,
        notes: formData.notes,
        status: 'Upcoming'
      }]);
      
      if (error) throw error;
      fetchEvents();
      setSideModalView(null);
      setFormData({ title: '', sub: 'Placement Test', date: getTodayString(), time: '10:00', duration: 60, teacher: '', room: '', phone: '', email: '', notes: '' });
      alert("✅ تم تسجيل الموعد بنجاح!");
    } catch (err) { alert("Error: " + err.message); }
    finally { setLoading(false); }
  };

  const updateStatus = async (id, newStatus) => {
    setLoading(true);
    try {
      const { error } = await supabase.from('appointments').update({ status: newStatus }).eq('id', id);
      if (error) throw error;
      fetchEvents();
      setSideModalView(null);
    } catch (err) { alert(err.message); }
    finally { setLoading(false); }
  };

  // إعدادات بناء الشبكة
  const START_HOUR = 8;
  const END_HOUR = 17;
  const HOUR_HEIGHT = 80;
  const TOTAL_HEIGHT = (END_HOUR - START_HOUR + 1) * HOUR_HEIGHT;
  const hoursArray = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => START_HOUR + i);

  const getEventStyles = (type) => {
    const t = type?.toLowerCase().trim() || '';
    if (t === 'upcoming') return 'bg-[#eff6ff] border-[#3b82f6] text-[#1e40af]';
    if (t === 'completed') return 'bg-[#f0fdf4] border-[#22c55e] text-[#166534]';
    if (t === 'pending' || t === 'missed') return 'bg-[#fefce8] border-[#eab308] text-[#854d0e]';
    if (t === 'class') return 'bg-gray-100 border-gray-400 text-gray-500 opacity-90'; 
    return 'bg-gray-100 border-gray-400 text-gray-700';
  };

  const getDotColor = (type) => {
    const t = type?.toLowerCase().trim() || '';
    if (t === 'upcoming') return 'bg-blue-500';
    if (t === 'completed') return 'bg-green-500';
    if (t === 'pending' || t === 'missed') return 'bg-yellow-500';
    if (t === 'class') return 'bg-gray-600';
    return 'bg-gray-500';
  };

  // تغيير الأسبوع في التقويم
  const nextWeek = () => {
    const next = new Date(currentWeekStart);
    next.setDate(next.getDate() + 7);
    setCurrentWeekStart(next);
  };
  
  const prevWeek = () => {
    const prev = new Date(currentWeekStart);
    prev.setDate(prev.getDate() - 7);
    setCurrentWeekStart(prev);
  };

  // فلترة المواعيد للأسبوع الحالي
  const getEventsForCurrentWeek = () => {
    const endOfWeek = new Date(currentWeekStart);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    
    return events.filter(e => {
      if (e.isClass) return true; // الكلاسات تظهر كل أسبوع
      if (!e.realDate) return false;
      const eventDate = new Date(e.realDate);
      return eventDate >= currentWeekStart && eventDate <= endOfWeek;
    });
  };

  // =======================================
  // 3. عرض التقويم (Calendar View)
  // =======================================
  const renderCalendarView = () => {
    const currentEvents = getEventsForCurrentWeek();
    const monthYear = currentWeekStart.toLocaleString('default', { month: 'long', year: 'numeric' });

    return (
      <div className="flex-1 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col min-w-0">
        <div className="flex justify-between items-center mb-6 shrink-0">
           <h3 className="font-bold text-[#0A1128] text-lg">Weekly Calendar <span className="text-sm font-normal text-gray-500 ml-3">{monthYear}</span></h3>
           <div className="flex items-center space-x-2">
              <button onClick={prevWeek} className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-gray-200 cursor-pointer transition-colors">{"<"}</button>
              <button onClick={() => setCurrentWeekStart(getStartOfWeek(new Date()))} className="px-3 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-600 text-xs font-bold hover:bg-gray-200 cursor-pointer transition-colors">Today</button>
              <button onClick={nextWeek} className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-gray-200 cursor-pointer transition-colors">{">"}</button>
           </div>
        </div>
        
        <div className="flex-1 overflow-y-auto overflow-x-auto custom-scrollbar">
          <div className="min-w-[900px] pb-4">
            <div className="grid grid-cols-[70px_repeat(7,1fr)] gap-2 mb-2 text-center border-b border-gray-200 pb-4 sticky top-0 bg-white z-20 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <div></div>
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, i) => {
                const date = new Date(currentWeekStart);
                date.setDate(date.getDate() + i);
                const isToday = date.toDateString() === new Date().toDateString();
                return (
                  <div key={day} className={isToday ? "text-blue-600" : ""}>
                    {day} <br/> <span className="text-[12px] opacity-70">{date.getDate()}</span>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-[70px_1fr] gap-2">
              <div className="flex flex-col border-r border-gray-100 pr-3 pt-2">
                {hoursArray.map(hour => (
                  <div key={hour} style={{height: `${HOUR_HEIGHT}px`}} className="text-xs font-medium text-gray-400 text-right">
                    {hour > 12 ? hour - 12 : hour}:00 {hour >= 12 ? 'PM' : 'AM'}
                  </div>
                ))}
              </div>

              <div className="relative w-full border-t border-l border-gray-100" style={{height: `${TOTAL_HEIGHT}px`}}>
                <div className="absolute inset-0 grid grid-cols-7 divide-x divide-gray-100 pointer-events-none">
                  {[...Array(7)].map((_, i) => <div key={i}/>)}
                </div>
                <div className="absolute inset-0 flex flex-col divide-y divide-gray-100 pointer-events-none">
                  {hoursArray.map(h => <div key={h} style={{height: `${HOUR_HEIGHT}px`}}></div>)}
                </div>

                {currentEvents.filter(e => filter === 'All' || e.type === filter || e.type === 'Class').map((ev) => {
                  const top = (ev.start - START_HOUR) * HOUR_HEIGHT;
                  const height = (ev.duration / 60) * HOUR_HEIGHT;
                  const left = (ev.day - 1) * (100 / 7);
                  const width = (100 / 7) - 1;

                  return (
                    <div 
                      key={ev.id}
                      onClick={() => { setSelectedEvent(ev); setSideModalView('details'); }}
                      style={{ top: `${top}px`, height: `${height}px`, left: `${left}%`, width: `${width}%` }}
                      className={`absolute p-3 rounded-xl shadow-sm border-l-4 cursor-pointer hover:shadow-md hover:scale-[1.01] transition-all overflow-hidden ${ev.isClass ? 'z-0' : 'z-10'} ${getEventStyles(ev.type)}`}
                    >
                      <p className="text-[11px] font-bold flex items-center mb-1 leading-tight truncate">
                        <span className={`min-w-[6px] w-[6px] h-[6px] rounded-full mr-1.5 ${getDotColor(ev.type)}`}></span> 
                        {ev.title}
                      </p>
                      <p className="text-[10px] leading-tight opacity-80 line-clamp-2">{ev.sub}</p>
                      {ev.duration >= 60 && !ev.isClass && <p className="text-[9px] mt-2 opacity-60">⏱ {ev.realTime}</p>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // =======================================
  // 4. عرض الطلبات المعلقة (Pending Requests)
  // =======================================
  const renderPendingRequests = () => (
    <div className="flex-1 bg-white border border-gray-200 rounded-2xl p-8 shadow-sm flex flex-col min-w-0">
      <div className="flex justify-between items-start border-b border-gray-100 pb-5 mb-8 shrink-0">
        <div>
          <h3 className="font-bold text-[#0A1128] text-xl mb-1.5">Pending Appointment Requests</h3>
          <p className="text-sm text-gray-500">Manage incoming requests from parents and students</p>
        </div>
        <span className="bg-[#fefce8] text-[#854d0e] px-4 py-1.5 rounded-lg text-xs font-bold border border-[#fde047]">
          {events.filter(e => e.type === 'Pending').length} Pending
        </span>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
        {events.filter(e => e.type === 'Pending').length > 0 ? (
          events.filter(e => e.type === 'Pending').map(req => (
            <div key={req.id} className="border border-gray-100 rounded-2xl p-6 bg-[#f8fafc] flex justify-between items-center hover:border-blue-200 transition-colors">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-xl mr-5">👤</div>
                <div>
                  <p className="font-bold text-[#0A1128] text-base">{req.title}</p>
                  <p className="text-xs text-gray-500 font-bold uppercase">{req.sub}</p>
                  <div className="mt-2 text-[11px] text-gray-400 flex gap-4">
                    <span>📅 {req.realDate}</span>
                    <span>🕒 {req.realTime}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => updateStatus(req.id, 'Upcoming')} className="bg-[#22c55e] hover:bg-green-600 text-white px-6 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer">Approve</button>
                <button onClick={() => updateStatus(req.id, 'Missed')} className="bg-white text-red-500 border border-red-500 px-6 py-2 rounded-xl text-xs font-bold hover:bg-red-50 cursor-pointer">Reject</button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400 italic font-bold">No pending requests at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );

  // =======================================
  // 5. عرض الهيستوري (History) - 💡 جديد
  // =======================================
  const renderHistory = () => {
    const pastEvents = events.filter(e => !e.isClass && (e.type === 'Completed' || e.type === 'Missed' || new Date(`${e.realDate}T${e.realTime}`) < new Date()))
                             .sort((a, b) => new Date(`${b.realDate}T${b.realTime}`) - new Date(`${a.realDate}T${a.realTime}`));

    return (
      <div className="flex-1 bg-white border border-gray-200 rounded-2xl p-8 shadow-sm flex flex-col min-w-0">
        <div className="flex justify-between items-start border-b border-gray-100 pb-5 mb-8 shrink-0">
          <div>
            <h3 className="font-bold text-[#0A1128] text-xl mb-1.5">Appointment History</h3>
            <p className="text-sm text-gray-500">Log of all completed, missed, and past appointments</p>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
          {pastEvents.length > 0 ? (
            pastEvents.map(ev => (
              <div key={ev.id} className="border border-gray-100 rounded-2xl p-6 bg-white flex justify-between items-center">
                <div className="flex items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl mr-5 ${ev.type === 'Completed' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {ev.type === 'Completed' ? '✓' : '✕'}
                  </div>
                  <div>
                    <p className="font-bold text-[#0A1128] text-base">{ev.title}</p>
                    <p className="text-xs text-gray-500 font-bold uppercase">{ev.sub} • {ev.teacher}</p>
                    <div className="mt-2 text-[11px] text-gray-400 flex gap-4">
                      <span>📅 {ev.realDate}</span>
                      <span>🕒 {ev.realTime}</span>
                      <span>📍 {ev.room}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${ev.type === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {ev.type}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 text-gray-400 font-bold">No history found.</div>
          )}
        </div>
      </div>
    );
  };

  // =======================================
  // 6. السايدبار (Upcoming list)
  // =======================================
  const renderSidebar = () => {
    // تصفية وعرض المواعيد القادمة الحقيقية مرتبة زمنيا
    const upcomingList = events.filter(e => !e.isClass && e.type === 'Upcoming' && new Date(`${e.realDate}T${e.realTime}`) >= new Date())
                               .sort((a, b) => new Date(`${a.realDate}T${a.realTime}`) - new Date(`${b.realDate}T${b.realTime}`))
                               .slice(0, 6);

    return (
      <div className="w-[340px] shrink-0 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col h-full">
        <div className="mb-6 border-b border-gray-100 pb-5 shrink-0">
          <h3 className="font-bold text-[#0A1128] text-lg flex items-center mb-1.5">
            <span className="mr-2 text-blue-600">📅</span> Upcoming Appointments
          </h3>
          <p className="text-xs text-gray-500">Next scheduled meetings</p>
        </div>
        <div className="space-y-4 overflow-y-auto custom-scrollbar pr-2 flex-1">
          {upcomingList.length > 0 ? upcomingList.map(e => (
            <div key={e.id} className="bg-[#f8fafc] border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all">
              <p className="font-bold text-[#0A1128] text-sm flex items-center mb-1.5">
                <span className={`w-2 h-2 rounded-full mr-2.5 ${getDotColor(e.type)}`}></span> {e.sub}
              </p>
              <p className="text-xs text-gray-600 ml-4 mb-2">{e.title}</p>
              <p className="text-[10px] text-blue-600 font-bold ml-4">🕒 {e.realDate} at {e.realTime}</p>
            </div>
          )) : (
            <p className="text-center text-xs text-gray-400 pt-10">No upcoming appointments.</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="animate-fade-in w-full h-full flex flex-col p-2">
      {/* Header Tabs & Filters */}
      <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4 shrink-0 px-4">
        <div className="flex items-center space-x-8">
          <div className="flex bg-gray-100 p-1 rounded-xl">
            <button onClick={() => setActiveTab('calendar')} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${activeTab === 'calendar' ? 'bg-white text-[#0A1128] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Calendar View</button>
            <button onClick={() => setActiveTab('pending')} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${activeTab === 'pending' ? 'bg-white text-[#0A1128] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Pending Requests</button>
            {/* 💡 تبويبة الهيستوري */}
            <button onClick={() => setActiveTab('history')} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${activeTab === 'history' ? 'bg-white text-[#0A1128] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>History</button>
          </div>
          {activeTab === 'calendar' && (
            <div className="flex space-x-6 pl-6 text-[11px] font-black uppercase tracking-widest items-center border-l border-gray-200">
              {['All', 'Upcoming', 'Completed', 'Missed'].map(f => (
                <button key={f} onClick={() => setFilter(f)} className={`transition-colors cursor-pointer ${filter === f ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400 hover:text-gray-600'}`}>{f}</button>
              ))}
            </div>
          )}
        </div>
        <button onClick={() => setSideModalView('new')} className="bg-[#2563eb] hover:bg-blue-700 text-white px-8 py-3 rounded-2xl text-sm font-bold shadow-lg transition-transform active:scale-95 flex items-center cursor-pointer">
          <span className="mr-2 text-xl">+</span> New Appointment
        </button>
      </div>

      <div className="flex gap-8 flex-1 min-h-0 px-4">
        {activeTab === 'calendar' && renderCalendarView()}
        {activeTab === 'pending' && renderPendingRequests()}
        {activeTab === 'history' && renderHistory()}
        {renderSidebar()}
      </div>

      {/* =======================================
          Slide-over Modal (Details / New)
      ======================================= */}
      {sideModalView && (
        <div className="fixed inset-0 z-[100] flex justify-end bg-black/30 backdrop-blur-sm animate-fade-in">
          <div className="absolute inset-0 cursor-pointer" onClick={() => setSideModalView(null)}></div>
          <div className="w-[420px] bg-[#f8fafc] h-full shadow-2xl flex flex-col border-l border-gray-200 relative z-10 animate-slide-in">
            <div className="p-8 border-b border-gray-200 flex justify-between items-center bg-white">
              <div>
                <h3 className="font-black text-[#0A1128] text-xl uppercase tracking-tight">{sideModalView === 'details' ? 'Appointment Details' : 'New Appointment'}</h3>
                <p className="text-xs text-gray-400 mt-1 font-bold tracking-widest uppercase">Admin Panel • SmanSys</p>
              </div>
              <button onClick={() => setSideModalView(null)} className="text-gray-400 hover:text-black text-3xl font-light cursor-pointer">✕</button>
            </div>

            <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
              {sideModalView === 'details' && selectedEvent && (
                <div className="space-y-8 animate-fade-in">
                  <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 relative overflow-hidden">
                    <div className={`absolute top-0 left-0 w-full h-1.5 ${getDotColor(selectedEvent.type)}`}></div>
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-3">{selectedEvent.sub}</p>
                    <h4 className="text-2xl font-black text-[#0A1128] mb-6 tracking-tight">{selectedEvent.title}</h4>
                    
                    <div className="space-y-4 text-sm font-bold text-gray-600">
                      <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl"><span className="text-lg">🕒</span> {selectedEvent.realDate} at {selectedEvent.realTime}</div>
                      <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl"><span className="text-lg">👨‍🏫</span> {selectedEvent.teacher}</div>
                      <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl"><span className="text-lg">📍</span> {selectedEvent.room || 'Room TBD'}</div>
                      <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl"><span className="text-lg">📞</span> {selectedEvent.phone || 'No contact provided'}</div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-6 border-t border-gray-100">
                    {selectedEvent.isClass ? (
                       <p className="text-xs font-bold text-gray-400 italic text-center">💡 This is a regular class. Edit in Groups Management.</p>
                    ) : (
                      <>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Quick Actions</p>
                        {selectedEvent.type === 'Upcoming' && (
                          <button onClick={() => updateStatus(selectedEvent.id, 'Completed')} className="w-full bg-[#f0fdf4] text-[#16a34a] py-4 rounded-2xl font-black text-xs uppercase tracking-widest border border-green-200 hover:bg-green-100 transition-all shadow-sm cursor-pointer">✓ Mark Completed</button>
                        )}
                        <button onClick={() => updateStatus(selectedEvent.id, 'Missed')} className="w-full bg-[#fef2f2] text-[#dc2626] py-4 rounded-2xl font-black text-xs uppercase tracking-widest border border-red-200 hover:bg-red-100 transition-all cursor-pointer">🗑 Cancel Appointment</button>
                      </>
                    )}
                  </div>
                </div>
              )}

              {sideModalView === 'new' && (
                <form onSubmit={handleSave} className="space-y-6 animate-fade-in">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Student/Parent Name</label>
                    <input type="text" placeholder="Full Name" className="w-full bg-white border border-gray-200 p-4 rounded-2xl text-sm font-bold outline-none focus:border-blue-500 shadow-sm" value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} required/>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Appointment Type</label>
                    <select className="w-full bg-white border border-gray-200 p-4 rounded-2xl text-sm font-bold outline-none cursor-pointer" value={formData.sub} onChange={e=>setFormData({...formData, sub: e.target.value})}>
                      <option>Placement Test</option><option>Parent Meeting</option><option>Private Lesson</option>
                    </select>
                  </div>
                  
                  {/* 💡 حقول الوقت والتاريخ الجديدة الحقيقية */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Date</label>
                      <input type="date" className="w-full border border-gray-200 p-4 rounded-2xl text-sm font-bold" value={formData.date} onChange={e=>setFormData({...formData, date: e.target.value})} required/>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Time</label>
                      <input type="time" className="w-full border border-gray-200 p-4 rounded-2xl text-sm font-bold" value={formData.time} onChange={e=>setFormData({...formData, time: e.target.value})} required/>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Assigned Teacher</label>
                      <select 
                       className="w-full bg-white border border-gray-200 p-4 rounded-2xl text-sm font-bold outline-none cursor-pointer" 
                       value={formData.teacher} 
                       onChange={e => setFormData({...formData, teacher: e.target.value})} 
                       required
                      >
                       <option value="">-- Select Teacher --</option>
                       {teachersList.map((t) => (
                       <option key={t.id} value={`Prof. ${t.first_name} ${t.last_name}`}>
                         Prof. {t.first_name} {t.last_name}
                       </option>
                      ))}
                      </select>
                    </div>
                    <div>
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Room / Lab</label>
                      <select 
                       className="w-full bg-white border border-gray-200 p-4 rounded-2xl text-sm font-bold outline-none cursor-pointer" 
                       value={formData.room} 
                       onChange={e => setFormData({...formData, room: e.target.value})} 
                       required
                      >
                       <option value="">-- Select Room --</option>
                      {roomsList.map((r) => (
                       <option key={r.id} value={r.name}>
                        {r.name}
                       </option>
                       ))}
                      </select>
                    </div>
                  </div>

                  <textarea placeholder="Notes (Optional)..." className="w-full border border-gray-200 p-4 rounded-2xl text-sm font-bold h-32 resize-none" value={formData.notes} onChange={e=>setFormData({...formData, notes: e.target.value})}></textarea>
                  
                  <button type="submit" disabled={loading} className="w-full bg-[#0A1128] hover:bg-blue-900 text-white py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95 mt-8 cursor-pointer">
                    {loading ? 'Processing...' : 'Confirm Appointment'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
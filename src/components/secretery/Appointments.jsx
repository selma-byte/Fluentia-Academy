import React, { useState } from 'react';

const Appointments = () => {
  const [activeTab, setActiveTab] = useState('calendar');
  const [sideModalView, setSideModalView] = useState(null); // null, 'details', 'new'
  const [filter, setFilter] = useState('All');

  // =======================================
  // بيانات التقويم الديناميكية (Dynamic Calendar Data)
  // day: 1=Monday ... 7=Sunday
  // start: 8 = 8:00 AM, 10.5 = 10:30 AM
  // duration: بالدقائق
  // =======================================
  const events = [
    { id: 1, title: 'Layla M.', sub: 'Advanced English Class', day: 1, start: 10.5, duration: 90, type: 'Upcoming' },
    { id: 2, title: 'Hassan R.', sub: 'Private Spanish Lesson', day: 2, start: 9, duration: 60, type: 'Completed' },
    { id: 3, title: 'Nadia L.', sub: 'Placement Test: Student', day: 2, start: 11, duration: 60, type: 'Upcoming' },
    { id: 4, title: 'Karim S.', sub: 'TOEFL Preparation', day: 3, start: 11, duration: 90, type: 'Upcoming' },
    { id: 5, title: 'Amina B.', sub: 'Placement Test: Student', day: 4, start: 9, duration: 60, type: 'Upcoming' },
    { id: 6, title: "Sara's Mom", sub: 'Parent Meeting: with Director', day: 4, start: 10, duration: 30, type: 'Upcoming' },
    { id: 7, title: "Yassine's Dad", sub: 'Parent Meeting: with Prof. Ali', day: 4, start: 10.5, duration: 30, type: 'Upcoming' },
    { id: 8, title: 'Youssef M.', sub: 'Private English Lesson', day: 4, start: 11, duration: 60, type: 'Completed' },
    { id: 9, title: 'Rachid B.', sub: 'Placement Test: Student', day: 5, start: 9.5, duration: 60, type: 'Upcoming' },
    { id: 10, title: "Lina's Mom", sub: 'Parent Meeting: with Prof. Nadia', day: 5, start: 11, duration: 30, type: 'Pending' },
    { id: 11, title: 'Imane T.', sub: 'Private German Lesson', day: 6, start: 10, duration: 60, type: 'Upcoming' },
    { id: 12, title: 'Children English', sub: 'Kids English Club', day: 6, start: 11.5, duration: 90, type: 'Upcoming' },
    { id: 13, title: "Adam's Dad", sub: 'Parent Meeting: with Dir. Karim', day: 6, start: 14, duration: 30, type: 'Pending' },
    { id: 14, title: 'Orientation Session', sub: 'New Students Orientation', day: 7, start: 10, duration: 90, type: 'Upcoming' },
    { id: 15, title: 'Zineb H.', sub: 'Conversation Club', day: 7, start: 13, duration: 60, type: 'Upcoming' },
  ];

  // إعدادات بناء الشبكة
  const START_HOUR = 8; // 8:00 AM
  const END_HOUR = 17;  // 5:00 PM
  const HOUR_HEIGHT = 80; // ارتفاع كل ساعة بالبيكسل
  const TOTAL_HEIGHT = (END_HOUR - START_HOUR + 1) * HOUR_HEIGHT;
  const hoursArray = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => START_HOUR + i);

  const getEventStyles = (type) => {
    switch(type) {
      case 'Upcoming': return 'bg-[#eff6ff] border-[#3b82f6] text-[#1e40af]';
      case 'Completed': return 'bg-[#f0fdf4] border-[#22c55e] text-[#166534]';
      case 'Pending': case 'Missed': return 'bg-[#fefce8] border-[#eab308] text-[#854d0e]';
      default: return 'bg-gray-100 border-gray-400 text-gray-700';
    }
  };

  const getDotColor = (type) => {
    switch(type) {
      case 'Upcoming': return 'bg-blue-500';
      case 'Completed': return 'bg-green-500';
      case 'Pending': case 'Missed': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  // =======================================
  // 1. عرض التقويم (Calendar View)
  // =======================================
  const renderCalendarView = () => (
    <div className="flex-1 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col min-w-0">
      {/* هيدر التقويم */}
      <div className="flex justify-between items-center mb-6 shrink-0">
         <h3 className="font-bold text-[#0A1128] text-lg">Weekly Calendar <span className="text-sm font-normal text-gray-500 ml-3">Jan 27 - Feb 2, 2025</span></h3>
         <div className="flex items-center space-x-2">
            <button className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-gray-200 cursor-pointer transition-colors">{"<"}</button>
            <button className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-gray-200 cursor-pointer transition-colors">{">"}</button>
         </div>
      </div>
      
      {/* مساحة التقويم القابلة للتمرير */}
      <div className="flex-1 overflow-y-auto overflow-x-auto custom-scrollbar">
        <div className="min-w-[900px] pb-4">
          
          {/* أيام الأسبوع */}
          <div className="grid grid-cols-[70px_repeat(7,1fr)] gap-2 mb-2 text-center border-b border-gray-200 pb-4 sticky top-0 bg-white z-20">
            <div></div>
            <div><p className="text-[#0A1128] font-bold text-sm mb-1">Monday</p><p className="text-xs text-gray-500">Jan 27</p></div>
            <div><p className="text-[#0A1128] font-bold text-sm mb-1">Tuesday</p><p className="text-xs text-gray-500">Jan 28</p></div>
            <div><p className="text-[#0A1128] font-bold text-sm mb-1">Wednesday</p><p className="text-xs text-gray-500">Jan 29</p></div>
            <div><p className="text-[#0A1128] font-bold text-sm mb-1">Thursday</p><p className="text-xs text-gray-500">Jan 30</p></div>
            <div><p className="text-[#0A1128] font-bold text-sm mb-1">Friday</p><p className="text-xs text-gray-500">Jan 31</p></div>
            <div><p className="text-[#0A1128] font-bold text-sm mb-1">Saturday</p><p className="text-xs text-gray-500">Feb 1</p></div>
            <div><p className="text-[#0A1128] font-bold text-sm mb-1">Sunday</p><p className="text-xs text-gray-500">Feb 2</p></div>
          </div>

          {/* شبكة الوقت والمواعيد */}
          <div className="grid grid-cols-[70px_1fr] gap-2">
            
            {/* عمود الأوقات */}
            <div className="flex flex-col border-r border-gray-100 pr-3 pt-2">
              {hoursArray.map(hour => (
                <div key={hour} style={{height: `${HOUR_HEIGHT}px`}} className="text-xs font-medium text-gray-400 text-right">
                  {hour > 12 ? hour - 12 : hour}:00 {hour >= 12 ? 'PM' : 'AM'}
                </div>
              ))}
            </div>

            {/* مساحة البطاقات */}
            <div className="relative w-full border-t border-l border-gray-100" style={{height: `${TOTAL_HEIGHT}px`}}>
              {/* الخطوط العمودية */}
              <div className="absolute inset-0 grid grid-cols-7 divide-x divide-gray-100 pointer-events-none">
                <div/><div/><div/><div/><div/><div/><div/>
              </div>
              {/* الخطوط الأفقية */}
              <div className="absolute inset-0 flex flex-col divide-y divide-gray-100 pointer-events-none">
                {hoursArray.map(h => <div key={h} style={{height: `${HOUR_HEIGHT}px`}}></div>)}
              </div>

              {/* رسم البطاقات ديناميكياً */}
              {events.filter(e => filter === 'All' || e.type === filter).map((ev) => {
                const top = (ev.start - START_HOUR) * HOUR_HEIGHT;
                const height = (ev.duration / 60) * HOUR_HEIGHT;
                const left = (ev.day - 1) * (100 / 7);
                const width = (100 / 7) - 1; // 1% gap

                return (
                  <div 
                    key={ev.id}
                    onClick={() => setSideModalView('details')}
                    style={{ top: `${top}px`, height: `${height}px`, left: `${left}%`, width: `${width}%` }}
                    className={`absolute p-2 rounded-lg shadow-sm border-l-4 cursor-pointer hover:shadow-md hover:opacity-90 transition-all overflow-hidden ${getEventStyles(ev.type)}`}
                  >
                    <p className="text-[11px] font-bold flex items-center mb-1 leading-tight">
                      <span className={`min-w-[6px] w-[6px] h-[6px] rounded-full mr-1.5 ${getDotColor(ev.type)}`}></span> 
                      <span className="truncate">{ev.title}</span>
                    </p>
                    <p className="text-[10px] leading-tight opacity-80 line-clamp-2">{ev.sub}</p>
                    {ev.duration >= 60 && (
                      <p className="text-[10px] mt-1.5 flex items-center font-medium opacity-70">
                        <span className="mr-1">⏱</span> {ev.duration} min
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // =======================================
  // 2. عرض الطلبات المعلقة (Pending Requests)
  // =======================================
  const renderPendingRequests = () => (
    <div className="flex-1 bg-white border border-gray-200 rounded-2xl p-8 shadow-sm flex flex-col min-w-0">
      
      <div className="flex justify-between items-start border-b border-gray-100 pb-5 mb-6 shrink-0">
        <div>
          <h3 className="font-bold text-[#0A1128] text-xl mb-1.5">Pending Appointment Requests</h3>
          <p className="text-sm text-gray-500">Review and manage appointment requests that require approval</p>
        </div>
        <span className="bg-[#fefce8] text-[#854d0e] px-4 py-1.5 rounded-lg text-xs font-bold border border-[#fde047]">5 Total Pending</span>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-4">
        <div className="space-y-6">
          {/* طلب 1 */}
          <div className="border border-gray-100 rounded-xl p-5 hover:border-blue-100 transition-colors bg-[#f8fafc]">
            <div className="flex justify-between items-start">
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-full bg-[#fefce8] flex items-center justify-center text-[#eab308] mr-5 text-xl">👤</div>
                <div>
                  <p className="font-bold text-[#0A1128] text-base mb-1">Omar K.'s Dad</p>
                  <p className="text-xs text-gray-500 mb-4 font-medium">Parent Meeting: with Prof. Nadia</p>
                  
                  <div className="grid grid-cols-2 gap-y-3 gap-x-8 text-xs text-gray-600 mb-4 bg-white p-3 rounded-lg border border-gray-100">
                    <span className="flex items-center"><span className="mr-2 text-gray-400">📅</span> Monday, January 27, 2025</span>
                    <span className="flex items-center"><span className="mr-2 text-gray-400">🕒</span> 2:00 PM (30 min)</span>
                    <span className="flex items-center"><span className="mr-2 text-gray-400">📞</span> +212 663-456-789</span>
                    <span className="flex items-center"><span className="mr-2 text-gray-400">👨‍🏫</span> Prof. Nadia</span>
                  </div>
                  
                  <button onClick={() => setSideModalView('details')} className="text-blue-600 text-xs font-bold hover:underline">View Details →</button>
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <button className="bg-[#22c55e] hover:bg-green-600 text-white px-5 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer w-28 text-center shadow-sm">
                   Approve
                </button>
                <button className="bg-white text-[#ef4444] border border-[#ef4444] hover:bg-red-50 px-5 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer w-28 text-center">
                   Reject
                </button>
              </div>
            </div>
          </div>

          {/* طلب 2 */}
          <div className="border border-gray-100 rounded-xl p-5 hover:border-blue-100 transition-colors bg-[#f8fafc]">
            <div className="flex justify-between items-start">
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-full bg-[#fefce8] flex items-center justify-center text-[#eab308] mr-5 text-xl">👤</div>
                <div>
                  <p className="font-bold text-[#0A1128] text-base mb-1">Fatima Z.</p>
                  <p className="text-xs text-gray-500 mb-4 font-medium">Progress Evaluation</p>
                  
                  <div className="grid grid-cols-2 gap-y-3 gap-x-8 text-xs text-gray-600 mb-4 bg-white p-3 rounded-lg border border-gray-100">
                    <span className="flex items-center"><span className="mr-2 text-gray-400">📅</span> Wednesday, January 29, 2025</span>
                    <span className="flex items-center"><span className="mr-2 text-gray-400">🕒</span> 2:00 PM (60 min)</span>
                    <span className="flex items-center"><span className="mr-2 text-gray-400">📞</span> +212 669-012-345</span>
                    <span className="flex items-center"><span className="mr-2 text-gray-400">👨‍🏫</span> Prof. Hassan</span>
                  </div>
                  
                  <button onClick={() => setSideModalView('details')} className="text-blue-600 text-xs font-bold hover:underline">View Details →</button>
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <button className="bg-[#22c55e] hover:bg-green-600 text-white px-5 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer w-28 text-center shadow-sm">
                   Approve
                </button>
                <button className="bg-white text-[#ef4444] border border-[#ef4444] hover:bg-red-50 px-5 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer w-28 text-center">
                   Reject
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );

  // =======================================
  // الشريط الجانبي الثابت (Today's Schedule)
  // =======================================
  const renderSidebar = () => (
    <div className="w-[340px] shrink-0 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col h-full">
      <div className="mb-6 border-b border-gray-100 pb-5 shrink-0">
        <h3 className="font-bold text-[#0A1128] text-lg flex items-center mb-1.5">
          <span className="mr-2 text-blue-600">📅</span> Today's Schedule
        </h3>
        <p className="text-xs text-gray-500">Thursday, April 2, 2026</p>
      </div>

      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 shrink-0">Upcoming Sessions</p>

      <div className="space-y-4 overflow-y-auto custom-scrollbar pr-2 flex-1">
        
        <div className="bg-[#f8fafc] border border-gray-200 rounded-xl p-4 shadow-sm hover:border-blue-200 transition-colors">
          <p className="font-bold text-[#0A1128] text-sm flex items-center mb-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-600 mr-2.5"></span> Placement Test
          </p>
          <p className="text-xs text-gray-600 ml-4 mb-2">Amina B.</p>
          <p className="text-xs text-gray-400 ml-4 flex items-center mb-4">
            <span className="mr-1.5 text-sm">🕒</span> 9:00 AM - 60 min
          </p>
          <div className="flex space-x-2 ml-4">
            <button className="flex-1 bg-white border border-gray-200 text-gray-600 text-[10px] font-bold py-2 rounded-lg hover:bg-gray-50 transition-colors">✎ Modify</button>
            <button className="flex-1 bg-white border border-gray-200 text-gray-600 text-[10px] font-bold py-2 rounded-lg hover:bg-gray-50 transition-colors">✕ Cancel</button>
          </div>
        </div>

        <div className="bg-[#f8fafc] border border-gray-200 rounded-xl p-4 shadow-sm hover:border-blue-200 transition-colors">
          <p className="font-bold text-[#0A1128] text-sm flex items-center mb-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-600 mr-2.5"></span> Parent Meeting
          </p>
          <p className="text-xs text-gray-600 ml-4 mb-2">Sara's Mom</p>
          <p className="text-xs text-gray-400 ml-4 flex items-center mb-4">
            <span className="mr-1.5 text-sm">🕒</span> 10:00 AM - 30 min
          </p>
          <div className="flex space-x-2 ml-4">
            <button className="flex-1 bg-white border border-gray-200 text-gray-600 text-[10px] font-bold py-2 rounded-lg hover:bg-gray-50 transition-colors">✎ Modify</button>
            <button className="flex-1 bg-white border border-gray-200 text-gray-600 text-[10px] font-bold py-2 rounded-lg hover:bg-gray-50 transition-colors">✕ Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );

  // =======================================
  // الواجهة الرئيسية للصفحة
  // =======================================
  return (
    <div className="animate-fade-in w-full h-full flex flex-col">
      
      {/* شريط التنقل العلوي مع الفلاتر */}
      <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4 shrink-0">
        <div className="flex items-center space-x-8">
          <div className="flex items-center text-sm text-gray-600 border-r border-gray-300 pr-8">
             <span className="mr-2">Staff:</span>
             <select className="bg-transparent font-bold outline-none cursor-pointer"><option>All Staff</option></select>
          </div>
          
          <div className="flex space-x-2">
            <button onClick={() => setActiveTab('calendar')} className={`text-sm font-bold transition-all px-4 py-2 rounded-lg ${activeTab === 'calendar' ? 'bg-gray-100 text-[#0A1128]' : 'bg-transparent text-gray-500 hover:bg-gray-50'}`}>
              Calendar View
            </button>
            <button onClick={() => setActiveTab('pending')} className={`text-sm font-bold transition-all px-4 py-2 rounded-lg ${activeTab === 'pending' ? 'bg-gray-100 text-[#0A1128]' : 'bg-transparent text-gray-500 hover:bg-gray-50'}`}>
              Pending Requests
            </button>
          </div>
          
          {/* أزرار الفلترة التفاعلية (تعمل فقط في Calendar View) */}
          {activeTab === 'calendar' && (
            <div className="flex space-x-6 pl-6 text-sm font-bold items-center border-l border-gray-300">
              <button onClick={() => setFilter('All')} className={`transition-colors cursor-pointer ${filter === 'All' ? 'text-[#0A1128] underline underline-offset-8' : 'text-gray-400 hover:text-black'}`}>All</button>
              <button onClick={() => setFilter('Upcoming')} className={`transition-colors cursor-pointer ${filter === 'Upcoming' ? 'text-blue-600 underline underline-offset-8' : 'text-gray-400 hover:text-black'}`}>Upcoming</button>
              <button onClick={() => setFilter('Pending')} className={`transition-colors cursor-pointer ${filter === 'Pending' ? 'text-yellow-600 underline underline-offset-8' : 'text-gray-400 hover:text-black'}`}>Pending</button>
              <button onClick={() => setFilter('Completed')} className={`transition-colors cursor-pointer ${filter === 'Completed' ? 'text-green-600 underline underline-offset-8' : 'text-gray-400 hover:text-black'}`}>Completed</button>
              <button onClick={() => setFilter('Missed')} className={`transition-colors cursor-pointer ${filter === 'Missed' ? 'text-red-500 underline underline-offset-8' : 'text-gray-400 hover:text-black'}`}>Missed</button>
            </div>
          )}
        </div>

        <button onClick={() => setSideModalView('new')} className="bg-[#2563eb] hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-md transition-colors flex items-center cursor-pointer">
          <span className="mr-2 text-lg">+</span> New Appointment
        </button>
      </div>

      {/* المحتوى السفلي (ينقسم إلى قسمين: محتوى و سايدبار) */}
      <div className="flex gap-8 flex-1 min-h-0">
        {activeTab === 'calendar' ? renderCalendarView() : renderPendingRequests()}
        {renderSidebar()}
      </div>

      {/* =======================================
          النافذة الجانبية المنزلقة (تفاصيل / جديد)
          ======================================= */}
      {sideModalView && (
        <div className="fixed inset-0 z-[100] flex justify-end bg-black/20 backdrop-blur-sm">
          <div className="absolute inset-0 cursor-pointer" onClick={() => setSideModalView(null)}></div>
          
          <div className="w-[400px] bg-[#f8fafc] h-full shadow-2xl flex flex-col border-l border-gray-200 relative z-10 animate-[slide-in-right_0.3s_ease-out]">
            
            <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-white">
              <div>
                <h3 className="font-bold text-[#0A1128] text-lg mb-1">
                  {sideModalView === 'details' ? 'Appointment Details' : 'New Appointment'}
                </h3>
                <p className="text-xs text-gray-500">
                  {sideModalView === 'details' ? 'Patient Information & Treatment' : 'Schedule a new session'}
                </p>
              </div>
              <button onClick={() => setSideModalView(null)} className="text-gray-400 hover:text-black text-2xl cursor-pointer">✕</button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
              
              {sideModalView === 'details' && (
                <div className="space-y-8">
                  <div>
                    <p className="text-sm font-bold text-[#0A1128] mb-4 flex items-center"><span className="w-2 h-2 bg-blue-600 rounded-full mr-2.5"></span> Patient Information</p>
                    <div className="flex items-center mb-5 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                      <div className="w-12 h-12 rounded-full bg-[#2563eb] text-white flex items-center justify-center font-bold text-xl mr-4 shadow-inner">R</div>
                      <div>
                        <p className="font-bold text-[#0A1128] text-base">Robert Wilson</p>
                        <p className="text-xs text-gray-500 mt-0.5">Patient</p>
                      </div>
                    </div>
                    <div className="space-y-3 pl-2">
                      <p className="text-sm text-gray-600 flex items-center"><span className="mr-3 text-[#2563eb] text-lg">📞</span> (555) 567-8901</p>
                      <p className="text-sm text-gray-600 flex items-center"><span className="mr-3 text-[#2563eb] text-lg">✉️</span> rob.wilson@email.com</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-bold text-[#0A1128] mb-4 flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-2.5"></span> Appointment Details</p>
                    <div className="space-y-4 text-sm bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                      <div className="flex justify-between border-b border-gray-50 pb-3"><span className="text-gray-500">Treatment:</span> <span className="font-bold text-[#0A1128]">Cavity Filling</span></div>
                      <div className="flex justify-between border-b border-gray-50 pb-3"><span className="text-gray-500">Date:</span> <span className="font-bold text-[#0A1128]">Fri, Jan 31, 2025</span></div>
                      <div className="flex justify-between border-b border-gray-50 pb-3"><span className="text-gray-500">Time:</span> <span className="font-bold text-[#0A1128]">11:00 AM</span></div>
                      <div className="flex justify-between border-b border-gray-50 pb-3"><span className="text-gray-500">Duration:</span> <span className="font-bold text-[#0A1128]">75 minutes</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Staff:</span> <span className="font-bold text-[#0A1128]">Dr. Smith</span></div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-bold text-[#0A1128] mb-3 flex items-center"><span className="w-2 h-2 bg-yellow-500 rounded-full mr-2.5"></span> Status</p>
                    <span className="bg-[#eff6ff] text-[#1e40af] border border-blue-200 px-4 py-2 rounded-lg text-xs font-bold flex w-max items-center shadow-sm">
                      <span className="w-2 h-2 bg-[#2563eb] rounded-full mr-2"></span> Upcoming
                    </span>
                  </div>

                  <div>
                    <p className="text-sm font-bold text-[#0A1128] mb-3 flex items-center"><span className="w-2 h-2 bg-purple-500 rounded-full mr-2.5"></span> Notes</p>
                    <p className="text-sm text-gray-500 bg-white p-4 rounded-xl border border-gray-100 shadow-sm min-h-[80px]">No special notes added for this appointment.</p>
                  </div>

                  <div className="pt-6 mt-4 border-t border-gray-200">
                    <p className="text-sm font-bold text-[#0A1128] mb-4 flex items-center"><span className="w-2 h-2 bg-orange-500 rounded-full mr-2.5"></span> Actions</p>
                    <div className="space-y-3">
                      <button className="w-full bg-[#eff6ff] text-[#2563eb] hover:bg-blue-100 border border-blue-200 rounded-xl py-3 text-sm font-bold transition-colors cursor-pointer shadow-sm">💬 Send Message</button>
                      <button className="w-full bg-[#f0fdf4] text-[#16a34a] hover:bg-green-100 border border-green-200 rounded-xl py-3 text-sm font-bold transition-colors cursor-pointer shadow-sm">🔄 Reschedule Date</button>
                      <button className="w-full bg-[#fef2f2] text-[#dc2626] hover:bg-red-100 border border-red-200 rounded-xl py-3 text-sm font-bold transition-colors cursor-pointer shadow-sm">🗑 Cancel Appointment</button>
                    </div>
                  </div>
                </div>
              )}

              {sideModalView === 'new' && (
                <form className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Patient / Student Name</label>
                    <input type="text" placeholder="Full Name" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none text-sm focus:border-blue-500 shadow-sm" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Phone</label>
                      <input type="tel" placeholder="Phone Number" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none text-sm focus:border-blue-500 shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Email</label>
                      <input type="email" placeholder="Email Address" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none text-sm focus:border-blue-500 shadow-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Treatment / Course</label>
                    <select className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none text-sm cursor-pointer focus:border-blue-500 shadow-sm">
                      <option>Select Option</option>
                      <option>Placement Test</option>
                      <option>Parent Meeting</option>
                      <option>Private Lesson</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Date</label>
                      <input type="date" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none text-sm focus:border-blue-500 shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Time</label>
                      <input type="time" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none text-sm focus:border-blue-500 shadow-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Staff / Teacher</label>
                    <select className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none text-sm cursor-pointer focus:border-blue-500 shadow-sm">
                      <option>Select Staff</option>
                      <option>Prof. Nadia</option>
                      <option>Prof. Hassan</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Notes</label>
                    <textarea rows="4" placeholder="Add any notes here..." className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none text-sm resize-none focus:border-blue-500 shadow-sm"></textarea>
                  </div>
                  
                  <div className="pt-6">
                    <button type="button" onClick={() => setSideModalView(null)} className="w-full bg-[#2563eb] hover:bg-blue-700 text-white rounded-xl py-3.5 text-sm font-bold transition-colors shadow-md cursor-pointer">
                      Save Appointment
                    </button>
                  </div>
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
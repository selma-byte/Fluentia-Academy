import React, { useState, useEffect } from 'react';

const SchoolSchedule = () => {
  const [viewType, setViewType] = useState('week'); 
  const [filterLang, setFilterLang] = useState('All');
  const [filterLevel, setFilterLevel] = useState('All');
  const [filterGroup, setFilterGroup] = useState('All');
  const [focusDay, setFocusDay] = useState('Mon');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const [isDailyViewOpen, setIsDailyViewOpen] = useState(false);

  // ==========================================
  // 1. قراءة البيانات من ذاكرة المتصفح (Local Storage)
  // ==========================================
  const [scheduleData, setScheduleData] = useState(() => {
    const savedSchedule = localStorage.getItem('schoolScheduleData');
    if (savedSchedule) {
      return JSON.parse(savedSchedule);
    }
    return [
      { id: 1, language: 'German', level: 'A1', group: 'Grp1', day: 'Mon', date: 23, time: '10:00', type: 'CLASSE 1', teacher: 'J. Lee', room: 'IT Lab 4' },
      { id: 2, language: 'Spanish', level: 'B1', group: 'Grp2', day: 'Mon', date: 23, time: '12:00', type: 'LECTURE', teacher: 'Er. Rahul', room: 'R-304' },
      { id: 3, language: 'German', level: 'A1', group: 'Grp1', day: 'Mon', date: 23, time: '4:00', type: 'CLASSE 1', teacher: 'J. Lee', room: 'IT Lab 4' },
      { id: 4, language: 'English', level: 'B2', group: 'Grp2', day: 'Tue', date: 24, time: '10:00', type: 'STUDIO', teacher: 'Prof. Singh', room: 'Open' },
      { id: 5, language: 'English', level: 'B2', group: 'Grp2', day: 'Tue', date: 24, time: '4:00', type: 'STUDIO', teacher: 'Prof. Singh', room: 'Open' },
      { id: 6, language: 'Spanish', level: 'B2', group: 'Grp1', day: 'Wed', date: 25, time: '12:00', type: 'LECTURE', teacher: 'Er. Rahul', room: 'R-304' },
      { id: 7, language: 'Spanish', level: 'B1', group: 'Grp3', day: 'Thu', date: 26, time: '10:00', type: 'LECTURE', teacher: 'Ar. Collins', room: 'R-105' },
      { id: 8, language: 'French', level: 'C1', group: 'Grp1', day: 'Fri', date: 27, time: '12:00', type: 'SEMINAR', teacher: 'Dr. Gray', room: 'Hall B' },
    ];
  });

  // حفظ البيانات تلقائياً
  useEffect(() => {
    localStorage.setItem('schoolScheduleData', JSON.stringify(scheduleData));
  }, [scheduleData]);

  const [formData, setFormData] = useState({ language: 'Spanish', level: 'B1', group: 'Grp1', day: 'Mon', date: 23, time: '10:00', type: 'LECTURE', teacher: '', room: '' });

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const times = ['10:00', '12:00', '2:00', '4:00', '6:00', '8:00'];

  const getEventColors = (lang) => {
    switch (lang) {
      case 'Spanish': return 'border-[#2563eb] bg-[#eff6ff] text-[#1e40af]'; 
      case 'English': return 'border-[#f97316] bg-[#fff7ed] text-[#c2410c]'; 
      case 'German': return 'border-[#22c55e] bg-[#f0fdf4] text-[#166534]'; 
      case 'French': return 'border-[#a855f7] bg-[#faf5ff] text-[#6b21a8]'; 
      default: return 'border-gray-400 bg-gray-50 text-gray-700';
    }
  };

  const getDotColor = (lang) => {
    switch (lang) {
      case 'Spanish': return 'bg-[#2563eb]'; case 'English': return 'bg-[#f97316]';
      case 'German': return 'bg-[#22c55e]'; case 'French': return 'bg-[#a855f7]';
      default: return 'bg-gray-400';
    }
  };

  const filteredSchedule = scheduleData.filter(item => {
    return (filterLang === 'All' || item.language === filterLang) &&
           (filterLevel === 'All' || item.level === filterLevel) &&
           (filterGroup === 'All' || item.group === filterGroup);
  });

  const todaysEvents = scheduleData
    .filter(event => event.day === focusDay)
    .sort((a, b) => times.indexOf(a.time) - times.indexOf(b.time));

  const handleSave = (e) => {
    e.preventDefault();
    if (editingEventId) {
      setScheduleData(scheduleData.map(item => item.id === editingEventId ? { ...formData, id: editingEventId } : item));
    } else {
      setScheduleData([...scheduleData, { ...formData, id: Date.now() }]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    setScheduleData(scheduleData.filter(item => item.id !== id));
    setIsModalOpen(false);
  };

  const renderMonthlyView = () => {
    const monthDays = Array.from({ length: 35 }, (_, i) => i + 1); 
    return (
      <div className="grid grid-cols-7 h-full border-t border-l border-gray-100">
        {days.map(d => (
          <div key={d} className="bg-gray-50 py-2 border-r border-b border-gray-100 text-center font-bold text-[10px] text-gray-400 uppercase">
            {d}
          </div>
        ))}
        {monthDays.map(d => {
          const dayEvents = filteredSchedule.filter(e => e.date === d);
          return (
            <div key={d} className="border-r border-b border-gray-100 p-2 min-h-[100px] bg-white hover:bg-gray-50 transition-colors group cursor-pointer">
              <span className={`text-xs font-bold ${d > 31 ? 'text-gray-200' : 'text-gray-400'}`}>{d > 31 ? d - 31 : d}</span>
              <div className="mt-1 space-y-1">
                {dayEvents.slice(0, 4).map(e => (
                  <div key={e.id} className={`text-[9px] px-1.5 py-0.5 rounded border-l-2 truncate font-bold ${getEventColors(e.language)}`}>
                    {e.language.substring(0, 3)}: {e.level}
                  </div>
                ))}
                {dayEvents.length > 4 && <p className="text-[9px] text-blue-600 font-bold">+{dayEvents.length - 4} more</p>}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderWeeklyView = () => (
    <div className="grid grid-cols-[60px_repeat(6,1fr)]">
      <div className="border-b border-gray-100 pb-2"></div>
      {days.filter(d => d !== 'Sat').map((day, idx) => (
        <div key={day} className="text-center pb-4 pt-2 border-b border-gray-100">
          <p className="text-[10px] font-bold text-gray-400 uppercase">{day}</p>
          <p className="text-sm font-bold text-[#0A1128]">Oct {23 + idx}</p>
        </div>
      ))}
      {times.map(time => (
        <React.Fragment key={time}>
          <div className="text-right pr-4 py-2 border-r border-gray-50 relative">
             <span className="text-xs font-bold text-gray-500 relative top-[-10px]">{time}</span>
          </div>
          {days.filter(d => d !== 'Sat').map(day => {
            const cellEvents = filteredSchedule.filter(e => e.day === day && e.time === time);
            return (
              <div key={`${day}-${time}`} className="border-b border-r border-gray-50 border-dashed p-1 min-h-[110px] flex flex-col gap-1.5 overflow-y-auto custom-scrollbar hover:bg-gray-50/50 transition-colors">
                 {cellEvents.map(event => (
                    <div key={event.id} onClick={() => { setEditingEventId(event.id); setFormData(event); setIsModalOpen(true); }} className={`cursor-pointer group relative border-l-4 rounded-r-lg p-2 ${getEventColors(event.language)} hover:shadow-md transition-all shrink-0`}>
                       <p className="text-[9px] font-bold uppercase tracking-wider opacity-80 mb-0.5">{event.type}</p>
                       <p className="text-xs font-bold leading-tight mb-1">{event.language} {event.level}</p>
                       <p className="text-[9px] opacity-75">{event.room} • {event.teacher}</p>
                    </div>
                 ))}
              </div>
            )
          })}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="animate-fade-in w-full h-full flex flex-col text-[#0A1128] pt-8">
      
      {/* Header & Controls */}
      <div className="flex justify-between items-end mb-8 shrink-0">
        <div>
          <h2 className="text-3xl font-bold text-[#0A1128] mb-1">Timetable & Schedule</h2>
          <div className="flex items-center space-x-3 mt-4">
             <div className="bg-gray-100 p-1 rounded-xl flex">
                <button onClick={() => setViewType('week')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${viewType === 'week' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Week</button>
                <button onClick={() => setViewType('month')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${viewType === 'month' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Month</button>
             </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <select value={filterLang} onChange={(e) => setFilterLang(e.target.value)} className="bg-white border border-gray-200 text-xs rounded-lg px-3 py-2 outline-none font-bold cursor-pointer">
              <option value="All">All Languages</option><option value="Spanish">Spanish</option><option value="English">English</option><option value="German">German</option><option value="French">French</option>
            </select>
            <select value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)} className="bg-white border border-gray-200 text-xs rounded-lg px-3 py-2 outline-none font-bold cursor-pointer">
              <option value="All">All Levels</option><option value="A1">A1</option><option value="A2">A2</option><option value="B1">B1</option><option value="B2">B2</option><option value="C1">C1</option>
            </select>
            <select value={filterGroup} onChange={(e) => setFilterGroup(e.target.value)} className="bg-white border border-gray-200 text-xs rounded-lg px-3 py-2 outline-none font-bold cursor-pointer">
              <option value="All">All Groups</option><option value="Grp1">Grp 1</option><option value="Grp2">Grp 2</option><option value="Grp3">Grp 3</option>
            </select>
          </div>
          <button onClick={() => { setEditingEventId(null); setIsModalOpen(true); }} className="bg-[#2563eb] hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-colors cursor-pointer">
            + Add New Class
          </button>
        </div>
      </div>

      <div className="flex flex-1 gap-6 min-h-0">
        {/* Sidebar */}
        <div className="w-[280px] flex flex-col shrink-0">
          <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm mb-6 flex flex-col max-h-[60%]">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-[#0A1128] text-lg">Today's Focus</h3>
                <select value={focusDay} onChange={(e) => setFocusDay(e.target.value)} className="text-[10px] font-bold text-blue-600 bg-blue-50 border-none rounded px-2 py-1 outline-none cursor-pointer">
                   {days.map(d => <option key={d} value={d}>{d.toUpperCase()}</option>)}
                </select>
             </div>
             <div className="space-y-6 relative overflow-y-auto custom-scrollbar flex-1 pr-2 before:absolute before:inset-y-2 before:left-1.5 before:w-0.5 before:bg-gray-200">
                {todaysEvents.length > 0 ? todaysEvents.map((event, idx) => (
                   <div key={idx} className="relative pl-6">
                      <div className={`absolute left-0 top-1.5 w-3 h-3 ${getDotColor(event.language)} rounded-full border-2 border-white shadow-sm z-10`}></div>
                      <p className="text-[10px] text-gray-400 font-bold mb-0.5">{event.time}</p>
                      <p className="font-bold text-sm text-[#0A1128]">{event.language} {event.level}</p>
                      <p className="text-xs text-gray-500">{event.teacher}</p>
                   </div>
                )) : <p className="text-xs text-gray-400 italic pl-6">No classes.</p>}
             </div>
             <button onClick={() => setIsDailyViewOpen(true)} className="w-full mt-4 pt-4 border-t border-gray-100 text-sm font-bold text-blue-600 hover:underline cursor-pointer">View Full Daily</button>
          </div>
          
          <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm flex-1">
             <h3 className="font-bold text-[#0A1128] text-base mb-4">Class Health</h3>
             <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-6">
                <div className="h-full bg-blue-800 w-[64%]"></div>
             </div>
             <div className="flex justify-between">
                <div><p className="text-2xl font-bold">24</p><p className="text-[10px] font-bold text-gray-400">Hours/W</p></div>
                <div className="text-right"><p className="text-2xl font-bold text-red-500">08</p><p className="text-[10px] font-bold text-gray-400">Labs</p></div>
             </div>
          </div>
        </div>

        {/* Main Schedule Area */}
        <div className="flex-1 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="flex-1 overflow-auto custom-scrollbar">
            {viewType === 'week' ? renderWeeklyView() : renderMonthlyView()}
          </div>
          
          <div className="bg-gray-50 border-t border-gray-100 p-4 flex space-x-6 text-[10px] font-bold text-gray-500 uppercase shrink-0">
             <div className="flex items-center"><span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span> Spanish</div>
             <div className="flex items-center"><span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span> English</div>
             <div className="flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span> German</div>
             <div className="flex items-center"><span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span> French</div>
          </div>
        </div>
      </div>

      {/* Modal New/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 animate-fade-in-up relative">
            <h3 className="font-bold text-lg mb-6">{editingEventId ? 'Edit Class' : 'Add New Class'}</h3>
            <form onSubmit={handleSave} className="space-y-4">
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Language</label>
                    <select value={formData.language} onChange={(e) => setFormData({...formData, language: e.target.value})} className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none cursor-pointer">
                      <option value="Spanish">Spanish</option><option value="English">English</option><option value="German">German</option><option value="French">French</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Level</label>
                    <input type="text" placeholder="e.g. B1" value={formData.level} onChange={(e) => setFormData({...formData, level: e.target.value})} className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none" required />
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Group</label>
                    <select value={formData.group} onChange={(e) => setFormData({...formData, group: e.target.value})} className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none cursor-pointer">
                      <option value="Grp1">Grp 1</option><option value="Grp2">Grp 2</option><option value="Grp3">Grp 3</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Class Type</label>
                    <input type="text" placeholder="e.g. LECTURE" value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none" required />
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Day</label>
                    <select value={formData.day} onChange={(e) => setFormData({...formData, day: e.target.value})} className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none cursor-pointer">
                      {days.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Time Block</label>
                    <select value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none cursor-pointer">
                      {times.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Teacher</label>
                    <input type="text" placeholder="Teacher Name" value={formData.teacher} onChange={(e) => setFormData({...formData, teacher: e.target.value})} className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none" required />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Room / Lab</label>
                    <input type="text" placeholder="Room" value={formData.room} onChange={(e) => setFormData({...formData, room: e.target.value})} className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none" required />
                  </div>
               </div>
               
               {/* حقل Date الخاص بالجدول الشهري */}
               <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Date (For Monthly View)</label>
                  <input type="number" min="1" max="31" placeholder="Day of the month (1-31)" value={formData.date} onChange={(e) => setFormData({...formData, date: parseInt(e.target.value)})} className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none" required />
               </div>
               
               <div className="pt-4 flex space-x-3">
                  {editingEventId && (
                    <button type="button" onClick={() => handleDelete(editingEventId)} className="bg-red-50 text-red-600 px-4 py-3 rounded-xl font-bold text-sm hover:bg-red-100 transition-colors cursor-pointer">
                      🗑 Delete
                    </button>
                  )}
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 text-gray-500 font-bold text-sm bg-gray-50 hover:bg-gray-100 rounded-xl cursor-pointer">
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold text-sm shadow-md hover:bg-blue-700 cursor-pointer">
                    {editingEventId ? 'Save Changes' : 'Save Class'}
                  </button>
               </div>
            </form>
          </div>
        </div>
      )}

      {/* Daily View Modal */}
      {isDailyViewOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-8 animate-fade-in">
          <div className="bg-white w-full max-w-4xl h-[80vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-fade-in-up">
            <div className="bg-[#0A1128] text-white p-6 flex justify-between items-center shrink-0">
               <div>
                 <h3 className="font-bold text-2xl flex items-center">
                    <span className="mr-3 text-3xl">📅</span> Daily Schedule Overview
                 </h3>
                 <p className="text-gray-400 text-sm mt-1">Showing all scheduled classes and activities for {focusDay.toUpperCase()}</p>
               </div>
               <div className="flex items-center space-x-4">
                  <select value={focusDay} onChange={(e) => setFocusDay(e.target.value)} className="bg-white/10 border border-white/20 text-white rounded-lg px-4 py-2 outline-none font-bold cursor-pointer">
                     {days.map(d => <option key={d} value={d} className="text-black">{d.toUpperCase()}</option>)}
                  </select>
                  <button onClick={() => setIsDailyViewOpen(false)} className="text-white/50 hover:text-white text-2xl font-bold cursor-pointer transition-colors">✕</button>
               </div>
            </div>
            <div className="flex-1 bg-gray-50 p-8 overflow-y-auto custom-scrollbar">
               <div className="max-w-3xl mx-auto space-y-6">
                  {todaysEvents.length > 0 ? todaysEvents.map((event, idx) => (
                     <div key={idx} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex items-center transition-transform hover:-translate-y-1">
                        <div className="w-32 text-center border-r border-gray-100 pr-6 mr-6 shrink-0">
                           <p className="text-2xl font-bold text-[#0A1128]">{event.time}</p>
                           <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-wider">{event.day}</p>
                        </div>
                        <div className={`w-1.5 h-16 rounded-full mr-6 shrink-0 ${getDotColor(event.language)}`}></div>
                        <div className="flex-1">
                           <div className="flex justify-between items-start mb-2">
                              <div><span className={`text-[10px] font-bold px-2 py-1 rounded border uppercase tracking-widest ${getEventColors(event.language)}`}>{event.language} {event.level}</span></div>
                              <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded">{event.type}</span>
                           </div>
                           <h4 className="text-lg font-bold text-[#0A1128] mb-1">{event.group} Session</h4>
                           <p className="text-sm text-gray-500 flex items-center"><span className="mr-2">👨‍🏫</span> {event.teacher} <span className="mx-3 text-gray-300">|</span> <span className="mr-2">📍</span> {event.room}</p>
                        </div>
                     </div>
                  )) : (
                     <div className="text-center py-20">
                        <span className="text-6xl mb-4 block opacity-50">☕</span>
                        <h4 className="text-xl font-bold text-[#0A1128] mb-2">No Classes Today!</h4>
                        <p className="text-gray-500">There are no classes scheduled for {focusDay.toUpperCase()}.</p>
                     </div>
                  )}
               </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default SchoolSchedule;
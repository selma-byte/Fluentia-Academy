import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient'; 

const SchoolSchedule = () => {
  const [viewType, setViewType] = useState('week'); 
  const [filterLang, setFilterLang] = useState('All');
  const [filterLevel, setFilterLevel] = useState('All');
  const [filterGroup, setFilterGroup] = useState('All');
  
  // نحددو اليوم الحالي أوتوماتيكيا (أول 3 حروف من اسم اليوم: 'Mon', 'Tue', ...)
  const getTodayDayString = () => {
    return new Date().toLocaleDateString('en-US', { weekday: 'short' });
  };
  const [focusDay, setFocusDay] = useState(getTodayDayString());
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDailyViewOpen, setIsDailyViewOpen] = useState(false);

  // ==========================================
  // 💡 1. جلب البيانات الحقيقية من Supabase
  // ==========================================
  const [scheduleData, setScheduleData] = useState([]);
  const [formData, setFormData] = useState({ language: 'Spanish', level: 'B1', group: 'Grp1', day: 'Mon', date: 23, time: '10:00', type: 'LECTURE', teacher: '', room: '' });

  const fetchScheduleFromSupabase = async () => {
    const { data, error } = await supabase.from('classes').select('*').not('schedule', 'eq', 'TBD');
    if (!error && data) {
      const formatted = data.map(item => {
        // Schedule in DB is usually like: "Mon 10:00 - 12:00 - Room A"
        const dayMatch = item.schedule.match(/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)/);
        const timeMatch = item.schedule.match(/\d{2}:\d{2}/); 
        const roomMatch = item.schedule.split('- ')[1];
        
        return {
          id: item.id, 
          language: item.language, 
          level: item.level, 
          group: item.name,
          day: dayMatch ? dayMatch[0] : 'Mon', 
          // Since classes are weekly repeating, the date property is abstract. 
          // We will assign a created_at date just for fallback, but monthly view needs actual dates.
          date: new Date(item.created_at).getDate(), 
          time: timeMatch ? timeMatch[0] : '10:00', 
          type: 'COURSE', 
          teacher: item.teacher_name,
          room: roomMatch || 'TBD',
          originalSchedule: item.schedule
        };
      });
      setScheduleData(formatted);
    }
  };

  useEffect(() => { fetchScheduleFromSupabase(); }, []);

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const times = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00']; 

  const getEventColors = (lang) => {
    const l = lang?.toLowerCase().trim() || '';
    if (l.includes('span') || l.includes('espa')) return 'border-[#2563eb] bg-[#eff6ff] text-[#1e40af]'; 
    if (l.includes('eng') || l.includes('ang')) return 'border-[#f97316] bg-[#fff7ed] text-[#c2410c]'; 
    if (l.includes('germ') || l.includes('deut')) return 'border-[#22c55e] bg-[#f0fdf4] text-[#166534]'; 
    if (l.includes('fren') || l.includes('fran')) return 'border-[#a855f7] bg-[#faf5ff] text-[#6b21a8]'; 
    return 'border-gray-400 bg-gray-50 text-gray-700';
  };

  const getDotColor = (lang) => {
    const l = lang?.toLowerCase().trim() || '';
    if (l.includes('span') || l.includes('espa')) return 'bg-[#2563eb]'; 
    if (l.includes('eng') || l.includes('ang')) return 'bg-[#f97316]';
    if (l.includes('germ') || l.includes('deut')) return 'bg-[#22c55e]'; 
    if (l.includes('fren') || l.includes('fran')) return 'bg-[#a855f7]';
    return 'bg-gray-400';
  };

  const filteredSchedule = scheduleData.filter(item => {
    return (filterLang === 'All' || item.language === filterLang) &&
           (filterLevel === 'All' || item.level === filterLevel) &&
           (filterGroup === 'All' || item.group.includes(filterGroup));
  });

  const todaysEvents = filteredSchedule.filter(event => event.day === focusDay).sort((a, b) => a.time.localeCompare(b.time));

  // ==========================================
  // 💡 2. عرض التقويم الشهري الحقيقي (Real Month)
  // ==========================================
  const renderMonthlyView = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sunday, 1 is Monday
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Adjust first day so Monday is the first column (0 index)
    const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; 
    const blanks = Array.from({ length: startOffset }, (_, i) => null);
    const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1); 
    const totalCells = [...blanks, ...monthDays];

    return (
      <div className="grid grid-cols-7 h-full border-t border-l border-gray-100">
        {days.map(d => (<div key={d} className="bg-gray-50 py-2 border-r border-b border-gray-100 text-center font-bold text-[10px] text-gray-400 uppercase">{d}</div>))}
        
        {totalCells.map((d, index) => {
          if (!d) return <div key={`blank-${index}`} className="border-r border-b border-gray-50 bg-gray-50/50 min-h-[100px]"></div>;
          
          // نجبدوا اليوم فالسيمانة تاع هاد لادات (مثلا 14 الشهر يطيح يوم الاثنين)
          const currentCellDate = new Date(year, month, d);
          const dayNameShort = currentCellDate.toLocaleDateString('en-US', { weekday: 'short' });
          const isToday = currentCellDate.toDateString() === today.toDateString();

          // نجيبو الحصص لي يقراو ف هاداك اليوم من السيمانة (لأن الحصص تتكرر أسبوعيا)
          const dayEvents = filteredSchedule.filter(e => e.day === dayNameShort);

          return (
            <div key={d} className={`border-r border-b border-gray-100 p-2 min-h-[100px] hover:bg-blue-50/30 transition-colors group cursor-pointer ${isToday ? 'bg-blue-50/50' : 'bg-white'}`}>
              <span className={`text-xs font-bold ${isToday ? 'text-blue-600 bg-white px-1.5 py-0.5 rounded shadow-sm' : 'text-gray-400'}`}>{d}</span>
              <div className="mt-1 space-y-1">
                {dayEvents.slice(0, 4).map((e, i) => (
                  <div key={`${e.id}-${i}`} className={`text-[9px] px-1.5 py-0.5 rounded border-l-2 truncate font-bold ${getEventColors(e.language)}`}>
                    {e.time} | {e.group.split('-')[1] || e.group}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // ==========================================
  // 💡 3. عرض الأسبوع
  // ==========================================
  const renderWeeklyView = () => (
    <div className="grid grid-cols-[60px_repeat(6,1fr)]">
      <div className="border-b border-gray-100 pb-2"></div>
      {days.filter(d => d !== 'Sat').map((day, idx) => (
        <div key={day} className={`text-center pb-4 pt-2 border-b border-gray-100 ${day === focusDay ? 'bg-blue-50/50 border-b-2 border-b-blue-500' : ''}`}>
          <p className="text-[10px] font-bold text-gray-400 uppercase">{day}</p>
          <p className="text-sm font-bold text-[#0A1128]">Week Day</p>
        </div>
      ))}
      {times.map(time => (
        <React.Fragment key={time}>
          <div className="text-right pr-4 py-2 border-r border-gray-50 relative">
             <span className="text-xs font-bold text-gray-500 relative top-[-10px]">{time}</span>
          </div>
          {days.filter(d => d !== 'Sat').map(day => {
            const cellEvents = filteredSchedule.filter(e => e.day === day && e.time.startsWith(time.substring(0,2)));
            return (
              <div key={`${day}-${time}`} className={`border-b border-r border-gray-50 border-dashed p-1 min-h-[110px] flex flex-col gap-1.5 overflow-y-auto custom-scrollbar hover:bg-gray-50/50 transition-colors ${day === focusDay ? 'bg-blue-50/20' : ''}`}>
                 {cellEvents.map((event, index) => (
                    <div key={`${event.id}-${index}`} onClick={() => { setFormData(event); setIsModalOpen(true); }} className={`cursor-pointer group relative border-l-4 rounded-r-lg p-2 ${getEventColors(event.language)} hover:shadow-md transition-all shrink-0`}>
                       <p className="text-[9px] font-bold uppercase tracking-wider opacity-80 mb-0.5">{event.type}</p>
                       <p className="text-xs font-bold leading-tight mb-1">{event.group}</p>
                       <p className="text-[9px] font-bold opacity-75">{event.room} • {event.teacher}</p>
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
    <div className="animate-fade-in w-full h-full flex flex-col text-[#0A1128] pt-6 bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-end mb-6 px-8 shrink-0">
        <div>
          <h2 className="text-3xl font-bold text-[#0A1128] mb-1">Classes Timetable</h2>
          <div className="flex items-center space-x-3 mt-4">
             <div className="bg-gray-100 p-1 rounded-xl flex">
                <button onClick={() => setViewType('week')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${viewType === 'week' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Week</button>
                <button onClick={() => setViewType('month')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${viewType === 'month' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Month</button>
             </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <select value={filterLang} onChange={(e) => setFilterLang(e.target.value)} className="bg-white border border-gray-200 text-xs rounded-lg px-3 py-2 outline-none font-bold cursor-pointer">
            <option value="All">All Languages</option>
            <option value="Spanish">Spanish</option>
            <option value="English">English</option>
            <option value="German">German</option>
            <option value="French">French</option>
          </select>
          <button onClick={() => fetchScheduleFromSupabase()} className="bg-gray-100 hover:bg-gray-200 text-[#0A1128] px-5 py-2.5 rounded-xl text-sm font-bold transition-colors cursor-pointer">🔄 Refresh</button>
        </div>
      </div>

      <div className="flex flex-1 gap-6 min-h-0 px-8 pb-8">
        <div className="w-[280px] flex flex-col shrink-0">
          <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm mb-6 flex flex-col max-h-[60%]">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-[#0A1128] text-lg">Daily Focus</h3>
                <select value={focusDay} onChange={(e) => setFocusDay(e.target.value)} className="text-[10px] font-bold text-blue-600 bg-blue-50 border-none rounded px-2 py-1 outline-none cursor-pointer">
                   {days.map(d => <option key={d} value={d}>{d.toUpperCase()}</option>)}
                </select>
             </div>
             <div className="space-y-6 relative overflow-y-auto custom-scrollbar flex-1 pr-2 before:absolute before:inset-y-2 before:left-1.5 before:w-0.5 before:bg-gray-200">
                {todaysEvents.length > 0 ? todaysEvents.map((event, idx) => (
                   <div key={idx} className="relative pl-6">
                      <div className={`absolute left-0 top-1.5 w-3 h-3 ${getDotColor(event.language)} rounded-full border-2 border-white shadow-sm z-10`}></div>
                      <p className="text-[10px] text-gray-400 font-bold mb-0.5">{event.time}</p>
                      <p className="font-bold text-sm text-[#0A1128]">{event.group}</p>
                      <p className="text-xs text-gray-500">{event.teacher}</p>
                   </div>
                )) : <p className="text-xs text-gray-400 italic pl-6">No classes.</p>}
             </div>
             <button onClick={() => setIsDailyViewOpen(true)} className="w-full mt-4 pt-4 border-t border-gray-100 text-sm font-bold text-blue-600 hover:underline cursor-pointer">View Full Daily</button>
          </div>
          <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm flex-1">
             <h3 className="font-bold text-[#0A1128] text-base mb-4">Class Health</h3>
             <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-6"><div className="h-full bg-blue-800 w-[64%]"></div></div>
             <div className="flex justify-between">
                <div><p className="text-2xl font-bold">{scheduleData.length}</p><p className="text-[10px] font-bold text-gray-400">Total Classes</p></div>
                <div className="text-right"><p className="text-2xl font-bold text-blue-600">{todaysEvents.length}</p><p className="text-[10px] font-bold text-gray-400">Selected Day</p></div>
             </div>
          </div>
        </div>

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

      {isModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 relative">
            <h3 className="font-bold text-xl mb-4 text-[#0A1128]">{formData.group}</h3>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-xs font-bold text-gray-400 uppercase mb-2">Detailed Info</p>
                <p className="text-sm mb-1"><b>Teacher:</b> {formData.teacher}</p>
                <p className="text-sm mb-1"><b>Room:</b> {formData.room}</p>
                <p className="text-sm mb-1"><b>Schedule:</b> {formData.originalSchedule || `${formData.day} at ${formData.time}`}</p>
              </div>
              <p className="text-[10px] text-gray-400 italic">💡 To change this schedule, please go to Groups & Levels Management.</p>
              <button onClick={() => setIsModalOpen(false)} className="w-full bg-[#0A1128] hover:bg-gray-800 text-white py-3 rounded-xl font-bold text-sm transition-colors cursor-pointer">Close</button>
            </div>
          </div>
        </div>
      )}

      {isDailyViewOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-8 animate-fade-in">
          <div className="bg-white w-full max-w-4xl h-[80vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-fade-in-up">
            <div className="bg-[#0A1128] text-white p-6 flex justify-between items-center shrink-0">
                <div><h3 className="font-bold text-2xl flex items-center"><span className="mr-3 text-3xl">📅</span> {focusDay.toUpperCase()} Schedule</h3></div>
                <button onClick={() => setIsDailyViewOpen(false)} className="text-white/50 hover:text-white text-2xl font-bold cursor-pointer transition-colors">✕</button>
            </div>
            <div className="flex-1 bg-gray-50 p-8 overflow-y-auto custom-scrollbar">
                <div className="max-w-3xl mx-auto space-y-6">
                   {todaysEvents.length > 0 ? todaysEvents.map((event, idx) => (
                      <div key={idx} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex items-center transition-transform hover:-translate-y-1">
                         <div className="w-32 text-center border-r border-gray-100 pr-6 mr-6 shrink-0"><p className="text-2xl font-bold text-[#0A1128]">{event.time}</p></div>
                         <div className={`w-1.5 h-16 rounded-full mr-6 shrink-0 ${getDotColor(event.language)}`}></div>
                         <div className="flex-1">
                            <h4 className="text-lg font-bold text-[#0A1128] mb-1">{event.group}</h4>
                            <p className="text-sm text-gray-500 flex items-center"><span className="mr-2">👨‍🏫</span> {event.teacher} <span className="mx-3 text-gray-300">|</span> <span className="mr-2">📍</span> {event.room}</p>
                         </div>
                      </div>
                   )) : (<div className="text-center py-20"><h4 className="text-xl font-bold text-gray-400">No classes scheduled for today.</h4></div>)}
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchoolSchedule;
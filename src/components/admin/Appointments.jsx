import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

const Appointments = () => {
  const [activeTab, setActiveTab] = useState('calendar');
  const [sideModalView, setSideModalView] = useState(null); // null, 'details', 'new', 'edit'
  const [filter, setFilter] = useState('All');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(false);

  // =======================================
  // 1. Dynamic State (Connected to Supabase)
  // =======================================
  const [events, setEvents] = useState([]);
  
  // Pending requests computed from events
  const pendingRequests = events.filter(e => e.type === 'Pending');

  // Form State
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', sub: 'Placement Test', day: 1, time: '09:00', duration: 60, staff: 'Prof. Nadia', notes: '' });

  // =======================================
  // 2. LOGIC FUNCTIONS (The "Work")
  // =======================================

  const fetchEvents = async () => {
    let mergedEvents = [];

    const parseDay = (d) => {
      if (!d) return 1;
      if (!isNaN(d)) return Number(d); 
      const map = { 'mon': 1, 'tue': 2, 'wed': 3, 'thu': 4, 'fri': 5, 'sat': 6, 'sun': 7 };
      return map[String(d).toLowerCase().substring(0,3)] || 1;
    };
    
    const parseTime = (t) => {
      if (!t) return 10;
      if (!isNaN(t)) return Number(t); 
      const [h, m] = String(t).split(':');
      return parseInt(h) + (parseInt(m || 0) / 60);
    };

    const { data: appData, error: appError } = await supabase.from('appointments').select('*');
    if (!appError && appData) {
      const formattedApps = appData.map(ev => ({
        id: ev.id,
        title: ev.title,
        sub: ev.sub_title,
        day: parseDay(ev.appointment_day),
        start: parseTime(ev.start_time_float),
        duration: Number(ev.duration_minutes) || 60,
        type: ev.status,
        phone: ev.phone,
        email: ev.email,
        staff: ev.teacher_name,
        notes: ev.notes,
      }));
      mergedEvents = [...mergedEvents, ...formattedApps];
    }

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
          staff: c.teacher_name,
        };
      });
      mergedEvents = [...mergedEvents, ...formattedClasses];
    }

    setEvents(mergedEvents);
  };

  useEffect(() => { fetchEvents(); }, []);

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

  // APPROVE / REJECT
  const handleApprove = (req) => updateStatus(req.id, 'Upcoming');
  const handleReject = (id) => updateStatus(id, 'Missed');

  // DELETE (we mark as missed/canceled to be consistent with Secretary logic, or delete if not in DB yet)
  const handleDelete = (id) => updateStatus(id, 'Missed');

  // MODIFY / EDIT
  const handleEditClick = (ev) => {
    const hours = Math.floor(ev.start);
    const mins = Math.round((ev.start - hours) * 60);
    const timeStr = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    
    setFormData({
      name: ev.title, phone: ev.phone || '', email: ev.email || '', sub: ev.sub, 
      day: ev.day, time: timeStr, duration: ev.duration, staff: ev.staff || '', notes: ev.notes || ''
    });
    setSelectedEvent(ev);
    setSideModalView('edit');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    const [h, m] = formData.time.split(':').map(Number);
    const decimalTime = h + (m / 60);

    try {
      const eventData = {
        title: formData.name,
        sub_title: formData.sub,
        appointment_day: parseInt(formData.day),
        start_time_float: decimalTime,
        duration_minutes: parseInt(formData.duration),
        teacher_name: formData.staff,
        phone: formData.phone,
        email: formData.email,
        notes: formData.notes,
        status: 'Upcoming'
      };

      if (sideModalView === 'edit') {
        const { error } = await supabase.from('appointments').update(eventData).eq('id', selectedEvent.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('appointments').insert([eventData]);
        if (error) throw error;
      }

      fetchEvents();
      setSideModalView(null);
      setFormData({ name: '', phone: '', email: '', sub: 'Placement Test', day: 1, time: '09:00', duration: 60, staff: 'Prof. Nadia', notes: '' });
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // UI Helpers
  const START_HOUR = 8;
  const END_HOUR = 17;
  const HOUR_HEIGHT = 80;
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
  // 3. RENDER VIEWS
  // =======================================
  const renderCalendarView = () => (
    <div className="flex-1 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col min-w-0">
      <div className="flex justify-between items-center mb-6 shrink-0">
         <h3 className="font-bold text-[#0A1128] text-lg">Weekly Calendar <span className="text-sm font-normal text-gray-500 ml-3">Jan 27 - Feb 2, 2025</span></h3>
         <div className="flex items-center space-x-2">
            <button className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-gray-200 cursor-pointer transition-colors">{"<"}</button>
            <button className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-gray-200 cursor-pointer transition-colors">{">"}</button>
         </div>
      </div>
      
      <div className="flex-1 overflow-y-auto overflow-x-auto custom-scrollbar">
        <div className="min-w-[900px] pb-4">
          <div className="grid grid-cols-[70px_repeat(7,1fr)] gap-2 mb-2 text-center border-b border-gray-200 pb-4 sticky top-0 bg-white z-20">
            <div></div>
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, idx) => (
              <div key={day}><p className="text-[#0A1128] font-bold text-sm mb-1">{day}</p><p className="text-xs text-gray-500">Jan {27+idx}</p></div>
            ))}
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
                <div/><div/><div/><div/><div/><div/><div/>
              </div>
              <div className="absolute inset-0 flex flex-col divide-y divide-gray-100 pointer-events-none">
                {hoursArray.map(h => <div key={h} style={{height: `${HOUR_HEIGHT}px`}}></div>)}
              </div>

              {events.filter(e => filter === 'All' || e.type === filter).map((ev) => {
                const top = (ev.start - START_HOUR) * HOUR_HEIGHT;
                const height = (ev.duration / 60) * HOUR_HEIGHT;
                const left = (ev.day - 1) * (100 / 7);
                return (
                  <div 
                    key={ev.id}
                    onClick={() => { setSelectedEvent(ev); setSideModalView('details'); }}
                    style={{ top: `${top}px`, height: `${height}px`, left: `${left}%`, width: `${(100/7)-1}%` }}
                    className={`absolute p-2 rounded-lg shadow-sm border-l-4 cursor-pointer hover:shadow-md hover:opacity-90 transition-all overflow-hidden ${getEventStyles(ev.type)}`}
                  >
                    <p className="text-[11px] font-bold flex items-center mb-1 leading-tight">
                      <span className={`min-w-[6px] w-[6px] h-[6px] rounded-full mr-1.5 ${getDotColor(ev.type)}`}></span> 
                      <span className="truncate">{ev.title}</span>
                    </p>
                    <p className="text-[10px] leading-tight opacity-80 line-clamp-2">{ev.sub}</p>
                    {ev.duration >= 60 && <p className="text-[10px] mt-1.5 flex items-center font-medium opacity-70">⏱ {ev.duration} min</p>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPendingRequests = () => (
    <div className="flex-1 bg-white border border-gray-200 rounded-2xl p-8 shadow-sm flex flex-col min-w-0">
      <div className="flex justify-between items-start border-b border-gray-100 pb-5 mb-6 shrink-0">
        <div>
          <h3 className="font-bold text-[#0A1128] text-xl mb-1.5">Pending Appointment Requests</h3>
          <p className="text-sm text-gray-500">Review and manage appointment requests that require approval</p>
        </div>
        <span className="bg-[#fefce8] text-[#854d0e] px-4 py-1.5 rounded-lg text-xs font-bold border border-[#fde047]">{pendingRequests.length} Total Pending</span>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-4">
        <div className="space-y-6">
          {pendingRequests.map(req => (
            <div key={req.id} className="border border-gray-100 rounded-xl p-5 hover:border-blue-100 transition-colors bg-[#f8fafc]">
              <div className="flex justify-between items-start">
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-[#fefce8] flex items-center justify-center text-[#eab308] mr-5 text-xl">👤</div>
                  <div>
                    <p className="font-bold text-[#0A1128] text-base mb-1">{req.title}</p>
                    <p className="text-xs text-gray-500 mb-4 font-medium">{req.sub}</p>
                    <div className="grid grid-cols-2 gap-y-3 gap-x-8 text-xs text-gray-600 mb-4 bg-white p-3 rounded-lg border border-gray-100">
                      <span>📅 Day {req.day}</span>
                      <span>🕒 {req.start}:00 ({req.duration} min)</span>
                      <span>📞 {req.phone}</span>
                      <span>👨‍🏫 {req.staff}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <button onClick={() => handleApprove(req)} className="bg-[#22c55e] hover:bg-green-600 text-white px-5 py-2 rounded-lg text-xs font-bold w-28 text-center shadow-sm">Approve</button>
                  <button onClick={() => handleReject(req.id)} className="bg-white text-[#ef4444] border border-[#ef4444] hover:bg-red-50 px-5 py-2 rounded-lg text-xs font-bold w-28 text-center">Reject</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSidebar = () => (
    <div className="w-[340px] shrink-0 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col h-full">
      <div className="mb-6 border-b border-gray-100 pb-5 shrink-0">
        <h3 className="font-bold text-[#0A1128] text-lg flex items-center mb-1.5"><span className="mr-2 text-blue-600">📅</span> Today's Schedule</h3>
        <p className="text-xs text-gray-500">Thursday, April 2, 2026</p>
      </div>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 shrink-0">Upcoming Sessions</p>
      <div className="space-y-4 overflow-y-auto custom-scrollbar pr-2 flex-1">
        {events.filter(e => e.type === 'Upcoming').map(ev => (
          <div key={ev.id} className="bg-[#f8fafc] border border-gray-200 rounded-xl p-4 shadow-sm hover:border-blue-200 transition-colors">
            <p className="font-bold text-[#0A1128] text-sm flex items-center mb-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-600 mr-2.5"></span> {ev.sub}
            </p>
            <p className="text-xs text-gray-600 ml-4 mb-2">{ev.title}</p>
            <p className="text-xs text-gray-400 ml-4 mb-4">🕒 {ev.start}:00 - {ev.duration} min</p>
            <div className="flex space-x-2 ml-4">
              <button onClick={() => handleEditClick(ev)} className="flex-1 bg-white border border-gray-200 text-gray-600 text-[10px] font-bold py-2 rounded-lg hover:bg-gray-50">✎ Modify</button>
              <button onClick={() => handleDelete(ev.id)} className="flex-1 bg-white border border-gray-200 text-gray-600 text-[10px] font-bold py-2 rounded-lg hover:bg-red-50 hover:text-red-500">✕ Cancel</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in w-full h-full flex flex-col">
      <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4 shrink-0">
        <div className="flex items-center space-x-8">
          <div className="flex space-x-2">
            <button onClick={() => setActiveTab('calendar')} className={`text-sm font-bold px-4 py-2 rounded-lg ${activeTab === 'calendar' ? 'bg-gray-100 text-[#0A1128]' : 'text-gray-500'}`}>Calendar View</button>
            <button onClick={() => setActiveTab('pending')} className={`text-sm font-bold px-4 py-2 rounded-lg ${activeTab === 'pending' ? 'bg-gray-100 text-[#0A1128]' : 'text-gray-500'}`}>Pending Requests</button>
          </div>
          {activeTab === 'calendar' && (
            <div className="flex space-x-6 pl-6 text-sm font-bold items-center border-l border-gray-300">
              {['All', 'Upcoming', 'Pending', 'Completed', 'Missed'].map(f => (
                <button key={f} onClick={() => setFilter(f)} className={`${filter === f ? 'text-[#0A1128] underline underline-offset-8' : 'text-gray-400'}`}>{f}</button>
              ))}
            </div>
          )}
        </div>
        <button onClick={() => {setSideModalView('new'); setFormData({ name: '', phone: '', email: '', sub: 'Placement Test', day: 1, time: '09:00', duration: 60, staff: 'Prof. Nadia', notes: '' });}} className="bg-[#2563eb] text-white px-6 py-3 rounded-xl text-sm font-bold shadow-md">+ New Appointment</button>
      </div>

      <div className="flex gap-8 flex-1 min-h-0">
        {activeTab === 'calendar' ? renderCalendarView() : renderPendingRequests()}
        {renderSidebar()}
      </div>

      {sideModalView && (
        <div className="fixed inset-0 z-[100] flex justify-end bg-black/20 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={() => setSideModalView(null)}></div>
          <div className="w-[400px] bg-[#f8fafc] h-full shadow-2xl flex flex-col border-l border-gray-200 relative z-10">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-white">
              <div>
                <h3 className="font-bold text-[#0A1128] text-lg">{sideModalView === 'details' ? 'Appointment Details' : sideModalView === 'edit' ? 'Edit Appointment' : 'New Appointment'}</h3>
              </div>
              <button onClick={() => setSideModalView(null)} className="text-gray-400 text-2xl">✕</button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
              {sideModalView === 'details' && selectedEvent && (
                <div className="space-y-8">
                  <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <p className="font-bold text-[#0A1128] text-base">{selectedEvent.title}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{selectedEvent.phone}</p>
                  </div>
                  <div className="space-y-4 text-sm bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between border-b pb-3"><span>Treatment:</span> <span className="font-bold">{selectedEvent.sub}</span></div>
                    <div className="flex justify-between border-b pb-3"><span>Time:</span> <span className="font-bold">{selectedEvent.start}:00</span></div>
                    <div className="flex justify-between"><span>Staff:</span> <span className="font-bold">{selectedEvent.staff}</span></div>
                  </div>
                  <div className="pt-6 space-y-3">
                    <button onClick={() => handleEditClick(selectedEvent)} className="w-full bg-[#eff6ff] text-[#2563eb] border border-blue-200 rounded-xl py-3 text-sm font-bold">✎ Modify Appointment</button>
                    <button onClick={() => handleDelete(selectedEvent.id)} className="w-full bg-[#fef2f2] text-[#dc2626] border border-red-200 rounded-xl py-3 text-sm font-bold">🗑 Cancel Appointment</button>
                  </div>
                </div>
              )}

              {(sideModalView === 'new' || sideModalView === 'edit') && (
                <form onSubmit={handleSave} className="space-y-6">
                  <input required placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border p-3 rounded-xl text-sm" />
                  <div className="grid grid-cols-2 gap-4">
                    <input placeholder="Phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="border p-3 rounded-xl text-sm" />
                    <input placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="border p-3 rounded-xl text-sm" />
                  </div>
                  <select value={formData.sub} onChange={e => setFormData({...formData, sub: e.target.value})} className="w-full border p-3 rounded-xl text-sm">
                    <option>Placement Test</option><option>Parent Meeting</option><option>Private Lesson</option>
                  </select>
                  <div className="grid grid-cols-2 gap-4">
                    <select value={formData.day} onChange={e => setFormData({...formData, day: e.target.value})} className="border p-3 rounded-xl text-sm">
                      {[1,2,3,4,5,6,7].map(d => <option key={d} value={d}>Day {d}</option>)}
                    </select>
                    <input type="time" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="border p-3 rounded-xl text-sm" />
                  </div>
                  <button type="submit" className="w-full bg-[#2563eb] text-white py-4 rounded-xl font-bold shadow-md">
                    {sideModalView === 'edit' ? 'Update Appointment' : 'Save Appointment'}
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
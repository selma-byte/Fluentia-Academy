import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient'; 

const Enrollment = () => {
  const [modalView, setModalView] = useState(null); 
  const [classesData, setClassesData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchClasses = async () => {
    const { data } = await supabase.from('classes').select('*').order('created_at', { ascending: false });
    if (data) setClassesData(data);
  };

  useEffect(() => { fetchClasses(); }, []);

  // 💡 فورميلار موحد
  const [formData, setFormData] = useState({
    language: 'English',
    level: 'A1',
    teacher: '', 
    capacity: 20,
    total_sessions: 24, 
    sessions_per_week: 2, 
    course_type: 'Regular', // 'Regular' أو 'Make-up Session'
    targetClassId: '', // 💡 هادي نستعملوها باش نخيرو الفوج اللي نزيدولو حصة تعويضية
    schedules: [
      { day: 'Mon', startTime: '10:00', endTime: '12:00', room: 'Salle 05' },
      { day: 'Wed', startTime: '10:00', endTime: '12:00', room: 'Salle 05' }
    ]
  });

  const handleSessionsPerWeekChange = (e) => {
    const count = parseInt(e.target.value) || 1;
    const newSchedules = [...formData.schedules];
    
    if (count > newSchedules.length) {
      for (let i = newSchedules.length; i < count; i++) {
        newSchedules.push({ day: 'Mon', startTime: '10:00', endTime: '12:00', room: 'Salle 05' });
      }
    } else {
      newSchedules.length = count; 
    }
    
    setFormData({ ...formData, sessions_per_week: count, schedules: newSchedules });
  };

  const handleScheduleChange = (index, field, value) => {
    const newSchedules = [...formData.schedules];
    newSchedules[index][field] = value;
    setFormData({ ...formData, schedules: newSchedules });
  };

  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupStudents, setGroupStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  const handleViewStudents = async (group) => {
    setSelectedGroup(group);
    setLoadingStudents(true);
    setModalView('studentsList'); 

    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('group_name', group.name) 
        .eq('status', 'Active'); 

      if (error) throw error;
      setGroupStudents(data || []);
    } catch (err) {
      alert("إيرور: " + err.message);
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleAddSession = async (classId, currentCompleted, totalSessions) => {
    const completed = currentCompleted || 0;
    if (completed >= (totalSessions || 24)) {
      alert("🎉 هذا الفوج أكمل جميع الحصص المبرمجة!");
      return;
    }
    
    try {
      const { error } = await supabase
        .from('classes')
        .update({ completed_sessions: completed + 1 })
        .eq('id', classId);
        
      if (error) throw error;
      fetchClasses(); 
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleDeleteClass = async (classId, enrolledCount, className) => {
    if (enrolledCount > 0) {
      alert(`❌ ممنوع الحذف! فوج "${className}" فيه ${enrolledCount} تلاميذ مسجلين. لازم تخرجيهم قبل.`);
      return;
    }

    if (window.confirm(`⚠️ هل أنت متأكدة من حذف فوج "${className}"؟ (لا يمكن التراجع)`)) {
      try {
        const { error } = await supabase.from('classes').delete().eq('id', classId);
        if (error) throw error;
        alert("✅ تم حذف الفوج بنجاح!");
        fetchClasses(); 
      } catch (err) {
        alert("إيرور في الحذف: " + err.message);
      }
    }
  };

  const generateGroupName = () => {
    const count = classesData.filter(c => c.language === formData.language && c.level.includes(formData.level)).length + 1;
    return `${formData.language} ${formData.level} - Group ${count}`;
  };

  const handleSaveAll = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: conflicts } = await supabase.from('classes').select('schedule');
      let hasConflict = false;
      let conflictMsg = '';

      // 💡 التحقق من التداخل
      const schedulesToCheck = formData.course_type === 'Make-up Session' ? [formData.schedules[0]] : formData.schedules;
      
      for (let s of schedulesToCheck) {
        const conflictFound = conflicts?.some(c => 
          c.schedule.includes(s.day) && 
          c.schedule.includes(s.room) && 
          c.schedule.includes(s.startTime) 
        );
        if (conflictFound) {
          hasConflict = true;
          conflictMsg = `⚠️ القاعة ${s.room} محجوزة يوم ${s.day} على ${s.startTime}! خيري وقت آخر.`;
          break;
        }
      }

      if (hasConflict) {
        alert(conflictMsg);
        setLoading(false); return;
      }

      // 💡 حالة 1: إضافة حصة تعويضية لفوج موجود
      if (formData.course_type === 'Make-up Session') {
        if (!formData.targetClassId) return alert("⚠️ خيري الفوج اللي حابة تزيديلو الحصة التعويضية!");
        
        const targetClass = classesData.find(c => c.id === formData.targetClassId);
        const makeUpSch = formData.schedules[0];
        const extraSchedule = `[Make-up] ${makeUpSch.day} (${makeUpSch.startTime}-${makeUpSch.endTime}) - ${makeUpSch.room}`;
        
        const newSchedule = targetClass.schedule ? `${targetClass.schedule} | ${extraSchedule}` : extraSchedule;

        const { error } = await supabase.from('classes').update({ schedule: newSchedule }).eq('id', targetClass.id);
        if (error) throw error;
        
        alert(`✅ تم برمجة الحصة التعويضية لفوج ${targetClass.name} بنجاح!`);
      } 
      // 💡 حالة 2: إنشاء فوج جديد
      else {
        if (!formData.teacher) {
          alert("⚠️ من فضلك خيري أستاذ من القائمة!");
          setLoading(false); return;
        }

        const groupName = generateGroupName();
        const fullSchedule = formData.schedules.map(s => `${s.day} (${s.startTime}-${s.endTime}) - ${s.room}`).join(' | ');

        const { error } = await supabase.from('classes').insert([{
          name: groupName,
          language: formData.language,
          level: formData.level,
          teacher_name: formData.teacher,
          schedule: fullSchedule,
          capacity: formData.capacity,
          enrolled_count: 0,
          total_sessions: formData.total_sessions, 
          sessions_per_week: formData.sessions_per_week, 
          completed_sessions: 0 
        }]);

        if (error) throw error;
        alert(`✅ تم إنشاء ${groupName} وبرمجته بنجاح!`);
      }
      
      setFormData({ ...formData, teacher: '', targetClassId: '' });
      setModalView(null);
      fetchClasses();
      
    } catch (err) { alert(err.message); } finally { setLoading(false); }
  };
  
  const [teachersList, setTeachersList] = useState([]);

  useEffect(() => {
    const fetchTeachers = async () => {
      const { data } = await supabase.from('staff').select('*').ilike('role', 'teacher'); 
      if (data) setTeachersList(data);
    };
    fetchTeachers();
  }, []);

  return (
    <div className="animate-fade-in w-full h-full flex flex-col relative">
      <div className="flex justify-between items-end mb-6 border-b border-gray-200 pb-5">
        <div>
          <h2 className="text-3xl font-bold text-[#0A1128]">Groups Management</h2>
          <p className="text-sm text-gray-500">Create and schedule groups or add make-up sessions</p>
        </div>
        <button onClick={() => setModalView('unifiedForm')} className="bg-[#2563eb] text-white px-6 py-3 rounded-xl font-bold shadow-md cursor-pointer">+ New Group / Make-up</button>
      </div>

      {/* الجدول */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto custom-scrollbar rounded-xl border border-gray-100">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-[#0A1128] font-bold sticky top-0 z-10">
              <tr>
                <th className="py-4 px-6">Group Name</th>
                <th className="py-4 px-6">Language</th>
                <th className="py-4 px-6">Schedule / Room</th>
                <th className="py-4 px-6">Teacher</th>
                <th className="py-4 px-6 text-center">Capacity</th>
                <th className="py-4 px-6 text-center">Progress 📊</th> 
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {classesData.map((row) => {
                const currentCount = row.enrolled_count || 0;
                const maxCapacity = row.capacity || 20;
                const isFull = currentCount >= maxCapacity;
                
                const completed = row.completed_sessions || 0;
                const total = row.total_sessions || 24;
                const progressPercent = Math.min((completed / total) * 100, 100);

                return (
                  <tr key={row.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="py-4 px-6 font-bold text-[#0A1128]">{row.name}</td>
                    <td className="py-4 px-6 font-medium text-blue-600">{row.language} ({row.level})</td>
                    <td className="py-4 px-6 text-gray-600 font-bold text-[10px] whitespace-pre-wrap leading-relaxed">
                      {row.schedule.split(' | ').map((sch, i) => (
                        <div key={i} className={sch.includes('[Make-up]') ? "text-orange-500 bg-orange-50 inline-block px-1 rounded my-0.5" : "my-0.5"}>
                          {sch}
                        </div>
                      ))}
                    </td>
                    <td className="py-4 px-6 font-medium text-[#0A1128]">{row.teacher_name}</td>
                    
                    <td className="py-4 px-6 text-center">
                      <div className="flex flex-col items-center">
                        <span className={`text-[11px] font-black px-3 py-1 rounded-lg border ${
                          isFull ? 'bg-red-50 text-red-600 border-red-200' : 
                          currentCount > 0 ? 'bg-green-50 text-green-600 border-green-200' : 
                          'bg-gray-50 text-gray-500 border-gray-200'
                        }`}>
                          {currentCount} / {maxCapacity}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-center">
                      <div className="flex flex-col items-center w-24 mx-auto">
                        <span className="text-[10px] font-black text-[#1B254B] uppercase tracking-widest">{completed} / {total}</span>
                        <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1.5 overflow-hidden">
                          <div className={`h-full rounded-full transition-all duration-500 ${progressPercent >= 100 ? 'bg-[#01B574]' : 'bg-[#4318FF]'}`} style={{ width: `${progressPercent}%` }}></div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-center text-gray-400 space-x-2 whitespace-nowrap">
                      <button onClick={() => handleAddSession(row.id, row.completed_sessions, row.total_sessions)} className="text-green-600 hover:bg-green-50 px-2.5 py-1.5 rounded-lg cursor-pointer font-black text-xs border border-green-100" title="Mark Session Done">+1</button>
                      <button onClick={() => handleViewStudents(row)} className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-lg cursor-pointer" title="View Students">👥</button>
                      <button onClick={() => handleDeleteClass(row.id, currentCount, row.name)} className="hover:bg-red-50 p-1.5 rounded-lg text-red-500 cursor-pointer" title="Delete Group">🗑</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* المودال تاع إنشاء الفوج أو حصة تعويضية */}
      {modalView === 'unifiedForm' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden">
            <div className="bg-gray-50/80 p-8 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-[#0A1128]">{formData.course_type === 'Make-up Session' ? 'Schedule Make-up Session' : 'Quick Group Setup'}</h2>
                {formData.course_type === 'Regular' && <p className="text-xs text-gray-400 font-bold uppercase mt-1">Automatic Name: <span className="text-blue-600">{generateGroupName()}</span></p>}
              </div>
              <button onClick={() => setModalView(null)} className="text-gray-400 hover:text-black text-2xl cursor-pointer">✕</button>
            </div>
            
            <form onSubmit={handleSaveAll} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              
              <div className="mb-4">
                <label className="text-[10px] font-bold text-[#0A1128] uppercase mb-2 block tracking-widest">Action Type</label>
                <div className="flex bg-gray-100 p-1 rounded-xl w-max">
                  <button type="button" onClick={() => setFormData({...formData, course_type: 'Regular'})} className={`px-6 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${formData.course_type === 'Regular' ? 'bg-white text-[#2563eb] shadow-sm' : 'text-gray-500'}`}>Create New Group</button>
                  <button type="button" onClick={() => setFormData({...formData, course_type: 'Make-up Session'})} className={`px-6 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${formData.course_type === 'Make-up Session' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500'}`}>Make-up Session</button>
                </div>
              </div>

              {formData.course_type === 'Make-up Session' ? (
                // 💡 فورم الحصة التعويضية (نخيرو الجروب اللي ديجا كاين برك)
                <div className="bg-orange-50/50 p-6 rounded-2xl border border-orange-100 space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-orange-600 uppercase mb-2 block tracking-widest">Select Existing Group</label>
                    <select value={formData.targetClassId} onChange={(e) => setFormData({...formData, targetClassId: e.target.value})} className="w-full bg-white border border-orange-200 rounded-xl p-3 text-sm font-bold shadow-sm cursor-pointer outline-none focus:border-orange-500">
                      <option value="">-- Choose Group --</option>
                      {classesData.map(c => <option key={c.id} value={c.id}>{c.name} (Prof. {c.teacher_name})</option>)}
                    </select>
                  </div>
                  
                  <div className="pt-2 border-t border-orange-100">
                    <label className="text-[10px] font-bold text-orange-600 uppercase mb-2 block tracking-widest">Make-up Time & Room</label>
                    <div className="flex gap-2 items-end bg-white p-3 rounded-xl border border-orange-100 shadow-sm">
                      <div className="w-24">
                        <label className="text-[9px] font-bold text-gray-400 uppercase block mb-1 ml-1">Day</label>
                        <select value={formData.schedules[0].day} onChange={(e)=>handleScheduleChange(0, 'day', e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs font-bold outline-none focus:border-orange-400">
                          <option>Mon</option><option>Tue</option><option>Wed</option><option>Thu</option><option>Fri</option><option>Sat</option><option>Sun</option>
                        </select>
                      </div>
                      <div className="flex-1">
                        <label className="text-[9px] font-bold text-gray-400 uppercase block mb-1">Start</label>
                        <input type="time" value={formData.schedules[0].startTime} onChange={(e)=>handleScheduleChange(0, 'startTime', e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs outline-none focus:border-orange-400" required/>
                      </div>
                      <div className="flex-1">
                        <label className="text-[9px] font-bold text-gray-400 uppercase block mb-1">End</label>
                        <input type="time" value={formData.schedules[0].endTime} onChange={(e)=>handleScheduleChange(0, 'endTime', e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs outline-none focus:border-orange-400" required/>
                      </div>
                      <div className="w-32">
                        <label className="text-[9px] font-bold text-gray-400 uppercase block mb-1">Room</label>
                        <select value={formData.schedules[0].room} onChange={(e)=>handleScheduleChange(0, 'room', e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs font-bold outline-none focus:border-orange-400">
                          <option>Salle 05</option><option>Lab 02</option><option>Salle 12</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // 💡 فورم إنشاء الفوج الجديد
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase mb-2 block">Language</label>
                      <select value={formData.language} onChange={(e)=>setFormData({...formData, language: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-bold">
                        <option>English</option><option>Français</option><option>Deutsch</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase mb-2 block">Level</label>
                      <select value={formData.level} onChange={(e)=>setFormData({...formData, level: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-bold">
                        <option>A1</option><option>A2</option><option>B1</option><option>B2</option><option>C1</option><option>C2</option>
                      </select>
                    </div>
                    
                    <div className="col-span-2">
                     <label className="text-[10px] font-bold text-gray-400 uppercase mb-2 block">Assign Teacher</label>
                     <select value={formData.teacher}  onChange={(e) => setFormData({...formData, teacher: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-bold cursor-pointer">
                       <option value="">-- Select Teacher --</option>
                        {teachersList.map((t) => (
                        <option key={t.id} value={`${t.first_name} ${t.last_name}`}>
                         Prof. {t.first_name} {t.last_name}
                        </option>
                       ))}
                     </select>
                     </div>
                  </div>

                  <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 space-y-4">
                    <div className="text-blue-600 font-bold text-xs uppercase tracking-widest mb-1 flex justify-between items-center">
                      <span>🗓 Schedule & Room</span>
                      <span className="flex items-center gap-2">
                        Capacity: 
                        <input type="number" value={formData.capacity} onChange={(e)=>setFormData({...formData, capacity: e.target.value})} className="w-16 p-1 text-center border border-blue-200 rounded-lg text-black bg-white" min="5" max="50"/>
                      </span>
                    </div>
                    
                    <div className="flex gap-4 bg-white p-3 rounded-xl border border-blue-100">
                      <div className="flex-1">
                        <label className="text-[9px] font-bold text-gray-400 uppercase block mb-1">Total Sessions</label>
                        <input type="number" value={formData.total_sessions} onChange={(e)=>setFormData({...formData, total_sessions: e.target.value})} className="w-full border border-blue-200 rounded-lg p-2 text-xs font-bold outline-none" min="1" required/>
                      </div>
                      <div className="flex-1">
                        <label className="text-[9px] font-bold text-gray-400 uppercase block mb-1">Sessions / Week</label>
                        <input type="number" value={formData.sessions_per_week} onChange={handleSessionsPerWeekChange} className="w-full border border-blue-200 rounded-lg p-2 text-xs font-bold outline-none" min="1" max="7" required/>
                      </div>
                    </div>

                    <div className="space-y-3 pt-2">
                      {formData.schedules.map((schedule, index) => (
                        <div key={index} className="flex gap-2 items-end bg-white p-3 rounded-xl border border-gray-100 shadow-sm relative">
                          <span className="absolute -left-2 -top-2 bg-[#0A1128] text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold">{index + 1}</span>
                          <div className="w-24">
                            <label className="text-[9px] font-bold text-gray-400 uppercase block mb-1 ml-1">Day</label>
                            <select value={schedule.day} onChange={(e)=>handleScheduleChange(index, 'day', e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs font-bold">
                              <option>Mon</option><option>Tue</option><option>Wed</option><option>Thu</option><option>Fri</option><option>Sat</option><option>Sun</option>
                            </select>
                          </div>
                          <div className="flex-1">
                            <label className="text-[9px] font-bold text-gray-400 uppercase block mb-1">Start</label>
                            <input type="time" value={schedule.startTime} onChange={(e)=>handleScheduleChange(index, 'startTime', e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs" required/>
                          </div>
                          <div className="flex-1">
                            <label className="text-[9px] font-bold text-gray-400 uppercase block mb-1">End</label>
                            <input type="time" value={schedule.endTime} onChange={(e)=>handleScheduleChange(index, 'endTime', e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs" required/>
                          </div>
                          <div className="w-32">
                            <label className="text-[9px] font-bold text-gray-400 uppercase block mb-1">Room</label>
                            <select value={schedule.room} onChange={(e)=>handleScheduleChange(index, 'room', e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs font-bold">
                              <option>Salle 05</option><option>Lab 02</option><option>Salle 12</option>
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <button type="submit" disabled={loading} className={`w-full text-white py-4 rounded-2xl font-bold shadow-lg transition-all active:scale-95 mt-4 cursor-pointer ${formData.course_type === 'Make-up Session' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-[#0A1128] hover:bg-blue-900'}`}>
                {loading ? 'Processing...' : (formData.course_type === 'Make-up Session' ? 'Add Make-up Session' : 'Create & Schedule Everything')}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* المودال تاع عرض التلاميذ يقعد كيما راه */}
      {modalView === 'studentsList' && selectedGroup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-3xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            
            <div className="bg-gray-50/80 p-6 border-b border-gray-100 flex justify-between items-center shrink-0">
              <div>
                <h2 className="text-2xl font-bold text-[#0A1128]">Students in {selectedGroup.name}</h2>
                <p className="text-xs text-gray-500 font-bold mt-1">
                  Teacher: <span className="text-blue-600">{selectedGroup.teacher_name}</span> • 
                  Total: {groupStudents.length} / {selectedGroup.capacity || 20} • 
                  <span className="text-[#4318FF] ml-1">Progress: {selectedGroup.completed_sessions || 0} / {selectedGroup.total_sessions || 24} Sessions</span>
                </p>
              </div>
              <button onClick={() => setModalView(null)} className="text-gray-400 hover:text-black text-2xl cursor-pointer w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200">✕</button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
              {loadingStudents ? (
                <div className="text-center text-gray-400 py-10 font-bold">Loading students... ⏳</div>
              ) : groupStudents.length > 0 ? (
                <div className="border border-gray-100 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 font-bold text-xs uppercase tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Student Name</th>
                        <th className="py-3 px-4">Email</th>
                        <th className="py-3 px-4">Phone</th>
                        <th className="py-3 px-4 text-center">Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {groupStudents.map(student => (
                        <tr key={student.id} className="hover:bg-blue-50/30">
                          <td className="py-3 px-4 font-bold text-[#0A1128]">{student.first_name} {student.last_name}</td>
                          <td className="py-3 px-4 text-gray-500">{student.email}</td>
                          <td className="py-3 px-4 font-medium">{student.phone}</td>
                          <td className="py-3 px-4 text-center font-bold text-green-600">{student.test_score || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 flex flex-col items-center">
                  <span className="text-4xl mb-3">🪑</span>
                  <p className="text-gray-400 font-bold">This group is currently empty.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Enrollment;
import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient'; 

const Enrollment = () => {
  const [modalView, setModalView] = useState(null); 
  const [classesData, setClassesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [teachersList, setTeachersList] = useState([]);
  const [roomsList, setRoomsList] = useState([]); // 💡 ستيت جديد للقاعات

  // 💡 جلب الأفواج 
  const fetchClasses = async () => {
    const { data } = await supabase
      .from('classes')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setClassesData(data);
  };

  // 💡 جلب الأساتذة والقاعات من الداتا باز
  const fetchTeachersAndRooms = async () => {
    const { data: teachers } = await supabase.from('staff').select('*').eq('role', 'Teacher').eq('status', 'Active'); 
    if (teachers) setTeachersList(teachers);

    const { data: rooms } = await supabase.from('rooms').select('*').order('name');
    if (rooms) setRoomsList(rooms);
  };

  useEffect(() => { 
    fetchClasses(); 
    fetchTeachersAndRooms();
  }, []);

  // 💡 الفورميلار بالتفاصيل تاعك كاملة
  const [formData, setFormData] = useState({
    language: 'English',
    level: 'A1',
    teacher_id: '', 
    capacity: 20,
    total_sessions: 24, 
    sessions_per_week: 2, 
    course_type: 'Regular',
    targetClassId: '',
    schedules: [
      { day: 'Mon', startTime: '10:00', endTime: '12:00', room: '' },
      { day: 'Wed', startTime: '10:00', endTime: '12:00', room: '' }
    ]
  });

  // 💡 ميزة غلق الفوج (Lock/Unlock)
  const toggleGroupLock = async (classId, currentStatus) => {
    const newStatus = currentStatus === 'Locked' ? 'Open' : 'Locked';
    const { error } = await supabase
      .from('classes')
      .update({ enrollment_status: newStatus })
      .eq('id', classId);
    
    if (!error) fetchClasses();
  };

  // 💡 حساب عدد الحصص في الأسبوع
  const handleSessionsPerWeekChange = (e) => {
    const count = parseInt(e.target.value) || 1;
    const newSchedules = [...formData.schedules];
    if (count > newSchedules.length) {
      for (let i = newSchedules.length; i < count; i++) {
        newSchedules.push({ day: 'Mon', startTime: '10:00', endTime: '12:00', room: '' });
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
  const [availableStudents, setAvailableStudents] = useState([]);
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [selectedNewStudent, setSelectedNewStudent] = useState('');

  const handleViewStudents = async (group) => {
    setSelectedGroup(group);
    setLoadingStudents(true);
    setModalView('studentsList'); 
    setIsAddingStudent(false);
    setSelectedNewStudent('');

    try {
      const { data: inscData, error } = await supabase
        .from('inscriptions')
        .select('students (*)')
        .eq('groupe', group.name)
        .eq('statut', 'Active');

      if (error) throw error;
      setGroupStudents(inscData?.map(i => i.students) || []);

      const { data: availData } = await supabase
        .from('students')
        .select('id, first_name, last_name, level')
        .eq('status', 'Pending Group');
      
      if (availData) {
         setAvailableStudents(availData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleAssignToThisGroup = async () => {
    if (selectedGroup.enrollment_status === 'Locked') return alert("❌ هذا الفوج مغلق للتسجيل!");
    if (!selectedNewStudent) return alert("⚠️ Please select a student first!");
    
    try {
      setLoadingStudents(true);
      const currentCount = selectedGroup.enrolled_count || 0;
      if (currentCount >= (selectedGroup.capacity || 20)) {
        alert("❌ الفوج ممتلئ!"); 
        setLoadingStudents(false);
        return;
      }
      
      const { data: cours } = await supabase.from('cours').select('id').eq('langue', selectedGroup.language).single();
      await supabase.from('inscriptions').insert([{
        student_id: selectedNewStudent,
        cours_id: cours.id,
        groupe: selectedGroup.name,
        annee_scolaire: '2025-2026',
        statut: 'Active'
      }]);

      await supabase.from('students').update({ status: 'Active' }).eq('id', selectedNewStudent);
      await supabase.from('classes').update({ enrolled_count: currentCount + 1 }).eq('id', selectedGroup.id);

      alert("✅ تم إضافة التلميذ بنجاح!");
      fetchClasses();
      handleViewStudents({ ...selectedGroup, enrolled_count: currentCount + 1 });
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleSaveAll = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const fullSchedule = formData.schedules.map(s => `${s.day} (${s.startTime}-${s.endTime}) - ${s.room}`).join(' | ');
      const groupName = `${formData.language} ${formData.level} - Group ${classesData.length + 1}`;

      const { data: newClass, error: classError } = await supabase.from('classes').insert([{
        name: groupName,
        language: formData.language,
        level: formData.level,
        schedule: fullSchedule,
        capacity: formData.capacity,
        total_sessions: formData.total_sessions,
        enrollment_status: 'Open'
      }]).select().single();

      if (classError) throw classError;

      if (formData.teacher_id) {
        const { data: cours } = await supabase.from('cours').select('id').eq('langue', formData.language).single();
        await supabase.from('affectations').insert([{
          teacher_id: formData.teacher_id,
          cours_id: cours?.id,
          groupe: groupName,
          annee_scolaire: '2025-2026'
        }]);
      }

      alert("✅ تم إنشاء الفوج وتعيين الأستاذ بنجاح!");
      setModalView(null);
      fetchClasses();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in w-full h-full flex flex-col relative p-4">
      <div className="flex justify-between items-end mb-6 border-b border-gray-200 pb-5">
        <div>
          <h2 className="text-3xl font-bold text-[#0A1128]">Groups Management</h2>
          <p className="text-sm text-gray-500">Manage classroom schedules, teachers, and student groups</p>
        </div>
        <button onClick={() => setModalView('unifiedForm')} className="bg-[#2563eb] text-white px-6 py-3 rounded-xl font-bold shadow-md cursor-pointer hover:bg-blue-700 transition-all">+ New Group Setup</button>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto custom-scrollbar rounded-xl">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-[#0A1128] font-bold">
              <tr>
                <th className="py-4 px-6">Group Name</th>
                <th className="py-4 px-6">Level</th>
                <th className="py-4 px-6">Schedule / Room</th>
                <th className="py-4 px-6 text-center">Status</th>
                <th className="py-4 px-6 text-center">Progress</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {classesData.map((row) => (
                <tr key={row.id} className="hover:bg-blue-50/30">
                  <td className="py-4 px-6 font-bold text-[#0A1128]">{row.name}</td>
                  <td className="py-4 px-6 font-medium text-blue-600">{row.language} {row.level}</td>
                  <td className="py-4 px-6 text-xs font-bold text-gray-500">{row.schedule}</td>
                  <td className="py-4 px-6 text-center">
                    <button 
                      onClick={() => toggleGroupLock(row.id, row.enrollment_status)}
                      className={`px-3 py-1 rounded-full text-[10px] font-black border transition-all cursor-pointer ${row.enrollment_status === 'Locked' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-green-50 text-green-600 border-green-200'}`}
                    >
                      {row.enrollment_status === 'Locked' ? '🔒 LOCKED' : '🔓 OPEN'}
                    </button>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="w-20 mx-auto">
                      <div className="text-[10px] font-bold mb-1">{row.enrolled_count || 0}/{row.capacity || 20}</div>
                      <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-blue-600 h-full" style={{ width: `${((row.enrolled_count || 0) / (row.capacity || 20)) * 100}%` }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center space-x-2">
                    <button onClick={() => handleViewStudents(row)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg cursor-pointer font-bold">👥 Students</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Unified Modal Form */}
      {modalView === 'unifiedForm' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl p-8 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#0A1128]">Group Creation Wizard</h2>
              <button onClick={() => setModalView(null)} className="text-gray-400 text-2xl hover:text-red-500">✕</button>
            </div>
            
            <form onSubmit={handleSaveAll} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Language">
                  <select value={formData.language} onChange={(e)=>setFormData({...formData, language: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-bold outline-none focus:border-blue-500">
                    <option>English</option><option>Français</option><option>Deutsch</option><option>Español</option>
                  </select>
                </FormField>
                <FormField label="Level">
                  <select value={formData.level} onChange={(e)=>setFormData({...formData, level: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-bold outline-none focus:border-blue-500">
                    {['A1','A2','B1','B2','C1','C2'].map(l => <option key={l}>{l}</option>)}
                  </select>
                </FormField>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Teacher (Affectation)">
                  <select value={formData.teacher_id} onChange={(e)=>setFormData({...formData, teacher_id: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-bold outline-none focus:border-blue-500">
                    <option value="">-- Choose Teacher --</option>
                    {teachersList.map(t => <option key={t.id} value={t.id}>Prof. {t.first_name} {t.last_name}</option>)}
                  </select>
                </FormField>
                <FormField label="Max Capacity">
                  <input type="number" value={formData.capacity} onChange={(e)=>setFormData({...formData, capacity: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-bold outline-none focus:border-blue-500" />
                </FormField>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <FormField label="Course Type">
                  <select value={formData.course_type} onChange={(e)=>setFormData({...formData, course_type: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-bold outline-none focus:border-blue-500">
                    <option>Regular</option><option>Intensive</option><option>Weekend</option>
                  </select>
                </FormField>
                <FormField label="Total Sessions">
                  <input type="number" value={formData.total_sessions} onChange={(e)=>setFormData({...formData, total_sessions: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-bold outline-none focus:border-blue-500" />
                </FormField>
                <FormField label="Sessions / Week">
                  <input type="number" min="1" max="7" value={formData.sessions_per_week} onChange={handleSessionsPerWeekChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-bold outline-none focus:border-blue-500" />
                </FormField>
              </div>

              <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                <h4 className="text-xs font-black text-blue-600 uppercase mb-4 tracking-widest">Schedules & Logistics</h4>
                {formData.schedules.map((sch, i) => (
                  <div key={i} className="flex gap-2 mb-3 bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                    <select value={sch.day} onChange={(e)=>handleScheduleChange(i, 'day', e.target.value)} className="flex-1 text-xs font-bold border-none outline-none">
                      <option>Mon</option><option>Tue</option><option>Wed</option><option>Thu</option><option>Fri</option><option>Sat</option><option>Sun</option>
                    </select>
                    <input type="time" value={sch.startTime} onChange={(e)=>handleScheduleChange(i, 'startTime', e.target.value)} className="flex-1 text-xs outline-none" />
                    <span className="text-gray-400 font-bold">-</span>
                    <input type="time" value={sch.endTime} onChange={(e)=>handleScheduleChange(i, 'endTime', e.target.value)} className="flex-1 text-xs outline-none" />
                    
                    {/* 💡 قراءة القاعات من الداتا باز */}
                    <select value={sch.room} onChange={(e)=>handleScheduleChange(i, 'room', e.target.value)} className="flex-1 text-xs font-bold border-none outline-none" required>
                      <option value="">-- Room --</option>
                      {roomsList.map(r => <option key={r.id} value={r.name}>{r.name} ({r.capacity})</option>)}
                    </select>
                  </div>
                ))}
              </div>

              <button type="submit" className="w-full bg-[#0A1128] text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-blue-900 transition-all">
                {loading ? 'Creating...' : 'Deploy Group'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Students List Modal */}
      {modalView === 'studentsList' && selectedGroup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-3xl bg-white rounded-[2rem] shadow-2xl flex flex-col max-h-[85vh]">
            <div className="bg-gray-50 p-6 border-b flex justify-between items-center rounded-t-[2rem]">
              <div>
                <h2 className="text-2xl font-bold text-[#0A1128]">Roster: {selectedGroup.name}</h2>
                <div className="text-[10px] font-black text-blue-600 mt-1 uppercase tracking-tighter">Status: {selectedGroup.enrollment_status} • Count: {groupStudents.length}/{selectedGroup.capacity}</div>
              </div>
              <button onClick={() => setModalView(null)} className="text-gray-400 text-2xl hover:text-red-500">✕</button>
            </div>

            {selectedGroup.enrollment_status === 'Open' && (
              <div className="p-4 bg-green-50 border-b border-green-100 flex gap-2">
                <select 
                  value={selectedNewStudent} 
                  onChange={(e)=>setSelectedNewStudent(e.target.value)}
                  className="flex-1 bg-white border border-green-200 rounded-xl p-2 text-xs font-bold outline-none focus:border-green-500"
                >
                  <option value="">-- Quick Enroll Pending Student --</option>
                  {availableStudents.map(s => <option key={s.id} value={s.id}>{s.first_name} {s.last_name} ({s.level})</option>)}
                </select>
                <button onClick={handleAssignToThisGroup} className="bg-green-600 text-white px-6 rounded-xl text-xs font-bold cursor-pointer hover:bg-green-700 shadow-md">Add</button>
              </div>
            )}

            <div className="p-6 overflow-y-auto custom-scrollbar">
              <table className="w-full text-left text-sm">
                <thead className="text-gray-400 font-bold text-[10px] uppercase">
                  <tr><th className="pb-4">Student Name</th><th className="pb-4">Phone</th><th className="pb-4 text-center">Actions</th></tr>
                </thead>
                <tbody>
                  {groupStudents.map(s => (
                    <tr key={s.id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="py-4 font-bold text-[#0A1128]">{s.first_name} {s.last_name}</td>
                      <td className="py-4 text-gray-500 font-medium">{s.phone}</td>
                      <td className="py-4 text-center">
                        <button className="text-red-400 hover:text-red-600 text-xs font-bold bg-red-50 px-3 py-1.5 rounded-lg">Unenroll</button>
                      </td>
                    </tr>
                  ))}
                  {groupStudents.length === 0 && (
                    <tr><td colSpan="3" className="py-8 text-center text-gray-400 text-sm font-bold">No students enrolled yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const FormField = ({ label, children }) => (
  <div className="flex flex-col gap-2">
    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{label}</label>
    {children}
  </div>
);

export default Enrollment;
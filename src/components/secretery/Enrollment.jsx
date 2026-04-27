import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient'; 

const Enrollment = () => {
  const [modalView, setModalView] = useState(null); 
  const [classesData, setClassesData] = useState([]);
  const [loading, setLoading] = useState(false);

  // 💡 جلب الأفواج مع حالة الغلق (Enrollment Status)
  const fetchClasses = async () => {
    const { data } = await supabase
      .from('classes')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setClassesData(data);
  };

  useEffect(() => { fetchClasses(); }, []);

  const [formData, setFormData] = useState({
    language: 'English',
    level: 'A1',
    teacher_id: '', // تبدلت لـ ID باش نخدمو بجدول affectations
    capacity: 20,
    total_sessions: 24, 
    sessions_per_week: 2, 
    course_type: 'Regular',
    targetClassId: '',
    schedules: [
      { day: 'Mon', startTime: '10:00', endTime: '12:00', room: 'Salle 05' },
      { day: 'Wed', startTime: '10:00', endTime: '12:00', room: 'Salle 05' }
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
      // جلب التلاميذ من جدول inscriptions (الطريقة الجديدة)
      const { data: inscData, error } = await supabase
        .from('inscriptions')
        .select('students (*)')
        .eq('groupe', group.name)
        .eq('statut', 'Active');

      if (error) throw error;
      setGroupStudents(inscData?.map(i => i.students) || []);

      // جلب التلاميذ اللي يستناو نفس اللغة والمستوى
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
      
      // 1. إضافة في جدول inscriptions
      const { data: cours } = await supabase.from('cours').select('id').eq('langue', selectedGroup.language).single();
      await supabase.from('inscriptions').insert([{
        student_id: selectedNewStudent,
        cours_id: cours.id,
        groupe: selectedGroup.name,
        annee_scolaire: '2025-2026'
      }]);

      // 2. تحديث حالة الطالب
      await supabase.from('students').update({ status: 'Active' }).eq('id', selectedNewStudent);

      // 3. تحديث عدد المسجلين
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

      // 1. إنشاء الفوج في جدول classes
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

      // 2. ربط الأستاذ بالفوج (جدول affectations)
      if (formData.teacher_id) {
        const { data: cours } = await supabase.from('cours').select('id').eq('langue', formData.language).single();
        await supabase.from('affectations').insert([{
          teacher_id: formData.teacher_id,
          cours_id: cours.id,
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
  
  const [teachersList, setTeachersList] = useState([]);
  useEffect(() => {
    const fetchTeachers = async () => {
      const { data } = await supabase.from('staff').select('*').eq('role', 'Teacher').eq('status', 'Active'); 
      if (data) setTeachersList(data);
    };
    fetchTeachers();
  }, []);

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
                      <div className="text-[10px] font-bold mb-1">{row.completed_sessions || 0}/{row.total_sessions || 24}</div>
                      <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-blue-600 h-full" style={{ width: `${((row.completed_sessions || 0) / (row.total_sessions || 24)) * 100}%` }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center space-x-2">
                    <button onClick={() => handleViewStudents(row)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg cursor-pointer">👥 Students</button>
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
              <button onClick={() => setModalView(null)} className="text-gray-400 text-2xl">✕</button>
            </div>
            
            <form onSubmit={handleSaveAll} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Language">
                  <select value={formData.language} onChange={(e)=>setFormData({...formData, language: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-bold">
                    <option>English</option><option>Français</option><option>Deutsch</option>
                  </select>
                </FormField>
                <FormField label="Teacher (Affectation)">
                  <select value={formData.teacher_id} onChange={(e)=>setFormData({...formData, teacher_id: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-bold">
                    <option value="">-- Choose Teacher --</option>
                    {teachersList.map(t => <option key={t.id} value={t.id}>Prof. {t.first_name}</option>)}
                  </select>
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
                    <select value={sch.room} onChange={(e)=>handleScheduleChange(i, 'room', e.target.value)} className="flex-1 text-xs font-bold border-none outline-none">
                      <option>Salle 05</option><option>Lab 02</option><option>Salle 12</option>
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
            <div className="bg-gray-50 p-6 border-b flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Roster: {selectedGroup.name}</h2>
                <div className="text-[10px] font-black text-blue-600 mt-1 uppercase tracking-tighter">Status: {selectedGroup.enrollment_status} • Count: {groupStudents.length}/{selectedGroup.capacity}</div>
              </div>
              <button onClick={() => setModalView(null)} className="text-gray-400 text-2xl">✕</button>
            </div>

            {selectedGroup.enrollment_status === 'Open' && (
              <div className="p-4 bg-green-50 border-b border-green-100 flex gap-2">
                <select 
                  value={selectedNewStudent} 
                  onChange={(e)=>setSelectedNewStudent(e.target.value)}
                  className="flex-1 bg-white border border-green-200 rounded-xl p-2 text-xs font-bold"
                >
                  <option value="">-- Quick Enroll Student --</option>
                  {availableStudents.map(s => <option key={s.id} value={s.id}>{s.first_name} {s.last_name} ({s.level})</option>)}
                </select>
                <button onClick={handleAssignToThisGroup} className="bg-green-600 text-white px-4 rounded-xl text-xs font-bold cursor-pointer hover:bg-green-700">Add</button>
              </div>
            )}

            <div className="p-6 overflow-y-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-gray-400 font-bold text-[10px] uppercase">
                  <tr><th className="pb-4">Name</th><th className="pb-4">Phone</th><th className="pb-4 text-center">Actions</th></tr>
                </thead>
                <tbody>
                  {groupStudents.map(s => (
                    <tr key={s.id} className="border-t">
                      <td className="py-3 font-bold">{s.first_name} {s.last_name}</td>
                      <td className="py-3 text-gray-500">{s.phone}</td>
                      <td className="py-3 text-center">
                        <button className="text-red-400 hover:text-red-600 text-xs font-bold">Unenroll</button>
                      </td>
                    </tr>
                  ))}
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
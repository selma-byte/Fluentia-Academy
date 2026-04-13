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

  // 💡 1. فورميلار موحد 
  const [formData, setFormData] = useState({
    language: 'English',
    level: 'A1',
    teacher: '', 
    room: 'Salle 05',
    day: 'Mon',
    startTime: '10:00',
    endTime: '12:00',
    capacity: 20 // 💡 زدنا الليميت هنا (20 تلميذ بار ديفو)
  });

  // 💡 States لنافذة التلاميذ
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupStudents, setGroupStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  // 💡 دالة السحر اللي تجيب تلاميذ كلاس معين
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

  // 💡 2. دالة السحر: تكريه اسم الجروب
  const generateGroupName = () => {
    const count = classesData.filter(c => c.language === formData.language && c.level.includes(formData.level)).length + 1;
    return `${formData.language} ${formData.level} - Group ${count}`;
  };

  const handleSaveAll = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.teacher) {
      alert("⚠️ من فضلك خيري أستاذ من القائمة!");
      setLoading(false); return;
    }

    const groupName = generateGroupName();
    const fullSchedule = `${formData.day} (${formData.startTime}-${formData.endTime}) - ${formData.room}`;

    try {
      // 💡 3. التحقق من تداخل الوقت
      const { data: conflicts } = await supabase.from('classes').select('schedule');
      const hasConflict = conflicts?.some(c => c.schedule.includes(formData.day) && c.schedule.includes(formData.room) && 
        (formData.startTime < c.schedule.match(/\d{2}:\d{2}/g)?.[1] && formData.endTime > c.schedule.match(/\d{2}:\d{2}/g)?.[0]));

      if (hasConflict) {
        alert(`⚠️ القاعة ${formData.room} محجوزة! خيري وقت آخر.`);
        setLoading(false); return;
      }

      // 💡 4. تسجيل الكلاس مع الليميت والعداد (0)
      const { error } = await supabase.from('classes').insert([{
        name: groupName,
        language: formData.language,
        level: formData.level,
        teacher_name: formData.teacher,
        schedule: fullSchedule,
        capacity: formData.capacity, // 💡 الحد الأقصى
        enrolled_count: 0 // 💡 يبدا بـ 0 تلاميذ
      }]);

      if (error) throw error;
      alert(`✅ تم إنشاء ${groupName} وبرمجته بنجاح!`);
      
      setFormData({ ...formData, teacher: '' });
      setModalView(null);
      fetchClasses();
      
    } catch (err) { alert(err.message); } finally { setLoading(false); }
  };
  
  // 💡 State الأساتذة
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
          <p className="text-sm text-gray-500">Create and schedule groups in one step</p>
        </div>
        <button onClick={() => setModalView('unifiedForm')} className="bg-[#2563eb] text-white px-6 py-3 rounded-xl font-bold shadow-md cursor-pointer">+ New Group & Schedule</button>
      </div>

      {/* 💡 الجدول مع عمود Capacity الجديد */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto custom-scrollbar rounded-xl border border-gray-100">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-[#0A1128] font-bold sticky top-0">
              <tr>
                <th className="py-4 px-6">Group Name</th>
                <th className="py-4 px-6">Language</th>
                <th className="py-4 px-6">Schedule / Room</th>
                <th className="py-4 px-6">Teacher</th>
                <th className="py-4 px-6 text-center">Capacity</th> {/* 💡 العمود الجديد */}
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {classesData.map((row) => {
                // 💡 حساب هل الفوج ممتلئ
                const currentCount = row.enrolled_count || 0;
                const maxCapacity = row.capacity || 20;
                const isFull = currentCount >= maxCapacity;

                return (
                  <tr key={row.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="py-4 px-6 font-bold text-[#0A1128]">{row.name}</td>
                    <td className="py-4 px-6 font-medium text-blue-600">{row.language} ({row.level})</td>
                    <td className="py-4 px-6 text-gray-600 font-bold text-xs">{row.schedule}</td>
                    <td className="py-4 px-6 font-medium text-[#0A1128]">{row.teacher_name}</td>
                    
                    {/* 💡 عرض العداد بطريقة شابة */}
                    <td className="py-4 px-6 text-center">
                      <div className="flex flex-col items-center">
                        <span className={`text-[11px] font-black px-3 py-1 rounded-lg border ${
                          isFull ? 'bg-red-50 text-red-600 border-red-200' : 
                          currentCount > 0 ? 'bg-green-50 text-green-600 border-green-200' : 
                          'bg-gray-50 text-gray-500 border-gray-200'
                        }`}>
                          {currentCount} / {maxCapacity}
                        </span>
                        {isFull && <span className="text-[9px] text-red-500 font-bold mt-1 uppercase tracking-widest">Full</span>}
                      </div>
                    </td>

                    <td className="py-4 px-6 text-center text-gray-400 space-x-3">
                      <button onClick={() => handleViewStudents(row)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg cursor-pointer" title="View Students">👥</button>
                      <button className="hover:bg-gray-50 p-2 rounded-lg">✏️</button>
                      <button className="hover:bg-red-50 p-2 rounded-lg text-red-500">🗑</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* المودال تاع إنشاء الفوج */}
      {modalView === 'unifiedForm' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden">
            <div className="bg-gray-50/80 p-8 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-[#0A1128]">Quick Group Setup</h2>
                <p className="text-xs text-gray-400 font-bold uppercase mt-1">Automatic Name: <span className="text-blue-600">{generateGroupName()}</span></p>
              </div>
              <button onClick={() => setModalView(null)} className="text-gray-400 hover:text-black text-2xl cursor-pointer">✕</button>
            </div>
            
            <form onSubmit={handleSaveAll} className="p-8 space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase mb-2 block">Language</label>
                  <select value={formData.language} onChange={(e)=>setFormData({...formData, language: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-bold">
                    <option>English</option><option>Français</option><option>Deutsch</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase mb-2 block">Level</label>
                  <select value={formData.level} onChange={(e)=>setFormData({...formData, level: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-bold">
                    <option>A1</option><option>A2</option><option>B1</option><option>B2</option><option>C1</option>
                  </select>
                </div>
                <div className="col-span-2">
                 <label className="text-[10px] font-bold text-gray-400 uppercase mb-2 block">Assign Teacher</label>
                 <select value={formData.teacher}  onChange={(e) => setFormData({...formData, teacher: e.target.value})} 
                 className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-bold cursor-pointer">
                   <option value="">-- Select Teacher --</option>
                    {teachersList.map((t) => (
                    <option key={t.id} value={`${t.first_name} ${t.last_name}`}>
                     Prof. {t.first_name} {t.last_name}
                    </option>
                   ))}
                  </select>
                  </div>
              </div>

              <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 grid grid-cols-2 gap-6">
                <div className="col-span-2 text-blue-600 font-bold text-xs uppercase tracking-widest mb-2 flex justify-between">
                  <span>🗓 Schedule & Room</span>
                  {/* 💡 زدنا إمكانية تغيير الليميت */}
                  <span className="flex items-center gap-2">
                    Capacity Limit: 
                    <input type="number" value={formData.capacity} onChange={(e)=>setFormData({...formData, capacity: e.target.value})} className="w-16 p-1 text-center border border-blue-200 rounded-lg text-black bg-white" min="5" max="50"/>
                  </span>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Classroom</label>
                  <select value={formData.room} onChange={(e)=>setFormData({...formData, room: e.target.value})} className="w-full bg-white border border-blue-200 rounded-xl p-3 text-sm font-bold">
                    <option>Salle 05</option><option>Lab 02</option><option>Salle 12</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Day</label>
                  <select value={formData.day} onChange={(e)=>setFormData({...formData, day: e.target.value})} className="w-full bg-white border border-blue-200 rounded-xl p-3 text-sm font-bold">
                    <option>Mon</option><option>Tue</option><option>Wed</option><option>Thu</option><option>Fri</option><option>Sat</option>
                  </select>
                </div>
                <div className="col-span-2 flex gap-4">
                  <div className="flex-1"><label className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Start</label><input type="time" value={formData.startTime} onChange={(e)=>setFormData({...formData, startTime: e.target.value})} className="w-full border border-blue-200 rounded-xl p-3 text-sm" required/></div>
                  <div className="flex-1"><label className="text-[10px] font-bold text-gray-400 uppercase block mb-2">End</label><input type="time" value={formData.endTime} onChange={(e)=>setFormData({...formData, endTime: e.target.value})} className="w-full border border-blue-200 rounded-xl p-3 text-sm" required/></div>
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full bg-[#0A1128] hover:bg-blue-900 text-white py-4 rounded-2xl font-bold shadow-lg transition-all active:scale-95">{loading ? 'Processing...' : 'Create & Schedule Everything'}</button>
            </form>
          </div>
        </div>
      )}

      {/* المودال تاع عرض التلاميذ */}
      {modalView === 'studentsList' && selectedGroup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-3xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            
            <div className="bg-gray-50/80 p-6 border-b border-gray-100 flex justify-between items-center shrink-0">
              <div>
                <h2 className="text-2xl font-bold text-[#0A1128]">Students in {selectedGroup.name}</h2>
                <p className="text-xs text-gray-500 font-bold mt-1">Teacher: <span className="text-blue-600">{selectedGroup.teacher_name}</span> • Total: {groupStudents.length} / {selectedGroup.capacity || 20}</p>
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
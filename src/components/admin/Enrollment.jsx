import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

const Enrollment = () => {
  // --- Data State ---
  const [groups, setGroups] = useState([]);

  // --- UI States ---
  const [modalView, setModalView] = useState(null); // 'create', 'schedule', 'confirmDelete'
  const [isEditing, setIsEditing] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [alert, setAlert] = useState({ show: false, message: '' });

  // --- The "Saisir" (Form) State ---
  const [formData, setFormData] = useState({
    group: '', language: 'English', level: 'A1', duration: '12 Weeks',
    teacher: 'Prof. Nadia', room: 'Salle 05', target: 'General',
    startDate: '', endDate: ''
  });

  const triggerAlert = (msg) => {
    setAlert({ show: true, message: msg });
    setTimeout(() => setAlert({ show: false, message: '' }), 3000);
  };

  const fetchClasses = async () => {
    const { data } = await supabase.from('classes').select('*').order('created_at', { ascending: false });
    if (data) {
      const formatted = data.map(row => ({
        id: row.id,
        group: row.name,
        language: row.language,
        level: row.level,
        room: row.schedule?.split('- ').pop() || 'Salle 12',
        teacher: row.teacher_name,
        enr: row.enrolled_count || 0,
        max: row.capacity || 20,
        duration: '12 Weeks',
        target: 'Adults',
        startDate: row.created_at ? row.created_at.split('T')[0] : '2026-01-20',
        endDate: '2026-04-15'
      }));
      setGroups(formatted);
    }
  };

  useEffect(() => { fetchClasses(); }, []);

  const openEdit = (group) => {
    setSelectedGroup(group);
    setFormData({ ...group });
    setIsEditing(true);
    setModalView('create');
  };

  const handleFinish = async (e) => {
    e.preventDefault();
    const groupName = formData.group || `${formData.language} ${formData.level}`;
    const schedule = `${formData.startDate} to ${formData.endDate} - ${formData.room}`;

    if (isEditing) {
      await supabase.from('classes').update({
        name: formData.group, language: formData.language, level: formData.level,
        teacher_name: formData.teacher, schedule: schedule
      }).eq('id', selectedGroup.id);
      triggerAlert("Group updated successfully!");
    } else {
      await supabase.from('classes').insert([{
        name: groupName,
        language: formData.language,
        level: formData.level,
        teacher_name: formData.teacher,
        schedule: schedule,
        capacity: 25,
        enrolled_count: 0
      }]);
      triggerAlert("New group added to system!");
    }
    closeModals();
    fetchClasses();
  };

  const handleDelete = async () => {
    await supabase.from('classes').delete().eq('id', selectedGroup.id);
    triggerAlert("Group deleted successfully.");
    closeModals();
    fetchClasses();
  };

  const closeModals = () => {
    setModalView(null);
    setIsEditing(false);
    setFormData({ group: '', language: 'English', level: 'A1', duration: '12 Weeks', teacher: 'Prof. Nadia', room: 'Salle 05', target: 'General', startDate: '', endDate: '' });
  };

  const filteredGroups = groups.filter(g =>
    g.group.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.language.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full h-full flex flex-col bg-[#F8FAFC] p-8 font-sans">

      {/* BLUE SYSTEM ALERT (Used for Delete and Add) */}
      {alert.show && (
        <div className="fixed top-8 right-8 z-[300] flex items-center bg-[#1E293B] border-l-4 border-[#3B82F6] px-6 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-top-4">
          <div className="bg-[#3B82F6] text-white p-1.5 rounded-full mr-4 text-[10px]">✓</div>
          <div>
            <p className="text-white font-bold text-xs uppercase tracking-widest">Notification</p>
            <p className="text-gray-400 text-xs">{alert.message}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-10 border-b border-gray-200 pb-8 shrink-0">
        <div>
          <h2 className="text-3xl font-black text-[#0F172A] tracking-tight">Enrollment Management</h2>
          <p className="text-sm text-slate-500 font-medium">Create and manage academic language groups</p>
        </div>
        <button
          onClick={() => { setIsEditing(false); setModalView('create'); }}
          className="bg-[#3B82F6] hover:bg-[#2563EB] text-white px-10 py-4 rounded-[1.2rem] text-sm font-bold shadow-xl shadow-blue-100 transition-all active:scale-95"
        >
          + Add New Group
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm flex-1 flex flex-col min-h-0">
        <div className="flex justify-between items-center mb-8">
          <h3 className="font-bold text-[#0F172A] text-xl">Active Language Groups</h3>
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-80 bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-6 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
            placeholder="Search by group or language..."
          />
        </div>

        <div className="overflow-x-auto flex-1 rounded-3xl border border-slate-50">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/50 text-slate-500 font-bold sticky top-0 uppercase text-[10px] tracking-widest">
              <tr>
                <th className="py-6 px-6">Group Info</th>
                <th className="py-6 px-6">Academic Period</th>
                <th className="py-6 px-6">Teacher / Room</th>
                <th className="py-6 px-6">Target</th>
                <th className="py-6 px-6">Capacity</th>
                <th className="py-6 px-6 text-center">Manage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredGroups.map((row) => (
                <tr key={row.id} className="hover:bg-blue-50/20 transition-colors">
                  <td className="py-6 px-6">
                    <div className="font-bold text-[#0F172A] text-base">{row.group}</div>
                    <div className="text-blue-600 font-semibold text-xs">{row.language} • {row.level}</div>
                  </td>
                  <td className="py-6 px-6">
                    <div className="text-slate-700 font-medium">{row.startDate}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">To {row.endDate}</div>
                  </td>
                  <td className="py-6 px-6">
                    <div className="text-slate-700 font-bold">{row.teacher}</div>
                    <div className="text-xs text-slate-400">{row.room} • {row.duration}</div>
                  </td>
                  <td className="py-6 px-6 font-medium text-slate-500">{row.target}</td>
                  <td className="py-6 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: `${(row.enr / row.max) * 100}%` }}></div>
                      </div>
                      <span className="text-[10px] font-black text-slate-400">{row.enr}/{row.max}</span>
                    </div>
                  </td>
                  <td className="py-6 px-6 text-center">
                    <div className="flex justify-center gap-4">
                      <button onClick={() => openEdit(row)} className="p-2 hover:bg-blue-50 rounded-xl transition-all cursor-pointer">
                        <img src="https://img.icons8.com/fluency/48/edit.png" className="w-5 h-5" />
                      </button>
                      <button onClick={() => { setSelectedGroup(row); setModalView('confirmDelete'); }} className="p-2 hover:bg-red-50 rounded-xl transition-all cursor-pointer">
                        <img src="https://img.icons8.com/fluency/48/delete-trash.png" className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL STEP 1: IDENTITY & SAISIR */}
      {modalView === 'create' && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/40 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl p-12 animate-in zoom-in">
            <h2 className="text-3xl font-black text-[#0F172A] mb-2">{isEditing ? 'Edit Group' : 'New Group Registration'}</h2>
            <p className="text-sm text-slate-400 mb-10 border-b pb-6 uppercase tracking-widest font-bold">Step 1: Academic Identity</p>

            <form onSubmit={(e) => { e.preventDefault(); setModalView('schedule'); }} className="grid grid-cols-2 gap-8">
              <div className="col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Group Name (Saisir)</label>
                <input required value={formData.group} onChange={(e) => setFormData({ ...formData, group: e.target.value })} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4.5 text-sm outline-none focus:border-blue-500 transition-all" placeholder="e.g., Groupe 1 - English Intermediate" />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Language</label>
                <select value={formData.language} onChange={(e) => setFormData({ ...formData, language: e.target.value })} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4.5 text-sm outline-none">
                  <option>English</option>
                  <option>Français</option>
                  <option>Deutsch</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">CEFR Level</label>
                <select value={formData.level} onChange={(e) => setFormData({ ...formData, level: e.target.value })} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4.5 text-sm outline-none">
                  <option>A1</option><option>A2</option><option>B1</option><option>B2</option><option>C1</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Total Duration</label>
                <input required value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4.5 text-sm outline-none" placeholder="e.g., 10 Weeks" />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Target Group</label>
                <input value={formData.target} onChange={(e) => setFormData({ ...formData, target: e.target.value })} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4.5 text-sm outline-none" placeholder="e.g., Kids, Adults, Professionals" />
              </div>
              <div className="col-span-2 flex gap-4 pt-6">
                <button type="submit" className="flex-1 bg-[#3B82F6] text-white py-5 rounded-[1.5rem] font-black shadow-lg">Continue to Scheduling</button>
                <button type="button" onClick={closeModals} className="px-10 bg-slate-100 text-slate-500 py-5 rounded-[1.5rem] font-bold">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL STEP 2: LOGISTICS & SAISIR */}
      {modalView === 'schedule' && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/40 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl p-12 animate-in slide-in-from-bottom duration-300">
            <h2 className="text-3xl font-black text-[#0F172A] mb-2">Finalize Logistics</h2>
            <p className="text-sm text-slate-400 mb-10 border-b pb-6 uppercase tracking-widest font-bold">Step 2: Dates, Teacher & Venue</p>

            <form onSubmit={handleFinish} className="grid grid-cols-2 gap-8">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Start Date</label>
                <input required type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4.5 text-sm outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">End Date</label>
                <input required type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4.5 text-sm outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Assign Teacher</label>
                <select value={formData.teacher} onChange={(e) => setFormData({ ...formData, teacher: e.target.value })} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4.5 text-sm outline-none">
                  <option>Prof. Hassan</option><option>Prof. Nadia</option><option>Prof. Karim</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Room No.</label>
                <select value={formData.room} onChange={(e) => setFormData({ ...formData, room: e.target.value })} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4.5 text-sm outline-none">
                  <option>Salle 05</option><option>Salle 12</option><option>Lab 02</option>
                </select>
              </div>
              <div className="col-span-2 flex gap-4 pt-6">
                <button type="submit" className="flex-1 bg-[#3B82F6] text-white py-5 rounded-[1.5rem] font-black shadow-lg">
                  {isEditing ? 'Save All Changes' : 'Activate Group Now'}
                </button>
                <button type="button" onClick={() => setModalView('create')} className="px-10 bg-slate-100 text-slate-500 py-5 rounded-[1.5rem] font-bold">Go Back</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BLUE CONFIRMATION MODAL FOR DELETE */}
      {modalView === 'confirmDelete' && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white rounded-[2.5rem] shadow-2xl p-10 text-center animate-in zoom-in">
            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-black italic">!</div>
            <h3 className="text-2xl font-black text-[#0F172A] mb-3">Delete Group?</h3>
            <p className="text-sm text-slate-400 mb-10 leading-relaxed">You are about to remove <span className="font-bold text-slate-900">{selectedGroup?.group}</span> from the academic database.</p>
            <div className="flex flex-col gap-3">
              <button onClick={handleDelete} className="w-full bg-blue-600 text-white py-4.5 rounded-2xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100">Confirm Deletion</button>
              <button onClick={() => setModalView(null)} className="w-full bg-slate-100 text-slate-500 py-4.5 rounded-2xl font-bold">Cancel</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Enrollment;
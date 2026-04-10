import React, { useState } from 'react';

const Enrollment = () => {
  const [modalView, setModalView] = useState(null); // null, 'createCourse', 'scheduleSession'

  // بيانات مجموعات اللغات (Language Groups & Levels)
  const classesData = [
    { group: 'Groupe 1 - Débutant', language: 'Français', level: 'Niveau A1', room: 'Salle 12', teacher: 'Prof. Nadia', enr: 15, max: 20, session: 'Session Automne', mode: 'Présentiel' },
    { group: 'Group 3 - Intermediate', language: 'English', level: 'Level B1', room: 'Salle 05', teacher: 'Prof. Hassan', enr: 18, max: 20, session: 'Session Automne', mode: 'Présentiel' },
    { group: 'Gruppe 2 - Fortgeschritten', language: 'Deutsch', level: 'Niveau B2', room: 'Lab 02', teacher: 'Prof. Karim', enr: 12, max: 15, session: 'Session Automne', mode: 'Hybride' },
  ];

  const handleCreateCourse = (e) => {
    e.preventDefault();
    setModalView('scheduleSession');
  };

  const handleScheduleSession = (e) => {
    e.preventDefault();
    setModalView(null);
    alert("Session Programmée avec succès !");
  };

  return (
    <div className="animate-fade-in w-full h-full flex flex-col relative">
      
      <div className="flex justify-between items-end mb-6 border-b border-gray-200 pb-5 shrink-0">
        <div>
          <h2 className="text-3xl font-bold text-[#0A1128] mb-2">Groups & Levels Management</h2>
          <p className="text-sm text-gray-500">Manage language groups, levels, and classroom assignments</p>
        </div>
        <button 
          onClick={() => setModalView('createCourse')}
          className="bg-[#2563eb] hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-sm transition-colors flex items-center cursor-pointer"
        >
          <span className="mr-2 text-lg">+</span> Add Group
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex-1 flex flex-col min-h-0">
        <div className="flex justify-between items-center mb-6 shrink-0">
          <div>
            <h3 className="font-bold text-[#0A1128] text-lg">Active Groups (3)</h3>
            <p className="text-xs text-gray-500 mt-1">All currently active language groups in the institute</p>
          </div>
        </div>

        <div className="mb-6 relative w-[400px] shrink-0">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">🔍</span>
          <input 
            type="text" 
            placeholder="Search groups by language, level, or teacher..." 
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 transition-colors" 
          />
        </div>

        <div className="overflow-x-auto flex-1 custom-scrollbar border border-gray-100 rounded-xl">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 text-[#0A1128] font-bold sticky top-0 z-10">
              <tr>
                <th className="py-4 px-6">Group Name</th>
                <th className="py-4 px-6">Language</th>
                <th className="py-4 px-6">Level (CEFR)</th>
                <th className="py-4 px-6">Classroom</th>
                <th className="py-4 px-6">Teacher</th>
                <th className="py-4 px-6">Enrollment</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {classesData.map((row, index) => (
                <tr key={index} className="hover:bg-blue-50/30 transition-colors">
                  <td className="py-4 px-6 font-bold text-[#0A1128]">{row.group}</td>
                  <td className="py-4 px-6 font-medium text-blue-600">{row.language}</td>
                  <td className="py-4 px-6">
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold border border-gray-200">
                      {row.level}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-600">{row.room}</td>
                  <td className="py-4 px-6 font-medium text-[#0A1128]">{row.teacher}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center mb-1.5">
                      <span className="text-gray-400 mr-2 text-sm">👥</span>
                      <span className="text-xs font-bold text-gray-700">{row.enr}/{row.max}</span>
                    </div>
                    <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-[#2563eb] rounded-full" style={{ width: `${(row.enr / row.max) * 100}%` }}></div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center space-x-3 text-gray-400">
                    <button className="hover:text-blue-600 transition-colors text-lg cursor-pointer">✏️</button>
                    <button className="hover:text-red-600 transition-colors text-lg cursor-pointer">🗑</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* النافذة الأولى: إضافة مجموعة/دورة لغة جديدة */}
      {modalView === 'createCourse' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl animate-fade-in-up flex flex-col overflow-hidden">
            
            <div className="flex justify-between items-center p-8 border-b border-gray-100 bg-gray-50/50">
              <div>
                <h2 className="text-2xl font-bold text-[#0A1128] mb-1">Create New Language Group</h2>
                <p className="text-sm text-gray-500">Set up a new learning group and define its level.</p>
              </div>
              <button onClick={() => setModalView(null)} className="text-gray-400 hover:text-black text-2xl cursor-pointer">✕</button>
            </div>
            
            <div className="p-8 overflow-y-auto max-h-[80vh] custom-scrollbar">
              <form onSubmit={handleCreateCourse} className="space-y-6">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">Group Name</label>
                    <input type="text" required placeholder="e.g., Groupe 1 - English Adultes" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-[#2563eb] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">Language</label>
                    <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-[#2563eb] cursor-pointer transition-colors">
                      <option>English</option>
                      <option>Français</option>
                      <option>Deutsch</option>
                      <option>Español</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">Level (CEFR)</label>
                    <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-[#2563eb] cursor-pointer transition-colors">
                      <option>A1 (Beginner)</option>
                      <option>A2 (Elementary)</option>
                      <option>B1 (Intermediate)</option>
                      <option>B2 (Upper Intermediate)</option>
                      <option>C1 (Advanced)</option>
                      <option>C2 (Proficient)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">Duration (Weeks)</label>
                    <input type="text" required placeholder="e.g., 12 Weeks" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-[#2563eb] transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">Assign Teacher</label>
                  <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-[#2563eb] cursor-pointer transition-colors">
                    <option>Prof. Nadia</option>
                    <option>Prof. Hassan</option>
                    <option>Prof. Karim</option>
                  </select>
                </div>
                
                <div className="flex space-x-4 pt-6 border-t border-gray-100">
                  <button type="submit" className="bg-[#2563eb] hover:bg-blue-700 text-white px-8 py-3 rounded-xl text-sm font-bold transition-colors cursor-pointer shadow-sm">
                    Create Group
                  </button>
                  <button type="button" onClick={() => setModalView(null)} className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-xl text-sm font-bold transition-colors cursor-pointer">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* النافذة الثانية: جدولة الحصص */}
      {modalView === 'scheduleSession' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl animate-fade-in flex flex-col overflow-hidden">
            
            <div className="flex justify-between items-center p-8 border-b border-gray-100 bg-gray-50/50">
              <div>
                <h2 className="text-2xl font-bold text-[#0A1128] mb-1">Schedule Language Session</h2>
                <p className="text-sm text-gray-500">Set the timetable and classroom for this group.</p>
              </div>
              <button onClick={() => setModalView(null)} className="text-gray-400 hover:text-black text-2xl cursor-pointer">✕</button>
            </div>
            
            <div className="p-8 overflow-y-auto max-h-[80vh] custom-scrollbar">
              <form onSubmit={handleScheduleSession} className="space-y-6">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">Session Type</label>
                    <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-[#2563eb] cursor-pointer transition-colors">
                      <option>Regular Class</option>
                      <option>Conversation Club</option>
                      <option>Placement Test</option>
                      <option>Final Exam</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">Target Group</label>
                    <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-[#2563eb] cursor-pointer transition-colors">
                      <option>Groupe 1 - Débutant (A1)</option>
                      <option>Group 3 - Intermediate (B1)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">Teacher</label>
                    <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-[#2563eb] cursor-pointer transition-colors">
                      <option>Prof. Hassan</option>
                      <option>Prof. Nadia</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">Classroom / Lab</label>
                    <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-[#2563eb] cursor-pointer transition-colors">
                      <option>Salle 05</option>
                      <option>Lab 02 (Audio)</option>
                      <option>Salle de Conférence</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">Date</label>
                    <input type="date" required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-[#2563eb] transition-colors" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">Start Time</label>
                      <input type="time" required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-[#2563eb] transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">End Time</label>
                      <input type="time" required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-[#2563eb] transition-colors" />
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4 pt-6 border-t border-gray-100">
                  <button type="submit" className="bg-[#2563eb] hover:bg-blue-700 text-white px-8 py-3 rounded-xl text-sm font-bold transition-colors cursor-pointer shadow-sm">
                    Schedule Session
                  </button>
                  <button type="button" onClick={() => setModalView(null)} className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-xl text-sm font-bold transition-colors cursor-pointer">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Enrollment;
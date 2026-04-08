import React, { useState } from 'react';

const TeacherGrades = () => {
  // داتا تجريبية (مفروزة بين Course و Placement)
  const [grades, setGrades] = useState([
    { id: '01', name: 'Sophia Wilson', course: 'English Grammar B2', language: 'English', type: 'Course', level: 'B2', group: 'Group 1', date: '20 May 2026', grade: 9, status: 'Failed' },
    { id: '02', name: 'Liam Johnson', course: 'French B1', language: 'French', type: 'Course', level: 'B1', group: 'Group 1', date: '20 May 2026', grade: 15, status: 'Passed' },
    { id: '03', name: 'Emma Brown', course: 'German Placement Test', language: 'German', type: 'Placement', level: 'N/A', group: 'New Students', date: '21 May 2026', grade: '', status: 'Pending' },
    { id: '04', name: 'Noah Davis', course: 'English Grammar B2', language: 'English', type: 'Course', level: 'B2', group: 'Group 2', date: '20 May 2026', grade: 7, status: 'Failed' },
    { id: '05', name: 'Olivia Garcia', course: 'Spanish Placement Test', language: 'Spanish', type: 'Placement', level: 'N/A', group: 'New Students', date: '22 May 2026', grade: 18, status: 'Passed' },
  ]);

  // Tab اللي يفرق بين الدروس العادية وتحديد المستوى
  const [examTab, setExamTab] = useState('Course'); 

  // States تاع الفلترة
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLang, setFilterLang] = useState('All');
  const [filterLevel, setFilterLevel] = useState('All');
  const [filterGroup, setFilterGroup] = useState('All');
  
  // States تاع تعديل النقاط
  const [editingId, setEditingId] = useState(null);
  const [tempGrade, setTempGrade] = useState('');

  // دوال التعديل والحفظ
  const handleEdit = (record) => {
    setEditingId(record.id);
    setTempGrade(record.grade);
  };

  const handleSave = (id) => {
    const numericGrade = parseFloat(tempGrade);
    const newStatus = numericGrade >= 10 ? 'Passed' : 'Failed';
    
    setGrades(grades.map(g => 
      g.id === id ? { ...g, grade: numericGrade || 0, status: tempGrade === '' ? 'Pending' : newStatus } : g
    ));
    setEditingId(null);
  };

  // تطبيق الفلترة والتفريق بين (Course و Placement)
  const filteredGrades = grades.filter(g => {
    const matchesTab = g.type === examTab;
    const matchesSearch = g.name.toLowerCase().includes(searchTerm.toLowerCase()) || g.course.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLang = filterLang === 'All' ? true : g.language === filterLang;
    const matchesLevel = filterLevel === 'All' ? true : g.level === filterLevel;
    const matchesGroup = filterGroup === 'All' ? true : g.group === filterGroup;
    
    return matchesTab && matchesSearch && matchesLang && matchesLevel && matchesGroup;
  });

  return (
    <div className="flex-1 bg-white p-8 overflow-y-auto custom-scrollbar animate-fadeIn">
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1B254B] flex items-center gap-2 mb-6">
          👋 Welcome, [Teacher Name]
        </h1>
      </div>

      {/* Banner */}
      <div className="bg-[#f8fafc] rounded-2xl p-6 flex justify-between items-center mb-8 border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="z-10">
          <h2 className="text-2xl font-bold text-[#1B254B] mb-2">Grade Management</h2>
          <p className="text-gray-500 text-sm">Enter and manage student grades for each course.</p>
        </div>
        <div className="hidden md:flex gap-4 items-center z-10 opacity-80">
          <span className="text-6xl">📝👩‍🎓</span>
        </div>
      </div>

      {/* 🟢 Tabs باش الأستاذ يبدل بين العادي وتحديد المستوى 🟢 */}
      <div className="flex gap-8 border-b border-gray-200 mb-6">
        <button 
          onClick={() => setExamTab('Course')}
          className={`text-lg font-bold pb-3 relative transition-colors ${examTab === 'Course' ? 'text-[#4318FF]' : 'text-gray-400 hover:text-gray-600'}`}
        >
          📚 Course Grades
          {examTab === 'Course' && <div className="absolute bottom-[-1px] left-0 w-full h-1 bg-[#4318FF] rounded-t-md"></div>}
        </button>
        <button 
          onClick={() => setExamTab('Placement')}
          className={`text-lg font-bold pb-3 relative transition-colors ${examTab === 'Placement' ? 'text-[#4318FF]' : 'text-gray-400 hover:text-gray-600'}`}
        >
          🎯 Placement Tests
          {examTab === 'Placement' && <div className="absolute bottom-[-1px] left-0 w-full h-1 bg-[#4318FF] rounded-t-md"></div>}
        </button>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-[#1B254B]">Student Grades List</h3>
      </div>

      {/* منطقة الفلاتر الكاملة (فوق الطابلو كيما بغيتي) */}
      <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm mb-6 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input 
            type="text" 
            placeholder="Search by student or course..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#4318FF] w-full"
          />
        </div>
        
        <select value={filterLang} onChange={(e) => setFilterLang(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 outline-none cursor-pointer">
          <option value="All">🌐 All Languages</option>
          <option value="English">English</option>
          <option value="French">French</option>
          <option value="German">German</option>
          <option value="Spanish">Spanish</option>
        </select>

        <select value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 outline-none cursor-pointer">
          <option value="All">📊 All Levels</option>
          <option value="A1">A1</option>
          <option value="A2">A2</option>
          <option value="B1">B1</option>
          <option value="B2">B2</option>
          <option value="C1">C1</option>
        </select>

        <select value={filterGroup} onChange={(e) => setFilterGroup(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 outline-none cursor-pointer">
          <option value="All">👥 All Groups</option>
          <option value="Group 1">Group 1</option>
          <option value="Group 2">Group 2</option>
          <option value="New Students">New Students</option>
        </select>
      </div>

      {/* الطابلو مطابق للديزاين 100% */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-[#f0f7ff] text-[#2D428B] text-[13px] border-b border-gray-100">
              <th className="py-4 px-6 font-semibold w-12"><input type="checkbox" className="rounded" /></th>
              <th className="py-4 px-6 font-semibold">No</th>
              <th className="py-4 px-6 font-semibold">Student Name</th>
              <th className="py-4 px-6 font-semibold">Course Name</th>
              <th className="py-4 px-6 font-semibold">Level</th>
              <th className="py-4 px-6 font-semibold">Date</th>
              <th className="py-4 px-6 font-semibold">grade</th>
              <th className="py-4 px-6 font-semibold">Status</th>
              <th className="py-4 px-6 font-semibold text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredGrades.map((g, index) => (
              <tr key={g.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="py-3 px-6"><input type="checkbox" className="rounded border-gray-300" /></td>
                <td className="py-3 px-6 text-sm text-gray-500">{(index + 1).toString().padStart(2, '0')}</td>
                
                <td className="py-3 px-6 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 shrink-0">
                    {g.name.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-[#1B254B]">{g.name}</span>
                </td>

                <td className="py-3 px-6 text-sm text-gray-500">{g.course}</td>
                <td className="py-3 px-6 text-sm text-gray-500">{g.level}</td>
                <td className="py-3 px-6 text-sm text-gray-500">{g.date}</td>
                
                {/* إدخال النقطة */}
                <td className="py-3 px-6">
                  {editingId === g.id ? (
                    <div className="flex items-center gap-1">
                      <input 
                        type="number" 
                        min="0" max="20"
                        value={tempGrade} 
                        onChange={(e) => setTempGrade(e.target.value)}
                        className="border-2 border-blue-400 rounded-md px-2 py-1 w-16 text-sm font-bold outline-none text-center"
                        autoFocus
                      />
                      <span className="text-gray-400 text-sm">/ 20</span>
                    </div>
                  ) : (
                    <span className="text-sm font-bold text-[#1B254B]">
                      {g.grade !== '' ? `${g.grade.toString().padStart(2, '0')}/20` : '-/20'}
                    </span>
                  )}
                </td>

                {/* الحالة */}
                <td className="py-3 px-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center w-max gap-1
                    ${g.status === 'Passed' ? 'text-[#00a65e]' : 
                      g.status === 'Failed' ? 'text-[#e02424]' : 
                      'text-gray-400'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full 
                      ${g.status === 'Passed' ? 'bg-[#00a65e]' : 
                        g.status === 'Failed' ? 'bg-[#e02424]' : 
                        'bg-gray-400'}`}></span>
                    {g.status}
                  </span>
                </td>

                {/* الأزرار */}
                <td className="py-3 px-6 text-center">
                  {editingId === g.id ? (
                    <button 
                      onClick={() => handleSave(g.id)}
                      className="p-1.5 px-3 text-white bg-[#00a65e] rounded-md shadow-sm hover:bg-green-600 transition-colors text-xs font-bold"
                      title="Save Grade"
                    >
                      Save
                    </button>
                  ) : (
                    <>
                      <button 
                        onClick={() => handleEdit(g)}
                        className="p-1.5 text-gray-400 hover:text-[#4318FF] transition-colors bg-white border border-gray-200 rounded-lg shadow-sm mr-2"
                        title="Enter Grade"
                      >
                        ✏️
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-red-500 transition-colors bg-white border border-gray-200 rounded-lg shadow-sm" title="Delete">
                        🗑️
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            
            {filteredGrades.length === 0 && (
              <tr>
                <td colSpan="9" className="py-8 text-center text-gray-400">
                  No {examTab} found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        
        {/* Pagination */}
        <div className="flex justify-between items-center p-4 border-t border-gray-50 text-sm text-gray-500 bg-[#f8fafc]">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 shadow-sm cursor-pointer">Previous</button>
          <span>Page 1 of 12</span>
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 shadow-sm cursor-pointer">Next</button>
        </div>
      </div>
    </div>
  );
};

export default TeacherGrades;
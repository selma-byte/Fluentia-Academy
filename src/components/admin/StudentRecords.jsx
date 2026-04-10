import React, { useState, useEffect } from 'react';

const StudentRecords = () => {
  const [currentView, setCurrentView] = useState('list'); // 'list' أو 'profile'
  const [selectedStudent, setSelectedStudent] = useState(null);

  // 1. حالات الفلترة والبحث
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLang, setFilterLang] = useState('All');
  const [filterLevel, setFilterLevel] = useState('All');
  const [filterGroup, setFilterGroup] = useState('All');

  // جلب البيانات
  const [studentsData, setStudentsData] = useState(() => {
    try {
      const saved = localStorage.getItem('languageStudentsData');
      if (saved) return JSON.parse(saved);
    } catch (error) {
      console.error("Error reading from local storage", error);
    }
    return [];
  });

  const [academicEntry, setAcademicEntry] = useState({
    subject: '', grade: '', attendance: '', remarks: ''
  });

  const [contactEntry, setContactEntry] = useState({
    phone: '', email: '', address: '', parentName: '', parentContact: ''
  });

  const filteredStudents = studentsData.filter(student => {
    const matchLang = filterLang === 'All' || student.language === filterLang;
    const matchLevel = filterLevel === 'All' || student.level === filterLevel;
    const matchGroup = filterGroup === 'All' || student.group === filterGroup;
    const matchSearch = student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        student.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchLang && matchLevel && matchGroup && matchSearch;
  });

  const handleViewProfile = (student) => {
    setSelectedStudent(student);
    setContactEntry({
      phone: student.phone || '',
      email: student.email || '',
      address: student.address || '',
      parentName: student.parentName || '',
      parentContact: student.parentContact || ''
    });
    setCurrentView('profile');
  };

  const handleUpdateAcademic = (e) => {
    e.preventDefault();
    alert(`✅ Academic Record Saved Successfully for ${selectedStudent.firstName}!\nAssessment: ${academicEntry.subject}\nGrade: ${academicEntry.grade}`);
    setAcademicEntry({ subject: '', grade: '', attendance: '', remarks: '' });
  };

  const handleUpdateContact = (e) => {
    e.preventDefault();
    alert(`✅ Contact Info Updated Successfully for ${selectedStudent.firstName}!`);
  };

  const handlePrint = () => {
    window.print();
  };

  const renderList = () => (
    <div className="w-full flex flex-col animate-fade-in">
      <div className="flex justify-between items-center mb-8 shrink-0">
        <div>
          <h2 className="text-3xl font-bold text-[#0A1128] mb-1">Student Records</h2>
          <p className="text-sm font-bold text-gray-500">Manage academic performance and tracking for {filteredStudents.length} students</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-6 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="relative flex-1 min-w-[250px]">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">🔍</span>
          <input 
            type="text" 
            placeholder="Search by name or ID..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 transition-all" 
          />
        </div>

        <select value={filterLang} onChange={(e) => setFilterLang(e.target.value)} className="bg-gray-50 border border-gray-200 text-sm rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 font-bold text-gray-600 cursor-pointer">
          <option value="All">🌐 All Languages</option>
          <option value="English">English</option><option value="Spanish">Spanish</option><option value="German">German</option><option value="French">French</option>
        </select>

        <select value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)} className="bg-gray-50 border border-gray-200 text-sm rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 font-bold text-gray-600 cursor-pointer">
          <option value="All">📊 All Levels</option>
          <option value="A1">A1</option><option value="A2">A2</option><option value="B1">B1</option><option value="B2">B2</option><option value="C1">C1</option>
        </select>

        <select value={filterGroup} onChange={(e) => setFilterGroup(e.target.value)} className="bg-gray-50 border border-gray-200 text-sm rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 font-bold text-gray-600 cursor-pointer">
          <option value="All">👥 All Groups</option>
          <option value="Grp 1">Grp 1</option><option value="Grp 2">Grp 2</option><option value="Grp 3">Grp 3</option>
        </select>
      </div>

      <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="py-4 px-6 font-bold text-gray-600 uppercase text-xs">Student ID</th>
              <th className="py-4 px-6 font-bold text-gray-600 uppercase text-xs">Name</th>
              <th className="py-4 px-6 font-bold text-gray-600 uppercase text-xs">Language</th>
              <th className="py-4 px-6 font-bold text-gray-600 uppercase text-xs">Level / Grp</th>
              <th className="py-4 px-6 font-bold text-gray-600 uppercase text-xs text-center">Manage Record</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredStudents.length > 0 ? filteredStudents.map((student) => (
              <tr key={student.id} className="hover:bg-blue-50/50 transition-colors group">
                <td className="py-4 px-6 font-bold text-gray-500">{student.id}</td>
                <td className="py-4 px-6 font-bold text-[#0A1128]">{student.firstName} {student.lastName}</td>
                <td className="py-4 px-6 font-medium text-gray-700">{student.language}</td>
                <td className="py-4 px-6 font-medium text-gray-700">{student.level} • {student.group}</td>
                <td className="py-4 px-6 flex justify-center">
                  <button onClick={() => handleViewProfile(student)} className="bg-white border border-gray-200 hover:bg-[#2563eb] hover:text-white text-gray-700 font-bold py-1.5 px-4 rounded-lg transition-all text-xs shadow-sm">
                    Open Record
                  </button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="5" className="py-12 text-center text-gray-400 font-bold">No students found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderProfile = () => {
    if (!selectedStudent) return null;
    return (
      <div className="w-full flex flex-col animate-fade-in pb-12">
        <div className="flex items-center mb-6">
          <button onClick={() => setCurrentView('list')} className="mr-4 w-10 h-10 bg-white border border-gray-200 rounded-full font-bold flex items-center justify-center hover:bg-gray-100 shadow-sm text-gray-600">←</button>
          <h2 className="text-2xl font-bold text-[#0A1128]">Student Profile</h2>
        </div>
        
        <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex justify-between items-center">
               <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold">{selectedStudent.firstName[0]}</div>
                  <div>
                      <h3 className="text-xl font-bold text-[#0A1128]">{selectedStudent.firstName} {selectedStudent.lastName}</h3>
                      <p className="text-xs text-gray-500 font-medium">ID: {selectedStudent.id}</p>
                  </div>
               </div>
               <button onClick={handlePrint} className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold shadow-sm">🖨️ Print</button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                   <h4 className="font-bold text-sm text-[#0A1128] mb-4">🎓 Academic Update</h4>
                   <form onSubmit={handleUpdateAcademic} className="space-y-4">
                      <input type="text" placeholder="Assessment" value={academicEntry.subject} onChange={(e) => setAcademicEntry({...academicEntry, subject: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-sm" required />
                      <div className="grid grid-cols-2 gap-4">
                          <input type="text" placeholder="Grade" value={academicEntry.grade} onChange={(e) => setAcademicEntry({...academicEntry, grade: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-sm" required />
                          <input type="text" placeholder="Attendance" value={academicEntry.attendance} onChange={(e) => setAcademicEntry({...academicEntry, attendance: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-sm" />
                      </div>
                      <button type="submit" className="w-full bg-[#2563eb] text-white font-bold py-2.5 rounded-lg text-sm">Save</button>
                   </form>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                   <h4 className="font-bold text-sm text-[#0A1128] mb-4">📞 Contact Update</h4>
                   <form onSubmit={handleUpdateContact} className="space-y-4">
                      <input type="tel" placeholder="Phone" value={contactEntry.phone} onChange={(e) => setContactEntry({...contactEntry, phone: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-sm" />
                      <input type="email" placeholder="Email" value={contactEntry.email} onChange={(e) => setContactEntry({...contactEntry, email: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-sm" />
                      <button type="submit" className="w-full bg-[#0A1128] text-white font-bold py-2.5 rounded-lg text-sm">Update</button>
                   </form>
                </div>
            </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      {currentView === 'list' ? renderList() : renderProfile()}
      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.4s ease-out; }
      `}</style>
    </div>
  );
};

export default StudentRecords;
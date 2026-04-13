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

  // ==========================================
  // واجهة القائمة والفلترة
  // ==========================================
  const renderList = () => (
    <div className="w-full flex flex-col min-h-full animate-fade-in">
      
      <div className="flex justify-between items-center mb-8 shrink-0">
        <div>
          <h2 className="text-3xl font-bold text-[#0A1128] mb-1">Student Records</h2>
          <p className="text-sm font-bold text-gray-500">Manage academic performance and tracking for {filteredStudents.length} students</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-6 shrink-0 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
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

        {(filterLang !== 'All' || filterLevel !== 'All' || filterGroup !== 'All' || searchQuery !== '') && (
          <button 
            onClick={() => { setFilterLang('All'); setFilterLevel('All'); setFilterGroup('All'); setSearchQuery(''); }}
            className="text-xs font-bold text-red-500 hover:text-red-700 underline cursor-pointer px-2"
          >
            Clear Filters
          </button>
        )}
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
                <td className="py-4 px-6">
                  <p className="font-bold text-[#0A1128]">{student.firstName} {student.lastName}</p>
                </td>
                <td className="py-4 px-6 font-medium text-gray-700">{student.language}</td>
                <td className="py-4 px-6 font-medium text-gray-700">{student.level} • {student.group}</td>
                <td className="py-4 px-6 flex justify-center">
                  <button 
                    onClick={() => handleViewProfile(student)} 
                    className="bg-white border border-gray-200 hover:bg-[#2563eb] hover:text-white hover:border-[#2563eb] text-gray-700 font-bold py-1.5 px-4 rounded-lg transition-all cursor-pointer text-xs shadow-sm"
                  >
                    Open Record
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" className="py-12 text-center text-gray-400">
                  <p className="text-4xl mb-2">🔍</p>
                  <p className="font-bold">No students found matching your criteria.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  // ==========================================
  // واجهة السجلات (مع تفعيل التمرير العمودي)
  // ==========================================
  const renderProfile = () => {
    if (!selectedStudent) return null;
    return (
      <div className="w-full flex flex-col min-h-full animate-fade-in pb-12">
        
        {/* Header Navigation */}
        <div className="flex justify-between items-center mb-6 max-w-6xl mx-auto w-full">
          <div className="flex items-center">
            <button onClick={() => setCurrentView('list')} className="mr-4 w-10 h-10 bg-white border border-gray-200 rounded-full font-bold flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer shadow-sm text-gray-600">
              ←
            </button>
            <h2 className="text-2xl font-bold text-[#0A1128]">Student Profile</h2>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto w-full space-y-6">
            
            {/* 1. Student Header Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex justify-between items-center">
               <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold">
                     {selectedStudent.firstName[0]}{selectedStudent.lastName[0]}
                  </div>
                  <div>
                     <h3 className="text-xl font-bold text-[#0A1128]">{selectedStudent.firstName} {selectedStudent.lastName}</h3>
                     <p className="text-xs text-gray-500 font-medium">ID: {selectedStudent.id} • Enrolled: {selectedStudent.enrollmentDate}</p>
                     <div className="flex space-x-3 mt-2">
                        <span className="text-xs font-bold text-blue-600">{selectedStudent.language}</span>
                        <span className="text-xs font-bold text-purple-600">Level {selectedStudent.level}</span>
                        <span className="text-xs font-bold text-green-600">{selectedStudent.status}</span>
                     </div>
                  </div>
               </div>
               <button onClick={handlePrint} className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors cursor-pointer flex items-center">
                  <span className="mr-2">🖨️</span> Print Record
               </button>
            </div>

            {/* 2. Update Forms */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Academic Update */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex flex-col">
                   <h4 className="font-bold text-sm text-[#0A1128] mb-4 flex items-center">
                      <span className="mr-2">🎓</span> Update Academic Info
                   </h4>
                   <form onSubmit={handleUpdateAcademic} className="space-y-4 flex-1 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div>
                           <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Course / Assessment</label>
                           <input type="text" placeholder="e.g. Midterm Exam, Speaking Test" value={academicEntry.subject} onChange={(e) => setAcademicEntry({...academicEntry, subject: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500" required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div>
                              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Grade / Score</label>
                              <input type="text" placeholder="e.g. 85%, A-" value={academicEntry.grade} onChange={(e) => setAcademicEntry({...academicEntry, grade: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500" required />
                           </div>
                           <div>
                              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Attendance Rate</label>
                              <input type="text" placeholder="e.g. 95%" value={academicEntry.attendance} onChange={(e) => setAcademicEntry({...academicEntry, attendance: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500" />
                           </div>
                        </div>
                        <div>
                           <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Teacher Remarks</label>
                           <textarea rows="2" placeholder="Add comments here..." value={academicEntry.remarks} onChange={(e) => setAcademicEntry({...academicEntry, remarks: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500 resize-none"></textarea>
                        </div>
                      </div>
                      <button type="submit" className="w-full bg-[#2563eb] hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg transition-colors shadow-sm cursor-pointer mt-4 text-sm">
                         Save Academic Record
                      </button>
                   </form>
                </div>

                {/* Contact Update */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex flex-col">
                   <h4 className="font-bold text-sm text-[#0A1128] mb-4 flex items-center">
                      <span className="mr-2">📞</span> Update Contact Info
                   </h4>
                   <form onSubmit={handleUpdateContact} className="space-y-4 flex-1 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                           <div>
                              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Student Phone</label>
                              <input type="tel" value={contactEntry.phone} onChange={(e) => setContactEntry({...contactEntry, phone: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500" />
                           </div>
                           <div>
                              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Email</label>
                              <input type="email" value={contactEntry.email} onChange={(e) => setContactEntry({...contactEntry, email: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500" />
                           </div>
                        </div>
                        <div>
                           <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Home Address</label>
                           <input type="text" value={contactEntry.address} onChange={(e) => setContactEntry({...contactEntry, address: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500" />
                        </div>
                        <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4 mt-2">
                           <div>
                              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Parent/Guardian Name</label>
                              <input type="text" value={contactEntry.parentName} onChange={(e) => setContactEntry({...contactEntry, parentName: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500" />
                           </div>
                           <div>
                              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Parent Contact</label>
                              <input type="tel" value={contactEntry.parentContact} onChange={(e) => setContactEntry({...contactEntry, parentContact: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500" />
                           </div>
                        </div>
                      </div>
                      <button type="submit" className="w-full bg-[#0A1128] hover:bg-gray-800 text-white font-bold py-2.5 rounded-lg transition-colors shadow-sm cursor-pointer mt-4 text-sm">
                         Update Contact Details
                      </button>
                   </form>
                </div>

            </div>

            {/* 3. Academic History Table */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
               <h4 className="font-bold text-sm text-[#0A1128] mb-4">Academic History</h4>
               <div className="overflow-x-auto border border-gray-100 rounded-xl">
                  <table className="w-full text-left text-sm min-w-[600px]">
                     <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                           <th className="py-3 px-4 font-bold text-gray-500 text-[10px] uppercase">Date</th>
                           <th className="py-3 px-4 font-bold text-gray-500 text-[10px] uppercase">Assessment</th>
                           <th className="py-3 px-4 font-bold text-gray-500 text-[10px] uppercase">Grade</th>
                           <th className="py-3 px-4 font-bold text-gray-500 text-[10px] uppercase">Remarks</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-100">
                        <tr className="hover:bg-gray-50">
                           <td className="py-3 px-4 text-gray-500 text-xs">Oct 12, 2025</td>
                           <td className="py-3 px-4 font-medium text-[#0A1128] text-xs">Speaking Test 1</td>
                           <td className="py-3 px-4 text-green-600 font-bold text-xs">92%</td>
                           <td className="py-3 px-4 text-gray-600 text-xs">Excellent pronunciation.</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                           <td className="py-3 px-4 text-gray-500 text-xs">Nov 05, 2025</td>
                           <td className="py-3 px-4 font-medium text-[#0A1128] text-xs">Grammar Quiz</td>
                           <td className="py-3 px-4 text-red-600 font-bold text-xs">78%</td>
                           <td className="py-3 px-4 text-gray-600 text-xs">Needs to review past tenses.</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                           <td className="py-3 px-4 text-gray-500 text-xs">Dec 15, 2025</td>
                           <td className="py-3 px-4 font-medium text-[#0A1128] text-xs">Listening Comprehension</td>
                           <td className="py-3 px-4 text-green-600 font-bold text-xs">88%</td>
                           <td className="py-3 px-4 text-gray-600 text-xs">Good understanding of native speakers.</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                           <td className="py-3 px-4 text-gray-500 text-xs">Jan 10, 2026</td>
                           <td className="py-3 px-4 font-medium text-[#0A1128] text-xs">Final Written Exam</td>
                           <td className="py-3 px-4 text-green-600 font-bold text-xs">95%</td>
                           <td className="py-3 px-4 text-gray-600 text-xs">Outstanding performance overall.</td>
                        </tr>
                     </tbody>
                  </table>
               </div>
            </div>

        </div>
      </div>
    );
  };

  return (
    <div className="h-full w-full overflow-y-auto custom-scrollbar bg-[#f8fafc]">
      {currentView === 'list' ? renderList() : renderProfile()}
    </div>
  );
};

export default StudentRecords;
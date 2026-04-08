import React, { useState, useEffect } from 'react';

const StudentRegistration = () => {
  const [currentView, setCurrentView] = useState('list');
  const [selectedStudent, setSelectedStudent] = useState(null);

  // 1. حالات الفلترة والبحث
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLang, setFilterLang] = useState('All');
  const [filterLevel, setFilterLevel] = useState('All');
  const [filterGroup, setFilterGroup] = useState('All');

  // بيانات الطلاب مع حماية من التشنج (Safe Local Storage)
  const [studentsData, setStudentsData] = useState(() => {
    try {
      const saved = localStorage.getItem('languageStudentsData');
      if (saved) return JSON.parse(saved);
    } catch (error) {
      console.error("Error reading from local storage", error);
    }
    return [
      { id: 'STU-2026-001', firstName: 'Alex', lastName: 'Sterling', email: 'alex.sterling@university.edu', language: 'English', level: 'B1', group: 'Grp 1', enrollmentDate: '2024-01-15', status: 'Active', phone: '+1 (206) 555-0198', address: '4202 University Way NE, Seattle, WA', gender: 'Male', dob: '2004-05-14', parentName: 'Sarah Sterling', parentContact: '+1 (206) 555-0122' },
      { id: 'STU-2026-002', firstName: 'Fatima', lastName: 'Al-Rahman', email: 'fatima.rahman@email.com', language: 'Spanish', level: 'A2', group: 'Grp 2', enrollmentDate: '2024-01-20', status: 'Active', phone: '+971 50 123 4567', address: 'Dubai, UAE', gender: 'Female', dob: '2005-08-22', parentName: 'Ahmed Al-Rahman', parentContact: '+971 50 765 4321' },
      { id: 'STU-2026-003', firstName: 'Mohammed', lastName: 'Al-Sayed', email: 'mohammed.sayed@email.com', language: 'German', level: 'B2', group: 'Grp 1', enrollmentDate: '2024-02-01', status: 'Active', phone: '+966 50 987 6543', address: 'Riyadh, KSA', gender: 'Male', dob: '2003-11-05', parentName: 'Yousef Al-Sayed', parentContact: '+966 50 111 2222' }
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('languageStudentsData', JSON.stringify(studentsData));
    } catch (error) {
      console.error("Error saving to local storage", error);
    }
  }, [studentsData]);

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', gender: 'Male', dob: '', language: 'English', level: 'A1', group: 'Grp 1',
    parentName: '', parentContact: '', occupation: '', income: '', username: '', password: '', phone: '', email: '', address: ''
  });

  // 2. تطبيق الفلترة والبحث على قائمة الطلاب
  const filteredStudents = studentsData.filter(student => {
    const matchLang = filterLang === 'All' || student.language === filterLang;
    const matchLevel = filterLevel === 'All' || student.level === filterLevel;
    const matchGroup = filterGroup === 'All' || student.group === filterGroup;
    const matchSearch = student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        student.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchLang && matchLevel && matchGroup && matchSearch;
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddClick = () => {
    setFormData({ firstName: '', lastName: '', gender: 'Male', dob: '', language: 'English', level: 'A1', group: 'Grp 1', parentName: '', parentContact: '', occupation: '', income: '', username: '', password: '', phone: '', email: '', address: '' });
    setCurrentView('add');
  };

  const handleEditClick = (student) => {
    setSelectedStudent(student);
    setFormData({ ...student, parentName: student.parentName || '', parentContact: student.parentContact || '', username: '', password: '' });
    setCurrentView('edit');
  };

  const handleViewProfile = (student) => {
    setSelectedStudent(student);
    setCurrentView('profile');
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      setStudentsData(studentsData.filter(s => s.id !== id));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (currentView === 'add') {
      const newStudent = { ...formData, id: `STU-${Date.now()}`, status: 'Active', enrollmentDate: new Date().toISOString().split('T')[0] };
      setStudentsData([...studentsData, newStudent]);
    } else if (currentView === 'edit') {
      setStudentsData(studentsData.map(s => s.id === selectedStudent.id ? { ...s, ...formData } : s));
    }
    setCurrentView('list');
  };

  const renderList = () => (
    <div className="w-full flex flex-col h-full bg-white p-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8 shrink-0">
        <div>
          <h2 className="text-3xl font-bold text-[#0A1128] mb-1">Student Registration</h2>
          <p className="text-sm font-bold text-gray-500">Showing {filteredStudents.length} of {studentsData.length} students</p>
        </div>
        <button onClick={handleAddClick} className="bg-[#2563eb] hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-lg shadow-sm transition-colors flex items-center cursor-pointer">
          Add New <span className="ml-2 text-xl">+</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6 shrink-0 bg-gray-50 p-4 rounded-xl border border-gray-100">
        
        {/* Search Bar */}
        <div className="relative flex-1 min-w-[250px]">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">🔍</span>
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 transition-all" 
          />
        </div>

        {/* Dropdown Filters */}
        <select value={filterLang} onChange={(e) => setFilterLang(e.target.value)} className="bg-white border border-gray-200 text-sm rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 font-bold text-gray-600 cursor-pointer">
          <option value="All"> All Languages</option>
          <option value="English">English</option>
          <option value="Spanish">Spanish</option>
          <option value="German">German</option>
          <option value="French">French</option>
        </select>

        <select value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)} className="bg-white border border-gray-200 text-sm rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 font-bold text-gray-600 cursor-pointer">
          <option value="All"> All Levels</option>
          <option value="A1">A1</option><option value="A2">A2</option>
          <option value="B1">B1</option><option value="B2">B2</option>
          <option value="C1">C1</option>
        </select>

        <select value={filterGroup} onChange={(e) => setFilterGroup(e.target.value)} className="bg-white border border-gray-200 text-sm rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 font-bold text-gray-600 cursor-pointer">
          <option value="All"> All Groups</option>
          <option value="Grp 1">Grp 1</option>
          <option value="Grp 2">Grp 2</option>
          <option value="Grp 3">Grp 3</option>
        </select>

        {/* Clear Filters Button */}
        {(filterLang !== 'All' || filterLevel !== 'All' || filterGroup !== 'All' || searchQuery !== '') && (
          <button 
            onClick={() => { setFilterLang('All'); setFilterLevel('All'); setFilterGroup('All'); setSearchQuery(''); }}
            className="text-xs font-bold text-red-500 hover:text-red-700 underline cursor-pointer"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Table Area */}
      <div className="overflow-y-auto flex-1 border border-gray-100 rounded-xl custom-scrollbar">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="py-4 px-6 font-bold text-gray-600 uppercase text-xs">Name</th>
              <th className="py-4 px-6 font-bold text-gray-600 uppercase text-xs">Language</th>
              <th className="py-4 px-6 font-bold text-gray-600 uppercase text-xs">Level / Grp</th>
              <th className="py-4 px-6 font-bold text-gray-600 uppercase text-xs">Status</th>
              <th className="py-4 px-6 font-bold text-gray-600 uppercase text-xs text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredStudents.length > 0 ? filteredStudents.map((student) => (
              <tr key={student.id} className="hover:bg-blue-50/50 transition-colors group">
                <td className="py-4 px-6">
                  <p className="font-bold text-[#0A1128]">{student.firstName} {student.lastName}</p>
                  <p className="text-xs text-gray-500">{student.email}</p>
                </td>
                <td className="py-4 px-6 font-medium text-gray-700">{student.language}</td>
                <td className="py-4 px-6 font-medium text-gray-700">{student.level} • {student.group}</td>
                <td className="py-4 px-6">
                  <span className={`px-2.5 py-1 rounded text-xs font-bold ${student.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {student.status}
                  </span>
                </td>
                <td className="py-4 px-6 flex justify-center space-x-4">
                  <button onClick={() => handleViewProfile(student)} className="text-gray-400 hover:text-blue-600 transition-colors cursor-pointer text-lg" title="View Profile">👁️</button>
                  <button onClick={() => handleEditClick(student)} className="text-gray-400 hover:text-orange-500 transition-colors cursor-pointer text-lg" title="Edit">✏️</button>
                  <button onClick={() => handleDelete(student.id)} className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer text-lg" title="Delete">🗑</button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" className="py-12 text-center text-gray-400">
                  <p className="text-4xl mb-2">🔍</p>
                  <p className="font-bold">No students found matching your filters.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderForm = () => (
    <div className="w-full flex flex-col h-full bg-white p-8 animate-fade-in">
      <div className="flex items-center mb-8 shrink-0">
        <button onClick={() => setCurrentView('list')} className="mr-4 w-10 h-10 bg-gray-100 rounded-full font-bold flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer">←</button>
        <h2 className="text-3xl font-bold text-[#0A1128]">{currentView === 'add' ? 'Add New Student' : 'Edit Student'}</h2>
      </div>
      
      <form onSubmit={handleSave} className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 mb-6">
           <h3 className="font-bold text-lg mb-4 border-b border-gray-200 pb-2">Academic Details</h3>
           <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Language</label>
                <select name="language" value={formData.language} onChange={handleInputChange} className="w-full border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-blue-500 cursor-pointer"><option>English</option><option>Spanish</option><option>German</option><option>French</option></select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Level</label>
                <select name="level" value={formData.level} onChange={handleInputChange} className="w-full border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-blue-500 cursor-pointer"><option>A1</option><option>A2</option><option>B1</option><option>B2</option><option>C1</option></select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Group</label>
                <select name="group" value={formData.group} onChange={handleInputChange} className="w-full border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-blue-500 cursor-pointer"><option>Grp 1</option><option>Grp 2</option><option>Grp 3</option></select>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
           <div>
              <h3 className="font-bold text-lg mb-4 border-b border-gray-100 pb-2">Personal Info</h3>
              <div className="space-y-4">
                 <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="First Name" className="w-full border border-gray-200 p-3 rounded-lg text-sm" required />
                 <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Last Name" className="w-full border border-gray-200 p-3 rounded-lg text-sm" required />
                 <input type="date" name="dob" value={formData.dob} onChange={handleInputChange} className="w-full border border-gray-200 p-3 rounded-lg text-sm text-gray-500" required />
                 <div className="flex space-x-4 px-2">
                    <label className="flex items-center text-sm cursor-pointer"><input type="radio" name="gender" value="Male" checked={formData.gender === 'Male'} onChange={handleInputChange} className="mr-2" /> Male</label>
                    <label className="flex items-center text-sm cursor-pointer"><input type="radio" name="gender" value="Female" checked={formData.gender === 'Female'} onChange={handleInputChange} className="mr-2" /> Female</label>
                 </div>
              </div>
           </div>
           <div>
              <h3 className="font-bold text-lg mb-4 border-b border-gray-100 pb-2">Contact Info</h3>
              <div className="space-y-4">
                 <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email Address" className="w-full border border-gray-200 p-3 rounded-lg text-sm" />
                 <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone Number" className="w-full border border-gray-200 p-3 rounded-lg text-sm" />
                 <input type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="Full Address" className="w-full border border-gray-200 p-3 rounded-lg text-sm" />
              </div>
           </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end space-x-4">
          <button type="button" onClick={() => setCurrentView('list')} className="px-6 py-3 bg-gray-100 text-gray-600 font-bold rounded-lg hover:bg-gray-200 transition-colors cursor-pointer">Cancel</button>
          <button type="submit" className="px-8 py-3 bg-[#2563eb] hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition-colors cursor-pointer">Save Student</button>
        </div>
      </form>
    </div>
  );

  const renderProfile = () => {
    if (!selectedStudent) return null;
    return (
      <div className="w-full flex flex-col h-full bg-gray-50 p-8 animate-fade-in">
        <button onClick={() => setCurrentView('list')} className="mb-6 flex items-center text-blue-600 font-bold hover:underline w-fit cursor-pointer">← Back to Students List</button>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden max-w-4xl mx-auto w-full">
           <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
           <div className="px-8 pb-8 relative">
              <div className="w-24 h-24 bg-white rounded-full border-4 border-white shadow-md absolute -top-12 flex items-center justify-center text-4xl overflow-hidden">
                 <img src={`https://ui-avatars.com/api/?name=${selectedStudent.firstName}+${selectedStudent.lastName}&background=eff6ff&color=2563eb`} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div className="pt-16 flex justify-between items-start">
                 <div>
                    <h2 className="text-3xl font-bold text-[#0A1128] mb-1">{selectedStudent.firstName} {selectedStudent.lastName}</h2>
                    <p className="text-gray-500 font-medium">Student ID: {selectedStudent.id}</p>
                 </div>
                 <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${selectedStudent.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {selectedStudent.status}
                 </span>
              </div>

              <div className="grid grid-cols-2 gap-8 mt-10 border-t border-gray-100 pt-8">
                 <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Academic Record</h3>
                    <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                       <p className="flex justify-between"><span className="text-gray-500">Language:</span> <span className="font-bold text-[#0A1128]">{selectedStudent.language}</span></p>
                       <p className="flex justify-between"><span className="text-gray-500">Level:</span> <span className="font-bold text-[#0A1128]">{selectedStudent.level}</span></p>
                       <p className="flex justify-between"><span className="text-gray-500">Group:</span> <span className="font-bold text-[#0A1128]">{selectedStudent.group}</span></p>
                       <p className="flex justify-between border-t border-gray-200 pt-2 mt-2"><span className="text-gray-500">Enrollment Date:</span> <span className="font-bold text-[#0A1128]">{selectedStudent.enrollmentDate}</span></p>
                    </div>
                 </div>
                 <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Contact Details</h3>
                    <div className="space-y-3">
                       <p className="flex items-center"><span className="mr-3 text-lg">📧</span> <span className="font-medium text-[#0A1128]">{selectedStudent.email || 'No email provided'}</span></p>
                       <p className="flex items-center"><span className="mr-3 text-lg">📱</span> <span className="font-medium text-[#0A1128]">{selectedStudent.phone || 'No phone provided'}</span></p>
                       <p className="flex items-center"><span className="mr-3 text-lg">📍</span> <span className="font-medium text-[#0A1128]">{selectedStudent.address || 'No address provided'}</span></p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full">
      {currentView === 'list' && renderList()}
      {(currentView === 'add' || currentView === 'edit') && renderForm()}
      {currentView === 'profile' && renderProfile()}
    </div>
  );
};

export default StudentRegistration;
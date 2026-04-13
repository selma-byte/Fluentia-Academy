import React, { useState, useEffect } from 'react';
import { supabase } from "../../supabaseClient";

const StudentRegistration = () => {
  const [currentView, setCurrentView] = useState('list');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(false);

  // 1. حالات الفلترة والبحث
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLang, setFilterLang] = useState('All');
  const [filterLevel, setFilterLevel] = useState('All');
  const [filterGroup, setFilterGroup] = useState('All');
  const [filterType, setFilterType] = useState('All'); // 'All', 'Course', 'Placement'

  // جلب البيانات من Supabase عوض LocalStorage للحفاظ على المزامنة
  const [studentsData, setStudentsData] = useState([]);

  const fetchStudents = async () => {
    const { data, error } = await supabase.from('students').select('*');
    if (!error) setStudentsData(data);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', gender: 'Male', dob: '', language: 'English', level: 'A1', group: 'Grp 1',
    parentName: '', parentContact: '', occupation: '', income: '', username: '', password: '', phone: '', email: '', address: '',
    exam_type: 'Course' // القيمة الافتراضية
  });

  const filteredStudents = studentsData.filter(student => {
    // 1. فلتر النوع: نردوه يقبل (Placement, placement, placment) كامل كيف كيف
    const studentType = (student.exam_type || "").toLowerCase();
    const selectedFilter = filterType.toLowerCase();
  
    let matchType = false;
    if (filterType === 'All') {
      matchType = true;
    } else if (selectedFilter === 'course') {
      matchType = studentType === 'course';
    } else if (selectedFilter === 'placement' || selectedFilter === 'placement test') {
      // هادي باش تقرأ 'placement' و 'placment' اللي شفتها في صورتك
      matchType = studentType.includes('plac'); 
    }
  
    // 2. فلتر البحث: نأمنوه باش ما يبلوبكيش الكود لو كانت خانة فارغة
    const fName = (student.first_name || student.firstName || "").toLowerCase();
    const lName = (student.last_name || student.lastName || "").toLowerCase();
    const matchSearch = fName.includes(searchQuery.toLowerCase()) || 
                        lName.includes(searchQuery.toLowerCase());
  
    // 3. فلاتر اللغة والمستوى
    const matchLang = filterLang === 'All' || student.language === filterLang;
    const matchLevel = filterLevel === 'All' || student.level === filterLevel;
  
    // 🔴 ملاحظة: نحينا matchGroup مؤقتاً لأنه هو اللي غالباً راهو يفرغ الجدول لو كانت الخانة فارغة في Supabase
    return matchType && matchSearch && matchLang && matchLevel;
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddClick = () => {
    setFormData({ firstName: '', lastName: '', gender: 'Male', dob: '', language: 'English', level: 'A1', group: 'Grp 1', parentName: '', parentContact: '', occupation: '', income: '', username: '', password: '', phone: '', email: '', address: '', exam_type: 'Course' });
    setCurrentView('add');
  };

  const handleEditClick = (student) => {
    setSelectedStudent(student);
    setFormData({ ...student, username: '', password: '' });
    setCurrentView('edit');
  };

  const handleViewProfile = (student) => {
    setSelectedStudent(student);
    setCurrentView('profile');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      const { error } = await supabase.from('students').delete().eq('id', id);
      if (!error) fetchStudents();
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        // 1. نطبعو النوع باش نشوفو واش راهو مكتوب صح (التعديل هنا: استعملنا exam_type)
        console.log("النوع اللي خيرتيه هو:", formData.exam_type);

        // 2. نردّو الشرط يقبلهم في زوج باش ما يغلطش
        if (formData.exam_type === 'Course' || formData.exam_type === 'Direct Course') {
            console.log("رانا نكرييو في الحساب دركا...");
            
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: 'Password123!', // مودباس افتراضي
            });

            if (authError) {
                console.error("مشكل في Auth:", authError);
                throw authError; 
            }
            console.log("الحساب تكریا بنجاح في Users! 🎉");
        } else {
            console.log("ما دخلناش لـ Auth لأن النوع هو:", formData.exam_type);
        }

        // 3. التسجيل في الجدول (students)
        const { error: dbError } = await supabase
            .from('students')
            .insert([{
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                language: formData.language,
                level: formData.level,
                group_name: formData.group, 
                exam_type: formData.exam_type,   // هنا ثاني استعملنا exam_type
                status: 'Active',
                enrollment_date: new Date().toISOString().split('T')[0]
            }]);

        if (dbError) throw dbError;

        alert("تم التسجيل! روحي شوفي الـ Console.");
        
    } catch (err) {
        alert("إيرور: " + err.message);
    } finally {
        setLoading(false);
    }
};

  const renderList = () => (
    <div className="w-full flex flex-col h-full bg-white p-8 animate-fade-in">
      <div className="flex justify-between items-center mb-8 shrink-0">
        <div>
          <h2 className="text-3xl font-bold text-[#0A1128] mb-1">Student Registration</h2>
          <p className="text-sm font-bold text-gray-500">Showing {filteredStudents.length} of {studentsData.length} students</p>
        </div>
        <button onClick={handleAddClick} className="bg-[#2563eb] hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-lg shadow-sm transition-colors flex items-center cursor-pointer">
          Add New <span className="ml-2 text-xl">+</span>
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-6 shrink-0 bg-gray-50 p-4 rounded-xl border border-gray-100">
        <div className="relative flex-1 min-w-[250px]">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">🔍</span>
          <input type="text" placeholder="Search by name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 transition-all" />
        </div>
        <select value={filterLang} onChange={(e) => setFilterLang(e.target.value)} className="bg-white border border-gray-200 text-sm rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 font-bold text-gray-600 cursor-pointer">
          <option value="All">All Languages</option>
          <option value="English">English</option><option value="Spanish">Spanish</option><option value="German">German</option><option value="French">French</option>
        </select>
        <select  value={filterType}  onChange={(e) => setFilterType(e.target.value)} 
        className="bg-white border border-gray-200 text-sm rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 font-bold text-gray-600 cursor-pointer"
         >
         < option value="All">All Types</option>
          <option value="Course">Direct Course</option>
         <option value="Placement">Placement Test</option>
         </select>
        <select value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)} className="bg-white border border-gray-200 text-sm rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 font-bold text-gray-600 cursor-pointer">
          <option value="All">All Levels</option>
          <option value="A1">A1</option><option value="A2">A2</option><option value="B1">B1</option><option value="B2">B2</option><option value="C1">C1</option>
        </select>
        {(filterLang !== 'All' || searchQuery !== '') && (
          <button onClick={() => { setFilterLang('All'); setFilterLevel('All'); setSearchQuery(''); }} className="text-xs font-bold text-red-500 hover:text-red-700 underline cursor-pointer">Clear Filters</button>
        )}
      </div>

      <div className="overflow-y-auto flex-1 border border-gray-100 rounded-xl custom-scrollbar">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="py-4 px-6 font-bold text-gray-600 uppercase text-xs">Name</th>
              <th className="py-4 px-6 font-bold text-gray-600 uppercase text-xs">Type</th>
              <th className="py-4 px-6 font-bold text-gray-600 uppercase text-xs">Level • Grp</th>
              <th className="py-4 px-6 font-bold text-gray-600 uppercase text-xs">Status</th>
              <th className="py-4 px-6 font-bold text-gray-600 uppercase text-xs text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredStudents.length > 0 ? filteredStudents.map((student) => (
              <tr key={student.id} className="hover:bg-blue-50/50 transition-colors group">
                <td className="py-4 px-6">
                  <p className="font-bold text-[#0A1128]">{student.first_name} {student.last_name}</p>
                  <p className="text-xs text-gray-500">{student.email}</p>
                </td>
                <td className="py-4 px-6 font-medium text-gray-700">{student.exam_type}</td>
                <td className="py-4 px-6 font-medium text-gray-700">{student.level} • {student.group_name}</td>
                <td className="py-4 px-6">
                  <span className={`px-2.5 py-1 rounded text-xs font-bold ${student.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {student.status}
                  </span>
                </td>
                <td className="py-4 px-6 flex justify-center space-x-4">
                  <button onClick={() => handleViewProfile(student)} className="text-gray-400 hover:text-blue-600 transition-colors text-lg" title="View Profile">👁️</button>
                  <button onClick={() => handleEditClick(student)} className="text-gray-400 hover:text-orange-500 transition-colors text-lg" title="Edit">✏️</button>
                  <button onClick={() => handleDelete(student.id)} className="text-gray-400 hover:text-red-600 transition-colors text-lg" title="Delete">🗑</button>
                </td>
              </tr>
            )) : <tr><td colSpan="5" className="py-12 text-center text-gray-400 font-bold">No students found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderForm = () => (
    <div className="w-full flex flex-col h-full bg-white p-8 animate-fade-in">
      <div className="flex items-center mb-8 shrink-0">
        <button onClick={() => setCurrentView('list')} className="mr-4 w-10 h-10 bg-gray-100 rounded-full font-bold flex items-center justify-center hover:bg-gray-200 cursor-pointer">←</button>
        <h2 className="text-3xl font-bold text-[#0A1128]">{currentView === 'add' ? 'Add New Student' : 'Edit Student'}</h2>
      </div>
      
      <form onSubmit={handleSave} className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 mb-6">
           <h3 className="font-bold text-lg mb-4 border-b border-gray-200 pb-2">Academic Details</h3>
           <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Registration Type</label>
                <select name="exam_type" value={formData.exam_type} onChange={handleInputChange} className="w-full border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-blue-500"><option value="Course">Direct Course</option><option value="Placement">Placement Test</option></select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Language</label>
                <select name="language" value={formData.language} onChange={handleInputChange} className="w-full border border-gray-200 rounded-lg p-3 text-sm"><option>English</option><option>Spanish</option><option>German</option><option>French</option></select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Level</label>
                <select name="level" value={formData.level} onChange={handleInputChange} className="w-full border border-gray-200 rounded-lg p-3 text-sm"><option>A1</option><option>A2</option><option>B1</option><option>B2</option><option>C1</option></select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Group</label>
                <select name="group" value={formData.group} onChange={handleInputChange} className="w-full border border-gray-200 rounded-lg p-3 text-sm"><option>Grp 1</option><option>Grp 2</option><option>Grp 3</option></select>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
           <div>
              <h3 className="font-bold text-lg mb-4 border-b border-gray-100 pb-2">Personal Info</h3>
              <div className="space-y-4">
                 <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="First Name" className="w-full border border-gray-200 p-3 rounded-lg text-sm" required />
                 <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Last Name" className="w-full border border-gray-200 p-3 rounded-lg text-sm" required />
                 {formData.exam_type === 'Course' && (
                   <input type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="Set Password for Student" className="w-full border border-blue-200 p-3 rounded-lg text-sm bg-blue-50" required />
                 )}
              </div>
           </div>
           <div>
              <h3 className="font-bold text-lg mb-4 border-b border-gray-100 pb-2">Contact Info</h3>
              <div className="space-y-4">
                 <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email Address" className="w-full border border-gray-200 p-3 rounded-lg text-sm" required />
                 <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone Number" className="w-full border border-gray-200 p-3 rounded-lg text-sm" />
              </div>
           </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end space-x-4">
          <button type="button" onClick={() => setCurrentView('list')} className="px-6 py-3 bg-gray-100 text-gray-600 font-bold rounded-lg cursor-pointer">Cancel</button>
          <button type="submit" disabled={loading} className="px-8 py-3 bg-[#2563eb] hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition-colors cursor-pointer">
            {loading ? 'Processing...' : 'Save Student'}
          </button>
        </div>
      </form>
    </div>
  );

  const renderProfile = () => {
    if (!selectedStudent) return null;
    return (
      <div className="w-full flex flex-col h-full bg-gray-50 p-8 animate-fade-in">
        <button onClick={() => setCurrentView('list')} className="mb-6 text-blue-600 font-bold hover:underline cursor-pointer">← Back to Students List</button>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden max-w-4xl mx-auto w-full">
           <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
           <div className="px-8 pb-8 relative">
              <div className="w-24 h-24 bg-white rounded-full border-4 border-white shadow-md absolute -top-12 flex items-center justify-center text-4xl overflow-hidden">
                 <img src={`https://ui-avatars.com/api/?name=${selectedStudent.first_name}+${selectedStudent.last_name}&background=eff6ff&color=2563eb`} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div className="pt-16 flex justify-between items-start">
                 <div>
                    <h2 className="text-3xl font-bold text-[#0A1128] mb-1">{selectedStudent.first_name} {selectedStudent.last_name}</h2>
                    <p className="text-gray-500 font-medium font-bold">Type: {selectedStudent.exam_type}</p>
                 </div>
                 <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${selectedStudent.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {selectedStudent.status}
                 </span>
              </div>
              <div className="grid grid-cols-2 gap-8 mt-10 border-t border-gray-100 pt-8">
                 <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Academic Record</h3>
                    <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                       <p className="flex justify-between"><span className="text-gray-500">Language:</span> <span className="font-bold">{selectedStudent.language}</span></p>
                       <p className="flex justify-between"><span className="text-gray-500">Level:</span> <span className="font-bold">{selectedStudent.level}</span></p>
                    </div>
                 </div>
                 <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Contact Details</h3>
                    <div className="space-y-3">
                       <p className="flex items-center"><span className="mr-3">📧</span> <span className="font-medium">{selectedStudent.email}</span></p>
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
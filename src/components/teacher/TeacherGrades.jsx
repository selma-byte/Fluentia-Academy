import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient'; 

const TeacherGrades = () => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  // State سبيسيال للنافذة المنبثقة (Modal) كي نكليكيو على التلميذ
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const { data, error } = await supabase
          .from('students')
          .select('*');

        if (error) {
          console.error("Error fetching students:", error);
          return;
        }

        if (data) {
          // درنا هاد القوائم باش نوزعوهم على التلاميذ ونجربو الفلتر
          const languages = ['English', 'French', 'German', 'Spanish'];
          const levels = ['A1', 'A2', 'B1', 'B2', 'C1'];
          const groups = ['Group 1', 'Group 2', 'New Students'];

          const realStudents = data.map((student, index) => ({
            id: student.id,
            name: `${student.first_name || ''} ${student.last_name || ''}`.trim() || 'New Student',
            email: student.email || 'No email provided', // جبدنا الإيميل باش نحطوه في البروفايل
            course: 'Communication Skills',
            language: student.language || 'English', 
            type: student.exam_type || 'Course', 
  
            level: student.level || 'B2', // إذا زدتي عمود level تان، نحي 'B2' وديري student.level
            group: student.group || 'Group 1',
            date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            grade: Math.floor(Math.random() * 10) + 10,
            status: 'Passed'
        }));
          
          setGrades(realStudents);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const [examTab, setExamTab] = useState('Course'); 
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLang, setFilterLang] = useState('All');
  const [filterLevel, setFilterLevel] = useState('All');
  const [filterGroup, setFilterGroup] = useState('All');
  
  const filteredGrades = grades.filter(g => {
    // تبديلة صغيرة هنا باش التاب يخدم مع الداتا الجديدة
    const matchesTab = examTab === 'Course' ? g.type === 'Course Exam' : g.type === 'Placement Test';
    const matchesSearch = g.name.toLowerCase().includes(searchTerm.toLowerCase()) || g.course.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLang = filterLang === 'All' ? true : g.language === filterLang;
    const matchesLevel = filterLevel === 'All' ? true : g.level === filterLevel;
    const matchesGroup = filterGroup === 'All' ? true : g.group === filterGroup;
    
    return matchesTab && matchesSearch && matchesLang && matchesLevel && matchesGroup;
  });

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <div className="text-xl font-bold text-[#4318FF] animate-pulse">Loading Students... ⏳</div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white p-8 overflow-y-auto custom-scrollbar animate-fadeIn relative">
      
      {/* =======================================
          Modal (نافذة بروفايل التلميذ)
          ======================================= */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center animate-fadeIn">
          <div className="bg-white rounded-3xl p-8 w-[600px] shadow-2xl relative">
            <button 
              onClick={() => setSelectedStudent(null)} 
              className="absolute top-5 right-6 text-gray-400 hover:text-red-500 font-bold text-2xl"
            >
              ✕
            </button>
            
            <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
              <span className="text-2xl">🎓</span>
              <h2 className="text-2xl font-bold text-[#1B254B]">Student Profile</h2>
            </div>
            
            <div className="flex items-center gap-5 mb-8">
              <div className="w-20 h-20 rounded-full bg-[#f0f7ff] border-2 border-[#4318FF] flex items-center justify-center text-3xl font-bold text-[#4318FF] uppercase shadow-sm">
                {selectedStudent.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#1B254B]">{selectedStudent.name}</h3>
                <p className="text-gray-500 text-sm mb-1">📧 {selectedStudent.email}</p>
                <div className="flex gap-2 mt-2">
                  <span className="bg-blue-50 text-[#4318FF] px-2 py-1 rounded text-xs font-bold">{selectedStudent.language}</span>
                  <span className="bg-green-50 text-green-600 px-2 py-1 rounded text-xs font-bold">Level {selectedStudent.level}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 border border-gray-100 p-4 rounded-2xl">
                <p className="text-xs text-gray-400 font-bold mb-1 uppercase tracking-wider">Course</p>
                <p className="font-bold text-[#1B254B]">{selectedStudent.course}</p>
              </div>
              <div className="bg-gray-50 border border-gray-100 p-4 rounded-2xl">
                <p className="text-xs text-gray-400 font-bold mb-1 uppercase tracking-wider">Group</p>
                <p className="font-bold text-[#1B254B]">{selectedStudent.group}</p>
              </div>
              <div className="bg-gray-50 border border-gray-100 p-4 rounded-2xl">
                <p className="text-xs text-gray-400 font-bold mb-1 uppercase tracking-wider">Exam Type</p>
                <p className="font-bold text-[#1B254B]">{selectedStudent.type}</p>
              </div>
              <div className="bg-[#e6fbf2] border border-[#00a65e]/20 p-4 rounded-2xl">
                <p className="text-xs text-[#00a65e] font-bold mb-1 uppercase tracking-wider">Current Grade</p>
                <p className="text-2xl font-black text-[#00a65e]">{selectedStudent.grade} <span className="text-sm text-gray-500">/ 20</span></p>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1B254B] flex items-center gap-2 mb-6">
          👋 Welcome, [Teacher Name]
        </h1>
      </div>

      <div className="bg-[#f8fafc] rounded-2xl p-6 flex justify-between items-center mb-8 border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="z-10">
          <h2 className="text-2xl font-bold text-[#1B254B] mb-2">Grade Management</h2>
          <p className="text-gray-500 text-sm">Click on any student to view their detailed profile and grades.</p>
        </div>
        <div className="hidden md:flex gap-4 items-center z-10 opacity-80">
          <span className="text-6xl">📝👩‍🎓</span>
        </div>
      </div>

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

      <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm mb-6 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input 
            type="text" 
            placeholder="Search by student name..." 
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

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-[#f0f7ff] text-[#2D428B] text-[13px] border-b border-gray-100">
              <th className="py-4 px-6 font-semibold w-12"><input type="checkbox" className="rounded" /></th>
              <th className="py-4 px-6 font-semibold">No</th>
              <th className="py-4 px-6 font-semibold">Student Name</th>
              <th className="py-4 px-6 font-semibold">Course Name</th>
              <th className="py-4 px-6 font-semibold">Level</th>
              <th className="py-4 px-6 font-semibold">Date</th>
              <th className="py-4 px-6 font-semibold">Grade</th>
              <th className="py-4 px-6 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredGrades.map((g, index) => (
              <tr 
                key={g.id} 
                onClick={() => setSelectedStudent(g)} // كي نكليكي يفتح النافذة
                className="border-b border-gray-50 hover:bg-blue-50 cursor-pointer transition-colors"
              >
                <td className="py-3 px-6" onClick={(e) => e.stopPropagation()}><input type="checkbox" className="rounded border-gray-300" /></td>
                <td className="py-3 px-6 text-sm text-gray-500">{(index + 1).toString().padStart(2, '0')}</td>
                
                <td className="py-3 px-6 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 text-[#4318FF] flex items-center justify-center text-xs font-bold shrink-0 uppercase">
                    {g.name.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-[#1B254B]">{g.name}</span>
                </td>

                <td className="py-3 px-6 text-sm text-gray-500">{g.course}</td>
                <td className="py-3 px-6 text-sm text-gray-500">{g.level}</td>
                <td className="py-3 px-6 text-sm text-gray-500">{g.date}</td>
                
                <td className="py-3 px-6">
                  <span className="text-sm font-bold text-[#1B254B]">{g.grade}/20</span>
                </td>

                <td className="py-3 px-6">
                  <span className="px-3 py-1 rounded-full text-xs font-bold flex items-center w-max gap-1 bg-[#e6fbf2] text-[#00a65e]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00a65e]"></span>
                    Passed
                  </span>
                </td>
              </tr>
            ))}
            
            {filteredGrades.length === 0 && (
              <tr>
                <td colSpan="8" className="py-8 text-center text-gray-400">
                  No students found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* نحينا الـ Pagination من هنا كاع كيما بغيتي */}
    </div>
  );
};

export default TeacherGrades;
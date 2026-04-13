import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient'; 

const StudentGrades = () => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  // الطالب يشوف غير بروفايلو
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const { data, error } = await supabase
          .from('students')
          .select('*')
          .limit(1)
          .single();

        if (error) {
          console.error("Error fetching student:", error);
          return;
        }

        if (data) {
          const studentData = {
            id: data.id,
            name: `${data.first_name || ''} ${data.last_name || ''}`.trim() || 'Student',
            email: data.email || 'No email provided',
            course: 'Communication Skills',
            language: data.language || 'English',
            type: data.exam_type || 'Course Exam',
            level: data.level || 'B2',
            group: data.group || 'Group 1',
            date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            grade: Math.floor(Math.random() * 10) + 10,
            status: 'Passed'
          };

          setGrades([studentData]);
          setSelectedStudent(studentData); // يفتح مباشرة
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, []);

  const [examTab, setExamTab] = useState('Course'); 

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <div className="text-xl font-bold text-[#4318FF] animate-pulse">Loading Grades... ⏳</div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white p-8 overflow-y-auto custom-scrollbar animate-fadeIn relative">
      
      {/* =======================================
          Modal (Student Profile - same design)
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
              <h2 className="text-2xl font-bold text-[#1B254B]">My Profile</h2>
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
                <p className="text-xs text-[#00a65e] font-bold mb-1 uppercase tracking-wider">My Grade</p>
                <p className="text-2xl font-black text-[#00a65e]">{selectedStudent.grade} <span className="text-sm text-gray-500">/ 20</span></p>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1B254B] flex items-center gap-2 mb-6">
          👋 Welcome, [Student Name]
        </h1>
      </div>

      <div className="bg-[#f8fafc] rounded-2xl p-6 flex justify-between items-center mb-8 border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="z-10">
          <h2 className="text-2xl font-bold text-[#1B254B] mb-2">My Grades</h2>
          <p className="text-gray-500 text-sm">View your performance and results.</p>
        </div>
        <div className="hidden md:flex gap-4 items-center z-10 opacity-80">
          <span className="text-6xl">📊🎓</span>
        </div>
      </div>

      <div className="flex gap-8 border-b border-gray-200 mb-6">
        <button 
          onClick={() => setExamTab('Course')}
          className={`text-lg font-bold pb-3 relative ${examTab === 'Course' ? 'text-[#4318FF]' : 'text-gray-400'}`}
        >
          📚 Course Grades
        </button>
        <button 
          onClick={() => setExamTab('Placement')}
          className={`text-lg font-bold pb-3 relative ${examTab === 'Placement' ? 'text-[#4318FF]' : 'text-gray-400'}`}
        >
          🎯 Placement Tests
        </button>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#f0f7ff] text-[#2D428B] text-[13px] border-b border-gray-100">
              <th className="py-4 px-6 font-semibold">Course</th>
              <th className="py-4 px-6 font-semibold">Level</th>
              <th className="py-4 px-6 font-semibold">Date</th>
              <th className="py-4 px-6 font-semibold">Grade</th>
              <th className="py-4 px-6 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {grades.map((g) => (
              <tr key={g.id} className="border-b border-gray-50">
                <td className="py-3 px-6 text-sm text-gray-500">{g.course}</td>
                <td className="py-3 px-6 text-sm text-gray-500">{g.level}</td>
                <td className="py-3 px-6 text-sm text-gray-500">{g.date}</td>
                <td className="py-3 px-6 font-bold text-[#1B254B]">{g.grade}/20</td>
                <td className="py-3 px-6">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#e6fbf2] text-[#00a65e]">
                    Passed
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default StudentGrades;
import React, { useState } from 'react';


import Exams from '../secretery/exams';
import Appointments from '../secretery/Appointments'; // تأكدي من المسار الصحيح // استيراد صفحة الدفع
import Enrollment from '../secretery/Enrollment';
import ParentPortal from '../secretery/ParentPortal';
import Documents from '../secretery/Documents';
import SchoolSchedule from '../secretery/SchoolSchedule';
import StudentRegistration from '../secretery/StudentRegistration';

import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

const SecretaryDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  // داخل مكون SecretaryDashboard مباشرة
  const navigate = useNavigate();

  const handleLogout = async () => {
  await supabase.auth.signOut(); // هادي هي اللي تخرجك من السيستام
  navigate('/login'); // ومبعد ترجعك لصفحة الدخول
  };
  const [examView, setExamView] = useState('home'); // أضيفي هذا السطر
  const menuItems = [
    { icon: "🏠", text: "Dashboard" },
    { icon: "📩", text: "teachers" },
    { icon: "🎓", text: "Student Registration" },
    { icon: "👥", text: "Student Records" },
    { icon: "📋", text: "Attendance Records" },
    { icon: "📅", text: "School Schedule" },
    { icon: "🏫", text: "Class Enrollment" },
    { icon: "💬", text: "Communicate Parents" },
    { icon: "⚙️", text: "Appointments" },
    { icon: "📄", text: "Documents" },
    { icon: "📝", text: "Exams" },
    { icon: "💳", text: "Payment" },
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      
      {/* =======================
          1. SIDEBAR
          ======================= */}
      <aside className="w-64 bg-[#0A1128] text-white flex flex-col justify-between shrink-0">
        <div>
          <div className="p-6 flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('Dashboard')}>
            <div className="w-8 h-8 bg-white/20 rounded-md flex items-center justify-center font-bold">S</div>
            <span className="text-xl font-bold tracking-wide">Smansys</span>
          </div>

          <nav className="mt-2 space-y-1 px-4 overflow-y-auto max-h-[70vh] custom-scrollbar">
            {menuItems.map((item, idx) => (
              <button 
                key={idx} 
                onClick={() => setActiveTab(item.text)}
                className={`w-full flex items-center px-4 py-3 rounded-lg text-sm transition-colors cursor-pointer
                  ${activeTab === item.text 
                    ? 'bg-white text-[#0A1128] font-bold shadow-md' 
                    : 'text-gray-400 font-medium hover:text-white hover:bg-white/10' 
                  }
                `}
              >
                <span className="mr-3">{item.icon}</span> {item.text}
              </button> 
          
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-white/10 mt-2">
          <button 
             onClick={handleLogout}
            className="flex items-center justify-between w-full px-4 py-3 bg-white text-[#0A1128] rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors cursor-pointer"
          >
            <span>Log Out</span>
            <span>➔</span>
          </button>
        </div>
      </aside>

      {/* =======================
          2. MAIN CONTENT AREA
          ======================= */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Header */}
        
        <Topbar setActiveTab={setActiveTab} onLogout={onLogout} />

        {/* 1. Dashboard Content */}
        {activeTab === 'Dashboard' && (
          <div className="flex-1 overflow-y-auto px-8 py-8 custom-scrollbar">
            
            <div className="mb-8 flex justify-between items-end">
              <div>
                <h1 className="text-2xl font-bold text-[#0A1128]">Welcome back, Marwa</h1>
                <p className="text-sm text-gray-500 mt-1">Here's a snapshot of the Polyglot Academy performance today.</p>
              </div>
              <button 
                onClick={() => {}}
                className="bg-white border border-gray-200 text-[#0A1128] px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-50 transition-colors cursor-pointer"
              >
                📄 Download Report
              </button>
            </div>

            {/* Stats Cards - كل البطاقات تفاعلية الآن */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div 
                onClick={() => setActiveTab("Student Records")}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow cursor-pointer" 
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-xl">👥</div>
                  <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">+12%</span>
                </div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Students</h3>
                <p className="text-3xl font-bold text-[#0A1128]">2,450</p>
              </div>

              <div 
                onClick={() => {}}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow cursor-pointer" 
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-lg flex items-center justify-center text-xl">👨‍🏫</div>
                  <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Stable</span>
                </div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Teachers</h3>
                <p className="text-3xl font-bold text-[#0A1128]">120</p>
              </div>

              <div 
                onClick={() => setActiveTab("Class Enrollment")}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow cursor-pointer" 
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-lg flex items-center justify-center text-xl">📚</div>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">+4 New</span>
                </div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Courses</h3>
                <p className="text-3xl font-bold text-[#0A1128]">45</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Recent Activities */}
              <div className="lg:col-span-2">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-[#0A1128]">Recent Activities</h2>
                  <button 
                    onClick={() => {}}
                    className="text-sm font-bold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                  >
                    View All
                  </button>
                </div>
                
                <div className="bg-transparent space-y-6">
                  {[
                    { icon: "👤", color: "text-blue-500", bg: "bg-blue-50", title: "New student registered", desc: "Elena Gilbert has joined the English department.", time: "2H AGO" },
                    { icon: "⏱️", color: "text-orange-500", bg: "bg-orange-50", title: "Teacher attendance updated", desc: "Attendance records for 12 faculty members were finalized.", time: "5H AGO" },
                    { icon: "📝", color: "text-purple-500", bg: "bg-purple-50", title: "Exam schedule published", desc: "Mid-term schedules for Semester 4 are now live.", time: "6H AGO" },
                    { icon: "💰", color: "text-green-500", bg: "bg-green-50", title: "Fee payment confirmed", desc: "Transaction #TX9842 verified for 45 students.", time: "YESTERDAY" },
                  ].map((act, idx) => (
                    // القائمة تفاعلية بالكامل
                    <div 
                      key={idx} 
                      onClick={() => {}}
                      className="flex items-start group hover:bg-gray-100 p-2 -ml-2 rounded-lg transition-colors cursor-pointer" 
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${act.bg} ${act.color} mr-4 shrink-0 shadow-sm`}>
                        {act.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-[#0A1128] group-hover:text-blue-600 transition-colors">{act.title}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">{act.desc}</p>
                      </div>
                      <span className="text-[10px] font-bold text-gray-400">{act.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions - الأزرار تفاعلية وتتغير عند الضغط */}
              <div>
                <h2 className="text-lg font-bold text-[#0A1128] mb-4">Quick Actions</h2>
                <div className="space-y-3 mb-6">
                  <button 
                    onClick={() => setActiveTab('Student Registration')} 
                    className="w-full flex justify-between items-center px-5 py-4 bg-white border border-gray-200 text-[#0A1128] rounded-xl text-sm font-bold hover:bg-gray-50 focus:bg-[#1e3a8a] focus:text-white active:bg-[#1e3a8a] active:text-white transition-colors shadow-sm cursor-pointer active:scale-95"
                  >
                    <span className="flex items-center"><span className="mr-3 text-lg">👤+</span> Add Student</span><span>→</span>
                  </button>
                  <button 
                    onClick={() => {}} 
                    className="w-full flex justify-between items-center px-5 py-4 bg-white border border-gray-200 text-[#0A1128] rounded-xl text-sm font-bold hover:bg-gray-50 focus:bg-[#1e3a8a] focus:text-white active:bg-[#1e3a8a] active:text-white transition-colors shadow-sm cursor-pointer active:scale-95"
                  >
                    <span className="flex items-center"><span className="mr-3 text-lg">👨‍🏫+</span> Add Teacher</span><span>→</span>
                  </button>
                  <button 
                    onClick={() => {}} 
                    className="w-full flex justify-between items-center px-5 py-4 bg-white border border-gray-200 text-[#0A1128] rounded-xl text-sm font-bold hover:bg-gray-50 focus:bg-[#1e3a8a] focus:text-white active:bg-[#1e3a8a] active:text-white transition-colors shadow-sm cursor-pointer active:scale-95"
                  >
                    <span className="flex items-center"><span className="mr-3 text-lg">📚+</span> New Course</span><span>→</span>
                  </button>
                </div>

                <div className="bg-red-50 border border-red-100 rounded-xl p-5 shadow-sm">
                  <h4 className="text-sm font-bold text-red-800 flex items-center mb-2"><span className="mr-2">❗</span> Action Required</h4>
                  <p className="text-xs text-red-700 leading-relaxed mb-4">3 teachers have not submitted their monthly attendance reports.</p>
                  <button 
                    onClick={() => {}}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 px-4 rounded-lg transition-colors cursor-pointer shadow-md active:scale-95 w-full"
                  >
                    NOTIFY NOW
                  </button>
                </div>
              </div>

            </div>
          </div>
        )} 

        {/* 2. Payment Content */}
        {activeTab === 'Payment' && <Payment />}
        {/* 3. شرط صفحة الامتحانات */}
        {activeTab === 'Exams' && <Exams examView={examView} setExamView={setExamView} />}
        {activeTab === 'Appointments' && <Appointments />}
        {activeTab === 'Class Enrollment' && <Enrollment />}
        {activeTab === 'Communicate Parents' && <ParentPortal />}
        {activeTab === 'Documents' && <Documents />}
        {activeTab === 'School Schedule' && <SchoolSchedule />}
        {activeTab === 'Student Registration' && <StudentRegistration />}
        {activeTab === 'Student Records' && <StudentRecords />}
        {activeTab === 'Attendance Records' && <AttendanceRecords />}
        {activeTab === 'Registration Requests' && <RegistrationRequests />}
        
        
      </main>
    </div>
  );
};

export default SecretaryDashboard;
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

// --- 1. استيراد المكونات مع تصحيح المسارات ---
import Topbar from '../Topbar'; 
import RegistrationRequests from './RegistrationRequests';
import StudentRegistration from './StudentRegistration';
import StudentRecords from './StudentRecords';
import AttendanceRecords from './AttendanceRecords';
import SchoolSchedule from './SchoolSchedule';
import Enrollment from './Enrollment';
import Appointments from './Appointments';
import Documents from './Documents';
import ParentPortal from './ParentPortal'; 
import Exams from './exams';           
import Payment from './payment';       
import PaymentStaff from './paymentstaff'; 
import TeacherApplicant from './teacherapplicant'; 
import Reports from './reports';       
import Users from './users';           
import Settings from './settings';     

const AdminLayout = () => {
  const [activeTab, setActiveTab] = useState('ADMIN Dashboard');
  const [examView, setExamView] = useState('home');
  const navigate = useNavigate();

  // منطق تسجيل الخروج
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) navigate('/login');
  };

  // القائمة الجانبية الكاملة (17 خيار)
  const menuItems = [
    { icon: "🏠", text: "ADMIN Dashboard" },
    { icon: "📩", text: "Registration Requests" },
    { icon: "📝", text: "Student Registration" },
    { icon: "📂", text: "Student Records" },
    { icon: "📅", text: "Attendance Records" },
    { icon: "⏰", text: "School Schedule" },
    { icon: "🏫", text: "Class Enrollment" },
    { icon: "💬", text: "Communicate Parents" },
    { icon: "🤝", text: "Appointments" },
    { icon: "📄", text: "Documents" },
    { icon: "✍️", text: "Exams" },
    { icon: "💳", text: "Payment Students" },
    { icon: "💰", text: "Payment Staff" },
    { icon: "👩‍🏫", text: "Teacher Applicants" },
    { icon: "📊", text: "Reports" },
    { icon: "👤", text: "Users" },
    { icon: "⚙️", text: "Settings" },
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans overflow-hidden">
      
      {/* --- SIDEBAR (التصميم الفخم) --- */}
      <aside className="w-72 bg-[#1A2252] text-white flex flex-col m-4 rounded-[2.5rem] shadow-2xl shrink-0 z-20">
        <div className="p-8 flex items-center gap-3">
          <div className="bg-white p-2 rounded-xl shadow-lg">
              <span className="text-[#1A2252] font-black text-xl">S</span>
          </div>
          <h1 className="text-2xl font-bold italic tracking-tight">Smansys</h1>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 custom-scrollbar mt-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.text}>
                <button
                  onClick={() => setActiveTab(item.text)}
                  className={`
                    w-full flex items-center gap-4 px-6 py-3.5 rounded-2xl transition-all duration-300 font-bold italic text-sm cursor-pointer
                    ${activeTab === item.text 
                      ? 'bg-white text-[#1A2252] shadow-[0_10px_20px_rgba(0,0,0,0.2)] translate-x-2' 
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'}
                  `}
                >
                  <span className="text-xl group-hover:scale-120 transition-transform">{item.icon}</span>
                  {item.text}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-6 mt-auto">
          <button 
            onClick={handleLogout}
            className="flex items-center justify-between w-full bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-4 rounded-2xl font-bold italic hover:from-red-600 hover:to-red-700 transition-all shadow-lg cursor-pointer"
          >
            <span>Log Out</span>
            <span className="text-xl">➔</span>
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Topbar المخصص لـ Malak */}
        <Topbar setActiveTab={setActiveTab} />

        {/* Dynamic Content Loader */}
        <section className="flex-1 overflow-y-auto px-10 pb-10 mt-4 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'ADMIN Dashboard' && <DashboardContent setActiveTab={setActiveTab} />}
            {activeTab === 'Registration Requests' && <RegistrationRequests />}
            {activeTab === 'Student Registration' && <StudentRegistration />}
            {activeTab === 'Student Records' && <StudentRecords />}
            {activeTab === 'Attendance Records' && <AttendanceRecords />}
            {activeTab === 'School Schedule' && <SchoolSchedule />}
            {activeTab === 'Class Enrollment' && <Enrollment />}
            {activeTab === 'Communicate Parents' && <ParentPortal />}
            {activeTab === 'Appointments' && <Appointments />}
            {activeTab === 'Documents' && <Documents />}
            {activeTab === 'Exams' && <Exams examView={examView} setExamView={setExamView} />}
            {activeTab === 'Payment Students' && <Payment />}
            {activeTab === 'Payment Staff' && <PaymentStaff />}
            {activeTab === 'Teacher Applicants' && <TeacherApplicant />}
            {activeTab === 'Reports' && <Reports />}
            {activeTab === 'Users' && <Users />}
            {activeTab === 'Settings' && <Settings />}
          </div>
        </section>
      </main>

      {/* CSS Styles for scrollbar */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }
      `}</style>
    </div>
  );
};

// --- واجهة الإحصائيات الرئيسية (Dashboard Content) ---
const DashboardContent = ({ setActiveTab }) => {
  const stats = [
    { title: 'Total Students', value: '2,450', change: '+12%', icon: '👥', color: 'text-blue-600', bg: 'bg-blue-50', target: 'Student Records' },
    { title: 'Active Teachers', value: '120', change: 'Stable', icon: '🧑‍🏫', color: 'text-purple-600', bg: 'bg-purple-50', target: 'Teacher Applicants' },
    { title: 'Monthly Revenue', value: '1.2M دج', change: '+8.4%', icon: '💰', color: 'text-green-600', bg: 'bg-green-50', target: 'Payment Students' },
    { title: 'Pending Exams', value: '12', change: 'Urgent', icon: '📝', color: 'text-orange-600', bg: 'bg-orange-50', target: 'Exams' },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Header Section */}
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-5xl font-black text-[#1A2252] mb-3 italic tracking-tight">
            Welcome back, <span className="text-blue-600">Malak</span>
          </h2>
          <p className="text-gray-400 font-bold italic text-lg">System status is normal. You have 3 new notifications.</p>
        </div>
        <div className="hidden md:block">
            <span className="text-sm font-bold bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 italic">
               📅 {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {stats.map((stat, i) => (
          <div 
            key={i} 
            onClick={() => setActiveTab(stat.target)}
            className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-50 flex flex-col justify-between h-64 hover:shadow-2xl hover:-translate-y-2 transition-all group cursor-pointer relative overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} opacity-20 rounded-bl-[5rem] transition-all group-hover:scale-110`}></div>
            
            <div className="flex justify-between items-start relative z-10">
              <div className={`w-16 h-16 ${stat.bg} rounded-2xl flex items-center justify-center text-3xl shadow-sm`}>{stat.icon}</div>
              <span className={`text-[11px] font-black px-3 py-1 rounded-full ${stat.bg} ${stat.color} border border-white`}>{stat.change}</span>
            </div>
            
            <div className="relative z-10">
              <p className="text-xs font-black text-gray-300 tracking-[0.2em] uppercase mb-1 italic">{stat.title}</p>
              <p className="text-4xl font-black text-[#1A2252]">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Layout: Recent Activities & Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-white rounded-[3.5rem] p-10 shadow-sm border border-gray-50">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold text-[#1A2252] italic">Recent System Activities</h3>
            <button className="text-blue-500 font-bold text-sm hover:underline italic">View History</button>
          </div>
          <div className="space-y-6">
            <ActivityRow icon="👤" title="New Registration" desc="Student 'Amine' applied for English B1" time="2m ago" />
            <ActivityRow icon="💳" title="Payment Confirmed" desc="Invoice #8840 processed successfully" time="15m ago" />
            <ActivityRow icon="📝" title="Exam Uploaded" desc="Teacher 'Sarah' added final results" time="1h ago" />
          </div>
        </div>

        {/* Admin Shortcuts */}
        <div className="bg-[#1A2252] rounded-[3.5rem] p-10 shadow-2xl text-white">
          <h3 className="text-xl font-bold mb-8 italic">Quick Actions</h3>
          <div className="space-y-4">
            <ShortcutBtn label="Add New Student" onClick={() => setActiveTab('Student Registration')} />
            <ShortcutBtn label="Generate Reports" onClick={() => setActiveTab('Reports')} />
            <ShortcutBtn label="Manage Users" onClick={() => setActiveTab('Users')} />
          </div>
        </div>
      </div>
    </div>
  );
};

// Components Helper
const ActivityRow = ({ icon, title, desc, time }) => (
  <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-3xl transition-all cursor-pointer group border border-transparent hover:border-gray-100">
    <div className="flex items-center gap-5">
      <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-xl group-hover:bg-white transition-colors">{icon}</div>
      <div>
        <h4 className="font-bold text-[#1A2252] italic">{title}</h4>
        <p className="text-sm text-gray-400 font-medium">{desc}</p>
      </div>
    </div>
    <span className="text-[10px] font-black text-gray-300 uppercase italic">{time}</span>
  </div>
);

const ShortcutBtn = ({ label, onClick }) => (
  <button 
    onClick={onClick}
    className="w-full py-4 px-6 bg-white/5 hover:bg-white hover:text-[#1A2252] border border-white/10 rounded-2xl text-sm font-bold italic transition-all text-left flex justify-between items-center group"
  >
    {label} <span className="opacity-0 group-hover:opacity-100 transition-opacity">➔</span>
  </button>
);

export default AdminLayout;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

// IMPORTS
import Topbar from './Topbar';
import RegistrationRequests from './RegistrationRequests';
import StudentRegistration from './StudentRegistration';
import StudentRecords from './StudentRecords';
import AttendanceRecords from './AttendanceRecords';
import SchoolSchedule from './SchoolSchedule';
import Enrollment from './Enrollment';
import ParentPortal from './ParentPortal';
import Appointments from './Appointments';
import Documents from './Documents';
import Exams from './exams'; 
import Payment from './payment'; 
import PaymentStaff from './paymentstaff'; 
import TeacherApplicant from './teacherapplicant'; 
import Reports from './reports'; 
import Users from './users'; 
import Settings from './settings'; 

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('ADMIN Dashboard');
  const [examView, setExamView] = useState('home');
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) navigate('/login');
  };

  // Menu items including the missing ones from the first version
  const menuItems = [
    { icon: "🏠", text: "ADMIN Dashboard" },
    { icon: "📩", text: "Registration Requests" },
    { icon: "📝", text: "Student Registration" },
    { icon: "📂", text: "Student Records" },
    { icon: "📅", text: "Attendance Records" },
    { icon: "⏰", text: "School Schedule" },
    { icon: "🏫", text: "Enrollment" },
    { icon: "💬", text: "Parent Portal" },
    { icon: "🤝", text: "Appointments" },
    { icon: "📄", text: "Documents" },
    { icon: "✍️", text: "Exams" },
    { icon: "💳", text: "Payment" },
    { icon: "💰", text: "Payment Staff" },
    { icon: "👩‍🏫", text: "Teacher Applicants" },
    { icon: "📊", text: "Reports" },
    { icon: "👤", text: "Users" },
    { icon: "⚙️", text: "Settings" },
  ];

  // CENTRAL ROUTER LOGIC
  const renderTabContent = () => {
    switch (activeTab) {
      case 'ADMIN Dashboard': return <DashboardContent setActiveTab={setActiveTab} />;
      case 'Registration Requests': return <RegistrationRequests />;
      case 'Student Registration': return <StudentRegistration />;
      case 'Student Records': return <StudentRecords />;
      case 'Attendance Records': return <AttendanceRecords />;
      case 'School Schedule': return <SchoolSchedule />;
      case 'Enrollment': return <Enrollment />;
      case 'Parent Portal': return <ParentPortal />;
      case 'Appointments': return <Appointments />;
      case 'Documents': return <Documents />;
      case 'Exams': return <Exams examView={examView} setExamView={setExamView} />;
      case 'Payment': return <Payment />;
      case 'Payment Staff': return <PaymentStaff />;
      case 'Teacher Applicants': return <TeacherApplicant />;
      case 'Reports': return <Reports />;
      case 'Users': return <Users />;
      case 'Settings': return <Settings />;
      default: return <DashboardContent setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans overflow-hidden text-gray-900">
      {/* ASIDE - Styled like the first code */}
      <aside className="w-72 bg-[#1A2252] text-white flex flex-col m-4 rounded-[2.5rem] shadow-2xl shrink-0 z-20">
        <div className="p-8 flex items-center gap-3">
          <div className="bg-white p-2 rounded-xl shadow-lg">
            <span className="text-[#1A2252] font-black text-xl">S</span>
          </div>
          <h1 className="text-2xl font-bold italic tracking-tight">Smansys</h1>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 mt-4 custom-scrollbar">
          <ul className="space-y-2 pb-10">
            {menuItems.map((item) => (
              <li key={item.text}>
                <button
                  onClick={() => setActiveTab(item.text)}
                  className={`w-full flex items-center gap-4 px-6 py-3.5 rounded-2xl transition-all duration-300 font-bold italic text-sm cursor-pointer ${
                    activeTab === item.text 
                    ? 'bg-white text-[#1A2252] shadow-lg translate-x-2' 
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  {item.text}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-6 mt-auto">
          <button onClick={handleLogout} className="flex items-center justify-between w-full bg-red-500 text-white px-6 py-4 rounded-2xl font-bold italic hover:bg-red-600 transition-all cursor-pointer shadow-lg">
            <span>Log Out</span>
            <span>➔</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <Topbar setActiveTab={setActiveTab} />
        
        <section className="flex-1 overflow-y-auto px-10 pb-10 mt-4 custom-scrollbar">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700">
            {renderTabContent()}
          </div>
        </section>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </div>
  );
};

const DashboardContent = ({ setActiveTab }) => {
  const stats = [
    { title: 'Total Students', value: '2,450', change: '+12%', icon: '👥', color: 'text-blue-600', bg: 'bg-blue-50', target: 'Student Registration' },
    { title: 'Total Teachers', value: '120', change: '+5%', icon: '👨‍🏫', color: 'text-green-600', bg: 'bg-green-50', target: 'Teacher Applicants' },
    { title: 'Pending Exams', value: '12', change: 'Urgent', icon: '📝', color: 'text-orange-600', bg: 'bg-orange-50', target: 'Exams' },
  ];
  
  return (
    <div className="space-y-10">
      <div className="mb-10">
        <h2 className="text-5xl font-black text-[#1A2252] mb-3 italic">
          Welcome back, <span className="text-blue-600 underline decoration-pink-500 decoration-4">Malak</span>
        </h2>
        <p className="text-gray-400 font-bold italic text-lg">System status is normal.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {stats.map((stat, i) => (
          <div key={i} onClick={() => setActiveTab(stat.target)} className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-50 flex flex-col justify-between h-64 hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer group relative overflow-hidden">
            <div className={`w-16 h-16 ${stat.bg} rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform relative z-10`}>{stat.icon}</div>
            <div className="relative z-10">
              <p className="text-xs font-black text-gray-300 uppercase mb-1 italic">{stat.title}</p>
              <p className="text-4xl font-black text-[#1A2252]">{stat.value}</p>
            </div>
            <div className="absolute -right-4 -bottom-4 text-8xl opacity-5 group-hover:opacity-10 transition-opacity rotate-12">{stat.icon}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
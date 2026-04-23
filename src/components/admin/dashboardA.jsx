import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

// --- CORE UI COMPONENTS ---
import Topbar from './Topbar';
import StudentsManagement from './StudentsManagement';
import AttendanceRecords from './AttendanceRecords';
import SchedulingHub from './SchedulingHub';
import ParentPortal from './ParentPortal';
import Documents from './Documents';
import Exams from './exams';
import Payment from './payment';
import SchoolSchedule from './SchoolSchedule';

// --- ADMIN SPECIFIC MODULES ---
import TeacherManagement from './TeacherManagement';
import Reports from './reports';
import Users from './users';
import Settings from './settings';

// ==========================================
// 🏠 DASHBOARD CONTENT
// ==========================================
const DashboardContent = ({ setActiveTab }) => {
  const [statsData, setStatsData] = useState({ students: 0, teachers: 0, courses: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      setLoading(true);
      try {
        const { count: studentCount } = await supabase.from('students').select('*', { count: 'exact', head: true });
        const { count: teacherCount } = await supabase.from('staff').select('*', { count: 'exact', head: true }).ilike('role', 'Teacher');
        const { count: courseCount } = await supabase.from('classes').select('*', { count: 'exact', head: true });

        setStatsData({
          students: studentCount || 0,
          teachers: teacherCount || 0,
          courses: courseCount || 0
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const stats = [
    { label: 'TOTAL STUDENTS', val: loading ? '...' : statsData.students, icon: '👥', grad: 'from-[#4F46E5] to-[#3B82F6]', growth: '+12.5%', glow: 'shadow-blue-500/20', tab: 'Students Management' },
    { label: 'TOTAL TEACHERS', val: loading ? '...' : statsData.teachers, icon: '👨‍🏫', grad: 'from-[#F59E0B] to-[#EA580C]', growth: 'STABLE', glow: 'shadow-orange-500/20', tab: 'Teacher Management' },
    { label: 'TOTAL COURSES', val: loading ? '...' : statsData.courses, icon: '📚', grad: 'from-[#6366F1] to-[#4F46E5]', growth: '+4 NEW', glow: 'shadow-indigo-500/20', tab: 'Scheduling Hub' }
  ];

  // Logic for Quick Action buttons
  const quickActions = [
    { name: 'Add Student', tab: 'Students Management' },
    { name: 'Hire Teacher', tab: 'Teacher Management' },
    { name: 'Create Class', tab: 'Scheduling Hub' }
  ];

  return (
    <div className="animate-in fade-in duration-500 w-full text-left">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-[#0A1128]">Welcome back, Admin</h1>
          <p className="text-sm text-gray-400 mt-1 uppercase tracking-widest font-black opacity-50">Polyglot Academy Management</p>
        </div>
      </div>

      {/* MODERN DYNAMIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {stats.map((stat, i) => (
          <div key={i} onClick={() => setActiveTab(stat.tab)} className={`group relative bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50 flex flex-col hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden ${stat.glow}`}>
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-gray-50/50 rounded-full transition-transform group-hover:scale-110" />
            <div className="flex justify-between items-start mb-8 relative z-10">
              <div className={`w-14 h-14 bg-gradient-to-br ${stat.grad} text-white rounded-2xl flex items-center justify-center text-2xl shadow-xl transform group-hover:rotate-6 transition-transform`}>{stat.icon}</div>
              <span className="text-[10px] font-black px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 tracking-tighter">{stat.growth}</span>
            </div>
            <div className="relative z-10">
              <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-1">{stat.label}</h3>
              <p className="text-4xl font-black text-[#0A1128] tracking-tighter">{stat.val}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6 px-2">
            <h2 className="text-lg font-bold text-[#0A1128]">System Activity</h2>
            <button className="text-xs font-bold text-blue-600 hover:underline cursor-pointer">View All</button>
          </div>
          <div className="space-y-3">
            {["New student registered", "Teacher attendance updated", "Exam schedule published"].map((title, idx) => (
              <div key={idx} className="flex items-center p-4 bg-white border border-transparent hover:border-gray-100 hover:shadow-sm rounded-[1.5rem] cursor-pointer transition-all">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center mr-4 text-lg">🔔</div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-[#0A1128]">{title}</h4>
                  <p className="text-xs text-gray-400 mt-0.5">Automated system update log.</p>
                </div>
                <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">{idx + 1}H AGO</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-lg font-bold text-[#0A1128] px-2">Quick Actions</h2>
          <div className="space-y-2.5">
            {quickActions.map((action) => (
              <button 
                key={action.name} 
                onClick={() => setActiveTab(action.tab)}
                className="w-full flex justify-between items-center px-5 py-4 bg-white border border-gray-100 rounded-[1.5rem] text-[11px] font-black uppercase tracking-wider text-[#0A1128] hover:bg-gray-50 transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                <span>{action.name}</span>
                <span className="text-gray-300 text-lg">➔</span>
              </button>
            ))}
          </div>
          <div className="bg-[#FFF8F8] border border-red-50 rounded-[2.5rem] p-7 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#D90429]" />
            <h4 className="text-[10px] font-black text-red-800 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" /> Action Needed
            </h4>
            <p className="text-xs text-red-700 leading-relaxed mb-6 font-medium">Monthly staff attendance reports are pending.</p>
            <button className="w-full bg-[#D90429] hover:bg-red-700 text-white text-[10px] font-black py-4 rounded-2xl tracking-widest active:scale-95 shadow-xl shadow-red-200 cursor-pointer">
              NOTIFY STAFF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 🛡️ ADMIN DASHBOARD MAIN COMPONENT
// ==========================================
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [examView, setExamView] = useState('home');
  const navigate = useNavigate();

  // 💡 State جديد باش نخبوا فيه اللوغو واسم المدرسة
  const [schoolBranding, setSchoolBranding] = useState({ logo: null, name: 'Smansys' });

  // 💡 جلب اللوغو والاسم من الداتا باز كي تفتح الباجة
  useEffect(() => {
    const fetchBranding = async () => {
      const { data, error } = await supabase
        .from('school_settings')
        .select('logo, name')
        .eq('id', 1)
        .single();

      if (data && !error) {
        setSchoolBranding({
          logo: data.logo,
          name: data.name || 'Smansys'
        });
      }
    };
    fetchBranding();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const menuItems = [
    { icon: "🏠", text: "Dashboard" },
    { icon: "👨‍🏫", text: "Teacher Management" },
    { icon: "🎓", text: "Students Management" },
    { icon: "📋", text: "Attendance Records" },
    { icon: "🏫", text: "Scheduling Hub" },
    { icon: "💬", text: "Communicate Parents" },
    { icon: "📄", text: "Documents" },
    { icon: "📝", text: "Exams" },
    { icon: "💳", text: "Payment" },
    { icon: "📊", text: "Reports" },
    { icon: "👥", text: "Users" },
    { icon: "🏫", text: "School Profile" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Dashboard': return <DashboardContent setActiveTab={setActiveTab} />;
      case 'Teacher Management': return <TeacherManagement />;
      case 'Students Management': return <StudentsManagement />;
      case 'Attendance Records': return <AttendanceRecords />;
      case 'Scheduling Hub': return <SchedulingHub />;
      case 'Communicate Parents': return <ParentPortal />;
      case 'Documents': return <Documents />;
      case 'Exams': return <Exams examView={examView} setExamView={setExamView} />;
      case 'Payment': return <Payment />;
      case 'Reports': return <Reports />;
      case 'Users': return <Users />;
      case 'School Profile': return <Settings />;
      default: return <DashboardContent setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#F8F9FA] font-sans text-[#0A1128] overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#0A1128] text-white flex flex-col shrink-0 border-r border-white/5">
        
        {/* 💡 هنا راني درت اللوغو المربوط بالداتا باز */}
        <div className="p-6 flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('Dashboard')}>
          {schoolBranding.logo ? (
            <img 
              src={schoolBranding.logo} 
              alt="School Logo" 
              className="w-8 h-8 rounded-lg object-contain bg-white/10 border border-white/10" 
            />
          ) : (
            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center font-bold text-sm border border-white/10">
              {schoolBranding.name.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="text-xl font-bold tracking-tight truncate max-w-[140px]">
            {schoolBranding.name}
          </span>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 mt-1 space-y-0.5 custom-scrollbar">
          {menuItems.map((item) => (
            <button
              key={item.text}
              onClick={() => setActiveTab(item.text)}
              className={`w-full flex items-center px-4 py-2.5 rounded-xl text-[13px] transition-all duration-200 
                ${activeTab === item.text 
                  ? 'bg-white text-[#0A1128] font-bold shadow-lg' 
                  : 'text-gray-400 font-medium hover:text-white hover:bg-white/10 cursor-pointer'
                }`}
            >
              <span className="mr-3 text-base">{item.icon}</span> 
              <span>{item.text}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button onClick={handleLogout} className="flex items-center justify-between w-full px-4 py-3 bg-white text-[#0A1128] rounded-xl text-sm font-bold hover:bg-gray-100 transition-all active:scale-95 shadow-sm group cursor-pointer">
            <span>Log Out</span> <span className="font-bold text-lg">➔</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#F8F9FA]">
        <Topbar setActiveTab={setActiveTab} />
        
        <div className="flex-1 overflow-y-auto px-8 py-8 custom-scrollbar">
          <div className="w-full max-w-none"> 
            {renderTabContent()}
          </div>
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
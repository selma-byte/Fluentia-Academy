import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';

// --- 1. MAIN LAYOUT COMPONENT ---
const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Your 17 Navbar items accurately mapped to your file structure
  const menuItems = [
    { name: 'ADMIN Dashboard', icon: '🏠', path: '/admin/dashboard' },
    { name: 'Registration Requests', icon: '📩', path: '/admin/requests' },
    { name: 'Student Registration', icon: '📝', path: '/admin/registration' },
    { name: 'Student Records', icon: '📂', path: '/admin/records' },
    { name: 'Attendance Records', icon: '📅', path: '/admin/attendance' },
    { name: 'School Schedule', icon: '⏰', path: '/admin/schedule' },
    { name: 'Class Enrollment', icon: '🏫', path: '/admin/enrollment' },
    { name: 'Communicate Parents', icon: '💬', path: '/admin/communicate' },
    { name: 'Appointments', icon: '🤝', path: '/admin/appointments' },
    { name: 'Documents', icon: '📄', path: '/admin/documents' },
    { name: 'Exams', icon: '✍️', path: '/admin/exams' },
    { name: 'Payment Students', icon: '💳', path: '/admin/payment-students' },
    { name: 'Payment Staff', icon: '💰', path: '/admin/payment-staff' },
    { name: 'Teacher Applicants', icon: '🧑‍🏫', path: '/admin/applicants' },
    { name: 'Reports', icon: '📊', path: '/admin/reports' },
    { name: 'Users', icon: '👤', path: '/admin/users' },
    { name: 'Settings', icon: '⚙️', path: '/admin/settings' },
  ];

  const notificationData = [
    { id: 1, text: "New registration request from Sarah J.", type: "urgent" },
    { id: 2, text: "Teacher Ahmed uploaded exam results", type: "academic" },
    { id: 3, text: "Monthly report is ready for review", type: "report" }
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-72 bg-[#1A2252] text-white flex flex-col m-4 rounded-[2.5rem] shadow-2xl shrink-0">
        <div className="p-8 flex items-center gap-3 cursor-pointer" onClick={() => navigate('/admin/dashboard')}>
          <div className="bg-white p-2 rounded-xl">
             <span className="text-[#1A2252] font-black text-xl">S</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Smansys</h1>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 custom-scrollbar">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center gap-4 px-5 py-3 rounded-2xl transition-all duration-300 font-medium text-sm
                    ${isActive 
                      ? 'bg-white text-[#1A2252] shadow-lg translate-x-2' 
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'}
                  `}
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-6 mt-auto">
          <button className="flex items-center justify-between w-full bg-white text-[#1A2252] px-6 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-all shadow-lg">
            Log Out <span className="text-xl">➔</span>
          </button>
        </div>
      </aside>

      {/* CONTENT AREA */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-24 flex items-center justify-end px-10 shrink-0 relative">
           <div className="flex items-center gap-6" ref={notificationRef}>
             
             {/* NOTIFICATION BELL BUTTON */}
             <div 
               className="relative cursor-pointer hover:scale-110 transition-transform p-2"
               onClick={() => setShowNotifications(!showNotifications)}
             >
               <span className="text-2xl text-gray-400">🔔</span>
               <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                 {notificationData.length}
               </span>
               
               {/* NOTIFICATION DROPDOWN CARD */}
               {showNotifications && (
                 <div className="absolute right-0 mt-4 w-80 bg-white rounded-3xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-slide-down">
                   <div className="p-5 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                     <h4 className="font-bold text-[#1A2252]">Notifications</h4>
                   </div>
                   <div className="max-h-64 overflow-y-auto">
                     {notificationData.map((note) => (
                       <div key={note.id} className="p-4 hover:bg-blue-50 transition-colors border-b border-gray-50 last:border-0 text-left">
                         <p className="text-sm font-semibold text-gray-700">{note.text}</p>
                         <span className="text-[10px] uppercase text-gray-400 font-bold tracking-widest">{note.type}</span>
                       </div>
                     ))}
                   </div>
                 </div>
               )}
             </div>

             {/* ADMIN PROFILE */}
             <div className="flex items-center gap-3 bg-white p-2 pr-6 rounded-2xl shadow-sm border border-gray-50">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center font-bold text-blue-600">MA</div>
                <div>
                   <p className="text-xs font-bold text-[#1A2252]">Malak</p>
                   <p className="text-[10px] text-gray-400 font-bold uppercase">Admin</p>
                </div>
             </div>
           </div>
        </header>

        {/* DYNAMIC CONTENT LOADER */}
        <section className="flex-1 overflow-y-auto px-10 pb-10">
          {/* FIXED: Check if path is dashboard OR the base admin path to show cards, else show the child page */}
          {(location.pathname === '/admin/dashboard' || location.pathname === '/admin') 
            ? <DashboardA /> 
            : <Outlet />
          }
        </section>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        @keyframes slide-down { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slide-down { animation: slide-down 0.3s ease-out; }
      `}</style>
    </div>
  );
};

// --- 2. DASHBOARDA COMPONENT (CARDS + RECENT ACTIVITIES) ---
const DashboardA = () => {
  const stats = [
    { title: 'TOTAL STUDENTS', value: '2,450', change: '+12%', icon: '👥' },
    { title: 'TOTAL TEACHERS', value: '120', change: 'Stable', icon: '🧑‍🏫' },
    { title: 'TOTAL COURSES', value: '45', change: '+4 New', icon: '📚' },
  ];

  const activities = [
    { title: 'New student registered', desc: 'Elena Gilbert joined CS department.', time: '2M AGO', icon: '👤', bg: 'bg-blue-50' },
    { title: 'Teacher attendance', desc: '12 faculty members finalized.', time: '45M AGO', icon: '⏰', bg: 'bg-orange-50' },
    { title: 'Exam schedule', desc: 'Semester 4 schedules are live.', time: '3H AGO', icon: '📝', bg: 'bg-purple-50' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-10">
        <h2 className="text-4xl font-black text-[#1A2252] mb-2">Welcome back, Admin</h2>
        <p className="text-gray-400 font-medium italic">Performance overview for today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50 flex flex-col justify-between h-56 hover:shadow-xl transition-all group">
            <div className="flex justify-between items-start">
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">{stat.icon}</div>
              <span className="text-[10px] font-black px-3 py-1 rounded-full bg-green-50 text-green-500">{stat.change}</span>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-300 tracking-widest uppercase mb-1">{stat.title}</p>
              <p className="text-4xl font-black text-[#1A2252]">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* RECENT ACTIVITIES CARD */}
      <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-50">
        <div className="flex justify-between items-center mb-10">
          <h3 className="text-xl font-bold text-[#1A2252]">Recent Activities</h3>
          <button className="text-blue-500 font-bold text-sm hover:underline">View All</button>
        </div>

        <div className="space-y-4">
          {activities.map((act, i) => (
            <div key={i} className="flex items-center justify-between p-5 hover:bg-gray-50 rounded-3xl transition-colors cursor-pointer group">
              <div className="flex items-center gap-6">
                <div className={`w-12 h-12 ${act.bg} rounded-2xl flex items-center justify-center text-xl`}>{act.icon}</div>
                <div>
                  <h4 className="font-bold text-[#1A2252] group-hover:text-blue-600 transition-colors">{act.title}</h4>
                  <p className="text-sm text-gray-400 font-medium">{act.desc}</p>
                </div>
              </div>
              <span className="text-[10px] font-black text-gray-300 uppercase tracking-tighter">{act.time}</span>
            </div>
          ))}
        </div>
      </div>
      
      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default AdminLayout;

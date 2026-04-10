import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';

const Reports = () => {
  const [reportView, setReportView] = useState('main'); // 'main' أو 'attendance'

  // --- 1. بيانات الحضور الأسبوعية ---
  const attendanceData = [
    { name: 'Week 1', present: 85, absent: 15 },
    { name: 'Week 2', present: 94, absent: 6 },
    { name: 'Week 3', present: 88, absent: 12 },
    { name: 'Week 4', present: 96, absent: 4 },
  ];

  // --- 2. بيانات توزيع اللغات ---
  const languageData = [
    { name: 'English', value: 450 },
    { name: 'French', value: 300 },
    { name: 'German', value: 150 },
    { name: 'Spanish', value: 100 },
  ];

  const COLORS = ['#1A2252', '#2563eb', '#60a5fa', '#d1d5db'];

  const handleExportPDF = (name) => {
    alert(`Generating PDF Report for: ${name}...`);
    // هنا يمكن إضافة مكتبة jsPDF مستقبلاً
  };

  // ==========================================
  // واجهة تفاصيل تقرير الحضور (Attendance View)
  // ==========================================
  const renderAttendanceDetail = () => (
    <div className="animate-in fade-in slide-in-from-right-10 duration-700">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <button 
            onClick={() => setReportView('main')}
            className="text-[#1A2252] font-black text-xs mb-2 flex items-center gap-2 hover:-translate-x-1 transition-transform cursor-pointer italic"
          >
            ← BACK TO ALL REPORTS
          </button>
          <h2 className="text-4xl font-black text-[#1A2252] italic">Attendance Analytics</h2>
        </div>
        <button 
          onClick={() => handleExportPDF('Full_Attendance_Report')}
          className="bg-[#1A2252] text-white px-8 py-4 rounded-2xl font-black italic text-sm shadow-xl hover:scale-105 transition-all cursor-pointer"
        >
          EXPORT FULL REPORT 📥
        </button>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <StatItem title="Avg. Attendance" value="91.2%" icon="📈" color="text-green-600" />
        <StatItem title="Total Sessions" value="324" icon="📚" color="text-blue-600" />
        <StatItem title="Critical Absences" value="08" icon="⚠️" color="text-red-500" />
        <StatItem title="Best Group" value="ENG-B1" icon="💎" color="text-indigo-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart 1: Bar Chart (Weekly Attendance) */}
        <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 group">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-black text-[#1A2252] italic text-lg tracking-tight">Weekly Presence Trends</h3>
            <button onClick={() => handleExportPDF('Weekly_Attendance')} className="text-[10px] font-black text-blue-600 uppercase border-b-2 border-blue-100 hover:border-blue-600 transition-all cursor-pointer">PDF</button>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 'bold', fontSize: 11}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 'bold', fontSize: 11}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="present" fill="#1A2252" radius={[10, 10, 0, 0]} barSize={35} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Area Chart (Daily Performance) */}
        <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-black text-[#1A2252] italic text-lg tracking-tight">Growth & Engagement</h3>
            <button onClick={() => handleExportPDF('Engagement_Report')} className="text-[10px] font-black text-blue-600 uppercase border-b-2 border-blue-100 cursor-pointer">PDF</button>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceData}>
                <defs>
                  <linearGradient id="colorPres" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
                <Tooltip />
                <Area type="monotone" dataKey="present" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorPres)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );

  // ==========================================
  // القائمة الرئيسية للتقارير (Main Menu)
  // ==========================================
  const renderMainMenu = () => (
    <div className="animate-in fade-in slide-in-from-bottom-10 duration-700">
      <div className="mb-12">
        <h2 className="text-5xl font-black text-[#1A2252] mb-3 italic tracking-tighter">Reports Center</h2>
        <p className="text-gray-400 font-bold italic text-lg">Select a category to view detailed analytics and export data.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <ReportCard 
          title="Attendance Report" 
          desc="Track student presence, absence trends, and teacher consistency." 
          icon="📊" 
          color="bg-blue-600"
          onClick={() => setReportView('attendance')} 
        />
        <ReportCard 
          title="Financial Summary" 
          desc="Analyze revenue, pending payments, and school expenses." 
          icon="💰" 
          color="bg-green-500"
          onClick={() => alert('Financial module loading...')} 
        />
        <ReportCard 
          title="Exam Analytics" 
          desc="Review success rates, average grades, and level progression." 
          icon="✍️" 
          color="bg-orange-500"
          onClick={() => alert('Exam module loading...')} 
        />
        <ReportCard 
          title="Student Growth" 
          desc="New registrations vs. completions over the last 12 months." 
          icon="📈" 
          color="bg-purple-500"
          onClick={() => alert('Growth module loading...')} 
        />
        <ReportCard 
          title="Teacher Performance" 
          desc="Evaluation reports based on student feedback and hours." 
          icon="👩‍🏫" 
          color="bg-indigo-600"
          onClick={() => alert('Performance module loading...')} 
        />
      </div>
    </div>
  );

  return (
    <div className="h-full pb-20">
      {reportView === 'main' ? renderMainMenu() : renderAttendanceDetail()}
    </div>
  );
};

// --- مكونات فرعية (Sub-Components) ---

const StatItem = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-50 flex items-center gap-5 hover:shadow-md transition-shadow">
    <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl shadow-inner">
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-black text-gray-400 uppercase italic tracking-widest">{title}</p>
      <p className={`text-2xl font-black ${color}`}>{value}</p>
    </div>
  </div>
);

const ReportCard = ({ title, desc, icon, color, onClick }) => (
  <div 
    onClick={onClick}
    className="group bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer flex flex-col justify-between h-80 relative overflow-hidden"
  >
    <div className={`w-16 h-16 ${color} text-white rounded-[1.5rem] flex items-center justify-center text-3xl shadow-lg transform group-hover:rotate-12 transition-transform`}>
      {icon}
    </div>
    
    <div className="relative z-10">
      <h3 className="text-2xl font-black text-[#1A2252] mb-3 italic tracking-tight">{title}</h3>
      <p className="text-gray-400 font-bold italic text-xs leading-relaxed opacity-80">{desc}</p>
    </div>

    <div className="flex items-center text-[#1A2252] font-black italic text-[10px] tracking-widest relative z-10">
      GENERATE REPORT <span className="ml-2 group-hover:translate-x-2 transition-transform text-lg">➔</span>
    </div>

    {/* Background Decoration */}
    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gray-50 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
  </div>
);

export default Reports;
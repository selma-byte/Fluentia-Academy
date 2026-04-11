import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, Radar 
} from 'recharts';

const Reports = () => {
  const [reportView, setReportView] = useState('main'); // 'main', 'attendance', 'finance', 'exams', 'teachers', 'growth'
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // --- Utility: Custom Notification Logic ---
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  // --- Mock Data ---
  const attendanceData = [
    { name: 'Week 1', present: 85, absent: 15 },
    { name: 'Week 2', present: 94, absent: 6 },
    { name: 'Week 3', present: 88, absent: 12 },
    { name: 'Week 4', present: 96, absent: 4 },
  ];

  const financeData = [
    { month: 'Jan', revenue: 45000, expenses: 32000 },
    { month: 'Feb', revenue: 52000, expenses: 31000 },
    { month: 'Mar', revenue: 48000, expenses: 34000 },
    { month: 'Apr', revenue: 61000, expenses: 30000 },
  ];

  const languageData = [
    { name: 'English', value: 450 },
    { name: 'French', value: 300 },
    { name: 'German', value: 150 },
    { name: 'Spanish', value: 100 },
  ];

  const teacherStats = [
    { name: "Prof. Sarah Ahmed", rating: 4.8, classes: 12, attendance: "98%", status: "Excellent", color: "bg-pink-500" },
    { name: "Prof. Hassan Ali", rating: 4.5, classes: 10, attendance: "94%", status: "Good", color: "bg-blue-500" },
    { name: "Prof. Karima Ben", rating: 4.9, classes: 15, attendance: "100%", status: "Top Performer", color: "bg-purple-500" },
  ];

  const examPerformance = [
    { subject: 'Grammar', score: 85, fullMark: 100 },
    { subject: 'Speaking', score: 70, fullMark: 100 },
    { subject: 'Writing', score: 90, fullMark: 100 },
    { subject: 'Listening', score: 65, fullMark: 100 },
    { subject: 'Vocabulary', score: 80, fullMark: 100 },
  ];

  const growthData = [
    { month: 'Jan', registrations: 40, completions: 20 },
    { month: 'Feb', registrations: 55, completions: 35 },
    { month: 'Mar', registrations: 75, completions: 50 },
    { month: 'Apr', registrations: 90, completions: 65 },
  ];

  const COLORS = ['#1A2252', '#EC4899', '#8B5CF6', '#3B82F6'];

  // --- Shared Components ---
  const Header = ({ title, onBack, exportName }) => (
    <div className="flex justify-between items-center mb-10">
      <div>
        <button 
          onClick={onBack}
          className="text-[#1A2252] font-black text-xs mb-2 flex items-center gap-2 hover:-translate-x-1 transition-transform cursor-pointer italic uppercase tracking-widest"
        >
          ← Back to Hub
        </button>
        <h2 className="text-4xl font-black text-[#1A2252] italic uppercase tracking-tighter">{title}</h2>
      </div>
      <button 
        onClick={() => showToast(`Generating ${exportName}.pdf...`, "success")}
        className="bg-[#1A2252] text-white px-8 py-4 rounded-2xl font-black italic text-sm shadow-xl hover:scale-105 transition-all cursor-pointer border-b-4 border-pink-500"
      >
        EXPORT DATA 📥
      </button>
    </div>
  );

  // ==========================================
  // Views
  // ==========================================

  const renderAttendanceDetail = () => (
    <div className="animate-in fade-in slide-in-from-right-10 duration-700">
      <Header title="Attendance Analytics" onBack={() => setReportView('main')} exportName="Attendance_Report" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <StatItem title="Avg. Presence" value="91.2%" icon="📈" color="text-green-500" />
        <StatItem title="Sessions" value="324" icon="📚" color="text-pink-500" />
        <StatItem title="Critical" value="08" icon="⚠️" color="text-red-500" />
        <StatItem title="Top Group" value="ENG-B1" icon="💎" color="text-[#1A2252]" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartCard title="Weekly Presence Trends" onExport={() => showToast("Downloading Trends...")}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <Tooltip cursor={{fill: '#f8fafc'}} />
              <Bar dataKey="present" fill="#1A2252" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Language Distribution" onExport={() => showToast("Downloading Language Data...")}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={languageData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                {languageData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );

  const renderFinanceDetail = () => (
    <div className="animate-in fade-in slide-in-from-right-10 duration-700">
      <Header title="Financial Summary" onBack={() => setReportView('main')} exportName="Financial_Statement" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <StatItem title="Revenue" value="1.2M دج" icon="💰" color="text-green-600" />
        <StatItem title="Pending" value="150k دج" icon="⏳" color="text-pink-500" />
        <StatItem title="Payroll" value="450k دج" icon="💸" color="text-[#1A2252]" />
        <StatItem title="Profit" value="640k دج" icon="🏦" color="text-blue-500" />
      </div>
      <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 mb-8 h-96">
        <h3 className="font-black text-[#1A2252] italic text-lg mb-8 uppercase">Cash Flow Analysis</h3>
        <ResponsiveContainer width="100%" height="80%">
          <AreaChart data={financeData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip />
            <Area type="monotone" dataKey="revenue" stroke="#1A2252" fill="#1A2252" fillOpacity={0.1} strokeWidth={3} />
            <Area type="monotone" dataKey="expenses" stroke="#EC4899" fill="#EC4899" fillOpacity={0.1} strokeWidth={3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderTeacherReport = () => (
    <div className="animate-in fade-in slide-in-from-right-10 duration-700">
      <Header title="Faculty Analytics" onBack={() => setReportView('main')} exportName="Teacher_Performance" />
      <div className="grid gap-4">
        {teacherStats.map((teacher, i) => (
          <div key={i} className="group bg-white p-6 rounded-[2.5rem] border-2 border-gray-50 hover:border-pink-200 transition-all flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 ${teacher.color} rounded-2xl flex items-center justify-center text-white font-black italic shadow-lg`}>
                {teacher.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h4 className="font-black text-[#1A2252] italic text-lg leading-tight">{teacher.name}</h4>
                <p className="text-[10px] text-pink-500 font-black uppercase tracking-widest">{teacher.status}</p>
              </div>
            </div>
            <div className="flex gap-12 text-right">
              <div>
                <p className="text-[9px] font-black text-gray-400 uppercase italic">Rating</p>
                <p className="font-black text-[#1A2252]">⭐ {teacher.rating}</p>
              </div>
              <div>
                <p className="text-[9px] font-black text-gray-400 uppercase italic">Attendance</p>
                <p className="font-black text-[#1A2252]">{teacher.attendance}</p>
              </div>
              <button onClick={() => showToast(`View details for ${teacher.name}`)} className="bg-gray-50 p-4 rounded-2xl hover:bg-pink-50 transition-colors">📈</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // NEW: Exams Interface
  const renderExamsReport = () => (
    <div className="animate-in fade-in slide-in-from-right-10 duration-700">
      <Header title="Examination Insights" onBack={() => setReportView('main')} exportName="Exam_Results" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <StatItem title="Success Rate" value="84%" icon="🎓" color="text-blue-500" />
        <StatItem title="Average Score" value="78/100" icon="📝" color="text-purple-500" />
        <StatItem title="Top Subject" value="Writing" icon="🔥" color="text-pink-500" />
        <StatItem title="Exams Taken" value="1,240" icon="📂" color="text-[#1A2252]" />
      </div>
      <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 h-[500px]">
        <h3 className="font-black text-[#1A2252] italic text-lg mb-8 uppercase">Proficiency Radar</h3>
        <ResponsiveContainer width="100%" height="90%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={examPerformance}>
            <PolarGrid stroke="#f1f5f9" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#1A2252', fontWeight: 'bold', fontSize: 12 }} />
            <Radar name="Student Avg" dataKey="score" stroke="#EC4899" fill="#EC4899" fillOpacity={0.6} />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  // NEW: Growth Interface
  const renderGrowthReport = () => (
    <div className="animate-in fade-in slide-in-from-right-10 duration-700">
      <Header title="Growth & Retention" onBack={() => setReportView('main')} exportName="Growth_Report" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatItem title="New Leads" value="+124" icon="🚀" color="text-green-500" />
        <StatItem title="Retention" value="92%" icon="🔄" color="text-blue-500" />
        <StatItem title="Capacity" value="78%" icon="🏢" color="text-pink-500" />
      </div>
      <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 h-96">
        <h3 className="font-black text-[#1A2252] italic text-lg mb-8 uppercase">Registration vs Completion</h3>
        <ResponsiveContainer width="100%" height="80%">
          <LineChart data={growthData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip />
            <Line type="step" dataKey="registrations" stroke="#1A2252" strokeWidth={4} dot={{ r: 6, fill: '#1A2252' }} />
            <Line type="monotone" dataKey="completions" stroke="#EC4899" strokeWidth={4} dot={{ r: 6, fill: '#EC4899' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderMainMenu = () => (
    <div className="animate-in fade-in slide-in-from-bottom-10 duration-700">
      <div className="mb-12">
        <h2 className="text-6xl font-black text-[#1A2252] mb-3 italic tracking-tighter uppercase">Reports Center</h2>
        <p className="text-gray-400 font-bold italic text-lg">Detailed school analytics and data export portal.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <ReportCard title="Attendance" desc="Student presence trends and group consistency." icon="📊" color="bg-[#1A2252]" onClick={() => setReportView('attendance')} />
        <ReportCard title="Financials" desc="Analyze school revenue, pending fees, and payroll." icon="💰" color="bg-pink-500" onClick={() => setReportView('finance')} />
        <ReportCard title="Teachers" desc="Performance metrics and feedback reports." icon="👩‍🏫" color="bg-purple-500" onClick={() => setReportView('teachers')} />
        <ReportCard title="Exams" desc="Success rates and proficiency levels." icon="✍️" color="bg-blue-500" onClick={() => setReportView('exams')} />
        <ReportCard title="Growth" desc="New registrations vs. course completions." icon="📈" color="bg-green-500" onClick={() => setReportView('growth')} />
      </div>
    </div>
  );

  return (
    <div className="h-full pb-20 p-4 relative">
      {toast.show && (
        <div className="fixed top-10 right-10 z-[100] animate-in slide-in-from-right-8 duration-500">
          <div className="bg-[#1A2252] backdrop-blur-xl border-l-4 border-pink-500 p-6 rounded-2xl shadow-2xl flex items-center gap-4 min-w-[320px]">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
              toast.type === 'success' ? 'bg-pink-500/20 text-pink-500' : 'bg-orange-500/20 text-orange-500'
            }`}>
              {toast.type === 'success' ? '✨' : '⚠️'}
            </div>
            <div>
              <p className="text-[9px] font-black text-pink-400 uppercase tracking-widest mb-0.5 italic">System Notification</p>
              <p className="text-white font-bold italic text-sm">{toast.message}</p>
            </div>
            <button onClick={() => setToast({ ...toast, show: false })} className="ml-auto text-white/20 hover:text-white">✕</button>
          </div>
        </div>
      )}

      {reportView === 'main' && renderMainMenu()}
      {reportView === 'attendance' && renderAttendanceDetail()}
      {reportView === 'finance' && renderFinanceDetail()}
      {reportView === 'teachers' && renderTeacherReport()}
      {reportView === 'exams' && renderExamsReport()}
      {reportView === 'growth' && renderGrowthReport()}
    </div>
  );
};

// --- Helper Components ---
const StatItem = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-50 flex items-center gap-5 hover:shadow-md transition-shadow">
    <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl shadow-inner">{icon}</div>
    <div>
      <p className="text-[10px] font-black text-gray-400 uppercase italic tracking-widest">{title}</p>
      <p className={`text-2xl font-black ${color} italic tracking-tighter`}>{value}</p>
    </div>
  </div>
);

const ChartCard = ({ title, children, onExport }) => (
  <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 h-80 flex flex-col group">
    <div className="flex justify-between items-center mb-8">
      <h3 className="font-black text-[#1A2252] italic text-lg tracking-tight uppercase">{title}</h3>
      <button onClick={onExport} className="text-[10px] font-black text-pink-500 uppercase border-b-2 border-pink-100 cursor-pointer hover:border-pink-500 transition-all">Download PDF</button>
    </div>
    <div className="flex-1">{children}</div>
  </div>
);

const ReportCard = ({ title, desc, icon, color, onClick }) => (
  <div 
    onClick={onClick}
    className="group bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer flex flex-col justify-between h-80 relative overflow-hidden"
  >
    <div className={`w-16 h-16 ${color} text-white rounded-[1.5rem] flex items-center justify-center text-3xl shadow-lg transform group-hover:rotate-12 transition-transform`}>{icon}</div>
    <div className="relative z-10">
      <h3 className="text-3xl font-black text-[#1A2252] mb-3 italic tracking-tighter uppercase">{title}</h3>
      <p className="text-gray-400 font-bold italic text-xs leading-relaxed opacity-80">{desc}</p>
    </div>
    <div className="flex items-center text-[#1A2252] font-black italic text-[10px] tracking-widest relative z-10">
      EXPLORE ANALYTICS <span className="ml-2 group-hover:translate-x-3 transition-transform text-pink-500 text-lg">➔</span>
    </div>
    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gray-50 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
  </div>
);

export default Reports;
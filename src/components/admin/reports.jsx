import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, Radar 
} from 'recharts';

// ==========================================
// 🔔 MODERN NOTIFICATION
// ==========================================
const Toast = ({ message, onClose }) => (
  <div className="fixed bottom-8 right-8 z-[250] animate-in slide-in-from-bottom duration-500">
    <div className="bg-[#1A2252] text-white px-8 py-4 rounded-[2rem] shadow-2xl flex items-center gap-4 min-w-[350px] relative border border-white/10 backdrop-blur-md">
      <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-xl shadow-lg">
        ✨
      </div>
      <div className="flex-1 text-left">
        <p className="text-md font-black italic tracking-tight leading-none mb-1">Financial Update</p>
        <p className="text-xs font-medium text-blue-200/70 italic">{message}</p>
      </div>
      <button onClick={onClose} className="ml-4 text-white/40 hover:text-white transition-colors text-xl">✕</button>
    </div>
  </div>
);

const Reports = () => {
  const [reportView, setReportView] = useState('main');
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
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

  // --- UI Components ---
  const ActionButtons = ({ name }) => (
    <div className="flex gap-2">
      <button 
        onClick={() => showToast(`Exporting ${name} PDF...`)}
        className="bg-[#F1F5F9] text-[#7B8AB8] px-4 py-2 rounded-xl font-bold text-[10px] flex items-center gap-2 hover:bg-white hover:shadow-md transition-all cursor-pointer"
      >
        <span className="text-blue-500 text-sm">📥</span> Export PDF
      </button>
      <button 
        onClick={() => showToast(`Printing ${name}...`)}
        className="bg-[#F1F5F9] text-[#7B8AB8] px-4 py-2 rounded-xl font-bold text-[10px] flex items-center gap-2 hover:bg-white hover:shadow-md transition-all cursor-pointer"
      >
        <span className="text-purple-500 text-sm">🖨️</span> Print
      </button>
    </div>
  );

  const Header = ({ title, onBack }) => (
    <div className="mb-6 text-left">
      <button onClick={onBack} className="text-[#1A2252] font-black text-[10px] mb-1 flex items-center gap-2 hover:-translate-x-1 transition-transform cursor-pointer italic uppercase tracking-widest">
        ← Back to Hub
      </button>
      <h2 className="text-3xl font-black text-[#1A2252] italic uppercase tracking-tighter">{title}</h2>
    </div>
  );

  const renderAttendanceDetail = () => (
    <div className="animate-in fade-in slide-in-from-right-10 duration-700">
      <Header title="Attendance Analytics" onBack={() => setReportView('main')} />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatItem title="Avg. Presence" value="91.2%" icon="📈" color="text-green-500" />
        <StatItem title="Sessions" value="324" icon="📚" color="text-pink-500" />
        <StatItem title="Critical" value="08" icon="⚠️" color="text-red-500" />
        <StatItem title="Top Group" value="ENG-B1" icon="💎" color="text-[#1A2252]" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 h-80 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-black text-[#1A2252] italic text-md uppercase tracking-tight">Weekly Presence</h3>
            <ActionButtons name="Attendance Chart" />
          </div>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="present" fill="#1A2252" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 h-80 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-black text-[#1A2252] italic text-md uppercase tracking-tight">Languages</h3>
            <ActionButtons name="Language Chart" />
          </div>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={languageData} innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                  {languageData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFinanceDetail = () => (
    <div className="animate-in fade-in slide-in-from-right-10 duration-700">
      <Header title="Financial Summary" onBack={() => setReportView('main')} />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatItem title="Revenue" value="1.2M دج" icon="💰" color="text-green-600" />
        <StatItem title="Pending" value="150k دج" icon="⏳" color="text-pink-500" />
        <StatItem title="Payroll" value="450k دج" icon="💸" color="text-[#1A2252]" />
        <StatItem title="Profit" value="640k دج" icon="🏦" color="text-blue-500" />
      </div>
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 h-96 flex flex-col text-left">
        <div className="flex justify-between items-center mb-4">
            <h3 className="font-black text-[#1A2252] italic text-lg uppercase tracking-tight">Cash Flow Analysis</h3>
            <ActionButtons name="Finance Graph" />
        </div>
        <div className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={financeData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10}}/>
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10}}/>
              <Tooltip />
              <Area type="monotone" dataKey="revenue" stroke="#1A2252" fill="#1A2252" fillOpacity={0.1} strokeWidth={2} />
              <Area type="monotone" dataKey="expenses" stroke="#EC4899" fill="#EC4899" fillOpacity={0.1} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderTeacherReport = () => (
    <div className="animate-in fade-in slide-in-from-right-10 duration-700">
      <Header title="Faculty Analytics" onBack={() => setReportView('main')} />
      <div className="grid gap-4">
        {teacherStats.map((teacher, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4 text-left">
              <div className={`w-12 h-12 ${teacher.color} rounded-xl flex items-center justify-center text-white font-black italic text-lg shadow-md`}>
                {teacher.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h4 className="font-black text-[#1A2252] italic text-xl leading-none mb-1">{teacher.name}</h4>
                <p className="text-[10px] text-pink-500 font-black uppercase tracking-widest">{teacher.status}</p>
              </div>
            </div>
            <div className="flex items-center gap-8">
               <div className="text-right">
                  <p className="text-[9px] font-black text-gray-400 uppercase italic">Rating</p>
                  <p className="font-black text-[#1A2252] text-sm">⭐ {teacher.rating}</p>
               </div>
               <ActionButtons name={teacher.name} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderExamsReport = () => (
    <div className="animate-in fade-in slide-in-from-right-10 duration-700">
      <Header title="Examination Insights" onBack={() => setReportView('main')} />
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 h-[450px] flex flex-col">
        <div className="flex justify-between items-center mb-4 text-left">
            <h3 className="font-black text-[#1A2252] italic text-lg uppercase tracking-tight">Proficiency Radar</h3>
            <ActionButtons name="Exam Data" />
        </div>
        <div className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={examPerformance}>
              <PolarGrid stroke="#f1f5f9" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#1A2252', fontWeight: 'bold', fontSize: 10 }} />
              <Radar name="Score" dataKey="score" stroke="#EC4899" fill="#EC4899" fillOpacity={0.6} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderGrowthReport = () => (
    <div className="animate-in fade-in slide-in-from-right-10 duration-700">
      <Header title="Growth Analytics" onBack={() => setReportView('main')} />
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 h-96 flex flex-col text-left">
        <div className="flex justify-between items-center mb-4">
            <h3 className="font-black text-[#1A2252] italic text-lg uppercase tracking-tight">Registration Trends</h3>
            <ActionButtons name="Growth Trends" />
        </div>
        <div className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10}} />
              <Tooltip />
              <Line type="step" dataKey="registrations" stroke="#1A2252" strokeWidth={3} dot={{ r: 4, fill: '#1A2252' }} />
              <Line type="monotone" dataKey="completions" stroke="#EC4899" strokeWidth={3} dot={{ r: 4, fill: '#EC4899' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderMainMenu = () => (
    <div className="animate-in fade-in slide-in-from-bottom-10 duration-700 text-left">
      <div className="mb-10">
        <h2 className="text-4xl font-black text-[#1A2252] mb-2 italic tracking-tighter uppercase">Reports Center</h2>
        <p className="text-gray-400 font-bold italic text-md opacity-80">School analytics and data export portal.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { id: 'attendance', title: 'Attendance', icon: '📊', color: 'bg-[#1A2252]', desc: 'Presence trends and group consistency.' },
          { id: 'finance', title: 'Financials', icon: '💰', color: 'bg-pink-500', desc: 'Revenue, payroll, and pending fees.' },
          { id: 'teachers', title: 'Teachers', icon: '👩‍🏫', color: 'bg-purple-500', desc: 'Performance metrics and feedback.' },
          { id: 'exams', title: 'Exams', icon: '✍️', color: 'bg-blue-500', desc: 'Success rates and proficiency levels.' },
          { id: 'growth', title: 'Growth', icon: '📈', color: 'bg-green-500', desc: 'Registrations vs course completions.' }
        ].map((card) => (
          <div key={card.id} onClick={() => setReportView(card.id)} className="group bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between h-72 relative overflow-hidden">
            <div className={`w-14 h-14 ${card.color} text-white rounded-2xl flex items-center justify-center text-2xl shadow-lg transform group-hover:rotate-12 transition-transform`}>{card.icon}</div>
            <div>
              <h3 className="text-2xl font-black text-[#1A2252] mb-1 italic uppercase tracking-tighter">{card.title}</h3>
              <p className="text-gray-400 font-bold italic text-[11px] leading-relaxed">{card.desc}</p>
            </div>
            <div className="flex items-center text-[#1A2252] font-black italic text-[10px] tracking-widest uppercase">
              Explore <span className="ml-2 group-hover:translate-x-2 transition-transform text-pink-500">➔</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="h-full pb-10 p-6 relative font-sans">
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      {reportView === 'main' && renderMainMenu()}
      {reportView === 'attendance' && renderAttendanceDetail()}
      {reportView === 'finance' && renderFinanceDetail()}
      {reportView === 'teachers' && renderTeacherReport()}
      {reportView === 'exams' && renderExamsReport()}
      {reportView === 'growth' && renderGrowthReport()}
    </div>
  );
};

const StatItem = ({ title, value, icon, color }) => (
  <div className="bg-white p-4 rounded-[1.5rem] shadow-sm border border-gray-50 flex items-center gap-4 text-left">
    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-xl shadow-inner">{icon}</div>
    <div>
      <p className="text-[8px] font-black text-gray-400 uppercase italic tracking-widest">{title}</p>
      <p className={`text-xl font-black ${color} italic tracking-tighter`}>{value}</p>
    </div>
  </div>
);

export default Reports;
import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area, LineChart, Line 
} from 'recharts';

// ==========================================
// 🔔 MODERN NOTIFICATION
// ==========================================
const Toast = ({ message, onClose }) => (
  <div className="fixed bottom-8 right-8 z-[250] animate-in slide-in-from-bottom duration-500">
    <div className="bg-[#1A2252] text-white px-8 py-4 rounded-[2rem] shadow-2xl flex items-center gap-4 min-w-[350px] relative border border-white/10 backdrop-blur-md">
      <div className="w-10 h-10 bg-[#EC4899] rounded-xl flex items-center justify-center text-xl shadow-lg">✨</div>
      <div className="flex-1 text-left">
        <p className="text-md font-black italic tracking-tight leading-none mb-1">Update</p>
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

  // --- Data Sets ---
  const attendanceMonthly = [
    { month: 'Jan', present: 420, absent: 30 },
    { month: 'Feb', present: 450, absent: 20 },
    { month: 'Mar', present: 380, absent: 65 },
    { month: 'Apr', present: 490, absent: 15 },
  ];

  const genderData = [
    { name: 'Girls', value: 55 },
    { name: 'Boys', value: 45 },
  ];

  const ageGroups = [
    { group: '6-12 Years', count: 120 },
    { group: '13-18 Years', count: 200 },
    { group: '19-25 Years', count: 150 },
    { group: '26+ Years', count: 80 },
  ];

  const teacherLanguageData = [
    { lang: 'English', count: 12 },
    { lang: 'French', count: 8 },
    { lang: 'German', count: 4 },
    { lang: 'Spanish', count: 3 },
  ];

  const studentFlowData = [
    { month: 'Jan', applicants: 80, drops: 5 },
    { month: 'Feb', applicants: 95, drops: 12 },
    { month: 'Mar', applicants: 110, drops: 8 },
    { month: 'Apr', applicants: 130, drops: 15 },
  ];

  const financeData = [
    { month: 'Jan', revenue: 45000, expenses: 32000 },
    { month: 'Feb', revenue: 52000, expenses: 31000 },
    { month: 'Mar', revenue: 48000, expenses: 34000 },
    { month: 'Apr', revenue: 61000, expenses: 30000 }
  ];

  // Colors matching Navbar and Pink design
  const THEME_PINK = '#EC4899';
  const THEME_BLUE = '#1A2252';

  // --- UI Components ---
  const ActionButtons = ({ name }) => (
    <div className="flex gap-2">
      <button 
        onClick={() => showToast(`Exporting ${name} PDF...`)}
        className="bg-[#F1F5F9] text-[#7B8AB8] px-4 py-2 rounded-xl font-bold text-[10px] flex items-center gap-2 hover:bg-white hover:shadow-md transition-all cursor-pointer border border-transparent hover:border-[#EC4899]/20"
      >
        <span className="text-[#EC4899] text-sm">📥</span> Export PDF
      </button>
      <button 
        onClick={() => showToast(`Printing ${name}...`)}
        className="bg-[#F1F5F9] text-[#7B8AB8] px-4 py-2 rounded-xl font-bold text-[10px] flex items-center gap-2 hover:bg-white hover:shadow-md transition-all cursor-pointer border border-transparent hover:border-[#1A2252]/20"
      >
        <span className="text-[#1A2252] text-sm">🖨️</span> Print
      </button>
    </div>
  );

  const Header = ({ title, onBack }) => (
    <div className="mb-6 text-left">
      <button onClick={onBack} className="text-[#1A2252] font-black text-[10px] mb-1 flex items-center gap-2 hover:text-[#EC4899] transition-colors cursor-pointer italic uppercase tracking-widest">
        ← Back
      </button>
      <h2 className="text-3xl font-black text-[#1A2252] italic uppercase tracking-tighter">{title}</h2>
    </div>
  );

  // 📊 ATTENDANCE: Monthly Present vs Absent
  const renderAttendanceDetail = () => (
    <div className="animate-in fade-in slide-in-from-right-10 duration-700 text-left">
      <Header title="Attendance Records" onBack={() => setReportView('main')} />
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 h-[450px] flex flex-col">
        <div className="flex justify-between items-center mb-8">
          <h3 className="font-black text-[#1A2252] italic text-md uppercase">Monthly Attendance Status</h3>
          <ActionButtons name="Attendance" />
        </div>
        <div className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={attendanceMonthly}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 'bold'}} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip cursor={{fill: '#f8fafc'}} />
              <Bar dataKey="present" fill={THEME_BLUE} radius={[6, 6, 0, 0]} name="Present" />
              <Bar dataKey="absent" fill={THEME_PINK} radius={[6, 6, 0, 0]} name="Absent" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderFinanceDetail = () => (
    <div className="animate-in fade-in slide-in-from-right-10 duration-700 text-left">
      <Header title="Financial Summary" onBack={() => setReportView('main')} />
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 h-96 flex flex-col">
        <div className="flex justify-between items-center mb-6">
            <h3 className="font-black text-[#1A2252] italic text-lg uppercase tracking-tight">Revenue Analysis</h3>
            <ActionButtons name="Finance" />
        </div>
        <div className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={financeData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <Tooltip />
              <Area type="monotone" dataKey="revenue" stroke={THEME_BLUE} fill={THEME_BLUE} fillOpacity={0.1} strokeWidth={3} />
              <Area type="monotone" dataKey="expenses" stroke={THEME_PINK} fill={THEME_PINK} fillOpacity={0.1} strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderStudentDemographics = () => (
    <div className="animate-in fade-in slide-in-from-right-10 duration-700 text-left">
      <Header title="Student Demographics" onBack={() => setReportView('main')} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm h-80 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-black text-[#1A2252] italic text-md uppercase">Girls vs Boys %</h3>
            <ActionButtons name="Gender" />
          </div>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={genderData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  <Cell fill={THEME_PINK} /><Cell fill={THEME_BLUE} />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm h-80 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-black text-[#1A2252] italic text-md uppercase">Age Distribution</h3>
            <ActionButtons name="Age Group" />
          </div>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageGroups} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="group" type="category" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold'}} width={90} />
                <Tooltip />
                <Bar dataKey="count" fill={THEME_PINK} radius={[0, 5, 5, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLanguageFaculty = () => (
    <div className="animate-in fade-in slide-in-from-right-10 duration-700 text-left">
      <Header title="Faculty Distribution" onBack={() => setReportView('main')} />
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 h-96 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-black text-[#1A2252] italic text-md uppercase">Teachers per Language</h3>
          <ActionButtons name="Faculty" />
        </div>
        <div className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={teacherLanguageData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="lang" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 'bold'}} />
              <Tooltip />
              <Bar dataKey="count" fill={THEME_BLUE} radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderStudentFlow = () => (
    <div className="animate-in fade-in slide-in-from-right-10 duration-700 text-left">
      <Header title="Flow Analysis" onBack={() => setReportView('main')} />
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 h-96 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-black text-[#1A2252] italic text-md uppercase">Applicants vs Drops</h3>
          <ActionButtons name="Student Flow" />
        </div>
        <div className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={studentFlowData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="applicants" stroke={THEME_BLUE} strokeWidth={4} dot={{r: 6, fill: THEME_BLUE}} name="Applicants" />
              <Line type="monotone" dataKey="drops" stroke={THEME_PINK} strokeWidth={4} dot={{r: 6, fill: THEME_PINK}} name="Drop-offs" />
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
        <p className="text-gray-400 font-bold italic text-md opacity-80">School performance and demographic overview.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { id: 'attendance', title: 'Attendance', icon: '📊', color: 'bg-[#1A2252]', desc: 'Monthly presence vs absence tracking.' },
          { id: 'finance', title: 'Financials', icon: '💰', color: 'bg-[#EC4899]', desc: 'Revenue vs expenses and cash flow.' },
          { id: 'teachers', title: 'Students', icon: '👥', color: 'bg-purple-500', desc: 'Gender balance and age distribution.' },
          { id: 'exams', title: 'Faculty', icon: '👩‍🏫', color: 'bg-blue-500', desc: 'Teacher counts per language department.' },
          { id: 'growth', title: 'Analysis', icon: '📈', color: 'bg-green-500', desc: 'Applicants vs student drops analysis.' }
        ].map((card) => (
          <div key={card.id} onClick={() => setReportView(card.id)} className="group bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between h-72 relative overflow-hidden">
            <div className={`w-14 h-14 ${card.color} text-white rounded-2xl flex items-center justify-center text-2xl shadow-lg transform group-hover:rotate-12 transition-transform`}>{card.icon}</div>
            <div>
              <h3 className="text-2xl font-black text-[#1A2252] mb-1 italic uppercase tracking-tighter">{card.title}</h3>
              <p className="text-gray-400 font-bold italic text-[11px] leading-relaxed">{card.desc}</p>
            </div>
            <div className="flex items-center text-[#1A2252] font-black italic text-[10px] tracking-widest uppercase">
              Explore <span className="ml-2 group-hover:translate-x-2 transition-transform text-[#EC4899]">➔</span>
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
      {reportView === 'teachers' && renderStudentDemographics()}
      {reportView === 'exams' && renderLanguageFaculty()}
      {reportView === 'growth' && renderStudentFlow()}
    </div>
  );
};

export default Reports;
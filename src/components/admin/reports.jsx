import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
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
      <button onClick={onClose} className="ml-4 text-white/40 hover:text-white transition-colors text-xl cursor-pointer">✕</button>
    </div>
  </div>
);

const Reports = () => {
  const [reportView, setReportView] = useState('main');
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- Dynamic Data States ---
  const [attendanceMonthly, setAttendanceMonthly] = useState([]);
  const [genderData, setGenderData] = useState([]);
  const [ageGroups, setAgeGroups] = useState([]);
  const [teacherLanguageData, setTeacherLanguageData] = useState([]);
  const [studentFlowData, setStudentFlowData] = useState([]);
  const [financeData, setFinanceData] = useState([]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  // ==========================================
  // 🚀 FETCH & PROCESS DATA FROM SUPABASE
  // ==========================================
  useEffect(() => {
    const fetchReportData = async () => {
      setLoading(true);
      try {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const currentYear = new Date().getFullYear();

        // 1. Fetch Students (For Demographics & Flow)
        const { data: students } = await supabase.from('students').select('*');
        if (students) {
          // --- Demographics (Gender) ---
          let boys = 0, girls = 0;
          let a6_12 = 0, a13_18 = 0, a19_25 = 0, a26_plus = 0;
          
          // Flow tracking
          let flowMap = { 'Jan':{a:0,d:0}, 'Feb':{a:0,d:0}, 'Mar':{a:0,d:0}, 'Apr':{a:0,d:0}, 'May':{a:0,d:0}, 'Jun':{a:0,d:0} };

          students.forEach(s => {
            // Gender calculation
            if (s.gender?.toLowerCase() === 'female' || s.gender?.toLowerCase() === 'girl') girls++;
            else boys++; // Defaulting empty to boys for chart balancing

            // Age calculation
            let age = 15; // Default age if no dob
            if (s.date_of_birth) {
              const diff = Date.now() - new Date(s.date_of_birth).getTime();
              age = Math.abs(new Date(diff).getUTCFullYear() - 1970);
            }
            if (age <= 12) a6_12++;
            else if (age <= 18) a13_18++;
            else if (age <= 25) a19_25++;
            else a26_plus++;

            // Flow Calculation (Applicants)
            if (s.enrollment_date) {
              const d = new Date(s.enrollment_date);
              if (d.getFullYear() === currentYear) {
                const mName = monthNames[d.getMonth()];
                if (flowMap[mName]) flowMap[mName].a++;
              }
            }
          });

          setGenderData([ { name: 'Girls', value: girls }, { name: 'Boys', value: boys } ]);
          setAgeGroups([
            { group: '6-12 Years', count: a6_12 }, { group: '13-18 Years', count: a13_18 },
            { group: '19-25 Years', count: a19_25 }, { group: '26+ Years', count: a26_plus }
          ]);

          // Student Flow Formatting
          const finalFlow = Object.keys(flowMap).map(k => ({ month: k, applicants: flowMap[k].a, drops: flowMap[k].d }));
          setStudentFlowData(finalFlow);
        }

        // 2. Fetch Staff (For Teacher Languages)
        const { data: staff } = await supabase.from('staff').select('*').ilike('role', 'Teacher');
        if (staff) {
          const langCounts = {};
          staff.forEach(t => {
            const dept = t.department || 'General';
            langCounts[dept] = (langCounts[dept] || 0) + 1;
          });
          const facultyData = Object.keys(langCounts).map(k => ({ lang: k, count: langCounts[k] }));
          setTeacherLanguageData(facultyData.length > 0 ? facultyData : [{ lang: 'No Data', count: 0 }]);
        }

        // 3. Fetch Financials (Payments vs Expenses)
        const { data: payments } = await supabase.from('payments').select('amount, created_at, status').eq('status', 'Paid');
        const { data: expenses } = await supabase.from('expenses').select('amount, expense_date');
        
        let finMap = { 'Jan':{r:0,e:0}, 'Feb':{r:0,e:0}, 'Mar':{r:0,e:0}, 'Apr':{r:0,e:0}, 'May':{r:0,e:0}, 'Jun':{r:0,e:0} };
        
        if (payments) {
          payments.forEach(p => {
            const d = new Date(p.created_at);
            if (d.getFullYear() === currentYear) {
              const mName = monthNames[d.getMonth()];
              if(finMap[mName]) finMap[mName].r += Number(p.amount);
            }
          });
        }
        if (expenses) {
          expenses.forEach(x => {
            const d = new Date(x.expense_date);
            if (d.getFullYear() === currentYear) {
              const mName = monthNames[d.getMonth()];
              if(finMap[mName]) finMap[mName].e += Number(x.amount);
            }
          });
        }
        setFinanceData(Object.keys(finMap).map(k => ({ month: k, revenue: finMap[k].r, expenses: finMap[k].e })));

        // 4. Fetch Attendance
        const { data: attData } = await supabase.from('attendance').select('*');
        let attMap = { 'Jan':{p:0,a:0}, 'Feb':{p:0,a:0}, 'Mar':{p:0,a:0}, 'Apr':{p:0,a:0} };
        if (attData) {
          attData.forEach(a => {
            const d = new Date(a.date);
            if (d.getFullYear() === currentYear) {
              const mName = monthNames[d.getMonth()];
              if(attMap[mName]) {
                if(a.status === 'present') attMap[mName].p++;
                else if(a.status === 'absent') attMap[mName].a++;
              }
            }
          });
        }
        setAttendanceMonthly(Object.keys(attMap).map(k => ({ month: k, present: attMap[k].p, absent: attMap[k].a })));

      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, []);

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
      
      {loading ? (
        <div className="h-full flex items-center justify-center">
          <div className="animate-spin text-4xl">⏳</div>
        </div>
      ) : (
        <>
          {reportView === 'main' && renderMainMenu()}
          {reportView === 'attendance' && renderAttendanceDetail()}
          {reportView === 'finance' && renderFinanceDetail()}
          {reportView === 'teachers' && renderStudentDemographics()}
          {reportView === 'exams' && renderLanguageFaculty()}
          {reportView === 'growth' && renderStudentFlow()}
        </>
      )}
    </div>
  );
};

export default Reports;
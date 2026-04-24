import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

const Icons = {
  Search: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
  Check: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>,
  Warning: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>,
  Info: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
};

const StudentAttendance = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    percentage: 0,
    presentDays: 0,
    absentDays: 0,
    totalClasses: 0
  });

  // ==========================================
  // 💡 Database Logic - STRICTLY PRESERVED
  // ==========================================
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: student } = await supabase
          .from('students')
          .select('first_name, last_name')
          .eq('email', user.email)
          .single();

        if (student) {
          const fullName = `${student.first_name || ''} ${student.last_name || ''}`.trim();

          const { data, error } = await supabase
            .from('attendance')
            .select('*')
            .eq('student_name', fullName)
            .order('date', { ascending: true });

          if (error) throw error;

          if (data) {
            const formatted = data.map((rec, idx) => ({
              id: idx + 1,
              sessionNumber: `Session ${(idx + 1).toString().padStart(2, '0')}`,
              course: rec.course || 'Language Course', 
              date: new Date(rec.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
              status: rec.status, 
              statusCol: rec.status === 'Present' ? 'text-emerald-500 bg-emerald-50' : 'text-red-500 bg-red-50'
            }));

            const reversedFormatted = [...formatted].reverse();
            setAttendanceRecords(reversedFormatted);

            const total = data.length;
            const present = data.filter(r => r.status === 'Present').length;
            const percent = total > 0 ? Math.round((present / total) * 100) : 0;

            setStats({
              percentage: percent,
              presentDays: present,
              absentDays: total - present,
              totalClasses: total
            });
          }
        }
      } catch (err) {
        console.error("Error fetching attendance:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  const dashArray = 339.29; 
  const dashOffset = dashArray - (dashArray * stats.percentage) / 100;

  return (
    <div className="flex-1 flex flex-col xl:flex-row gap-6 animate-fadeIn pr-2 pb-8">
      
      {/* LEFT CONTENT AREA */}
      <div className="flex-1 flex flex-col space-y-6 min-w-0">
        
        {/* HEADER SECTION - Standardized "My Learning Path" style */}
        <div className="flex flex-col space-y-1 px-1">
          <h2 className="text-xl font-black text-[#1B254B] italic tracking-tight">Attendance History</h2>
          <p className="text-[#A3AED0] text-[13px] font-bold uppercase tracking-widest opacity-80 leading-relaxed">
            Monitor your session presence and manage course eligibility through real-time tracking.
          </p>
        </div>

        {/* DETAILED RECORD TABLE CARD */}
        <div className="bg-white rounded-[25px] p-6 shadow-sm border border-gray-100 overflow-hidden min-h-[400px]">
          <div className="flex justify-between items-center mb-6 px-2">
            <h3 className="text-sm font-bold text-[#1B254B] uppercase tracking-widest italic">Session Log</h3>
            <div className="relative group w-48">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A3AED0]"><Icons.Search /></span>
                <input 
                    type="text" 
                    placeholder="Search module..." 
                    className="w-full bg-[#F4F7FE] border-none rounded-full py-2 pl-10 pr-4 text-[11px] font-bold outline-none focus:ring-1 focus:ring-[#4318FF]/20 transition-all" 
                />
            </div>
          </div>

          {loading ? (
            <div className="py-16 text-center font-black text-[#A3AED0] text-[11px] animate-pulse uppercase tracking-[0.2em]">Synchronizing...</div>
          ) : attendanceRecords.length > 0 ? (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[#A3AED0] text-[10px] font-black uppercase tracking-widest border-b border-gray-50">
                    <th className="pb-4 pl-2 w-12 text-center">#</th>
                    <th className="pb-4">Module Reference</th>
                    <th className="pb-4 text-center">Session</th>
                    <th className="pb-4 text-center">Date</th>
                    <th className="pb-4 text-center">Validation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {attendanceRecords.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="py-4 pl-2 text-[11px] font-black text-[#A3AED0] text-center">{item.id.toString().padStart(2, '0')}</td>
                      <td className="py-4">
                        <span className="text-[13px] font-black text-[#1B254B] uppercase group-hover:text-[#4318FF] transition-colors italic leading-none">{item.course}</span>
                      </td>
                      <td className="py-4 text-center">
                        <span className="bg-[#F4F7FE] text-[#4318FF] text-[9px] font-black px-3 py-1 rounded-md uppercase tracking-wider">
                          {item.sessionNumber}
                        </span>
                      </td>
                      <td className="py-4 text-center text-[11px] font-bold text-[#707EAE] uppercase italic">{item.date}</td>
                      <td className="py-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-tight shadow-sm ${item.statusCol}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${item.status === 'Present' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-20 flex flex-col items-center justify-center space-y-4 opacity-40">
                <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-300">
                    <Icons.Info />
                </div>
                <p className="text-center text-gray-500 font-bold uppercase text-[11px] tracking-widest">No entries localized yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SIDEBAR - Matched width to Dashboard */}
      <aside className="w-full xl:w-[280px] shrink-0 flex flex-col space-y-6">
        
        {/* STATS CARDS */}
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-[20px] shadow-sm border border-gray-50 flex flex-col items-center group hover:shadow-md transition-all active:scale-95 cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center mb-2 shadow-inner"><Icons.Check /></div>
              <p className="text-xl font-black text-[#1B254B] leading-none">{stats.presentDays}</p>
              <p className="text-[9px] text-[#A3AED0] font-black uppercase mt-1 tracking-widest">Sessions</p>
            </div>
            <div className="bg-white p-5 rounded-[20px] shadow-sm border border-gray-50 flex flex-col items-center group hover:shadow-md transition-all active:scale-95 cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center mb-2 shadow-inner">✕</div>
              <p className="text-xl font-black text-[#1B254B] leading-none">{stats.absentDays}</p>
              <p className="text-[9px] text-[#A3AED0] font-black uppercase mt-1 tracking-widest">Absences</p>
            </div>
        </div>

        {/* PROGRESS CHART */}
        <div className="bg-white p-6 rounded-[30px] shadow-sm border border-gray-100 flex flex-col items-center">
           <h3 className="font-black text-[#1B254B] uppercase tracking-[0.2em] text-[10px] mb-8 w-full text-center border-b border-gray-50 pb-3 italic">Benchmarking</h3>
           <div className="relative flex items-center justify-center h-32 w-32">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="54" stroke="#F4F7FE" strokeWidth="12" fill="transparent" />
                <circle 
                  cx="64" cy="64" r="54" 
                  stroke={stats.percentage >= 85 ? "#4318FF" : "#E31A1A"} 
                  strokeWidth="12" 
                  fill="transparent" 
                  strokeDasharray="339.29" 
                  strokeDashoffset={339.29 - (339.29 * stats.percentage) / 100} 
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out shadow-lg"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <span className="text-2xl font-black text-[#1B254B] italic leading-none">{stats.percentage}%</span>
              </div>
           </div>
        </div>

        {/* STATUS REVIEW BOX */}
        <div className={`rounded-[30px] p-6 text-white relative overflow-hidden shadow-lg transition-all hover:bg-[#0B132B] group ${stats.percentage >= 85 ? 'bg-[#111C44]' : 'bg-[#E31A1A]'}`}>
          <div className="relative z-10 text-center">
            <h4 className="text-lg font-black mb-1 uppercase tracking-tighter italic leading-none">
              Status: {stats.percentage >= 85 ? 'Qualified' : 'Warning'}
            </h4>
            <p className="text-white/50 text-[9px] font-black uppercase tracking-widest mb-6">Administrative Review</p>
            <div className="p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-md">
                <p className="text-[10px] font-bold text-white/80 leading-relaxed uppercase tracking-widest">
                  Attendance above 85% is mandatory for module certification eligibility.
                </p>
            </div>
            <button className="w-full mt-6 py-3 bg-white text-[#1B254B] rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:bg-opacity-90 active:scale-95 shadow-xl">
                Contact Office
            </button>
          </div>
          <div className="absolute -right-10 -bottom-10 opacity-5 font-black text-[140px] italic select-none group-hover:scale-110 transition-transform duration-700">!</div>
        </div>

      </aside>
    </div>
  );
};

export default StudentAttendance;
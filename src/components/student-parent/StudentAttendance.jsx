import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

const Icons = {
  Search: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
  User: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
  Check: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>,
  Settings: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle></svg>,
  Award: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
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
  // 💡 Fetch Attendance from Supabase
  // ==========================================
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // 1. نجيبو اسم الطالب
        const { data: student } = await supabase
          .from('students')
          .select('first_name, last_name')
          .eq('email', user.email)
          .single();

        if (student) {
          const fullName = `${student.first_name || ''} ${student.last_name || ''}`.trim();

          // 2. نجيبو الغياب (ونرتبوه من القديم للجديد باش نمدو أرقام الحصص صحيحة)
          const { data, error } = await supabase
            .from('attendance')
            .select('*')
            .eq('student_name', fullName)
            .order('date', { ascending: true }); // ترتيب تصاعدي باش نحسبو الحصص

          if (error) throw error;

          if (data) {
            // نعطيو رقم لكل حصة (Session 1, Session 2...)
            const formatted = data.map((rec, idx) => ({
              id: idx + 1,
              sessionNumber: `Session ${(idx + 1).toString().padStart(2, '0')}`, // 💡 رقم الحصة
              course: rec.course || 'Language Course', 
              date: new Date(rec.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
              status: rec.status, 
              statusCol: rec.status === 'Present' ? 'text-green-500 bg-green-50' : 'text-red-500 bg-red-50'
            }));

            // نعاودو نقلبو الترتيب باش الجديد يبان الفوق في الشاشة
            const reversedFormatted = [...formatted].reverse();

            setAttendanceRecords(reversedFormatted);

            // حساب الإحصائيات
            const total = data.length;
            const present = data.filter(r => r.status === 'Present').length;
            const absent = total - present;
            const percent = total > 0 ? Math.round((present / total) * 100) : 0;

            setStats({
              percentage: percent,
              presentDays: present,
              absentDays: absent,
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

  // حساب الـ Stroke للرسم البياني
  const dashArray = 477.52;
  const dashOffset = dashArray - (dashArray * stats.percentage) / 100;

  return (
    <div className="flex-1 flex flex-col xl:flex-row gap-10 animate-fadeIn pr-2 pb-10">
      <div className="flex-1 flex flex-col space-y-10 min-w-0">
        
        {/* HEADER HERO */}
        <div className="bg-[#EBE9F1] rounded-[45px] p-12 flex justify-between items-center relative overflow-hidden min-h-[220px] shadow-sm">
          <div className="z-10 w-full md:w-3/5">
            <h2 className="text-3xl font-black text-[#1B254B] mb-4 uppercase tracking-tighter italic">Attendance History</h2>
            <p className="text-[#1B254B]/60 text-sm mb-8 leading-relaxed font-bold uppercase tracking-widest opacity-70">
              Personalized tracking for your sessions. Your current average is <span className="text-[#4318FF] font-black">{stats.percentage}%</span>.
            </p>
          </div>
          <div className="absolute right-[-20px] bottom-[-20px] opacity-10 text-[220px] font-black pointer-events-none select-none italic">A</div>
        </div>

        {/* ATTENDANCE TABLE */}
        <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-50 overflow-hidden">
          <h3 className="text-xl font-black text-[#1B254B] uppercase tracking-widest mb-10 italic">Detailed Record</h3>

          {loading ? (
            <div className="py-20 text-center font-black text-[#A3AED0] animate-pulse uppercase">Syncing Records...</div>
          ) : attendanceRecords.length > 0 ? (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="text-[#A3AED0] text-[10px] font-black uppercase tracking-[0.2em] border-b border-gray-100">
                    <th className="pb-6 pl-4 w-16">#</th>
                    <th className="pb-6 uppercase">Course Module</th>
                    <th className="pb-6 text-center">Session</th> {/* 💡 العمود الجديد */}
                    <th className="pb-6 text-center">Date</th>
                    <th className="pb-6 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {attendanceRecords.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-all group">
                      <td className="py-6 pl-4 text-xs font-black text-[#A3AED0]">{item.id}</td>
                      <td className="py-6 font-black text-[#1B254B] text-[14px] uppercase italic">{item.course}</td>
                      {/* 💡 إظهار رقم الحصة هنا */}
                      <td className="py-6 text-center">
                        <span className="bg-[#F4F7FE] text-[#4318FF] text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest">
                          {item.sessionNumber}
                        </span>
                      </td>
                      <td className="py-6 text-center text-xs font-bold text-[#707EAE] uppercase">{item.date}</td>
                      <td className="py-6 text-center">
                        <span className={`inline-flex items-center gap-2 px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm ${item.statusCol}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${item.status === 'Present' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-10 text-center text-gray-400 font-bold uppercase tracking-widest">No attendance records found.</div>
          )}
        </div>
      </div>

      {/* RIGHT SIDEBAR */}
      <div className="w-full xl:w-[350px] shrink-0 flex flex-col space-y-10">
        
        {/* STATS SUMMARY */}
        <div className="grid grid-cols-2 gap-5">
            <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-50 flex flex-col items-center">
              <div className="w-10 h-10 rounded-xl bg-green-50 text-green-500 flex items-center justify-center mb-3"><Icons.Check /></div>
              <p className="text-2xl font-black text-[#1B254B]">{stats.presentDays}</p>
              <p className="text-[8px] text-[#A3AED0] font-black uppercase tracking-widest">Present</p>
            </div>
            <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-50 flex flex-col items-center">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center mb-3">✕</div>
              <p className="text-2xl font-black text-[#1B254B]">{stats.absentDays}</p>
              <p className="text-[8px] text-[#A3AED0] font-black uppercase tracking-widest">Absent</p>
            </div>
        </div>

        {/* PROGRESS CHART */}
        <div className="bg-white p-10 rounded-[45px] shadow-sm border border-gray-100 flex flex-col items-center">
           <h3 className="font-black text-[#1B254B] uppercase tracking-[0.2em] text-[11px] mb-10 w-full text-center italic">Benchmarking</h3>
           <div className="relative flex items-center justify-center">
              <svg className="w-44 h-44 transform -rotate-90">
                <circle cx="88" cy="88" r="76" stroke="#F4F7FE" strokeWidth="18" fill="transparent" />
                <circle 
                  cx="88" cy="88" r="76" 
                  stroke="#4318FF" strokeWidth="18" 
                  fill="transparent" 
                  strokeDasharray={dashArray} 
                  strokeDashoffset={dashOffset} 
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <span className="text-4xl font-black text-[#1B254B] italic">{stats.percentage}%</span>
                 <span className="text-[9px] font-black text-[#A3AED0] uppercase tracking-widest">Attendance</span>
              </div>
           </div>
        </div>

        {/* STATUS BOX */}
        <div className="bg-[#111C44] rounded-[45px] p-10 text-white relative overflow-hidden shadow-2xl group">
          <div className="relative z-10 text-center">
            <h4 className="text-2xl font-black mb-1 uppercase tracking-tighter italic">Status: {stats.percentage >= 85 ? 'GOOD' : 'WARNING'}</h4>
            <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-8">Academic Review</p>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                <p className="text-[10px] font-bold text-white/70 leading-relaxed uppercase tracking-widest">
                  Maintain 85% presence to guarantee course certification.
                </p>
            </div>
          </div>
          <div className="absolute -right-12 -bottom-12 opacity-5 font-black text-[200px] italic select-none">!</div>
        </div>
      </div>
    </div>
  );
};

export default StudentAttendance;
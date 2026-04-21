import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

const Icons = {
  Clock: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>,
  Calendar: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>,
  Download: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>,
  User: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
};

const StudentSchedule = () => {
  const [activeSession, setActiveSession] = useState(null);
  const [mySchedule, setMySchedule] = useState([]);
  const [studentLevel, setStudentLevel] = useState("");
  const [loading, setLoading] = useState(true);

  const timeSlots = ["10:00", "12:00", "14:00", "16:00", "18:00", "20:00"];
  const days = ["MON", "TUE", "WED", "THU", "FRI", "SUN"];

  // ==========================================
  // 💡 Fetch real data from Supabase
  // ==========================================
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // 1. نجيبو معلومات الطالب باش نعرفو لغتو ومستواه
        const { data: student } = await supabase
          .from('students')
          .select('language, level, group_name')
          .eq('email', user.email)
          .single();

        if (student) {
          setStudentLevel(`${student.language} ${student.level}`);

          // 2. نجيبو الأقسام اللي تطابق مستوى الطالب
          const { data: classes } = await supabase
            .from('classes')
            .select('*')
            .ilike('language', `%${student.language}%`)
            .eq('level', student.level);

          if (classes) {
            // تحويل البيانات لشكل يفهمو الجدول (Parsing schedule string if needed)
            const formatted = classes.map(cls => ({
              day: cls.schedule?.split(' ')[0]?.toUpperCase() || "MON", // نفترض التوقيت يبدا باليوم
              time: cls.schedule?.match(/\d{2}:\d{2}/)?.[0] || "10:00", 
              subject: `${cls.language} ${cls.level}`,
              teacher: cls.teacher_name || "Instructor",
              type: cls.name || "CLASSE",
              color: "border-[#4318FF] bg-[#4318FF]/10 text-[#4318FF]"
            }));
            setMySchedule(formatted);
          }
        }
      } catch (err) {
        console.error("Error fetching schedule:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedule();
  }, []);

  return (
    <div className="w-full flex flex-col xl:flex-row gap-10 animate-fadeIn pb-12 pr-2">
      
      <div className="flex-1 flex flex-col space-y-10 min-w-0">
        
        {/* HERO HEADER */}
        <div className="bg-[#EBE9F1] rounded-[45px] p-12 flex justify-between items-center relative overflow-hidden min-h-[220px] shadow-sm">
          <div className="z-10 w-full md:w-3/5">
            <h2 className="text-3xl font-black text-[#1B254B] mb-4 uppercase tracking-tighter leading-none">Academic Timetable</h2>
            <p className="text-[#1B254B]/60 text-sm mb-10 leading-relaxed font-bold max-w-lg uppercase tracking-widest opacity-70">
              Personalized schedule for <span className="text-[#4318FF] font-black">{studentLevel || "Your Level"}</span>. Only your assigned modules are displayed.
            </p>
          </div>
          <div className="absolute right-[-20px] bottom-[-20px] opacity-10 text-[240px] font-black pointer-events-none select-none">F</div>
        </div>

        {/* TIMETABLE GRID */}
        <div className="bg-white rounded-[45px] p-8 shadow-sm border border-gray-50 overflow-x-auto custom-scrollbar">
          {loading ? (
            <div className="p-20 text-center font-bold text-gray-400 animate-pulse">LOADING YOUR SCHEDULE...</div>
          ) : (
            <table className="w-full table-fixed border-separate border-spacing-2 min-w-[800px]">
              <thead>
                <tr>
                  <th className="p-4 bg-[#F4F7FE]/50 rounded-2xl w-24">
                     <div className="flex justify-center text-[#A3AED0]"><Icons.Clock /></div>
                  </th>
                  {days.map((day) => (
                    <th key={day} className="p-4 text-center text-[10px] font-black text-[#A3AED0] uppercase tracking-[0.2em] bg-[#F4F7FE]/50 rounded-2xl">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map(time => (
                  <tr key={time}>
                    <td className="p-6 text-xs font-black text-[#1B254B] text-center bg-gray-50/40 rounded-2xl uppercase tracking-tighter">
                      {time}
                    </td>
                    {days.map(day => {
                      // نحوسو إذا كاين حصة في هاد اليوم وهاد الوقت
                      const session = mySchedule.find(s => s.day.includes(day) && s.time === time);
                      return (
                        <td key={day + time} className="p-0 h-[130px]">
                          {session ? (
                            <div 
                              onClick={() => setActiveSession(session)}
                              className={`h-full w-full rounded-[24px] border-l-[4px] p-4 ${session.color} flex flex-col justify-between hover:scale-[1.02] hover:shadow-xl transition-all duration-300 cursor-pointer active:scale-95`}
                            >
                              <div className="space-y-1">
                                <div className="text-[8px] font-black uppercase tracking-widest opacity-60 truncate">{session.type}</div>
                                <div className="text-[12px] font-black uppercase tracking-tight leading-tight line-clamp-2">{session.subject}</div>
                              </div>
                              <div className="flex items-center gap-2 text-[9px] font-black opacity-80 mt-2 border-t border-current/10 pt-3 uppercase tracking-widest truncate">
                                <Icons.User /> {session.teacher}
                              </div>
                            </div>
                          ) : (
                            <div className="h-full w-full rounded-[24px] border-2 border-dashed border-gray-50 flex items-center justify-center opacity-30">
                              <div className="w-1 h-1 bg-gray-200 rounded-full"></div>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* RIGHT SIDEBAR */}
      <div className="w-full xl:w-[380px] shrink-0 flex flex-col space-y-10">
        <div className="bg-white p-10 rounded-[50px] shadow-sm border border-gray-50 text-center">
          <p className="text-[11px] font-black text-[#1B254B] mb-10 uppercase tracking-[0.3em] border-b border-gray-50 pb-6">Term Status</p>
          <div className="w-20 h-20 bg-[#4318FF] rounded-3xl flex items-center justify-center text-white shadow-xl mx-auto mb-6">
            <Icons.Calendar />
          </div>
          <h4 className="font-black text-[#1B254B] uppercase tracking-tighter">Academic Year 2026</h4>
          <p className="text-[10px] font-black text-[#A3AED0] uppercase mt-2">Active Semester</p>
        </div>

        <div className="bg-[#111C44] p-10 rounded-[50px] shadow-2xl text-white relative overflow-hidden group">
           <h4 className="text-xl font-black mb-3 uppercase tracking-tighter relative z-10">Live Room</h4>
           <p className="text-white/40 text-[10px] font-black mb-10 uppercase relative z-10">Links activate on session start.</p>
           <button className="w-full py-5 bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] relative z-10 border border-white/5">Enter Classroom</button>
           <div className="absolute -right-8 -bottom-8 opacity-5 font-black text-[160px] italic">F</div>
        </div>
      </div>

      {/* SESSION MODAL */}
      {activeSession && (
        <div className="fixed inset-0 bg-[#0B132B]/80 backdrop-blur-md z-[100] flex items-center justify-center p-6" onClick={() => setActiveSession(null)}>
           <div className="bg-white rounded-[50px] p-14 max-w-lg w-full shadow-2xl relative" onClick={e => e.stopPropagation()}>
              <h3 className="text-4xl font-black text-[#1B254B] uppercase tracking-tighter mb-10">{activeSession.subject}</h3>
              <div className="space-y-6 mb-12">
                 <div className="flex justify-between border-b pb-4">
                    <span className="text-[10px] font-black text-[#A3AED0] uppercase">Instructor</span>
                    <span className="text-xs font-black uppercase">{activeSession.teacher}</span>
                 </div>
                 <div className="flex justify-between">
                    <span className="text-[10px] font-black text-[#A3AED0] uppercase">Schedule</span>
                    <span className="text-xs font-black text-[#4318FF] uppercase">{activeSession.day} at {activeSession.time}</span>
                 </div>
              </div>
              <button className="w-full bg-[#111C44] text-white py-6 rounded-3xl font-black uppercase text-[11px]">Join Session</button>
           </div>
        </div>
      )}
    </div>
  );
};

export default StudentSchedule;
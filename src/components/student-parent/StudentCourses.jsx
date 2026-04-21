import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

const Icons = {
  Play: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"></path></svg>,
  CheckCircle: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>,
  Lock: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>,
  Clock: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>,
  BookOpen: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
};

const StudentCourses = () => {
  const [activeClass, setActiveClass] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyCourse = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // نجيبو معلومات الطالب
        const { data: student } = await supabase
          .from('students')
          .select('group_name, language, level')
          .eq('email', user.email)
          .single();

        if (student && student.group_name) {
          // نجيبو الكور تاعو من classes
          const { data: cls } = await supabase
            .from('classes')
            .select('*')
            .eq('name', student.group_name)
            .single();

          if (cls) {
            setActiveClass({
              name: cls.name || student.group_name,
              subject: `${student.language || 'Language'} - ${student.level || 'Level'}`,
              teacher: cls.teacher_name || 'Assigned Professor',
              schedule: cls.schedule || 'Mon & Wed - 14:00',
              completed_sessions: cls.completed_sessions || 0, // 💡 جبنا الحصص المقروءة
              total_sessions: cls.total_sessions || 24         // 💡 جبنا الحصص الكلية
            });
          }
        }
      } catch (err) {
        console.error("Error fetching course:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourse();
  }, []);

  // 💡 حساب نسبة التقدم ديناميكياً
  const progressPercentage = activeClass && activeClass.total_sessions > 0
    ? Math.min(Math.round((activeClass.completed_sessions / activeClass.total_sessions) * 100), 100)
    : 0;

  // 💡 دالة لتحديد حالة الدروس بناءً على نسبة التقدم
  const getModuleStatus = (threshold) => {
    if (progressPercentage >= threshold) return "Completed";
    if (progressPercentage >= threshold - 20) return "In Progress";
    return "Locked";
  };

  // 💡 المنهج الدراسي يتفاعل أوتوماتيكياً مع التقدم
  const curriculum = [
    { id: 1, title: "Module 1: Foundations & Grammar", duration: "20% of Course", status: getModuleStatus(20) },
    { id: 2, title: "Module 2: Vocabulary Expansion", duration: "20% of Course", status: getModuleStatus(40) },
    { id: 3, title: "Module 3: Conversational Fluency", duration: "20% of Course", status: getModuleStatus(60) },
    { id: 4, title: "Module 4: Advanced Writing", duration: "20% of Course", status: getModuleStatus(80) },
    { id: 5, title: "Module 5: Final Assessment Prep", duration: "20% of Course", status: getModuleStatus(100) }
  ];

  return (
    <div className="flex-1 flex flex-col gap-10 animate-fadeIn pr-2 pb-12">
      
      {/* HEADER HERO */}
      <div className="bg-[#EBE9F1] rounded-[45px] p-12 flex justify-between items-center relative overflow-hidden min-h-[220px] shadow-sm">
        <div className="z-10 w-full md:w-3/5">
          <h2 className="text-3xl font-black text-[#1B254B] mb-4 uppercase tracking-tighter leading-none">My Learning Path</h2>
          <p className="text-[#1B254B]/60 text-sm mb-10 leading-relaxed font-bold max-w-lg uppercase tracking-widest opacity-70">
            Track your academic progress, view your scheduled sessions, and access your active modules.
          </p>
          <button className="bg-[#111C44] text-white px-10 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-black active:scale-95 transition-all">
            Download Curriculum PDF
          </button>
        </div>
        <div className="absolute right-[-20px] bottom-[-20px] opacity-10 text-[240px] font-black pointer-events-none select-none italic leading-none">C</div>
      </div>

      {loading ? (
        <div className="py-20 text-center font-black text-[#A3AED0] animate-pulse uppercase tracking-widest">Loading Course Data...</div>
      ) : activeClass ? (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
          
          {/* LEFT: ACTIVE COURSE & PROGRESS */}
          <div className="xl:col-span-2 space-y-10">
            
            {/* CURRENT COURSE CARD */}
            <div className="bg-white rounded-[45px] p-10 shadow-sm border border-gray-100 overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#4318FF]/10 to-transparent rounded-bl-[100px] pointer-events-none"></div>
              
              <div className="flex justify-between items-start mb-8 relative z-10">
                <div>
                  <div className="bg-[#EEF2FF] text-[#4318FF] text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest inline-flex items-center gap-2 mb-4 border border-[#4318FF]/10">
                    <span className={`w-1.5 h-1.5 rounded-full ${progressPercentage >= 100 ? 'bg-[#01B574]' : 'bg-[#4318FF] animate-pulse'}`}></span> 
                    {progressPercentage >= 100 ? 'Completed' : 'Active Term'}
                  </div>
                  <h3 className="text-3xl font-black text-[#1B254B] uppercase tracking-tighter italic leading-tight">{activeClass.name}</h3>
                  <p className="text-[12px] font-bold text-[#A3AED0] uppercase tracking-widest mt-2">{activeClass.subject}</p>
                </div>
                <div className="text-right">
                  <div className="flex flex-col items-end gap-2">
                     <span className="text-[10px] font-black text-[#A3AED0] uppercase tracking-widest">Instructor</span>
                     <span className="text-[13px] font-black text-[#1B254B] uppercase bg-gray-50 px-4 py-2 rounded-xl">{activeClass.teacher}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-[#1B254B] bg-[#F4F7FE] p-4 rounded-2xl w-fit mb-12">
                 <Icons.Clock />
                 <span className="text-[11px] font-black uppercase tracking-widest">Schedule: {activeClass.schedule}</span>
              </div>

              {/* 💡 PROGRESS BAR الحقيقي */}
              <div className="space-y-4 relative z-10">
                <div className="flex justify-between items-end px-1">
                  <div>
                    <p className="text-[10px] font-black text-[#A3AED0] uppercase tracking-widest mb-1">Course Completion</p>
                    <p className={`text-2xl font-black italic ${progressPercentage >= 100 ? 'text-[#01B574]' : 'text-[#4318FF]'}`}>
                      {progressPercentage}%
                    </p>
                  </div>
                  {/* 💡 عدد الحصص الحقيقي */}
                  <span className="text-[10px] font-black text-[#1B254B] uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-lg border border-gray-100 shadow-sm">
                    {activeClass.completed_sessions} / {activeClass.total_sessions} Sessions
                  </span>
                </div>
                
                <div className="h-4 w-full bg-[#F4F7FE] rounded-full overflow-hidden p-0.5 border border-gray-100 shadow-inner">
                  <div 
                    className={`h-full rounded-full shadow-[0_0_15px_rgba(67,24,255,0.4)] transition-all duration-1000 relative ${progressPercentage >= 100 ? 'bg-[#01B574]' : 'bg-gradient-to-r from-[#4318FF] to-[#300bf5]'}`}
                    style={{ width: `${progressPercentage}%` }}
                  >
                     <div className="absolute right-0 top-0 bottom-0 w-4 bg-white/20 blur-[2px]"></div>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex gap-4">
                <button className={`flex-1 text-white py-5 rounded-3xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95 ${progressPercentage >= 100 ? 'bg-[#01B574] hover:bg-green-700 shadow-green-900/20' : 'bg-[#4318FF] hover:bg-[#3311CC] shadow-blue-900/20'}`}>
                  {progressPercentage >= 100 ? <><Icons.CheckCircle /> View Certificate</> : <><Icons.Play /> Continue Learning</>}
                </button>
              </div>
            </div>

          </div>

          {/* RIGHT: CURRICULUM TIMELINE (تتفاعل مع نسبة التقدم) */}
          <div className="bg-white rounded-[45px] p-10 shadow-sm border border-gray-50 h-full">
            <h3 className="flex items-center gap-4 text-[#1B254B] font-black text-lg uppercase tracking-widest border-b border-gray-50 pb-6 mb-8">
              <div className="text-[#4318FF]"><Icons.BookOpen /></div>
              Curriculum Map
            </h3>

            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-[#4318FF] before:via-gray-200 before:to-gray-100">
              {curriculum.map((mod, idx) => (
                <div key={mod.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                  {/* Timeline Dot */}
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white shadow-md absolute left-0 md:left-1/2 -translate-x-1/2 z-10 transition-transform ${
                    mod.status === 'Completed' ? 'bg-[#01B574] text-white' : 
                    mod.status === 'In Progress' ? 'bg-[#4318FF] text-white animate-pulse' : 
                    'bg-gray-100 text-gray-400'
                  }`}>
                    {mod.status === 'Completed' ? <Icons.CheckCircle /> : 
                     mod.status === 'In Progress' ? <span className="w-3 h-3 bg-white rounded-full"></span> : 
                     <Icons.Lock />}
                  </div>

                  {/* Card */}
                  <div className={`w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] p-5 rounded-2xl border transition-all ${
                    mod.status === 'In Progress' ? 'bg-[#F4F7FE] border-[#4318FF]/20 shadow-md transform scale-105 z-20' : 
                    mod.status === 'Completed' ? 'bg-white border-green-100 opacity-80' : 
                    'bg-gray-50 border-gray-100 opacity-50'
                  }`}>
                    <p className={`text-[11px] font-black uppercase tracking-tight leading-tight mb-2 ${mod.status === 'In Progress' ? 'text-[#4318FF]' : 'text-[#1B254B]'}`}>
                      {mod.title}
                    </p>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-[9px] font-black text-[#A3AED0] uppercase tracking-widest">{mod.duration}</span>
                      <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${
                        mod.status === 'Completed' ? 'bg-green-100 text-green-600' : 
                        mod.status === 'In Progress' ? 'bg-blue-100 text-blue-600' : 
                        'bg-gray-200 text-gray-500'
                      }`}>
                        {mod.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      ) : (
        <div className="bg-white rounded-[40px] p-20 text-center shadow-sm border border-gray-50">
          <span className="text-5xl mb-4 block">📚</span>
          <p className="text-[#A3AED0] font-black uppercase tracking-widest text-sm">No active courses assigned yet.</p>
        </div>
      )}
    </div>
  );
};

export default StudentCourses;
import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

const Icons = {
  Upload: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>,
  File: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>,
  ArrowLeft: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>,
  Check: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>,
  Download: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
};

const StudentHomeworks = () => {
  const [currentView, setCurrentView] = useState('list');
  const [selectedHomework, setSelectedHomework] = useState(null);

  // 💡 States لجلب الواجبات من Supabase
  const [studentClass, setStudentClass] = useState('');
  const [studentLevel, setStudentLevel] = useState('');
  const [homeworksList, setHomeworksList] = useState([]);
  const [loading, setLoading] = useState(true);

  // 💡 دالة الجلب من الداتا باز
  useEffect(() => {
    const fetchHomeworks = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // 1. نجيبو معلومات الطالب (القسم والنيفو)
        const { data: studentData } = await supabase
          .from('students')
          .select('group_name, level')
          .eq('email', user.email)
          .single();

        if (studentData && studentData.group_name) {
          setStudentClass(studentData.group_name);
          setStudentLevel(studentData.level || 'Unknown Level');

          // 2. نجيبو الواجبات تاع القسم تاعو
          const { data: hwData } = await supabase
            .from('homeworks')
            .select('*')
            .eq('class_name', studentData.group_name)
            .order('created_at', { ascending: false });

          if (hwData) {
            // نجهزو الداتا باش توالم الديزاين تاعك
            const formattedHw = hwData.map((hw, index) => {
              // حاليا نعتبروهم كامل Not Submitted كافتراضي (لأنو مازال ماخدمناش طابلو submissions)
              const status = "Not Submitted"; 
              const isCompleted = status === "Completed";
              
              // ألوان عشوائية للحدود باش يجي الديزاين شباب كيما كان
              const borderColors = ["border-orange-400", "border-blue-400", "border-purple-400", "border-green-400"];
              
              return {
                id: hw.id,
                title: hw.title,
                level: studentData.level,
                task: hw.description || "Review material",
                due: "Pending Date", // تقدري تزيدي تاريخ الاستحقاق في الداتا باز مبعد
                status: status,
                statusColor: isCompleted ? "text-green-500 bg-green-50" : "text-orange-500 bg-orange-50",
                border: borderColors[index % 4],
                file_url: hw.file_url,
                teacher: hw.teacher_name,
                date: new Date(hw.created_at).toLocaleDateString('en-GB')
              };
            });
            setHomeworksList(formattedHw);
          }
        }
      } catch (error) {
        console.error('Error fetching homeworks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeworks();
  }, []);

  const openAction = (hw) => {
    setSelectedHomework(hw);
    setCurrentView(hw.status === "Completed" ? 'details' : 'submit');
  };

  if (loading) {
    return <div className="flex-1 flex items-center justify-center"><p className="font-bold text-gray-500">Loading assignments... ⏳</p></div>;
  }

  // --- LEVEL 2: SUBMISSION OR FEEDBACK VIEW ---
  if (currentView !== 'list') {
    return (
      <div className="flex-1 flex items-center justify-center p-4 animate-fadeIn">
        <div className="w-full max-w-3xl bg-white p-10 rounded-[45px] shadow-sm border border-gray-100">
          <button 
            onClick={() => setCurrentView('list')} 
            className="group text-[#A3AED0] text-xs mb-10 hover:text-[#4318FF] flex items-center gap-3 font-black uppercase tracking-[0.2em] transition-all"
          >
            <div className="bg-[#F4F7FE] p-2 rounded-lg group-hover:bg-[#4318FF] group-hover:text-white transition-all"><Icons.ArrowLeft /></div>
            Back to Assignments
          </button>
          
          <div className="mb-10">
            <h2 className="text-3xl font-black text-[#1B254B] mb-3 uppercase tracking-tighter">
              {currentView === 'submit' ? `Assignment Details` : `Marking Result`}
            </h2>
            <div className="flex items-center gap-4 flex-wrap">
                <span className="px-4 py-1.5 bg-[#F4F7FE] text-[#4318FF] text-[10px] font-black rounded-xl uppercase tracking-widest border border-[#4318FF]/10">
                    {selectedHomework?.title}
                </span>
                <span className="text-[11px] text-[#A3AED0] font-black uppercase tracking-widest">Date: {selectedHomework?.date}</span>
                <span className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">Prof: {selectedHomework?.teacher || 'Teacher'}</span>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-[24px] mb-8 border border-gray-100">
            <h4 className="text-xs font-black text-[#1B254B] uppercase tracking-widest mb-2">Task Description:</h4>
            <p className="text-sm text-gray-600 font-medium leading-relaxed whitespace-pre-wrap">{selectedHomework?.task}</p>
            
            {/* 💡 زر تحميل المرفقات اللي بعثهم الأستاذ */}
            {selectedHomework?.file_url && (
              <a 
                href={selectedHomework.file_url} 
                target="_blank" 
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-2 bg-white border border-gray-200 text-[#4318FF] px-6 py-3 rounded-xl text-xs font-bold hover:bg-blue-50 transition-colors shadow-sm"
              >
                <Icons.Download /> Download Teacher's Attachment
              </a>
            )}
          </div>

          {currentView === 'submit' ? (
            <div className="space-y-8">
              <div className="border-4 border-dashed border-[#F4F7FE] rounded-[40px] p-16 text-center hover:border-[#4318FF]/20 hover:bg-[#F4F7FE]/30 transition-all cursor-pointer group">
                <div className="bg-[#4318FF] text-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-500/20 group-hover:scale-110 transition-transform">
                    <Icons.Upload />
                </div>
                <p className="text-sm font-black text-[#1B254B] mb-2 uppercase tracking-widest">Select your answer file</p>
                <p className="text-[10px] font-bold text-[#A3AED0] uppercase tracking-widest opacity-60">PDF, DOCX OR ZIP (MAX 10MB)</p>
              </div>
              <button className="w-full bg-[#111C44] text-white font-black py-5 rounded-[24px] shadow-2xl shadow-blue-900/20 hover:bg-black transition-all text-xs uppercase tracking-[0.3em]">
                Submit Homework
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="bg-[#F4F7FE] p-10 rounded-[40px] border border-gray-100 relative overflow-hidden">
                <h4 className="font-black text-[#1B254B] text-[11px] mb-5 uppercase tracking-[0.3em] opacity-40">Instructor Feedback</h4>
                <p className="text-[#1B254B] leading-relaxed italic text-[15px] font-bold mb-8">
                  "The structure of your oral presentation showed excellent preparation. Your language flow was natural and well-paced. Excellent work on the B2 objectives."
                </p>
                <div className="pt-8 border-t border-gray-200 flex justify-between items-center">
                  <span className="font-black text-[#A3AED0] text-[10px] uppercase tracking-[0.2em]">Validated Score</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-[#01B574] font-black text-4xl italic leading-none tracking-tighter">18</span>
                    <span className="text-[#A3AED0] font-black text-lg">/20</span>
                  </div>
                </div>
                <div className="absolute right-[-20px] top-[-20px] text-[120px] font-black opacity-[0.03] pointer-events-none italic">A+</div>
              </div>
              <button className="w-full py-4 border-2 border-gray-100 rounded-[22px] text-[10px] font-black text-[#1B254B] uppercase tracking-[0.2em] hover:bg-gray-50 transition-all flex items-center justify-center gap-3">
                <Icons.File /> Download Marked File
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- LEVEL 1: LIST VIEW ---
  return (
    <div className="flex-1 flex flex-col xl:flex-row gap-10 animate-fadeIn pr-2 pb-10 p-8">
      
      <div className="flex-1 flex flex-col space-y-10 min-w-0">
        <div className="bg-[#EBE9F1] rounded-[45px] p-10 flex justify-between items-center relative overflow-hidden min-h-[220px] shadow-sm">
          <div className="z-10 w-full md:w-3/5 flex flex-col justify-center">
            <h2 className="text-3xl font-black text-[#1B254B] mb-4 uppercase tracking-tighter leading-none">Assignment Hub</h2>
            <p className="text-[#1B254B]/60 text-sm mb-10 leading-relaxed font-bold max-w-lg uppercase tracking-widest opacity-70">
              Manage your academic tasks for <span className="text-blue-600">[{studentClass}]</span>. Review instructions and download materials provided by your instructor.
            </p>
          </div>
          <div className="absolute right-[-20px] bottom-[-20px] opacity-10 text-[240px] font-black pointer-events-none select-none">H</div>
        </div>

        {homeworksList.length === 0 ? (
          <div className="bg-white rounded-[40px] p-16 text-center border border-gray-100 shadow-sm">
             <span className="text-6xl mb-4 block">📭</span>
             <h3 className="text-xl font-bold text-[#1B254B] mb-2">No Assignments Yet</h3>
             <p className="text-sm text-gray-500 font-medium">Your teacher hasn't posted any homework for this class.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-2 gap-8">
            {homeworksList.map((hw) => (
              <div key={hw.id} className={`bg-white p-8 rounded-[40px] border-l-[10px] ${hw.border} shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col justify-between min-h-[240px] group active:scale-95 cursor-pointer`} onClick={() => openAction(hw)}>
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <h3 className="font-black text-[#1B254B] text-[16px] uppercase tracking-tighter leading-none group-hover:text-[#4318FF] transition-colors">{hw.title}</h3>
                    <span className={`text-[9px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest shadow-sm ${hw.statusColor}`}>{hw.status}</span>
                  </div>
                  <div className="space-y-4">
                    <p className="text-[13px] text-[#A3AED0] font-bold uppercase tracking-tight leading-relaxed line-clamp-2">
                        Assigned Task: <span className="text-[#1B254B] font-black">{hw.task}</span>
                    </p>
                    <div className="flex items-center gap-4 border-t border-gray-50 pt-5">
                      <p className="text-[10px] font-black text-[#4318FF] uppercase tracking-[0.1em] flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#4318FF]"></span>
                          Date: {hw.date}
                      </p>
                      <p className="text-[10px] font-black text-[#A3AED0] uppercase tracking-[0.1em]">Level: {hw.level}</p>
                    </div>
                  </div>
                </div>
                
                <button className="text-[#4318FF] text-[11px] font-black uppercase tracking-[0.2em] text-left hover:underline mt-8 flex items-center gap-2 transition-all">
                  {hw.status === "Completed" ? "View Assessment" : "Open Assignment"} 
                  <span className="text-xl leading-none transform translate-y-[-1px]">→</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT SIDEBAR */}
      <div className="w-full xl:w-[350px] shrink-0 flex flex-col space-y-10">
        <div className="text-right text-[10px] font-black text-[#A3AED0] uppercase tracking-[0.3em]">Module Overview</div>

        {/* PROGRESS CARD */}
        <div className="bg-white p-10 rounded-[45px] shadow-sm border border-gray-50 flex flex-col items-center">
          <p className="text-[11px] font-black text-[#1B254B] mb-8 uppercase tracking-[0.3em] border-b border-gray-50 pb-4 w-full text-center">Pending Tasks</p>
          <div className="relative flex items-center justify-center p-3 rounded-full border-[10px] border-gray-50 shadow-inner">
              <svg className="w-44 h-44 transform -rotate-90">
                <circle cx="88" cy="88" r="76" stroke="#F4F7FE" strokeWidth="18" fill="transparent" />
                <circle 
                  cx="88" cy="88" r="76" 
                  stroke="#4318FF" strokeWidth="18" 
                  fill="transparent" 
                  strokeDasharray="477.52" 
                  strokeDashoffset={homeworksList.length === 0 ? "477.52" : "100"} 
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out shadow-2xl"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <span className="text-4xl font-black text-[#1B254B] tracking-tighter italic">{homeworksList.length}</span>
                 <span className="text-[10px] font-black text-gray-400 uppercase">Tasks</span>
              </div>
           </div>
        </div>

        {/* GUIDELINES */}
        <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100">
          <h4 className="text-[11px] font-black text-[#1B254B] uppercase mb-8 tracking-[0.2em] text-center border-b pb-4">Submission Protocol</h4>
          <div className="space-y-6">
            <div className="p-8 bg-[#F4F7FE] rounded-[35px] border border-[#4318FF]/5 relative overflow-hidden">
                <p className="relative z-10 text-[11px] font-bold text-[#A3AED0] leading-relaxed uppercase tracking-tight text-center">
                    All digital files must be strictly in <span className="text-[#4318FF] font-black tracking-normal">PDF format</span>. Late entries result in a 20% mark reduction.
                </p>
                <div className="absolute left-2 top-2 opacity-5 font-black text-6xl">!</div>
            </div>
            <div className="flex items-center justify-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-500 shadow-sm"><Icons.Check /></div>
                <p className="text-[9px] font-black text-[#1B254B] uppercase tracking-widest leading-tight">Digital confirmation provided upon entry.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentHomeworks;
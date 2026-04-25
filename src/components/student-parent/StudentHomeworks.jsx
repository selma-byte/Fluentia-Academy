import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

const Icons = {
  Upload: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>,
  File: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>,
  ArrowLeft: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>,
  Check: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>,
  Download: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>,
  Info: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12.01" y2="8"></line></svg>
};

const StudentHomeworks = () => {
  const [currentView, setCurrentView] = useState('list');
  const [selectedHomework, setSelectedHomework] = useState(null);

  // 💡 Database States - STRICTLY PRESERVED
  const [studentClass, setStudentClass] = useState('');
  const [studentLevel, setStudentLevel] = useState('');
  const [homeworksList, setHomeworksList] = useState([]);
  const [loading, setLoading] = useState(true);

  // 💡 Database Logic - STRICTLY PRESERVED
  useEffect(() => {
    const fetchHomeworks = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: studentData } = await supabase
          .from('students')
          .select('group_name, level')
          .eq('email', user.email)
          .single();

        if (studentData && studentData.group_name) {
          setStudentClass(studentData.group_name);
          setStudentLevel(studentData.level || 'Unknown Level');

          const { data: hwData } = await supabase
            .from('homeworks')
            .select('*')
            .eq('class_name', studentData.group_name)
            .order('created_at', { ascending: false });

          if (hwData) {
            const formattedHw = hwData.map((hw, index) => {
              const status = "Not Submitted"; 
              const isCompleted = status === "Completed";
              const borderColors = ["border-orange-400", "border-[#4318FF]", "border-purple-400", "border-emerald-400"];
              
              return {
                id: hw.id,
                title: hw.title,
                level: studentData.level,
                task: hw.description || "Review material",
                due: "Pending Date", 
                status: status,
                statusColor: isCompleted ? "text-emerald-500 bg-emerald-50" : "text-orange-500 bg-orange-50",
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
    return <div className="flex-1 flex items-center justify-center py-20"><p className="font-black text-[11px] text-[#A3AED0] animate-pulse uppercase tracking-[0.3em]">Synchronizing Assignments...</p></div>;
  }

  // --- LEVEL 2: SUBMISSION OR FEEDBACK VIEW ---
  if (currentView !== 'list') {
    return (
      <div className="flex-1 flex flex-col animate-fadeIn pr-2 pb-8">
        <div className="w-full max-w-2xl bg-white p-10 rounded-[30px] shadow-sm border border-gray-100 mx-auto">
          <button 
            onClick={() => setCurrentView('list')} 
            className="group text-[#A3AED0] text-[11px] mb-8 hover:text-[#4318FF] flex items-center gap-2 font-black transition-all"
          >
            <Icons.ArrowLeft /> Back to assignments
          </button>
          
          <div className="mb-8">
            <h2 className="text-2xl font-black text-[#1B254B] mb-2">Assignment Submission</h2>
            <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-[#F4F7FE] text-[#4318FF] text-[10px] font-black rounded-lg uppercase tracking-tight border border-[#4318FF]/10">
                    {selectedHomework?.title}
                </span>
                <span className="text-[11px] text-[#A3AED0] font-bold uppercase">Date: {selectedHomework?.date}</span>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-[20px] mb-8 border border-gray-100">
            <h4 className="text-[11px] font-black text-[#1B254B] uppercase mb-2 opacity-50">Instructions:</h4>
            <p className="text-[14px] text-gray-600 font-medium leading-relaxed">{selectedHomework?.task}</p>
            
            {selectedHomework?.file_url && (
              <a 
                href={selectedHomework.file_url} 
                target="_blank" 
                rel="noreferrer"
                className="mt-5 inline-flex items-center gap-2 bg-white border border-gray-200 text-[#4318FF] px-5 py-2 rounded-xl text-[11px] font-black hover:bg-white transition-all shadow-sm active:scale-95"
              >
                <Icons.Download /> Teacher's attachment
              </a>
            )}
          </div>

          {currentView === 'submit' ? (
            <div className="space-y-6">
              <div className="border-2 border-dashed border-[#F4F7FE] rounded-[25px] p-12 text-center hover:border-[#4318FF]/20 hover:bg-[#F4F7FE]/30 transition-all cursor-pointer group">
                <div className="bg-[#4318FF] text-white w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform">
                    <Icons.Upload />
                </div>
                <p className="text-sm font-black text-[#1B254B] mb-1">Select files to upload</p>
                <p className="text-[10px] font-bold text-[#A3AED0] uppercase opacity-60">PDF, DOCX OR ZIP (MAX 10MB)</p>
              </div>
              <button className="w-full bg-[#111C44] text-white font-black py-4 rounded-[20px] shadow-lg hover:bg-black transition-all text-[11px] uppercase tracking-widest active:scale-95">
                Submit module materials
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-[#F4F7FE] p-8 rounded-[25px] border border-gray-100 relative overflow-hidden">
                <h4 className="font-black text-[#1B254B] text-[10px] mb-4 uppercase opacity-40">Instructor Feedback</h4>
                <p className="text-[#1B254B] leading-relaxed italic text-[15px] font-bold mb-6">
                  "Great job on the syntax analysis. Your work meets B2 proficiency standards."
                </p>
                <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                  <span className="font-black text-[#A3AED0] text-[10px] uppercase">Validated Mark</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-[#01B574] font-black text-3xl italic">18</span>
                    <span className="text-[#A3AED0] font-black text-sm">/20</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- LIST VIEW ---
  return (
    <div className="flex-1 flex flex-col xl:flex-row gap-8 animate-fadeIn pr-2 pb-8">
      
      <div className="flex-1 flex flex-col space-y-6 min-w-0">
        {/* MATCHES "MY LEARNING PATH" TYPOGRAPHY */}
        <div className="flex flex-col space-y-1 px-1">
          <h2 className="text-2xl font-black text-[#1B254B]">Assignment Hub</h2>
          <p className="text-[#A3AED0] text-[14px] font-medium leading-relaxed">
            Track and manage tasks for curriculum <span className="font-bold">[{studentClass}]</span>.
          </p>
        </div>

        {homeworksList.length === 0 ? (
          <div className="bg-white rounded-[25px] p-16 text-center border border-gray-100 shadow-sm flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300 mb-4 shadow-inner"><Icons.Info /></div>
              <h3 className="text-[16px] font-black text-[#1B254B] mb-1">Queue Empty</h3>
              <p className="text-[13px] text-gray-500 font-medium">No homework has been assigned to this group yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {homeworksList.map((hw) => (
              <div key={hw.id} className={`bg-white p-8 rounded-[35px] border-l-[10px] ${hw.border} shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-between group active:scale-95 cursor-pointer`} onClick={() => openAction(hw)}>
                <div className="space-y-5">
                  <div className="flex justify-between items-start">
                    <h3 className="font-black text-[#1B254B] text-[15px] group-hover:text-[#4318FF] transition-colors leading-tight">{hw.title}</h3>
                    <span className={`text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-tight shadow-sm ${hw.statusColor}`}>{hw.status}</span>
                  </div>
                  <div className="space-y-4">
                    <p className="text-[13px] text-[#A3AED0] font-bold uppercase tracking-tight leading-relaxed line-clamp-2">
                        Task: <span className="text-[#1B254B] font-black lowercase">{hw.task}</span>
                    </p>
                    <div className="flex items-center gap-5 border-t border-gray-50 pt-5">
                      <p className="text-[10px] font-black text-[#4318FF] uppercase tracking-widest flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#4318FF]"></span>
                          {hw.date}
                      </p>
                      <p className="text-[10px] font-black text-[#A3AED0] uppercase tracking-widest opacity-60 italic">{hw.level} Track</p>
                    </div>
                  </div>
                </div>
                <button className="text-[#4318FF] text-[11px] font-black uppercase text-left hover:underline mt-8 flex items-center gap-2">
                  {hw.status === "Completed" ? "View assessment" : "Open task"} →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT SIDEBAR - MATCHED TO 320px (DASHBOARD/LEARNING STYLE) */}
      <aside className="w-full xl:w-[320px] shrink-0 flex flex-col space-y-8">
        
        <div className="bg-white p-8 rounded-[30px] shadow-sm border border-gray-100 flex flex-col items-center">
          <h3 className="font-black text-[#1B254B] uppercase tracking-widest text-[11px] mb-10 w-full text-center border-b border-gray-50 pb-4 italic">Module Load</h3>
          <div className="relative flex items-center justify-center h-40 w-40">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="80" cy="80" r="68" stroke="#F4F7FE" strokeWidth="14" fill="transparent" />
                <circle 
                  cx="80" cy="80" r="68" 
                  stroke="#4318FF" strokeWidth="14" 
                  fill="transparent" 
                  strokeDasharray="427.26" 
                  strokeDashoffset={homeworksList.length === 0 ? "427.26" : "200"} 
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out shadow-lg"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <span className="text-3xl font-black text-[#1B254B] italic leading-none">{homeworksList.length}</span>
                 <span className="text-[9px] font-black text-[#A3AED0] uppercase mt-1">Active Tasks</span>
              </div>
           </div>
        </div>

        <div className="bg-[#111C44] rounded-[35px] p-8 text-white relative overflow-hidden shadow-xl transition-all hover:bg-[#0B132B] group">
          <div className="relative z-10 text-center">
            <h4 className="text-xl font-black mb-1 uppercase tracking-tighter italic">Protocol</h4>
            <p className="text-white/50 text-[10px] font-black uppercase mb-8">Submission standards</p>
            <div className="p-5 bg-white/5 rounded-[25px] border border-white/10 backdrop-blur-md">
                <p className="text-[11px] font-bold text-white/80 leading-relaxed uppercase tracking-widest">
                  Files must be in PDF format. Late entries result in a mark reduction.
                </p>
            </div>
            <button className="w-full mt-6 py-3 bg-white text-[#1B254B] rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all shadow-2xl">
              Get support
            </button>
          </div>
          <div className="absolute -right-12 -bottom-12 opacity-5 font-black text-[180px] italic select-none">!</div>
        </div>
      </aside>

    </div>
  );
};

export default StudentHomeworks;
import React, { useState } from 'react';

const StudentHomeworks = () => {
  const [currentView, setCurrentView] = useState('list');
  const [selectedHomework, setSelectedHomework] = useState(null);

  const homeworks = [
    { id: 1, title: "English Communication", level: "B2", status: "Not Submitted", statusColor: "text-orange-500 bg-orange-50", border: "border-orange-200", task: "Oral Presentation – \"My Future Goals\"", due: "Feb 10, 2026" },
    { id: 2, title: "French Intermediate", level: "B1", status: "Completed", statusColor: "text-green-500 bg-green-50", border: "border-green-200", task: "Written Essay – \"Une journée mémorable\"", due: "Mar 5, 2026" },
    { id: 3, title: "Spanish Basics", level: "A2", status: "In Progress", statusColor: "text-purple-500 bg-purple-50", border: "border-purple-200", task: "Vocabulary Quiz – Unit 3", due: "Apr 15, 2026" },
    { id: 4, title: "German Beginner", level: "A1", status: "Not Submitted", statusColor: "text-orange-500 bg-orange-50", border: "border-orange-200", task: "Basic Dialogue Practice", due: "May 20, 2026" },
  ];

  const openAction = (hw) => {
    setSelectedHomework(hw);
    setCurrentView(hw.status === "Completed" ? 'details' : 'submit');
  };

  // --- SUBMISSION/DETAILS VIEW (Standardized for Dashboard Integration) ---
  if (currentView !== 'list') {
    return (
      <div className="flex-1 flex items-center justify-center p-8 animate-fadeIn">
        <div className="w-full max-w-2xl bg-white p-10 rounded-[30px] shadow-sm border border-gray-100">
          <button 
            onClick={() => setCurrentView('list')} 
            className="text-[#A3AED0] text-xs mb-6 hover:text-[#4318FF] flex items-center gap-2 font-bold transition-all"
          >
            <span className="text-lg">←</span> Back to Assignments
          </button>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#1B254B] mb-2">
              {currentView === 'submit' ? `Submit Assignment` : `Submission Review`}
            </h2>
            <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-[#F4F7FE] text-[#4318FF] text-[10px] font-bold rounded-full uppercase tracking-wider">
                    {selectedHomework?.title}
                </span>
                <span className="text-xs text-[#A3AED0] font-medium">Due: {selectedHomework?.due}</span>
            </div>
          </div>

          {currentView === 'submit' ? (
            <div className="space-y-6">
              <div className="border-2 border-dashed border-[#E0E5F2] rounded-[24px] p-16 text-center hover:bg-gray-50 transition-all cursor-pointer group">
                <div className="bg-[#F4F7FE] w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <span className="text-[#4318FF] text-xl font-bold">↑</span>
                </div>
                <p className="text-sm font-bold text-[#1B254B] mb-1">Upload your work</p>
                <p className="text-xs text-[#A3AED0]">PDF, DOCX or ZIP (Max 10MB)</p>
              </div>
              <button className="w-full bg-[#4318FF] text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-100 hover:bg-[#3311CC] transition-all text-sm">
                Confirm Submission
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-[#F4F7FE] p-6 rounded-[24px] border border-gray-100">
                <h4 className="font-bold text-[#1B254B] text-sm mb-3">Teacher's Feedback</h4>
                <p className="text-[#A3AED0] leading-relaxed italic text-sm">
                  "Excellent understanding of the topic. Your structure was clear and the vocabulary used was appropriate. Keep up the great work!"
                </p>
                <div className="mt-6 pt-5 border-t border-gray-200 flex justify-between items-center">
                  <span className="font-bold text-[#1B254B] text-sm uppercase">Final Grade</span>
                  <span className="text-green-500 font-black text-2xl">18/20</span>
                </div>
              </div>
              <button className="w-full py-3 border border-gray-200 rounded-xl text-xs font-bold text-[#1B254B] hover:bg-gray-50 transition-colors">
                Download Submitted File
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col xl:flex-row gap-6 animate-fadeIn">
      
      {/* LEFT SIDE: Homework List */}
      <div className="flex-1 flex flex-col space-y-6">
        
        {/* Sync with Dashboard Hero Card Style */}
        <div className="bg-[#EBE9F1] rounded-[30px] p-8 flex justify-between items-center relative overflow-hidden h-[180px] shadow-sm">
          <div className="z-10 w-2/3">
            <h2 className="text-2xl font-bold text-[#1B254B] mb-2 leading-tight">Homework & Assignments</h2>
            <p className="text-[#A3AED0] text-[13px] mb-5 leading-relaxed">
              Track your pending tasks and review grades. Meeting deadlines is the key to your success.
            </p>
            <button className="bg-[#111C44] text-white px-5 py-2 rounded-lg text-sm font-bold flex items-center hover:bg-black transition-all">
              Full Overview <span className="ml-2">→</span>
            </button>
          </div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/40 p-4 rounded-full backdrop-blur-sm border border-white/50">
             <span className="text-3xl">✍️</span>
          </div>
        </div>

        {/* Homework Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-5">
          {homeworks.map((hw) => (
            <div key={hw.id} className={`bg-white p-5 rounded-[24px] border-t-[5px] ${hw.border} shadow-sm hover:shadow-md transition-all flex flex-col justify-between min-h-[190px]`}>
              <div>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-[#1B254B] text-[13px] leading-tight">{hw.title}</h3>
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-md ${hw.statusColor}`}>{hw.status}</span>
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] text-[#A3AED0] font-medium leading-snug">
                     <span className="font-bold">Task:</span> <span className="text-[#1B254B]">{hw.task}</span>
                  </p>
                  <p className="text-[10px] text-[#A3AED0] font-bold">Due: {hw.due}</p>
                </div>
              </div>
              
              <button 
                onClick={() => openAction(hw)}
                className="text-[#4318FF] text-[11px] font-bold text-left hover:underline mt-4 flex items-center gap-1 group"
              >
                {hw.status === "Completed" ? "View Submission" : "Submit Assignment"}
                <span className="text-lg transition-transform group-hover:translate-x-1">›</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT SIDE: Sidebar (Precisely Aligned with Dashboard & Schedule) */}
      <div className="w-full xl:w-[320px] shrink-0 flex flex-col space-y-6">
        <div className="text-right text-xs font-bold text-[#A3AED0]">Tuesday, 14 Apr 2026</div>

        {/* Semester Progress Card */}
        <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-50">
          <p className="text-[10px] font-bold text-[#1B254B] mb-2 uppercase tracking-widest">Semester Progress</p>
          <div className="h-2 w-full bg-[#F4F7FE] rounded-full overflow-hidden">
            <div className="h-full bg-[#4318FF] w-[37%] rounded-full shadow-[0_0_8px_rgba(67,24,255,0.3)]"></div>
          </div>
        </div>

        {/* Calendar Widget (Matched Size and Font Hierarchy) */}
        <div className="bg-white border border-gray-50 rounded-[20px] p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4 font-bold text-sm text-[#1B254B]">
            <button className="hover:text-[#4318FF] transition-colors">{'<'}</button> 
            <span>April 2026</span> 
            <button className="hover:text-[#4318FF] transition-colors">{'>'}</button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-[#A3AED0] font-bold mb-3 uppercase">
            {['Mo','Tu','We','Th','Fr','Sa','Su'].map(d => <div key={d}>{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-y-2 text-center text-[13px] font-bold text-[#1B254B]">
            {[...Array(30)].map((_, i) => (
              <div 
                key={i} 
                className={i+1 === 12 
                  ? "bg-[#4318FF] text-white rounded-full w-7 h-7 flex items-center justify-center mx-auto shadow-md" 
                  : "py-1 hover:text-[#4318FF] cursor-pointer"
                }
              >
                {i+1}
              </div>
            ))}
          </div>
        </div>

        {/* Submission Info Box */}
        <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-50">
          <h4 className="text-[11px] font-bold text-[#1B254B] uppercase mb-4 tracking-wider">Submission Guidelines</h4>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.4)]"></div>
              <span className="text-[11px] font-bold text-[#1B254B]">2 Missing Submissions</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-[10px] text-[#A3AED0] leading-relaxed">
                Files must be in <span className="font-bold">PDF format</span> unless specified. Late submissions may affect your final grade.
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default StudentHomeworks;
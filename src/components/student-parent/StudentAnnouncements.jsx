import React, { useState } from 'react';

const Icons = {
  Calendar: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>,
  User: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>,
  ArrowLeft: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>,
  Megaphone: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a3 3 0 0 0-3-3H5a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h10a3 3 0 0 0 3-3V8z"></path><path d="M10 12v3a3 3 0 0 0 3 3h6a2 2 0 0 0 2-2v-2"></path><path d="M10 18v2a2 2 0 0 0 2 2h3a2 2 0 0 0 2-2v-2"></path></svg>
};

const StudentAnnouncements = () => {
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [announcements] = useState([
    { 
      id: 1, 
      type: 'Event', 
      date: 'Oct 25, 2026', 
      title: 'Winter Festival Planning Meeting', 
      content: "We're organizing our annual Winter Festival! Teachers and staff interested in helping with planning, please join us this Thursday at 4 PM in the staff room. Agenda includes catering, decoration themes, and student performance schedules.", 
      author: 'Academic Admin' 
    },
    { 
      id: 2, 
      type: 'Reminder', 
      date: 'Oct 26, 2026', 
      title: 'Course Submission Deadline', 
      content: 'Final notice: All proficiency modules for B2 English tracks are due this Friday. Please ensure all digital portfolios are uploaded to the secure portal before the server lockout at 3 PM.', 
      author: 'Language Dept' 
    },
    { 
      id: 3, 
      type: 'General', 
      date: 'Oct 27, 2026', 
      title: 'Library Resource Expansion', 
      content: "The digital repository has been expanded with 150 new language learning resources. Access to Danish, French, and Spanish literature is now available via the Media Hub.", 
      author: 'Library Services' 
    },
    { 
      id: 4, 
      type: 'Urgent', 
      date: 'Oct 29, 2026', 
      title: 'Campus Portal Maintenance', 
      content: 'Critical: The learning management system will undergo scheduled maintenance tonight. Expect intermittent downtime between 11 PM and 2 AM. All online classrooms remain unaffected.', 
      author: 'IT Support' 
    }
  ]);

  const getTagStyle = (type) => {
    switch (type) {
      case 'Event': return 'bg-[#e6fbf2] text-[#00a65e] border-[#00a65e]/10';
      case 'Reminder': return 'bg-[#fff8e6] text-[#f5a623] border-[#f5a623]/10';
      case 'Urgent': return 'bg-[#fdeaea] text-[#e02424] border-[#e02424]/10';
      case 'General': default: return 'bg-[#eef2ff] text-[#4318FF] border-[#4318FF]/10';
    }
  };

  // --- FULL NOTICE VIEW ---
  if (selectedNotice) {
    return (
      <div className="flex-1 flex flex-col space-y-8 animate-fadeIn pb-12">
        <button 
          onClick={() => setSelectedNotice(null)} 
          className="group text-[#A3AED0] text-xs hover:text-[#4318FF] flex items-center gap-3 font-black uppercase tracking-[0.2em] transition-all w-fit"
        >
          <div className="bg-white p-2 rounded-lg shadow-sm group-hover:shadow-md transition-all"><Icons.ArrowLeft /></div>
          Back to Bulletins
        </button>
        
        <div className="bg-white rounded-[45px] p-12 shadow-sm border border-gray-100 max-w-4xl">
            <div className="flex justify-between items-center mb-10">
                <span className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${getTagStyle(selectedNotice.type)}`}>
                    {selectedNotice.type}
                </span>
                <p className="text-[11px] font-black text-[#A3AED0] uppercase tracking-widest flex items-center gap-2">
                    <Icons.Calendar /> Published: {selectedNotice.date}
                </p>
            </div>
            
            <h2 className="text-4xl font-black text-[#1B254B] uppercase tracking-tighter mb-8 leading-tight">{selectedNotice.title}</h2>
            
            <div className="p-8 bg-[#F4F7FE] rounded-[35px] border border-gray-100 mb-10">
                <p className="text-[#1B254B] text-lg leading-relaxed font-bold italic opacity-80">
                    "{selectedNotice.content}"
                </p>
            </div>

            <div className="flex items-center justify-between pt-8 border-t border-gray-50">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#4318FF] flex items-center justify-center text-white font-black shadow-lg">
                        {selectedNotice.author.charAt(0)}
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-[#A3AED0] uppercase tracking-widest">Authorized By</p>
                        <p className="text-[13px] font-black text-[#1B254B] uppercase">{selectedNotice.author}</p>
                    </div>
                </div>
                <button className="bg-[#111C44] text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all">
                    Acknowledge Notice
                </button>
            </div>
        </div>
      </div>
    );
  }

  // --- ANNOUNCEMENT GRID VIEW ---
  return (
    <div className="flex-1 flex flex-col space-y-10 animate-fadeIn pb-12">
      
      {/* HEADER HERO */}
      <div className="bg-[#EBE9F1] rounded-[45px] p-12 flex justify-between items-center relative overflow-hidden min-h-[220px] shadow-sm">
        <div className="z-10 w-full md:w-3/5">
          <h2 className="text-3xl font-black text-[#1B254B] mb-4 uppercase tracking-tighter">Academic Bulletins</h2>
          <p className="text-[#1B254B]/60 text-sm mb-8 leading-relaxed font-bold uppercase tracking-widest opacity-70">
            Official communications, event schedules, and critical administrative updates from the Fluentia Academic Board.
          </p>
          <div className="bg-[#4318FF] text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] w-fit shadow-xl">
             Latest Update: Today
          </div>
        </div>
        <div className="absolute right-[-20px] bottom-[-20px] opacity-10 text-[260px] font-black pointer-events-none select-none italic">N</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pr-2">
        {announcements.map((ann) => (
          <div 
            key={ann.id} 
            onClick={() => setSelectedNotice(ann)}
            className="bg-white border border-gray-50 rounded-[40px] p-8 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col group cursor-pointer active:scale-95"
          >
            <div className="flex justify-between items-center mb-6">
              <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm ${getTagStyle(ann.type)}`}>
                {ann.type}
              </span>
              <span className="text-[10px] text-[#A3AED0] font-black uppercase tracking-widest flex items-center gap-2">
                <Icons.Calendar /> {ann.date}
              </span>
            </div>
            
            <h3 className="font-black text-[#1B254B] text-[19px] mb-4 uppercase tracking-tight leading-tight group-hover:text-[#4318FF] transition-colors">{ann.title}</h3>
            <p className="text-sm text-[#707EAE] mb-8 flex-1 line-clamp-3 leading-relaxed font-medium uppercase tracking-tight opacity-80">
              {ann.content}
            </p>
            
            <div className="flex items-center justify-between pt-6 border-t border-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F4F7FE] flex items-center justify-center text-[11px] font-black text-[#4318FF] shadow-inner group-hover:bg-[#4318FF] group-hover:text-white transition-all">
                   <Icons.User />
                </div>
                <span className="text-[10px] font-black text-[#1B254B] uppercase tracking-widest">{ann.author}</span>
              </div>
              <div className="text-[#4318FF] text-[11px] font-black uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                  Read Full Notice →
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentAnnouncements;
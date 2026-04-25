import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

const Icons = {
  Calendar: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>,
  User: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>,
  ArrowLeft: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>,
  Megaphone: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a3 3 0 0 0-3-3H5a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h10a3 3 0 0 0 3-3V8z"></path><path d="M10 12v3a3 3 0 0 0 3 3h6a2 2 0 0 0 2-2v-2"></path><path d="M10 18v2a2 2 0 0 0 2 2h3a2 2 0 0 0 2-2v-2"></path></svg>,
  Info: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
};

const StudentAnnouncements = () => {
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // 💡 Database Logic - STRICTLY PRESERVED
  // ==========================================
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: commsData, error } = await supabase
          .from('communications')
          .select('*')
          .in('type', ['announcement', 'notification', 'emergency'])
          .order('created_at', { ascending: false });

        if (commsData) {
          const myNotifs = commsData.filter(c => {
            const target = c.recipient_name?.toLowerCase() || '';
            return target.includes('students') || target.includes('all community') || target.includes('all');
          });

          const formatted = myNotifs.map(notif => {
            let uiType = 'General';
            if (notif.type === 'emergency') uiType = 'Urgent';
            if (notif.type === 'notification') uiType = 'Reminder';

            return {
              id: notif.id,
              type: uiType,
              date: new Date(notif.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
              title: notif.subject || 'Official Notice',
              content: notif.content,
              author: notif.sender_name || 'Administration'
            };
          });

          setAnnouncements(formatted);
        }
      } catch (err) {
        console.error("Error fetching announcements:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const getTagStyle = (type) => {
    switch (type) {
      case 'Event': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Reminder': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Urgent': return 'bg-red-50 text-red-600 border-red-100';
      case 'General': default: return 'bg-indigo-50 text-[#4318FF] border-indigo-100';
    }
  };

  // --- FULL NOTICE VIEW ---
  if (selectedNotice) {
    return (
      <div className="flex-1 flex flex-col space-y-6 animate-fadeIn pr-2 pb-12">
        <button 
          onClick={() => setSelectedNotice(null)} 
          className="group text-[#A3AED0] text-[11px] hover:text-[#4318FF] flex items-center gap-2 font-black uppercase tracking-widest transition-all w-fit px-1"
        >
          <Icons.ArrowLeft /> Return to Bulletins
        </button>
        
        <div className="bg-white rounded-[30px] p-10 shadow-sm border border-gray-100 max-w-4xl">
            <div className="flex justify-between items-center mb-8 border-b border-gray-50 pb-6">
                <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border shadow-sm ${getTagStyle(selectedNotice.type)}`}>
                    {selectedNotice.type}
                </span>
                <p className="text-[11px] font-black text-[#A3AED0] uppercase tracking-widest flex items-center gap-2">
                    <Icons.Calendar /> Published: {selectedNotice.date}
                </p>
            </div>
            
            <h2 className="text-2xl font-black text-[#1B254B] italic tracking-tight mb-8 leading-tight">{selectedNotice.title}</h2>
            
            <div className="p-8 bg-[#F4F7FE]/50 rounded-[25px] border border-gray-50 mb-10">
                <p className="text-[#1B254B] text-[15px] leading-relaxed font-medium italic opacity-90 whitespace-pre-wrap">
                    "{selectedNotice.content}"
                </p>
            </div>

            <div className="flex items-center justify-between pt-8 border-t border-gray-100">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#4318FF] flex items-center justify-center text-white font-black shadow-lg shadow-blue-200">
                        {selectedNotice.author.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="text-[9px] font-black text-[#A3AED0] uppercase tracking-[0.2em]">Authorized By</p>
                        <p className="text-[13px] font-black text-[#1B254B] uppercase italic">{selectedNotice.author}</p>
                    </div>
                </div>
                <button 
                  onClick={() => setSelectedNotice(null)}
                  className="bg-[#111C44] text-white px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-xl"
                >
                    Acknowledge
                </button>
            </div>
        </div>
      </div>
    );
  }

  // --- LIST VIEW ---
  return (
    <div className="flex-1 flex flex-col xl:flex-row gap-6 animate-fadeIn pr-2 pb-12">
      
      <div className="flex-1 flex flex-col space-y-6 min-w-0">
        <div className="flex flex-col space-y-1 px-1">
          <h2 className="text-xl font-black text-[#1B254B] italic tracking-tight">Academic Bulletins</h2>
          <p className="text-[#A3AED0] text-[13px] font-medium leading-relaxed">
            Official communications and critical administrative updates from the board.
          </p>
        </div>

        {loading ? (
            <div className="py-20 text-center font-black text-[#A3AED0] text-[11px] animate-pulse uppercase tracking-[0.3em]">Syncing Bulletins...</div>
        ) : announcements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {announcements.map((ann) => (
              <div 
                key={ann.id} 
                onClick={() => setSelectedNotice(ann)}
                className="bg-white border border-gray-100 rounded-[30px] p-8 shadow-sm hover:shadow-lg transition-all duration-500 flex flex-col group cursor-pointer active:scale-95"
              >
                <div className="flex justify-between items-center mb-6">
                  <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border shadow-sm ${getTagStyle(ann.type)}`}>
                    {ann.type}
                  </span>
                  <span className="text-[10px] text-[#A3AED0] font-black uppercase tracking-widest flex items-center gap-2 italic">
                    <Icons.Calendar /> {ann.date}
                  </span>
                </div>
                
                <h3 className="font-black text-[#1B254B] text-[16px] mb-4 leading-tight group-hover:text-[#4318FF] transition-colors italic tracking-tight">{ann.title}</h3>
                <p className="text-[13px] text-[#707EAE] mb-8 flex-1 line-clamp-2 leading-relaxed font-medium">
                  {ann.content}
                </p>
                
                <div className="flex items-center justify-between pt-5 border-t border-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#F4F7FE] flex items-center justify-center text-[10px] font-black text-[#4318FF] shadow-inner group-hover:bg-[#4318FF] group-hover:text-white transition-all">
                       <Icons.User />
                    </div>
                    <span className="text-[9px] font-black text-[#1B254B] uppercase tracking-widest">{ann.author}</span>
                  </div>
                  <div className="text-[#4318FF] text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                    Details →
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-[25px] p-20 text-center shadow-sm flex flex-col items-center">
             <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-300 mb-4"><Icons.Info /></div>
             <p className="text-[#A3AED0] font-black uppercase tracking-widest text-[11px]">No active bulletins found.</p>
          </div>
        )}
      </div>

      {/* RIGHT SIDEBAR - MATCHED TO DASHBOARD 280px */}
      <aside className="w-full xl:w-[280px] shrink-0 flex flex-col space-y-6">
        
        <div className="bg-white p-6 rounded-[25px] shadow-sm border border-gray-100 flex flex-col items-center">
          <p className="text-[10px] font-black text-[#1B254B] mb-5 uppercase tracking-widest border-b border-gray-50 pb-3 italic w-full text-center">Status Update</p>
          <div className="bg-[#4318FF] text-white px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-blue-100">
             Latest check: Today
          </div>
        </div>

        <div className="bg-[#111C44] rounded-[25px] p-8 text-white relative overflow-hidden shadow-xl transition-all hover:bg-[#0B132B] group">
          <div className="relative z-10 text-center">
            <h4 className="text-lg font-black mb-1 uppercase tracking-tighter italic">Protocols</h4>
            <p className="text-white/50 text-[9px] font-black uppercase mb-8">Board Directives</p>
            <div className="p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-md">
                <p className="text-[10px] font-bold text-white/80 leading-relaxed uppercase tracking-widest">
                  Ensure all digital portfolios are synchronized with the secure portal daily.
                </p>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 opacity-5 font-black text-[140px] italic select-none group-hover:scale-110 transition-transform duration-700">!</div>
        </div>
      </aside>

    </div>
  );
};

export default StudentAnnouncements;
import React, { useState } from 'react';

const Topbar = ({ setActiveTab }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [hasUnread, setHasUnread] = useState(true);
  
  const toggleDropdown = (e, name) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const handleLogout = () => {
    setActiveDropdown(null);
    if (setActiveTab) setActiveTab('Landing'); 
  };

  const markAllAsRead = (e) => {
    e.stopPropagation();
    setHasUnread(false);
    setActiveDropdown(null);
  };

  // Logic: Change tab to Dashboard and close the dropdown
  const goToNotificationCenter = () => {
    setActiveTab('ADMIN Dashboard');
    setActiveDropdown(null);
    
    // Optional: Smooth scroll to the notification section
    setTimeout(() => {
      const element = document.getElementById('notification-section');
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="w-full h-20 bg-white border-b border-gray-100 px-8 flex items-center justify-between sticky top-0 z-50 shadow-sm font-sans italic font-bold">
      
      <div className="flex items-center">
        <h2 className="text-gray-400 text-sm tracking-widest uppercase">Smansys Management System</h2>
      </div>

      <div className="flex items-center space-x-3 relative">
        
        <div className="relative">
          <button 
            onClick={(e) => toggleDropdown(e, 'notifications')} 
            className={`w-11 h-11 rounded-full flex items-center justify-center text-2xl relative transition-all ${activeDropdown === 'notifications' ? 'bg-red-50 text-red-600 shadow-inner' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            🔔 {hasUnread && <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>}
          </button>

          {activeDropdown === 'notifications' && (
            <div className="absolute top-14 right-0 w-[26rem] bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden z-[60] text-right">
              <div className="p-4 bg-gray-50/80 border-b border-gray-100 flex justify-between items-center italic font-bold">
                <button onClick={markAllAsRead} className="text-[10px] text-blue-600 hover:underline uppercase cursor-pointer">Mark all read</button>
                <h3 className="text-[#0A1128]">Notifications / الإشعارات</h3>
              </div>
              
              <div className="max-h-[450px] overflow-y-auto italic font-bold">
                {/* Modified to trigger the redirection logic */}
                <div onClick={goToNotificationCenter} className="p-4 border-b border-gray-50 hover:bg-red-50/40 cursor-pointer flex items-start space-x-3 transition-all text-left">
                  <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0">⚠️</div>
                  <div className="flex-1 pl-3">
                    <p className="text-sm font-bold text-[#0A1128]">Attendance Alert</p>
                    <p className="text-[11px] text-gray-500 mt-1">Omar El Khalil has been absent for 3 sessions.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="h-8 w-px bg-gray-100 mx-2"></div>

        <div className="relative">
          <div onClick={(e) => toggleDropdown(e, 'profile')} className="flex items-center space-x-3 pl-2 group cursor-pointer italic font-bold">
            <div className="text-right">
              <p className="text-sm text-[#1A2252]">Malak</p>
              <p className="text-[10px] text-gray-400 font-black">SUPER ADMIN</p>
            </div>
            <div className="w-11 h-11 rounded-full bg-[#1A2252] text-white flex items-center justify-center shadow-lg border-2 border-indigo-100 transition-transform group-hover:scale-105">MA</div>
          </div>
          
          {activeDropdown === 'profile' && (
            <div className="absolute top-14 right-0 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[60] font-bold italic">
              <button 
                onClick={handleLogout} 
                className="w-full p-5 text-sm font-black text-red-600 hover:bg-red-50 flex justify-between items-center transition-colors"
              >
                <span>LOG OUT</span>
                <span>🚪</span>
              </button>
            </div>
          )}
        </div>
      </div>
      
      {activeDropdown && <div className="fixed inset-0 z-[55] bg-transparent" onClick={() => setActiveDropdown(null)}></div>}
    </div>
  );
};

export default Topbar;
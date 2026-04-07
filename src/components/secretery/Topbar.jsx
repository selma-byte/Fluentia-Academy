import React, { useState } from 'react';

const Topbar = ({ setActiveTab }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [hasUnread, setHasUnread] = useState(true);
  
  // حالات النوافذ المنبثقة (Modals)
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  
  // بيانات الطالب المختار والتحكم في نوع المستلم
  const [selectedData, setSelectedData] = useState({ 
    name: '', amount: '', course: '', hasParent: true 
  });

  const toggleDropdown = (e, name) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const handleNavigation = (tabName) => {
    if (setActiveTab) setActiveTab(tabName);
    setActiveDropdown(null);
  };

  // --- دالة تسجيل الخروج الاحترافية (بدون Alert المزعج) ---
  const handleLogout = () => {
    setActiveDropdown(null); // يغلق القائمة المنسدلة
    if (setActiveTab) {
      setActiveTab('Landing'); // يوجهك لصفحة التعريف (Landing) التي فيها Login و Signin
    }
  };

  const markAllAsRead = (e) => {
    e.stopPropagation();
    setHasUnread(false);
    setActiveDropdown(null);
  };

  // --- تشغيل سيناريوهات الإشعارات الاحترافية ---
  const triggerAttendanceAlert = (name, hasParent = true) => {
    setSelectedData({ name, amount: '', course: '', hasParent });
    setIsAttendanceModalOpen(true);
    setActiveDropdown(null);
  };

  const triggerPaymentAlert = (name, amount, course, hasParent = false) => {
    setSelectedData({ name, amount, course, hasParent });
    setIsPaymentModalOpen(true);
    setActiveDropdown(null);
  };

  return (
    <div className="w-full h-20 bg-white border-b border-gray-100 px-8 flex items-center justify-between sticky top-0 z-50 shadow-sm font-sans italic font-bold">
      
      {/* 1. قسم البحث الذكي */}
      <div className="flex items-center">
        <div className="relative flex items-center w-96 font-bold italic">
          <span className="absolute left-4 text-gray-400 font-bold italic">🔍</span>
          <input 
            type="text" 
            placeholder="Search students, teachers, or invoices..." 
            className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-blue-500 rounded-full py-2.5 pl-12 pr-4 text-sm font-medium outline-none transition-all shadow-inner font-bold italic"
          />
        </div>
      </div>

      {/* 2. الأيقونات والملف الشخصي */}
      <div className="flex items-center space-x-3 relative">
        
        {/* صندوق الرسائل ✉️ */}
        <div className="relative">
          <button onClick={(e) => toggleDropdown(e, 'messages')} className={`w-11 h-11 rounded-full flex items-center justify-center text-2xl transition-all ${activeDropdown === 'messages' ? 'bg-blue-50 text-blue-600 shadow-inner' : 'text-gray-500 hover:bg-gray-50'}`}>✉️</button>
        </div>

        {/* قائمة الإشعارات الشاملة 🔔 (الـ 5 إشعارات كاملة) */}
        <div className="relative">
          <button onClick={(e) => toggleDropdown(e, 'notifications')} className={`w-11 h-11 rounded-full flex items-center justify-center text-2xl relative transition-all ${activeDropdown === 'notifications' ? 'bg-red-50 text-red-600 shadow-inner' : 'text-gray-500 hover:bg-gray-50'}`}>
            🔔 {hasUnread && <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>}
          </button>

          {activeDropdown === 'notifications' && (
            <div className="absolute top-14 right-0 w-[26rem] bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden z-[60] animate-in fade-in zoom-in duration-200 text-right">
              <div className="p-4 bg-gray-50/80 border-b border-gray-100 flex justify-between items-center italic font-bold">
                <button onClick={markAllAsRead} className="text-[10px] text-blue-600 hover:underline uppercase cursor-pointer italic font-bold">Mark all read</button>
                <h3 className="text-[#0A1128]">Notifications / الإشعارات</h3>
              </div>
              
              <div className="max-h-[450px] overflow-y-auto italic font-bold text-right">
                
                {/* إشعار 1: غياب متكرر */}
                <div onClick={() => triggerAttendanceAlert('عمر الخليل', true)} className="p-4 border-b border-gray-50 hover:bg-red-50/40 cursor-pointer flex items-start space-x-3 transition-all font-bold italic">
                  <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0">⚠️</div>
                  <div className="flex-1 font-bold italic">
                    <p className="text-sm font-bold text-[#0A1128]">غياب متكرر (Attendance)</p>
                    <p className="text-[11px] text-gray-500 mt-1 italic font-bold">عمر الخليل غائب لـ 3 حصص متتالية</p>
                    <span className="text-[8px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full mt-2 inline-block font-bold uppercase">Send alert →</span>
                  </div>
                </div>

                {/* إشعار 2: دفع متأخر */}
                <div onClick={() => triggerPaymentAlert('أمين بن علي', '4500 دج', 'English B1', false)} className="p-4 border-b border-gray-50 hover:bg-orange-50/40 cursor-pointer flex items-start space-x-3 transition-all">
                  <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110">💰</div>
                  <div className="flex-1 font-bold italic">
                    <p className="text-sm font-bold text-[#0A1128]">دفع متأخر (Late Payment)</p>
                    <p className="text-[11px] text-orange-600 mt-1 font-bold italic">طالب بدون ولي أمر (إرسال مباشر له)</p>
                  </div>
                </div>

                {/* إشعار 3: تأخر الأستاذ */}
                <div onClick={() => handleNavigation('Attendance Records')} className="p-4 border-b border-gray-50 hover:bg-orange-50/20 cursor-pointer flex items-start space-x-3 transition-all">
                  <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 text-sm">👨‍🏫</div>
                  <div className="flex-1 font-bold italic text-sm text-[#0A1128]">تأخر الأستاذ بن محمد (15د)</div>
                </div>

                {/* إشعار 4: تسجيل جديد */}
                <div onClick={() => handleNavigation('Student Records')} className="p-4 border-b border-gray-50 hover:bg-purple-50/20 cursor-pointer flex items-start space-x-3 transition-all">
                  <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 text-sm">📝</div>
                  <div className="flex-1 font-bold italic text-sm text-[#0A1128]">تسجيل طالب جديد في English A1</div>
                </div>

                {/* إشعار 5: نتائج جاهزة */}
                <div onClick={() => handleNavigation('Exams')} className="p-4 border-b border-gray-50 hover:bg-blue-50/20 cursor-pointer flex items-start space-x-3 transition-all">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 text-sm">🎓</div>
                  <div className="flex-1 font-bold italic text-sm text-[#0A1128]">نتائج جاهزة للمجموعة 4</div>
                </div>

              </div>
            </div>
          )}
        </div>

        <div className="h-8 w-px bg-gray-100 mx-2"></div>

        {/* --- 👤 ملف Marwa الشخصي مع تسجيل خروج سلس --- */}
        <div className="relative">
          <div onClick={(e) => toggleDropdown(e, 'profile')} className="flex items-center space-x-3 pl-2 group cursor-pointer italic font-bold">
            <div className="text-right italic font-bold">
              <p className="text-sm text-[#0A1128]">Marwa</p>
              <p className="text-[10px] text-gray-400">Secretary</p>
            </div>
            <div className="w-11 h-11 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg border-2 border-indigo-100 transition-transform group-hover:scale-105 italic font-bold text-sm">MA</div>
          </div>
          
          {activeDropdown === 'profile' && (
            <div className="absolute top-14 right-0 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[60] animate-in fade-in zoom-in duration-150 text-right font-bold italic">
              <button className="w-full p-4 text-[11px] font-bold text-gray-600 hover:bg-gray-50 text-right border-b border-gray-50 italic">ملفي الشخصي</button>
              <button 
                onClick={handleLogout} 
                className="w-full p-4 text-[11px] font-bold text-red-600 hover:bg-red-50 text-right flex justify-between items-center italic font-bold"
              >
                <span>خروج (Logout)</span> 🚪
              </button>
            </div>
          )}
        </div>
      </div>

      {/* --- 🔴 1. نافذة الغياب الاحترافية 🔴 --- */}
      {isAttendanceModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden text-right font-bold italic">
            <div className="p-6 bg-gradient-to-r from-red-600 to-red-500 text-white flex justify-between items-center italic font-bold">
              <button onClick={() => setIsAttendanceModalOpen(false)} className="text-2xl font-bold text-white hover:rotate-90 transition-transform duration-300 ease-in-out cursor-pointer">✕</button>
              <h3 className="text-lg font-bold text-white">تنبيه غياب (Attendance Alert)</h3>
            </div>
            <div className="p-6 italic font-bold">
              <div className="flex bg-gray-100 rounded-xl p-1 mb-6 border border-gray-200 font-bold italic">
                 <button 
                   type="button" 
                   onClick={(e) => { e.stopPropagation(); setSelectedData(prev => ({...prev, hasParent: false})); }}
                   className={`flex-1 py-2 text-[10px] rounded-lg transition-all font-bold italic ${!selectedData.hasParent ? 'bg-white shadow-md text-red-600' : 'text-gray-400'}`}
                 >الطالب مباشرة</button>
                 <button 
                   type="button" 
                   onClick={(e) => { e.stopPropagation(); setSelectedData(prev => ({...prev, hasParent: true})); }}
                   className={`flex-1 py-2 text-[10px] rounded-lg transition-all font-bold italic ${selectedData.hasParent ? 'bg-white shadow-md text-red-600' : 'text-gray-400'}`}
                 >ولي الأمر</button>
              </div>
              <p className="mb-4 text-xs font-bold italic">المستلم: <span className="text-red-600 font-black italic">{selectedData.hasParent ? `ولي أمر ${selectedData.name}` : selectedData.name}</span></p>
              <textarea 
                className="w-full h-28 bg-gray-50 rounded-2xl p-4 text-sm font-bold outline-none border border-transparent focus:border-red-500 text-right italic transition-all" 
                value={selectedData.hasParent ? `نحيطكم علماً بأن الطالب ${selectedData.name} قد تغيب عن 3 حصص متتالية. يرجى التبرير.` : `عزيزي الطالب ${selectedData.name}، نلاحظ غيابك المتكرر عن الحصص، يرجى مراجعة الإدارة.`} readOnly />
              <button onClick={() => { setIsAttendanceModalOpen(false); handleNavigation('Parent Portal'); }} className="w-full mt-6 py-4 bg-[#0A1128] text-white rounded-2xl text-xs font-bold shadow-lg italic hover:bg-gray-900 transition-colors">إرسال التنبيه 📲</button>
            </div>
          </div>
        </div>
      )}

      {/* --- 🔴 2. نافذة الدفع الاحترافية 🔴 --- */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden text-right font-bold italic">
            <div className="p-6 bg-gradient-to-r from-orange-600 to-orange-500 text-white flex justify-between items-center italic font-bold">
              <button onClick={() => setIsPaymentModalOpen(false)} className="text-2xl font-bold text-white hover:rotate-90 transition-transform duration-300 ease-in-out cursor-pointer">✕</button>
              <h3 className="text-lg font-bold text-white italic font-bold text-white">تذكير بالدفع (Payment)</h3>
            </div>
            <div className="p-6 italic font-bold">
              {!selectedData.hasParent && <div className="bg-orange-50 p-2 rounded-lg text-[9px] text-orange-700 mb-3 text-center italic font-bold">⚠️ تنبيه: طالب بدون ولي أمر مسجل. الإرسال له مباشرة.</div>}
              <div className="grid grid-cols-2 gap-2 mb-4 italic font-bold">
                <div className="bg-orange-50 p-3 rounded-xl border border-orange-100 text-[10px] font-bold text-orange-700 text-center italic font-bold italic">Course: {selectedData.course}</div>
                <div className="bg-orange-50 p-3 rounded-xl border border-orange-100 text-[10px] font-bold text-orange-700 text-center italic font-bold italic">Amount: {selectedData.amount}</div>
              </div>
              <textarea className="w-full h-24 bg-gray-50 rounded-2xl p-4 text-sm font-bold outline-none text-right italic font-bold border-orange-200 border" value={`نذكركم بسداد مبلغ ${selectedData.amount} الخاص بدورة ${selectedData.course}.`} readOnly />
              <button onClick={() => { setIsPaymentModalOpen(false); handleNavigation('Payment'); }} className="w-full mt-4 py-4 bg-orange-600 text-white rounded-2xl text-xs font-bold shadow-lg italic hover:bg-orange-700 transition-colors font-bold italic">إرسال المطالبة 💰</button>
            </div>
          </div>
        </div>
      )}

      {/* خلفية الإغلاق عند الضغط خارج القوائم */}
      {activeDropdown && <div className="fixed inset-0 z-[55] bg-transparent" onClick={() => setActiveDropdown(null)}></div>}
    </div>
  );
};

export default Topbar;
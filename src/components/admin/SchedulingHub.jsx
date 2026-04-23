import React, { useState } from 'react';

// 💡 هنا نعيطو للكومبوننتس في 3 (تأكدي برك من المسار Path ديالهم)
import Enrollment from '../secretery/Enrollment'; 
import SchoolSchedule from '../secretery/SchoolSchedule';
import Appointments from '../secretery/Appointments'; 

const SchedulingHub = () => {
  // بدينا بالـ enrollment كأول باجة تفتح
  const [mainTab, setMainTab] = useState('enrollment'); 

  return (
    <div className="animate-fade-in w-full h-full flex flex-col bg-gray-50/30">
      
      {/* 💡 النافذة العلوية للتبديل بين الصفحات في 3 */}
      <div className="px-8 pt-6 pb-4 shrink-0 flex justify-between items-end border-b border-gray-200 mb-6">
        <div>
          <h1 className="text-3xl font-black text-[#0A1128] tracking-tight mb-2">Scheduling & Management Hub</h1>
          <p className="text-sm text-gray-500 font-bold">Manage groups, class timetables, and private appointments</p>
        </div>
        
        <div className="flex bg-gray-200/50 p-1 rounded-xl">
          <button
            onClick={() => setMainTab('enrollment')}
            className={`px-6 py-3 rounded-lg text-sm font-bold transition-all shadow-sm cursor-pointer ${mainTab === 'enrollment' ? 'bg-white text-blue-600' : 'text-gray-500 hover:text-[#0A1128]'}`}
          >
            👥 Groups & Enrollment
          </button>
          <button
            onClick={() => setMainTab('classes')}
            className={`px-6 py-3 rounded-lg text-sm font-bold transition-all shadow-sm cursor-pointer ${mainTab === 'classes' ? 'bg-white text-blue-600' : 'text-gray-500 hover:text-[#0A1128]'}`}
          >
            🏫 Classes Timetable
          </button>
          <button
            onClick={() => setMainTab('appointments')}
            className={`px-6 py-3 rounded-lg text-sm font-bold transition-all shadow-sm cursor-pointer ${mainTab === 'appointments' ? 'bg-white text-blue-600' : 'text-gray-500 hover:text-[#0A1128]'}`}
          >
            📅 Appointments
          </button>
        </div>
      </div>

      {/* 💡 عرض الصفحة اللي خيرتيها */}
      <div className="flex-1 min-h-0 overflow-hidden relative px-8 pb-8">
        {mainTab === 'enrollment' && <Enrollment />}
        {mainTab === 'classes' && <SchoolSchedule />}
        {mainTab === 'appointments' && <Appointments />}
      </div>
      
    </div>
  );
};

export default SchedulingHub;
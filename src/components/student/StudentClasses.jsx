import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

const StudentCourses = () => {
  const [currentView, setCurrentView] = useState('list');
  const [selectedClass, setSelectedClass] = useState(null);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from('classes').select('*');
    
    const courseMockData = [
      { 
        name: "French Intermediate – B1", 
        rating: "4.8", 
        students: "22 Students", 
        schedule: "Tue & Thu 9:00 AM", 
        room: "Room 2", 
        img: "https://i.ibb.co/vxs497z/french.png" 
      },
      { 
        name: "German Beginner – A1", 
        rating: "4.5", 
        students: "27 Students", 
        schedule: "Wed 14:00 PM", 
        room: "Room 14", 
        img: "https://i.ibb.co/0Ym6V0p/german.png" 
      },
      { 
        name: "English Communication – B2", 
        rating: "4.9", 
        students: "30 Students", 
        schedule: "Mon & Wed 9:00 AM", 
        room: "Room 3", 
        img: "https://i.ibb.co/S6D6m4z/english.png" 
      }
    ];

    if (data && data.length > 0) {
      setClasses(data.map((c, i) => ({ 
        ...c, 
        ...courseMockData[i % courseMockData.length] 
      })));
    } else {
      setClasses(courseMockData);
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  if (currentView !== 'list') {
    return (
      <div className="flex-1 p-8 animate-fadeIn">
        <button 
          onClick={() => setCurrentView('list')} 
          className="text-[#A3AED0] text-xs mb-6 hover:text-[#4318FF] flex items-center gap-2 font-bold transition-all"
        >
          <span className="text-lg">←</span> Back to My Courses
        </button>
        <div className="bg-white rounded-[30px] p-10 shadow-sm border border-gray-100">
            <h2 className="text-3xl font-bold text-[#1B254B] mb-4">{selectedClass?.name}</h2>
            <div className="h-[300px] w-full rounded-[20px] overflow-hidden mb-6">
                <img src={selectedClass?.img} className="w-full h-full object-cover" alt="" />
            </div>
            <p className="text-[#A3AED0]">Welcome to the {selectedClass?.name} classroom.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col xl:flex-row gap-6 animate-fadeIn">
      
      {/* LEFT SIDE: Courses Content */}
      <div className="flex-1 flex flex-col space-y-6">
        
        {/* --- FIXED HERO CARD (MATCHES EXAM BOARD EXACTLY) --- */}
        <div className="bg-[#EBE9F1] rounded-[30px] p-8 flex justify-between items-center relative overflow-hidden min-h-[180px] shadow-sm">
          <div className="z-10 w-full md:w-2/3 flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-[#1B254B] mb-2 leading-tight">
              My courses:
            </h2>
            <p className="text-[#A3AED0] text-[13px] mb-5 leading-relaxed font-medium max-w-md">
              Track your learning progress, attend live sessions, and access your materials in one place.
            </p>
            <div>
              <button className="bg-[#111C44] text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center hover:bg-black transition-all shadow-sm">
                Learn More <span className="ml-2">→</span>
              </button>
            </div>
          </div>

          {/* Decorative Icons with proper spacing and sizing */}
          <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-4">
             <div className="bg-white/40 p-4 rounded-full backdrop-blur-sm border border-white/50 shadow-sm">
               <span className="text-4xl">🎓</span>
             </div>
             <div className="bg-white/40 p-3 rounded-full backdrop-blur-sm border border-white/50 shadow-sm -rotate-12 mt-8">
               <span className="text-3xl">📚</span>
             </div>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
          {classes.map((cls) => (
            <div key={cls.id} className="bg-white rounded-[24px] overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-50 flex flex-col group">
              <div className="h-[160px] w-full relative overflow-hidden bg-[#F4F7FE]">
                <img 
                  src={cls.img} 
                  alt={cls.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  onError={(e) => { e.target.src = "https://via.placeholder.com/400x200?text=Course+Image"; }}
                />
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm border border-white/20">
                    <span className="text-orange-400 text-[10px]">★</span>
                    <span className="text-[#1B254B] text-[10px] font-black">{cls.rating}</span>
                </div>
              </div>
              
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-[15px] font-bold text-[#1B254B] mb-3 leading-tight group-hover:text-[#4318FF] transition-colors">
                  {cls.name}
                </h3>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-3 text-[#A3AED0] text-[11px] font-bold">
                    <span className="text-base grayscale opacity-70">👥</span> {cls.students}
                  </div>
                  <div className="flex items-center gap-3 text-[#A3AED0] text-[11px] font-bold">
                    <span className="text-base grayscale opacity-70">🕒</span> {cls.schedule}
                  </div>
                  <div className="flex items-center gap-3 text-[#A3AED0] text-[11px] font-bold">
                    <span className="text-base grayscale opacity-70">📍</span> {cls.room}
                  </div>
                </div>

                <button 
                  onClick={() => { setSelectedClass(cls); setCurrentView('detail'); }}
                  className="mt-auto w-full py-2.5 bg-[#F4F7FE] text-[#4318FF] rounded-xl text-[12px] font-bold hover:bg-[#4318FF] hover:text-white transition-all shadow-sm active:scale-[0.98]"
                >
                  Enter Classroom
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT SIDEBAR: Standardized with Semester Progress + Calendar */}
      <div className="w-full xl:w-[320px] shrink-0 flex flex-col space-y-6">
        <div className="text-right text-xs font-bold text-[#A3AED0]">Tuesday, 14 Apr 2026</div>

        {/* Semester Progress (Matches Dashboard exactly) */}
        <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-50">
          <p className="text-[10px] font-bold text-[#1B254B] mb-2 uppercase tracking-widest">Semester Progress</p>
          <div className="h-2 w-full bg-[#F4F7FE] rounded-full overflow-hidden">
            <div className="h-full bg-[#4318FF] w-[37%] rounded-full shadow-[0_0_8px_rgba(67,24,255,0.3)]"></div>
          </div>
        </div>

        {/* Calendar Widget (Standardized Sizing) */}
        <div className="bg-white border border-gray-50 rounded-[20px] p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4 font-bold text-sm text-[#1B254B]">
            <button className="text-[#A3AED0] hover:text-[#4318FF] transition-colors">{'<'}</button> 
            <span>April 2026</span> 
            <button className="text-[#A3AED0] hover:text-[#4318FF] transition-colors">{'>'}</button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-[#A3AED0] font-bold mb-3 uppercase">
            {['Mo','Tu','We','Th','Fr','Sa','Su'].map(d => <div key={d}>{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-y-2 text-center text-[13px] font-bold text-[#1B254B]">
            {[...Array(30)].map((_, i) => (
              <div key={i} className="flex items-center justify-center">
                <div 
                  className={i+1 === 12 
                    ? "bg-[#4318FF] text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md shadow-blue-200" 
                    : "w-8 h-8 flex items-center justify-center hover:bg-[#F4F7FE] rounded-lg cursor-pointer transition-colors"
                  }
                >
                  {i+1}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Note / Guidelines */}
        <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-50">
          <h4 className="text-[11px] font-bold text-[#1B254B] uppercase mb-4 tracking-wider">Quick Note</h4>
          <div className="p-3 bg-[#F4F7FE] rounded-xl border border-gray-100">
            <p className="text-[10px] text-[#A3AED0] leading-relaxed">
              Assignments for <span className="font-bold text-[#4318FF]">French B1</span> are due by the end of this week. Please check your homework tab.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default StudentCourses;
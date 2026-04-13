import React, { useState } from 'react';

const TeacherClasses = () => {
  // State باش نتحكمو في الشاشة اللي راهي تبان: 'list' -> 'lectures' -> 'video'
  const [currentView, setCurrentView] = useState('list');
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedLecture, setSelectedLecture] = useState(null);

  // داتا تجريبية للأقسام
  const classesData = [
    { id: 1, name: "English Communication – B2", rating: "4.9", desc: "Manage lessons, track attendance, and monitor student progress.", students: 30, tag: "English B2", color: "from-blue-100 to-blue-50", icon: "🇬🇧" },
    { id: 2, name: "French Intermediate – B1", rating: "4.5", desc: "Organize class materials, follow student performance easily.", students: 22, tag: "French B1", color: "from-red-100 to-red-50", icon: "🇫🇷" },
    { id: 3, name: "Spanish Basics – A2", rating: "4.8", desc: "Plan lessons, track attendance, and review progress.", students: 17, tag: "Spanish A2", color: "from-orange-100 to-orange-50", icon: "🇪🇸" },
    { id: 4, name: "German Beginner – A1", rating: "4.7", desc: "Prepare lessons, monitor activities for student learning.", students: 27, tag: "German A1", color: "from-green-100 to-green-50", icon: "🇩🇪" }
  ];

  // داتا تجريبية للدروس
  const lecturesData = [
    { id: 1, title: "Everyday English Fluency - B2", author: "British Council", time: "00 : 15 : 33" },
    { id: 2, title: "Professional English Skills - B2", author: "Michael Trimo", time: "00 : 15 : 33" },
    { id: 3, title: "Advanced Speaking Skills - B2", author: "Sophia Smith", time: "00 : 48 : 25" },
    { id: 4, title: "English Mastery Workshop - B2", author: "Sophia Smith", time: "00 : 48 : 25" }
  ];

  // ==========================================
  // 1️⃣ الشاشة الأولى: قائمة الأقسام (Classes List)
  // ==========================================
  const renderClassesList = () => (
    <div className="animate-fadeIn">
      <h1 className="text-[28px] font-bold text-[#1B254B] mb-6">👋 Welcome, [Teacher Name]</h1>
      
      {/* Banner - بدون قفلة Create */}
      <div className="bg-white border border-blue-100 rounded-2xl p-6 mb-8 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#1B254B] mb-1">My Classes:</h2>
          <p className="text-[#A3AED0] text-sm">Manage your classes and track student progress seamlessly.</p>
        </div>
        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-2xl">
          📚
        </div>
      </div>

      <h3 className="text-lg font-bold text-[#1B254B] mb-4">Recent Classes:</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classesData.map((cls) => (
          <div key={cls.id} className="bg-white rounded-[20px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col">
            {/* Image Placeholder (Gradient + Emoji) */}
            <div className={`h-40 w-full bg-gradient-to-br ${cls.color} flex items-center justify-center text-6xl relative`}>
              {cls.icon}
              <div className="absolute bottom-2 right-2 bg-white px-2 py-1 rounded-md text-xs font-bold text-[#1B254B] shadow-sm flex items-center gap-1">
                ⭐ {cls.rating}
              </div>
            </div>
            
            <div className="p-5 flex flex-col flex-1">
              <h4 className="font-bold text-[#1B254B] text-[15px] mb-2">{cls.name}</h4>
              <p className="text-[#A3AED0] text-[11px] leading-relaxed mb-4 flex-1">{cls.desc}</p>
              
              <div className="flex items-center gap-4 mb-4">
                <span className="text-[11px] font-bold text-[#1B254B] flex items-center gap-1">👥 {cls.students} Students</span>
                <span className="text-[11px] font-bold text-[#A3AED0] flex items-center gap-1">📝 {cls.tag}</span>
              </div>
              
              <button 
                onClick={() => { setSelectedClass(cls); setCurrentView('lectures'); }}
                className="w-full py-2 border border-blue-100 rounded-xl text-[#4318FF] text-xs font-bold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
              >
                View Class <span>→</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ==========================================
  // 2️⃣ الشاشة الثانية: قائمة الدروس (Lectures List)
  // ==========================================
  const renderLecturesList = () => (
    <div className="animate-fadeIn">
      {/* Breadcrumb & Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => setCurrentView('list')} className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-[#1B254B] transition-colors">
            ←
          </button>
          <h1 className="text-[24px] font-bold text-[#1B254B]">{selectedClass?.name} Lectures</h1>
        </div>
        
        <div className="relative w-64">
          <span className="absolute left-3 top-2.5 text-gray-400 text-sm">🔍</span>
          <input type="text" placeholder="Search for classes..." className="w-full bg-white border border-gray-200 rounded-full py-2 pl-9 pr-4 text-sm outline-none focus:border-[#4318FF]" />
        </div>
      </div>

      {/* Lectures Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {lecturesData.map((lec) => (
          <div key={lec.id} className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow group"
               onClick={() => { setSelectedLecture(lec); setCurrentView('video'); }}>
            
            {/* Video Thumbnail Placeholder */}
            <div className="h-32 bg-gray-200 relative flex items-center justify-center">
               <img src={`https://picsum.photos/seed/${lec.id}/400/200`} alt="thumbnail" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
               <div className="absolute w-12 h-12 bg-[#1B254B] rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                 ▶
               </div>
            </div>
            
            <div className="p-4">
              <h4 className="font-bold text-[#1B254B] text-[13px] mb-1 truncate">{lec.title}</h4>
              <p className="text-[#A3AED0] text-[11px] mb-2">{lec.author}</p>
              <p className="text-[#F6AD55] text-[10px] font-bold">Time remaining {lec.time}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Add Lecture Button */}
      <div className="flex justify-center mt-10">
        <button className="bg-[#1B254B] hover:bg-[#4318FF] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-3 transition-colors shadow-md">
          <span className="text-xl">📤</span> Add New Lecture To Course
        </button>
      </div>
    </div>
  );

  // ==========================================
  // 3️⃣ الشاشة الثالثة: مشغل الفيديو (Video Player)
  // ==========================================
  const renderVideoPlayer = () => (
    <div className="flex gap-6 animate-fadeIn h-full">
      {/* Left: Video Area */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => setCurrentView('lectures')} className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-50">
            ←
          </button>
          <h1 className="text-[24px] font-bold text-[#1B254B]">{selectedClass?.name}</h1>
        </div>

        {/* Big Video Player Placeholder */}
        <div className="w-full bg-gray-900 rounded-2xl aspect-video flex items-center justify-center relative overflow-hidden shadow-lg mb-6">
           <img src={`https://picsum.photos/seed/${selectedLecture?.id + 10}/800/400`} alt="Video" className="w-full h-full object-cover opacity-50" />
           <div className="absolute inset-0 flex flex-col items-center justify-center">
             <h2 className="text-5xl font-black text-white/80 tracking-widest mb-4">CHAPTER 6</h2>
             <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-3xl cursor-pointer hover:bg-white/40 transition-colors">
               ▶
             </div>
           </div>
           
           {/* Fake Progress Bar */}
           <div className="absolute bottom-0 w-full bg-black/60 p-4 flex items-center gap-4 backdrop-blur-sm">
             <span className="text-white text-xs">⏸</span>
             <span className="text-white text-[10px]">20:10 / 1:15:30</span>
             <div className="flex-1 h-1 bg-white/30 rounded-full relative">
               <div className="absolute left-0 top-0 h-full w-[30%] bg-[#4318FF] rounded-full"></div>
               <div className="absolute left-[30%] top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full"></div>
             </div>
             <span className="text-white text-xs">⚙️ 🔲</span>
           </div>
        </div>

        <h2 className="text-xl font-bold text-[#1B254B] mb-8">{selectedLecture?.title}</h2>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <button onClick={() => setCurrentView('lectures')} className="bg-[#1B254B] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#0A1128] transition-colors">
            BACK TO CLASS
          </button>
          <button className="bg-[#1B254B] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#0A1128] transition-colors">
            Next Lecture
          </button>
        </div>
      </div>

      {/* Right: Comments Sidebar */}
      <div className="w-80 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col h-[700px]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-[#1B254B]">Comments</h3>
          <span className="text-gray-400 cursor-pointer">ℹ️</span>
        </div>
        
        <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar mb-4">
          {[
            { name: "Jane Cooper", msg: "This is exactly what I needed!", img: "1" },
            { name: "Kristin Watson", msg: "Great explanation on grammar.", img: "2" },
            { name: "Jenny Wilson", msg: "Can you explain part 2 again?", img: "3" },
            { name: "Brooklyn Sim", msg: "Love this chapter!", img: "4" },
            { name: "Darrell Steward", msg: "Thanks for the notes.", img: "5" }
          ].map((comment, i) => (
            <div key={i} className="flex gap-3 items-start">
              <img src={`https://i.pravatar.cc/150?img=${comment.img}`} className="w-8 h-8 rounded-full" alt="avatar" />
              <div>
                <h5 className="text-[11px] font-bold text-[#1B254B]">{comment.name}</h5>
                <p className="text-[11px] text-gray-500">{comment.msg}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Add Comment Input */}
        <div className="relative mt-auto">
          <input type="text" placeholder="Write your message..." className="w-full bg-gray-50 border border-gray-200 rounded-full py-2 pl-4 pr-10 text-xs outline-none" />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 text-[#4318FF] hover:scale-110 transition-transform">
            ➤
          </button>
        </div>
      </div>
    </div>
  );

  // ==========================================
  // Router Logic: شكون اللي يبان؟
  // ==========================================
  return (
    <div className="flex-1 bg-transparent overflow-y-auto">
      {currentView === 'list' && renderClassesList()}
      {currentView === 'lectures' && renderLecturesList()}
      {currentView === 'video' && renderVideoPlayer()}
    </div>
  );
};

export default TeacherClasses;
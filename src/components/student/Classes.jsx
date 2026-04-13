import React, { useState } from 'react';

const StudentClasses = () => {
  // State باش نتحكمو في الشاشة اللي راهي تبان: 'list' -> 'lectures' -> 'video'
  const [currentView, setCurrentView] = useState('list');
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedLecture, setSelectedLecture] = useState(null);

  // داتا تجريبية للأقسام (STUDENT VIEW ONLY - READ ONLY)
  const classesData = [
    { id: 1, name: "English Communication – B2", rating: "4.9", desc: "Access lessons, track your progress and improve your skills.", students: 30, tag: "English B2", color: "from-blue-100 to-blue-50", icon: "🇬🇧" },
    { id: 2, name: "French Intermediate – B1", rating: "4.5", desc: "Follow lessons and practice with your classmates.", students: 22, tag: "French B1", color: "from-red-100 to-red-50", icon: "🇫🇷" },
    { id: 3, name: "Spanish Basics – A2", rating: "4.8", desc: "Watch lectures and improve your understanding step by step.", students: 17, tag: "Spanish A2", color: "from-orange-100 to-orange-50", icon: "🇪🇸" },
    { id: 4, name: "German Beginner – A1", rating: "4.7", desc: "Learn at your own pace and review course content anytime.", students: 27, tag: "German A1", color: "from-green-100 to-green-50", icon: "🇩🇪" }
  ];

  // داتا تجريبية للدروس (READ ONLY)
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
      <h1 className="text-[28px] font-bold text-[#1B254B] mb-6">
        👋 Welcome, Student
      </h1>

      <div className="bg-white border border-blue-100 rounded-2xl p-6 mb-8 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#1B254B] mb-1">My Classes:</h2>
          <p className="text-[#A3AED0] text-sm">
            Access your courses, lectures and learning materials.
          </p>
        </div>
        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-2xl">
          📚
        </div>
      </div>

      <h3 className="text-lg font-bold text-[#1B254B] mb-4">My Classes:</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classesData.map((cls) => (
          <div
            key={cls.id}
            className="bg-white rounded-[20px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col"
          >
            <div className={`h-40 w-full bg-gradient-to-br ${cls.color} flex items-center justify-center text-6xl relative`}>
              {cls.icon}
              <div className="absolute bottom-2 right-2 bg-white px-2 py-1 rounded-md text-xs font-bold text-[#1B254B] shadow-sm flex items-center gap-1">
                ⭐ {cls.rating}
              </div>
            </div>

            <div className="p-5 flex flex-col flex-1">
              <h4 className="font-bold text-[#1B254B] text-[15px] mb-2">
                {cls.name}
              </h4>

              <p className="text-[#A3AED0] text-[11px] mb-4 flex-1">
                {cls.desc}
              </p>

              <div className="flex items-center gap-4 mb-4">
                <span className="text-[11px] font-bold text-[#1B254B]">
                  👥 {cls.students} Students
                </span>
                <span className="text-[11px] font-bold text-[#A3AED0]">
                  📝 {cls.tag}
                </span>
              </div>

              <button
                onClick={() => {
                  setSelectedClass(cls);
                  setCurrentView('lectures');
                }}
                className="w-full py-2 border border-blue-100 rounded-xl text-[#4318FF] text-xs font-bold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
              >
                View Class →
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
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentView('list')}
            className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center"
          >
            ←
          </button>

          <h1 className="text-[24px] font-bold text-[#1B254B]">
            {selectedClass?.name} Lectures
          </h1>
        </div>

        <div className="relative w-64">
          <span className="absolute left-3 top-2.5 text-gray-400 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Search lectures..."
            className="w-full bg-white border border-gray-200 rounded-full py-2 pl-9 pr-4 text-sm outline-none focus:border-[#4318FF]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {lecturesData.map((lec) => (
          <div
            key={lec.id}
            className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow group"
            onClick={() => {
              setSelectedLecture(lec);
              setCurrentView('video');
            }}
          >
            <div className="h-32 bg-gray-200 relative flex items-center justify-center">
              <img
                src={`https://picsum.photos/seed/${lec.id}/400/200`}
                className="w-full h-full object-cover"
                alt=""
              />
              <div className="absolute w-12 h-12 bg-[#1B254B] rounded-full flex items-center justify-center text-white">
                ▶
              </div>
            </div>

            <div className="p-4">
              <h4 className="font-bold text-[#1B254B] text-[13px] mb-1 truncate">
                {lec.title}
              </h4>
              <p className="text-[#A3AED0] text-[11px] mb-2">{lec.author}</p>
              <p className="text-[#F6AD55] text-[10px] font-bold">
                Time {lec.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ==========================================
  // 3️⃣ الشاشة الثالثة: الفيديو (Student View)
  // ==========================================
  const renderVideoPlayer = () => (
    <div className="flex gap-6 animate-fadeIn h-full">
      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setCurrentView('lectures')}
            className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center"
          >
            ←
          </button>

          <h1 className="text-[24px] font-bold text-[#1B254B]">
            {selectedClass?.name}
          </h1>
        </div>

        <div className="w-full bg-gray-900 rounded-2xl aspect-video flex items-center justify-center relative overflow-hidden mb-6">
          <img
            src={`https://picsum.photos/seed/${selectedLecture?.id + 10}/800/400`}
            className="w-full h-full object-cover opacity-60"
            alt=""
          />

          <div className="absolute flex flex-col items-center justify-center">
            <h2 className="text-4xl font-black text-white mb-4">LECTURE</h2>
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-white text-3xl">
              ▶
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold text-[#1B254B] mb-8">
          {selectedLecture?.title}
        </h2>

        <button
          onClick={() => setCurrentView('lectures')}
          className="bg-[#1B254B] text-white px-8 py-3 rounded-xl font-bold"
        >
          BACK
        </button>
      </div>

      <div className="w-80 bg-white border rounded-2xl p-6">
        <h3 className="font-bold text-[#1B254B] mb-4">Comments</h3>

        <p className="text-sm text-gray-400">
          Students can view comments only (no posting restrictions here if you want).
        </p>
      </div>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto">
      {currentView === 'list' && renderClassesList()}
      {currentView === 'lectures' && renderLecturesList()}
      {currentView === 'video' && renderVideoPlayer()}
    </div>
  );
};

export default StudentClasses;
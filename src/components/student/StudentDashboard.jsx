import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

import StudentClasses from './StudentClasses';
import StudentCommunications from './StudentCommunications';
import ClassroomTasks from './ClassroomTasks';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const navigate = useNavigate();

  const [studentInfo, setStudentInfo] = useState(null);
  const [myClasses, setMyClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    navigate('/login');
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const { data: studentData } = await supabase
        .from('students')
        .select('*')
        .limit(1)
        .single();

      if (studentData) setStudentInfo(studentData);

      const { data: classesData } = await supabase
        .from('classes')
        .select('*')
        .not('schedule', 'eq', 'TBD');

      if (classesData) {
        const colors = [
          'bg-[#C5B8D8] text-[#35254A]',
          'bg-[#E5D2A6] text-[#4A3A17]',
          'bg-[#A4C2D1] text-[#1F3340]',
          'bg-[#A9C4A3] text-[#23331E]'
        ];

        const formatted = classesData.map((c, i) => ({
          id: c.id,
          name: c.name,
          language: c.language,
          progress: Math.floor(Math.random() * 100),
          colorClass: colors[i % colors.length]
        }));

        setMyClasses(formatted);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const studentName = studentInfo ? studentInfo.first_name : 'Selma';

  const renderMainContent = () => {
    if (activeTab === 'My Classes') return <StudentClasses />;
    if (activeTab === 'Messages') return <StudentCommunications />;
    if (activeTab === 'Classroom Tasks') return <ClassroomTasks />;

    return (
      <div className="flex-1 min-w-[650px] flex flex-col space-y-6 animate-fade-in">

        {/* SAME EXACT TITLE STYLE */}
        <div className="flex justify-between items-end">
          <h1 className="text-[28px] font-bold text-[#1B254B] flex items-center">
            👋 Welcome, Selma
          </h1>
        </div>

        {/* SAME HERO CARD */}
        <div className="bg-[#EBE9F1] rounded-[20px] p-8 flex justify-between items-center relative overflow-hidden h-[200px] shadow-sm">
          <div className="z-10 w-2/3">
            <h2 className="text-2xl font-bold text-[#1B254B] mb-3">
              Track Your Learning Progress!
            </h2>
            <p className="text-[#A3AED0] text-sm mb-6 leading-relaxed">
              View your classes, assignments, and performance.
            </p>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-1/3 flex items-center justify-center">
            <span className="text-6xl">🎓📚</span>
          </div>
        </div>

      </div>
    );
  };

  return (
    <div className="flex h-screen bg-[#F4F7FE] font-sans text-[#1B254B] overflow-hidden">

      {/* SIDEBAR (EXACT SAME STYLE) */}
      <aside className="w-[250px] bg-[#111C44] text-[#A3AED0] flex flex-col justify-between shrink-0 overflow-y-auto custom-scrollbar shadow-2xl z-20">

        <div>
          <div className="p-6 flex items-center space-x-3 mb-2 border-b border-white/5 pb-6">
            <div className="w-8 h-8 bg-white text-black rounded flex items-center justify-center font-bold text-lg shadow-md">🎓</div>
            <span className="text-xl font-bold tracking-wider text-white uppercase">UTOPIA</span>
          </div>

          <nav className="px-4 space-y-2 mt-4">
            {[
              { id: 'Dashboard', icon: '⊞' },
              { id: 'My Classes', icon: '📚' },
              { id: 'Classroom Tasks', icon: '📋' },
              { id: 'Messages', icon: '💬' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === item.id
                    ? 'bg-[#4318FF] text-white shadow-lg shadow-[#4318FF]/30'
                    : 'hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.id}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 mt-4 border-t border-white/5">
          <button className="w-full text-left px-4 py-3 text-[#A3AED0] hover:text-white">
            ⚙️ Settings
          </button>

          <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-red-400">
            ↪️ Logout
          </button>
        </div>
      </aside>

      {/* MAIN AREA */}
      <main className="flex-1 flex flex-col overflow-hidden">

        {/* HEADER (EXACT COPY OF TEACHER) */}
        <header className="h-20 px-8 flex justify-between items-center bg-white/50 backdrop-blur-md border-b border-gray-100 shrink-0 z-10 sticky top-0">

          <div className="relative w-96">
            <span className="absolute left-4 top-2.5 text-gray-400">🔍</span>
            <input
              placeholder="Search students, classes, assignments..."
              className="w-full bg-white border border-gray-200 rounded-full py-2 pl-10 pr-4 text-sm"
            />
          </div>

          <div className="flex items-center space-x-6">

            {/* NOTIFICATION ICON (SAME STYLE) */}
            <div className="relative cursor-pointer">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-200 shadow-sm">
                🔔
              </div>
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </div>

            {/* USER */}
            <div className="flex items-center pl-6 border-l border-gray-200">

              <div className="flex flex-col text-right mr-3">
                <span className="text-sm font-bold text-[#1B254B]">
                  Hello Selma
                </span>
                <span className="text-[11px] text-gray-500">
                  Student
                </span>
              </div>

              <img
                src="https://i.pravatar.cc/150?img=32"
                className="w-10 h-10 rounded-full border-2 border-[#4318FF]"
              />
            </div>
          </div>
        </header>

        {/* BODY (SAME STRUCTURE AS TEACHER) */}
        <div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col xl:flex-row gap-6">

          {/* CENTER */}
          {renderMainContent()}

          {/* RIGHT SIDEBAR (EXACT SAME STYLE) */}
          <div className="w-[320px] shrink-0 flex flex-col space-y-6">

            <div className="text-xs font-bold text-[#A3AED0] text-right">
              {new Date().toDateString()}
            </div>

            <div className="bg-white border rounded-2xl p-5 shadow-sm">
              <p className="font-bold mb-2">Semester Progress</p>
              <div className="h-2 bg-gray-200 rounded-full">
                <div className="h-2 bg-[#4318FF] w-[45%] rounded-full"></div>
              </div>
            </div>

            <div className="bg-white border rounded-2xl p-5 shadow-sm">
              <p className="font-bold mb-3">Calendar</p>
              <div className="text-center text-sm">
                April 2026 <br />
                <span className="text-[#4318FF] font-bold">12</span>
              </div>
            </div>

            <div>
              <p className="font-bold mb-3">Today's Schedule</p>

              <div className="space-y-3">
                <div className="p-3 border-l-4 border-orange-400 bg-white">
                  Homework Review
                </div>

                <div className="p-3 border-l-4 border-green-400 bg-white">
                  Study Session
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
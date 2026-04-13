import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

const StudentClasses = () => {
  // --- States للتحكم في الواجهات ---
  const [currentView, setCurrentView] = useState('list'); // 'list', 'detail', 'video'
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState('Lectures');

  // --- States للداتا ---
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Library ---
  const [activeCategory, setActiveCategory] = useState('Books');
  const [searchQuery, setSearchQuery] = useState('');

  // ==========================================
  // 💡 FETCH DATA
  // ==========================================
  const fetchData = async () => {
    setLoading(true);

    // 1. classes
    const { data: classesData } = await supabase.from('classes').select('*');
    if (classesData) {
      const icons = ["🇬🇧", "🇫🇷", "🇪🇸", "🇩🇪"];
      const colors = ["from-blue-100 to-blue-50", "from-red-100 to-red-50", "from-orange-100 to-orange-50", "from-green-100 to-green-50"];

      setClasses(classesData.map((c, i) => ({
        ...c,
        icon: icons[i % icons.length],
        color: colors[i % colors.length],
        studentsCount: Math.floor(Math.random() * 10) + 10
      })));
    }

    // 2. students (ONLY CLASSMATES VIEW)
    const { data: studentsData } = await supabase.from('students').select('*');
    if (studentsData) {
      setStudents(studentsData.map(s => ({
        id: s.id,
        name: `${s.first_name || ''} ${s.last_name || ''}`,
        email: s.email,
        progress: `${Math.floor(Math.random() * 100)}%`,
        status: "Active"
      })));
    }

    // 3. library
    const { data: resData } = await supabase.from('library_resources').select('*');
    if (resData) setResources(resData);

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ==========================================
  // 1️⃣ LIST VIEW
  // ==========================================
  const renderClassesList = () => (
    <div className="animate-fadeIn p-4">

      <h1 className="text-[28px] font-bold text-[#1B254B] mb-6">
        👋 Welcome, Student
      </h1>

      <div className="bg-white border border-blue-100 rounded-2xl p-6 mb-8 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#1B254B] mb-1">
            My Courses:
          </h2>
          <p className="text-[#A3AED0] text-sm font-medium">
            Track your learning progress and lessons.
          </p>
        </div>
        <div className="text-4xl">📚</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="italic text-gray-400">Loading classes...</p>
        ) : (
          classes.map((cls) => (
            <div
              key={cls.id}
              className="bg-white rounded-[20px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col"
              onClick={() => {
                setSelectedClass(cls);
                setCurrentView('detail');
              }}
            >
              <div className={`h-40 w-full bg-gradient-to-br ${cls.color} flex items-center justify-center text-6xl relative`}>
                {cls.icon}
                <div className="absolute bottom-2 right-2 bg-white px-2 py-1 rounded-md text-[10px] font-bold text-[#1B254B] shadow-sm">
                  ⭐ 4.9
                </div>
              </div>

              <div className="p-5 flex flex-col flex-1">
                <h4 className="font-bold text-[#1B254B] text-[15px] mb-2 group-hover:text-[#4318FF]">
                  {cls.name}
                </h4>

                <p className="text-[#A3AED0] text-[11px] mb-4 flex-1">
                  Lessons and progress tracking for {cls.language}.
                </p>

                <div className="flex items-center gap-4 mb-4">
                  <span className="text-[11px] font-bold text-[#1B254B]">
                    👥 {cls.studentsCount} Students
                  </span>
                  <span className="text-[11px] font-bold text-[#A3AED0]">
                    📝 {cls.level || 'B2'}
                  </span>
                </div>

                <button className="w-full py-2 border border-blue-100 rounded-xl text-[#4318FF] text-xs font-bold hover:bg-blue-50 transition-colors">
                  View Course →
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  // ==========================================
  // 2️⃣ DETAIL VIEW
  // ==========================================
  const renderClassDetail = () => {
    const currentItems = resources.filter(
      r =>
        r.type === activeCategory &&
        r.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const heroItem = currentItems.find(r => r.is_hero) || currentItems[0];
    const gridItems = currentItems.filter(r => !r.is_hero);

    return (
      <div className="animate-fadeIn p-4">

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentView('list')}
              className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center"
            >
              ←
            </button>

            <h1 className="text-[24px] font-bold text-[#1B254B]">
              {selectedClass?.name}
            </h1>
          </div>
        </div>

        {/* TABS */}
        <div className="flex gap-10 mb-8 border-b border-gray-100">
          {['Lectures', 'Students', 'Library'].map((t) => (
            <button
              key={t}
              onClick={() => setActiveSubTab(t)}
              className={`pb-4 px-2 text-sm font-bold ${
                activeSubTab === t ? 'text-[#4318FF]' : 'text-gray-400'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* ================= LECTURES ================= */}
        {activeSubTab === 'Lectures' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3].map((id) => (
              <div
                key={id}
                onClick={() => {
                  setSelectedLecture({ id, title: `Lesson ${id}` });
                  setCurrentView('video');
                }}
                className="bg-white rounded-2xl border shadow-sm cursor-pointer"
              >
                <img
                  src={`https://picsum.photos/seed/${id}/400/200`}
                  className="w-full h-36 object-cover"
                />
                <div className="p-4">
                  <h4 className="font-bold text-sm">
                    Lesson {id}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ================= STUDENTS (CLASSMATES) ================= */}
        {activeSubTab === 'Students' && (
          <div className="bg-white rounded-2xl border overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 text-xs text-gray-500">
                <tr>
                  <th className="p-4">Student</th>
                  <th>Progress</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {students.map((s) => (
                  <tr key={s.id} className="border-t">
                    <td className="p-4">
                      {s.name}
                    </td>
                    <td>{s.progress}</td>
                    <td>{s.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ================= LIBRARY ================= */}
        {activeSubTab === 'Library' && (
          <div className="grid grid-cols-3 gap-6">
            {resources.map((item) => (
              <div key={item.id} className="bg-white border rounded-xl p-3">
                <img src={item.img} className="w-full h-32 object-cover rounded-lg" />
                <h4 className="text-sm font-bold mt-2">
                  {item.title}
                </h4>
              </div>
            ))}
          </div>
        )}

      </div>
    );
  };

  // ==========================================
  // 3️⃣ VIDEO VIEW
  // ==========================================
  const renderVideoPlayer = () => (
    <div className="p-4">
      <button onClick={() => setCurrentView('detail')}>
        ← Back
      </button>

      <div className="bg-black aspect-video rounded-xl mt-4 flex items-center justify-center text-white">
        ▶ Video Player
      </div>

      <h2 className="text-xl font-bold mt-4">
        {selectedLecture?.title}
      </h2>
    </div>
  );

  return (
    <div className="h-full w-full overflow-y-auto">
      {currentView === 'list' && renderClassesList()}
      {currentView === 'detail' && renderClassDetail()}
      {currentView === 'video' && renderVideoPlayer()}
    </div>
  );
};

export default StudentClasses;
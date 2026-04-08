import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const StudentClasses = () => {
  const [activeTab, setActiveTab] = useState("My Classes");
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  const courses = [
    {
      title: "French Intermediate – B1",
      teacher: "Mr. Adam Smith",
      level: "French B1",
      rating: 2.5,
      bg: "bg-[#E9EDF7]",
    },
    {
      title: "German Beginner – A1",
      teacher: "Dr. Johnson",
      level: "German A1",
      rating: 4.5,
      bg: "bg-[#F6E7E5]",
    },
    {
      title: "English Communication – B2",
      teacher: "Prof. Davis",
      level: "English B2",
      rating: 4.9,
      bg: "bg-[#E7F0F8]",
    },
  ];

  return (
    <div className="flex h-screen bg-[#F4F7FE] text-[#1B254B] overflow-hidden">

      {/* ================= SIDEBAR ================= */}
      <aside className="w-[250px] bg-[#111C44] text-[#A3AED0] flex flex-col justify-between">
        <div>
          {/* Logo */}
          <div className="p-6 text-white font-bold text-xl">🎓 UTOPIA</div>

          {/* Menu */}
          <nav className="px-4 space-y-2">
            {[
              "Dashboard",
              "Schedule",
              "My Classes",
              "Messages",
              "Attendance",
              "Libraries",
            ].map((item) => (
              <button
                key={item}
                onClick={() => setActiveTab(item)}
                className={`w-full text-left px-4 py-2 rounded-xl ${
                  activeTab === item
                    ? "bg-white/10 text-white"
                    : "hover:text-white"
                }`}
              >
                {item}
              </button>
            ))}
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="p-4 text-left hover:text-white"
        >
          Logout
        </button>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex-1 flex flex-col overflow-hidden">

        {/* HEADER */}
        <header className="h-20 px-8 flex justify-between items-center">
          <div className="relative w-80">
            <span className="absolute left-4 top-2.5 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Search"
              className="w-full bg-white rounded-full py-2.5 pl-10 pr-4 text-sm outline-none shadow-sm"
            />
          </div>

          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
              🔔
            </div>
            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
          </div>
        </header>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto px-8 pb-8">

          {/* Welcome */}
          <h1 className="text-2xl font-bold mb-6">
            Welcome, [Student Name]
          </h1>

          {/* Banner */}
          <div className="bg-[#EBE9F1] p-6 rounded-2xl flex justify-between items-center mb-8">
            <div>
              <h2 className="text-lg font-bold mb-2">
                Discover Your Language Journey!
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                Improve your skills and track your progress in your enrolled languages.
              </p>
              <button className="bg-[#111C44] text-white px-4 py-2 rounded-lg">
                Learn More →
              </button>
            </div>

            <div className="text-5xl">🎉</div>
          </div>

          {/* COURSES SECTION */}
          <div>
            <h3 className="text-lg font-bold mb-4">My courses:</h3>

            <div className="grid grid-cols-3 gap-6">
              {courses.map((course, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden"
                >
                  {/* TOP IMAGE BLOCK */}
                  <div className={`${course.bg} h-40`} />

                  {/* CONTENT */}
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-bold">
                        {course.title}
                      </h4>

                      <span className="text-xs bg-yellow-100 px-2 py-1 rounded">
                        ⭐ {course.rating}
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 mb-1">
                      {course.teacher}
                    </p>

                    <p className="text-xs text-gray-400 mb-4">
                      {course.level}
                    </p>

                    <button className="border border-[#4318FF] text-[#4318FF] px-3 py-1 rounded-lg text-xs hover:bg-[#4318FF] hover:text-white transition">
                      View Class
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default StudentClasses;
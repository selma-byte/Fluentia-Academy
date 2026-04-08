import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const StudentClassDetails = () => {
  const [activeTab, setActiveTab] = useState("My Classes");
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  const lectures = [
    {
      title: "Everyday English Fluency – B2",
      teacher: "British Council",
      time: "00:15:33",
    },
    {
      title: "Professional English Skills – B2",
      teacher: "Michael Trim",
      time: "00:15:33",
    },
    {
      title: "Advanced Speaking Skills – B2",
      teacher: "Sophia Smith",
      time: "00:48:25",
    },
    {
      title: "English Mastery Workshop – B2",
      teacher: "Sophia Smith",
      time: "00:48:25",
    },
  ];

  return (
    <div className="flex h-screen bg-[#F4F7FE] text-[#1B254B] overflow-hidden">

      {/* ================= SIDEBAR ================= */}
      <aside className="w-[250px] bg-[#111C44] text-[#A3AED0] flex flex-col justify-between">
        <div>
          <div className="p-6 text-white font-bold text-xl">🎓 UTOPIA</div>

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
          <h1 className="text-xl font-bold mb-4">
            Welcome, [Student Name]
          </h1>

          {/* Banner + Calendar */}
          <div className="flex gap-6 mb-6">

            {/* Banner */}
            <div className="flex-1 bg-[#EBE9F1] p-6 rounded-2xl flex justify-between items-center">
              <div>
                <h2 className="font-bold mb-2">
                  Discover Your Language Journey!
                </h2>
                <p className="text-sm text-gray-500 mb-3">
                  Improve your skills and track your progress in your enrolled languages.
                </p>
                <button className="bg-[#111C44] text-white px-4 py-2 rounded-lg text-sm">
                  Learn More →
                </button>
              </div>

              <div className="text-4xl">🎉</div>
            </div>

            {/* Calendar */}
            <div className="w-[260px] bg-white p-4 rounded-2xl shadow-sm">
              <h4 className="text-sm font-bold mb-2 text-center">
                January 2024
              </h4>

              <div className="grid grid-cols-7 text-center text-xs gap-1">
                {[...Array(31)].map((_, i) => (
                  <div
                    key={i}
                    className={`p-1 rounded ${
                      i === 11 ? "bg-[#111C44] text-white" : ""
                    }`}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ================= LECTURES ================= */}
          <div>

            {/* Header + Search */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">
                English Communication – B2 Lectures
              </h3>

              <div className="relative">
                <input
                  placeholder="Search for classe..."
                  className="bg-white border border-orange-300 rounded-full py-2 pl-4 pr-10 text-sm outline-none"
                />
                <span className="absolute right-3 top-2 text-gray-400">🔍</span>
              </div>
            </div>

            {/* LECTURES GRID */}
            <div className="grid grid-cols-4 gap-4">

              {lectures.map((lec, i) => (
                <div
                  key={i}
                  className="bg-white border rounded-lg overflow-hidden shadow-sm"
                >
                  {/* Video thumbnail */}
                  <div className="relative h-32 bg-gray-300 flex items-center justify-center">
                    <span className="text-3xl">▶</span>
                  </div>

                  {/* Info */}
                  <div className="p-2">
                    <p className="text-[12px] font-bold leading-tight">
                      {lec.title}
                    </p>

                    <p className="text-[10px] text-gray-500">
                      {lec.teacher}
                    </p>

                    <p className="text-[10px] text-orange-400 mt-1">
                      time remaining: {lec.time}
                    </p>
                  </div>
                </div>
              ))}

            </div>

            {/* RATE BUTTON */}
            <div className="flex justify-center mt-8">
              <button className="bg-[#111C44] text-white px-8 py-2 rounded-xl">
                Rate course
              </button>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
};

export default StudentClassDetails;
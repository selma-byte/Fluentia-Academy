import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const StudentAttendance = () => {
  const [activeTab, setActiveTab] = useState("Attendance");
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  const attendanceData = [
    { id: "01", course: "English Grammar B2", lang: "English", date: "1 Mar 2022", status: "Present" },
    { id: "02", course: "French Conversation A2", lang: "French", date: "13 Mar 2022", status: "Present" },
    { id: "03", course: "Spanish Basics A1", lang: "Spanish", date: "22 Mar 2022", status: "Absent" },
    { id: "04", course: "German Intensive B1", lang: "German", date: "23 Mar 2022", status: "Present" },
    { id: "05", course: "Italian Conversation A2", lang: "Italian", date: "25 Mar 2022", status: "Present" },
    { id: "06", course: "English Speaking Skills", lang: "English", date: "26 Mar 2022", status: "Absent" },
    { id: "07", course: "French Writing Workshop", lang: "French", date: "30 Mar 2022", status: "Present" },
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
              "Exam Board",
              "Homeworks",
              "Grade Report",
              "Enrolled Courses",
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
        <div className="flex-1 overflow-y-auto px-8 pb-8 flex gap-6">

          {/* LEFT SIDE */}
          <div className="flex-1">

            {/* Welcome */}
            <h1 className="text-xl font-bold mb-4">
              Welcome, [Student Name]
            </h1>

            {/* Banner */}
            <div className="bg-[#EBE9F1] p-6 rounded-2xl mb-6 flex justify-between items-center">
              <div>
                <h2 className="font-bold mb-2">Attendance Overview:</h2>
                <p className="text-sm text-gray-500">
                  Track and manage attendance across all your classes
                </p>
              </div>
              <div className="text-4xl">🧑‍🎓</div>
            </div>

            {/* TABLE */}
            <div className="bg-white p-4 rounded-2xl shadow-sm">

              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold">Attendance Record</h3>

                <input
                  placeholder="Search by class"
                  className="bg-gray-100 px-4 py-2 rounded-full text-sm outline-none"
                />
              </div>

              {/* Table */}
              <table className="w-full text-sm">
                <thead className="text-gray-400 border-b">
                  <tr>
                    <th className="py-2 text-left">#</th>
                    <th className="text-left">Course Name</th>
                    <th>Language</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {attendanceData.map((item, i) => (
                    <tr key={i} className="border-b last:border-0 text-center">
                      <td className="py-3 text-left">{item.id}</td>
                      <td className="text-left">{item.course}</td>
                      <td>{item.lang}</td>
                      <td>{item.date}</td>
                      <td>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            item.status === "Present"
                              ? "bg-green-100 text-green-600"
                              : "bg-red-100 text-red-500"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="flex justify-between text-xs mt-4 text-gray-400">
                <button>Previous</button>
                <span>Page 1 of 12</span>
                <button>Next</button>
              </div>

            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="w-[300px] space-y-6">

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl shadow-sm text-center">
                <p className="text-lg font-bold">80%</p>
                <p className="text-xs text-gray-400">Attendance</p>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-sm text-center">
                <p className="text-lg font-bold">258+</p>
                <p className="text-xs text-gray-400">Task Completed</p>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-sm text-center">
                <p className="text-lg font-bold">64%</p>
                <p className="text-xs text-gray-400">Task in Progress</p>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-sm text-center">
                <p className="text-lg font-bold">245</p>
                <p className="text-xs text-gray-400">Reward Points</p>
              </div>
            </div>

            {/* Chart (Fake donut like design) */}
            <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
              <h4 className="font-bold mb-4">Attendance</h4>

              <div className="w-32 h-32 mx-auto rounded-full border-[10px] border-yellow-300 border-t-[#A3AED0] flex items-center justify-center">
                <span className="font-bold">80%</span>
              </div>

              <p className="text-xs text-gray-400 mt-3">
                April 2023 • Class 10th
              </p>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentAttendance;
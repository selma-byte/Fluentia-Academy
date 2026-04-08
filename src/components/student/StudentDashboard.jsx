import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  const courses = [
    { title: "English Communication – B2", teacher: "Mr. Adam Smith", color: "bg-[#C5B8D8]" },
    { title: "French Intermediate – B1", teacher: "Dr. Johnson", color: "bg-[#E5D2A6]" },
    { title: "Spanish Basics – A2", teacher: "Prof. Davis", color: "bg-[#A4C2D1]" },
    { title: "German Beginner – A1", teacher: "Dr. Martinez", color: "bg-[#A9C4A3]" },
  ];

  const exams = [
    { name: "Final Speaking Assessment", course: "English B2", date: "Jan 25", status: "Completed" },
    { name: "Grammar Test", course: "French B1", date: "Feb 15", status: "Completed" },
    { name: "Writing Test", course: "Spanish A2", date: "Mar 10", status: "Upcoming" },
    { name: "Listening Test", course: "German A1", date: "Apr 2", status: "Upcoming" },
  ];

  return (
    <div className="flex h-screen bg-[#F4F7FE] text-[#1B254B]">

      {/* ================= SIDEBAR ================= */}
      <aside className="w-[250px] bg-[#111C44] text-[#A3AED0] flex flex-col justify-between">
        <div>
          <div className="p-6 flex items-center space-x-2 text-white font-bold text-xl">
            🎓 UTOPIA
          </div>

          <nav className="px-4 space-y-3">
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
      <main className="flex-1 p-6 overflow-y-auto flex gap-6">

        {/* ===== LEFT ===== */}
        <div className="flex-1 space-y-6">

          {/* Header */}
          <h1 className="text-2xl font-bold">Welcome, Student</h1>

          {/* Banner */}
          <div className="bg-[#EBE9F1] p-6 rounded-2xl flex justify-between items-center">
            <div>
              <h2 className="font-bold text-xl mb-2">
                Discover Your Language Journey!
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                Improve your skills and track your progress.
              </p>
              <button className="bg-[#111C44] text-white px-4 py-2 rounded-lg">
                Learn More →
              </button>
            </div>
            <div className="text-5xl">🎉</div>
          </div>

          {/* Courses */}
          <div>
            <div className="flex justify-between mb-3">
              <h3 className="font-bold">Enrolled Courses</h3>
              <button className="text-blue-600 text-sm">View all</button>
            </div>

            <div className="grid grid-cols-4 gap-4">
              {courses.map((c, i) => (
                <div
                  key={i}
                  className={`${c.color} p-4 rounded-xl h-32 flex flex-col justify-between`}
                >
                  <h4 className="text-sm font-bold">{c.title}</h4>
                  <p className="text-xs">{c.teacher}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Exam Board */}
          <div>
            <h3 className="font-bold mb-3">Exam Board</h3>
            <table className="w-full text-sm bg-white rounded-xl overflow-hidden">
              <thead className="text-gray-400">
                <tr>
                  <th className="p-2">Exam</th>
                  <th>Course</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {exams.map((e, i) => (
                  <tr key={i} className="text-center border-t">
                    <td className="p-2">{e.name}</td>
                    <td>{e.course}</td>
                    <td>{e.date}</td>
                    <td
                      className={`${
                        e.status === "Completed"
                          ? "text-green-500"
                          : "text-blue-500"
                      }`}
                    >
                      {e.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ===== RIGHT ===== */}
        <div className="w-[300px] space-y-6">

          {/* Calendar */}
          <div className="bg-white p-4 rounded-xl">
            <h4 className="font-bold mb-2">January 2024</h4>
            <div className="grid grid-cols-7 text-center text-sm gap-1">
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

          {/* Homework */}
          <div>
            <h3 className="font-bold mb-3">Homeworks</h3>

            <div className="space-y-3">
              <div className="bg-white p-3 rounded-xl border-l-4 border-orange-400">
                <p className="font-bold text-sm">
                  Oral Presentation
                </p>
                <p className="text-xs text-gray-500">
                  Due: Feb 10
                </p>
              </div>

              <div className="bg-white p-3 rounded-xl border-l-4 border-green-400">
                <p className="font-bold text-sm">
                  Essay Writing
                </p>
                <p className="text-xs text-gray-500">
                  Completed
                </p>
              </div>

              <div className="bg-white p-3 rounded-xl border-l-4 border-purple-400">
                <p className="font-bold text-sm">
                  Vocabulary Quiz
                </p>
                <p className="text-xs text-gray-500">
                  In Progress
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
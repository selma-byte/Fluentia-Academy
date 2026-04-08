import React from "react";
import { useNavigate } from "react-router-dom";

const StudentSettings = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-[#F4F7FE] text-[#1B254B]">

      {/* ================= SIDEBAR ================= */}
      <aside className="w-[250px] bg-[#111C44] text-[#A3AED0] flex flex-col justify-between">
        <div>
          <div className="p-6 text-white font-bold text-xl">🎓 UTOPIA</div>

          <nav className="px-4 space-y-2">
            {[
              "Dashboard",
              "Account Settings",
              "Change Password",
              "Preferences & Feedback",
              "Language Settings",
            ].map((item, i) => (
              <button
                key={i}
                className={`w-full text-left px-4 py-2 rounded-xl ${
                  i === 1
                    ? "bg-white/10 text-white"
                    : "hover:text-white"
                }`}
              >
                {item}
              </button>
            ))}
          </nav>

          {/* Toggles */}
          <div className="px-4 mt-6 space-y-4 text-sm">
            {[
              "Email Notifications",
              "Assignment Alerts",
              "Schedule Updates",
              "Exam Notifications",
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center">
                <span>{item}</span>
                <div className="w-10 h-5 bg-gray-300 rounded-full relative">
                  <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 left-0.5"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="p-4 text-left hover:text-white"
        >
          Logout
        </button>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex-1 p-8 overflow-y-auto">

        {/* Profile Header */}
        <div className="bg-white p-6 rounded-2xl shadow-sm mb-6 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gray-300 rounded-full"></div>

            <div>
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-bold">
                ACTIVE STUDENT
              </span>
              <h1 className="text-2xl font-bold mt-1">Sofia Martinez</h1>
              <p className="text-sm text-gray-400">
                Student ID: STD-2098 • English, Spanish Program
              </p>
            </div>
          </div>

          <div className="space-x-3">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
              Change photo
            </button>
            <button className="bg-gray-200 px-4 py-2 rounded-lg text-sm">
              Update Profile
            </button>
          </div>
        </div>

        {/* GRID CONTENT */}
        <div className="grid grid-cols-3 gap-6">

          {/* Personal Info */}
          <div className="bg-white p-5 rounded-xl shadow-sm">
            <h3 className="font-bold mb-4">Personal Information</h3>
            <div className="text-sm space-y-2">
              <p><strong>Full Name:</strong> Sofia Martinez</p>
              <p><strong>DOB:</strong> May 16, 2004</p>
              <p><strong>Gender:</strong> Female</p>
              <p><strong>Blood Group:</strong> O Positive</p>
              <p><strong>Level:</strong> B2</p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-white p-5 rounded-xl shadow-sm">
            <h3 className="font-bold mb-4">Contact Information</h3>
            <div className="text-sm space-y-2">
              <p><strong>Phone:</strong> +213 XXX XXX XXX</p>
              <p><strong>Email:</strong> sofia@student.com</p>
              <p><strong>Address:</strong> Algiers, Algeria</p>
              <p><strong>Courses:</strong> English B2, Spanish B1</p>
            </div>
          </div>

          {/* Documents */}
          <div className="bg-white p-5 rounded-xl shadow-sm">
            <h3 className="font-bold mb-4">Documents</h3>
            <ul className="text-sm space-y-3">
              <li className="flex justify-between">
                Student ID Card <span>⬇</span>
              </li>
              <li className="flex justify-between">
                Enrollment Certificate <span>⬇</span>
              </li>
              <li className="flex justify-between">
                Payment Receipts <span>⬇</span>
              </li>
              <li className="flex justify-between">
                Exam Results <span>⬇</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Academic Info */}
        <div className="bg-white p-6 rounded-xl shadow-sm mt-6">
          <h3 className="font-bold mb-4">Academic Information</h3>

          <div className="grid grid-cols-4 gap-4 text-sm">
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-gray-400">Program</p>
              <p className="font-bold">English</p>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-gray-400">Courses</p>
              <p className="font-bold">10</p>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-gray-400">Level</p>
              <p className="font-bold">B2 / B1</p>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-gray-400">Start Year</p>
              <p className="font-bold">2022</p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default StudentSettings;
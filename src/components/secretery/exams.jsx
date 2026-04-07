import React, { useState } from 'react';

const Exams = ({ examView, setExamView }) => {
  const [createStep, setCreateStep] = useState(1);

  // =======================================
  // 1. الصفحة الرئيسية للامتحانات (Dashboard)
  // =======================================
  const renderHome = () => (
    <div className="animate-fade-in pb-10">
      <h2 className="text-3xl font-bold text-[#0A1128] mb-8">Exam Management</h2>
      
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mb-10">
        <div className="text-center px-6">
          <p className="text-gray-500 text-sm font-bold mb-2">Total Exams</p>
          <p className="text-4xl font-bold text-[#0A1128]">12</p>
        </div>
        <div className="w-px h-12 bg-gray-200"></div>
        <div className="text-center px-6">
          <p className="text-gray-500 text-sm font-bold mb-2">Active Exams</p>
          <p className="text-4xl font-bold text-[#0A1128]">3</p>
        </div>
        <div className="w-px h-12 bg-gray-200"></div>
        <div className="text-center px-6">
          <p className="text-gray-500 text-sm font-bold mb-2">Scheduled</p>
          <p className="text-4xl font-bold text-[#0A1128]">5</p>
        </div>
        <div className="w-px h-12 bg-gray-200"></div>
        <div className="text-center px-6">
          <p className="text-gray-500 text-sm font-bold mb-2">Completed</p>
          <p className="text-4xl font-bold text-[#0A1128]">4</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h3 className="text-xl font-bold text-[#0A1128] mb-6">Recent Exams</h3>
          <div className="space-y-4">
            {[
              { title: "Mathematics Mid-Term Exam", subject: "Mathematics • 9 Niaz", status: "completed", date: "20/12/2023", progress: "35/35" },
              { title: "English Literature Quiz", subject: "English • 8 Liaqat", status: "scheduled", date: "22/12/2023", progress: "0/32" },
              { title: "Physics Chapter 5 Test", subject: "Physics • 10 Niaz", status: "active", date: "18/12/2023", progress: "28/28" },
            ].map((exam, idx) => (
              <div 
                key={idx} 
                onClick={() => exam.status === 'completed' ? setExamView('results') : setExamView('manage')}
                className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex justify-between items-center cursor-pointer"
              >
                <div>
                  <div className="flex items-center mb-2">
                    <h4 className="font-bold text-[#0A1128] text-base mr-3">{exam.title}</h4>
                    <span className={`text-xs px-2.5 py-1 rounded font-bold capitalize ${
                      exam.status === 'active' ? 'bg-[#0A1128] text-white' : 
                      exam.status === 'scheduled' ? 'bg-gray-100 text-gray-600' : 'bg-gray-100 text-gray-800'
                    }`}>{exam.status}</span>
                  </div>
                  <p className="text-sm text-gray-500">{exam.subject} • {exam.progress} completed</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 capitalize mb-1">Scheduled</p>
                  <p className="text-sm font-medium text-gray-700">{exam.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold text-[#0A1128] mb-6">Quick Actions</h3>
          <div className="bg-transparent space-y-3">
            <button onClick={() => {setExamView('create'); setCreateStep(1);}} className="w-full text-left px-4 py-4 rounded-xl hover:bg-gray-100 text-base font-medium text-gray-700 transition-colors flex items-center cursor-pointer">
              <span className="mr-3 text-gray-500 text-xl">+</span> Create New Exam
            </button>
            <button onClick={() => setExamView('manage')} className="w-full text-left px-4 py-4 rounded-xl hover:bg-gray-100 text-base font-medium text-gray-700 transition-colors flex items-center cursor-pointer">
              <span className="mr-3 text-gray-500 text-xl">⚙️</span> Manage Exams
            </button>
            <button onClick={() => setExamView('results')} className="w-full text-left px-4 py-4 rounded-xl hover:bg-gray-100 text-base font-medium text-gray-700 transition-colors flex items-center cursor-pointer">
              <span className="mr-3 text-gray-500 text-xl">📊</span> View Exam Results
            </button>
            <button onClick={() => setExamView('schedule')} className="w-full text-left px-4 py-4 rounded-xl hover:bg-gray-100 text-base font-medium text-gray-700 transition-colors flex items-center cursor-pointer">
              <span className="mr-3 text-gray-500 text-xl">📅</span> Schedule Exam
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // =======================================
  // 2. صفحة إدارة الامتحانات (مطابقة لتصميم Figma 100%)
  // =======================================
  const renderManageExams = () => (
    <div className="animate-fade-in pb-10 max-w-7xl mx-auto">
      
      {/* العنوان العلوي */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#0A1128] mb-1">Exam Management</h2>
        <p className="text-sm text-gray-500">Manage all exams across the school and monitor their progress</p>
      </div>

      {/* بطاقات الإحصائيات (4 بطاقات منفصلة بلون رمادي فاتح) */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-100/80 rounded-2xl p-5 flex justify-between items-start border border-gray-200/50">
          <div>
            <p className="text-gray-500 text-[11px] font-medium mb-1">Total Exams</p>
            <p className="text-2xl font-bold text-[#0A1128]">5</p>
          </div>
          <span className="text-blue-500 text-xl">📄</span>
        </div>
        <div className="bg-gray-100/80 rounded-2xl p-5 flex justify-between items-start border border-gray-200/50">
          <div>
            <p className="text-gray-500 text-[11px] font-medium mb-1">Active Exams</p>
            <p className="text-2xl font-bold text-[#0A1128]">1</p>
          </div>
          <span className="text-green-500 text-xl">▶</span>
        </div>
        <div className="bg-gray-100/80 rounded-2xl p-5 flex justify-between items-start border border-gray-200/50">
          <div>
            <p className="text-gray-500 text-[11px] font-medium mb-1">Scheduled</p>
            <p className="text-2xl font-bold text-[#0A1128]">1</p>
          </div>
          <span className="text-orange-500 text-xl">📅</span>
        </div>
        <div className="bg-gray-100/80 rounded-2xl p-5 flex justify-between items-start border border-gray-200/50">
          <div>
            <p className="text-gray-500 text-[11px] font-medium mb-1">Completed</p>
            <p className="text-2xl font-bold text-[#0A1128]">1</p>
          </div>
          <span className="text-purple-500 text-xl">📋</span>
        </div>
      </div>

      {/* شريط البحث العلوي الرمادي */}
      <div className="bg-gray-100/80 rounded-xl p-3 flex justify-between items-center border border-gray-200/50 mb-10">
        <div className="relative flex-1 max-w-lg">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 text-sm">🔍</span>
          <input type="text" placeholder="Search exams by title, subject, or class..." className="w-full bg-transparent border-none py-2 pl-10 pr-4 text-sm outline-none text-gray-600" />
        </div>
        <div className="bg-gray-200/50 rounded-lg px-3 py-1.5 flex items-center">
          <select className="bg-transparent border-none text-sm font-medium text-gray-600 outline-none cursor-pointer pr-2">
            <option>All Status</option>
          </select>
        </div>
      </div>

      {/* قسم Your Exams والجدول */}
      <div>
        <div className="mb-4 border-b border-gray-200 pb-3">
          <h3 className="font-bold text-[#0A1128] text-base mb-1">Your Exams</h3>
          <p className="text-xs text-gray-500">Manage and monitor all your created exams</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 text-[#0A1128] font-bold">
              <tr>
                <th className="py-3 px-2">Title</th>
                <th className="py-3 px-2">Subject</th>
                <th className="py-3 px-2">Class</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2">Duration</th>
                <th className="py-3 px-2">Participants</th>
                <th className="py-3 px-2">Progress</th>
                <th className="py-3 px-2">Scheduled</th>
                <th className="py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                { title: "Mathematics Mid-Term Exam", file: "math_midterm_class9.pdf", sub: "Mathematics", cls: "9 Niaz", status: "Active", dur: "90m", part: "35", prog: "28/35", date: "20/12/2023", time: "09:00" },
                { title: "English Literature Quiz", file: "english_literature_quiz.pdf", sub: "English", cls: "8 Liaqat", status: "Scheduled", dur: "45m", part: "32", prog: "0/32", date: "22/12/2023", time: "11:00" },
                { title: "Physics Chapter 5 Test", file: "physics_ch5_test.pdf", sub: "Physics", cls: "10 Niaz", status: "Completed", dur: "60m", part: "28", prog: "28/28", date: "18/12/2023", time: "14:00" },
                { title: "Chemistry Lab Practical", file: "chemistry_lab_practical.pdf", sub: "Chemistry", cls: "9 Tariq", status: "Draft", dur: "120m", part: "0", prog: "0/0", date: "25/12/2023", time: "10:00" },
                { title: "Pakistan Studies Final", file: "pak_studies_final.pdf", sub: "Pakistan Studies", cls: "8 Edhi", status: "Paused", dur: "75m", part: "30", prog: "15/30", date: "21/12/2023", time: "13:00", highlight: true },
              ].map((row, i) => (
                <tr key={i} className={`transition-colors cursor-pointer ${row.highlight ? 'bg-gray-50' : 'hover:bg-gray-50/50'}`} onClick={() => row.status === 'Completed' ? setExamView('results') : null}>
                  <td className="py-4 px-2">
                    <p className="font-bold text-[#0A1128] text-[13px]">{row.title}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{row.file}</p>
                  </td>
                  <td className="py-4 px-2 text-gray-700 text-xs font-medium">{row.sub}</td>
                  <td className="py-4 px-2 text-gray-700 text-xs font-medium">{row.cls}</td>
                  <td className="py-4 px-2">
                    {/* الحالات مطابقة لتصميم Figma */}
                    {row.status === 'Active' && <span className="bg-[#0A1128] text-white px-2.5 py-1 rounded text-[10px] font-bold flex items-center w-max"><span className="mr-1 text-[8px]">▶</span> Active</span>}
                    {row.status === 'Scheduled' && <span className="text-gray-600 border border-gray-200 px-2.5 py-1 rounded text-[10px] font-bold flex items-center w-max"><span className="mr-1">📅</span> Scheduled</span>}
                    {row.status === 'Completed' && <span className="text-gray-600 border border-gray-200 px-2.5 py-1 rounded text-[10px] font-bold flex items-center w-max"><span className="mr-1">📋</span> Completed</span>}
                    {row.status === 'Draft' && <span className="text-gray-500 px-2.5 py-1 rounded text-[10px] font-bold flex items-center w-max"><span className="mr-1 text-[8px]">⚙️</span> Draft</span>}
                    {row.status === 'Paused' && <span className="bg-red-500 text-white px-2.5 py-1 rounded text-[10px] font-bold flex items-center w-max"><span className="mr-1 text-[8px]">⏸</span> Paused</span>}
                  </td>
                  <td className="py-4 px-2 text-gray-500 text-xs flex items-center mt-2"><span className="mr-1.5 opacity-50">⏱</span> {row.dur}</td>
                  <td className="py-4 px-2 text-gray-500 text-xs"><span className="mr-1.5 opacity-50">👥</span> {row.part}</td>
                  <td className="py-4 px-2">
                     <div className="font-bold text-[#0A1128] text-xs mb-1">{row.prog}</div>
                     <div className="w-10 h-1 bg-blue-600 rounded"></div>
                  </td>
                  <td className="py-4 px-2">
                     <p className={`text-xs ${row.highlight ? 'bg-blue-600 text-white px-1.5 py-0.5 rounded w-max' : 'text-gray-600'}`}>{row.date}</p>
                     <p className="text-[10px] text-gray-400 mt-0.5">{row.time}</p>
                  </td>
                  <td className="py-4 px-2 text-gray-400 space-x-3 text-sm">
                     <span className="hover:text-black">👁</span>
                     <span className="hover:text-black">✏️</span>
                     <span className="hover:text-black">📄</span>
                     <span className="hover:text-black">📥</span>
                     <span className="hover:text-black">⏸</span>
                     <span className="hover:text-red-500">🗑</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // =======================================
  // 3. صفحة نتائج الامتحانات
  // =======================================
  const renderResults = () => (
    <div className="animate-fade-in pb-10">
      
      <div className="mb-8 border-b border-gray-200 pb-5">
        <h2 className="text-3xl font-bold text-[#0A1128] mb-2">Exam Results</h2>
        <p className="text-sm text-gray-500">View and analyze student performance across all exams</p>
      </div>

      <div className="flex justify-between items-center mb-8">
        <select className="bg-transparent text-[#0A1128] font-bold text-base outline-none cursor-pointer w-80">
          <option>Mathematics Mid-Term Exam - 9 Niaz</option>
        </select>
        <div className="flex space-x-6">
          <button className="text-sm font-bold text-gray-600 hover:text-black flex items-center cursor-pointer transition-colors">
            <span className="mr-2 text-lg">📥</span> Export CSV
          </button>
          <button className="text-sm font-bold text-gray-600 hover:text-black flex items-center cursor-pointer transition-colors">
            <span className="mr-2 text-lg">📥</span> Export PDF
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mb-10 flex divide-x divide-gray-100">
        <div className="flex-1 px-6 flex justify-between items-center">
          <div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">Total Students</p>
            <p className="text-4xl font-bold text-[#0A1128] leading-none">35</p>
          </div>
          <span className="text-blue-500 text-3xl opacity-90">👥</span>
        </div>
        <div className="flex-1 px-8 flex justify-between items-center">
          <div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">Completed</p>
            <p className="text-4xl font-bold text-[#0A1128] leading-none">33</p>
          </div>
          <span className="text-blue-400 text-3xl opacity-90">📄</span>
        </div>
        <div className="flex-1 px-8 flex justify-between items-center">
          <div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">Average Score</p>
            <p className="text-4xl font-bold text-[#0A1128] leading-none">76.5%</p>
          </div>
          <span className="text-green-500 text-3xl opacity-90">📊</span>
        </div>
        <div className="flex-1 px-8 flex justify-between items-center">
          <div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">Pass Rate</p>
            <p className="text-4xl font-bold text-[#0A1128] leading-none">78.8%</p>
          </div>
          <span className="text-orange-500 text-3xl opacity-90">🏅</span>
        </div>
      </div>

      <div className="mb-12 pl-2">
        <h3 className="font-bold text-[#0A1128] text-xl mb-2">Mathematics Mid-Term Exam</h3>
        <p className="text-sm text-gray-500 mb-8">Mathematics • 9 Niaz • Conducted on 20/12/2023</p>
        
        <div className="grid grid-cols-3 gap-6 text-base max-w-3xl">
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Duration</p>
            <p className="font-bold text-[#0A1128] text-lg">90 minutes</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Passing Score</p>
            <p className="font-bold text-[#0A1128] text-lg">60%</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Completion Rate</p>
            <p className="font-bold text-[#0A1128] text-lg">94%</p>
          </div>
        </div>
      </div>

      <div className="mb-6 bg-white/50 rounded-2xl p-5 border border-gray-100">
        <div className="mb-6 border-b border-gray-200 pb-4">
          <h3 className="font-bold text-[#0A1128] text-lg mb-1">Student Results</h3>
          <p className="text-sm text-gray-500">Detailed results for each student who attempted the exam</p>
        </div>
        
        <div className="flex justify-between items-center mb-6">
           <div className="relative w-80 bg-gray-50 rounded-lg">
             <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 text-sm">🔍</span>
             <input type="text" placeholder="Search students by name or ID..." className="w-full bg-transparent py-2.5 pl-10 pr-4 text-sm outline-none text-gray-600" />
           </div>
           <select className="bg-transparent border-none py-2 text-sm font-bold text-gray-600 outline-none cursor-pointer">
             <option>All Grades</option>
           </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 text-[#0A1128] font-bold">
              <tr>
                <th className="py-4 px-3">Student</th>
                <th className="py-4 px-3">Score</th>
                <th className="py-4 px-3">Percentage</th>
                <th className="py-4 px-3">Grade</th>
                <th className="py-4 px-3">Status</th>
                <th className="py-4 px-3">Time Spent</th>
                <th className="py-4 px-3">Submission Time</th>
                <th className="py-4 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                { name: "Ahmad Ali", id: "9N001", score: "85/100", perc: 85, grade: "A", status: "Passed", time: "87m", sub: "10:27" },
                { name: "Fatima Khan", id: "9N002", score: "92/100", perc: 92, grade: "A+", status: "Passed", time: "89m", sub: "10:29" },
                { name: "Hassan Ahmed", id: "9N003", score: "68/100", perc: 68, grade: "B", status: "Passed", time: "90m", sub: "10:30" },
                { name: "Aisha Malik", id: "9N004", score: "45/100", perc: 45, grade: "F", status: "Failed", time: "78m", sub: "10:18" },
              ].map((s, i) => (
                <tr key={i} className="hover:bg-gray-50/80 transition-colors">
                  <td className="py-4 px-3">
                    <p className="font-bold text-[#0A1128] text-base">{s.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{s.id}</p>
                  </td>
                  <td className="py-4 px-3 font-medium text-[#0A1128]">{s.score}</td>
                  <td className="py-4 px-3">
                    <div className="flex items-center">
                      <span className="font-bold text-[#0A1128] w-10">{s.perc}%</span>
                      <div className="w-10 h-2 bg-blue-600 rounded-full ml-2"></div>
                    </div>
                  </td>
                  <td className={`py-4 px-3 font-bold ${s.grade === 'F' ? 'text-red-500' : 'text-green-500'}`}>{s.grade}</td>
                  <td className="py-4 px-3">
                     <span className={`px-3 py-1 text-xs font-bold uppercase rounded ${s.status === 'Failed' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                       {s.status}
                     </span>
                  </td>
                  <td className="py-4 px-3 text-gray-500 flex items-center"><span className="mr-2 text-sm">⏱</span>{s.time}</td>
                  <td className="py-4 px-3 text-gray-500">{s.sub}</td>
                  <td className="py-4 px-3 text-center">
                     <button className="text-gray-400 hover:text-[#0A1128] cursor-pointer text-lg">👁</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // =======================================
  // 4. صفحة إنشاء امتحان 
  // =======================================
  const renderCreateExam = () => (
    <div className="animate-fade-in max-w-4xl mx-auto pb-10">
      <div className="mb-10 border-b border-gray-200 pb-5">
        <h2 className="text-3xl font-bold text-[#0A1128] mb-2">Create New Exam</h2>
        <p className="text-sm text-gray-500">Create an exam by uploading a PDF and providing instructions</p>
      </div>

      <div className="flex items-center justify-center mb-12 space-x-6">
        <div className="flex items-center text-blue-600 font-bold text-base">
          <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mr-3 text-sm">1</span>
          Exam Details
        </div>
        <div className={`w-20 h-0.5 ${createStep === 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
        <div className={`flex items-center text-base font-bold ${createStep === 2 ? 'text-blue-600' : 'text-gray-400'}`}>
          <span className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm ${createStep === 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>2</span>
          Upload PDF
        </div>
      </div>

      <div className="bg-gray-50/50 border border-gray-100 rounded-3xl p-10 shadow-sm">
        {createStep === 1 ? (
          <div className="animate-fade-in">
            <h3 className="text-xl font-bold text-[#0A1128] mb-2">Step 1: Exam Information</h3>
            <p className="text-sm text-gray-500 mb-8">Provide basic information about your exam</p>

            <div className="grid grid-cols-2 gap-x-10 gap-y-6 mb-8">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Exam Title</label>
                <input type="text" placeholder="math" className="w-full bg-gray-100 border-none rounded-xl px-5 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Subject</label>
                <select className="w-full bg-gray-100 border-none rounded-xl px-5 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-sm cursor-pointer">
                  <option>Physics</option><option>Mathematics</option><option>English</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Class</label>
                <select className="w-full bg-gray-100 border-none rounded-xl px-5 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-sm cursor-pointer">
                  <option>8 Liaqat</option><option>9 Niaz</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Duration (minutes)</label>
                <input type="number" placeholder="60" className="w-full bg-gray-100 border-none rounded-xl px-5 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
              </div>
            </div>
            <div className="mb-10">
              <label className="block text-sm font-bold text-gray-700 mb-2">Exam Instructions</label>
              <textarea rows="4" placeholder="Instructions here..." className="w-full bg-gray-100 border-none rounded-xl px-5 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"></textarea>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-8">
              <button className="text-gray-400 font-medium text-sm cursor-not-allowed">Previous</button>
              <button onClick={() => setCreateStep(2)} className="bg-[#0A1128] text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors cursor-pointer">Next</button>
            </div>
          </div>
        ) : (
          <div className="animate-fade-in py-6">
            <h3 className="text-xl font-bold text-[#0A1128] mb-2">Step 2: Upload Exam PDF</h3>
            <p className="text-sm text-gray-500 mb-8">Upload the PDF containing your exam questions</p>
            
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-20 mb-10 bg-transparent hover:bg-white transition-colors cursor-pointer flex flex-col items-center">
               <span className="text-5xl text-gray-400 mb-6">📤</span>
               <p className="font-bold text-[#0A1128] text-lg mb-2">Upload Exam PDF</p>
               <p className="text-sm text-gray-500 mb-6">Upload the PDF containing the exam questions</p>
               <button className="bg-transparent text-[#0A1128] px-6 py-2.5 rounded-xl text-sm font-bold border border-gray-300 flex items-center">
                 <span className="mr-2 text-lg">↑</span> Choose PDF File
               </button>
            </div>

            <div className="flex justify-between border-t border-gray-200 pt-8">
              <button onClick={() => setCreateStep(1)} className="text-gray-600 font-bold text-sm hover:text-black cursor-pointer">Previous</button>
              <button onClick={() => setExamView('manage')} className="bg-[#0A1128] text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors cursor-pointer">Finish & Save</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // =======================================
  // 5. صفحة جدول الامتحانات
  // =======================================
  const renderSchedule = () => (
    <div className="animate-fade-in pb-10">
      <div className="mb-8 border-b border-gray-200 pb-5">
        <h2 className="text-3xl font-bold text-[#0A1128] mb-2">Exam Schedule</h2>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm overflow-x-auto">
        <div className="min-w-[900px]">
          <div className="grid grid-cols-6 gap-4 mb-6 text-center border-b border-gray-100 pb-6">
            <div className="text-gray-400 font-bold text-sm">🕒 Time</div>
            <div><p className="text-blue-600 font-bold text-sm uppercase mb-1">Mon</p><p className="text-xl font-black text-[#0A1128]">Oct 23</p></div>
            <div><p className="text-gray-500 font-bold text-sm uppercase mb-1">Tue</p><p className="text-xl font-black text-[#0A1128]">Oct 24</p></div>
            <div><p className="text-gray-500 font-bold text-sm uppercase mb-1">Wed</p><p className="text-xl font-black text-[#0A1128]">Oct 25</p></div>
            <div><p className="text-gray-500 font-bold text-sm uppercase mb-1">Thu</p><p className="text-xl font-black text-[#0A1128]">Oct 26</p></div>
            <div><p className="text-gray-500 font-bold text-sm uppercase mb-1">Fri</p><p className="text-xl font-black text-[#0A1128]">Oct 27</p></div>
          </div>

          <div className="grid grid-cols-6 gap-4 text-base relative">
            <div className="space-y-20 text-gray-400 font-bold text-sm text-center pt-6">
              <div>10:00 AM</div>
              <div>12:00 PM</div>
              <div>02:00 PM</div>
              <div>04:00 PM</div>
            </div>

            <div className="relative">
              <div className="absolute top-4 w-full bg-green-50 border-l-4 border-green-500 p-4 rounded-r-xl shadow-sm">
                <p className="text-xs font-bold text-green-600 mb-2 uppercase tracking-wide">Level A1</p>
                <p className="font-bold text-[#0A1128] text-base mb-1">German Quiz</p>
                <p className="text-xs text-gray-500">Room 4 • Dr. Sara</p>
              </div>
              <div className="absolute top-48 w-full bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-xl shadow-sm">
                <p className="text-xs font-bold text-blue-600 mb-2 uppercase tracking-wide">Level B2</p>
                <p className="font-bold text-[#0A1128] text-base mb-1">English Test</p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute top-12 w-full bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-xl shadow-sm">
                <p className="text-xs font-bold text-orange-600 mb-2 uppercase tracking-wide">Level C1</p>
                <p className="font-bold text-[#0A1128] text-base mb-1">Spanish Oral</p>
                <p className="text-xs text-gray-500">Room 2</p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute top-4 w-full bg-green-50 border-l-4 border-green-500 p-4 rounded-r-xl shadow-sm">
                <p className="text-xs font-bold text-green-600 mb-2 uppercase tracking-wide">Level A1</p>
                <p className="font-bold text-[#0A1128] text-base mb-1">German Quiz</p>
              </div>
              <div className="absolute top-32 w-full bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-xl shadow-sm">
                <p className="text-xs font-bold text-blue-600 mb-2 uppercase tracking-wide">Level B2</p>
                <p className="font-bold text-[#0A1128] text-base mb-1">English Final</p>
                <p className="text-xs text-gray-500">Hall B</p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute top-10 w-full bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-xl shadow-sm">
                <p className="text-xs font-bold text-purple-600 mb-2 uppercase tracking-wide">Level B1</p>
                <p className="font-bold text-[#0A1128] text-base mb-1">French Written</p>
                <p className="text-xs text-gray-500">Room 5</p>
              </div>
            </div>

            <div className="relative border-l border-dashed border-gray-200 pl-4">
               <div className="absolute top-32 w-full bg-gray-100 p-5 rounded-xl text-center border border-gray-200">
                <p className="text-sm font-bold text-gray-400 mt-2 uppercase tracking-widest">No Exams</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-8 h-full overflow-y-auto bg-transparent custom-scrollbar">
      {examView === 'home' && renderHome()}
      {examView === 'manage' && renderManageExams()}
      {examView === 'results' && renderResults()}
      {examView === 'create' && renderCreateExam()}
      {examView === 'schedule' && renderSchedule()}
    </div>
  );
};

export default Exams;
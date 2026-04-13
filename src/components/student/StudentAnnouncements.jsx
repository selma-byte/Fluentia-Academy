import React, { useState } from 'react';

const StudentAnnouncements = () => {

  // نفس الداتا (student يقرأ فقط)
  const [announcements] = useState([
    { id: 1, type: 'Event', date: 'Oct 25, 2025', title: 'Winter Festival Planning Meeting', content: 'We are organizing our annual Winter Festival! Teachers and staff interested in helping with planning, please join us this Thursday at 4 PM in the staff room.', author: 'Admin' },
    { id: 2, type: 'Reminder', date: 'Oct 26, 2025', title: 'Homework Submission Deadline', content: 'Reminder: All assignments for Mathematics (Grade 7) are due this Friday, November 1st. Please submit through the online portal before 3 PM.', author: 'Teacher' },
    { id: 3, type: 'General', date: 'Oct 27, 2025', title: 'New Library Books Available', content: 'We\'ve added 150 new books to our library collection! Students can now browse and check out books in Danish, English, and other languages. Visit the library during lunch hours.', author: 'Admin' },
    { id: 4, type: 'Urgent', date: 'Oct 29, 2025', title: 'School Closure - Weather Alert', content: 'Due to severe weather conditions, the school will be closed tomorrow, October 30th. All classes will move to online learning.', author: 'Admin' },
    { id: 5, type: 'Event', date: 'Oct 28, 2025', title: 'Parent-Teacher Conference Schedule', content: 'Parent-teacher conferences are scheduled for November 15-16. Please use the online booking system to reserve your time slot. Conferences will be 15 minutes each.', author: 'Admin' },
  ]);

  // نفس الستايل تاع الـ tags
  const getTagStyle = (type) => {
    switch (type) {
      case 'Event': return 'bg-[#e6fbf2] text-[#00a65e]';
      case 'Reminder': return 'bg-[#fff8e6] text-[#f5a623]';
      case 'Urgent': return 'bg-[#fdeaea] text-[#e02424]';
      case 'General': default: return 'bg-[#eef2ff] text-[#4318FF]';
    }
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto custom-scrollbar animate-fadeIn relative">
      
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <h1 className="text-3xl font-bold text-[#1B254B]">👋 Welcome, [Student Name]</h1>
      </div>

      <div className="flex gap-8">
        
        {/* =======================================
            LEFT SIDE (Announcements)
            ======================================= */}
        <div className="flex-1">
          
          <div className="bg-[#f8fafc] rounded-2xl p-6 flex justify-between items-center mb-8 border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="z-10">
              <h2 className="text-2xl font-bold text-[#1B254B] mb-2">Announcements</h2>
              <p className="text-gray-500 text-sm mb-4">Stay updated with the latest news and important notices.</p>
            </div>
            <div className="hidden md:flex gap-4 items-center z-10 opacity-80">
               <span className="text-6xl">📢📰</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
            {announcements.map((ann) => (
              <div key={ann.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-3 py-1 rounded-md text-xs font-bold ${getTagStyle(ann.type)}`}>
                    {ann.type}
                  </span>
                  <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                    📅 {ann.date}
                  </span>
                </div>
                
                <h3 className="font-bold text-[#1B254B] text-lg mb-2 leading-tight">{ann.title}</h3>
                <p className="text-sm text-gray-500 mb-6 flex-1 line-clamp-4 leading-relaxed">{ann.content}</p>
                
                <div className="flex items-center gap-2 pt-4 border-t border-gray-50">
                  <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600">
                    {ann.author.charAt(0)}
                  </div>
                  <span className="text-xs font-medium text-gray-500">{ann.author}</span>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* =======================================
            RIGHT SIDE (Calendar)
            ======================================= */}
        <div className="w-[320px] shrink-0">
          <div className="flex justify-end text-xs font-bold text-[#A3AED0] mb-2">
            12 Jan 2024, Friday
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-xs font-bold text-[#1B254B]">Semester 3 of 8</p>
            </div>
            <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden mb-6">
              <div className="h-full bg-[#111C44] w-[37%] rounded-full"></div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
             <div className="flex justify-between items-center mb-4">
                <button className="text-[#1B254B] font-bold">{'<'}</button>
                <h4 className="font-bold text-[#1B254B] text-sm">January 2024</h4>
                <button className="text-[#1B254B] font-bold">{'>'}</button>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-[#A3AED0] font-bold mb-3">
                <div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div><div>Su</div>
              </div>
              <div className="grid grid-cols-7 gap-y-3 gap-x-1 text-center text-[13px] font-medium text-[#1B254B]">
                <div className="text-gray-300">29</div><div className="text-gray-300">30</div><div className="text-gray-300">31</div>
                <div>1</div><div>2</div><div>3</div><div>4</div>
                <div>5</div><div>6</div><div>7</div><div>8</div><div>9</div><div>10</div><div>11</div>
                <div className="bg-[#111C44] text-white w-7 h-7 rounded-full flex items-center justify-center mx-auto shadow-md">12</div>
                <div>13</div><div>14</div><div>15</div><div>16</div><div>17</div><div>18</div>
              </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentAnnouncements;
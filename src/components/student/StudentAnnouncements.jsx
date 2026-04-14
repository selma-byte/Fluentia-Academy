import React, { useState } from 'react';

const StudentAnnouncements = () => {
  const [announcements] = useState([
    { 
      id: 1, 
      type: 'Event', 
      date: 'Oct 25, 2025', 
      title: 'Winter Festival Planning Meeting', 
      content: "We're organizing our annual Winter Festival! Teachers and staff interested in helping with planning, please join us this Thursday at 4 PM in the staff room.", 
      author: 'Admin' 
    },
    { 
      id: 2, 
      type: 'Reminder', 
      date: 'Oct 26, 2025', 
      title: 'Homework Submission Deadline', 
      content: 'Reminder: All assignments for Mathematics (Grade 7) are due this Friday, November 1st. Please submit through the online portal before 3 PM.', 
      author: 'Teacher' 
    },
    { 
      id: 3, 
      type: 'General', 
      date: 'Oct 27, 2025', 
      title: 'New Library Books Available', 
      content: "We've added 150 new books to our library collection! Students can now browse and check out books in Danish, English, and other languages. Visit the library during lunch hours.", 
      author: 'Admin' 
    },
    { 
      id: 4, 
      type: 'Urgent', 
      date: 'Oct 29, 2025', 
      title: 'School Closure - Weather Alert', 
      content: 'Due to severe weather conditions, the school will be closed tomorrow, October 30th. All classes will move to online learning.', 
      author: 'Admin' 
    },
    { 
      id: 5, 
      type: 'Event', 
      date: 'Oct 28, 2025', 
      title: 'Parent-Teacher Conference Schedule', 
      content: 'Parent-teacher conferences are scheduled for November 15-16. Please use the online booking system to reserve your time slot. Conferences will be 15 minutes each.', 
      author: 'Admin' 
    },
  ]);

  const getTagStyle = (type) => {
    switch (type) {
      case 'Event': return 'bg-[#e6fbf2] text-[#00a65e]';
      case 'Reminder': return 'bg-[#fff8e6] text-[#f5a623]';
      case 'Urgent': return 'bg-[#fdeaea] text-[#e02424]';
      case 'General': default: return 'bg-[#eef2ff] text-[#4318FF]';
    }
  };

  return (
    <div className="flex-1 animate-fadeIn">
      <div className="bg-white rounded-[20px] p-8 flex justify-between items-center mb-8 shadow-sm border border-gray-50 relative overflow-hidden">
        <div className="z-10">
          <h2 className="text-3xl font-bold text-[#1B254B] mb-2">Announcements</h2>
          <p className="text-[#A3AED0] text-base">Stay updated with the latest news and important notices.</p>
        </div>
        <div className="hidden md:flex gap-4 items-center z-10 opacity-80 text-5xl">
          📢📰
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
        {announcements.map((ann) => (
          <div key={ann.id} className="bg-white border border-gray-100 rounded-[20px] p-6 shadow-[0px_18px_40px_rgba(112,144,176,0.06)] hover:shadow-md transition-all flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase ${getTagStyle(ann.type)}`}>
                {ann.type}
              </span>
              <span className="text-[11px] text-[#A3AED0] font-medium flex items-center gap-1">
                📅 {ann.date}
              </span>
            </div>
            
            <h3 className="font-bold text-[#1B254B] text-lg mb-2 leading-tight">{ann.title}</h3>
            <p className="text-sm text-[#707EAE] mb-6 flex-1 line-clamp-4 leading-relaxed">{ann.content}</p>
            
            <div className="flex items-center gap-2 pt-4 border-t border-gray-50">
              <div className="w-7 h-7 rounded-full bg-[#F4F7FE] flex items-center justify-center text-[10px] font-bold text-[#4318FF]">
                {ann.author.charAt(0)}
              </div>
              <span className="text-xs font-bold text-[#707EAE]">{ann.author}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentAnnouncements;
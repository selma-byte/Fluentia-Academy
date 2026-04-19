import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

const Icons = {
  Play: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>,
  Download: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>,
  ArrowLeft: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>,
  FileText: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
};

const StudentCourses = () => {
  const [currentView, setCurrentView] = useState('list'); // 'list', 'classroom', 'learning'
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const courseMockData = [
      { 
        id: 1,
        name: "French Proficiency – B1", 
        instructor: "Dr. Jean-Pierre",
        rating: "4.8", 
        students: "22 Enrolled",
        schedule: "Tue & Thu 09:00 AM",
        platform: "Virtual Classroom 02",
        img: "https://images.pexels.com/photos/267507/pexels-photo-267507.jpeg?auto=compress&cs=tinysrgb&w=800",
        lectures: [
          { id: 101, title: "Introduction to B1 Grammar", duration: "45:00", pdf: "Grammar_Basics.pdf" },
          { id: 102, title: "Complex Sentence Structures", duration: "52:15", pdf: "Structures_Advanced.pdf" },
          { id: 103, title: "Oral Expression Workshop", duration: "38:40", pdf: "Speaking_Guide.pdf" }
        ]
      },
      { 
        id: 2,
        name: "German Communication – A1", 
        instructor: "Hans Werner",
        rating: "4.5", 
        students: "27 Enrolled",
        schedule: "Wed 14:00 PM",
        platform: "Virtual Classroom 14",
        img: "https://images.pexels.com/photos/5212320/pexels-photo-5212320.jpeg?auto=compress&cs=tinysrgb&w=800",
        lectures: [
          { id: 201, title: "Greetings & Phonetics", duration: "30:00", pdf: "A1_Intro.pdf" },
          { id: 202, title: "The Case System Simplified", duration: "55:00", pdf: "Cases_Dative.pdf" }
        ]
      },
      { 
        id: 3,
        name: "English Advanced Grammar – B2", 
        instructor: "Dr. Robert Wilson",
        rating: "4.9", 
        students: "30 Enrolled",
        schedule: "Mon & Wed 09:00 AM",
        platform: "Virtual Classroom 03",
        img: "https://images.pexels.com/photos/5940721/pexels-photo-5940721.jpeg?auto=compress&cs=tinysrgb&w=800",
        lectures: [
          { id: 301, title: "Tense Masterclass", duration: "50:00", pdf: "English_Tenses.pdf" }
        ]
      },
      { 
        id: 4,
        name: "Spanish Conversation – A2", 
        instructor: "Maria Garcia",
        rating: "4.7", 
        students: "25 Enrolled",
        schedule: "Fri 10:00 AM",
        platform: "Virtual Classroom 05",
        img: "https://images.pexels.com/photos/5128207/pexels-photo-5128207.jpeg?auto=compress&cs=tinysrgb&w=800",
        lectures: [
          { id: 401, title: "Practical Dialogues", duration: "40:00", pdf: "Spanish_Convo.pdf" }
        ]
      },
      { 
        id: 5,
        name: "Italian Vocabulary – B1", 
        instructor: "Luca Rossini",
        rating: "4.6", 
        students: "18 Enrolled",
        schedule: "Thu 16:00 PM",
        platform: "Virtual Classroom 08",
        img: "https://images.pexels.com/photos/4974912/pexels-photo-4974912.jpeg?auto=compress&cs=tinysrgb&w=800",
        lectures: [
          { id: 501, title: "Daily Life Phrases", duration: "35:00", pdf: "Italian_Vocab.pdf" }
        ]
      },
      { 
        id: 6,
        name: "Arabic Calligraphy – B2", 
        instructor: "Ahmed Al-Farsi",
        rating: "4.9", 
        students: "15 Enrolled",
        schedule: "Sat 11:00 AM",
        platform: "Virtual Classroom 01",
        img: "https://images.pexels.com/photos/4606770/pexels-photo-4606770.jpeg?auto=compress&cs=tinysrgb&w=800",
        lectures: [
          { id: 601, title: "Art of Kufic Script", duration: "60:00", pdf: "Calligraphy_Guide.pdf" }
        ]
      }
    ];
    setClasses(courseMockData);
  }, []);

  // --- LEVEL 3: ACTIVE LEARNING VIEW (Video + Specific PDF) ---
  if (currentView === 'learning') {
    return (
      <div className="flex-1 flex flex-col space-y-8 animate-fadeIn pb-12">
        <button 
          onClick={() => setCurrentView('classroom')} 
          className="group text-[#A3AED0] text-xs hover:text-[#4318FF] flex items-center gap-3 font-black uppercase tracking-[0.2em] transition-all w-fit"
        >
          <div className="bg-white p-2 rounded-lg shadow-sm group-hover:shadow-md transition-all"><Icons.ArrowLeft /></div>
          Back to Lectures
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white p-4 rounded-[45px] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="aspect-video bg-black rounded-[35px] flex items-center justify-center relative group cursor-pointer shadow-2xl">
                        <div className="bg-white/10 backdrop-blur-md w-24 h-24 rounded-full flex items-center justify-center border border-white/20">
                            <Icons.Play />
                        </div>
                        <div className="absolute bottom-6 left-10 text-white font-black uppercase tracking-widest text-[10px]">
                            Currently Streaming: {selectedLecture.title}
                        </div>
                    </div>
                </div>
                <div className="px-6">
                    <h2 className="text-2xl font-black text-[#1B254B] uppercase tracking-tighter mb-2">{selectedLecture.title}</h2>
                    <p className="text-[#A3AED0] text-xs font-bold uppercase tracking-widest">{selectedClass.name} • {selectedClass.instructor}</p>
                </div>
            </div>

            <div className="space-y-8">
                <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
                    <h4 className="text-[11px] font-black text-[#1B254B] uppercase tracking-[0.2em] mb-8 border-b pb-4">Lecture Assets</h4>
                    <div className="p-6 bg-[#F4F7FE] rounded-[30px] border border-[#4318FF]/5 group cursor-pointer hover:bg-[#4318FF] transition-all duration-300">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-white p-3 rounded-xl text-[#4318FF] shadow-sm"><Icons.FileText /></div>
                            <span className="text-[13px] font-black text-[#1B254B] group-hover:text-white uppercase tracking-tight">{selectedLecture.pdf}</span>
                        </div>
                        <button className="w-full py-3 bg-white/20 rounded-xl text-[10px] font-black text-[#4318FF] group-hover:text-white uppercase tracking-widest border border-transparent group-hover:border-white/30">Download PDF</button>
                    </div>
                </div>
            </div>
        </div>
      </div>
    );
  }

  // --- LEVEL 2: CLASSROOM DASHBOARD (Lecture List) ---
  if (currentView === 'classroom') {
    return (
      <div className="flex-1 flex flex-col space-y-8 animate-fadeIn pb-12">
        <button onClick={() => setCurrentView('list')} className="text-[#A3AED0] text-xs font-black uppercase tracking-widest hover:text-[#4318FF] flex items-center gap-3 transition-all w-fit">
          <Icons.ArrowLeft /> Course Catalog
        </button>

        <div className="bg-white rounded-[45px] p-12 shadow-sm border border-gray-100">
            <h2 className="text-3xl font-black text-[#1B254B] mb-10 uppercase tracking-tighter border-b pb-8">{selectedClass?.name}</h2>
            <div className="space-y-4">
                <h4 className="text-[11px] font-black text-[#A3AED0] uppercase tracking-[0.3em] mb-6">Unit Curriculum</h4>
                {selectedClass.lectures.map((lecture, idx) => (
                  <div 
                    key={lecture.id}
                    onClick={() => { setSelectedLecture(lecture); setCurrentView('learning'); }}
                    className="flex flex-col md:flex-row justify-between items-center p-8 bg-[#F4F7FE] rounded-[35px] border border-transparent hover:border-[#4318FF]/20 hover:bg-white hover:shadow-xl transition-all duration-300 group cursor-pointer"
                  >
                    <div className="flex items-center gap-8">
                        <span className="text-2xl font-black text-[#1B254B]/10 group-hover:text-[#4318FF]/20">0{idx + 1}</span>
                        <div className="space-y-1">
                            <h5 className="text-[16px] font-black text-[#1B254B] uppercase tracking-tight">{lecture.title}</h5>
                            <p className="text-[10px] font-bold text-[#A3AED0] uppercase tracking-widest">Runtime: {lecture.duration}</p>
                        </div>
                    </div>
                    <div className="mt-4 md:mt-0 flex items-center gap-3">
                        <div className="px-5 py-2 bg-white rounded-full text-[10px] font-black text-[#4318FF] uppercase tracking-widest border border-gray-100">Available</div>
                        <div className="bg-[#4318FF] text-white p-3 rounded-2xl shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform"><Icons.Play /></div>
                    </div>
                  </div>
                ))}
            </div>
        </div>
      </div>
    );
  }

  // --- LEVEL 1: GRID VIEW ---
  return (
    <div className="flex-1 flex flex-col xl:flex-row gap-12 animate-fadeIn pb-12">
      <div className="flex-1 flex flex-col space-y-12">
        <div className="bg-[#EBE9F1] rounded-[50px] p-12 flex justify-between items-center relative overflow-hidden min-h-[240px] shadow-sm">
          <div className="z-10 w-full md:w-3/5">
            <h2 className="text-3xl font-black text-[#1B254B] mb-4 uppercase tracking-tighter">My Enrolled Paths</h2>
            <p className="text-[#1B254B]/60 text-sm mb-10 leading-relaxed font-bold max-w-lg uppercase tracking-widest opacity-70">Access your digital lectures, academic assets, and synchronized modules.</p>
            <button className="bg-[#111C44] text-white px-10 py-4.5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl">Learning Roadmap</button>
          </div>
          <div className="absolute right-[-20px] bottom-[-20px] opacity-10 text-[260px] font-black pointer-events-none select-none">F</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-10">
          {classes.map((cls) => (
            <div key={cls.id} className="bg-white rounded-[45px] overflow-hidden shadow-sm hover:shadow-[0_20px_50px_rgba(67,24,255,0.15)] transition-all duration-500 border border-gray-100 flex flex-col group active:scale-95">
              <div className="h-[240px] w-full relative overflow-hidden bg-[#F4F7FE]">
                <img src={cls.img} alt={cls.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]" />
                <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/20"><span className="text-[#4318FF] font-black text-[12px] tracking-widest">★ {cls.rating}</span></div>
              </div>
              <div className="p-10 flex flex-col flex-1">
                <h3 className="text-[18px] font-black text-[#1B254B] mb-8 uppercase tracking-tighter leading-tight group-hover:text-[#4318FF] transition-colors">{cls.name}</h3>
                <div className="space-y-4 mb-10">
                  <div className="flex items-center gap-5 text-[#A3AED0] text-[11px] font-black uppercase tracking-widest">
                    <span className="w-10 h-10 rounded-[18px] bg-[#F4F7FE] flex items-center justify-center text-[#1B254B] text-xs font-black shadow-sm group-hover:bg-[#4318FF] group-hover:text-white transition-all">#</span> {cls.students}
                  </div>
                  <div className="flex items-center gap-5 text-[#A3AED0] text-[11px] font-black uppercase tracking-widest">
                    <span className="w-10 h-10 rounded-[18px] bg-[#F4F7FE] flex items-center justify-center text-[#1B254B] text-xs font-black shadow-sm group-hover:bg-[#4318FF] group-hover:text-white transition-all">@</span> {cls.schedule}
                  </div>
                </div>
                <button onClick={() => { setSelectedClass(cls); setCurrentView('classroom'); }} className="mt-auto w-full py-5 bg-[#F4F7FE] text-[#4318FF] rounded-[24px] text-[11px] font-black uppercase tracking-[0.2em] shadow-lg hover:bg-[#4318FF] hover:text-white transition-all">Enter Classroom Hub</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full xl:w-[380px] shrink-0 flex flex-col space-y-10">
        <div className="bg-white p-10 rounded-[50px] shadow-sm border border-gray-50">
          <p className="text-[11px] font-black text-[#1B254B] mb-10 uppercase tracking-[0.3em] border-b border-gray-50 pb-6 text-center">Your Progress</p>
          <div className="space-y-12 text-center">
             <p className="text-[10px] font-black text-[#A3AED0] uppercase mb-2 tracking-[0.2em]">Overall Attendance</p>
             <p className="text-5xl font-black text-[#1B254B] tracking-tighter italic">94.5%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCourses;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

// Import remaining components (Ensure these files exist in your folder)
import TeacherClasses from './TeacherClasses';
import TeacherCommunications from './TeacherCommunications';
import ClassroomTasks from './ClassroomTasks';

const Dashboardt = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const navigate = useNavigate();

  // 💡 State for dynamic data
  const [teacherInfo, setTeacherInfo] = useState(null);
  const [myClasses, setMyClasses] = useState([]);
  const [studentsProgress, setStudentsProgress] = useState([]);
  const [dailyTasks, setDailyTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  // ==========================================
  // 💡 Fetch dynamic data from Supabase (Real Auth 100%)
  // ==========================================
  // ==========================================
  // 💡 Fetch dynamic data from Supabase (Real Auth + Real Students)
  // ==========================================
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        // 1. نجيبو اليوزر اللي راهو مكونيكتي
        const { data: { user } } = await supabase.auth.getUser();

        if (user && user.email) {
          // 2. نجيبو معلومات الأستاذ من طابلو 'staff' 
          const { data: teacherData } = await supabase
            .from('staff')
            .select('*')
            .eq('email', user.email) 
            .single();
            
          if (teacherData) {
            setTeacherInfo(teacherData);
            
            // نركبو الاسم باش نحوسو بيه في طابلو classes
            const currentTeacherName = `${teacherData.first_name} ${teacherData.last_name}`.trim();

            // 3. نجيبو الأقسام تاع هاد الأستاذ
            const { data: classesData } = await supabase
              .from('classes')
              .select('*')
              .eq('teacher_name', currentTeacherName); 

            let classNamesList = []; // 💡 نخبيو أسماء الأقسام هنا باش نجبدو بيهم الطلبة مبعد

            if (classesData && classesData.length > 0) {
              classNamesList = classesData.map(c => c.name); // مثلا: ['grp3', 'English A1 - Group 3']

              const colors = ['bg-[#C5B8D8] text-[#35254A]', 'bg-[#E5D2A6] text-[#4A3A17]', 'bg-[#A4C2D1] text-[#1F3340]', 'bg-[#A9C4A3] text-[#23331E]'];
              
              const formattedClasses = classesData.map((c, index) => ({
                id: c.id,
                name: c.name || c.class_name || "Unnamed Class", 
                language: c.language || c.subject || "Subject",
                studentsCount: c.capacity || Math.floor(Math.random() * 15) + 10,
                colorClass: colors[index % colors.length]
              }));
              setMyClasses(formattedClasses);
            } else {
              setMyClasses([]); 
            }

            // ==========================================
            // 💡 4. نجيبو الطلبة (Students) تاع هاد الأستاذ بالذات
            // ==========================================
            if (classNamesList.length > 0) {
              // نجيبو غير الطلبة اللي الـ group_name ديالهم يطابق أقسام الأستاذ
              const { data: studentsData, error: studentsError } = await supabase
                .from('students')
                .select('*')
                .in('group_name', classNamesList); 

              if (studentsData && studentsData.length > 0) {
                const formattedStudents = studentsData.map(s => ({
                  name: `${s.first_name || ''} ${s.last_name || ''}`.trim(),
                  course: s.language || s.group_name || "Course",
                  level: s.level || "N/A",
                  grade: "-", // 💡 النقاط مازال مادخلتيهمش في الداتا باز، نديرو مطة مؤقتاً
                  status: s.status === 'Active' ? "ACTIVE" : (s.status || "PENDING").toUpperCase(),
                  color: s.status === 'Active' ? "text-[#38A169]" : "text-[#DD6B20]"
                }));
                setStudentsProgress(formattedStudents);
              } else {
                setStudentsProgress(getFallbackProgress());
              }
            } else {
              setStudentsProgress(getFallbackProgress()); // إذا الأستاذ ما عندوش أقسام
            }
          }
        } else {
          console.warn("No authenticated user found. Please login.");
        }

        // --- Fetch Daily Tasks ---
        const { data: tasksData } = await supabase.from('tasks').select('*').limit(2);
        if (tasksData && tasksData.length > 0) {
          setDailyTasks(tasksData);
        } else {
          setDailyTasks(getFallbackTasks());
        }
        
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getFallbackProgress = () => [
    { name: "Sarah Johnson", course: "English", level: "B2", grade: "16/20", status: "VERY GOOD", color: "text-[#38A169]" },
    { name: "Lucas Martin", course: "French", level: "B1", grade: "14/20", status: "GOOD", color: "text-[#48BB78]" },
    { name: "Maria Garcia", course: "Spanish", level: "A2", grade: "13/20", status: "ALMOST GOOD", color: "text-[#3182CE]" },
    { name: "Anna Schmidt", course: "German", level: "A1", grade: "10/20", status: "NEEDS WORK", color: "text-[#DD6B20]" },
    { name: "David Brown", course: "English", level: "B2", grade: "18/20", status: "EXCELLENT", color: "text-[#38A169]" },
  ];

  const getFallbackTasks = () => [
    { id: 1, title: "Grade Mid-Terms", subTitle: "French B1 Intermediate", date: "Today, 5:00 PM", status: "Pending", borderColor: "border-[#ED8936]", tagBg: "bg-[#FFEDD5]", tagText: "text-[#ED8936]" },
    { id: 2, title: "Submit Attendance", subTitle: "Morning Session", date: "Completed: 09:30 AM", status: "Completed", borderColor: "border-[#48BB78]", tagBg: "bg-[#C6F6D5]", tagText: "text-[#48BB78]" }
  ];

  // 💡 عرض الاسم الصحيح الفوق 
  const teacherName = teacherInfo ? `Prof. ${teacherInfo.first_name} ${teacherInfo.last_name}` : "Teacher Name";

  // ==========================================
  // هاد الدالة ترسم المحتوى حسب واش خيرتي في Sidebar
  // ==========================================
  const renderMainContent = () => {
    
    if (activeTab === 'My Classes') {
      return (
        <div className="flex-1 min-w-[650px] flex flex-col space-y-6 animate-fade-in">
            <TeacherClasses /> 
        </div>
      );
    }
    
    if (activeTab === 'Messages') {
      return (
       <div className="flex-1 flex flex-col animate-fade-in h-full">
         <TeacherCommunications /> 
       </div>
      );
    }
    
    if (activeTab === 'Classroom Tasks') {
      return <ClassroomTasks />;
    }

    // الديزاين الأصلي (Dashboard)
    return (
      <div className="flex-1 min-w-[650px] flex flex-col space-y-6 animate-fade-in">
        <div className="flex justify-between items-end">
          <h1 className="text-[28px] font-bold text-[#1B254B] flex items-center">👋 Welcome, {teacherName}</h1>
        </div>

        <div className="bg-[#EBE9F1] rounded-[20px] p-8 flex justify-between items-center relative overflow-hidden h-[200px] shadow-sm">
          <div className="z-10 w-2/3">
            <h2 className="text-2xl font-bold text-[#1B254B] mb-3">Manage Your Classes Efficiently!</h2>
            <p className="text-[#A3AED0] text-sm mb-6 leading-relaxed">
              Track student performance, manage assignments, and monitor attendance. Stay organized and ensure your students succeed.
            </p>
            <button onClick={() => setActiveTab('My Classes')} className="bg-[#111C44] text-white px-6 py-2.5 rounded-lg text-sm font-bold flex items-center hover:bg-black transition-colors cursor-pointer active:scale-95">
              View My Classes <span className="ml-2">→</span>
            </button>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-1/3 flex items-center justify-center">
            <span className="text-6xl">👨‍🏫👩‍🎓</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-[#1B254B] flex items-center"><span className="mr-2 text-xl">📚</span> My Classes</h3>
            <button onClick={() => setActiveTab('My Classes')} className="text-[#4318FF] text-sm font-medium hover:underline cursor-pointer">View all {'>'}</button>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {loading ? <p className="col-span-4 text-gray-400 font-bold italic">Loading classes...</p> : 
             myClasses.length === 0 ? <p className="col-span-4 text-gray-500 font-bold p-4 bg-white rounded-xl shadow-sm border border-gray-100">No classes assigned to you yet.</p> :
             myClasses.slice(0,4).map((cls) => {
               const isDarkText = cls.colorClass.includes('text-[#1F3340]') || cls.colorClass.includes('text-[#23331E]');
               const textColor = cls.colorClass.split(' ')[1];
               const opacityClass = isDarkText ? 'opacity-70' : 'opacity-70';

               return (
                <div key={cls.id} className={`${cls.colorClass.split(' ')[0]} rounded-[20px] p-5 flex flex-col justify-between h-36 shadow-sm hover:shadow-md transition-shadow cursor-pointer`}>
                  <h4 className={`font-bold ${textColor} text-[13px] leading-tight pr-4`}>{cls.name}</h4>
                  <div>
                    <p className={`text-[11px] ${textColor} ${opacityClass} flex items-center mb-1.5`}><span className="mr-1.5">👥</span> {cls.studentsCount} Students</p>
                    <p className={`text-[11px] font-bold ${textColor} flex items-center`}><span className="mr-1.5">📖</span> {cls.language}</p>
                  </div>
                </div>
               );
             })
            }
          </div>
        </div>

        <div className="flex-1 bg-transparent">
          <div className="flex justify-between items-center mb-4 mt-2">
            <h3 className="text-lg font-bold text-[#1B254B] flex items-center"><span className="mr-2 text-xl">📈</span> Student Progress</h3>
            <button className="text-[#4318FF] text-sm font-medium hover:underline cursor-pointer">View all {'>'}</button>
          </div>

          <table className="w-full text-left text-sm bg-white rounded-2xl shadow-sm p-4 overflow-hidden border border-gray-100">
            <thead className="bg-gray-50/50">
              <tr className="text-[#A3AED0] text-[13px] font-medium border-b border-gray-200">
                <th className="py-4 pl-6 font-medium">Student Name ↑↓</th>
                <th className="py-4 font-medium">Course ↑↓</th>
                <th className="py-4 font-medium">Level ↑↓</th>
                <th className="py-4 font-medium">Grade ↑↓</th>
                <th className="py-4 font-medium">Status ↑↓</th>
                <th className="py-4 pr-6 text-right"></th>
              </tr>
            </thead>
            <tbody>
              {studentsProgress.map((student, idx) => (
                <tr key={idx} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="py-4 pl-6 font-bold text-[#1B254B]">{student.name}</td>
                  <td className="py-4 text-[#A3AED0] font-medium">{student.course}</td>
                  <td className="py-4 font-bold text-[#A3AED0]">{student.level}</td>
                  <td className="py-4 font-bold text-[#1B254B]">{student.grade}</td>
                  <td className="py-4">
                    <span className={`text-[10px] font-bold tracking-widest ${student.color}`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="py-4 pr-6 text-right">
                    <button className="text-[#A3AED0] hover:text-[#1B254B] text-xl font-bold cursor-pointer transition-colors">⋮</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-[#F4F7FE] font-sans text-[#1B254B] overflow-hidden">
      
      <aside className="w-[250px] bg-[#111C44] text-[#A3AED0] flex flex-col justify-between shrink-0 overflow-y-auto custom-scrollbar shadow-2xl z-20">
        <div>
          <div className="p-6 flex items-center space-x-3 mb-2 border-b border-white/5 pb-6">
             <div className="w-8 h-8 bg-white text-black rounded flex items-center justify-center font-bold text-lg shadow-md">🎓</div>
             <span className="text-xl font-bold tracking-wider text-white uppercase">UTOPIA</span>
          </div>

          <nav className="px-4 space-y-2 mt-4">
            {[
              { id: 'Dashboard', icon: '⊞' }, 
              { id: 'My Classes', icon: '📚' }, 
              { id: 'Classroom Tasks', icon: '📋' }, 
              { id: 'Messages', icon: '💬' }
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${activeTab === item.id ? 'bg-[#4318FF] text-white shadow-lg shadow-[#4318FF]/30' : 'hover:bg-white/5 hover:text-white'}`}
              >
                <span className={`mr-3 text-lg ${activeTab === item.id ? 'text-white' : 'opacity-70'}`}>{item.icon}</span> {item.id}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 mt-4 border-t border-white/5">
          <button className="flex items-center w-full px-4 py-3 text-[#A3AED0] rounded-xl text-sm font-medium hover:text-white hover:bg-white/5 transition-colors mb-2 cursor-pointer">
             <span className="mr-3 text-lg opacity-70">⚙️</span> Settings
          </button>
          <button onClick={handleLogout} className="flex items-center w-full px-4 py-3 text-red-400 rounded-xl text-sm font-bold hover:bg-red-500/10 hover:text-red-300 transition-colors cursor-pointer">
             <span className="mr-3 text-lg opacity-70">↪️</span> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        
        <header className="h-20 px-8 flex justify-between items-center bg-white/50 backdrop-blur-md border-b border-gray-100 shrink-0 z-10 sticky top-0">
          <div className="relative w-96">
            <span className="absolute left-4 top-2.5 text-gray-400">🔍</span>
            <input 
              type="text" 
              placeholder="Search students, classes, assignments..." 
              className="w-full bg-white border border-gray-200 rounded-full py-2 pl-10 pr-4 text-sm outline-none focus:border-[#4318FF] focus:ring-1 focus:ring-[#4318FF] shadow-sm text-[#1B254B] transition-all"
            />
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="relative cursor-pointer group">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-200 shadow-sm text-gray-500 group-hover:text-[#4318FF] transition-colors">
                🔔
              </div>
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </div>

            <div className="flex items-center pl-6 border-l border-gray-200">
              <div className="flex flex-col text-right mr-3">
                <span className="text-sm font-bold text-[#1B254B]">{teacherName}</span>
                <span className="text-[11px] text-gray-500 font-medium">{teacherInfo?.department || 'Instructor'}</span>
              </div>
              <img 
                src="https://i.pravatar.cc/150?img=47" 
                alt="Profile" 
                className="w-10 h-10 rounded-full object-cover cursor-pointer shadow-sm border-2 border-[#4318FF] hover:scale-105 transition-transform" 
              />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar flex flex-col xl:flex-row gap-6">
          
          {renderMainContent()}

          <div className="w-full xl:w-[320px] shrink-0 flex flex-col space-y-6">
            
            <div className="flex justify-end text-xs font-bold text-[#A3AED0] pt-2">
              {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', weekday: 'long' })}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs font-bold text-[#1B254B]">Semester Progress</p>
              </div>
              <div className="h-2 w-full bg-white rounded-full overflow-hidden border border-gray-100 shadow-inner">
                <div className="h-full bg-[#4318FF] w-[45%] rounded-full relative">
                   <div className="absolute top-0 bottom-0 right-0 w-4 bg-white/20 blur-sm"></div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <button className="text-[#1B254B] font-bold w-6 h-6 flex items-center justify-center hover:bg-gray-50 rounded">{'<'}</button>
                <h4 className="font-bold text-[#1B254B] text-sm">{new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })}</h4>
                <button className="text-[#1B254B] font-bold w-6 h-6 flex items-center justify-center hover:bg-gray-50 rounded">{'>'}</button>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-[#A3AED0] font-bold mb-3">
                <div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div><div>Su</div>
              </div>
              <div className="grid grid-cols-7 gap-y-3 gap-x-1 text-center text-[13px] font-medium text-[#1B254B]">
                <div className="text-gray-300">26</div><div className="text-gray-300">27</div><div className="text-gray-300">28</div>
                <div>1</div><div>2</div><div>3</div><div>4</div>
                <div>5</div><div>6</div><div>7</div><div>8</div><div>9</div><div>10</div><div>11</div>
                <div className="bg-[#4318FF] text-white w-7 h-7 rounded-full flex items-center justify-center mx-auto shadow-md shadow-[#4318FF]/40 font-bold">12</div>
                <div>13</div><div>14</div><div>15</div><div>16</div><div>17</div><div>18</div>
              </div>
            </div>

            <div className="flex-1">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-[#1B254B] flex items-center"><span className="mr-2 text-xl">💼</span> Today's Schedule</h3>
                <button className="text-[#4318FF] text-sm font-medium hover:underline cursor-pointer">View all {'>'}</button>
              </div>
              
              <div className="space-y-3">
                {dailyTasks.map((task, idx) => (
                  <div key={idx} className={`bg-white p-4 rounded-[14px] border-l-4 ${task.borderColor || 'border-[#ED8936]'} shadow-sm relative hover:-translate-y-0.5 transition-transform cursor-pointer`}>
                    <span className={`absolute top-4 right-4 text-[9px] font-bold ${task.tagText || 'text-[#ED8936]'} ${task.tagBg || 'bg-[#FFEDD5]'} px-2 py-0.5 rounded tracking-wide`}>
                      {task.status || 'Pending'}
                    </span>
                    <p className="text-[13px] font-bold text-[#1B254B] mb-2 pr-16">{task.title || 'Task'}</p>
                    <p className="text-[11px] text-[#A3AED0] mb-1.5 leading-snug">{task.subTitle || 'Details'}</p>
                    <p className="text-[10px] text-gray-400 font-medium">{task.date || 'Today'}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboardt;
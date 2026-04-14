import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

const TeacherClasses = () => {
  const [currentView, setCurrentView] = useState('main'); 
  const [selectedClass, setSelectedClass] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState('Lectures');
  
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [lectures, setLectures] = useState([]);
  const [library, setLibrary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [teacherName, setTeacherName] = useState("Teacher");

  // ==========================================
  // 💡 جلب البيانات من Supabase
  // ==========================================
  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: prof } = await supabase.from('staff').select('*').eq('email', user.email).single();
        if (prof) setTeacherName(`${prof.first_name} ${prof.last_name}`);

        const fullName = prof ? `${prof.first_name} ${prof.last_name}` : "";
        const { data: cls } = await supabase.from('classes').select('*').eq('teacher_name', fullName);
        if (cls) {
          const icons = ["🇬🇧", "🇫🇷", "🇩🇪", "🇪🇸"];
          const colors = ["from-[#C5B8D8] to-white", "from-[#E5D2A6] to-white", "from-[#A4C2D1] to-white", "from-[#A9C4A3] to-white"];
          setClasses(cls.map((c, i) => ({ 
            ...c, 
            icon: icons[i % icons.length],
            color: colors[i % colors.length] 
          })));
        }

        // 📚 جلب المكتبة (إذا الجدول فارغ، نجبدو الداتا تاع Figma)
        const { data: lib } = await supabase.from('library_resources').select('*');
        if (lib && lib.length > 0) {
          setLibrary(lib);
        } else {
          setLibrary([
            { id: 1, title: 'Batman: The Dark Knight', author: 'Frank Miller', img_url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=400', is_hero: true },
            { id: 2, title: 'The Flash Vol. 1', author: 'Joshua Williamson', img_url: 'https://picsum.photos/seed/flash/300/450' },
            { id: 3, title: 'Titans Vol. 2', author: 'Andrew Robinson', img_url: 'https://picsum.photos/seed/titans/300/450' },
            { id: 4, title: 'Harley Quinn', author: 'Jimmy Palmiotti', img_url: 'https://picsum.photos/seed/harley/300/450' },
            { id: 5, title: 'Suicide Squad', author: 'Tom Taylor', img_url: 'https://picsum.photos/seed/squad/300/450' }
          ]);
        }
      }
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    if (selectedClass) {
      const fetchDetails = async () => {
        const { data: lecData } = await supabase.from('lectures').select('*').eq('class_name', selectedClass.name);
        if (lecData && lecData.length > 0) {
            setLectures(lecData);
        } else {
            // 📹 داتا وهمية للدروس (كيما Figma) إذا الداتا باز فارغة
            setLectures([
                { id: 1, title: 'Advanced Speaking Skills - B2', duration: '45', thumbnail_url: 'https://picsum.photos/seed/l1/400/250' },
                { id: 2, title: 'Professional English Basics', duration: '30', thumbnail_url: 'https://picsum.photos/seed/l2/400/250' },
                { id: 3, title: 'Grammar Mastery - Unit 4', duration: '55', thumbnail_url: 'https://picsum.photos/seed/l3/400/250' }
            ]);
        }
        
        const { data: stdData } = await supabase.from('students').select('*').eq('group_name', selectedClass.name);
        setStudents(stdData || []);
      };
      fetchDetails();
    }
  }, [selectedClass]);

  // ==========================================
  // VIEW: MAIN DASHBOARD
  // ==========================================
  const renderMainDashboard = () => (
    <div className="animate-fadeIn space-y-8 pb-10">
      <div className="flex justify-between items-center">
         <h1 className="text-2xl font-bold text-[#1B254B]">👋 Welcome, {teacherName}</h1>
      </div>

      <div className="bg-white rounded-[30px] p-8 shadow-sm border border-gray-50 flex justify-between items-center relative overflow-hidden">
        <div className="z-10">
           <h2 className="text-3xl font-bold text-[#1B254B] mb-2">My Teaching Schedule:</h2>
           <p className="text-[#A3AED0] text-sm leading-relaxed">Manage your classes and upcoming sessions efficiently.</p>
        </div>
        <div className="text-8xl opacity-10 absolute right-10">🔔</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center"><h3 className="text-xl font-bold text-[#1B254B]">My classes</h3><button className="text-[#4318FF] font-bold text-sm">See all &gt;</button></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {classes.map((cls, idx) => (
              <div key={idx} onClick={() => { setSelectedClass(cls); setCurrentView('detail'); }}
                   className={`p-5 rounded-[24px] bg-gradient-to-b ${cls.color} border border-gray-100 shadow-sm flex flex-col items-center text-center cursor-pointer hover:scale-105 transition-all`}>
                <span className="text-3xl mb-3">{cls.icon}</span>
                <p className="font-bold text-[#1B254B] text-[13px] leading-tight mb-1">{cls.name}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase">View Plan</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-[35px] p-8 shadow-sm border border-gray-50">
            <div className="flex items-center gap-4 mb-8">
               <div className="w-14 h-14 bg-[#1B254B] rounded-2xl flex items-center justify-center text-white font-black text-2xl">02</div>
               <div><p className="text-gray-400 text-xs font-black uppercase">Nov 2026</p><p className="text-[#1B254B] font-bold text-lg">Today's Overview</p></div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-center">
                <thead>
                  <tr className="text-gray-400 text-[10px] font-black uppercase tracking-widest">
                    <th className="py-4 text-left">Time</th>
                    <th>08:00 - 10:00</th><th>10:00 - 12:00</th><th>14:00 - 16:00</th>
                  </tr>
                </thead>
                <tbody className="text-[12px] font-bold text-[#1B254B]">
                   {['MON', 'TUE', 'WED', 'THU', 'FRI'].map((day, i) => (
                     <tr key={day} className="border-t border-gray-50">
                        <td className="py-6 text-left text-gray-400">{day}</td>
                        <td>{i === 0 && classes[0] ? <span className="bg-[#E6FBF2] text-[#00A65E] px-3 py-1.5 rounded-xl border border-[#00A65E]/10">{classes[0].name}</span> : "-"}</td>
                        <td>-</td>
                        <td>{i === 2 && classes[0] ? <span className="bg-[#F4F7FE] text-[#4318FF] px-3 py-1.5 rounded-xl">{classes[0].name}</span> : "-"}</td>
                     </tr>
                   ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-8">
           <h3 className="text-xl font-bold text-[#1B254B]">Upcoming Classes</h3>
           {classes.length > 0 ? (
              <div className="bg-gradient-to-r from-[#00A65E] to-[#60d394] p-6 rounded-[28px] text-white shadow-lg relative overflow-hidden">
                 <p className="font-bold text-lg">{classes[0].name}</p>
                 <p className="text-xs opacity-90 mt-2">🕒 Tomorrow • 09:00 AM</p>
                 <p className="text-xs opacity-90">📍 Room 04</p>
                 <div className="absolute -right-4 -bottom-4 opacity-10 text-9xl">📖</div>
              </div>
           ) : <p className="text-gray-400 italic">No classes found.</p>}
        </div>
      </div>
    </div>
  );

  // ==========================================
  // VIEW: CLASS DETAIL (Figma 100%)
  // ==========================================
  const renderClassDetail = () => (
    <div className="animate-fadeIn space-y-8">
      <div className="flex items-center gap-4">
         <button onClick={() => setCurrentView('main')} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 text-[#1B254B] font-bold">←</button>
         <h1 className="text-2xl font-bold text-[#1B254B]">{selectedClass?.name}</h1>
      </div>

      <div className="flex gap-10 border-b border-gray-100 mb-8">
         {['Lectures', 'Library', 'Students'].map(tab => (
           <button key={tab} onClick={() => setActiveSubTab(tab)}
                   className={`pb-4 px-2 font-bold text-sm transition-all relative ${activeSubTab === tab ? 'text-[#4318FF]' : 'text-gray-400'}`}>
               {tab}
               {activeSubTab === tab && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#4318FF] rounded-t-full"></div>}
           </button>
         ))}
      </div>

      {activeSubTab === 'Lectures' && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {lectures.map(lec => (
            <div key={lec.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 group cursor-pointer hover:shadow-lg transition-all">
               <div className="h-44 bg-gray-200 relative">
                  <img src={lec.thumbnail_url} className="w-full h-full object-cover" alt="" />
                  <div className="absolute inset-0 flex items-center justify-center"><div className="w-12 h-12 bg-[#1B254B]/90 rounded-full flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform">▶</div></div>
               </div>
               <div className="p-5">
                  <h4 className="font-bold text-[#1B254B] text-sm leading-snug">{lec.title}</h4>
                  <p className="text-[10px] text-orange-400 font-black mt-2 tracking-widest uppercase">🕒 {lec.duration} MINS</p>
               </div>
            </div>
          ))}
        </div>
      )}

      {activeSubTab === 'Library' && (
        <div className="space-y-10">
           {/* Batman Hero Card (Figma) */}
           <div className="relative w-full h-[350px] rounded-[45px] overflow-hidden shadow-2xl">
              <img src={library[0]?.img_url} className="w-full h-full object-cover" alt="" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex items-center p-16">
                 <div className="text-white max-w-md">
                    <p className="text-xs font-bold uppercase tracking-[4px] mb-4 text-blue-400">Featured Resource</p>
                    <h2 className="text-5xl font-black mb-6 leading-tight">{library[0]?.title.split(':')[0]}<br/>{library[0]?.title.split(':')[1]}</h2>
                    <button className="bg-white text-black px-10 py-3.5 rounded-full font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-colors shadow-lg">Read Now</button>
                 </div>
              </div>
           </div>

           <h3 className="text-2xl font-bold text-[#1B254B]">Top Rated Comics</h3>
           <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
              {library.slice(1).map(item => (
                <div key={item.id} className="space-y-4 cursor-pointer group">
                   <div className="aspect-[3/4.5] rounded-[30px] overflow-hidden shadow-lg group-hover:scale-105 transition-transform duration-500">
                      <img src={item.img_url} className="w-full h-full object-cover" alt="" />
                   </div>
                   <div className="px-1">
                      <h4 className="font-bold text-[#1B254B] text-sm truncate">{item.title}</h4>
                      <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-wider">{item.author}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}

      {activeSubTab === 'Students' && (
        <div className="bg-white rounded-[35px] border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[#F4F7FE] text-[#A3AED0] text-[11px] font-black uppercase tracking-widest">
              <tr><th className="py-6 pl-10">Student Name</th><th className="py-6">Email Address</th><th className="py-6 pr-10 text-right">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {students.map(s => (
                <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-6 pl-10 font-bold text-[#1B254B] text-sm">{s.first_name} {s.last_name}</td>
                  <td className="py-6 text-gray-500 text-sm">{s.email}</td>
                  <td className="py-6 pr-10 text-right"><span className="bg-[#E6FBF2] text-[#00A65E] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter">Active Student</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  return (
    <div className="h-full w-full p-6 md:p-10 bg-[#F4F7FE] overflow-y-auto custom-scrollbar">
       {currentView === 'main' ? renderMainDashboard() : renderClassDetail()}
    </div>
  );
};

export default TeacherClasses;
import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

const TeacherClasses = () => {
  // --- States للتحكم في الواجهات ---
  const [currentView, setCurrentView] = useState('list'); // 'list', 'detail', 'video'
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState('Lectures');
  
  // --- States للداتا الحقيقية ---
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- States للـ Library ---
  const [activeCategory, setActiveCategory] = useState('Books');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newResource, setNewResource] = useState({ title: '', type: 'Books', author: '', image: '' });

  // ==========================================
  // 💡 جلب البيانات من Supabase
  // ==========================================
  const fetchData = async () => {
    setLoading(true);
    
    // 1. جلب الأقسام
    const { data: classesData } = await supabase.from('classes').select('*');
    if (classesData) {
      const icons = ["🇬🇧", "🇫🇷", "🇪🇸", "🇩🇪"];
      const colors = ["from-blue-100 to-blue-50", "from-red-100 to-red-50", "from-orange-100 to-orange-50", "from-green-100 to-green-50"];
      setClasses(classesData.map((c, i) => ({
        ...c,
        icon: icons[i % icons.length],
        color: colors[i % colors.length],
        studentsCount: Math.floor(Math.random() * 10) + 10 // مؤقتا حتى نربطو العلاقة
      })));
    }

    // 2. جلب التلاميذ
    const { data: studentsData } = await supabase.from('students').select('*');
    if (studentsData) {
      setStudents(studentsData.map(s => ({
        id: s.id,
        name: `${s.first_name || ''} ${s.last_name || ''}`,
        email: s.email,
        progress: `${Math.floor(Math.random() * 100)}%`,
        status: "Active"
      })));
    }

    // 3. جلب محتويات المكتبة
    const { data: resData } = await supabase.from('library_resources').select('*');
    if (resData) setResources(resData);

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // دالة إضافة مورد جديد للمكتبة في Supabase
  const handleAddResource = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('library_resources').insert([{
      title: newResource.title,
      type: newResource.type,
      author: newResource.author,
      img: newResource.image || 'https://picsum.photos/400/600',
      is_hero: false
    }]);

    if (!error) {
      setShowModal(false);
      fetchData(); // عاود جيب الداتا باش تخرج الجديدة
      setNewResource({ title: '', type: 'Books', author: '', image: '' });
    }
  };

  // ==========================================
  // 1️⃣ VIEW: LIST OF CLASSES
  // ==========================================
  const renderClassesList = () => (
    <div className="animate-fadeIn p-4">
      <h1 className="text-[28px] font-bold text-[#1B254B] mb-6">👋 Welcome, Teacher</h1>
      <div className="bg-white border border-blue-100 rounded-2xl p-6 mb-8 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#1B254B] mb-1">My Classes:</h2>
          <p className="text-[#A3AED0] text-sm font-medium">Manage your classes and track student progress seamlessly.</p>
        </div>
        <div className="text-4xl">📚</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? <p className="italic text-gray-400">Loading classes...</p> : 
         classes.map((cls) => (
          <div key={cls.id} className="bg-white rounded-[20px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col"
               onClick={() => { setSelectedClass(cls); setCurrentView('detail'); }}>
            <div className={`h-40 w-full bg-gradient-to-br ${cls.color} flex items-center justify-center text-6xl relative`}>
              {cls.icon}
              <div className="absolute bottom-2 right-2 bg-white px-2 py-1 rounded-md text-[10px] font-bold text-[#1B254B] shadow-sm">⭐ 4.9</div>
            </div>
            <div className="p-5 flex flex-col flex-1">
              <h4 className="font-bold text-[#1B254B] text-[15px] mb-2 group-hover:text-[#4318FF]">{cls.name}</h4>
              <p className="text-[#A3AED0] text-[11px] mb-4 flex-1 line-clamp-2">Lessons management and student performance for {cls.language}.</p>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-[11px] font-bold text-[#1B254B]">👥 {cls.studentsCount} Students</span>
                <span className="text-[11px] font-bold text-[#A3AED0]">📝 {cls.level || 'B2'}</span>
              </div>
              <button className="w-full py-2 border border-blue-100 rounded-xl text-[#4318FF] text-xs font-bold hover:bg-blue-50 transition-colors">View Class →</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ==========================================
  // 2️⃣ VIEW: CLASS DETAILS (LECTURES / STUDENTS / LIBRARY)
  // ==========================================
  const renderClassDetail = () => {
    const currentItems = resources.filter(r => r.type === activeCategory && r.title.toLowerCase().includes(searchQuery.toLowerCase()));
    const heroItem = currentItems.find(r => r.is_hero) || currentItems[0];
    const gridItems = currentItems.filter(r => !r.is_hero);

    return (
      <div className="animate-fadeIn p-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => setCurrentView('list')} className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold hover:bg-gray-50 shadow-sm">←</button>
            <h1 className="text-[24px] font-bold text-[#1B254B]">{selectedClass?.name}</h1>
          </div>
          {activeSubTab === 'Library' && (
            <button onClick={() => setShowModal(true)} className="bg-[#1B254B] text-white px-6 py-2.5 rounded-xl font-bold text-xs hover:bg-[#4318FF] transition-colors shadow-md">+ ADD RESOURCE</button>
          )}
        </div>

        <div className="flex gap-10 mb-8 border-b border-gray-100">
          {['Lectures', 'Students', 'Library'].map((t) => (
            <button key={t} onClick={() => setActiveSubTab(t)}
                    className={`pb-4 px-2 text-sm font-bold transition-all relative ${activeSubTab === t ? 'text-[#4318FF]' : 'text-gray-400 hover:text-[#1B254B]'}`}>
              {t}
              {activeSubTab === t && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#4318FF] rounded-t-full"></div>}
            </button>
          ))}
        </div>

        {/* --- LECTURES --- */}
        {activeSubTab === 'Lectures' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3].map((id) => (
              <div key={id} onClick={() => { setSelectedLecture({id, title: `Lesson ${id}: Language Core`}); setCurrentView('video'); }}
                   className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm cursor-pointer hover:shadow-xl transition-all group">
                <div className="h-36 bg-gray-200 relative flex items-center justify-center">
                  <img src={`https://picsum.photos/seed/${id+selectedClass.id}/400/200`} className="w-full h-full object-cover opacity-80" alt="" />
                  <div className="absolute w-12 h-12 bg-[#1B254B] rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">▶</div>
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-[#1B254B] text-sm mb-1 truncate">Module {id}: Fluency Practice</h4>
                  <p className="text-[#F6AD55] text-[10px] font-bold uppercase tracking-wider">00:45:00 Remaining</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- STUDENTS --- */}
        {activeSubTab === 'Students' && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50">
                <tr className="text-[#A3AED0] text-[11px] font-bold uppercase tracking-widest border-b border-gray-100">
                  <th className="py-5 pl-8">Student</th>
                  <th className="py-5">Course Progress</th>
                  <th className="py-5">Status</th>
                  <th className="py-5 pr-8 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {students.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-5 pl-8">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center text-[#4318FF] font-bold text-xs">{s.name.charAt(0)}</div>
                        <div><p className="font-bold text-[#1B254B] text-sm">{s.name}</p><p className="text-[10px] text-gray-400">{s.email}</p></div>
                      </div>
                    </td>
                    <td className="py-5">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-xs text-[#1B254B] w-8">{s.progress}</span>
                        <div className="w-32 h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="bg-[#4318FF] h-full" style={{width: s.progress}}></div></div>
                      </div>
                    </td>
                    <td className="py-5"><span className="px-3 py-1 rounded-lg text-[10px] font-bold bg-green-50 text-green-600">{s.status}</span></td>
                    <td className="py-5 pr-8 text-right"><button className="text-gray-300 font-black text-xl">⋮</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* --- LIBRARY --- */}
        {activeSubTab === 'Library' && (
          <div className="flex gap-8 animate-fadeIn">
            <div className="flex-1">
              <div className="relative w-96 mb-6">
                 <span className="absolute left-4 top-2.5 text-gray-400">🔍</span>
                 <input type="text" placeholder="Search resources..." value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} className="w-full bg-white border border-gray-200 rounded-full py-2 pl-10 pr-4 text-sm outline-none focus:border-[#4318FF] shadow-sm"/>
              </div>
              {heroItem && (
                <div className="relative w-full h-[350px] rounded-[30px] overflow-hidden mb-8 shadow-lg group cursor-pointer">
                  <img src={heroItem.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A1128]/95 to-transparent"></div>
                  <div className="absolute bottom-8 left-8">
                    <p className="text-gray-300 font-bold text-xs uppercase tracking-widest mb-1">{heroItem.author}</p>
                    <h2 className="text-4xl font-bold text-white mb-4 leading-tight">{heroItem.title}</h2>
                    <button className="bg-white text-[#1B254B] px-8 py-2.5 rounded-full font-bold text-xs hover:bg-gray-100">Read Now</button>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-3 gap-6">
                {gridItems.map(item => (
                  <div key={item.id} className="cursor-pointer group">
                    <div className="w-full aspect-[4/5] rounded-[20px] overflow-hidden mb-3 shadow-md"><img src={item.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" /></div>
                    <h4 className="font-bold text-[#1B254B] text-[13px] leading-tight mb-1">{item.title}</h4>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">{item.author}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-64 shrink-0 space-y-8">
               <div className="bg-white p-6 rounded-[25px] shadow-sm border border-gray-50">
                  <h3 className="text-sm font-bold text-[#1B254B] mb-4 text-center">CATEGORIES</h3>
                  <div className="flex flex-col gap-3">
                    {['Books', 'Videos', 'Articles'].map(cat => (
                      <button key={cat} onClick={()=>setActiveCategory(cat)} className={`py-4 rounded-2xl font-bold text-xs transition-all ${activeCategory===cat ? 'bg-indigo-50 text-[#4318FF] border-indigo-100 shadow-sm scale-105':'bg-gray-50 text-gray-400'}`}>{cat}</button>
                    ))}
                  </div>
               </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ==========================================
  // 3️⃣ VIEW: VIDEO PLAYER
  // ==========================================
  const renderVideoPlayer = () => (
    <div className="flex gap-8 animate-fadeIn p-4">
      <div className="flex-1 flex flex-col">
        <button onClick={() => setCurrentView('detail')} className="mb-6 font-bold text-[#1B254B] hover:text-[#4318FF] flex items-center gap-2">← Back to Dashboard</button>
        <div className="w-full bg-black rounded-[35px] aspect-video overflow-hidden shadow-2xl relative mb-8">
           <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200" className="w-full h-full object-cover opacity-50" alt="" />
           <div className="absolute inset-0 flex items-center justify-center"><div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center text-white text-3xl cursor-pointer hover:scale-110 transition-transform">▶</div></div>
        </div>
        <h2 className="text-3xl font-bold text-[#1B254B] mb-2">{selectedLecture?.title}</h2>
      </div>
      <div className="w-80 bg-white border border-gray-100 rounded-[35px] p-8 shadow-sm flex flex-col h-[650px]">
        <h3 className="font-bold text-[#1B254B] text-lg mb-6 border-b pb-4">Live Comments</h3>
        <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar mb-6">
           {[1,2,3].map(i => (
             <div key={i} className="flex gap-4"><div className="w-9 h-9 rounded-full bg-blue-50 shrink-0"></div><div><p className="text-xs font-bold text-[#1B254B]">Student {i}</p><p className="text-[11px] text-gray-500 mt-1">Excellent session, professor!</p></div></div>
           ))}
        </div>
        <div className="relative"><input type="text" placeholder="Say something..." className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 pl-5 pr-10 text-xs outline-none" /><button className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4318FF]">➤</button></div>
      </div>
    </div>
  );

  return (
    <div className="h-full w-full overflow-y-auto custom-scrollbar">
      {currentView === 'list' && renderClassesList()}
      {currentView === 'detail' && renderClassDetail()}
      {currentView === 'video' && renderVideoPlayer()}

      {/* MODAL: ADD RESOURCE */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[35px] p-10 w-full max-w-lg shadow-2xl animate-fadeIn">
            <div className="flex justify-between items-center mb-8"><h2 className="text-2xl font-bold text-[#1B254B]">New Library Content</h2><button onClick={() => setShowModal(false)} className="text-gray-400 font-bold text-2xl">✕</button></div>
            <form onSubmit={handleAddResource} className="space-y-6">
              <div><label className="text-sm font-bold text-[#1B254B]">Title</label><input type="text" required value={newResource.title} onChange={(e)=>setNewResource({...newResource, title: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3 outline-none" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm font-bold text-[#1B254B]">Type</label><select value={newResource.type} onChange={(e)=>setNewResource({...newResource, type: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3"><option value="Books">Books</option><option value="Videos">Videos</option><option value="Articles">Articles</option></select></div>
                <div><label className="text-sm font-bold text-[#1B254B]">Author</label><input type="text" value={newResource.author} onChange={(e)=>setNewResource({...newResource, author: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3" /></div>
              </div>
              <div><label className="text-sm font-bold text-[#1B254B]">Cover URL</label><input type="text" value={newResource.image} onChange={(e)=>setNewResource({...newResource, image: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3" /></div>
              <button type="submit" className="w-full py-4 bg-[#4318FF] text-white font-bold rounded-2xl shadow-lg">Add to Library</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherClasses;
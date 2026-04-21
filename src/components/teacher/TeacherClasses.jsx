import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

const Icons = {
  Search: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
  Book: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>,
  Video: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line></svg>,
  Notes: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>,
  Pdf: () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><text x="9" y="18" fontSize="6" fontWeight="bold">PDF</text></svg>,
  Back: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 8 8 12 12 16"></polyline><line x1="16" y1="12" x2="8" y2="12"></line></svg>,
  Homework: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline><circle cx="10" cy="13" r="1"></circle><circle cx="10" cy="17" r="1"></circle></svg>
};

const TeacherClasses = () => {
  const [currentView, setCurrentView] = useState('main'); 
  const [selectedClass, setSelectedClass] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState('Library'); 
  const [resourceFilter, setResourceFilter] = useState('all'); 
  
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [lectures, setLectures] = useState([]);
  const [library, setLibrary] = useState([]);
  const [homeworks, setHomeworks] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [teacherName, setTeacherName] = useState("Teacher");

  // States لرفع الملفات
  const [newLecture, setNewLecture] = useState({ title: '', duration: '45', type: 'video' });
  const [lectureFile, setLectureFile] = useState(null);
  
  const [newResource, setNewResource] = useState({ title: '', author: '', type: 'book' });
  const [resourceFile, setResourceFile] = useState(null);

  const [newHomework, setNewHomework] = useState({ title: '', description: '', selectedGroups: [] });
  const [homeworkFile, setHomeworkFile] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // ==========================================
  // جلب البيانات
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
          setClasses(cls.map((c, i) => ({ ...c, icon: icons[i % icons.length], color: colors[i % colors.length] })));
        }
      }
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    if (selectedClass) {
      const fetchDetails = async () => {
        const { data: lecData } = await supabase.from('lectures').select('*').eq('class_name', selectedClass.name);
        setLectures(lecData || []);
        
        const { data: libData } = await supabase.from('library_resources').select('*').eq('class_name', selectedClass.name);
        setLibrary(libData || []);
        
        const { data: hwData } = await supabase.from('homeworks').select('*').eq('class_name', selectedClass.name).order('created_at', { ascending: false });
        setHomeworks(hwData || []);

        const { data: stdData } = await supabase.from('students').select('*').eq('group_name', selectedClass.name);
        setStudents(stdData || []);
      };
      fetchDetails();
    }
  }, [selectedClass]);

  // ==========================================
  // دوال الـ Upload والإضافة
  // ==========================================
  const handleAddLecture = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let finalFileUrl = '';
      if (lectureFile) {
        const fileExt = lectureFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `lectures/${fileName}`;
        const { error: uploadError } = await supabase.storage.from('class_materials').upload(filePath, lectureFile);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('class_materials').getPublicUrl(filePath);
        finalFileUrl = publicUrl;
      }
      const insertData = { class_name: selectedClass.name, title: newLecture.title || 'Untitled Lecture', duration: newLecture.duration, type: newLecture.type, thumbnail_url: finalFileUrl };
      const { data, error } = await supabase.from('lectures').insert([insertData]).select();
      if (error) throw error;
      setLectures([...lectures, data[0]]);
      setCurrentView('detail'); 
      setNewLecture({ title: '', duration: '45', type: 'video' });
      setLectureFile(null);
      alert("✅ Lecture uploaded successfully!");
    } catch (err) { alert("Error: " + err.message); } finally { setIsSubmitting(false); }
  };

  const handleAddResource = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let finalImgUrl = '';
      if (resourceFile) {
        const fileExt = resourceFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `covers/${fileName}`;
        const { error: uploadError } = await supabase.storage.from('class_materials').upload(filePath, resourceFile);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('class_materials').getPublicUrl(filePath);
        finalImgUrl = publicUrl;
      } else {
        finalImgUrl = 'https://images.unsplash.com/photo-1544716278-e513176f20b5?q=80&w=400';
      }
      const insertData = { class_name: selectedClass.name, title: newResource.title || 'Untitled Resource', author: newResource.author || teacherName, type: newResource.type, img_url: finalImgUrl };
      const { data, error } = await supabase.from('library_resources').insert([insertData]).select();
      if (error) throw error;
      setLibrary([data[0], ...library]);
      setCurrentView('detail'); 
      setNewResource({ title: '', author: '', type: 'book' });
      setResourceFile(null);
      alert("✅ Library resource uploaded successfully!");
    } catch (err) { alert("Error: " + err.message); } finally { setIsSubmitting(false); }
  };

  const handleAddHomework = async (e) => {
    e.preventDefault();
    if (newHomework.selectedGroups.length === 0) {
      alert("⚠️ Please select at least one group!");
      return;
    }
    
    setIsSubmitting(true);
    try {
      let finalFileUrl = null;
      if (homeworkFile) {
        const fileExt = homeworkFile.name.split('.').pop();
        const fileName = `${Date.now()}_hw_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `homeworks/${fileName}`;
        const { error: uploadError } = await supabase.storage.from('class_materials').upload(filePath, homeworkFile);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('class_materials').getPublicUrl(filePath);
        finalFileUrl = publicUrl;
      }

      const inserts = newHomework.selectedGroups.map(grpName => ({
        class_name: grpName,
        title: newHomework.title,
        description: newHomework.description,
        file_url: finalFileUrl,
        teacher_name: teacherName
      }));

      const { error } = await supabase.from('homeworks').insert(inserts);
      if (error) throw error;
      
      if (newHomework.selectedGroups.includes(selectedClass.name)) {
         const { data: hwData } = await supabase.from('homeworks').select('*').eq('class_name', selectedClass.name).order('created_at', { ascending: false });
         setHomeworks(hwData || []);
      }

      setCurrentView('detail'); 
      setNewHomework({ title: '', description: '', selectedGroups: [] });
      setHomeworkFile(null);
      alert("✅ Homework assigned successfully to selected groups!");
    } catch (err) { alert("Error: " + err.message); } finally { setIsSubmitting(false); }
  };

  const toggleGroupSelection = (grpName) => {
    setNewHomework(prev => ({
      ...prev,
      selectedGroups: prev.selectedGroups.includes(grpName)
        ? prev.selectedGroups.filter(g => g !== grpName)
        : [...prev.selectedGroups, grpName]
    }));
  };

  // ==========================================
  // VIEW 1: MAIN DASHBOARD
  // ==========================================
  const renderMainDashboard = () => (
    <div className="animate-fadeIn space-y-8 pb-10">
      <div className="flex justify-between items-center">
         <h1 className="text-2xl font-bold text-[#1B254B]">👋 Welcome, {teacherName}</h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center"><h3 className="text-xl font-bold text-[#1B254B]">My classes</h3></div>
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
        </div>
      </div>
    </div>
  );

  // ==========================================
  // VIEW 2: CLASS DETAIL 
  // ==========================================
  const renderClassDetail = () => {
    const filteredLibrary = resourceFilter === 'all' 
      ? library : library.filter(item => (item.type || 'book').toLowerCase() === resourceFilter.toLowerCase());

    return (
      <div className="animate-fadeIn space-y-8">
        <div className="flex items-center gap-4">
           <button onClick={() => setCurrentView('main')} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 text-[#1B254B] font-bold">←</button>
           <h1 className="text-2xl font-bold text-[#1B254B]">{selectedClass?.name}</h1>
        </div>

        <div className="flex gap-10 border-b border-gray-100 mb-8 overflow-x-auto">
           {['Library', 'Lectures', 'Homeworks', 'Students'].map(tab => (
             <button key={tab} onClick={() => setActiveSubTab(tab)}
                     className={`pb-4 px-2 font-bold text-sm transition-all relative whitespace-nowrap ${activeSubTab === tab ? 'text-[#1B254B]' : 'text-gray-400'}`}>
                 {tab}
                 {activeSubTab === tab && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#1B254B] rounded-t-full"></div>}
             </button>
           ))}
        </div>

        {/* --- تاب المكتبة --- */}
        {activeSubTab === 'Library' && (
           <div className="flex flex-col lg:flex-row gap-8 bg-white p-8 rounded-[40px] shadow-sm">
             <div className="flex-1 space-y-8">
                <div className="flex gap-4">
                   <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-4 flex items-center text-gray-400"><Icons.Search /></div>
                      <input type="text" placeholder="Search..." className="w-full bg-white border border-gray-200 rounded-full py-3.5 pl-12 pr-4 text-sm font-bold text-[#1B254B] outline-none focus:border-[#4318FF]" />
                   </div>
                   <button onClick={() => setCurrentView('create_resource')} className="bg-[#1B254B] text-white px-6 py-3.5 rounded-full text-sm font-bold shadow-lg hover:bg-black transition-colors shrink-0">+ Add Resource</button>
                </div>
                {filteredLibrary[0] ? (
                  <div className="relative w-full h-[320px] rounded-3xl overflow-hidden shadow-lg group">
                     <img src={filteredLibrary[0].img_url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Hero" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-8">
                        <p className="text-gray-300 font-bold text-xs uppercase tracking-widest mb-1">{filteredLibrary[0].author}</p>
                        <h2 className="text-white text-4xl font-black mb-6 leading-tight max-w-sm">{filteredLibrary[0].title.split(':')[0]}<br/>{filteredLibrary[0].title.split(':')[1] || ''}</h2>
                     </div>
                  </div>
                ) : (
                  <div className="w-full h-[320px] rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400"><span className="text-4xl mb-2">📭</span><p className="font-bold">No {resourceFilter}s found.</p></div>
                )}
                <div>
                   <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-[#1B254B]">{resourceFilter === 'all' ? 'All Resources' : `${resourceFilter.charAt(0).toUpperCase() + resourceFilter.slice(1)}s`}</h3>
                   </div>
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {filteredLibrary.slice(1).map(item => (
                         <div key={item.id} className="cursor-pointer group">
                            <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-sm mb-3 relative bg-gray-100 flex items-center justify-center">
                               {item.img_url ? <img src={item.img_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.title} /> : <span className="text-3xl opacity-30">📄</span>}
                               <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm px-2 py-1 rounded text-[8px] font-black text-white uppercase tracking-widest">{item.type || 'book'}</div>
                            </div>
                            <h4 className="font-bold text-[#1B254B] text-sm truncate">{item.title}</h4>
                            <p className="text-[10px] text-gray-500 font-medium truncate">{item.author}</p>
                         </div>
                      ))}
                   </div>
                </div>
             </div>
             <div className="w-full lg:w-80 shrink-0 space-y-8">
                <div>
                   <h3 className="text-lg font-bold text-[#1B254B] mb-4">Filter Resources</h3>
                   <div className="flex flex-col gap-4">
                      <div onClick={() => setResourceFilter(resourceFilter === 'book' ? 'all' : 'book')} className={`flex flex-col items-center justify-center py-4 rounded-2xl border-2 cursor-pointer transition-all ${resourceFilter === 'book' ? 'border-[#1B254B] bg-gray-50 shadow-inner scale-[0.98]' : 'bg-[#f8fafc] border-gray-100 hover:bg-white hover:shadow-sm'}`}>
                         <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#1B254B] mb-2"><Icons.Book /></div><span className="text-xs font-bold text-gray-500">Books</span>
                      </div>
                      <div onClick={() => setResourceFilter(resourceFilter === 'video' ? 'all' : 'video')} className={`flex flex-col items-center justify-center py-4 rounded-2xl border-2 cursor-pointer transition-all ${resourceFilter === 'video' ? 'border-[#00A65E] bg-green-50 shadow-inner scale-[0.98]' : 'bg-[#f8fafc] border-gray-100 hover:bg-white hover:shadow-sm'}`}>
                         <div className="w-12 h-12 bg-[#E6FBF2] rounded-xl shadow-sm flex items-center justify-center text-[#00A65E] mb-2"><Icons.Video /></div><span className="text-xs font-bold text-gray-500">Videos</span>
                      </div>
                      <div onClick={() => setResourceFilter(resourceFilter === 'note' ? 'all' : 'note')} className={`flex flex-col items-center justify-center py-4 rounded-2xl border-2 cursor-pointer transition-all ${resourceFilter === 'note' ? 'border-[#9b51e0] bg-purple-50 shadow-inner scale-[0.98]' : 'bg-[#f8fafc] border-gray-100 hover:bg-white hover:shadow-sm'}`}>
                         <div className="w-12 h-12 bg-[#F4ECFF] rounded-xl shadow-sm flex items-center justify-center text-[#9b51e0] mb-2"><Icons.Notes /></div><span className="text-xs font-bold text-gray-500">Notes</span>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* --- تاب الدروس --- */}
        {activeSubTab === 'Lectures' && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <button onClick={() => setCurrentView('create_lecture')} className="bg-[#4318FF] text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-blue-700 active:scale-95 transition-all">
                + Upload Lecture
              </button>
            </div>
            {lectures.length === 0 ? (
              <div className="py-20 text-center text-gray-400 font-bold">No lectures uploaded for this class yet.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {lectures.map(lec => (
                  <div key={lec.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 group cursor-pointer hover:shadow-lg transition-all">
                     <div className="h-44 bg-gray-200 relative flex items-center justify-center">
                        {lec.type === 'pdf' ? ( <div className="text-[#1B254B] opacity-40 scale-[2]"><Icons.Pdf /></div> ) : (
                           <>
                             {lec.thumbnail_url && <img src={lec.thumbnail_url} className="w-full h-full object-cover" alt="" />}
                             <div className="absolute inset-0 flex items-center justify-center"><div className="w-12 h-12 bg-[#1B254B]/90 rounded-full flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform">▶</div></div>
                           </>
                        )}
                     </div>
                     <div className="p-5">
                        <div className="flex justify-between items-start mb-2"><h4 className="font-bold text-[#1B254B] text-sm leading-snug truncate">{lec.title}</h4><span className="bg-gray-100 text-gray-500 text-[8px] font-black uppercase px-2 py-1 rounded">{lec.type}</span></div>
                        <p className="text-[10px] text-orange-400 font-black tracking-widest uppercase">🕒 {lec.duration} MINS</p>
                        <a href={lec.thumbnail_url} target="_blank" rel="noreferrer" className="block mt-4 text-center bg-blue-50 text-blue-600 text-xs font-bold py-2 rounded-lg hover:bg-blue-100 transition-colors">Open File ↗</a>
                     </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- تاب الواجبات --- */}
        {activeSubTab === 'Homeworks' && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <button onClick={() => {
                 setNewHomework({...newHomework, selectedGroups: [selectedClass.name]});
                 setCurrentView('create_homework');
              }} className="bg-[#1B254B] text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-black active:scale-95 transition-all">
                + Assign Homework
              </button>
            </div>
            {homeworks.length === 0 ? (
              <div className="py-20 text-center text-gray-400 font-bold">No homework assigned yet.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {homeworks.map(hw => (
                  <div key={hw.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                     <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 bg-[#F4F7FE] text-[#4318FF] rounded-2xl flex items-center justify-center"><Icons.Homework /></div>
                        <span className="text-[10px] text-gray-400 font-bold">{new Date(hw.created_at).toLocaleDateString()}</span>
                     </div>
                     <h4 className="font-bold text-[#1B254B] text-lg mb-2">{hw.title}</h4>
                     <p className="text-gray-500 text-xs leading-relaxed mb-6 line-clamp-3">{hw.description}</p>
                     {hw.file_url ? (
                        <a href={hw.file_url} target="_blank" rel="noreferrer" className="w-full block text-center bg-[#F4F7FE] text-[#4318FF] font-bold text-xs py-3 rounded-xl hover:bg-[#4318FF] hover:text-white transition-colors">Download Attachment ↓</a>
                     ) : (
                        <div className="w-full text-center bg-gray-50 text-gray-400 font-bold text-xs py-3 rounded-xl border border-dashed border-gray-200">No Attachment</div>
                     )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- تاب الطلبة --- */}
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
  };

  // ==========================================
  // VIEW 3: CREATE LECTURE 
  // ==========================================
  const renderCreateLecture = () => (
    <div className="animate-fadeIn bg-white rounded-[40px] shadow-sm p-10 min-h-[80vh]">
      <div className="flex items-center gap-4 mb-10">
         <button onClick={() => setCurrentView('detail')} className="text-[#1B254B] hover:text-[#4318FF] transition-colors"><Icons.Back /></button>
         <h1 className="text-2xl font-bold text-[#1B254B]">Upload Lecture File</h1>
      </div>

      <form onSubmit={handleAddLecture} className="flex flex-col lg:flex-row gap-12">
         <div className="flex-1 space-y-6">
            <div>
               <label className="text-sm font-bold text-[#1B254B] mb-3 block">Course Name :</label>
               <div className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 bg-[#F8FAFC] text-sm font-bold text-gray-600">
                  {selectedClass?.name || 'Select a course'}
               </div>
            </div>
            <div className="w-full h-80 border-2 border-dashed border-[#1B254B] rounded-[40px] bg-[#F8FAFC] flex flex-col items-center justify-center relative hover:bg-gray-100 transition-colors">
               <input 
                  type="file" 
                  accept="video/*,application/pdf"
                  onChange={(e) => setLectureFile(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
               />
               {lectureFile ? (
                  <div className="text-center">
                     <span className="text-4xl">📄</span>
                     <p className="font-bold text-[#1B254B] mt-2">{lectureFile.name}</p>
                     <p className="text-xs text-gray-500">{(lectureFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
               ) : (
                  <div className="text-center pointer-events-none">
                     <h3 className="text-2xl font-black text-[#1B254B]">Click to Upload<br/>File</h3>
                     <p className="text-xs text-gray-400 font-bold mt-2">(PDF or Video)</p>
                  </div>
               )}
            </div>
         </div>

         <div className="flex-1 space-y-6">
            <div>
               <label className="text-sm font-bold text-[#1B254B] mb-3 block">Lecture Name :</label>
               <input type="text" required value={newLecture.title} onChange={e => setNewLecture({...newLecture, title: e.target.value})} 
                      className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 text-sm font-bold text-[#1B254B] outline-none focus:border-[#4318FF]" 
                      placeholder="e.g. Chapter 1: Introduction" />
            </div>

            <div>
               <label className="text-sm font-bold text-[#1B254B] mb-3 block">Duration (Mins) :</label>
               <input type="number" required value={newLecture.duration} onChange={e => setNewLecture({...newLecture, duration: e.target.value})} 
                      className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 text-sm font-bold text-[#1B254B] outline-none focus:border-[#4318FF]" />
            </div>

            <div className="flex gap-6 pt-4">
               <div onClick={() => setNewLecture({...newLecture, type: 'pdf'})} 
                    className={`flex-1 aspect-square rounded-[30px] border-2 flex flex-col items-center justify-center cursor-pointer transition-all
                    ${newLecture.type === 'pdf' ? 'border-[#1B254B] bg-[#F8FAFC] shadow-inner scale-[0.98]' : 'border-gray-200 hover:border-gray-300'}`}>
                  <div className="text-[#1B254B] mb-2"><Icons.Pdf /></div>
                  <span className="text-[#1B254B] font-bold text-sm">PDF</span>
               </div>
               <div onClick={() => setNewLecture({...newLecture, type: 'video'})} 
                    className={`flex-1 aspect-square rounded-[30px] border-2 flex flex-col items-center justify-center cursor-pointer transition-all
                    ${newLecture.type === 'video' ? 'border-[#1B254B] bg-[#F8FAFC] shadow-inner scale-[0.98]' : 'border-gray-200 hover:border-gray-300'}`}>
                  <div className="text-[#1B254B] mb-2"><Icons.Video /></div>
                  <span className="text-[#1B254B] font-bold text-sm">Video</span>
               </div>
            </div>

            <button type="submit" disabled={isSubmitting || !lectureFile} className={`w-full text-white py-4 rounded-full font-bold text-sm mt-6 shadow-lg transition-colors ${isSubmitting || !lectureFile ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#1B254B] hover:bg-black'}`}>
               {isSubmitting ? 'Uploading...' : (!lectureFile ? 'Please select a file' : 'Upload & Save')}
            </button>
         </div>
      </form>
    </div>
  );

  // ==========================================
  // VIEW 4: CREATE RESOURCE 
  // ==========================================
  const renderCreateResource = () => (
    <div className="animate-fadeIn bg-white rounded-[40px] shadow-sm p-10 min-h-[80vh]">
      <div className="flex items-center gap-4 mb-10">
         <button onClick={() => setCurrentView('detail')} className="text-[#1B254B] hover:text-[#4318FF] transition-colors"><Icons.Back /></button>
         <h1 className="text-2xl font-bold text-[#1B254B]">Upload Library Resource</h1>
      </div>

      <form onSubmit={handleAddResource} className="flex flex-col lg:flex-row gap-12">
         <div className="flex-1 space-y-6">
            <div>
               <label className="text-sm font-bold text-[#1B254B] mb-3 block">Course Name :</label>
               <div className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 bg-[#F8FAFC] text-sm font-bold text-gray-600">
                  {selectedClass?.name || 'Select a course'}
               </div>
            </div>
            
            <div className="w-full h-80 border-2 border-dashed border-[#1B254B]/30 rounded-[40px] bg-[#F8FAFC] flex flex-col items-center justify-center relative hover:bg-gray-100 transition-colors overflow-hidden">
               <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setResourceFile(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
               />
               {resourceFile ? (
                  <img src={URL.createObjectURL(resourceFile)} className="w-full h-full object-cover" alt="Preview" />
               ) : (
                  <div className="text-center pointer-events-none">
                     <div className="text-[#1B254B] mb-4 opacity-50 flex justify-center"><Icons.Book /></div>
                     <h3 className="text-2xl font-black text-[#1B254B]/50">Upload Cover<br/>Image</h3>
                  </div>
               )}
            </div>
         </div>

         <div className="flex-1 space-y-6">
            <div>
               <label className="text-sm font-bold text-[#1B254B] mb-3 block">Resource Title :</label>
               <input type="text" required value={newResource.title} onChange={e => setNewResource({...newResource, title: e.target.value})} 
                      className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 text-sm font-bold text-[#1B254B] outline-none focus:border-[#4318FF]" 
                      placeholder="e.g. Cambridge English Grammar" />
            </div>

            <div>
               <label className="text-sm font-bold text-[#1B254B] mb-3 block">Author / Publisher :</label>
               <input type="text" required value={newResource.author} onChange={e => setNewResource({...newResource, author: e.target.value})} 
                      className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 text-sm font-bold text-[#1B254B] outline-none focus:border-[#4318FF]" 
                      placeholder="e.g. Raymond Murphy" />
            </div>

            <div className="flex gap-4 pt-4">
               <div onClick={() => setNewResource({...newResource, type: 'book'})} 
                    className={`flex-1 py-4 rounded-2xl border-2 flex flex-col items-center justify-center cursor-pointer transition-all
                    ${newResource.type === 'book' ? 'border-[#1B254B] bg-[#F8FAFC] shadow-inner scale-[0.98]' : 'border-gray-200 hover:border-gray-300'}`}>
                  <span className="text-[#1B254B] font-bold text-sm">Book</span>
               </div>
               <div onClick={() => setNewResource({...newResource, type: 'video'})} 
                    className={`flex-1 py-4 rounded-2xl border-2 flex flex-col items-center justify-center cursor-pointer transition-all
                    ${newResource.type === 'video' ? 'border-[#1B254B] bg-[#F8FAFC] shadow-inner scale-[0.98]' : 'border-gray-200 hover:border-gray-300'}`}>
                  <span className="text-[#1B254B] font-bold text-sm">Video</span>
               </div>
               <div onClick={() => setNewResource({...newResource, type: 'note'})} 
                    className={`flex-1 py-4 rounded-2xl border-2 flex flex-col items-center justify-center cursor-pointer transition-all
                    ${newResource.type === 'note' ? 'border-[#1B254B] bg-[#F8FAFC] shadow-inner scale-[0.98]' : 'border-gray-200 hover:border-gray-300'}`}>
                  <span className="text-[#1B254B] font-bold text-sm">Notes</span>
               </div>
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full bg-[#1B254B] text-white py-4 rounded-full font-bold text-sm mt-6 hover:bg-black transition-colors shadow-lg">
               {isSubmitting ? 'Uploading...' : 'Upload Resource'}
            </button>
         </div>
      </form>
    </div>
  );

  // ==========================================
  // VIEW 5: CREATE HOMEWORK
  // ==========================================
  const renderCreateHomework = () => (
    <div className="animate-fadeIn bg-white rounded-[40px] shadow-sm p-10 min-h-[80vh]">
      <div className="flex items-center gap-4 mb-10">
         <button onClick={() => setCurrentView('detail')} className="text-[#1B254B] hover:text-[#4318FF] transition-colors"><Icons.Back /></button>
         <h1 className="text-2xl font-bold text-[#1B254B]">Assign Homework</h1>
      </div>

      <form onSubmit={handleAddHomework} className="flex flex-col lg:flex-row gap-12">
         <div className="flex-1 space-y-8">
            <div className="bg-[#F8FAFC] p-6 rounded-3xl border border-gray-100">
               <label className="text-sm font-bold text-[#1B254B] mb-4 block flex items-center justify-between">
                 <span>Select Groups to Assign:</span>
                 <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-md">{newHomework.selectedGroups.length} selected</span>
               </label>
               <div className="grid grid-cols-2 gap-3">
                  {classes.map(cls => (
                     <label key={cls.id} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors ${newHomework.selectedGroups.includes(cls.name) ? 'border-[#4318FF] bg-blue-50' : 'border-gray-200 bg-white hover:border-blue-300'}`}>
                        <input 
                           type="checkbox" 
                           checked={newHomework.selectedGroups.includes(cls.name)} 
                           onChange={() => toggleGroupSelection(cls.name)}
                           className="w-4 h-4 text-[#4318FF] rounded border-gray-300 focus:ring-[#4318FF]"
                        />
                        <span className="text-xs font-bold text-[#1B254B]">{cls.name}</span>
                     </label>
                  ))}
               </div>
            </div>
            
            <div className="w-full h-64 border-2 border-dashed border-[#1B254B]/30 rounded-[30px] bg-[#F8FAFC] flex flex-col items-center justify-center relative hover:bg-gray-100 transition-colors">
               <input 
                  type="file" 
                  accept="application/pdf,image/*,.doc,.docx"
                  onChange={(e) => setHomeworkFile(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
               />
               {homeworkFile ? (
                  <div className="text-center">
                     <span className="text-4xl">📎</span>
                     <p className="font-bold text-[#1B254B] mt-2">{homeworkFile.name}</p>
                     <p className="text-xs text-gray-500">{(homeworkFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
               ) : (
                  <div className="text-center pointer-events-none">
                     <div className="text-[#1B254B] mb-4 opacity-50 flex justify-center"><Icons.Homework /></div>
                     <h3 className="text-xl font-black text-[#1B254B]/50">Attach File<br/><span className="text-xs font-medium">(Optional)</span></h3>
                  </div>
               )}
            </div>
         </div>

         <div className="flex-1 space-y-6">
            <div>
               <label className="text-sm font-bold text-[#1B254B] mb-3 block">Homework Title :</label>
               <input type="text" required value={newHomework.title} onChange={e => setNewHomework({...newHomework, title: e.target.value})} 
                      className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 text-sm font-bold text-[#1B254B] outline-none focus:border-[#4318FF]" 
                      placeholder="e.g. Grammar Exercises Unit 4" />
            </div>

            <div>
               <label className="text-sm font-bold text-[#1B254B] mb-3 block">Instructions / Description :</label>
               <textarea required rows="6" value={newHomework.description} onChange={e => setNewHomework({...newHomework, description: e.target.value})} 
                      className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 text-sm font-medium text-gray-600 outline-none focus:border-[#4318FF] resize-none" 
                      placeholder="Write your instructions for the students here..." />
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full bg-[#1B254B] text-white py-4 rounded-full font-bold text-sm mt-6 hover:bg-black transition-colors shadow-lg">
               {isSubmitting ? 'Assigning...' : 'Send to Selected Groups'}
            </button>
         </div>
      </form>
    </div>
  );

  return (
    <div className="h-full w-full p-6 md:p-10 bg-[#F4F7FE] overflow-y-auto custom-scrollbar relative">
       {currentView === 'main' && renderMainDashboard()}
       {currentView === 'detail' && renderClassDetail()}
       {currentView === 'create_lecture' && renderCreateLecture()}
       {currentView === 'create_resource' && renderCreateResource()}
       {currentView === 'create_homework' && renderCreateHomework()}
    </div>
  );
};

export default TeacherClasses;
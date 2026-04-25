import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

const Icons = {
  Search: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
  Book: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>,
  Video: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>,
  // 💡 رجعتلك Notes هنا باش ما يكراشيش السيت
  Notes: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>,
  ChevronDown: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"></path></svg>
};

const StudentLibraries = () => {
  const [activeTab, setActiveTab] = useState('books'); 
  const [viewingResource, setViewingResource] = useState(null);
  
  const [studentClass, setStudentClass] = useState('');
  const [booksList, setBooksList] = useState([]);
  const [videosList, setVideosList] = useState([]);
  const [notesList, setNotesList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentDataAndResources = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: studentData } = await supabase
          .from('students')
          .select('group_name')
          .eq('email', user.email)
          .single();

        if (studentData && studentData.group_name) {
          const className = studentData.group_name;
          setStudentClass(className);

          const { data: resources } = await supabase
            .from('library_resources')
            .select('*')
            .eq('class_name', className);

          if (resources) {
            setBooksList(resources.filter(r => r.type === 'book'));
            setNotesList(resources.filter(r => r.type === 'note'));
          }

          const { data: lectures } = await supabase
            .from('lectures')
            .select('*')
            .eq('class_name', className);

          if (lectures) {
            setVideosList(lectures);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentDataAndResources();
  }, []);

  const libraryContent = {
    books: {
      featured: booksList[0] || { id: 'temp-book', title: "No Books Available", author: "Wait for Teacher", img: "https://images.unsplash.com/photo-1544640808-32ca72ac7f37?q=80&w=800&auto=format&fit=crop" },
      items: booksList.slice(1) 
    },
    videos: {
      featured: videosList[0] || { id: 'temp-vid', title: "No Lectures Yet", author: "Wait for Teacher", img: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop" },
      items: videosList.slice(1)
    },
    articles: {
      featured: notesList[0] || { id: 'temp-note', title: "No Notes Yet", author: "Wait for Teacher", img: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=800&auto=format&fit=crop" },
      side: notesList[1] || { id: 'temp-side', title: "Additional Reading", author: "Wait for Teacher", img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop" },
      items: notesList.slice(2)
    }
  };

  const handleOpenResource = (item) => {
    if (!item || item.id.toString().startsWith('temp-')) return; 
    setViewingResource(item);
  };

  if (viewingResource) {
    return (
      <div className="flex-1 p-8 animate-fadeIn">
        <button 
          onClick={() => setViewingResource(null)} 
          className="text-[#A3AED0] text-xs mb-8 hover:text-[#4318FF] flex items-center gap-2 font-black uppercase tracking-widest transition-all"
        >
          <span className="text-lg">←</span> Back to Library
        </button>
        <div className="bg-white rounded-[40px] p-12 shadow-sm border border-gray-100 min-h-[500px] flex flex-col items-center justify-center text-center">
            <h2 className="text-3xl font-black text-[#1B254B] mb-4 uppercase tracking-tighter">{viewingResource.title}</h2>
            <p className="text-[#A3AED0] font-bold uppercase tracking-widest text-sm mb-10">By {viewingResource.author || 'Teacher'}</p>
            
            {(viewingResource.img_url || viewingResource.thumbnail_url) ? (
              <a 
                href={viewingResource.img_url || viewingResource.thumbnail_url} 
                target="_blank" 
                rel="noreferrer"
                className="bg-[#4318FF] text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-800 transition-colors shadow-xl"
              >
                Open File / Resource ↗
              </a>
            ) : (
              <div className="w-full max-w-4xl aspect-video bg-[#F4F7FE] rounded-[32px] border-4 border-dashed border-gray-200 flex items-center justify-center">
                <p className="text-gray-400 font-black uppercase tracking-[0.2em]">No Attachment Found</p>
              </div>
            )}
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="flex-1 flex items-center justify-center"><p className="font-bold text-gray-500">Loading your class library... ⏳</p></div>;
  }

  return (
    <div className="flex-1 flex flex-col xl:flex-row gap-10 animate-fadeIn pb-10 p-8">
      <div className="flex-1 space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col space-y-1">
            <p className="text-[#A3AED0] text-[10px] font-black tracking-[0.3em] uppercase">Class: {studentClass || 'Not Assigned'}</p>
            <h1 className="text-[32px] font-black text-[#1B254B] uppercase tracking-tighter">My Library</h1>
          </div>
          
          <div className="flex items-center space-x-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"><Icons.Search /></span>
              <input 
                type="text" 
                placeholder={`Search my resources...`} 
                className="w-full bg-white border border-gray-100 rounded-2xl py-3.5 pl-14 pr-4 text-xs font-bold text-[#1B254B] focus:ring-2 focus:ring-[#4318FF]/20 outline-none shadow-sm transition-all"
              />
            </div>
          </div>
        </div>

        <div className="relative rounded-[45px] overflow-hidden h-[420px] shadow-sm group border-[12px] border-white bg-white">
          <img 
            src={libraryContent[activeTab].featured.img_url || libraryContent[activeTab].featured.thumbnail_url || libraryContent[activeTab].featured.img} 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 bg-gray-100" 
            alt="Hero" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B132B] via-[#0B132B]/40 to-transparent p-12 flex flex-col justify-end">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-[2px] w-8 bg-[#4318FF]"></span>
              <p className="text-white/80 text-[10px] font-black uppercase tracking-[0.4em]">Featured {activeTab}</p>
            </div>
            <h2 className="text-5xl font-black text-white mb-8 leading-[1.1] max-w-2xl uppercase tracking-tighter">{libraryContent[activeTab].featured.title}</h2>
            <button 
              onClick={() => handleOpenResource(libraryContent[activeTab].featured)}
              className={`bg-[#4318FF] text-white px-10 py-4.5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] w-fit transition-all shadow-xl shadow-blue-900/30 ${libraryContent[activeTab].featured.id.toString().startsWith('temp-') ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#3311CC] active:scale-95'}`}
            >
              {activeTab === 'videos' ? 'Watch Lecture' : 'Open Material'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-50">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-2 h-8 bg-[#4318FF] rounded-full"></div>
            <h3 className="text-xl font-black text-[#1B254B] uppercase tracking-widest">
              Available Resources
            </h3>
          </div>

          {activeTab === 'articles' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-8">
                {libraryContent.articles.items.length === 0 && <p className="text-gray-400 font-bold">No extra notes found.</p>}
                {libraryContent.articles.items.map((art, i) => (
                  <div key={art.id || i} onClick={() => handleOpenResource(art)} className="flex gap-6 p-6 rounded-3xl border border-gray-50 hover:bg-[#F4F7FE] transition-all cursor-pointer group">
                    <div className="w-40 h-28 shrink-0 overflow-hidden rounded-2xl bg-gray-100 flex items-center justify-center text-4xl">
                      {art.img_url ? <img src={art.img_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" /> : '📝'}
                    </div>
                    <div className="flex flex-col justify-center">
                      <h4 className="font-black text-[#1B254B] text-[17px] mb-3 group-hover:text-[#4318FF] uppercase tracking-tight transition-colors">{art.title}</h4>
                      <p className="text-[10px] text-[#A3AED0] font-black uppercase tracking-widest">{art.author || 'Teacher'}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div onClick={() => handleOpenResource(libraryContent.articles.side)} className={`bg-[#F4F7FE] p-6 rounded-[32px] relative overflow-hidden group border border-[#4318FF]/5 ${libraryContent.articles.side.id.toString().startsWith('temp-') ? 'cursor-default opacity-60' : 'cursor-pointer'}`}>
                 <img src={libraryContent.articles.side.img_url || libraryContent.articles.side.img} className="w-full h-44 object-cover rounded-2xl mb-6 shadow-sm bg-gray-200" alt="" />
                 <h4 className="font-black text-[#1B254B] text-sm uppercase tracking-tighter mb-4">{libraryContent.articles.side.title}</h4>
                 <div className="flex items-center text-[10px] text-[#4318FF] font-black tracking-widest uppercase">
                    Read material <span className="ml-2">→</span>
                 </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
              {libraryContent[activeTab].items.length === 0 && <p className="col-span-4 text-gray-400 font-bold text-center">No materials uploaded yet.</p>}
              {libraryContent[activeTab].items.map((item, idx) => (
                <div key={item.id || idx} onClick={() => handleOpenResource(item)} className="group cursor-pointer">
                  <div className={`rounded-[28px] overflow-hidden shadow-sm mb-5 border border-gray-100 relative bg-gray-100 flex items-center justify-center ${activeTab === 'books' ? 'aspect-[3/4.2]' : 'aspect-video'}`}>
                    {(item.img_url || item.thumbnail_url) ? (
                      <img src={item.img_url || item.thumbnail_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                    ) : (
                      <span className="text-4xl opacity-50">{activeTab === 'books' ? '📚' : '▶️'}</span>
                    )}
                    
                    {item.duration && (
                      <span className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-lg tracking-widest">{item.duration} MIN</span>
                    )}
                    <div className="absolute inset-0 bg-[#0B132B]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <div className="bg-white text-[#4318FF] w-12 h-12 rounded-full shadow-2xl flex items-center justify-center transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                          {activeTab === 'videos' ? '▶' : '🔍'}
                       </div>
                    </div>
                  </div>
                  <h4 className="font-black text-[#1B254B] text-[14px] leading-tight mb-2 group-hover:text-[#4318FF] transition-colors line-clamp-2 uppercase tracking-tighter">{item.title}</h4>
                  <p className="text-[10px] text-[#A3AED0] font-bold uppercase tracking-widest">{item.author || item.type}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SIDEBAR */}
      <div className="w-full xl:w-[350px] shrink-0 flex flex-col space-y-8">
        <p className="text-right text-[10px] font-black text-[#A3AED0] uppercase tracking-[0.3em]">Module Explorer</p>
        
        <div className="bg-white p-8 rounded-[40px] border border-gray-50 shadow-sm space-y-4">
          {[
            { id: 'books', label: 'Class Books', sub: `${booksList.length} Files`, icon: <Icons.Book />, color: 'text-blue-500 bg-blue-50', active: 'bg-[#4318FF] text-white' },
            { id: 'videos', label: 'Lectures', sub: `${videosList.length} Videos`, icon: <Icons.Video />, color: 'text-green-500 bg-green-50', active: 'bg-[#01B574] text-white' },
            { id: 'articles', label: 'Teacher Notes', sub: `${notesList.length} Notes`, icon: <Icons.Notes />, color: 'text-purple-500 bg-purple-50', active: 'bg-[#7551FF] text-white' }
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center p-5 rounded-3xl transition-all group border-2 font-black uppercase tracking-widest ${activeTab === tab.id ? 'border-transparent ' + tab.active : 'border-transparent hover:bg-[#F4F7FE] text-[#1B254B]'}`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mr-5 shadow-sm transition-colors ${activeTab === tab.id ? 'bg-white/20' : tab.color}`}>
                {tab.icon}
              </div>
              <div className="text-left">
                <p className="text-[13px] tracking-tighter">{tab.label}</p>
                <p className={`text-[9px] font-bold opacity-60`}>{tab.sub}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentLibraries;
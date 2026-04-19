import React, { useState } from 'react';

const Icons = {
  Search: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
  Book: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>,
  Video: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>,
  Article: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>,
  ChevronDown: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"></path></svg>
};

const StudentLibraries = () => {
  const [activeTab, setActiveTab] = useState('books'); 
  const [selectedLang, setSelectedLang] = useState('English');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [viewingResource, setViewingResource] = useState(null);

  const languages = ['English', 'French', 'Spanish', 'German', 'Italian', 'Arabic'];

  const libraryContent = {
    books: {
      featured: { title: "Academic Grammar: Advanced Level", author: "Academic Board", img: "https://images.unsplash.com/photo-1544640808-32ca72ac7f37?q=80&w=800&auto=format&fit=crop" },
      items: [
        { title: "Business English Masterclass", author: "Dr. Robert Wilson", img: "https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=800&auto=format&fit=crop" },
        { title: "French Literature Vol. 2", author: "Prof. Jean Marc", img: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=800&auto=format&fit=crop" },
        { title: "Spanish Conversation Guide", author: "Maria Garcia", img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop" },
        { title: "German Vocabulary Hub", author: "Hans Schmidt", img: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=800&auto=format&fit=crop" }
      ]
    },
    videos: {
      featured: { title: "Native Pronunciation Workshop", author: "Fluentia Experts", img: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop" },
      items: [
        { title: "Advanced Listening Skills", author: "Language Lab", img: "https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=800&auto=format&fit=crop", duration: "15:40" },
        { title: "Idiomatic Expressions 101", author: "Prof. Sarah", img: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800&auto=format&fit=crop", duration: "08:12" },
        { title: "Public Speaking in French", author: "Academy Media", img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop", duration: "22:05" },
        { title: "German Grammar Visualized", author: "Linguistics Hub", img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop", duration: "10:30" }
      ]
    },
    articles: {
      featured: { title: "The Neuroscience of Bilingualism", author: "Science Academic", img: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=800&auto=format&fit=crop" },
      side: { title: "Cultural Integration", author: "History Insights", img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop" },
      items: [
        { title: "Art as a Language Universal", author: "Global Culture", img: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=800&auto=format&fit=crop" },
        { title: "Psychological Benefits of Sunlight", author: "Health Lab", img: "https://images.unsplash.com/photo-1502444330042-d1a1ddf9bb5b?q=80&w=800&auto=format&fit=crop" }
      ]
    }
  };

  const handleOpenResource = (item) => {
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
            <p className="text-[#A3AED0] font-bold uppercase tracking-widest text-sm mb-10">By {viewingResource.author}</p>
            <div className="w-full max-w-4xl aspect-video bg-[#F4F7FE] rounded-[32px] border-4 border-dashed border-gray-200 flex items-center justify-center">
              <p className="text-gray-400 font-black uppercase tracking-[0.2em]">Secure Resource Viewer Loaded</p>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col xl:flex-row gap-10 animate-fadeIn pb-10">
      
      <div className="flex-1 space-y-10">
        
        {/* HEADER & SEARCH */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col space-y-1">
            <p className="text-[#A3AED0] text-[10px] font-black tracking-[0.3em] uppercase">Academic Hub</p>
            <h1 className="text-[32px] font-black text-[#1B254B] uppercase tracking-tighter">Media Library</h1>
          </div>
          
          <div className="flex items-center space-x-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"><Icons.Search /></span>
              <input 
                type="text" 
                placeholder={`Search records...`} 
                className="w-full bg-white border border-gray-100 rounded-2xl py-3.5 pl-14 pr-4 text-xs font-bold text-[#1B254B] focus:ring-2 focus:ring-[#4318FF]/20 outline-none shadow-sm transition-all"
              />
            </div>
            <div className="relative">
              <button 
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="bg-white px-6 py-3.5 rounded-2xl border border-gray-100 shadow-sm text-xs font-black text-[#1B254B] flex items-center gap-3 uppercase tracking-widest transition-all hover:bg-gray-50"
              >
                {selectedLang} <Icons.ChevronDown />
              </button>
              {showLangMenu && (
                <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden py-2 animate-fadeIn">
                  {languages.map(lang => (
                    <button key={lang} onClick={() => {setSelectedLang(lang); setShowLangMenu(false);}} className="w-full text-left px-5 py-3 text-xs font-bold text-[#1B254B] hover:bg-[#F4F7FE] hover:text-[#4318FF] transition-all">
                      {lang}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* HERO SECTION */}
        <div className="relative rounded-[45px] overflow-hidden h-[420px] shadow-sm group border-[12px] border-white bg-white">
          <img 
            src={libraryContent[activeTab].featured.img} 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
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
              className="bg-[#4318FF] text-white px-10 py-4.5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] w-fit hover:bg-[#3311CC] transition-all shadow-xl shadow-blue-900/30 active:scale-95"
            >
              {activeTab === 'videos' ? 'Begin Session' : 'Access Document'}
            </button>
          </div>
        </div>

        {/* DYNAMIC GRID CONTENT */}
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
                {libraryContent.articles.items.map((art, i) => (
                  <div key={i} onClick={() => handleOpenResource(art)} className="flex gap-6 p-6 rounded-3xl border border-gray-50 hover:bg-[#F4F7FE] transition-all cursor-pointer group">
                    <div className="w-40 h-28 shrink-0 overflow-hidden rounded-2xl">
                      <img src={art.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <h4 className="font-black text-[#1B254B] text-[17px] mb-3 group-hover:text-[#4318FF] uppercase tracking-tight transition-colors">{art.title}</h4>
                      <p className="text-[10px] text-[#A3AED0] font-black uppercase tracking-widest">{art.author}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div onClick={() => handleOpenResource(libraryContent.articles.side)} className="bg-[#F4F7FE] p-6 rounded-[32px] relative overflow-hidden group cursor-pointer border border-[#4318FF]/5">
                 <img src={libraryContent.articles.side.img} className="w-full h-44 object-cover rounded-2xl mb-6 shadow-sm" alt="" />
                 <h4 className="font-black text-[#1B254B] text-sm uppercase tracking-tighter mb-4">{libraryContent.articles.side.title}</h4>
                 <div className="flex items-center text-[10px] text-[#4318FF] font-black tracking-widest uppercase">
                    Read special record <span className="ml-2">→</span>
                 </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
              {libraryContent[activeTab].items.map((item, idx) => (
                <div key={idx} onClick={() => handleOpenResource(item)} className="group cursor-pointer">
                  <div className={`rounded-[28px] overflow-hidden shadow-sm mb-5 border border-gray-100 relative ${activeTab === 'books' ? 'aspect-[3/4.2]' : 'aspect-video'}`}>
                    <img src={item.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                    {item.duration && (
                      <span className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-lg tracking-widest">{item.duration}</span>
                    )}
                    <div className="absolute inset-0 bg-[#0B132B]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <div className="bg-white text-[#4318FF] w-12 h-12 rounded-full shadow-2xl flex items-center justify-center transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                          {activeTab === 'videos' ? '▶' : '🔍'}
                       </div>
                    </div>
                  </div>
                  <h4 className="font-black text-[#1B254B] text-[14px] leading-tight mb-2 group-hover:text-[#4318FF] transition-colors line-clamp-2 uppercase tracking-tighter">{item.title}</h4>
                  <p className="text-[10px] text-[#A3AED0] font-bold uppercase tracking-widest">{item.author}</p>
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
            { id: 'books', label: 'Curriculum Books', sub: 'Course Guides', icon: <Icons.Book />, color: 'text-blue-500 bg-blue-50', active: 'bg-[#4318FF] text-white' },
            { id: 'videos', label: 'Media Lectures', sub: 'Video Portal', icon: <Icons.Video />, color: 'text-green-500 bg-green-50', active: 'bg-[#01B574] text-white' },
            { id: 'articles', label: 'Academic Articles', sub: 'Scientific Reading', icon: <Icons.Article />, color: 'text-purple-500 bg-purple-50', active: 'bg-[#7551FF] text-white' }
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

        {/* GOAL CARD */}
        <div className="bg-[#111C44] rounded-[45px] p-10 text-white relative overflow-hidden shadow-2xl">
           <div className="relative z-10">
              <h4 className="text-xl font-black mb-3 uppercase tracking-tighter leading-tight">Achievement Track</h4>
              <p className="text-[11px] text-white/50 mb-8 leading-relaxed font-bold uppercase tracking-widest">Complete 2 more resources to meet your monthly proficiency target.</p>
              
              <div className="space-y-3">
                <div className="flex justify-between text-[11px] font-black uppercase tracking-widest">
                   <span>Progress</span>
                   <span className="text-[#4318FF]">80%</span>
                </div>
                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden p-0.5">
                   <div className="w-[80%] h-full bg-[#4318FF] rounded-full shadow-[0_0_20px_rgba(67,24,255,0.6)]"></div>
                </div>
              </div>
           </div>
           <div className="absolute -right-10 -bottom-10 text-[180px] opacity-5 font-black select-none pointer-events-none">80</div>
        </div>
      </div>
    </div>
  );
};

export default StudentLibraries;
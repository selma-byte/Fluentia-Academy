import React, { useState } from 'react';

const StudentLibraries = () => {
  const [activeTab, setActiveTab] = useState('books'); 
  const [selectedLang, setSelectedLang] = useState('English');
  const [showLangMenu, setShowLangMenu] = useState(false);

  const languages = ['English', 'French', 'Spanish', 'German', 'Italian', 'Arabic', 'Hindi'];

  const libraryContent = {
    books: {
      featured: { title: "Batman: The Dark Knight", author: "Frank Miller", img: "https://m.media-amazon.com/images/I/815QpgP2SLL._AC_UF1000,1000_QL80_.jpg" },
      items: [
        { title: "The flash, Vol. 1", author: "Joshua Williamson", img: "https://m.media-amazon.com/images/I/91M-vVjY0FL._AC_UF1000,1000_QL80_.jpg" },
        { title: "Titans, Vol. 2", author: "Andrew Robinson", img: "https://m.media-amazon.com/images/I/91-NqXqM+sL._AC_UF1000,1000_QL80_.jpg" },
        { title: "Harley Quinn, Vol. 1", author: "Jimmy Palmiotti", img: "https://m.media-amazon.com/images/I/81+m5D7C1uL._AC_UF1000,1000_QL80_.jpg" },
        { title: "Suicide Squad #8", author: "Tom Taylor", img: "https://m.media-amazon.com/images/I/91tW1-O-yKL._AC_UF1000,1000_QL80_.jpg" }
      ]
    },
    videos: {
      featured: { title: "Numbers Song & Phonics", author: "Kids Learning", img: "https://img.youtube.com/vi/D0Ajq682yrA/maxresdefault.jpg" },
      items: [
        { title: "Learn Colors & Spelling", author: "Playground", img: "https://img.youtube.com/vi/n_V-5vSmsY0/0.jpg", duration: "05:20" },
        { title: "Story of Nara & Teddy", author: "Bedtime Stories", img: "https://img.youtube.com/vi/7D4gVvS7_84/0.jpg", duration: "12:15" },
        { title: "English Alphabet", author: "ABC Kids", img: "https://img.youtube.com/vi/jPVbJ-Ir2y0/0.jpg", duration: "10:00" },
        { title: "Phonics Masterclass", author: "Learning Time", img: "https://img.youtube.com/vi/ffeVXvY_uR8/0.jpg", duration: "08:45" }
      ]
    },
    articles: {
      featured: { title: "Kidney disease is called silent killer for a reason", author: "Medical Insight", img: "https://media.post.rvohealth.io/wp-content/uploads/2020/08/732x549-The_Silent_Killer_of_Kidneys-1-732x549.jpg" },
      side: { title: "Famous Landmarks", author: "History Channel", img: "https://www.history.com/.image/ar_1:1%2Cc_fill%2Ccs_srgb%2Cfl_progressive%2Cq_auto:good%2Cw_1200/MTY1MTc3MjkyNzExNzczNjE1/statue-of-liberty-gettyimages-530755444.jpg" },
      items: [
        { title: "The impact of art of our today's society", author: "Culture Weekly", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_xN8E4r_Y6Y2_E8y_S0uI6D3Xk1_hQ7wXGg&s" },
        { title: "8 amazing benefits of the sunlight", author: "Health Today", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0NfFwP9_B8w_X6D8_L7e_T_M8o6uU_L8ySg&s" }
      ]
    }
  };

  return (
    <div className="flex-1 flex flex-col xl:flex-row gap-8 animate-fadeIn pb-10">
      
      {/* LEFT CONTENT AREA */}
      <div className="flex-1 space-y-6">
        
        {/* HEADER & SEARCH MATCHED TO ATTENDANCE PAGE */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-[28px] font-bold text-[#1B254B]">Media Library</h1>
          
          <div className="flex items-center space-x-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <span className="absolute left-4 top-2.5 text-gray-400">🔍</span>
              <input 
                type="text" 
                placeholder={`Search in ${activeTab}...`} 
                className="w-full bg-white border border-gray-100 rounded-full py-2.5 pl-10 pr-4 text-[11px] focus:ring-1 focus:ring-[#4318FF] outline-none shadow-sm"
              />
            </div>
            <button 
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="bg-white px-5 py-2.5 rounded-full border border-gray-100 shadow-sm text-[11px] font-bold text-[#1B254B] flex items-center gap-2"
            >
              {selectedLang} <span className="text-gray-400 text-[8px]">▼</span>
            </button>
          </div>
        </div>

        {/* HERO SECTION - Professional Banner */}
        <div className="relative rounded-[30px] overflow-hidden h-[360px] shadow-sm group">
          <img 
            src={libraryContent[activeTab].featured.img} 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
            alt="Hero" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111C44] via-[#111C44]/40 to-transparent p-10 flex flex-col justify-end">
            <p className="text-white/70 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Featured {activeTab}</p>
            <h2 className="text-4xl font-black text-white mb-6 leading-tight max-w-xl">{libraryContent[activeTab].featured.title}</h2>
            <button className="bg-[#4318FF] text-white px-8 py-3.5 rounded-xl font-bold w-max hover:bg-[#3311CC] transition-all shadow-lg shadow-blue-900/20 active:scale-95">
              {activeTab === 'videos' ? '▶ Play Now' : '📖 Start Reading'}
            </button>
          </div>
        </div>

        {/* DYNAMIC GRID CONTENT */}
        <div className="bg-white rounded-[25px] p-8 shadow-sm border border-gray-50">
          <h3 className="text-lg font-bold text-[#1B254B] mb-8 flex items-center">
             <span className="w-1.5 h-6 bg-[#4318FF] rounded-full mr-3"></span>
             Browse All {activeTab}
          </h3>

          {/* Special Layout for Articles */}
          {activeTab === 'articles' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                {libraryContent.articles.items.map((art, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-2xl border border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer group">
                    <img src={art.img} className="w-32 h-24 object-cover rounded-xl shadow-sm" alt="" />
                    <div>
                      <h4 className="font-bold text-[#1B254B] text-[15px] mb-2 group-hover:text-[#4318FF]">{art.title}</h4>
                      <p className="text-[11px] text-[#A3AED0] font-bold uppercase tracking-widest">{art.author}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-[#F4F7FE] p-5 rounded-2xl relative overflow-hidden group cursor-pointer">
                 <img src={libraryContent.articles.side.img} className="w-full h-40 object-cover rounded-xl mb-4" alt="" />
                 <h4 className="font-bold text-[#1B254B] text-sm">{libraryContent.articles.side.title}</h4>
                 <p className="text-[10px] text-[#4318FF] font-bold mt-2">READ SPECIAL →</p>
              </div>
            </div>
          ) : (
            /* Layout for Books and Videos */
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {libraryContent[activeTab].items.map((item, idx) => (
                <div key={idx} className="group cursor-pointer">
                  <div className={`rounded-2xl overflow-hidden shadow-sm mb-4 border border-gray-100 relative ${activeTab === 'books' ? 'aspect-[3/4.2]' : 'aspect-video'}`}>
                    <img src={item.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                    {item.duration && (
                      <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">{item.duration}</span>
                    )}
                    <div className="absolute inset-0 bg-[#4318FF]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <span className="bg-white text-[#4318FF] p-3 rounded-full shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform">
                          {activeTab === 'videos' ? '▶' : '🔍'}
                       </span>
                    </div>
                  </div>
                  <h4 className="font-bold text-[#1B254B] text-[13px] leading-tight mb-1 group-hover:text-[#4318FF] transition-colors line-clamp-2">{item.title}</h4>
                  <p className="text-[11px] text-[#A3AED0] font-medium">{item.author}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SIDEBAR - FIXED SIZE MATCHED TO OTHER PAGES */}
      <div className="w-full xl:w-[320px] shrink-0 space-y-6">
        <div className="text-right text-[11px] font-bold text-[#A3AED0] uppercase tracking-widest">Library Explorer</div>
        
        <div className="bg-white p-6 rounded-[25px] border border-gray-50 shadow-sm space-y-3">
          {[
            { id: 'books', label: 'Digital Books', sub: 'Comics & PDF', icon: '📖', color: 'bg-blue-50 text-blue-500', active: 'bg-[#4318FF] text-white' },
            { id: 'videos', label: 'Video Lessons', sub: 'Tutorials & Stories', icon: '🎥', color: 'bg-green-50 text-green-500', active: 'bg-[#01B574] text-white' },
            { id: 'articles', label: 'Academic Read', sub: 'Scientific Blogs', icon: '📄', color: 'bg-purple-50 text-purple-500', active: 'bg-[#7551FF] text-white' }
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center p-4 rounded-2xl transition-all group border-2 ${activeTab === tab.id ? 'border-transparent ' + tab.active : 'border-transparent hover:bg-gray-50'}`}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mr-4 shadow-sm ${activeTab === tab.id ? 'bg-white/20' : tab.color}`}>
                <span className="text-xl">{tab.icon}</span>
              </div>
              <div className="text-left">
                <p className={`text-[14px] font-bold ${activeTab === tab.id ? 'text-white' : 'text-[#1B254B]'}`}>{tab.label}</p>
                <p className={`text-[10px] font-medium uppercase tracking-tight ${activeTab === tab.id ? 'text-white/70' : 'text-[#A3AED0]'}`}>{tab.sub}</p>
              </div>
            </button>
          ))}
        </div>

        {/* PROGRESS CARD */}
        <div className="bg-[#111C44] rounded-[30px] p-8 text-white relative overflow-hidden shadow-xl">
           <div className="relative z-10">
              <h4 className="text-lg font-bold mb-2">Reading Goal</h4>
              <p className="text-[11px] text-white/50 mb-6 leading-relaxed">You are only 2 books away from your monthly target!</p>
              
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold">
                   <span>Progress</span>
                   <span>80%</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                   <div className="w-[80%] h-full bg-[#4318FF] shadow-[0_0_15px_rgba(67,24,255,0.5)]"></div>
                </div>
              </div>
           </div>
           {/* Decorative Element */}
           <div className="absolute -right-8 -bottom-8 text-9xl opacity-10 font-black">80</div>
        </div>
      </div>
    </div>
  );
};

export default StudentLibraries;
import React, { useState } from 'react';

const StudentLibraries = () => {
  // State تاع الفلترة
  const [activeCategory, setActiveCategory] = useState('Books');
  const [searchQuery, setSearchQuery] = useState('');

  // الداتا (same as teacher, read-only for student)
  const [resources] = useState([
    // Books
    { id: 1, type: 'Books', title: 'Batman: The Dark Knight', author: 'Frank Miller', isHero: true, img: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?q=80&w=800&auto=format&fit=crop' },
    { id: 2, type: 'Books', title: 'The Flash, Vol. 1', author: 'Joshua Williamson', isGrid: true, img: 'https://images.unsplash.com/photo-1534809027769-b00d750a6bac?q=80&w=400&auto=format&fit=crop' },
    { id: 3, type: 'Books', title: 'Titans, Vol. 2', author: 'Andrew Robinson', isGrid: true, img: 'https://images.unsplash.com/photo-1531259683007-016a7b628fc3?q=80&w=400&auto=format&fit=crop' },
    { id: 4, type: 'Books', title: 'Harley Quinn, Vol 1', author: 'Jimmy Palmiotti', isGrid: true, img: 'https://images.unsplash.com/photo-1580477667995-2b71488140f0?q=80&w=400&auto=format&fit=crop' },
    { id: 5, type: 'Books', title: 'Kobra Kai: Ultimate', author: 'Continue Reading', isSidebar: true, progress: '39%', img: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=400&auto=format&fit=crop' },

    // Videos
    { id: 6, type: 'Videos', title: 'Numbers song', author: 'Kids Learning', isHero: true, img: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=800&auto=format&fit=crop' },
    { id: 7, type: 'Videos', title: 'Learn Colors & Spelling', author: 'Indoor Playground', isGrid: true, img: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=400&auto=format&fit=crop' },
    { id: 8, type: 'Videos', title: 'Story of nara & teddy', author: 'Kids Tales', isGrid: true, img: 'https://images.unsplash.com/photo-1555252133-255e2d1ebca5?q=80&w=400&auto=format&fit=crop' },
    { id: 9, type: 'Videos', title: 'Learning manners', author: 'Continue Watching', isSidebar: true, img: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=400&auto=format&fit=crop' },

    // Articles
    { id: 10, type: 'Articles', title: 'Kidney disease is called silent killer for a reason', author: 'Medical Journal', isHero: true, img: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?q=80&w=800&auto=format&fit=crop' },
    { id: 11, type: 'Articles', title: "The impact of art of our today's society", author: 'Culture Weekly', isGrid: true, img: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=400&auto=format&fit=crop' },
    { id: 12, type: 'Articles', title: '8 amazing benifits of the sunlight', author: 'Health Tips', isGrid: true, img: 'https://images.unsplash.com/photo-1504386106331-3e4e71712b38?q=80&w=400&auto=format&fit=crop' },
    { id: 13, type: 'Articles', title: 'Famous Landmarks', author: 'Continue Reading', isSidebar: true, img: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=400&auto=format&fit=crop' },
  ]);

  // filtre
  const currentItems = resources.filter(
    r =>
      r.type === activeCategory &&
      r.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const heroItem = currentItems.find(r => r.isHero) || currentItems[0];
  const sidebarItem = currentItems.find(r => r.isSidebar);
  const gridItems = currentItems.filter(r => !r.isHero && !r.isSidebar);

  return (
    <div className="flex-1 p-8 overflow-y-auto custom-scrollbar animate-fadeIn relative">

      {/* HEADER (same design) */}
      <div className="flex justify-between items-end mb-8">
        <h1 className="text-3xl font-bold text-[#1B254B]">
          👋 Welcome, Student
        </h1>
        <div className="text-right">
          <p className="text-xs font-bold text-gray-400">12 Jan 2024, Friday</p>
          <p className="text-xs font-bold text-[#1B254B]">Semester 3 of 8</p>
        </div>
      </div>

      {/* SEARCH (NO ADD BUTTON FOR STUDENT) */}
      <div className="flex items-center gap-4 mb-8">
        <div className="relative flex-1 max-w-2xl">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
          <input
            type="text"
            placeholder="Search books, videos, or articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border-2 border-gray-100 rounded-2xl py-4 pl-12 pr-4 font-medium text-[#1B254B] outline-none focus:border-[#4318FF] shadow-sm transition-all"
          />
        </div>

        <select className="bg-white border-2 border-gray-100 rounded-2xl px-4 py-4 text-sm font-bold text-gray-500 outline-none cursor-pointer">
          <option>Select Language</option>
          <option>English</option>
          <option>French</option>
        </select>
      </div>

      <div className="flex gap-8">

        {/* LEFT CONTENT */}
        <div className="flex-1">

          {/* HERO */}
          {heroItem && (
            <div className="relative w-full h-[350px] rounded-[30px] overflow-hidden mb-8 shadow-lg group cursor-pointer">
              <img src={heroItem.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A1128]/90 via-[#0A1128]/40 to-transparent"></div>

              {activeCategory === 'Videos' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-black/50 rounded-full flex items-center justify-center text-white text-3xl">
                    ▶
                  </div>
                </div>
              )}

              <div className="absolute bottom-8 left-8 pr-8">
                <p className="text-gray-300 font-medium mb-1">{heroItem.author}</p>
                <h2 className="text-4xl font-bold text-white mb-4">
                  {heroItem.title}
                </h2>

                <button className="bg-white text-[#1B254B] px-6 py-2 rounded-full font-bold text-sm">
                  {activeCategory === 'Books' || activeCategory === 'Articles'
                    ? 'Read Now'
                    : 'Watch Now'}
                </button>
              </div>
            </div>
          )}

          {/* TITLE */}
          <h3 className="text-2xl font-bold text-[#1B254B] mb-6">
            {activeCategory === 'Books'
              ? 'Top Rated Comics'
              : activeCategory === 'Videos'
              ? 'Best Videos'
              : 'Most read'}
          </h3>

          {/* GRID */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pb-4">
            {gridItems.map((item) => (
              <div key={item.id} className="cursor-pointer group">
                <div className="aspect-[4/5] rounded-[20px] overflow-hidden mb-3 shadow-sm">
                  <img src={item.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h4 className="font-bold text-[#1B254B]">{item.title}</h4>
                <p className="text-xs text-gray-500">{item.author}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="w-64 shrink-0 flex flex-col gap-8">

          {/* CATEGORY FILTER */}
          <div>
            <h3 className="text-lg font-bold text-[#1B254B] mb-4 text-center">
              Resources
            </h3>

            <div className="flex flex-col gap-3">

              <button onClick={() => setActiveCategory('Books')}
                className={`py-4 rounded-[20px] font-bold ${activeCategory === 'Books' ? 'bg-[#ffe4e1]' : 'bg-gray-50'}`}>
                📔 Books
              </button>

              <button onClick={() => setActiveCategory('Videos')}
                className={`py-4 rounded-[20px] font-bold ${activeCategory === 'Videos' ? 'bg-[#e0f7fa]' : 'bg-gray-50'}`}>
                🎬 Videos
              </button>

              <button onClick={() => setActiveCategory('Articles')}
                className={`py-4 rounded-[20px] font-bold ${activeCategory === 'Articles' ? 'bg-[#f3e5f5]' : 'bg-gray-50'}`}>
                📰 Articles
              </button>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StudentLibraries;
import React, { useState } from 'react';

const TeacherLibraries = () => {
  // State تاع الفلترة (شنو راهو يشوف درك؟)
  const [activeCategory, setActiveCategory] = useState('Books');
  const [searchQuery, setSearchQuery] = useState('');
  
  // State تاع النافذة المنبثقة (Modal) لإضافة محتوى
  const [showModal, setShowModal] = useState(false);
  const [newResource, setNewResource] = useState({ title: '', type: 'Books', author: '', image: '' });

  // الداتا التجريبية (مخلطة بين الكتب، الفيديوهات، والمقالات)
  const [resources, setResources] = useState([
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
    { id: 11, type: 'Articles', title: 'The impact of art of our today\'s society', author: 'Culture Weekly', isGrid: true, img: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=400&auto=format&fit=crop' },
    { id: 12, type: 'Articles', title: '8 amazing benifits of the sunlight', author: 'Health Tips', isGrid: true, img: 'https://images.unsplash.com/photo-1504386106331-3e4e71712b38?q=80&w=400&auto=format&fit=crop' },
    { id: 13, type: 'Articles', title: 'Famous Landmarks', author: 'Continue Reading', isSidebar: true, img: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=400&auto=format&fit=crop' },
  ]);

  // دالة إضافة محتوى جديد
  const handleAddResource = (e) => {
    e.preventDefault();
    const newItem = {
      id: resources.length + 1,
      type: newResource.type,
      title: newResource.title,
      author: newResource.author || 'Teacher Added',
      isGrid: true, // الجديد ديما يروح للـ Grid لتحت
      img: newResource.image || `https://picsum.photos/seed/${Math.random()}/400/400`
    };
    setResources([...resources, newItem]);
    setShowModal(false);
    setActiveCategory(newResource.type); // يديه مباشرة للقسم اللي زاد فيه
    setNewResource({ title: '', type: 'Books', author: '', image: '' });
  };

  // تصفية المحتوى حسب الفلتر والبحث
  const currentItems = resources.filter(r => r.type === activeCategory && r.title.toLowerCase().includes(searchQuery.toLowerCase()));
  
  const heroItem = currentItems.find(r => r.isHero) || currentItems[0];
  const sidebarItem = currentItems.find(r => r.isSidebar);
  const gridItems = currentItems.filter(r => !r.isHero && !r.isSidebar);

  return (
    <div className="flex-1 p-8 overflow-y-auto custom-scrollbar animate-fadeIn relative">
      
      {/* =======================================
          Modal (نافذة إضافة محتوى جديد)
          ======================================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center animate-fadeIn">
          <div className="bg-white rounded-2xl p-8 w-[500px] shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#1B254B]">Add New Resource</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-red-500 font-bold text-xl">✕</button>
            </div>
            <form onSubmit={handleAddResource} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-[#1B254B] mb-1">Title</label>
                <input type="text" required value={newResource.title} onChange={(e)=>setNewResource({...newResource, title: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2 outline-none focus:border-[#4318FF]" placeholder="e.g. Advanced Grammar" />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-[#1B254B] mb-1">Category</label>
                  <select value={newResource.type} onChange={(e)=>setNewResource({...newResource, type: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2 outline-none focus:border-[#4318FF]">
                    <option value="Books">Books / Comics</option>
                    <option value="Videos">Videos</option>
                    <option value="Articles">Articles</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-bold text-[#1B254B] mb-1">Author / Creator</label>
                  <input type="text" value={newResource.author} onChange={(e)=>setNewResource({...newResource, author: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2 outline-none focus:border-[#4318FF]" placeholder="Optional" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#1B254B] mb-1">Cover Image URL</label>
                <input type="text" value={newResource.image} onChange={(e)=>setNewResource({...newResource, image: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2 outline-none focus:border-[#4318FF]" placeholder="https://..." />
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-100 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 bg-[#4318FF] text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-md">Add Resource</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header & Title */}
      <div className="flex justify-between items-end mb-8">
        <h1 className="text-3xl font-bold text-[#1B254B]">👋 Welcome, [Teacher Name]</h1>
        <div className="text-right">
          <p className="text-xs font-bold text-gray-400">12 Jan 2024, Friday</p>
          <p className="text-xs font-bold text-[#1B254B]">Semester 3 of 8</p>
        </div>
      </div>

      {/* Search Bar & Actions */}
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

        {/* 🟢 القفلة السحرية تاع الأستاذ باش يزيد محتوى 🟢 */}
        <button 
          onClick={() => setShowModal(true)}
          className="bg-[#1B254B] text-white px-6 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-[#4318FF] transition-colors shadow-md shrink-0"
        >
          <span className="text-xl">+</span> Add Resource
        </button>
      </div>

      <div className="flex gap-8">
        {/* =======================================
            الجهة اليسرى (المحتوى الرئيسي)
            ======================================= */}
        <div className="flex-1">
          {heroItem && (
            <div className="relative w-full h-[350px] rounded-[30px] overflow-hidden mb-8 shadow-lg group cursor-pointer">
              <img src={heroItem.img} alt={heroItem.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A1128]/90 via-[#0A1128]/40 to-transparent"></div>
              
              {activeCategory === 'Videos' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-3xl hover:bg-[#4318FF] transition-colors">▶</div>
                </div>
              )}

              <div className="absolute bottom-8 left-8 pr-8">
                <p className="text-gray-300 font-medium mb-1">{heroItem.author}</p>
                <h2 className="text-4xl font-bold text-white mb-4 leading-tight">{heroItem.title}</h2>
                <button className="bg-white text-[#1B254B] px-6 py-2 rounded-full font-bold text-sm hover:bg-gray-100 transition-colors">
                  {activeCategory === 'Books' || activeCategory === 'Articles' ? 'Read Now' : 'Watch Now'}
                </button>
              </div>
            </div>
          )}

          <h3 className="text-2xl font-bold text-[#1B254B] mb-6">
            {activeCategory === 'Books' ? 'Top Rated Comics' : activeCategory === 'Videos' ? 'Best Videos' : 'Most read'}
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pb-4">
            {gridItems.map((item) => (
              <div key={item.id} className="cursor-pointer group">
                <div className="w-full aspect-[4/5] rounded-[20px] overflow-hidden mb-3 shadow-sm relative">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                  {activeCategory === 'Videos' && (
                    <div className="absolute bottom-2 right-2 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center text-white text-xs backdrop-blur-sm">▶</div>
                  )}
                </div>
                <h4 className="font-bold text-[#1B254B] leading-tight mb-1">{item.title}</h4>
                <p className="text-xs text-gray-500 font-medium">{item.author}</p>
              </div>
            ))}
            {gridItems.length === 0 && <p className="text-gray-400">No resources found.</p>}
          </div>
        </div>

        {/* =======================================
            الجهة اليمنى (Sidebar تاع الفلتر)
            ======================================= */}
        <div className="w-64 shrink-0 flex flex-col gap-8">
          
          {/* Calendar Widget (Static Placeholder) */}
          <div className="bg-white rounded-[20px] p-5 shadow-sm border border-gray-50">
             <div className="flex justify-between items-center mb-4">
                <button className="text-[#1B254B] font-bold">{'<'}</button>
                <h4 className="font-bold text-[#1B254B] text-sm">January 2024</h4>
                <button className="text-[#1B254B] font-bold">{'>'}</button>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-gray-400 font-bold mb-2">
                <div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div><div>Su</div>
              </div>
              <div className="grid grid-cols-7 gap-y-2 gap-x-1 text-center text-xs font-medium text-[#1B254B]">
                <div className="text-gray-300">29</div><div className="text-gray-300">30</div><div className="text-gray-300">31</div>
                <div>1</div><div>2</div><div>3</div><div>4</div>
                <div>5</div><div>6</div><div>7</div><div>8</div><div>9</div><div>10</div><div>11</div>
                <div className="bg-[#111C44] text-white w-6 h-6 rounded-full flex items-center justify-center mx-auto shadow-md">12</div>
                <div>13</div><div>14</div><div>15</div><div>16</div><div>17</div><div>18</div>
              </div>
          </div>

          {/* Featured Sidebar Item */}
          {sidebarItem && (
            <div>
              <h3 className="text-lg font-bold text-[#1B254B] mb-4 text-center">{sidebarItem.author}</h3>
              <div className="w-full aspect-[4/5] rounded-[20px] overflow-hidden shadow-md relative cursor-pointer group">
                <img src={sidebarItem.img} alt={sidebarItem.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                {sidebarItem.progress && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center font-bold text-[#1B254B] shadow-lg">
                      {sidebarItem.progress}
                    </div>
                  </div>
                )}
                {activeCategory === 'Videos' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-black/70 rounded-full flex items-center justify-center text-white text-2xl shadow-lg">▶</div>
                  </div>
                )}
                <div className="absolute bottom-4 left-0 w-full text-center px-4">
                  <h4 className="font-bold text-white text-sm bg-black/50 py-1 px-2 rounded-lg inline-block backdrop-blur-sm">{sidebarItem.title}</h4>
                </div>
              </div>
            </div>
          )}

          {/* 🟢 الفلاتر (More Resources) 🟢 */}
          <div>
            <h3 className="text-lg font-bold text-[#1B254B] mb-4 text-center">More Resources</h3>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => setActiveCategory('Books')}
                className={`flex flex-col items-center justify-center py-4 rounded-[20px] font-bold transition-all ${activeCategory === 'Books' ? 'bg-[#ffe4e1] text-[#1B254B] shadow-sm scale-105 border border-red-100' : 'bg-gray-50 text-gray-500 hover:bg-gray-100 border border-transparent'}`}
              >
                <span className="text-3xl mb-1">📔</span> Books
              </button>
              
              <button 
                onClick={() => setActiveCategory('Videos')}
                className={`flex flex-col items-center justify-center py-4 rounded-[20px] font-bold transition-all ${activeCategory === 'Videos' ? 'bg-[#e0f7fa] text-[#1B254B] shadow-sm scale-105 border border-cyan-100' : 'bg-gray-50 text-gray-500 hover:bg-gray-100 border border-transparent'}`}
              >
                <span className="text-3xl mb-1">🎬</span> Videos
              </button>
              
              <button 
                onClick={() => setActiveCategory('Articles')}
                className={`flex flex-col items-center justify-center py-4 rounded-[20px] font-bold transition-all ${activeCategory === 'Articles' ? 'bg-[#f3e5f5] text-[#1B254B] shadow-sm scale-105 border border-purple-100' : 'bg-gray-50 text-gray-500 hover:bg-gray-100 border border-transparent'}`}
              >
                <span className="text-3xl mb-1">📰</span> Articles
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TeacherLibraries;
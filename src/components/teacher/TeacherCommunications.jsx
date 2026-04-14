import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

const TeacherCommunications = () => {
  // 💡 التحكم الرئيسي في الواجهة
  const [activeTab, setActiveTab] = useState('Announcements'); // 'Announcements' | 'Messages'
  const [showAddForm, setShowAddForm] = useState(false); // باش نبينو فورم إضافة الإعلان
  const [loading, setLoading] = useState(true);

  // ==========================================
  // STATES: Global & User
  // ==========================================
  const [currentUser, setCurrentUser] = useState(null);
  const [teacherName, setTeacherName] = useState("Teacher Name");
  const [teacherClasses, setTeacherClasses] = useState([]);

  // ==========================================
  // STATES: Announcements
  // ==========================================
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    type: 'Event',
    description: '',
    targetGroup: 'All', 
  });

  // ==========================================
  // STATES: Messages
  // ==========================================
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // ==========================================
  // 1. Fetch Global Data
  // ==========================================
  useEffect(() => {
    const fetchGlobalData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user && user.email) {
          setCurrentUser(user);
          
          const { data: staffData } = await supabase.from('staff').select('*').eq('email', user.email).single();
          let tName = "Teacher Name";
          if (staffData) {
            tName = `${staffData.first_name || ''} ${staffData.last_name || ''}`.trim();
            setTeacherName(tName);
          }

          const { data: clsData } = await supabase.from('classes').select('*').eq('teacher_name', tName);
          if (clsData) setTeacherClasses(clsData.map(c => c.name || c.class_name));

          // نجيبو الإدارة للسكرتارية والـ Admin (بدون الأساتذة) للرسائل
          // 💡 التعديل هنا: نحينا .neq('role', 'Teacher') باش يخرج قاع الخدامين (إدارة + سكرتارية)
          const { data: adminStaff } = await supabase.from('staff').select('*').neq('email', user.email);
          
          if (adminStaff && adminStaff.length > 0) {
            const formattedContacts = adminStaff.map(s => ({
              id: s.id,
              email: s.email,
              name: `${s.first_name || ''} ${s.last_name || ''}`.trim() || 'Admin',
              role: s.department || s.role || 'Administration',
              avatar: (s.first_name ? s.first_name.charAt(0) : 'A').toUpperCase(),
              color: ['bg-[#F6AD55]', 'bg-[#4FD1C5]', 'bg-[#63B3ED]', 'bg-[#FC8181]', 'bg-[#B794F4]'][Math.floor(Math.random() * 5)]
            }));
            setContacts(formattedContacts);
            setActiveContact(formattedContacts[0]);
          } else {
             // Fake Admin if DB is empty
             const mockAdmins = [{ id: 'admin1', email: 'admin@utopia.com', name: 'Malak (Admin)', role: 'System Admin', avatar: 'M', color: 'bg-[#4FD1C5]' }];
             setContacts(mockAdmins);
             setActiveContact(mockAdmins[0]);
          }
        }
      } catch (err) { console.error(err); }
    };
    fetchGlobalData();
  }, []);

  // ==========================================
  // 2. Fetch Announcements
  // ==========================================
  const fetchAnnouncements = async () => {
    try {
      const { data } = await supabase.from('announcements').select('*').order('created_at', { ascending: false });
      if (data && data.length > 0) {
        setAnnouncements(data.map(a => ({
          id: a.id,
          title: a.title,
          content: a.description || a.content, 
          type: a.type || 'General',
          author: a.teacher_name || 'Admin',
          date: new Date(a.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        })));
      } else {
        setAnnouncements([
          { id: 1, title: 'Winter Festival Planning', content: 'We are organizing our annual Winter festival. Join us.', type: 'Event', author: 'Admin', date: 'Oct 23, 2026' }
        ]);
      }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => {
    if (activeTab === 'Announcements' && !showAddForm) fetchAnnouncements();
  }, [activeTab, showAddForm]);

  // ==========================================
  // 3. Fetch Messages
  // ==========================================
  useEffect(() => {
    const fetchMessages = async () => {
      if (!currentUser || !activeContact || activeTab !== 'Messages') return;
      try {
        const { data: msgData } = await supabase
          .from('communications')
          .select('*')
          .or(`and(sender_email.eq.${currentUser.email},receiver_email.eq.${activeContact.email}),and(sender_email.eq.${activeContact.email},receiver_email.eq.${currentUser.email})`)
          .order('created_at', { ascending: true });

        if (msgData && msgData.length > 0) {
          setMessages(msgData.map(m => ({
            id: m.id,
            text: m.message, 
            time: new Date(m.created_at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
            isMe: m.sender_email === currentUser.email
          })));
        } else { setMessages([]); }
      } catch (err) { console.error(err); }
    };
    fetchMessages();
  }, [activeContact, currentUser, activeTab]);

  // ==========================================
  // Handlers
  // ==========================================
  const handleAddAnnouncement = async (e) => {
    e.preventDefault();
    if (!newAnnouncement.title || !newAnnouncement.description) return alert("Fill all fields");
    
    try {
      await supabase.from('announcements').insert([{
        title: newAnnouncement.title,
        description: newAnnouncement.description,
        type: newAnnouncement.type,
        teacher_name: teacherName,
        created_at: new Date().toISOString()
      }]);
      alert("Announcement Added! ✅");
      setShowAddForm(false);
      setNewAnnouncement({ title: '', type: 'Event', description: '', targetGroup: 'All' });
    } catch (error) { alert("Error adding announcement."); }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !activeContact || !currentUser) return;
    
    const text = newMessage;
    setNewMessage('');
    setMessages(prev => [...prev, { id: Date.now(), text, time: 'Now', isMe: true }]);

    await supabase.from('communications').insert([{
      sender_email: currentUser.email,
      receiver_email: activeContact.email,
      message: text,
      created_at: new Date().toISOString()
    }]);
  };

  // ==========================================
  // RENDER SECTIONS
  // ==========================================

  // 1. Announcements List
  const renderAnnouncements = () => (
    <div className="flex flex-col gap-6 animate-fadeIn h-full relative">
      <div className="bg-white rounded-[24px] p-8 flex justify-between items-center shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-[#1B254B] mb-2">Announcements</h2>
          <p className="text-[#A3AED0] text-sm">Add and stay updated with the latest news, events, and important notices.</p>
        </div>
        <div className="hidden md:block text-6xl opacity-90 drop-shadow-md">📢</div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {announcements.map(a => {
            let tagStyle = "bg-blue-50 text-[#4318FF]"; 
            if (a.type === 'Event') tagStyle = "bg-[#e6fbf2] text-[#00a65e]"; 
            if (a.type === 'Reminder') tagStyle = "bg-yellow-50 text-yellow-600";
            if (a.type === 'Urgent') tagStyle = "bg-red-50 text-red-500";

            return (
              <div key={a.id} className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 flex flex-col h-[220px]">
                <div className="flex justify-between items-center mb-4">
                  <span className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${tagStyle}`}>
                    {a.type}
                  </span>
                  <span className="text-gray-400 text-xs font-bold flex items-center gap-1">📅 {a.date}</span>
                </div>
                <h3 className="text-lg font-bold text-[#1B254B] mb-2">{a.title}</h3>
                <p className="text-sm text-[#A3AED0] leading-relaxed flex-1 line-clamp-3">{a.content}</p>
                <div className="flex items-center gap-2 border-t border-gray-50 pt-3 mt-auto">
                  <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-[10px] font-bold">
                    {a.author.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-[11px] font-bold text-gray-400">{a.author}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="absolute bottom-6 right-6">
        <button onClick={() => setShowAddForm(true)} className="bg-white border border-gray-200 text-[#1B254B] px-10 py-3.5 rounded-2xl text-sm font-bold shadow-md hover:bg-gray-50 transition-colors">
          Add New
        </button>
      </div>
    </div>
  );

  // 2. Add Announcement Form
  const renderAddForm = () => (
    <div className="animate-fadeIn h-full flex flex-col">
      <div className="mb-8 flex items-center gap-4">
        <button onClick={() => setShowAddForm(false)} className="text-2xl font-bold text-[#1B254B] border-2 border-[#1B254B] rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors">
          ←
        </button>
        <h1 className="text-2xl font-bold text-[#1B254B]">Add Announcement</h1>
      </div>

      <div className="flex flex-1 gap-12 items-center">
        <div className="w-1/2 flex justify-center">
          <div className="w-full max-w-md aspect-[4/3] border-[3px] border-[#1B254B] rounded-[35px] flex items-center justify-center bg-white shadow-sm">
            <h2 className="text-[32px] font-black text-[#1B254B] text-center leading-tight">Add Your<br/>Announcement</h2>
          </div>
        </div>

        <div className="w-1/2 flex justify-start">
          <form onSubmit={handleAddAnnouncement} className="space-y-6 w-full max-w-sm">
            <div>
              <label className="block text-lg font-bold text-[#1B254B] mb-2">Title:</label>
              <input type="text" required value={newAnnouncement.title} onChange={e=>setNewAnnouncement({...newAnnouncement, title: e.target.value})} 
                className="w-full border-[3px] border-[#1B254B] rounded-2xl px-4 py-3 text-[#1B254B] font-bold outline-none" placeholder="Next week trip" />
            </div>
            <div>
              <label className="block text-lg font-bold text-[#1B254B] mb-2">Type:</label>
              <select value={newAnnouncement.type} onChange={e=>setNewAnnouncement({...newAnnouncement, type: e.target.value})} 
                className="w-full border-[3px] border-[#1B254B] rounded-2xl px-4 py-3 text-[#1B254B] font-bold outline-none cursor-pointer bg-white">
                <option value="Event">Event</option>
                <option value="Reminder">Reminder</option>
                <option value="General">General</option>
              </select>
            </div>
            <div>
              <label className="block text-lg font-bold text-[#1B254B] mb-2">Description:</label>
              <textarea required rows="4" value={newAnnouncement.description} onChange={e=>setNewAnnouncement({...newAnnouncement, description: e.target.value})} 
                className="w-full border-[3px] border-[#1B254B] rounded-2xl px-4 py-3 text-[#1B254B] font-bold outline-none resize-none"></textarea>
            </div>
            <div className="flex justify-end pt-2">
              <button type="submit" className="bg-[#1B254B] text-white px-10 py-3.5 rounded-2xl font-bold text-lg hover:bg-black transition-colors shadow-md">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  // 3. Messages Chat UI (Figma 3)
  const renderMessages = () => {
    const filteredContacts = contacts.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
      <div className="flex-1 flex bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-fadeIn h-[calc(100vh-200px)] min-h-[500px]">
        {/* Left Sidebar (Contacts) */}
        <div className="w-[320px] border-r border-gray-100 flex flex-col bg-white shrink-0">
          <div className="p-4 border-b border-gray-50">
            <div className="bg-[#f8fafc] rounded-full flex items-center px-4 py-2 border border-gray-100">
              <span className="text-gray-400 text-sm mr-2">🔍</span>
              <input type="text" placeholder="Start chat" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-transparent border-none outline-none text-sm w-full text-[#1B254B] placeholder-gray-400 font-medium" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {filteredContacts.map((contact) => (
              <div key={contact.id} onClick={() => setActiveContact(contact)} className={`flex items-center gap-4 p-4 cursor-pointer transition-colors border-b border-gray-50 ${activeContact?.id === contact.id ? 'bg-[#f4f7fe]' : 'hover:bg-gray-50'}`}>
                <div className={`w-11 h-11 rounded-full ${contact.color} text-white flex items-center justify-center font-bold text-lg shrink-0`}>
                  {contact.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h4 className="text-[13px] font-bold text-[#1B254B] truncate">{contact.name}</h4>
                    <span className="text-[10px] text-gray-400 whitespace-nowrap">15 min</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">Tap to message...</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Area (Chat) */}
        <div className="flex-1 flex flex-col bg-white relative">
          {activeContact ? (
            <>
              {/* Chat Header */}
              <div className="h-[72px] bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0 z-10">
                <div className="flex items-center gap-3">
                   <h3 className="font-bold text-[#1B254B] text-lg">{activeContact.name}</h3>
                </div>
              </div>

              {/* Chat History */}
              <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar bg-[#f8fafc]">
                <div className="text-center my-2">
                  <span className="text-[10px] font-bold text-gray-400">Today</span>
                </div>
                
                {messages.length === 0 ? (
                  <p className="text-center text-gray-400 font-medium mt-10">Start the conversation 👋</p>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className="flex items-end gap-3 max-w-[65%]">
                        {!msg.isMe && <div className={`w-8 h-8 rounded-full ${activeContact.color} text-white flex items-center justify-center text-xs font-bold mb-1 shrink-0`}>{activeContact.avatar}</div>}
                        <div className={`px-5 py-3 shadow-sm text-[13px] leading-relaxed ${msg.isMe ? 'bg-white border border-gray-100 text-[#1B254B] rounded-[20px] rounded-br-sm shadow-sm' : 'bg-gray-100/80 text-[#1B254B] rounded-[20px] rounded-bl-sm'}`}>
                          {msg.text}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Chat Input */}
              <div className="p-6 bg-white shrink-0">
                <form onSubmit={handleSendMessage} className="flex items-center gap-3 bg-white border border-gray-200 rounded-full px-5 py-3 focus-within:border-[#4318FF] transition-colors shadow-sm">
                  <button type="button" className="text-gray-400 hover:text-[#1B254B] text-xl">☺</button>
                  <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Text message to admin..." className="flex-1 bg-transparent border-none outline-none text-sm text-[#1B254B] placeholder-gray-400 mx-2" />
                  <div className="flex items-center gap-4 text-gray-400 text-lg">
                     <button type="button" className="hover:text-[#1B254B]">📎</button>
                     <button type="button" className="hover:text-[#1B254B]">📷</button>
                     <button type="submit" disabled={!newMessage.trim()} className="text-[#1B254B] disabled:opacity-50 ml-1">➤</button>
                  </div>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400 bg-[#f8fafc]">Select a chat to start messaging</div>
          )}
        </div>
      </div>
    );
  };

  // ==========================================
  // MAIN RETURN (Header + Content)
  // ==========================================
  return (
    <div className="h-full w-full p-4 md:p-8 bg-[#F4F7FE] flex flex-col overflow-hidden">
      
      {/* 🟢 الهيدر الثابت: يبان في كامل الصفحات (Announcements + Messages) 🟢 */}
      <div className="flex justify-between items-center mb-8 shrink-0">
        <h1 className="text-2xl font-bold text-[#1B254B] flex items-center gap-2">
          👋 Communications Hub
        </h1>
        
        {/* Toggle Button: [Announcements | Messages] */}
        {!showAddForm && (
          <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100">
            <button
              onClick={() => setActiveTab('Announcements')}
              className={`px-8 py-2 rounded-lg font-bold text-xs transition-all ${
                activeTab === 'Announcements' ? 'text-[#4318FF] shadow-sm bg-gray-50/50' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Announcements
            </button>
            <button
              onClick={() => setActiveTab('Messages')}
              className={`px-8 py-2 rounded-lg font-bold text-xs transition-all ${
                activeTab === 'Messages' ? 'text-[#4318FF] shadow-sm bg-gray-50/50' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Messages
            </button>
          </div>
        )}
      </div>

      {/* 🟢 المحتوى يتغير حسب القفلة المخيرينها 🟢 */}
      <div className="flex-1 overflow-hidden relative">
        {activeTab === 'Announcements' && !showAddForm && renderAnnouncements()}
        {activeTab === 'Announcements' && showAddForm && renderAddForm()}
        {activeTab === 'Messages' && renderMessages()}
      </div>

    </div>
  );
};

export default TeacherCommunications;
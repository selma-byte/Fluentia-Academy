import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

const TeacherCommunications = () => {
  const [activeTab, setActiveTab] = useState('Announcements');
  const [loading, setLoading] = useState(false);

  // ==========================================
  // 📢 1. ANNOUNCEMENTS SECTION
  // ==========================================
  const AnnouncementsPart = () => {
    const [showModal, setShowModal] = useState(false);
    const [announcements, setAnnouncements] = useState([]);
    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');
    const [newPriority, setNewPriority] = useState('General');

    const fetchAnnouncements = async () => {
      const { data } = await supabase.from('communications').select('*').eq('type', 'General').order('created_at', { ascending: false });
      if (data && data.length > 0) setAnnouncements(data);
      else setAnnouncements([
        { id: 1, type: 'General', title: 'Welcome!', content: 'Welcome to the school communication hub.', created_at: new Date() }
      ]);
    };

    useEffect(() => { fetchAnnouncements(); }, []);

    const handlePublish = async (e) => {
      e.preventDefault();
      setLoading(true);
      const { error } = await supabase.from('communications').insert([{ content: newContent, type: 'General' }]);
      if (!error) { setShowModal(false); setNewTitle(''); setNewContent(''); fetchAnnouncements(); }
      setLoading(false);
    };

    const getTagStyle = (type) => {
      switch (type) {
        case 'Event': return 'bg-[#e6fbf2] text-[#00a65e]';
        case 'Urgent': return 'bg-[#fdeaea] text-[#e02424]';
        default: return 'bg-[#eef2ff] text-[#4318FF]';
      }
    };

    return (
      <div className="flex gap-8 animate-fadeIn h-full overflow-hidden">
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl p-8 w-[550px] shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#1B254B]">Create Announcement</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 font-bold text-xl">✕</button>
              </div>
              <form onSubmit={handlePublish} className="space-y-4">
                <input type="text" placeholder="Title" required value={newTitle} onChange={(e)=>setNewTitle(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2 outline-none" />
                <textarea placeholder="Content" required rows="4" value={newContent} onChange={(e)=>setNewContent(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2 outline-none resize-none bg-gray-50"></textarea>
                <button type="submit" className="w-full bg-[#111C44] text-white font-bold py-3 rounded-xl shadow-md">Publish</button>
              </form>
            </div>
          </div>
        )}
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-4">
          <div className="bg-[#f8fafc] rounded-2xl p-6 flex justify-between items-center mb-8 border border-gray-100 shadow-sm relative">
            <div>
              <h2 className="text-2xl font-bold text-[#1B254B] mb-2">Announcements</h2>
              <button onClick={() => setShowModal(true)} className="bg-white border border-gray-200 text-[#1B254B] px-5 py-2 rounded-lg text-sm font-bold shadow-sm">Add New</button>
            </div>
            <div className="text-6xl">📢</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
            {announcements.map((ann) => (
              <div key={ann.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between mb-4">
                  <span className={`px-3 py-1 rounded-md text-xs font-bold ${getTagStyle(ann.type)}`}>{ann.type}</span>
                  <span className="text-xs text-gray-400">📅 {new Date(ann.created_at).toLocaleDateString()}</span>
                </div>
                <h3 className="font-bold text-[#1B254B] text-lg mb-2">{ann.title || 'Notification'}</h3>
                <p className="text-sm text-gray-500 mb-6">{ann.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // 💬 2. MESSAGES SECTION (FIXED LIST)
  // ==========================================
  const MessagesPart = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [staffList, setStaffList] = useState([
      { id: '1', first_name: 'Selma', role: 'Secretary' }, // داتا افتراضية باش ما تجيش فارغة
      { id: '2', first_name: 'Admin', role: 'Admin' }
    ]);
    const [activeContact, setActiveContact] = useState(null);

    useEffect(() => {
      const fetchStaff = async () => {
        const { data } = await supabase.from('teachers').select('*').in('role', ['Admin', 'Secretary']);
        if (data && data.length > 0) {
          setStaffList(data);
          setActiveContact(data[0]);
        } else {
          setActiveContact(staffList[0]); // استعمل Selma إذا سوبابيز فارغ
        }
      };
      fetchStaff();
    }, []);

    const fetchPrivateMessages = async () => {
      const { data } = await supabase.from('communications').select('*').neq('type', 'General').order('created_at', { ascending: true });
      if (data) setMessages(data);
    };

    useEffect(() => { fetchPrivateMessages(); }, [activeContact]);

    const handleSendMessage = async (e) => {
      e.preventDefault();
      if (!newMessage.trim()) return;
      await supabase.from('communications').insert([{ content: newMessage, type: 'teacher' }]);
      setNewMessage('');
      fetchPrivateMessages();
    };

    return (
      <div className="flex-1 flex bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden h-[500px]">
        <div className="w-1/3 border-r border-gray-100 flex flex-col bg-[#f8fafc]">
          <div className="p-4 bg-white border-b font-black text-[10px] text-[#1B254B] uppercase tracking-widest">Administration</div>
          <div className="flex-1 overflow-y-auto p-2">
            {staffList.map((staff) => (
              <div key={staff.id} onClick={() => setActiveContact(staff)}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer mb-2 transition-all ${activeContact?.id === staff.id ? 'bg-blue-50 border border-blue-100' : 'hover:bg-white'}`}>
                <div className="w-10 h-10 rounded-full bg-[#1B254B] text-white flex items-center justify-center font-bold">{staff.first_name[0]}</div>
                <div className="flex-1"><h4 className="text-sm font-bold text-[#1B254B]">{staff.first_name}</h4><p className="text-[10px] text-gray-400">{staff.role}</p></div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col bg-white">
          <div className="h-16 border-b flex items-center px-6 font-bold text-[#1B254B]">Chat with {activeContact?.first_name}</div>
          <div className="flex-1 overflow-y-auto p-6 bg-[#f8fafc] space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.type === 'teacher' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] rounded-2xl px-4 py-3 shadow-sm ${msg.type === 'teacher' ? 'bg-[#4318FF] text-white' : 'bg-white text-[#1B254B]'}`}>
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSendMessage} className="p-4 bg-white border-t flex gap-2">
            <input type="text" value={newMessage} onChange={(e)=>setNewMessage(e.target.value)} placeholder="Type a message..." className="flex-1 bg-gray-50 border rounded-full px-4 outline-none text-sm" />
            <button type="submit" className="w-10 h-10 bg-[#4318FF] rounded-full text-white">➤</button>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col animate-fadeIn">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-black text-[#1B254B]">👋 Communications Hub</h1>
        <div className="flex bg-gray-100 p-1 rounded-xl shadow-inner">
          <button onClick={()=>setActiveTab('Announcements')} className={`px-6 py-2 rounded-lg font-bold text-xs transition-all ${activeTab === 'Announcements' ? 'bg-white text-[#4318FF] shadow-sm' : 'text-gray-500'}`}>Announcements</button>
          <button onClick={()=>setActiveTab('Messages')} className={`px-6 py-2 rounded-lg font-bold text-xs transition-all ${activeTab === 'Messages' ? 'bg-white text-[#4318FF] shadow-sm' : 'text-gray-500'}`}>Messages</button>
        </div>
      </div>
      {activeTab === 'Announcements' ? <AnnouncementsPart /> : <MessagesPart />}
    </div>
  );
};

export default TeacherCommunications;
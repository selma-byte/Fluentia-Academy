import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

const TeacherMessages = () => {
  // ==========================================
  // STATES
  // ==========================================
  const [currentUser, setCurrentUser] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // ==========================================
  // 1. Fetch Current User & Contacts (Staff)
  // ==========================================
  useEffect(() => {
    const fetchContacts = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user && user.email) {
          setCurrentUser(user);

          // نجيبو قاع الستاف من الداتا باز ماعدا الأستاذ اللي راهو مكونيكتي
          const { data: staffData } = await supabase
            .from('staff')
            .select('*')
            .neq('email', user.email);

          if (staffData && staffData.length > 0) {
            const formattedContacts = staffData.map(s => ({
              id: s.id,
              email: s.email,
              name: `${s.first_name || ''} ${s.last_name || ''}`.trim() || 'Staff',
              role: s.department || s.role || 'Administration',
              avatar: (s.first_name ? s.first_name.charAt(0) : 'U').toUpperCase(),
              status: 'online', // نقدرو نبرمجوها من بعد باش تبان ديناميك
              lastMsg: 'Click to view messages...',
              time: '',
              unread: 0
            }));
            setContacts(formattedContacts);
            setActiveContact(formattedContacts[0]); // نكليكيو أوتوماتيكيا على الأول
          } else {
            setContacts([]);
          }
        }
      } catch (err) {
        console.error("Error fetching contacts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  // ==========================================
  // 2. Fetch Messages when activeContact changes
  // ==========================================
  useEffect(() => {
    const fetchMessages = async () => {
      if (!currentUser || !activeContact) return;

      try {
        // نجيبو الميساجات اللي بعتهم أنا ليه، واللي بعثهم هو ليا
        const { data: msgData, error } = await supabase
          .from('communications')
          .select('*')
          .or(`and(sender_email.eq.${currentUser.email},receiver_email.eq.${activeContact.email}),and(sender_email.eq.${activeContact.email},receiver_email.eq.${currentUser.email})`)
          .order('created_at', { ascending: true });

        if (msgData && msgData.length > 0) {
          const formattedMessages = msgData.map(m => ({
            id: m.id,
            text: m.message, 
            time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMe: m.sender_email === currentUser.email
          }));
          setMessages(formattedMessages);
        } else {
          setMessages([]); // الشات فارغ
        }
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessages();
  }, [activeContact, currentUser]);

  // ==========================================
  // 3. Send New Message
  // ==========================================
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !activeContact || !currentUser) return;

    const newMsgText = newMessage;
    setNewMessage(''); // نفرغو الخانة ديراكت باش الديزاين يبان خفيف

    // 1. نأفيشيوها ديراكت في الشاشة بلا ما نستناو الداتا باز (Optimistic UI)
    const tempMsg = {
      id: Date.now(),
      text: newMsgText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    };
    setMessages(prev => [...prev, tempMsg]);

    // 2. نبعتوها للـ Supabase في الخلفية
    try {
      const { error } = await supabase.from('communications').insert([{
        sender_email: currentUser.email,
        receiver_email: activeContact.email,
        message: newMsgText,
        created_at: new Date().toISOString()
      }]);

      if (error) {
        console.error("Failed to send message to DB:", error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // فلترة قائمة الإتصال بالبحث
  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    // 💡 زدنا padding والباكڨراوند باش يتطابق مع الـ Dashboard
    <div className="h-full w-full flex flex-col bg-[#F4F7FE] overflow-hidden p-4 md:p-8 animate-fadeIn">
      
      <div className="mb-6 shrink-0">
        <h1 className="text-3xl font-bold text-[#1B254B]">💬 Messages</h1>
        <p className="text-gray-500 text-sm mt-1">Communicate directly with the administration and staff.</p>
      </div>

      {/* صندوق الرسائل */}
      <div className="flex-1 flex bg-white border border-gray-100 rounded-[24px] shadow-sm overflow-hidden">
        
        {/* 🟢 الجهة اليسرى: قائمة الإدارة 🟢 */}
        <div className="w-1/3 border-r border-gray-100 flex flex-col bg-[#f8fafc]">
          <div className="p-4 border-b border-gray-100 bg-white">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
              <input 
                type="text" 
                placeholder="Search staff..." 
                value={searchQuery}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-full py-2 pl-9 pr-4 text-sm outline-none focus:border-[#4318FF] transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
            {loading ? (
               <p className="text-center text-gray-400 text-sm font-bold mt-10">Loading contacts...</p>
            ) : filteredContacts.length === 0 ? (
               <p className="text-center text-gray-400 text-sm font-bold mt-10">No contacts found.</p>
            ) : filteredContacts.map((contact) => (
              <div 
                key={contact.id} 
                onClick={() => setActiveContact(contact)}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors mb-1
                  ${activeContact?.id === contact.id ? 'bg-blue-50 border border-blue-100' : 'hover:bg-white border border-transparent'}`}
              >
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-full bg-[#1B254B] text-white flex items-center justify-center font-bold text-sm">
                    {contact.avatar}
                  </div>
                  <span className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${contact.status === 'online' ? 'bg-[#00a65e]' : 'bg-gray-400'}`}></span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="text-sm font-bold text-[#1B254B] truncate pr-2">{contact.name}</h4>
                    <span className="text-[10px] text-gray-400 whitespace-nowrap">{contact.time}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className={`text-xs truncate pr-2 ${contact.unread > 0 ? 'font-bold text-[#1B254B]' : 'text-gray-500'}`}>
                      {contact.lastMsg}
                    </p>
                    {contact.unread > 0 && (
                      <span className="bg-[#e02424] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                        {contact.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 🟢 الجهة اليمنى: الشات 🟢 */}
        <div className="w-2/3 flex flex-col bg-white">
          
          {activeContact ? (
            <>
              <div className="h-16 border-b border-gray-100 flex items-center justify-between px-6 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#1B254B] text-white flex items-center justify-center font-bold">
                    {activeContact.avatar}
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1B254B]">{activeContact.name}</h3>
                    <p className="text-xs text-gray-500">{activeContact.role}</p>
                  </div>
                </div>
                <div className="flex gap-3 text-gray-400">
                  <button className="hover:text-[#4318FF] transition-colors">📞</button>
                  <button className="hover:text-[#4318FF] transition-colors">📹</button>
                  <button className="hover:text-[#1B254B] transition-colors">⋮</button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 bg-[#f8fafc] custom-scrollbar flex flex-col gap-4">
                {messages.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-gray-400 opacity-60">
                    <span className="text-5xl mb-3">💬</span>
                    <p className="font-bold text-sm">No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] rounded-2xl px-4 py-3 shadow-sm ${msg.isMe ? 'bg-[#4318FF] text-white rounded-br-none' : 'bg-white border border-gray-100 text-[#1B254B] rounded-bl-none'}`}>
                        <p className="text-sm leading-relaxed break-words">{msg.text}</p>
                        <p className={`text-[10px] mt-1 text-right ${msg.isMe ? 'text-blue-200' : 'text-gray-400'}`}>
                          {msg.time}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-4 bg-white border-t border-gray-100 shrink-0">
                <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                  <button type="button" className="text-gray-400 hover:text-[#4318FF] text-xl transition-colors">
                    📎
                  </button>
                  <input 
                    type="text" 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message to administration..." 
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-full py-2.5 px-4 text-sm outline-none focus:border-[#4318FF]"
                  />
                  <button 
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="w-10 h-10 bg-[#4318FF] rounded-full flex items-center justify-center text-white shadow-md hover:bg-blue-700 transition-colors transform hover:scale-105 disabled:opacity-50 disabled:scale-100"
                  >
                    ➤
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
               <span className="text-5xl mb-3 opacity-50">📬</span>
               <h3 className="text-lg font-bold text-[#1B254B] mb-1">Your Messages</h3>
               <p className="text-xs">Select a contact from the left to start chatting.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default TeacherMessages;
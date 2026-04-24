import React, { useState, useEffect, useRef } from 'react';

const Icons = {
  Search: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
  Phone: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>,
  Video: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>,
  Info: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>,
  Paperclip: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>,
  Smile: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>,
  Image: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>,
  Send: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
};

const StudentMessages = () => {
  const [activeChat, setActiveChat] = useState(1);
  const [messageText, setMessageText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);

  const initialContacts = [
    { id: 1, name: "Academic Office", lastMsg: "Your registration is confirmed.", time: "10 Min", color: "bg-[#E3DAFF] text-[#4318FF]", initial: "AO", status: "online" },
    { id: 2, name: "Mr. Adam Smith", lastMsg: "Please review the B2 syllabus.", time: "12:36 PM", color: "bg-[#E1F5FE] text-[#01B574]", initial: "AS", status: "offline" },
    { id: 3, name: "Student Support", lastMsg: "The library is now open.", time: "Yesterday", color: "bg-[#FFF4E5] text-[#FFB547]", initial: "SS", status: "online" },
    { id: 4, name: "Dr. Johnson", lastMsg: "Grade report is available.", time: "2 days ago", color: "bg-[#FFE5F1] text-[#E31A1A]", initial: "DJ", status: "offline" },
  ];

  const [messages, setMessages] = useState([
    { id: 1, sender: "them", text: "Good morning. I have uploaded the feedback for your recent oral presentation.", time: "10:15 AM" },
    { id: 2, sender: "them", text: "Please let me know if you have any questions regarding the score." },
    { id: 3, sender: "me", text: "Thank you, Professor. I will review it immediately.", time: "10:20 AM" },
  ]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    
    const newMessage = {
      id: Date.now(),
      sender: "me",
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, newMessage]);
    setMessageText("");
    setShowEmoji(false);
  };

  const addEmoji = (emoji) => {
    setMessageText(prev => prev + emoji);
  };

  const activeContact = initialContacts.find(c => c.id === activeChat);

  return (
    <div className="flex-1 flex bg-white rounded-[35px] overflow-hidden shadow-sm border border-gray-100 animate-fadeIn h-[calc(100vh-160px)] mb-8">
      
      {/* LEFT: CONTACT LIST */}
      <div className="w-[320px] border-r border-gray-100 flex flex-col bg-white shrink-0">
        <div className="p-8 border-b border-gray-50">
          <div className="flex justify-between items-center mb-6 px-1">
            <h2 className="text-xl font-black text-[#1B254B] italic">Messages</h2>
            <div className="bg-[#4318FF] text-white text-[9px] font-black px-2 py-0.5 rounded-md shadow-lg shadow-blue-200">NEW</div>
          </div>
          <div className="relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Icons.Search /></span>
            <input 
              type="text" 
              placeholder="Search conversations..." 
              className="w-full bg-[#F4F7FE] border-none rounded-2xl py-3 pl-11 pr-4 text-[13px] font-bold text-[#1B254B] outline-none focus:ring-1 focus:ring-[#4318FF]/20 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {initialContacts.map((contact) => (
            <button
              key={contact.id}
              onClick={() => setActiveChat(contact.id)}
              className={`w-full flex items-center px-8 py-5 transition-all relative border-b border-gray-50/50 ${
                activeChat === contact.id ? 'bg-[#F4F7FE]/60' : 'hover:bg-gray-50'
              }`}
            >
              <div className="relative shrink-0">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-[10px] uppercase tracking-widest shadow-inner ${contact.color}`}>
                  {contact.initial}
                </div>
                <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 border-[3px] border-white rounded-full ${contact.status === 'online' ? 'bg-[#01B574]' : 'bg-gray-200'}`}></div>
              </div>

              <div className="ml-4 text-left overflow-hidden flex-1">
                <div className="flex justify-between items-center mb-0.5">
                  <h4 className={`text-[13px] truncate ${activeChat === contact.id ? 'font-black text-[#1B254B]' : 'font-bold text-[#A3AED0]'}`}>
                    {contact.name}
                  </h4>
                  <span className="text-[9px] text-[#A3AED0] font-black uppercase">{contact.time}</span>
                </div>
                <p className="text-[11px] text-[#A3AED0] truncate font-medium opacity-70 italic">
                  {contact.lastMsg}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* RIGHT: CHAT INTERFACE */}
      <div className="flex-1 flex flex-col bg-[#FAFCFF] relative">
        
        {/* CHAT HEADER */}
        <div className="h-[80px] bg-white border-b border-gray-100 flex items-center px-8 justify-between shrink-0 shadow-sm z-10">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-[10px] uppercase shadow-md ${activeContact.color}`}>
              {activeContact.initial}
            </div>
            <div className="ml-4">
              <h3 className="font-black text-[#1B254B] text-[14px] leading-none italic">{activeContact.name}</h3>
              <div className="flex items-center gap-1.5 mt-1.5">
                <div className={`w-2 h-2 rounded-full ${activeContact.status === 'online' ? 'bg-[#01B574] shadow-[0_0_5px_#01B574]' : 'bg-gray-300'}`}></div>
                <p className={`text-[9px] font-black uppercase tracking-widest ${activeContact.status === 'online' ? 'text-[#01B574]' : 'text-gray-400'}`}>
                  {activeContact.status === 'online' ? 'Secure Link Active' : 'Offline'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {[Icons.Phone, Icons.Video, Icons.Info].map((Icon, i) => (
              <button key={i} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-[#A3AED0] hover:bg-[#4318FF] hover:text-white transition-all shadow-sm border border-gray-50 active:scale-95">
                <Icon />
              </button>
            ))}
          </div>
        </div>

        {/* THREAD */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-8 flex flex-col space-y-6 custom-scrollbar"
        >
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-end ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
              {msg.sender === 'them' && (
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[9px] font-black mr-3 mb-1 shrink-0 ${activeContact.color} shadow-sm`}>
                  {activeContact.initial}
                </div>
              )}
              <div className="flex flex-col max-w-[60%]">
                <div className={`px-5 py-3.5 text-[13px] font-bold leading-relaxed shadow-sm hover:shadow-md transition-all ${
                  msg.sender === 'me' 
                  ? 'bg-[#111C44] text-white rounded-[20px] rounded-br-none italic tracking-tight' 
                  : 'bg-white text-[#1B254B] rounded-[20px] rounded-bl-none border border-gray-100 uppercase tracking-tight text-[12px]'
                }`}>
                  {msg.text}
                </div>
                {msg.time && (
                   <span className={`text-[8px] font-black text-[#A3AED0] mt-1 uppercase ${msg.sender === 'me' ? 'text-right' : 'text-left'}`}>
                      {msg.time}
                   </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* EMOJI PICKER TOOLTIP */}
        {showEmoji && (
          <div className="absolute bottom-[100px] right-10 bg-white shadow-2xl border border-gray-100 p-4 rounded-3xl flex gap-3 z-20 animate-fadeInUp">
            {['😊', '📚', '✅', '📍', '📝', '👋'].map(e => (
              <button key={e} onClick={() => addEmoji(e)} className="text-xl hover:scale-125 transition-transform">{e}</button>
            ))}
          </div>
        )}

        {/* INPUT */}
        <div className="p-6 bg-white border-t border-gray-100">
          <form onSubmit={handleSendMessage} className="bg-[#F4F7FE] rounded-[25px] p-2 flex items-center gap-1 border-2 border-transparent focus-within:border-[#4318FF]/10 focus-within:bg-white transition-all shadow-inner">
            <input type="file" ref={fileInputRef} className="hidden" />
            <button type="button" onClick={() => fileInputRef.current.click()} className="p-3 hover:bg-[#F4F7FE] rounded-xl transition-all text-[#A3AED0] hover:text-[#4318FF] active:scale-90"><Icons.Paperclip /></button>
            
            <input 
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              type="text" 
              placeholder={`Write a reply to ${activeContact.name.split(' ')[0]}...`} 
              className="flex-1 bg-transparent border-none px-4 text-[14px] font-black outline-none text-[#1B254B] placeholder:text-[#A3AED0] placeholder:uppercase placeholder:text-[9px] placeholder:tracking-[0.1em] italic"
            />
            
            <div className="flex items-center space-x-1.5 pr-1">
                <button type="button" onClick={() => setShowEmoji(!showEmoji)} className="p-3 hover:bg-[#F4F7FE] rounded-xl transition-all text-[#A3AED0] hover:text-[#4318FF] active:scale-90"><Icons.Smile /></button>
                <button type="button" onClick={() => fileInputRef.current.click()} className="p-3 hover:bg-[#F4F7FE] rounded-xl transition-all text-[#A3AED0] hover:text-[#4318FF] active:scale-90"><Icons.Image /></button>
                <button type="submit" className="bg-[#4318FF] text-white w-11 h-11 rounded-2xl hover:bg-black hover:scale-105 active:scale-95 transition-all shadow-xl shadow-blue-500/30 flex items-center justify-center">
                    <Icons.Send />
                </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default StudentMessages;
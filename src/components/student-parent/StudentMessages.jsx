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
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeChat]);

  const contacts = [
    { id: 1, name: "Academic Office", lastMsg: "Your registration is confirmed.", time: "10 Min", color: "bg-[#E3DAFF] text-[#4318FF]", initial: "AO", status: "online" },
    { id: 2, name: "Mr. Adam Smith", lastMsg: "Please review the B2 syllabus.", time: "12:36 PM", color: "bg-[#E1F5FE] text-[#01B574]", initial: "AS", status: "offline" },
    { id: 3, name: "Student Support", lastMsg: "The library is now open.", time: "Yesterday", color: "bg-[#FFF4E5] text-[#FFB547]", initial: "SS", status: "online" },
    { id: 4, name: "Dr. Johnson", lastMsg: "Grade report is available.", time: "2 days ago", color: "bg-[#FFE5F1] text-[#E31A1A]", initial: "DJ", status: "offline" },
    { id: 5, name: "Campus Registrar", lastMsg: "Payment verified.", time: "Monday", color: "bg-[#F4F7FE] text-[#1B254B]", initial: "CR", status: "online" },
  ];

  const currentMessages = [
    { id: 1, sender: "them", text: "Good morning, Selma. I have uploaded the feedback for your recent oral presentation.", time: "Monday, April 14 • 10:15 AM" },
    { id: 2, sender: "them", text: "Please let me know if you have any questions regarding the final score." },
    { id: 3, sender: "me", text: "Thank you, Professor. I will review it immediately." },
    { id: 4, sender: "me", text: "Is it possible to schedule a brief call to discuss Unit 4?" },
  ];

  const activeContact = contacts.find(c => c.id === activeChat);

  return (
    <div className="flex-1 flex bg-white rounded-[45px] overflow-hidden shadow-sm border border-gray-50 animate-fadeIn h-[calc(100vh-180px)] mb-10">
      
      {/* LEFT: SIDEBAR - CONTACT LIST */}
      <div className="w-[350px] border-r border-gray-100 flex flex-col bg-white shrink-0">
        <div className="p-8 border-b border-gray-50">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[20px] font-black text-[#1B254B] uppercase tracking-tighter">Messages</h2>
            <div className="bg-[#4318FF] text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-lg shadow-blue-500/20">NEW</div>
          </div>
          <div className="relative group">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#4318FF] transition-colors"><Icons.Search /></span>
            <input 
              type="text" 
              placeholder="Filter contacts..." 
              className="w-full bg-[#F4F7FE] border-none rounded-2xl py-3.5 pl-14 pr-4 text-xs font-bold text-[#1B254B] outline-none focus:ring-2 focus:ring-[#4318FF]/10 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar py-4">
          {contacts.map((contact) => (
            <button
              key={contact.id}
              onClick={() => setActiveChat(contact.id)}
              className={`w-full flex items-center px-8 py-5 transition-all relative ${
                activeChat === contact.id ? 'bg-[#F4F7FE]/50' : 'hover:bg-gray-50'
              }`}
            >
              {activeChat === contact.id && (
                <div className="absolute left-0 top-4 bottom-4 w-1.5 bg-[#4318FF] rounded-r-full shadow-[0_0_10px_rgba(67,24,255,0.4)]" />
              )}
              
              <div className="relative shrink-0">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xs uppercase tracking-widest shadow-sm ${contact.color}`}>
                  {contact.initial}
                </div>
                {contact.status === 'online' && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#01B574] border-4 border-white rounded-full"></div>
                )}
              </div>

              <div className="ml-5 text-left overflow-hidden flex-1">
                <div className="flex justify-between items-center mb-1">
                  <h4 className={`text-[13px] truncate uppercase ${activeChat === contact.id ? 'font-black text-[#1B254B]' : 'font-bold text-[#A3AED0]'}`}>
                    {contact.name}
                  </h4>
                  <span className="text-[9px] text-[#A3AED0] font-black uppercase tracking-widest">{contact.time}</span>
                </div>
                <p className="text-[11px] text-[#A3AED0] truncate font-bold uppercase tracking-tight opacity-70">
                  {contact.lastMsg}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* RIGHT: CHAT AREA */}
      <div className="flex-1 flex flex-col bg-[#FAFCFF]">
        
        {/* CHAT HEADER */}
        <div className="h-[90px] bg-white border-b border-gray-100 flex items-center px-10 justify-between shrink-0">
          <div className="flex items-center">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-xs uppercase tracking-widest shadow-sm ${activeContact.color}`}>
              {activeContact.initial}
            </div>
            <div className="ml-5">
              <h3 className="font-black text-[#1B254B] text-[15px] uppercase tracking-tighter leading-none">{activeContact.name}</h3>
              <div className="flex items-center gap-2 mt-1.5">
                <div className={`w-2 h-2 rounded-full ${activeContact.status === 'online' ? 'bg-[#01B574]' : 'bg-gray-300'}`}></div>
                <p className={`text-[9px] font-black uppercase tracking-[0.2em] ${activeContact.status === 'online' ? 'text-[#01B574]' : 'text-gray-400'}`}>
                  {activeContact.status === 'online' ? 'Secure Link Active' : 'Offline'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {[Icons.Phone, Icons.Video, Icons.Info].map((Icon, i) => (
              <button key={i} className="w-11 h-11 flex items-center justify-center rounded-2xl bg-white text-[#A3AED0] hover:bg-[#4318FF] hover:text-white transition-all shadow-sm border border-gray-100">
                <Icon />
              </button>
            ))}
          </div>
        </div>

        {/* MESSAGES AREA */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-10 flex flex-col space-y-8 custom-scrollbar"
        >
          {currentMessages.map((msg, idx) => (
            <div key={msg.id} className="flex flex-col">
              {msg.time && (
                <div className="flex items-center justify-center my-10">
                  <div className="h-[1px] bg-gray-100 flex-1"></div>
                  <span className="px-6 text-[10px] font-black text-[#A3AED0] uppercase tracking-[0.3em]">
                    {msg.time}
                  </span>
                  <div className="h-[1px] bg-gray-100 flex-1"></div>
                </div>
              )}
              
              <div className={`flex items-end ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'them' && (
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black mr-3 mb-1 shrink-0 ${activeContact.color} shadow-sm uppercase`}>
                    {activeContact.initial}
                  </div>
                )}
                
                <div className={`max-w-[60%] px-6 py-4 text-[13px] font-bold leading-relaxed shadow-sm transition-all hover:shadow-md ${
                  msg.sender === 'me' 
                  ? 'bg-[#111C44] text-white rounded-[24px] rounded-br-none italic tracking-tight' 
                  : 'bg-white text-[#1B254B] rounded-[24px] rounded-bl-none border border-gray-50 uppercase tracking-tight'
                }`}>
                  {msg.text}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* INPUT AREA */}
        <div className="p-8 bg-white border-t border-gray-100">
          <div className="bg-[#F4F7FE] rounded-[28px] p-3 flex items-center gap-2 border-2 border-transparent focus-within:border-[#4318FF]/10 focus-within:bg-white transition-all shadow-sm">
            <button className="p-3 hover:bg-[#F4F7FE] rounded-2xl transition-all text-[#A3AED0] hover:text-[#4318FF]"><Icons.Paperclip /></button>
            
            <input 
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              type="text" 
              placeholder={`Write official message to ${activeContact.name.split(' ')[0]}...`} 
              className="flex-1 bg-transparent border-none px-4 text-[14px] font-bold outline-none text-[#1B254B] placeholder:text-[#A3AED0] placeholder:uppercase placeholder:text-[10px] placeholder:tracking-widest"
            />
            
            <div className="flex items-center space-x-2 pr-2">
                <button className="p-3 hover:bg-[#F4F7FE] rounded-2xl transition-all text-[#A3AED0] hover:text-[#4318FF]"><Icons.Smile /></button>
                <button className="p-3 hover:bg-[#F4F7FE] rounded-2xl transition-all text-[#A3AED0] hover:text-[#4318FF]"><Icons.Image /></button>
                <button className="bg-[#4318FF] text-white w-12 h-12 rounded-2xl hover:bg-[#3311CC] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-blue-500/40 flex items-center justify-center">
                    <Icons.Send />
                </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentMessages;
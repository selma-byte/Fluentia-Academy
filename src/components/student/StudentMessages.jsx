import React, { useState, useEffect, useRef } from 'react';

const StudentMessages = () => {
  const [activeChat, setActiveChat] = useState(1);
  const [messageText, setMessageText] = useState("");
  const scrollRef = useRef(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeChat]);

  const contacts = [
    { id: 1, name: "Tee💖🧡💛", lastMsg: "You: Hey whats up", time: "15 Min", color: "bg-red-100 text-red-600", initial: "T", status: "online" },
    { id: 2, name: "Zeepay", lastMsg: "Hi Neequaye Kotey...", time: "12:36 PM", color: "bg-yellow-100 text-yellow-600", initial: "Z", status: "offline" },
    { id: 3, name: "CloudOTP", lastMsg: "798508 is your veri...", time: "Yesterday", color: "bg-blue-100 text-blue-600", initial: "C", status: "offline" },
    { id: 4, name: "Gatekeeper", lastMsg: "Welcome to Our G...", time: "2 days ago", color: "bg-indigo-100 text-indigo-600", initial: "GK", status: "online" },
    { id: 5, name: "MyMTN 2.0", lastMsg: "Y'ello MTNner, do...", time: "Monday", color: "bg-orange-100 text-orange-600", initial: "M", status: "offline" },
    { id: 6, name: "Mama K 🤱🏼🤱🏼🤱🏼", lastMsg: "Where is you fath...", time: "05/04", color: "bg-green-100 text-green-600", initial: "MK", status: "online" },
    { id: 7, name: "Nana", lastMsg: "yo man, food dey...", time: "01/04", color: "bg-red-200 text-red-700", initial: "N", status: "offline" },
  ];

  const currentMessages = [
    { id: 1, sender: "them", text: "Yo mandem", time: "Thursday, Jan 4 • 6:21 PM" },
    { id: 2, sender: "them", text: "Cho dey house?" },
    { id: 3, sender: "me", text: "Kwasia 😂😭" },
    { id: 4, sender: "me", text: "You dey hung dier you kai say house dey" },
  ];

  const activeContact = contacts.find(c => c.id === activeChat);

  return (
    <div className="flex-1 flex bg-white rounded-[30px] overflow-hidden shadow-sm border border-gray-50 animate-fadeIn h-[calc(100vh-140px)] mb-6">
      
      {/* LEFT: SIDEBAR - CONTACT LIST */}
      <div className="w-[320px] border-r border-gray-100 flex flex-col bg-white shrink-0">
        <div className="p-6 border-b border-gray-50">
          <h2 className="text-[20px] font-bold text-[#1B254B] mb-4">Messages</h2>
          <div className="relative">
            <span className="absolute left-4 top-2.5 text-gray-400 text-xs">🔍</span>
            <input 
              type="text" 
              placeholder="Search conversations..." 
              className="w-full bg-[#F4F7FE] border-none rounded-full py-2.5 pl-10 pr-4 text-[11px] outline-none focus:ring-1 focus:ring-[#4318FF] transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar py-2">
          {contacts.map((contact) => (
            <button
              key={contact.id}
              onClick={() => setActiveChat(contact.id)}
              className={`w-full flex items-center px-6 py-4 transition-all relative ${
                activeChat === contact.id 
                ? 'bg-[#F4F7FE]' 
                : 'hover:bg-gray-50'
              }`}
            >
              {activeChat === contact.id && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#4318FF] rounded-r-md" />
              )}
              
              <div className="relative shrink-0">
                <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-xs ${contact.color}`}>
                  {contact.initial}
                </div>
                {contact.status === 'online' && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>

              <div className="ml-4 text-left overflow-hidden flex-1">
                <div className="flex justify-between items-center mb-0.5">
                  <h4 className={`text-[13px] truncate ${activeChat === contact.id ? 'font-bold text-[#1B254B]' : 'font-semibold text-[#A3AED0]'}`}>
                    {contact.name}
                  </h4>
                  <span className="text-[10px] text-gray-400 font-medium">{contact.time}</span>
                </div>
                <p className="text-[11px] text-[#A3AED0] truncate font-medium">
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
        <div className="h-[76px] bg-white border-b border-gray-100 flex items-center px-8 justify-between shrink-0">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${activeContact.color}`}>
              {activeContact.initial}
            </div>
            <div className="ml-4">
              <h3 className="font-bold text-[#1B254B] text-sm leading-tight">{activeContact.name}</h3>
              <p className="text-[10px] text-green-500 font-bold uppercase tracking-wider">
                {activeContact.status === 'online' ? 'Online' : 'Offline'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {['📞', '📹', 'ℹ️'].map((icon, i) => (
              <button key={i} className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-[#F4F7FE] hover:text-[#4318FF] transition-all text-sm shadow-sm border border-gray-100">
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* MESSAGES AREA */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-8 flex flex-col space-y-6 custom-scrollbar"
        >
          {currentMessages.map((msg, idx) => (
            <div key={msg.id} className="flex flex-col">
              {msg.time && (
                <div className="flex items-center justify-center my-6">
                  <div className="h-[1px] bg-gray-100 flex-1"></div>
                  <span className="px-4 text-[9px] font-bold text-[#A3AED0] uppercase tracking-widest">
                    {msg.time}
                  </span>
                  <div className="h-[1px] bg-gray-100 flex-1"></div>
                </div>
              )}
              
              <div className={`flex items-end ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'them' && (
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold mr-2 mb-1 shrink-0 ${activeContact.color}`}>
                    {activeContact.initial}
                  </div>
                )}
                
                <div className={`max-w-[65%] px-5 py-3 text-[13px] font-medium leading-relaxed shadow-sm ${
                  msg.sender === 'me' 
                  ? 'bg-[#111C44] text-white rounded-t-[20px] rounded-bl-[20px]' 
                  : 'bg-white text-[#1B254B] rounded-t-[20px] rounded-br-[20px] border border-gray-50'
                }`}>
                  {msg.text}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* INPUT AREA */}
        <div className="p-6 bg-white border-t border-gray-100">
          <div className="bg-[#F4F7FE] rounded-[20px] p-2 flex items-center gap-2 border border-transparent focus-within:border-[#4318FF]/20 focus-within:bg-white transition-all shadow-sm">
            <button className="p-2.5 hover:bg-white rounded-xl transition-all text-gray-400 text-lg">📎</button>
            
            <input 
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              type="text" 
              placeholder={`Write a message to ${activeContact.name}...`} 
              className="flex-1 bg-transparent border-none px-2 text-[13px] font-medium outline-none text-[#1B254B] placeholder:text-[#A3AED0]"
            />
            
            <div className="flex items-center space-x-1 pr-1">
              {['😊', '🖼️'].map((icon, i) => (
                <button key={i} className="p-2 hover:bg-white rounded-xl transition-all grayscale hover:grayscale-0">
                  {icon}
                </button>
              ))}
              <button className="bg-[#4318FF] text-white p-3 rounded-xl hover:bg-[#3311CC] hover:scale-105 active:scale-95 transition-all shadow-lg shadow-blue-900/20">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentMessages;
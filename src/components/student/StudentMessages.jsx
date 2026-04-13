import React, { useState } from 'react';

const StudentMessages = () => {
  // داتا تاع الإدارة + الأساتذة (student view)
  const contacts = [
    { id: 1, name: "Mr. David (Teacher)", role: "English Teacher", avatar: "D", status: "online", lastMsg: "Don’t forget homework for tomorrow.", time: "10:30 AM", unread: 2 },
    { id: 2, name: "Ms. Lina (Teacher)", role: "French Teacher", avatar: "L", status: "offline", lastMsg: "Good job on your last test!", time: "Yesterday", unread: 0 },
    { id: 3, name: "Administration", role: "School Office", avatar: "A", status: "online", lastMsg: "Your schedule has been updated.", time: "09:15 AM", unread: 0 },
    { id: 4, name: "IT Support", role: "Technical Help", avatar: "IT", status: "offline", lastMsg: "Password reset completed.", time: "Monday", unread: 0 }
  ];

  const [messages, setMessages] = useState([
    { id: 1, sender: "Mr. David (Teacher)", text: "Hello! Please revise unit 3 before next class.", time: "10:15 AM", isMe: false },
    { id: 2, sender: "Me", text: "Okay sir, I will revise it today.", time: "10:20 AM", isMe: true },
    { id: 3, sender: "Mr. David (Teacher)", text: "Great, keep it up 👍", time: "10:30 AM", isMe: false },
  ]);

  const [activeContact, setActiveContact] = useState(contacts[0]);
  const [newMessage, setNewMessage] = useState('');

  // إرسال رسالة
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    const newMsg = {
      id: messages.length + 1,
      sender: "Me",
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    };

    setMessages([...messages, newMsg]);
    setNewMessage('');
  };

  return (
    <div className="flex-1 flex flex-col h-full animate-fadeIn">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#1B254B]">💬 Messages</h1>
        <p className="text-gray-500 text-sm mt-1">
          Stay in touch with your teachers and school staff.
        </p>
      </div>

      {/* Chat Container */}
      <div className="flex-1 flex bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden min-h-[500px] h-[calc(100vh-220px)]">

        {/* LEFT SIDE */}
        <div className="w-1/3 border-r border-gray-100 flex flex-col bg-[#f8fafc]">

          <div className="p-4 border-b border-gray-100 bg-white">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
              <input 
                type="text" 
                placeholder="Search teachers..."
                className="w-full bg-gray-50 border border-gray-200 rounded-full py-2 pl-9 pr-4 text-sm outline-none"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
            {contacts.map((contact) => (
              <div 
                key={contact.id} 
                onClick={() => setActiveContact(contact)}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors mb-1
                  ${activeContact.id === contact.id ? 'bg-blue-50 border border-blue-100' : 'hover:bg-white border border-transparent'}`}
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

        {/* RIGHT SIDE */}
        <div className="w-2/3 flex flex-col bg-white">

          {/* Chat Header */}
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
              <button>📞</button>
              <button>📹</button>
              <button>⋮</button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 bg-[#f8fafc] custom-scrollbar flex flex-col gap-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] rounded-2xl px-4 py-3 shadow-sm ${
                  msg.isMe 
                    ? 'bg-[#4318FF] text-white rounded-br-none' 
                    : 'bg-white border border-gray-100 text-[#1B254B] rounded-bl-none'
                }`}>
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  <p className={`text-[10px] mt-1 text-right ${msg.isMe ? 'text-blue-200' : 'text-gray-400'}`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-100 shrink-0">
            <form onSubmit={handleSendMessage} className="flex items-center gap-3">
              <button type="button" className="text-gray-400 hover:text-[#4318FF] text-xl">
                📎
              </button>

              <input 
                type="text" 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message to your teacher..."
                className="flex-1 bg-gray-50 border border-gray-200 rounded-full py-2.5 px-4 text-sm outline-none focus:border-[#4318FF]"
              />

              <button 
                type="submit"
                className="w-10 h-10 bg-[#4318FF] rounded-full flex items-center justify-center text-white shadow-md"
              >
                ➤
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StudentMessages;
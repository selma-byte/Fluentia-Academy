import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

const StudentCommunications = () => {
  const [activeTab, setActiveTab] = useState('Announcements');

  // ==========================================
  // 📢 ANNOUNCEMENTS (STUDENT VIEW ONLY)
  // ==========================================
  const AnnouncementsPart = () => {
    const [announcements, setAnnouncements] = useState([]);

    useEffect(() => {
      const fetchAnnouncements = async () => {
        const { data } = await supabase
          .from('communications')
          .select('*')
          .eq('type', 'General')
          .order('created_at', { ascending: false });

        if (data && data.length > 0) {
          setAnnouncements(data);
        } else {
          setAnnouncements([
            {
              id: 1,
              type: 'General',
              title: 'Welcome!',
              content: 'Welcome to the school communication hub.',
              created_at: new Date()
            }
          ]);
        }
      };

      fetchAnnouncements();
    }, []);

    const getTagStyle = (type) => {
      switch (type) {
        case 'Event':
          return 'bg-[#e6fbf2] text-[#00a65e]';
        case 'Urgent':
          return 'bg-[#fdeaea] text-[#e02424]';
        default:
          return 'bg-[#eef2ff] text-[#4318FF]';
      }
    };

    return (
      <div className="flex gap-8 animate-fadeIn h-full overflow-hidden">

        <div className="flex-1 overflow-y-auto custom-scrollbar pr-4">

          {/* HEADER */}
          <div className="bg-[#f8fafc] rounded-2xl p-6 flex justify-between items-center mb-8 border border-gray-100 shadow-sm">
            <div>
              <h2 className="text-2xl font-bold text-[#1B254B] mb-2">
                Announcements
              </h2>
            </div>
            <div className="text-6xl">📢</div>
          </div>

          {/* LIST */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
              >
                <div className="flex justify-between mb-4">
                  <span
                    className={`px-3 py-1 rounded-md text-xs font-bold ${getTagStyle(
                      ann.type
                    )}`}
                  >
                    {ann.type}
                  </span>

                  <span className="text-xs text-gray-400">
                    📅 {new Date(ann.created_at).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="font-bold text-[#1B254B] text-lg mb-2">
                  {ann.title || 'Notification'}
                </h3>

                <p className="text-sm text-gray-500">{ann.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // 💬 MESSAGES (STUDENT READ-ONLY CHAT)
  // ==========================================
  const MessagesPart = () => {
    const [messages, setMessages] = useState([]);
    const [staffList, setStaffList] = useState([]);
    const [activeContact, setActiveContact] = useState(null);

    useEffect(() => {
      const fetchStaff = async () => {
        const { data } = await supabase
          .from('teachers')
          .select('*')
          .in('role', ['Admin', 'Secretary']);

        if (data && data.length > 0) {
          setStaffList(data);
          setActiveContact(data[0]);
        }
      };

      fetchStaff();
    }, []);

    useEffect(() => {
      const fetchMessages = async () => {
        const { data } = await supabase
          .from('communications')
          .select('*')
          .neq('type', 'General')
          .order('created_at', { ascending: true });

        if (data) setMessages(data);
      };

      fetchMessages();
    }, [activeContact]);

    return (
      <div className="flex-1 flex bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden h-[500px]">

        {/* LEFT SIDEBAR */}
        <div className="w-1/3 border-r border-gray-100 flex flex-col bg-[#f8fafc]">
          <div className="p-4 bg-white border-b font-black text-[10px] text-[#1B254B] uppercase tracking-widest">
            Administration
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            {staffList.map((staff) => (
              <div
                key={staff.id}
                onClick={() => setActiveContact(staff)}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer mb-2 transition-all ${
                  activeContact?.id === staff.id
                    ? 'bg-blue-50 border border-blue-100'
                    : 'hover:bg-white'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-[#1B254B] text-white flex items-center justify-center font-bold">
                  {staff.first_name?.[0] || 'S'}
                </div>

                <div className="flex-1">
                  <h4 className="text-sm font-bold text-[#1B254B]">
                    {staff.first_name}
                  </h4>
                  <p className="text-[10px] text-gray-400">{staff.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CHAT AREA (READ ONLY) */}
        <div className="flex-1 flex flex-col bg-white">

          <div className="h-16 border-b flex items-center px-6 font-bold text-[#1B254B]">
            Chat with {activeContact?.first_name}
          </div>

          <div className="flex-1 overflow-y-auto p-6 bg-[#f8fafc] space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.type === 'teacher' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-3 shadow-sm ${
                    msg.type === 'teacher'
                      ? 'bg-[#4318FF] text-white'
                      : 'bg-white text-[#1B254B]'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            ))}
          </div>

          {/* NO INPUT FOR STUDENT (READ ONLY) */}
          <div className="p-4 bg-white border-t text-center text-xs text-gray-400">
            Messaging disabled for students
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // MAIN UI
  // ==========================================
  return (
    <div className="w-full flex flex-col animate-fadeIn">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-black text-[#1B254B]">
          👋 Communications Hub
        </h1>

        <div className="flex bg-gray-100 p-1 rounded-xl shadow-inner">
          <button
            onClick={() => setActiveTab('Announcements')}
            className={`px-6 py-2 rounded-lg font-bold text-xs ${
              activeTab === 'Announcements'
                ? 'bg-white text-[#4318FF]'
                : 'text-gray-500'
            }`}
          >
            Announcements
          </button>

          <button
            onClick={() => setActiveTab('Messages')}
            className={`px-6 py-2 rounded-lg font-bold text-xs ${
              activeTab === 'Messages'
                ? 'bg-white text-[#4318FF]'
                : 'text-gray-500'
            }`}
          >
            Messages
          </button>
        </div>
      </div>

      {activeTab === 'Announcements' ? (
        <AnnouncementsPart />
      ) : (
        <MessagesPart />
      )}
    </div>
  );
};

export default StudentCommunications;
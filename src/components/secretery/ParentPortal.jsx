import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient'; // تأكدي من مسار الملف
  
const ParentPortal = () => {
  const [chatMessages, setChatMessages] = useState([]);
  const [mainView, setMainView] = useState('portal'); 
  const [activeTab, setActiveTab] = useState('parents'); 
  const [modalView, setModalView] = useState(null); 
  const [chatType, setChatType] = useState(null);
  const [newMessage, setNewMessage] = useState(''); 

  // --- حالات الفلترة لصناديق الاختيار (تمت إضافة teacher و admin) ---
  const [selectedAudiences, setSelectedAudiences] = useState({
    all: true,
    students: false,
    parents: false,
    staff: false,
    teacher: false,
    admin: false
  });

  useEffect(() => {
    const fetchMessages = async () => {
      if (!chatType) return;

      let filterQuery = `type.eq.${chatType},type.eq.smart,type.eq.General`;
      
      if (chatType === 'staff') {
        filterQuery += `,type.eq.teacher,type.eq.admin`;
      }

      const { data } = await supabase
        .from('communications')
        .select('*')
        .or(filterQuery)
        .order('created_at', { ascending: true });
      
      if (data) setChatMessages(data);
    };

    fetchMessages();
  }, [chatType, activeTab]); 

  const handleAudienceChange = (audience) => {
    if (audience === 'all') {
      setSelectedAudiences({
        all: true,
        students: false,
        parents: false,
        staff: false,
        teacher: false,
        admin: false
      });
    } else {
      setSelectedAudiences(prev => {
        const newState = { ...prev, [audience]: !prev[audience], all: false };
        if (!newState.students && !newState.parents && !newState.staff && !newState.teacher && !newState.admin) {
          newState.all = true;
        }
        return newState;
      });
    }
  };

  const renderParentsTab = () => (
    <div className="flex flex-col flex-1 min-h-0 animate-fade-in">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <h3 className="font-bold text-[#0A1128] text-lg">Parent Directory</h3>
          <p className="text-xs text-gray-500 mt-1">Manage parent and guardian information for school network</p>
        </div>
        <button 
          onClick={() => setModalView('addParent')}
          className="bg-[#2563eb] hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-colors flex items-center"
        >
          <span className="mr-2 text-lg">+</span> Add Parent
        </button>
      </div>

      <div className="mb-6 relative w-96 shrink-0">
        <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">🔍</span>
        <input type="text" placeholder="Search parents by name or student..." className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 shadow-sm" />
      </div>

      <div className="overflow-x-auto flex-1 custom-scrollbar bg-white border border-gray-100 rounded-xl shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold sticky top-0">
            <tr>
              <th className="py-4 px-6">Parent/Guardian</th>
              <th className="py-4 px-6">Contact</th>
              <th className="py-4 px-6">Students</th>
              <th className="py-4 px-6">Relationship</th>
              <th className="py-4 px-6">Emergency</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr className="hover:bg-gray-50/50 transition-colors">
              <td className="py-4 px-6">
                <p className="font-bold text-[#0A1128]">Ahmed Al-Mansouri</p>
                <p className="text-xs text-gray-500">Business Manager</p>
              </td>
              <td className="py-4 px-6 text-xs text-gray-600 space-y-1">
                <p className="flex items-center"><span className="mr-2">✉️</span> ahmed.mansouri@email.com</p>
                <p className="flex items-center"><span className="mr-2">📞</span> +971 50 123 4567</p>
                <p className="flex items-center"><span className="mr-2">📍</span> 123 Main Street</p>
              </td>
              <td className="py-4 px-6">
                <div className="flex space-x-2">
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-xs font-bold">Alex Mansouri (B1)</span>
                </div>
              </td>
              <td className="py-4 px-6 text-gray-600">Father</td>
              <td className="py-4 px-6"><span className="bg-green-50 text-green-600 px-2 py-1 rounded text-xs font-bold">Yes</span></td>
              <td className="py-4 px-6"><span className="text-green-600 font-bold flex items-center"><span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>Active</span></td>
              <td className="py-4 px-6 text-center space-x-4">
                <button className="text-gray-500 hover:text-blue-600 font-bold text-xs transition-colors">View</button>
                <button onClick={() => { setMainView('chat'); setChatType('parent'); setModalView(null); }} className="text-gray-400 hover:text-blue-600 text-lg transition-colors cursor-pointer">💬</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderStudentsTab = () => (
    <div className="flex flex-col flex-1 min-h-0 animate-fade-in">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <h3 className="font-bold text-[#0A1128] text-lg">Student Directory</h3>
          <p className="text-xs text-gray-500 mt-1">Manage student contact information for school network</p>
        </div>
      </div>

      <div className="mb-6 relative w-96 shrink-0">
        <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">🔍</span>
        <input type="text" placeholder="Search students by name..." className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 shadow-sm" />
      </div>

      <div className="overflow-x-auto flex-1 custom-scrollbar bg-white border border-gray-100 rounded-xl shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold sticky top-0">
            <tr>
              <th className="py-4 px-6">Student Name</th>
              <th className="py-4 px-6">Contact Info</th>
              <th className="py-4 px-6">Course Info</th>
              <th className="py-4 px-6">Group</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr className="hover:bg-gray-50/50 transition-colors">
              <td className="py-4 px-6">
                <p className="font-bold text-[#0A1128]">Yacine Benali</p>
              </td>
              <td className="py-4 px-6 text-xs text-gray-600 space-y-1">
                <p className="flex items-center"><span className="mr-2">✉️</span> yacine.b@email.com</p>
                <p className="flex items-center"><span className="mr-2">📱</span> +213 555 123 456</p>
              </td>
              <td className="py-4 px-6">
                <p className="font-bold text-[#0A1128]">English (A1)</p>
              </td>
              <td className="py-4 px-6 text-gray-600">Group 1</td>
              <td className="py-4 px-6"><span className="text-green-600 font-bold flex items-center"><span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>Active</span></td>
              <td className="py-4 px-6 text-center space-x-4">
                <button className="text-gray-500 hover:text-blue-600 font-bold text-xs transition-colors">View</button>
                <button onClick={() => { setMainView('chat'); setChatType('student'); }} className="text-gray-400 hover:text-blue-600 text-lg transition-colors cursor-pointer">💬</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderStaffTab = () => (
    <div className="flex flex-col flex-1 min-h-0 animate-fade-in">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <h3 className="font-bold text-[#0A1128] text-lg">Staff Directory</h3>
          <p className="text-xs text-gray-500 mt-1">Manage school staff information for school network</p>
        </div>
        <button className="bg-[#2563eb] hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-colors flex items-center">
          <span className="mr-2 text-lg">+</span> Add Staff
        </button>
      </div>

      <div className="mb-6 relative w-96 shrink-0">
        <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">🔍</span>
        <input type="text" placeholder="Search staff by name or role..." className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 shadow-sm" />
      </div>

      <div className="overflow-x-auto flex-1 custom-scrollbar bg-white border border-gray-100 rounded-xl shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold sticky top-0">
            <tr>
              <th className="py-4 px-6">Staff Member</th>
              <th className="py-4 px-6">Contact</th>
              <th className="py-4 px-6">Role</th>
              <th className="py-4 px-6">Department</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr className="hover:bg-gray-50/50 transition-colors">
              <td className="py-4 px-6">
                <p className="font-bold text-[#0A1128]">Sarah Jamel</p>
                <p className="text-xs text-gray-500">Senior Teacher</p>
              </td>
              <td className="py-4 px-6 text-xs text-gray-600 space-y-1">
                <p className="flex items-center"><span className="mr-2">✉️</span> sarah.j@email.com</p>
                <p className="flex items-center"><span className="mr-2">📞</span> +213 555 987 654</p>
              </td>
              <td className="py-4 px-6 text-gray-600">Teacher</td>
              <td className="py-4 px-6 text-gray-600">Languages</td>
              <td className="py-4 px-6"><span className="text-green-600 font-bold flex items-center"><span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>Active</span></td>
              <td className="py-4 px-6 text-center space-x-4">
                <button className="text-gray-500 hover:text-blue-600 font-bold text-xs transition-colors">View</button>
                <button onClick={() => { setMainView('chat'); setChatType('staff'); }} className="text-gray-400 hover:text-blue-600 text-lg transition-colors cursor-pointer">💬</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAnnouncementsTab = () => (
    <div className="flex flex-col flex-1 min-h-0 animate-fade-in">
      <div className="flex justify-between items-center mb-8 shrink-0">
        <div>
          <h3 className="font-bold text-[#0A1128] text-lg">Announcements</h3>
          <p className="text-xs text-gray-500 mt-1">Manage school-wide announcements and notices</p>
        </div>
        <button onClick={() => setModalView('newAnnouncement')} className="bg-[#0A1128] hover:bg-gray-800 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-colors flex items-center">
          <span className="mr-2 text-lg">+</span> New Announcement
        </button>
      </div>

      <div className="space-y-6 overflow-y-auto custom-scrollbar pr-2 flex-1">
        <div className="bg-[#fff7ed] border border-[#ffedd5] rounded-2xl p-6 flex shadow-sm relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-orange-400"></div>
          <div className="flex-1 pl-2">
            <div className="flex items-center mb-2">
              <span className="text-orange-500 mr-2">📌</span>
              <h4 className="font-bold text-orange-900 text-base">Language Proficiency Test (Placement)</h4>
              <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-[10px] font-bold ml-4">High</span>
            </div>
            <p className="text-sm text-orange-800/80 mb-4 leading-relaxed">
              New students can take the placement test from July 20 to August 15. The detailed schedule and levels (CEFR A1 to C2) are available in the portal.
            </p>
            <p className="text-xs text-orange-600/70">By Academic Department • 2024-07-20</p>
          </div>
          <div className="flex flex-col justify-between items-end">
            <div className="flex space-x-2 text-orange-400">
              <button className="hover:text-orange-600">✏️</button>
              <button className="hover:text-orange-600">🗑</button>
            </div>
            <div className="flex space-x-2">
              <span className="bg-white/50 text-orange-800 border border-orange-200 px-3 py-1 rounded-lg text-xs font-bold">Students</span>
              <span className="bg-white/50 text-orange-800 border border-orange-200 px-3 py-1 rounded-lg text-xs font-bold">Parents</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCommunicationsTab = () => (
    <div className="flex flex-col flex-1 min-h-0 animate-fade-in">
      <div className="mb-6 shrink-0">
        <h3 className="font-bold text-[#0A1128] text-lg">Communications</h3>
        <p className="text-xs text-gray-500 mt-1">Send messages and notifications to parents, students, or staff</p>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-10 shrink-0">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h4 className="font-bold text-[#0A1128] text-base mb-4">Targeted Messages</h4>
          <div className="space-y-3">
            <button onClick={() => { setMainView('chat'); setChatType('smart'); }} className="w-full bg-[#0A1128] hover:bg-gray-800 text-white font-bold text-sm py-3.5 rounded-xl transition-colors flex items-center justify-center shadow-sm">
              <span className="mr-2">💬</span> Send Message
            </button>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h4 className="font-bold text-[#0A1128] text-base mb-4">Bulk Communications</h4>
          <div className="space-y-3">
            <button onClick={() => { setMainView('chat'); setChatType('staff'); }} className="w-full bg-gray-50 hover:bg-gray-100 text-[#0A1128] border border-gray-200 font-bold text-sm py-3.5 rounded-xl transition-colors flex items-center justify-center">
              <span className="mr-2 text-gray-500">👨‍🏫</span> Send to Staff
            </button>
            <button onClick={() => { setMainView('chat'); setChatType('emergency'); }} className="w-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold text-sm py-3.5 rounded-xl transition-colors flex items-center justify-center">
              <span className="mr-2">🚨</span> Emergency Notification
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h4 className="font-bold text-[#0A1128] text-base mb-4 shrink-0">Recent Communications</h4>
        <div className="overflow-y-auto custom-scrollbar flex-1">
          <table className="w-full text-left text-sm">
            <tbody className="divide-y divide-gray-100">
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-2">
                  <p className="font-bold text-[#0A1128]">Mid-term exam schedule (B1)</p>
                  <p className="text-xs text-gray-500">Sent to Level B1 parents</p>
                </td>
                <td className="py-4 px-2 text-right text-xs text-gray-400 font-medium">2 hours ago</td>
              </tr>
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-2">
                  <p className="font-bold text-[#0A1128]">Alex Mansouri - Attendance concern</p>
                  <p className="text-xs text-gray-500">Individual message to Ahmed Al-Mansouri</p>
                </td>
                <td className="py-4 px-2 text-right text-xs text-gray-400 font-medium">1 day ago</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const FilterSection = () => (
    <div className="bg-white border-b border-gray-200 p-6 shrink-0 shadow-sm z-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Target Audience</label>
          <div className="flex space-x-4 pt-1">
            <label className="flex items-center cursor-pointer">
              <input type="checkbox" checked={selectedAudiences.all} onChange={() => handleAudienceChange('all')} className="w-4 h-4 text-blue-600 rounded border-gray-300" />
              <span className="ml-2 text-sm font-bold text-[#0A1128]">All</span>
            </label>

            {/* إظهار هذه الخيارات فقط إذا كنا في قسم Smart */}
            {chatType === 'smart' && (
              <>
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" checked={selectedAudiences.students} onChange={() => handleAudienceChange('students')} className="w-4 h-4 text-blue-600 rounded border-gray-300" />
                  <span className="ml-2 text-sm font-bold text-[#0A1128]">Students</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" checked={selectedAudiences.parents} onChange={() => handleAudienceChange('parents')} className="w-4 h-4 text-blue-600 rounded border-gray-300" />
                  <span className="ml-2 text-sm font-bold text-[#0A1128]">Parents</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" checked={selectedAudiences.staff} onChange={() => handleAudienceChange('staff')} className="w-4 h-4 text-blue-600 rounded border-gray-300" />
                  <span className="ml-2 text-sm font-bold text-[#0A1128]">Staff</span>
                </label>
              </>
            )}

            {/* إظهار هذه الخيارات فقط إذا كنا في قسم Staff */}
            {chatType === 'staff' && (
              <>
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" checked={selectedAudiences.teacher} onChange={() => handleAudienceChange('teacher')} className="w-4 h-4 text-blue-600 rounded border-gray-300" />
                  <span className="ml-2 text-sm font-bold text-[#0A1128]">Teachers</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" checked={selectedAudiences.admin} onChange={() => handleAudienceChange('admin')} className="w-4 h-4 text-blue-600 rounded border-gray-300" />
                  <span className="ml-2 text-sm font-bold text-[#0A1128]">Admins</span>
                </label>
              </>
            )}

          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Language Level</label>
          <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none text-sm font-bold text-[#0A1128] focus:border-blue-500 cursor-pointer">
            <option>All Language</option>
            <option>french</option>
            <option>spanish</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Language Level</label>
          <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none text-sm font-bold text-[#0A1128] focus:border-blue-500 cursor-pointer">
            <option>All Levels</option>
            <option>A1</option>
            <option>B1</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Specific Group</label>
          <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none text-sm font-bold text-[#0A1128] focus:border-blue-500 cursor-pointer">
            <option>All Groups</option>
            <option>Group 1</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderChatView = () => {
    let chatTitle = 'Chat View';
    let isBulkChat = false;
    let emergencyIcon = null;

    if (chatType === 'parent' || chatType === 'student') {
      chatTitle = 'Ahmed Al-Mansouri';
    } else if (chatType === 'smart') {
      chatTitle = 'Send Smart Message';
      isBulkChat = true;
    } else if (chatType === 'staff') {
      chatTitle = 'Sending to All School Staff';
      isBulkChat = true;
    } else if (chatType === 'emergency') {
      chatTitle = 'CRITICAL: Urgent Emergency Notification';
      emergencyIcon = <span className="text-red-600 mr-3 text-2xl">⚠️</span>;
      isBulkChat = true;
    }

    const handleSendMessage = async () => {
      if (!newMessage.trim()) return;
      
      let messageTypeToSave = chatType; 
      if (chatType === 'smart') {
        if (selectedAudiences.all) messageTypeToSave = 'General';
        else if (selectedAudiences.students) messageTypeToSave = 'student';
        else if (selectedAudiences.parents) messageTypeToSave = 'parent';
        else if (selectedAudiences.staff) messageTypeToSave = 'staff';
      } else if (chatType === 'staff') {
        if (selectedAudiences.all) messageTypeToSave = 'staff';
        else if (selectedAudiences.teacher) messageTypeToSave = 'teacher';
        else if (selectedAudiences.admin) messageTypeToSave = 'admin';
      } else {
        messageTypeToSave = chatType || 'General';
      }

      const { data, error } = await supabase
        .from('communications')
        .insert([{ content: newMessage, type: messageTypeToSave }])
        .select(); 
    
      if (error) {
        console.error("Error:", error.message);
      } else {
        setNewMessage('');
        if (data) setChatMessages([...chatMessages, data[0]]);
      }
    };

    const displayMessages = chatMessages.filter(msg => {
      if (chatType === 'smart') {
         if (selectedAudiences.all && msg.type === 'General') return true; 
         if (selectedAudiences.students && msg.type === 'student') return true;
         if (selectedAudiences.parents && msg.type === 'parent') return true;
         if (selectedAudiences.staff && msg.type === 'staff') return true;
         return false;
      } else if (chatType === 'staff') {
         if (selectedAudiences.all && msg.type === 'staff') return true;
         if (selectedAudiences.teacher && msg.type === 'teacher') return true;
         if (selectedAudiences.admin && msg.type === 'admin') return true;
         return false;
      }
      return msg.type === chatType || msg.type === 'General';
    });

    return (
      <div className="w-full h-full flex flex-col bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden animate-[slide-in-right_0.3s_ease-out]">
        <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50/80 shrink-0">
          <div className="flex items-center">
            <button onClick={() => setMainView('portal')} className="mr-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-600 transition-colors">
              ←
            </button>
            {!isBulkChat && (
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 relative">
                <img src="https://i.pravatar.cc/150?u=ahmed" alt="Ahmed" className="w-full h-full rounded-full object-cover" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
              </div>
            )}
            {emergencyIcon}
            <div>
              <h3 className={`font-bold ${chatType === 'emergency' ? 'text-red-600' : 'text-[#0A1128]'} text-base`}>{chatTitle}</h3>
              <p className="text-xs text-green-600 font-medium">System Ready</p>
            </div>
          </div>
          <div className="flex space-x-3 text-gray-500">
            <button className="hover:text-blue-600 p-2 rounded-full hover:bg-blue-50">📞</button>
            <button className="hover:text-blue-600 p-2 rounded-full hover:bg-blue-50">📹</button>
            <button className="hover:text-gray-800 p-2 rounded-full hover:bg-gray-200">⠇</button>
          </div>
        </div>

        <div className="flex flex-1 min-h-0 relative">
          <div className={`flex-1 flex flex-col bg-[#f8fafc] relative ${isBulkChat ? 'col-span-2' : ''}`}>
            
            {(chatType === 'smart' || chatType === 'staff') && <FilterSection />}

            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar flex flex-col">
              {displayMessages.length > 0 ? (
                displayMessages.map((msg) => (
                  <div key={msg.id} className="flex items-end justify-end space-x-2">
                    <div className="bg-[#2563eb] text-white p-4 rounded-2xl rounded-br-sm max-w-md shadow-sm">
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                      <span className="text-[10px] text-blue-200 mt-2 block text-right">
                        {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full flex-1 text-gray-400 opacity-70">
                  {chatType === 'smart' && (
                    <>
                      <span className="text-5xl mb-4">💬</span>
                      <p className="text-sm font-bold text-gray-500">Select filters above and type your message to broadcast.</p>
                    </>
                  )}
                  {chatType === 'staff' && (
                    <>
                      <span className="text-5xl mb-4">👨‍🏫</span>
                      <p className="text-sm font-bold text-gray-500">Select audience above and type your message to send to staff.</p>
                    </>
                  )}
                  {(chatType !== 'smart' && chatType !== 'staff' && chatType !== 'emergency') && (
                    <p className="text-sm italic">No messages yet.</p>
                  )}
                </div>
              )}
            </div>

            {chatType === 'emergency' && (
              <div className="flex items-end justify-end space-x-2 p-6">
                <div className="bg-[#fee2e2] text-red-900 border border-red-200 p-4 rounded-2xl rounded-br-sm max-w-md shadow-sm relative">
                  <span className="absolute -left-2 -top-2 bg-red-600 text-white w-6 h-6 flex items-center justify-center rounded-full font-bold">!</span>
                  <p className="text-sm font-bold leading-relaxed mb-1">EMERGENCY NOTICE: FACILITY CLOSURE</p>
                  <p className="text-sm leading-relaxed">To All: Due to extreme weather, the facility is closed today. All classes (all levels) are moved online.</p>
                  <span className="text-[10px] text-red-700 mt-2 block text-right">5:12 PM ✓✓</span>
                </div>
              </div>
            )}

            <div className="p-4 bg-white border-t border-gray-200 shrink-0 m-4 rounded-2xl shadow-sm flex items-center relative z-20">
              <button className="text-gray-400 hover:text-gray-600 p-2 text-xl">+</button>
              <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder={`Type your message here...`} className="flex-1 bg-transparent px-4 outline-none text-sm" />
              <button onClick={handleSendMessage} className={`${chatType === 'emergency' ? 'bg-red-600 hover:bg-red-700' : 'bg-[#2563eb] hover:bg-blue-700'} text-white w-10 h-10 rounded-xl flex items-center justify-center shadow-sm transition-colors`}>
                ➤
              </button>
            </div>
          </div>

          {!isBulkChat && (
            <div className="w-80 bg-white border-l border-gray-100 flex flex-col p-6 overflow-y-auto custom-scrollbar shrink-0">
              <div className="flex flex-col items-center justify-center mb-8 pt-4">
                <img src="https://i.pravatar.cc/150?u=ahmed" alt="Ahmed" className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg mb-4" />
                <h3 className="font-bold text-[#0A1128] text-lg">Ahmed Mansouri</h3>
                <p className="text-sm text-gray-500">Parent / Guardian</p>
              </div>
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center"><span className="mr-2">📄</span> Contact Information</h4>
                  <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Phone Number</p>
                      <p className="text-sm font-bold text-[#0A1128]">+971 50 123 4567</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Email Address</p>
                      <p className="text-sm font-bold text-[#2563eb]">ahmed.mansouri@email.com</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Current Address</p>
                      <p className="text-sm font-bold text-[#0A1128] leading-snug">123 Main Street<br/>Dubai, UAE</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center"><span className="mr-2">🎓</span> Student Information</h4>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center">
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold mr-3">A</div>
                    <div>
                      <p className="text-sm font-bold text-[#0A1128]">Alex Mansouri</p>
                      <p className="text-[11px] text-gray-500">Level: Intermediate (B1)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="animate-fade-in w-full h-full flex flex-col relative pt-12 text-[#0A1128]">
      {mainView === 'portal' && (
        <div className="w-full h-full flex flex-col">
          <div className="mb-6 shrink-0 border-b border-gray-200 pb-4">
            <h2 className="text-3xl font-bold text-[#0A1128] mb-1">Communication Portal</h2>
            <p className="text-sm text-gray-500">Manage directories and student progress communication</p>
          </div>

          <div className="grid grid-cols-4 gap-6 mb-8 shrink-0">
            <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-xs font-bold mb-1">Total Parents</p>
                <p className="text-3xl font-bold text-[#0A1128] mb-1">345</p>
                <p className="text-[10px] text-gray-400">Registered parents</p>
              </div>
              <span className="text-blue-500 text-lg">👥</span>
            </div>
            <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-xs font-bold mb-1">Emergency Contacts</p>
                <p className="text-3xl font-bold text-[#0A1128] mb-1">340</p>
                <p className="text-[10px] text-gray-400">Available contacts</p>
              </div>
              <span className="text-green-500 text-lg">📞</span>
            </div>
            <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-xs font-bold mb-1">Bulk Messages</p>
                <p className="text-3xl font-bold text-[#0A1128] mb-1">1,240</p>
                <p className="text-[10px] text-gray-400">This month</p>
              </div>
              <span className="text-purple-500 text-lg">💬</span>
            </div>
            <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-xs font-bold mb-1">Portal Active</p>
                <p className="text-3xl font-bold text-[#0A1128] mb-1">89%</p>
                <p className="text-[10px] text-gray-400">Parent engagement</p>
              </div>
              <span className="text-orange-500 text-lg">📱</span>
            </div>
          </div>

          <div className="flex space-x-2 bg-gray-100 p-1.5 rounded-xl w-max mb-8 shrink-0">
            <button onClick={() => setActiveTab('parents')} className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'parents' ? 'bg-white text-[#0A1128] shadow-sm' : 'text-gray-500 hover:text-[#0A1128]'}`}>
              Parents
            </button>
            <button onClick={() => setActiveTab('students')} className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'students' ? 'bg-white text-[#0A1128] shadow-sm' : 'text-gray-500 hover:text-[#0A1128]'}`}>
              Students
            </button>
            <button onClick={() => setActiveTab('staff')} className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'staff' ? 'bg-white text-[#0A1128] shadow-sm' : 'text-gray-500 hover:text-[#0A1128]'}`}>
              Staff
            </button>
            <button onClick={() => setActiveTab('announcements')} className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'announcements' ? 'bg-white text-[#0A1128] shadow-sm' : 'text-gray-500 hover:text-[#0A1128]'}`}>
              Announcements
            </button>
            <button onClick={() => setActiveTab('communications')} className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'communications' ? 'bg-white text-[#0A1128] shadow-sm' : 'text-gray-500 hover:text-[#0A1128]'}`}>
              Communications
            </button>
          </div>

          {activeTab === 'parents' && renderParentsTab()}
          {activeTab === 'students' && renderStudentsTab()}
          {activeTab === 'staff' && renderStaffTab()}
          {activeTab === 'announcements' && renderAnnouncementsTab()}
          {activeTab === 'communications' && renderCommunicationsTab()}
        </div>
      )}

      {mainView === 'chat' && renderChatView()}

      {modalView === 'addParent' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl animate-fade-in-up flex flex-col overflow-hidden border border-gray-100">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
              <div>
                <h2 className="text-xl font-bold text-[#0A1128] mb-1">Add New Parent/Guardian</h2>
                <p className="text-xs text-gray-500">Enter parent or guardian information for institute</p>
              </div>
              <button onClick={() => setModalView(null)} className="text-gray-400 hover:text-black text-xl">✕</button>
            </div>
            <div className="p-8 overflow-y-auto custom-scrollbar">
              <form className="space-y-5">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">First Name</label>
                    <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none text-sm focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Last Name</label>
                    <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none text-sm focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Email</label>
                    <input type="email" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none text-sm focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Phone</label>
                    <input type="tel" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none text-sm focus:border-blue-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Address</label>
                  <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none text-sm focus:border-blue-500" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Occupation</label>
                    <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none text-sm focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Relationship</label>
                    <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none text-sm focus:border-blue-500 cursor-pointer">
                      <option>Select relationship</option>
                      <option>Father</option>
                      <option>Mother</option>
                      <option>Guardian</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center pt-2">
                  <input type="checkbox" id="emergency" className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer" />
                  <label htmlFor="emergency" className="ml-3 text-sm font-bold text-[#0A1128] cursor-pointer">Emergency Contact</label>
                </div>
                <div className="pt-4">
                  <button type="button" onClick={() => setModalView(null)} className="w-full bg-[#2563eb] hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold text-sm shadow-sm transition-colors">
                    Add Parent
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {modalView === 'newAnnouncement' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl animate-fade-in-up flex flex-col overflow-hidden border border-gray-100">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
              <div>
                <h2 className="text-xl font-bold text-[#0A1128] mb-1">Create New Announcement</h2>
                <p className="text-xs text-gray-500">Share important information with school community</p>
              </div>
              <button onClick={() => setModalView(null)} className="text-gray-400 hover:text-black text-xl">✕</button>
            </div>
            <div className="p-8 overflow-y-auto custom-scrollbar">
              <form className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Title</label>
                  <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 outline-none text-sm focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Content</label>
                  <textarea rows="4" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 outline-none text-sm focus:border-blue-500 resize-none"></textarea>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Priority</label>
                    <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 outline-none text-sm focus:border-blue-500 cursor-pointer">
                      <option>Medium</option>
                      <option>High</option>
                      <option>Low</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Expiry Date</label>
                    <input type="date" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 outline-none text-sm focus:border-blue-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Target Audience</label>
                  <div className="flex space-x-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <label className="flex items-center cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                      <span className="ml-2 text-sm font-bold text-[#0A1128]">Students</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                      <span className="ml-2 text-sm font-bold text-[#0A1128]">Teachers</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                      <span className="ml-2 text-sm font-bold text-[#0A1128]">Parents</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                      <span className="ml-2 text-sm font-bold text-[#0A1128]">Staff</span>
                    </label>
                  </div>
                </div>
                <div className="pt-4">
                  <button type="button" onClick={() => setModalView(null)} className="w-full bg-[#2563eb] hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold text-sm shadow-sm transition-colors">
                    Publish Announcement
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ParentPortal;
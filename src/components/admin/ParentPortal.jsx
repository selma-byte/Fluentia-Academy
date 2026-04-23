import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

// ==========================================
// 🔔 MODERN NOTIFICATION COMPONENT
// ==========================================
const Toast = ({ message, onClose }) => (
  <div className="fixed bottom-12 right-12 z-[250] animate-in slide-in-from-right duration-500">
    <div className="bg-[#1A2252] text-white px-10 py-6 rounded-[2.5rem] shadow-2xl flex items-center gap-6 border border-blue-400/30 backdrop-blur-xl min-w-[400px]">
      <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-blue-500/40 animate-pulse">✨</div>
      <div className="flex-1 text-left">
        <p className="text-lg font-black italic tracking-tight leading-none mb-1">System Update</p>
        <p className="text-sm font-bold text-blue-200/80 italic">{message}</p>
      </div>
      <button onClick={onClose} className="ml-6 text-white/30 hover:text-white transition-colors text-2xl p-2 cursor-pointer">✕</button>
    </div>
  </div>
);

const ParentPortal = () => {
  const [chatMessages, setChatMessages] = useState([]);
  const [mainView, setMainView] = useState('portal');
  const [activeTab, setActiveTab] = useState('parents');
  const [modalView, setModalView] = useState(null);
  const [chatType, setChatType] = useState(null);
  const [newMessage, setNewMessage] = useState(''); 
  const [selectedRecipient, setSelectedRecipient] = useState(null); 
  
  const [studentsList, setStudentsList] = useState([]); 
  const [staffList, setStaffList] = useState([]); 
  const [parentsList, setParentsList] = useState([]); // 💡 قائمة الأولياء (تُستخرج أوتوماتيكيا)
  const [announcementsList, setAnnouncementsList] = useState([]); // 💡 قائمة الإعلانات
  
  const [toast, setToast] = useState(null);
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4500);
  };

  const [announcementForm, setAnnouncementForm] = useState({ title: '', content: '', priority: 'Medium', audience: 'All' });

  const [selectedAudiences, setSelectedAudiences] = useState({
    all: true, students: false, parents: false, staff: false, teacher: false, admin: false
  });

  const fetchData = async () => {
    // 1. جلب الأساتذة
    const { data: staffData } = await supabase.from('staff').select('*');
    if (staffData) setStaffList(staffData);

    // 2. جلب التلاميذ واستخراج الأولياء
    const { data: studentData } = await supabase.from('students').select('*');
    if (studentData) {
      setStudentsList(studentData);
      
      // 💡 استخراج الأولياء من بيانات التلاميذ
      const parentsMap = {};
      studentData.forEach(s => {
        if (s.parent_email) {
          if (!parentsMap[s.parent_email]) {
            parentsMap[s.parent_email] = {
              email: s.parent_email,
              name: s.parent_name || `Guardian of ${s.first_name}`,
              phone: s.parent_contact || s.phone,
              kids: []
            };
          }
          parentsMap[s.parent_email].kids.push(`${s.first_name} (${s.level || 'N/A'})`);
        }
      });
      setParentsList(Object.values(parentsMap));
    }

    // 3. جلب الإعلانات والمراسلات
    const { data: commsData } = await supabase.from('communications').select('*').order('created_at', { ascending: false });
    if (commsData) {
      setAnnouncementsList(commsData.filter(c => c.type === 'announcement'));
      setChatMessages(commsData.filter(c => c.type !== 'announcement').reverse());
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAudienceChange = (audience) => {
    if (audience === 'all') {
      setSelectedAudiences({ all: true, students: false, parents: false, staff: false, teacher: false, admin: false });
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

  const handlePublishAnnouncement = async () => {
    if (!announcementForm.title || !announcementForm.content) return showToast("⚠️ Please fill title and content");
    
    const { error } = await supabase.from('communications').insert([{
      content: `📢 ${announcementForm.title}\n\n${announcementForm.content}`,
      type: 'announcement',
      recipient_name: announcementForm.audience,
      recipient_id: 'all',
      sender_role: 'admin'
    }]);

    if (!error) {
      showToast("✅ Announcement Published successfully!");
      setModalView(null);
      setAnnouncementForm({ title: '', content: '', priority: 'Medium', audience: 'All' });
      fetchData(); // تحديث القائمة
    } else {
      showToast("❌ Error publishing announcement: " + error.message);
    }
  };

  const handleAddParentMock = () => {
    // هادي دالة وهمية برك باش تمشي المودال تاع إضافة ولي، باسكو الأولياء يتزادو من باجة Registration
    showToast("✅ Parent profile linked successfully. (Data is synced from Student Registration)");
    setModalView(null);
  };

  const renderParentsTab = () => (
    <div className="flex flex-col flex-1 min-h-0 animate-fade-in text-left">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <h3 className="font-bold text-[#0A1128] text-lg">Parent Directory</h3>
          <p className="text-xs text-gray-500 mt-1">Manage parent and guardian information for school network</p>
        </div>
        <button onClick={() => setModalView('addParent')} className="bg-[#2563eb] hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-colors flex items-center cursor-pointer">
          <span className="mr-2 text-lg">+</span> Add Parent
        </button>
      </div>

      <div className="mb-6 relative w-96 shrink-0">
        <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">🔍</span>
        <input type="text" placeholder="Search parents by name..." className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 shadow-sm" />
      </div>

      <div className="overflow-x-auto flex-1 custom-scrollbar bg-white border border-gray-100 rounded-xl shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold sticky top-0">
            <tr>
              <th className="py-4 px-6">Parent/Guardian</th>
              <th className="py-4 px-6">Contact Info</th>
              <th className="py-4 px-6">Enrolled Students</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {parentsList.length > 0 ? parentsList.map((parent, idx) => (
              <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                <td className="py-4 px-6">
                  <p className="font-bold text-[#0A1128]">{parent.name}</p>
                  <p className="text-xs text-gray-500">Parent / Guardian</p>
                </td>
                <td className="py-4 px-6 text-xs text-gray-600 space-y-1">
                  <p className="flex items-center"><span className="mr-2">✉️</span> {parent.email}</p>
                  <p className="flex items-center"><span className="mr-2">📞</span> {parent.phone}</p>
                </td>
                <td className="py-4 px-6">
                  <div className="flex flex-wrap gap-2">
                    {parent.kids.map((kid, kIdx) => (
                      <span key={kIdx} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-xs font-bold">{kid}</span>
                    ))}
                  </div>
                </td>
                <td className="py-4 px-6"><span className="text-green-600 font-bold flex items-center"><span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>Active</span></td>
                <td className="py-4 px-6 text-center space-x-4">
                  <button onClick={() => { setMainView('chat'); setChatType('parent'); setSelectedRecipient({ id: parent.email, name: parent.name, role: 'Parent', phone: parent.phone, email: parent.email }); setModalView(null); }} className="text-gray-400 hover:text-blue-600 text-lg transition-colors cursor-pointer">💬</button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="5" className="py-12 text-center text-gray-400 font-bold">No parents found. Register students to auto-generate parents.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderStudentsTab = () => (
    <div className="flex flex-col flex-1 min-h-0 animate-fade-in text-left">
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
              <th className="py-4 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {studentsList.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="py-4 px-6 font-bold text-[#0A1128]">{student.first_name} {student.last_name}</td>
                <td className="py-4 px-6 text-xs text-gray-600 space-y-1"><p>✉️ {student.email}</p><p>📱 {student.phone}</p></td>
                <td className="py-4 px-6 font-bold text-[#0A1128]">{student.language || 'N/A'} ({student.level || '-'})</td>
                <td className="py-4 px-6 text-gray-600">{student.group_name || 'No Group'}</td>
                <td className="py-4 px-6 text-center space-x-4">
                  <button onClick={() => { 
                      setMainView('chat'); setChatType('student_individual'); 
                      setSelectedRecipient({ id: student.id, name: `${student.first_name} ${student.last_name}`, role: 'Student', email: student.email, phone: student.phone, level: student.level }); 
                  }} className="text-gray-400 hover:text-blue-600 text-lg transition-colors cursor-pointer">💬</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderStaffTab = () => (
    <div className="flex flex-col flex-1 min-h-0 animate-fade-in text-left">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <h3 className="font-bold text-[#0A1128] text-lg">Staff Directory</h3>
          <p className="text-xs text-gray-500 mt-1">Manage school staff information for school network</p>
        </div>
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
              <th className="py-4 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {staffList.map((staff) => (
              <tr key={staff.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="py-4 px-6"><p className="font-bold text-[#0A1128]">{staff.first_name} {staff.last_name}</p><p className="text-xs text-gray-500">{staff.role}</p></td>
                <td className="py-4 px-6 text-xs text-gray-600 space-y-1"><p className="flex items-center"><span className="mr-2">✉️</span> {staff.email}</p><p className="flex items-center"><span className="mr-2">📞</span> {staff.phone}</p></td>
                <td className="py-4 px-6 text-gray-600 font-bold">{staff.role}</td>
                <td className="py-4 px-6 text-gray-600">{staff.department || 'General'}</td>
                <td className="py-4 px-6 text-center space-x-4">
                  <button onClick={() => { 
                      setMainView('chat'); setChatType('staff_individual'); 
                      setSelectedRecipient({ id: staff.id, name: `${staff.first_name} ${staff.last_name}`, role: staff.role, email: staff.email, phone: staff.phone, dept: staff.department }); 
                  }} className="text-gray-400 hover:text-blue-600 text-lg transition-colors cursor-pointer">💬</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAnnouncementsTab = () => (
    <div className="flex flex-col flex-1 min-h-0 animate-fade-in text-left">
      <div className="flex justify-between items-center mb-8 shrink-0">
        <div>
          <h3 className="font-bold text-[#0A1128] text-lg">Announcements</h3>
          <p className="text-xs text-gray-500 mt-1">Manage school-wide announcements and notices</p>
        </div>
        <button onClick={() => setModalView('newAnnouncement')} className="bg-[#0A1128] hover:bg-gray-800 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-colors flex items-center cursor-pointer">
          <span className="mr-2 text-lg">+</span> New Announcement
        </button>
      </div>

      <div className="space-y-6 overflow-y-auto custom-scrollbar pr-2 flex-1">
        {announcementsList.length > 0 ? announcementsList.map((ann, idx) => {
          // استخراج العنوان والمحتوى من الفورمات اللي خبيناه
          const lines = ann.content.split('\n\n');
          const title = lines[0].replace('📢 ', '');
          const body = lines.slice(1).join('\n\n');

          return (
            <div key={idx} className="bg-[#fff7ed] border border-[#ffedd5] rounded-2xl p-6 flex shadow-sm relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-orange-400"></div>
              <div className="flex-1 pl-2">
                <div className="flex items-center mb-2">
                  <span className="text-orange-500 mr-2">📌</span>
                  <h4 className="font-bold text-orange-900 text-base">{title}</h4>
                  <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-[10px] font-bold ml-4">Announcement</span>
                </div>
                <p className="text-sm text-orange-800/80 mb-4 leading-relaxed whitespace-pre-wrap">{body}</p>
                <p className="text-xs text-orange-600/70">Published by Admin • {new Date(ann.created_at).toLocaleDateString()}</p>
              </div>
              <div className="flex flex-col justify-between items-end">
                <div className="flex space-x-2 text-orange-400"><button className="hover:text-orange-600">🗑</button></div>
                <div className="flex space-x-2"><span className="bg-white/50 text-orange-800 border border-orange-200 px-3 py-1 rounded-lg text-xs font-bold">{ann.recipient_name || 'All'}</span></div>
              </div>
            </div>
          );
        }) : (
          <div className="text-center py-20 text-gray-400 font-bold">No announcements published yet.</div>
        )}
      </div>
    </div>
  );

  const renderCommunicationsTab = () => (
    <div className="flex flex-col flex-1 min-h-0 animate-fade-in text-left">
      <div className="mb-6 shrink-0">
        <h3 className="font-bold text-[#0A1128] text-lg">Communications</h3>
        <p className="text-xs text-gray-500 mt-1">Send messages and notifications to parents, students, or staff</p>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-10 shrink-0">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h4 className="font-bold text-[#0A1128] text-base mb-4">Targeted Messages</h4>
          <div className="space-y-3">
            <button onClick={() => { setMainView('chat'); setChatType('smart'); setSelectedRecipient(null); }} className="w-full bg-[#0A1128] hover:bg-gray-800 text-white font-bold text-sm py-3.5 rounded-xl transition-colors flex items-center justify-center shadow-sm cursor-pointer">
              <span className="mr-2">💬</span> Send Group Message
            </button>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h4 className="font-bold text-[#0A1128] text-base mb-4">Bulk Communications</h4>
          <div className="space-y-3">
            <button onClick={() => { setMainView('chat'); setChatType('staff'); setSelectedRecipient(null); }} className="w-full bg-gray-50 hover:bg-gray-100 text-[#0A1128] border border-gray-200 font-bold text-sm py-3.5 rounded-xl transition-colors flex items-center justify-center cursor-pointer">
              <span className="mr-2 text-gray-500">👨‍🏫</span> Send to All Staff
            </button>
            <button onClick={() => { setMainView('chat'); setChatType('emergency'); setSelectedRecipient(null); }} className="w-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold text-sm py-3.5 rounded-xl transition-colors flex items-center justify-center cursor-pointer">
              <span className="mr-2">🚨</span> Emergency Notification
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h4 className="font-bold text-[#0A1128] text-base mb-4 shrink-0">Recent Direct Messages</h4>
        <div className="overflow-y-auto custom-scrollbar flex-1">
          <table className="w-full text-left text-sm">
            <tbody className="divide-y divide-gray-100">
              {chatMessages.length > 0 ? chatMessages.slice(0, 10).map((msg, idx) => (
                 <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-2">
                    <p className="font-bold text-[#0A1128] line-clamp-1">{msg.content.replace('🚨 EMERGENCY: ', '')}</p>
                    <p className="text-xs text-gray-500 capitalize">Sent to: {msg.recipient_name || 'Bulk'}</p>
                  </td>
                  <td className="py-4 px-2 text-right text-xs text-gray-400 font-medium">{new Date(msg.created_at).toLocaleString()}</td>
                </tr>
              )) : (
                <tr><td colSpan="2" className="py-10 text-center text-gray-400">No recent messages.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const FilterSection = () => (
    <div className="bg-white border-b border-gray-200 p-6 shrink-0 shadow-sm z-10 text-left">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Target Audience</label>
          <div className="flex space-x-4 pt-1">
            <label className="flex items-center cursor-pointer">
              <input type="checkbox" checked={selectedAudiences.all} onChange={() => handleAudienceChange('all')} className="w-4 h-4 text-blue-600 rounded border-gray-300" />
              <span className="ml-2 text-sm font-bold text-[#0A1128]">All</span>
            </label>
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
              </>
            )}
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
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Language</label>
          <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none text-sm font-bold text-[#0A1128] focus:border-blue-500 cursor-pointer">
            <option>All Languages</option><option>English</option><option>French</option><option>Spanish</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Level</label>
          <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none text-sm font-bold text-[#0A1128] focus:border-blue-500 cursor-pointer">
            <option>All Levels</option><option>A1</option><option>B1</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderChatView = () => {
    let chatTitle = 'Chat View';
    let isBulkChat = false;
    let emergencyIcon = null;

    if (chatType === 'parent' || chatType === 'student_individual' || chatType === 'staff_individual') {
      chatTitle = selectedRecipient?.name || 'User';
    } else if (chatType === 'smart') {
      chatTitle = 'Send Group Message';
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
      
      const messageData = {
        content: chatType === 'emergency' ? `🚨 EMERGENCY: ${newMessage}` : newMessage,
        type: chatType,
        recipient_name: selectedRecipient?.name || (chatType === 'emergency' ? 'All Users' : 'Group/Bulk'),
        recipient_id: selectedRecipient?.id || 'all',
        sender_role: 'admin'
      };
    
      const { data, error } = await supabase.from('communications').insert([messageData]).select(); 
      if (!error && data) {
        setNewMessage('');
        setChatMessages([...chatMessages, data[0]]);
        if (chatType === 'emergency') showToast("🚨 Emergency Alert Broadcasted to all channels!");
      } else {
        showToast("❌ Error sending message.");
      }
    };

    const displayMessages = chatMessages.filter(msg => {
      if (selectedRecipient) return msg.recipient_id === selectedRecipient.id;
      return msg.type === chatType;
    });

    return (
      <div className="w-full h-full flex flex-col bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden animate-[slide-in-right_0.3s_ease-out] text-left">
        <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50/80 shrink-0">
          <div className="flex items-center">
            <button onClick={() => setMainView('portal')} className="mr-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-600 transition-colors cursor-pointer">←</button>
            {!isBulkChat && (
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 relative text-lg border border-blue-200">
                👤<span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
              </div>
            )}
            {emergencyIcon}
            <div>
             <h3 className={`font-bold ${chatType === 'emergency' ? 'text-red-600' : 'text-[#0A1128]'} text-base`}>{chatTitle}</h3>
             <p className="text-xs text-green-600 font-medium">System Ready</p>
            </div>
          </div>
        </div>

        <div className="flex flex-1 min-h-0 relative">
          <div className={`flex-1 flex flex-col bg-[#f8fafc] relative ${isBulkChat ? 'col-span-2' : ''}`}>
            {(chatType === 'smart' || chatType === 'staff') && <FilterSection />}

            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar flex flex-col">
              {displayMessages.length > 0 ? (
                displayMessages.map((msg) => (
                  <div key={msg.id} className={`flex items-end ${msg.sender_role === 'admin' ? 'justify-end' : 'justify-start'} space-x-2`}>
                    <div className={`${chatType === 'emergency' ? 'bg-[#fee2e2] text-red-900 border border-red-200' : 'bg-[#2563eb] text-white'} p-4 rounded-2xl ${msg.sender_role === 'admin' ? 'rounded-br-sm' : 'rounded-bl-sm'} max-w-md shadow-sm`}>
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                      <span className={`text-[10px] ${chatType === 'emergency' ? 'text-red-700' : 'text-blue-200'} mt-2 block text-right`}>
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ✓✓
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full flex-1 text-gray-400 opacity-70">
                  {chatType === 'smart' && <><span className="text-5xl mb-4">💬</span><p className="text-sm font-bold text-gray-500">Select filters above and type your message to broadcast.</p></>}
                  {chatType === 'staff' && <><span className="text-5xl mb-4">👨‍🏫</span><p className="text-sm font-bold text-gray-500">Select audience above and type your message to send to staff.</p></>}
                  {(chatType !== 'smart' && chatType !== 'staff' && chatType !== 'emergency') && <p className="text-sm italic">No messages yet. Say hello!</p>}
                </div>
              )}
            </div>

            <div className="p-4 bg-white border-t border-gray-200 shrink-0 m-4 rounded-2xl shadow-sm flex items-center relative z-20">
              <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="Type your message here..." className="flex-1 bg-transparent px-4 outline-none text-sm font-medium text-gray-700" />
              <button onClick={handleSendMessage} className={`${chatType === 'emergency' ? 'bg-red-600 hover:bg-red-700' : 'bg-[#2563eb] hover:bg-blue-700'} text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center shadow-sm transition-colors cursor-pointer`}>
                Send ➤
              </button>
            </div>
          </div>

          {selectedRecipient && (
            <div className="w-80 bg-white border-l border-gray-100 flex flex-col p-6 overflow-y-auto custom-scrollbar shrink-0 text-left">
              <div className="flex flex-col items-center justify-center mb-8 pt-4">
                <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-3xl mb-4 shadow-lg border-4 border-white">👤</div>
                <h3 className="font-bold text-[#0A1128] text-lg text-center">{selectedRecipient.name}</h3>
                <p className="text-sm text-gray-500 font-bold uppercase">{selectedRecipient.role}</p>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center">📄 Contact Information</h4>
                  <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div><p className="text-[10px] font-bold text-gray-400 uppercase">Phone Number</p><p className="text-sm font-bold text-[#0A1128]">{selectedRecipient.phone || 'N/A'}</p></div>
                    <div><p className="text-[10px] font-bold text-gray-400 uppercase">Email Address</p><p className="text-sm font-bold text-[#2563eb] break-all">{selectedRecipient.email || 'N/A'}</p></div>
                    {selectedRecipient.dept && <div><p className="text-[10px] font-bold text-gray-400 uppercase">Department</p><p className="text-sm font-bold text-[#0A1128]">{selectedRecipient.dept}</p></div>}
                  </div>
                </div>
                {selectedRecipient.level && (
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center">🎓 Academic Info</h4>
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100"><p className="text-sm font-bold text-blue-700">Level: {selectedRecipient.level}</p></div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="animate-fade-in w-full h-full flex flex-col relative text-[#0A1128]">
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      
      {mainView === 'portal' && (
        <div className="w-full h-full flex flex-col">
          <div className="mb-6 shrink-0 border-b border-gray-200 pb-4 text-left">
            <h2 className="text-3xl font-bold text-[#0A1128] mb-1">Communication Hub</h2>
            <p className="text-sm text-gray-500">Manage directories, announcements, and direct messaging</p>
          </div>

          <div className="grid grid-cols-4 gap-6 mb-8 shrink-0 text-left">
            <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm flex justify-between items-start">
              <div><p className="text-gray-500 text-xs font-bold mb-1">Total Parents</p><p className="text-3xl font-bold text-[#0A1128] mb-1">{parentsList.length}</p><p className="text-[10px] text-gray-400">Registered parents</p></div><span className="text-blue-500 text-lg">👥</span>
            </div>
            <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm flex justify-between items-start">
              <div><p className="text-gray-500 text-xs font-bold mb-1">Total Students</p><p className="text-3xl font-bold text-[#0A1128] mb-1">{studentsList.length}</p><p className="text-[10px] text-gray-400">Active enrollments</p></div><span className="text-green-500 text-lg">🎓</span>
            </div>
            <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm flex justify-between items-start">
              <div><p className="text-gray-500 text-xs font-bold mb-1">Announcements</p><p className="text-3xl font-bold text-[#0A1128] mb-1">{announcementsList.length}</p><p className="text-[10px] text-gray-400">Published globally</p></div><span className="text-purple-500 text-lg">📢</span>
            </div>
            <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm flex justify-between items-start">
              <div><p className="text-gray-500 text-xs font-bold mb-1">Staff Members</p><p className="text-3xl font-bold text-[#0A1128] mb-1">{staffList.length}</p><p className="text-[10px] text-gray-400">Teachers & Admins</p></div><span className="text-orange-500 text-lg">👨‍🏫</span>
            </div>
          </div>

          <div className="flex space-x-2 bg-gray-100 p-1.5 rounded-xl w-max mb-8 shrink-0">
            {['parents', 'students', 'staff', 'announcements', 'communications'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all capitalize cursor-pointer ${activeTab === tab ? 'bg-white text-[#0A1128] shadow-sm' : 'text-gray-500 hover:text-[#0A1128]'}`}>
                {tab}
              </button>
            ))}
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
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl animate-fade-in-up flex flex-col overflow-hidden border border-gray-100 text-left">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
              <div>
                <h2 className="text-xl font-bold text-[#0A1128] mb-1">Add New Parent</h2>
                <p className="text-xs text-gray-500">System Information</p>
              </div>
              <button onClick={() => setModalView(null)} className="text-gray-400 hover:text-black text-xl cursor-pointer">✕</button>
            </div>
            <div className="p-8 text-center">
              <span className="text-5xl mb-4 block">ℹ️</span>
              <h3 className="text-lg font-bold text-[#0A1128] mb-2">Automated Parent Profiles</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-8">
                Parent profiles are automatically created and synced when a new student is registered via the "Students Management" tab. You don't need to add them manually here.
              </p>
              <button onClick={handleAddParentMock} className="w-full bg-[#0A1128] hover:bg-gray-800 text-white py-3.5 rounded-xl font-bold text-sm shadow-sm transition-colors cursor-pointer">
                Understood
              </button>
            </div>
          </div>
        </div>
      )}

      {modalView === 'newAnnouncement' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl animate-fade-in-up flex flex-col overflow-hidden border border-gray-100 text-left">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
              <div>
                <h2 className="text-xl font-bold text-[#0A1128] mb-1">Create New Announcement</h2>
                <p className="text-xs text-gray-500">Share important information globally</p>
              </div>
              <button onClick={() => setModalView(null)} className="text-gray-400 hover:text-black text-xl cursor-pointer">✕</button>
            </div>
            <div className="p-8 overflow-y-auto custom-scrollbar">
              <form className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Title</label>
                  <input type="text" onChange={(e) => setAnnouncementForm({...announcementForm, title: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 outline-none text-sm font-bold text-[#0A1128] focus:border-blue-500" placeholder="e.g. End of term exams" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Content</label>
                  <textarea rows="4" onChange={(e) => setAnnouncementForm({...announcementForm, content: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 outline-none text-sm text-[#0A1128] focus:border-blue-500 resize-none" placeholder="Write your announcement here..."></textarea>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Target Audience</label>
                    <select onChange={(e) => setAnnouncementForm({...announcementForm, audience: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 outline-none text-sm font-bold text-[#0A1128] focus:border-blue-500 cursor-pointer">
                      <option value="All">Everyone (Public)</option>
                      <option value="Students">Students Only</option>
                      <option value="Parents">Parents Only</option>
                      <option value="Staff">Staff Only</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Priority</label>
                    <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 outline-none text-sm font-bold text-[#0A1128] focus:border-blue-500 cursor-pointer">
                      <option>Normal</option>
                      <option>High 🚨</option>
                    </select>
                  </div>
                </div>
                <div className="pt-4">
                  <button type="button" onClick={handlePublishAnnouncement} className="w-full bg-[#2563eb] hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold text-sm shadow-sm transition-colors cursor-pointer">
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
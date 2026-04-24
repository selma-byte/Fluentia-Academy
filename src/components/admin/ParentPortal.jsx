import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient'; 

// ==========================================
// 🔔 MODERN NOTIFICATION COMPONENT
// ==========================================
const Toast = ({ message, onClose }) => (
  <div className="fixed bottom-12 right-12 z-[250] animate-in slide-in-from-right duration-500 text-left">
    <div className="bg-[#1A2252] text-white px-10 py-6 rounded-[2.5rem] shadow-2xl flex items-center gap-6 border border-blue-400/30 backdrop-blur-xl min-w-[400px]">
      <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-blue-500/40 animate-pulse">✨</div>
      <div className="flex-1">
        <p className="text-lg font-black italic tracking-tight leading-none mb-1">System Update</p>
        <p className="text-sm font-bold text-blue-200/80 italic">{message}</p>
      </div>
      <button onClick={onClose} className="ml-6 text-white/30 hover:text-white transition-colors text-2xl p-2 cursor-pointer">✕</button>
    </div>
  </div>
);

const ParentPortal = () => {
  const [chatMessages, setChatMessages] = useState([]);
  const [recentComms, setRecentComms] = useState([]); 
  const [announcements, setAnnouncements] = useState([]); 
  const [mainView, setMainView] = useState('portal'); 
  const [activeTab, setActiveTab] = useState('parents'); 
  const [modalView, setModalView] = useState(null); 
  const [chatType, setChatType] = useState(null);
  const [newMessage, setNewMessage] = useState(''); 
  const [selectedRecipient, setSelectedRecipient] = useState(null); 
  
  const [studentsList, setStudentsList] = useState([]); 
  const [staffList, setStaffList] = useState([]); 
  const [parentsList, setParentsList] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); 

  const [toast, setToast] = useState(null);
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4500);
  };

  const [announcementForm, setAnnouncementForm] = useState({ title: '', content: '', priority: 'Medium' });
  const [notificationForm, setNotificationForm] = useState({ title: '', content: '' });
  
  const [parentForm, setParentForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', address: '', occupation: '', relationship: 'Select relationship', emergency: false
  });

  const [selectedAudiences, setSelectedAudiences] = useState({
    all: true, students: false, parents: false, staff: false, teacher: false, admin: false
  });

  // ==========================================
  // 💡 FETCH DATA (Unified ID Logic)
  // ==========================================
  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.email) {
        const { data: staffData } = await supabase.from('staff').select('*').eq('email', user.email).single();
        if (staffData) {
          setCurrentUser(staffData);
        } else {
          setCurrentUser(user);
        }
      }

      const { data: sData } = await supabase.from('staff').select('*');
      if (sData) setStaffList(sData);

      const { data: stData } = await supabase.from('students').select('*');
      if (stData) {
        setStudentsList(stData.filter(s => s.exam_type !== 'Parent_Account')); 
        
        // Extract Parents Automatically
        const parentsMap = {};
        stData.forEach(s => {
          if (s.parent_email) {
            if (!parentsMap[s.parent_email]) {
              parentsMap[s.parent_email] = {
                email: s.parent_email,
                name: s.parent_name || `${s.first_name} ${s.last_name}`,
                phone: s.parent_contact || s.phone,
                kids: []
              };
            }
            if (s.exam_type !== 'Parent_Account') {
              parentsMap[s.parent_email].kids.push(`${s.first_name} (${s.level || '-'})`);
            }
          }
        });
        setParentsList(Object.values(parentsMap));
      }

      const { data: annData } = await supabase.from('communications').select('*').eq('type', 'announcement').order('created_at', { ascending: false });
      if (annData) setAnnouncements(annData);

      const { data: commData } = await supabase.from('communications').select('*').neq('type', 'announcement').order('created_at', { ascending: false }).limit(6);
      if (commData) setRecentComms(commData);

      const { data: msgData } = await supabase.from('communications').select('*').order('created_at', { ascending: true });
      if (msgData) setChatMessages(msgData);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ==========================================
  // HANDLERS
  // ==========================================
  const handleAudienceChange = (audience) => {
    if (audience === 'all') {
      setSelectedAudiences({ all: true, students: false, parents: false, staff: false, teacher: false, admin: false });
    } else {
      setSelectedAudiences(prev => {
        const newState = { ...prev, [audience]: !prev[audience], all: false };
        if (!Object.values(newState).some(v => v)) newState.all = true;
        return newState;
      });
    }
  };

  const getTargetAudienceString = () => {
    const selectedGroups = [];
    if (selectedAudiences.students) selectedGroups.push('students');
    if (selectedAudiences.teacher) selectedGroups.push('teachers');
    if (selectedAudiences.parents) selectedGroups.push('parents');
    if (selectedAudiences.staff) selectedGroups.push('staff');
    return selectedGroups.length > 0 ? selectedGroups.join(', ') : 'All Community';
  };

  const handlePublishAnnouncement = async () => {
    if (!announcementForm.title || !announcementForm.content) return showToast("⚠️ Please fill title and content");

    const targetAudience = getTargetAudienceString();

    const { error } = await supabase.from('communications').insert([{
      subject: announcementForm.title,
      content: announcementForm.content,
      type: 'announcement', 
      recipient_name: targetAudience, 
      recipient_id: 'all', 
      sender_id: currentUser?.id,
      sender_role: 'admin'
    }]);

    if (!error) {
      showToast("✅ Announcement Published Successfully!");
      setModalView(null);
      setAnnouncementForm({ title: '', content: '', priority: 'Medium' }); 
      fetchData(); 
    } else {
      showToast("❌ Error publishing announcement!");
      console.error(error);
    }
  };

  const handleSendNotification = async () => {
    if (!notificationForm.title || !notificationForm.content) return showToast("⚠️ Please fill title and content");

    const targetAudience = getTargetAudienceString();

    const { error } = await supabase.from('communications').insert([{
      subject: notificationForm.title,
      content: notificationForm.content,
      type: 'notification', 
      recipient_name: targetAudience, 
      recipient_id: 'all', 
      sender_id: currentUser?.id,
      sender_role: 'admin'
    }]);

    if (!error) {
      showToast("🔔 Notification Sent Successfully!");
      setModalView(null);
      setNotificationForm({ title: '', content: '' }); 
      fetchData(); 
    } else {
      showToast("❌ Error sending notification!");
      console.error(error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentUser) return;
    const messageData = {
      content: newMessage,
      type: chatType,
      recipient_name: selectedRecipient?.name || 'Group Message',
      recipient_id: selectedRecipient?.id?.toString() || 'all',
      sender_id: currentUser.id,
      sender_role: 'admin'
    };
    const { error } = await supabase.from('communications').insert([messageData]);
    if (!error) {
      setNewMessage('');
      fetchData(); 
    }
  };

  const handleAddParent = async (e) => {
    e.preventDefault();
    try {
      const { error: authError } = await supabase.auth.signUp({ email: parentForm.email, password: parentForm.phone });
      if (authError && authError.message !== "User already registered") throw authError;

      const { error: dbError } = await supabase.from('students').insert([{
        first_name: parentForm.firstName, last_name: parentForm.lastName, email: parentForm.email, phone: parentForm.phone,
        parent_email: parentForm.email, parent_name: `${parentForm.firstName} ${parentForm.lastName}`, parent_contact: parentForm.phone,
        exam_type: 'Parent_Account', status: 'Active', enrollment_date: new Date().toISOString().split('T')[0]
      }]);

      if (dbError) throw dbError;
      showToast(`🎉 Parent ${parentForm.firstName} added successfully!`);
      setModalView(null);
      setParentForm({ firstName: '', lastName: '', email: '', phone: '', address: '', occupation: '', relationship: 'Select relationship', emergency: false });
      fetchData(); 
    } catch (err) {
      showToast("❌ Error: " + err.message);
    }
  };

  // ==========================================
  // RENDER SECTIONS
  // ==========================================

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
        <input type="text" placeholder="Search parents by name or student..." className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 shadow-sm" />
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
                  <button onClick={() => { setMainView('chat'); setChatType('parent'); setSelectedRecipient({ id: parent.email, name: parent.name, role: 'Parent', email: parent.email, phone: parent.phone }); }} className="text-gray-400 hover:text-blue-600 text-lg transition-colors cursor-pointer">💬</button>
                </td>
              </tr>
            )) : <tr><td colSpan="5" className="py-12 text-center text-gray-400 font-bold">No parents found. Register students to auto-generate parents.</td></tr>}
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
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {studentsList.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="py-4 px-6 font-bold text-[#0A1128]">{student.first_name} {student.last_name}</td>
                <td className="py-4 px-6 text-xs text-gray-600 space-y-1">
                  <p>✉️ {student.email}</p>
                  <p>📱 {student.phone}</p>
                </td>
                <td className="py-4 px-6 font-bold text-[#0A1128]">{student.language || 'N/A'} ({student.level || '-'})</td>
                <td className="py-4 px-6 text-gray-600">{student.group_name || 'No Group'}</td>
                <td className="py-4 px-6">
                  <span className="text-green-600 font-bold flex items-center">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>Active
                  </span>
                </td>
                <td className="py-4 px-6 text-center space-x-4">
                  <button onClick={() => { 
                      setMainView('chat'); 
                      setChatType('student_individual'); 
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
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {staffList.map((staff) => (
              <tr key={staff.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="py-4 px-6">
                  <p className="font-bold text-[#0A1128]">{staff.first_name} {staff.last_name}</p>
                  <p className="text-xs text-gray-500">{staff.role}</p>
                </td>
                <td className="py-4 px-6 text-xs text-gray-600 space-y-1">
                  <p className="flex items-center"><span className="mr-2">✉️</span> {staff.email}</p>
                  <p className="flex items-center"><span className="mr-2">📞</span> {staff.phone}</p>
                </td>
                <td className="py-4 px-6 text-gray-600 font-bold">{staff.role}</td>
                <td className="py-4 px-6 text-gray-600">{staff.department || 'General'}</td>
                <td className="py-4 px-6"><span className="text-green-600 font-bold flex items-center"><span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>Active</span></td>
                <td className="py-4 px-6 text-center space-x-4">
                  <button 
                    onClick={() => {  setMainView('chat'); 
                    setChatType('staff_individual'); 
                    setSelectedRecipient({ id: staff.id, name: `${staff.first_name} ${staff.last_name}`, role: staff.role, email: staff.email, phone: staff.phone, dept: staff.department }); 
                   }} 
                   className="text-gray-400 hover:text-blue-600 text-lg transition-colors cursor-pointer"
                  >
                  💬
                  </button>
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
        {announcements.map((ann) => (
          <div key={ann.id} className="bg-[#fff7ed] border border-[#ffedd5] rounded-2xl p-6 flex shadow-sm relative overflow-hidden animate-fade-in">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-orange-400"></div>
            <div className="flex-1 pl-2">
              <div className="flex items-center mb-2">
                <span className="text-orange-500 mr-2">📌</span>
                <h4 className="font-bold text-orange-900 text-base">{ann.subject || "No Title"}</h4>
                <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-[10px] font-bold ml-4">Announcement</span>
              </div>
              <p className="text-sm text-orange-800/80 mb-4 leading-relaxed whitespace-pre-wrap">{ann.content}</p>
              <p className="text-xs text-orange-600/70">Published by Admin • {new Date(ann.created_at).toLocaleDateString()}</p>
            </div>
            <div className="flex flex-col justify-between items-end">
              <div className="flex space-x-2 text-orange-400">
                <button onClick={async () => {
                  if(window.confirm("Delete this announcement?")) {
                    await supabase.from('communications').delete().eq('id', ann.id);
                    fetchData();
                  }
                }} className="hover:text-red-600 cursor-pointer">🗑</button>
              </div>
              <div className="flex space-x-2"><span className="bg-white/50 text-orange-800 border border-orange-200 px-3 py-1 rounded-lg text-xs font-bold">{ann.recipient_name || 'All'}</span></div>
            </div>
          </div>
        ))}
        {announcements.length === 0 && <div className="text-center py-20 text-gray-400 font-bold">No announcements published yet.</div>}
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
              <span className="mr-2">💬</span> Send Message
            </button>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h4 className="font-bold text-[#0A1128] text-base mb-4">Bulk Communications</h4>
          <div className="space-y-3">
            <button onClick={() => { setMainView('chat'); setChatType('staff'); setSelectedRecipient(null); }} className="w-full bg-gray-50 hover:bg-gray-100 text-[#0A1128] border border-gray-200 font-bold text-sm py-3.5 rounded-xl transition-colors flex items-center justify-center cursor-pointer">
              <span className="mr-2 text-gray-500">👨‍🏫</span> Send to Staff
            </button>
            <button onClick={() => setModalView('newNotification')} className="w-full bg-purple-50 hover:bg-purple-100 text-purple-600 border border-purple-200 font-bold text-sm py-3.5 rounded-xl transition-colors flex items-center justify-center cursor-pointer">
              <span className="mr-2 text-lg">🔔</span> Send Notification
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h4 className="font-bold text-[#0A1128] text-base mb-4 shrink-0">Recent Communications</h4>
        <div className="overflow-y-auto custom-scrollbar flex-1">
          <table className="w-full text-left text-sm">
            <tbody className="divide-y divide-gray-100">
              {recentComms.map((comm) => (
                <tr key={comm.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-2">
                    <p className="font-bold text-[#0A1128] truncate max-w-xs">{comm.subject || comm.content}</p>
                    <p className="text-[10px] text-gray-500 capitalize">To: {comm.recipient_name} • Type: {comm.type}</p>
                  </td>
                  <td className="py-4 px-2 text-right text-xs text-gray-400 font-medium">
                    {new Date(comm.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
              {recentComms.length === 0 && <tr><td className="py-10 text-center text-gray-400">No recent communications</td></tr>}
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
              <input type="checkbox" checked={selectedAudiences.all} onChange={() => handleAudienceChange('all')} className="w-4 h-4 text-blue-600 rounded border-gray-300 cursor-pointer" />
              <span className="ml-2 text-sm font-bold text-[#0A1128]">All</span>
            </label>
            {chatType === 'smart' && (
              <>
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" checked={selectedAudiences.students} onChange={() => handleAudienceChange('students')} className="w-4 h-4 text-blue-600 rounded border-gray-300 cursor-pointer" />
                  <span className="ml-2 text-sm font-bold text-[#0A1128]">Students</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" checked={selectedAudiences.parents} onChange={() => handleAudienceChange('parents')} className="w-4 h-4 text-blue-600 rounded border-gray-300 cursor-pointer" />
                  <span className="ml-2 text-sm font-bold text-[#0A1128]">Parents</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" checked={selectedAudiences.staff} onChange={() => handleAudienceChange('staff')} className="w-4 h-4 text-blue-600 rounded border-gray-300 cursor-pointer" />
                  <span className="ml-2 text-sm font-bold text-[#0A1128]">Staff</span>
                </label>
              </>
            )}
            {chatType === 'staff' && (
              <>
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" checked={selectedAudiences.teacher} onChange={() => handleAudienceChange('teacher')} className="w-4 h-4 text-blue-600 rounded border-gray-300 cursor-pointer" />
                  <span className="ml-2 text-sm font-bold text-[#0A1128]">Teachers</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" checked={selectedAudiences.admin} onChange={() => handleAudienceChange('admin')} className="w-4 h-4 text-blue-600 rounded border-gray-300 cursor-pointer" />
                  <span className="ml-2 text-sm font-bold text-[#0A1128]">Admins</span>
                </label>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderChatView = () => {
    let chatTitle = 'Chat View';
    let isBulkChat = false;

    if (chatType === 'parent' || chatType === 'student' || chatType === 'staff_individual' || chatType === 'student_individual') {
      chatTitle = selectedRecipient?.name || 'User';
    } else if (chatType === 'smart') {
      chatTitle = 'Send Smart Message';
      isBulkChat = true;
    } else if (chatType === 'staff') {
      chatTitle = 'Sending to All School Staff';
      isBulkChat = true;
    }

    const displayMessages = chatMessages.filter(msg => {
      if (selectedRecipient && currentUser) {
        const myId = currentUser.id;
        const theirId = selectedRecipient.id.toString();
        if (myId === theirId) return msg.sender_id === myId || msg.recipient_id === myId;
        return (msg.sender_id === myId && msg.recipient_id === theirId) || (msg.sender_id === theirId && msg.recipient_id === myId);
      }
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
            <div>
             <h3 className="font-bold text-[#0A1128] text-base">{chatTitle}</h3>
             <p className="text-xs text-green-600 font-medium">Online</p>
            </div>
          </div>
        </div>

        <div className="flex flex-1 min-h-0 relative">
          <div className={`flex-1 flex flex-col bg-[#f8fafc] relative ${isBulkChat ? 'col-span-2' : ''}`}>
            
            {(chatType === 'smart' || chatType === 'staff') && <FilterSection />}

            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar flex flex-col">
              {displayMessages.length > 0 ? (
                displayMessages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender_id === currentUser?.id ? 'items-end justify-end' : 'items-start justify-start'} space-x-2`}>
                    <div className={`${msg.sender_id === currentUser?.id ? 'bg-[#2563eb] text-white rounded-br-sm' : 'bg-white border text-[#0A1128] rounded-bl-sm'} p-4 rounded-2xl max-w-md shadow-sm`}>
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                      <span className={`text-[10px] ${msg.sender_id === currentUser?.id ? 'text-blue-200' : 'text-gray-400'} mt-2 block text-right`}>
                        {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} ✓✓
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full flex-1 text-gray-400 opacity-70">
                  {chatType === 'smart' && <><span className="text-5xl mb-4">💬</span><p className="text-sm font-bold text-gray-500">Select filters above and type your message to broadcast.</p></>}
                  {chatType === 'staff' && <><span className="text-5xl mb-4">👨‍🏫</span><p className="text-sm font-bold text-gray-500">Select audience above and type your message to send to staff.</p></>}
                  {(chatType !== 'smart' && chatType !== 'staff') && <p className="text-sm italic">No messages yet. Start the conversation!</p>}
                </div>
              )}
            </div>

            <div className="p-4 bg-white border-t border-gray-200 shrink-0 m-4 rounded-2xl shadow-sm flex items-center relative z-20">
              <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={(e)=> e.key === 'Enter' && handleSendMessage()} placeholder="Type your message here..." className="flex-1 bg-transparent px-4 outline-none text-sm font-medium text-gray-700" />
              <button onClick={handleSendMessage} className="bg-[#2563eb] hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center shadow-sm transition-colors cursor-pointer">
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
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center">📄 Contact Info</h4>
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
    <div className="animate-fade-in w-full h-full flex flex-col relative pt-12 text-[#0A1128]">
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      
      {mainView === 'portal' && (
        <div className="w-full h-full flex flex-col">
          <div className="mb-6 shrink-0 border-b border-gray-200 pb-4 text-left">
            <h2 className="text-3xl font-bold text-[#0A1128] mb-1">Communication Portal</h2>
            <p className="text-sm text-gray-500">Manage directories and school updates</p>
          </div>

          <div className="grid grid-cols-4 gap-6 mb-8 shrink-0 text-left">
            <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm flex justify-between items-start">
              <div><p className="text-gray-500 text-xs font-bold mb-1 uppercase tracking-widest">Total Students</p><p className="text-3xl font-bold text-[#0A1128] mb-1">{studentsList.length}</p></div><span className="text-blue-500 text-lg">👥</span>
            </div>
            <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm flex justify-between items-start">
              <div><p className="text-gray-500 text-xs font-bold mb-1 uppercase tracking-widest">Staff Members</p><p className="text-3xl font-bold text-[#0A1128] mb-1">{staffList.length}</p></div><span className="text-green-500 text-lg">👨‍🏫</span>
            </div>
            <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm flex justify-between items-start">
              <div><p className="text-gray-500 text-xs font-bold mb-1 uppercase tracking-widest">Broadcasts</p><p className="text-3xl font-bold text-blue-600 mb-1">{announcements.length}</p></div><span className="text-orange-500 text-lg">📢</span>
            </div>
            <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm flex justify-between items-start">
              <div><p className="text-gray-500 text-xs font-bold mb-1 uppercase tracking-widest">Portal Status</p><p className="text-3xl font-bold text-green-600 mb-1">Active</p></div><span className="text-green-400 text-lg">●</span>
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-100 text-left">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
              <div>
                <h2 className="text-xl font-bold text-[#0A1128] mb-1">Add New Parent/Guardian</h2>
                <p className="text-xs text-gray-500">Enter parent or guardian information for institute</p>
              </div>
              <button onClick={() => setModalView(null)} className="text-gray-400 hover:text-black text-xl cursor-pointer">✕</button>
            </div>
            <div className="p-8 overflow-y-auto custom-scrollbar">
              <form onSubmit={handleAddParent} className="space-y-5">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">First Name</label>
                    <input type="text" value={parentForm.firstName} onChange={(e) => setParentForm({...parentForm, firstName: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none text-sm focus:border-blue-500" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Last Name</label>
                    <input type="text" value={parentForm.lastName} onChange={(e) => setParentForm({...parentForm, lastName: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none text-sm focus:border-blue-500" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Email</label>
                    <input type="email" value={parentForm.email} onChange={(e) => setParentForm({...parentForm, email: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none text-sm focus:border-blue-500" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Phone</label>
                    <input type="tel" value={parentForm.phone} onChange={(e) => setParentForm({...parentForm, phone: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none text-sm focus:border-blue-500" required />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Address</label>
                  <input type="text" value={parentForm.address} onChange={(e) => setParentForm({...parentForm, address: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none text-sm focus:border-blue-500" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Relationship</label>
                    <select value={parentForm.relationship} onChange={(e) => setParentForm({...parentForm, relationship: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none text-sm focus:border-blue-500 cursor-pointer">
                      <option>Select relationship</option><option>Father</option><option>Mother</option><option>Guardian</option>
                    </select>
                  </div>
                </div>
                <div className="pt-4">
                  <button type="submit" className="w-full bg-[#2563eb] hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold text-sm shadow-sm transition-colors cursor-pointer">
                    Add Parent
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {modalView === 'newAnnouncement' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-100 text-left">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
              <div>
                <h2 className="text-xl font-bold text-[#0A1128] mb-1">Create New Announcement</h2>
                <p className="text-xs text-gray-500">Share important information with school community</p>
              </div>
              <button onClick={() => setModalView(null)} className="text-gray-400 hover:text-black text-xl cursor-pointer">✕</button>
            </div>
            <div className="p-8 overflow-y-auto custom-scrollbar">
              <form className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Title</label>
                  <input type="text" onChange={(e) => setAnnouncementForm({...announcementForm, title: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 outline-none text-sm focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Content</label>
                  <textarea rows="4" onChange={(e) => setAnnouncementForm({...announcementForm, content: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 outline-none text-sm focus:border-blue-500 resize-none"></textarea>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Target Audience</label>
                  <div className="flex space-x-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <label className="flex items-center cursor-pointer"><input type="checkbox" checked={selectedAudiences.students} onChange={() => handleAudienceChange('students')} className="w-4 h-4 text-blue-600 rounded cursor-pointer" /><span className="ml-2 text-sm font-bold text-[#0A1128]">Students</span></label>
                    <label className="flex items-center cursor-pointer"><input type="checkbox" checked={selectedAudiences.teacher} onChange={() => handleAudienceChange('teacher')} className="w-4 h-4 text-blue-600 rounded cursor-pointer" /><span className="ml-2 text-sm font-bold text-[#0A1128]">Teachers</span></label>
                    <label className="flex items-center cursor-pointer"><input type="checkbox" checked={selectedAudiences.parents} onChange={() => handleAudienceChange('parents')} className="w-4 h-4 text-blue-600 rounded cursor-pointer" /><span className="ml-2 text-sm font-bold text-[#0A1128]">Parents</span></label>
                    <label className="flex items-center cursor-pointer"><input type="checkbox" checked={selectedAudiences.staff} onChange={() => handleAudienceChange('staff')} className="w-4 h-4 text-blue-600 rounded cursor-pointer" /><span className="ml-2 text-sm font-bold text-[#0A1128]">Staff</span></label>
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

      {modalView === 'newNotification' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-100 text-left">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-purple-50">
              <div>
                <h2 className="text-xl font-bold text-purple-900 mb-1">Send Notification 🔔</h2>
                <p className="text-xs text-purple-600/70">Send an instant alert to specific groups or everyone</p>
              </div>
              <button onClick={() => setModalView(null)} className="text-gray-400 hover:text-black text-xl cursor-pointer">✕</button>
            </div>
            <div className="p-8 overflow-y-auto custom-scrollbar">
              <form className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Notification Title</label>
                  <input type="text" onChange={(e) => setNotificationForm({...notificationForm, title: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 outline-none text-sm focus:border-purple-500" placeholder="e.g. Urgent: Class Rescheduled" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Message Content</label>
                  <textarea rows="4" onChange={(e) => setNotificationForm({...notificationForm, content: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 outline-none text-sm focus:border-purple-500 resize-none" placeholder="Type your notification here..."></textarea>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Send To (Target Audience)</label>
                  <div className="flex space-x-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <label className="flex items-center cursor-pointer"><input type="checkbox" checked={selectedAudiences.students} onChange={() => handleAudienceChange('students')} className="w-4 h-4 text-purple-600 rounded cursor-pointer" /><span className="ml-2 text-sm font-bold text-[#0A1128]">Students</span></label>
                    <label className="flex items-center cursor-pointer"><input type="checkbox" checked={selectedAudiences.teacher} onChange={() => handleAudienceChange('teacher')} className="w-4 h-4 text-purple-600 rounded cursor-pointer" /><span className="ml-2 text-sm font-bold text-[#0A1128]">Teachers</span></label>
                    <label className="flex items-center cursor-pointer"><input type="checkbox" checked={selectedAudiences.parents} onChange={() => handleAudienceChange('parents')} className="w-4 h-4 text-purple-600 rounded cursor-pointer" /><span className="ml-2 text-sm font-bold text-[#0A1128]">Parents</span></label>
                    <label className="flex items-center cursor-pointer"><input type="checkbox" checked={selectedAudiences.staff} onChange={() => handleAudienceChange('staff')} className="w-4 h-4 text-purple-600 rounded cursor-pointer" /><span className="ml-2 text-sm font-bold text-[#0A1128]">Staff</span></label>
                  </div>
                </div>
                <div className="pt-4">
                  <button type="button" onClick={handleSendNotification} className="w-full bg-[#9333ea] hover:bg-purple-700 text-white py-3.5 rounded-xl font-bold text-sm shadow-sm transition-colors cursor-pointer">
                    Send Notification Now
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
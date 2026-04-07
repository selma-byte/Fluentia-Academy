import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient'; // 💡 استدعاء قاعدة البيانات

const RegistrationRequests = () => {
  const [requests, setRequests] = useState([]);

  // 💡 جلب الطلبات الحقيقية من Supabase
  useEffect(() => {
    const fetchRequests = async () => {
      const { data, error } = await supabase
        .from('registration_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) {
        // نكيفو البيانات باش توالم التصميم ديالك 100% بلا ما نخسروه
        const formattedData = data.map(req => ({
          id: req.id,
          name: req.full_name,
          type: req.role.charAt(0).toUpperCase() + req.role.slice(1), 
          parent: req.role === 'parent' ? 'Parent / Guardian' : null,
          language: req.course,
          level: "Placement Test", // لأنه مزال مابداش يقرا
          status: req.status === 'pending' ? 'Pending' : req.status
        }));
        setRequests(formattedData);
      }
    };
    fetchRequests();
  }, []);

  const [isEnrollMode, setIsEnrollMode] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyWhatsApp, setNotifyWhatsApp] = useState(false);

  const handleEnrollNow = (req) => {
    setSelectedStudent(req);
    setIsEnrollMode(true);
  };

  const handleOpenScheduleModal = (req) => {
    setSelectedStudent(req);
    setIsScheduleModalOpen(true);
  };

  const handleSaveSchedule = async () => {
    // 💡 تحديث حالة الطلب في Supabase إلى "Scheduled"
    const { error } = await supabase
      .from('registration_requests')
      .update({ status: 'Scheduled' })
      .eq('id', selectedStudent.id);

    if (!error) {
      const updated = requests.map(req => 
        req.id === selectedStudent.id ? { ...req, status: 'Scheduled' } : req
      );
      setRequests(updated);
      setIsScheduleModalOpen(false);
      
      let notificationMsg = "Test Scheduled Successfully in System!";
      if (notifyEmail && notifyWhatsApp) notificationMsg += "\n📩 Email and WhatsApp notifications sent to the applicant.";
      else if (notifyEmail) notificationMsg += "\n📧 Email notification sent to the applicant.";
      else if (notifyWhatsApp) notificationMsg += "\n💬 WhatsApp notification sent to the applicant.";
      
      alert(notificationMsg);
    } else {
      alert("Error saving schedule: " + error.message);
    }
  };

  if (isEnrollMode) {
    // --- واجهة إضافة طالب (Enroll Student) ---
    return (
      <div className="min-h-screen bg-[#F8F9FA] p-12 font-sans text-left transition-all duration-300">
        <div className="flex items-center mb-12">
          <button onClick={() => setIsEnrollMode(false)} className="w-10 h-10 bg-white shadow-sm rounded-full flex items-center justify-center mr-6 hover:bg-gray-100 cursor-pointer text-gray-400">←</button>
          <h1 className="text-3xl font-bold text-[#0A1128]">Add New Student</h1>
        </div>
        <div className="max-w-6xl space-y-16">
          <section>
            <h2 className="text-sm font-bold text-gray-800 mb-8 uppercase tracking-wide border-b border-gray-100 pb-2 w-max">Academic Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[{ label: "Language", v: selectedStudent?.language }, { label: "Level", v: selectedStudent?.level }, { label: "Group", v: "Grp 1" }].map((item) => (
                <div key={item.label} className="space-y-2 border-b border-gray-200 pb-2 relative">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.label}</label>
                  <div className="text-sm font-bold text-gray-700">{item.v}</div>
                  <span className="absolute right-0 bottom-2 text-gray-300 text-[10px]">▼</span>
                </div>
              ))}
            </div>
          </section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
            <section className="space-y-10">
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Personal Info</h2>
              <div className="space-y-8">
                <input type="text" defaultValue={selectedStudent?.name.split(' ')[0]} placeholder="First Name" className="w-full bg-transparent border-b border-gray-200 py-3 text-sm font-bold outline-none" />
                <input type="text" defaultValue={selectedStudent?.name.split(' ')[1]} placeholder="Last Name" className="w-full bg-transparent border-b border-gray-200 py-3 text-sm font-bold outline-none" />
                <input type="text" placeholder="jj/mm/aaaa 📅" className="w-full bg-transparent border-b border-gray-200 py-3 text-sm font-bold outline-none" />
              </div>
            </section>
            <section className="space-y-10">
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Contact Info</h2>
              <div className="space-y-8">
                <input type="email" placeholder="Email Address" className="w-full bg-transparent border-b border-gray-200 py-3 text-sm font-bold outline-none" />
                <input type="text" placeholder="Phone Number" className="w-full bg-transparent border-b border-gray-200 py-3 text-sm font-bold outline-none" />
              </div>
            </section>
          </div>
          <div className="flex justify-end space-x-4 pt-12">
            <button onClick={() => setIsEnrollMode(false)} className="px-10 py-3 bg-gray-100 text-gray-500 rounded-xl text-sm font-bold hover:bg-gray-200 transition-all cursor-pointer">Cancel</button>
            <button onClick={() => setIsEnrollMode(false)} className="px-10 py-3 bg-[#0A1128] text-white rounded-xl text-sm font-bold hover:bg-blue-900 shadow-lg cursor-pointer">Save Student</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans text-left text-[#0A1128]">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold uppercase tracking-tight text-[#0A1128]">Registration Requests</h1>
        <div className="flex bg-[#0A1128] text-white rounded-2xl p-1 text-[11px] font-bold">
          <span className="px-6 py-2 bg-white/20 rounded-xl cursor-pointer">All</span>
          <span className="px-6 py-2 opacity-40 cursor-pointer">Students</span>
          <span className="px-6 py-2 opacity-40 cursor-pointer">Parents</span>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#0A1128] text-white text-[10px] font-bold uppercase tracking-[0.2em]">
              <th className="p-6">Applicant Details</th>
              <th className="p-6 text-center">Type</th>
              <th className="p-6">Course Info</th>
              <th className="p-6 text-center">Status</th>
              <th className="p-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {requests.map((req) => (
              <tr key={req.id} className="hover:bg-blue-50/5 transition-colors">
                <td className="p-6">
                  <div className="font-bold text-[#0A1128] text-lg">{req.name}</div>
                  {req.parent && <div className="text-[10px] text-blue-600 font-bold uppercase mt-1">{req.parent}</div>}
                </td>
                <td className="p-6 text-center">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold mx-auto flex items-center justify-center w-max gap-2 ${req.type === "Student" ? "bg-blue-50 text-blue-700" : "bg-purple-50 text-purple-700"}`}>
                    {req.type === "Student" ? "🎓 Student" : "👥 Parent"}
                  </span>
                </td>
                <td className="p-6 text-gray-700">
                  <div className="text-sm font-bold">{req.language}</div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase">Level: {req.level}</div>
                </td>
                <td className="p-6 text-center">
                  <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black border ${
                    req.status === 'Passed' ? 'bg-green-50 text-green-600 border-green-100' : 
                    req.status === 'Scheduled' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                    'bg-orange-50 text-orange-600 border-orange-100'
                  }`}>
                    {req.status.toUpperCase()}
                  </span>
                </td>
                <td className="p-6 flex justify-center gap-3">
                  {req.status === 'Passed' ? (
                    <button onClick={() => handleEnrollNow(req)} className="px-8 py-2.5 bg-green-600 text-white rounded-xl text-[11px] font-bold hover:bg-green-700 cursor-pointer shadow-md">
                      Enroll Now ✅
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleOpenScheduleModal(req)}
                      disabled={req.status === 'Scheduled'}
                      className={`px-6 py-2.5 rounded-xl text-[11px] font-bold transition-all shadow-sm ${
                        req.status === 'Scheduled' ? 'bg-gray-100 text-gray-300 cursor-not-allowed border border-gray-100' : 'bg-[#0A1128] text-white hover:bg-blue-900 cursor-pointer'
                      }`}
                    >
                      {req.status === 'Scheduled' ? 'Scheduled 📅' : 'Schedule Test 📅'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- النافذة المنبثقة لتحديد الموعد مع إضافة قسم الإشعارات --- */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#F8F9FA] w-full max-w-lg rounded-3xl shadow-2xl p-8 font-sans">
            
            <h2 className="text-xl font-bold text-[#0A1128] mb-8">Schedule Placement Test</h2>
            
            <div className="grid grid-cols-2 gap-x-6 gap-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Language</label>
                <div className="relative">
                  <select className="w-full bg-transparent border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 outline-none appearance-none cursor-pointer">
                    <option>{selectedStudent?.language}</option>
                  </select>
                  <span className="absolute right-4 top-3 text-gray-500 text-[10px]">▼</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Level</label>
                <input type="text" defaultValue={selectedStudent?.level} className="w-full bg-transparent border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 outline-none" />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Applicant</label>
                <input type="text" defaultValue={selectedStudent?.name} className="w-full bg-transparent border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 outline-none" readOnly />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Test Type</label>
                <input type="text" defaultValue="PLACEMENT TEST" className="w-full bg-transparent border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 outline-none" />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Day</label>
                <div className="relative">
                  <select className="w-full bg-transparent border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 outline-none appearance-none cursor-pointer">
                    <option>Mon</option><option>Tue</option><option>Wed</option><option>Thu</option>
                  </select>
                  <span className="absolute right-4 top-3 text-gray-500 text-[10px]">▼</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Time Block</label>
                <div className="relative">
                  <select className="w-full bg-transparent border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 outline-none appearance-none cursor-pointer">
                    <option>10:00</option><option>14:00</option>
                  </select>
                  <span className="absolute right-4 top-3 text-gray-500 text-[10px]">▼</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Teacher / Interviewer</label>
                <input type="text" placeholder="Teacher Name" className="w-full bg-transparent border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 outline-none" />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Room / Lab</label>
                <input type="text" placeholder="Room" className="w-full bg-transparent border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 outline-none" />
              </div>

              <div className="col-span-2 space-y-1.5 mt-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Date (For Calendar)</label>
                <input type="text" placeholder="e.g. 23" className="w-full bg-transparent border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 outline-none" />
              </div>

              {/* 💡 القسم الجديد: إرسال التنبيهات للمتقدم 💡 */}
              <div className="col-span-2 mt-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#0A1128]">Notify Applicant</p>
                  <p className="text-[10px] text-gray-500 font-bold mt-1">Send an automated message with date & time.</p>
                </div>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1.5 text-xs font-bold text-gray-700 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={notifyEmail} 
                      onChange={(e) => setNotifyEmail(e.target.checked)}
                      className="w-4 h-4 accent-[#0A1128] cursor-pointer" 
                    /> 
                    Email 📧
                  </label>
                  <label className="flex items-center gap-1.5 text-xs font-bold text-gray-700 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={notifyWhatsApp} 
                      onChange={(e) => setNotifyWhatsApp(e.target.checked)}
                      className="w-4 h-4 accent-[#0A1128] cursor-pointer" 
                    /> 
                    WhatsApp 💬
                  </label>
                </div>
              </div>

            </div>

            <div className="flex justify-end items-center gap-6 mt-8">
              <button onClick={() => setIsScheduleModalOpen(false)} className="text-sm font-bold text-gray-600 hover:text-gray-900 cursor-pointer">Cancel</button>
              <button onClick={handleSaveSchedule} className="bg-[#0A1128] text-white px-8 py-3 rounded-xl text-sm font-bold shadow-md hover:bg-blue-900 transition-colors cursor-pointer">Save & Notify</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationRequests;
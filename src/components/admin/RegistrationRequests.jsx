import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient'; 

const RegistrationRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEnrollMode, setIsEnrollMode] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  // Notification states
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyWhatsApp, setNotifyWhatsApp] = useState(false);

  // Fetch data from Supabase
  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('registration_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) {
        const formattedData = data.map(req => ({
          id: req.id,
          name: req.full_name,
          type: req.role.charAt(0).toUpperCase() + req.role.slice(1), 
          parent: req.role === 'parent' ? 'Parent / Guardian' : null,
          language: req.course,
          level: "Placement Test", 
          status: req.status === 'pending' ? 'Pending' : req.status
        }));
        setRequests(formattedData);
      }
      setLoading(false);
    };
    fetchRequests();
  }, []);

  const handleEnrollNow = (req) => {
    setSelectedStudent(req);
    setIsEnrollMode(true);
  };

  const handleOpenScheduleModal = (req) => {
    setSelectedStudent(req);
    setIsScheduleModalOpen(true);
  };

  const handleSaveSchedule = async () => {
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
      
      let msg = "Test Scheduled Successfully!";
      if (notifyEmail) msg += "\n📧 Email notification sent.";
      if (notifyWhatsApp) msg += "\n💬 WhatsApp message sent.";
      alert(msg);
    } else {
      alert("Error: " + error.message);
    }
  };

  // --- ENROLLMENT VIEW ---
  if (isEnrollMode) {
    return (
      <div className="animate-fade-in text-left">
        <div className="flex items-center mb-10">
          <button onClick={() => setIsEnrollMode(false)} className="w-12 h-12 bg-white shadow-sm rounded-2xl flex items-center justify-center mr-6 hover:bg-gray-100 transition-all text-[#1A2252] font-bold">←</button>
          <div>
            <h2 className="text-4xl font-black text-[#1A2252]">Add New Student</h2>
            <p className="text-gray-400 font-medium italic">Finalizing registration for {selectedStudent?.name}</p>
          </div>
        </div>

        <div className="bg-white rounded-[3.5rem] p-12 shadow-sm border border-gray-50 space-y-16">
          <section>
            <h2 className="text-xs font-black text-gray-400 mb-8 uppercase tracking-[0.2em] border-b border-gray-50 pb-4">Academic Placement</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[{ label: "Language", v: selectedStudent?.language }, { label: "Current Level", v: selectedStudent?.level }, { label: "Assigned Group", v: "Grp 1" }].map((item) => (
                <div key={item.label} className="space-y-2 border-b border-gray-100 pb-3 relative">
                  <label className="text-[10px] font-black text-[#1A2252]/40 uppercase tracking-widest">{item.label}</label>
                  <div className="text-sm font-bold text-[#1A2252]">{item.v}</div>
                  <span className="absolute right-0 bottom-3 text-gray-300 text-[10px]">▼</span>
                </div>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
            <section className="space-y-10">
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Personal Details</h2>
              <div className="space-y-8">
                <input type="text" defaultValue={selectedStudent?.name.split(' ')[0]} placeholder="First Name" className="w-full bg-transparent border-b border-gray-100 py-3 text-sm font-bold outline-none focus:border-[#1A2252] transition-colors" />
                <input type="text" defaultValue={selectedStudent?.name.split(' ')[1]} placeholder="Last Name" className="w-full bg-transparent border-b border-gray-100 py-3 text-sm font-bold outline-none focus:border-[#1A2252] transition-colors" />
                <input type="text" placeholder="Birth Date (DD/MM/YYYY) 📅" className="w-full bg-transparent border-b border-gray-100 py-3 text-sm font-bold outline-none focus:border-[#1A2252] transition-colors" />
              </div>
            </section>
            <section className="space-y-10">
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Contact Channels</h2>
              <div className="space-y-8">
                <input type="email" placeholder="Email Address" className="w-full bg-transparent border-b border-gray-100 py-3 text-sm font-bold outline-none focus:border-[#1A2252] transition-colors" />
                <input type="text" placeholder="Phone Number" className="w-full bg-transparent border-b border-gray-100 py-3 text-sm font-bold outline-none focus:border-[#1A2252] transition-colors" />
              </div>
            </section>
          </div>

          <div className="flex justify-end gap-6 pt-10">
            <button onClick={() => setIsEnrollMode(false)} className="px-10 py-4 text-gray-400 text-sm font-bold hover:text-gray-600 transition-all">Discard</button>
            <button onClick={() => setIsEnrollMode(false)} className="px-12 py-4 bg-[#1A2252] text-white rounded-2xl text-sm font-bold hover:shadow-xl transition-all shadow-lg">Confirm Enrollment</button>
          </div>
        </div>
      </div>
    );
  }

  // --- MAIN TABLE VIEW ---
  return (
    <div className="animate-fade-in text-left">
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-[#1A2252] mb-2">Registration Requests</h2>
          <p className="text-gray-400 font-medium italic">Review and manage incoming applications from the database.</p>
        </div>
        <div className="flex bg-[#1A2252] text-white rounded-2xl p-1.5 text-[10px] font-black tracking-widest uppercase">
          <span className="px-6 py-2 bg-white/10 rounded-xl cursor-pointer">All</span>
          <span className="px-6 py-2 opacity-40 hover:opacity-100 transition-opacity cursor-pointer">Students</span>
          <span className="px-6 py-2 opacity-40 hover:opacity-100 transition-opacity cursor-pointer">Parents</span>
        </div>
      </div>

      <div className="bg-white rounded-[3.5rem] shadow-sm border border-gray-50 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#1A2252] text-white text-[10px] font-black uppercase tracking-[0.2em]">
              <th className="p-8">Applicant Details</th>
              <th className="p-8 text-center">Identity</th>
              <th className="p-8">Course Track</th>
              <th className="p-8 text-center">Status</th>
              <th className="p-8 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan="5" className="p-20 text-center font-bold text-gray-300 animate-pulse">Connecting to Supabase...</td></tr>
            ) : (
              requests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50/50 transition-all group">
                  <td className="p-8">
                    <div className="font-bold text-[#1A2252] text-lg group-hover:text-blue-600 transition-colors">{req.name}</div>
                    {req.parent && <div className="text-[10px] text-blue-500 font-black uppercase tracking-tighter mt-1">{req.parent}</div>}
                  </td>
                  <td className="p-8">
                    <span className={`px-4 py-2 rounded-xl text-[10px] font-black mx-auto flex items-center justify-center w-max gap-2 ${req.type === "Student" ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"}`}>
                      {req.type === "Student" ? "🎓 STUDENT" : "👥 PARENT"}
                    </span>
                  </td>
                  <td className="p-8">
                    <div className="text-sm font-bold text-[#1A2252]">{req.language}</div>
                    <div className="text-[10px] text-gray-300 font-black uppercase tracking-widest">Initial: {req.level}</div>
                  </td>
                  <td className="p-8 text-center">
                    <span className={`px-4 py-2 rounded-xl text-[10px] font-black border ${
                      req.status === 'Passed' ? 'bg-green-50 text-green-600 border-green-100' :
                      req.status === 'Scheduled' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                      'bg-orange-50 text-orange-600 border-orange-100'
                    }`}>
                      {req.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-8 flex justify-center gap-3">
                    {req.status === 'Passed' ? (
                      <button onClick={() => handleEnrollNow(req)} className="px-8 py-3 bg-green-600 text-white rounded-2xl text-[11px] font-black hover:bg-green-700 transition-all shadow-md">
                        ENROLL NOW ✅
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleOpenScheduleModal(req)}
                        disabled={req.status === 'Scheduled'}
                        className={`px-6 py-3 rounded-2xl text-[11px] font-black transition-all shadow-sm ${
                          req.status === 'Scheduled' ? 'bg-gray-100 text-gray-300 cursor-not-allowed border border-gray-100' : 'bg-[#1A2252] text-white hover:bg-blue-900 cursor-pointer'
                        }`}
                      >
                        {req.status === 'Scheduled' ? 'SCHEDULED 📅' : 'SCHEDULE TEST 📅'}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* --- MINIMALIST SCHEDULE MODAL --- */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#F8F9FA] w-full max-w-lg rounded-3xl shadow-2xl p-8 font-sans">
            <h2 className="text-xl font-bold text-[#0A1128] mb-8">Schedule Placement Test</h2>
            
            <div className="grid grid-cols-2 gap-x-6 gap-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Language</label>
                <div className="relative border-b border-gray-300">
                  <select className="w-full bg-transparent px-2 py-2.5 text-sm font-bold text-gray-700 outline-none appearance-none cursor-pointer">
                    <option>{selectedStudent?.language}</option>
                  </select>
                  <span className="absolute right-2 top-3 text-gray-500 text-[10px]">▼</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Level</label>
                <input type="text" defaultValue={selectedStudent?.level} className="w-full bg-transparent border-b border-gray-300 px-2 py-2.5 text-sm font-bold text-gray-700 outline-none" />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Applicant</label>
                <input type="text" defaultValue={selectedStudent?.name} className="w-full bg-transparent border-b border-gray-300 px-2 py-2.5 text-sm font-bold text-gray-700 outline-none" readOnly />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Test Type</label>
                <input type="text" defaultValue="PLACEMENT TEST" className="w-full bg-transparent border-b border-gray-300 px-2 py-2.5 text-sm font-bold text-gray-700 outline-none" />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Day</label>
                <div className="relative border-b border-gray-300">
                  <select className="w-full bg-transparent px-2 py-2.5 text-sm font-bold text-gray-700 outline-none appearance-none cursor-pointer">
                    <option>Mon</option><option>Tue</option><option>Wed</option><option>Thu</option>
                  </select>
                  <span className="absolute right-2 top-3 text-gray-500 text-[10px]">▼</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Time Block</label>
                <div className="relative border-b border-gray-300">
                  <select className="w-full bg-transparent px-2 py-2.5 text-sm font-bold text-gray-700 outline-none appearance-none cursor-pointer">
                    <option>10:00</option><option>14:00</option>
                  </select>
                  <span className="absolute right-2 top-3 text-gray-500 text-[10px]">▼</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Teacher / Interviewer</label>
                <input type="text" placeholder="Teacher Name" className="w-full bg-transparent border-b border-gray-300 px-2 py-2.5 text-sm font-bold text-gray-700 outline-none" />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Room / Lab</label>
                <input type="text" placeholder="Room" className="w-full bg-transparent border-b border-gray-300 px-2 py-2.5 text-sm font-bold text-gray-700 outline-none" />
              </div>

              <div className="col-span-2 space-y-1.5 mt-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Date (For Calendar)</label>
                <input type="text" placeholder="e.g. 23" className="w-full bg-transparent border-b border-gray-300 px-2 py-2.5 text-sm font-bold text-gray-700 outline-none" />
              </div>

              <div className="col-span-2 mt-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#0A1128]">Notify Applicant</p>
                  <p className="text-[10px] text-gray-500 font-bold mt-1">Send an automated message with date & time.</p>
                </div>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1.5 text-xs font-bold text-gray-700 cursor-pointer">
                    <input type="checkbox" checked={notifyEmail} onChange={(e) => setNotifyEmail(e.target.checked)} className="w-4 h-4 accent-[#0A1128]" /> 
                    Email 📧
                  </label>
                  <label className="flex items-center gap-1.5 text-xs font-bold text-gray-700 cursor-pointer">
                    <input type="checkbox" checked={notifyWhatsApp} onChange={(e) => setNotifyWhatsApp(e.target.checked)} className="w-4 h-4 accent-[#0A1128]" /> 
                    WhatsApp 💬
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end items-center gap-6 mt-8">
              <button onClick={() => setIsScheduleModalOpen(false)} className="text-sm font-bold text-gray-600 hover:text-gray-900 cursor-pointer">Cancel</button>
              <button onClick={handleSaveSchedule} className="bg-[#0A1128] text-white px-8 py-3 rounded-xl text-sm font-bold shadow-md hover:bg-blue-900 transition-colors">Save & Notify</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationRequests;
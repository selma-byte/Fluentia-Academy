import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';


// ==========================================
// 🔔 MODERN NOTIFICATION COMPONENT (ENLARGED)
// ==========================================
const Toast = ({ message, onClose }) => (
  <div className="fixed bottom-12 right-12 z-[250] animate-in slide-in-from-right duration-500">
    <div className="bg-[#1A2252] text-white px-10 py-6 rounded-[2.5rem] shadow-2xl flex items-center gap-6 border border-blue-400/30 backdrop-blur-xl min-w-[400px]">
      <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-blue-500/40 animate-pulse">✨</div>
      <div className="flex-1">
        <p className="text-lg font-black italic tracking-tight leading-none mb-1">System Update</p>
        <p className="text-sm font-bold text-blue-200/80 italic">{message}</p>
      </div>
      <button onClick={onClose} className="ml-6 text-white/30 hover:text-white transition-colors text-2xl p-2">✕</button>
    </div>
  </div>
);
// ==========================================
// 1. Add Teacher Tab (Registration Logic)
// ==========================================
const TeacherRegistrationTab = ({ showToast }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ 
    firstName: '', lastName: '', email: '', phone: '', department: 'English', role: 'Teacher' 
  });

  const handleInputChange = (e) => { 
    const { name, value } = e.target; 
    setFormData(prev => ({ ...prev, [name]: value })); 
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        const { data: authData, error: authError } = await supabase.auth.signUp({ 
            email: formData.email, 
            password: formData.phone 
        });
        if (authError && authError.message !== "User already registered") throw authError; 

        const uid = authData.user?.id;

        const { error: dbError } = await supabase.from('staff').insert([{
            auth_id: uid, 
            first_name: formData.firstName, 
            last_name: formData.lastName, 
            email: formData.email, 
            phone: formData.phone, 
            department: formData.department,
            role: formData.role
        }]);

        if (dbError) throw dbError;

        showToast(`Teacher ${formData.firstName} added! Login ready via email/phone.`);
        setFormData({ firstName: '', lastName: '', email: '', phone: '', department: 'English', role: 'Teacher' });
        
    } catch (err) { 
        showToast("Error: " + err.message); 
    } finally { 
        setLoading(false); 
    }
  };

  return (
    <div className="w-full flex flex-col h-full p-8 animate-fade-in">
      <div className="mb-10 text-left">
        <h2 className="text-4xl font-black text-[#1A2252] mb-2 italic tracking-tight">Add New Staff</h2>
        <p className="text-gray-400 font-bold italic text-sm">Register a new teacher or administrator to the system.</p>
      </div>

      <form onSubmit={handleSave} className="flex-1 overflow-y-auto pr-4 custom-scrollbar text-left">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 mb-6">
           <h3 className="font-black text-[#1A2252] italic mb-4 border-b border-gray-50 pb-2 flex items-center gap-2">
             <span className="bg-blue-600 w-2 h-5 rounded-full"></span> Professional Details
           </h3>
           <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 italic">Department</label>
                <select name="department" value={formData.department} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm font-bold outline-none focus:border-blue-500">
                  <option>English</option><option>Français</option><option>Deutsch</option><option>Español</option><option>Administration</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 italic">System Role</label>
                <select name="role" value={formData.role} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm font-bold outline-none focus:border-blue-500">
                  <option value="Teacher">Teacher</option><option value="Admin">Admin</option><option value="Secretary">Secretary</option>
                </select>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
           <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
             <h3 className="font-black text-[#1A2252] italic mb-4 border-b border-gray-50 pb-2">Personal Info</h3>
             <div className="space-y-4">
               <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="First Name" className="w-full bg-gray-50 border border-gray-100 p-4 rounded-xl text-sm font-bold" required />
               <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Last Name" className="w-full bg-gray-50 border border-gray-100 p-4 rounded-xl text-sm font-bold" required />
             </div>
           </div>
           
           <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
             <h3 className="font-black text-[#1A2252] italic mb-4 border-b border-gray-50 pb-2">Login Info</h3>
             <div className="space-y-4">
               <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Work Email" className="w-full bg-gray-50 border border-gray-100 p-4 rounded-xl text-sm font-bold" required />
               <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone Number (Becomes Password)" className="w-full bg-gray-50 border border-gray-100 p-4 rounded-xl text-sm font-bold" required />
             </div>
           </div>
        </div>

        <div className="mt-8 pt-6 flex justify-end">
          <button type="submit" disabled={loading} className="px-12 py-4 bg-[#1A2252] hover:bg-blue-900 text-white font-black italic rounded-2xl shadow-xl transition-all cursor-pointer">
            {loading ? 'PROCESSING...' : 'CREATE ACCOUNT ➔'}
          </button>
        </div>
      </form>
    </div>
  );
};

// ==========================================
// 2. Teacher Applicant Tab (Review Interface)
// ==========================================
const TeacherApplicantTab = ({ showToast }) => {
  const [applicants, setApplicants] = useState([
    { 
      id: 1, 
      name: "Dr. Sarah Ahmed", 
      language: "English", 
      level: "C2 / Native", 
      experience: "8 Years", 
      email: "sarah.a@school.com", 
      phone: "+213 555 12 34 56",
      education: "PhD in English Linguistics - Oxford University",
      skills: ["TOEFL/IELTS Prep", "Public Speaking", "Curriculum Design"],
      bio: "Expert in communicative language teaching with over 8 years of experience in international academies.",
      status: "Pending" 
    },
    { 
      id: 2, 
      name: "Prof. Mourad Ben", 
      language: "French", 
      level: "DALF C1", 
      experience: "5 Years", 
      email: "mourad.b@school.com", 
      phone: "+213 661 88 99 00",
      education: "Master's in FLE - University of Algiers",
      skills: ["Professional French", "Literature", "Exam Correction"],
      bio: "Specialized in teaching French for professional purposes (FOS) and academic preparation.",
      status: "Pending" 
    }
  ]);

  const [acceptedTeachers, setAcceptedTeachers] = useState([]);
  const [viewingCV, setViewingCV] = useState(null);

  const handleAccept = (applicant) => {
    setAcceptedTeachers([...acceptedTeachers, { ...applicant, status: "Accepted", joinDate: new Date().toLocaleDateString() }]);
    setApplicants(applicants.filter(a => a.id !== applicant.id));
    setViewingCV(null);
    showToast(`Success! ${applicant.name} has been hired.`);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 p-8">
      <div className="mb-10 text-left">
        <h2 className="text-4xl font-black text-[#1A2252] mb-2 italic tracking-tight">Teacher Applicants</h2>
        <p className="text-gray-400 font-bold italic text-sm">Review applications and view profile details.</p>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden mb-12">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[11px] font-black text-gray-400 uppercase tracking-widest italic border-b border-gray-50 bg-gray-50/50">
              <th className="px-8 py-5">Applicant Info</th>
              <th className="px-6 py-5">Language/Level</th>
              <th className="px-6 py-5 text-center">View Profile</th>
              <th className="px-8 py-5 text-right">Decision</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {applicants.map((app) => (
              <tr key={app.id} className="hover:bg-gray-50/80 transition-all group">
                <td className="px-8 py-5">
                  <div className="font-bold text-[#1A2252]">{app.name}</div>
                  <div className="text-[10px] text-gray-400 font-bold">{app.email}</div>
                </td>
                <td className="px-6 py-5">
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black">{app.language}</span>
                  <span className="ml-2 text-[10px] text-gray-400 font-bold italic">{app.level}</span>
                </td>
                <td className="px-6 py-5 text-center">
                  <button onClick={() => setViewingCV(app)} className="text-2xl hover:scale-125 transition-transform cursor-pointer bg-gray-100 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto shadow-sm">📄</button>
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => handleAccept(app)} className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-xl text-[10px] font-black italic shadow-md cursor-pointer transition-all">ACCEPT</button>
                    <button className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white px-5 py-2 rounded-xl text-[10px] font-black italic cursor-pointer transition-all">REJECT</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* DETAILED MODERN CV MODAL */}
      {viewingCV && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-[#1A2252]/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden relative border border-white/20">
             <button onClick={() => setViewingCV(null)} className="absolute top-8 right-10 z-20 text-gray-400 hover:text-red-500 transition-colors text-2xl">✕</button>
             
             <div className="flex flex-col md:flex-row min-h-[500px]">
               {/* Left Panel: Profile */}
               <div className="w-full md:w-2/5 bg-[#F8FAFC] p-12 flex flex-col items-center border-r border-gray-100 text-center">
                 <div className="w-32 h-32 bg-[#1A2252] rounded-[2.5rem] flex items-center justify-center text-white text-5xl font-black mb-6 shadow-2xl ring-8 ring-white">
                   {viewingCV.name.charAt(0)}
                 </div>
                 <h4 className="text-2xl font-black text-[#1A2252] italic mb-1">{viewingCV.name}</h4>
                 <p className="text-xs font-black text-blue-600 uppercase tracking-widest mb-8">{viewingCV.language} Specialist</p>
                 
                 <div className="w-full space-y-4 pt-6 border-t border-gray-200">
                    <div className="text-left">
                       <span className="text-[9px] font-black text-gray-300 uppercase block mb-1">Contact</span>
                       <p className="text-sm font-bold text-[#1A2252]">{viewingCV.phone}</p>
                       <p className="text-xs font-medium text-gray-400">{viewingCV.email}</p>
                    </div>
                    <div className="text-left">
                       <span className="text-[9px] font-black text-gray-300 uppercase block mb-1">Experience</span>
                       <p className="text-sm font-bold text-[#1A2252]">{viewingCV.experience} in Teaching</p>
                    </div>
                 </div>
               </div>

               {/* Right Panel: CV Details */}
               <div className="w-full md:w-3/5 p-12 text-left flex flex-col">
                 <div className="flex-1">
                   <h5 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-4 italic">Academic Background</h5>
                   <p className="text-lg font-bold text-[#1A2252] mb-10 leading-relaxed border-l-4 border-blue-500 pl-6 italic">
                     "{viewingCV.education}"
                   </p>

                   <h5 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-4 italic">Core Expertise</h5>
                   <div className="flex flex-wrap gap-2 mb-10">
                      {viewingCV.skills.map(skill => (
                        <span key={skill} className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-[11px] font-bold text-[#1A2252]">{skill}</span>
                      ))}
                   </div>

                   <h5 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-2 italic">Professional Bio</h5>
                   <p className="text-sm text-gray-500 leading-relaxed italic font-medium">{viewingCV.bio}</p>
                 </div>

                 <div className="mt-12 flex gap-4">
                    <button onClick={() => setViewingCV(null)} className="px-8 py-4 rounded-2xl font-black italic text-xs text-gray-400 hover:text-red-500 transition-all uppercase tracking-widest">Cancel</button>
                    <button onClick={() => handleAccept(viewingCV)} className="flex-1 bg-[#1A2252] text-white py-5 rounded-[1.5rem] font-black italic text-sm shadow-xl hover:bg-blue-900 transition-all cursor-pointer transform hover:-translate-y-1 active:scale-95">
                      CONFIRM HIRE ➔
                    </button>
                 </div>
               </div>
             </div>
           </div>
        </div>
      )}

      {acceptedTeachers.length > 0 && (
        <div className="bg-[#1A2252] rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 text-left">
          <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/5">
            <h3 className="font-black text-white italic flex items-center gap-2">
              <span className="bg-green-400 w-2 h-6 rounded-full"></span> Newly Accepted Staff
            </h3>
          </div>
          <div className="p-6">
            <table className="w-full text-white">
              <tbody className="divide-y divide-white/5">
                {acceptedTeachers.map((teacher) => (
                  <tr key={teacher.id}>
                    <td className="px-6 py-5 font-bold italic">{teacher.name}</td>
                    <td className="px-6 py-5 text-right font-black text-green-400 text-xs italic tracking-widest">READY FOR SYSTEM ACCESS ✅</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 🌟 Master Component: Teacher Management 🌟
// ==========================================
const TeacherManagement = ({ initialAction }) => {
  const [activeTab, setActiveTab] = useState('applicants');
  const [toast, setToast] = useState(null);

  // Trigger from Dashboard Quick Action
  useEffect(() => {
    if (initialAction === 'add') {
      setActiveTab('add');
    }
  }, [initialAction]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans">
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      <div className="pt-8 px-8 pb-2">
        <div className="flex space-x-2 bg-white p-2 rounded-2xl shadow-sm border border-gray-200 w-max">
          <button 
            onClick={() => setActiveTab('applicants')} 
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'applicants' ? 'bg-[#1A2252] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 cursor-pointer'}`}
          >
            📋 Teacher Applicants
          </button>
          <button 
            onClick={() => setActiveTab('add')} 
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'add' ? 'bg-[#1A2252] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 cursor-pointer'}`}
          >
            👨‍🏫 Add Teacher
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {activeTab === 'applicants' && <TeacherApplicantTab showToast={showToast} />}
        {activeTab === 'add' && <TeacherRegistrationTab showToast={showToast} />}
      </div>
    </div>
  );
};

export default TeacherManagement;
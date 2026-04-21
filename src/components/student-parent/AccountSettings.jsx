import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

const Icons = {
  User: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>,
  Phone: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>,
  Academic: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>,
  Bell: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>,
  File: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>,
  Edit: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>,
  Qr: () => <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="3" height="3"></rect><rect x="7" y="14" width="3" height="3"></rect><rect x="3" y="18" width="3" height="3"></rect><rect x="7" y="18" width="3" height="3"></rect></svg>
};

const AccountSettings = () => {
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [showIdCard, setShowIdCard] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // 💡 State الديناميكي
  const [profile, setProfile] = useState({
    full_name: 'Loading...',
    student_id: '---',
    program: '---',
    email: '---',
    phone: '---',
    dob: 'Not Provided',
    gender: 'Not Provided',
    blood_group: 'Not Provided',
    address: 'Not Provided',
    level: '---',
    enrollment_year: '---',
    average: 'N/A'
  });

  const [notifications, setNotifications] = useState({
    email: true,
    assignments: false,
    schedule: true,
    exams: true
  });

  // ==========================================
  // 💡 Fetch Student Profile from Supabase
  // ==========================================
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // 1. نجيبو معلومات الطالب
        const { data: student, error } = await supabase
          .from('students')
          .select('*')
          .eq('email', user.email)
          .single();

        if (student) {
          const fullName = `${student.first_name || ''} ${student.last_name || ''}`.trim();
          
          // 2. نحسبو المعدل تاعو من طابلو grades باش يبان في الـ Stats
          let avgStr = 'N/A';
          const { data: grades } = await supabase
            .from('grades')
            .select('*')
            .eq('student_name', fullName);

          if (grades && grades.length > 0) {
            let totalMarks = 0;
            let validCount = 0;
            grades.forEach(g => {
              let mark = 0;
              if (g.score) mark = parseFloat(g.score);
              else if (g.grade) mark = parseFloat(g.grade) || 0;
              let max = parseFloat(g.max_grade) || 20;
              totalMarks += (mark / max) * 20;
              validCount++;
            });
            if (validCount > 0) {
              avgStr = `${(totalMarks / validCount).toFixed(2)} / 20`;
            }
          }

          // 3. نعمروا الداتا في الـ State
          setProfile({
            full_name: fullName,
            student_id: `STD-${student.id || Math.floor(Math.random() * 9000 + 1000)}`,
            program: `${student.language || 'Language'} (${student.level || 'Level'})`,
            email: student.email || user.email,
            phone: student.phone || 'Not Provided',
            dob: student.dob || 'Not Provided', // إذا زدتيها في الداتا باز مستقبلا تقراها
            gender: student.gender || 'Not Provided',
            blood_group: student.blood_group || 'Not Provided',
            address: student.address || 'Not Provided',
            level: student.level || 'N/A',
            enrollment_year: student.enrollment_date 
                ? new Date(student.enrollment_date).getFullYear() 
                : (student.created_at ? new Date(student.created_at).getFullYear() : '2026'),
            average: avgStr
          });
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleToggle = (setting) => {
    setNotifications(prev => ({ ...prev, [setting]: !prev[setting] }));
  };

  // --- ID CARD VIEW (Triggered from Doc Hub) ---
  if (showIdCard) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center animate-fadeIn p-4">
        <div className="bg-white rounded-[50px] p-12 shadow-2xl border border-gray-100 w-full max-w-4xl relative overflow-hidden">
            <div className="flex flex-col items-center mb-12">
                <h2 className="text-4xl font-black text-[#1B254B] uppercase tracking-tighter italic">Official Student ID</h2>
                <div className="h-1.5 w-24 bg-[#4318FF] rounded-full mt-4"></div>
            </div>

            {/* THE CARD COMPONENT */}
            <div className="relative mx-auto bg-gradient-to-br from-[#D8DDEB] to-[#F4F7FE] w-full max-w-3xl aspect-[1.6/1] rounded-[40px] shadow-2xl border-[10px] border-white flex overflow-hidden group">
                <div className="flex-1 p-10 flex flex-col justify-between relative z-10">
                    <div className="flex items-start gap-8">
                        <div className="w-40 h-48 rounded-[30px] border-[5px] border-white shadow-xl overflow-hidden bg-white">
                             <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300" className="w-full h-full object-cover" alt="Student" />
                        </div>
                        <div className="space-y-4 pt-2">
                             <div className="space-y-1">
                                <p className="text-[10px] font-black text-[#4318FF] uppercase tracking-[0.3em]">Full Name</p>
                                <p className="text-2xl font-black text-[#1B254B] tracking-tight uppercase italic">{profile.full_name}</p>
                             </div>
                             <div className="space-y-1">
                                <p className="text-[10px] font-black text-[#4318FF] uppercase tracking-[0.3em]">Departments</p>
                                <p className="text-lg font-bold text-[#1B254B] opacity-80 uppercase tracking-tight leading-tight">{profile.program}</p>
                             </div>
                             <div className="space-y-1">
                                <p className="text-[10px] font-black text-[#4318FF] uppercase tracking-[0.3em]">Institutional Email</p>
                                <p className="text-sm font-bold text-[#1B254B] opacity-80">{profile.email}</p>
                             </div>
                             <div className="space-y-1">
                                <p className="text-[10px] font-black text-[#4318FF] uppercase tracking-[0.3em]">Campus Location</p>
                                <p className="text-sm font-bold text-[#1B254B] opacity-80 italic">Fluentia Academy, Algiers</p>
                             </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-6 text-[#A3AED0] text-[10px] font-black uppercase tracking-widest pt-4">
                        <span>Student ID: {profile.student_id}</span>
                        <span>•</span>
                        <span>{profile.program} Department</span>
                    </div>
                </div>

                <div className="w-1/3 bg-white/20 backdrop-blur-sm flex flex-col items-center justify-center p-8 border-l border-white/30">
                    <div className="bg-white p-4 rounded-3xl shadow-xl mb-4 group-hover:scale-105 transition-transform">
                        <Icons.Qr />
                    </div>
                    <p className="text-[10px] font-black text-[#1B254B] uppercase tracking-[0.2em] text-center opacity-40">Scan to Verify Credentials</p>
                </div>
                
                {/* Background Decoration */}
                <div className="absolute -right-20 -top-20 text-[300px] font-black opacity-[0.03] select-none italic pointer-events-none">F</div>
            </div>

            <div className="mt-12 flex justify-center gap-4">
                <button onClick={() => setShowIdCard(false)} className="bg-[#111C44] text-white px-12 py-4 rounded-3xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl active:scale-95">Go Back</button>
                <button className="bg-[#4318FF] text-white px-12 py-4 rounded-3xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-[#3311CC] transition-all shadow-xl active:scale-95">Print ID Card</button>
            </div>
        </div>
      </div>
    );
  }

  // --- MAIN SETTINGS VIEW ---
  return (
    <div className="flex-1 flex flex-col gap-10 animate-fadeIn pr-2 pb-12">
      
      {/* HEADER HERO SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-10 rounded-[45px] shadow-sm border border-gray-100">
        <div className="flex items-center gap-8">
          <div className="relative">
            <div className="w-28 h-28 rounded-[35px] bg-[#F4F7FE] flex items-center justify-center overflow-hidden border-[6px] border-white shadow-xl shadow-blue-900/10">
              <img 
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300"
                alt="Profile" 
                className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-700"
              />
            </div>
            <button className="absolute -bottom-2 -right-2 bg-[#4318FF] text-white p-2.5 rounded-2xl border-4 border-white shadow-lg hover:bg-[#3311CC] transition-all">
              <Icons.Edit />
            </button>
          </div>
          <div className="space-y-1">
            <span className="bg-[#EEF2FF] text-[#4318FF] text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-[#4318FF]/10 shadow-sm">Certified Profile</span>
            <h1 className="text-4xl font-black text-[#1B254B] uppercase tracking-tighter italic mt-2">
               {loading ? 'Loading...' : profile.full_name}
            </h1>
            <div className="flex gap-6 text-[#A3AED0] text-[11px] font-black uppercase tracking-widest pt-1">
              <span className="underline decoration-[#4318FF] decoration-2 underline-offset-4">Ref: {profile.student_id}</span>
              <span>Campus: Algiers Central</span>
            </div>
          </div>
        </div>
        <div className="flex gap-4 mt-8 md:mt-0">
          <button className="bg-[#111C44] text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all shadow-2xl shadow-blue-900/20 active:scale-95">Update Profile</button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        
        {/* LEFT COLUMN: INFORMATION GRID */}
        <div className="xl:col-span-2 space-y-10">
          <div className="bg-white p-12 rounded-[50px] shadow-sm border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-12 gap-x-16">
              
              <div className="space-y-8">
                <h3 className="flex items-center gap-4 text-[#1B254B] font-black text-xl uppercase tracking-tighter border-b border-gray-50 pb-6">
                  <div className="w-10 h-10 rounded-xl bg-[#F4F7FE] flex items-center justify-center text-[#4318FF] shadow-inner"><Icons.User /></div>
                  Identification
                </h3>
                <InfoItem label="Full Legal Name" value={profile.full_name} />
                <div className="grid grid-cols-2 gap-10">
                    <InfoItem label="Birth Date" value={profile.dob} />
                    <InfoItem label="Gender Identity" value={profile.gender} />
                </div>
                <InfoItem label="Language Proficiency" value={profile.level} />
              </div>

              <div className="space-y-8">
                <h3 className="flex items-center gap-4 text-[#1B254B] font-black text-xl uppercase tracking-tighter border-b border-gray-50 pb-6">
                  <div className="w-10 h-10 rounded-xl bg-[#F4F7FE] flex items-center justify-center text-[#4318FF] shadow-inner"><Icons.Phone /></div>
                  Contact Registry
                </h3>
                <InfoItem label="Institutional Email" value={profile.email} />
                <InfoItem label="Verified Mobile" value={profile.phone} />
                <InfoItem label="Residential Address" value={profile.address} />
              </div>
            </div>

            <div className="mt-16 pt-10 border-t border-gray-50">
              <h3 className="flex items-center gap-4 text-[#1B254B] font-black text-xl uppercase tracking-tighter mb-10">
                <div className="w-10 h-10 rounded-xl bg-[#F4F7FE] flex items-center justify-center text-[#4318FF] shadow-inner"><Icons.Academic /></div>
                Academic Overview
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <StatCard label="Enrollment Year" value={profile.enrollment_year} />
                <StatCard label="Active Modules" value="1" />
                <StatCard label="Aggregate Average" value={profile.average} />
                <StatCard label="Account Grade" value="PRO" />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SIDEBAR */}
        <div className="space-y-10">
          
          {/* Preferences */}
          <div className="bg-white p-10 rounded-[50px] shadow-sm border border-gray-100">
            <h3 className="flex items-center gap-4 text-[#1B254B] font-black text-lg uppercase tracking-widest border-b border-gray-50 pb-6 mb-8 justify-center">
              <Icons.Bell /> Preferences
            </h3>
            <div className="space-y-8">
              <ToggleSwitch label="Email Logs" enabled={notifications.email} onToggle={() => handleToggle('email')} />
              <ToggleSwitch label="Assignment Alerts" enabled={notifications.assignments} onToggle={() => handleToggle('assignments')} />
              <ToggleSwitch label="Schedule Sync" enabled={notifications.schedule} onToggle={() => handleToggle('schedule')} />
              <ToggleSwitch label="Exam Alerts" enabled={notifications.exams} onToggle={() => handleToggle('exams')} />
            </div>
          </div>

          {/* Functional Document Hub */}
          <div className="bg-white p-10 rounded-[50px] shadow-sm border border-gray-100">
            <h3 className="flex items-center gap-4 text-[#1B254B] font-black text-lg uppercase tracking-widest border-b border-gray-50 pb-6 mb-8 justify-center">
              <Icons.File /> Document Hub
            </h3>
            <div className="space-y-4">
              <DocLink title="Digital Student ID" onClick={() => setShowIdCard(true)} />
              <DocLink title="Enrollment Contract" onClick={() => setSelectedDoc({ title: "Enrollment Contract", code: "CTR-2023-F" })} />
              <DocLink title="Payment Receipt" onClick={() => setSelectedDoc({ title: "Latest Payment Receipt", code: "REC-8829-Ver" })} />
              <DocLink title="Academic Transcript" onClick={() => setSelectedDoc({ title: "Official Transcript", code: "TRN-2026-S" })} />
            </div>
          </div>

        </div>
      </div>

      {/* DOCUMENT VIEWER MODAL (For non-ID docs) */}
      {selectedDoc && (
        <div className="fixed inset-0 bg-[#0B132B]/80 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-fadeIn" onClick={() => setSelectedDoc(null)}>
           <div className="bg-white rounded-[50px] p-12 max-w-lg w-full shadow-2xl relative overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="absolute top-10 right-10">
                 <button onClick={() => setSelectedDoc(null)} className="text-[#A3AED0] hover:text-[#1B254B] transition-colors font-black text-lg p-2 uppercase">✕</button>
              </div>
              <p className="text-[#4318FF] text-[10px] font-black tracking-[0.4em] uppercase mb-4">Official Document Vault</p>
              <h3 className="text-3xl font-black text-[#1B254B] uppercase tracking-tighter mb-10 leading-none">{selectedDoc.title}</h3>
              <div className="p-10 bg-[#F4F7FE] rounded-[40px] border-4 border-dashed border-white flex flex-col items-center justify-center text-center space-y-4">
                 <div className="bg-[#4318FF] text-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg mb-4 italic font-black">PDF</div>
                 <p className="text-xs font-black text-[#1B254B] uppercase tracking-widest leading-relaxed">Securely Generated Academic Record</p>
                 <p className="text-[10px] font-bold text-[#A3AED0] uppercase tracking-widest opacity-60">REF: {selectedDoc.code}</p>
              </div>
              <button className="w-full bg-[#111C44] text-white mt-10 py-5 rounded-3xl font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl active:scale-95 transition-all">Download Verified Copy</button>
           </div>
        </div>
      )}
    </div>
  );
};

/* --- REUSABLE UI MODULES --- */

const InfoItem = ({ label, value }) => (
  <div className="flex flex-col gap-2 group cursor-help">
    <span className="text-[9px] font-black text-[#A3AED0] uppercase tracking-[0.3em] group-hover:text-[#4318FF] transition-colors">{label}</span>
    <span className="text-[14px] font-black text-[#1B254B] uppercase tracking-tight">{value}</span>
  </div>
);

const StatCard = ({ label, value }) => (
  <div className="bg-[#F4F7FE] p-6 rounded-[30px] border-2 border-transparent hover:border-[#4318FF]/20 transition-all text-center group active:scale-95 cursor-pointer flex flex-col justify-center h-full">
    <span className="text-[8px] font-black text-[#A3AED0] uppercase block mb-3 tracking-widest group-hover:text-[#4318FF] transition-colors">{label}</span>
    <span className="text-[15px] font-black text-[#1B254B] italic tracking-tighter leading-none">{value}</span>
  </div>
);

const ToggleSwitch = ({ label, enabled, onToggle }) => (
  <div className="flex items-center justify-between group px-2">
    <span className="text-[11px] font-black text-[#1B254B] uppercase tracking-widest group-hover:text-[#4318FF] transition-colors cursor-pointer" onClick={onToggle}>{label}</span>
    <button onClick={onToggle} className={`w-12 h-6 flex items-center rounded-full p-1 transition-all duration-500 shadow-inner ${enabled ? 'bg-[#4318FF]' : 'bg-gray-200'}`}>
      <div className={`bg-white w-4 h-4 rounded-full shadow-2xl transform transition-all duration-500 ${enabled ? 'translate-x-6' : 'translate-x-0'}`} />
    </button>
  </div>
);

const DocLink = ({ title, onClick }) => (
  <div onClick={onClick} className="group flex items-center justify-between p-5 rounded-[28px] border-2 border-gray-50 hover:bg-[#4318FF] transition-all duration-300 cursor-pointer shadow-sm hover:shadow-xl hover:shadow-indigo-200 active:scale-95">
    <div className="flex items-center gap-4">
      <div className="bg-[#F4F7FE] p-2.5 rounded-xl text-[#4318FF] group-hover:bg-white/20 group-hover:text-white transition-all">
        <Icons.File />
      </div>
      <span className="text-[12px] font-black text-[#1B254B] group-hover:text-white uppercase tracking-tight transition-colors">{title}</span>
    </div>
    <span className="text-[#4318FF] group-hover:text-white transform group-hover:translate-x-1 transition-all font-black">→</span>
  </div>
);

export default AccountSettings;
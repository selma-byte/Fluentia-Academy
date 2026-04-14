import React, { useState } from 'react';

const AccountSettings = () => {
  const [profile, setProfile] = useState({
    full_name: 'Harboula Selma',
    student_id: 'STD-2098',
    program: 'English, Spanish Program',
    email: 'selma.har@student.com', // Updated email
    phone: '+213 550 XX XX XX',
    dob: '10 SEP 2004',
    gender: 'Female',
    blood_group: 'O+',
    address: 'Algiers, Algeria',
    level: 'B2',
    enrollment_year: '2023'
  });

  const [notifications, setNotifications] = useState({
    email: true,
    assignments: false,
    schedule: true,
    exams: false
  });

  const handleToggle = (setting) => {
    setNotifications(prev => ({ ...prev, [setting]: !prev[setting] }));
  };

  return (
    <div className="flex-1 flex flex-col gap-6 p-4 md:p-8 animate-fadeIn font-['DM_Sans',sans-serif] bg-[#F4F7FE] min-h-screen">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-8 rounded-[30px] shadow-sm border border-gray-50">
        <div className="flex items-center gap-6">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full bg-[#EBE9F1] flex items-center justify-center overflow-hidden border-4 border-[#F4F7FE]">
              <img 
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200" // Updated to a professional female profile photo
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            <button className="absolute bottom-1 right-1 bg-[#4318FF] text-white p-1.5 rounded-full border-2 border-white shadow-sm hover:scale-110 transition-transform flex items-center justify-center">
              <span className="text-[10px]">✎</span>
            </button>
          </div>
          <div>
            <span className="bg-[#E2E8F0] text-[#4318FF] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Active Student</span>
            <h1 className="text-3xl font-bold text-[#1B254B] mt-1">{profile.full_name}</h1>
            <div className="flex gap-4 text-[#A3AED0] text-sm mt-1 font-medium">
              <span>🆔 {profile.student_id}</span>
              <span>📍 {profile.program}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-6 md:mt-0">
          <button className="bg-[#4318FF] text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-[#3311CC] transition-all active:scale-95">Change photo</button>
          <button className="bg-white text-[#1B254B] px-6 py-2.5 rounded-xl text-sm font-bold border border-gray-200 hover:bg-gray-50 transition-all active:scale-95">Update Profile</button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: INFORMATION GRID */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[30px] shadow-sm border border-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
              
              {/* Personal Information */}
              <div className="space-y-6">
                <h3 className="flex items-center gap-2 text-[#1B254B] font-bold text-lg mb-4">
                  <span className="text-[#4318FF]">👤</span> Personal Information
                </h3>
                <InfoItem label="Full Name" value={profile.full_name} />
                <div className="grid grid-cols-2 gap-4">
                    <InfoItem label="Date of Birth" value={profile.dob} />
                    <InfoItem label="Gender" value={profile.gender} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <InfoItem label="Blood Group" value={profile.blood_group} />
                    <InfoItem label="Language Level" value={profile.level} />
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-6">
                <h3 className="flex items-center gap-2 text-[#1B254B] font-bold text-lg mb-4">
                  <span className="text-[#4318FF]">📞</span> Contact Information
                </h3>
                <InfoItem label="Phone Number" value={profile.phone} />
                <InfoItem label="Email Address" value={profile.email} />
                <InfoItem label="Address" value={profile.address} />
              </div>
            </div>

            <hr className="my-10 border-gray-100" />

            {/* Academic Information */}
            <div className="space-y-6">
              <h3 className="flex items-center gap-2 text-[#1B254B] font-bold text-lg mb-6">
                <span className="text-[#4318FF]">🎓</span> Academic Overview
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Major" value="English Lit." />
                <StatCard label="Course Count" value="12" />
                <StatCard label="Current GPA" value="3.8" />
                <StatCard label="Join Date" value="Sep 2023" />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SIDEBAR CONTENT */}
        <div className="space-y-6">
          
          {/* Notifications Card */}
          <div className="bg-white p-8 rounded-[30px] shadow-sm border border-gray-50">
            <h3 className="flex items-center gap-2 text-[#1B254B] font-bold text-lg mb-6">
              <span className="text-[#4318FF]">🔔</span> Preferences
            </h3>
            <div className="space-y-6">
              <ToggleSwitch 
                label="Email Notifications" 
                enabled={notifications.email} 
                onToggle={() => handleToggle('email')} 
              />
              <ToggleSwitch 
                label="Assignment Alerts" 
                enabled={notifications.assignments} 
                onToggle={() => handleToggle('assignments')} 
              />
              <ToggleSwitch 
                label="Schedule Updates" 
                enabled={notifications.schedule} 
                onToggle={() => handleToggle('schedule')} 
              />
              <ToggleSwitch 
                label="Exam Notifications" 
                enabled={notifications.exams} 
                onToggle={() => handleToggle('exams')} 
              />
            </div>
          </div>

          {/* Documents Card */}
          <div className="bg-white p-8 rounded-[30px] shadow-sm border border-gray-50">
            <h3 className="flex items-center gap-2 text-[#1B254B] font-bold text-lg mb-6">
              <span className="text-[#4318FF]">📄</span> Quick Downloads
            </h3>
            <div className="space-y-4">
              <DocLink title="Student ID Card" />
              <DocLink title="Registration Form" />
              <DocLink title="Payment Receipt" />
              <DocLink title="Semester Transcript" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

/* --- REUSABLE UI COMPONENTS --- */

const InfoItem = ({ label, value }) => (
  <div className="flex flex-col gap-1 group">
    <span className="text-[11px] font-bold text-[#A3AED0] uppercase tracking-wider group-hover:text-[#4318FF] transition-colors">{label}</span>
    <span className="text-[15px] font-bold text-[#1B254B]">{value}</span>
  </div>
);

const StatCard = ({ label, value }) => (
  <div className="bg-[#F4F7FE] p-4 rounded-2xl border border-transparent hover:border-[#4318FF]/20 transition-all text-center group cursor-default">
    <span className="text-[10px] font-bold text-[#A3AED0] uppercase block mb-1 group-hover:text-[#4318FF] transition-colors">{label}</span>
    <span className="text-sm font-black text-[#1B254B]">{value}</span>
  </div>
);

const ToggleSwitch = ({ label, enabled, onToggle }) => (
  <div className="flex items-center justify-between group">
    <span className="text-sm font-bold text-[#1B254B] group-hover:text-[#4318FF] transition-colors cursor-pointer" onClick={onToggle}>{label}</span>
    <button 
      onClick={onToggle}
      className={`w-11 h-6 flex items-center rounded-full p-1 transition-all duration-300 ${enabled ? 'bg-[#4318FF]' : 'bg-gray-200'}`}
    >
      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  </div>
);

const DocLink = ({ title }) => (
  <div className="group flex items-center justify-between p-3 rounded-xl border border-gray-50 hover:bg-[#F4F7FE] hover:border-[#4318FF]/10 transition-all cursor-pointer">
    <div className="flex items-center gap-3">
      <div className="bg-indigo-50 p-2 rounded-lg text-[#4318FF] group-hover:bg-[#4318FF] group-hover:text-white transition-all">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
      </div>
      <span className="text-[13px] font-bold text-[#1B254B] group-hover:text-[#4318FF] transition-colors">{title}</span>
    </div>
    <span className="text-[#A3AED0] group-hover:text-[#4318FF] transform group-hover:translate-x-1 transition-all">→</span>
  </div>
);

export default AccountSettings;
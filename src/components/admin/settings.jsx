import React, { useState } from 'react';

const Settings = () => {
  const [isEditMode, setIsEditMode] = useState(false);

  // Mock initial data
  const [schoolData, setSchoolData] = useState({
    name: 'Al-Najah Academy',
    phone: '+213 555 00 00 00',
    email: 'contact@school.com',
    website: 'www.alnajah-academy.dz',
    address: '123 Education Street, Jijel, Algeria',
    facebook: '@alnajah.academy',
    instagram: 'alnajah_edu',
    whatsapp: '+213 666 11 22 33'
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-20 p-4">
      {/* Header with Mode Toggle */}
      <div className="mb-12 flex justify-between items-end">
        <div>
          <h2 className="text-5xl font-black text-[#1A2252] mb-3 italic tracking-tighter">School Identity</h2>
          <p className="text-gray-400 font-bold italic text-sm">
            {isEditMode ? "Modify your school's public profile and branding." : "Viewing the official school information and credentials."}
          </p>
        </div>
        
        <button 
          onClick={() => setIsEditMode(!isEditMode)}
          className={`px-6 py-3 rounded-2xl font-black italic text-xs transition-all flex items-center gap-2 shadow-lg ${
            isEditMode ? 'bg-pink-500 text-white border-pink-500' : 'bg-white text-[#1A2252] border-2 border-gray-100'
          }`}
        >
          {isEditMode ? '👁️ VIEW MODE' : '✏️ EDIT PROFILE'}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Column: Branding */}
        <div className="xl:col-span-1 space-y-8">
          <div className="bg-white rounded-[3rem] p-8 shadow-sm border border-gray-50 relative overflow-hidden group">
            <h3 className="text-sm font-black text-[#1A2252] mb-6 italic flex items-center gap-2">
              <span className="w-2 h-2 bg-pink-500 rounded-full"></span> INSTITUTION LOGO
            </h3>
            <div className={`border-4 border-dashed border-gray-50 rounded-[2.5rem] h-64 bg-gray-50/50 flex flex-col items-center justify-center transition-all duration-500 ${isEditMode ? 'cursor-pointer hover:bg-pink-50/30' : ''}`}>
              <span className="text-5xl mb-4 group-hover:scale-110 transition-transform">🏫</span>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter text-center px-4">
                {isEditMode ? 'Click to upload new logo' : 'Official School Logo'}
              </p>
            </div>
          </div>

          <div className="bg-[#1A2252] rounded-[3rem] p-8 shadow-2xl text-white relative overflow-hidden">
            <h3 className="text-sm font-black mb-6 italic flex items-center gap-2 text-pink-400">
              <span className="w-2 h-2 bg-pink-400 rounded-full"></span> OFFICIAL STAMP
            </h3>
            <div className={`border-2 border-dashed border-white/10 rounded-[2.5rem] h-40 bg-white/5 flex flex-col items-center justify-center transition-all ${isEditMode ? 'hover:bg-white/10 cursor-pointer' : ''}`}>
              <span className="text-3xl mb-2">📜</span>
              <p className="text-[9px] font-black uppercase tracking-widest opacity-60 text-center px-4">
                {isEditMode ? 'Update Digital Stamp' : 'Verified Administrative Stamp'}
              </p>
            </div>
            <p className="text-[9px] text-blue-200 mt-4 italic text-center leading-relaxed">This verification will appear on all generated student certificates.</p>
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="xl:col-span-2 space-y-8">
          <div className="bg-white rounded-[3.5rem] p-10 shadow-sm border border-gray-50">
            <h3 className="text-xl font-black text-[#1A2252] mb-8 italic">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputGroup label="School Name" value={schoolData.name} isEdit={isEditMode} icon="🏫" />
              <InputGroup label="Official Contact" value={schoolData.phone} isEdit={isEditMode} icon="📞" />
              <InputGroup label="Email Address" value={schoolData.email} isEdit={isEditMode} icon="📧" />
              <InputGroup label="Portal Website" value={schoolData.website} isEdit={isEditMode} icon="🌐" />
              
              <div className="md:col-span-2">
                <label className="text-[10px] font-black text-gray-400 uppercase italic ml-4 mb-2 block tracking-widest">Physical Headquarters</label>
                <div className="relative">
                  {isEditMode ? (
                    <textarea 
                      defaultValue={schoolData.address}
                      className="w-full bg-gray-50 border-none rounded-[2rem] px-8 py-5 font-bold italic text-[#1A2252] focus:ring-2 ring-pink-100 outline-none h-32 resize-none transition-all"
                    />
                  ) : (
                    <div className="w-full bg-gray-50/50 rounded-[2rem] px-8 py-5 font-bold italic text-[#1A2252] h-32 flex items-start">
                      {schoolData.address}
                    </div>
                  )}
                  <span className="absolute right-6 top-5 text-xl opacity-20">📍</span>
                </div>
              </div>
            </div>

            {/* Socials */}
            <div className="mt-12 pt-10 border-t border-gray-50">
              <h4 className="text-sm font-black text-[#1A2252] mb-6 italic tracking-widest uppercase">Public Connections</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SocialInput icon="Facebook" value={schoolData.facebook} color="text-blue-600" isEdit={isEditMode} />
                <SocialInput icon="Instagram" value={schoolData.instagram} color="text-pink-600" isEdit={isEditMode} />
                <SocialInput icon="WhatsApp" value={schoolData.whatsapp} color="text-green-600" isEdit={isEditMode} />
              </div>
            </div>

            {isEditMode && (
              <div className="mt-12 flex justify-end">
                <button className="bg-[#1A2252] text-white px-12 py-5 rounded-[2rem] font-black italic text-sm shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer">
                  PUBLISH UPDATES 💾
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

// Reusable Input Component with View/Edit Logic
const InputGroup = ({ label, value, icon, isEdit }) => (
  <div>
    <label className="text-[10px] font-black text-gray-400 uppercase italic ml-4 mb-2 block tracking-widest">
      {label}
    </label>
    <div className="relative">
      {isEdit ? (
        <input 
          type="text" 
          defaultValue={value}
          className="w-full bg-gray-50 border-none rounded-2xl px-8 py-4 font-bold italic text-[#1A2252] focus:ring-2 ring-pink-100 outline-none transition-all"
        />
      ) : (
        <div className="w-full bg-gray-50/50 rounded-2xl px-8 py-4 font-bold italic text-[#1A2252] flex items-center">
          {value}
        </div>
      )}
      <span className="absolute right-6 top-1/2 -translate-y-1/2 opacity-20 text-lg">{icon}</span>
    </div>
  </div>
);

// Reusable Social Input
const SocialInput = ({ icon, color, value, isEdit }) => (
  <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-2xl">
    <span className={`font-black italic text-[10px] ${color}`}>{icon}</span>
    {isEdit ? (
      <input 
        type="text" 
        defaultValue={value}
        className="bg-transparent border-none outline-none text-[10px] font-bold w-full italic"
      />
    ) : (
      <span className="text-[10px] font-bold italic text-[#1A2252] truncate">{value}</span>
    )}
  </div>
);

export default Settings;
import React, { useState, useRef } from 'react';

const Settings = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '' }); // New state for notification
  const logoInputRef = useRef(null);
  const stampInputRef = useRef(null);

  // State for school data
  const [schoolData, setSchoolData] = useState({
    name: 'Al-Najah Academy',
    phone: '+213 555 00 00 00',
    email: 'contact@school.com',
    website: 'www.alnajah-academy.dz',
    address: '123 Education Street, Jijel, Algeria',
    facebook: '@alnajah.academy',
    instagram: 'alnajah_edu',
    whatsapp: '+213 666 11 22 33',
    logo: null,
    stamp: null
  });

  // Local state for the form inputs while editing
  const [tempData, setTempData] = useState({ ...schoolData });

  const handleInputChange = (key, value) => {
    setTempData(prev => ({ ...prev, [key]: value }));
  };

  const handleFileChange = (e, key) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempData(prev => ({ ...prev, [key]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublish = () => {
    setSchoolData({ ...tempData });
    setIsEditMode(false);
    
    // Trigger modern notification
    setNotification({ show: true, message: `School identity updated for ${tempData.name}` });
    setTimeout(() => setNotification({ show: false, message: '' }), 4000);
  };

  // Modern Blue Notification Component
  const NotificationToast = () => (
    <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] transition-all duration-500 transform ${notification.show ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
      <div className="bg-[#0D1535] text-white px-8 py-5 rounded-[2rem] shadow-2xl flex items-center min-w-[450px] border border-blue-500/20 backdrop-blur-md">
        <div className="bg-[#3B82F6] p-3 rounded-2xl mr-5 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
          <span className="text-2xl">✨</span>
        </div>
        <div className="flex-1 text-left">
          <p className="font-bold text-base tracking-tight italic">System Update</p>
          <p className="text-xs text-blue-200/70 font-medium">{notification.message} 💸</p>
        </div>
        <button onClick={() => setNotification({show: false})} className="ml-4 text-gray-500 hover:text-white text-xl">✕</button>
      </div>
    </div>
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-20 p-4 font-sans relative">
      <NotificationToast />
      
      {/* Header with Mode Toggle */}
      <div className="mb-12 flex justify-between items-end">
        <div className="text-left">
          <h2 className="text-5xl font-black text-[#1A2252] mb-3 italic tracking-tighter uppercase">School Identity</h2>
          <p className="text-gray-400 font-bold italic text-sm">
            {isEditMode ? "Modify your school's public profile and branding." : "Viewing the official school information and credentials."}
          </p>
        </div>
        
        <button 
          onClick={() => {
            if (isEditMode) setTempData({ ...schoolData }); // Reset if cancelling
            setIsEditMode(!isEditMode);
          }}
          className={`px-8 py-3 rounded-2xl font-black italic text-xs transition-all flex items-center gap-2 shadow-xl border-2 cursor-pointer ${
            isEditMode ? 'bg-white text-blue-500 border-blue-500' : 'bg-[#1A2252] text-white border-[#1A2252]'
          }`}
        >
          {isEditMode ? '✕ CANCEL EDIT' : '✏️ EDIT PROFILE'}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Column: Branding */}
        <div className="xl:col-span-1 space-y-8 text-left">
          {/* Logo Section */}
          <div className="bg-white rounded-[3rem] p-8 shadow-sm border border-gray-50 relative overflow-hidden group">
            <h3 className="text-sm font-black text-[#1A2252] mb-6 italic flex items-center gap-2 tracking-widest uppercase text-left">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span> Institution Logo
            </h3>
            <input 
              type="file" 
              hidden 
              ref={logoInputRef} 
              onChange={(e) => handleFileChange(e, 'logo')} 
              accept="image/*" 
            />
            <div 
              onClick={() => isEditMode && logoInputRef.current.click()}
              className={`border-4 border-dashed border-gray-50 rounded-[2.5rem] h-64 bg-gray-50/50 flex flex-col items-center justify-center transition-all duration-500 overflow-hidden ${isEditMode ? 'cursor-pointer hover:bg-blue-50/50 hover:border-blue-200' : ''}`}
            >
              {tempData.logo ? (
                <img src={tempData.logo} alt="Logo" className="w-full h-full object-contain p-4" />
              ) : (
                <>
                  <span className="text-5xl mb-4 group-hover:scale-110 transition-transform">🏫</span>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center px-4">
                    {isEditMode ? 'Click to upload new logo' : 'Official School Logo'}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Stamp Section */}
          <div className="bg-[#1A2252] rounded-[3rem] p-8 shadow-2xl text-white relative overflow-hidden text-left">
            <h3 className="text-sm font-black mb-6 italic flex items-center gap-2 text-blue-400 tracking-widest uppercase">
              <span className="w-2 h-2 bg-blue-400 rounded-full"></span> Official Stamp
            </h3>
            <input 
              type="file" 
              hidden 
              ref={stampInputRef} 
              onChange={(e) => handleFileChange(e, 'stamp')} 
              accept="image/*" 
            />
            <div 
              onClick={() => isEditMode && stampInputRef.current.click()}
              className={`border-2 border-dashed border-white/10 rounded-[2.5rem] h-40 bg-white/5 flex flex-col items-center justify-center transition-all overflow-hidden ${isEditMode ? 'hover:bg-white/10 cursor-pointer border-blue-400' : ''}`}
            >
              {tempData.stamp ? (
                <img src={tempData.stamp} alt="Stamp" className="w-full h-full object-contain p-4" />
              ) : (
                <>
                  <span className="text-3xl mb-2">📜</span>
                  <p className="text-[9px] font-black uppercase tracking-widest opacity-60 text-center px-4">
                    {isEditMode ? 'Update Digital Stamp' : 'Verified Administrative Stamp'}
                  </p>
                </>
              )}
            </div>
            <p className="text-[9px] text-blue-200 mt-4 italic text-center leading-relaxed font-bold">This verification will appear on all generated student certificates.</p>
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="xl:col-span-2 space-y-8">
          <div className="bg-white rounded-[3.5rem] p-10 shadow-sm border border-gray-100 text-left">
            <h3 className="text-xl font-black text-[#1A2252] mb-8 italic tracking-tight uppercase">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputGroup label="School Name" value={tempData.name} isEdit={isEditMode} icon="🏫" onChange={(v) => handleInputChange('name', v)} />
              <InputGroup label="Official Contact" value={tempData.phone} isEdit={isEditMode} icon="📞" onChange={(v) => handleInputChange('phone', v)} />
              <InputGroup label="Email Address" value={tempData.email} isEdit={isEditMode} icon="📧" onChange={(v) => handleInputChange('email', v)} />
              <InputGroup label="Portal Website" value={tempData.website} isEdit={isEditMode} icon="🌐" onChange={(v) => handleInputChange('website', v)} />
              
              <div className="md:col-span-2 text-left">
                <label className="text-[10px] font-black text-gray-400 uppercase italic ml-4 mb-2 block tracking-widest text-left">Physical Headquarters</label>
                <div className="relative">
                  {isEditMode ? (
                    <textarea 
                      value={tempData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="w-full bg-gray-50 border-none rounded-[2rem] px-8 py-5 font-bold italic text-[#1A2252] focus:ring-2 ring-blue-100 outline-none h-32 resize-none transition-all"
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
            <div className="mt-12 pt-10 border-t border-gray-50 text-left">
              <h4 className="text-sm font-black text-[#1A2252] mb-6 italic tracking-widest uppercase">Public Connections</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SocialInput icon="Facebook" value={tempData.facebook} color="text-blue-600" isEdit={isEditMode} onChange={(v) => handleInputChange('facebook', v)} />
                <SocialInput icon="Instagram" value={tempData.instagram} color="text-blue-500" isEdit={isEditMode} onChange={(v) => handleInputChange('instagram', v)} />
                <SocialInput icon="WhatsApp" value={tempData.whatsapp} color="text-green-600" isEdit={isEditMode} onChange={(v) => handleInputChange('whatsapp', v)} />
              </div>
            </div>

            {isEditMode && (
              <div className="mt-12 flex justify-end">
                <button 
                  onClick={handlePublish}
                  className="bg-[#1A2252] text-white px-12 py-5 rounded-[2rem] font-black italic text-sm shadow-2xl hover:bg-blue-900 active:scale-95 transition-all cursor-pointer uppercase tracking-widest"
                >
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

const InputGroup = ({ label, value, icon, isEdit, onChange }) => (
  <div className="text-left">
    <label className="text-[10px] font-black text-gray-400 uppercase italic ml-4 mb-2 block tracking-widest">
      {label}
    </label>
    <div className="relative">
      {isEdit ? (
        <input 
          type="text" 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-gray-50 border-none rounded-2xl px-8 py-4 font-bold italic text-[#1A2252] focus:ring-2 ring-blue-100 outline-none transition-all"
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

const SocialInput = ({ icon, color, value, isEdit, onChange }) => (
  <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-2xl">
    <span className={`font-black italic text-[10px] ${color}`}>{icon}</span>
    {isEdit ? (
      <input 
        type="text" 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent border-none outline-none text-[10px] font-bold w-full italic"
      />
    ) : (
      <span className="text-[10px] font-bold italic text-[#1A2252] truncate">{value}</span>
    )}
  </div>
);

export default Settings;
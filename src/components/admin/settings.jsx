import React, { useState } from 'react';

const Settings = () => {
  const [activeSubTab, setActiveSubTab] = useState('General');

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-20 p-4">
      {/* Header */}
      <div className="mb-12">
        <h2 className="text-5xl font-black text-[#1A2252] mb-3 italic tracking-tighter">System Settings</h2>
        <p className="text-gray-400 font-bold italic text-sm">Configure your school identity and platform preferences.</p>
      </div>

      {/* Settings Navigation */}
      <div className="flex gap-4 mb-10 overflow-x-auto pb-2 no-scrollbar">
        {['General', 'Security', 'Academic Year', 'Notifications'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveSubTab(tab)}
            className={`px-8 py-3 rounded-2xl text-[11px] font-black italic tracking-widest transition-all cursor-pointer border-2 ${
              activeSubTab === tab 
              ? 'bg-[#1A2252] text-white border-[#1A2252] shadow-xl scale-105' 
              : 'bg-white text-gray-400 border-gray-100 hover:border-[#1A2252] hover:text-[#1A2252]'
            }`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {activeSubTab === 'General' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Left Column: Visual Identity (Logo & Stamp) */}
          <div className="xl:col-span-1 space-y-8">
            <div className="bg-white rounded-[3rem] p-8 shadow-sm border border-gray-50 relative overflow-hidden group">
              <h3 className="text-sm font-black text-[#1A2252] mb-6 italic flex items-center gap-2">
                <span className="w-2 h-2 bg-pink-500 rounded-full"></span> SCHOOL LOGO
              </h3>
              <div className="border-4 border-dashed border-gray-50 rounded-[2.5rem] h-64 bg-gray-50/50 flex flex-col items-center justify-center group-hover:bg-pink-50/30 transition-all duration-500 cursor-pointer">
                <span className="text-5xl mb-4 group-hover:scale-110 transition-transform">🖼️</span>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Click to upload logo</p>
                <p className="text-[9px] text-gray-300 mt-1 italic">PNG, JPG up to 2MB</p>
              </div>
            </div>

            <div className="bg-[#1A2252] rounded-[3rem] p-8 shadow-2xl text-white relative overflow-hidden">
              <h3 className="text-sm font-black mb-6 italic flex items-center gap-2 text-pink-400">
                <span className="w-2 h-2 bg-pink-400 rounded-full"></span> DIGITAL STAMP
              </h3>
              <div className="border-2 border-dashed border-white/10 rounded-[2.5rem] h-40 bg-white/5 flex flex-col items-center justify-center hover:bg-white/10 transition-all cursor-pointer">
                <span className="text-3xl mb-2">📜</span>
                <p className="text-[9px] font-black uppercase tracking-widest opacity-60 text-center px-4">Upload Official School Stamp</p>
              </div>
              <p className="text-[9px] text-blue-200 mt-4 italic text-center leading-relaxed">This stamp will be automatically applied to all PDF receipts and certificates.</p>
            </div>
          </div>

          {/* Right Column: Information Forms */}
          <div className="xl:col-span-2 space-y-8">
            <div className="bg-white rounded-[3.5rem] p-10 shadow-sm border border-gray-50">
              <h3 className="text-xl font-black text-[#1A2252] mb-8 italic">School Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup label="Official School Name" placeholder="e.g. Al-Najah Academy" icon="🏫" />
                <InputGroup label="Official Phone" placeholder="+213 555 00 00 00" icon="📞" />
                <InputGroup label="Official Email" placeholder="contact@school.com" icon="📧" />
                <InputGroup label="Website URL" placeholder="www.schoolname.com" icon="🌐" />
                <div className="md:col-span-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase italic ml-4 mb-2 block tracking-widest">Physical Address</label>
                  <div className="relative">
                    <textarea 
                      placeholder="Street name, Building, City, State..." 
                      className="w-full bg-gray-50 border-none rounded-[2rem] px-8 py-5 font-bold italic text-[#1A2252] focus:ring-2 ring-pink-100 outline-none h-32 resize-none transition-all"
                    ></textarea>
                    <span className="absolute right-6 top-5 text-xl opacity-20">📍</span>
                  </div>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="mt-12 pt-10 border-t border-gray-50">
                <h4 className="text-sm font-black text-[#1A2252] mb-6 italic tracking-widest uppercase">Social Connectivity</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <SocialInput icon="Facebook" color="text-blue-600" />
                  <SocialInput icon="Instagram" color="text-pink-600" />
                  <SocialInput icon="WhatsApp" color="text-green-600" />
                </div>
              </div>

              {/* Save Button */}
              <div className="mt-12 flex justify-end">
                <button className="bg-[#1A2252] text-white px-12 py-5 rounded-[2rem] font-black italic text-sm shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer">
                  SAVE CHANGES 💾
                </button>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

// مكون حقل الإدخال الجاهز (Reusable Input Component)
const InputGroup = ({ label, placeholder, icon }) => (
  <div>
    <label className="text-[10px] font-black text-gray-400 uppercase italic ml-4 mb-2 block tracking-widest">
      {label}
    </label>
    <div className="relative">
      <input 
        type="text" 
        placeholder={placeholder}
        className="w-full bg-gray-50 border-none rounded-2xl px-8 py-4 font-bold italic text-[#1A2252] focus:ring-2 ring-pink-100 outline-none transition-all"
      />
      <span className="absolute right-6 top-4 opacity-20 text-lg">{icon}</span>
    </div>
  </div>
);

// مكون روابط السوشيال ميديا
const SocialInput = ({ icon, color }) => (
  <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-2xl">
    <span className={`font-black italic text-[10px] ${color}`}>{icon}</span>
    <input 
      type="text" 
      placeholder="Username/Link"
      className="bg-transparent border-none outline-none text-[10px] font-bold w-full italic"
    />
  </div>
);

export default Settings;
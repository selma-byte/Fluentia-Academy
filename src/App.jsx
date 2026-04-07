import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

import './App.css';
import heroBgImage from './assets/dark-hero-3-cover sec-.png'; 
      
import englishImg from './assets/eng.jpg';
import frenchImg from './assets/fr.jpg';
import germanImg from './assets/grm.jpg';
import spanishImg from './assets/spn.jpg';

// استيراد الصفحات الجديدة
import SecretaryDashboard from './components/secretery/dashboard';
import AdminDashboard from './components/admin/dashboardA';
import TeacherDashboard from './components/teacher/Dashboardt';

import Login from './components/login';
import Join from './components/join';

const HomePage = () => {
  const navigate = useNavigate();

  
  
  return (
    <div className="min-h-screen font-sans bg-[#0A1128]"> 

      {/* =======================
          1. HERO SECTION 
          ======================= */}
      <div className="relative min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('${heroBgImage}')` }}>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A1128] via-[#0A1128]/80 to-transparent z-0"></div>
        <div className="relative z-10 flex flex-col min-h-screen">
          <nav className="flex justify-between items-center px-8 py-5 max-w-6xl mx-auto w-full">
            <div className="text-xl font-bold tracking-tighter cursor-pointer text-white">Polyglot<span className="text-[#2D428B]">Academy</span></div>
            <div className="hidden md:flex space-x-8 text-sm font-medium text-white/90">
              <button className="hover:text-blue-300 cursor-pointer">Home</button>
              <button className="hover:text-blue-300 cursor-pointer">Product</button>
              <button className="hover:text-blue-300 cursor-pointer">Pricing</button>
              <button className="hover:text-blue-300 cursor-pointer">Contact</button>
            </div>
            <div className="flex items-center space-x-5">
              {/* تم تعديل هذا الزر ليفتح صفحة Login */}
              <button onClick={() => navigate('/login')} className="text-sm font-semibold hover:text-blue-300 cursor-pointer text-white">Login</button>
              {/* تم تعديل هذا الزر ليفتح صفحة Join */}
              <button onClick={() => navigate('/join')} className="bg-[#2D428B] hover:bg-blue-600 px-5 py-2 rounded-md text-sm font-bold flex items-center transition-all cursor-pointer text-white">
                JOIN US <span className="ml-2">→</span>
              </button>
            </div>
          </nav>
          <div className="flex-grow flex items-center max-w-6xl mx-auto px-8 w-full pb-20">
            <div className="md:w-1/2 space-y-5">
              <h3 className="text-blue-400 text-lg font-medium tracking-wide">Welcome</h3>
              <h1 className="text-5xl md:text-6xl font-bold leading-tight text-white">Join +500 <br /> Successful <br /> Students</h1>
              <p className="text-gray-300 text-base max-w-md pt-2">Master a New Language, Open a New World.</p>
              <div className="flex space-x-4 pt-4">
                {/* تم تعديل هذا الزر ليفتح صفحة Join */}
                <button onClick={() => navigate('/login')} className="bg-[#2D428B] hover:bg-blue-600 text-white px-7 py-3 rounded-md font-semibold transition-all cursor-pointer">Join Us</button>
                <button className="border border-white/70 hover:bg-white hover:text-[#0A1128] text-white px-7 py-3 rounded-md font-semibold transition-all cursor-pointer">Learn More</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =======================
          2. ABOUT SCHOOL SECTION 
          ======================= */}
      {/* غيرنا لون الخلفية هنا ليكون مطابقاً للقسم التالي bg-[#0A1128] */}
      <div className="bg-[#0A1128] py-24 px-8"> 
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="md:w-1/2">
            <h2 className="text-4xl font-bold text-white mb-3">About School</h2>
            <div className="w-10 h-1 bg-red-500 mb-8 rounded-full"></div>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              A distinguished Algerian educational institution committed to academic excellence. We believe in building a promising future generation.
            </p>
            <button className="text-[#2D428B] font-semibold flex items-center hover:text-white transition-colors cursor-pointer text-sm">
              Learn More <span className="ml-2 text-lg">›</span>
            </button>
          </div>
          <div className="md:w-1/2 w-full">
            <div className="bg-[#2D428B] w-full h-72 rounded-2xl relative shadow-2xl flex items-center justify-center border border-white/10">
              <p className="text-gray-500 text-sm">صورة الفيديو</p>
              <button className="absolute inset-0 m-auto w-16 h-16 bg-[#2D428B] hover:bg-purple-500 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 cursor-pointer z-10">
                <div className="w-0 h-0 border-t-8 border-b-8 border-l-[14px] border-transparent border-l-white ml-1"></div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =======================
          3. PROGRAMS SECTION 
          ======================= */}
      <div className="bg-[#0A1128] pb-24 px-8">
        
        {/* الخط الفاصل المحدود المتمركز في الوسط */}
        <div className="w-[85%] max-w-6xl mx-auto h-[1px] bg-white/10 mb-16"></div>

        <div className="max-w-6xl mx-auto">
          <div className="mb-14">
            <h2 className="text-4xl font-bold text-white mb-4">Explore Our Programs</h2>
            <p className="text-gray-400 text-lg">
              Enhancing linguistic abilities to open <br className="hidden md:block"/> global horizons
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* بطاقات اللغات */}
            {[
              { name: 'English', desc: 'Master the Global Language for Career & Study', image: englishImg },
              { name: 'French', desc: 'Refine Your Professional & Academic Communication', image: frenchImg },
              { name: 'German', desc: 'Prepare for Your Ausbildung & Work in Germany', image: germanImg },
              { name: 'Spanish', desc: 'Discover the Culture & Speak with Confidence', image: spanishImg }
            ].map((course, idx) => (
              <div key={idx} className="bg-white rounded-xl overflow-hidden shadow-lg hover:-translate-y-2 transition-transform duration-300">
                <div className="h-44 overflow-hidden flex items-center justify-center bg-gray-100">
                  <img src={course.image} alt={course.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-[#0A1128] mb-2">{course.name}</h3>
                  <p className="text-gray-500 text-xs mb-6 h-8 leading-relaxed">{course.desc}</p>
                  <button className="text-[#2D428B] border border-[#2D428B] rounded-full px-4 py-1.5 text-xs font-semibold hover:bg-[#A78BFA] hover:text-white transition-colors w-max cursor-pointer">
                    Learn More ›
                  </button>
                </div>
              </div>
            ))}

          </div>

          <div className="mt-16 text-center">
            <p className="text-gray-300 text-lg">
              Not sure which level you are? Take our Free <span className="text-[#2D428B] font-bold hover:text-white transition-colors cursor-pointer">Placement Test ›</span>
            </p>
          </div>

        </div>
      </div>

      {/* =======================
          4. OUR TEAM SECTION 
          ======================= */}
      <div className="bg-[#0A1128] pb-24 px-8">
        
        {/* الخط الفاصل الوحيد هنا (محدود الطول) */}
        <div className="w-[85%] max-w-6xl mx-auto h-[1px] bg-white/10 mb-20"></div>

        <div className="max-w-6xl mx-auto">
          <div className="mb-14">
            <h2 className="text-4xl font-bold text-white mb-4">Our Team</h2>
            <p className="text-gray-400 text-lg">Guided by Passionate Educators</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Dr. Ahmed Benali", role: "English Specialist" },
              { name: "Sara Mansouri", role: "German Specialist" },
              { name: "Prof. Salim Karimi", role: "French Specialist" },
              { name: "Julian Jameson", role: "Profession" }
            ].map((member, idx) => (
              <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-lg text-center flex flex-col">
                <div className="h-56 bg-gray-300 flex items-center justify-center">
                  <span className="text-gray-500 text-sm">صورة الأستاذ</span>
                </div>
                <div className="p-6 flex-grow flex flex-col justify-center">
                  <h3 className="text-lg font-bold text-[#0A1128]">{member.name}</h3>
                  <p className="text-gray-500 text-xs mb-4">{member.role}</p>
                  <div className="flex justify-center space-x-3 text-[#2D428B]">
                    <span className="cursor-pointer hover:text-purple-700">●</span>
                    <span className="cursor-pointer hover:text-purple-700">●</span>
                    <span className="cursor-pointer hover:text-purple-700">●</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* =======================
          5. NEWSLETTER & FOOTER 
          ======================= */}
      <div className="bg-[#0A1128] pt-10 pb-6 px-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Newsletter Box */}
          <div className="text-center py-16 mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Start Your Language Journey?</h2>
            <p className="text-gray-400">Join +500 students receiving weekly tips, free resources, and the latest course updates</p>
            
            <div className="mt-8 flex justify-center max-w-lg mx-auto">
              <input 
                type="email" 
                placeholder="Your Email" 
                className="w-full px-5 py-3 rounded-l-md outline-none text-white bg-white/10 border border-white/20 placeholder-gray-400"
              />
              <button className="bg-[#2D428B] hover:bg-purple-500 text-white font-semibold px-6 py-3 rounded-r-md transition-colors cursor-pointer">
                Subscribe
              </button>
            </div>
          </div>

          {/* Footer Links */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 border-t border-white/10 pt-16">
            <div>
              <h4 className="text-white font-bold mb-6">Company Info</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="hover:text-white cursor-pointer">About Us</li>
                <li className="hover:text-white cursor-pointer">Careers</li>
                <li className="hover:text-white cursor-pointer">We are hiring</li>
                <li className="hover:text-white cursor-pointer">Blog</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Legal</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="hover:text-white cursor-pointer">Terms of Service</li>
                <li className="hover:text-white cursor-pointer">Privacy Policy</li>
                <li className="hover:text-white cursor-pointer">Cookie Policy</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Features</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="hover:text-white cursor-pointer">Business Marketing</li>
                <li className="hover:text-white cursor-pointer">User Analytics</li>
                <li className="hover:text-white cursor-pointer">Live Chat</li>
                <li className="hover:text-white cursor-pointer">Unlimited Support</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Resources</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="hover:text-white cursor-pointer">iOS & Android</li>
                <li className="hover:text-white cursor-pointer">Watch a Demo</li>
                <li className="hover:text-white cursor-pointer">Customers</li>
                <li className="hover:text-white cursor-pointer">API</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Get In Touch</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-center"><span className="mr-2">📞</span> (480) 555-0103</li>
                <li className="flex items-start"><span className="mr-2">📍</span> 4517 Washington Ave.<br/>Manchester, KY 39495</li>
                <li className="flex items-center"><span className="mr-2">✉️</span> info@example.com</li>
              </ul>
            </div>
          </div>

          {/* Copyright Bar */}
          <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
           
           <p>Made With Love By Marwa & Malak & Selma All Right Reserved</p>
            <div className="flex space-x-4 mt-4 md:mt-0 text-[#2D428B]">
              <span className="cursor-pointer hover:text-white">FB</span>
              <span className="cursor-pointer hover:text-white">IG</span>
              <span className="cursor-pointer hover:text-white">TW</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/join" element={<Join />} />
        
        {/* صفحة السكرتيرة */}
        <Route path="/secretary/dashboard" element={<SecretaryDashboard />} />

        {/* 💡 زيدي هاد السطر باش يولي يشوف صفحة المدير */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
      </Routes>
    </Router>
    
  );
}
export default App;
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient'; 

import './App.css';
import heroBgImage from './assets/dark-hero-3-cover sec-.png'; 
      
import englishImg from './assets/eng.jpg';
import frenchImg from './assets/fr.jpg';
import germanImg from './assets/grm.jpg';
import spanishImg from './assets/spn.jpg';

import SecretaryDashboard from './components/secretery/dashboard';
import AdminDashboard from './components/admin/dashboardA';
import TeacherDashboard from './components/teacher/Dashboardt';
import StudentDashboard from './components/student-parent/StudentDashboard'; // تأكدي من المسار تاعك

import Login from './components/login';
import Join from './components/join';

const HomePage = () => {
  const navigate = useNavigate();

  const [schoolSettings, setSchoolSettings] = useState({
    name: 'Polyglot Academy', phone: '(480) 555-0103', address: '4517 Washington Ave.', email: 'info@example.com'
  });

  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [teacherForm, setTeacherForm] = useState({ first_name: '', last_name: '', email: '', phone: '', subject: 'English' });
  const [cvFile, setCvFile] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from('school_settings').select('*').eq('id', 1).single();
      if (data) setSchoolSettings(data);
    };
    fetchSettings();
  }, []);

  const handleTeacherSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let cvUrl = null;

      if (cvFile) {
        const fileExt = cvFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage.from('documents').upload(`cvs/${fileName}`, cvFile);
        
        if (!uploadError) {
          cvUrl = supabase.storage.from('documents').getPublicUrl(`cvs/${fileName}`).data.publicUrl;
        }
      }

      const { error } = await supabase.from('teacher_requests').insert([{
        first_name: teacherForm.first_name,
        last_name: teacherForm.last_name,
        email: teacherForm.email,
        phone: teacherForm.phone,
        subject: teacherForm.subject,
        cv_file: cvUrl
      }]);

      if (!error) {
        alert("🎉 Application sent successfully! We will contact you soon.");
        setShowTeacherModal(false);
        setTeacherForm({ first_name: '', last_name: '', email: '', phone: '', subject: 'English' });
        setCvFile(null);
      } else {
        alert("Error sending application: " + error.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen font-sans bg-[#0A1128] scroll-smooth"> 

      {/* =======================
          1. HERO SECTION 
          ======================= */}
      <div id="home-section" className="relative min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('${heroBgImage}')` }}>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A1128] via-[#0A1128]/80 to-transparent z-0"></div>
        <div className="relative z-10 flex flex-col min-h-screen">
          <nav className="flex justify-between items-center px-8 py-5 max-w-6xl mx-auto w-full">
            <div className="text-xl font-bold tracking-tighter cursor-pointer text-white">
              {schoolSettings.name.split(' ')[0]}<span className="text-[#2D428B]"> {schoolSettings.name.split(' ').slice(1).join(' ')}</span>
            </div>
            {/* 💡 طريقة مضمونة 100% للتنقل */}
            <div className="hidden md:flex space-x-8 text-sm font-medium text-white/90">
              <a href="#home-section" className="hover:text-blue-300 cursor-pointer transition-colors">Home</a>
              <a href="#about-section" className="hover:text-blue-300 cursor-pointer transition-colors">About</a>
              <a href="#languages-section" className="hover:text-blue-300 cursor-pointer transition-colors">Languages</a>
              <a href="#teachers-section" className="hover:text-blue-300 cursor-pointer transition-colors">Teachers</a>
            </div>
            <div className="flex items-center space-x-5">
              <button onClick={() => navigate('/login')} className="text-sm font-semibold hover:text-blue-300 cursor-pointer text-white">Login</button>
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
                <button onClick={() => navigate('/join')} className="bg-[#2D428B] hover:bg-blue-600 text-white px-7 py-3 rounded-md font-semibold transition-all cursor-pointer">Join Us</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =======================
          2. ABOUT SCHOOL SECTION 
          ======================= */}
      <div id="about-section" className="bg-[#0A1128] py-24 px-8"> 
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="md:w-1/2">
            <h2 className="text-4xl font-bold text-white mb-3">About {schoolSettings.name}</h2>
            <div className="w-10 h-1 bg-red-500 mb-8 rounded-full"></div>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              A distinguished educational institution committed to academic excellence. We believe in building a promising future generation.
            </p>
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
      <div id="languages-section" className="bg-[#0A1128] pb-24 px-8">
        <div className="w-[85%] max-w-6xl mx-auto h-[1px] bg-white/10 mb-16"></div>
        <div className="max-w-6xl mx-auto">
          <div className="mb-14">
            <h2 className="text-4xl font-bold text-white mb-4">Explore Our Programs</h2>
            <p className="text-gray-400 text-lg">Enhancing linguistic abilities to open <br className="hidden md:block"/> global horizons</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                {/* 💡 زدت pb-12 باش الكارطة تبقى كبيرة و تشد بلاصة البطونة لي نحيناها */}
                <div className="p-6 pb-12">
                  <h3 className="text-lg font-bold text-[#0A1128] mb-2">{course.name}</h3>
                  <p className="text-gray-500 text-xs mb-6 h-8 leading-relaxed">{course.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-16 text-center">
            <p className="text-gray-300 text-lg">
              Not sure which level you are? Take our Free <span onClick={() => navigate('/join')} className="text-[#2D428B] font-bold hover:text-white transition-colors cursor-pointer">Placement Test ›</span>
            </p>
          </div>
        </div>
      </div>

      {/* =======================
          4. OUR TEAM SECTION 
          ======================= */}
      <div id="teachers-section" className="bg-[#0A1128] pb-24 px-8">
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
              { name: "Julian Jameson", role: "Spanish Specialist" }
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

          <div className="mt-20 text-center bg-white/5 border border-white/10 rounded-2xl p-10 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">Are you a language expert?</h3>
            <p className="text-gray-400 mb-8">We are always looking for passionate educators to join our growing academy.</p>
            <button onClick={() => setShowTeacherModal(true)} className="bg-transparent border-2 border-[#2D428B] hover:bg-[#2D428B] text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg cursor-pointer">
              Do you want to join our team?
            </button>
          </div>

        </div>
      </div>

      {/* =======================
          5. DYNAMIC FOOTER 
          ======================= */}
      <div className="bg-[#0A1128] pt-10 pb-6 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 border-t border-white/10 pt-16">
            <div className="col-span-2">
              <h4 className="text-white font-bold text-xl mb-4">{schoolSettings.name}</h4>
              <p className="text-sm text-gray-400 leading-relaxed pr-8">
                Empowering students to communicate globally. Join us to start learning your favorite languages today.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6">Legal</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="hover:text-white cursor-pointer">Terms of Service</li>
                <li className="hover:text-white cursor-pointer">Privacy Policy</li>
                <li className="hover:text-white cursor-pointer">Cookie Policy</li>
              </ul>
            </div>
            
            <div className="col-span-2">
              <h4 className="text-white font-bold mb-6">Get In Touch</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                <li className="flex items-center"><span className="mr-3 text-lg">📞</span> {schoolSettings.phone}</li>
                <li className="flex items-start"><span className="mr-3 text-lg">📍</span> {schoolSettings.address}</li>
                <li className="flex items-center"><span className="mr-3 text-lg">✉️</span> {schoolSettings.email}</li>
              </ul>
            </div>
          </div>
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

      {/* =======================
          6. TEACHER APPLICATION MODAL 
          ======================= */}
      {showTeacherModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2rem] p-8 max-w-lg w-full shadow-2xl relative">
            <button onClick={() => setShowTeacherModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-red-500 text-xl cursor-pointer">✕</button>
            
            <h2 className="text-2xl font-black text-[#1A2252] mb-2 italic">Join Our Faculty</h2>
            <p className="text-sm text-gray-500 mb-6 font-medium">Fill out the form below and attach your CV (PDF).</p>

            <form onSubmit={handleTeacherSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="First Name" required value={teacherForm.first_name} onChange={(e) => setTeacherForm({...teacherForm, first_name: e.target.value})} className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none text-sm focus:border-[#2D428B]" />
                <input type="text" placeholder="Last Name" required value={teacherForm.last_name} onChange={(e) => setTeacherForm({...teacherForm, last_name: e.target.value})} className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none text-sm focus:border-[#2D428B]" />
              </div>
              <input type="email" placeholder="Email Address" required value={teacherForm.email} onChange={(e) => setTeacherForm({...teacherForm, email: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none text-sm focus:border-[#2D428B]" />
              <input type="tel" placeholder="Phone Number" required value={teacherForm.phone} onChange={(e) => setTeacherForm({...teacherForm, phone: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none text-sm focus:border-[#2D428B]" />
              
              <select value={teacherForm.subject} onChange={(e) => setTeacherForm({...teacherForm, subject: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none text-sm focus:border-[#2D428B] cursor-pointer text-gray-600">
                <option value="English">English Teacher</option>
                <option value="French">French Teacher</option>
                <option value="German">German Teacher</option>
                <option value="Spanish">Spanish Teacher</option>
              </select>

              <div className="mt-4">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Upload CV (PDF)</label>
                <input type="file" accept=".pdf" onChange={(e) => setCvFile(e.target.files[0])} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-[#2D428B] hover:file:bg-blue-100 cursor-pointer" />
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full mt-6 bg-[#2D428B] hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-colors cursor-pointer shadow-lg active:scale-95">
                {isSubmitting ? 'SENDING...' : 'SUBMIT APPLICATION'}
              </button>
            </form>
          </div>
        </div>
      )}

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
        <Route path="/secretary/dashboard" element={<SecretaryDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/student-parent" element={<StudentDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
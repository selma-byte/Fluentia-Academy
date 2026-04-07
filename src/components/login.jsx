import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { supabase } from '../supabaseClient'; // ⚠️ تأكدي من مسار ملف السوبابيز ديالك

const Login = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState(null);
  
  // States جديدة باش نشدو الإيميل والباسورد
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const roles = [
    { id: 'admin', title: 'Admin', desc: 'Manage all system settings', icon: '⚙️', color: 'text-red-600', bg: 'bg-red-50' },
    { id: 'secretary', title: 'Secretary', desc: 'Manage registrations & payments', icon: '💼', color: 'text-[#2D428B]', bg: 'bg-blue-50' },
    { id: 'teacher', title: 'Teacher', desc: 'Manage students & classes', icon: '👨‍🏫', color: 'text-green-600', bg: 'bg-green-50' },
    { id: 'student', title: 'Student', desc: 'View attendance & assignments', icon: '🎓', color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'parent', title: 'Parent', desc: "Monitor child's progress", icon: '❤️', color: 'text-pink-600', bg: 'bg-pink-50' },
  ];

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
    setStep(2);
    setErrorMsg(''); // تفريغ الأخطاء القديمة
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    // 1. حماية الرتب (Security Check)
    if (selectedRole === 'admin' && email !== 'admin@projet.com') {
      setErrorMsg("⚠️ This email is not authorized for Admin access.");
      setLoading(false); return;
    }
    if (selectedRole === 'secretary' && email !== 'sec@projet.com') {
      setErrorMsg("⚠️ This email is not authorized for Secretary access.");
      setLoading(false); return;
    }
    if (selectedRole === 'teacher' && email !== 'te@gmail.com') {
      setErrorMsg("⚠️ This email is not authorized for Teacher access.");
      setLoading(false); return;
    }

    // 2. التحقق من قاعدة البيانات (Supabase Auth)
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    setLoading(false);

    if (error) {
      setErrorMsg("❌ Invalid email or password!");
    } else {
      // 3. توجيه المستخدم لمكانه الصحيح بعد نجاح الدخول
      if (selectedRole === 'admin') navigate('/admin/dashboard');
      else if (selectedRole === 'secretary') navigate('/secretary/dashboard');
      else if (selectedRole === 'teacher') navigate('/teacher/dashboard');
      else navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex flex-col items-center py-12 px-4 font-sans relative">
      
      <button onClick={() => navigate('/')} className="absolute top-8 left-8 text-gray-500 hover:text-[#2D428B] font-bold flex items-center cursor-pointer transition-colors z-10">
        <span className="mr-2">←</span> Back to Home
      </button>

      <div className={`w-full max-w-md flex flex-col items-center animate-fade-in transition-all ${step === 2 ? 'blur-sm pointer-events-none' : ''}`}>
        <div className="w-16 h-16 bg-[#2D428B] rounded-full flex items-center justify-center text-3xl mb-4 text-white shadow-md">🎓</div>
        <h2 className="text-2xl font-bold text-[#0A1128] mb-1">Polyglot Portal</h2>
        <p className="text-gray-500 text-sm mb-8 text-center">Choose your role to continue</p>

        <div className="w-full space-y-4">
          {roles.map((role) => (
            <div key={role.id} className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center mb-4">
                <div className={`w-10 h-10 rounded-full ${role.bg} ${role.color} flex items-center justify-center mr-4 text-lg`}>{role.icon}</div>
                <div>
                  <h3 className="text-[#0A1128] font-bold text-sm">{role.title}</h3>
                  <p className="text-gray-500 text-xs mt-0.5">{role.desc}</p>
                </div>
              </div>
              <button onClick={() => handleRoleSelect(role.id)} className="w-full bg-[#2D428B] text-white py-3 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors cursor-pointer shadow-sm">
                Continue as {role.title}
              </button>
            </div>
          ))}
        </div>
      </div>

      {step === 2 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A1128]/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 relative shadow-2xl animate-fade-in-up border border-gray-100">
            
            <button onClick={() => setStep(1)} className="absolute top-8 left-8 text-gray-500 hover:text-[#2D428B] text-sm font-bold flex items-center transition-colors cursor-pointer">
              <span className="mr-2">←</span> Back
            </button>
            
            <div className="flex items-center mb-6 pb-6 border-b border-gray-100 mt-6">
               <div className={`w-14 h-14 rounded-2xl ${roles.find(r => r.id === selectedRole).bg} ${roles.find(r => r.id === selectedRole).color} flex items-center justify-center mr-4 text-2xl shadow-sm`}>
                  {roles.find(r => r.id === selectedRole).icon}
               </div>
               <div>
                 <h2 className="text-2xl font-bold text-[#0A1128]">Welcome Back!</h2>
                 <p className="text-gray-500 text-sm font-medium capitalize">{selectedRole} Login</p>
               </div>
            </div>

            {/* عرض رسالة الخطأ إن وجدت */}
            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-bold text-center">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-widest">Email Address</label>
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@polyglot.com" 
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-gray-900 outline-none focus:border-[#2D428B] focus:bg-white transition-all text-sm" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-widest">Password</label>
                <input 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-gray-900 outline-none focus:border-[#2D428B] focus:bg-white transition-all text-sm" 
                />
              </div>
              
              <div className="flex justify-between items-center px-2">
                <label className="flex items-center text-xs text-gray-500 cursor-pointer font-semibold">
                  <input type="checkbox" className="mr-2 rounded border-gray-300 text-[#2D428B] focus:ring-[#2D428B] w-4 h-4" /> Remember me
                </label>
                <a href="#" className="text-xs text-[#2D428B] hover:text-blue-800 font-bold transition-colors">Forgot Password?</a>
              </div>

              <button disabled={loading} type="submit" className={`w-full py-4.5 rounded-2xl font-bold text-white shadow-lg transition-all mt-4 text-base ${loading ? 'bg-gray-400' : 'bg-[#2D428B] hover:bg-blue-700 active:scale-[0.98]'}`}>
                {loading ? 'Verifying...' : 'Login'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
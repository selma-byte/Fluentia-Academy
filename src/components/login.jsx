import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { supabase } from '../supabaseClient'; // ⚠️ تأكدي من مسار ملف السوبابيز ديالك

const Login = () => {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    // 1. الدخول عن طريق سوبابيز Auth (التحقق من الإيميل وكلمة السر)
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password,
    });

    if (authError) {
      setErrorMsg("❌ الإيميل أو كلمة السر غير صحيحة!");
      setLoading(false);
      return;
    }

    const userEmail = authData.user.email; // 💡 شدينا الإيميل باش نحوسو بيه

    // 2. محرك التوجيه الذكي (Smart Routing)
    try {
      // 🔍 أ) نحوسو عليه في طابلو الإدارة والأساتذة (staff) بالإيميل
      const { data: staffData, error: staffError } = await supabase
        .from('staff')
        .select('role')
        .eq('email', userEmail) // 💡 رانا نحوسو بالإيميل دركا
        .maybeSingle();

      // 💡 إذا لقيناه في الـ staff وعندو رتبة (role)
      if (staffData && staffData.role) { 
        const role = staffData.role.toLowerCase(); // نرجعوها حروف صغار باش ما يصراش مشكل
        
        // توجيه على حساب الرتبة
        if (role === 'admin') navigate('/admin/dashboard');
        else if (role === 'secretary') navigate('/secretary/dashboard');
        else if (role === 'teacher') navigate('/teacher/dashboard');
        else {
            setErrorMsg(`⚠️ عذراً، رتبتك (${staffData.role}) غير مبرمجة في النظام.`);
            await supabase.auth.signOut();
        }
        setLoading(false);
        return; // نحبسو الكود هنا باش ما يكملش يحوس في التلاميذ
      }

      // 🔍 ب) إذا مالقيناهش في staff، نحوسو عليه في طابلو التلاميذ (students) بالإيميل
      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .select('exam_type, status')
        .eq('email', userEmail)
        .maybeSingle();

      if (studentData) {
        // 🎉 لقيناه تلميذ! نفيريفيو التاست قبل ما ندخلوه
        if (studentData.exam_type === 'Placement') {
          setErrorMsg("🛑 عذراً، يجب عليك اجتياز امتحان تحديد المستوى أولاً.");
          await supabase.auth.signOut();
          setLoading(false);
          return;
        }
        
        // التلميذ مريڨل، ندخلوه لباجتو
        navigate('/student'); 
        setLoading(false);
        return;
      }

      // 🛑 ج) إذا الإيميل والمودباس صحاح، بصح مالقيناه لا في staff لا في students!
      setErrorMsg("⚠️ هذا الحساب غير مربوط بأي دور في قاعدة البيانات.");
      await supabase.auth.signOut();

    } catch (err) {
      setErrorMsg("⚠️ حدث خطأ في النظام أثناء التحقق من صلاحياتك.");
      await supabase.auth.signOut();
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex flex-col items-center py-12 px-4 font-sans relative">
      
      <button onClick={() => navigate('/')} className="absolute top-8 left-8 text-gray-500 hover:text-[#2D428B] font-bold flex items-center cursor-pointer transition-colors z-10">
        <span className="mr-2">←</span> Back to Home
      </button>

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 relative shadow-2xl animate-fade-in-up border border-gray-100">
          
          <div className="flex flex-col items-center mb-8 pb-6 border-b border-gray-100 mt-2">
             <div className="w-16 h-16 bg-[#2D428B] rounded-full flex items-center justify-center text-3xl mb-4 text-white shadow-md">
                🎓
             </div>
             <h2 className="text-2xl font-bold text-[#0A1128]">Polyglot Portal</h2>
             <p className="text-gray-500 text-sm font-medium mt-1">Sign in to your account</p>
          </div>

          {/* عرض رسالة الخطأ إن وجدت */}
          {errorMsg && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-bold text-center animate-fade-in">
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

            <button disabled={loading} type="submit" className={`w-full py-4.5 rounded-2xl font-bold text-white shadow-lg transition-all mt-4 text-base cursor-pointer ${loading ? 'bg-gray-400' : 'bg-[#2D428B] hover:bg-blue-700 active:scale-[0.98]'}`}>
              {loading ? 'Authenticating...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
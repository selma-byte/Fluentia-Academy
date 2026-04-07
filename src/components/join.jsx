import React, { useState } from 'react';
import { supabase } from '../supabaseClient'; // تأكدي من المسار الصحيح لملف السوبابيز

const Join = ({ onBack }) => {
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState(null);

  // --- حالات حفظ البيانات من الفورم ---
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    childName: '', // خاص بولي الأمر
    childAge: '',  // خاص بولي الأمر
    course: '',
    level: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const roles = [
    { id: 'student', title: 'Student', desc: 'Enroll in language courses', icon: '🎓', color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'parent', title: 'Parent', desc: "Register your children", icon: '❤️', color: 'text-blue-500', bg: 'bg-blue-50' },
  ];

  // دالة لتحديث البيانات عند الكتابة
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // دالة إرسال البيانات لقاعدة البيانات
  const handleSubmit = async (e) => {
    e.preventDefault(); // لمنع إعادة تحميل الصفحة
    setIsSubmitting(true);

    const fullName = `${formData.lastName} ${formData.firstName}`;
    
    // تجهيز تفاصيل الابن إذا كان ولي أمر
    const extraInfo = selectedRole === 'parent' 
      ? `Child Name: ${formData.childName}, Age: ${formData.childAge}. ${formData.message}`
      : formData.message;

    const { error } = await supabase
      .from('registration_requests')
      .insert([
        { 
          full_name: fullName, 
          email: formData.email, 
          phone: formData.phone, 
          role: selectedRole, 
          course: formData.course || 'Non spécifié',
          status: 'pending'
          // إذا أضفتِ أعمدة إضافية مثل extraInfo مستقبلاً يمكنك وضعها هنا
        }
      ]);

    setIsSubmitting(false);

    if (error) {
      alert("Erreur lors de l'envoi de la demande: " + error.message);
    } else {
      alert("Demande envoyée avec succès!");
      setStep(1); // العودة للصفحة الأولى بعد النجاح
      // تفريغ الفورم
      setFormData({
        firstName: '', lastName: '', email: '', phone: '', childName: '', childAge: '', course: '', level: '', message: ''
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex flex-col items-center py-12 px-4 font-sans relative">
      
      {/* زر العودة */}
      <button onClick={onBack} className="absolute top-8 left-8 text-gray-500 hover:text-[#2D428B] font-bold flex items-center cursor-pointer transition-colors z-10">
        <span className="mr-2">←</span> Back to Home
      </button>

      {/* الصفحة الخلفية: اختيار نوع الحساب */}
      <div className="w-full max-w-md flex flex-col items-center animate-fade-in">
        <div className="w-16 h-16 bg-[#2D428B] rounded-full flex items-center justify-center text-3xl mb-4 text-white shadow-md">
          ✨
        </div>
        <h2 className="text-2xl font-bold text-[#0A1128] mb-1">Join Polyglot</h2>
        <p className="text-gray-500 text-sm mb-8 text-center">How would you like to join us?</p>

        <div className="w-full space-y-4">
          {roles.map((role) => (
            <div key={role.id} className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center mb-4">
                <div className={`w-10 h-10 rounded-full ${role.bg} ${role.color} flex items-center justify-center mr-4 text-lg`}>
                  {role.icon}
                </div>
                <div>
                  <h3 className="text-[#0A1128] font-bold text-sm">{role.title}</h3>
                  <p className="text-gray-500 text-xs mt-0.5">{role.desc}</p>
                </div>
              </div>
              <button 
                onClick={() => { setSelectedRole(role.id); setStep(2); }}
                className="w-full bg-[#2D428B] text-white py-3 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors cursor-pointer shadow-sm"
              >
                Join as {role.title}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* =======================================
          نافذة التسجيل العائمة (الألوان الزرقاء الموحدة)
          ======================================= */}
      {step === 2 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A1128]/40 backdrop-blur-sm p-4 overflow-y-auto">
          
          <div className="bg-white w-full max-w-2xl rounded-3xl p-8 shadow-2xl relative my-8 animate-fade-in-up">
            
            <button onClick={() => setStep(1)} className="absolute top-6 right-6 text-gray-400 hover:text-[#0A1128] font-bold text-xl cursor-pointer">✕</button>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-[#0A1128]">Formulaire d'inscription</h2>
              <p className="text-gray-400 text-xs mt-1">S'inscrire en tant que <span className="font-bold text-[#2D428B] capitalize">{selectedRole}</span></p>
            </div>

            {/* تم تحويل الديف إلى فورم مع onSubmit */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informations personnelles */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-700 border-b border-gray-100 pb-2">Informations personnelles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Prénom *</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required placeholder="Jean" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 outline-none focus:border-[#2D428B] text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Nom *</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required placeholder="Dupont" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 outline-none focus:border-[#2D428B] text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Email *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="jean.dupont@exemple.fr" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 outline-none focus:border-[#2D428B] text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Téléphone *</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="+33 6 12 34 56 78" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 outline-none focus:border-[#2D428B] text-sm" />
                  </div>
                </div>
              </div>

              {/* قسم بيانات الابن (باللون الأزرق الفاتح) */}
              {selectedRole === 'parent' && (
                <div className="space-y-4 bg-blue-50/50 p-4 rounded-xl border border-blue-100 animate-fade-in">
                  <h3 className="text-sm font-bold text-[#2D428B] border-b border-blue-200 pb-2 flex items-center">
                    <span className="mr-2">🧒</span> Informations de l'enfant
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#2D428B] mb-1">Nom et Prénom de l'enfant *</label>
                      <input type="text" name="childName" value={formData.childName} onChange={handleChange} required placeholder="Nom complet de votre enfant" className="w-full bg-white border border-blue-200 rounded-lg p-2.5 outline-none focus:border-blue-400 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#2D428B] mb-1">Âge de l'enfant *</label>
                      <input type="number" name="childAge" value={formData.childAge} onChange={handleChange} required placeholder="Âge" className="w-full bg-white border border-blue-200 rounded-lg p-2.5 outline-none focus:border-blue-400 text-sm" />
                    </div>
                  </div>
                </div>
              )}

              {/* Choix de la formation */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-700 border-b border-gray-100 pb-2">Choix de la formation</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Formation souhaitée *</label>
                    <select name="course" value={formData.course} onChange={handleChange} required className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 outline-none focus:border-[#2D428B] text-sm cursor-pointer">
                      <option value="">Sélectionnez une formation</option>
                      <option value="Anglais">Anglais</option>
                      <option value="Allemand">Allemand</option>
                      <option value="Français">Français</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Niveau actuel</label>
                    <select name="level" value={formData.level} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 outline-none focus:border-[#2D428B] text-sm cursor-pointer">
                      <option value="">Sélectionnez votre niveau</option>
                      <option value="Débutant">Débutant (A1)</option>
                      <option value="Intermédiaire">Intermédiaire (B1)</option>
                      <option value="Avancé">Avancé (C1)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Message ou questions (optionnel)</label>
                <textarea name="message" value={formData.message} onChange={handleChange} rows="3" placeholder="Avez-vous des questions..." className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 outline-none focus:border-[#2D428B] text-sm resize-none"></textarea>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`w-full py-3.5 rounded-xl font-bold text-white shadow-md transition-all cursor-pointer ${isSubmitting ? 'bg-gray-400' : 'bg-[#2D428B] hover:bg-blue-700'}`}
              >
                {isSubmitting ? 'Envoi en cours...' : 'Envoyer ma demande'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Join;
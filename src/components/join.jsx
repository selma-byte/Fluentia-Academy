import React, { useState } from 'react';
import { supabase } from '../supabaseClient'; // تأكدي من المسار الصحيح لملف السوبابيز

const Join = ({ onBack }) => {
  // ردينا الرول الافتراضي هو 'student' ونحينا الـ step لأننا في صفحة وحدة
  const [selectedRole, setSelectedRole] = useState('student');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // دالة لتحديث البيانات عند الكتابة
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
        const { error } = await supabase
            .from('students') // نبعتو لجدول students ديريكت
            .insert([{
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                language: formData.course, // ربطناها بـ course لي في الفورم
                level: formData.level,
                // نبعتو بيانات الطفل إذا كان ولي أمر (تأكدي من وجودهم في قاعدة البيانات)
                child_name: selectedRole === 'parent' ? formData.childName : null,
                child_age: selectedRole === 'parent' ? formData.childAge : null,
                exam_type: 'Placement', // يروح أوتوماتيكياً كـ Placement
                status: 'Pending',      // طلب جديد
                enrollment_date: new Date().toISOString().split('T')[0]
            }]);

        if (error) throw error;

        alert("Votre demande a été envoyée avec succès !");
        
        // تفريغ الفورميلار بعد الإرسال
        setFormData({ firstName: '', lastName: '', email: '', phone: '', childName: '', childAge: '', course: '', level: '', message: '' });
        setSelectedRole('student'); // نرجعوه طالب بعد الإرسال

    } catch (err) {
        alert("Erreur: " + err.message);
    } finally {
        setIsSubmitting(false);
    }
  }; 

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex flex-col items-center py-12 px-4 font-sans relative">
      
      {/* زر العودة */}
      <button onClick={onBack} className="absolute top-8 left-8 text-gray-500 hover:text-[#2D428B] font-bold flex items-center cursor-pointer transition-colors z-10">
        <span className="mr-2">←</span> Back to Home
      </button>

      {/* نافذة التسجيل المباشرة */}
      <div className="bg-white w-full max-w-2xl rounded-3xl p-8 shadow-xl relative animate-fade-in-up mt-8">
        
        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-[#2D428B] rounded-full flex items-center justify-center text-3xl mx-auto mb-4 text-white shadow-md">
            ✨
          </div>
          <h2 className="text-2xl font-bold text-[#0A1128]">Formulaire d'inscription</h2>
          <p className="text-gray-400 text-sm mt-1">Rejoignez Polyglot dès aujourd'hui</p>
        </div>

        {/* أزرار اختيار نوع المستخدم (طالب أو ولي أمر) */}
        <div className="flex bg-gray-100 p-1 rounded-xl mb-8">
          <button
            type="button"
            onClick={() => setSelectedRole('student')}
            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all cursor-pointer ${selectedRole === 'student' ? 'bg-white text-[#2D428B] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            🎓 Je suis Étudiant
          </button>
          <button
            type="button"
            onClick={() => setSelectedRole('parent')}
            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all cursor-pointer ${selectedRole === 'parent' ? 'bg-white text-[#2D428B] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            ❤️ Je suis Parent
          </button>
        </div>

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

          {/* قسم بيانات الابن (يظهر فقط إذا كان ولي أمر) */}
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
  );
};

export default Join;
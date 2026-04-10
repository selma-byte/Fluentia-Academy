import React, { useState } from 'react';

const TeacherApplicant = () => {
  // 1. بيانات المتقدمين (الطلبات الجديدة)
  const [applicants, setApplicants] = useState([
    { 
      id: 1, 
      name: "Dr. Sarah Ahmed", 
      language: "English", 
      level: "C2 / Native", 
      experience: "8 Years", 
      email: "sarah.a@school.com", 
      phone: "+213 555 12 34 56",
      education: "PhD in English Linguistics - Oxford University",
      bio: "Expert in TOEFL/IELTS preparation with a focus on communicative language teaching. Developed 3 customized curriculums for business English.",
      status: "Pending" 
    },
    { 
      id: 2, 
      name: "Prof. Mourad Ben", 
      language: "French", 
      level: "DALF C1", 
      experience: "5 Years", 
      email: "mourad.b@school.com", 
      phone: "+213 661 88 99 00",
      education: "Master's in FLE - University of Algiers",
      bio: "Specialized in teaching French for professional purposes (FOS). Experienced in using interactive digital tools in classrooms.",
      status: "Pending" 
    }
  ]);

  // 2. الأساتذة المقبولين
  const [acceptedTeachers, setAcceptedTeachers] = useState([]);

  // 3. حالة التحكم في نافذة السيرة الذاتية (CV Modal)
  const [viewingCV, setViewingCV] = useState(null);

  // دالة القبول
  const handleAccept = (applicant) => {
    setAcceptedTeachers([...acceptedTeachers, { ...applicant, status: "Accepted", joinDate: new Date().toLocaleDateString() }]);
    setApplicants(applicants.filter(a => a.id !== applicant.id));
    setViewingCV(null); // إغلاق النافذة إذا كانت مفتوحة
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 p-4">
      
      {/* العنوان */}
      <div className="mb-10">
        <h2 className="text-4xl font-black text-[#1A2252] mb-2 italic tracking-tight">Teacher Applicants</h2>
        <p className="text-gray-400 font-bold italic text-sm">Review applications and view profile details.</p>
      </div>

      {/* --- الجدول الأول: المتقدمون الجدد --- */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden mb-12">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
          <h3 className="font-black text-[#1A2252] italic flex items-center gap-2">
            <span className="bg-blue-600 w-2 h-6 rounded-full"></span>
            New Applicants
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] font-black text-gray-400 uppercase tracking-widest italic border-b border-gray-50">
                <th className="px-8 py-5">Applicant Info</th>
                <th className="px-6 py-5">Language/Level</th>
                <th className="px-6 py-5 text-center">View Profile</th>
                <th className="px-8 py-5 text-right">Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {applicants.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50/80 transition-all group">
                  <td className="px-8 py-5">
                    <div className="font-bold text-[#1A2252]">{app.name}</div>
                    <div className="text-[10px] text-gray-400 font-bold">{app.email}</div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black">{app.language}</span>
                    <span className="ml-2 text-[10px] text-gray-400 font-bold italic">{app.level}</span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    {/* زر عرض الملف الشخصي */}
                    <button 
                      onClick={() => setViewingCV(app)}
                      className="text-2xl hover:scale-125 transition-transform cursor-pointer bg-gray-100 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto shadow-sm hover:bg-white hover:shadow-md"
                    >
                      📄
                    </button>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleAccept(app)} className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-xl text-[10px] font-black italic shadow-md cursor-pointer transition-all">ACCEPT</button>
                      <button className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white px-5 py-2 rounded-xl text-[10px] font-black italic cursor-pointer transition-all">REJECT</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- النافذة المنبثقة: واجهة عرض السيرة الذاتية (CV Profile Interface) --- */}
      {viewingCV && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#1A2252]/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden relative">
            
            {/* إغلاق */}
            <button onClick={() => setViewingCV(null)} className="absolute top-6 right-8 text-2xl text-gray-300 hover:text-red-500 transition-colors cursor-pointer">✕</button>

            <div className="flex flex-col md:flex-row h-full">
              {/* الجزء الأيسر (صورة ومعلومات سريعة) */}
              <div className="w-full md:w-1/3 bg-[#F8FAFC] p-8 flex flex-col items-center border-r border-gray-100 text-center">
                <div className="w-24 h-24 bg-[#1A2252] rounded-[2rem] flex items-center justify-center text-white text-3xl font-black mb-4 shadow-xl shadow-blue-900/20">
                  {viewingCV.name.charAt(0)}
                </div>
                <h4 className="text-xl font-black text-[#1A2252] italic mb-1">{viewingCV.name}</h4>
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-6">{viewingCV.language} Teacher</p>
                
                <div className="space-y-4 w-full text-left">
                  <div className="bg-white p-3 rounded-2xl border border-gray-100">
                    <p className="text-[9px] text-gray-400 font-black uppercase">Experience</p>
                    <p className="text-xs font-bold text-[#1A2252]">{viewingCV.experience}</p>
                  </div>
                  <div className="bg-white p-3 rounded-2xl border border-gray-100">
                    <p className="text-[9px] text-gray-400 font-black uppercase">Phone</p>
                    <p className="text-xs font-bold text-[#1A2252]">{viewingCV.phone}</p>
                  </div>
                </div>
              </div>

              {/* الجزء الأيمن (التفاصيل العميقة) */}
              <div className="w-full md:w-2/3 p-10">
                <h5 className="text-xs font-black text-gray-300 uppercase tracking-[0.2em] mb-4 italic">Academic Background</h5>
                <p className="text-sm font-bold text-[#1A2252] mb-8 leading-relaxed">{viewingCV.education}</p>

                <h5 className="text-xs font-black text-gray-300 uppercase tracking-[0.2em] mb-4 italic">Professional Biography</h5>
                <div className="bg-blue-50/50 p-6 rounded-[2rem] border border-blue-100/50 mb-10">
                   <p className="text-sm text-gray-600 italic font-medium leading-loose">"{viewingCV.bio}"</p>
                </div>

                <div className="flex gap-4">
                   <button onClick={() => handleAccept(viewingCV)} className="flex-1 bg-[#1A2252] text-white py-4 rounded-2xl font-black italic text-sm shadow-xl hover:bg-blue-900 transition-all cursor-pointer">
                     CONFIRM HIRE ➔
                   </button>
                   <button onClick={() => setViewingCV(null)} className="px-8 bg-gray-100 text-gray-400 py-4 rounded-2xl font-black italic text-sm hover:bg-gray-200 transition-all cursor-pointer">
                     CLOSE
                   </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- الجدول الثاني: الأساتذة المقبولون (يظهر فقط عند وجود بيانات) --- */}
      {acceptedTeachers.length > 0 && (
        <div className="bg-[#1A2252] rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
          <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/5">
            <h3 className="font-black text-white italic flex items-center gap-2">
              <span className="bg-green-400 w-2 h-6 rounded-full"></span>
              Newly Accepted Teachers
            </h3>
          </div>
          <div className="p-6">
            <table className="w-full text-white">
              <thead>
                <tr className="text-[10px] font-black text-gray-500 uppercase italic">
                  <th className="px-6 py-4 text-left">Teacher</th>
                  <th className="px-6 py-4 text-left">Join Date</th>
                  <th className="px-6 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {acceptedTeachers.map((teacher) => (
                  <tr key={teacher.id}>
                    <td className="px-6 py-5 font-bold italic">{teacher.name}</td>
                    <td className="px-6 py-5 text-sm text-gray-400">{teacher.joinDate}</td>
                    <td className="px-6 py-5 text-right font-black text-green-400 text-xs italic tracking-widest">ACCEPTED ✅</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherApplicant;
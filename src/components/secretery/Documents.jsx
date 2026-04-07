import React, { useState } from 'react';

const Documents = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [selectedDocId, setSelectedDocId] = useState('enrollment');
  const [isGenerated, setIsGenerated] = useState(false);

  const [formData, setFormData] = useState({
    searchQuery: '',
    fullName: '',
    courseLevel: '',
    date: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // قائمة المستندات الكاملة
  const documentsList = [
    { id: 'enrollment', category: 'ACADEMIC DOCUMENTS', title: 'Enrollment Certificate', desc: 'Official certificate confirming student enrollment', target: 'Student' },
    { id: 'completion', category: 'ACADEMIC DOCUMENTS', title: 'Level Completion Certificate', desc: 'Certificate for completed language level', target: 'Student' },
    { id: 'transcript', category: 'ACADEMIC DOCUMENTS', title: 'Grade Report / Transcript', desc: 'Official academic transcript and grades', target: 'Student' },
    { id: 'placement', category: 'ACADEMIC DOCUMENTS', title: 'Placement Test Result', desc: 'Student placement test results and level', target: 'Student' },
    
    { id: 'receipt', category: 'ADMINISTRATIVE DOCUMENTS', title: 'Payment Receipt', desc: 'Official payment receipt for tuition fees', target: 'Admin' },
    { id: 'warning', category: 'ADMINISTRATIVE DOCUMENTS', title: 'Absence Warning Letter', desc: 'Formal warning for excessive absences', target: 'Admin' },
    { id: 'schedule', category: 'ADMINISTRATIVE DOCUMENTS', title: 'Personal Schedule', desc: 'Personalized class schedule for student', target: 'Student' },
    
    { id: 'work_cert', category: 'FACULTY DOCUMENTS', title: 'Work Certificate', desc: 'Official employment verification certificate', target: 'Faculty' },
    { id: 'payslip', category: 'FACULTY DOCUMENTS', title: 'Payslip', desc: 'Monthly salary statement and breakdown', target: 'Faculty' },
  ];

  // التصفية: إذا كان التبويب All، اعرض كل شيء. وإلا اعرض ما يطابق التبويب
  const filteredDocs = activeTab === 'All' ? documentsList : documentsList.filter(doc => doc.target === activeTab);

  // التجميع حسب الفئة
  const groupedDocs = filteredDocs.reduce((acc, doc) => {
    if (!acc[doc.category]) acc[doc.category] = [];
    acc[doc.category].push(doc);
    return acc;
  }, {});

  const selectedDocDetails = documentsList.find(doc => doc.id === selectedDocId);

  const handleSelectDoc = (id) => {
    setSelectedDocId(id);
    setIsGenerated(false);
  };

  const handleGenerate = (e) => {
    e.preventDefault();
    setIsGenerated(true);
  };

  const renderPreview = () => {
    if (selectedDocId === 'completion') {
      return (
         <div className="bg-[#f0ebe1] p-10 outline outline-[12px] outline-[#e6decb] shadow-xl w-full max-w-2xl mx-auto flex flex-col items-center text-center">
            <div className="border border-[#c2b28f] w-full h-full p-8 flex flex-col items-center justify-center">
                <p className="font-serif italic text-gray-600 mb-1" style={{fontFamily: "'Playfair Display', serif"}}>Company Name</p>
                <p className="text-xs tracking-widest text-gray-500 mb-8 uppercase">The Course or Training Module Name</p>
                <h1 className="text-4xl font-serif text-black tracking-wider mb-2" style={{fontFamily: "'Playfair Display', serif"}}>CERTIFICATE</h1>
                <h2 className="text-2xl font-serif text-black mb-8" style={{fontFamily: "'Playfair Display', serif"}}>OF COMPLETION</h2>
                <p className="text-sm text-gray-700 mb-6 max-w-md mx-auto font-medium">Our company is pleased<br/>to be able to award this certificate to</p>
                <h3 className="text-4xl italic text-black mb-6 border-b border-gray-400 pb-2 w-3/4 mx-auto" style={{fontFamily: "'Great Vibes', cursive"}}>
                  {formData.fullName || 'Era Reichert'}
                </h3>
                <p className="text-sm text-gray-700 mb-12 max-w-md mx-auto font-medium">Upon the Successful Completion of Your Course Name,<br/>Module, Level or Grade</p>
                <div className="flex justify-between w-full items-end mt-4 px-4">
                  <div className="text-center w-1/3">
                    <p className="text-sm font-bold border-b border-gray-400 pb-1 mb-1">{formData.date || 'March 10 2025'}</p>
                    <p className="text-xs italic text-gray-600 font-serif">Date awarded</p>
                  </div>
                  <div className="w-16 h-16 rounded-full bg-[#c9b585] flex items-center justify-center border-4 border-white shadow-md text-white font-bold text-xs uppercase">Logo</div>
                  <div className="text-center w-1/3">
                    <p className="text-sm border-b border-gray-400 pb-1 mb-1">Alf Director</p>
                    <p className="text-xs italic text-gray-600 font-serif">Name / Position</p>
                  </div>
                </div>
            </div>
         </div>
      );
    }

    if (selectedDocId === 'receipt') {
      return (
        <div className="bg-white p-12 shadow-xl w-full max-w-2xl mx-auto border border-gray-200">
           <div className="flex justify-between items-start border-b-8 border-gray-600 pb-4 mb-10">
              <div className="w-12 h-12 bg-gray-800 text-white flex items-center justify-center font-bold text-2xl">T.</div>
              <div className="text-right text-xs text-gray-600">
                 <p className="font-bold text-gray-800 uppercase">TOLEDO, OH 43601</p>
                 <p>INQUIRE@BRANDOPIA.MAIL</p>
                 <p>WWW.TEMPLATE.NET</p>
                 <p>222 555 7777</p>
              </div>
           </div>
           <h2 className="text-2xl font-bold text-center mb-8">School Receipt</h2>
           <div className="text-sm space-y-2 mb-8">
              <p><span className="font-bold">Date:</span> {formData.date || 'January 15, 2050'}</p>
              <p><span className="font-bold">Receipt No.:</span> 12345</p>
           </div>
           <div className="text-sm space-y-2 mb-8">
              <p><span className="font-bold">Received From:</span></p>
              <p className="font-bold">{formData.fullName || 'Bennie Goodwin'}</p>
              <p><span className="font-bold">Payment Type:</span> Cash</p>
              <p><span className="font-bold">Payment for:</span> Tuition Fees for Spring 2050</p>
           </div>
           <table className="w-full text-sm border-collapse mb-10">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left py-2 px-4 text-gray-500 font-medium">Description</th>
                  <th className="text-right py-2 px-4 text-gray-500 font-medium">Amount (USD)</th>
                </tr>
              </thead>
              <tbody>
                 <tr className="border-b border-gray-200">
                    <td className="py-3 px-4">Tuition Fee (Spring 2050)</td>
                    <td className="py-3 px-4 text-right">$2,500.00</td>
                 </tr>
                 <tr className="border-b border-gray-200">
                    <td className="py-3 px-4">Activity Fee</td>
                    <td className="py-3 px-4 text-right">$150.00</td>
                 </tr>
                 <tr className="border-b border-gray-400">
                    <td className="py-3 px-4">Library Fee</td>
                    <td className="py-3 px-4 text-right">$50.00</td>
                 </tr>
                 <tr>
                    <td className="py-4 px-4 font-bold">Total</td>
                    <td className="py-4 px-4 text-right font-bold">$2,700.00</td>
                 </tr>
              </tbody>
           </table>
           <div className="text-sm space-y-2 mb-8">
             <p><span className="font-bold">Payment Method:</span> Credit Card</p>
             <p><span className="font-bold">Payment Date:</span> {formData.date || 'January 15, 2050'}</p>
           </div>
           <p className="text-xs text-gray-600 mt-12 border-t border-gray-200 pt-4">
             Thank you for your payment. For any further inquiries, please contact us at <strong>[YOUR EMAIL]</strong> or call <strong>[YOUR COMPANY NUMBER]</strong>.
           </p>
        </div>
      );
    }

    if (selectedDocId === 'enrollment') {
      return (
        <div className="bg-white p-12 shadow-xl w-full max-w-2xl mx-auto border border-gray-200 text-center">
            <div className="flex justify-between items-start mb-10">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-800 font-bold text-xs shadow-inner">Logo</div>
                <div className="text-center">
                   <p className="text-[10px] font-bold text-gray-600 uppercase">Department of Education</p>
                   <p className="text-[9px] text-gray-500 uppercase">Region IX, Zamboanga Peninsula</p>
                   <p className="text-[9px] text-gray-500 uppercase">Division of Zamboanga City</p>
                   <p className="text-[9px] text-gray-500 uppercase">Ayala District</p>
                   <p className="text-xs font-bold text-black uppercase mt-1">TULUNGATUNG ELEMENTARY SCHOOL</p>
                   <p className="text-[9px] text-gray-500">Zamboanga City</p>
                </div>
                <div className="w-16 font-bold text-red-600 text-xl tracking-tighter">DepED</div>
            </div>
            <h2 className="text-xl font-bold tracking-widest mb-12 uppercase">CERTIFICATE OF ENROLMENT</h2>
            <p className="text-sm leading-relaxed text-justify mb-6">
                This is to certify that <strong>{formData.fullName ? formData.fullName.toUpperCase() : 'CORONEL, MICHAELA BIALILLA'}</strong> with <span className="underline font-bold">LRN: 126098150022</span> is officially enrolled in GRADE VI-RIZADA at Tulungatung Elementary School, Cawit District, Zamboanga City Division, School Year 2022-2023.
            </p>
            <p className="text-sm leading-relaxed text-justify mb-6">
                This certification is issued upon request purposely to avail the DSWD Educational Assistance.
            </p>
            <p className="text-sm leading-relaxed text-justify mb-16">
               Issued on this {formData.date ? formData.date : '26th day of August, 2022'} at Tulungatung Elementary School, Tulungatung, Zamboanga City, Philippines.
            </p>
            <div className="flex justify-end mb-12">
               <div className="text-center">
                  <p className="font-bold text-sm">MARIA ALELI E. RIZADA</p>
                  <p className="text-xs text-gray-600">Adviser</p>
               </div>
            </div>
            <div className="text-left mt-8">
               <p className="text-xs mb-4">Noted by:</p>
               <p className="font-bold text-sm">ZOSIMO T. BEIRA JR.</p>
               <p className="text-xs text-gray-600">ESHT IV</p>
            </div>
        </div>
      );
    }
     
     return (
        <div className="bg-white p-12 shadow-xl w-full max-w-2xl mx-auto border border-gray-200">
           <h2 className="text-2xl font-bold text-center mb-8 border-b pb-4">{selectedDocDetails.title}</h2>
           <p className="mb-4"><span className="font-bold">Name:</span> {formData.fullName || '[Student Name]'}</p>
           <p className="mb-4"><span className="font-bold">Course/Level:</span> {formData.courseLevel || '[Course Level]'}</p>
           <p className="mb-8"><span className="font-bold">Date:</span> {formData.date || '[Date]'}</p>
           <div className="p-6 bg-gray-50 border-l-4 border-blue-600 text-gray-600 italic">
              This is a generated placeholder for {selectedDocDetails.title}. 
              The official template details will be rendered here.
           </div>
        </div>
     );
  };

  return (
    <div className="animate-fade-in w-full flex flex-col relative text-[#0A1128] bg-gray-50 min-h-[700px]">
      
      {/* Layout Main Container */}
      <div className="flex w-full h-[800px] shadow-sm rounded-xl overflow-hidden border border-gray-200">
         
         {/* ========== Left Sidebar (Document List) ========== */}
         <div className="w-[340px] bg-white border-r border-gray-200 flex flex-col h-full shrink-0">
            
            <div className="p-6 pb-2 shrink-0">
               <div className="relative mb-6">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">🔍</span>
                  <input type="text" placeholder="Search documents..." className="w-full bg-gray-100 border-none rounded-full py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all" />
               </div>

               <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-full mb-4">
                  {['All', 'Student', 'Faculty', 'Admin'].map(tab => (
                     <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)} 
                        className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === tab ? 'bg-white text-[#0A1128] shadow-sm' : 'text-gray-500 hover:text-[#0A1128]'}`}
                     >
                        {tab}
                     </button>
                  ))}
               </div>
            </div>

            {/* هنا يكمن السر: قمنا بتثبيت ارتفاع القائمة لتسمح بالتمرير (Scroll) */}
            <div className="overflow-y-auto flex-1 custom-scrollbar px-4 pb-4">
               {Object.keys(groupedDocs).map((category) => (
                  <div key={category} className="mb-6">
                     <h4 className="text-[10px] font-bold text-gray-800 uppercase tracking-wider mb-2 ml-2">{category}</h4>
                     <div className="space-y-1">
                        {groupedDocs[category].map((doc) => (
                           <button
                              key={doc.id}
                              onClick={() => handleSelectDoc(doc.id)}
                              className={`w-full text-left p-3 rounded-xl transition-all flex items-start ${
                                 selectedDocId === doc.id 
                                    ? 'bg-[#2563eb] text-white shadow-md' 
                                    : 'bg-transparent text-[#0A1128] hover:bg-gray-50'
                              }`}
                           >
                              <div className={`mr-3 mt-0.5 w-5 h-5 flex items-center justify-center opacity-80 ${selectedDocId === doc.id ? 'text-white' : 'text-blue-600'}`}>
                                 📄 
                              </div>
                              <div>
                                 <p className={`font-bold text-xs mb-0.5 ${selectedDocId === doc.id ? 'text-white' : 'text-[#0A1128]'}`}>
                                    {doc.title}
                                 </p>
                                 <p className={`text-[10px] leading-snug line-clamp-2 ${selectedDocId === doc.id ? 'text-blue-100' : 'text-gray-500'}`}>
                                    {doc.desc}
                                 </p>
                              </div>
                           </button>
                        ))}
                     </div>
                  </div>
               ))}
            </div>
         </div>

         {/* ========== Right Side (Form & Preview) ========== */}
         <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#f4f7f6]"> 
            
            {/* Header Top Buttons */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-white shrink-0">
               <div>
                  <h2 className="text-xl font-bold text-[#0A1128] mb-1">Document Center</h2>
               </div>
               <div className="flex space-x-3">
                  <button disabled={!isGenerated} className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center ${isGenerated ? 'bg-[#eff6ff] text-[#2563eb] hover:bg-blue-100 border border-blue-200 shadow-sm' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                     <span className="mr-2">📥</span> Export PDF
                  </button>
                  <button disabled={!isGenerated} className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center ${isGenerated ? 'bg-[#eff6ff] text-[#2563eb] hover:bg-blue-100 border border-blue-200 shadow-sm' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                     <span className="mr-2">🖨️</span> Print
                  </button>
               </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
               
               {/* --- Center: Form Column --- */}
               <div className="w-1/2 min-w-[400px] border-r border-gray-200 bg-white p-10 flex flex-col overflow-y-auto custom-scrollbar">
                  
                  <div className="mb-8">
                     <h2 className="text-2xl font-bold text-[#0A1128] mb-1">{selectedDocDetails?.title}</h2>
                     <p className="text-xs text-gray-500">{selectedDocDetails?.desc}</p>
                  </div>

                  <form onSubmit={handleGenerate} className="space-y-8 flex-1">
                     
                     <div>
                        <label className="block text-xs font-bold text-[#0A1128] mb-2">Search by Name or ID</label>
                        <div className="flex space-x-2">
                           <div className="relative flex-1">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">🔍</span>
                              <input type="text" placeholder="Enter student/faculty..." className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 transition-colors" />
                           </div>
                           <button type="button" className="bg-gray-100 hover:bg-gray-200 text-[#0A1128] px-5 rounded-lg text-xs font-bold transition-colors">
                              Search
                           </button>
                        </div>
                     </div>

                     <div>
                        <label className="block text-xs font-bold text-[#0A1128] mb-2">Full Name</label>
                        <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full bg-transparent border-b border-gray-300 py-2 outline-none focus:border-blue-500 text-[#0A1128] text-sm transition-colors" />
                     </div>

                     <div>
                        <label className="block text-xs font-bold text-[#0A1128] mb-2">Course & Level / Role</label>
                        <input type="text" name="courseLevel" value={formData.courseLevel} onChange={handleInputChange} className="w-full bg-transparent border-b border-gray-300 py-2 outline-none focus:border-blue-500 text-[#0A1128] text-sm transition-colors" />
                     </div>

                     <div>
                        <label className="block text-xs font-bold text-[#0A1128] mb-2">Date</label>
                        <input type="text" name="date" value={formData.date} onChange={handleInputChange} placeholder="DD/MM/YYYY" className="w-full bg-transparent border-b border-gray-300 py-2 outline-none focus:border-blue-500 text-[#0A1128] text-sm transition-colors" />
                     </div>

                     <div className="mt-auto pt-10 pb-4">
                        <button type="submit" className="w-[200px] bg-[#2563eb] hover:bg-blue-700 text-white py-3 rounded-full font-bold text-sm shadow-sm transition-colors mx-auto block">
                           Generate Document
                        </button>
                     </div>
                  </form>
               </div>

               {/* --- Right: Preview Column --- */}
               <div className="flex-1 bg-gray-100 flex flex-col items-center justify-center p-8 overflow-y-auto custom-scrollbar relative">
                  
                  <div className="absolute top-4 left-4">
                     <p className="text-xs font-bold text-gray-500">Document Preview</p>
                  </div>

                  {!isGenerated ? (
                     <div className="flex flex-col items-center text-gray-400 mt-10">
                        <span className="text-5xl mb-4 opacity-50">📄</span>
                        <h3 className="font-bold text-[#0A1128] mb-2">No Document Yet</h3>
                        <p className="text-xs text-center max-w-xs leading-relaxed">
                           Select a document template, search for a student or faculty member, and click "Generate Document" to view the document here.
                        </p>
                     </div>
                  ) : (
                     <div className="w-full flex justify-center animate-fade-in mt-10">
                        {renderPreview()}
                     </div>
                  )}

               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Documents;
import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

const Documents = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [selectedDocId, setSelectedDocId] = useState('enrollment');
  const [isGenerated, setIsGenerated] = useState(false);
  const [loading, setLoading] = useState(false);

  // نظام التوليد: فردي أو جماعي (فوج كامل)
  const [generationMode, setGenerationMode] = useState('Single'); // 'Single' or 'Bulk'
  const [classesData, setClassesData] = useState([]);
  
  // 💡 States جديدة للبحث الذكي (Smart Search)
  const [allStudents, setAllStudents] = useState([]);
  const [allStaff, setAllStaff] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  
  // البيانات التي سيتم عرضها (مصفوفة لأننا قد نطبع لفوج كامل)
  const [previewDataList, setPreviewDataList] = useState([]);

  const [formData, setFormData] = useState({
    fullName: '',
    courseLevel: '',
    date: new Date().toLocaleDateString('en-GB'),
    groupId: '',
    personId: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 💡 جلب كل البيانات اللازمة للبحث الذكي والطباعة الجماعية
  useEffect(() => {
    const fetchData = async () => {
      const { data: classes } = await supabase.from('classes').select('*');
      if (classes) setClassesData(classes);

      const { data: students } = await supabase.from('students').select('*').eq('status', 'Active');
      if (students) setAllStudents(students);

      const { data: staff } = await supabase.from('staff').select('*');
      if (staff) setAllStaff(staff);
    };
    fetchData();
  }, []);

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

  const filteredDocs = activeTab === 'All' ? documentsList : documentsList.filter(doc => doc.target === activeTab);
  const groupedDocs = filteredDocs.reduce((acc, doc) => {
    if (!acc[doc.category]) acc[doc.category] = [];
    acc[doc.category].push(doc);
    return acc;
  }, {});

  const selectedDocDetails = documentsList.find(doc => doc.id === selectedDocId);

  // 💡 تنظيف البحث عند تغيير المستند
  const handleSelectDoc = (id) => {
    setSelectedDocId(id);
    setIsGenerated(false);
    setPreviewDataList([]);
    setSearchQuery('');
    setShowDropdown(false);
    setFormData(prev => ({ ...prev, fullName: '', courseLevel: '', groupId: '', personId: '' }));
  };

  // 💡 منطق البحث الذكي
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (!query.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    const lowerQuery = query.toLowerCase();
    let results = [];

    // إذا كان المستند خاص بالأساتذة، نبحث في جدول staff
    if (selectedDocDetails?.target === 'Faculty') {
      results = allStaff.filter(s => 
        (s.first_name + ' ' + s.last_name).toLowerCase().includes(lowerQuery)
      ).map(s => ({
        id: s.id,
        displayName: `${s.first_name} ${s.last_name}`,
        details: `${s.role} - ${s.department}`, // 💡 الأستاذ ما عندوش مستوى، عندو دور وقسم
        type: 'Staff'
      }));
    } 
    // إذا كان للطلاب أو الإدارة، نبحث في جدول students
    else {
      results = allStudents.filter(s => 
        (s.first_name + ' ' + s.last_name).toLowerCase().includes(lowerQuery) || 
        String(s.id).includes(lowerQuery)
      ).map(s => ({
        id: s.id,
        displayName: `${s.first_name} ${s.last_name}`,
        details: `${s.language} - ${s.level}`, // 💡 الطالب عندو لغة ومستوى
        type: 'Student'
      }));
    }

    setSearchResults(results);
    setShowDropdown(true);
  };

  // 💡 التعبئة التلقائية عند اختيار شخص من البحث
  const handleSelectPerson = (person) => {
    setFormData(prev => ({
      ...prev,
      fullName: person.displayName,
      courseLevel: person.details,
      personId: person.id
    }));
    setSearchQuery(person.displayName);
    setShowDropdown(false);
  };

  // دالة التوليد
  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (generationMode === 'Single') {
      if (!formData.fullName) {
        alert("Please search and select a person first.");
        setLoading(false);
        return;
      }
      setPreviewDataList([{
        fullName: formData.fullName,
        courseLevel: formData.courseLevel,
        date: formData.date || new Date().toLocaleDateString('en-GB'),
        id: formData.personId || '0000'
      }]);
    } else {
      if (!formData.groupId) {
        alert("Please select a group first.");
        setLoading(false);
        return;
      }
      
      const selectedClass = classesData.find(c => c.id === formData.groupId);
      const { data: students } = await supabase
        .from('students')
        .select('*')
        .eq('group_name', selectedClass.name)
        .eq('status', 'Active');

      if (students && students.length > 0) {
        const bulkData = students.map(s => ({
          fullName: `${s.first_name} ${s.last_name}`,
          courseLevel: `${s.language} - ${s.level}`,
          date: formData.date,
          id: s.id
        }));
        setPreviewDataList(bulkData);
      } else {
        alert("No active students found in this group.");
        setPreviewDataList([]);
      }
    }
    
    setIsGenerated(true);
    setLoading(false);
  };

  const handlePrint = () => {
    window.print();
  };

  // ==========================================
  // 🎨 تصاميم المستندات
  // ==========================================
  const renderDocumentTemplate = (data, index) => {
    let content = null;

    if (selectedDocId === 'completion') {
      content = (
         // 💡 التصميم تم تعديله ليناسب الـ aspect ratio بدون أن يخرج من الإطار
         <div className="bg-[#f0ebe1] p-4 md:p-8 outline outline-[8px] outline-[#e6decb] w-full aspect-[1.414/1] max-w-3xl mx-auto flex flex-col relative overflow-hidden">
            <div className="border border-[#c2b28f] w-full h-full p-6 flex flex-col items-center justify-center text-center">
                <p className="font-serif italic text-gray-600 mb-1 text-xs md:text-sm" style={{fontFamily: "'Playfair Display', serif"}}>Language Institute</p>
                <p className="text-[10px] md:text-xs tracking-widest text-gray-500 mb-6 uppercase">{data.courseLevel}</p>
                <h1 className="text-3xl md:text-5xl font-serif text-black tracking-wider mb-2" style={{fontFamily: "'Playfair Display', serif"}}>CERTIFICATE</h1>
                <h2 className="text-xl md:text-2xl font-serif text-black mb-6 md:mb-8" style={{fontFamily: "'Playfair Display', serif"}}>OF COMPLETION</h2>
                <p className="text-xs md:text-sm text-gray-700 mb-4 max-w-sm mx-auto font-medium">This is to proudly certify that</p>
                <h3 className="text-3xl md:text-5xl italic text-black mb-6 border-b border-gray-400 pb-2 w-3/4 mx-auto" style={{fontFamily: "'Great Vibes', cursive"}}>
                  {data.fullName}
                </h3>
                <p className="text-xs md:text-sm text-gray-700 mb-8 max-w-sm mx-auto font-medium">Has successfully completed the required coursework<br/>and assessments for this level.</p>
                
                <div className="flex justify-between w-full items-end mt-auto px-4 md:px-12">
                  <div className="text-center w-1/4 md:w-1/3">
                    <p className="text-xs md:text-sm font-bold border-b border-gray-400 pb-1 mb-1">{data.date}</p>
                    <p className="text-[8px] md:text-[10px] uppercase text-gray-500">Issue Date</p>
                  </div>
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-[#c9b585] flex items-center justify-center border-4 border-white text-white font-bold text-[8px] md:text-xs uppercase shadow-sm">Seal</div>
                  <div className="text-center w-1/4 md:w-1/3">
                    <p className="text-xs md:text-sm font-bold border-b border-gray-400 pb-1 mb-1" style={{fontFamily: "'Great Vibes', cursive"}}>Director Sign</p>
                    <p className="text-[8px] md:text-[10px] uppercase text-gray-500">Institute Director</p>
                  </div>
                </div>
            </div>
         </div>
      );
    } 
    
    else if (selectedDocId === 'receipt') {
      content = (
        <div className="bg-white p-12 w-full max-w-2xl mx-auto border border-gray-200">
           <div className="flex justify-between items-start border-b-4 border-gray-800 pb-4 mb-10">
              <div className="w-12 h-12 bg-gray-800 text-white flex items-center justify-center font-bold text-2xl">L.</div>
              <div className="text-right text-xs text-gray-600">
                 <p className="font-bold text-gray-800 uppercase">LANGUAGE INSTITUTE</p>
                 <p>admin@institute.edu</p>
                 <p>+213 555 7777</p>
              </div>
           </div>
           <h2 className="text-2xl font-black text-center mb-8 uppercase tracking-widest text-gray-800">Payment Receipt</h2>
           <div className="flex justify-between text-sm mb-8 bg-gray-50 p-4 rounded-lg">
              <div>
                 <p><span className="font-bold text-gray-500">Date:</span> {data.date}</p>
                 <p><span className="font-bold text-gray-500">Receipt No.:</span> RCP-{Math.floor(Math.random() * 90000) + 10000}</p>
              </div>
              <div className="text-right">
                 <p><span className="font-bold text-gray-500">Received From:</span></p>
                 <p className="font-bold text-base">{data.fullName}</p>
              </div>
           </div>
           <table className="w-full text-sm border-collapse mb-10">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="text-left py-3 px-4 font-bold uppercase text-xs">Description</th>
                  <th className="text-right py-3 px-4 font-bold uppercase text-xs">Amount (DZD)</th>
                </tr>
              </thead>
              <tbody>
                 <tr className="border-b border-gray-200">
                    <td className="py-4 px-4 font-medium">{data.courseLevel} - Tuition Fee</td>
                    <td className="py-4 px-4 text-right">4,500.00</td>
                 </tr>
                 <tr className="border-b border-gray-200 bg-gray-50">
                    <td className="py-4 px-4 font-medium">Registration / Admin Fee</td>
                    <td className="py-4 px-4 text-right">500.00</td>
                 </tr>
                 <tr>
                    <td className="py-4 px-4 font-black text-right text-gray-600 uppercase">Total Paid</td>
                    <td className="py-4 px-4 text-right font-black text-lg">5,000.00</td>
                 </tr>
              </tbody>
           </table>
           <div className="text-xs text-gray-500 text-center border-t border-gray-200 pt-6 mt-12">
             Thank you for your payment. This receipt is computer generated and does not require a physical signature.
           </div>
        </div>
      );
    } 
    
    else if (selectedDocId === 'transcript') {
      content = (
        <div className="bg-white p-12 w-full max-w-2xl mx-auto border border-gray-200">
          <div className="text-center mb-8 border-b-2 border-blue-900 pb-6">
             <h1 className="text-2xl font-black uppercase text-blue-900 tracking-wider">Academic Transcript</h1>
             <p className="text-sm text-gray-500 mt-1">Official Grade Report</p>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
             <div><span className="font-bold text-gray-500">Student Name:</span> <span className="font-bold">{data.fullName}</span></div>
             <div className="text-right"><span className="font-bold text-gray-500">Student ID:</span> STD-{data.id}</div>
             <div><span className="font-bold text-gray-500">Course Level:</span> {data.courseLevel}</div>
             <div className="text-right"><span className="font-bold text-gray-500">Issue Date:</span> {data.date}</div>
          </div>
          <table className="w-full text-sm border border-gray-300 mb-8">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b border-r border-gray-300 text-left">Module / Skill</th>
                <th className="py-2 px-4 border-b border-gray-300 text-center">Score</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="py-3 px-4 border-b border-r border-gray-300">Reading Comprehension</td><td className="py-3 px-4 border-b border-gray-300 text-center font-bold">85%</td></tr>
              <tr><td className="py-3 px-4 border-b border-r border-gray-300">Listening & Speaking</td><td className="py-3 px-4 border-b border-gray-300 text-center font-bold">92%</td></tr>
              <tr><td className="py-3 px-4 border-b border-r border-gray-300">Writing & Grammar</td><td className="py-3 px-4 border-b border-gray-300 text-center font-bold">78%</td></tr>
              <tr className="bg-gray-50"><td className="py-3 px-4 border-r border-gray-300 font-bold text-right uppercase">Final Average</td><td className="py-3 px-4 text-center font-black text-lg text-blue-700">85.0%</td></tr>
            </tbody>
          </table>
          <div className="flex justify-between mt-16 pt-8 border-t border-gray-200">
             <div className="text-center w-1/3"><div className="border-b border-gray-800 mb-2"></div><p className="text-xs font-bold uppercase text-gray-500">Academic Director</p></div>
             <div className="text-center w-1/3"><div className="border-b border-gray-800 mb-2"></div><p className="text-xs font-bold uppercase text-gray-500">School Stamp</p></div>
          </div>
        </div>
      );
    }
    
    else if (selectedDocId === 'placement') {
      content = (
        <div className="bg-white p-12 w-full max-w-2xl mx-auto border-8 border-double border-blue-900/10 relative overflow-hidden">
          <div className="absolute top-10 right-10 text-6xl opacity-5">🎯</div>
          <h2 className="text-3xl font-black text-center text-blue-900 mb-2 uppercase">Placement Result</h2>
          <p className="text-center text-gray-500 mb-10 text-sm">Language Proficiency Assessment</p>
          
          <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100 mb-8">
            <p className="text-sm text-gray-600 mb-1">Candidate Name:</p>
            <p className="text-xl font-bold text-[#0A1128] border-b border-blue-200 pb-3 mb-3">{data.fullName}</p>
            <div className="flex justify-between text-sm">
               <p><span className="text-gray-500">Test Date:</span> {data.date}</p>
               <p><span className="text-gray-500">Language:</span> {data.courseLevel.split('-')[0] || 'English'}</p>
            </div>
          </div>
          
          <div className="text-center my-12">
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Assigned Level</p>
            <div className="inline-block px-10 py-4 bg-green-50 border-2 border-green-500 text-green-700 font-black text-5xl rounded-2xl shadow-sm">
               {data.courseLevel.split('-')[1] || 'B1'}
            </div>
            <p className="text-xs text-gray-500 mt-4 max-w-sm mx-auto">Based on the assessment, the candidate has demonstrated proficiency fitting for the above level.</p>
          </div>
        </div>
      );
    }
    
    else if (selectedDocId === 'warning') {
      content = (
        <div className="bg-white p-12 w-full max-w-2xl mx-auto border border-gray-200">
          <div className="text-right text-sm text-gray-600 mb-10">{data.date}</div>
          <h2 className="text-xl font-black uppercase text-red-700 tracking-wider mb-8 border-b-2 border-red-700 pb-2 inline-block">Absence Warning Notice</h2>
          <p className="text-sm mb-6"><b>To:</b> {data.fullName}<br/><b>Course:</b> {data.courseLevel}</p>
          <div className="text-sm leading-relaxed text-justify space-y-4 text-gray-800">
             <p>Dear Student,</p>
             <p>This letter serves as a formal warning regarding your recent attendance record. According to our registers, you have accumulated a significant number of unexcused absences in the current session.</p>
             <p>Regular attendance is crucial for your academic progress and is a mandatory requirement of our institute's policy. Failure to attend classes regularly may result in disciplinary action, up to and including suspension from the course without a refund.</p>
             <p>Please contact the administration office immediately to discuss this matter and provide any necessary justifications for your absences.</p>
             <p>Sincerely,</p>
          </div>
          <div className="mt-12 pt-6">
             <p className="font-bold text-sm">Administration Department</p>
             <p className="text-xs text-gray-500">Language Institute</p>
          </div>
        </div>
      );
    }
    
    else if (selectedDocId === 'schedule') {
      content = (
        <div className="bg-white p-12 w-full max-w-2xl mx-auto border border-gray-200">
          <div className="bg-[#0A1128] text-white p-6 rounded-t-xl">
             <h2 className="text-2xl font-bold mb-1">Personal Schedule</h2>
             <p className="text-sm opacity-80">{data.fullName} | {data.courseLevel}</p>
          </div>
          <div className="p-6 border border-t-0 border-gray-200 rounded-b-xl">
             <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 font-bold text-gray-500 w-24">Monday</td>
                    <td className="py-4 font-bold">10:00 - 12:00</td>
                    <td className="py-4 text-right text-gray-500">Room 4</td>
                  </tr>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <td className="py-4 font-bold text-gray-500 px-2">Wednesday</td>
                    <td className="py-4 font-bold px-2">10:00 - 12:00</td>
                    <td className="py-4 text-right text-gray-500 px-2">Room 4</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 font-bold text-gray-500">Friday</td>
                    <td className="py-4 font-bold">14:00 - 16:00</td>
                    <td className="py-4 text-right text-gray-500">Lab 1</td>
                  </tr>
                </tbody>
             </table>
             <p className="text-xs text-center text-gray-400 mt-8 italic">Valid from {data.date}. Subject to change.</p>
          </div>
        </div>
      );
    }
    
    else if (selectedDocId === 'work_cert') {
      content = (
        <div className="bg-white p-12 w-full max-w-2xl mx-auto border border-gray-200">
           <div className="text-center mb-12">
             <h1 className="text-2xl font-black uppercase tracking-widest border-b-4 border-[#0A1128] pb-2 inline-block">Work Certificate</h1>
           </div>
           <div className="text-sm leading-relaxed text-justify space-y-6 text-gray-800">
             <p>To Whom It May Concern,</p>
             <p>This is to certify that <b>{data.fullName}</b> is currently employed at our institute in the capacity of <b>{data.courseLevel}</b>.</p>
             <p>They have been a part of our faculty and have demonstrated excellent professional conduct and dedication to their duties. This certificate is issued upon the employee's request for administrative purposes.</p>
             <div className="mt-16">
               <p className="mb-1 text-gray-600">Issued on: <b>{data.date}</b></p>
             </div>
           </div>
           <div className="flex justify-end mt-16 pt-8 border-t border-gray-200">
             <div className="text-center">
               <p className="font-bold text-sm">Human Resources</p>
               <p className="text-xs text-gray-500">Institute Directorate</p>
             </div>
           </div>
        </div>
      );
    }
    
    else if (selectedDocId === 'payslip') {
      content = (
        <div className="bg-white p-10 w-full max-w-2xl mx-auto border border-gray-300">
          <div className="flex justify-between items-end border-b-2 border-gray-800 pb-4 mb-6">
             <div>
               <h2 className="text-2xl font-black uppercase text-gray-800">Payslip</h2>
               <p className="text-xs font-bold text-gray-500 mt-1">Pay Period: {data.date}</p>
             </div>
             <div className="text-right text-xs text-gray-600">Language Institute<br/>Administration</div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-8 bg-gray-50 p-4 rounded border border-gray-200 text-sm">
             <div><span className="text-gray-500 font-bold">Employee Name:</span><br/>{data.fullName}</div>
             <div className="text-right"><span className="text-gray-500 font-bold">Position:</span><br/>{data.courseLevel}</div>
          </div>
          <table className="w-full text-sm border-collapse mb-6">
             <thead className="bg-gray-200">
               <tr>
                 <th className="py-2 px-4 text-left border border-gray-300">Earnings</th>
                 <th className="py-2 px-4 text-right border border-gray-300">Amount</th>
               </tr>
             </thead>
             <tbody>
               <tr>
                 <td className="py-2 px-4 border border-gray-300">Basic Salary</td>
                 <td className="py-2 px-4 text-right border border-gray-300 font-medium">85,000 DZD</td>
               </tr>
               <tr>
                 <td className="py-2 px-4 border border-gray-300">Allowances</td>
                 <td className="py-2 px-4 text-right border border-gray-300 font-medium">5,000 DZD</td>
               </tr>
               <tr className="bg-gray-100">
                 <td className="py-2 px-4 text-left border border-gray-300 font-bold">Deductions</td>
                 <td className="py-2 px-4 border border-gray-300"></td>
               </tr>
               <tr>
                 <td className="py-2 px-4 border border-gray-300">Tax / Social Security</td>
                 <td className="py-2 px-4 text-right border border-gray-300 text-red-600">- 8,000 DZD</td>
               </tr>
               <tr>
                 <td className="py-3 px-4 border border-gray-800 font-black uppercase">Net Pay</td>
                 <td className="py-3 px-4 text-right border border-gray-800 font-black text-lg">82,000 DZD</td>
               </tr>
             </tbody>
          </table>
          <p className="text-[10px] text-center text-gray-400 mt-8">Confidential Document. System Generated.</p>
        </div>
      );
    }
    
    // Enrollment (Default)
    else {
      content = (
        <div className="bg-white p-12 w-full max-w-2xl mx-auto border border-gray-200 text-center">
            <h2 className="text-xl font-bold tracking-widest mb-12 uppercase">CERTIFICATE OF ENROLMENT</h2>
            <p className="text-sm leading-relaxed text-justify mb-6">
                This is to certify that <strong>{data.fullName.toUpperCase()}</strong> is officially enrolled in the course level <span className="underline font-bold">{data.courseLevel}</span> for the current academic session.
            </p>
            <p className="text-sm leading-relaxed text-justify mb-16">
               Issued on this {data.date} at the Administration Office.
            </p>
            <div className="flex justify-end mb-12">
               <div className="text-center">
                  <p className="font-bold text-sm">Administration</p>
                  <p className="text-xs text-gray-600">Director</p>
               </div>
            </div>
        </div>
      );
    }

    return (
      <div key={index} className="print:break-after-page mb-10 print:mb-0 shadow-lg print:shadow-none bg-white">
        {content}
      </div>
    );
  };

  return (
    <div className="animate-fade-in w-full flex flex-col relative text-[#0A1128] bg-gray-50 h-full">
      
      {/* Layout Main Container */}
      <div className="flex w-full h-[800px] shadow-sm rounded-xl overflow-hidden border border-gray-200 print:h-auto print:border-none print:shadow-none print:block">
         
         {/* ========== Left Sidebar (Document List) ========== */}
         <div className="w-[340px] bg-white border-r border-gray-200 flex flex-col h-full shrink-0 print:hidden">
            <div className="p-6 pb-2 shrink-0">
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
         <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#f4f7f6] print:block print:bg-white print:w-full print:h-auto"> 
            
            <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-white shrink-0 print:hidden">
               <div>
                  <h2 className="text-xl font-bold text-[#0A1128] mb-1">Document Center</h2>
               </div>
               <div className="flex space-x-3">
                  <button onClick={handlePrint} disabled={!isGenerated || previewDataList.length === 0} className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center ${isGenerated && previewDataList.length > 0 ? 'bg-[#0A1128] text-white hover:bg-gray-800 shadow-sm cursor-pointer' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                     <span className="mr-2">🖨️</span> Print Document(s)
                  </button>
               </div>
            </div>

            <div className="flex-1 flex overflow-hidden print:overflow-visible print:block">
               
               {/* --- Center: Form Column --- */}
               <div className="w-1/2 min-w-[400px] border-r border-gray-200 bg-white p-10 flex flex-col overflow-y-auto custom-scrollbar print:hidden">
                  
                  <div className="mb-8">
                     <h2 className="text-2xl font-bold text-[#0A1128] mb-1">{selectedDocDetails?.title}</h2>
                     <p className="text-xs text-gray-500">{selectedDocDetails?.desc}</p>
                  </div>

                  {/* أزرار اختيار نوع الطباعة (للطلاب فقط) */}
                  {(selectedDocDetails?.target === 'Student') && (
                    <div className="flex bg-gray-100 p-1 rounded-xl mb-8">
                       <button type="button" onClick={() => {setGenerationMode('Single'); setIsGenerated(false)}} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${generationMode === 'Single' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}>Single Student</button>
                       <button type="button" onClick={() => {setGenerationMode('Bulk'); setIsGenerated(false)}} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${generationMode === 'Bulk' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}>Entire Group (Bulk)</button>
                    </div>
                  )}

                  <form onSubmit={handleGenerate} className="space-y-8 flex-1">
                     
                     {generationMode === 'Single' || selectedDocDetails?.target !== 'Student' ? (
                       <>
                         <div className="relative">
                            <label className="block text-xs font-bold text-[#0A1128] mb-2">Search {selectedDocDetails?.target}</label>
                            <div className="flex space-x-2">
                               <div className="relative flex-1">
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">🔍</span>
                                  {/* 💡 حقل البحث الذكي */}
                                  <input 
                                    type="text" 
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    placeholder="Enter name or ID..." 
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500" 
                                  />
                                  
                                  {/* 💡 قائمة النتائج المنبثقة (Dropdown) */}
                                  {showDropdown && searchResults.length > 0 && (
                                    <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-200 shadow-lg max-h-48 overflow-y-auto rounded-lg">
                                      {searchResults.map(person => (
                                        <li 
                                          key={person.id} 
                                          onClick={() => handleSelectPerson(person)}
                                          className="px-4 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-0"
                                        >
                                          <p className="text-sm font-bold text-gray-800">{person.displayName}</p>
                                          <p className="text-xs text-gray-500">{person.details}</p>
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                  {showDropdown && searchResults.length === 0 && searchQuery && (
                                     <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-200 shadow-lg rounded-lg p-3">
                                       <li className="text-xs text-gray-500 text-center">No results found</li>
                                     </ul>
                                  )}
                               </div>
                            </div>
                         </div>
                         
                         {/* 💡 الحقول تعمرت تلقائيا من البحث فأصبحت ReadOnly */}
                         <div>
                            <label className="block text-xs font-bold text-[#0A1128] mb-2">Full Name</label>
                            <input type="text" name="fullName" value={formData.fullName} readOnly placeholder="Auto-filled from search" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 outline-none text-gray-600 text-sm font-medium cursor-not-allowed" />
                         </div>
                         <div>
                            <label className="block text-xs font-bold text-[#0A1128] mb-2">Course & Level / Role</label>
                            <input type="text" name="courseLevel" value={formData.courseLevel} readOnly placeholder="Auto-filled from search" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 outline-none text-gray-600 text-sm font-medium cursor-not-allowed" />
                         </div>
                       </>
                     ) : (
                       <div>
                         <label className="block text-xs font-bold text-[#0A1128] mb-2">Select Group (Class)</label>
                         <select name="groupId" value={formData.groupId} onChange={handleInputChange} required className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 px-4 text-sm outline-none focus:border-blue-500 font-bold cursor-pointer">
                            <option value="">-- Choose a group to generate for all students --</option>
                            {classesData.map(c => (
                              <option key={c.id} value={c.id}>{c.name} - {c.language} ({c.level})</option>
                            ))}
                         </select>
                         <p className="text-[10px] text-gray-500 mt-2">💡 A separate document will be generated for every active student in this group.</p>
                       </div>
                     )}

                     <div>
                        <label className="block text-xs font-bold text-[#0A1128] mb-2">Date to Display</label>
                        <input type="text" name="date" value={formData.date} onChange={handleInputChange} placeholder="DD/MM/YYYY" required className="w-full bg-transparent border-b border-gray-300 py-2 outline-none focus:border-blue-500 text-[#0A1128] text-sm" />
                     </div>

                     <div className="mt-auto pt-10 pb-4">
                        <button type="submit" disabled={loading} className="w-[200px] bg-[#2563eb] hover:bg-blue-700 text-white py-3 rounded-full font-bold text-sm shadow-sm transition-colors mx-auto block cursor-pointer">
                           {loading ? 'Generating...' : (generationMode === 'Bulk' ? 'Generate For Group' : 'Generate Document')}
                        </button>
                     </div>
                  </form>
               </div>

               {/* --- Right: Preview Column --- */}
               <div className="flex-1 bg-gray-200/50 flex flex-col items-center p-8 overflow-y-auto custom-scrollbar relative print:block print:bg-white print:w-full print:p-0 print:overflow-visible">
                  
                  <div className="sticky top-0 left-0 w-full mb-6 print:hidden z-10">
                     <p className="text-xs font-bold text-gray-500 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full w-max mx-auto shadow-sm">
                        {previewDataList.length > 0 ? `Previewing ${previewDataList.length} Page(s)` : 'Document Preview'}
                     </p>
                  </div>

                  {!isGenerated ? (
                     <div className="flex flex-col items-center justify-center h-full text-gray-400 mt-10 print:hidden">
                        <span className="text-5xl mb-4 opacity-50">📄</span>
                        <h3 className="font-bold text-[#0A1128] mb-2">No Document Yet</h3>
                        <p className="text-xs text-center max-w-xs leading-relaxed">
                           Select a document template, fill the details, and click "Generate Document" to view the preview here.
                        </p>
                     </div>
                  ) : (
                     <div className="w-full flex flex-col items-center animate-fade-in print:block print:w-full">
                        {previewDataList.map((data, index) => renderDocumentTemplate(data, index))}
                     </div>
                  )}

               </div>
            </div>
         </div>
    </div>
  </div> );
};

export default Documents;
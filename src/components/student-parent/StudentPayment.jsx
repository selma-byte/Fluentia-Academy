import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

const Icons = {
  Download: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>,
  Search: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
  Info: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>,
  Check: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
};

const StudentPayment = () => {
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  
  // States الحقيقية
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [studentInfo, setStudentInfo] = useState({
    name: 'Loading...',
    id: '---',
    program: '---',
    balance: '0 DZD',
    status: 'Pending'
  });
  const [loading, setLoading] = useState(true);

  // ==========================================
  // 💡 Fetch Payment Data from Supabase
  // ==========================================
  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // 1. نجيبو معلومات الطالب وحالة الدفع من طابلو students
        const { data: student } = await supabase
          .from('students')
          .select('first_name, last_name, level, language, status, id')
          .eq('email', user.email)
          .single();

        if (student) {
          const fullName = `${student.first_name || ''} ${student.last_name || ''}`.trim();
          const studentStatus = student.status || 'Pending';

          setStudentInfo({
            name: fullName,
            id: `STD-${student.id || '2026'}`,
            program: `${student.language || 'Language'} (${student.level || 'Level'})`,
            balance: studentStatus.toLowerCase() === 'paid' ? '0 DZD' : 'Pending Payment',
            status: studentStatus // 'Paid', 'Scheduled', etc.
          });

          // 2. نجيبو تاريخ الدفعات من طابلو payments
          // ⚠️ افتراض أن طابلو payments فيه student_name أو email
          const { data: payments } = await supabase
            .from('payments')
            .select('*')
            .eq('student_name', fullName) // تأكدي بلي الخانة هادي صحيحة في الداتا باز
            .order('created_at', { ascending: false });

          if (payments && payments.length > 0) {
            const formattedPayments = payments.map((p, idx) => {
              // تحديد حالة الخلاص (إذا كاين montant مسجل معنتها مخلص)
              let payStatus = p.status || 'Verified';
              if (payStatus.toLowerCase() === 'unpaid' || payStatus.toLowerCase() === 'pending') {
                payStatus = 'Pending';
              } else {
                payStatus = 'Verified';
              }

              return {
                id: p.id || idx,
                date: new Date(p.created_at || p.date).toLocaleDateString('en-GB'),
                amount: p.amount ? `${p.amount} DZD` : 'TBD',
                transactionId: p.transaction_id || `PAY-${Math.floor(100000 + Math.random() * 900000)}`,
                status: payStatus,
                label: p.type || p.description || 'Course Installment'
              };
            });
            setPaymentHistory(formattedPayments);
          }
        }
      } catch (err) {
        console.error("Error fetching financial data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFinancialData();
  }, []);

  return (
    <div className="flex-1 flex flex-col space-y-10 animate-fadeIn pr-2 pb-12">
      
      {/* HEADER HERO */}
      <div className="bg-[#EBE9F1] rounded-[45px] p-12 flex justify-between items-center relative overflow-hidden min-h-[220px] shadow-sm">
        <div className="z-10 w-full md:w-3/5">
          <p className="text-[#4318FF] text-[10px] font-black tracking-[0.4em] uppercase mb-2">Financial Services</p>
          <h2 className="text-3xl font-black text-[#1B254B] mb-4 uppercase tracking-tighter leading-none">Tuition & Billing Center</h2>
          <p className="text-[#1B254B]/60 text-sm mb-10 leading-relaxed font-bold max-w-lg uppercase tracking-widest opacity-70">
            Monitor your balances, download verified tax receipts, and access the secure portal for tuition installment plans.
          </p>
          <button className="bg-[#111C44] text-white px-10 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-black active:scale-95 transition-all flex items-center gap-3">
            <Icons.Download /> Financial Statement
          </button>
        </div>
        <div className="absolute right-[-20px] bottom-[-20px] opacity-10 text-[240px] font-black pointer-events-none select-none italic leading-none">P</div>
      </div>

      {loading ? (
        <div className="py-20 text-center font-black text-[#A3AED0] animate-pulse uppercase tracking-widest">Loading Financial Data...</div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
          
          {/* LEFT COLUMN */}
          <div className="xl:col-span-2 space-y-10">
            
            {/* LEDGER CARD */}
            <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-50">
              <div className="flex items-center gap-4 mb-10">
                 <div className="w-2 h-8 bg-[#4318FF] rounded-full"></div>
                 <h3 className="text-xl font-black text-[#1B254B] uppercase tracking-widest">Enrollment Ledger</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  {[
                    { label: "Holder Name", value: studentInfo.name },
                    { label: "Student Ref", value: studentInfo.id },
                    { label: "Active Tracks", value: studentInfo.program },
                    { label: "Account Status", value: studentInfo.status },
                  ].map((info, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-50 group cursor-help">
                      <span className="text-[10px] font-black text-[#A3AED0] uppercase tracking-widest">{info.label}</span>
                      <span className={`text-[13px] font-black uppercase transition-colors ${
                        info.label === 'Account Status' 
                          ? (info.value.toLowerCase() === 'paid' ? 'text-green-500' : 'text-orange-500')
                          : 'text-[#1B254B] group-hover:text-[#4318FF]'
                      }`}>
                        {info.value}
                      </span>
                    </div>
                  ))}
                </div>

                <div className={`p-8 rounded-[35px] border flex flex-col justify-center text-center relative overflow-hidden group cursor-pointer hover:shadow-xl transition-all active:scale-95 ${
                  studentInfo.status.toLowerCase() === 'paid' 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-[#F4F7FE] border-[#4318FF]/5'
                }`}>
                  <p className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 ${
                    studentInfo.status.toLowerCase() === 'paid' ? 'text-green-600' : 'text-[#4318FF]'
                  }`}>
                    {studentInfo.status.toLowerCase() === 'paid' ? 'Balance Settled' : 'Total Outstanding'}
                  </p>
                  <p className={`text-3xl font-black tracking-tighter italic leading-none mb-4 group-hover:scale-110 transition-transform ${
                    studentInfo.status.toLowerCase() === 'paid' ? 'text-green-500' : 'text-red-600'
                  }`}>
                    {studentInfo.balance}
                  </p>
                  
                  {studentInfo.status.toLowerCase() !== 'paid' && (
                    <div className="flex justify-center items-center gap-2 text-[9px] font-black text-[#A3AED0] uppercase tracking-widest border border-red-100 rounded-full px-4 py-1 w-fit mx-auto bg-white/50">
                      Settlement Required
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* DETAILED BREAKDOWN (Static for now as requested by typical design) */}
            <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100">
               <h3 className="text-[11px] font-black text-[#1B254B] uppercase tracking-[0.3em] mb-10 border-b border-gray-50 pb-5">Fee Distribution Matrix</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                 {[
                   { label: `${studentInfo.program} Track`, cost: "Assigned Fee", code: "LANG-CORE" },
                   { label: "Core Admin Fees", cost: "Included", code: "ADM-X" },
                   { label: "Multimedia Library", cost: "Included", code: "LIB-M" },
                 ].map((item, i) => (
                   <div key={i} className="flex justify-between items-center group cursor-pointer p-4 hover:bg-[#F4F7FE] rounded-2xl transition-all">
                     <div className="flex flex-col">
                         <span className="text-[13px] font-black text-[#1B254B] uppercase tracking-tight group-hover:text-[#4318FF]">{item.label}</span>
                         <span className="text-[9px] font-bold text-[#A3AED0]">{item.code}</span>
                     </div>
                     <span className="text-[14px] font-black text-[#1B254B] italic">{item.cost}</span>
                   </div>
                 ))}
               </div>
               <div className="mt-12 p-8 bg-blue-50/40 rounded-[35px] border border-[#4318FF]/10 flex items-center gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-[#4318FF] shadow-lg shrink-0"><Icons.Info /></div>
                  <p className="text-[11px] font-bold text-[#4318FF] leading-relaxed uppercase tracking-widest">
                    Cycle Note: Semester fees are non-refundable after the second session. Please contact the Billing Office for partial installment plans.
                  </p>
               </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-10">
            <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-50 flex flex-col h-full">
              <div className="flex flex-col gap-6 mb-10">
                <h3 className="text-2xl font-black text-[#1B254B] uppercase tracking-widest leading-none">History</h3>
                <div className="relative group">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#4318FF] transition-colors"><Icons.Search /></span>
                  <input 
                    type="text" 
                    placeholder="Reference Search..." 
                    className="w-full bg-[#F4F7FE] border-none rounded-2xl py-4 pl-14 pr-4 text-xs font-bold text-[#1B254B] outline-none focus:ring-2 focus:ring-[#4318FF]/10 transition-all"
                  />
                </div>
              </div>

              {paymentHistory.length > 0 ? (
                <div className="space-y-5">
                  {paymentHistory.map((item) => (
                    <div 
                        key={item.id} 
                        onClick={() => setSelectedReceipt(item)}
                        className="p-6 bg-white rounded-[32px] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group cursor-pointer flex flex-col gap-5 active:scale-95"
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <p className="text-[15px] font-black text-[#1B254B] tracking-tighter italic uppercase leading-none">{item.amount}</p>
                          <p className="text-[10px] font-black text-[#A3AED0] uppercase tracking-widest">{item.date}</p>
                        </div>
                        <span className={`px-4 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest shadow-inner flex items-center gap-2 ${
                          item.status === 'Verified' ? 'bg-[#05CD99]/10 text-[#05CD99]' : 'bg-amber-500/10 text-amber-600'
                        }`}>
                          <Icons.Check /> {item.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-5 border-t border-gray-50">
                        <p className="text-[9px] font-mono font-bold text-[#A3AED0] uppercase">{item.transactionId}</p>
                        <div className="text-[#4318FF] text-[9px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                           Open PDF →
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-center p-6 text-gray-400">
                   <p className="text-xs font-bold uppercase tracking-widest">No payment records found.</p>
                </div>
              )}

              <div className="bg-[#111C44] mt-12 p-10 rounded-[45px] shadow-2xl text-white relative overflow-hidden group cursor-pointer transition-all hover:bg-black">
                 <div className="relative z-10">
                      <h4 className="text-xl font-black mb-2 uppercase tracking-tighter">Billing Help</h4>
                      <p className="text-white/40 text-[11px] font-black mb-10 uppercase tracking-widest leading-relaxed">Having issues with online transfers or payment verification?</p>
                      <button className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-white/5">Connect with Billing</button>
                 </div>
                 <div className="absolute -right-8 -bottom-8 opacity-5 font-black text-[160px] group-hover:scale-110 transition-transform">?</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RECEIPT VIEWER MODAL */}
      {selectedReceipt && (
        <div className="fixed inset-0 bg-[#0B132B]/80 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-fadeIn" onClick={() => setSelectedReceipt(null)}>
           <div className="bg-white rounded-[50px] p-12 max-w-lg w-full shadow-2xl relative overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="absolute top-10 right-10">
                 <button onClick={() => setSelectedReceipt(null)} className="text-[#A3AED0] hover:text-[#1B254B] transition-colors font-black text-lg p-2">✕</button>
              </div>
              <p className="text-[#4318FF] text-[10px] font-black tracking-[0.4em] uppercase mb-4">Official Receipt Viewer</p>
              <h3 className="text-3xl font-black text-[#1B254B] uppercase tracking-tighter mb-10 leading-none">Record: {selectedReceipt.transactionId}</h3>
              
              <div className="p-10 bg-[#F4F7FE] rounded-[40px] border-4 border-dashed border-white flex flex-col items-center justify-center text-center space-y-4">
                 <div className="bg-[#4318FF] text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg mb-4 italic font-black">PDF</div>
                 <p className="text-xs font-black text-[#1B254B] uppercase tracking-widest">{selectedReceipt.label}</p>
                 <p className="text-[10px] font-bold text-[#A3AED0] uppercase">Amount: {selectedReceipt.amount}</p>
              </div>
              
              <button className="w-full bg-[#111C44] text-white mt-10 py-5 rounded-3xl font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl active:scale-95 transition-all">Download Verified PDF</button>
           </div>
        </div>
      )}

    </div>
  );
};

export default StudentPayment;
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
  // 💡 Database Logic - Multi-Course Support
  // ==========================================
  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // 1. نجيبو الطالب مع التسجيلات تاعو
        const { data: student } = await supabase
          .from('students')
          .select('id, first_name, last_name, level, language, status, inscriptions(cours(langue))')
          .eq('email', user.email)
          .single();

        if (student) {
          const fullName = `${student.first_name || ''} ${student.last_name || ''}`.trim();
          
          // تحديد الكورسات اللي مسجل فيهم (أو اللغة الافتراضية)
          const activeLanguages = student.inscriptions && student.inscriptions.length > 0 
            ? student.inscriptions.map(i => i.cours?.langue).join(', ')
            : student.language || 'Language';

          // 2. نجيبو الخلاص من جدول payments
          const { data: payments } = await supabase
            .from('payments')
            .select('*')
            .eq('student_id', student.id)
            .order('payment_date', { ascending: false });

          let totalPaidThisMonth = 0;
          let formattedPayments = [];

          if (payments && payments.length > 0) {
            const currentMonth = new Date().getMonth();
            const currentYear = new Date().getFullYear();

            formattedPayments = payments.map((p, idx) => {
              const payDate = new Date(p.payment_date || p.created_at);
              
              // حساب الخلاص تاع هاد الشهر
              if (payDate.getMonth() === currentMonth && payDate.getFullYear() === currentYear) {
                 totalPaidThisMonth += parseFloat(p.amount) || 0;
              }

              let payStatus = p.status || 'Verified';
              if (payStatus.toLowerCase() === 'unpaid' || payStatus.toLowerCase() === 'pending') {
                payStatus = 'Pending';
              } else {
                payStatus = 'Verified';
              }

              return {
                id: p.id || idx,
                date: payDate.toLocaleDateString('en-GB'),
                amount: p.amount ? `${p.amount} DZD` : 'TBD',
                transactionId: `PAY-${p.id.toString().substring(0,6)}`,
                status: payStatus,
                label: p.notes || 'Course Installment'
              };
            });
            setPaymentHistory(formattedPayments);
          }

          // 3. حساب الكريدي (Balance)
          // السعر الافتراضي للكورس هو 3000، نضربوه في عدد الكورسات اللي مسجل فيهم
          const numberOfCourses = student.inscriptions && student.inscriptions.length > 0 ? student.inscriptions.length : 1;
          const expectedMonthlyPayment = numberOfCourses * 3000;
          let pendingBalance = expectedMonthlyPayment - totalPaidThisMonth;
          if (pendingBalance < 0) pendingBalance = 0; // إذا خلص بالزيادة

          let accountStatus = pendingBalance === 0 ? 'Paid' : 'Pending';

          setStudentInfo({
            name: fullName,
            id: `STD-${student.id.toString().substring(0,5)}`,
            program: `${activeLanguages} (Level ${student.level || 'TBD'})`,
            balance: pendingBalance === 0 ? '0 DZD' : `${pendingBalance.toLocaleString()} DZD`,
            status: accountStatus
          });
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
    <div className="flex-1 flex flex-col xl:flex-row gap-6 animate-fadeIn pr-2 pb-8">
      
      {/* LEFT CONTENT */}
      <div className="flex-1 flex flex-col space-y-6 min-w-0">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col space-y-1 px-1">
          <h2 className="text-xl font-black text-[#1B254B] italic tracking-tight leading-none">Tuition & Billing Center</h2>
          <p className="text-[#A3AED0] text-[13px] font-medium leading-relaxed">
            Monitor balances, download verified receipts, and access secure installment portal.
          </p>
        </div>

        {loading ? (
          <div className="py-20 text-center font-black text-[#A3AED0] text-[11px] animate-pulse uppercase tracking-[0.3em]">Validating Financial Portal...</div>
        ) : (
          <>
            {/* LEDGER INFO CARD */}
            <div className="bg-white rounded-[25px] p-8 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-8 border-b border-gray-50 pb-5">
                <h3 className="text-sm font-bold text-[#1B254B] uppercase tracking-widest italic leading-none">Enrollment Ledger</h3>
                <button className="bg-[#111C44] text-white px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] shadow-lg flex items-center gap-2 active:scale-95 transition-all">
                   <Icons.Download /> Get Statement
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  {[
                    { label: "Holder", value: studentInfo.name },
                    { label: "Program", value: studentInfo.program },
                    { label: "Account", value: studentInfo.status },
                  ].map((info, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-50/50">
                      <span className="text-[9px] font-black text-[#A3AED0] uppercase tracking-widest">{info.label}</span>
                      <span className={`text-[12px] font-black uppercase italic text-right ${
                        info.label === 'Account' 
                        ? (info.value.toLowerCase() === 'paid' ? 'text-emerald-500' : 'text-orange-500')
                        : 'text-[#1B254B]'
                      }`}>{info.value}</span>
                    </div>
                  ))}
                </div>

                <div className={`p-6 rounded-[25px] border flex flex-col justify-center text-center relative group active:scale-95 transition-all ${
                  studentInfo.status.toLowerCase() === 'paid' ? 'bg-emerald-50 border-emerald-100' : 'bg-[#F4F7FE] border-indigo-50'
                }`}>
                  <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${
                    studentInfo.status.toLowerCase() === 'paid' ? 'text-emerald-600' : 'text-[#4318FF]'
                  }`}>Current Balance</p>
                  <p className={`text-2xl font-black italic tracking-tighter leading-none ${
                    studentInfo.status.toLowerCase() === 'paid' ? 'text-emerald-500' : 'text-red-500'
                  }`}>{studentInfo.balance}</p>
                </div>
              </div>
            </div>

            {/* BREAKDOWN CARD */}
            <div className="bg-white rounded-[25px] p-8 shadow-sm border border-gray-100">
                <h3 className="text-[10px] font-black text-[#1B254B] uppercase tracking-[0.3em] mb-6 border-b border-gray-50 pb-3 italic">Fee Distribution Matrix</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: `Course Fees`, cost: "3,000 DZD / Month", code: "LANG-CORE" },
                    { label: "Admin Fees", cost: "Included", code: "ADM-X" },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center p-4 bg-[#F4F7FE]/50 rounded-2xl hover:bg-[#F4F7FE] transition-colors cursor-help">
                      <div className="flex flex-col">
                          <span className="text-[11px] font-black text-[#1B254B] uppercase italic">{item.label}</span>
                          <span className="text-[8px] font-bold text-[#A3AED0]">{item.code}</span>
                      </div>
                      <span className="text-[12px] font-black text-[#1B254B] italic">{item.cost}</span>
                    </div>
                  ))}
                </div>
            </div>
          </>
        )}
      </div>

      {/* RIGHT SIDEBAR - MATCHED TO 280px */}
      <aside className="w-full xl:w-[280px] shrink-0 flex flex-col space-y-6">
        
        <div className="bg-white rounded-[25px] p-6 shadow-sm border border-gray-100 flex flex-col h-full min-h-[400px]">
          <div className="flex flex-col gap-4 mb-8">
            <h3 className="text-sm font-bold text-[#1B254B] uppercase tracking-widest italic leading-none">History</h3>
            <div className="relative group">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#4318FF] transition-colors"><Icons.Search /></span>
              <input 
                type="text" 
                placeholder="Find Reference..." 
                className="w-full bg-[#F4F7FE] border-none rounded-full py-2.5 pl-9 pr-4 text-[10px] font-bold text-[#1B254B] outline-none focus:ring-1 focus:ring-[#4318FF]/20 transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-1">
            {paymentHistory.length > 0 ? (
              paymentHistory.map((item) => (
                <div 
                    key={item.id} 
                    onClick={() => setSelectedReceipt(item)}
                    className="p-4 bg-white rounded-[20px] border border-gray-50 shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="space-y-0.5">
                      <p className="text-[13px] font-black text-[#1B254B] italic tracking-tight">{item.amount}</p>
                      <p className="text-[9px] font-black text-[#A3AED0] uppercase tracking-widest">{item.date}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-tight flex items-center gap-1 ${
                      item.status === 'Verified' ? 'bg-emerald-50 text-emerald-500' : 'bg-amber-50 text-amber-600'
                    }`}>
                      <div className={`w-1 h-1 rounded-full ${item.status === 'Verified' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                      {item.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-t border-gray-50 pt-3">
                    <p className="text-[8px] font-mono font-bold text-[#A3AED0] opacity-60 truncate max-w-[80px]">{item.transactionId}</p>
                    <div className="text-[#4318FF] text-[8px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">
                       Receipt →
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex-1 flex items-center justify-center text-center p-6">
                 <p className="text-[10px] font-bold uppercase tracking-widest text-gray-300">No payment records found.</p>
              </div>
            )}
          </div>

          <div className="bg-[#111C44] mt-8 p-6 rounded-[25px] shadow-lg text-white relative overflow-hidden group transition-all hover:bg-[#0B132B]">
             <div className="relative z-10">
                  <h4 className="text-sm font-black mb-1 uppercase tracking-tighter italic">Billing Support</h4>
                  <p className="text-white/40 text-[9px] font-black mb-6 uppercase tracking-widest leading-relaxed">Having portal or transfer issues?</p>
                  <button className="w-full py-2.5 bg-white/10 hover:bg-white rounded-xl text-[9px] font-black uppercase text-white hover:text-[#111C44] transition-all border border-white/10">Contact Office</button>
             </div>
             <div className="absolute -right-8 -bottom-8 opacity-5 font-black text-[100px] italic select-none group-hover:scale-110 transition-transform">?</div>
          </div>
        </div>
      </aside>

      {/* RECEIPT VIEWER MODAL */}
      {selectedReceipt && (
        <div className="fixed inset-0 bg-[#0B132B]/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fadeIn" onClick={() => setSelectedReceipt(null)}>
           <div className="bg-white rounded-[35px] p-10 max-w-sm w-full shadow-2xl relative overflow-hidden" onClick={e => e.stopPropagation()}>
              <button onClick={() => setSelectedReceipt(null)} className="absolute top-6 right-6 text-[#A3AED0] hover:text-[#1B254B] transition-colors font-black text-sm uppercase">✕</button>
              <p className="text-[#4318FF] text-[9px] font-black tracking-widest uppercase mb-2">Verified Voucher</p>
              <h3 className="text-xl font-black text-[#1B254B] uppercase tracking-tighter mb-8 italic leading-none">{selectedReceipt.transactionId}</h3>
              
              <div className="p-8 bg-[#F4F7FE] rounded-[30px] border-2 border-dashed border-white flex flex-col items-center justify-center text-center space-y-3">
                 <div className="bg-[#4318FF] text-white w-12 h-12 rounded-xl flex items-center justify-center shadow-lg italic font-black text-xs">PDF</div>
                 <p className="text-[11px] font-black text-[#1B254B] uppercase italic">{selectedReceipt.label}</p>
                 <p className="text-[9px] font-bold text-[#A3AED0] uppercase">Settlement: {selectedReceipt.amount}</p>
              </div>
              
              <button className="w-full bg-[#111C44] text-white mt-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl active:scale-95 transition-all">Download Receipt</button>
           </div>
        </div>
      )}

    </div>
  );
};

export default StudentPayment;
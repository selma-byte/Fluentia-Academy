import React, { useState } from 'react';

const Payment = () => {
  // حالات للتحكم في ظهور النوافذ المنبثقة
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // --- Utility: Custom Notification Logic ---
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  const paymentHistory = [
    { date: "Mar 27, 2026", member: "Carlos Rodriguez", amount: "3000 دج", status: "Paid", method: "GCash", notes: "English b2" },
    { date: "Feb 27, 2026", member: "Carlos Rodriguez", amount: "3000 دج", status: "Paid", method: "Cash", notes: "" },
    { date: "Jan 27, 2026", member: "Carlos Rodriguez", amount: "3000 دج", status: "Paid", method: "GCash", notes: "" },
    { date: "Dec 27, 2025", member: "Carlos Rodriguez", amount: "3000 دج", status: "Paid", method: "Card", notes: "" },
    { date: "Aug 8, 2025", member: "Maria Santos", amount: "3000 دج", status: "Unpaid", method: "-", notes: "" },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-white p-8 custom-scrollbar relative">
      
      {/* --- Beautiful Notification Alert --- */}
      {toast.show && (
        <div className="fixed top-10 right-10 z-[100] animate-in slide-in-from-right-8 duration-500">
          <div className="bg-[#0A1128] backdrop-blur-xl border-l-4 border-pink-500 p-6 rounded-2xl shadow-2xl flex items-center gap-4 min-w-[320px]">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
              toast.type === 'success' ? 'bg-pink-500/20 text-pink-500' : 'bg-orange-500/20 text-orange-500'
            }`}>
              {toast.type === 'success' ? '✨' : '⚠️'}
            </div>
            <div>
              <p className="text-[9px] font-black text-pink-400 uppercase tracking-widest mb-0.5 italic">System Notification</p>
              <p className="text-white font-bold italic text-sm">{toast.message}</p>
            </div>
            <button onClick={() => setToast({ ...toast, show: false })} className="ml-auto text-white/20 hover:text-white">✕</button>
          </div>
        </div>
      )}

      {/* =========================================
          1. محتوى صفحة الدفع الرئيسية
          ========================================= */}
      
      <div className="mb-8 flex justify-end">
        <button 
          onClick={() => setShowAddPaymentModal(true)} 
          className="flex items-center rounded-lg bg-[#0A1128] px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-slate-800 active:scale-95 cursor-pointer"
        >
          <span className="mr-2 text-lg">$</span> Add Payment
        </button>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        {[
          { title: "Total Income This Month", value: "6000 دج", sub: "From 2 paid members", icon: "$", color: "text-gray-400" },
          { title: "Unpaid Members", value: "2", sub: "1700 دج outstanding", icon: "👥", color: "text-gray-400" },
          { title: "Overdue Payments", value: "2", sub: "Requires immediate attention", icon: "⚠", color: "text-red-500" },
          { title: "Due Soon", value: "1", sub: "Within next 5 days", icon: "📅", color: "text-orange-400" }
        ].map((stat, i) => (
          <div key={i} className="flex h-32 flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase tracking-tight">
              <span>{stat.title}</span>
              <span className={stat.color}>{stat.icon}</span>
            </div>
            <div>
              <div className={`text-2xl font-bold ${stat.title.includes('Unpaid') || stat.title.includes('Overdue') ? 'text-red-600' : 'text-black'}`}>
                {stat.value}
              </div>
              <div className="mt-1 text-[10px] text-gray-400 font-medium">{stat.sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-8 flex items-start rounded-xl border border-red-100 bg-red-50/50 p-4 shadow-sm transition-all hover:bg-red-50 cursor-pointer">
        <span className="mr-3 mt-0.5 text-red-500">⚠</span>
        <div>
          <h4 className="text-sm font-bold text-red-800 underline-offset-2">2 members have overdue payments</h4>
          <p className="mt-1 text-xs text-red-600 font-medium">Please follow up on outstanding balances to maintain membership status.</p>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-bold text-[#0A1128]">Member Payment Status</h3>
      </div>

      <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Juan - Paid */}
        <div className="flex flex-col rounded-2xl border border-gray-200 bg-gray-50/50 shadow-sm transition-all hover:shadow-md cursor-pointer">
          <div className="relative p-6">
            <h4 className="mb-6 text-sm font-bold text-[#0A1128]">Juan Dela Cruz</h4>
            <span className="absolute right-6 top-6 flex items-center rounded bg-green-100 px-2.5 py-1 text-[10px] font-bold text-green-700">
              <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-green-500"></span> Paid
            </span>
            <div className="space-y-4 text-[11px]">
              <div>
                <div className="mb-1 flex items-center text-gray-400 font-medium tracking-tight"><span className="mr-1.5 opacity-70">📅</span> DUE DATE</div>
                <div className="font-bold text-gray-700">August 10, 2025</div>
              </div>
              <div className="flex items-center justify-between border-y border-gray-100 py-3">
                <div>
                  <div className="font-bold text-[#0A1128]">Current Balance</div>
                  <div className="text-[9px] font-bold text-green-600 uppercase">Fully Paid</div>
                </div>
                <div className="text-sm font-black text-green-600">0 دج</div>
              </div>
            </div>
          </div>
          <button onClick={() => setShowReceiptModal(true)} className="w-full border-t border-gray-200 py-3 text-xs font-bold text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors cursor-pointer">View Receipt</button>
        </div>

        {/* Maria - Overdue */}
        <div className="relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-gray-50/50 shadow-sm transition-all hover:shadow-md cursor-pointer">
          <div className="absolute left-0 top-0 h-full w-1 bg-red-500"></div>
          <div className="relative p-6 pl-7">
            <h4 className="mb-6 text-sm font-bold text-[#0A1128]">Maria Santos</h4>
            <span className="absolute right-6 top-6 flex items-center rounded bg-red-100 px-2.5 py-1 text-[10px] font-bold text-red-700">
              <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-red-500"></span> Overdue
            </span>
            <div className="space-y-4 text-[11px]">
              <div>
                <div className="mb-1 flex items-center text-gray-400 font-medium tracking-tight"><span className="mr-1.5 opacity-70">📅</span> DUE DATE</div>
                <div className="font-bold text-gray-700">August 8, 2025</div>
                <div className="mt-0.5 text-[9px] font-bold text-red-500 uppercase">231 days overdue</div>
              </div>
              <div className="flex items-center justify-between border-y border-gray-100 py-3">
                <div>
                  <div className="font-bold text-[#0A1128]">Current Balance</div>
                  <div className="text-[9px] font-bold text-red-500 uppercase">Balance Due</div>
                </div>
                <div className="text-sm font-black text-red-600">500 دج</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-3">
            <button onClick={() => setShowAddPaymentModal(true)} className="w-full rounded-lg bg-[#0A1128] py-2.5 text-xs font-bold text-white transition-all hover:bg-slate-800 active:scale-95 cursor-pointer">Pay Now</button>
          </div>
        </div>

        {/* Carlos - Due Soon */}
        <div className="relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-gray-50/50 shadow-sm transition-all hover:shadow-md cursor-pointer">
          <div className="absolute left-0 top-0 h-full w-1 bg-orange-400"></div>
          <div className="relative p-6 pl-7">
            <h4 className="mb-6 text-sm font-bold text-[#0A1128]">Carlos Rodriguez</h4>
            <span className="absolute right-6 top-6 flex items-center rounded border border-orange-100 bg-orange-50 px-2.5 py-1 text-[10px] font-bold text-orange-600">
              Due Soon
            </span>
            <div className="space-y-4 text-[11px]">
              <div>
                <div className="mb-1 flex items-center text-gray-400 font-medium tracking-tight"><span className="mr-1.5 opacity-70">📅</span> DUE DATE</div>
                <div className="font-bold text-gray-700">August 12, 2025</div>
              </div>
              <div className="flex items-center justify-between border-y border-gray-100 py-3">
                <div>
                  <div className="font-bold text-[#0A1128]">Current Balance</div>
                  <div className="text-[9px] font-bold text-green-600 uppercase">Fully Paid</div>
                </div>
                <div className="text-sm font-black text-green-600">0 دج</div>
              </div>
            </div>
          </div>
          <button onClick={() => setShowReceiptModal(true)} className="w-full border-t border-gray-200 py-3 text-xs font-bold text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors cursor-pointer">View Receipt</button>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-gray-50/30 p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-base font-bold text-[#0A1128]">Payment History & Tracking</h3>
        </div>
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50/80 text-[10px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100">
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Member</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Method</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paymentHistory.map((row, i) => (
                <tr key={i} className="group transition-colors hover:bg-indigo-50/30 cursor-pointer">
                  <td className="px-6 py-4 text-gray-500 font-medium">{row.date}</td>
                  <td className="px-6 py-4 font-bold text-[#0A1128]">{row.member}</td>
                  <td className="px-6 py-4 font-bold text-gray-600">{row.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded px-2 py-0.5 text-[9px] font-bold ${row.status === 'Paid' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{row.method}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => setShowReceiptModal(true)} className="font-bold text-gray-400 hover:text-[#0A1128] transition-colors cursor-pointer">View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>


      {/* =========================================
          2. نافذة إضافة دفع (Add Payment Modal)
          ========================================= */}
      {showAddPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl relative flex flex-col max-h-[90vh]">
            
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-[#0A1128] flex items-center"><span className="mr-2">$</span> Add Payment</h2>
              <button onClick={() => setShowAddPaymentModal(false)} className="text-gray-400 hover:text-gray-800 font-bold text-xl cursor-pointer">✕</button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Select Member</label>
                <select className="w-full bg-gray-50 border border-gray-200 text-gray-700 rounded-lg p-3 outline-none focus:border-indigo-400 cursor-pointer text-sm">
                  <option>Carlos Rodriguez</option>
                  <option>Maria Santos</option>
                  <option>Juan Dela Cruz</option>
                </select>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex justify-between items-center">
                <div className="flex items-center">
                   <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 mr-3">👤</div>
                   <div>
                     <div className="font-bold text-[#0A1128] text-sm">Carlos Rodriguez</div>
                     <div className="text-[10px] text-gray-500">Due: 12/08/2025</div>
                     <div className="mt-1 flex gap-4">
                       <div>
                         <span className="text-[10px] text-gray-400 block">Current Balance:</span>
                         <span className="text-xs font-bold text-green-600">0 دج</span>
                       </div>
                     </div>
                   </div>
                </div>
                <div className="text-right">
                    <span className="text-[10px] text-gray-400 block">Last Payment:</span>
                    <span className="text-sm font-bold text-[#0A1128]">12/07/2025</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Payment Amount (دج)</label>
                <input type="text" defaultValue="3000" className="w-full bg-gray-50 border border-gray-200 text-[#0A1128] rounded-lg p-3 outline-none focus:border-indigo-400 text-sm font-bold mb-2" />
                <button className="bg-gray-200 text-gray-700 text-xs font-bold py-1.5 px-3 rounded-lg hover:bg-gray-300 transition-colors cursor-pointer">Monthly Fee (3000 دج)</button>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Payment Method</label>
                <select className="w-full bg-gray-50 border border-gray-200 text-gray-700 rounded-lg p-3 outline-none focus:border-indigo-400 cursor-pointer text-sm">
                  <option>💳 GCash</option>
                  <option>💵 Cash</option>
                  <option>🏦 Bank Transfer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Notes (Optional)</label>
                <textarea rows="2" placeholder="bdvdwqqw..." className="w-full bg-gray-50 border border-gray-200 text-gray-700 rounded-lg p-3 outline-none focus:border-indigo-400 text-sm resize-none"></textarea>
              </div>

              <div className="bg-gray-100 rounded-xl p-4 border border-gray-200">
                <h4 className="text-sm font-bold text-[#0A1128] mb-3">Payment Summary</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between"><span className="text-gray-500 font-medium">Payment Amount:</span><span className="font-bold text-gray-700">3000 دج</span></div>
                  <div className="flex justify-between"><span className="text-gray-500 font-medium">Current Balance:</span><span className="font-bold text-gray-700">0 دج</span></div>
                  <div className="flex justify-between border-t border-gray-200 pt-2 mt-2"><span className="text-gray-800 font-bold">New Balance:</span><span className="font-bold text-green-600">0 دج</span></div>
                </div>
              </div>

            </div>

            <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-white rounded-b-2xl">
              <button onClick={() => setShowAddPaymentModal(false)} className="px-5 py-2.5 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer">Cancel</button>
              <button 
                onClick={() => {
                  setShowAddPaymentModal(false); 
                  setShowReceiptModal(true);
                  showToast("Payment recorded successfully!", "success");
                }} 
                className="px-5 py-2.5 rounded-lg text-sm font-bold bg-[#0A1128] text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Record Payment
              </button>
            </div>
          </div>
        </div>
      )}


      {/* =========================================
          3. نافذة تأكيد الدفع (Payment Success/Receipt)
          ========================================= */}
      {showReceiptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl relative flex flex-col p-8 text-center">
            
            <button onClick={() => setShowReceiptModal(false)} className="absolute top-5 right-5 text-gray-400 hover:text-gray-800 font-bold text-xl cursor-pointer">✕</button>

            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-sm border-4 border-white -mt-12">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white text-xl font-bold">✓</div>
            </div>

            <h2 className="text-2xl font-bold text-[#0A1128] mb-2">Payment Success!</h2>
            <p className="text-sm text-gray-500 font-medium mb-6">Your payment has been successfully done.</p>

            <hr className="border-gray-200 mb-6" />

            <div className="mb-6">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-widest mb-1">Total Payment</p>
                <h1 className="text-3xl font-black text-[#0A1128]">DZ 1,000,000</h1>
            </div>

            <div className="grid grid-cols-2 gap-3 text-left mb-8">
               <div className="border border-gray-200 rounded-xl p-3 bg-gray-50/50">
                 <p className="text-[10px] text-gray-500 font-medium mb-1">Ref Number</p>
                 <p className="text-xs font-bold text-[#0A1128]">000085752257</p>
               </div>
               <div className="border border-gray-200 rounded-xl p-3 bg-gray-50/50">
                 <p className="text-[10px] text-gray-500 font-medium mb-1">Payment Time</p>
                 <p className="text-xs font-bold text-[#0A1128]">25 Feb 2023, 13:22</p>
               </div>
               <div className="border border-gray-200 rounded-xl p-3 bg-gray-50/50">
                 <p className="text-[10px] text-gray-500 font-medium mb-1">Payment Method</p>
                 <p className="text-xs font-bold text-[#0A1128]">Bank Transfer</p>
               </div>
               <div className="border border-gray-200 rounded-xl p-3 bg-gray-50/50">
                 <p className="text-[10px] text-gray-500 font-medium mb-1">Sender Name</p>
                 <p className="text-xs font-bold text-[#0A1128]">Antonio Roberto</p>
               </div>
            </div>

            <button 
              onClick={() => showToast("Downloading Receipt...", "success")} 
              className="flex items-center justify-center w-full py-3 rounded-xl bg-gray-50 text-[#0A1128] font-bold text-sm hover:bg-gray-100 transition-colors border border-gray-200 cursor-pointer"
            >
              <span className="mr-2 text-lg">📥</span> Get PDF Receipt
            </button>
            
          </div>
        </div>
      )}

    </div>
  );
};

export default Payment;
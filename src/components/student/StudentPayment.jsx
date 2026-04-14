import React, { useState } from 'react';

const StudentPayment = () => {
  // Student-specific payment data
  const [paymentHistory, setPaymentHistory] = useState([
    { id: 1, date: '10/04/2026', amount: '12,000 DZD', transactionId: 'PAY-8829342', status: 'Pending', receipt: 'April-Invoice.pdf' },
    { id: 2, date: '10/03/2026', amount: '12,000 DZD', transactionId: 'PAY-8829110', status: 'Verified', receipt: 'March-Receipt.pdf' },
    { id: 3, date: '10/02/2026', amount: '12,000 DZD', transactionId: 'PAY-8828901', status: 'Verified', receipt: 'Feb-Receipt.pdf' },
    { id: 4, date: '15/01/2026', amount: '45,000 DZD', transactionId: 'PAY-8827000', status: 'Verified', receipt: 'Full-Semester-Deposit.pdf' },
  ]);

  const studentInfo = {
    name: 'Harboula Selma',
    id: 'STD-2098',
    program: 'English / Spanish',
    level: 'B2 / B1'
  };

  return (
    <div className="flex-1 bg-[#F4F7FE] p-4 md:p-8 overflow-y-auto custom-scrollbar animate-fadeIn font-['DM_Sans',sans-serif]">
      
      {/* HEADER SECTION */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-8 rounded-[30px] shadow-sm border border-gray-50">
        <div>
          <h1 className="text-3xl font-bold text-[#1B254B] mb-2">👋 Welcome, {studentInfo.name}</h1>
          <p className="text-[#A3AED0] text-sm font-medium">Manage your tuition fees, scholarship status, and payment history.</p>
        </div>
        <div className="mt-4 md:mt-0 bg-[#E2E8F0] px-4 py-2 rounded-2xl">
            <span className="text-[#4318FF] font-bold text-sm underline cursor-pointer">Download Financial Summary</span>
        </div>
      </div>

      {/* Main Title Section */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <h2 className="text-2xl font-black text-[#1B254B] uppercase tracking-tight">Tuition & Finance</h2>
        <div className="flex gap-1">
            <span className="bg-white p-2 rounded-full shadow-sm text-xl">💳</span>
            <span className="bg-white p-2 rounded-full shadow-sm text-xl">🎓</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* CARD 1: PAYMENT STATUS */}
        <div className="bg-white rounded-[30px] p-8 shadow-sm border border-gray-50">
          <h3 className="text-xs font-bold text-[#A3AED0] uppercase tracking-widest mb-6">Payment Status:</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Side: Student Branding */}
            <div className="flex flex-col gap-4 md:border-r md:border-gray-100 md:pr-8">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#A3AED0] font-bold uppercase">Full Name:</span>
                <span className="text-sm font-bold text-[#1B254B]">{studentInfo.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#A3AED0] font-bold uppercase">Student ID:</span>
                <span className="text-sm font-bold text-[#1B254B]">{studentInfo.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#A3AED0] font-bold uppercase">Program:</span>
                <span className="text-sm font-bold text-[#1B254B]">{studentInfo.program}</span>
              </div>
            </div>

            {/* Right Side: Financial Math */}
            <div className="flex flex-col gap-4 md:pl-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#A3AED0] font-bold uppercase">Total Tuition:</span>
                <span className="text-sm font-bold text-[#1B254B]">120,000 DZD</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#A3AED0] font-bold uppercase">Paid to Date:</span>
                <span className="text-sm font-bold text-[#05CD99]">69,000 DZD</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl">
                <span className="text-sm text-red-500 font-bold uppercase tracking-tighter">Remaining Balance:</span>
                <span className="text-lg font-black text-red-600">51,000 DZD</span>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 2: FEE BREAKDOWN */}
        <div className="bg-white rounded-[30px] p-8 shadow-sm border border-gray-50">
          <h3 className="text-xs font-bold text-[#A3AED0] uppercase tracking-widest mb-6">Fee Breakdown:</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="md:border-r md:border-gray-100 md:pr-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-[#1B254B]">Semester Tuition (B2 English)</span>
                    <span className="font-medium text-[#A3AED0]">45,000 DZD</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-[#1B254B]">Semester Tuition (B1 Spanish)</span>
                    <span className="font-medium text-[#A3AED0]">40,000 DZD</span>
                </div>
              </div>
            </div>
            <div className="md:pl-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-[#1B254B]">Registration & Admin Fees</span>
                    <span className="font-medium text-[#A3AED0]">15,000 DZD</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-[#1B254B]">Library & Lab Access</span>
                    <span className="font-medium text-[#A3AED0]">20,000 DZD</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-50 flex justify-center">
            <p className="text-[11px] text-[#A3AED0] font-bold flex items-center gap-2 uppercase tracking-widest">
              <span className="text-[#4318FF]">ℹ️</span> Monthly installments are due by the 5th of every month.
            </p>
          </div>
        </div>

        {/* CARD 3: PAYMENT HISTORY TABLE */}
        <div className="bg-white rounded-[30px] p-8 shadow-sm border border-gray-50">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h3 className="text-xs font-bold text-[#A3AED0] uppercase tracking-widest">Payment History:</h3>
            
            <div className="flex gap-2">
                <select className="bg-[#F4F7FE] border-none text-[#1B254B] text-xs font-bold rounded-xl px-4 py-2 outline-none cursor-pointer">
                    <option>2023-2024</option>
                </select>
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder="Search Transactions..." 
                        className="bg-[#F4F7FE] text-[#1B254B] text-xs font-bold rounded-xl py-2 pl-4 pr-10 outline-none w-48 placeholder-[#A3AED0]"
                    />
                </div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-gray-50">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F4F7FE] text-[#A3AED0]">
                  <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest rounded-tl-2xl">Date</th>
                  <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-center">Amount</th>
                  <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-center">Transaction ID</th>
                  <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-center">Status</th>
                  <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-center rounded-tr-2xl">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paymentHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-[#F4F7FE]/50 transition-colors">
                    <td className="py-4 px-6 text-sm text-[#1B254B] font-bold">{item.date}</td>
                    <td className="py-4 px-6 text-sm text-[#1B254B] font-black text-center">{item.amount}</td>
                    <td className="py-4 px-6 text-xs text-[#A3AED0] font-bold text-center font-mono">{item.transactionId}</td>
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                        item.status === 'Verified' 
                        ? 'bg-[#05CD99]/10 text-[#05CD99]' 
                        : 'bg-amber-100 text-amber-600'
                      }`}>
                        {item.status === 'Verified' ? '● Verified' : '○ Pending'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button className="text-[#4318FF] hover:bg-[#4318FF] hover:text-white p-2 rounded-lg transition-all border border-[#4318FF]/20">
                        <span className="text-xs font-bold">PDF</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPayment;
import React, { useState } from 'react';

const TeacherFinance = () => {
  // داتا تجريبية لتاريخ الدفعات (الرواتب)
  const [paymentHistory, setPaymentHistory] = useState([
    { id: 1, date: '08/04/2026', amount: '60,000 DZD', transactionId: 'UITX 10003343434', status: 'Pending', receipt: 'April-Payslip.pdf' },
    { id: 2, date: '08/03/2026', amount: '65,000 DZD', transactionId: 'UITX 10003343435', status: 'Verified', receipt: 'March-Payslip.pdf' },
    { id: 3, date: '08/02/2026', amount: '60,000 DZD', transactionId: 'UITX 10003343436', status: 'Verified', receipt: 'Feb-Payslip.pdf' },
    { id: 4, date: '08/01/2026', amount: '72,000 DZD', transactionId: 'UITX 10003343437', status: 'Verified', receipt: 'Jan-Payslip.pdf' },
    { id: 5, date: '08/12/2025', amount: '60,000 DZD', transactionId: 'UPT 10033434348', status: 'Verified', receipt: 'Dec-Payslip.pdf' },
  ]);

  return (
    <div className="flex-1 bg-white p-8 overflow-y-auto custom-scrollbar animate-fadeIn">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1B254B] mb-2">👋 Welcome, [Teacher Name]</h1>
        <p className="text-gray-500 text-sm">View your payroll, earnings breakdown, and payment history.</p>
      </div>

      {/* Main Title (Matching Figma) */}
      <div className="flex items-center justify-center gap-4 mb-8 mt-4">
        <h2 className="text-3xl font-bold text-[#1B254B]">Payroll & Earnings</h2>
        <span className="text-3xl">🤝</span>
        <span className="text-3xl">👨‍🏫</span>
      </div>

      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* =======================================
            Card 1: Earnings Status (بديل Payment Status)
            ======================================= */}
        <div className="bg-white border border-gray-200 rounded-[20px] p-8 shadow-sm">
          <h3 className="text-sm font-bold text-gray-500 mb-6">Earnings Status:</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Side: Teacher Info */}
            <div className="flex flex-col gap-2 md:border-r md:border-gray-200 md:pr-8">
              <div className="flex items-center">
                <span className="w-24 text-sm text-gray-500 font-medium">Name:</span>
                <span className="text-sm font-bold text-[#1B254B]">Teacher Name</span>
              </div>
              <div className="flex items-center">
                <span className="w-24 text-sm text-gray-500 font-medium">Teacher ID:</span>
                <span className="text-sm font-bold text-[#1B254B]">TCH-2026-04</span>
              </div>
              <div className="flex items-center">
                <span className="w-24 text-sm text-gray-500 font-medium">Department:</span>
                <span className="text-sm font-bold text-[#1B254B]">English / Spanish</span>
              </div>
              <div className="flex items-center">
                <span className="w-24 text-sm text-gray-500 font-medium">Level:</span>
                <span className="text-sm font-bold text-[#1B254B]">B2 / A2</span>
              </div>
            </div>

            {/* Right Side: Financial Info */}
            <div className="flex flex-col gap-2 md:pl-4">
              <div className="flex items-center justify-between md:justify-start md:gap-4">
                <span className="w-32 text-sm text-gray-500 font-medium text-right md:text-left">Current Month:</span>
                <span className="text-sm font-bold text-[#1B254B]">April 2026</span>
              </div>
              <div className="flex items-center justify-between md:justify-start md:gap-4">
                <span className="w-32 text-sm text-gray-500 font-medium text-right md:text-left">Total Earned:</span>
                <span className="text-sm font-bold text-[#1B254B]">60,000 DZD</span>
              </div>
              <div className="flex items-center justify-between md:justify-start md:gap-4">
                <span className="w-32 text-sm text-gray-500 font-medium text-right md:text-left">Paid:</span>
                <span className="text-sm font-bold text-[#1B254B]">0 DZD</span>
              </div>
              <div className="flex items-center justify-between md:justify-start md:gap-4">
                <span className="w-32 text-sm text-gray-500 font-medium text-right md:text-left">Pending:</span>
                <span className="text-sm font-bold text-[#e02424]">60,000 DZD</span>
              </div>
            </div>
          </div>
        </div>

        {/* =======================================
            Card 2: Salary Structure (بديل Fee Structure)
            ملاحظة: نحينا قفلة Pay Now كيما طلبتي
            ======================================= */}
        <div className="bg-white border border-gray-200 rounded-[20px] p-8 shadow-sm">
          <h3 className="text-sm font-bold text-gray-500 mb-6">Salary Breakdown:</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="md:border-r md:border-gray-200 md:pr-8">
              <ul className="list-disc pl-5 space-y-3 text-sm font-medium text-[#1B254B]">
                <li>Base Salary (English B2): <span className="float-right">30,000 DZD</span></li>
                <li>Base Salary (Spanish A2): <span className="float-right">20,000 DZD</span></li>
              </ul>
            </div>
            <div className="md:pl-4">
              <ul className="list-disc pl-5 space-y-3 text-sm font-medium text-[#1B254B]">
                <li>Extra Hours (4 hrs): <span className="float-right">8,000 DZD</span></li>
                <li>Placement Test Bonus: <span className="float-right">2,000 DZD</span></li>
              </ul>
            </div>
          </div>
          
          {/* Note instead of Pay Now button */}
          <div className="mt-8 pt-6 border-t border-gray-100 flex justify-center">
            <p className="text-xs text-gray-400 flex items-center gap-2">
              <span>ℹ️</span> Salaries are typically processed on the 28th of each month.
            </p>
          </div>
        </div>

        {/* =======================================
            Card 3: Payment History (تاريخ الرواتب)
            ======================================= */}
        <div className="bg-white border border-gray-200 rounded-[20px] p-8 shadow-sm">
          <h3 className="text-sm font-bold text-gray-500 mb-6">Payment History:</h3>
          
          {/* Filters Bar */}
          <div className="flex flex-wrap items-center justify-between mb-6 gap-4 bg-[#f8fafc] p-3 rounded-xl border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#1B254B]">Select Year:</span>
                <select className="bg-blue-50 border border-blue-100 text-[#4318FF] text-xs font-bold rounded-lg px-3 py-1.5 outline-none">
                  <option>2025-26</option>
                  <option>2024-25</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#1B254B]">Add Filter:</span>
                <select className="bg-blue-50 border border-blue-100 text-[#4318FF] text-xs font-bold rounded-lg px-3 py-1.5 outline-none">
                  <option>All Payments</option>
                  <option>Pending</option>
                  <option>Verified</option>
                </select>
              </div>
            </div>
            
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-[#1B254B] text-white text-xs rounded-full py-2 pl-4 pr-10 outline-none w-48 placeholder-gray-400"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white text-sm cursor-pointer">🔍</span>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-[#1B254B] text-white text-xs">
                  <th className="py-3 px-6 font-bold rounded-l-lg">Date</th>
                  <th className="py-3 px-6 font-bold text-center">Amount</th>
                  <th className="py-3 px-6 font-bold text-center">Transaction ID</th>
                  <th className="py-3 px-6 font-bold text-center">Verification Status</th>
                  <th className="py-3 px-6 font-bold text-center rounded-r-lg">Payslip</th>
                </tr>
              </thead>
              <tbody>
                {paymentHistory.map((item, index) => (
                  <tr key={item.id} className={`${index % 2 === 0 ? 'bg-[#f8fafc]' : 'bg-white'} border-b border-gray-50`}>
                    <td className="py-4 px-6 text-xs text-[#1B254B] font-medium">{item.date}</td>
                    <td className="py-4 px-6 text-xs text-[#1B254B] font-medium text-center">{item.amount}</td>
                    <td className="py-4 px-6 text-xs text-[#1B254B] font-medium text-center">{item.transactionId}</td>
                    <td className="py-4 px-6 text-xs text-center flex justify-center items-center h-full mt-2">
                      <span className="flex items-center gap-1 font-bold">
                        {item.status === 'Verified' ? (
                          <><span className="text-green-500 text-sm">✔️</span> <span className="text-[#1B254B]">Verified</span></>
                        ) : (
                          <><span className="text-gray-400 text-sm">🕒</span> <span className="text-gray-500">Pending</span></>
                        )}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-xs text-center">
                      <button className="text-blue-500 hover:text-blue-700 flex items-center justify-center gap-1 mx-auto">
                        📄 <span className="underline">{item.receipt}</span>
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

export default TeacherFinance;
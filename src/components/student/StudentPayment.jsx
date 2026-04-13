import React, { useState } from 'react';

const StudentPayment = () => {
  // نفس الفكرة لكن للدفعات تاع الطالب
  const [paymentHistory] = useState([
    { id: 1, date: '08/04/2026', amount: '20,000 DZD', transactionId: 'PAY 10003343434', status: 'Pending', receipt: 'April-Receipt.pdf' },
    { id: 2, date: '08/03/2026', amount: '20,000 DZD', transactionId: 'PAY 10003343435', status: 'Verified', receipt: 'March-Receipt.pdf' },
    { id: 3, date: '08/02/2026', amount: '20,000 DZD', transactionId: 'PAY 10003343436', status: 'Verified', receipt: 'Feb-Receipt.pdf' },
    { id: 4, date: '08/01/2026', amount: '20,000 DZD', transactionId: 'PAY 10003343437', status: 'Verified', receipt: 'Jan-Receipt.pdf' },
  ]);

  return (
    <div className="flex-1 bg-white p-8 overflow-y-auto custom-scrollbar animate-fadeIn">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1B254B] mb-2">👋 Welcome, [Student Name]</h1>
        <p className="text-gray-500 text-sm">View your payments, fees breakdown, and history.</p>
      </div>

      {/* Title */}
      <div className="flex items-center justify-center gap-4 mb-8 mt-4">
        <h2 className="text-3xl font-bold text-[#1B254B]">Payments & Fees</h2>
        <span className="text-3xl">💳</span>
        <span className="text-3xl">🎓</span>
      </div>

      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* =======================================
            Card 1: Payment Status
            ======================================= */}
        <div className="bg-white border border-gray-200 rounded-[20px] p-8 shadow-sm">
          <h3 className="text-sm font-bold text-gray-500 mb-6">Payment Status:</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Student Info */}
            <div className="flex flex-col gap-2 md:border-r md:border-gray-200 md:pr-8">
              <div className="flex items-center">
                <span className="w-24 text-sm text-gray-500 font-medium">Name:</span>
                <span className="text-sm font-bold text-[#1B254B]">Student Name</span>
              </div>
              <div className="flex items-center">
                <span className="w-24 text-sm text-gray-500 font-medium">Student ID:</span>
                <span className="text-sm font-bold text-[#1B254B]">STD-2026-04</span>
              </div>
              <div className="flex items-center">
                <span className="w-24 text-sm text-gray-500 font-medium">Course:</span>
                <span className="text-sm font-bold text-[#1B254B]">English / Spanish</span>
              </div>
              <div className="flex items-center">
                <span className="w-24 text-sm text-gray-500 font-medium">Level:</span>
                <span className="text-sm font-bold text-[#1B254B]">B2 / A2</span>
              </div>
            </div>

            {/* Financial Info */}
            <div className="flex flex-col gap-2 md:pl-4">
              <div className="flex items-center justify-between md:justify-start md:gap-4">
                <span className="w-32 text-sm text-gray-500 font-medium">Current Month:</span>
                <span className="text-sm font-bold text-[#1B254B]">April 2026</span>
              </div>
              <div className="flex items-center justify-between md:justify-start md:gap-4">
                <span className="w-32 text-sm text-gray-500 font-medium">Total Fees:</span>
                <span className="text-sm font-bold text-[#1B254B]">20,000 DZD</span>
              </div>
              <div className="flex items-center justify-between md:justify-start md:gap-4">
                <span className="w-32 text-sm text-gray-500 font-medium">Paid:</span>
                <span className="text-sm font-bold text-[#00a65e]">20,000 DZD</span>
              </div>
              <div className="flex items-center justify-between md:justify-start md:gap-4">
                <span className="w-32 text-sm text-gray-500 font-medium">Remaining:</span>
                <span className="text-sm font-bold text-[#e02424]">0 DZD</span>
              </div>
            </div>
          </div>
        </div>

        {/* =======================================
            Card 2: Fee Breakdown
            ======================================= */}
        <div className="bg-white border border-gray-200 rounded-[20px] p-8 shadow-sm">
          <h3 className="text-sm font-bold text-gray-500 mb-6">Fee Breakdown:</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="md:border-r md:border-gray-200 md:pr-8">
              <ul className="list-disc pl-5 space-y-3 text-sm font-medium text-[#1B254B]">
                <li>English Course (B2): <span className="float-right">10,000 DZD</span></li>
                <li>Spanish Course (A2): <span className="float-right">8,000 DZD</span></li>
              </ul>
            </div>
            <div className="md:pl-4">
              <ul className="list-disc pl-5 space-y-3 text-sm font-medium text-[#1B254B]">
                <li>Registration Fee: <span className="float-right">2,000 DZD</span></li>
                <li>Materials: <span className="float-right">0 DZD</span></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-100 flex justify-center">
            <p className="text-xs text-gray-400 flex items-center gap-2">
              <span>ℹ️</span> Payments are typically due before the 5th of each month.
            </p>
          </div>
        </div>

        {/* =======================================
            Card 3: Payment History
            ======================================= */}
        <div className="bg-white border border-gray-200 rounded-[20px] p-8 shadow-sm">
          <h3 className="text-sm font-bold text-gray-500 mb-6">Payment History:</h3>
          
          {/* Filters */}
          <div className="flex flex-wrap items-center justify-between mb-6 gap-4 bg-[#f8fafc] p-3 rounded-xl border border-gray-100">
            <div className="flex items-center gap-4">
              <select className="bg-blue-50 border border-blue-100 text-[#4318FF] text-xs font-bold rounded-lg px-3 py-1.5 outline-none">
                <option>2025-26</option>
              </select>
              <select className="bg-blue-50 border border-blue-100 text-[#4318FF] text-xs font-bold rounded-lg px-3 py-1.5 outline-none">
                <option>All Payments</option>
                <option>Pending</option>
                <option>Verified</option>
              </select>
            </div>
            
            <input 
              type="text" 
              placeholder="Search..." 
              className="bg-[#1B254B] text-white text-xs rounded-full py-2 px-4 outline-none w-48 placeholder-gray-400"
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-[#1B254B] text-white text-xs">
                  <th className="py-3 px-6 font-bold">Date</th>
                  <th className="py-3 px-6 font-bold text-center">Amount</th>
                  <th className="py-3 px-6 font-bold text-center">Transaction ID</th>
                  <th className="py-3 px-6 font-bold text-center">Status</th>
                  <th className="py-3 px-6 font-bold text-center">Receipt</th>
                </tr>
              </thead>
              <tbody>
                {paymentHistory.map((item, index) => (
                  <tr key={item.id} className={`${index % 2 === 0 ? 'bg-[#f8fafc]' : 'bg-white'}`}>
                    <td className="py-4 px-6 text-xs">{item.date}</td>
                    <td className="py-4 px-6 text-xs text-center">{item.amount}</td>
                    <td className="py-4 px-6 text-xs text-center">{item.transactionId}</td>
                    <td className="py-4 px-6 text-xs text-center">{item.status}</td>
                    <td className="py-4 px-6 text-xs text-center">
                      📄 {item.receipt}
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
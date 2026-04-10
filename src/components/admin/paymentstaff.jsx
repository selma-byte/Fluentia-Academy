import React, { useState } from 'react';

const PaymentStaff = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // بيانات طاقم العمل والرواتب - مبرمجة لتكون قابلة للتعديل
  const [staffPayments, setStaffPayments] = useState([
    { id: 1, name: "Prof. Sarah Ahmed", role: "Teacher", salary: 45000, status: "Paid", date: "2026-04-05", method: "Bank Transfer", avatar: "SA" },
    { id: 2, name: "Mourad Slimani", role: "Secretary", salary: 35000, status: "Pending", date: "-", method: "-", avatar: "MS" },
    { id: 3, name: "Prof. Hassan Ali", role: "Teacher", salary: 42000, status: "Paid", date: "2026-04-02", method: "Cash", avatar: "HA" },
    { id: 4, name: "Fatima Zohra", role: "Lady Cleaning", salary: 25000, status: "Pending", date: "-", method: "-", avatar: "FZ" },
    { id: 5, name: "Prof. Karima Ben", role: "Teacher", salary: 48000, status: "Paid", date: "2026-04-01", method: "Bank Transfer", avatar: "KB" },
    { id: 6, name: "Amine Barkat", role: "Security", salary: 30000, status: "Pending", date: "-", method: "-", avatar: "AB" },
  ]);

  const roles = ['All', 'Teacher', 'Secretary', 'Lady Cleaning', 'Security'];

  // حساب الإحصائيات بشكل ديناميكي بناءً على البيانات
  const totalPaid = staffPayments.filter(s => s.status === 'Paid').reduce((sum, s) => sum + s.salary, 0);
  const totalPending = staffPayments.filter(s => s.status === 'Pending').reduce((sum, s) => sum + s.salary, 0);

  // تصفية البيانات بناءً على البحث والتبويب المختار
  const filteredStaff = staffPayments.filter(staff => {
    const matchesTab = activeTab === 'All' || staff.role === activeTab;
    const matchesSearch = staff.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // معالجة عملية الدفع
  const handlePay = (id) => {
    setStaffPayments(staffPayments.map(staff => 
      staff.id === id ? { 
        ...staff, 
        status: 'Paid', 
        date: new Date().toLocaleDateString(), 
        method: 'Cash' 
      } : staff
    ));
    alert("Payment processed successfully!");
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-10 duration-700 pb-20">
      
      {/* Header & Financial Status Cards */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-8">
        <div>
          <h2 className="text-5xl font-black text-[#1A2252] mb-3 italic tracking-tighter">Staff Payroll</h2>
          <p className="text-gray-400 font-bold italic text-sm">Review and manage salary disbursements for your school staff.</p>
        </div>

        <div className="flex gap-4 w-full lg:w-auto">
          <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm min-w-[200px] flex items-center gap-4">
            <div className="w-2 h-10 bg-green-500 rounded-full"></div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase italic mb-1 tracking-widest">Paid Total</p>
              <p className="text-2xl font-black text-[#1A2252]">{totalPaid.toLocaleString()} دج</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm min-w-[200px] flex items-center gap-4">
            <div className="w-2 h-10 bg-red-500 rounded-full"></div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase italic mb-1 tracking-widest">Pending</p>
              <p className="text-2xl font-black text-[#1A2252]">{totalPending.toLocaleString()} دج</p>
            </div>
          </div>
        </div>
      </div>

      {/* Control Center: Search and Filters */}
      <div className="bg-white p-5 rounded-[2.5rem] shadow-sm border border-gray-50 mb-10 flex flex-col md:flex-row gap-5 items-center">
        <div className="relative flex-1 w-full">
           <input 
             type="text" 
             placeholder="Search staff by name..." 
             className="w-full bg-gray-50 border-none rounded-2xl px-8 py-4 outline-none font-bold italic text-sm focus:ring-2 ring-indigo-100 transition-all"
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
           />
           <span className="absolute right-6 top-4 opacity-30">🔍</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          {roles.map(role => (
            <button 
              key={role}
              onClick={() => setActiveTab(role)}
              className={`px-6 py-3 rounded-xl text-[10px] font-black italic transition-all whitespace-nowrap cursor-pointer ${
                activeTab === role ? 'bg-[#1A2252] text-white shadow-xl scale-105' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
              }`}
            >
              {role.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Payroll Records Table */}
      <div className="bg-white rounded-[3.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/50 text-[11px] font-black text-gray-400 uppercase italic tracking-[0.2em] border-b border-gray-50">
              <th className="px-10 py-8">Employee Name</th>
              <th className="px-6 py-8 text-center">Amount (DZD)</th>
              <th className="px-6 py-8 text-center">Payment Status</th>
              <th className="px-6 py-8 text-center">Method / Date</th>
              <th className="px-10 py-8 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredStaff.map((staff) => (
              <tr key={staff.id} className="hover:bg-gray-50/80 transition-all group">
                <td className="px-10 py-6">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-[#1A2252] text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-lg transform group-hover:rotate-6 transition-transform">
                      {staff.avatar}
                    </div>
                    <div>
                      <h4 className="font-black text-[#1A2252] italic text-lg">{staff.name}</h4>
                      <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{staff.role}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6 text-center font-black text-[#1A2252]">
                  {staff.salary.toLocaleString()} دج
                </td>
                <td className="px-6 py-6 text-center">
                  <span className={`px-5 py-2 rounded-xl text-[9px] font-black italic uppercase tracking-widest border-2 ${
                    staff.status === 'Paid' 
                    ? 'bg-green-50 text-green-600 border-green-100' 
                    : 'bg-red-50 text-red-600 border-red-100'
                  }`}>
                    {staff.status} {staff.status === 'Paid' ? '✓' : '●'}
                  </span>
                </td>
                <td className="px-6 py-6 text-center">
                  <p className="text-xs font-bold text-gray-500">{staff.date}</p>
                  <p className="text-[9px] text-gray-300 font-black uppercase tracking-tighter">{staff.method}</p>
                </td>
                <td className="px-10 py-6 text-right">
                  {staff.status === 'Pending' ? (
                    <button 
                      onClick={() => handlePay(staff.id)}
                      className="bg-[#1A2252] text-white px-8 py-3 rounded-2xl text-[10px] font-black italic shadow-xl hover:bg-blue-900 hover:-translate-y-1 transition-all cursor-pointer"
                    >
                      PAY EMPLOYEE ➔
                    </button>
                  ) : (
                    <button 
                      onClick={() => alert("Printing Receipt...")}
                      className="bg-white border-2 border-gray-100 text-gray-300 px-8 py-3 rounded-2xl text-[10px] font-black italic hover:border-[#1A2252] hover:text-[#1A2252] transition-all cursor-pointer"
                    >
                      DOWNLOAD RECEIPT 📄
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredStaff.length === 0 && (
          <div className="py-24 text-center">
            <span className="text-6xl mb-4 block opacity-10">💸</span>
            <p className="text-gray-400 font-bold italic">No payroll records found.</p>
          </div>
        )}
      </div>

      {/* Footer Summary Bar */}
      <div className="mt-12 bg-[#1A2252] rounded-[3.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <h4 className="text-3xl font-black italic mb-2 tracking-tighter">Financial Statement</h4>
            <p className="text-blue-200 font-bold italic text-sm opacity-80">Check the total school operating budget for the current month.</p>
          </div>
          <div className="flex gap-4">
             <div className="text-center px-8 border-r border-white/10">
                <p className="text-[10px] font-black opacity-50 uppercase mb-1">Total Payout</p>
                <p className="text-2xl font-black">{(totalPaid + totalPending).toLocaleString()} دج</p>
             </div>
             <button className="bg-white text-[#1A2252] px-10 py-5 rounded-3xl font-black italic text-sm shadow-xl hover:scale-105 transition-transform cursor-pointer">
               EXPORT PAYROLL PDF 📥
             </button>
          </div>
        </div>
        {/* Decorative Shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
      </div>

    </div>
  );
};

export default PaymentStaff;
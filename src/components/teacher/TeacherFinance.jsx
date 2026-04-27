import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

const TeacherFinance = () => {
  const [loading, setLoading] = useState(true);
  const [teacherInfo, setTeacherInfo] = useState({
    name: 'Loading...',
    id: '...',
    department: '...',
    role: '...',
    baseSalary: 0,
  });
  const [earnings, setEarnings] = useState({
    totalEarned: 0,
    paidThisMonth: 0,
    pendingThisMonth: 0,
    currentMonthName: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
  });
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Payments');
  const [yearFilter, setYearFilter] = useState('2025-26');

  useEffect(() => {
    const fetchFinanceData = async () => {
      setLoading(true);
      try {
        // 1. Get current logged in user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || !user.email) return;

        // 2. Fetch Teacher Info from 'staff' table
        const { data: staffData, error: staffError } = await supabase
          .from('staff')
          .select('*')
          .eq('email', user.email)
          .single();

        if (staffError) throw staffError;

        const teacherName = `${staffData.first_name} ${staffData.last_name}`;
        const baseSalary = parseFloat(staffData.salary) || 0;

        setTeacherInfo({
          name: teacherName,
          id: `TCH-${staffData.id.substring(0, 8).toUpperCase()}`,
          department: staffData.department || 'N/A',
          role: staffData.role || 'Teacher',
          baseSalary: baseSalary,
        });

        // 3. Fetch Payment History from 'payments' table
        // We look for payments where member_name is the teacher and notes include 'Payroll'
        const { data: paymentsData, error: payError } = await supabase
          .from('payments')
          .select('*')
          .eq('member_name', teacherName)
          .ilike('notes', '%Payroll%')
          .order('payment_date', { ascending: false });

        if (payError && payError.code !== 'PGRST116') throw payError;

        let formattedHistory = [];
        let totalEarned = 0;
        let paidThisMonth = 0;
        let pendingThisMonth = baseSalary; // Assume pending until proven paid

        const currentMonthString = new Date().toLocaleString('default', { month: 'long' }) + ' 2026'; // e.g. "April 2026"

        if (paymentsData && paymentsData.length > 0) {
          formattedHistory = paymentsData.map(p => {
            const amount = parseFloat(p.amount) || 0;
            totalEarned += amount;
            
            // Check if this payment is for the current month
            if (p.notes.includes(currentMonthString)) {
              paidThisMonth += amount;
              pendingThisMonth = baseSalary - paidThisMonth;
              if (pendingThisMonth < 0) pendingThisMonth = 0;
            }

            return {
              id: p.id,
              date: new Date(p.payment_date || p.created_at).toLocaleDateString('en-GB'),
              rawDate: new Date(p.payment_date || p.created_at),
              amount: `${amount.toLocaleString()} DZD`,
              transactionId: `TXN-${p.id.substring(0, 8).toUpperCase()}`,
              status: p.status === 'Paid' ? 'Verified' : 'Pending',
              receipt: `${p.notes.replace('Payroll for ', '')}-Payslip.pdf`,
            };
          });
        }

        setEarnings({
          totalEarned: totalEarned,
          paidThisMonth: paidThisMonth,
          pendingThisMonth: pendingThisMonth,
          currentMonthName: currentMonthString,
        });

        setPaymentHistory(formattedHistory);

      } catch (error) {
        console.error("Error fetching finance data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFinanceData();
  }, []);

  // Filtering Logic
  const filteredHistory = paymentHistory.filter(item => {
    const matchesSearch = item.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.receipt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All Payments' || item.status === statusFilter;
    // Note: Year filter logic can be expanded based on exact date requirements. For now, it's illustrative.
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <div className="flex-1 flex items-center justify-center bg-[#f8fafc]">Loading Finance Data...</div>;
  }

  return (
    <div className="flex-1 bg-white p-8 overflow-y-auto custom-scrollbar animate-fadeIn">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1B254B] mb-2">👋 Welcome, {teacherInfo.name.split(' ')[0]}</h1>
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
            Card 1: Earnings Status
            ======================================= */}
        <div className="bg-white border border-gray-200 rounded-[20px] p-8 shadow-sm">
          <h3 className="text-sm font-bold text-gray-500 mb-6">Earnings Status:</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Side: Teacher Info */}
            <div className="flex flex-col gap-2 md:border-r md:border-gray-200 md:pr-8">
              <div className="flex items-center">
                <span className="w-24 text-sm text-gray-500 font-medium">Name:</span>
                <span className="text-sm font-bold text-[#1B254B]">{teacherInfo.name}</span>
              </div>
              <div className="flex items-center">
                <span className="w-24 text-sm text-gray-500 font-medium">Teacher ID:</span>
                <span className="text-sm font-bold text-[#1B254B]">{teacherInfo.id}</span>
              </div>
              <div className="flex items-center">
                <span className="w-24 text-sm text-gray-500 font-medium">Department:</span>
                <span className="text-sm font-bold text-[#1B254B]">{teacherInfo.department}</span>
              </div>
              <div className="flex items-center">
                <span className="w-24 text-sm text-gray-500 font-medium">Role:</span>
                <span className="text-sm font-bold text-[#1B254B]">{teacherInfo.role}</span>
              </div>
            </div>

            {/* Right Side: Financial Info */}
            <div className="flex flex-col gap-2 md:pl-4">
              <div className="flex items-center justify-between md:justify-start md:gap-4">
                <span className="w-32 text-sm text-gray-500 font-medium text-right md:text-left">Current Month:</span>
                <span className="text-sm font-bold text-[#1B254B]">{earnings.currentMonthName}</span>
              </div>
              <div className="flex items-center justify-between md:justify-start md:gap-4">
                <span className="w-32 text-sm text-gray-500 font-medium text-right md:text-left">Total Earned:</span>
                <span className="text-sm font-bold text-[#1B254B]">{earnings.totalEarned.toLocaleString()} DZD</span>
              </div>
              <div className="flex items-center justify-between md:justify-start md:gap-4">
                <span className="w-32 text-sm text-gray-500 font-medium text-right md:text-left">Paid:</span>
                <span className="text-sm font-bold text-[#059669]">{earnings.paidThisMonth.toLocaleString()} DZD</span>
              </div>
              <div className="flex items-center justify-between md:justify-start md:gap-4">
                <span className="w-32 text-sm text-gray-500 font-medium text-right md:text-left">Pending:</span>
                <span className="text-sm font-bold text-[#e02424]">{earnings.pendingThisMonth.toLocaleString()} DZD</span>
              </div>
            </div>
          </div>
        </div>

        {/* =======================================
            Card 2: Salary Structure
            ======================================= */}
        <div className="bg-white border border-gray-200 rounded-[20px] p-8 shadow-sm">
          <h3 className="text-sm font-bold text-gray-500 mb-6">Salary Breakdown:</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="md:border-r md:border-gray-200 md:pr-8">
              <ul className="list-disc pl-5 space-y-3 text-sm font-medium text-[#1B254B]">
                <li>Base Salary ({teacherInfo.department}): <span className="float-right">{teacherInfo.baseSalary.toLocaleString()} DZD</span></li>
              </ul>
            </div>
            <div className="md:pl-4">
              <ul className="list-disc pl-5 space-y-3 text-sm font-medium text-gray-400">
                <li>Extra Hours: <span className="float-right italic">Subject to admin approval</span></li>
                <li>Bonuses: <span className="float-right italic">Subject to admin approval</span></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-100 flex justify-center">
            <p className="text-xs text-gray-400 flex items-center gap-2">
              <span>ℹ️</span> Salaries are typically processed on the 28th of each month by the Administration.
            </p>
          </div>
        </div>

        {/* =======================================
            Card 3: Payment History
            ======================================= */}
        <div className="bg-white border border-gray-200 rounded-[20px] p-8 shadow-sm">
          <h3 className="text-sm font-bold text-gray-500 mb-6">Payment History:</h3>
          
          {/* Filters Bar */}
          <div className="flex flex-wrap items-center justify-between mb-6 gap-4 bg-[#f8fafc] p-3 rounded-xl border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#1B254B]">Select Year:</span>
                <select value={yearFilter} onChange={e => setYearFilter(e.target.value)} className="bg-blue-50 border border-blue-100 text-[#4318FF] text-xs font-bold rounded-lg px-3 py-1.5 outline-none cursor-pointer">
                  <option>2025-26</option>
                  <option>2024-25</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#1B254B]">Add Filter:</span>
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-blue-50 border border-blue-100 text-[#4318FF] text-xs font-bold rounded-lg px-3 py-1.5 outline-none cursor-pointer">
                  <option>All Payments</option>
                  <option>Pending</option>
                  <option>Verified</option>
                </select>
              </div>
            </div>
            
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search Txn ID..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
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
                {filteredHistory.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-gray-400 font-medium text-sm">
                      No payment history found.
                    </td>
                  </tr>
                ) : filteredHistory.map((item, index) => (
                  <tr key={item.id} className={`${index % 2 === 0 ? 'bg-[#f8fafc]' : 'bg-white'} border-b border-gray-50 transition-colors hover:bg-blue-50/30`}>
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
                      <button className="text-blue-500 hover:text-blue-700 flex items-center justify-center gap-1 mx-auto transition-colors" title="Download Payslip">
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
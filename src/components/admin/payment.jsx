import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

// ==========================================
// 🔔 MODERN NOTIFICATION COMPONENT (BLUE)
// ==========================================
const Toast = ({ message, onClose }) => (
  <div className="fixed bottom-12 right-12 z-[250] animate-in slide-in-from-right duration-500 text-left">
    <div className="bg-[#1A2252] text-white px-10 py-6 rounded-[2.5rem] shadow-2xl flex items-center gap-6 border border-blue-400/30 backdrop-blur-xl min-w-[400px]">
      <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-blue-500/40 animate-pulse">✨</div>
      <div className="flex-1">
        <p className="text-lg font-black italic tracking-tight leading-none mb-1">Financial Update</p>
        <p className="text-sm font-bold text-blue-200/80 italic">{message}</p>
      </div>
      <button onClick={onClose} className="ml-6 text-white/30 hover:text-white transition-colors text-2xl p-2 cursor-pointer">✕</button>
    </div>
  </div>
);

const Payment = () => {
  const [currentView, setCurrentView] = useState('student');
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [loading, setLoading] = useState(true);

  // الداتا الحقيقية
  const [members, setMembers] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);

  // حالات الفورم والفاتورة
  const [selectedMember, setSelectedMember] = useState('');
  const [payAmount, setPayAmount] = useState('3000');
  const [payDate, setPayDate] = useState(new Date().toISOString().split('T')[0]);
  const [payMethod, setPayMethod] = useState('Cash');
  const [payNotes, setPayNotes] = useState('');
  const [receiptData, setReceiptData] = useState(null);

  // --- Student Filters ---
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [langFilter, setLangFilter] = useState('All');
  const [groupFilter, setGroupFilter] = useState('All');

  // --- Staff States ---
  const [staffList, setStaffList] = useState([]);
  const [staffSearchTerm, setStaffSearchTerm] = useState('');
  const [staffStatusFilter, setStaffStatusFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');
  const [selectedMonth, setSelectedMonth] = useState('April 2026');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4500);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: studentsData } = await supabase.from('students').select('*');
      if (studentsData) {
        const formattedStudents = studentsData.map(s => ({
          id: s.id,
          name: `${s.first_name || ''} ${s.last_name || ''}`.trim() || 'Unknown Student', 
          language: s.language || 'English', 
          group: s.level || s.group || 'Standard', 
          status: s.status === 'Paid' ? 'Paid' : (s.status === 'Overdue' ? 'Overdue' : 'Due Soon'), 
          balance: s.status === 'Paid' ? 0 : 3000,
          dueDate: "End of Month",
        }));
        setMembers(formattedStudents);
        if (formattedStudents.length > 0) setSelectedMember(formattedStudents[0].name);
      }

      const { data: paymentsData } = await supabase.from('payments').select('*').order('payment_date', { ascending: false });
      if (paymentsData) {
        setPaymentHistory(paymentsData.map(p => ({
          id: p.id,
          amount: p.amount,
          amountStr: `${p.amount} دج`,
          member: p.member_name
        })));
      }

      const { data: staffData } = await supabase.from('staff').select('*');
      if (staffData) {
        setStaffList(staffData.map(s => ({
          id: s.id,
          name: `${s.first_name} ${s.last_name}`,
          role: s.role,
          salary: s.role === 'Teacher' ? 45000 : s.role === 'Secretary' ? 35000 : 25000,
          status: 'Pending',
          dueDate: "End of Month"
        })));
      }
    } catch (err) {
      showToast("Sync Error: " + err.message);
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const processPayment = async (name, amount, method, notes, date) => {
    try {
      const { error: payError } = await supabase.from('payments').insert([{
        member_name: name, amount: parseFloat(amount), status: 'Paid', payment_method: method, notes: notes, payment_date: date
      }]);
      if (payError) throw payError;
      setReceiptData({ name, amount, method, date });
      setShowAddPaymentModal(false);
      setShowReceiptModal(true);
      fetchData();
    } catch (err) {
      showToast("Error saving payment: " + err.message, "error");
    }
  };

  const handleSavePayment = (e) => {
    e.preventDefault();
    processPayment(selectedMember, payAmount, payMethod, payNotes, payDate);
  };

  const handleStaffPay = (id, name) => {
    setStaffList(prev => prev.map(staff => 
      staff.id === id ? { ...staff, status: 'Paid' } : staff
    ));
    showToast(`Salary for ${name} disbursed for ${selectedMonth} 💸`);
  };

  // --- Stats Calculation ---
  const totalIncome = paymentHistory.reduce((sum, p) => sum + (p.amount || 0), 0);
  const unpaidCount = members.filter(m => m.status !== 'Paid').length;
  const unpaidBalance = members.reduce((sum, m) => sum + m.balance, 0);
  const overdueCount = members.filter(m => m.status === 'Overdue').length;

  const staffPaidCount = staffList.filter(s => s.status === 'Paid').length;
  const staffPendingCount = staffList.filter(s => s.status === 'Pending').length;
  const totalStaffPaid = staffList.filter(s => s.status === 'Paid').reduce((sum, s) => sum + s.salary, 0);

  const filteredMembers = members.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || m.status === statusFilter;
    const matchesLang = langFilter === 'All' || m.language === langFilter;
    const matchesGroup = groupFilter === 'All' || m.group === groupFilter;
    return matchesSearch && matchesStatus && matchesLang && matchesGroup;
  });

  const filteredStaff = staffList.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(staffSearchTerm.toLowerCase());
    const matchesRole = roleFilter === 'All' || s.role === roleFilter;
    const matchesStatus = staffStatusFilter === 'All' || s.status === staffStatusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="flex-1 h-full overflow-y-auto bg-[#F8F9FA] p-8 custom-scrollbar relative font-sans text-left">
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      {/* HEADER BAR */}
      <div className="mb-8 flex justify-between items-center">
        <h2 className="text-3xl font-black text-[#0A1128] italic tracking-tight uppercase">Financial Dashboard</h2>
        <div className="flex space-x-2 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
           <button onClick={() => setCurrentView('student')} className={`px-8 py-2.5 rounded-xl text-[11px] font-black italic transition-all cursor-pointer ${currentView === 'student' ? 'bg-[#0A1128] text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'}`}>STUDENTS</button>
           <button onClick={() => setCurrentView('staff')} className={`px-8 py-2.5 rounded-xl text-[11px] font-black italic transition-all cursor-pointer ${currentView === 'staff' ? 'bg-[#0A1128] text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'}`}>STAFF PAYROLL</button>
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

      {currentView === 'student' ? (
        <div className="animate-in fade-in duration-500">
          {/* STATS CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
             <div className="bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="flex justify-between items-start mb-4"><span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Total Income</span><span className="text-green-500 font-bold">$</span></div>
                <p className="text-2xl font-black text-[#0A1128]">{totalIncome.toLocaleString()} دج</p>
                <p className="text-[9px] text-gray-400 font-bold mt-1 italic">From all members</p>
             </div>
             <div className="bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-sm">
                <div className="flex justify-between items-start mb-4"><span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Unpaid Members</span><span className="text-indigo-500 font-bold">👥</span></div>
                <p className="text-2xl font-black text-red-600">{unpaidCount}</p>
                <p className="text-[9px] text-gray-400 font-bold mt-1 italic">{unpaidBalance.toLocaleString()} دج outstanding</p>
             </div>
             <div className="bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-sm">
                <div className="flex justify-between items-start mb-4"><span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Overdue Payments</span><span className="text-red-500 font-bold">⚠️</span></div>
                <p className="text-2xl font-black text-[#0A1128]">{overdueCount}</p>
                <p className="text-[9px] text-gray-400 font-bold mt-1 italic">Immediate attention</p>
             </div>
             <div className="bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-sm">
                <div className="flex justify-between items-start mb-4"><span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Due Soon</span><span className="text-blue-500 font-bold">📅</span></div>
                <p className="text-2xl font-black text-[#0A1128]">3</p>
                <p className="text-[9px] text-gray-400 font-bold mt-1 italic">Next 5 days</p>
             </div>
          </div>

          <div className="flex justify-between items-center mb-8">
             <h3 className="text-lg font-black text-[#0A1128] italic uppercase tracking-widest">Member Payment Status</h3>
             <button onClick={() => setShowAddPaymentModal(true)} className="bg-[#0A1128] text-white px-8 py-3 rounded-2xl text-[10px] font-black italic shadow-xl">+ ADD PAYMENT</button>
          </div>

          {/* FILTER BAR */}
          <div className="mb-8 flex flex-wrap gap-4 bg-white p-6 rounded-[2rem] shadow-sm border border-gray-50 items-center">
             <div className="relative flex-1 min-w-[250px]">
                <input type="text" placeholder="Search student name..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold outline-none" />
             </div>
             <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-gray-50 border-none rounded-2xl px-6 py-4 text-xs font-black italic outline-none cursor-pointer">
                <option value="All">All Status</option><option value="Paid">Paid</option><option value="Due Soon">Due Soon</option><option value="Overdue">Overdue</option>
             </select>
             <select value={langFilter} onChange={e => setLangFilter(e.target.value)} className="bg-gray-50 border-none rounded-2xl px-6 py-4 text-xs font-black italic outline-none cursor-pointer">
                <option value="All">All Languages</option>
                {[...new Set(members.map(m=>m.language))].map(l=><option key={l} value={l}>{l}</option>)}
             </select>
          </div>

          {/* CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMembers.map(member => (
              <div key={member.id} className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm relative overflow-hidden group">
                <span className="absolute top-6 right-8 text-[9px] font-black bg-orange-50 text-orange-600 px-3 py-1 rounded-lg italic">{member.status}</span>
                <h4 className="font-black text-[#0A1128] italic text-xl leading-tight mb-1">{member.name}</h4>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">{member.language} • {member.group}</p>
                <div className="space-y-4 mb-8">
                   <div className="border-b border-gray-50 pb-2 text-left">
                      <p className="text-[9px] font-black text-gray-300 uppercase italic mb-1 tracking-widest">📅 Due Date</p>
                      <p className="text-xs font-bold text-gray-600">{member.dueDate}</p>
                   </div>
                   <div className="flex justify-between items-end">
                      <p className="text-sm font-black text-[#0A1128]">Current Balance</p>
                      <p className={`text-2xl font-black ${member.balance > 0 ? 'text-red-600' : 'text-green-500'}`}>{member.balance} دج</p>
                   </div>
                </div>
                {member.balance > 0 ? (
                  <div className="flex gap-2">
                    <button onClick={() => processPayment(member.name, member.balance, 'Cash', 'Quick Pay', new Date().toISOString().split('T')[0])} className="flex-1 bg-[#4CAF50] text-white py-3.5 rounded-2xl text-[10px] font-black italic shadow-lg active:scale-95 transition-all cursor-pointer">✓ MARK PAID</button>
                    <button onClick={() => showToast(`Reminder sent to ${member.name} 📲`)} className="bg-[#0A1128] text-white px-5 rounded-2xl shadow-lg hover:bg-slate-800 transition-all cursor-pointer flex items-center justify-center">🔔</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* ==========================================
           STAFF PAYROLL VIEW (MATCHED TO STUDENT PAGE)
           ========================================== */
        <div className="animate-in slide-in-from-bottom-10 duration-700">
          {/* STATS CARDS (MATCHING STUDENT COLORS) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
             <div className="bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-sm">
                <div className="flex justify-between items-start mb-4"><span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Paid This Month</span><span className="text-green-500 font-bold">$</span></div>
                <p className="text-2xl font-black text-[#0A1128]">{totalStaffPaid.toLocaleString()} دج</p>
                <p className="text-[9px] text-gray-400 font-bold mt-1 italic">Total disbursed salaries</p>
             </div>
             <div className="bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-sm">
                <div className="flex justify-between items-start mb-4"><span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Settled Staff</span><span className="text-green-500 font-bold">✓</span></div>
                <p className="text-2xl font-black text-[#4CAF50]">{staffPaidCount}</p>
                <p className="text-[9px] text-gray-400 font-bold mt-1 italic">Payments completed</p>
             </div>
             <div className="bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-sm">
                <div className="flex justify-between items-start mb-4"><span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Pending Payroll</span><span className="text-red-500 font-bold">⚠️</span></div>
                <p className="text-2xl font-black text-red-600">{staffPendingCount}</p>
                <p className="text-[9px] text-gray-400 font-bold mt-1 italic">Awaiting disbursement</p>
             </div>
          </div>

          <div className="flex justify-between items-center mb-8">
             <h3 className="text-lg font-black text-[#0A1128] italic uppercase tracking-widest">Staff Payroll Management</h3>
          </div>

          {/* FILTER BAR (MATCHING STUDENT DESIGN) */}
          <div className="mb-8 flex flex-wrap gap-4 bg-white p-6 rounded-[2rem] shadow-sm border border-gray-50 items-center">
             <div className="relative flex-1 min-w-[250px]">
                <input type="text" placeholder="Search staff name..." value={staffSearchTerm} onChange={e => setStaffSearchTerm(e.target.value)} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold outline-none" />
             </div>
             <select value={selectedMonth} onChange={e=>setSelectedMonth(e.target.value)} className="bg-gray-50 border-none rounded-2xl px-6 py-4 text-xs font-black italic outline-none cursor-pointer">
                <option>March 2026</option><option>April 2026</option><option>May 2026</option>
             </select>
             <select value={staffStatusFilter} onChange={e => setStaffStatusFilter(e.target.value)} className="bg-gray-50 border-none rounded-2xl px-6 py-4 text-xs font-black italic outline-none cursor-pointer">
                <option value="All">All Status</option><option value="Paid">Paid</option><option value="Pending">Pending</option>
             </select>
             <select value={roleFilter} onChange={e=>setRoleFilter(e.target.value)} className="bg-[#0A1128] text-white rounded-2xl px-8 py-4 text-xs font-black italic outline-none shadow-lg tracking-widest uppercase cursor-pointer">
                <option value="All">All Roles</option>
                <option value="Teacher">Teachers</option>
                <option value="Secretary">Secretary</option>
                <option value="Lady Cleaning">Cleaning Crew</option>
                <option value="Security Guard">Security guard</option>
             </select>
          </div>

          {/* STAFF CARDS (MATCHING STUDENT CARD STYLE) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredStaff.map((staff) => (
              <div key={staff.id} className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm relative overflow-hidden group">
                <span className={`absolute top-6 right-8 text-[9px] font-black px-3 py-1 rounded-lg italic border tracking-widest uppercase ${staff.status === 'Paid' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                  {staff.status === 'Paid' ? 'Paid' : 'Due Soon'}
                </span>
                <h4 className="font-black text-[#0A1128] italic text-xl mb-1 leading-tight">{staff.name}</h4>
                <p className="text-[10px] font-black text-gray-400 uppercase mb-6 tracking-widest">{staff.role}</p>
                
                <div className="space-y-4 mb-8 text-left">
                   <div className="border-b border-gray-50 pb-2">
                      <p className="text-[9px] font-black text-gray-300 uppercase italic mb-1 tracking-widest">📅 Payroll Cycle</p>
                      <p className="text-xs font-bold text-gray-600">{staff.dueDate}</p>
                   </div>
                   <div className="flex justify-between items-end">
                      <p className="text-sm font-black text-[#0A1128]">Monthly Salary</p>
                      <p className="text-2xl font-black text-red-600">{staff.salary.toLocaleString()} دج</p>
                   </div>
                </div>

                {staff.status === 'Pending' ? (
                  <button onClick={() => handleStaffPay(staff.id, staff.name)} className="w-full bg-[#4CAF50] text-white py-4 rounded-2xl text-[10px] font-black italic shadow-lg active:scale-95 transition-all cursor-pointer uppercase tracking-widest">
                    ✓ DISBURSE SALARY
                  </button>
                ) : (
                  <div className="w-full bg-green-50 text-green-600 py-4 rounded-2xl text-[10px] font-black italic border border-green-100 text-center uppercase tracking-widest">
                    Paid for {selectedMonth.split(' ')[0]} ✓
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- MODALS SECTION --- */}
      {showAddPaymentModal && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-[#0A1128]/60 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-[3.5rem] shadow-2xl p-12 text-left">
            <h2 className="text-2xl font-black text-[#0A1128] italic mb-8 border-b pb-4 tracking-tighter uppercase">Manual Entry System</h2>
            <form onSubmit={handleSavePayment} className="space-y-6">
              <div className="space-y-1">
                 <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Select Target Member</label>
                 <select value={selectedMember} onChange={e=>setSelectedMember(e.target.value)} className="w-full bg-gray-50 border-none rounded-2xl p-5 font-bold text-sm outline-none cursor-pointer">
                    {members.map(m => <option key={m.id} value={m.name}>{m.name} ({m.language})</option>)}
                 </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Amount (DZD)</label>
                   <input type="number" value={payAmount} onChange={e=>setPayAmount(e.target.value)} className="w-full bg-gray-50 border-none rounded-2xl p-5 font-bold text-sm outline-none" />
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Payment Date</label>
                   <input type="date" value={payDate} onChange={e=>setPayDate(e.target.value)} className="w-full bg-gray-50 border-none rounded-2xl p-5 font-bold text-sm outline-none cursor-pointer" />
                </div>
              </div>
              <div className="space-y-1">
                 <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Notes / Reference</label>
                 <input type="text" placeholder="Optional notes..." value={payNotes} onChange={e=>setPayNotes(e.target.value)} className="w-full bg-gray-50 border-none rounded-2xl p-5 font-bold text-sm outline-none" />
              </div>

              <div className="bg-gray-100 rounded-xl p-4 border border-gray-200">
                <h4 className="text-sm font-bold text-[#0A1128] mb-3">Payment Summary</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between"><span className="text-gray-500 font-medium">Payment Amount:</span><span className="font-bold text-gray-700">{payAmount} دج</span></div>
                  <div className="flex justify-between border-t border-gray-200 pt-2 mt-2"><span className="text-gray-800 font-bold">New Balance:</span><span className="font-bold text-green-600">0 دج</span></div>
                </div>
              </div>

            </div>

            <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-white rounded-b-2xl">
              <button onClick={() => setShowAddPaymentModal(false)} className="px-5 py-2.5 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer">Cancel</button>
              <button
                onClick={handleSavePayment}
                className="px-5 py-2.5 rounded-lg text-sm font-bold bg-[#0A1128] text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Record Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {showReceiptModal && receiptData && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center bg-[#1A2252]/80 backdrop-blur-xl p-4 animate-in zoom-in-95 duration-300">
          <div className="bg-white w-full max-w-sm rounded-[3rem] shadow-2xl p-12 text-center relative">
            <button onClick={() => setShowReceiptModal(false)} className="absolute top-8 right-8 text-gray-300 hover:text-red-500 text-2xl cursor-pointer">✕</button>
            <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mb-8 mx-auto shadow-2xl text-3xl font-black italic ring-8 ring-green-50">✓</div>
            <h2 className="text-3xl font-black italic text-[#0A1128] mb-1 tracking-tighter">Receipt Generated</h2>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-10">{receiptData.name}</p>
            <div className="bg-gray-50 rounded-[2rem] p-8 mb-10 border border-gray-100">
               <p className="text-[9px] font-black text-gray-300 uppercase mb-2">Amount Confirmed</p>
               <p className="text-4xl font-black text-[#0A1128] tracking-tighter">{receiptData.amount} دج</p>
               <p className="text-[10px] text-gray-400 font-bold mt-2 italic">Paid on: {receiptData.date}</p>
            </div>
            <button onClick={() => { showToast("Exporting PDF Receipt..."); setShowReceiptModal(false); }} className="w-full bg-[#0A1128] text-white py-5 rounded-[1.5rem] font-black italic text-[11px] shadow-xl tracking-widest flex items-center justify-center gap-3">
               📥 GENERATE PDF DOSSIER
            </button>

          </div>
        </div>
      )}

    </div>
  );
};

export default Payment;
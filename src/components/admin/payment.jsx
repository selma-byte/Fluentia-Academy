import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

// ==========================================
// 🔔 MODERN NOTIFICATION COMPONENT (ENLARGED)
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
  const [currentView, setCurrentView] = useState('student'); // 'student' or 'staff'
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // --- Student Data States ---
  const [members, setMembers] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [selectedMember, setSelectedMember] = useState('');
  const [payAmount, setPayAmount] = useState('3000');
  const [payMethod, setPayMethod] = useState('Cash');
  const [payNotes, setPayNotes] = useState('');
  const [receiptData, setReceiptData] = useState(null);

  // --- Filters ---
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [langFilter, setLangFilter] = useState('All');
  const [groupFilter, setGroupFilter] = useState('All');

  // --- Staff States ---
  const [staffList, setStaffList] = useState([]);
  const [roleFilter, setRoleFilter] = useState('All');
  const [selectedMonth, setSelectedMonth] = useState('April 2026');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4500);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Students with logic to merge names
      const { data: studentsData } = await supabase.from('students').select('*');
      if (studentsData) {
        const formattedStudents = studentsData.map(s => ({
          id: s.id,
          name: `${s.first_name || ''} ${s.last_name || ''}`.trim() || 'Unknown Student', 
          language: s.language || 'English', 
          group: s.level || s.group || 'Standard', 
          status: s.status === 'Paid' ? 'Paid' : 'Due Soon', 
          balance: s.status === 'Paid' ? 0 : 3000,
          dueDate: "End of Month",
          overdueText: s.status === 'Overdue' ? "Needs attention" : ""
        }));
        setMembers(formattedStudents.length > 0 ? formattedStudents : getFallbackMembers());
        if (formattedStudents.length > 0) setSelectedMember(formattedStudents[0].name);
      } else {
        setMembers(getFallbackMembers());
      }

      // 2. Fetch History for Payments
      const { data: paymentsData } = await supabase.from('payments').select('*').order('payment_date', { ascending: false });
      if (paymentsData) {
        const formattedPayments = paymentsData.map(p => ({
          id: p.id,
          date: new Date(p.payment_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
          member: p.member_name,
          amount: `${p.amount} دج`,
          status: p.status,
          method: p.payment_method || 'Cash',
          notes: p.notes
        }));
        setPaymentHistory(formattedPayments);
      }

      // 3. Fetch Staff List
      const { data: staffData } = await supabase.from('staff').select('*');
      if (staffData) {
        setStaffList(staffData.map(s => ({
          id: s.id,
          name: `${s.first_name} ${s.last_name}`,
          role: s.role,
          salary: s.role === 'Teacher' ? 45000 : s.role === 'Secretary' ? 35000 : 25000,
          status: 'Pending', // Local state tracking for month disburse
          avatar: (s.first_name[0] + s.last_name[0]).toUpperCase()
        })));
      }

    } catch (err) {
      showToast("Sync Error: " + err.message);
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const getFallbackMembers = () => [
    { id: 1, name: "Juan Dela Cruz", language: "Spanish", group: "A1", status: "Paid", balance: 0, dueDate: "August 10, 2025", overdueText: "" },
    { id: 2, name: "Maria Santos", language: "English", group: "B2", status: "Overdue", balance: 3000, dueDate: "August 8, 2025", overdueText: "Needs attention" }
  ];

  const processPayment = async (name, amount, method, notes) => {
    try {
      const { error: payError } = await supabase.from('payments').insert([{
        member_name: name, amount: parseFloat(amount), status: 'Paid', payment_method: method, notes: notes
      }]);
      if (payError) throw payError;

      setReceiptData({ name, amount, method, date: new Date().toLocaleString() });
      setShowAddPaymentModal(false);
      setShowReceiptModal(true);
      showToast(`Successful Transaction for ${name} ✅`);
      fetchData(); 
    } catch (err) {
      showToast("Error saving payment: " + err.message);
    }
  };

  const handleSavePayment = (e) => {
    e.preventDefault();
    processPayment(selectedMember, payAmount, payMethod, payNotes);
  };

  const markAsPaid = (id, name, amount) => {
    processPayment(name, amount, 'Cash', 'Quick verified by Admin');
  };

  // Fixed: Disburse Salary Status Update
  const handleStaffPay = (id, name) => {
    setStaffList(prev => prev.map(staff => 
      staff.id === id ? { ...staff, status: 'Paid' } : staff
    ));
    showToast(`Salary for ${name} disbursed for ${selectedMonth} 💸`);
  };

  // --- Statistics Calculation ---
  const totalIncome = paymentHistory.reduce((sum, p) => sum + parseInt(p.amount.replace(/\D/g,'')), 0);
  const unpaidCount = members.filter(m => m.status !== 'Paid').length;
  const unpaidBalance = members.reduce((sum, m) => sum + m.balance, 0);
  const dueSoonCount = members.filter(m => m.status === 'Due Soon').length;

  const filteredMembers = members.filter(m => {
    const matchesSearch = (m.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || m.status === statusFilter;
    const matchesLang = langFilter === 'All' || m.language === langFilter;
    const matchesGroup = groupFilter === 'All' || m.group === groupFilter;
    return matchesSearch && matchesStatus && matchesLang && matchesGroup;
  });

  const filteredStaff = staffList.filter(s => roleFilter === 'All' || s.role === roleFilter);

  return (
    <div className="flex-1 h-full overflow-y-auto bg-[#F8F9FA] p-8 custom-scrollbar relative font-sans text-left">
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      <div className="mb-8 flex justify-between items-center">
        <h2 className="text-3xl font-black text-[#0A1128] italic tracking-tight uppercase">Financial Dashboard</h2>
        <div className="flex space-x-2 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
           <button onClick={() => setCurrentView('student')} className={`px-8 py-2.5 rounded-xl text-[11px] font-black italic transition-all cursor-pointer ${currentView === 'student' ? 'bg-[#0A1128] text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'}`}>STUDENTS</button>
           <button onClick={() => setCurrentView('staff')} className={`px-8 py-2.5 rounded-xl text-[11px] font-black italic transition-all cursor-pointer ${currentView === 'staff' ? 'bg-[#0A1128] text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'}`}>STAFF PAYROLL</button>
        </div>
      </div>

      {currentView === 'student' ? (
        <div className="animate-in fade-in duration-500">
          
          {/* STATS CARDS (Exactly from screenshot) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10 text-left">
             <div className="bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-4"><span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Total Income</span><span className="text-green-500 font-bold">$</span></div>
                <p className="text-2xl font-black text-[#0A1128]">{totalIncome.toLocaleString()} دج</p>
                <p className="text-[9px] text-gray-400 font-bold mt-1 italic">From all paid members</p>
             </div>
             <div className="bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-4"><span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Unpaid Members</span><span className="text-indigo-500 font-bold">👥</span></div>
                <p className="text-2xl font-black text-red-600">{unpaidCount}</p>
                <p className="text-[9px] text-gray-400 font-bold mt-1 italic">{unpaidBalance.toLocaleString()} دج outstanding</p>
             </div>
             <div className="bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-4"><span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Overdue Payments</span><span className="text-red-500 font-bold">⚠️</span></div>
                <p className="text-2xl font-black text-[#0A1128]">0</p>
                <p className="text-[9px] text-gray-400 font-bold mt-1 italic">Requires immediate attention</p>
             </div>
             <div className="bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-4"><span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Due Soon</span><span className="text-blue-500 font-bold">📅</span></div>
                <p className="text-2xl font-black text-[#0A1128]">{dueSoonCount}</p>
                <p className="text-[9px] text-gray-400 font-bold mt-1 italic">Within next 5 days</p>
             </div>
          </div>

          <div className="flex justify-between items-center mb-8">
             <h3 className="text-lg font-black text-[#0A1128] italic uppercase tracking-widest">Member Payment Status</h3>
             <button onClick={() => setShowAddPaymentModal(true)} className="bg-[#0A1128] text-white px-8 py-3 rounded-2xl text-[10px] font-black italic shadow-xl hover:bg-slate-800 transition-all cursor-pointer">+ ADD PAYMENT</button>
          </div>

          {/* Filtering Hub */}
          <div className="mb-8 flex flex-wrap gap-4 bg-white p-6 rounded-[2rem] shadow-sm border border-gray-50 items-center text-left">
             <div className="relative flex-1 min-w-[250px]">
                <span className="absolute inset-y-0 left-6 flex items-center text-gray-400">🔍</span>
                <input type="text" placeholder="Search student name..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-14 pr-6 text-sm font-bold outline-none" />
             </div>
             <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-gray-50 border-none rounded-2xl px-6 py-4 text-xs font-black italic outline-none cursor-pointer">
                <option value="All">All Status</option><option value="Paid">Paid</option><option value="Due Soon">Due Soon</option><option value="Overdue">Overdue</option>
             </select>
             <select value={langFilter} onChange={e => setLangFilter(e.target.value)} className="bg-gray-50 border-none rounded-2xl px-6 py-4 text-xs font-black italic outline-none cursor-pointer">
                <option value="All">All Languages</option>
                {[...new Set(members.map(m=>m.language))].map(l=><option key={l} value={l}>{l}</option>)}
             </select>
             <select value={groupFilter} onChange={e => setGroupFilter(e.target.value)} className="bg-gray-50 border-none rounded-2xl px-6 py-4 text-xs font-black italic outline-none cursor-pointer">
                <option value="All">All Groups</option>
                {[...new Set(members.map(m=>m.group))].map(g=><option key={g} value={g}>{g}</option>)}
             </select>
          </div>

          {/* Student Grid (Detailed Logic from original) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMembers.map(member => (
              <div key={member.id} className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm hover:shadow-2xl transition-all relative overflow-hidden group">
                {member.status === 'Overdue' && <div className="absolute left-0 top-0 h-full w-1.5 bg-red-500" />}
                <span className="absolute top-6 right-8 text-[9px] font-black bg-orange-50 text-orange-600 px-3 py-1 rounded-lg italic">{member.status}</span>
                <h4 className="font-black text-[#0A1128] italic text-xl leading-tight mb-1">{member.name}</h4>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">{member.language} • {member.group}</p>
                <div className="space-y-4 mb-8 text-left">
                   <div className="border-b border-gray-50 pb-2">
                      <p className="text-[9px] font-black text-gray-300 uppercase italic mb-1 tracking-widest">📅 Due Date</p>
                      <p className="text-xs font-bold text-gray-600">{member.dueDate}</p>
                   </div>
                   <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <p className="text-sm font-black text-[#0A1128]">Current Balance</p>
                        <p className={`text-[9px] font-black uppercase tracking-tighter ${member.balance > 0 ? 'text-red-500' : 'text-green-500'}`}>
                           {member.balance > 0 ? 'Balance Due' : 'Fully Settled'}
                        </p>
                      </div>
                      <p className={`text-2xl font-black ${member.balance > 0 ? 'text-red-600' : 'text-green-500'}`}>{member.balance} دج</p>
                   </div>
                </div>
                {member.balance > 0 ? (
                  <div className="flex gap-2">
                    <button onClick={() => markAsPaid(member.id, member.name, member.balance)} className="flex-1 bg-green-500 text-white py-3.5 rounded-2xl text-[10px] font-black italic shadow-lg hover:bg-green-600 active:scale-95 transition-all cursor-pointer">✓ MARK PAID</button>
                    <button onClick={() => showToast(`Payment reminder sent to ${member.name} 📲`)} className="bg-[#0A1128] text-white px-5 rounded-2xl shadow-lg hover:bg-slate-800 transition-all cursor-pointer">🔔</button>
                  </div>
                ) : (
                  <button onClick={() => { setReceiptData({ name: member.name, amount: "3000", method: "Direct", date: "Archived" }); setShowReceiptModal(true); }} className="w-full bg-green-50 text-green-600 py-4 rounded-2xl text-[10px] font-black italic border border-green-100 hover:bg-green-100 transition-all uppercase tracking-widest cursor-pointer">View Receipt ✓</button>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* STAFF PAYROLL VIEW */
        <div className="animate-in slide-in-from-bottom-10 duration-700">
          <div className="mb-10 flex justify-between items-center">
            <div className="flex gap-4">
              <select value={selectedMonth} onChange={e=>setSelectedMonth(e.target.value)} className="bg-white border border-gray-100 rounded-2xl px-6 py-4 text-xs font-black italic outline-none shadow-sm cursor-pointer"><option>March 2026</option><option>April 2026</option><option>May 2026</option></select>
              <select value={roleFilter} onChange={e=>setRoleFilter(e.target.value)} className="bg-[#0A1128] text-white rounded-2xl px-6 py-4 text-xs font-black italic outline-none shadow-xl cursor-pointer">
                <option value="All">All Staff</option>
                <option value="Teacher">Teachers</option>
                <option value="Secretary">Secretary</option>
                <option value="Lady Cleaning">Cleaning Crew</option>
                <option value="Security Guard">Security guard</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-[3.5rem] shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-[11px] font-black text-gray-300 uppercase italic tracking-widest border-b">
                  <th className="px-10 py-8">Employee Details</th>
                  <th className="text-center">Monthly Salary</th>
                  <th className="text-center">Status</th>
                  <th className="px-10 py-8 text-right">Payroll Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-left">
                {filteredStaff.map((staff) => (
                  <tr key={staff.id} className="hover:bg-gray-50/50 transition-all group">
                    <td className="px-10 py-6 flex items-center gap-4">
                       <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-black text-xs group-hover:scale-110 transition-transform">{staff.avatar}</div>
                       <div>
                          <h4 className="font-bold text-[#0A1128]">{staff.name}</h4>
                          <p className="text-[9px] font-black text-gray-300 uppercase italic tracking-tighter">{staff.role}</p>
                       </div>
                    </td>
                    <td className="text-center font-black text-[#0A1128]">{staff.salary.toLocaleString()} دج</td>
                    <td className="text-center">
                      <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase border italic transition-colors ${staff.status === 'Paid' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-pink-50 text-pink-600 border-pink-100'}`}>
                        {staff.status}
                      </span>
                    </td>
                    <td className="px-10 py-6 text-right">
                      {staff.status === 'Pending' ? (
                        <button onClick={() => handleStaffPay(staff.id, staff.name)} className="bg-[#0A1128] text-white px-8 py-3 rounded-2xl text-[10px] font-black italic shadow-xl hover:bg-green-600 transition-all cursor-pointer">DISBURSE SALARY</button>
                      ) : (
                        <div className="flex items-center justify-end gap-2 text-[10px] font-black text-gray-300 uppercase italic tracking-widest">
                           Paid for {selectedMonth.split(' ')[0]} <span className="text-green-500 font-bold">✓</span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- MODAL: RECORD COLLECTION --- */}
      {showAddPaymentModal && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-[#0A1128]/60 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-[3.5rem] shadow-2xl p-12 text-left">
            <h2 className="text-2xl font-black text-[#0A1128] italic mb-8 border-b pb-4 tracking-tighter">Manual Entry System</h2>
            <form onSubmit={handleSavePayment} className="space-y-6">
              <div className="space-y-1">
                 <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Select Target Member</label>
                 <select value={selectedMember} onChange={e=>setSelectedMember(e.target.value)} className="w-full bg-gray-50 border-none rounded-2xl p-5 font-bold text-sm outline-none focus:ring-2 ring-blue-500/10 cursor-pointer">
                    {members.map(m => <option key={m.id} value={m.name}>{m.name} ({m.language})</option>)}
                 </select>
              </div>
              <div className="space-y-1">
                 <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Amount to Collect (DZD)</label>
                 <input type="number" value={payAmount} onChange={e=>setPayAmount(e.target.value)} className="w-full bg-gray-50 border-none rounded-2xl p-5 font-bold text-sm outline-none" />
              </div>
              <div className="flex justify-end gap-6 pt-8 items-center">
                <button type="button" onClick={() => setShowAddPaymentModal(false)} className="text-xs font-black text-gray-400 uppercase italic tracking-widest cursor-pointer">Discard</button>
                <button type="submit" className="px-14 py-5 bg-[#0A1128] text-white rounded-2xl text-[10px] font-black italic shadow-xl active:scale-95 transition-all uppercase tracking-widest">Confirm Transaction</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: MODERN RECEIPT --- */}
      {showReceiptModal && receiptData && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center bg-[#1A2252]/80 backdrop-blur-xl p-4 animate-in zoom-in-95 duration-300">
          <div className="bg-white w-full max-w-sm rounded-[3rem] shadow-2xl p-12 text-center relative border border-white/20">
            <button onClick={() => setShowReceiptModal(false)} className="absolute top-8 right-8 text-gray-300 hover:text-red-500 text-2xl cursor-pointer">✕</button>
            <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mb-8 mx-auto shadow-2xl text-3xl font-black italic ring-8 ring-green-50">✓</div>
            <h2 className="text-3xl font-black italic text-[#0A1128] mb-1 tracking-tighter">Receipt Generated</h2>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-10">{receiptData.name}</p>
            <div className="bg-gray-50 rounded-[2rem] p-8 mb-10 border border-gray-100">
               <p className="text-[9px] font-black text-gray-300 uppercase mb-2 tracking-tighter">Amount Confirmed</p>
               <p className="text-4xl font-black text-[#0A1128] tracking-tighter">{receiptData.amount} دج</p>
            </div>
            <button onClick={() => { showToast("Exporting PDF Receipt..."); setShowReceiptModal(false); }} className="w-full bg-[#0A1128] text-white py-5 rounded-[1.5rem] font-black italic text-[11px] shadow-xl tracking-widest active:scale-95 flex items-center justify-center gap-3">
               <span className="text-lg">📥</span> GENERATE PDF DOSSIER
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;
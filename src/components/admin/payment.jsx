import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

// ==========================================
// 🔔 MODERN NOTIFICATION COMPONENT (BLUE)
// ==========================================
const Toast = ({ message, onClose }) => (
  <div className="fixed bottom-12 right-12 z-[1000] animate-in slide-in-from-right duration-500 text-left">
    <div className="bg-[#1A2252] text-white px-10 py-6 rounded-[2.5rem] shadow-2xl flex items-center gap-6 border border-blue-400/30 backdrop-blur-xl min-w-[450px]">
      <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-blue-500/40">
        <span className="animate-pulse">✨</span>
      </div>
      <div className="flex-1">
        <p className="text-xl font-black italic tracking-tight leading-none mb-1 text-white">Financial Update</p>
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
  const [toast, setToast] = useState({ show: false, message: '' });
  const [loading, setLoading] = useState(true);

  // --- Data States ---
  const [members, setMembers] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [staffHistory, setStaffHistory] = useState([]);

  // --- Form States ---
  const [selectedId, setSelectedId] = useState('');
  const [payAmount, setPayAmount] = useState('3000');
  const [payMethod, setPayMethod] = useState('Cash');
  const [payNotes, setPayNotes] = useState('');
  const [receiptData, setReceiptData] = useState(null);

  // --- Filters ---
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [langFilter, setLangFilter] = useState('All');
  const [groupFilter, setGroupFilter] = useState('All');
  
  const [staffSearchTerm, setStaffSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [monthFilter, setMonthFilter] = useState('April 2026');

  const monthsList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map(m => `${m} 2026`);

  const showNotification = (msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: '' }), 4500);
  };

  // =======================================
  // 1. Fetching Data from Supabase
  // =======================================
  const fetchData = async () => {
    setLoading(true);
    try {
      // جلب التلاميذ
      const { data: studentsData } = await supabase.from('students').select('*');
      
      // جلب كل الدفعات (تلاميذ + أساتذة)
      const { data: paymentsData } = await supabase
        .from('payments')
        .select('*, students(first_name, last_name)')
        .order('payment_date', { ascending: false });

      const sData = studentsData || [];
      const pData = paymentsData || [];

      // فصل دفعات التلاميذ عن دفعات الأساتذة
      const studentPayments = pData.filter(p => p.student_id != null || (p.notes && !p.notes.includes('Payroll')));
      const staffPayments = pData.filter(p => p.notes && p.notes.includes('Payroll'));

      // مابينغ للتلاميذ
      setMembers(sData.map(s => ({
        id: s.id,
        name: `${s.first_name || ''} ${s.last_name || ''}`.trim(),
        language: s.language || 'English',
        group: s.level || s.group_name || 'Standard',
        status: s.status === 'Paid' ? 'Paid' : (s.status === 'Overdue' ? 'Overdue' : 'Due Soon'),
        balance: s.status === 'Paid' ? 0 : 3000,
        dueDate: "End of Month",
        overdueText: s.status === 'Overdue' ? "Needs attention" : ""
      })));

      // مابينغ لسجل دفعات التلاميذ
      setPaymentHistory(studentPayments.map(p => ({
        id: p.id,
        date: new Date(p.payment_date || p.created_at).toLocaleDateString('en-GB'),
        member: p.students ? `${p.students.first_name} ${p.students.last_name}` : p.member_name,
        amount: `${p.amount} DZD`,
        status: p.status,
        method: p.payment_method || 'Cash'
      })));

      // جلب الأساتذة
      const { data: staffData } = await supabase.from('staff').select('*');
      if (staffData) {
        setStaffList(staffData.map(s => ({
          id: s.id, 
          name: `${s.first_name} ${s.last_name}`, 
          role: s.role || 'Staff',
          salary: s.salary || 35000
        })));
      }

      // مابينغ لسجل رواتب الأساتذة
      setStaffHistory(staffPayments.map(p => ({
        id: p.id,
        date: new Date(p.payment_date || p.created_at).toLocaleDateString('en-GB'),
        name: p.member_name,
        month: p.notes.replace('Payroll for ', ''),
        amount: `${p.amount} DZD`,
        method: p.payment_method || 'Cash'
      })));

    } catch (err) { showNotification("Sync Error: " + err.message); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  // =======================================
  // 2. Logic Functions (Write to Database)
  // =======================================
  const processStudentPayment = async () => {
    try {
      if (!selectedId) return showNotification("⚠️ Please select a student!");
      const student = members.find(m => m.id.toString() === selectedId.toString());
      if (!student) return;

      const { error: payError } = await supabase.from('payments').insert([{
        student_id: selectedId, 
        member_name: student.name, 
        amount: parseFloat(payAmount),
        status: 'Paid', 
        payment_method: payMethod, 
        notes: payNotes
      }]);
      if (payError) throw payError;

      await supabase.from('students').update({ status: 'Paid' }).eq('id', selectedId);
      
      setReceiptData({ name: student.name, amount: payAmount, method: payMethod, date: new Date().toLocaleString('en-GB'), txn: `TXN-${Math.floor(Math.random() * 90000) + 10000}` });
      setShowAddPaymentModal(false); setShowReceiptModal(true);
      fetchData();
    } catch (err) { showNotification("Payment Error: " + err.message); }
  };

  const processStaffPayment = async (id, amount, method, month) => {
    const staff = staffList.find(s => s.id === id);
    if (!staff) return;

    try {
      const { error } = await supabase.from('payments').insert([{
        member_name: staff.name,
        amount: parseFloat(amount),
        status: 'Paid',
        payment_method: method,
        notes: `Payroll for ${month}`
      }]);

      if (error) throw error;

      setReceiptData({ name: staff.name, amount, method, date: new Date().toLocaleString('en-GB'), txn: `TXN-${Math.floor(Math.random() * 90000) + 10000}` });
      setShowAddPaymentModal(false); setShowReceiptModal(true);
      showNotification(`Salary disbursed to ${staff.name} for ${month}`);
      
      fetchData(); // تحديث القوائم باش يولي 'Paid'
    } catch (err) {
      showNotification("Payroll Error: " + err.message);
    }
  };

  const notifyStudent = (name) => showNotification(`✅ Reminder sent successfully to: ${name}`);

  // =======================================
  // 3. Dynamic Filters & Stats
  // =======================================
  const totalIncome = paymentHistory.reduce((sum, p) => sum + parseInt(p.amount.replace(/\D/g,'') || 0), 0);
  const unpaidCount = members.filter(m => m.status !== 'Paid').length;
  const overdueCount = members.filter(m => m.status === 'Overdue').length;

  const filteredMembers = members.filter(m => {
    return m.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
           (statusFilter === 'All' || m.status === statusFilter) &&
           (langFilter === 'All' || m.language === langFilter) &&
           (groupFilter === 'All' || m.group === groupFilter);
  });

  // 💡 اللوجيك السحري: تفقد حالة دفع الأستاذ حسب الشهر المختار!
  const staffWithStatus = staffList.map(s => {
    const isPaid = staffHistory.some(h => h.name === s.name && h.month === monthFilter);
    return { ...s, status: isPaid ? 'Paid' : 'Pending' };
  });

  const filteredStaff = staffWithStatus.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(staffSearchTerm.toLowerCase());
    const matchesRole = roleFilter === 'All' || s.role.toLowerCase() === roleFilter.toLowerCase();
    return matchesSearch && matchesRole;
  });

  const uniqueLanguages = [...new Set(members.map(m => m.language).filter(Boolean))];
  const uniqueGroups = [...new Set(members.map(m => m.group).filter(Boolean))];

  return (
    <div className="flex-1 h-full overflow-y-auto bg-[#F8F9FA] p-8 custom-scrollbar relative font-sans text-left">
      {toast.show && <Toast message={toast.message} onClose={() => setToast({ show: false, message: '' })} />}

      {/* HEADER & TOGGLE */}
      <div className="mb-8 flex justify-between items-center">
        <h2 className="text-3xl font-black text-[#0A1128] italic uppercase">Financial Dashboard</h2>
        <div className="flex space-x-2 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
           <button onClick={() => setCurrentView('student')} className={`px-8 py-2.5 rounded-xl text-[11px] font-black italic transition-all cursor-pointer ${currentView === 'student' ? 'bg-[#0A1128] text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'}`}>STUDENTS</button>
           <button onClick={() => setCurrentView('staff')} className={`px-8 py-2.5 rounded-xl text-[11px] font-black italic transition-all cursor-pointer ${currentView === 'staff' ? 'bg-[#0A1128] text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'}`}>STAFF PAYROLL</button>
        </div>
      </div>

      <div className="mb-8 flex justify-end">
        <button onClick={() => { setSelectedId(''); setShowAddPaymentModal(true); }} className="bg-[#0A1128] px-6 py-2.5 rounded-lg text-sm font-bold text-white shadow-lg hover:bg-slate-800 transition-all active:scale-95 cursor-pointer">
          <span className="mr-2 text-lg">$</span> {currentView === 'student' ? 'Add Student Payment' : 'Add Staff Payment'}
        </button>
      </div>

      {currentView === 'student' ? (
        <div className="animate-in fade-in duration-500">
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
            {[
              { title: "Total Income", value: `${totalIncome} DZD`, icon: "$", color: "text-green-500" },
              { title: "Unpaid Members", value: unpaidCount.toString(), icon: "👥", color: "text-gray-400" },
              { title: "Overdue Payments", value: overdueCount.toString(), icon: "⚠", color: "text-red-500" },
              { title: "Due Soon", value: members.filter(m=>m.status==='Due Soon').length.toString(), icon: "📅", color: "text-orange-400" }
            ].map((stat, i) => (
              <div key={i} className="flex h-32 flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase tracking-tight"><span>{stat.title}</span><span className={stat.color}>{stat.icon}</span></div>
                <div className={`text-2xl font-black ${stat.title.includes('Unpaid') ? 'text-red-600' : 'text-black'}`}>{stat.value}</div>
              </div>
            ))}
          </div>

          <div className="mb-6 flex flex-col xl:flex-row items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-base font-bold text-[#0A1128]">Member Payment Status</h3>
            <div className="flex flex-wrap gap-3">
              <input type="text" placeholder="Search student..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} className="bg-gray-50 border border-gray-200 rounded-lg py-2 px-4 text-sm font-bold outline-none" />
              <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} className="bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-sm font-bold">
                <option value="All">All Status</option><option value="Paid">Paid</option><option value="Overdue">Overdue</option>
              </select>
              <select value={langFilter} onChange={e=>setLangFilter(e.target.value)} className="bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-sm font-bold">
                <option value="All">Languages</option>{uniqueLanguages.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMembers.map(m => (
              <div key={m.id} className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm relative group hover:shadow-md transition-all">
                <span className={`absolute top-6 right-8 text-[9px] font-black px-3 py-1 rounded-lg italic ${m.status==='Paid'?'bg-green-50 text-green-600':'bg-red-50 text-red-600'}`}>{m.status}</span>
                <h4 className="font-black text-[#0A1128] italic text-xl mb-1">{m.name}</h4>
                <p className="text-[10px] font-black text-gray-400 uppercase mb-6 tracking-widest">{m.language} • {m.group}</p>
                <div className="flex justify-between items-end border-t border-gray-50 pt-4 mt-4">
                    <p className="text-sm font-black text-[#0A1128]">Current Balance</p>
                    <p className={`text-2xl font-black ${m.balance > 0 ? 'text-red-600' : 'text-green-500'}`}>{m.balance} DZD</p>
                </div>
                {m.status !== 'Paid' ? (
                  <div className="flex gap-2 mt-6">
                    <button onClick={() => { setSelectedId(m.id); setPayAmount(m.balance); setShowAddPaymentModal(true); }} className="flex-1 bg-green-500 text-white py-3.5 rounded-2xl text-[10px] font-black shadow-lg cursor-pointer">✓ MARK PAID</button>
                    <button onClick={() => notifyStudent(m.name)} className="bg-[#0A1128] text-white px-5 rounded-2xl shadow-lg hover:bg-slate-800 transition-all cursor-pointer flex items-center justify-center">🔔</button>
                  </div>
                ) : (
                  <button onClick={() => { setReceiptData({ name: m.name, amount: "3000", method: "Cash", date: new Date().toLocaleString(), txn: `TXN-${m.id}` }); setShowReceiptModal(true); }} className="w-full mt-6 bg-gray-50 text-gray-500 py-3 rounded-2xl text-[10px] font-black italic hover:bg-gray-100 cursor-pointer">VIEW RECEIPT</button>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm overflow-x-auto">
            <h3 className="text-base font-bold text-[#0A1128] mb-6">Payment History & Tracking</h3>
            <table className="w-full text-left text-xs min-w-[700px]">
              <thead>
                <tr className="bg-gray-50 text-[10px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100">
                  <th className="px-6 py-4">Date</th><th className="px-6 py-4">Member</th><th className="px-6 py-4">Amount</th><th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paymentHistory.map((row, i) => (
                  <tr key={i} className="hover:bg-indigo-50/30">
                    <td className="px-6 py-4 text-gray-500 font-medium">{row.date}</td>
                    <td className="px-6 py-4 font-bold text-[#0A1128]">{row.member}</td>
                    <td className="px-6 py-4 font-bold text-gray-600">{row.amount}</td>
                    <td className="px-6 py-4 text-right"><button className="font-bold text-gray-400 hover:text-[#0A1128]">Details</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* STAFF VIEW */
        <div className="animate-in slide-in-from-bottom-10 duration-700">
          <div className="mb-8 flex justify-between items-center">
             <div className="flex items-center space-x-3">
                <h3 className="text-xl font-bold text-[#0A1128]">Staff Payroll</h3>
                <select value={monthFilter} onChange={e=>setMonthFilter(e.target.value)} className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs font-bold shadow-sm cursor-pointer outline-none">
                   {monthsList.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
             <div className="bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-sm">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-4">Paid This Month</p>
                <p className="text-2xl font-black text-[#0A1128]">{staffWithStatus.filter(s=>s.status==='Paid').reduce((sum,s)=>sum+Number(s.salary),0).toLocaleString()} DZD</p>
             </div>
             <div className="bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-sm">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-4">Pending Staff</p>
                <p className="text-2xl font-black text-red-600">{staffWithStatus.filter(s=>s.status==='Pending').length}</p>
             </div>
          </div>

          <div className="mb-8 flex flex-col space-y-6 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50">
             <div className="flex items-center space-x-3 overflow-x-auto pb-2">
                {['All', 'Secretary', 'Teacher', 'Body Guard', 'Cleaning Lady'].map((role) => (
                    <button key={role} onClick={() => setRoleFilter(role)} className={`px-6 py-2.5 rounded-xl text-[10px] font-black italic uppercase tracking-widest transition-all cursor-pointer ${roleFilter === role ? 'bg-[#0A1128] text-white shadow-lg' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}>{role}</button>
                ))}
             </div>
             <input type="text" placeholder="Search staff name..." value={staffSearchTerm} onChange={e => setStaffSearchTerm(e.target.value)} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold outline-none" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {filteredStaff.map((staff) => (
               <div key={staff.id} className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                 <span className={`absolute top-6 right-8 text-[9px] font-black px-3 py-1 rounded-lg italic border tracking-widest uppercase ${staff.status === 'Paid' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>{staff.status}</span>
                 <h4 className="font-black text-[#0A1128] italic text-xl mb-1">{staff.name}</h4>
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">{staff.role}</p>
                 <div className="flex justify-between items-end border-t border-gray-50 pt-4 mt-4">
                    <p className="text-sm font-black text-[#0A1128]">Monthly Salary</p>
                    <p className="text-2xl font-black text-red-600">{Number(staff.salary).toLocaleString()} DZD</p>
                 </div>
                 {staff.status === 'Pending' ? (
                   <button onClick={() => processStaffPayment(staff.id, staff.salary, 'Cash', monthFilter)} className="w-full mt-6 bg-green-500 text-white py-4 rounded-2xl text-[10px] font-black shadow-lg cursor-pointer hover:bg-green-600 transition-colors">✓ DISBURSE SALARY</button>
                 ) : (
                   <div className="w-full mt-6 bg-green-50 text-green-600 py-4 rounded-2xl text-[10px] font-black text-center uppercase border border-green-100">Paid for {monthFilter} ✓</div>
                 )}
               </div>
             ))}
          </div>

          <div className="mt-12 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm overflow-x-auto">
             <h3 className="text-base font-bold text-[#0A1128] mb-6">Staff Disbursement History</h3>
             <table className="w-full text-left text-xs min-w-[700px]">
                <thead className="bg-gray-50 text-gray-400 uppercase text-[10px] font-bold">
                   <tr><th className="px-6 py-4">Date</th><th className="px-6 py-4">Employee</th><th className="px-6 py-4">Month</th><th className="px-6 py-4">Amount</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                   {staffHistory.length === 0 ? <tr><td colSpan="4" className="text-center py-8 text-gray-400">No disbursements recorded yet.</td></tr> : 
                   staffHistory.map((row, i) => (
                      <tr key={i} className="hover:bg-green-50/30 transition-colors font-medium">
                         <td className="px-6 py-4">{row.date}</td><td className="px-6 py-4 font-bold text-[#0A1128]">{row.name}</td>
                         <td className="px-6 py-4"><span className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded text-[9px] font-bold">{row.month}</span></td>
                         <td className="px-6 py-4 font-black text-gray-700">{row.amount}</td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
        </div>
      )}

      {/* --- ADD PAYMENT MODAL --- */}
      {showAddPaymentModal && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl relative flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-[#0A1128] flex items-center"><span className="mr-2 text-green-500 text-lg">$</span> Add Payment</h2>
              <button onClick={() => setShowAddPaymentModal(false)} className="text-gray-400 hover:text-gray-800 font-bold text-xl cursor-pointer">✕</button>
            </div>
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Select Member / {currentView === 'student' ? 'Student' : 'Staff'}</label>
                <select value={selectedId} onChange={e=>setSelectedId(e.target.value)} className="w-full bg-gray-50 border border-gray-200 text-[#0A1128] rounded-lg p-3 outline-none text-sm font-bold cursor-pointer">
                  <option value="">Choose Target...</option>
                  {(currentView === 'student' ? members : staffList).map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 mr-3">👤</div>
                <div>
                   <div className="font-bold text-[#0A1128] text-sm">{(currentView === 'student' ? members : staffList).find(m=>m.id.toString()===selectedId.toString())?.name || "Select One"}</div>
                   <div className="text-[10px] text-gray-500">Due: End of Month</div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Payment Amount (DZD)</label>
                <input type="number" value={payAmount} onChange={e=>setPayAmount(e.target.value)} className="w-full bg-gray-50 border border-gray-200 text-[#0A1128] rounded-lg p-3 outline-none text-sm font-bold" />
                <button type="button" onClick={()=>setPayAmount(currentView === 'student' ? '3000' : '35000')} className="mt-2 bg-gray-200 text-gray-700 text-xs font-bold py-1.5 px-3 rounded-lg hover:bg-gray-300 cursor-pointer">Standard Fee ({currentView === 'student' ? '3000' : '35000'} DZD)</button>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Payment Method</label>
                <select value={payMethod} onChange={e=>setPayMethod(e.target.value)} className="w-full bg-gray-50 border border-gray-200 text-[#0A1128] rounded-lg p-3 outline-none text-sm font-bold cursor-pointer">
                  <option value="Cash">💵 Cash</option><option value="Card">💳 Credit Card</option><option value="Transfer">🏦 Transfer</option>
                </select>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <h4 className="text-[11px] font-black text-[#0A1128] uppercase mb-3">Payment Summary</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-gray-500 font-medium"><span>Payment Amount:</span><span className="font-bold text-[#0A1128]">{payAmount} DZD</span></div>
                  <div className="flex justify-between border-t border-gray-200 pt-2 mt-2 font-bold"><span className="text-[#0A1128]">New Balance:</span><span className="text-green-600">0 DZD</span></div>
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-3">
                <button onClick={() => setShowAddPaymentModal(false)} className="px-5 py-2.5 rounded-lg text-sm font-bold text-gray-500 hover:bg-gray-100 cursor-pointer">Cancel</button>
                <button onClick={currentView === 'student' ? processStudentPayment : () => processStaffPayment(selectedId, payAmount, payMethod, monthFilter)} className="px-6 py-2.5 rounded-lg text-sm font-bold bg-[#0A1128] text-white hover:bg-slate-800 shadow-md cursor-pointer">Record Payment</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- RECEIPT SUCCESS MODAL --- */}
      {showReceiptModal && receiptData && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl relative flex flex-col p-8 text-center">
            <button onClick={() => setShowReceiptModal(false)} className="absolute top-6 right-8 text-gray-400 hover:text-gray-800 font-bold text-xl cursor-pointer">✕</button>
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-sm border-4 border-white -mt-14">
               <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white text-xl font-bold">✓</div>
            </div>
            <h2 className="text-2xl font-bold text-[#0A1128] mb-2">Payment Success!</h2>
            <p className="text-sm text-gray-500 font-medium mb-6">Payment recorded for <strong className="text-black">{receiptData.name}</strong></p>
            <hr className="border-gray-100 mb-6" />
            <div className="mb-8">
               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Total Payment</p>
               <h1 className="text-4xl font-black text-[#0A1128]">{receiptData.amount} DZD</h1>
            </div>
            <div className="grid grid-cols-2 gap-3 text-left mb-8">
               <div className="border border-gray-100 rounded-xl p-3 bg-gray-50/50">
                 <p className="text-[9px] text-gray-400 font-bold uppercase mb-1">Ref Number</p>
                 <p className="text-xs font-bold text-[#0A1128]">{receiptData.txn || 'N/A'}</p>
               </div>
               <div className="border border-gray-100 rounded-xl p-3 bg-gray-50/50">
                 <p className="text-[9px] text-gray-400 font-bold uppercase mb-1">Payment Time</p>
                 <p className="text-[10px] font-bold text-[#0A1128] truncate">{receiptData.date}</p>
               </div>
               <div className="border border-gray-100 rounded-xl p-3 bg-gray-50/50">
                 <p className="text-[9px] text-gray-400 font-bold uppercase mb-1">Method</p>
                 <p className="text-xs font-bold text-[#0A1128]">{receiptData.method}</p>
               </div>
               <div className="border border-gray-100 rounded-xl p-3 bg-gray-50/50">
                 <p className="text-[9px] text-gray-400 font-bold uppercase mb-1">Receiver Name</p>
                 <p className="text-xs font-bold text-[#0A1128]">Admin Desk</p>
               </div>
            </div>
            <button onClick={() => showNotification("Generating PDF Dossier...")} className="flex items-center justify-center w-full py-4 rounded-xl bg-gray-50 text-[#0A1128] font-bold text-sm hover:bg-gray-100 border border-gray-200 shadow-sm transition-all active:scale-95 cursor-pointer">
              <span className="mr-2 text-lg">📥</span> Get PDF Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;
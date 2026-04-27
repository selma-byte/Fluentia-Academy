import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

const Users = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(true);

  // 💡 State for Delete Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // دالة لجلب المستخدمين الحقيقيين (الطلاب من students والموظفين من staff)
  const fetchUsers = async () => {
    setLoading(true);
    let allUsers = [];

    // جلب الطلاب
    const { data: students } = await supabase.from('students').select('*');
    if (students) {
      const formattedStudents = students.map(s => ({
        id: s.id,
        rawId: s.id,
        table: 'students',
        name: `${s.first_name || ''} ${s.last_name || ''}`.trim() || 'Unknown',
        role: 'Student',
        email: s.email || 'No Email',
        status: s.status === 'Active' ? 'Online' : 'Offline',
        group: s.group_name || 'No Group',
        level: s.level || 'N/A',
        avatar: (s.first_name?.[0] || 'S') + (s.last_name?.[0] || '')
      }));
      allUsers = [...allUsers, ...formattedStudents];
    }

    // جلب الموظفين (أساتذة، سكرتيرات، مدير)
    const { data: staff } = await supabase.from('staff').select('*');
    if (staff) {
      const formattedStaff = staff.map(s => ({
        id: s.id,
        rawId: s.id,
        table: 'staff',
        name: `${s.first_name || ''} ${s.last_name || ''}`.trim() || 'Unknown',
        role: s.role || 'Teacher',
        email: s.email || 'No Email',
        status: 'Online',
        group: s.department || 'Staff',
        level: 'Staff',
        avatar: (s.first_name?.[0] || 'T') + (s.last_name?.[0] || '')
      }));
      allUsers = [...allUsers, ...formattedStaff];
    }

    setUsersData(allUsers);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const roles = ['All', 'Admin', 'Teacher', 'Secretary', 'Student'];

  // ==========================================
  // LOGIC HANDLERS
  // ==========================================
  
  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      try {
        // 1. Delete from Supabase Database based on their table (students or staff)
        const { error } = await supabase
          .from(userToDelete.table)
          .delete()
          .eq('id', userToDelete.rawId);

        if (error) throw error;

        // 2. Remove from UI immediately
        setUsersData(usersData.filter(u => u.id !== userToDelete.id));
        setShowDeleteModal(false);
        setUserToDelete(null);
        alert('✅ User deleted successfully.');
      } catch (err) {
        alert('❌ Error deleting user: ' + err.message);
      }
    }
  };

  const filteredUsers = usersData.filter(user => {
    const matchesRole = activeFilter === 'All' || user.role.toLowerCase() === activeFilter.toLowerCase();
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const getRoleStyle = (role) => {
    switch (role.toLowerCase()) {
      case 'admin': return 'bg-red-50 text-red-600 border-red-100';
      case 'teacher': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'secretary': return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'student': return 'bg-green-50 text-green-600 border-green-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 relative">
      
      {/* ==========================================
          ✨ MODERN DELETE MODAL (BLUE THEME)
          ========================================== */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-6">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-[#0A1128]/40 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setShowDeleteModal(false)}
          ></div>
          
          {/* Modal Card */}
          <div className="bg-white rounded-[3.5rem] p-12 max-w-md w-full shadow-2xl border border-blue-50/50 z-10 animate-in zoom-in-95 duration-300 relative overflow-hidden">
            <div className="w-24 h-24 bg-red-50 rounded-[2rem] flex items-center justify-center text-4xl mb-8 mx-auto shadow-inner">
              🗑️
            </div>
            
            <h3 className="text-3xl font-black text-[#1A2252] italic text-center mb-4 tracking-tighter">Remove Account?</h3>
            <p className="text-gray-400 font-bold italic text-center mb-10 leading-relaxed px-4">
              Are you sure you want to delete <span className="text-[#1A2252] underline decoration-blue-200">{userToDelete?.name}</span>? 
              This action will erase their data from the school system permanently.
            </p>
            
            <div className="flex flex-col gap-3">
              <button 
                onClick={confirmDelete}
                className="w-full py-5 rounded-2xl bg-[#1A2252] text-white font-black italic tracking-widest hover:bg-red-600 hover:scale-[1.02] transition-all duration-300 shadow-xl shadow-blue-900/20 cursor-pointer"
              >
                CONFIRM DELETION
              </button>
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="w-full py-4 rounded-2xl font-black italic text-gray-400 hover:text-[#1A2252] transition-all cursor-pointer"
              >
                GO BACK
              </button>
            </div>

            {/* Subtle background decoration in modal */}
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-50/30 rounded-full blur-3xl"></div>
          </div>
        </div>
      )}

      {/* ==========================================
          MAIN DIRECTORY UI
          ========================================== */}

      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
          <h2 className="text-5xl font-black text-[#1A2252] mb-3 italic tracking-tighter">User Directory</h2>
          <p className="text-gray-400 font-bold italic">Manage and monitor all platform members and staff.</p>
        </div>

        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border-2 border-gray-100 rounded-3xl px-6 py-4 outline-none focus:border-[#1A2252] transition-all font-bold italic text-sm shadow-sm"
          />
          <span className="absolute right-6 top-4 text-xl">🔍</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-3 mb-10">
        {roles.map((role) => (
          <button
            key={role}
            onClick={() => setActiveFilter(role)}
            className={`px-6 py-3 rounded-2xl text-[11px] font-black italic tracking-widest transition-all cursor-pointer border-2 ${activeFilter === role
              ? 'bg-[#1A2252] text-white border-[#1A2252] shadow-lg scale-105'
              : 'bg-white text-gray-400 border-gray-50 hover:border-gray-200'
              }`}
          >
            {role.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center">
            <h3 className="text-xl font-black text-gray-300 italic animate-pulse">Loading users...</h3>
          </div>
        ) : filteredUsers.length > 0 ? filteredUsers.map((user) => (
          <div
            key={user.id}
            className="group bg-white rounded-[2.5rem] p-8 border border-gray-50 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative overflow-hidden"
          >
            {/* Status Indicator */}
            <div className={`absolute top-6 right-6 w-3 h-3 rounded-full border-2 border-white shadow-sm ${user.status === 'Online' ? 'bg-green-500' : 'bg-gray-300'}`}></div>

            {/* User Avatar */}
            <div className="w-20 h-20 bg-gray-50 rounded-[1.8rem] flex items-center justify-center text-2xl font-black text-[#1A2252] mb-6 group-hover:bg-[#1A2252] group-hover:text-white transition-colors duration-500 shadow-inner uppercase">
              {user.avatar}
            </div>

            {/* User Info */}
            <div className="mb-6">
              <h3 className="text-xl font-black text-[#1A2252] mb-1 italic truncate">{user.name}</h3>
              <p className="text-[10px] text-gray-400 font-bold mb-4 truncate">{user.email}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black border uppercase tracking-widest ${getRoleStyle(user.role)}`}>
                  {user.role}
                </span>
                <span className="px-4 py-1.5 rounded-xl text-[9px] font-black border uppercase tracking-widest bg-gray-50 text-gray-600 border-gray-100 truncate max-w-[120px]">
                  {user.group}
                </span>
              </div>
            </div>

            {/* Actions Footer - Added Delete Only */}
            <div className="pt-6 border-t border-gray-50 flex justify-end items-center">
              <button 
                onClick={() => openDeleteModal(user)}
                className="w-12 h-12 bg-gray-50 text-[#1A2252] rounded-2xl flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-all duration-300 cursor-pointer shadow-sm group-hover:scale-110 active:scale-95"
                title="Delete User"
              >
                <span className="text-xl">🗑️</span>
              </button>
            </div>

            {/* Decorative background circle */}
            <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-gray-50/50 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
          </div>
        )) : (
          <div className="col-span-full py-24 text-center">
            <span className="text-7xl mb-6 block opacity-10">👤</span>
            <h3 className="text-2xl font-black text-gray-300 italic tracking-tighter">No members found in this category</h3>
          </div>
        )}
      </div>

    </div>
  );
};

export default Users;
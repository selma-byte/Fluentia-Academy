import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

const Users = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(true);

  // دالة لجلب المستخدمين الحقيقيين (الطلاب من students والموظفين من staff)
  const fetchUsers = async () => {
    setLoading(true);
    let allUsers = [];

    // جلب الطلاب النشطين
    const { data: students } = await supabase.from('students').select('*').eq('status', 'Active');
    if (students) {
      const formattedStudents = students.map(s => ({
        id: `stu_${s.id}`,
        name: `${s.first_name || ''} ${s.last_name || ''}`.trim() || 'Unknown',
        role: 'Student',
        email: s.email || 'No Email',
        status: 'Online',
        lastSeen: 'Now',
        avatar: (s.first_name?.[0] || 'S') + (s.last_name?.[0] || '')
      }));
      allUsers = [...allUsers, ...formattedStudents];
    }

    // جلب الموظفين (أساتذة، سكرتيرات، كادر)
    const { data: staff } = await supabase.from('staff').select('*');
    if (staff) {
      const formattedStaff = staff.map(s => ({
        id: `staff_${s.id}`,
        name: `${s.first_name || ''} ${s.last_name || ''}`.trim() || 'Unknown',
        role: s.role || 'Teacher',
        email: s.email || 'No Email',
        status: 'Offline',
        lastSeen: '2h ago',
        avatar: (s.first_name?.[0] || 'T') + (s.last_name?.[0] || '')
      }));
      allUsers = [...allUsers, ...formattedStaff];
    }

    // Fallback if empty
    if (allUsers.length === 0) {
      allUsers = [
        { id: 1, name: "Malak Ahmed", role: "Super Admin", email: "malak.admin@school.com", status: "Online", lastSeen: "Now", avatar: "MA" },
        { id: 2, name: "Prof. Sarah Ben", role: "Teacher", email: "sarah.b@school.com", status: "Offline", lastSeen: "2h ago", avatar: "SB" },
      ];
    }

    setUsersData(allUsers);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const roles = ['All', 'Teacher', 'Secretary', 'Student', 'Parent', 'Lady Cleaning'];

  // تصفية المستخدمين بناءً على الدور والبحث
  const filteredUsers = usersData.filter(user => {
    const matchesRole = activeFilter === 'All' || user.role === activeFilter;
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  // دالة لتحديد لون الشارة بناءً على الدور
  const getRoleStyle = (role) => {
    switch (role) {
      case 'Super Admin': return 'bg-red-50 text-red-600 border-red-100';
      case 'Teacher': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Secretary': return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'Student': return 'bg-green-50 text-green-600 border-green-100';
      case 'Parent': return 'bg-orange-50 text-orange-600 border-orange-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">

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
            <div className="w-20 h-20 bg-gray-50 rounded-[1.8rem] flex items-center justify-center text-2xl font-black text-[#1A2252] mb-6 group-hover:bg-[#1A2252] group-hover:text-white transition-colors duration-500 shadow-inner">
              {user.avatar}
            </div>

            {/* User Info */}
            <div className="mb-6">
              <h3 className="text-xl font-black text-[#1A2252] mb-1 italic truncate">{user.name}</h3>
              <p className="text-[10px] text-gray-400 font-bold mb-4">{user.email}</p>


              <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black border uppercase tracking-widest ${getRoleStyle(user.role)}`}>
                {user.role}
              </span>
            </div>

            {/* Footer Info */}
            <div className="pt-6 border-t border-gray-50 flex justify-between items-center">
              <div>
                <p className="text-[9px] text-gray-400 font-black uppercase italic">Last Activity</p>
                <p className="text-xs font-bold text-[#1A2252]">{user.lastSeen}</p>
              </div>
              <button className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors cursor-pointer">
                ⚙️
              </button>
            </div>

            {/* Decorative element */}
            <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-gray-50/50 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
          </div>
        )) : (
          <div className="col-span-full py-20 text-center">
            <span className="text-6xl mb-4 block opacity-20">👤</span>
            <h3 className="text-xl font-black text-gray-300 italic">No users found in this category</h3>
          </div>
        )}
      </div>

      {/* Floating Action Button (Optional) */}
      <button className="fixed bottom-10 right-10 bg-[#1A2252] text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-2xl hover:scale-110 active:scale-95 transition-all cursor-pointer z-50">
        ＋
      </button>
    </div>
  );
};

export default Users;
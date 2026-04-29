import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

// ─────────────────────────────────────────────────────────────────
// SVG ICON SYSTEM
// ─────────────────────────────────────────────────────────────────
const Ico = ({ d, size = 16, color = 'currentColor', sw = 2, extra = null }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {(Array.isArray(d) ? d : [d]).map((p, i) => <path key={i} d={p} />)}
    {extra}
  </svg>
);

const Icons = {
  Search:  (c = '#94a3b8') => <Ico d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0" color={c} />,
  Trash:   (c = '#ef4444') => <Ico d={["M3 6h18","M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"]} color={c} />,
  X:       (c = '#64748b') => <Ico d={["M18 6L6 18","M6 6l12 12"]} color={c} sw={2.5} />,
  Warning: (c = '#ef4444') => <Ico d={["M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z","M12 9v4","M12 17h.01"]} color={c} />,
  User:    (c = '#4318FF') => <Ico d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" color={c} extra={<circle cx="12" cy="7" r="4" fill="none" stroke={c} strokeWidth="2"/>} />,
  Users:   (c = '#94a3b8') => <Ico d={["M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2","M23 21v-2a4 4 0 0 0-3-3.87","M16 3.13a4 4 0 0 1 0 7.75"]} color={c} extra={<circle cx="9" cy="7" r="4" fill="none" stroke={c} strokeWidth="2"/>} />,
};

// ─── Role config ─────────────────────────────────────────────────
const ROLE_MAP = {
  admin:     { bg: '#fef2f2', color: '#ef4444', dot: '#ef4444'  },
  teacher:   { bg: '#eef2ff', color: '#4318FF', dot: '#4318FF'  },
  secretary: { bg: '#f5f3ff', color: '#7c3aed', dot: '#7c3aed'  },
  student:   { bg: '#ecfdf5', color: '#059669', dot: '#059669'  },
};

const getRoleStyle = (role) => ROLE_MAP[role?.toLowerCase()] || { bg: '#f8fafc', color: '#64748b', dot: '#94a3b8' };

// Avatar palette
const AV = ['#eef2ff','#ecfdf5','#fff7ed','#fef2f2','#f5f3ff','#fffbeb'];
const AV_C = ['#4318FF','#059669','#f97316','#ef4444','#7c3aed','#f59e0b'];

// ─────────────────────────────────────────────────────────────────
// MAIN COMPONENT — all logic UNTOUCHED
// ─────────────────────────────────────────────────────────────────
const Users = () => {
  const [activeFilter, setActiveFilter]       = useState('All');
  const [searchQuery, setSearchQuery]         = useState('');
  const [usersData, setUsersData]             = useState([]);
  const [loading, setLoading]                 = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete]       = useState(null);

  // ── All original Supabase logic — UNTOUCHED ────────────────────
  const fetchUsers = async () => {
    setLoading(true);
    let allUsers = [];

    const { data: students } = await supabase.from('students').select('*');
    if (students) {
      allUsers = [...allUsers, ...students.map(s => ({
        id: s.id, rawId: s.id, table: 'students',
        name: `${s.first_name || ''} ${s.last_name || ''}`.trim() || 'Unknown',
        role: 'Student', email: s.email || 'No Email',
        status: s.status === 'Active' ? 'Online' : 'Offline',
        group: s.group_name || 'No Group', level: s.level || 'N/A',
        avatar: (s.first_name?.[0] || 'S') + (s.last_name?.[0] || ''),
      }))];
    }

    const { data: staff } = await supabase.from('staff').select('*');
    if (staff) {
      allUsers = [...allUsers, ...staff.map(s => ({
        id: s.id, rawId: s.id, table: 'staff',
        name: `${s.first_name || ''} ${s.last_name || ''}`.trim() || 'Unknown',
        role: s.role || 'Teacher', email: s.email || 'No Email',
        status: 'Online', group: s.department || 'Staff', level: 'Staff',
        avatar: (s.first_name?.[0] || 'T') + (s.last_name?.[0] || ''),
      }))];
    }

    setUsersData(allUsers);
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const openDeleteModal = (user) => { setUserToDelete(user); setShowDeleteModal(true); };

  const confirmDelete = async () => {
    if (userToDelete) {
      try {
        const { error } = await supabase.from(userToDelete.table).delete().eq('id', userToDelete.rawId);
        if (error) throw error;
        setUsersData(usersData.filter(u => u.id !== userToDelete.id));
        setShowDeleteModal(false);
        setUserToDelete(null);
        alert('User deleted successfully.');
      } catch (err) {
        alert('Error deleting user: ' + err.message);
      }
    }
  };

  const filteredUsers = usersData.filter(user => {
    const matchesRole   = activeFilter === 'All' || user.role.toLowerCase() === activeFilter.toLowerCase();
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  // Stats
  const stats = [
    { label: 'Total Users',  value: usersData.length,                                          color: '#4318FF', bg: '#eef2ff' },
    { label: 'Students',     value: usersData.filter(u => u.role === 'Student').length,         color: '#059669', bg: '#ecfdf5' },
    { label: 'Teachers',     value: usersData.filter(u => u.role === 'Teacher').length,         color: '#f97316', bg: '#fff7ed' },
    { label: 'Staff',        value: usersData.filter(u => !['Student','Teacher'].includes(u.role)).length, color: '#7c3aed', bg: '#f5f3ff' },
  ];

  const roles = ['All', 'Admin', 'Teacher', 'Secretary', 'Student'];

  // ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ width: '100%', fontFamily: "'Inter','Segoe UI',sans-serif" }}>

      {/* ── Page header ── */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#1e293b' }}>User Directory</h1>
        <p style={{ margin: '5px 0 0', fontSize: 13, color: '#94a3b8' }}>
          Manage and monitor all platform members and staff accounts.
        </p>
      </div>

      {/* ── Stat cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: '#fff', borderRadius: 14, border: '1px solid #f1f5f9', boxShadow: '0 1px 4px rgba(15,23,42,0.05)', padding: '18px 20px' }}>
            <p style={{ margin: '0 0 4px', fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{s.label}</p>
            <p style={{ margin: 0, fontSize: 28, fontWeight: 800, color: s.color, lineHeight: 1 }}>{loading ? '—' : s.value}</p>
          </div>
        ))}
      </div>

      {/* ── Search + filters ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>

        {/* Filter pills */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {roles.map(role => (
            <button key={role} onClick={() => setActiveFilter(role)}
              style={{
                padding: '7px 16px', borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                border: `1px solid ${activeFilter === role ? '#4318FF' : '#f1f5f9'}`,
                background: activeFilter === role ? '#4318FF' : '#f8fafc',
                color: activeFilter === role ? '#fff' : '#64748b',
                transition: 'all .15s',
              }}
              onMouseEnter={e => { if (activeFilter !== role) { e.currentTarget.style.borderColor = '#c7d2fe'; e.currentTarget.style.color = '#4318FF'; } }}
              onMouseLeave={e => { if (activeFilter !== role) { e.currentTarget.style.borderColor = '#f1f5f9'; e.currentTarget.style.color = '#64748b'; } }}
            >{role}</button>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: 'relative', minWidth: 280 }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
            {Icons.Search()}
          </span>
          <input type="text" placeholder="Search by name or email..."
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%', background: '#f8fafc', border: '1px solid #f1f5f9',
              borderRadius: 10, padding: '9px 14px 9px 36px',
              fontSize: 13, color: '#1e293b', outline: 'none',
              boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border-color .15s',
            }}
            onFocus={e => e.target.style.borderColor = '#4318FF'}
            onBlur={e => e.target.style.borderColor = '#f1f5f9'}
          />
        </div>
      </div>

      {/* ── Users table ── */}
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', boxShadow: '0 1px 4px rgba(15,23,42,0.05)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
              {['User', 'Role', 'Group / Department', 'Status', 'Actions'].map((h, i) => (
                <th key={h} style={{
                  padding: '14px 20px',
                  textAlign: i === 4 ? 'right' : 'left',
                  fontSize: 11, fontWeight: 700, color: '#94a3b8',
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ padding: '56px', textAlign: 'center' }}>
                <div style={{ width: 32, height: 32, border: '3px solid #e0e7ff', borderTopColor: '#4318FF', borderRadius: '50%', margin: '0 auto 10px', animation: 'spin .8s linear infinite' }} />
                <p style={{ color: '#94a3b8', fontSize: 13, margin: 0 }}>Loading users...</p>
              </td></tr>
            ) : filteredUsers.length === 0 ? (
              <tr><td colSpan="5" style={{ padding: '56px', textAlign: 'center', color: '#94a3b8', fontSize: 13, fontWeight: 600 }}>
                No users found matching your criteria.
              </td></tr>
            ) : filteredUsers.map((user, idx) => {
              const rs   = getRoleStyle(user.role);
              const avBg = AV[idx % AV.length];
              const avC  = AV_C[idx % AV_C.length];
              return (
                <tr key={user.id}
                  style={{ borderBottom: '1px solid #f8fafc', transition: 'background .15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  {/* User */}
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      {/* Avatar */}
                      <div style={{
                        width: 38, height: 38, borderRadius: 10,
                        background: avBg, color: avC,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 13, fontWeight: 800, textTransform: 'uppercase', flexShrink: 0,
                        position: 'relative',
                      }}>
                        {user.avatar}
                        {/* Online dot */}
                        <div style={{
                          position: 'absolute', bottom: -2, right: -2,
                          width: 10, height: 10, borderRadius: '50%',
                          background: user.status === 'Online' ? '#22c55e' : '#d1d5db',
                          border: '2px solid #fff',
                        }} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ margin: 0, fontWeight: 700, color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 180 }}>{user.name}</p>
                        <p style={{ margin: '2px 0 0', fontSize: 11, color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 180 }}>{user.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20,
                      background: rs.bg, color: rs.color,
                    }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: rs.dot, flexShrink: 0 }} />
                      {user.role}
                    </span>
                  </td>

                  {/* Group */}
                  <td style={{ padding: '14px 20px', color: '#64748b', fontWeight: 500 }}>
                    {user.group}
                  </td>

                  {/* Status */}
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20,
                      background: user.status === 'Online' ? '#ecfdf5' : '#f8fafc',
                      color:      user.status === 'Online' ? '#059669'  : '#94a3b8',
                    }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: user.status === 'Online' ? '#22c55e' : '#d1d5db', animation: user.status === 'Online' ? 'pulse 2s infinite' : 'none' }} />
                      {user.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                    <button onClick={() => openDeleteModal(user)}
                      style={{
                        width: 34, height: 34, borderRadius: 8,
                        border: '1px solid #f1f5f9', background: '#f8fafc',
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', color: '#94a3b8', transition: 'all .15s',
                      }}
                      title="Delete User"
                      onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.borderColor = '#fecaca'; e.currentTarget.style.color = '#ef4444'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#f1f5f9'; e.currentTarget.style.color = '#94a3b8'; }}
                    >
                      {Icons.Trash('#currentColor')}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Table footer */}
        {!loading && filteredUsers.length > 0 && (
          <div style={{ padding: '12px 20px', borderTop: '1px solid #f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{ margin: 0, fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>
              Showing <strong style={{ color: '#1e293b' }}>{filteredUsers.length}</strong> of <strong style={{ color: '#1e293b' }}>{usersData.length}</strong> users
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {Icons.Users()}
              <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>
                {usersData.filter(u => u.status === 'Online').length} online
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ══════════ DELETE CONFIRMATION MODAL ══════════ */}
      {showDeleteModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          {/* Backdrop */}
          <div
            onClick={() => setShowDeleteModal(false)}
            style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(4px)' }}
          />

          {/* Modal */}
          <div style={{ position: 'relative', background: '#fff', borderRadius: 20, padding: '36px 32px', maxWidth: 420, width: '100%', boxShadow: '0 24px 64px rgba(0,0,0,0.18)', zIndex: 1 }}>

            {/* Close */}
            <button onClick={() => setShowDeleteModal(false)}
              style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', color: '#94a3b8', transition: 'color .15s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
              onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
            >
              {Icons.X()}
            </button>

            {/* Icon */}
            <div style={{ width: 56, height: 56, borderRadius: 16, background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              {Icons.Warning()}
            </div>

            {/* Text */}
            <h3 style={{ margin: '0 0 10px', fontSize: 18, fontWeight: 800, color: '#1e293b', textAlign: 'center' }}>
              Remove Account?
            </h3>
            <p style={{ margin: '0 0 28px', fontSize: 13, color: '#64748b', textAlign: 'center', lineHeight: 1.6 }}>
              Are you sure you want to delete{' '}
              <strong style={{ color: '#1e293b' }}>{userToDelete?.name}</strong>?
              This action will permanently erase their data from the system.
            </p>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setShowDeleteModal(false)}
                style={{ flex: 1, padding: '11px 0', borderRadius: 10, border: '1px solid #f1f5f9', background: '#f8fafc', color: '#64748b', fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all .15s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
                onMouseLeave={e => e.currentTarget.style.background = '#f8fafc'}
              >
                Cancel
              </button>
              <button onClick={confirmDelete}
                style={{ flex: 1, padding: '11px 0', borderRadius: 10, border: 'none', background: '#ef4444', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'background .15s', boxShadow: '0 4px 14px rgba(239,68,68,0.25)' }}
                onMouseEnter={e => e.currentTarget.style.background = '#dc2626'}
                onMouseLeave={e => e.currentTarget.style.background = '#ef4444'}
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        * { box-sizing: border-box; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:.4; } }
      `}</style>
    </div>
  );
};

export default Users;
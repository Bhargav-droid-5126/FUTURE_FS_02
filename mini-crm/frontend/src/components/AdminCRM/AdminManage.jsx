import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const S = {
    page: { minHeight: '100vh', background: '#09090b', display: 'flex', flexDirection: 'column' },
    nav: { height: '60px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(24,24,27,0.6)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', position: 'sticky', top: 0, zIndex: 50 },
    backLink: { display: 'flex', alignItems: 'center', gap: '8px', color: '#71717a', fontSize: '14px', textDecoration: 'none', fontWeight: 500 },
    navRight: { display: 'flex', gap: '10px', alignItems: 'center' },
    navBtn: { display: 'inline-block', color: '#a1a1aa', fontSize: '13px', padding: '6px 12px', borderRadius: '8px', textDecoration: 'none', border: '1px solid rgba(63,63,70,0.6)' },
    main: { flex: 1, padding: '48px 32px', maxWidth: '860px', margin: '0 auto', width: '100%' },
    h1: { fontSize: '28px', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '8px' },
    sub: { color: '#71717a', fontSize: '15px', marginBottom: '40px' },
    addAdminRow: { display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' },
    addBtn: { display: 'inline-block', padding: '10px 20px', background: '#fff', color: '#000', fontWeight: 700, fontSize: '14px', borderRadius: '10px', textDecoration: 'none' },
    tableCard: { background: 'rgba(24,24,27,0.7)', border: '1px solid rgba(63,63,70,0.5)', borderRadius: '16px', overflow: 'hidden' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { padding: '12px 20px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#71717a', letterSpacing: '0.06em', textTransform: 'uppercase', borderBottom: '1px solid rgba(63,63,70,0.5)', background: 'rgba(9,9,11,0.5)' },
    td: { padding: '16px 20px', borderBottom: '1px solid rgba(63,63,70,0.3)' },
    badge: { display: 'inline-block', padding: '3px 10px', borderRadius: '50px', fontSize: '11px', fontWeight: 700, background: 'rgba(99,102,241,0.12)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.25)' },
    deleteBtn: { padding: '6px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', fontSize: '13px', borderRadius: '8px', cursor: 'pointer', fontWeight: 500, fontFamily: 'inherit' },
    disabledBtn: { padding: '6px 14px', background: 'rgba(63,63,70,0.1)', border: '1px solid rgba(63,63,70,0.3)', color: '#52525b', fontSize: '13px', borderRadius: '8px', cursor: 'not-allowed', fontWeight: 500, fontFamily: 'inherit' },
    infoBox: { background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '12px', padding: '16px 20px', fontSize: '14px', color: '#818cf8', marginBottom: '24px', lineHeight: 1.6 },
};

function AdminManage({ setIsAuthenticated }) {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentId, setCurrentId] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchAdmins();
        // Decode current admin ID from token
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const payload = JSON.parse(atob(token.split('.')[1]));
                setCurrentId(payload.admin?.id || '');
            }
        } catch { }
    }, []);

    const fetchAdmins = async () => {
        try {
            const res = await api.get('/auth/admins');
            setAdmins(res.data);
        } catch (err) {
            if (err.response?.status === 401) {
                localStorage.removeItem('token');
                setIsAuthenticated(false);
                navigate('/admin/login');
            }
        } finally { setLoading(false); }
    };

    const handleDelete = async (admin) => {
        if (!window.confirm(`Remove admin "${admin.name || admin.email}"? They will no longer be able to log in.`)) return;
        try {
            await api.delete(`/auth/admins/${admin._id}`);
            setAdmins(prev => prev.filter(a => a._id !== admin._id));
        } catch (err) {
            alert(err.response?.data?.msg || 'Could not remove this admin.');
        }
    };

    return (
        <div style={S.page}>
            <nav style={S.nav}>
                <Link to="/admin/dashboard" style={S.backLink}>← Dashboard</Link>
                <div style={S.navRight}>
                    <Link to="/admin/register" style={S.navBtn}>+ Add New Admin</Link>
                </div>
            </nav>

            <main style={S.main}>
                <h1 style={S.h1}>Admin Management</h1>
                <p style={{ ...S.sub }}>Manage all admin accounts. You cannot remove your own account or the last remaining admin.</p>

                <div style={S.infoBox}>
                    ℹ️  To add a new admin, click "<strong>+ Add New Admin</strong>" or share the <strong>/admin/register</strong> link with your colleague.
                </div>

                <div style={S.tableCard}>
                    <table style={S.table}>
                        <thead>
                            <tr>
                                <th style={S.th}>Admin</th>
                                <th style={S.th}>Email</th>
                                <th style={S.th}>Created</th>
                                <th style={S.th}>Role</th>
                                <th style={{ ...S.th, textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" style={{ padding: '60px', textAlign: 'center', color: '#52525b' }}>Loading admins...</td></tr>
                            ) : admins.map(admin => {
                                const isYou = admin.id === currentId || admin._id === currentId;
                                const isLast = admins.length <= 1;
                                const canDelete = !isYou && !isLast;

                                return (
                                    <tr key={admin._id}
                                        onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                                        onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                                        style={{ transition: 'background 0.15s' }}>
                                        <td style={S.td}>
                                            <div style={{ fontWeight: 600, fontSize: '15px' }}>{admin.name || '—'}</div>
                                            {isYou && <div style={{ fontSize: '12px', color: '#818cf8', marginTop: '2px' }}>You</div>}
                                        </td>
                                        <td style={S.td}><span style={{ color: '#a1a1aa', fontSize: '14px' }}>{admin.email}</span></td>
                                        <td style={S.td}><span style={{ color: '#71717a', fontSize: '13px' }}>{new Date(admin.createdAt).toLocaleDateString()}</span></td>
                                        <td style={S.td}><span style={S.badge}>ADMIN</span></td>
                                        <td style={{ ...S.td, textAlign: 'right' }}>
                                            <button
                                                onClick={() => canDelete && handleDelete(admin)}
                                                style={canDelete ? S.deleteBtn : S.disabledBtn}
                                                title={isYou ? "You can't delete your own account" : isLast ? "Can't delete the last admin" : "Remove admin"}
                                            >
                                                {isYou ? 'Your Account' : 'Remove'}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}

export default AdminManage;

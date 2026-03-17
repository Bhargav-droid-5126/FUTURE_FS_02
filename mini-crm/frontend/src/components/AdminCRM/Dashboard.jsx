import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const S = {
    page: { minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#09090b' },
    nav: { height: '60px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(24,24,27,0.6)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', position: 'sticky', top: 0, zIndex: 50 },
    navBrand: { display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 700, fontSize: '16px' },
    navRight: { display: 'flex', alignItems: 'center', gap: '12px' },
    navLink: { color: '#a1a1aa', fontSize: '13px', padding: '6px 12px', borderRadius: '8px', textDecoration: 'none', border: '1px solid rgba(63,63,70,0.6)', transition: 'all 0.2s' },
    logoutBtn: { background: 'none', border: '1px solid rgba(63,63,70,0.8)', color: '#a1a1aa', fontSize: '13px', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' },
    main: { flex: 1, padding: '40px 32px', maxWidth: '1200px', margin: '0 auto', width: '100%' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' },
    h1: { fontSize: '28px', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '6px' },
    sub: { color: '#71717a', fontSize: '15px' },
    addBtn: { display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#fff', color: '#000', fontWeight: 700, fontSize: '14px', padding: '10px 20px', borderRadius: '10px', textDecoration: 'none', transition: 'background 0.2s' },
    filterBar: { background: 'rgba(24,24,27,0.7)', border: '1px solid rgba(63,63,70,0.5)', borderRadius: '16px', padding: '16px 20px', marginBottom: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap' },
    searchWrap: { flex: 1, minWidth: '240px', position: 'relative' },
    tableCard: { background: 'rgba(24,24,27,0.7)', border: '1px solid rgba(63,63,70,0.5)', borderRadius: '16px', overflow: 'hidden' },
    table: { width: '100%', borderCollapse: 'collapse' },
    thead: { background: 'rgba(9,9,11,0.5)' },
    th: { padding: '12px 20px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#71717a', letterSpacing: '0.06em', textTransform: 'uppercase', borderBottom: '1px solid rgba(63,63,70,0.5)' },
    td: { padding: '16px 20px', borderBottom: '1px solid rgba(63,63,70,0.3)' },
    emptyCell: { padding: '60px 20px', textAlign: 'center', color: '#52525b', fontStyle: 'italic' },
    viewBtn: { display: 'inline-block', padding: '6px 14px', background: 'rgba(63,63,70,0.5)', border: '1px solid rgba(63,63,70,0.8)', color: '#d4d4d8', fontSize: '13px', borderRadius: '8px', textDecoration: 'none', fontWeight: 500 },
    deleteBtn: { marginLeft: '8px', display: 'inline-block', padding: '6px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', fontSize: '13px', borderRadius: '8px', cursor: 'pointer', fontWeight: 500, fontFamily: 'inherit' },
};

function getStatusStyle(s) {
    if (s === 'New') return { background: 'rgba(59,130,246,0.12)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.25)' };
    if (s === 'Contacted') return { background: 'rgba(245,158,11,0.12)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.25)' };
    if (s === 'Converted') return { background: 'rgba(34,197,94,0.12)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.25)' };
    return { background: 'rgba(113,113,122,0.12)', color: '#a1a1aa', border: '1px solid rgba(113,113,122,0.25)' };
}

function Dashboard({ setIsAuthenticated }) {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const navigate = useNavigate();

    useEffect(() => { fetchLeads(); }, []);

    const fetchLeads = async () => {
        try {
            const res = await api.get('/leads');
            setLeads(res.data);
        } catch (err) {
            if (err.response?.status === 401) handleLogout();
        } finally { setLoading(false); }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        navigate('/admin/login');
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Remove lead "${name}" from the pipeline? This cannot be undone.`)) return;
        try {
            await api.delete(`/leads/${id}`);
            setLeads(prev => prev.filter(l => l._id !== id));
        } catch (err) { console.error(err); }
    };

    const filtered = leads.filter(l => {
        const s = (l.name + l.email + (l.company || '')).toLowerCase();
        return s.includes(searchTerm.toLowerCase()) && (!statusFilter || l.status === statusFilter);
    });

    return (
        <div style={S.page}>
            <nav style={S.nav}>
                <div style={S.navBrand}><span style={{ color: '#6366f1', fontSize: '20px' }}>◈</span> CRM Dashboard</div>
                <div style={S.navRight}>
                    <Link to="/admin/manage" style={S.navLink}>⚙ Admin Settings</Link>
                    <button onClick={handleLogout} style={S.logoutBtn}>Sign out</button>
                </div>
            </nav>

            <main style={S.main}>
                <div style={S.header}>
                    <div>
                        <h1 style={S.h1}>Leads Pipeline</h1>
                        <p style={S.sub}>Manage and track your incoming connections.</p>
                    </div>
                    <Link to="/admin/leads/new" style={S.addBtn}
                        onMouseOver={e => e.currentTarget.style.background = '#e4e4e7'}
                        onMouseOut={e => e.currentTarget.style.background = '#fff'}>
                        + Add Manual Lead
                    </Link>
                </div>

                <div style={S.filterBar}>
                    <div style={S.searchWrap}>
                        <input className="input-field" placeholder="Search by name, email or company..."
                            value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                    </div>
                    <div style={{ minWidth: '180px' }}>
                        <select className="input-field" style={{ cursor: 'pointer' }}
                            value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                            <option value="">All Statuses</option>
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Converted">Converted</option>
                        </select>
                    </div>
                </div>

                <div style={S.tableCard}>
                    <table style={S.table}>
                        <thead style={S.thead}>
                            <tr>
                                <th style={S.th}>Contact</th>
                                <th style={S.th}>Company</th>
                                <th style={S.th}>Source</th>
                                <th style={S.th}>Status</th>
                                <th style={S.th}>Created</th>
                                <th style={{ ...S.th, textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" style={S.emptyCell}>Loading leads...</td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan="6" style={S.emptyCell}>No leads found.</td></tr>
                            ) : (
                                filtered.map(lead => (
                                    <tr key={lead._id}
                                        onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                                        onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                                        style={{ transition: 'background 0.15s' }}>
                                        <td style={S.td}>
                                            <div style={{ fontWeight: 600, fontSize: '15px', marginBottom: '3px' }}>{lead.name}</div>
                                            <div style={{ color: '#71717a', fontSize: '13px' }}>{lead.email}</div>
                                        </td>
                                        <td style={S.td}><span style={{ color: '#a1a1aa', fontSize: '14px' }}>{lead.company || '—'}</span></td>
                                        <td style={S.td}><span style={{ color: '#71717a', fontSize: '13px' }}>{lead.source}</span></td>
                                        <td style={S.td}>
                                            <span style={{ ...getStatusStyle(lead.status), padding: '4px 12px', borderRadius: '50px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em' }}>
                                                {lead.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td style={S.td}><span style={{ color: '#71717a', fontSize: '13px' }}>{new Date(lead.createdAt).toLocaleDateString()}</span></td>
                                        <td style={{ ...S.td, textAlign: 'right' }}>
                                            <Link to={`/admin/leads/${lead._id}`} style={S.viewBtn}>View →</Link>
                                            <button onClick={() => handleDelete(lead._id, lead.name)} style={S.deleteBtn}>Remove</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}

export default Dashboard;

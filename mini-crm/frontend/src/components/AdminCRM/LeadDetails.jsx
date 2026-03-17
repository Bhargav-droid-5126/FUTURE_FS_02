import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const S = {
    page: { minHeight: '100vh', background: '#09090b', display: 'flex', flexDirection: 'column' },
    nav: { height: '60px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(24,24,27,0.6)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', padding: '0 32px', position: 'sticky', top: 0, zIndex: 50 },
    backLink: { display: 'flex', alignItems: 'center', gap: '8px', color: '#71717a', fontSize: '14px', textDecoration: 'none', fontWeight: 500 },
    main: { flex: 1, padding: '40px 32px', maxWidth: '1100px', margin: '0 auto', width: '100%' },
    heroRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' },
    name: { fontSize: '36px', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '6px' },
    meta: { color: '#71717a', fontSize: '15px' },
    statusBox: { display: 'flex', alignItems: 'center', gap: '14px', background: 'rgba(24,24,27,0.8)', border: '1px solid rgba(63,63,70,0.6)', borderRadius: '14px', padding: '12px 18px' },
    statusLabel: { fontSize: '12px', color: '#71717a', fontWeight: 500 },
    select: { background: 'transparent', border: 'none', outline: 'none', fontWeight: 700, fontSize: '14px', cursor: 'pointer', color: '#60a5fa' },
    grid: { display: 'grid', gridTemplateColumns: '1fr 360px', gap: '24px' },
    card: { background: 'rgba(24,24,27,0.8)', border: '1px solid rgba(63,63,70,0.5)', borderRadius: '20px', padding: '28px', marginBottom: '24px' },
    cardTitle: { fontSize: '16px', fontWeight: 700, marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    editBtn: { background: 'none', border: '1px solid rgba(63,63,70,0.8)', color: '#a1a1aa', fontSize: '13px', padding: '5px 12px', borderRadius: '8px', cursor: 'pointer' },
    infoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' },
    infoItem: {},
    infoLabel: { fontSize: '12px', color: '#71717a', marginBottom: '6px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' },
    infoValue: { fontSize: '15px', fontWeight: 500, color: '#e4e4e7' },
    msgCard: { background: 'rgba(9,9,11,0.5)', border: '1px solid rgba(63,63,70,0.3)', borderRadius: '12px', padding: '20px', color: '#a1a1aa', fontStyle: 'italic', lineHeight: 1.7, fontSize: '15px' },
    notesCard: { background: 'rgba(24,24,27,0.8)', border: '1px solid rgba(63,63,70,0.5)', borderRadius: '20px', padding: '28px', display: 'flex', flexDirection: 'column', height: '100%' },
    notesList: { flex: 1, overflowY: 'auto', maxHeight: '440px', marginBottom: '20px' },
    noteItem: { background: 'rgba(9,9,11,0.5)', border: '1px solid rgba(63,63,70,0.3)', borderRadius: '12px', padding: '14px', marginBottom: '12px' },
    noteDate: { fontSize: '11px', color: '#52525b', marginBottom: '6px' },
    noteText: { fontSize: '14px', color: '#d4d4d8', lineHeight: 1.6 },
    emptyNotes: { textAlign: 'center', color: '#52525b', fontStyle: 'italic', fontSize: '14px', padding: '40px 0' },
    noteForm: { position: 'relative' },
    noteTextarea: { width: '100%', background: 'rgba(9,9,11,0.8)', border: '1px solid #3f3f46', borderRadius: '12px', padding: '12px 48px 12px 14px', color: '#fafafa', outline: 'none', fontSize: '14px', resize: 'none' },
    sendBtn: { position: 'absolute', right: '10px', bottom: '10px', width: '32px', height: '32px', borderRadius: '8px', background: '#6366f1', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' },
};

function getStatusColor(s) {
    if (s === 'New') return '#60a5fa';
    if (s === 'Contacted') return '#fbbf24';
    if (s === 'Converted') return '#4ade80';
    return '#a1a1aa';
}

function LeadDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [lead, setLead] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newNote, setNewNote] = useState('');
    const [editing, setEditing] = useState(false);
    const [editForm, setEditForm] = useState({});

    useEffect(() => { fetchLead(); }, [id]);

    const fetchLead = async () => {
        try {
            const res = await api.get(`/leads/${id}`);
            setLead(res.data);
            setEditForm({ name: res.data.name, email: res.data.email, phone: res.data.phone || '', company: res.data.company || '', source: res.data.source });
        } catch { navigate('/admin/dashboard'); }
        finally { setLoading(false); }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const res = await api.put(`/leads/${id}`, editForm);
        setLead(res.data); setEditing(false);
    };

    const statusUpdate = async (val) => {
        const res = await api.put(`/leads/${id}`, { status: val });
        setLead(res.data);
    };

    const addNote = async (e) => {
        e.preventDefault();
        if (!newNote.trim()) return;
        const res = await api.post(`/leads/${id}/notes`, { text: newNote });
        setLead({ ...lead, notes: res.data });
        setNewNote('');
    };

    if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#71717a' }}>Loading...</div>;
    if (!lead) return null;

    return (
        <div style={S.page}>
            <nav style={S.nav}>
                <Link to="/admin/dashboard" style={S.backLink}>← Back to Pipeline</Link>
            </nav>

            <main style={S.main}>
                <div style={S.heroRow}>
                    <div>
                        <h1 style={S.name}>{lead.name}</h1>
                        <p style={S.meta}>{lead.company ? `${lead.company} • ` : ''}Added {new Date(lead.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div style={S.statusBox}>
                        <span style={S.statusLabel}>Pipeline Status</span>
                        <select style={{ ...S.select, color: getStatusColor(lead.status) }}
                            value={lead.status} onChange={e => statusUpdate(e.target.value)}>
                            <option value="New">● New</option>
                            <option value="Contacted">● Contacted</option>
                            <option value="Converted">● Converted</option>
                        </select>
                    </div>
                </div>

                <div style={S.grid}>
                    <div>
                        {/* Profile Card */}
                        <div style={S.card}>
                            <div style={S.cardTitle}>
                                Contact Profile
                                <button style={S.editBtn} onClick={() => setEditing(!editing)}>
                                    {editing ? '✕ Cancel' : '✎ Edit'}
                                </button>
                            </div>

                            {editing ? (
                                <form onSubmit={handleUpdate}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
                                        {[['Name', 'name', 'text'], ['Email', 'email', 'email'], ['Phone', 'phone', 'tel'], ['Company', 'company', 'text'], ['Source', 'source', 'text']].map(([label, key, type]) => (
                                            <div key={key} style={key === 'source' ? { gridColumn: 'span 2' } : {}}>
                                                <label style={S.infoLabel}>{label}</label>
                                                <input type={type} className="input-field" value={editForm[key]}
                                                    onChange={e => setEditForm({ ...editForm, [key]: e.target.value })} required={key === 'name' || key === 'email'} />
                                            </div>
                                        ))}
                                    </div>
                                    <button type="submit" style={{ background: '#fff', color: '#000', fontWeight: 700, padding: '10px 22px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '14px' }}>Save Changes</button>
                                </form>
                            ) : (
                                <div style={S.infoGrid}>
                                    <div style={S.infoItem}>
                                        <div style={S.infoLabel}>Email</div>
                                        <a href={`mailto:${lead.email}`} style={{ ...S.infoValue, color: '#818cf8', textDecoration: 'none' }}>{lead.email}</a>
                                    </div>
                                    <div style={S.infoItem}>
                                        <div style={S.infoLabel}>Phone</div>
                                        <div style={S.infoValue}>{lead.phone || '—'}</div>
                                    </div>
                                    <div style={S.infoItem}>
                                        <div style={S.infoLabel}>Company</div>
                                        <div style={S.infoValue}>{lead.company || '—'}</div>
                                    </div>
                                    <div style={S.infoItem}>
                                        <div style={S.infoLabel}>Source</div>
                                        <div style={S.infoValue}>{lead.source}</div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Message */}
                        {lead.message && (
                            <div style={S.card}>
                                <div style={S.cardTitle}>Inquiry Message</div>
                                <div style={S.msgCard}>"{lead.message}"</div>
                            </div>
                        )}
                    </div>

                    {/* Notes */}
                    <div style={S.notesCard}>
                        <div style={{ ...S.cardTitle, marginBottom: '20px' }}>CRM Notes</div>
                        <div style={S.notesList}>
                            {lead.notes?.length > 0 ? lead.notes.map((note, i) => (
                                <div key={i} style={S.noteItem}>
                                    <div style={S.noteDate}>{new Date(note.date).toLocaleString()}</div>
                                    <div style={S.noteText}>{note.text}</div>
                                </div>
                            )) : <div style={S.emptyNotes}>No history yet. Add a note below.</div>}
                        </div>
                        <form onSubmit={addNote} style={S.noteForm}>
                            <textarea rows="3" style={S.noteTextarea} placeholder="Log a call, meeting, or follow-up..."
                                value={newNote} onChange={e => setNewNote(e.target.value)} />
                            <button type="submit" disabled={!newNote.trim()} style={{ ...S.sendBtn, opacity: newNote.trim() ? 1 : 0.4 }}>→</button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default LeadDetails;

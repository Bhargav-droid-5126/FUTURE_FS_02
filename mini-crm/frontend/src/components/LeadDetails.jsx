import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, UserCircle2, Mail, Phone, Globe, Calendar, Clock, Edit2 } from 'lucide-react';
import api from '../utils/api';

function LeadDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [lead, setLead] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newNote, setNewNote] = useState('');

    const [editing, setEditing] = useState(false);
    const [editForm, setEditForm] = useState({});

    useEffect(() => {
        fetchLead();
    }, [id]);

    const fetchLead = async () => {
        try {
            const res = await api.get(`/leads/${id}`);
            setLead(res.data);
            setEditForm({
                name: res.data.name,
                email: res.data.email,
                phone: res.data.phone || '',
                source: res.data.source,
                status: res.data.status
            });
        } catch (err) {
            console.error(err);
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const res = await api.put(`/leads/${id}`, editForm);
            setLead(res.data);
            setEditing(false);
        } catch (err) {
            console.error(err);
        }
    };

    const statusUpdate = async (newStatus) => {
        try {
            const res = await api.put(`/leads/${id}`, { status: newStatus });
            setLead(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddNote = async (e) => {
        e.preventDefault();
        if (!newNote.trim()) return;

        try {
            const res = await api.post(`/leads/${id}/notes`, { text: newNote });
            setLead({ ...lead, notes: res.data });
            setNewNote('');
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div style={{ color: 'var(--text-secondary)' }}>Loading lead details...</div>;
    if (!lead) return null;

    return (
        <div className="animate-fade-in">
            <div style={{ marginBottom: '2rem' }}>
                <Link to="/" className="btn btn-secondary" style={{ marginBottom: '1.5rem', padding: '0.5rem 1rem' }}>
                    <ArrowLeft size={16} />
                    Back to Dashboard
                </Link>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1 className="text-h1" style={{ margin: 0 }}>Lead details</h1>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Workflow Status:</span>
                        <select
                            className={`form-input badge badge-${lead.status.toLowerCase()}`}
                            style={{ width: 'auto', WebkitAppearance: 'none', appearance: 'none', cursor: 'pointer', paddingRight: '2.5rem' }}
                            value={lead.status}
                            onChange={(e) => statusUpdate(e.target.value)}
                        >
                            <option value="New" style={{ color: '#60A5FA', background: '#0F172A' }}>NEW</option>
                            <option value="Contacted" style={{ color: '#FBBF24', background: '#0F172A' }}>CONTACTED</option>
                            <option value="Converted" style={{ color: '#34D399', background: '#0F172A' }}>CONVERTED</option>
                        </select>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 350px', gap: '2rem' }}>

                {/* Left Column: Info & Edit */}
                <div>
                    <div className="card" style={{ marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 className="text-h3" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <UserCircle2 size={24} color="var(--primary)" />
                                Client Profile
                            </h3>
                            {!editing && (
                                <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }} onClick={() => setEditing(true)}>
                                    <Edit2 size={16} /> Edit Info
                                </button>
                            )}
                        </div>

                        {editing ? (
                            <form onSubmit={handleUpdate}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className="form-group">
                                        <label className="form-label">Full Name</label>
                                        <input className="form-input" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} required />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Source</label>
                                        <select className="form-input" value={editForm.source} onChange={e => setEditForm({ ...editForm, source: e.target.value })}>
                                            <option value="website">Website</option>
                                            <option value="social media">Social Media</option>
                                            <option value="referral">Referral</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Email Address</label>
                                        <input type="email" className="form-input" value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} required />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Phone Number</label>
                                        <input type="tel" className="form-input" value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                    <button type="submit" className="btn btn-primary">Save Changes</button>
                                    <button type="button" className="btn btn-secondary" onClick={() => {
                                        setEditing(false);
                                        setEditForm({
                                            name: lead.name, email: lead.email, phone: lead.phone || '', source: lead.source, status: lead.status
                                        });
                                    }}>Cancel</button>
                                </div>
                            </form>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div>
                                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Full Name</div>
                                    <div style={{ fontWeight: 500 }}>{lead.name}</div>
                                </div>
                                <div>
                                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Lead Source</div>
                                    <div style={{ fontWeight: 500, textTransform: 'capitalize', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Globe size={16} /> {lead.source}
                                    </div>
                                </div>
                                <div>
                                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Email Address</div>
                                    <div style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Mail size={16} /> <a href={`mailto:${lead.email}`} style={{ color: 'var(--primary)', textDecoration: 'underline' }}>{lead.email}</a>
                                    </div>
                                </div>
                                <div>
                                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Phone Number</div>
                                    <div style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Phone size={16} /> {lead.phone ? <a href={`tel:${lead.phone}`} style={{ color: 'var(--primary)' }}>{lead.phone}</a> : 'Not provided'}
                                    </div>
                                </div>
                                <div>
                                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Date Added</div>
                                    <div style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Calendar size={16} /> {new Date(lead.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Notes History */}
                <div>
                    <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <h3 className="text-h3" style={{ margin: 0, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Clock size={24} color="var(--primary)" />
                            Notes & History
                        </h3>

                        <div style={{ flex: 1, overflowY: 'auto', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '500px' }}>
                            {lead.notes && lead.notes.length > 0 ? (
                                lead.notes.map((note, index) => (
                                    <div key={index} style={{
                                        padding: '1rem',
                                        backgroundColor: 'rgba(255,255,255,0.02)',
                                        border: '1px solid var(--border)',
                                        borderRadius: '0.5rem'
                                    }}>
                                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Calendar size={12} /> {new Date(note.date).toLocaleString()}
                                        </div>
                                        <div style={{ fontSize: '0.875rem', whiteSpace: 'pre-wrap' }}>
                                            {note.text}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div style={{ color: 'var(--text-secondary)', fontStyle: 'italic', textAlign: 'center', padding: '2rem 0' }}>
                                    No contextual notes found for this lead.
                                </div>
                            )}
                        </div>

                        <form onSubmit={handleAddNote} style={{ marginTop: 'auto' }}>
                            <div style={{ position: 'relative' }}>
                                <textarea
                                    className="form-input"
                                    rows="3"
                                    placeholder="Add a new follow-up note..."
                                    style={{ paddingRight: '3rem', resize: 'none' }}
                                    value={newNote}
                                    onChange={(e) => setNewNote(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    disabled={!newNote.trim()}
                                    style={{
                                        position: 'absolute',
                                        right: '0.5rem',
                                        bottom: '0.5rem',
                                        padding: '0.5rem',
                                        backgroundColor: newNote.trim() ? 'var(--primary)' : 'var(--surface-hover)',
                                        color: newNote.trim() ? 'white' : 'var(--text-secondary)',
                                        borderRadius: '0.25rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: newNote.trim() ? 'pointer' : 'not-allowed'
                                    }}
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default LeadDetails;

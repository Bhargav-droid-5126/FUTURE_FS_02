import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Plus, Trash2, Edit, ChevronRight } from 'lucide-react';
import api from '../utils/api';

function Dashboard() {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    // Modal state
    const [showAddModal, setShowAddModal] = useState(false);
    const [newLead, setNewLead] = useState({ name: '', email: '', phone: '', source: 'website', status: 'New', notes: '' });

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        try {
            const res = await api.get('/leads');
            setLeads(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this lead?')) {
            try {
                await api.delete(`/leads/${id}`);
                setLeads(leads.filter(lead => lead._id !== id));
            } catch (err) {
                console.error(err);
            }
        }
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...newLead };
            if (payload.notes) {
                payload.notes = payload.notes; // sent as string, backend wraps in object array
            } else {
                delete payload.notes;
            }

            const res = await api.post('/leads', payload);
            setLeads([res.data, ...leads]);
            setShowAddModal(false);
            setNewLead({ name: '', email: '', phone: '', source: 'website', status: 'New', notes: '' });
        } catch (err) {
            console.error(err);
        }
    };

    const filteredLeads = leads.filter(lead => {
        const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter ? lead.status === statusFilter : true;
        return matchesSearch && matchesStatus;
    });

    if (loading) return <div style={{ color: 'var(--text-secondary)' }}>Loading leads...</div>;

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 className="text-h1" style={{ margin: 0 }}>Leads Dashboard</h1>
                <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                    <Plus size={18} />
                    Add Manual Lead
                </button>
            </div>

            <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: '1 1 300px', position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                        <input
                            type="text"
                            className="form-input"
                            style={{ paddingLeft: '2.5rem' }}
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div style={{ flex: '0 0 200px', position: 'relative' }}>
                        <Filter size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                        <select
                            className="form-input"
                            style={{ paddingLeft: '2.5rem', cursor: 'pointer', appearance: 'none' }}
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="">All Statuses</option>
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Converted">Converted</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Lead Info</th>
                                <th>Source</th>
                                <th>Status</th>
                                <th>Created Date</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLeads.length > 0 ? filteredLeads.map(lead => (
                                <tr key={lead._id}>
                                    <td>
                                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{lead.name}</div>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{lead.email}</div>
                                    </td>
                                    <td>
                                        <span style={{ textTransform: 'capitalize', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                            {lead.source}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge badge-${lead.status.toLowerCase()}`}>
                                            {lead.status}
                                        </span>
                                    </td>
                                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                        {new Date(lead.createdAt).toLocaleDateString()}
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                            <Link to={`/leads/${lead._id}`} className="btn btn-secondary" style={{ padding: '0.5rem' }}>
                                                <ChevronRight size={16} />
                                            </Link>
                                            <button onClick={() => handleDelete(lead._id)} className="btn btn-danger" style={{ padding: '0.5rem' }}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                                        No leads found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showAddModal && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(15, 23, 42, 0.8)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '1rem'
                }}>
                    <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <h2 className="text-h2" style={{ marginBottom: '1.5rem' }}>Add Manual Lead</h2>

                        <form onSubmit={handleAddSubmit}>
                            <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <input type="text" className="form-input" required value={newLead.name} onChange={e => setNewLead({ ...newLead, name: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email Address</label>
                                <input type="email" className="form-input" required value={newLead.email} onChange={e => setNewLead({ ...newLead, email: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Phone Number (Optional)</label>
                                <input type="tel" className="form-input" value={newLead.phone} onChange={e => setNewLead({ ...newLead, phone: e.target.value })} />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem' }}>
                                <div style={{ flex: 1 }}>
                                    <label className="form-label">Source</label>
                                    <select className="form-input" value={newLead.source} onChange={e => setNewLead({ ...newLead, source: e.target.value })}>
                                        <option value="website">Website</option>
                                        <option value="social media">Social Media</option>
                                        <option value="referral">Referral</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label className="form-label">Status</label>
                                    <select className="form-input" value={newLead.status} onChange={e => setNewLead({ ...newLead, status: e.target.value })}>
                                        <option value="New">New</option>
                                        <option value="Contacted">Contacted</option>
                                        <option value="Converted">Converted</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Initial Note</label>
                                <textarea className="form-input" rows="3" value={newLead.notes} onChange={e => setNewLead({ ...newLead, notes: e.target.value })}></textarea>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowAddModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Create Lead</button>
                            </div>
                        </form>

                    </div>
                </div>
            )}
        </div>
    );
}

export default Dashboard;

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../utils/api';

const S = {
    page: { minHeight: '100vh', background: '#09090b', display: 'flex', flexDirection: 'column' },
    nav: { height: '60px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(24,24,27,0.6)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', padding: '0 32px', position: 'sticky', top: 0, zIndex: 50 },
    backLink: { display: 'flex', alignItems: 'center', gap: '8px', color: '#71717a', fontSize: '14px', textDecoration: 'none', fontWeight: 500 },
    main: { flex: 1, padding: '48px 32px', maxWidth: '680px', margin: '0 auto', width: '100%' },
    iconWrap: { display: 'flex', justifyContent: 'center', marginBottom: '24px' },
    icon: { width: '60px', height: '60px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px' },
    heading: { textAlign: 'center', fontSize: '28px', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '8px' },
    sub: { textAlign: 'center', color: '#71717a', fontSize: '15px', marginBottom: '40px', lineHeight: 1.6 },
    card: { background: 'rgba(24,24,27,0.85)', border: '1px solid rgba(63,63,70,0.6)', borderRadius: '24px', padding: '36px', backdropFilter: 'blur(20px)' },
    row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' },
    formGroup: { marginBottom: '20px' },
    label: { display: 'block', fontSize: '13px', fontWeight: 500, color: '#d4d4d8', marginBottom: '8px' },
    actions: { display: 'flex', gap: '12px', marginTop: '28px' },
    cancelBtn: { flex: 1, padding: '13px', background: '#27272a', color: '#fafafa', fontWeight: 600, fontSize: '14px', borderRadius: '12px', border: '1px solid #3f3f46', cursor: 'pointer', textDecoration: 'none', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    submitBtn: { flex: 1, padding: '13px', background: '#fff', color: '#000', fontWeight: 700, fontSize: '14px', borderRadius: '12px', border: 'none', cursor: 'pointer' },
};

function AddLead() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', company: '', source: 'Manual Entry', status: 'New', notes: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = { ...formData };
            if (!payload.notes) delete payload.notes;
            await api.post('/leads', payload);
            navigate('/admin/dashboard');
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    return (
        <div style={S.page}>
            <nav style={S.nav}>
                <Link to="/admin/dashboard" style={S.backLink}>← Cancel & Return</Link>
            </nav>

            <main style={S.main}>
                <div style={S.iconWrap}><div style={S.icon}>👤</div></div>
                <h1 style={S.heading} className="text-gradient">Manual Lead Entry</h1>
                <p style={S.sub}>Add connections from offline meetings, calls, or events directly into the pipeline.</p>

                <div style={S.card}>
                    <form onSubmit={handleSubmit}>
                        <div style={S.row}>
                            <div>
                                <label style={S.label}>Full Name *</label>
                                <input required className="input-field" placeholder="Jane Smith" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div>
                                <label style={S.label}>Email Address *</label>
                                <input required type="email" className="input-field" placeholder="jane@company.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                            </div>
                        </div>

                        <div style={S.row}>
                            <div>
                                <label style={S.label}>Phone</label>
                                <input type="tel" className="input-field" placeholder="+1 555 000 0000" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                            </div>
                            <div>
                                <label style={S.label}>Company</label>
                                <input type="text" className="input-field" placeholder="Acme Inc." value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} />
                            </div>
                        </div>

                        <div style={S.row}>
                            <div>
                                <label style={S.label}>Lead Source</label>
                                <select className="input-field" value={formData.source} onChange={e => setFormData({ ...formData, source: e.target.value })}>
                                    <option>Manual Entry</option>
                                    <option>Cold Call</option>
                                    <option>Networking Event</option>
                                    <option>LinkedIn</option>
                                    <option>Referral</option>
                                </select>
                            </div>
                            <div>
                                <label style={S.label}>Pipeline Stage</label>
                                <select className="input-field" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                                    <option value="New">New</option>
                                    <option value="Contacted">Contacted</option>
                                    <option value="Converted">Converted</option>
                                </select>
                            </div>
                        </div>

                        <div style={S.formGroup}>
                            <label style={S.label}>Initial Note</label>
                            <textarea rows="4" className="input-field" style={{ resize: 'none' }} placeholder="Met at conference; interested in enterprise plan..." value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} />
                        </div>

                        <div style={S.actions}>
                            <Link to="/admin/dashboard" style={S.cancelBtn}>Cancel</Link>
                            <button type="submit" disabled={loading} style={S.submitBtn}>
                                {loading ? 'Adding...' : 'Add to Pipeline'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}

export default AddLead;

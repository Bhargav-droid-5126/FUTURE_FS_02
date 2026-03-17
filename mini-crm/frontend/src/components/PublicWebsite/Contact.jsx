import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const S = {
    page: { minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' },
    bg: { position: 'fixed', top: '-10%', right: '-10%', width: '600px', height: '600px', background: 'radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 },
    nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 48px', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'relative', zIndex: 10 },
    brand: { display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 700, fontSize: '20px', textDecoration: 'none', color: '#fafafa' },
    navLink: { color: '#a1a1aa', fontSize: '14px', fontWeight: 500, textDecoration: 'none' },
    main: { flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px 24px', position: 'relative', zIndex: 1 },
    card: { width: '100%', maxWidth: '560px' },
    heading: { fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '12px', lineHeight: 1.1 },
    sub: { color: '#71717a', fontSize: '16px', marginBottom: '40px', lineHeight: 1.6 },
    formCard: { background: 'rgba(24,24,27,0.8)', border: '1px solid rgba(63,63,70,0.6)', borderRadius: '24px', padding: '40px', backdropFilter: 'blur(20px)' },
    row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' },
    formGroup: { marginBottom: '20px' },
    label: { display: 'block', fontSize: '13px', fontWeight: 500, color: '#d4d4d8', marginBottom: '8px' },
    submitBtn: { width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#fff', color: '#000', fontWeight: 700, fontSize: '15px', border: 'none', borderRadius: '12px', padding: '14px', cursor: 'pointer', transition: 'all 0.2s' },
    successWrap: { textAlign: 'center', padding: '48px 0' },
    successIcon: { width: '72px', height: '72px', background: 'rgba(34,197,94,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', margin: '0 auto 24px' },
};

function Contact() {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', company: '', message: '' });
    const [status, setStatus] = useState('idle');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        try {
            await api.post('/leads', { ...formData, source: 'Website Contact Form' });
            setStatus('success');
            setFormData({ name: '', email: '', phone: '', company: '', message: '' });
        } catch (err) {
            setStatus('error');
        }
    };

    return (
        <div style={S.page}>
            <div style={S.bg} />
            <nav style={S.nav}>
                <Link to="/" style={S.brand}><span style={{ color: '#6366f1' }}>◈</span> Lumina CRM</Link>
                <div style={{ display: 'flex', gap: '24px' }}>
                    <Link to="/" style={S.navLink}>Home</Link>
                    <Link to="/admin/login" style={S.navLink}>Admin</Link>
                </div>
            </nav>

            <main style={S.main}>
                <div style={S.card}>
                    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <h1 style={S.heading} className="text-gradient">Let's Build Something<br />Great Together</h1>
                        <p style={S.sub}>Submit your details and our team will get back to you.</p>
                    </div>

                    <div style={S.formCard}>
                        {status === 'success' ? (
                            <div style={S.successWrap}>
                                <div style={S.successIcon}>✓</div>
                                <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '10px' }}>Thank you!</h3>
                                <p style={{ color: '#71717a', marginBottom: '32px' }}>Your message has been received. Our team will contact you soon.</p>
                                <button onClick={() => setStatus('idle')} className="btn-dark" style={{ margin: '0 auto' }}>Send another message</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div style={S.row}>
                                    <div>
                                        <label style={S.label}>Full Name *</label>
                                        <input required className="input-field" placeholder="John Doe" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                    </div>
                                    <div>
                                        <label style={S.label}>Email *</label>
                                        <input required type="email" className="input-field" placeholder="john@company.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
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
                                <div style={S.formGroup}>
                                    <label style={S.label}>How can we help? *</label>
                                    <textarea required rows="4" className="input-field" style={{ resize: 'none' }} placeholder="Tell us about your project..."
                                        value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} />
                                </div>
                                {status === 'error' && (
                                    <div style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', color: '#f87171', fontSize: '14px', marginBottom: '16px' }}>
                                        An error occurred. Please try again.
                                    </div>
                                )}
                                <button type="submit" disabled={status === 'loading'} style={S.submitBtn}>
                                    {status === 'loading' ? 'Sending...' : 'Send Message →'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Contact;

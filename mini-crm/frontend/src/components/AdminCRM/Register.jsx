import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../utils/api';

const S = {
    page: { minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '24px', position: 'relative', background: '#09090b' },
    bg: { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '700px', height: '700px', background: 'radial-gradient(ellipse, rgba(99,102,241,0.1) 0%, transparent 65%)', pointerEvents: 'none', zIndex: 0 },
    box: { width: '100%', maxWidth: '440px', position: 'relative', zIndex: 1 },
    logoWrap: { display: 'flex', justifyContent: 'center', marginBottom: '28px' },
    logo: { width: '60px', height: '60px', background: 'rgba(24,24,27,0.9)', border: '1px solid rgba(63,63,70,0.8)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' },
    title: { textAlign: 'center', fontSize: '26px', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '8px' },
    sub: { textAlign: 'center', color: '#71717a', fontSize: '14px', marginBottom: '32px' },
    card: { background: 'rgba(24,24,27,0.85)', border: '1px solid rgba(63,63,70,0.6)', borderRadius: '24px', padding: '36px', backdropFilter: 'blur(20px)' },
    formGroup: { marginBottom: '18px' },
    label: { display: 'block', fontSize: '13px', fontWeight: 500, color: '#d4d4d8', marginBottom: '8px' },
    btn: { width: '100%', padding: '14px', background: '#fff', color: '#000', fontWeight: 700, fontSize: '15px', borderRadius: '12px', border: 'none', cursor: 'pointer', transition: 'background 0.2s', letterSpacing: '-0.01em' },
    successBox: { background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '12px', padding: '14px 18px', color: '#4ade80', fontSize: '14px', marginBottom: '18px' },
    errorBox: { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '12px', padding: '14px 18px', color: '#f87171', fontSize: '14px', marginBottom: '18px' },
    divider: { textAlign: 'center', color: '#52525b', fontSize: '13px', margin: '24px 0', borderTop: '1px solid rgba(63,63,70,0.5)', paddingTop: '24px' },
    link: { color: '#818cf8', fontWeight: 600 },
};

function Register({ isAuthenticated }) {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [status, setStatus] = useState('idle'); // idle | loading | success | error
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }
        setStatus('loading'); setError('');
        try {
            await api.post('/auth/register', { name: formData.name, email: formData.email, password: formData.password });
            setStatus('success');
        } catch (err) {
            setError(err.response?.data?.msg || 'Registration failed. Please try again.');
            setStatus('error');
        }
    };

    return (
        <div style={S.page}>
            <div style={S.bg} />
            <div style={S.box}>
                <div style={S.logoWrap}><div style={S.logo}>◈</div></div>
                <h2 style={S.title} className="text-gradient">Create Admin Account</h2>
                <p style={S.sub}>Register as a new admin to access the CRM dashboard.</p>

                <div style={S.card}>
                    {status === 'success' ? (
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
                            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>Account Created!</h3>
                            <p style={{ color: '#71717a', marginBottom: '28px', fontSize: '14px' }}>Your admin account has been created successfully.</p>
                            {isAuthenticated ? (
                                <Link to="/admin/manage" style={{ ...S.btn, display: 'block', textAlign: 'center', textDecoration: 'none' }}>Return to Admin Management</Link>
                            ) : (
                                <Link to="/admin/login" style={{ ...S.btn, display: 'block', textAlign: 'center', textDecoration: 'none' }}>Sign In Now</Link>
                            )}
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            {error && <div style={S.errorBox}>{error}</div>}

                            <div style={S.formGroup}>
                                <label style={S.label}>Full Name</label>
                                <input type="text" className="input-field" placeholder="Jane Admin" required
                                    value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div style={S.formGroup}>
                                <label style={S.label}>Email Address</label>
                                <input type="email" className="input-field" placeholder="admin@company.com" required
                                    value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                            </div>
                            <div style={S.formGroup}>
                                <label style={S.label}>Password</label>
                                <input type="password" className="input-field" placeholder="Min. 6 characters" required
                                    value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                            </div>
                            <div style={{ ...S.formGroup, marginBottom: '28px' }}>
                                <label style={S.label}>Confirm Password</label>
                                <input type="password" className="input-field" placeholder="Repeat your password" required
                                    value={formData.confirmPassword} onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })} />
                            </div>

                            <button type="submit" disabled={status === 'loading'} style={S.btn}
                                onMouseOver={e => e.target.style.background = '#e4e4e7'}
                                onMouseOut={e => e.target.style.background = '#fff'}>
                                {status === 'loading' ? 'Creating Account...' : 'Create Admin Account'}
                            </button>

                            <div style={S.divider}>
                                {isAuthenticated ? (
                                    <Link to="/admin/manage" style={S.link}>← Back to Admin Settings</Link>
                                ) : (
                                    <>Already have an account? <Link to="/admin/login" style={S.link}>Sign In</Link></>
                                )}
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Register;

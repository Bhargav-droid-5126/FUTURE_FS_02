import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../utils/api';

const S = {
    page: { minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '24px', position: 'relative', background: '#09090b' },
    bg: { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '700px', height: '700px', background: 'radial-gradient(ellipse, rgba(99,102,241,0.1) 0%, transparent 65%)', pointerEvents: 'none' },
    backLink: { position: 'absolute', top: '24px', left: '32px', color: '#71717a', fontSize: '14px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' },
    box: { width: '100%', maxWidth: '420px', position: 'relative', zIndex: 1 },
    logoWrap: { display: 'flex', justifyContent: 'center', marginBottom: '32px' },
    logo: { width: '60px', height: '60px', background: 'rgba(24,24,27,0.9)', border: '1px solid rgba(63,63,70,0.8)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' },
    title: { textAlign: 'center', fontSize: '28px', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '8px' },
    sub: { textAlign: 'center', color: '#71717a', fontSize: '15px', marginBottom: '32px' },
    card: { background: 'rgba(24,24,27,0.85)', border: '1px solid rgba(63,63,70,0.6)', borderRadius: '24px', padding: '36px', backdropFilter: 'blur(20px)' },
    formGroup: { marginBottom: '20px' },
    label: { display: 'block', fontSize: '13px', fontWeight: 500, color: '#d4d4d8', marginBottom: '8px' },
    inputWrap: { position: 'relative' },
    icon: { position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#71717a', fontSize: '16px', pointerEvents: 'none' },
    input: { width: '100%', background: 'rgba(9,9,11,0.8)', border: '1px solid #3f3f46', borderRadius: '12px', padding: '12px 16px 12px 42px', color: '#fafafa', outline: 'none', fontSize: '15px', transition: 'all 0.2s' },
    errorBox: { display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '12px', padding: '12px 16px', color: '#f87171', fontSize: '14px', marginBottom: '20px' },
    btn: { width: '100%', padding: '14px', background: '#fff', color: '#000', fontWeight: 700, fontSize: '15px', borderRadius: '12px', border: 'none', cursor: 'pointer', letterSpacing: '-0.01em', transition: 'background 0.2s' },
    footer: { textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#71717a', borderTop: '1px solid rgba(63,63,70,0.4)', paddingTop: '24px' },
    registerLink: { color: '#818cf8', fontWeight: 600, textDecoration: 'none' },
};

function Login({ setIsAuthenticated }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true); setError('');
        try {
            const res = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            setIsAuthenticated(true);
            navigate('/admin/dashboard');
        } catch (err) {
            setError(err.response?.data?.msg || 'Invalid Credentials');
        } finally { setLoading(false); }
    };

    return (
        <div style={S.page}>
            <div style={S.bg} />
            <Link to="/" style={S.backLink}>← Back to Website</Link>

            <div style={S.box}>
                <div style={S.logoWrap}><div style={S.logo}>◈</div></div>
                <h2 style={S.title} className="text-gradient">Lumina Admin</h2>
                <p style={S.sub}>Sign in to manage your pipeline</p>

                <div style={S.card}>
                    {error && <div style={S.errorBox}><span>⚠</span> {error}</div>}
                    <form onSubmit={handleLogin}>
                        <div style={S.formGroup}>
                            <label style={S.label}>Email Address</label>
                            <div style={S.inputWrap}>
                                <span style={S.icon}>✉</span>
                                <input type="email" style={S.input} placeholder="admin@lumina.com"
                                    value={email} onChange={e => setEmail(e.target.value)} required />
                            </div>
                        </div>
                        <div style={{ ...S.formGroup, marginBottom: '28px' }}>
                            <label style={S.label}>Password</label>
                            <div style={S.inputWrap}>
                                <span style={S.icon}>⚿</span>
                                <input type="password" style={S.input} placeholder="••••••••"
                                    value={password} onChange={e => setPassword(e.target.value)} required />
                            </div>
                        </div>
                        <button type="submit" disabled={loading} style={S.btn}
                            onMouseOver={e => e.target.style.background = '#e4e4e7'}
                            onMouseOut={e => e.target.style.background = '#fff'}>
                            {loading ? 'Authenticating...' : 'Secure Login'}
                        </button>
                    </form>

                    <div style={S.footer}>
                        New admin? <Link to="/admin/register" style={S.registerLink}>Create an account →</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;

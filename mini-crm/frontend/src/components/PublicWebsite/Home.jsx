import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
            {/* Ambient gradient background */}
            <div style={{
                position: 'fixed', top: '-20%', left: '50%', transform: 'translateX(-50%)',
                width: '900px', height: '700px',
                background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.15) 0%, transparent 70%)',
                pointerEvents: 'none', zIndex: 0
            }} />

            {/* Nav */}
            <nav style={{
                position: 'relative', zIndex: 10,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '20px 48px',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                backdropFilter: 'blur(10px)',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 700, fontSize: '20px' }}>
                    <span style={{ color: '#6366f1', fontSize: '22px' }}>◈</span>
                    Lumina CRM
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                    <Link to="/contact" style={{ color: '#a1a1aa', fontSize: '14px', fontWeight: 500, textDecoration: 'none', transition: 'color 0.2s' }}
                        onMouseOver={e => e.target.style.color = '#fff'} onMouseOut={e => e.target.style.color = '#a1a1aa'}>
                        Contact
                    </Link>
                    <Link to="/admin/login" style={{ color: '#a1a1aa', fontSize: '14px', fontWeight: 500, textDecoration: 'none', transition: 'color 0.2s' }}
                        onMouseOver={e => e.target.style.color = '#fff'} onMouseOut={e => e.target.style.color = '#a1a1aa'}>
                        Admin
                    </Link>
                    <Link to="/contact" className="btn-white" style={{ fontSize: '14px', padding: '8px 20px', borderRadius: '50px', textDecoration: 'none' }}>
                        Get Started →
                    </Link>
                </div>
            </nav>

            {/* Hero */}
            <main style={{
                flex: 1, display: 'flex', flexDirection: 'column',
                justifyContent: 'center', alignItems: 'center',
                textAlign: 'center', padding: '80px 24px',
                position: 'relative', zIndex: 1
            }}>
                <div style={{
                    display: 'inline-block', padding: '6px 16px', marginBottom: '32px',
                    borderRadius: '50px', border: '1px solid rgba(99,102,241,0.4)',
                    background: 'rgba(99,102,241,0.08)', fontSize: '12px', fontWeight: 600,
                    letterSpacing: '0.08em', textTransform: 'uppercase', color: '#818cf8'
                }}>
                    Introducing Lumina Premium
                </div>

                <h1 style={{
                    fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 800,
                    letterSpacing: '-0.03em', lineHeight: 1.05,
                    maxWidth: '780px', marginBottom: '24px'
                }} className="text-gradient">
                    Design your relationships with precision.
                </h1>

                <p style={{
                    fontSize: '18px', color: '#71717a', maxWidth: '520px',
                    lineHeight: 1.7, marginBottom: '48px'
                }}>
                    The ultimate premium CRM platform to manage client connections.
                    Experience a beautiful workspace built for clarity and speed.
                </p>

                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <Link to="/contact" className="btn-white" style={{ textDecoration: 'none', gap: '8px', borderRadius: '50px', padding: '14px 32px', fontSize: '16px' }}>
                        Contact Sales →
                    </Link>
                    <Link to="/admin/login" className="btn-dark" style={{ textDecoration: 'none', borderRadius: '50px', padding: '14px 32px', fontSize: '16px' }}>
                        Admin Portal
                    </Link>
                </div>
            </main>

            {/* Footer */}
            <footer style={{
                textAlign: 'center', padding: '24px',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                color: '#52525b', fontSize: '13px', position: 'relative', zIndex: 1
            }}>
                © 2026 Lumina Inc. All rights reserved.
            </footer>
        </div>
    );
}

export default Home;

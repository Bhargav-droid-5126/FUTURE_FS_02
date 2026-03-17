import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, LayoutDashboard } from 'lucide-react';

function Navbar({ setIsAuthenticated }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <Link to="/" className="nav-brand" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <LayoutDashboard size={24} color="var(--primary)" />
                Mini CRM
            </Link>

            <button
                onClick={handleLogout}
                className="btn btn-secondary"
                style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
            >
                <LogOut size={16} />
                Logout
            </button>
        </nav>
    );
}

export default Navbar;

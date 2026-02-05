import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    FileEdit,
    LogOut,
    Church
} from 'lucide-react';
import { logout } from '../services/api';

export default function Layout({ children }) {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/dashboard', label: 'Overview', icon: LayoutDashboard },
        { path: '/members', label: 'Members Database', icon: Users },
        { path: '/form-builder', label: 'Form Builder', icon: FileEdit },
    ];

    return (
        <div style={styles.container}>
            {/* Sidebar */}
            <aside style={styles.sidebar}>
                <div style={styles.brand}>
                    <Church size={28} color="#60a5fa" />
                    <span style={styles.brandName}>Moore Admin</span>
                </div>

                <nav style={styles.nav}>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                style={({ isActive }) => ({
                                    ...styles.navItem,
                                    ...(isActive ? styles.navItemActive : {})
                                })}
                            >
                                <Icon size={20} />
                                <span>{item.label}</span>
                            </NavLink>
                        );
                    })}
                </nav>

                <div style={styles.footer}>
                    <button onClick={handleLogout} style={styles.logoutBtn}>
                        <LogOut size={18} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={styles.main}>
                <header style={styles.header}>
                    <div style={styles.headerTitle}>
                        {navItems.find(i => i.path === location.pathname)?.label || 'Dashboard'}
                    </div>
                    <div style={styles.userProfile}>
                        <div style={styles.avatar}>A</div>
                        <span style={styles.username}>Administrator</span>
                    </div>
                </header>
                <div style={styles.scrollArea}>
                    <div style={styles.contentPadding}>
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
    },
    sidebar: {
        width: '260px',
        backgroundColor: 'var(--bg-sidebar)',
        color: 'var(--text-sidebar)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
    },
    brand: {
        padding: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
    },
    brandName: {
        fontSize: '1.25rem',
        fontWeight: '700',
        color: 'white',
        letterSpacing: '0.5px',
    },
    nav: {
        flex: 1,
        padding: '24px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
    },
    navItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        borderRadius: '8px',
        color: 'inherit',
        textDecoration: 'none',
        transition: 'all 0.2s',
        fontSize: '0.95rem',
        fontWeight: '500',
    },
    navItemActive: {
        backgroundColor: 'var(--primary)',
        color: 'white',
    },
    footer: {
        padding: '20px',
        borderTop: '1px solid rgba(255,255,255,0.1)',
    },
    logoutBtn: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px',
        background: 'transparent',
        border: '1px solid rgba(255,255,255,0.2)',
        color: 'var(--text-sidebar)',
        borderRadius: '6px',
        cursor: 'pointer',
        justifyContent: 'center',
        transition: 'all 0.2s',
    },
    main: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--bg-page)',
        overflow: 'hidden',
    },
    header: {
        height: '64px',
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
    },
    headerTitle: {
        fontSize: '1.25rem',
        fontWeight: '600',
        color: 'var(--text-main)',
    },
    userProfile: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    avatar: {
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        backgroundColor: 'var(--primary-light)',
        color: 'var(--primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        fontSize: '14px',
    },
    username: {
        fontSize: '0.9rem',
        fontWeight: '500',
        color: 'var(--text-main)',
    },
    scrollArea: {
        flex: 1,
        overflowY: 'auto',
    },
    contentPadding: {
        padding: '32px',
        maxWidth: '1400px',
        margin: '0 auto',
    },
};

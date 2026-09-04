import React, { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, BookOpen, FileText, PhoneCall, 
    Play, Megaphone, Target, FastForward, 
    ShieldCheck, Users, ChevronDown, ChevronUp, LogOut,
    Settings as SettingsIcon, Ticket, Search, Activity,
    Menu, X
} from 'lucide-react';
import '../admin.css';

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Collapsible states for sidebar sub-menus
    const [openEnquiries, setOpenEnquiries] = useState(true);
    const [openContent, setOpenContent] = useState(true);
    const [openSettings, setOpenSettings] = useState(true);

    // Mobile sidebar toggle state
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Check for auth
    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin/login');
        }
    }, [navigate, location]);

    // Close mobile sidebar whenever route/location changes
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location.pathname]);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/admin/login');
    };

    const handleLinkClick = () => {
        setIsSidebarOpen(false);
    };

    return (
        <div className="admin-body">
            <div className="admin-layout">
                {/* Backdrop overlay on mobile */}
                <div 
                    className={`admin-backdrop ${isSidebarOpen ? 'backdrop-open' : ''}`}
                    onClick={() => setIsSidebarOpen(false)}
                    aria-label="Close sidebar overlay"
                />

                {/* Sidebar Drawer */}
                <aside 
                    className={`admin-sidebar ${isSidebarOpen ? 'sidebar-open' : ''}`} 
                    style={{ backgroundColor: '#000', borderRight: '1px solid #27272a', color: '#a1a1aa' }}
                >
                    {/* Header in sidebar with mobile close button */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem 0.5rem 1.5rem' }}>
                        <div style={{ fontWeight: '700', fontSize: '1.1rem', color: '#fafafa', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ color: '#fbbf24' }}>Xavier</span> Admin
                        </div>
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            aria-label="Close Sidebar"
                            style={{
                                display: isSidebarOpen ? 'flex' : 'none',
                                background: 'transparent',
                                border: 'none',
                                color: '#a1a1aa',
                                cursor: 'pointer',
                                padding: '0.25rem',
                                borderRadius: '0.375rem'
                            }}
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <nav className="admin-nav" style={{ paddingTop: '1rem' }}>
                        
                        <Link 
                            to="/admin" 
                            onClick={handleLinkClick}
                            className={location.pathname === '/admin' ? 'active' : ''}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', color: location.pathname === '/admin' ? '#f59e0b' : '#a1a1aa' }}
                        >
                            <LayoutDashboard size={18} />
                            <span>Welcome to Dashboard</span>
                        </Link>
                        
                        <Link 
                            to="/admin/courses" 
                            onClick={handleLinkClick}
                            className={location.pathname === '/admin/courses' ? 'active' : ''}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', color: location.pathname === '/admin/courses' ? '#f59e0b' : '#a1a1aa' }}
                        >
                            <BookOpen size={18} />
                            <span>Courses</span>
                        </Link>

                        {/* Enquiries Section */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <div 
                                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', padding: '0.5rem 0.75rem', fontSize: '0.75rem', color: '#71717a' }}
                                onClick={() => setOpenEnquiries(!openEnquiries)}
                            >
                                <span>Enquiries</span>
                                {openEnquiries ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </div>
                            {openEnquiries && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.5rem' }}>
                                    <Link to="/admin/applications" onClick={handleLinkClick} className={location.pathname === '/admin/applications' ? 'active' : ''} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: location.pathname === '/admin/applications' ? '#f59e0b' : '#a1a1aa' }}>
                                        <FileText size={16} /> Apply
                                    </Link>
                                    <Link to="/admin/event-registrations" onClick={handleLinkClick} className={location.pathname === '/admin/event-registrations' ? 'active' : ''} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: location.pathname === '/admin/event-registrations' ? '#f59e0b' : '#a1a1aa' }}>
                                        <Ticket size={16} /> Event Registrations
                                    </Link>
                                    <Link to="/admin/contacts" onClick={handleLinkClick} className={location.pathname === '/admin/contacts' ? 'active' : ''} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: location.pathname === '/admin/contacts' ? '#f59e0b' : '#a1a1aa' }}>
                                        <PhoneCall size={16} /> Contact
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Content Section */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <div 
                                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', padding: '0.5rem 0.75rem', fontSize: '0.75rem', color: '#71717a' }}
                                onClick={() => setOpenContent(!openContent)}
                            >
                                <span>Content</span>
                                {openContent ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </div>
                            {openContent && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.5rem' }}>
                                    <Link to="/admin/life-at-xaviers" onClick={handleLinkClick} className={location.pathname === '/admin/life-at-xaviers' ? 'active' : ''} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: location.pathname === '/admin/life-at-xaviers' ? '#f59e0b' : '#a1a1aa' }}>
                                        <Play size={16} /> Life At Xaviers
                                    </Link>
                                    <Link to="/admin/news" onClick={handleLinkClick} className={location.pathname === '/admin/news' ? 'active' : ''} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: location.pathname === '/admin/news' ? '#f59e0b' : '#a1a1aa' }}>
                                        <Megaphone size={16} /> News And Events
                                    </Link>
                                    <Link to="/admin/popups" onClick={handleLinkClick} className={location.pathname === '/admin/popups' ? 'active' : ''} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: location.pathname === '/admin/popups' ? '#f59e0b' : '#a1a1aa' }}>
                                        <Target size={16} /> Popup
                                    </Link>
                                    <Link to="/admin/metas" onClick={handleLinkClick} className={location.pathname === '/admin/metas' ? 'active' : ''} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: location.pathname === '/admin/metas' ? '#f59e0b' : '#a1a1aa' }}>
                                        <Search size={16} /> SEO Metas
                                    </Link>
                                    <Link to="/admin/upcoming-events" onClick={handleLinkClick} className={location.pathname === '/admin/upcoming-events' ? 'active' : ''} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: location.pathname === '/admin/upcoming-events' ? '#f59e0b' : '#a1a1aa' }}>
                                        <FastForward size={16} /> Upcoming Events
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Settings Section */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <div 
                                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', padding: '0.5rem 0.75rem', fontSize: '0.75rem', color: '#71717a' }}
                                onClick={() => setOpenSettings(!openSettings)}
                            >
                                <span>Settings</span>
                                {openSettings ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </div>
                            {openSettings && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.5rem' }}>
                                    <Link to="/admin/event-settings" onClick={handleLinkClick} className={location.pathname === '/admin/event-settings' ? 'active' : ''} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: location.pathname === '/admin/event-settings' ? '#f59e0b' : '#a1a1aa' }}>
                                        <SettingsIcon size={16} /> Event Settings
                                    </Link>
                                    <Link to="/admin/roles" onClick={handleLinkClick} className={location.pathname === '/admin/roles' ? 'active' : ''} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: location.pathname === '/admin/roles' ? '#f59e0b' : '#a1a1aa' }}>
                                        <ShieldCheck size={16} /> Roles
                                    </Link>
                                    <Link to="/admin/users" onClick={handleLinkClick} className={location.pathname === '/admin/users' ? 'active' : ''} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: location.pathname === '/admin/users' ? '#f59e0b' : '#a1a1aa' }}>
                                        <Users size={16} /> Users
                                    </Link>
                                    <Link to="/admin/activity-logs" onClick={handleLinkClick} className={location.pathname === '/admin/activity-logs' ? 'active' : ''} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: location.pathname === '/admin/activity-logs' ? '#f59e0b' : '#a1a1aa' }}>
                                        <Activity size={16} /> Activity Logs
                                    </Link>
                                </div>
                            )}
                        </div>

                    </nav>
                    <div className="admin-logout" style={{ borderTop: '1px solid #27272a' }}>
                        <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#ef4444', borderColor: '#ef4444' }}>
                            <LogOut size={16} /> Logout
                        </button>
                    </div>
                </aside>

                {/* Main Content Area */}
                <div className="admin-main-wrapper" style={{ backgroundColor: '#0a0a0a' }}>
                    {/* Mobile Top Header with Hamburger Toggle */}
                    <div className="admin-mobile-topbar">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            aria-label="Open Sidebar Menu"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: '#18181b',
                                border: '1px solid #27272a',
                                color: '#fbbf24',
                                padding: '0.5rem',
                                borderRadius: '0.375rem',
                                cursor: 'pointer'
                            }}
                        >
                            <Menu size={20} />
                        </button>
                        <div style={{ fontWeight: '700', fontSize: '1rem', color: '#fafafa' }}>
                            <span style={{ color: '#fbbf24' }}>Xavier</span> Admin
                        </div>
                        <button 
                            onClick={handleLogout}
                            aria-label="Logout"
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#ef4444',
                                cursor: 'pointer',
                                padding: '0.4rem'
                            }}
                        >
                            <LogOut size={18} />
                        </button>
                    </div>

                    <main className="admin-content">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;


import React, { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, BookOpen, FileText, PhoneCall, 
    Play, Megaphone, Target, FastForward, 
    ShieldCheck, Users, ChevronDown, ChevronUp, LogOut,
    Settings as SettingsIcon, Ticket, Search, Activity
} from 'lucide-react';
import '../admin.css';

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Collapsible states
    const [openEnquiries, setOpenEnquiries] = useState(true);
    const [openContent, setOpenContent] = useState(true);
    const [openSettings, setOpenSettings] = useState(true);

    // Check for auth
    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin/login');
        }
    }, [navigate, location]);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/admin/login');
    };

    return (
        <div className="admin-body">
            <div className="admin-layout">
                <aside className="admin-sidebar" style={{ backgroundColor: '#000', borderRight: 'none', color: '#a1a1aa' }}>
                    <nav className="admin-nav" style={{ paddingTop: '2rem' }}>
                        
                        <Link 
                            to="/admin" 
                            className={location.pathname === '/admin' ? 'active' : ''}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', color: location.pathname === '/admin' ? '#f59e0b' : '#a1a1aa' }}
                        >
                            <LayoutDashboard size={18} />
                            <span>Welcome to Dashboard</span>
                        </Link>
                        
                        <Link 
                            to="/admin/courses" 
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
                                    <Link to="/admin/applications" className={location.pathname === '/admin/applications' ? 'active' : ''} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: location.pathname === '/admin/applications' ? '#f59e0b' : '#a1a1aa' }}>
                                        <FileText size={16} /> Apply
                                    </Link>
                                    <Link to="/admin/event-registrations" className={location.pathname === '/admin/event-registrations' ? 'active' : ''} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: location.pathname === '/admin/event-registrations' ? '#f59e0b' : '#a1a1aa' }}>
                                        <Ticket size={16} /> Event Registrations
                                    </Link>
                                    <Link to="/admin/contacts" className={location.pathname === '/admin/contacts' ? 'active' : ''} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: location.pathname === '/admin/contacts' ? '#f59e0b' : '#a1a1aa' }}>
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
                                    <Link to="/admin/life-at-xaviers" className={location.pathname === '/admin/life-at-xaviers' ? 'active' : ''} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: location.pathname === '/admin/life-at-xaviers' ? '#f59e0b' : '#a1a1aa' }}>
                                        <Play size={16} /> Life At Xaviers
                                    </Link>
                                    <Link to="/admin/news" className={location.pathname === '/admin/news' ? 'active' : ''} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: location.pathname === '/admin/news' ? '#f59e0b' : '#a1a1aa' }}>
                                        <Megaphone size={16} /> News And Events
                                    </Link>
                                    <Link to="/admin/popups" className={location.pathname === '/admin/popups' ? 'active' : ''} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: location.pathname === '/admin/popups' ? '#f59e0b' : '#a1a1aa' }}>
                                        <Target size={16} /> Popup
                                    </Link>
                                    <Link to="/admin/metas" className={location.pathname === '/admin/metas' ? 'active' : ''} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: location.pathname === '/admin/metas' ? '#f59e0b' : '#a1a1aa' }}>
                                        <Search size={16} /> SEO Metas
                                    </Link>
                                    <Link to="/admin/upcoming-events" className={location.pathname === '/admin/upcoming-events' ? 'active' : ''} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: location.pathname === '/admin/upcoming-events' ? '#f59e0b' : '#a1a1aa' }}>
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
                                    <Link to="/admin/event-settings" className={location.pathname === '/admin/event-settings' ? 'active' : ''} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: location.pathname === '/admin/event-settings' ? '#f59e0b' : '#a1a1aa' }}>
                                        <SettingsIcon size={16} /> Event Settings
                                    </Link>
                                    <Link to="/admin/roles" className={location.pathname === '/admin/roles' ? 'active' : ''} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: location.pathname === '/admin/roles' ? '#f59e0b' : '#a1a1aa' }}>
                                        <ShieldCheck size={16} /> Roles
                                    </Link>
                                    <Link to="/admin/users" className={location.pathname === '/admin/users' ? 'active' : ''} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: location.pathname === '/admin/users' ? '#f59e0b' : '#a1a1aa' }}>
                                        <Users size={16} /> Users
                                    </Link>
                                    <Link to="/admin/activity-logs" className={location.pathname === '/admin/activity-logs' ? 'active' : ''} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: location.pathname === '/admin/activity-logs' ? '#f59e0b' : '#a1a1aa' }}>
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

                <div className="admin-main-wrapper" style={{ marginLeft: '16rem', backgroundColor: '#0a0a0a' }}>
                    <main className="admin-content" style={{ padding: '2rem 3rem' }}>
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;

import { getApiUrl } from '../../services/apiClient';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
    Target, FastForward, Play, Megaphone, PhoneCall, FileText 
} from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        newsCount: 0,
        upcomingEventsCount: 0,
        applicationsCount: 0,
        contactsCount: 0,
        popupsCount: 0,
        lifeAtXavierCount: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('adminToken');
                const res = await axios.get(getApiUrl('/admin/stats'), {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStats(res.data);
            } catch (error) {
                console.error('Failed to load stats', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const cardStyle = {
        backgroundColor: '#171717',
        border: '1px solid #262626',
        borderRadius: '0.75rem',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
    };

    const headerStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        color: '#71717a',
        fontSize: '0.875rem',
        fontWeight: '500'
    };

    const valueStyle = {
        fontSize: '2rem',
        fontWeight: '700',
        color: '#fafafa',
        lineHeight: '1'
    };

    if (loading) return <p style={{ color: '#a1a1aa' }}>Loading stats...</p>;

    return (
        <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#fafafa', marginBottom: '2rem' }}>
                Welcome to Dashboard
            </h1>

            {/* Contents Hub */}
            <div style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#fafafa', marginBottom: '1.5rem' }}>
                    Contents Hub
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    
                    <div style={cardStyle}>
                        <div style={headerStyle}>
                            <Target size={16} /> Total Popups
                        </div>
                        <div style={valueStyle}>{stats.popupsCount || 0}</div>
                    </div>

                    <div style={cardStyle}>
                        <div style={headerStyle}>
                            <FastForward size={16} /> Total Upcoming Events
                        </div>
                        <div style={valueStyle}>{stats.upcomingEventsCount || 0}</div>
                    </div>

                    <div style={cardStyle}>
                        <div style={headerStyle}>
                            <Play size={16} /> Total Life At Xavier.
                        </div>
                        <div style={valueStyle}>{stats.lifeAtXavierCount || 0}</div>
                    </div>

                    <div style={cardStyle}>
                        <div style={headerStyle}>
                            <Megaphone size={16} /> Total News And Events
                        </div>
                        <div style={valueStyle}>{stats.newsCount || 0}</div>
                    </div>

                </div>
            </div>

            {/* Enquiries */}
            <div>
                <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#fafafa', marginBottom: '1.5rem' }}>
                    Enquiries
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    
                    <div style={cardStyle}>
                        <div style={headerStyle}>
                            <PhoneCall size={16} /> Total Contacts
                        </div>
                        <div style={valueStyle}>{stats.contactsCount || 0}</div>
                    </div>

                    <div style={cardStyle}>
                        <div style={headerStyle}>
                            <FileText size={16} /> Total Appointments
                        </div>
                        <div style={valueStyle}>{stats.applicationsCount || 0}</div>
                    </div>

                </div>
            </div>

        </div>
    );
};

export default AdminDashboard;

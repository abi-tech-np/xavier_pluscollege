import { getApiUrl } from '../../services/apiClient';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Download } from 'lucide-react';

const ManageEventRegistrations = () => {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);

    const getAuthHeaders = () => ({
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await (getApiUrl(''), getAuthHeaders());
            setRegistrations(res.data);
        } catch (error) {
            console.error('Error fetching registrations:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this registration?')) return;
        try {
            await axios.delete(`/admin/event-registrations/${id}`, getAuthHeaders());
            fetchData();
        } catch (error) {
            console.error('Error deleting registration:', error);
            alert('Failed to delete registration.');
        }
    };

    const handleDownloadCSV = () => {
        if (registrations.length === 0) {
            alert('No data to download.');
            return;
        }

        const headers = ['Ticket Number', 'Name', 'Email', 'Phone', 'Address', 'Waitlist', 'Date Applied'];
        const rows = registrations.map(reg => [
            `"${reg.ticket_number}"`,
            `"${reg.name}"`,
            `"${reg.email}"`,
            `"${reg.phone}"`,
            `"${reg.address}"`,
            `"${reg.is_waitlist ? 'Yes' : 'No'}"`,
            `"${new Date(reg.created_at).toLocaleDateString()}"`
        ]);

        const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'event_registrations_export.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#fafafa', margin: 0 }}>Manage Event Registrations</h2>
                <button onClick={handleDownloadCSV} className="admin-btn admin-btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Download size={16} /> Download CSV
                </button>
            </div>

            <div className="admin-card">
                {loading ? (
                    <p>Loading registrations...</p>
                ) : (
                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Ticket #</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Waitlist</th>
                                    <th>Date Applied</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {registrations.map(item => (
                                    <tr key={item.id}>
                                        <td style={{ fontWeight: 600, color: '#fbbf24' }}>#{item.ticket_number}</td>
                                        <td style={{ fontWeight: 500, color: '#fafafa' }}>{item.name}</td>
                                        <td>{item.email}</td>
                                        <td>{item.phone}</td>
                                        <td>
                                            {item.is_waitlist ? 
                                                <span className="admin-badge badge-pending">Waitlisted</span> : 
                                                <span className="admin-badge badge-success">Confirmed</span>
                                            }
                                        </td>
                                        <td>{new Date(item.created_at).toLocaleDateString()}</td>
                                        <td>
                                            <button 
                                                className="admin-btn admin-btn-danger" 
                                                onClick={() => handleDelete(item.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {registrations.length === 0 && (
                                    <tr>
                                        <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                                            No registrations found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageEventRegistrations;

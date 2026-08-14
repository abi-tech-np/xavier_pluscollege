import { getApiUrl } from '../../services/apiClient';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageActivityLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const getAuthHeaders = () => ({
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await (getApiUrl(''), getAuthHeaders());
            setLogs(res.data);
        } catch (error) {
            console.error('Error fetching logs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#fafafa', margin: 0 }}>Activity Log (Recent 100)</h2>
            </div>

            <div className="admin-card">
                {loading ? (
                    <p>Loading activity logs...</p>
                ) : (
                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Log Name</th>
                                    <th>Description</th>
                                    <th>Subject (Type & ID)</th>
                                    <th>Causer (User ID)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.map(log => (
                                    <tr key={log.id}>
                                        <td style={{ color: '#a1a1aa' }}>
                                            {new Date(log.created_at).toLocaleString()}
                                        </td>
                                        <td style={{ fontWeight: 600, color: '#fbbf24' }}>
                                            {log.log_name || 'System'}
                                        </td>
                                        <td style={{ fontWeight: 500, color: '#fafafa' }}>
                                            {log.description}
                                        </td>
                                        <td>
                                            {log.subject_type ? (
                                                <span style={{ fontSize: '0.85rem' }}>
                                                    {log.subject_type.split('\\\\').pop()} #{log.subject_id}
                                                </span>
                                            ) : (
                                                <span style={{ color: '#52525b' }}>N/A</span>
                                            )}
                                        </td>
                                        <td>
                                            {log.causer_id ? `User #${log.causer_id}` : 'System'}
                                        </td>
                                    </tr>
                                ))}
                                {logs.length === 0 && (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>
                                            No activity logs found.
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

export default ManageActivityLogs;

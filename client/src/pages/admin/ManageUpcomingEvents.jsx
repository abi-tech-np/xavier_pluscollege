import { getApiUrl } from '../../services/apiClient';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2 } from 'lucide-react';

const ManageUpcomingEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ title: '', time: '', content: '', location: '' });

    const getAuthHeaders = () => ({
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
    });

    const fetchEvents = async () => {
        try {
            const res = await axios.get(getApiUrl('/admin/upcoming-events'), getAuthHeaders());
            setEvents(res.data);
        } catch (error) {
            console.error('Failed to fetch', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(getApiUrl('/admin/upcoming-events'), formData, getAuthHeaders());
            setFormData({ title: '', time: '', content: '', location: '' });
            fetchEvents();
        } catch (error) {
            console.error('Failed to save', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                await axios.delete(getApiUrl(`/admin/upcoming-events/${id}`), getAuthHeaders());
                fetchEvents();
            } catch (error) {
                console.error('Failed to delete', error);
            }
        }
    };

    return (
        <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#fafafa', marginBottom: '1.5rem' }}>Manage Upcoming Events</h2>
            
            <div className="admin-card">
                <form onSubmit={handleSubmit} className="admin-form" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="admin-form-group">
                        <label>Title</label>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} required placeholder="Event Title" />
                    </div>
                    <div className="admin-form-group">
                        <label>Time</label>
                        <input type="text" name="time" value={formData.time} onChange={handleChange} placeholder="10:00 AM" />
                    </div>
                    <div className="admin-form-group">
                        <label>Location</label>
                        <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Main Hall" />
                    </div>
                    <div className="admin-form-group">
                        <label>Description</label>
                        <input type="text" name="content" value={formData.content} onChange={handleChange} placeholder="Event description..." />
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                        <button type="submit" className="admin-btn admin-btn-primary">Add Event</button>
                    </div>
                </form>
            </div>

            <div className="admin-card">
                {loading ? <p>Loading...</p> : (
                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Time</th>
                                    <th>Location</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {events.map(item => (
                                    <tr key={item.id}>
                                        <td style={{ color: '#fafafa', fontWeight: '500' }}>{item.title}</td>
                                        <td>{item.time}</td>
                                        <td>{item.location}</td>
                                        <td>
                                            <span className={`admin-badge ${item.status ? 'badge-success' : 'badge-danger'}`}>
                                                {item.status ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td>
                                            <button onClick={() => handleDelete(item.id)} className="admin-btn admin-btn-danger" style={{ padding: '0.3rem 0.6rem' }}>
                                                <Trash2 size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {events.length === 0 && (
                                    <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No events found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageUpcomingEvents;

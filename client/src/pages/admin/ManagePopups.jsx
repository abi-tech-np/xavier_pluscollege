import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2 } from 'lucide-react';

const ManagePopups = () => {
    const [popups, setPopups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState('');
    const [link, setLink] = useState('');

    const getAuthHeaders = () => ({
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
    });

    const fetchPopups = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/admin/popups', getAuthHeaders());
            setPopups(res.data);
        } catch (error) {
            console.error('Failed to fetch', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPopups();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/admin/popups', { title, link }, getAuthHeaders());
            setTitle('');
            setLink('');
            fetchPopups();
        } catch (error) {
            console.error('Failed to save', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                await axios.delete(`http://localhost:5000/api/admin/popups/${id}`, getAuthHeaders());
                fetchPopups();
            } catch (error) {
                console.error('Failed to delete', error);
            }
        }
    };

    return (
        <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#fafafa', marginBottom: '1.5rem' }}>Manage Popups</h2>
            
            <div className="admin-card">
                <form onSubmit={handleSubmit} className="admin-form" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                    <div className="admin-form-group" style={{ flex: 1, marginBottom: 0 }}>
                        <label>Title</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Popup Title" />
                    </div>
                    <div className="admin-form-group" style={{ flex: 1, marginBottom: 0 }}>
                        <label>Image/Link URL</label>
                        <input type="text" value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://..." />
                    </div>
                    <button type="submit" className="admin-btn admin-btn-primary" style={{ padding: '0.6rem 1.5rem' }}>Add Popup</button>
                </form>
            </div>

            <div className="admin-card">
                {loading ? <p>Loading...</p> : (
                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Title</th>
                                    <th>Link</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {popups.map(item => (
                                    <tr key={item.id}>
                                        <td>{item.id}</td>
                                        <td style={{ color: '#fafafa', fontWeight: '500' }}>{item.title}</td>
                                        <td>{item.link}</td>
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
                                {popups.length === 0 && (
                                    <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No popups found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManagePopups;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2 } from 'lucide-react';

const ManageLifeAtXavier = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ title: '', slug: '' });

    const getAuthHeaders = () => ({
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
    });

    const fetchItems = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/admin/life-at-xaviers', getAuthHeaders());
            setItems(res.data);
        } catch (error) {
            console.error('Failed to fetch', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const generateSlug = () => {
        setFormData({ ...formData, slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/admin/life-at-xaviers', formData, getAuthHeaders());
            setFormData({ title: '', slug: '' });
            fetchItems();
        } catch (error) {
            console.error('Failed to save', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                await axios.delete(`http://localhost:5000/api/admin/life-at-xaviers/${id}`, getAuthHeaders());
                fetchItems();
            } catch (error) {
                console.error('Failed to delete', error);
            }
        }
    };

    return (
        <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#fafafa', marginBottom: '1.5rem' }}>Manage Life At Xavier</h2>
            
            <div className="admin-card">
                <form onSubmit={handleSubmit} className="admin-form" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="admin-form-group">
                        <label>Title</label>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} required placeholder="Title" />
                    </div>
                    <div className="admin-form-group">
                        <label>
                            Slug <span onClick={generateSlug} style={{ color: 'var(--admin-primary)', cursor: 'pointer', fontSize: '0.8rem', marginLeft: '0.5rem' }}>(Auto Generate)</span>
                        </label>
                        <input type="text" name="slug" value={formData.slug} onChange={handleChange} required placeholder="url-friendly-slug" />
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                        <button type="submit" className="admin-btn admin-btn-primary">Add Entry</button>
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
                                    <th>Slug</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map(item => (
                                    <tr key={item.id}>
                                        <td style={{ color: '#fafafa', fontWeight: '500' }}>{item.title}</td>
                                        <td>{item.slug}</td>
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
                                {items.length === 0 && (
                                    <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>No entries found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageLifeAtXavier;

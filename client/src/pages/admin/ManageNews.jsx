import { getApiUrl } from '../../services/apiClient';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageNews = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Form state
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        content: '',
        status: true
    });

    const getAuthHeaders = () => ({
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
    });

    const fetchNews = async () => {
        try {
            setLoading(true);
            const res = await axios.get(getApiUrl('/admin/news'), getAuthHeaders());
            setNews(res.data);
        } catch (error) {
            console.error('Error fetching news:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleGenerateSlug = () => {
        const generated = formData.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
        setFormData(prev => ({ ...prev, slug: generated }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await axios.put(getApiUrl(`/admin/news/${currentId}`), formData, getAuthHeaders());
            } else {
                await axios.post(getApiUrl('/admin/news'), formData, getAuthHeaders());
            }
            fetchNews();
            handleCancel();
        } catch (error) {
            console.error('Error saving news:', error);
            alert('Failed to save news.');
        }
    };

    const handleEdit = (item) => {
        setIsEditing(true);
        setCurrentId(item.id);
        setFormData({
            title: item.title,
            slug: item.slug,
            content: item.content,
            status: item.status
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this news item?')) return;
        try {
            await axios.delete(getApiUrl(`/admin/news/${id}`), getAuthHeaders());
            fetchNews();
        } catch (error) {
            console.error('Error deleting news:', error);
            alert('Failed to delete news.');
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setCurrentId(null);
        setFormData({ title: '', slug: '', content: '', status: true });
    };

    return (
        <div>

            <div className="admin-card" style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1.5rem', marginTop: 0 }}>
                    {isEditing ? 'Edit News Item' : 'Add New Item'}
                </h3>
                <form onSubmit={handleSubmit} className="admin-form">
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div className="admin-form-group" style={{ flex: 1 }}>
                            <label>Title</label>
                            <input 
                                type="text" 
                                name="title" 
                                value={formData.title} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        <div className="admin-form-group" style={{ flex: 1 }}>
                            <label>
                                Slug 
                                <span style={{ marginLeft: '10px', fontSize: '0.8rem', color: 'var(--admin-primary)', cursor: 'pointer' }} onClick={handleGenerateSlug}>
                                    (Generate from Title)
                                </span>
                            </label>
                            <input 
                                type="text" 
                                name="slug" 
                                value={formData.slug} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                    </div>
                    
                    <div className="admin-form-group">
                        <label>Content</label>
                        <textarea 
                            name="content" 
                            rows="5" 
                            value={formData.content} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <input 
                            type="checkbox" 
                            id="status" 
                            name="status" 
                            checked={formData.status} 
                            onChange={handleChange} 
                            style={{ width: 'auto' }}
                        />
                        <label htmlFor="status">Published (Active)</label>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                        <button type="submit" className="admin-btn admin-btn-primary">
                            {isEditing ? 'Update News' : 'Create News'}
                        </button>
                        {isEditing && (
                            <button type="button" className="admin-btn admin-btn-outline" onClick={handleCancel}>
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className="admin-card">
                {loading ? (
                    <p>Loading news...</p>
                ) : (
                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Slug</th>
                                    <th>Status</th>
                                    <th>Date Created</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {news.map(item => (
                                    <tr key={item.id}>
                                        <td style={{ fontWeight: 500 }}>{item.title}</td>
                                        <td style={{ color: 'var(--admin-text-muted)' }}>{item.slug}</td>
                                        <td>
                                            <span className={`admin-badge ${item.status ? 'badge-success' : 'badge-danger'}`}>
                                                {item.status ? 'Published' : 'Draft'}
                                            </span>
                                        </td>
                                        <td>{new Date(item.created_at).toLocaleDateString()}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button 
                                                    className="admin-btn admin-btn-primary" 
                                                    onClick={() => handleEdit(item)}
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    className="admin-btn admin-btn-danger" 
                                                    onClick={() => handleDelete(item.id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {news.length === 0 && (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>
                                            No news items found.
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

export default ManageNews;

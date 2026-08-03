import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2, Edit2, Plus, Save } from 'lucide-react';

const ManageMetas = () => {
    const [metas, setMetas] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Form state
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        id: '',
        metaable_type: '',
        metaable_id: '',
        title: '',
        description: '',
        schema: '',
        status: true
    });

    const getAuthHeaders = () => ({
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await axios.get('https://plus.xavier.edu.np/plus-api/api/admin/metas', getAuthHeaders());
            setMetas(res.data);
        } catch (error) {
            console.error('Error fetching metas:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleEdit = (meta) => {
        setFormData({
            id: meta.id,
            metaable_type: meta.metaable_type || '',
            metaable_id: meta.metaable_id || '',
            title: meta.title || '',
            description: meta.description || '',
            schema: meta.schema || '',
            status: meta.status
        });
        setIsEditing(true);
        setShowForm(true);
    };

    const resetForm = () => {
        setFormData({
            id: '', metaable_type: '', metaable_id: '', title: '', description: '', schema: '', status: true
        });
        setIsEditing(false);
        setShowForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await axios.put(`https://plus.xavier.edu.np/plus-api/api/admin/metas/${formData.id}`, formData, getAuthHeaders());
            } else {
                await axios.post('https://plus.xavier.edu.np/plus-api/api/admin/metas', formData, getAuthHeaders());
            }
            resetForm();
            fetchData();
        } catch (error) {
            console.error('Error saving meta:', error);
            alert('Failed to save meta.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this SEO meta record?')) return;
        try {
            await axios.delete(`https://plus.xavier.edu.np/plus-api/api/admin/metas/${id}`, getAuthHeaders());
            fetchData();
        } catch (error) {
            console.error('Error deleting meta:', error);
            alert('Failed to delete meta.');
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#fafafa', margin: 0 }}>Manage SEO Metas</h2>
                {!showForm && (
                    <button onClick={() => setShowForm(true)} className="admin-btn admin-btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Plus size={16} /> Add SEO Meta
                    </button>
                )}
            </div>

            {showForm && (
                <div className="admin-card" style={{ marginBottom: '2rem' }}>
                    <form onSubmit={handleSubmit} className="admin-form">
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="admin-form-group">
                                <label>Model Type (e.g. App\Models\Course)</label>
                                <input type="text" name="metaable_type" value={formData.metaable_type} onChange={handleChange} required disabled={isEditing} />
                            </div>
                            <div className="admin-form-group">
                                <label>Model ID</label>
                                <input type="number" name="metaable_id" value={formData.metaable_id} onChange={handleChange} required disabled={isEditing} />
                            </div>
                        </div>

                        <div className="admin-form-group">
                            <label>SEO Title</label>
                            <input type="text" name="title" value={formData.title} onChange={handleChange} />
                        </div>
                        <div className="admin-form-group">
                            <label>SEO Description</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} rows="3"></textarea>
                        </div>
                        <div className="admin-form-group">
                            <label>JSON-LD Schema (Optional)</label>
                            <textarea name="schema" value={formData.schema} onChange={handleChange} rows="4" style={{ fontFamily: 'monospace' }}></textarea>
                        </div>
                        
                        <div className="admin-form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <input type="checkbox" name="status" checked={formData.status} onChange={handleChange} />
                            <label style={{ marginBottom: 0 }}>Active</label>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                            <button type="submit" className="admin-btn admin-btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Save size={16} /> Save Meta
                            </button>
                            <button type="button" onClick={resetForm} className="admin-btn" style={{ backgroundColor: '#404040', color: '#fff' }}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="admin-card">
                {loading ? (
                    <p>Loading metas...</p>
                ) : (
                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Type</th>
                                    <th>Target ID</th>
                                    <th>Title</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {metas.map(item => (
                                    <tr key={item.id}>
                                        <td style={{ color: '#a1a1aa' }}>{item.metaable_type}</td>
                                        <td style={{ fontWeight: 600 }}>{item.metaable_id}</td>
                                        <td style={{ fontWeight: 500, color: '#fafafa' }}>{item.title || 'N/A'}</td>
                                        <td>
                                            {item.status ? 
                                                <span className="admin-badge badge-success">Active</span> : 
                                                <span className="admin-badge badge-pending">Inactive</span>
                                            }
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button 
                                                    className="admin-btn admin-btn-primary" 
                                                    onClick={() => handleEdit(item)}
                                                >
                                                    <Edit2 size={14} />
                                                </button>
                                                <button 
                                                    className="admin-btn admin-btn-danger" 
                                                    onClick={() => handleDelete(item.id)}
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {metas.length === 0 && (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>
                                            No SEO metas found.
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

export default ManageMetas;

import { getApiUrl } from '../../services/apiClient';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Plus, ChevronUp, ChevronRight, UploadCloud } from 'lucide-react';

const ManageLifeAtXavier = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        status: 'Publish', // 'Publish' or 'Draft'
        meta_title: '',
        meta_description: '',
        meta_schema: ''
    });
    
    const [thumbnail, setThumbnail] = useState(null);
    const [ogImage, setOgImage] = useState(null);

    const getAuthHeaders = () => ({
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
    });

    const fetchItems = async () => {
        try {
            const res = await axios.get(getApiUrl('/admin/life-at-xaviers'), getAuthHeaders());
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const updated = { ...prev, [name]: value };
            if (name === 'title' && !prev.slug_modified) {
                updated.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            }
            if (name === 'slug') updated.slug_modified = true;
            return updated;
        });
    };

    const handleFileChange = (e, setter) => {
        if (e.target.files && e.target.files[0]) {
            setter(e.target.files[0]);
        }
    };

    const handleSubmit = async (e, shouldCreateAnother = false) => {
        e.preventDefault();
        try {
            const submitData = new FormData();
            submitData.append('title', formData.title);
            submitData.append('slug', formData.slug);
            submitData.append('status', formData.status === 'Publish' ? 'true' : 'false');
            if (formData.meta_title) submitData.append('meta_title', formData.meta_title);
            if (formData.meta_description) submitData.append('meta_description', formData.meta_description);
            if (formData.meta_schema) submitData.append('meta_schema', formData.meta_schema);
            if (thumbnail) submitData.append('thumbnail', thumbnail);
            if (ogImage) submitData.append('og_image', ogImage);

            await axios.post(getApiUrl('/admin/life-at-xaviers'), submitData, {
                headers: { ...getAuthHeaders().headers, 'Content-Type': 'multipart/form-data' }
            });
            
            fetchItems();
            
            if (shouldCreateAnother) {
                setFormData({ title: '', slug: '', status: 'Publish', meta_title: '', meta_description: '', meta_schema: '' });
                setThumbnail(null);
                setOgImage(null);
            } else {
                setIsCreating(false);
            }
        } catch (error) {
            console.error('Failed to save', error);
            alert('Failed to save the entry.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                await axios.delete(getApiUrl(`/admin/life-at-xaviers/${id}`), getAuthHeaders());
                fetchItems();
            } catch (error) {
                console.error('Failed to delete', error);
            }
        }
    };

    if (isCreating) {
        return (
            <div style={{ padding: '0 1rem', fontFamily: "'Inter', sans-serif" }}>
                {/* Header */}
                <div style={{ marginBottom: '2rem' }}>
                    <div style={{ fontSize: '0.85rem', color: '#a1a1aa', display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <span style={{ cursor: 'pointer' }} onClick={() => setIsCreating(false)}>Life At Xaviers</span>
                        <span>&gt;</span>
                        <span style={{ color: '#fafafa' }}>Create</span>
                    </div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#ffffff', margin: 0 }}>Create Life At Xavier</h1>
                </div>

                {/* Grid Layout */}
                <form onSubmit={(e) => handleSubmit(e, false)} style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '1.5rem', alignItems: 'start' }}>
                    
                    {/* Left Column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {/* Main Details Card */}
                        <div style={{ backgroundColor: '#18181b', borderRadius: '0.75rem', border: '1px solid #27272a', padding: '1.5rem' }}>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#d4d4d8', marginBottom: '0.5rem' }}>
                                    Event Title <span style={{ color: '#ef4444' }}>*</span>
                                </label>
                                <input 
                                    type="text" 
                                    name="title" 
                                    value={formData.title} 
                                    onChange={handleChange} 
                                    required 
                                    style={{
                                        width: '100%', padding: '0.625rem 0.75rem', borderRadius: '0.5rem',
                                        backgroundColor: '#27272a', border: '1px solid #3f3f46', color: '#fafafa', outline: 'none'
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#d4d4d8', marginBottom: '0.5rem' }}>
                                    Thumbnail Image <span style={{ color: '#ef4444' }}>*</span>
                                </label>
                                <div style={{
                                    border: '1px dashed #3f3f46', borderRadius: '0.5rem', padding: '2rem', textAlign: 'center', backgroundColor: '#27272a', position: 'relative'
                                }}>
                                    <input 
                                        type="file" 
                                        onChange={(e) => handleFileChange(e, setThumbnail)}
                                        accept="image/*"
                                        style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                                    />
                                    {thumbnail ? (
                                        <p style={{ color: '#fbbf24', fontSize: '0.875rem', margin: 0 }}>{thumbnail.name}</p>
                                    ) : (
                                        <p style={{ color: '#a1a1aa', fontSize: '0.875rem', margin: 0 }}>Drag & Drop your files or <span style={{ color: '#fafafa' }}>Browse</span></p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Publishing Card */}
                        <div style={{ backgroundColor: '#18181b', borderRadius: '0.75rem', border: '1px solid #27272a', padding: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#fafafa', margin: 0 }}>Publishing</h3>
                                <ChevronUp size={16} color="#71717a" />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#d4d4d8', marginBottom: '0.5rem' }}>
                                    Status <span style={{ color: '#ef4444' }}>*</span>
                                </label>
                                <select 
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    style={{
                                        width: '100%', padding: '0.625rem 0.75rem', borderRadius: '0.5rem',
                                        backgroundColor: '#27272a', border: '1px solid #3f3f46', color: '#fafafa', outline: 'none',
                                        appearance: 'none'
                                    }}
                                >
                                    <option value="Publish">Publish</option>
                                    <option value="Draft">Draft</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Right Column (Meta) */}
                    <div style={{ backgroundColor: '#18181b', borderRadius: '0.75rem', border: '1px solid #27272a', padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#fafafa', margin: 0 }}>Meta</h3>
                            <ChevronUp size={16} color="#71717a" />
                        </div>
                        
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#d4d4d8', marginBottom: '0.5rem' }}>Meta title</label>
                            <input 
                                type="text" name="meta_title" value={formData.meta_title} onChange={handleChange} 
                                style={{ width: '100%', padding: '0.625rem 0.75rem', borderRadius: '0.5rem', backgroundColor: '#27272a', border: '1px solid #3f3f46', color: '#fafafa', outline: 'none' }}
                            />
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#d4d4d8', marginBottom: '0.5rem' }}>Meta Description</label>
                            <textarea 
                                name="meta_description" value={formData.meta_description} onChange={handleChange} rows="3"
                                style={{ width: '100%', padding: '0.625rem 0.75rem', borderRadius: '0.5rem', backgroundColor: '#27272a', border: '1px solid #3f3f46', color: '#fafafa', outline: 'none', resize: 'vertical' }}
                            ></textarea>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#d4d4d8' }}>OG Tag image</label>
                                <span style={{ fontSize: '0.75rem', color: '#71717a' }}>Default image will be used if left empty</span>
                            </div>
                            <div style={{
                                border: '1px dashed #3f3f46', borderRadius: '0.5rem', padding: '2rem', textAlign: 'center', backgroundColor: '#27272a', position: 'relative'
                            }}>
                                <input 
                                    type="file" 
                                    onChange={(e) => handleFileChange(e, setOgImage)}
                                    accept="image/*"
                                    style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                                />
                                {ogImage ? (
                                    <p style={{ color: '#fbbf24', fontSize: '0.875rem', margin: 0 }}>{ogImage.name}</p>
                                ) : (
                                    <p style={{ color: '#a1a1aa', fontSize: '0.875rem', margin: 0 }}>Drag & Drop your files or <span style={{ color: '#fafafa' }}>Browse</span></p>
                                )}
                            </div>
                        </div>

                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#d4d4d8' }}>Schema</label>
                                <span style={{ fontSize: '0.75rem', color: '#71717a' }}>Please, provide full script tag for schema</span>
                            </div>
                            <textarea 
                                name="meta_schema" value={formData.meta_schema} onChange={handleChange} rows="3"
                                style={{ width: '100%', padding: '0.625rem 0.75rem', borderRadius: '0.5rem', backgroundColor: '#27272a', border: '1px solid #3f3f46', color: '#fafafa', outline: 'none', resize: 'vertical' }}
                            ></textarea>
                        </div>
                    </div>

                    {/* Form Actions Footer */}
                    <div style={{ gridColumn: 'span 2', display: 'flex', gap: '1rem', marginTop: '1rem', paddingBottom: '2rem' }}>
                        <button type="submit" style={{ 
                            backgroundColor: '#fbbf24', color: '#000', border: 'none', padding: '0.5rem 1.5rem', borderRadius: '0.375rem', fontWeight: '600', cursor: 'pointer'
                        }}>Create</button>
                        
                        <button type="button" onClick={(e) => handleSubmit(e, true)} style={{ 
                            backgroundColor: '#27272a', color: '#fafafa', border: '1px solid #3f3f46', padding: '0.5rem 1.5rem', borderRadius: '0.375rem', fontWeight: '500', cursor: 'pointer'
                        }}>Create & create another</button>
                        
                        <button type="button" onClick={() => setIsCreating(false)} style={{ 
                            backgroundColor: '#18181b', color: '#fafafa', border: '1px solid #3f3f46', padding: '0.5rem 1.5rem', borderRadius: '0.375rem', fontWeight: '500', cursor: 'pointer'
                        }}>Cancel</button>
                    </div>

                </form>
            </div>
        );
    }

    return (
        <div style={{ padding: '0 1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ffffff', margin: 0 }}>Life At Xaviers</h1>
                <button 
                    onClick={() => setIsCreating(true)}
                    style={{ 
                        backgroundColor: '#fbbf24', color: '#000', fontWeight: '600', padding: '0.6rem 1.25rem', borderRadius: '0.375rem', border: 'none', cursor: 'pointer'
                    }}>
                    New entry
                </button>
            </div>
            
            <div className="admin-card">
                {loading ? <p>Loading...</p> : (
                    <div className="admin-table-container">
                        <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#18181b', borderBottom: '1px solid #27272a' }}>
                                    <th style={{ padding: '1rem 1.5rem', color: '#fafafa' }}>Title</th>
                                    <th style={{ padding: '1rem 1.5rem', color: '#fafafa' }}>Slug</th>
                                    <th style={{ padding: '1rem 1.5rem', color: '#fafafa' }}>Status</th>
                                    <th style={{ padding: '1rem 1.5rem', color: '#fafafa' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map(item => (
                                    <tr key={item.id} style={{ borderBottom: '1px solid #27272a' }}>
                                        <td style={{ padding: '1rem 1.5rem', color: '#d4d4d8', fontWeight: '500' }}>{item.title}</td>
                                        <td style={{ padding: '1rem 1.5rem', color: '#d4d4d8' }}>{item.slug}</td>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <span style={{ 
                                                backgroundColor: item.status ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                color: item.status ? '#22c55e' : '#ef4444',
                                                border: `1px solid ${item.status ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                                                padding: '0.2rem 0.6rem',
                                                borderRadius: '0.375rem',
                                                fontSize: '0.75rem'
                                            }}>
                                                {item.status ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <button onClick={() => handleDelete(item.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {items.length === 0 && (
                                    <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: '#a1a1aa' }}>No entries found.</td></tr>
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

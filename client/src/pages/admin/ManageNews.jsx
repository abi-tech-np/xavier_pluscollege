import { getApiUrl, clearApiCache } from '../../services/apiClient';
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { UploadCloud, Image as ImageIcon, X, Trash2, Edit } from 'lucide-react';

const ManageNews = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    
    // Form state
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        content: '',
        status: true
    });
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [existingImageUrl, setExistingImageUrl] = useState(null);

    const fileInputRef = useRef(null);

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

    // Clean up preview object URL on unmount or change
    useEffect(() => {
        return () => {
            if (previewUrl && previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
        }
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        if (previewUrl && previewUrl.startsWith('blob:')) {
            URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleClearExistingImage = () => {
        setExistingImageUrl(null);
        handleRemoveImage();
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
            setSubmitting(true);
            const submitData = new FormData();
            submitData.append('title', formData.title);
            submitData.append('slug', formData.slug);
            submitData.append('content', formData.content);
            submitData.append('status', formData.status);

            if (imageFile) {
                submitData.append('image', imageFile);
            } else if (isEditing) {
                // If editing and no new file was picked, preserve or clear existingImageUrl
                submitData.append('imageUrl', existingImageUrl || '');
            }

            const config = {
                headers: {
                    ...getAuthHeaders().headers,
                    'Content-Type': 'multipart/form-data'
                }
            };

            if (isEditing) {
                await axios.put(getApiUrl(`/admin/news/${currentId}`), submitData, config);
            } else {
                await axios.post(getApiUrl('/admin/news'), submitData, config);
            }

            // Invalidate public API cache for news so fresh data is visible immediately
            clearApiCache();

            fetchNews();
            handleCancel();
        } catch (error) {
            console.error('Error saving news:', error);
            alert('Failed to save news. Please check console for details.');
        } finally {
            setSubmitting(false);
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
        setExistingImageUrl(item.imageUrl || null);
        setImageFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this news item?')) return;
        try {
            await axios.delete(getApiUrl(`/admin/news/${id}`), getAuthHeaders());
            clearApiCache();
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
        setExistingImageUrl(null);
        handleRemoveImage();
    };

    // Resolve display URL for thumbnails
    const resolveImageUrl = (url) => {
        if (!url) return null;
        if (url.startsWith('http://') || url.startsWith('https://')) return url;
        // In local dev, API runs on port 5000, storage is served at http://localhost:5000/storage/...
        const backendOrigin = import.meta.env.MODE === 'development' ? 'http://localhost:5000' : '';
        const cleanUrl = url.startsWith('/') ? url : `/${url}`;
        return `${backendOrigin}${cleanUrl}`;
    };

    return (
        <div>
            <div className="admin-card" style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1.5rem', marginTop: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {isEditing ? 'Edit News Item' : 'Add New Item'}
                </h3>
                <form onSubmit={handleSubmit} className="admin-form">
                    <div className="admin-form-row">
                        <div className="admin-form-group" style={{ flex: 1, minWidth: 0 }}>
                            <label>Title <span style={{ color: 'var(--admin-danger)' }}>*</span></label>
                            <input 
                                type="text" 
                                name="title" 
                                value={formData.title} 
                                onChange={handleChange} 
                                placeholder="Enter title"
                                required 
                            />
                        </div>
                        <div className="admin-form-group" style={{ flex: 1, minWidth: 0 }}>
                            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>Slug <span style={{ color: 'var(--admin-danger)' }}>*</span></span>
                                <span 
                                    style={{ fontSize: '0.75rem', color: 'var(--admin-primary)', cursor: 'pointer', fontWeight: 600 }} 
                                    onClick={handleGenerateSlug}
                                >
                                    Generate from Title
                                </span>
                            </label>
                            <input 
                                type="text" 
                                name="slug" 
                                value={formData.slug} 
                                onChange={handleChange} 
                                placeholder="e.g. annual-sports-meet"
                                required 
                            />
                        </div>
                    </div>
                    
                    <div className="admin-form-group">
                        <label>Content <span style={{ color: 'var(--admin-danger)' }}>*</span></label>
                        <textarea 
                            name="content" 
                            rows="5" 
                            value={formData.content} 
                            onChange={handleChange} 
                            placeholder="Write news content or HTML markup..."
                            required 
                        />
                    </div>

                    {/* Image Upload Field below Content */}
                    <div className="admin-form-group" style={{ marginTop: '1.25rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                            News Image
                        </label>

                        {/* Existing or preview image display */}
                        {(previewUrl || existingImageUrl) ? (
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '1.25rem',
                                padding: '1rem',
                                border: '1px solid var(--admin-border)',
                                borderRadius: 'var(--admin-radius-sm)',
                                backgroundColor: 'var(--admin-sidebar-bg)',
                                marginBottom: '0.75rem'
                            }}>
                                <div style={{
                                    width: '120px',
                                    height: '80px',
                                    borderRadius: '6px',
                                    overflow: 'hidden',
                                    backgroundColor: '#000',
                                    flexShrink: 0,
                                    border: '1px solid var(--admin-border)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <img 
                                        src={previewUrl || resolveImageUrl(existingImageUrl)} 
                                        alt="Preview" 
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--admin-heading)' }}>
                                        {imageFile ? imageFile.name : 'Current Image'}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', marginTop: '0.2rem' }}>
                                        {imageFile ? `${(imageFile.size / 1024).toFixed(1)} KB` : 'Uploaded'}
                                    </div>
                                    <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.75rem' }}>
                                        <label 
                                            htmlFor="news-image-input" 
                                            style={{ 
                                                cursor: 'pointer', 
                                                fontSize: '0.8rem', 
                                                color: 'var(--admin-primary)',
                                                fontWeight: 500,
                                                marginBottom: 0
                                            }}
                                        >
                                            Replace Image
                                        </label>
                                        <button
                                            type="button"
                                            onClick={previewUrl ? handleRemoveImage : handleClearExistingImage}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: 'var(--admin-danger)',
                                                cursor: 'pointer',
                                                fontSize: '0.8rem',
                                                padding: 0
                                            }}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : null}

                        {/* File selector input */}
                        <div style={{
                            border: '1px dashed var(--admin-border)',
                            borderRadius: 'var(--admin-radius-sm)',
                            padding: '1.75rem',
                            textAlign: 'center',
                            backgroundColor: 'var(--admin-surface)',
                            position: 'relative',
                            cursor: 'pointer',
                            transition: 'border-color 0.2s'
                        }}>
                            <input 
                                id="news-image-input"
                                ref={fileInputRef}
                                type="file" 
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{
                                    position: 'absolute',
                                    inset: 0,
                                    width: '100%',
                                    height: '100%',
                                    opacity: 0,
                                    cursor: 'pointer'
                                }}
                            />
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', pointerEvents: 'none' }}>
                                <UploadCloud size={28} color="var(--admin-primary)" />
                                <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--admin-text)' }}>
                                    Drag & drop an image, or <span style={{ color: 'var(--admin-primary)', fontWeight: 600 }}>browse</span>
                                </p>
                                <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
                                    Supports JPG, PNG, WEBP up to 50MB
                                </span>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                        <input 
                            type="checkbox" 
                            id="status" 
                            name="status" 
                            checked={formData.status} 
                            onChange={handleChange} 
                            style={{ width: 'auto', cursor: 'pointer' }}
                        />
                        <label htmlFor="status" style={{ cursor: 'pointer', marginBottom: 0 }}>
                            Published (Active)
                        </label>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                        <button 
                            type="submit" 
                            className="admin-btn admin-btn-primary"
                            disabled={submitting}
                            style={{ opacity: submitting ? 0.7 : 1 }}
                        >
                            {submitting ? 'Saving...' : (isEditing ? 'Update News' : 'Create News')}
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ margin: 0 }}>News & Events List</h3>
                    <span style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)' }}>
                        {news.length} {news.length === 1 ? 'item' : 'items'}
                    </span>
                </div>
                {loading ? (
                    <p style={{ color: 'var(--admin-text-muted)' }}>Loading news...</p>
                ) : (
                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '80px' }}>Image</th>
                                    <th>Title</th>
                                    <th>Slug</th>
                                    <th>Status</th>
                                    <th>Date Created</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {news.map(item => {
                                    const thumbSrc = resolveImageUrl(item.imageUrl);
                                    return (
                                        <tr key={item.id}>
                                            <td data-label="Image" style={{ verticalAlign: 'middle' }}>
                                                {thumbSrc ? (
                                                    <div style={{
                                                        width: '56px',
                                                        height: '40px',
                                                        borderRadius: '4px',
                                                        overflow: 'hidden',
                                                        backgroundColor: '#000',
                                                        border: '1px solid var(--admin-border)'
                                                    }}>
                                                        <img 
                                                            src={thumbSrc} 
                                                            alt={item.title} 
                                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div style={{
                                                        width: '56px',
                                                        height: '40px',
                                                        borderRadius: '4px',
                                                        backgroundColor: 'var(--admin-sidebar-bg)',
                                                        border: '1px solid var(--admin-border)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: 'var(--admin-text-muted)'
                                                    }}>
                                                        <ImageIcon size={18} />
                                                    </div>
                                                )}
                                            </td>
                                            <td data-label="Title" style={{ fontWeight: 500, color: 'var(--admin-heading)' }}>
                                                {item.title}
                                            </td>
                                            <td data-label="Slug" style={{ color: 'var(--admin-text-muted)' }}>
                                                {item.slug}
                                            </td>
                                            <td data-label="Status">
                                                <span className={`admin-badge ${item.status ? 'badge-success' : 'badge-danger'}`}>
                                                    {item.status ? 'Published' : 'Draft'}
                                                </span>
                                            </td>
                                            <td data-label="Date Created">
                                                {item.created_at ? new Date(item.created_at).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                }) : '-'}
                                            </td>
                                            <td className="admin-table-actions" data-label="Actions" style={{ textAlign: 'right' }}>
                                                <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                                                    <button 
                                                        className="admin-btn admin-btn-primary" 
                                                        onClick={() => handleEdit(item)}
                                                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button 
                                                        className="admin-btn admin-btn-danger" 
                                                        onClick={() => handleDelete(item.id)}
                                                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {news.length === 0 && (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--admin-text-muted)' }}>
                                            No news items found. Create your first item above.
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


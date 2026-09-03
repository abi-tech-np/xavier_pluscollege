import { getApiUrl, clearApiCache } from '../../services/apiClient';
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Search, ChevronDown, Plus, UploadCloud, Trash2, Edit2, Image as ImageIcon, Check, AlertCircle, X } from 'lucide-react';

const ManagePopups = () => {
    const [popups, setPopups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [perPage, setPerPage] = useState(10);
    const [feedback, setFeedback] = useState(null);
    
    // View & Edit state
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);

    // Form fields
    const [formData, setFormData] = useState({
        title: '',
        link: '',
        status: true
    });

    // Image handling matching News & Events pattern
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [existingImageUrl, setExistingImageUrl] = useState(null);

    const fileInputRef = useRef(null);
    const { id: routeId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const getAuthHeaders = () => ({
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
    });

    const showFeedback = (text, type = 'success') => {
        setFeedback({ text, type });
        setTimeout(() => setFeedback(null), 3500);
    };

    const resolveImageUrl = (url) => {
        if (!url) return null;
        if (url.startsWith('http://') || url.startsWith('https://')) return url;
        const base = import.meta.env.VITE_API_URL 
            ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '') 
            : 'http://localhost:5000';
        return `${base}${url.startsWith('/') ? '' : '/'}${url}`;
    };

    const fetchPopups = async () => {
        try {
            setLoading(true);
            const res = await axios.get(getApiUrl('/admin/popups'), getAuthHeaders());
            setPopups(res.data);
        } catch (error) {
            console.error('Failed to fetch popups', error);
            showFeedback('Failed to fetch popups', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPopups();
    }, []);

    // Clean up preview blob URL on unmount or change
    useEffect(() => {
        return () => {
            if (previewUrl && previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const loadPopupForEdit = async (id) => {
        try {
            setLoading(true);
            const res = await axios.get(getApiUrl(`/admin/popups/${id}`), getAuthHeaders());
            const data = res.data;
            if (data) {
                setFormData({
                    title: data.title || '',
                    link: data.link || '',
                    status: Boolean(data.status)
                });
                setExistingImageUrl(data.imageUrl || null);
                setImageFile(null);
                setPreviewUrl(null);
                setIsEditing(true);
                setCurrentId(id);
                setIsFormOpen(true);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            }
        } catch (error) {
            console.error('Failed to load popup for edit', error);
            const existing = popups.find(p => String(p.id) === String(id));
            if (existing) {
                setFormData({
                    title: existing.title || '',
                    link: existing.link || '',
                    status: Boolean(existing.status)
                });
                setExistingImageUrl(existing.imageUrl || null);
                setImageFile(null);
                setPreviewUrl(null);
                setIsEditing(true);
                setCurrentId(id);
                setIsFormOpen(true);
            } else {
                showFeedback('Failed to load popup details for editing', 'error');
                navigate('/admin/popups');
            }
        } finally {
            setLoading(false);
        }
    };

    // React to route changes
    useEffect(() => {
        if (routeId) {
            loadPopupForEdit(routeId);
        } else if (location.pathname.endsWith('/create')) {
            resetForm();
            setIsFormOpen(true);
        } else if (!isEditing) {
            setIsFormOpen(false);
        }
    }, [routeId, location.pathname]);

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

    const handleRemoveNewImage = () => {
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
        handleRemoveNewImage();
    };

    const resetForm = () => {
        setIsEditing(false);
        setCurrentId(null);
        setFormData({ title: '', link: '', status: true });
        setExistingImageUrl(null);
        handleRemoveNewImage();
    };

    const handleCancel = () => {
        resetForm();
        setIsFormOpen(false);
        navigate('/admin/popups');
    };

    const handleEdit = (popup) => {
        navigate(`/admin/popups/${popup.id}/edit`);
        loadPopupForEdit(popup.id);
    };

    const handleOpenCreate = () => {
        resetForm();
        setIsFormOpen(true);
        navigate('/admin/popups/create');
    };

    const handleSubmit = async (e, createAnother = false) => {
        e.preventDefault();

        if (!formData.title?.trim()) {
            showFeedback('Please enter a popup title', 'error');
            return;
        }

        // When creating, image is required
        if (!isEditing && !imageFile) {
            showFeedback('Please select an image for the popup', 'error');
            return;
        }

        try {
            setSubmitting(true);
            const data = new FormData();
            data.append('title', formData.title.trim());
            data.append('link', formData.link || '');
            data.append('status', formData.status);

            if (imageFile) {
                data.append('image', imageFile);
            } else if (isEditing) {
                // If editing and no new file, preserve or clear existingImageUrl
                data.append('imageUrl', existingImageUrl || '');
            }

            const config = {
                headers: { 
                    ...getAuthHeaders().headers,
                    'Content-Type': 'multipart/form-data' 
                }
            };

            if (isEditing && currentId) {
                await axios.put(getApiUrl(`/admin/popups/${currentId}`), data, config);
                showFeedback('Popup updated successfully!');
            } else {
                await axios.post(getApiUrl('/admin/popups'), data, config);
                showFeedback('Popup created successfully!');
            }

            clearApiCache();
            fetchPopups();

            if (createAnother && !isEditing) {
                resetForm();
                setIsFormOpen(true);
            } else {
                handleCancel();
            }
        } catch (error) {
            console.error('Failed to save popup', error);
            showFeedback('Failed to save popup. Please try again.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this popup?')) {
            try {
                await axios.delete(getApiUrl(`/admin/popups/${id}`), getAuthHeaders());
                showFeedback('Popup deleted successfully');
                clearApiCache();
                if (currentId === id) {
                    handleCancel();
                }
                fetchPopups();
            } catch (error) {
                console.error('Failed to delete popup', error);
                showFeedback('Failed to delete popup', 'error');
            }
        }
    };

    const filteredPopups = popups.filter(p => 
        (p.title && p.title.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (isFormOpen) {
        const activeImageUrl = previewUrl || resolveImageUrl(existingImageUrl);

        return (
            <div style={{ padding: '0 1rem', fontFamily: "'Inter', sans-serif", paddingBottom: '3rem' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <div style={{ fontSize: '0.85rem', color: '#a1a1aa', display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <span style={{ cursor: 'pointer' }} onClick={handleCancel}>Popup</span>
                        <span>&gt;</span>
                        <span style={{ color: '#fafafa' }}>{isEditing ? 'Edit' : 'Create'}</span>
                    </div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#ffffff', margin: 0 }}>
                        {isEditing ? `Edit Popup #${currentId}` : 'Create Popup'}
                    </h1>
                </div>

                {feedback && (
                    <div style={{
                        padding: '0.75rem 1rem',
                        marginBottom: '1.5rem',
                        borderRadius: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        backgroundColor: feedback.type === 'error' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                        color: feedback.type === 'error' ? '#ef4444' : '#10b981',
                        border: `1px solid ${feedback.type === 'error' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
                        fontSize: '0.9rem'
                    }}>
                        {feedback.type === 'error' ? <AlertCircle size={16} /> : <Check size={16} />}
                        <span>{feedback.text}</span>
                    </div>
                )}

                <div style={{ 
                    backgroundColor: '#18181b', 
                    borderRadius: '0.75rem', 
                    border: '1px solid #27272a',
                    padding: '2rem',
                    marginBottom: '1.5rem'
                }}>
                    <form onSubmit={(e) => handleSubmit(e, false)} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#d4d4d8', marginBottom: '0.5rem' }}>
                                Title <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <input 
                                type="text" 
                                name="title" 
                                value={formData.title} 
                                onChange={handleChange} 
                                required 
                                placeholder="Popup title"
                                style={{
                                    width: '100%', padding: '0.625rem 0.75rem', borderRadius: '0.5rem',
                                    backgroundColor: '#18181b', border: '1px solid #27272a', color: '#fafafa', outline: 'none'
                                }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#d4d4d8', marginBottom: '0.5rem' }}>
                                Link
                            </label>
                            <input 
                                type="text" 
                                name="link" 
                                value={formData.link} 
                                onChange={handleChange} 
                                placeholder="https://... (optional)"
                                style={{
                                    width: '100%', padding: '0.625rem 0.75rem', borderRadius: '0.5rem',
                                    backgroundColor: '#18181b', border: '1px solid #27272a', color: '#fafafa', outline: 'none'
                                }}
                            />
                        </div>
                        
                        {/* Image Preview & Upload (News & Events Pattern) */}
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#d4d4d8', marginBottom: '0.5rem' }}>
                                Image {!isEditing && <span style={{ color: '#ef4444' }}>*</span>}
                            </label>

                            {activeImageUrl && (
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    padding: '1rem',
                                    backgroundColor: '#27272a',
                                    borderRadius: '0.5rem',
                                    border: '1px solid #3f3f46',
                                    marginBottom: '0.75rem'
                                }}>
                                    <div style={{
                                        width: '100px',
                                        height: '70px',
                                        borderRadius: '0.375rem',
                                        overflow: 'hidden',
                                        backgroundColor: '#000',
                                        border: '1px solid #3f3f46',
                                        flexShrink: 0
                                    }}>
                                        <img 
                                            src={activeImageUrl} 
                                            alt="Preview" 
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 500, color: '#fafafa' }}>
                                            {imageFile ? imageFile.name : (existingImageUrl ? 'Current Saved Image' : 'Selected Image')}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: '#a1a1aa', marginTop: '0.2rem' }}>
                                            {imageFile ? `${(imageFile.size / 1024).toFixed(1)} KB` : 'Uploaded'}
                                        </div>
                                        <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                            <label 
                                                htmlFor="popup-image-input" 
                                                style={{ 
                                                    cursor: 'pointer', 
                                                    fontSize: '0.8rem', 
                                                    color: '#fbbf24',
                                                    fontWeight: 500,
                                                    marginBottom: 0
                                                }}
                                            >
                                                Replace Image
                                            </label>
                                            <button
                                                type="button"
                                                onClick={previewUrl ? handleRemoveNewImage : handleClearExistingImage}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    color: '#ef4444',
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
                            )}

                            <div style={{
                                border: '1px dashed #3f3f46',
                                borderRadius: '0.5rem',
                                padding: '1.75rem',
                                textAlign: 'center',
                                backgroundColor: '#18181b',
                                color: '#a1a1aa',
                                cursor: 'pointer',
                                position: 'relative'
                            }}>
                                <input 
                                    id="popup-image-input"
                                    ref={fileInputRef}
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleFileChange} 
                                    required={!isEditing && !activeImageUrl}
                                    style={{
                                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer'
                                    }} 
                                />
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', pointerEvents: 'none' }}>
                                    <UploadCloud size={28} color="#fbbf24" />
                                    <span>Drag & Drop your image or <span style={{ fontWeight: '600', color: '#fafafa' }}>Browse</span></span>
                                    <span style={{ fontSize: '0.75rem', color: '#71717a' }}>Supports JPG, PNG, WEBP</span>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
                            <label style={{
                                position: 'relative',
                                display: 'inline-block',
                                width: '44px',
                                height: '24px'
                            }}>
                                <input 
                                    type="checkbox" 
                                    name="status"
                                    checked={formData.status} 
                                    onChange={handleChange}
                                    style={{ opacity: 0, width: 0, height: 0 }} 
                                />
                                <span style={{
                                    position: 'absolute',
                                    cursor: 'pointer',
                                    top: 0, left: 0, right: 0, bottom: 0,
                                    backgroundColor: formData.status ? '#fbbf24' : '#3f3f46',
                                    transition: '.4s',
                                    borderRadius: '34px'
                                }}>
                                    <span style={{
                                        position: 'absolute',
                                        content: '""',
                                        height: '18px',
                                        width: '18px',
                                        left: formData.status ? '22px' : '3px',
                                        bottom: '3px',
                                        backgroundColor: 'white',
                                        transition: '.4s',
                                        borderRadius: '50%'
                                    }}></span>
                                </span>
                            </label>
                            <span style={{ fontSize: '0.9rem', color: '#fafafa', fontWeight: '500' }}>Active Status</span>
                        </div>

                    </form>
                </div>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <button 
                        onClick={(e) => handleSubmit(e, false)} 
                        disabled={submitting}
                        style={{ 
                            backgroundColor: '#fbbf24', 
                            color: '#000', 
                            border: 'none', 
                            padding: '0.6rem 1.25rem', 
                            borderRadius: '0.375rem', 
                            fontWeight: '600', 
                            cursor: 'pointer',
                            opacity: submitting ? 0.7 : 1
                        }}
                    >
                        {submitting ? 'Saving...' : (isEditing ? 'Update Popup' : 'Create')}
                    </button>
                    
                    {!isEditing && (
                        <button 
                            onClick={(e) => handleSubmit(e, true)} 
                            disabled={submitting}
                            style={{ 
                                backgroundColor: '#27272a', 
                                color: '#fafafa', 
                                border: '1px solid #3f3f46', 
                                padding: '0.6rem 1.25rem', 
                                borderRadius: '0.375rem', 
                                fontWeight: '500', 
                                cursor: 'pointer',
                                opacity: submitting ? 0.7 : 1
                            }}
                        >
                            Create & create another
                        </button>
                    )}
                    
                    <button 
                        onClick={handleCancel} 
                        style={{ 
                            backgroundColor: '#18181b', 
                            color: '#fafafa', 
                            border: '1px solid #3f3f46', 
                            padding: '0.6rem 1.25rem', 
                            borderRadius: '0.375rem', 
                            fontWeight: '500', 
                            cursor: 'pointer' 
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ position: 'relative' }}>
            {/* Header Breadcrumbs & Title */}
            <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.85rem', color: '#a1a1aa', display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span>Popups</span>
                    <span>&gt;</span>
                    <span style={{ color: '#fbbf24' }}>List</span>
                </div>
                <div className="admin-header-actions" style={{ marginBottom: 0 }}>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#ffffff', margin: 0 }}>Popups</h1>
                    <button 
                        onClick={handleOpenCreate}
                        style={{ 
                            backgroundColor: '#fbbf24', 
                            color: '#000000', 
                            fontWeight: '600', 
                            padding: '0.6rem 1.25rem', 
                            borderRadius: '0.375rem', 
                            border: 'none', 
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem'
                        }}>
                        <Plus size={16} /> New popup
                    </button>
                </div>
            </div>

            {feedback && (
                <div style={{
                    padding: '0.75rem 1rem',
                    marginBottom: '1rem',
                    borderRadius: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    backgroundColor: feedback.type === 'error' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                    color: feedback.type === 'error' ? '#ef4444' : '#10b981',
                    border: `1px solid ${feedback.type === 'error' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
                    fontSize: '0.9rem'
                }}>
                    {feedback.type === 'error' ? <AlertCircle size={16} /> : <Check size={16} />}
                    <span>{feedback.text}</span>
                </div>
            )}

            {/* Main Card Container */}
            <div style={{ 
                backgroundColor: '#18181b', 
                borderRadius: '0.75rem', 
                border: '1px solid #27272a',
                overflow: 'hidden' 
            }}>
                
                {/* Toolbar */}
                <div style={{ 
                    padding: '1rem 1.5rem', 
                    display: 'flex', 
                    justifyContent: 'flex-end',
                    borderBottom: '1px solid #27272a'
                }}>
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        backgroundColor: '#27272a', 
                        borderRadius: '0.375rem',
                        padding: '0.4rem 0.75rem',
                        border: '1px solid #3f3f46'
                    }}>
                        <Search size={16} color="#71717a" style={{ marginRight: '0.5rem' }} />
                        <input 
                            type="text" 
                            placeholder="Search popups..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ 
                                backgroundColor: 'transparent', 
                                border: 'none', 
                                color: '#e4e4e7', 
                                outline: 'none',
                                fontSize: '0.9rem',
                                width: '200px'
                            }} 
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr style={{ backgroundColor: '#18181b', borderBottom: '1px solid #27272a' }}>
                                <th style={{ padding: '1rem 1.5rem', width: '40px' }}>
                                    <input type="checkbox" style={{ accentColor: '#fbbf24', cursor: 'pointer', backgroundColor: '#27272a', border: '1px solid #3f3f46' }} />
                                </th>
                                <th style={{ padding: '1rem 1.5rem', width: '90px', color: '#fafafa', fontWeight: '600' }}>
                                    Image
                                </th>
                                <th style={{ padding: '1rem 1.5rem', color: '#fafafa', fontWeight: '600' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                        Title <ChevronDown size={14} color="#71717a" />
                                    </div>
                                </th>
                                <th style={{ padding: '1rem 1.5rem', color: '#fafafa', fontWeight: '600' }}>
                                    Link
                                </th>
                                <th style={{ padding: '1rem 1.5rem', color: '#fafafa', fontWeight: '600' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                        Status <ChevronDown size={14} color="#71717a" />
                                    </div>
                                </th>
                                <th style={{ padding: '1rem 1.5rem', color: '#fafafa', fontWeight: '600' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                        Created at <ChevronDown size={14} color="#71717a" />
                                    </div>
                                </th>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'right', color: '#fafafa', fontWeight: '600' }}>
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="7" style={{ padding: '2rem', textAlign: 'center', color: '#a1a1aa' }}>Loading popups...</td>
                                </tr>
                            ) : filteredPopups.length === 0 ? (
                                <tr>
                                    <td colSpan="7" style={{ padding: '2rem', textAlign: 'center', color: '#a1a1aa' }}>No popups found.</td>
                                </tr>
                            ) : (
                                filteredPopups.slice(0, perPage).map(popup => {
                                    const thumb = resolveImageUrl(popup.imageUrl);
                                    return (
                                        <tr key={popup.id} style={{ borderBottom: '1px solid #27272a' }}>
                                            <td data-label="Select" style={{ padding: '1rem 1.5rem' }}>
                                                <input type="checkbox" style={{ accentColor: '#fbbf24', cursor: 'pointer' }} />
                                            </td>
                                            <td data-label="Image" style={{ padding: '0.75rem 1.5rem', verticalAlign: 'middle' }}>
                                                {thumb ? (
                                                    <div style={{
                                                        width: '60px',
                                                        height: '42px',
                                                        borderRadius: '4px',
                                                        overflow: 'hidden',
                                                        backgroundColor: '#000',
                                                        border: '1px solid #3f3f46'
                                                    }}>
                                                        <img 
                                                            src={thumb} 
                                                            alt={popup.title || 'Popup'} 
                                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div style={{
                                                        width: '60px',
                                                        height: '42px',
                                                        borderRadius: '4px',
                                                        backgroundColor: '#27272a',
                                                        border: '1px dashed #3f3f46',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: '#71717a'
                                                    }}>
                                                        <ImageIcon size={18} />
                                                    </div>
                                                )}
                                            </td>
                                            <td data-label="Title" style={{ padding: '1rem 1.5rem', color: '#d4d4d8', fontWeight: '500' }}>
                                                {popup.title}
                                            </td>
                                            <td data-label="Link" style={{ padding: '1rem 1.5rem', color: '#a1a1aa', fontSize: '0.85rem' }}>
                                                {popup.link ? (
                                                    <a href={popup.link} target="_blank" rel="noreferrer" style={{ color: '#fbbf24', textDecoration: 'none' }}>
                                                        {popup.link.length > 30 ? popup.link.slice(0, 30) + '...' : popup.link}
                                                    </a>
                                                ) : '—'}
                                            </td>
                                            <td data-label="Status" style={{ padding: '1rem 1.5rem' }}>
                                                {popup.status ? (
                                                    <span style={{ color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '0.25rem 0.5rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: '600' }}>Active</span>
                                                ) : (
                                                    <span style={{ color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '0.25rem 0.5rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: '600' }}>Inactive</span>
                                                )}
                                            </td>
                                            <td data-label="Created at" style={{ padding: '1rem 1.5rem', color: '#d4d4d8', fontSize: '0.85rem' }}>
                                                {popup.created_at ? new Date(popup.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                                            </td>
                                            <td className="admin-table-actions" data-label="Actions" style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.75rem' }}>
                                                    <button 
                                                        onClick={() => handleEdit(popup)}
                                                        className="admin-btn admin-btn-primary"
                                                        style={{ 
                                                            display: 'flex', 
                                                            alignItems: 'center', 
                                                            gap: '0.3rem', 
                                                            backgroundColor: 'rgba(251, 191, 36, 0.1)', 
                                                            border: '1px solid rgba(251, 191, 36, 0.3)', 
                                                            color: '#fbbf24', 
                                                            fontWeight: '600', 
                                                            cursor: 'pointer', 
                                                            fontSize: '0.85rem',
                                                            padding: '0.35rem 0.65rem',
                                                            borderRadius: '0.375rem'
                                                        }}>
                                                        <Edit2 size={14} /> Edit
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(popup.id)}
                                                        className="admin-btn admin-btn-danger"
                                                        style={{ 
                                                            display: 'flex', 
                                                            alignItems: 'center', 
                                                            gap: '0.3rem', 
                                                            backgroundColor: 'rgba(239, 68, 68, 0.1)', 
                                                            border: '1px solid rgba(239, 68, 68, 0.3)', 
                                                            color: '#ef4444', 
                                                            fontWeight: '600', 
                                                            cursor: 'pointer', 
                                                            fontSize: '0.85rem',
                                                            padding: '0.35rem 0.65rem',
                                                            borderRadius: '0.375rem'
                                                        }}>
                                                        <Trash2 size={14} /> Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer Pagination */}
                <div style={{ 
                    padding: '1rem 1.5rem', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    borderTop: '1px solid #27272a',
                    backgroundColor: '#18181b'
                }}>
                    <div style={{ color: '#a1a1aa', fontSize: '0.85rem' }}>
                        Showing 1 to {Math.min(filteredPopups.length, perPage)} of {filteredPopups.length} results
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#a1a1aa', fontSize: '0.85rem' }}>
                        <span>Per page</span>
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            backgroundColor: '#27272a', 
                            border: '1px solid #3f3f46',
                            borderRadius: '0.375rem',
                            padding: '0.3rem 0.6rem',
                            color: '#fafafa',
                            cursor: 'pointer'
                        }}>
                            {perPage} <ChevronDown size={14} style={{ marginLeft: '0.5rem' }} />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ManagePopups;

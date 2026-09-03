import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { 
    Trash2, 
    Plus, 
    ChevronUp, 
    UploadCloud, 
    Edit, 
    X, 
    Image as ImageIcon, 
    Check, 
    AlertCircle, 
    ArrowLeft,
    Layers
} from 'lucide-react';
import { getApiUrl } from '../../services/apiClient';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const ManageLifeAtXavier = () => {
    const { id: routeId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    
    // View state
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [feedback, setFeedback] = useState({ message: '', type: '' });

    // Main form fields
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        status: 'Publish', // 'Publish' or 'Draft'
        meta_title: '',
        meta_description: '',
        meta_schema: ''
    });

    // Thumbnail state
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const [existingThumbnailUrl, setExistingThumbnailUrl] = useState(null);

    // OG Image state
    const [ogImageFile, setOgImageFile] = useState(null);
    const [ogImagePreview, setOgImagePreview] = useState(null);
    const [existingOgImageUrl, setExistingOgImageUrl] = useState(null);

    // Gallery state
    const [existingGalleryImages, setExistingGalleryImages] = useState([]);
    const [deletedGalleryImageIds, setDeletedGalleryImageIds] = useState([]);
    const [newGalleryFiles, setNewGalleryFiles] = useState([]); // [{ file, previewUrl, id }]
    const [isDraggingGallery, setIsDraggingGallery] = useState(false);

    const thumbnailInputRef = useRef(null);
    const ogImageInputRef = useRef(null);
    const galleryInputRef = useRef(null);

    const getAuthHeaders = () => ({
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
    });

    const showNotification = (message, type = 'success') => {
        setFeedback({ message, type });
        setTimeout(() => setFeedback({ message: '', type: '' }), 5000);
    };

    const fetchItems = async () => {
        try {
            setLoading(true);
            const res = await axios.get(getApiUrl('/admin/life-at-xaviers'), getAuthHeaders());
            setItems(res.data);
        } catch (error) {
            console.error('Failed to fetch life at xavier list', error);
            showNotification('Failed to fetch entries.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            slug: '',
            status: 'Publish',
            meta_title: '',
            meta_description: '',
            meta_schema: ''
        });
        setThumbnailFile(null);
        if (thumbnailPreview?.startsWith('blob:')) URL.revokeObjectURL(thumbnailPreview);
        setThumbnailPreview(null);
        setExistingThumbnailUrl(null);

        setOgImageFile(null);
        if (ogImagePreview?.startsWith('blob:')) URL.revokeObjectURL(ogImagePreview);
        setOgImagePreview(null);
        setExistingOgImageUrl(null);

        // Clean up new gallery previews
        newGalleryFiles.forEach(item => {
            if (item.previewUrl?.startsWith('blob:')) URL.revokeObjectURL(item.previewUrl);
        });
        setNewGalleryFiles([]);
        setExistingGalleryImages([]);
        setDeletedGalleryImageIds([]);

        setIsEditing(false);
        setCurrentId(null);
        setIsFormOpen(false);

        if (thumbnailInputRef.current) thumbnailInputRef.current.value = '';
        if (ogImageInputRef.current) ogImageInputRef.current.value = '';
        if (galleryInputRef.current) galleryInputRef.current.value = '';
    };

    const loadItemForEdit = async (itemId) => {
        try {
            setLoading(true);
            const res = await axios.get(getApiUrl(`/admin/life-at-xaviers/${itemId}`), getAuthHeaders());
            const data = res.data;

            setFormData({
                title: data.title || '',
                slug: data.slug || '',
                status: data.status ? 'Publish' : 'Draft',
                meta_title: data.meta_title || '',
                meta_description: data.meta_description || '',
                meta_schema: data.meta_schema || ''
            });

            setExistingThumbnailUrl(data.thumbnailUrl || null);
            setExistingOgImageUrl(data.ogImageUrl || null);
            setExistingGalleryImages(data.galleryImages || []);
            setDeletedGalleryImageIds([]);
            setNewGalleryFiles([]);
            setThumbnailFile(null);
            setOgImageFile(null);

            setIsEditing(true);
            setCurrentId(itemId);
            setIsFormOpen(true);
        } catch (error) {
            console.error('Failed to load item for edit', error);
            showNotification('Failed to load entry details.', 'error');
            navigate('/admin/life-at-xaviers');
        } finally {
            setLoading(false);
        }
    };

    // Route-based opening
    useEffect(() => {
        fetchItems();
    }, []);

    useEffect(() => {
        if (routeId) {
            loadItemForEdit(routeId);
        } else if (location.pathname.endsWith('/create')) {
            resetForm();
            setIsFormOpen(true);
            setIsEditing(false);
        } else {
            setIsFormOpen(false);
            setIsEditing(false);
        }
    }, [routeId, location.pathname]);

    // Clean up previews on unmount
    useEffect(() => {
        return () => {
            if (thumbnailPreview?.startsWith('blob:')) URL.revokeObjectURL(thumbnailPreview);
            if (ogImagePreview?.startsWith('blob:')) URL.revokeObjectURL(ogImagePreview);
            newGalleryFiles.forEach(item => {
                if (item.previewUrl?.startsWith('blob:')) URL.revokeObjectURL(item.previewUrl);
            });
        };
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const updated = { ...prev, [name]: value };
            if (name === 'title' && !prev.slug_modified && !isEditing) {
                updated.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            }
            if (name === 'slug') updated.slug_modified = true;
            return updated;
        });
    };

    const validateFile = (file) => {
        if (!ALLOWED_TYPES.includes(file.type)) {
            return `"${file.name}" is not supported. Only JPEG, PNG, and WebP are allowed.`;
        }
        if (file.size > MAX_FILE_SIZE) {
            return `"${file.name}" is ${(file.size / (1024 * 1024)).toFixed(1)}MB. Max allowed size is 5MB.`;
        }
        return null;
    };

    const handleThumbnailChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const error = validateFile(file);
        if (error) {
            showNotification(error, 'error');
            if (thumbnailInputRef.current) thumbnailInputRef.current.value = '';
            return;
        }

        if (thumbnailPreview?.startsWith('blob:')) URL.revokeObjectURL(thumbnailPreview);
        setThumbnailFile(file);
        setThumbnailPreview(URL.createObjectURL(file));
    };

    const handleRemoveThumbnail = () => {
        setThumbnailFile(null);
        if (thumbnailPreview?.startsWith('blob:')) URL.revokeObjectURL(thumbnailPreview);
        setThumbnailPreview(null);
        if (thumbnailInputRef.current) thumbnailInputRef.current.value = '';
    };

    const handleOgImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const error = validateFile(file);
        if (error) {
            showNotification(error, 'error');
            if (ogImageInputRef.current) ogImageInputRef.current.value = '';
            return;
        }

        if (ogImagePreview?.startsWith('blob:')) URL.revokeObjectURL(ogImagePreview);
        setOgImageFile(file);
        setOgImagePreview(URL.createObjectURL(file));
    };

    const handleRemoveOgImage = () => {
        setOgImageFile(null);
        if (ogImagePreview?.startsWith('blob:')) URL.revokeObjectURL(ogImagePreview);
        setOgImagePreview(null);
        if (ogImageInputRef.current) ogImageInputRef.current.value = '';
    };

    // Gallery handling
    const processGalleryFiles = (filesList) => {
        const incomingFiles = Array.from(filesList);
        const validNewFiles = [];
        let errorMessages = [];

        incomingFiles.forEach(file => {
            const err = validateFile(file);
            if (err) {
                errorMessages.push(err);
            } else {
                validNewFiles.push({
                    file,
                    previewUrl: URL.createObjectURL(file),
                    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
                });
            }
        });

        if (errorMessages.length > 0) {
            showNotification(errorMessages[0], 'error');
        }

        if (validNewFiles.length > 0) {
            setNewGalleryFiles(prev => [...prev, ...validNewFiles]);
        }
    };

    const handleGalleryInputChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            processGalleryFiles(e.target.files);
        }
        if (galleryInputRef.current) galleryInputRef.current.value = '';
    };

    const handleGalleryDrop = (e) => {
        e.preventDefault();
        setIsDraggingGallery(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            processGalleryFiles(e.dataTransfer.files);
        }
    };

    const handleRemoveNewGalleryImage = (idToRemove) => {
        setNewGalleryFiles(prev => {
            const target = prev.find(item => item.id === idToRemove);
            if (target?.previewUrl?.startsWith('blob:')) {
                URL.revokeObjectURL(target.previewUrl);
            }
            return prev.filter(item => item.id !== idToRemove);
        });
    };

    const handleRemoveExistingGalleryImage = (idToRemove) => {
        setExistingGalleryImages(prev => prev.filter(img => img.id !== idToRemove));
        setDeletedGalleryImageIds(prev => [...prev, idToRemove]);
    };

    const handleStartCreate = () => {
        resetForm();
        navigate('/admin/life-at-xaviers/create');
    };

    const handleStartEdit = (itemId) => {
        navigate(`/admin/life-at-xaviers/${itemId}/edit`);
    };

    const handleCancelForm = () => {
        resetForm();
        navigate('/admin/life-at-xaviers');
    };

    const handleSubmit = async (e, shouldCreateAnother = false) => {
        e.preventDefault();
        if (!formData.title.trim()) {
            showNotification('Event title is required.', 'error');
            return;
        }

        try {
            setSubmitting(true);
            const submitData = new FormData();
            submitData.append('title', formData.title);
            submitData.append('slug', formData.slug);
            submitData.append('status', formData.status === 'Publish' ? 'true' : 'false');
            
            if (formData.meta_title) submitData.append('meta_title', formData.meta_title);
            if (formData.meta_description) submitData.append('meta_description', formData.meta_description);
            if (formData.meta_schema) submitData.append('meta_schema', formData.meta_schema);

            if (thumbnailFile) {
                submitData.append('thumbnail', thumbnailFile);
            }

            if (ogImageFile) {
                submitData.append('og_image', ogImageFile);
            }

            // Append multiple gallery images
            if (newGalleryFiles.length > 0) {
                newGalleryFiles.forEach(item => {
                    submitData.append('galleryImages', item.file);
                });
            }

            const config = {
                headers: { 
                    ...getAuthHeaders().headers, 
                    'Content-Type': 'multipart/form-data' 
                }
            };

            if (isEditing && currentId) {
                if (deletedGalleryImageIds.length > 0) {
                    submitData.append('deletedGalleryImageIds', JSON.stringify(deletedGalleryImageIds));
                }

                await axios.put(getApiUrl(`/admin/life-at-xaviers/${currentId}`), submitData, config);
                showNotification('Life At Xavier entry updated successfully!');
                fetchItems();
                navigate('/admin/life-at-xaviers');
            } else {
                await axios.post(getApiUrl('/admin/life-at-xaviers'), submitData, config);
                showNotification('Life At Xavier entry created successfully!');
                fetchItems();

                if (shouldCreateAnother) {
                    resetForm();
                    setIsFormOpen(true);
                } else {
                    navigate('/admin/life-at-xaviers');
                }
            }
        } catch (error) {
            console.error('Failed to save Life At Xavier:', error);
            const serverMsg = error.response?.data?.error || 'Failed to save entry. Please try again.';
            showNotification(serverMsg, 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this Life At Xavier entry? Associated gallery image files will also be permanently deleted.')) {
            try {
                await axios.delete(getApiUrl(`/admin/life-at-xaviers/${id}`), getAuthHeaders());
                showNotification('Entry deleted successfully.');
                fetchItems();
            } catch (error) {
                console.error('Failed to delete', error);
                showNotification('Failed to delete the entry.', 'error');
            }
        }
    };

    // Render Form View (Create or Edit)
    if (isFormOpen) {
        return (
            <div style={{ padding: '0 1rem', fontFamily: "'Inter', sans-serif" }}>
                {/* Feedback Toast */}
                {feedback.message && (
                    <div style={{
                        position: 'fixed',
                        top: '20px',
                        right: '20px',
                        backgroundColor: feedback.type === 'error' ? '#ef4444' : '#10b981',
                        color: '#fff',
                        padding: '0.75rem 1.25rem',
                        borderRadius: '0.5rem',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.4)',
                        zIndex: 9999,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontWeight: '500',
                        fontSize: '0.875rem'
                    }}>
                        {feedback.type === 'error' ? <AlertCircle size={18} /> : <Check size={18} />}
                        {feedback.message}
                    </div>
                )}

                {/* Header */}
                <div style={{ marginBottom: '2rem' }}>
                    <div style={{ fontSize: '0.85rem', color: '#a1a1aa', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <button 
                            type="button" 
                            onClick={handleCancelForm}
                            style={{ background: 'none', border: 'none', color: '#a1a1aa', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', padding: 0 }}
                        >
                            <ArrowLeft size={14} /> Life At Xaviers
                        </button>
                        <span>&gt;</span>
                        <span style={{ color: '#fafafa' }}>{isEditing ? 'Edit' : 'Create'}</span>
                    </div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#ffffff', margin: 0 }}>
                        {isEditing ? 'Edit Life At Xavier' : 'Create Life At Xavier'}
                    </h1>
                </div>

                {/* Grid Layout */}
                <form onSubmit={(e) => handleSubmit(e, false)} style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '1.5rem', alignItems: 'start' }}>
                    
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
                                    placeholder="e.g. RTX: Rising Talent of Xavier"
                                    style={{
                                        width: '100%', padding: '0.625rem 0.75rem', borderRadius: '0.5rem',
                                        backgroundColor: '#27272a', border: '1px solid #3f3f46', color: '#fafafa', outline: 'none',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#d4d4d8', marginBottom: '0.5rem' }}>
                                    Slug <span style={{ color: '#ef4444' }}>*</span>
                                </label>
                                <input 
                                    type="text" 
                                    name="slug" 
                                    value={formData.slug} 
                                    onChange={handleChange} 
                                    required 
                                    placeholder="e.g. rtx"
                                    style={{
                                        width: '100%', padding: '0.625rem 0.75rem', borderRadius: '0.5rem',
                                        backgroundColor: '#27272a', border: '1px solid #3f3f46', color: '#fafafa', outline: 'none',
                                        boxSizing: 'border-box'
                                    }}
                                />
                                <span style={{ fontSize: '0.75rem', color: '#71717a', marginTop: '0.25rem', display: 'block' }}>
                                    Public URL: /life-at-xavier/{formData.slug || 'slug'}
                                </span>
                            </div>

                            {/* Thumbnail Image Section */}
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#d4d4d8', marginBottom: '0.5rem' }}>
                                    Thumbnail Image <span style={{ color: '#ef4444' }}>*</span>
                                </label>

                                {thumbnailPreview || existingThumbnailUrl ? (
                                    <div style={{
                                        border: '1px solid #3f3f46',
                                        borderRadius: '0.5rem',
                                        padding: '1rem',
                                        backgroundColor: '#27272a',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1rem'
                                    }}>
                                        <img 
                                            src={thumbnailPreview || existingThumbnailUrl} 
                                            alt="Thumbnail preview" 
                                            style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '0.375rem', border: '1px solid #3f3f46' }}
                                        />
                                        <div style={{ flex: 1, overflow: 'hidden' }}>
                                            <p style={{ color: '#fbbf24', fontSize: '0.875rem', margin: 0, fontWeight: '500', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                                {thumbnailFile ? thumbnailFile.name : 'Current Thumbnail Image'}
                                            </p>
                                            {thumbnailFile && (
                                                <span style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>
                                                    {(thumbnailFile.size / (1024 * 1024)).toFixed(2)} MB
                                                </span>
                                            )}
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <label style={{
                                                backgroundColor: '#3f3f46', color: '#fafafa', fontSize: '0.75rem', padding: '0.4rem 0.75rem',
                                                borderRadius: '0.375rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem'
                                            }}>
                                                Change
                                                <input 
                                                    type="file" 
                                                    ref={thumbnailInputRef}
                                                    onChange={handleThumbnailChange}
                                                    accept="image/jpeg,image/png,image/webp"
                                                    style={{ display: 'none' }}
                                                />
                                            </label>
                                            {thumbnailFile && (
                                                <button
                                                    type="button"
                                                    onClick={handleRemoveThumbnail}
                                                    style={{
                                                        backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: 'none',
                                                        padding: '0.4rem', borderRadius: '0.375rem', cursor: 'pointer'
                                                    }}
                                                    title="Revert to original / remove"
                                                >
                                                    <X size={14} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{
                                        border: '1px dashed #3f3f46', borderRadius: '0.5rem', padding: '2rem', textAlign: 'center', backgroundColor: '#27272a', position: 'relative'
                                    }}>
                                        <input 
                                            type="file" 
                                            ref={thumbnailInputRef}
                                            onChange={handleThumbnailChange}
                                            accept="image/jpeg,image/png,image/webp"
                                            style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                                        />
                                        <UploadCloud size={32} color="#a1a1aa" style={{ margin: '0 auto 0.5rem' }} />
                                        <p style={{ color: '#a1a1aa', fontSize: '0.875rem', margin: 0 }}>
                                            Drag & Drop your thumbnail image or <span style={{ color: '#fbbf24', textDecoration: 'underline' }}>Browse</span>
                                        </p>
                                        <span style={{ fontSize: '0.75rem', color: '#71717a', display: 'block', marginTop: '0.25rem' }}>
                                            PNG, JPG, or WebP up to 5MB
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Gallery Images Section */}
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                    <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#d4d4d8', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Layers size={16} color="#fbbf24" /> Gallery Images
                                    </label>
                                    <span style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>
                                        {existingGalleryImages.length + newGalleryFiles.length} images total
                                    </span>
                                </div>

                                {/* Drag and drop / browse multi-upload box */}
                                <div 
                                    onDragOver={(e) => { e.preventDefault(); setIsDraggingGallery(true); }}
                                    onDragLeave={() => setIsDraggingGallery(false)}
                                    onDrop={handleGalleryDrop}
                                    style={{
                                        border: isDraggingGallery ? '2px dashed #fbbf24' : '1px dashed #3f3f46',
                                        borderRadius: '0.5rem',
                                        padding: '1.75rem',
                                        textAlign: 'center',
                                        backgroundColor: isDraggingGallery ? 'rgba(251, 191, 36, 0.05)' : '#27272a',
                                        position: 'relative',
                                        transition: 'all 0.2s ease',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <input 
                                        type="file" 
                                        ref={galleryInputRef}
                                        onChange={handleGalleryInputChange}
                                        accept="image/jpeg,image/png,image/webp"
                                        multiple
                                        style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                                    />
                                    <UploadCloud size={30} color={isDraggingGallery ? '#fbbf24' : '#a1a1aa'} style={{ margin: '0 auto 0.5rem' }} />
                                    <p style={{ color: '#a1a1aa', fontSize: '0.875rem', margin: 0 }}>
                                        Drag & drop multiple gallery images or <span style={{ color: '#fbbf24', textDecoration: 'underline' }}>Browse</span>
                                    </p>
                                    <span style={{ fontSize: '0.75rem', color: '#71717a', display: 'block', marginTop: '0.25rem' }}>
                                        Multi-select allowed (JPEG, PNG, WebP up to 5MB each)
                                    </span>
                                </div>

                                {/* Previews for Existing Gallery Images (In Edit Mode) */}
                                {existingGalleryImages.length > 0 && (
                                    <div style={{ marginTop: '1.25rem' }}>
                                        <span style={{ fontSize: '0.8rem', color: '#a1a1aa', fontWeight: '500', display: 'block', marginBottom: '0.5rem' }}>
                                            Existing Gallery Images:
                                        </span>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '0.75rem' }}>
                                            {existingGalleryImages.map((img, idx) => (
                                                <div 
                                                    key={img.id || idx} 
                                                    style={{
                                                        position: 'relative',
                                                        borderRadius: '0.375rem',
                                                        overflow: 'hidden',
                                                        border: '1px solid #3f3f46',
                                                        backgroundColor: '#18181b',
                                                        aspectRatio: '4/3'
                                                    }}
                                                >
                                                    <img 
                                                        src={img.imageUrl} 
                                                        alt={`Gallery ${idx + 1}`} 
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveExistingGalleryImage(img.id)}
                                                        title="Delete image from gallery"
                                                        style={{
                                                            position: 'absolute',
                                                            top: '4px',
                                                            right: '4px',
                                                            backgroundColor: 'rgba(239, 68, 68, 0.9)',
                                                            color: '#ffffff',
                                                            border: 'none',
                                                            borderRadius: '50%',
                                                            width: '22px',
                                                            height: '22px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            cursor: 'pointer',
                                                            boxShadow: '0 2px 4px rgba(0,0,0,0.5)'
                                                        }}
                                                    >
                                                        <X size={13} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Previews for Newly Selected Gallery Images */}
                                {newGalleryFiles.length > 0 && (
                                    <div style={{ marginTop: '1.25rem' }}>
                                        <span style={{ fontSize: '0.8rem', color: '#fbbf24', fontWeight: '500', display: 'block', marginBottom: '0.5rem' }}>
                                            New Images Ready to Upload ({newGalleryFiles.length}):
                                        </span>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '0.75rem' }}>
                                            {newGalleryFiles.map((item) => (
                                                <div 
                                                    key={item.id} 
                                                    style={{
                                                        position: 'relative',
                                                        borderRadius: '0.375rem',
                                                        overflow: 'hidden',
                                                        border: '1px solid #fbbf24',
                                                        backgroundColor: '#18181b',
                                                        aspectRatio: '4/3'
                                                    }}
                                                >
                                                    <img 
                                                        src={item.previewUrl} 
                                                        alt="New gallery preview" 
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveNewGalleryImage(item.id)}
                                                        title="Remove before submit"
                                                        style={{
                                                            position: 'absolute',
                                                            top: '4px',
                                                            right: '4px',
                                                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                                            color: '#ffffff',
                                                            border: 'none',
                                                            borderRadius: '50%',
                                                            width: '22px',
                                                            height: '22px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        <X size={13} />
                                                    </button>
                                                    <div style={{
                                                        position: 'absolute',
                                                        bottom: 0,
                                                        left: 0,
                                                        right: 0,
                                                        backgroundColor: 'rgba(0,0,0,0.7)',
                                                        fontSize: '0.65rem',
                                                        color: '#e4e4e7',
                                                        padding: '2px 4px',
                                                        textAlign: 'center',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap'
                                                    }}>
                                                        {(item.file.size / (1024 * 1024)).toFixed(1)}MB
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
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
                                        boxSizing: 'border-box'
                                    }}
                                >
                                    <option value="Publish">Publish (Active)</option>
                                    <option value="Draft">Draft (Inactive)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Right Column (Meta) */}
                    <div style={{ backgroundColor: '#18181b', borderRadius: '0.75rem', border: '1px solid #27272a', padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#fafafa', margin: 0 }}>SEO & Meta</h3>
                            <ChevronUp size={16} color="#71717a" />
                        </div>
                        
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#d4d4d8', marginBottom: '0.5rem' }}>
                                Meta title
                            </label>
                            <input 
                                type="text" 
                                name="meta_title" 
                                value={formData.meta_title} 
                                onChange={handleChange} 
                                placeholder="SEO Title"
                                style={{ 
                                    width: '100%', padding: '0.625rem 0.75rem', borderRadius: '0.5rem', 
                                    backgroundColor: '#27272a', border: '1px solid #3f3f46', color: '#fafafa', outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#d4d4d8', marginBottom: '0.5rem' }}>
                                Meta Description
                            </label>
                            <textarea 
                                name="meta_description" 
                                value={formData.meta_description} 
                                onChange={handleChange} 
                                rows="3"
                                placeholder="Short description for search engines"
                                style={{ 
                                    width: '100%', padding: '0.625rem 0.75rem', borderRadius: '0.5rem', 
                                    backgroundColor: '#27272a', border: '1px solid #3f3f46', color: '#fafafa', outline: 'none', 
                                    resize: 'vertical', boxSizing: 'border-box'
                                }}
                            ></textarea>
                        </div>

                        {/* OG Tag Image */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#d4d4d8' }}>OG Tag image</label>
                                <span style={{ fontSize: '0.75rem', color: '#71717a' }}>Optional</span>
                            </div>

                            {ogImagePreview || existingOgImageUrl ? (
                                <div style={{
                                    border: '1px solid #3f3f46',
                                    borderRadius: '0.5rem',
                                    padding: '0.75rem',
                                    backgroundColor: '#27272a',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem'
                                }}>
                                    <img 
                                        src={ogImagePreview || existingOgImageUrl} 
                                        alt="OG preview" 
                                        style={{ width: '60px', height: '45px', objectFit: 'cover', borderRadius: '0.375rem' }}
                                    />
                                    <div style={{ flex: 1, overflow: 'hidden' }}>
                                        <p style={{ color: '#fbbf24', fontSize: '0.8rem', margin: 0, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                            {ogImageFile ? ogImageFile.name : 'Current OG Image'}
                                        </p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                                        <label style={{
                                            backgroundColor: '#3f3f46', color: '#fafafa', fontSize: '0.7rem', padding: '0.35rem 0.6rem',
                                            borderRadius: '0.375rem', cursor: 'pointer'
                                        }}>
                                            Change
                                            <input 
                                                type="file" 
                                                ref={ogImageInputRef}
                                                onChange={handleOgImageChange}
                                                accept="image/jpeg,image/png,image/webp"
                                                style={{ display: 'none' }}
                                            />
                                        </label>
                                        {ogImageFile && (
                                            <button
                                                type="button"
                                                onClick={handleRemoveOgImage}
                                                style={{
                                                    backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: 'none',
                                                    padding: '0.35rem', borderRadius: '0.375rem', cursor: 'pointer'
                                                }}
                                            >
                                                <X size={12} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div style={{
                                    border: '1px dashed #3f3f46', borderRadius: '0.5rem', padding: '1.5rem 1rem', textAlign: 'center', backgroundColor: '#27272a', position: 'relative'
                                }}>
                                    <input 
                                        type="file" 
                                        ref={ogImageInputRef}
                                        onChange={handleOgImageChange}
                                        accept="image/jpeg,image/png,image/webp"
                                        style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                                    />
                                    <p style={{ color: '#a1a1aa', fontSize: '0.8rem', margin: 0 }}>
                                        Upload OG image or <span style={{ color: '#fafafa' }}>Browse</span>
                                    </p>
                                </div>
                            )}
                        </div>

                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#d4d4d8' }}>Schema</label>
                                <span style={{ fontSize: '0.75rem', color: '#71717a' }}>JSON-LD script</span>
                            </div>
                            <textarea 
                                name="meta_schema" 
                                value={formData.meta_schema} 
                                onChange={handleChange} 
                                rows="4"
                                placeholder='<script type="application/ld+json">...</script>'
                                style={{ 
                                    width: '100%', padding: '0.625rem 0.75rem', borderRadius: '0.5rem', 
                                    backgroundColor: '#27272a', border: '1px solid #3f3f46', color: '#fafafa', outline: 'none', 
                                    resize: 'vertical', boxSizing: 'border-box', fontFamily: 'monospace', fontSize: '0.8rem' 
                                }}
                            ></textarea>
                        </div>
                    </div>

                    {/* Form Actions Footer */}
                    <div style={{ gridColumn: 'span 2', display: 'flex', gap: '1rem', marginTop: '1rem', paddingBottom: '2rem' }}>
                        <button 
                            type="submit" 
                            disabled={submitting}
                            style={{ 
                                backgroundColor: '#fbbf24', color: '#000', border: 'none', padding: '0.625rem 1.75rem', 
                                borderRadius: '0.375rem', fontWeight: '600', cursor: submitting ? 'not-allowed' : 'pointer',
                                opacity: submitting ? 0.7 : 1, transition: 'all 0.2s'
                            }}
                        >
                            {submitting ? 'Saving...' : (isEditing ? 'Update Entry' : 'Create Entry')}
                        </button>
                        
                        {!isEditing && (
                            <button 
                                type="button" 
                                disabled={submitting}
                                onClick={(e) => handleSubmit(e, true)} 
                                style={{ 
                                    backgroundColor: '#27272a', color: '#fafafa', border: '1px solid #3f3f46', 
                                    padding: '0.625rem 1.5rem', borderRadius: '0.375rem', fontWeight: '500', cursor: 'pointer'
                                }}
                            >
                                Create & create another
                            </button>
                        )}
                        
                        <button 
                            type="button" 
                            onClick={handleCancelForm} 
                            style={{ 
                                backgroundColor: '#18181b', color: '#fafafa', border: '1px solid #3f3f46', 
                                padding: '0.625rem 1.5rem', borderRadius: '0.375rem', fontWeight: '500', cursor: 'pointer'
                            }}
                        >
                            Cancel
                        </button>
                    </div>

                </form>
            </div>
        );
    }

    // Render List View Table
    return (
        <div style={{ padding: '0 1rem', fontFamily: "'Inter', sans-serif" }}>
            {/* Feedback Toast */}
            {feedback.message && (
                <div style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    backgroundColor: feedback.type === 'error' ? '#ef4444' : '#10b981',
                    color: '#fff',
                    padding: '0.75rem 1.25rem',
                    borderRadius: '0.5rem',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.4)',
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontWeight: '500',
                    fontSize: '0.875rem'
                }}>
                    {feedback.type === 'error' ? <AlertCircle size={18} /> : <Check size={18} />}
                    {feedback.message}
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ffffff', margin: 0 }}>Life At Xaviers</h1>
                    <p style={{ color: '#a1a1aa', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>
                        Manage student activities, campus showcases, and event galleries.
                    </p>
                </div>
                <button 
                    onClick={handleStartCreate}
                    style={{ 
                        backgroundColor: '#fbbf24', 
                        color: '#000', 
                        fontWeight: '600', 
                        padding: '0.625rem 1.25rem', 
                        borderRadius: '0.375rem', 
                        border: 'none', 
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        transition: 'transform 0.1s ease',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    <Plus size={18} /> New entry
                </button>
            </div>
            
            <div className="admin-card">
                {loading ? (
                    <div style={{ padding: '3rem', textAlign: 'center', color: '#a1a1aa' }}>
                        Loading entries...
                    </div>
                ) : (
                    <div className="admin-table-container">
                        <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#18181b', borderBottom: '1px solid #27272a' }}>
                                    <th style={{ padding: '1rem 1.5rem', color: '#fafafa' }}>Title</th>
                                    <th style={{ padding: '1rem 1.5rem', color: '#fafafa' }}>Slug</th>
                                    <th style={{ padding: '1rem 1.5rem', color: '#fafafa' }}>Gallery</th>
                                    <th style={{ padding: '1rem 1.5rem', color: '#fafafa' }}>Status</th>
                                    <th style={{ padding: '1rem 1.5rem', color: '#fafafa', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map(item => {
                                    const galleryCount = item.life_at_xavier_images?.length || 0;
                                    return (
                                        <tr key={item.id} style={{ borderBottom: '1px solid #27272a' }}>
                                            <td style={{ padding: '1rem 1.5rem', color: '#d4d4d8', fontWeight: '500' }}>
                                                {item.title}
                                            </td>
                                            <td style={{ padding: '1rem 1.5rem', color: '#a1a1aa', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                                                /{item.slug}
                                            </td>
                                            <td style={{ padding: '1rem 1.5rem', color: '#d4d4d8' }}>
                                                <span style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '0.35rem',
                                                    backgroundColor: galleryCount > 0 ? 'rgba(251, 191, 36, 0.1)' : '#27272a',
                                                    color: galleryCount > 0 ? '#fbbf24' : '#71717a',
                                                    padding: '0.2rem 0.5rem',
                                                    borderRadius: '0.25rem',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '500'
                                                }}>
                                                    <ImageIcon size={13} /> {galleryCount} {galleryCount === 1 ? 'image' : 'images'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '1rem 1.5rem' }}>
                                                <span style={{ 
                                                    backgroundColor: item.status ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                    color: item.status ? '#22c55e' : '#ef4444',
                                                    border: `1px solid ${item.status ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                                                    padding: '0.25rem 0.65rem',
                                                    borderRadius: '0.375rem',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '500'
                                                }}>
                                                    {item.status ? 'Active' : 'Draft'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    {/* Edit button */}
                                                    <button 
                                                        onClick={() => handleStartEdit(item.id)} 
                                                        title="Edit entry"
                                                        style={{ 
                                                            background: 'rgba(251, 191, 36, 0.1)', 
                                                            border: '1px solid rgba(251, 191, 36, 0.2)', 
                                                            color: '#fbbf24', 
                                                            cursor: 'pointer',
                                                            padding: '0.4rem 0.6rem',
                                                            borderRadius: '0.375rem',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '0.35rem',
                                                            fontSize: '0.8rem',
                                                            fontWeight: '500',
                                                            transition: 'all 0.15s ease'
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.backgroundColor = '#fbbf24';
                                                            e.currentTarget.style.color = '#000';
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.backgroundColor = 'rgba(251, 191, 36, 0.1)';
                                                            e.currentTarget.style.color = '#fbbf24';
                                                        }}
                                                    >
                                                        <Edit size={14} /> Edit
                                                    </button>

                                                    {/* Delete button */}
                                                    <button 
                                                        onClick={() => handleDelete(item.id)} 
                                                        title="Delete entry"
                                                        style={{ 
                                                            background: 'rgba(239, 68, 68, 0.1)', 
                                                            border: '1px solid rgba(239, 68, 68, 0.2)', 
                                                            color: '#ef4444', 
                                                            cursor: 'pointer',
                                                            padding: '0.4rem 0.6rem',
                                                            borderRadius: '0.375rem',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            transition: 'all 0.15s ease'
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.backgroundColor = '#ef4444';
                                                            e.currentTarget.style.color = '#fff';
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                                                            e.currentTarget.style.color = '#ef4444';
                                                        }}
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {items.length === 0 && (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: '#a1a1aa' }}>
                                            No Life At Xavier entries found. Click "New entry" to create one.
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

export default ManageLifeAtXavier;

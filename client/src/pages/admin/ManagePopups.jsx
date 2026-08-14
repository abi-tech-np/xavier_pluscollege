import { getApiUrl } from '../../services/apiClient';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, ChevronDown, Plus, UploadCloud, Trash2 } from 'lucide-react';

const ManagePopups = () => {
    const [popups, setPopups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [perPage, setPerPage] = useState(10);
    
    // Create state
    const [isCreating, setIsCreating] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        link: '',
        status: true,
        image: null
    });

    const getAuthHeaders = () => ({
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
    });

    const fetchPopups = async () => {
        try {
            const res = await (getApiUrl(''), getAuthHeaders());
            setPopups(res.data);
        } catch (error) {
            console.error('Failed to fetch popups', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPopups();
    }, []);

    const handleCreateChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({ ...prev, image: e.target.files[0] }));
        }
    };

    const handleCreateSubmit = async (e, createAnother = false) => {
        e.preventDefault();
        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('link', formData.link);
            data.append('status', formData.status);
            if (formData.image) {
                data.append('image', formData.image);
            }

            await (getApiUrl(''), data, {
                headers: { 
                    ...getAuthHeaders().headers,
                    'Content-Type': 'multipart/form-data' 
                }
            });
            
            fetchPopups();
            
            if (createAnother) {
                setFormData({ title: '', link: '', status: true, image: null });
            } else {
                setIsCreating(false);
            }
        } catch (error) {
            console.error('Failed to create popup', error);
            alert('Failed to create popup');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this popup?')) {
            try {
                await axios.delete(`/admin/popups/${id}`, getAuthHeaders());
                fetchPopups();
            } catch (error) {
                console.error('Failed to delete popup', error);
                alert('Failed to delete popup');
            }
        }
    };

    const filteredPopups = popups.filter(p => 
        (p.title && p.title.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (isCreating) {
        return (
            <div style={{ padding: '0 1rem', fontFamily: "'Inter', sans-serif", paddingBottom: '3rem' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <div style={{ fontSize: '0.85rem', color: '#a1a1aa', display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <span style={{ cursor: 'pointer' }} onClick={() => setIsCreating(false)}>Popup</span>
                        <span>&gt;</span>
                        <span style={{ color: '#fafafa' }}>Create</span>
                    </div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#ffffff', margin: 0 }}>Create Popup</h1>
                </div>

                <div style={{ 
                    backgroundColor: '#18181b', 
                    borderRadius: '0.75rem', 
                    border: '1px solid #27272a',
                    padding: '2rem',
                    marginBottom: '1.5rem'
                }}>
                    <form id="create-form" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#d4d4d8', marginBottom: '0.5rem' }}>
                                Title <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <input 
                                type="text" 
                                name="title" 
                                value={formData.title} 
                                onChange={handleCreateChange} 
                                required 
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
                                onChange={handleCreateChange} 
                                style={{
                                    width: '100%', padding: '0.625rem 0.75rem', borderRadius: '0.5rem',
                                    backgroundColor: '#18181b', border: '1px solid #27272a', color: '#fafafa', outline: 'none'
                                }}
                            />
                        </div>
                        
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#d4d4d8', marginBottom: '0.5rem' }}>
                                Image <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <div style={{
                                border: '1px dashed #3f3f46',
                                borderRadius: '0.5rem',
                                padding: '2rem',
                                textAlign: 'center',
                                backgroundColor: '#18181b',
                                color: '#a1a1aa',
                                cursor: 'pointer',
                                position: 'relative'
                            }}>
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleFileChange} 
                                    required
                                    style={{
                                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer'
                                    }} 
                                />
                                {formData.image ? (
                                    <span style={{ color: '#fbbf24' }}>{formData.image.name}</span>
                                ) : (
                                    <span>Drag & Drop your files or <span style={{ fontWeight: '600', color: '#fafafa' }}>Browse</span></span>
                                )}
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
                                    onChange={handleCreateChange}
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
                            <span style={{ fontSize: '0.9rem', color: '#fafafa', fontWeight: '500' }}>Status</span>
                        </div>

                    </form>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={(e) => handleCreateSubmit(e, false)} style={{ 
                        backgroundColor: '#fbbf24', color: '#000', border: 'none', padding: '0.6rem 1.25rem', borderRadius: '0.375rem', fontWeight: '600', cursor: 'pointer'
                    }}>Create</button>
                    
                    <button onClick={(e) => handleCreateSubmit(e, true)} style={{ 
                        backgroundColor: '#27272a', color: '#fafafa', border: '1px solid #3f3f46', padding: '0.6rem 1.25rem', borderRadius: '0.375rem', fontWeight: '500', cursor: 'pointer'
                    }}>Create & create another</button>
                    
                    <button onClick={() => setIsCreating(false)} style={{ 
                        backgroundColor: '#18181b', color: '#fafafa', border: '1px solid #3f3f46', padding: '0.6rem 1.25rem', borderRadius: '0.375rem', fontWeight: '500', cursor: 'pointer'
                    }}>Cancel</button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: '0 1rem', position: 'relative' }}>
            {/* Header Breadcrumbs & Title */}
            <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.85rem', color: '#a1a1aa', display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span>Popups</span>
                    <span>&gt;</span>
                    <span style={{ color: '#fbbf24' }}>List</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ffffff', margin: 0 }}>Popups</h1>
                    <button 
                        onClick={() => setIsCreating(true)}
                        style={{ 
                            backgroundColor: '#fbbf24', 
                            color: '#000000', 
                            fontWeight: '600', 
                            padding: '0.6rem 1.25rem', 
                            borderRadius: '0.375rem',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '0.9rem'
                        }}>
                        New popup
                    </button>
                </div>
            </div>

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
                            placeholder="Search" 
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
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#18181b', borderBottom: '1px solid #27272a' }}>
                                <th style={{ padding: '1rem 1.5rem', width: '40px' }}>
                                    <input type="checkbox" style={{ accentColor: '#fbbf24', cursor: 'pointer', backgroundColor: '#27272a', border: '1px solid #3f3f46' }} />
                                </th>
                                <th style={{ padding: '1rem 1.5rem', color: '#fafafa', fontWeight: '600' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                        Title <ChevronDown size={14} color="#71717a" />
                                    </div>
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
                                <th style={{ padding: '1rem 1.5rem' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#a1a1aa' }}>Loading popups...</td>
                                </tr>
                            ) : filteredPopups.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#a1a1aa' }}>No popups found.</td>
                                </tr>
                            ) : (
                                filteredPopups.slice(0, perPage).map(popup => (
                                    <tr key={popup.id} style={{ borderBottom: '1px solid #27272a' }}>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <input type="checkbox" style={{ accentColor: '#fbbf24', cursor: 'pointer' }} />
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem', color: '#d4d4d8' }}>{popup.title}</td>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            {popup.status ? (
                                                <span style={{ color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '0.25rem 0.5rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: '600' }}>Active</span>
                                            ) : (
                                                <span style={{ color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '0.25rem 0.5rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: '600' }}>Inactive</span>
                                            )}
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem', color: '#d4d4d8', fontSize: '0.85rem' }}>
                                            {new Date(popup.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                            <button 
                                                onClick={() => handleDelete(popup.id)}
                                                style={{ 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    gap: '0.3rem', 
                                                    backgroundColor: 'transparent', 
                                                    border: 'none', 
                                                    color: '#ef4444', 
                                                    fontWeight: '600',
                                                    cursor: 'pointer',
                                                    fontSize: '0.85rem'
                                                }}>
                                                <Trash2 size={14} /> Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
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

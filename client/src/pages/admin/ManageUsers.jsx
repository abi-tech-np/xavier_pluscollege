import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, ChevronDown, Edit2, X } from 'lucide-react';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [perPage, setPerPage] = useState(10);

    const [isEditing, setIsEditing] = useState(false);
    const [editUser, setEditUser] = useState({ id: null, name: '', email: '', role: '' });

    // Modal state for New User
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: '' });

    const getAuthHeaders = () => ({
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
    });

    const fetchData = async () => {
        try {
            const [usersRes, rolesRes] = await Promise.all([
                axios.get(`${import.meta.env.VITE_API_URL}/api/admin/users`, getAuthHeaders()),
                axios.get(`${import.meta.env.VITE_API_URL}/api/admin/roles`, getAuthHeaders())
            ]);
            setUsers(usersRes.data);
            setRoles(rolesRes.data);
        } catch (error) {
            console.error('Failed to fetch', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleEditChange = (e) => setEditUser({ ...editUser, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/users`, formData, getAuthHeaders());
            setFormData({ name: '', email: '', password: '', role: '' });
            setShowModal(false);
            fetchData();
        } catch (error) {
            console.error('Failed to save', error);
            alert('Failed to create user');
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/api/admin/users/${editUser.id}`, {
                name: editUser.name,
                email: editUser.email,
                role: editUser.role
            }, getAuthHeaders());
            setIsEditing(false);
            fetchData();
        } catch (error) {
            console.error('Failed to update', error);
            alert('Failed to update user');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/users/${id}`, getAuthHeaders());
                setIsEditing(false);
                fetchData();
            } catch (error) {
                console.error('Failed to delete', error);
                alert('Failed to delete user');
            }
        }
    };

    const openEdit = (user) => {
        setEditUser({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.roles && user.roles.length > 0 ? user.roles[0] : ''
        });
        setIsEditing(true);
    };

    // Filter users based on search
    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isEditing) {
        return (
            <div style={{ padding: '0 1rem', fontFamily: "'Inter', sans-serif" }}>
                {/* Header */}
                <div style={{ marginBottom: '2rem' }}>
                    <div style={{ fontSize: '0.85rem', color: '#a1a1aa', display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <span style={{ cursor: 'pointer' }} onClick={() => setIsEditing(false)}>Users</span>
                        <span>&gt;</span>
                        <span style={{ color: '#fafafa' }}>Edit</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#ffffff', margin: 0 }}>Edit User</h1>
                        <button
                            type="button"
                            onClick={() => handleDelete(editUser.id)}
                            style={{
                                backgroundColor: '#ef4444', color: '#ffffff', border: 'none', padding: '0.5rem 1.5rem', borderRadius: '0.375rem', fontWeight: '600', cursor: 'pointer'
                            }}
                        >
                            Delete
                        </button>
                    </div>
                </div>

                <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'start' }}>

                        {/* Name Field */}
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#d4d4d8', marginBottom: '0.5rem' }}>
                                Name <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={editUser.name}
                                onChange={handleEditChange}
                                required
                                style={{
                                    width: '100%', padding: '0.625rem 0.75rem', borderRadius: '0.5rem',
                                    backgroundColor: '#18181b', border: '1px solid #27272a', color: '#fafafa', outline: 'none'
                                }}
                            />
                        </div>

                        {/* Email Field */}
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#d4d4d8', marginBottom: '0.5rem' }}>
                                Email <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={editUser.email}
                                onChange={handleEditChange}
                                required
                                style={{
                                    width: '100%', padding: '0.625rem 0.75rem', borderRadius: '0.5rem',
                                    backgroundColor: '#18181b', border: '1px solid #27272a', color: '#fafafa', outline: 'none'
                                }}
                            />
                        </div>

                        {/* Roles Field */}
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#d4d4d8', marginBottom: '0.5rem' }}>
                                Roles <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <select
                                name="role"
                                value={editUser.role}
                                onChange={handleEditChange}
                                required
                                style={{
                                    width: '100%', padding: '0.625rem 0.75rem', borderRadius: '0.5rem',
                                    backgroundColor: '#18181b', border: '1px solid #27272a', color: '#fafafa', outline: 'none', appearance: 'none'
                                }}
                            >
                                <option value="" disabled>Select a role...</option>
                                {roles.map(r => (
                                    <option key={r.id} value={r.name}>{r.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Form Actions Footer */}
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', paddingBottom: '2rem' }}>
                        <button type="submit" style={{
                            backgroundColor: '#fbbf24', color: '#000', border: 'none', padding: '0.5rem 1.5rem', borderRadius: '0.375rem', fontWeight: '600', cursor: 'pointer'
                        }}>Save changes</button>

                        <button type="button" onClick={() => setIsEditing(false)} style={{
                            backgroundColor: '#27272a', color: '#fafafa', border: '1px solid #3f3f46', padding: '0.5rem 1.5rem', borderRadius: '0.375rem', fontWeight: '500', cursor: 'pointer'
                        }}>Cancel</button>
                    </div>

                </form>
            </div>
        );
    }

    return (
        <div style={{ padding: '0 1rem', position: 'relative' }}>
            {/* Header Breadcrumbs & Title */}
            <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.85rem', color: '#a1a1aa', display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span>Users</span>
                    <span>&gt;</span>
                    <span style={{ color: '#fbbf24' }}>List</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ffffff', margin: 0 }}>Users</h1>
                    <button
                        onClick={() => setShowModal(true)}
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
                        New user
                    </button>
                </div>
            </div>

            {/* Modal for New User */}
            {showModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 50
                }}>
                    <div style={{
                        backgroundColor: '#18181b',
                        padding: '2rem',
                        borderRadius: '0.75rem',
                        border: '1px solid #27272a',
                        width: '400px',
                        maxWidth: '90%'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h2 style={{ color: '#fafafa', margin: 0, fontSize: '1.25rem' }}>Create New User</h2>
                            <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#a1a1aa', cursor: 'pointer' }}>
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ color: '#d4d4d8', fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block' }}>Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', backgroundColor: '#27272a', border: '1px solid #3f3f46', color: '#fff' }} />
                            </div>
                            <div>
                                <label style={{ color: '#d4d4d8', fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block' }}>Email</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', backgroundColor: '#27272a', border: '1px solid #3f3f46', color: '#fff' }} />
                            </div>
                            <div>
                                <label style={{ color: '#d4d4d8', fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block' }}>Password</label>
                                <input type="password" name="password" value={formData.password} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', backgroundColor: '#27272a', border: '1px solid #3f3f46', color: '#fff' }} />
                            </div>
                            <div>
                                <label style={{ color: '#d4d4d8', fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block' }}>Role</label>
                                <select name="role" value={formData.role} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', backgroundColor: '#27272a', border: '1px solid #3f3f46', color: '#fff' }}>
                                    <option value="" disabled>Select role</option>
                                    {roles.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                                </select>
                            </div>
                            <button type="submit" style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#fbbf24', color: '#000', border: 'none', borderRadius: '0.375rem', fontWeight: '600', cursor: 'pointer' }}>
                                Create User
                            </button>
                        </form>
                    </div>
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
                                        Name <ChevronDown size={14} color="#71717a" />
                                    </div>
                                </th>
                                <th style={{ padding: '1rem 1.5rem', color: '#fafafa', fontWeight: '600' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                        Email <ChevronDown size={14} color="#71717a" />
                                    </div>
                                </th>
                                <th style={{ padding: '1rem 1.5rem', color: '#fafafa', fontWeight: '600' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                        Roles <ChevronDown size={14} color="#71717a" />
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
                                    <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: '#a1a1aa' }}>Loading users...</td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: '#a1a1aa' }}>No users found.</td>
                                </tr>
                            ) : (
                                filteredUsers.slice(0, perPage).map(user => (
                                    <tr key={user.id} style={{ borderBottom: '1px solid #27272a' }}>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <input type="checkbox" style={{ accentColor: '#fbbf24', cursor: 'pointer' }} />
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem', color: '#d4d4d8' }}>{user.name}</td>
                                        <td style={{ padding: '1rem 1.5rem', color: '#d4d4d8' }}>{user.email}</td>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                {user.roles && user.roles.length > 0 ? (
                                                    user.roles.map((role, idx) => (
                                                        <span key={idx} style={{
                                                            border: '1px solid rgba(245, 158, 11, 0.3)',
                                                            backgroundColor: 'rgba(245, 158, 11, 0.1)',
                                                            color: '#fbbf24',
                                                            padding: '0.2rem 0.6rem',
                                                            borderRadius: '0.375rem',
                                                            fontSize: '0.75rem',
                                                            fontWeight: '500'
                                                        }}>
                                                            {role}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span style={{ color: '#71717a', fontSize: '0.8rem' }}>None</span>
                                                )}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem', color: '#d4d4d8', fontSize: '0.85rem' }}>
                                            {new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                            <button
                                                onClick={() => openEdit(user)}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.3rem',
                                                    backgroundColor: 'transparent',
                                                    border: 'none',
                                                    color: '#fbbf24',
                                                    fontWeight: '600',
                                                    cursor: 'pointer',
                                                    fontSize: '0.85rem'
                                                }}
                                            >
                                                <Edit2 size={14} /> Edit
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
                        Showing 1 to {Math.min(filteredUsers.length, perPage)} of {filteredUsers.length} results
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

export default ManageUsers;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2 } from 'lucide-react';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });

    const getAuthHeaders = () => ({
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
    });

    const fetchUsers = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/admin/users', getAuthHeaders());
            setUsers(res.data);
        } catch (error) {
            console.error('Failed to fetch', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/admin/users', formData, getAuthHeaders());
            setFormData({ name: '', email: '', password: '' });
            fetchUsers();
        } catch (error) {
            console.error('Failed to save', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                await axios.delete(`http://localhost:5000/api/admin/users/${id}`, getAuthHeaders());
                fetchUsers();
            } catch (error) {
                console.error('Failed to delete', error);
            }
        }
    };

    return (
        <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#fafafa', marginBottom: '1.5rem' }}>Manage Users</h2>
            
            <div className="admin-card">
                <form onSubmit={handleSubmit} className="admin-form" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', alignItems: 'flex-end' }}>
                    <div className="admin-form-group" style={{ marginBottom: 0 }}>
                        <label>Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="John Doe" />
                    </div>
                    <div className="admin-form-group" style={{ marginBottom: 0 }}>
                        <label>Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="john@example.com" />
                    </div>
                    <div className="admin-form-group" style={{ marginBottom: 0 }}>
                        <label>Password</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="******" />
                    </div>
                    <div style={{ gridColumn: 'span 3', marginTop: '1rem' }}>
                        <button type="submit" className="admin-btn admin-btn-primary">Add User</button>
                    </div>
                </form>
            </div>

            <div className="admin-card">
                {loading ? <p>Loading...</p> : (
                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(item => (
                                    <tr key={item.id}>
                                        <td style={{ color: '#fafafa', fontWeight: '500' }}>{item.name}</td>
                                        <td>{item.email}</td>
                                        <td>
                                            <button onClick={() => handleDelete(item.id)} className="admin-btn admin-btn-danger" style={{ padding: '0.3rem 0.6rem' }}>
                                                <Trash2 size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {users.length === 0 && (
                                    <tr><td colSpan="3" style={{ textAlign: 'center', padding: '2rem' }}>No users found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageUsers;

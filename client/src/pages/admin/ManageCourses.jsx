import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2 } from 'lucide-react';

const ManageCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [courseName, setCourseName] = useState('');

    const getAuthHeaders = () => ({
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
    });

    const fetchCourses = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/admin/courses', getAuthHeaders());
            setCourses(res.data);
        } catch (error) {
            console.error('Failed to fetch', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/admin/courses', { course: courseName }, getAuthHeaders());
            setCourseName('');
            fetchCourses();
        } catch (error) {
            console.error('Failed to save', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                await axios.delete(`http://localhost:5000/api/admin/courses/${id}`, getAuthHeaders());
                fetchCourses();
            } catch (error) {
                console.error('Failed to delete', error);
            }
        }
    };

    return (
        <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#fafafa', marginBottom: '1.5rem' }}>Manage Courses</h2>
            
            <div className="admin-card">
                <form onSubmit={handleSubmit} className="admin-form" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                    <div className="admin-form-group" style={{ flex: 1, marginBottom: 0 }}>
                        <label>Course Name</label>
                        <input type="text" value={courseName} onChange={(e) => setCourseName(e.target.value)} required placeholder="e.g. Science" />
                    </div>
                    <button type="submit" className="admin-btn admin-btn-primary" style={{ padding: '0.6rem 1.5rem' }}>Add Course</button>
                </form>
            </div>

            <div className="admin-card">
                {loading ? <p>Loading...</p> : (
                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Course</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {courses.map(item => (
                                    <tr key={item.id}>
                                        <td>{item.id}</td>
                                        <td style={{ color: '#fafafa', fontWeight: '500' }}>{item.course}</td>
                                        <td>
                                            <button onClick={() => handleDelete(item.id)} className="admin-btn admin-btn-danger" style={{ padding: '0.3rem 0.6rem' }}>
                                                <Trash2 size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {courses.length === 0 && (
                                    <tr><td colSpan="3" style={{ textAlign: 'center', padding: '2rem' }}>No courses found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageCourses;

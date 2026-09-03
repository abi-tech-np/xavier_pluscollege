import { getApiUrl, clearApiCache } from '../../services/apiClient';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Trash2, Edit2, Check, AlertCircle, X } from 'lucide-react';

const ManageCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [courseName, setCourseName] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [feedback, setFeedback] = useState(null);

    const { id: routeId } = useParams();
    const navigate = useNavigate();

    const getAuthHeaders = () => ({
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
    });

    const showFeedback = (text, type = 'success') => {
        setFeedback({ text, type });
        setTimeout(() => setFeedback(null), 3500);
    };

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const res = await axios.get(getApiUrl('/admin/courses'), getAuthHeaders());
            setCourses(res.data);
        } catch (error) {
            console.error('Failed to fetch courses', error);
            showFeedback('Failed to load courses', 'error');
        } finally {
            setLoading(false);
        }
    };

    const loadCourseForEdit = async (id) => {
        try {
            const res = await axios.get(getApiUrl(`/admin/courses/${id}`), getAuthHeaders());
            if (res.data) {
                setCourseName(res.data.course || '');
                setIsEditing(true);
                setCurrentId(id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } catch (error) {
            console.error('Failed to load course details for edit', error);
            // Fallback to local course item if in state
            const existing = courses.find(c => String(c.id) === String(id));
            if (existing) {
                setCourseName(existing.course);
                setIsEditing(true);
                setCurrentId(id);
            } else {
                showFeedback('Could not load course details for editing', 'error');
            }
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    useEffect(() => {
        if (routeId) {
            loadCourseForEdit(routeId);
        } else if (!isEditing) {
            setCourseName('');
            setCurrentId(null);
        }
    }, [routeId]);

    const handleEdit = (item) => {
        setIsEditing(true);
        setCurrentId(item.id);
        setCourseName(item.course);
        navigate(`/admin/courses/${item.id}/edit`);
        loadCourseForEdit(item.id);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setCurrentId(null);
        setCourseName('');
        navigate('/admin/courses');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!courseName.trim()) return;

        try {
            setSubmitting(true);
            if (isEditing && currentId) {
                await axios.put(
                    getApiUrl(`/admin/courses/${currentId}`),
                    { course: courseName.trim() },
                    getAuthHeaders()
                );
                showFeedback('Course updated successfully!');
            } else {
                await axios.post(
                    getApiUrl('/admin/courses'),
                    { course: courseName.trim() },
                    getAuthHeaders()
                );
                showFeedback('Course created successfully!');
            }

            clearApiCache();
            handleCancel();
            fetchCourses();
        } catch (error) {
            console.error('Failed to save course', error);
            showFeedback('Failed to save course. Please try again.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                await axios.delete(getApiUrl(`/admin/courses/${id}`), getAuthHeaders());
                showFeedback('Course deleted successfully');
                clearApiCache();
                if (currentId === id) {
                    handleCancel();
                }
                fetchCourses();
            } catch (error) {
                console.error('Failed to delete course', error);
                showFeedback('Failed to delete course', 'error');
            }
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#fafafa', margin: 0 }}>
                    Manage Courses
                </h2>
                {isEditing && (
                    <span style={{ 
                        fontSize: '0.85rem', 
                        color: '#fbbf24', 
                        backgroundColor: 'rgba(251, 191, 36, 0.1)', 
                        padding: '0.35rem 0.75rem', 
                        borderRadius: '0.375rem',
                        border: '1px solid rgba(251, 191, 36, 0.2)'
                    }}>
                        Editing Course #{currentId}
                    </span>
                )}
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
            
            <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#f4f4f5', marginTop: 0, marginBottom: '1rem' }}>
                    {isEditing ? 'Edit Course' : 'Add New Course'}
                </h3>
                <form onSubmit={handleSubmit} className="admin-form" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                    <div className="admin-form-group" style={{ flex: 1, minWidth: '240px', marginBottom: 0 }}>
                        <label htmlFor="course-name-input">Course Name</label>
                        <input 
                            id="course-name-input"
                            type="text" 
                            value={courseName} 
                            onChange={(e) => setCourseName(e.target.value)} 
                            required 
                            placeholder="e.g. Science, Management" 
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                            type="submit" 
                            className="admin-btn admin-btn-primary" 
                            disabled={submitting}
                            style={{ padding: '0.6rem 1.5rem', opacity: submitting ? 0.7 : 1 }}
                        >
                            {submitting ? 'Saving...' : (isEditing ? 'Update Course' : 'Add Course')}
                        </button>
                        {isEditing && (
                            <button 
                                type="button" 
                                className="admin-btn admin-btn-outline" 
                                onClick={handleCancel}
                                style={{ padding: '0.6rem 1.25rem' }}
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className="admin-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#f4f4f5' }}>All Courses</h3>
                    <span style={{ fontSize: '0.85rem', color: '#a1a1aa' }}>
                        {courses.length} {courses.length === 1 ? 'course' : 'courses'}
                    </span>
                </div>
                {loading ? <p style={{ color: '#a1a1aa' }}>Loading courses...</p> : (
                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '80px' }}>ID</th>
                                    <th>Course Name</th>
                                    <th style={{ width: '120px', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {courses.map(item => {
                                    const isRowActive = isEditing && String(currentId) === String(item.id);
                                    return (
                                        <tr 
                                            key={item.id}
                                            style={{
                                                backgroundColor: isRowActive ? 'rgba(251, 191, 36, 0.05)' : undefined
                                            }}
                                        >
                                            <td data-label="ID" style={{ color: '#a1a1aa' }}>{item.id}</td>
                                            <td data-label="Course Name" style={{ color: '#fafafa', fontWeight: '500' }}>
                                                {item.course}
                                                {isRowActive && (
                                                    <span style={{ 
                                                        marginLeft: '0.5rem', 
                                                        fontSize: '0.75rem', 
                                                        color: '#fbbf24' 
                                                    }}>
                                                        (editing)
                                                    </span>
                                                )}
                                            </td>
                                            <td className="admin-table-actions" data-label="Actions" style={{ textAlign: 'right' }}>
                                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                                    <button 
                                                        onClick={() => handleEdit(item)} 
                                                        className="admin-btn admin-btn-primary" 
                                                        style={{ padding: '0.35rem 0.6rem' }}
                                                        title="Edit course"
                                                    >
                                                        <Edit2 size={14} /> Edit
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(item.id)} 
                                                        className="admin-btn admin-btn-danger" 
                                                        style={{ padding: '0.35rem 0.6rem' }}
                                                        title="Delete course"
                                                    >
                                                        <Trash2 size={14} /> Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {courses.length === 0 && (
                                    <tr><td colSpan="3" style={{ textAlign: 'center', padding: '2rem', color: '#a1a1aa' }}>No courses found.</td></tr>
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

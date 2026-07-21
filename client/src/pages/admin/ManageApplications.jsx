import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Download } from 'lucide-react';

const ManageApplications = () => {
    const [applications, setApplications] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [courseFilter, setCourseFilter] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const getAuthHeaders = () => ({
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const [appsRes, coursesRes] = await Promise.all([
                axios.get('http://localhost:5000/api/admin/applications', getAuthHeaders()),
                axios.get('http://localhost:5000/api/admin/courses', getAuthHeaders())
            ]);
            setApplications(appsRes.data);
            setCourses(coursesRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this application?')) return;
        try {
            await axios.delete(`http://localhost:5000/api/admin/applications/${id}`, getAuthHeaders());
            fetchData();
        } catch (error) {
            console.error('Error deleting application:', error);
            alert('Failed to delete application.');
        }
    };

    const filteredApplications = applications.filter(app => {
        let matchCourse = true;
        let matchDate = true;

        if (courseFilter) {
            // compare stringified ID just in case
            matchCourse = String(app.course_id) === String(courseFilter);
        }

        if (startDate || endDate) {
            const appDate = new Date(app.created_at);
            appDate.setHours(0, 0, 0, 0);

            if (startDate) {
                const start = new Date(startDate);
                start.setHours(0, 0, 0, 0);
                if (appDate < start) matchDate = false;
            }
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(0, 0, 0, 0);
                if (appDate > end) matchDate = false;
            }
        }

        return matchCourse && matchDate;
    });

    const handleDownloadCSV = () => {
        if (filteredApplications.length === 0) {
            alert('No data to download.');
            return;
        }

        const headers = ['Applicant Name', 'Email', 'Contact', 'Course', 'GPA', 'Date Applied'];
        const rows = filteredApplications.map(app => [
            `"${app.name}"`,
            `"${app.email}"`,
            `"${app.contact}"`,
            `"${app.courses?.course || 'Unknown'}"`,
            `"${app.gpa}"`,
            `"${new Date(app.created_at).toLocaleDateString()}"`
        ]);

        const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'applications_export.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#fafafa', margin: 0 }}>Manage Appointments</h2>
                <button onClick={handleDownloadCSV} className="admin-btn admin-btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Download size={16} /> Download CSV
                </button>
            </div>
            
            <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                    <div className="admin-form-group" style={{ marginBottom: 0, flex: 1, minWidth: '200px' }}>
                        <label>Filter by Course</label>
                        <select 
                            value={courseFilter} 
                            onChange={(e) => setCourseFilter(e.target.value)} 
                            style={{ width: '100%', padding: '0.6rem', borderRadius: '0.375rem', backgroundColor: '#262626', color: '#fafafa', border: '1px solid #404040' }}
                        >
                            <option value="">All Courses</option>
                            {courses.map(course => (
                                <option key={course.id} value={course.id}>{course.course}</option>
                            ))}
                        </select>
                    </div>
                    <div className="admin-form-group" style={{ marginBottom: 0, flex: 1, minWidth: '150px' }}>
                        <label>Start Date</label>
                        <input 
                            type="date" 
                            value={startDate} 
                            onChange={(e) => setStartDate(e.target.value)} 
                            style={{ width: '100%', padding: '0.6rem', borderRadius: '0.375rem', backgroundColor: '#262626', color: '#fafafa', border: '1px solid #404040' }}
                        />
                    </div>
                    <div className="admin-form-group" style={{ marginBottom: 0, flex: 1, minWidth: '150px' }}>
                        <label>End Date</label>
                        <input 
                            type="date" 
                            value={endDate} 
                            onChange={(e) => setEndDate(e.target.value)} 
                            style={{ width: '100%', padding: '0.6rem', borderRadius: '0.375rem', backgroundColor: '#262626', color: '#fafafa', border: '1px solid #404040' }}
                        />
                    </div>
                    <div style={{ marginBottom: 0 }}>
                        <button onClick={() => { setCourseFilter(''); setStartDate(''); setEndDate(''); }} className="admin-btn" style={{ backgroundColor: '#404040', color: '#fff', padding: '0.6rem 1.5rem' }}>
                            Clear
                        </button>
                    </div>
                </div>
            </div>

            <div className="admin-card">
                {loading ? (
                    <p>Loading applications...</p>
                ) : (
                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Applicant Name</th>
                                    <th>Email</th>
                                    <th>Contact</th>
                                    <th>Course</th>
                                    <th>GPA</th>
                                    <th>Date Applied</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredApplications.map(item => (
                                    <tr key={item.id}>
                                        <td style={{ fontWeight: 500, color: '#fafafa' }}>{item.name}</td>
                                        <td>{item.email}</td>
                                        <td>{item.contact}</td>
                                        <td><span className="admin-badge badge-pending">{item.courses?.course || 'Unknown'}</span></td>
                                        <td style={{ fontWeight: 600, color: '#fafafa' }}>{item.gpa}</td>
                                        <td>{new Date(item.created_at).toLocaleDateString()}</td>
                                        <td>
                                            <button 
                                                className="admin-btn admin-btn-danger" 
                                                onClick={() => handleDelete(item.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredApplications.length === 0 && (
                                    <tr>
                                        <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                                            No applications found.
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

export default ManageApplications;

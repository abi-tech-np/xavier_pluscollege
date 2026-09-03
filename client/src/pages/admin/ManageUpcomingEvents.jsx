import { getApiUrl, clearApiCache } from '../../services/apiClient';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Edit2, Calendar, Clock, MapPin, Plus, Check, X, AlertCircle } from 'lucide-react';

const ManageUpcomingEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState(null);

    // Edit mode state
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);

    const initialFormState = {
        title: '',
        start_date: '',
        end_date: '',
        time: '',
        location: '',
        content: '',
        status: true
    };

    const [formData, setFormData] = useState(initialFormState);

    const getAuthHeaders = () => ({
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
    });

    const formatDateForInput = (dateVal) => {
        if (!dateVal) return '';
        if (typeof dateVal === 'string' && dateVal.includes('T')) {
            return dateVal.split('T')[0];
        }
        try {
            const d = new Date(dateVal);
            return isNaN(d.getTime()) ? '' : d.toISOString().split('T')[0];
        } catch {
            return '';
        }
    };

    const formatDisplayDate = (dateVal) => {
        if (!dateVal) return '—';
        try {
            const d = new Date(dateVal);
            if (isNaN(d.getTime())) return '—';
            return d.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch {
            return '—';
        }
    };

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const res = await axios.get(getApiUrl('/admin/upcoming-events'), getAuthHeaders());
            setEvents(res.data);
        } catch (error) {
            console.error('Failed to fetch events:', error);
            showMessage('Failed to load upcoming events', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const showMessage = (text, type = 'success') => {
        setMessage({ text, type });
        setTimeout(() => setMessage(null), 4000);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => {
            const updated = {
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            };
            // If user enters start_date and end_date is still empty, default end_date to start_date
            if (name === 'start_date' && !prev.end_date) {
                updated.end_date = value;
            }
            return updated;
        });
    };

    const handleEdit = (item) => {
        setIsEditing(true);
        setCurrentId(item.id);
        setFormData({
            title: item.title || '',
            start_date: formatDateForInput(item.start_date),
            end_date: formatDateForInput(item.end_date || item.start_date),
            time: item.time || '',
            location: item.location || '',
            content: item.content || '',
            status: item.status !== undefined ? Boolean(item.status) : true
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancel = () => {
        setIsEditing(false);
        setCurrentId(null);
        setFormData(initialFormState);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.start_date || !formData.end_date) {
            showMessage('Both Start Date and End Date are required.', 'error');
            return;
        }

        if (formData.start_date > formData.end_date) {
            showMessage('End Date cannot be earlier than Start Date.', 'error');
            return;
        }

        try {
            setSubmitting(true);
            if (isEditing) {
                await axios.put(getApiUrl(`/admin/upcoming-events/${currentId}`), formData, getAuthHeaders());
                showMessage('Event updated successfully!');
            } else {
                await axios.post(getApiUrl('/admin/upcoming-events'), formData, getAuthHeaders());
                showMessage('Event created successfully!');
            }

            // Invalidate API cache so public pages immediately display fresh dates
            clearApiCache();

            handleCancel();
            fetchEvents();
        } catch (error) {
            console.error('Failed to save event:', error);
            showMessage('Failed to save event. Please try again.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await axios.delete(getApiUrl(`/admin/upcoming-events/${id}`), getAuthHeaders());
                clearApiCache();
                showMessage('Event deleted successfully!');
                fetchEvents();
                if (isEditing && currentId === id) {
                    handleCancel();
                }
            } catch (error) {
                console.error('Failed to delete event:', error);
                showMessage('Failed to delete event.', 'error');
            }
        }
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '3rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#fafafa', margin: '0 0 0.5rem 0' }}>
                    Manage Upcoming Events
                </h2>
                <p style={{ color: '#a1a1aa', fontSize: '0.9rem', margin: 0 }}>
                    Schedule and manage college events. Required start and end dates ensure proper date badges on the public portal.
                </p>
            </div>

            {/* Notification Banner */}
            {message && (
                <div style={{
                    padding: '0.85rem 1.25rem',
                    marginBottom: '1.5rem',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    backgroundColor: message.type === 'error' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)',
                    border: `1px solid ${message.type === 'error' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(34, 197, 94, 0.3)'}`,
                    color: message.type === 'error' ? '#fca5a5' : '#86efac',
                    fontSize: '0.95rem'
                }}>
                    {message.type === 'error' ? <AlertCircle size={18} /> : <Check size={18} />}
                    <span style={{ fontWeight: 500 }}>{message.text}</span>
                </div>
            )}

            {/* Create / Edit Form Card */}
            <div className="admin-card" style={{
                marginBottom: '2rem',
                border: isEditing ? '1px solid rgba(59, 130, 246, 0.4)' : undefined,
                boxShadow: isEditing ? '0 0 20px rgba(59, 130, 246, 0.1)' : undefined
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid var(--admin-border, #27272a)',
                    paddingBottom: '1rem',
                    marginBottom: '1.25rem'
                }}>
                    <h3 style={{
                        fontSize: '1.15rem',
                        fontWeight: '600',
                        color: '#f4f4f5',
                        margin: 0,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        {isEditing ? (
                            <>
                                <Edit2 size={18} style={{ color: '#38bdf8' }} />
                                Edit Upcoming Event
                            </>
                        ) : (
                            <>
                                <Plus size={18} style={{ color: '#fbbf24' }} />
                                Add New Upcoming Event
                            </>
                        )}
                    </h3>
                    {isEditing && (
                        <button
                            type="button"
                            onClick={handleCancel}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#a1a1aa',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.3rem',
                                fontSize: '0.85rem'
                            }}
                        >
                            <X size={16} /> Cancel Editing
                        </button>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="admin-form" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                    {/* Event Title */}
                    <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            Event Title <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            placeholder="e.g. Annual Science & Tech Exhibition 2026"
                        />
                    </div>

                    {/* Start Date */}
                    <div className="admin-form-group">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <Calendar size={14} style={{ color: '#38bdf8' }} />
                            Start Date <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <input
                            type="date"
                            name="start_date"
                            value={formData.start_date}
                            onChange={handleChange}
                            required
                            style={{ colorScheme: 'dark' }}
                        />
                    </div>

                    {/* End Date */}
                    <div className="admin-form-group">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <Calendar size={14} style={{ color: '#38bdf8' }} />
                            End Date <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <input
                            type="date"
                            name="end_date"
                            value={formData.end_date}
                            onChange={handleChange}
                            min={formData.start_date || undefined}
                            required
                            style={{ colorScheme: 'dark' }}
                        />
                    </div>

                    {/* Time */}
                    <div className="admin-form-group">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <Clock size={14} style={{ color: '#fbbf24' }} />
                            Time / Duration
                        </label>
                        <input
                            type="text"
                            name="time"
                            value={formData.time}
                            onChange={handleChange}
                            placeholder="e.g. 10:00 AM - 3:00 PM"
                        />
                    </div>

                    {/* Location */}
                    <div className="admin-form-group">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <MapPin size={14} style={{ color: '#f43f5e' }} />
                            Location
                        </label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="e.g. Xavier College Main Auditorium"
                        />
                    </div>

                    {/* Status Toggle */}
                    <div className="admin-form-group">
                        <label>Visibility Status</label>
                        <select
                            name="status"
                            value={formData.status ? 'true' : 'false'}
                            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value === 'true' }))}
                        >
                            <option value="true">Active (Visible on public portal)</option>
                            <option value="false">Inactive (Hidden)</option>
                        </select>
                    </div>

                    {/* Description / Content */}
                    <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
                        <label>Description & Details</label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Provide brief details about the event schedule, prerequisites, or highlights..."
                        />
                    </div>

                    {/* Submit Actions */}
                    <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="admin-btn admin-btn-primary"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.65rem 1.5rem',
                                fontWeight: '600'
                            }}
                        >
                            {isEditing ? (
                                <>
                                    <Check size={16} />
                                    {submitting ? 'Updating...' : 'Update Event'}
                                </>
                            ) : (
                                <>
                                    <Plus size={16} />
                                    {submitting ? 'Adding...' : 'Add Event'}
                                </>
                            )}
                        </button>
                        {isEditing && (
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="admin-btn admin-btn-outline"
                                style={{ padding: '0.65rem 1.25rem' }}
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Existing Events Table */}
            <div className="admin-card">
                <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: '600', color: '#f4f4f5', margin: 0 }}>
                        All Upcoming Events ({events.length})
                    </h3>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#a1a1aa' }}>
                        Loading upcoming events...
                    </div>
                ) : (
                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Event Title</th>
                                    <th>Date Schedule</th>
                                    <th>Time</th>
                                    <th>Location</th>
                                    <th>Status</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {events.map(item => {
                                    const startFormatted = formatDisplayDate(item.start_date);
                                    const endFormatted = formatDisplayDate(item.end_date);
                                    const isSameDate = startFormatted === endFormatted || !item.end_date;

                                    return (
                                        <tr key={item.id}>
                                            <td style={{ color: '#fafafa', fontWeight: '600' }}>
                                                {item.title}
                                            </td>
                                            <td>
                                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#e4e4e7', fontSize: '0.875rem' }}>
                                                    <Calendar size={14} style={{ color: '#38bdf8' }} />
                                                    {item.start_date ? (
                                                        <span>
                                                            {startFormatted}
                                                            {!isSameDate && ` - ${endFormatted}`}
                                                        </span>
                                                    ) : (
                                                        <span style={{ color: '#ef4444', fontStyle: 'italic' }}>Missing Date</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td>{item.time || '—'}</td>
                                            <td>{item.location || '—'}</td>
                                            <td>
                                                <span className={`admin-badge ${item.status ? 'badge-success' : 'badge-danger'}`}>
                                                    {item.status ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td style={{ textAlign: 'right' }}>
                                                <div style={{ display: 'inline-flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                    <button
                                                        onClick={() => handleEdit(item)}
                                                        className="admin-btn admin-btn-primary"
                                                        style={{ padding: '0.35rem 0.65rem' }}
                                                        title="Edit Event"
                                                    >
                                                        <Edit2 size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item.id)}
                                                        className="admin-btn admin-btn-danger"
                                                        style={{ padding: '0.35rem 0.65rem' }}
                                                        title="Delete Event"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {events.length === 0 && (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: '#a1a1aa' }}>
                                            No events found. Use the form above to add your first event.
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

export default ManageUpcomingEvents;

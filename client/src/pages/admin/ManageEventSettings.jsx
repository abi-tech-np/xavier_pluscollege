import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Save } from 'lucide-react';

const ManageEventSettings = () => {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);

    const getAuthHeaders = () => ({
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
    });

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const res = await axios.get('https://plus.xavier.edu.np/plus-api/api/admin/event-settings', getAuthHeaders());
            setSettings(res.data);
        } catch (error) {
            console.error('Error fetching event settings:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put('https://plus.xavier.edu.np/plus-api/api/admin/event-settings', settings, getAuthHeaders());
            alert('Settings updated successfully!');
            fetchSettings();
        } catch (error) {
            console.error('Error updating settings:', error);
            alert('Failed to update settings.');
        }
    };

    if (loading || !settings) return <p>Loading settings...</p>;

    return (
        <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#fafafa', marginBottom: '1.5rem' }}>Event Settings</h2>
            
            <div className="admin-card">
                <form onSubmit={handleSubmit} className="admin-form">
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        {/* Basic Info */}
                        <div>
                            <h3 style={{ color: '#fbbf24', marginBottom: '1rem', borderBottom: '1px solid #262626', paddingBottom: '0.5rem' }}>Basic Settings</h3>
                            <div className="admin-form-group">
                                <label>Title</label>
                                <input type="text" name="title" value={settings.title || ''} onChange={handleChange} />
                            </div>
                            <div className="admin-form-group">
                                <label>Tagline</label>
                                <input type="text" name="tagline" value={settings.tagline || ''} onChange={handleChange} />
                            </div>
                            <div className="admin-form-group">
                                <label>Lead Text</label>
                                <textarea name="lead_text" value={settings.lead_text || ''} onChange={handleChange} rows="3"></textarea>
                            </div>
                            <div className="admin-form-group">
                                <label>Artist Name</label>
                                <input type="text" name="artist_name" value={settings.artist_name || ''} onChange={handleChange} />
                            </div>
                            <div className="admin-form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <input type="checkbox" name="is_enabled" checked={settings.is_enabled || false} onChange={handleChange} />
                                <label style={{ marginBottom: 0 }}>Event Enabled</label>
                            </div>
                        </div>

                        {/* Registration Settings */}
                        <div>
                            <h3 style={{ color: '#fbbf24', marginBottom: '1rem', borderBottom: '1px solid #262626', paddingBottom: '0.5rem' }}>Registration Settings</h3>
                            <div className="admin-form-group">
                                <label>Participant Limit</label>
                                <input type="number" name="participant_limit" value={settings.participant_limit || 0} onChange={handleChange} />
                            </div>
                            <div className="admin-form-group">
                                <label>Ticket Start Number</label>
                                <input type="number" name="ticket_start" value={settings.ticket_start || 1} onChange={handleChange} />
                            </div>
                            <div className="admin-form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <input type="checkbox" name="require_photo" checked={settings.require_photo || false} onChange={handleChange} />
                                <label style={{ marginBottom: 0 }}>Require Photo / Admit Card</label>
                            </div>
                            <div className="admin-form-group">
                                <label>Photo Upload Label</label>
                                <input type="text" name="photo_upload_label" value={settings.photo_upload_label || ''} onChange={handleChange} />
                            </div>
                            <div className="admin-form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <input type="checkbox" name="extra_field_enabled" checked={settings.extra_field_enabled || false} onChange={handleChange} />
                                <label style={{ marginBottom: 0 }}>Enable Extra Field</label>
                            </div>
                            <div className="admin-form-group">
                                <label>Extra Field Label</label>
                                <input type="text" name="extra_field_label" value={settings.extra_field_label || ''} onChange={handleChange} />
                            </div>
                        </div>

                        {/* Perks */}
                        <div>
                            <h3 style={{ color: '#fbbf24', marginBottom: '1rem', borderBottom: '1px solid #262626', paddingBottom: '0.5rem' }}>Event Perks</h3>
                            <div className="admin-form-group">
                                <label>Perk 1</label>
                                <input type="text" name="perk_1" value={settings.perk_1 || ''} onChange={handleChange} />
                            </div>
                            <div className="admin-form-group">
                                <label>Perk 2</label>
                                <input type="text" name="perk_2" value={settings.perk_2 || ''} onChange={handleChange} />
                            </div>
                            <div className="admin-form-group">
                                <label>Perk 3</label>
                                <input type="text" name="perk_3" value={settings.perk_3 || ''} onChange={handleChange} />
                            </div>
                            <div className="admin-form-group">
                                <label>CTA Note</label>
                                <input type="text" name="cta_note" value={settings.cta_note || ''} onChange={handleChange} />
                            </div>
                        </div>

                        {/* Popup Settings */}
                        <div>
                            <h3 style={{ color: '#fbbf24', marginBottom: '1rem', borderBottom: '1px solid #262626', paddingBottom: '0.5rem' }}>Popup Display</h3>
                            <div className="admin-form-group">
                                <label>Popup Venue URL (Maps)</label>
                                <input type="text" name="popup_venue_url" value={settings.popup_venue_url || ''} onChange={handleChange} />
                            </div>
                            <div className="admin-form-group">
                                <label>Popup Subtitle</label>
                                <input type="text" name="popup_subtitle" value={settings.popup_subtitle || ''} onChange={handleChange} />
                            </div>
                            <div className="admin-form-group">
                                <label>Popup Info Text</label>
                                <textarea name="popup_info_text" value={settings.popup_info_text || ''} onChange={handleChange} rows="2"></textarea>
                            </div>
                            <div className="admin-form-group">
                                <label>Sold Out Subtitle</label>
                                <input type="text" name="popup_sold_out_subtitle" value={settings.popup_sold_out_subtitle || ''} onChange={handleChange} />
                            </div>
                            <div className="admin-form-group">
                                <label>Sold Out Info Text</label>
                                <textarea name="popup_sold_out_info_text" value={settings.popup_sold_out_info_text || ''} onChange={handleChange} rows="2"></textarea>
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="admin-btn admin-btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem', padding: '0.75rem 2rem' }}>
                        <Save size={18} /> Save Settings
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ManageEventSettings;

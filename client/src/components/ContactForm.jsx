import React, { useState } from 'react';
import axios from 'axios';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        contact: '',
        message: ''
    });

    const [status, setStatus] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setStatus('submitting');
            await axios.post(`${import.meta.env.VITE_API_URL}/api/contact`, formData);
            setStatus('success');
            setFormData({ name: '', email: '', contact: '', message: '' });
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    const inputStyle = {
        padding: '12px 15px',
        borderRadius: '4px',
        border: '1px solid #73b8ba',
        fontSize: '12px',
        outline: 'none',
        width: '100%',
        boxSizing: 'border-box'
    };

    const labelStyle = {
        fontSize: '15px',
        color: '#444',
        fontWeight: '500'
    };

    const columnStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    };

    return (
        <form className="contact__form" onSubmit={handleSubmit} style={{ maxWidth: '800px', margin: '0 auto', fontFamily: 'var(--primary-font, sans-serif)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '25px' }}>
                <div style={columnStyle}>
                    <label style={labelStyle}>Name</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        style={inputStyle}
                    />
                </div>
                <div style={columnStyle}>
                    <label style={labelStyle}>Email</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        style={inputStyle}
                    />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '25px' }}>
                <div style={columnStyle}>
                    <label style={labelStyle}>Contact</label>
                    <input
                        type="tel"
                        name="contact"
                        placeholder="Contact"
                        required
                        value={formData.contact}
                        onChange={handleChange}
                        style={inputStyle}
                    />
                </div>
                <div></div>
            </div>

            <div style={{ ...columnStyle, marginBottom: '25px' }}>
                <label style={labelStyle}>Message</label>
                <textarea
                    name="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    style={{ ...inputStyle, resize: 'vertical' }}
                ></textarea>
            </div>

            {status === 'success' && <p style={{ color: 'green', margin: '0 0 15px 0', fontWeight: '500' }}>Your message has been sent successfully!</p>}
            {status === 'error' && <p style={{ color: 'red', margin: '0 0 15px 0', fontWeight: '500' }}>Something went wrong. Please try again.</p>}

            <button type="submit" disabled={status === 'submitting'} style={{ padding: '10px 30px', background: '#0085D7', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '14px', cursor: 'pointer', fontWeight: '500' }}>
                {status === 'submitting' ? 'Submitting...' : 'Apply Now'}
            </button>
        </form>
    );
};

export default ContactForm;

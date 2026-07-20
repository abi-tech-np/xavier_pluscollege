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
            await axios.post('http://localhost:5000/api/contact', formData);
            setStatus('success');
            setFormData({ name: '', email: '', contact: '', message: '' });
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    return (
        <form className="contact__form" onSubmit={handleSubmit}>
            <div className="input-group">
                <input 
                    type="text" 
                    name="name" 
                    placeholder="Full Name" 
                    required 
                    value={formData.name}
                    onChange={handleChange}
                />
            </div>
            <div className="group-wrapper">
                <div className="input-group">
                    <input 
                        type="email" 
                        name="email" 
                        placeholder="E-mail" 
                        required 
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>
                <div className="input-group">
                    <input 
                        type="tel" 
                        name="contact" 
                        placeholder="Phone no." 
                        required 
                        value={formData.contact}
                        onChange={handleChange}
                    />
                </div>
            </div>
            <div className="input-group">
                <textarea 
                    name="message" 
                    cols="30" 
                    rows="4" 
                    placeholder="Message" 
                    value={formData.message}
                    onChange={handleChange}
                ></textarea>
            </div>
            {status === 'success' && <p style={{ color: 'green', marginTop: '10px' }}>Your message has been sent successfully!</p>}
            {status === 'error' && <p style={{ color: 'red', marginTop: '10px' }}>Something went wrong. Please try again.</p>}
            <button className="btn" type="submit" disabled={status === 'submitting'}>
                <span>{status === 'submitting' ? 'Submitting...' : 'Submit'}</span>
            </button>
        </form>
    );
};

export default ContactForm;

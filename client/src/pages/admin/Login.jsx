import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ShieldAlert } from 'lucide-react';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await axios.post('http://localhost:5000/api/admin/login', {
                email,
                password
            });
            
            // Handle Remember Me
            const storage = rememberMe ? localStorage : sessionStorage;
            storage.setItem('adminToken', res.data.token);
            storage.setItem('adminUser', JSON.stringify(res.data.user));
            
            // Also ensure we clear the other storage just in case
            if (rememberMe) {
                sessionStorage.removeItem('adminToken');
                sessionStorage.removeItem('adminUser');
            } else {
                localStorage.removeItem('adminToken');
                localStorage.removeItem('adminUser');
            }

            navigate('/admin');
        } catch (err) {
            setError(err.response?.data?.error || 'These credentials do not match our records.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#09090b',
            color: '#fafafa',
            fontFamily: "'Inter', sans-serif"
        }}>
            <div style={{ width: '100%', maxWidth: '28rem', padding: '0 1.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Sign in</h2>
                </div>

                <div style={{
                    backgroundColor: '#18181b',
                    borderRadius: '0.75rem',
                    border: '1px solid #27272a',
                    padding: '2.5rem 2rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}>
                    {error && (
                        <div style={{
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            color: '#ef4444',
                            padding: '1rem',
                            borderRadius: '0.5rem',
                            marginBottom: '1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontSize: '0.875rem'
                        }}>
                            <ShieldAlert size={16} />
                            {error}
                        </div>
                    )}
                    
                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#d4d4d8', marginBottom: '0.5rem' }}>
                                Email address <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <input 
                                type="email" 
                                required 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.625rem 0.75rem',
                                    borderRadius: '0.5rem',
                                    backgroundColor: '#27272a',
                                    border: '1px solid #3f3f46',
                                    color: '#fafafa',
                                    outline: 'none',
                                    fontSize: '0.875rem',
                                    boxSizing: 'border-box',
                                    transition: 'border-color 0.15s ease-in-out'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#fbbf24'}
                                onBlur={(e) => e.target.style.borderColor = '#3f3f46'}
                            />
                        </div>

                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#d4d4d8' }}>
                                    Password <span style={{ color: '#ef4444' }}>*</span>
                                </label>
                                <a href="#" style={{ fontSize: '0.875rem', color: '#fbbf24', textDecoration: 'none', fontWeight: '500' }}>
                                    Forgot password?
                                </a>
                            </div>
                            <input 
                                type="password" 
                                required 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.625rem 0.75rem',
                                    borderRadius: '0.5rem',
                                    backgroundColor: '#27272a',
                                    border: '1px solid #3f3f46',
                                    color: '#fafafa',
                                    outline: 'none',
                                    fontSize: '0.875rem',
                                    boxSizing: 'border-box',
                                    transition: 'border-color 0.15s ease-in-out'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#fbbf24'}
                                onBlur={(e) => e.target.style.borderColor = '#3f3f46'}
                            />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <input 
                                type="checkbox" 
                                id="remember" 
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                style={{ 
                                    accentColor: '#fbbf24', 
                                    cursor: 'pointer', 
                                    width: '1rem', 
                                    height: '1rem',
                                    backgroundColor: '#27272a',
                                    border: '1px solid #3f3f46',
                                    borderRadius: '0.25rem'
                                }} 
                            />
                            <label htmlFor="remember" style={{ fontSize: '0.875rem', color: '#d4d4d8', cursor: 'pointer' }}>
                                Remember me
                            </label>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '0.625rem 1rem',
                                backgroundColor: '#fbbf24',
                                color: '#09090b',
                                border: 'none',
                                borderRadius: '0.5rem',
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                marginTop: '0.5rem',
                                opacity: loading ? 0.7 : 1,
                                transition: 'background-color 0.15s ease-in-out'
                            }}
                            onMouseOver={(e) => { if (!loading) e.target.style.backgroundColor = '#f59e0b' }}
                            onMouseOut={(e) => { if (!loading) e.target.style.backgroundColor = '#fbbf24' }}
                        >
                            {loading ? 'Authenticating...' : 'Sign in'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;

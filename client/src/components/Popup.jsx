import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';

const Popup = () => {
    const [popup, setPopup] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const fetchPopups = async () => {
            try {
                if (sessionStorage.getItem('popupClosed')) {
                    return;
                }

                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/popups`);
                if (res.data && res.data.length > 0) {
                    setPopup(res.data[0]);
                    setIsVisible(true);
                }
            } catch (error) {
                console.error('Failed to fetch popups', error);
            }
        };

        fetchPopups();
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        sessionStorage.setItem('popupClosed', 'true');
    };

    if (!isVisible || !popup) return null;

    // Use absolute URL for the image if it's a relative path from the API
    const imageSrc = popup.imageUrl ? `${import.meta.env.VITE_API_URL}${popup.imageUrl}` : null;

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999999,
            padding: '20px',
            backdropFilter: 'blur(5px)'
        }}>
            <div style={{
                position: 'relative',
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                width: '100%',
                maxWidth: '600px',
                minHeight: '200px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
            }}>
                <button
                    onClick={handleClose}
                    style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        backgroundColor: '#1f2937',
                        border: 'none',
                        color: 'white',
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        zIndex: 10,
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                >
                    <X size={20} />
                </button>

                {imageSrc && (
                    <div style={{ width: '100%', backgroundColor: '#f3f4f6', minHeight: '150px' }}>
                        <img
                            src={imageSrc}
                            alt={popup.title || 'Popup Notice'}
                            style={{
                                width: '100%',
                                maxHeight: '500px',
                                objectFit: 'contain',
                                display: 'block'
                            }}
                            onError={(e) => {
                                e.target.style.display = 'none'; // Hide if broken
                            }}
                        />
                    </div>
                )}

                <div style={{ padding: '24px', textAlign: 'center', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    {popup.title && (
                        <h2 style={{
                            margin: '0 0 16px 0',
                            fontSize: '24px',
                            fontWeight: '700',
                            color: '#111827',
                            lineHeight: '1.2'
                        }}>
                            {popup.title}
                        </h2>
                    )}

                    {popup.link && (
                        <div style={{ marginTop: '10px' }}>
                            <a
                                href={popup.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'inline-block',
                                    padding: '12px 24px',
                                    backgroundColor: '#fbbf24',
                                    color: '#000000',
                                    textDecoration: 'none',
                                    fontWeight: '600',
                                    borderRadius: '6px',
                                    transition: 'background-color 0.2s'
                                }}
                            >
                                Learn More
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Popup;

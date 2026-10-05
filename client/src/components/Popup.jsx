import React, { useState, useEffect } from 'react';
import { fetchApiData, getImageUrl } from '../services/apiClient';
import { X } from 'lucide-react';

const Popup = () => {
    const [popups, setPopups] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        let isMounted = true;
        const fetchPopups = async () => {
            try {
                if (sessionStorage.getItem('popupClosed')) {
                    return;
                }

                const data = await fetchApiData('/popups');
                if (isMounted && Array.isArray(data) && data.length > 0) {
                    const activePopups = data.filter(p => p.status !== false && p.status !== 0);
                    if (activePopups.length > 0) {
                        setPopups(activePopups);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch popups', error);
            }
        };

        fetchPopups();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleClose = () => {
        if (currentIndex < popups.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            setPopups([]);
            sessionStorage.setItem('popupClosed', 'true');
        }
    };

    if (popups.length === 0 || currentIndex >= popups.length) return null;

    const popup = popups[currentIndex];
    const imageSrc = popup.imageUrl ? getImageUrl(popup.imageUrl) : null;
    const isPdf = imageSrc && imageSrc.toLowerCase().endsWith('.pdf');

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
                maxWidth: isPdf ? '800px' : '600px',
                minHeight: isPdf ? '600px' : '200px',
                height: isPdf ? '85vh' : 'auto',
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
                    <div style={{ width: '100%', backgroundColor: '#f3f4f6', flexGrow: isPdf ? 1 : 0, minHeight: isPdf ? '0' : '150px', display: 'flex', flexDirection: 'column' }}>
                        {isPdf ? (
                            <iframe 
                                src={imageSrc} 
                                title={popup.title || 'Popup PDF'}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    border: 'none',
                                    flexGrow: 1
                                }}
                            />
                        ) : (
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
                                    e.target.style.display = 'none';
                                }}
                            />
                        )}
                    </div>
                )}
                
                {(popup.title || popup.link) && (
                    <div style={{ padding: '24px', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', flexShrink: 0 }}>
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
                )}
            </div>
        </div>
    );
};

export default Popup;

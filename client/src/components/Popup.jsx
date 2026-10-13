import React, { useState, useEffect, useRef } from 'react';
import { fetchApiData, getImageUrl } from '../services/apiClient';
import { X, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

// In-memory module-scoped flag.
// Resets to false on every full browser page reload, but persists across
// client-side route navigation within the same page session.
let isPopupClosedThisSession = false;

const Popup = () => {
    const [popups, setPopups] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    const dialogRef = useRef(null);
    const closeButtonRef = useRef(null);
    const previousActiveElementRef = useRef(null);

    // Initial fetch and session cleanup
    useEffect(() => {
        // Clear legacy storage flags to ensure clean reload-driven behavior
        try {
            sessionStorage.removeItem('popupClosed');
            localStorage.removeItem('check-popup');
            localStorage.removeItem('popupClosed');
        } catch {
            // Storage access blocked or unavailable
        }

        // If user already dismissed the popup in this page view session, keep it suppressed
        if (isPopupClosedThisSession) {
            return;
        }

        let isMounted = true;
        const fetchPopups = async () => {
            try {
                const data = await fetchApiData('/popups');
                if (isMounted && Array.isArray(data) && data.length > 0) {
                    const activePopups = data.filter(p => p.status !== false && p.status !== 0);
                    if (activePopups.length > 0) {
                        setPopups(activePopups);
                        setCurrentIndex(0);
                        setIsOpen(true);
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

    // Accessibility: Focus Trap, ESC to close, and Background Scroll Lock
    useEffect(() => {
        if (!isOpen) return;

        // Save current active element to restore focus when popup closes
        previousActiveElementRef.current = document.activeElement;

        // Auto-focus the close button for instant keyboard accessibility
        const focusTimer = setTimeout(() => {
            closeButtonRef.current?.focus();
        }, 60);

        // Background scroll lock
        const originalBodyOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        // Keyboard listeners: ESC to close, Arrow keys to navigate, Tab to trap focus
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                handleClose();
                return;
            }

            if (e.key === 'ArrowLeft' && popups.length > 1) {
                e.preventDefault();
                setCurrentIndex(prev => (prev > 0 ? prev - 1 : popups.length - 1));
                return;
            }

            if (e.key === 'ArrowRight' && popups.length > 1) {
                e.preventDefault();
                setCurrentIndex(prev => (prev < popups.length - 1 ? prev + 1 : 0));
                return;
            }

            if (e.key === 'Tab' && dialogRef.current) {
                const focusable = dialogRef.current.querySelectorAll(
                    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
                );

                if (focusable.length === 0) return;

                const firstEl = focusable[0];
                const lastEl = focusable[focusable.length - 1];

                if (e.shiftKey) {
                    if (document.activeElement === firstEl) {
                        e.preventDefault();
                        lastEl.focus();
                    }
                } else {
                    if (document.activeElement === lastEl) {
                        e.preventDefault();
                        firstEl.focus();
                    }
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            clearTimeout(focusTimer);
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = originalBodyOverflow;

            if (previousActiveElementRef.current && typeof previousActiveElementRef.current.focus === 'function') {
                previousActiveElementRef.current.focus();
            }
        };
    }, [isOpen, popups.length]);

    const handleClose = () => {
        isPopupClosedThisSession = true;
        setIsOpen(false);
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    const handlePrev = (e) => {
        e.stopPropagation();
        setCurrentIndex(prev => (prev > 0 ? prev - 1 : popups.length - 1));
    };

    const handleNext = (e) => {
        e.stopPropagation();
        setCurrentIndex(prev => (prev < popups.length - 1 ? prev + 1 : 0));
    };

    if (!isOpen || popups.length === 0 || currentIndex >= popups.length) {
        return null;
    }

    const popup = popups[currentIndex];
    const imageSrc = popup.imageUrl ? getImageUrl(popup.imageUrl) : null;
    const isPdf = imageSrc && imageSrc.toLowerCase().endsWith('.pdf');
    const hasTextContent = Boolean(popup.title || popup.link);

    return (
        <div 
            className="xavier-popup-overlay"
            onClick={handleBackdropClick}
            aria-modal="true"
            role="dialog"
            aria-label={popup.title || 'Announcement notice'}
        >
            <div 
                ref={dialogRef}
                className={`xavier-popup-dialog ${isPdf ? 'xavier-popup-dialog--pdf' : ''}`}
            >
                {/* Prominent, high-contrast close button */}
                <button 
                    ref={closeButtonRef}
                    onClick={handleClose}
                    className="xavier-popup-close-btn"
                    aria-label="Close popup"
                    type="button"
                >
                    <X size={22} strokeWidth={2.4} />
                </button>

                {/* Multiple popups counter badge */}
                {popups.length > 1 && (
                    <div className="xavier-popup-badge">
                        Notice {currentIndex + 1} of {popups.length}
                    </div>
                )}

                {/* Scrollable container preventing any content cut-off */}
                <div className="xavier-popup-scrollable">
                    {/* Media Display (Image or PDF) */}
                    {imageSrc && (
                        <div className="xavier-popup-media">
                            {isPdf ? (
                                <iframe 
                                    src={imageSrc} 
                                    title={popup.title || 'Popup PDF Notice'}
                                    className="xavier-popup-media__iframe"
                                />
                            ) : (
                                <img 
                                    src={imageSrc} 
                                    alt={popup.title || 'Popup Announcement'} 
                                    className={`xavier-popup-media__img ${hasTextContent ? 'xavier-popup-media__img--with-content' : 'xavier-popup-media__img--standalone'}`}
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                            )}
                        </div>
                    )}

                    {/* Text & CTA Content */}
                    {(popup.title || popup.link || popups.length > 1) && (
                        <div className="xavier-popup-content">
                            {popup.title && (
                                <h2 id="xavier-popup-title" className="xavier-popup-title">
                                    {popup.title}
                                </h2>
                            )}

                            {popup.link && (
                                <div>
                                    <a 
                                        href={popup.link} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="xavier-popup-cta"
                                    >
                                        <span>Learn More</span>
                                        <ExternalLink size={16} />
                                    </a>
                                </div>
                            )}

                            {/* Carousel controls if more than 1 popup */}
                            {popups.length > 1 && (
                                <div className="xavier-popup-carousel">
                                    <button 
                                        type="button" 
                                        onClick={handlePrev}
                                        className="xavier-popup-carousel__btn"
                                        aria-label="Previous announcement"
                                    >
                                        <ChevronLeft size={16} />
                                        <span>Previous</span>
                                    </button>

                                    <div className="xavier-popup-carousel__dots">
                                        {popups.map((_, idx) => (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setCurrentIndex(idx);
                                                }}
                                                className={`xavier-popup-carousel__dot ${idx === currentIndex ? 'xavier-popup-carousel__dot--active' : ''}`}
                                                aria-label={`Go to notice ${idx + 1}`}
                                            />
                                        ))}
                                    </div>

                                    <button 
                                        type="button" 
                                        onClick={handleNext}
                                        className="xavier-popup-carousel__btn"
                                        aria-label="Next announcement"
                                    >
                                        <span>Next</span>
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Popup;

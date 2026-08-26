import React, { useRef, useState, useEffect, useCallback, useImperativeHandle, forwardRef, memo } from 'react';

/**
 * LazyVideo — loads video only when scrolled into view.
 * Uses IntersectionObserver to defer loading until the element is near the viewport.
 * Ensures only one video plays at a time via a shared "playing" callback.
 * Wrapped in React.memo + forwardRef to prevent re-renders when parent re-renders,
 * avoiding browser media resource selection algorithm resets and duplicate video fetches.
 */
const LazyVideo = memo(forwardRef(({ src, sources, children, poster, className, onPlay, controls = false, ...props }, ref) => {
    const videoRef = useRef(null);
    const containerRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    // Forward videoRef to external ref if provided
    useImperativeHandle(ref, () => videoRef.current);

    // IntersectionObserver to detect when video enters viewport
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(el); // Only trigger once
                }
            },
            { rootMargin: '200px' } // Start loading 200px before viewport
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    // Mark loaded once visible
    useEffect(() => {
        if (isVisible && !isLoaded) {
            setIsLoaded(true);
            if (videoRef.current) {
                videoRef.current.load();
                if (props.autoPlay) {
                    videoRef.current.play().catch(e => console.warn('Autoplay failed', e));
                }
            }
        }
    }, [isVisible, isLoaded, props.autoPlay]);

    const handlePlay = useCallback(() => {
        if (onPlay) onPlay(videoRef.current);
    }, [onPlay]);

    const renderSources = () => {
        if (children) return children;

        // Support responsive sources object: { desktop: [...], mobile: [...] }
        let resolvedSources = sources;
        if (sources && typeof sources === 'object' && !Array.isArray(sources)) {
            const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
            resolvedSources = isMobile ? sources.mobile : sources.desktop;
        }

        if (resolvedSources && Array.isArray(resolvedSources)) {
            return resolvedSources.map((s, idx) => (
                <source key={s.src || idx} src={s.src} type={s.type} />
            ));
        }
        if (src) {
            return <source src={src} />;
        }
        return null;
    };

    return (
        <div ref={containerRef} className={className} style={{ position: 'relative' }}>
            {poster && !isLoaded && (
                <img
                    src={poster}
                    alt=""
                    className="testimonial-img"
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
            )}
            <video
                ref={videoRef}
                className="video"
                loop
                playsInline
                muted
                controls={controls}
                controlsList="nodownload noplaybackrate"
                disablePictureInPicture
                preload="none"
                poster={poster}
                onPlay={handlePlay}
                style={!isLoaded ? { display: 'none' } : undefined}
                {...props}
            >
                {isVisible ? renderSources() : null}
            </video>
        </div>
    );
}));

LazyVideo.displayName = 'LazyVideo';

export default LazyVideo;


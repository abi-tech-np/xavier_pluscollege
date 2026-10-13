import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ExternalLink, Maximize2, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { getApiUrl, getImageUrl } from '../services/apiClient';
import Banner from '../components/Banner';
import FooterCTA from '../components/FooterCTA';
import { SocialPlatformIcon, PlatformBadge, getPlatformMeta } from '../components/SocialPlatformIcon';

const hardcodedData = {
    'ximun': {
        title: 'XIMUN',
        date: '21st Dec 2023',
        description: 'Xavier International Model United Nations, is a prestigious event where students simulate diplomatic discussions and debates on global issues. It provides a platform for young minds to engage in issues from international perspectives.',
        bannerImage: 'ximun__banner.jpg',
        galleryUrls: [
            '/images/ximun/fifteen.jpg',
            '/images/ximun/three.jpg',
            '/images/ximun/fourthteen.jpg',
            '/images/ximun/sixteen.jpg',
            '/images/ximun/one.jpg',
            '/images/ximun/six.jpg'
        ]
    },
    'holi': {
        title: 'Holi',
        date: '25th March 2024',
        description: 'At Xavier, Holi is a vibrant celebration of colors and unity, where students come together to revel in joyous festivities, spreading cheers across the campus.',
        bannerImage: 'holi 2.jpg',
        galleryUrls: [
            '/images/holi/holi +2.jpg',
            '/images/holi/ghjk.jpg',
            '/images/holi/holi 3.jpg',
            '/images/holi/holi 4.jpg',
            '/images/holi/holie.jpg',
            '/images/holi/holi 2.jpg'
        ]
    },
    'u-19': {
        title: 'U-19',
        date: '10th Jan 2024',
        description: 'Xavier’s Under 19 Inter college Basketball Tournament is a thrilling showcase of young talent, where college teams compete in fast-paced matches. With electrifying plays and passionate fans, it\'s a celebration of athleticism and sportsmanship, uniting players and spectators in the love of the game.',
        bannerImage: 'u19.jpg',
        galleryUrls: [
            '/images/u-19/two.jpg',
            '/images/u-19/three.jpg',
            '/images/u-19/four.jpg',
            '/images/u-19/five.jpg',
            '/images/u-19/six.jpg',
            '/images/u-19/seven.jpg'
        ]
    },
    '+2graduation': {
        title: '+2 Graduation',
        date: '2 Feb 2024',
        description: 'At Xavier\'s +2 graduation, students receive their degrees, marking the end of their academic journey and the beginning of new adventures with a grand celebration.',
        bannerImage: 'graduation-banner.png',
        galleryUrls: [
            '/images/graduation/two.jpg',
            '/images/graduation/graduation1.jpg',
            '/images/graduation/four.jpg',
            '/images/graduation/five.jpg',
            '/images/graduation/seven.jpg'
        ]
    },
    'rtx': {
        title: 'RTX',
        date: '15th Feb 2024',
        description: 'RTX: Rising Talent of Xavier is a captivating talent show spotlighting the diverse skills of Xavier\'s students. From dazzling performances to awe-inspiring acts, RTX is a showcase of creativity and talent within the Xavier community.',
        bannerImage: 'rtx-banner.jpg',
        galleryUrls: [
            '/images/rtx/two.jpg',
            '/images/rtx/one.jpg',
            '/images/rtx/three.jpg',
            '/images/rtx/four.jpg',
            '/images/rtx/five.jpg',
            '/images/rtx/six.jpg'
        ]
    },
    'test-1-img': {
        title: 'Single Image Showcase (1 Image)',
        date: '10th Oct 2026',
        description: 'Testing responsive layout with a single high-impact image.',
        bannerImage: 'banner-bg.jpg',
        galleryUrls: [
            '/images/u-19/two.jpg'
        ]
    },
    'test-6-img': {
        title: 'Balanced Six Images (6 Images)',
        date: '11th Oct 2026',
        description: 'Testing responsive layout with exactly six images.',
        bannerImage: 'banner-bg.jpg',
        galleryUrls: [
            '/images/u-19/two.jpg',
            '/images/u-19/three.jpg',
            '/images/u-19/four.jpg',
            '/images/u-19/five.jpg',
            '/images/u-19/six.jpg',
            '/images/u-19/seven.jpg'
        ]
    },
    'test-7-img': {
        title: 'Seven Images Test (7 Images)',
        date: '12th Oct 2026',
        description: 'Testing layout wrapping to extra row with seven images (previously broke 6-slot grid).',
        bannerImage: 'banner-bg.jpg',
        galleryUrls: [
            '/images/u-19/two.jpg',
            '/images/u-19/three.jpg',
            '/images/u-19/four.jpg',
            '/images/u-19/five.jpg',
            '/images/u-19/six.jpg',
            '/images/u-19/seven.jpg',
            '/images/ximun/fifteen.jpg'
        ]
    },
    'test-12-img': {
        title: 'Twelve Images Test (12 Images)',
        date: '13th Oct 2026',
        description: 'Testing multi-row wrapping with twelve images across desktop, tablet, and mobile.',
        bannerImage: 'banner-bg.jpg',
        galleryUrls: [
            '/images/u-19/two.jpg',
            '/images/u-19/three.jpg',
            '/images/u-19/four.jpg',
            '/images/u-19/five.jpg',
            '/images/u-19/six.jpg',
            '/images/u-19/seven.jpg',
            '/images/ximun/fifteen.jpg',
            '/images/ximun/three.jpg',
            '/images/ximun/fourthteen.jpg',
            '/images/ximun/sixteen.jpg',
            '/images/ximun/one.jpg',
            '/images/ximun/six.jpg'
        ]
    },
    'test-24-img': {
        title: 'Twenty-Four Images Test (24 Images)',
        date: '14th Oct 2026',
        description: 'Testing large gallery collection with 24 images preserving order and consistent aspect ratio.',
        bannerImage: 'banner-bg.jpg',
        galleryUrls: [
            '/images/u-19/two.jpg',
            '/images/u-19/three.jpg',
            '/images/u-19/four.jpg',
            '/images/u-19/five.jpg',
            '/images/u-19/six.jpg',
            '/images/u-19/seven.jpg',
            '/images/ximun/fifteen.jpg',
            '/images/ximun/three.jpg',
            '/images/ximun/fourthteen.jpg',
            '/images/ximun/sixteen.jpg',
            '/images/ximun/one.jpg',
            '/images/ximun/six.jpg',
            '/images/holi/holi +2.jpg',
            '/images/holi/ghjk.jpg',
            '/images/holi/holi 3.jpg',
            '/images/holi/holi 4.jpg',
            '/images/holi/holie.jpg',
            '/images/holi/holi 2.jpg',
            '/images/graduation/two.jpg',
            '/images/graduation/graduation1.jpg',
            '/images/graduation/four.jpg',
            '/images/graduation/five.jpg',
            '/images/graduation/seven.jpg',
            '/images/rtx/two.jpg'
        ]
    }
};

const LifeAtXavierSinglePage = () => {
    const { slug } = useParams();
    const [eventData, setEventData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [lightboxIndex, setLightboxIndex] = useState(null);

    const openLightbox = (index) => setLightboxIndex(index);
    const closeLightbox = () => setLightboxIndex(null);

    const showPrevImage = useCallback(() => {
        if (!eventData?.galleryUrls?.length) return;
        setLightboxIndex((prev) => (prev > 0 ? prev - 1 : eventData.galleryUrls.length - 1));
    }, [eventData]);

    const showNextImage = useCallback(() => {
        if (!eventData?.galleryUrls?.length) return;
        setLightboxIndex((prev) => (prev < eventData.galleryUrls.length - 1 ? prev + 1 : 0));
    }, [eventData]);

    // Keyboard navigation for Lightbox
    useEffect(() => {
        if (lightboxIndex === null) return;
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') closeLightbox();
            else if (e.key === 'ArrowLeft') showPrevImage();
            else if (e.key === 'ArrowRight') showNextImage();
        };
        window.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [lightboxIndex, showPrevImage, showNextImage]);

    useEffect(() => {
        if (window.initApp) {
            window.initApp();
        }
    }, [slug]);

    const formatDate = (dateVal) => {
        if (!dateVal) return '';
        const date = new Date(dateVal);
        if (isNaN(date.getTime())) return '';
        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    useEffect(() => {
        axios.get(getApiUrl(`/life-at-xavier/${slug}`))
            .then(res => {
                const dbData = res.data;
                const dateDisplay = formatDate(dbData.created_at);
                setEventData({
                    title: dbData.title,
                    date: dateDisplay,
                    description: dbData.description || null,
                    bannerImage: dbData.imageUrl || 'banner-bg.jpg', // generic banner for dynamic ones
                    galleryUrls: dbData.galleryUrls || [],
                    socialPosts: Array.isArray(dbData.socialPosts) ? dbData.socialPosts : []
                });
                setLoading(false);
            })
            .catch(err => {
                if (hardcodedData[slug]) {
                    setEventData({
                        ...hardcodedData[slug],
                        socialPosts: hardcodedData[slug].socialPosts || []
                    });
                    setLoading(false);
                } else {
                    console.error("Error fetching event details", err);
                    setLoading(false);
                }
            });
    }, [slug]);

    if (loading) return <div>Loading...</div>;
    if (!eventData) return <div>Event not found.</div>;

    return (
        <>
            <Banner
                normalTitle=""
                colorTitle=""
                firstHighlightColor=""
                secondHighlightColor=""
                bannerImage={getImageUrl(eventData.bannerImage)}
                overlay={false}
                pageName={[]}
            />

            <section className="acdemicAward">
                <img src="/images/homepage/course__bg-art.png" alt="" className="art" />
                <div className="container-lg">
                    <div className="academics__container">
                        <div className="section__heading-content">
                            <h2 className="section__heading">
                                {eventData.date && <span className="subTitle">{eventData.date}</span>}
                                {eventData.title}
                            </h2>
                            {eventData.description && <p>{eventData.description}</p>}
                        </div>
                    </div>
                    {eventData.galleryUrls && eventData.galleryUrls.length > 0 && (
                        <div 
                            className={`gallery gallery--count-${eventData.galleryUrls.length}`}
                            data-count={eventData.galleryUrls.length}
                        >
                            {eventData.galleryUrls.map((url, index) => (
                                <div 
                                    className={`gallery__item gallery__item--${index + 1}`} 
                                    key={index}
                                    onClick={() => openLightbox(index)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openLightbox(index); }}
                                    aria-label={`Open photo ${index + 1} of ${eventData.galleryUrls.length}`}
                                >
                                    <img 
                                        src={getImageUrl(url)} 
                                        alt={`${eventData.title} - photo ${index + 1}`} 
                                        className="gallery__img"
                                        loading="lazy"
                                    />
                                    <div className="gallery__overlay">
                                        <span className="gallery__order-chip">#{index + 1}</span>
                                        <div className="gallery__zoom-icon">
                                            <Maximize2 size={20} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Social Highlights Section */}
                    {eventData.socialPosts && eventData.socialPosts.length > 0 && (
                        <div className="socialHighlights">
                            <div className="socialHighlights__header">
                                <span className="socialHighlights__badgeSubtitle">Connect & Explore</span>
                                <h3 className="socialHighlights__title">Social Media Highlights</h3>
                                <p className="socialHighlights__intro">
                                    Browse featured moments, reels, and stories from {eventData.title} shared across our social channels.
                                </p>
                            </div>

                            <div className="socialHighlights__grid">
                                {eventData.socialPosts.map((post, idx) => {
                                    const meta = getPlatformMeta(post.platform);
                                    const thumbUrl = post.thumbnailUrl ? getImageUrl(post.thumbnailUrl) : null;
                                    return (
                                        <a
                                            key={post.id || idx}
                                            href={post.postUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="socialHighlights__card"
                                            aria-label={`View ${meta.name} post for ${eventData.title}`}
                                        >
                                            <div className="socialHighlights__media">
                                                {thumbUrl ? (
                                                    <img
                                                        src={thumbUrl}
                                                        alt={post.title || post.caption || `${meta.name} highlight thumbnail`}
                                                        className="socialHighlights__thumbImg"
                                                        loading="lazy"
                                                        onError={(e) => {
                                                            e.currentTarget.style.display = 'none';
                                                            const fallback = e.currentTarget.parentElement?.querySelector('.socialHighlights__thumbFallback');
                                                            if (fallback) fallback.style.display = 'flex';
                                                        }}
                                                    />
                                                ) : null}

                                                <div
                                                    className="socialHighlights__thumbFallback"
                                                    style={{
                                                        display: thumbUrl ? 'none' : 'flex',
                                                        background: meta.gradient
                                                    }}
                                                >
                                                    <SocialPlatformIcon platform={post.platform} size={48} color="#ffffff" />
                                                </div>

                                                <div className="socialHighlights__platformBadge">
                                                    <PlatformBadge platform={post.platform} />
                                                </div>

                                                <div className="socialHighlights__mediaOverlay">
                                                    <span className="socialHighlights__viewBtn">
                                                        <span>View Post</span>
                                                        <ExternalLink size={14} />
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="socialHighlights__body">
                                                <h4 className="socialHighlights__caption">
                                                    {post.title || post.caption || `Featured ${meta.name} Post`}
                                                </h4>
                                                <div className="socialHighlights__footer">
                                                    <span className="socialHighlights__footerPlatform">
                                                        <SocialPlatformIcon platform={post.platform} size={14} color={meta.color} />
                                                        <span>{meta.name}</span>
                                                    </span>
                                                    <span className="socialHighlights__externalLinkText">
                                                        Open post <ExternalLink size={12} />
                                                    </span>
                                                </div>
                                            </div>
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </section>
 
             {/* Fullscreen Lightbox Modal */}
             {lightboxIndex !== null && eventData.galleryUrls[lightboxIndex] && (
                 <div 
                     className="gallery-lightbox"
                     onClick={closeLightbox}
                     style={{
                         position: 'fixed',
                         inset: 0,
                         zIndex: 99999,
                         backgroundColor: 'rgba(2, 6, 23, 0.92)',
                         backdropFilter: 'blur(12px)',
                         WebkitBackdropFilter: 'blur(12px)',
                         display: 'flex',
                         flexDirection: 'column',
                         justifyContent: 'center',
                         alignItems: 'center',
                         animation: 'fadeIn 0.25s ease'
                     }}
                 >
                     {/* Lightbox Header Bar */}
                     <div 
                         onClick={(e) => e.stopPropagation()}
                         style={{
                             position: 'absolute',
                             top: 0,
                             left: 0,
                             right: 0,
                             padding: '1.25rem 2rem',
                             display: 'flex',
                             justifyContent: 'space-between',
                             alignItems: 'center',
                             background: 'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, transparent 100%)',
                             zIndex: 2
                         }}
                     >
                         <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                             <span style={{ color: '#fbbf24', fontWeight: '700', fontSize: '0.9rem', letterSpacing: '0.5px' }}>
                                 {lightboxIndex + 1} / {eventData.galleryUrls.length}
                             </span>
                             <span style={{ color: '#e2e8f0', fontSize: '0.9rem', fontWeight: '500' }}>
                                 {eventData.title}
                             </span>
                         </div>
                         <button
                             type="button"
                             onClick={closeLightbox}
                             aria-label="Close fullscreen preview"
                             style={{
                                 background: 'rgba(255, 255, 255, 0.1)',
                                 border: '1px solid rgba(255, 255, 255, 0.2)',
                                 color: '#ffffff',
                                 borderRadius: '50%',
                                 width: '40px',
                                 height: '40px',
                                 display: 'flex',
                                 alignItems: 'center',
                                 justifyContent: 'center',
                                 cursor: 'pointer',
                                 transition: 'background 0.2s ease'
                             }}
                             onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.8)'}
                             onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                         >
                             <X size={20} />
                         </button>
                     </div>

                     {/* Main Image Container */}
                     <div 
                         onClick={(e) => e.stopPropagation()}
                         style={{
                             position: 'relative',
                             maxWidth: '90vw',
                             maxHeight: '82vh',
                             display: 'flex',
                             alignItems: 'center',
                             justifyContent: 'center'
                         }}
                     >
                         <img 
                             src={getImageUrl(eventData.galleryUrls[lightboxIndex])}
                             alt={`${eventData.title} - photo ${lightboxIndex + 1}`}
                             style={{
                                 maxWidth: '90vw',
                                 maxHeight: '82vh',
                                 objectFit: 'contain',
                                 borderRadius: '10px',
                                 boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6)',
                                 border: '1px solid rgba(255, 255, 255, 0.1)'
                             }}
                         />
                     </div>

                     {/* Navigation Arrows */}
                     {eventData.galleryUrls.length > 1 && (
                         <>
                             <button
                                 type="button"
                                 onClick={(e) => { e.stopPropagation(); showPrevImage(); }}
                                 aria-label="Previous photo"
                                 style={{
                                     position: 'absolute',
                                     left: '1.5rem',
                                     top: '50%',
                                     transform: 'translateY(-50%)',
                                     background: 'rgba(2, 37, 111, 0.75)',
                                     border: '1px solid rgba(255, 255, 255, 0.2)',
                                     color: '#ffffff',
                                     borderRadius: '50%',
                                     width: '48px',
                                     height: '48px',
                                     display: 'flex',
                                     alignItems: 'center',
                                     justifyContent: 'center',
                                     cursor: 'pointer',
                                     boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                                     transition: 'all 0.2s ease',
                                     zIndex: 2
                                 }}
                                 onMouseEnter={(e) => e.currentTarget.style.background = '#02256F'}
                                 onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(2, 37, 111, 0.75)'}
                             >
                                 <ChevronLeft size={26} />
                             </button>

                             <button
                                 type="button"
                                 onClick={(e) => { e.stopPropagation(); showNextImage(); }}
                                 aria-label="Next photo"
                                 style={{
                                     position: 'absolute',
                                     right: '1.5rem',
                                     top: '50%',
                                     transform: 'translateY(-50%)',
                                     background: 'rgba(2, 37, 111, 0.75)',
                                     border: '1px solid rgba(255, 255, 255, 0.2)',
                                     color: '#ffffff',
                                     borderRadius: '50%',
                                     width: '48px',
                                     height: '48px',
                                     display: 'flex',
                                     alignItems: 'center',
                                     justifyContent: 'center',
                                     cursor: 'pointer',
                                     boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                                     transition: 'all 0.2s ease',
                                     zIndex: 2
                                 }}
                                 onMouseEnter={(e) => e.currentTarget.style.background = '#02256F'}
                                 onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(2, 37, 111, 0.75)'}
                             >
                                 <ChevronRight size={26} />
                             </button>
                         </>
                     )}
                 </div>
             )}

             <FooterCTA />
        </>
    );
};

export default LifeAtXavierSinglePage;

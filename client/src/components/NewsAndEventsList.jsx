import React, { useEffect, useState } from 'react';
import { fetchApiData } from '../services/apiClient';
import { Link } from 'react-router-dom';

const NewsAndEventsList = ({ limit }) => {
    const [newsAndEvents, setNewsAndEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const path = limit ? `/news-and-events?limit=${limit}` : '/news-and-events';
        
        fetchApiData(path)
            .then(data => {
                if (isMounted) {
                    setNewsAndEvents(data);
                    setLoading(false);
                }
            })
            .catch(err => {
                if (isMounted) {
                    console.error(err);
                    setLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [limit]);

    // Format date similar to original blade template 'd F Y'
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short', // Original was 'long', using 'short' as standard format fallback
            year: 'numeric'
        });
    };

    const hardcodedNews = [
        {
            id: 'hc-1',
            slug: 'blood-donation-program',
            created_at: '2024-02-07',
            title: 'Blood Donation Program',
            imageUrl: '/images/homepage/news/blood_donation.webp'
        },
        {
            id: 'hc-2',
            slug: 'eye-camp-visit',
            created_at: '2024-04-30',
            title: 'Eye Camp visit',
            imageUrl: '/images/homepage/news/eye_camp.webp'
        },
        {
            id: 'hc-3',
            slug: 'cricket-stadium-visit',
            created_at: '2024-05-05',
            title: 'Cricket Stadium Visit',
            imageUrl: '/images/homepage/news/cricket.webp'
        },
        {
            id: 'hc-4',
            slug: 'xavier-level-up-event',
            created_at: '2024-04-25',
            title: 'Xavier Level up Event',
            imageUrl: '/images/homepage/news/level_up.webp'
        }
    ];

    const allNews = [...newsAndEvents, ...hardcodedNews];

    const resolveImageUrl = (url) => {
        if (!url) return null;
        if (url.startsWith('http://') || url.startsWith('https://')) return url;
        const backendOrigin = import.meta.env.MODE === 'development' ? 'http://localhost:5000' : '';
        const cleanUrl = url.startsWith('/') ? url : `/${url}`;
        return `${backendOrigin}${cleanUrl}`;
    };

    return (
        <div className="newsAndEvents__list">
            {loading ? (
                <p>Loading...</p>
            ) : allNews.map((newsEvent, idx) => {
                const itemImg = resolveImageUrl(newsEvent.imageUrl);
                return (
                    <div className="item" key={newsEvent.id || idx}>
                        <Link to={`/news-and-events/${newsEvent.slug}`}></Link>
                        <div className="content">
                            <span>{formatDate(newsEvent.created_at)}</span>
                            <h4>{newsEvent.title}</h4>
                        </div>
                        {itemImg && (
                            <div className="img__holder">
                                <img src={itemImg} alt={newsEvent.title || 'News & Events'} loading="lazy" decoding="async" />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default NewsAndEventsList;

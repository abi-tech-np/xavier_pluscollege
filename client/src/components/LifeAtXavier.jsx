import React, { useEffect, useState } from 'react';
import { fetchApiData, getImageUrl } from '../services/apiClient';
import { Link } from 'react-router-dom';
import { SocialPlatformIcon } from './SocialPlatformIcon';

const LifeAtXavier = ({ limit }) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const path = limit ? `/life-at-xavier?limit=${limit}` : '/life-at-xavier';
        
        fetchApiData(path)
            .then(data => {
                if (isMounted) {
                    setItems(Array.isArray(data) ? data : []);
                    setLoading(false);
                }
            })
            .catch(err => {
                if (isMounted) {
                    console.error(err);
                    setItems([]);
                    setLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [limit]);


    const hardcodedItems = [
        {
            id: 'hc-1',
            slug: 'rtx',
            imageUrl: '/images/rtx/one.webp',
            date: '2024-01-01',
            title: 'RTX',
            description: "RTX: Rising Talent of Xavier is a captivating talent show spotlighting the diverse skills of Xavier's students. From dazzling performances to awe-inspiring acts, RTX is a showcase of creativity and talent within the Xavier community."
        },
        {
            id: 'hc-2',
            slug: 'holi',
            imageUrl: '/images/holi/holi 2.webp',
            date: '2024-01-01',
            title: 'Holi',
            description: "At Xavier, Holi is a vibrant celebration of colors and unity, where students come together to revel in joyous festivities, spreading cheers across the campus."
        },
        {
            id: 'hc-3',
            slug: '+2graduation',
            imageUrl: '/images/graduation/graduation__image.webp',
            date: '2024-01-01',
            title: '+2 Graduation',
            description: "At Xavier's +2 graduation, students receive their degrees, marking the end of their academic journey and the beginning of new adventures with a grand celebration."
        },
        {
            id: 'hc-4',
            slug: 'u-19',
            imageUrl: '/images/u-19/basket-ball.webp',
            date: '2024-01-01',
            title: 'U-19',
            description: "Xavier’s Under 19 Inter college Basketball Tournament is a thrilling showcase of young talent, where college teams compete in fast-paced matches. With electrifying plays and passionate fans, it's a celebration of athleticism and sportsmanship, uniting players and spectators in the love of the game."
        },
        {
            id: 'hc-5',
            slug: 'ximun',
            imageUrl: '/images/ximun/sixteen.webp',
            date: '2024-01-01',
            title: 'XIMUN',
            description: "Xavier International Model United Nations, is a prestigious event where students simulate diplomatic discussions and debates on global issues. It provides a platform for young minds to engage in issues from international perspectives."
        }
    ];

    const safeItems = Array.isArray(items) ? items : [];
    const apiSlugs = safeItems.map(item => item.slug);
    const filteredHardcodedItems = hardcodedItems.filter(item => !apiSlugs.includes(item.slug));
    const allItems = [...safeItems, ...filteredHardcodedItems];

    return (
        <div className="lifeAtXavier__list">
            {loading ? (
                <p>Loading...</p>
            ) : allItems.map((item) => (
                <div className="item" key={item.id}>
                    <Link to={`/life-at-xavier/${item.slug}`}></Link>
                    <img src={getImageUrl(item.imageUrl) || '/images/placeholder.jpg'} alt={item.title} loading="lazy" decoding="async" />
                    <div className="content">
                        <span>{item.date ? new Date(item.date).getFullYear() : (item.created_at ? new Date(item.created_at).getFullYear() : '2024')}</span>
                        <h4 className="title">{item.title}</h4>
                        {item.description && <p>{item.description}</p>}
                        {item.socialPosts && item.socialPosts.length > 0 && (
                            <div className="lifeAtXavier__socialBadges" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '10px', flexWrap: 'wrap' }}>
                                {Array.from(new Set(item.socialPosts.map(p => (p.platform || '').toLowerCase()))).map((platformKey) => (
                                    <span
                                        key={platformKey}
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: '24px',
                                            height: '24px',
                                            borderRadius: '9999px',
                                            background: 'rgba(255, 255, 255, 0.22)',
                                            backdropFilter: 'blur(6px)',
                                            boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
                                            color: '#ffffff',
                                            border: '1px solid rgba(255,255,255,0.3)'
                                        }}
                                        title={platformKey.toUpperCase()}
                                    >
                                        <SocialPlatformIcon platform={platformKey} size={12} color="#ffffff" />
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default LifeAtXavier;

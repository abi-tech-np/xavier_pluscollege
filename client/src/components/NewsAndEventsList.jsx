import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const NewsAndEventsList = ({ limit }) => {
    const [newsAndEvents, setNewsAndEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const url = limit ? `https://plus.xavier.edu.np/plus-api/api/news-and-events?limit=${limit}` : 'https://plus.xavier.edu.np/plus-api/api/news-and-events';
        axios.get(url)
            .then(res => {
                setNewsAndEvents(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

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
            imageUrl: '/images/homepage/news/blood_donation.jpg'
        },
        {
            id: 'hc-2',
            slug: 'eye-camp-visit',
            created_at: '2024-04-30',
            title: 'Eye Camp visit',
            imageUrl: '/images/homepage/news/eye_camp.jpg'
        },
        {
            id: 'hc-3',
            slug: 'cricket-stadium-visit',
            created_at: '2024-05-05',
            title: 'Cricket Stadium Visit',
            imageUrl: '/images/homepage/news/cricket.jpg'
        },
        {
            id: 'hc-4',
            slug: 'xavier-level-up-event',
            created_at: '2024-04-25',
            title: 'Xavier Level up Event',
            imageUrl: '/images/homepage/news/level_up.jpg'
        }
    ];

    const allNews = [...newsAndEvents, ...hardcodedNews];

    return (
        <div className="newsAndEvents__list">
            {loading ? (
                <p>Loading...</p>
            ) : allNews.map((newsEvent, idx) => (
                <div className="item" key={newsEvent.id || idx}>
                    <Link to={`/news-and-events/${newsEvent.slug}`}></Link>
                    <div className="content">
                        <span>{formatDate(newsEvent.created_at)}</span>
                        <h4>{newsEvent.title}</h4>
                    </div>
                    {newsEvent.imageUrl && (
                        <div className="img__holder">
                            <img src={newsEvent.imageUrl} alt="" />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default NewsAndEventsList;

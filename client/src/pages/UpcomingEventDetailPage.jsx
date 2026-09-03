import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { getApiUrl } from '../services/apiClient';
import Banner from '../components/Banner';
import FooterPassrate from '../components/FooterPassrate';

const hardcodedEvents = {
    '3rd-see-3v3-basketball-tournament': {
        title: '3rd SEE 3v3 Basketball Tournament',
        start_date: '2024-06-06',
        end_date: '2024-06-07',
        time: null,
        bannerImage: 'banner-bg.jpg',
        content: '<p>Join us for the exciting 3rd SEE 3v3 Basketball Tournament! Watch talented teams compete for the championship.</p>'
    },
    'a-level-seminar': {
        title: 'A Level Seminar',
        start_date: '2024-05-15',
        end_date: '2024-05-15',
        time: '10:30 am onwards',
        bannerImage: 'banner-bg.jpg',
        content: '<p>Gain valuable insights and information about our A Level program in this comprehensive seminar.</p>'
    },
    '2-seminar': {
        title: '+2 Seminar',
        start_date: '2024-05-15',
        end_date: '2024-05-15',
        time: '10:30 am onwards',
        bannerImage: 'banner-bg.jpg',
        content: '<p>Discover everything you need to know about our +2 programs and the opportunities they offer.</p>'
    },
    'a-level-orientation-program': {
        title: 'A Level Orientation Program',
        start_date: '2024-05-15',
        end_date: '2024-05-15',
        time: '10:00 am - 5:00 pm',
        bannerImage: 'banner-bg.jpg',
        content: '<p>Welcome to Xavier International College! Our orientation program will guide you through the exciting journey ahead in your A Level studies.</p>'
    }
};

const formatEventDate = (startDateStr, endDateStr) => {
    if (!startDateStr) return '';
    const startDate = new Date(startDateStr);
    const endDate = endDateStr ? new Date(endDateStr) : startDate;

    const startMonth = startDate.toLocaleString('en-US', { month: 'long' });
    const startDay = startDate.getDate();
    const startYear = startDate.getFullYear();

    const endMonth = endDate.toLocaleString('en-US', { month: 'long' });
    const endDay = endDate.getDate();
    const endYear = endDate.getFullYear();

    if (startMonth === endMonth && startDay === endDay) {
        return `${startDay} ${startMonth} ${startYear}`;
    } else if (startMonth === endMonth && startDay !== endDay) {
        return `${startDay} - ${endDay} ${startMonth} ${startYear}`;
    } else {
        return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${endYear}`;
    }
};

const UpcomingEventDetailPage = () => {
    const { slug } = useParams();
    const [eventData, setEventData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (window.initApp) {
            window.initApp();
        }

        if (hardcodedEvents[slug]) {
            setEventData(hardcodedEvents[slug]);
            setLoading(false);
            return;
        }

        axios.get(getApiUrl(`/upcoming-events/${slug}`))
            .then(res => {
                const data = res.data;
                data.bannerImage = data.imageUrls && data.imageUrls.length > 0 ? data.imageUrls[0] : 'banner-bg.jpg';
                setEventData(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError('Event not found');
                setLoading(false);
            });
    }, [slug]);

    if (loading) {
        return <div style={{ paddingTop: '100px', textAlign: 'center' }}>Loading...</div>;
    }

    if (error || !eventData) {
        return <div style={{ paddingTop: '100px', textAlign: 'center' }}>{error || 'Event not found'}</div>;
    }

    const pageName = [
        {
            link: '/upcoming-events',
            name: 'Upcoming Events',
        },
        {
            link: `/upcoming-events/${slug}`,
            name: eventData.title,
        }
    ];

    return (
        <>
            <Banner
                normalTitle=""
                colorTitle=""
                firstHighlightColor=""
                secondHighlightColor=""
                bannerImage={eventData.bannerImage}
                overlay={true}
                pageName={pageName}
            />

            <div className="event-detail-page">
                <div className="container-lg">
                    <div className="event-detail__container">
                        <div className="event-header">
                            <h2 className="event-title">{eventData.title}</h2>
                            <div className="event-meta">
                                <span className="meta-item">
                                    <i className="fa-solid fa-calendar"></i> {formatEventDate(eventData.start_date, eventData.end_date)}
                                </span>
                                {eventData.time && (
                                    <span className="meta-item">
                                        <i className="fa-regular fa-clock"></i> {eventData.time}
                                    </span>
                                )}
                                {eventData.location && (
                                    <span className="meta-item">
                                        <i className="fa-solid fa-location-dot"></i> {eventData.location}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="event-content" dangerouslySetInnerHTML={{ __html: eventData.content || '<p>No details available for this event.</p>' }}>
                        </div>

                        {eventData.imageUrls && eventData.imageUrls.length > 1 && (
                            <div className="event-gallery">
                                <h3>Event Gallery</h3>
                                <div className="gallery-grid">
                                    {eventData.imageUrls.slice(1).map((imgUrl, idx) => (
                                        <div className="gallery-item" key={idx}>
                                            <img src={imgUrl} alt={`Event gallery ${idx + 1}`} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <FooterPassrate />
        </>
    );
};

export default UpcomingEventDetailPage;

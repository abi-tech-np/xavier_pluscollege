import React, { useEffect, useState } from 'react';
import { fetchApiData } from '../services/apiClient';
import { Link } from 'react-router-dom';
import Banner from '../components/Banner';
import FooterPassrate from '../components/FooterPassrate';

const UpcomingEventsPage = () => {
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (window.initApp) {
            window.initApp();
        }

        fetchApiData('/upcoming-events')
            .then(data => {
                setUpcomingEvents(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const pageName = [
        {
            link: '/upcoming-events',
            name: 'Upcoming Event',
        }
    ];

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

        // 6 - 7th June 2024
        if (startMonth === endMonth && startDay === endDay) {
            return `${startDay} ${startMonth} ${startYear}`;
        } else if (startMonth === endMonth && startDay !== endDay) {
            return `${startDay} - ${endDay} ${startMonth} ${startYear}`;
        } else {
            return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${endYear}`;
        }
    };

    const hardcodedEvents = [
        {
            id: 'hc-1',
            slug: '3rd-see-3v3-basketball-tournament',
            title: '3rd SEE 3v3 Basketball Tournament',
            start_date: '2024-06-06',
            end_date: '2024-06-07',
            time: null,
            content: ''
        },
        {
            id: 'hc-2',
            slug: 'a-level-seminar',
            title: 'A Level Seminar',
            start_date: '2024-05-15',
            end_date: '2024-05-15',
            time: '10:30 am onwards ',
            content: ''
        },
        {
            id: 'hc-3',
            slug: '2-seminar',
            title: '+2 Seminar',
            start_date: '2024-05-15',
            end_date: '2024-05-15',
            time: '10:30 am onwards',
            content: ''
        },
        {
            id: 'hc-4',
            slug: 'a-level-orientation-program',
            title: <React.Fragment>A Level Orientation <br /> Program</React.Fragment>,
            start_date: '2024-05-15',
            end_date: '2024-05-15',
            time: '10:00 am - 5:00 pm',
            content: ''
        }
    ];

    const allEvents = [...upcomingEvents, ...hardcodedEvents];

    return (
        <>
            <Banner
                normalTitle="Upcoming"
                colorTitle="events"
                firstHighlightColor=""
                secondHighlightColor="#EA195D"
                bannerImage="banner-bg.jpg"
                overlay={true}
                pageName={pageName}
            />

            <div className="upcoming_events">
                <div className="container-lg">
                    <div className="upcoming_events__container">

                        {loading ? (
                            <p>Loading...</p>
                        ) : allEvents.map((event) => (
                            <div className="item" key={event.id}>
                                <div className="date-badge">
                                    <span className="day">{event.start_date ? new Date(event.start_date).getDate() : ''}</span>
                                    <span className="month">{event.start_date ? new Date(event.start_date).toLocaleString('en-US', { month: 'short' }) : ''}</span>
                                </div>
                                <div className="event-info">
                                    <h3 className="event-title">{event.title}</h3>
                                    <div className="event-meta">
                                        <span className="meta-item">
                                            <i className="fa-solid fa-calendar"></i> {formatEventDate(event.start_date, event.end_date)}
                                        </span>
                                        {event.time && (
                                            <span className="meta-item">
                                                <i className="fa-regular fa-clock"></i> {event.time}
                                            </span>
                                        )}
                                        {event.location && (
                                            <span className="meta-item">
                                                <i className="fa-solid fa-location-dot"></i> {event.location}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="action">
                                    <Link className="read-more-btn" to={`/upcoming-events/${event.slug || (typeof event.title === 'string' ? event.title.toLowerCase().trim().replace(/\\s+/g, '-').replace(/[^\\w\\-]+/g, '') : 'a-level-orientation-program')}`}>Read more &rarr;</Link>
                                </div>
                            </div>
                        ))}

                    </div>
                </div>
            </div>

            <FooterPassrate />
        </>
    );
};

export default UpcomingEventsPage;

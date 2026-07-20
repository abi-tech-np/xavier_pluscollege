import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Banner from '../components/Banner';
import FooterPassrate from '../components/FooterPassrate';

const UpcomingEventsPage = () => {
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (window.initApp) {
            window.initApp();
        }

        axios.get('http://localhost:5000/api/upcoming-events')
            .then(res => {
                setUpcomingEvents(res.data);
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
                        ) : upcomingEvents.map((event) => (
                            <div className="item" key={event.id}>
                                <div className="section__heading-content">
                                    <div className="background-color">
                                        <h2 className="section__heading events_heading">
                                            <span className="subTitle">
                                                <span><i className="fa-solid fa-calendar"></i> {formatEventDate(event.start_date, event.end_date)}</span>
                                                {event.location && <span><i className="fa-solid fa-location-dot"></i> {event.location}</span>}
                                            </span>
                                            <span className="event_Title">{event.title}</span>
                                        </h2>
                                    </div>
                                </div>
                                <div className="content__container" dangerouslySetInnerHTML={{ __html: event.content }}>
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

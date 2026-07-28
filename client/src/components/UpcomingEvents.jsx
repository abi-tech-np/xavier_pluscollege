import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const UpcomingEvents = ({ limit }) => {
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const url = limit ? `${import.meta.env.VITE_API_URL}/api/upcoming-events?limit=${limit}` : `${import.meta.env.VITE_API_URL}/api/upcoming-events`;
        axios.get(url)
            .then(res => {
                setUpcomingEvents(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const renderDate = (startDateStr, endDateStr) => {
        if (!startDateStr) return null;
        const startDate = new Date(startDateStr);
        const endDate = endDateStr ? new Date(endDateStr) : startDate;

        const startMonth = startDate.toLocaleString('en-US', { month: 'long' });
        const startDay = startDate.getDate();

        const endMonth = endDate.toLocaleString('en-US', { month: 'long' });
        const endDay = endDate.getDate();

        if (startMonth === endMonth && startDay === endDay) {
            return (
                <div className="date">
                    <span className="inner__date"><span>{startDay}</span></span>
                    {startMonth}
                </div>
            );
        } else if (startMonth === endMonth && startDay !== endDay) {
            return (
                <div className="date">
                    <span className="inner__date">
                        <span>{startDay}</span>
                        <span>{endDay}</span>
                    </span>
                    {startMonth}
                </div>
            );
        } else {
            return (
                <>
                    <div className="date">
                        <span className="inner__date"><span>{startDay}</span></span>
                        {startMonth}
                    </div>
                    <div className="date">
                        <span className="inner__date"><span>{endDay}</span></span>
                        {endMonth}
                    </div>
                </>
            );
        }
    };

    const hardcodedEvents = [
        {
            id: 'hc-1',
            title: '3rd SEE 3v3 Basketball Tournament',
            start_date: '2024-06-06',
            end_date: '2024-06-07',
            time: null
        },
        {
            id: 'hc-2',
            title: 'A Level Seminar',
            start_date: '2024-05-15',
            end_date: '2024-05-15',
            time: '10:30 am onwards '
        },
        {
            id: 'hc-3',
            title: '+2 Seminar',
            start_date: '2024-05-15',
            end_date: '2024-05-15',
            time: '10:30 am onwards'
        },
        {
            id: 'hc-4',
            title: <React.Fragment>A Level Orientation <br /> Program</React.Fragment>,
            start_date: '2024-05-15',
            end_date: '2024-05-15',
            time: '10:00 am - 5:00 pm'
        }
    ];

    const allEvents = [...upcomingEvents, ...hardcodedEvents];

    return (
        <section className="upcomingEvents" id="upcoming-events">
            <div className="container">
                <div className="upcomingEvents-container">
                    <div className="section__heading-content">
                        <h2 className="section__heading">
                            upcoming <span className="color-teal">events</span>
                        </h2>
                        <p>
                            Stay tuned for exciting upcoming events that will inspire and engage you.
                        </p>
                    </div>
                    <div className="upcomingEvents__list">

                        {loading ? (
                            <p>Loading...</p>
                        ) : allEvents.map((event) => (
                            <div className="item" key={event.id}>
                                <Link className="upcoming-event-link" to="/upcoming-events"></Link>
                                <div className="date__container">
                                    {renderDate(event.start_date, event.end_date)}
                                </div>
                                <div className="main__content">
                                    <h4>{event.title}</h4>
                                    {event.time && <span>{event.time}</span>}
                                </div>
                                <Link className="item-readmore" to="/upcoming-events">Read more</Link>
                            </div>
                        ))}

                    </div>
                </div>
            </div>
        </section>
    );
};

export default UpcomingEvents;

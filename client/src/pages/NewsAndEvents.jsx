import React, { useEffect } from 'react';
import Banner from '../components/Banner';
import NewsAndEventsList from '../components/NewsAndEventsList';
import UpcomingEventsList from '../components/UpcomingEvents'; // The component is named UpcomingEvents
import Testimonial from '../components/Testimonial';
import FooterPassrate from '../components/FooterPassrate';

const NewsAndEvents = () => {
    useEffect(() => {
        if (window.initApp) {
            window.initApp();
        }
    }, []);

    const pageName = [
        {
            link: '/news-and-events',
            name: 'News and Events',
        }
    ];

    return (
        <>
            <Banner
                normalTitle="news and"
                colorTitle="events"
                firstHighlightColor=""
                secondHighlightColor="#EA195D"
                bannerImage="banner-bg.jpg"
                overlay={true}
                pageName={pageName}
            />

            <section className="newsAndEvents">
                <div className="container">
                    <div className="newsAndEvents-container">
                        <NewsAndEventsList />
                    </div>
                </div>
            </section>

            <UpcomingEventsList />

            <div className="news-testimonial">
                <Testimonial />
            </div>

            <section className="brochure">
                <div className="container">
                    <div className="brochure__container">
                        <div className="content">
                            <h4 className="title">download e-magazine</h4>
                            <p>
                                Welcome to Xavier International College! Here, we prioritise academic excellence.
                            </p>
                        </div>
                        <a href="/apply-now#form" className="brochure__btn">
                            download now 
                            <svg width="14" height="17" viewBox="0 0 14 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0 17H14V15H0V17ZM14 6H10V0H4V6H0L7 13L14 6Z" fill="#0085D7" />
                            </svg>
                        </a>
                    </div>
                </div>
            </section>

            <FooterPassrate />
        </>
    );
};

export default NewsAndEvents;

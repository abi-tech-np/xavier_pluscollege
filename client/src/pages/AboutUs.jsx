import React, { useEffect } from 'react';
import Banner from '../components/Banner';
import Awards from '../components/Awards';
import FooterCTA from '../components/FooterCTA';

const AboutUs = () => {
    useEffect(() => {
        if (window.initApp) {
            window.initApp();
        }
    }, []);

    const pageName = [
        {
            link: '/about-us',
            name: 'about us',
        }
    ];

    return (
        <>
            <Banner
                normalTitle="about"
                colorTitle="us"
                firstHighlightColor=""
                secondHighlightColor="#F69D1D"
                bannerImage="banner-bg.jpg"
                overlay={true}
                pageName={pageName}
            />

            <section className="about">
                <div className="container">
                    <div className="about__us-container">
                        <div className="section__heading-content">
                            <h2 className="section__heading">
                                <span className="subTitle">welcome to</span>
                                <span className="pink-letter">x</span>avier <span className="green-letter">i</span>nternational <span>
                                    <span className="blue-letter">c</span>ollege
                                </span>
                            </h2>
                            <p>
                                Find out more about Xavier's focus on academic excellence and holistic development below.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            
            <section className="our__statement">
                <div id="statement"></div>
                <div className="container">
                    <div className="our__statement-container">
                        <div className="card vision-card">
                            <div className="card__body">
                                <img src="/images/aboutpage/vision.png" alt="" />
                                <h4 className="card__title">Vision</h4>
                                <p>By 2030, Xavier International will be one of the leading Educational Institutions in Nepal,
                                    providing Quality Education.</p>
                            </div>
                        </div>
                        <div className="card values-card">
                            <div className="card__body">
                                <img src="/images/aboutpage/values.png" alt="" />
                                <h4 className="card__title">Values</h4>
                                <p>Respect, Integrity, Trust, Service, Caring, Discipline, and Inclusivity. </p>
                            </div>
                        </div>
                        <div className="card mission-card">
                            <div className="card__body">
                                <img src="/images/aboutpage/mission.png" alt="" />
                                <h4 className="card__title">Mission</h4>
                                <p>To provide academic excellence in a responsible environment emphasizing the holistic development
                                    of a child, integrating technology in education to make our students ‘Future Ready’.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="message">
                <div id="message"></div>
                <div className="container">
                    <div className="message__container">
                        <div className="img__holder">
                            <img src="/images/aboutpage/chairman.png" alt="" />
                        </div>
                        <div className="message-container">
                            <div className="message-box">
                                <h3>Message From <br />
                                    Chairman</h3>
                                <p>Welcome to Xavier International College! As the chairman of this
                                    esteemed institution, it brings me immense pleasure to extend a warm
                                    welcome to you as you begin your academic journey with us.
                                    At Xavier International, we are committed to nurturing academic
                                    achievement, personal development, and a lively learning environment.
                                    Our unique teaching techniques and broad course options have been
                                    thoughtfully crafted to stir up your intellectual curiosity while also
                                    providing you with the skills and information you need for your chosen
                                    careers.
                                </p>
                                <p>We are more than just classrooms. We are a catalyst for personal
                                    growth, leadership development, and a thriving community of
                                    passionate learners. Our vibrant extracurricular scene offers ample
                                    opportunities for you to explore your passions, take on challenges, and
                                    forge lifelong connections.
                                    I look forward to seeing you excel, lead, and innovate during your time
                                    at Xavier International College.
                                </p>
                            </div>
                            <div className="personal-details">
                                <div className="text-container">
                                    <h4 className="name">Lok Bahadur Bhandari</h4>
                                    <p className="title">Chairman</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Awards />
            <FooterCTA />
        </>
    );
};

export default AboutUs;

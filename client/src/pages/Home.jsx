import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Courses from '../components/Courses';
import LifeAtXavier from '../components/LifeAtXavier';
import UpcomingEvents from '../components/UpcomingEvents';
import NewsAndEventsList from '../components/NewsAndEventsList';
import Testimonial from '../components/Testimonial';
import Awards from '../components/Awards';
import Infrastructure from '../components/Infrastructure';
import LazyVideo from '../components/LazyVideo';

const HERO_BANNER_SOURCES = {
    desktop: [
        { src: "/images/homepage/banner__video-desktop.webm", type: "video/webm" },
        { src: "/images/homepage/banner__video-optimized.mp4", type: "video/mp4" }
    ],
    mobile: [
        { src: "/images/homepage/banner__video-mobile.webm", type: "video/webm" },
        { src: "/images/homepage/banner__video-optimized.mp4", type: "video/mp4" }
    ]
};

const Home = () => {
    // Track all alumni video elements to enforce single-playback
    const alumniVideosRef = useRef([]);
    const handleVideoPlay = useCallback((playingVideo) => {
        alumniVideosRef.current.forEach(v => {
            if (v && v !== playingVideo && !v.paused) {
                v.pause();
            }
        });
    }, []);
    // We will fetch real data from Node.js backend later
    const [popup, setPopup] = useState(null);

    return (
        <>
            {/* Popup component will go here if popup data exists */}
            <section className="hero__banner">
                <div className="container-lg">
                    <div className="mask">
                        <LazyVideo 
                            autoPlay 
                            muted 
                            playsInline 
                            loop 
                            preload="metadata"
                            poster="/images/homepage/banner__video-poster.jpg"
                            sources={HERO_BANNER_SOURCES}
                        />
                    </div>
                </div>
            </section>

            <section className="our__feature">
                <div className="container-lg">
                    <div className="our__feature-container">
                        <div className="item">
                            <div className="content">
                                <div className="title">
                                    <img src="/images/homepage/success.svg" alt="" />
                                </div>
                                <div className="inner__content">
                                    <hr />
                                    <ul>
                                        <li><a href="/#awards"> Our Awards </a></li>
                                        <li><a href="/#alumni"> Our Alumni</a></li>
                                        <li><Link to="/about-us#statement"> Vision Statement</Link></li>
                                        <li><Link to="/about-us#statement"> Values</Link></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="item">
                            <div className="content">
                                <div className="title">
                                    <img src="/images/homepage/skill.svg" alt="" />
                                </div>
                                <div className="inner__content">
                                    <hr />
                                    <ul>
                                        <li><Link to="/skill/skill-training"> Skill Training</Link></li>
                                        <li><Link to="/skill/xavier-clubs"> Xavier Clubs</Link></li>
                                        <li><Link to="/skill/educational-tours"> Educational Tours</Link></li>
                                        <li><Link to="/skill/excursions">Excursions</Link></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="item">
                            <div className="content">
                                <div className="title">
                                    <img src="/images/homepage/grades.svg" alt="" />
                                </div>
                                <div className="inner__content">
                                    <hr />
                                    <div className="course__list">
                                        <h5 className="course__title" id="AlevelList">A level <i className="fa-solid fa-angle-right"></i></h5>
                                        <ul className="extra-space">
                                            <li><Link to="/our-courses/alevel_science"> Science</Link></li>
                                            <li><Link to="/our-courses/alevel_non-science"> Non-Science</Link></li>
                                        </ul>
                                    </div>
                                    <div className="course__list active">
                                        <h5 className="course__title" id="plusTwoList">+2 <i className="fa-solid fa-angle-right"></i></h5>
                                        <ul>
                                            <li><Link to="/our-courses/management"> management</Link></li>
                                            <li><Link to="/our-courses/humanities"> humanities</Link></li>
                                            <li><Link to="/our-courses/science"> science</Link></li>
                                            <li><Link to="/our-courses/law"> law</Link></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="item">
                            <div className="content">
                                <div className="title">
                                    <img src="/images/homepage/lifestyle.svg" alt="" />
                                </div>
                                <div className="inner__content">
                                    <hr />
                                    <ul>
                                        <li><Link to="/life-at-xavier/+2graduation">graduation ceremony</Link></li>
                                        <li><Link to="/life-at-xavier/ximun"> XIMUN</Link></li>
                                        <li><Link to="/life-at-xavier/holi"> Holi Utsav</Link></li>
                                        <li><Link to="/life-at-xavier/rtx"> rising talent of xavier</Link></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="item">
                            <div className="content">
                                <div className="title">
                                    <img src="/images/homepage/studies.svg" alt="" />
                                </div>
                                <div className="inner__content">
                                    <hr />
                                    <ul>
                                        <li><Link to="/studies/modern-campus"> Modern Campus</Link></li>
                                        <li><Link to="/studies/hands-on-learning"> Hands-on Learning</Link></li>
                                        <li><Link to="/studies/career-counselling">Career Counselling</Link></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="about__us" id="about">
                <img src="/images/homepage/aboutUs.png" alt="" className="bg-image" />
                <div className="container">
                    <div className="about__us-container">
                        <div className="section__heading-content">
                            <h2 className="section__heading">
                                <span className="subTitle">welcome to</span>
                                <span className="color-red">x</span>avier <span className="color-light-green">i</span>nternational <span className="color-green">c</span>ollege
                            </h2>
                            <p>
                                Explore a diverse range of subjects in our engaging curriculum. Our highly qualified faculty are
                                more than just instructors, they're dedicated mentors who guide and motivate you to achieve your
                                academic goals. At Xavier, we exceed expectations.
                            </p>
                            <Link to="/about-us" className="btn"><span>Read More</span></Link>
                        </div>
                    </div>
                </div>
            </section>

            <section className="animation__section">
                <div className="letterI"></div>
                <div className="logo">
                    <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1478 1230">
                        <path d="M1168.47 1086.53H1015.3L854.519 875.429l-21.497-28.383-.896-.887-17.467 23.505-76.584 100.226-21.945 28.827-66.732 87.813-26.871 35.03v.44l-81.959 107.33H4.477L86.435 1122v-.44l26.872-35.03L447.86 646.592l76.585 100.67-258.417 339.268-26.424 35.03-.448.44h231.545l.448-.44 26.424-35.03 142.868-187.153 21.945-29.27 76.585-100.227 17.466-23.505 76.585-100.227 75.689 99.784.895.443 21.498 28.383 237.366 311.772Z" fill="#0085D7" />
                        <path d="M1473.47 1229.33H935.585l-81.959-107.32v-.44l-26.424-35.04-66.732-87.364 76.137-100.671 143.316 188.035 26.867 35.04v.44h231.55v-.44l-26.87-35.04-258.867-340.149-21.497-28.383-.448-.887-76.136-99.34-17.467-23.505-21.945 28.383-76.137 100.671-17.914 23.061-76.585 100.67-182.28 239.479H309.473l258.864-340.149-21.945-28.383-76.136-100.227-.448-.444-21.946-29.269-330.074-433.726-26.872-35.035L0 0h537.435L716.58 235.046l-76.585 100.227-137.941-180.941-26.424-35.035H243.637h.448l26.424 35.035 253.49 333.499 22.393 28.826v.443l76.585 100.671 21.497 28.383 17.914-23.505 76.585-100.227 21.497-28.383 76.585-100.67L859 364.099l159.89-209.767h152.72L935.585 464.769l-21.946 29.27 17.467 23.061 75.684 99.784.9.887 21.5 27.939 444.28 583.62Z" fill="#02256F" />
                        <path d="m1420.11 75.835 3.58-6.652-38.07 50.114-26.87 35.035-329.62 433.282-76.141-99.784 253.941-333.498 26.87-35.035h-231.55l-26.868 35.035-137.941 181.384-21.945 29.27-76.585 100.67-21.945 28.383-76.137 100.227-76.584-100.227-.448-.443-21.945-29.27-236.024-309.994h152.721l159.439 209.767 22.393 28.826.448.444 21.498-28.383 76.584-100.671 21.945-28.826 61.805-81.157 26.424-35.035L940.001 0h537.439l-57.33 75.835Z" fill="#0085D7" />
                    </svg>
                </div>
            </section>

            <Courses />

            <section className="lifeAtXavier" id="life-at-xavier">
                <img src="/images/homepage/course__bg-art.png" alt="" className="art" />
                <div className="container">
                    <div className="lifeAtXavier-container">
                        <div className="section__heading-content">
                            <h2 className="section__heading">
                                <span className="color-light-green">Life</span> at <br />
                                Xavier International
                            </h2>
                            <p>Discover the vibrant community and endless possibilities that await you at Xavier.</p>
                            <Link to="/life-at-xavier" className="btn"><span>View More</span></Link>
                        </div>
                        <LifeAtXavier limit={6} />
                    </div>
                </div>
            </section>

            <UpcomingEvents limit={4} />

            <section className="newsAndEvents" id="news-and-events">
                <img src="/images/homepage/course__bg-art.png" alt="" className="art" />
                <div className="container">
                    <div className="newsAndEvents-container">
                        <div className="section__heading-content">
                            <h2 className="section__heading">News and <span className="color-red">Events</span></h2>
                            <p>Revisit past events and get the latest news on upcoming events here.</p>
                            <Link to="/news-and-events" className="btn"><span>View More</span></Link>
                        </div>
                        <NewsAndEventsList limit={4} />
                    </div>
                </div>
            </section>

            <Testimonial />

            <section className="alumni">
                <div className="container">
                    <div className="alumni-container">
                        <div className="section__heading-content">
                            <h2 className="section__heading">what <br /> our students <span className="color-teal-dark">says</span></h2>
                            <p>Learn about Xavier International from our students' perspectives.</p>
                        </div>
                        <div className="alumni__list swiper">
                            <div className="swiper-wrapper">
                                <div className="swiper-slide item">
                                    <LazyVideo
                                        src="/video/ang-dawa-lama-optimized.mp4"
                                        poster="/video/thumbnail-one.webp"
                                        controls={true}
                                        onPlay={handleVideoPlay}
                                        ref={el => { if (el) alumniVideosRef.current[0] = el; }}
                                    />
                                </div>
                                <div className="swiper-slide item">
                                    <LazyVideo
                                        src="/video/smriti-adhikari-optimized.mp4"
                                        poster="/video/thumbnail-two.webp"
                                        controls={true}
                                        onPlay={handleVideoPlay}
                                        ref={el => { if (el) alumniVideosRef.current[1] = el; }}
                                    />
                                </div>
                                <div className="swiper-slide item">
                                    <LazyVideo
                                        src="/video/pratik-pandit-optimized.mp4"
                                        poster="/video/thumbnail-three.webp"
                                        controls={true}
                                        onPlay={handleVideoPlay}
                                        ref={el => { if (el) alumniVideosRef.current[2] = el; }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Awards />
            <Infrastructure />

            <section className="footer__CTA">
                <div className="container">
                    <div className="footer__CTA-container">
                        <h2 className="cta__heading">Level Up with <span>Xavier International College</span></h2>
                        <p>Welcome to Xavier International College! Here, we prioritise academic excellence, personal growth, and fostering a vibrant community of learners.</p>
                        <div className="btns">
                            <Link to="/contact-us" className="btn"><span>contact us</span></Link>
                            <Link to="/apply-now" className="btn"><span>Apply now</span></Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Home;

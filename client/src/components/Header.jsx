import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    const openMenu = () => {
        setIsMenuOpen(true);
        document.querySelector("html").style.overflow = "hidden";
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
        const html = document.querySelector("html");
        if (html) {
            html.style.overflow = "auto";
            html.style.overflowY = "auto";
        }
    };

    const toggleMenu = () => {
        if (isMenuOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    };

    // Close menu on route or hash change
    useEffect(() => {
        if (isMenuOpen) {
            closeMenu();
        }
    }, [location.pathname, location.hash]);

    // Handle escape key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape' && isMenuOpen) {
                closeMenu();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isMenuOpen]);

    return (
        <>
            <header>
                <div className="container-lg">
                    <nav>
                        <ul className="menu left-nav">
                            <li className="academics-level">
                                <Link className="nav-academic-stage" id="academic__stage" to="/">Home</Link>
                            </li>
                            <li><Link to="/about-us">About Us</Link> </li>
                            <li><Link to="/life-at-xavier">Life at Xavier</Link></li>
                        </ul>
                        <div className="logo">
                            <Link to="/"><img src="/images/logo.svg" alt="Xavier International" /></Link>
                        </div>
                        <div className="right-nav">
                            <ul className="menu ">
                                <li><Link to="/our-courses">Courses</Link></li>
                                <li><Link to="/news-and-events">News & Events</Link></li>
                                <li><Link to="/contact-us">Contact Us</Link></li>
                            </ul>
                            <div 
                                id="hamburger-menu" 
                                className={`hamburger-icon ${isMenuOpen ? 'hamburger-open menu-open' : 'menu-close'}`} 
                                onClick={toggleMenu}
                            >
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    </nav>
                </div>
            </header>
            <section className="fullPage-menu" id="myNav" style={{ transform: isMenuOpen ? 'translateY(0)' : 'translateY(-200%)' }}>
                <div className="overlay" id="full__menu-overlay" onClick={closeMenu}></div>
                <div className="fullPage-menu__container">
                    <div className="container">
                        <div className="fullPage-menu__menu">
                            <div className="menu-item">
                                <h6><Link to="/about-us" onClick={closeMenu}>ABOUT</Link></h6>
                                <ul>
                                    <li><Link to="/about-us" onClick={closeMenu}>About Xavier</Link></li>
                                    <li><Link to="/about-us#statement" onClick={closeMenu}>Mission, Vision & Values</Link></li>
                                    <li><Link to="/about-us#message" onClick={closeMenu}>Message From Chairman</Link></li>
                                    <li><a href="/#awards" onClick={closeMenu}>Xavier International Awards</a></li>
                                </ul>
                            </div>
                            <div className="menu-item">
                                <h6><Link to="/life-at-xavier" onClick={closeMenu}>LIFESTYLE</Link></h6>
                                <ul>
                                    <li><Link to="/life-at-xavier/ximun" onClick={closeMenu}>XIMUN</Link></li>
                                    <li><Link to="/life-at-xavier/holi" onClick={closeMenu}>Holi Utsav</Link></li>
                                    <li><Link to="/life-at-xavier/rtx" onClick={closeMenu}>Rising Talent of Xavier</Link></li>
                                    <li><Link to="/life-at-xavier/u-19" onClick={closeMenu}>U-19 Basketball Tournament</Link></li>
                                </ul>
                            </div>
                            <div className="menu-item">
                                <h6><Link to="/our-courses" onClick={closeMenu}>OUR COURSES</Link></h6>
                                <div className="menu-list">
                                    <ul>
                                        <li className="menu-courses"><a href="#">A Level</a></li>
                                        <li><Link to="/our-courses/alevel_science" onClick={closeMenu}>Science</Link></li>
                                        <li><Link to="/our-courses/alevel_non-science" onClick={closeMenu}>Non-Science</Link></li>
                                    </ul>
                                    <ul>
                                        <li className="menu-courses"><a href="#">+ 2</a></li>
                                        <li><Link to="/our-courses/law" onClick={closeMenu}>Law</Link></li>
                                        <li><Link to="/our-courses/science" onClick={closeMenu}>Science</Link></li>
                                        <li><Link to="/our-courses/humanities" onClick={closeMenu}>Humanities</Link></li>
                                        <li><Link to="/our-courses/management" onClick={closeMenu}>Management</Link></li>
                                    </ul>
                                </div>
                            </div>
                            <div className="menu-item">
                                <h6><Link to="/news-and-events" onClick={closeMenu}>News & Events</Link></h6>
                                <ul>
                                    <li><Link to="/news-and-events/blood-donation-program" onClick={closeMenu}>Blood Donation</Link></li>
                                    <li><Link to="/news-and-events/eye-camp-visit" onClick={closeMenu}>Eye Camp Visit</Link></li>
                                    <li><Link to="/news-and-events/cricket-stadium-visit" onClick={closeMenu}>Cricket Stadium Visit</Link></li>
                                    <li><Link to="/news-and-events/xavier-level-up-event" onClick={closeMenu}>Xavier Level Up</Link></li>
                                </ul>
                            </div>
                            <div className="menu-item menu__btns">
                                <Link to="/apply-now" className="menu__btn" onClick={closeMenu}>Admission</Link>
                                <Link to="/contact-us" className="menu__btn" onClick={closeMenu}>Contact Us</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Header;

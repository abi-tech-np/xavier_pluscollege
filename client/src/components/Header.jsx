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
        document.querySelector("html").style.overflowY = "auto";
    };

    const toggleMenu = () => {
        if (isMenuOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    };

    // Close menu on route change
    useEffect(() => {
        if (isMenuOpen) {
            closeMenu();
        }
    }, [location.pathname]);

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
                                <h6>ABOUT</h6>
                                <ul>
                                    <li><Link to="/about-us">About Xavier</Link></li>
                                    <li><Link to="/about-us#statement">Mission, Vision & Values</Link></li>
                                    <li><Link to="/about-us#message">Message From Chairman</Link></li>
                                    <li><a href="/#awards">Xavier International Awards</a></li>
                                </ul>
                            </div>
                            <div className="menu-item">
                                <h6>LIFESTYLE</h6>
                                <ul>
                                    <li><Link to="/life-at-xavier/ximun">XIMUN</Link></li>
                                    <li><Link to="/life-at-xavier/holi">Holi Utsav</Link></li>
                                    <li><Link to="/life-at-xavier/rtx">Rising Talent of Xavier</Link></li>
                                    <li><Link to="/life-at-xavier/u-19">U-19 Basketball Tournament</Link></li>
                                </ul>
                            </div>
                            <div className="menu-item">
                                <h6>OUR COURSES</h6>
                                <div className="menu-list">
                                    <ul>
                                        <li className="menu-courses"><a href="#">A Level</a></li>
                                        <li><Link to="/our-courses/alevel_science">Science</Link></li>
                                        <li><Link to="/our-courses/alevel_non-science">Non-Science</Link></li>
                                    </ul>
                                    <ul>
                                        <li className="menu-courses"><a href="#">+ 2</a></li>
                                        <li><Link to="/our-courses/law">Law</Link></li>
                                        <li><Link to="/our-courses/science">Science</Link></li>
                                        <li><Link to="/our-courses/humanities">Humanities</Link></li>
                                        <li><Link to="/our-courses/management">Management</Link></li>
                                    </ul>
                                </div>
                            </div>
                            <div className="menu-item">
                                <h6><Link to="/news-and-events">News & Events</Link></h6>
                                <ul>
                                    <li><Link to="/news-and-events">Blood Donation</Link></li>
                                    <li><Link to="/news-and-events">Under-19 Basketball</Link></li>
                                    <li><Link to="/news-and-events">Futsal Tournament</Link></li>
                                    <li><Link to="/news-and-events">XIMUN</Link></li>
                                </ul>
                            </div>
                            <div className="menu-item menu__btns">
                                <Link to="/apply-now" className="menu__btn">Admission</Link>
                                <Link to="/contact-us" className="menu__btn">Contact Us</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Header;

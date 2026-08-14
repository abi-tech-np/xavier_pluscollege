import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer>
            <img src="/images/footer/bg-image.webp" alt="" className="bg-art" loading="lazy" />
            <div className="upper__footer">
                <picture>
                    <source srcSet="/images/footer/footer-mobile.svg" media="(max-width: 991px)" />
                    <img src="/images/footer/footer-desktop.svg" alt="" className="bg" />
                </picture>
                <div className="logo">
                    <img src="/images/footer-logo.svg" alt="" />
                </div>
            </div>
            <div className="lower__footer">
                <div className="container">
                    <div className="lower__footer-container">
                        <ul className="footer__menu">
                            <li><a href="/#about">about</a></li>
                            <li><a href="/#academics">academics</a></li>
                            <li><a href="/#infrastructure">infrastructure</a></li>
                            <li><a href="/#news-and-events">news and events</a></li>
                            <li><a href="/#life-at-xavier">life at Xavier</a></li>
                            <li><Link to="/news-and-events#upcoming-events">notice</Link></li>
                        </ul>
                        <p>
                            Thank you for considering Xavier International College for your educational needs.
                        </p>
                        <ul className="social__links">
                            <li><a target="_blank" rel="noreferrer" href="https://www.facebook.com/xavierinternationalcollege"><i className="fa-brands fa-facebook-f"></i></a></li>
                            <li><a target="_blank" rel="noreferrer" href="https://www.youtube.com/@xavierinternationalcollege"><i className="fa-brands fa-youtube"></i></a></li>
                            <li><a target="_blank" rel="noreferrer" href="https://www.instagram.com/xavierinternational/"><i className="fa-brands fa-instagram"></i></a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="copy">
                <div className="container">
                    <p>{new Date().getFullYear()} xavier international college. all right reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

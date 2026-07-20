import React from 'react';
import { Link } from 'react-router-dom';

const FooterCTA = () => {
    return (
        <section className="footer__CTA">
            <div className="container">
                <div className="footer__CTA-container">
                    <h2 className="cta__heading">
                        Level Up with
                        <span>Xavier International College</span>
                    </h2>
                    <p>
                        Welcome to Xavier International College! Here, we prioritise academic excellence, personal growth, and
                        fostering a vibrant community of learners.
                    </p>
                    <div className="btns">
                        <Link to="/contact-us" className="btn"><span>contact us</span></Link>
                        <Link to="/apply-now" className="btn"><span>Apply now</span></Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FooterCTA;

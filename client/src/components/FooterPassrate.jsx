import React from 'react';
import { Link } from 'react-router-dom';

const FooterPassrate = () => {
    return (
        <section className="footer__passrate">
            <div className="container">
                <div className="footer__CTA-container">
                    <h2 className="cta__heading">
                        <span>98%</span>
                        overall pass rate
                    </h2>
                    <p>
                        We are committed to your success at Xavier International, where our dedication to achievement shines
                        through.
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

export default FooterPassrate;

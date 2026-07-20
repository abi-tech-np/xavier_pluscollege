import React from 'react';
import { Link } from 'react-router-dom';

const Brochure = () => {
    return (
        <section className="brochure">
            <div className="container">
                <div className="brochure__container">
                    <div className="content">
                        <h4 className="title">download e-brochure</h4>
                        <p>
                            Please fill the inquiry form to download your free E-Brochure. Submit now to get immediate access to exclusive information about our college.
                        </p>
                    </div>
                    <Link to="/apply-now#form" className="brochure__btn">
                        download now{' '}
                        <svg width="14" height="17" viewBox="0 0 14 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 17H14V15H0V17ZM14 6H10V0H4V6H0L7 13L14 6Z" fill="#0085D7" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Brochure;

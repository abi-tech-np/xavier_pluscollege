import React from 'react';
import { Link } from 'react-router-dom';

const Infrastructure = () => {
    return (
        <section className="infrastructure__component" id="infrastructure">
            <img src="/images/homepage/infrastructure/infrastructure__bg.png" alt="" className="art" />
            <div className="container">
                <div className="infrastructure-container">
                    <div className="section__heading-content">
                        <h2 className="section__heading">
                            <span className="color-blue">Infrastructure</span> <br />
                            at Xavier International
                        </h2>
                        <p>
                            Our college prioritizes a conducive environment for learning, research, and personal growth.
                            Here's what we offer
                        </p>
                    </div>
                    <div className="infrastructure__list">
                        <div className="item">
                            <div className="content">
                                <h4 className="title">Modern Campus</h4>
                                <div className="inner__content">
                                    <hr />
                                    <ul>
                                        <li><Link to="#">digital classrooms</Link></li>
                                        <li><Link to="#">seminar rooms</Link></li>
                                        <li><Link to="#">lecture halls</Link></li>
                                        <li><Link to="#">classrooms</Link></li>
                                    </ul>
                                </div>
                            </div>
                            <img src="/images/homepage/infrastructure/one-new.png" alt="" className="bg-image" loading="lazy" />
                        </div>
                        <div className="item">
                            <div className="content">
                                <h4 className="title">Technological Integration</h4>
                                <div className="inner__content">
                                    <hr />
                                    <ul>
                                        <li><Link to="#">academic affairs</Link></li>
                                        <li><Link to="#">student services</Link></li>
                                        <li><Link to="#">admissions</Link></li>
                                        <li><Link to="#">finance</Link></li>
                                    </ul>
                                </div>
                            </div>
                            <img src="/images/homepage/infrastructure/two-new.png" alt="" className="bg-image" loading="lazy" />
                        </div>
                        <div className="item">
                            <div className="content">
                                <h4 className="title">Cutting-Edge Facilities</h4>
                                <div className="inner__content">
                                    <hr />
                                    <ul>
                                        <li><Link to="#">Table Tennis</Link></li>
                                        <li><Link to="#">badminton</Link></li>
                                        <li><Link to="#">basketball</Link></li>
                                        <li><Link to="#">Chess</Link></li>
                                    </ul>
                                </div>
                            </div>
                            <img src="/images/homepage/infrastructure/cutting-edge.webp" alt="" className="bg-image" loading="lazy" />
                        </div>
                        <div className="item">
                            <div className="content">
                                <h4 className="title">Refresh Zone</h4>
                                <div className="inner__content">
                                    <hr />
                                    <ul>
                                        <li><Link to="#">student lounge</Link></li>
                                        <li><Link to="#">learning zone</Link></li>
                                        <li><Link to="#">cafeteria</Link></li>
                                    </ul>
                                </div>
                            </div>
                            <img src="/images/homepage/infrastructure/refresh-zone.webp" alt="" className="bg-image" loading="lazy" />
                        </div>
                        <div className="item">
                            <div className="content">
                                <h4 className="title">practical labs</h4>
                                <div className="inner__content">
                                    <hr />
                                    <ul>
                                        <li><Link to="#">chemistry lab</Link></li>
                                        <li><Link to="#">computer lab</Link></li>
                                        <li><Link to="#">biology lab</Link></li>
                                        <li><Link to="#">physics lab</Link></li>
                                    </ul>
                                </div>
                            </div>
                            <img src="/images/homepage/infrastructure/practical-labs.webp" alt="" className="bg-image" loading="lazy" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Infrastructure;

import React from 'react';
import { Link } from 'react-router-dom';

const Courses = ({ hidePassrate = false }) => {
    return (
        <div className="courses">
            <img src="/images/homepage/course__bg-art.png" alt="" className="art" />
            <div className="container-lg">
                <div className="courses__container">
                    <div className="section__heading-content">
                        <h2 className="section__heading">
                            Our <span className="color-orange">courses</span>
                        </h2>
                        <p>
                            Explore our range of courses to find the perfect fit for your future
                        </p>
                        <div className="courses__btns">
                            <button className="active" data-name="plustwo">+2</button>
                            <button data-name="alevel">A Level</button>
                        </div>
                    </div>
                    
                    {/* Course List Component integrated */}
                    <div className="courses__list-container">
                        <div className="courses__list swiper show" id="plustwo">
                            <div className="swiper-wrapper">
                                <div className="swiper-slide item">
                                    <div className="title">
                                        <span>science </span>
                                    </div>
                                    <div className="content">
                                        <div className="subjects">
                                            <ul>
                                                <li>6 subjects</li>
                                                <li>2 years</li>
                                            </ul>
                                        </div>
                                        <Link to="/our-courses/science" className="btn"><span>Read More</span></Link>
                                    </div>
                                    <img src="/images/homepage/courses/4.png" alt="" className="bg-image" />
                                </div>
                                <div className="swiper-slide item">
                                    <div className="title">
                                        <span>management </span>
                                    </div>
                                    <div className="content">
                                        <div className="subjects">
                                            <ul>
                                                <li>6 subjects</li>
                                                <li>2 years</li>
                                            </ul>
                                        </div>
                                        <Link to="/our-courses/management" className="btn"><span>Read More</span></Link>
                                    </div>
                                    <img src="/images/homepage/courses/5.png" alt="" className="bg-image" />
                                </div>
                                <div className="swiper-slide item">
                                    <img src="/images/homepage/courses/plustwo-main.jpg" alt="" />
                                </div>
                                <div className="swiper-slide item">
                                    <div className="title">
                                        <span>humanities </span>
                                    </div>
                                    <div className="content">
                                        <div className="subjects">
                                            <ul>
                                                <li>6 subjects</li>
                                                <li>2 years</li>
                                            </ul>
                                        </div>
                                        <Link to="/our-courses/humanities" className="btn"><span>Read More</span></Link>
                                    </div>
                                    <img src="/images/homepage/courses/humanities__new.png" alt="" className="bg-image" />
                                </div>
                                <div className="swiper-slide item">
                                    <div className="title">
                                        <span> law</span>
                                    </div>
                                    <div className="content">
                                        <div className="subjects">
                                            <ul>
                                                <li>6 subjects</li>
                                                <li>2 years</li>
                                            </ul>
                                        </div>
                                        <Link to="/our-courses/law" className="btn"><span>Read More</span></Link>
                                    </div>
                                    <img src="/images/homepage/courses/law__new.png" alt="" className="bg-image" />
                                </div>
                            </div>
                        </div>
                        <div className="courses__list swiper " id="alevel">
                            <div className="swiper-wrapper">
                                <div className="swiper-slide item">
                                    <div className="title">
                                        <span> humanities</span>
                                    </div>
                                    <div className="content">
                                        <div className="subjects">
                                            <ul>
                                                <li>6 subjects</li>
                                                <li>2 years</li>
                                            </ul>
                                        </div>
                                        <Link to="#" className="btn"><span>Read More</span></Link>
                                    </div>
                                    <img src="/images/homepage/courses/one.png" alt="" className="bg-image" />
                                </div>
                                <div className="swiper-slide item">
                                    <div className="title">
                                        <span>science</span>
                                    </div>
                                    <div className="content">
                                        <div className="subjects">
                                            <ul>
                                                <li>Min. 3 subjects</li>
                                                <li>2 years</li>
                                            </ul>
                                        </div>
                                        <Link to="/our-courses/alevel_science" className="btn"><span>Read More</span></Link>
                                    </div>
                                    <img src="/images/homepage/courses/7.png" alt="" className="bg-image" />
                                </div>
                                <div className="swiper-slide item">
                                    <img src="/images/homepage/courses/a-level.jpg" alt="" />
                                </div>
                                <div className="swiper-slide item">
                                    <div className="title">
                                        <span> non-science</span>
                                    </div>
                                    <div className="content">
                                        <div className="subjects">
                                            <ul>
                                                <li>Min. 3 subjects</li>
                                                <li>2 years</li>
                                            </ul>
                                        </div>
                                        <Link to="/our-courses/alevel_non-science" className="btn"><span>Read More</span></Link>
                                    </div>
                                    <img src="/images/homepage/courses/8.png" alt="" className="bg-image" />
                                </div>
                                <div className="swiper-slide item">
                                    <div className="title">
                                        <span> law</span>
                                    </div>
                                    <div className="content">
                                        <div className="subjects">
                                            <ul>
                                                <li>6 subjects</li>
                                                <li>2 years</li>
                                            </ul>
                                        </div>
                                        <Link to="#" className="btn"><span>Read More</span></Link>
                                    </div>
                                    <img src="/images/homepage/courses/four.png" alt="" className="bg-image" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* CTA Pass Rate Component integrated */}
            {!hidePassrate && (
                <section className="pass__rate">
                    <div className="container">
                        <div className="pass__rate-container">
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
            )}
        </div>
    );
};

export default Courses;

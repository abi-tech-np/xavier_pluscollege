import React from 'react';

const Awards = () => {
    return (
        <section className="awards">
            <img src="/images/homepage/course__bg-art.png" alt="" className="art" />
            <div id="awards"></div>
            <div className="container">
                <div className="awards-container">
                    <div className="section__heading-content">
                        <h2 className="section__heading">
                            Xavier International <span className="color-light-green">Awards</span>
                        </h2>
                        <p>
                            Xavier International College is honored to receive prestigious awards, showcasing our dedication to
                            excellence and innovation in education.
                        </p>
                    </div>
                    <div className="awards__list">
                        <div className="item">
                            <div className="img__holder">
                                <img src="/images/homepage/awards/awards__new.png" alt="" />
                            </div>
                            <div className="content">
                                <h4 className="title">
                                    Outstanding <br />
                                    College of the Year
                                </h4>
                                <p>
                                    XIC received the "Outstanding College of the Year, 2021" at the World Education Leaders
                                    Summit and Award Ceremony, a significant global achievement elevating our college's stature.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Awards;

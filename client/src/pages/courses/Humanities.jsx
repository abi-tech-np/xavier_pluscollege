import React, { useEffect, useState } from 'react';
import Banner from '../../components/Banner';
import FooterPassrate from '../../components/FooterPassrate';

const Humanities = () => {
    const [activeTab, setActiveTab] = useState('compulsory');

    useEffect(() => {
        if (window.initApp) {
            window.initApp();
        }
    }, []);

    const pageName = [];

    return (
        <>
            <Banner
                normalTitle=""
                colorTitle=""
                firstHighlightColor=""
                secondHighlightColor="#00CDCF"
                bannerImage="humanities.png"
                overlay={false}
                pageName={pageName}
            />

            <div className="course_section">
                <div className="container">
                    <div className="courses_container">
                        <div className="section__heading-content">
                            <h2 className="section__heading">
                                <span className="color-teal"> Humanities (XI / XII) </span>
                            </h2>
                            <p>
                                Our two-year program is for students interested in higher education in humanities and social sciences. It covers language studies, mass communication, sociology, psychology, economics, marketing/business math, contemporary society, and more, offering a comprehensive education.
                            </p>
                            <div className="courses__btns">
                                <button
                                    className={activeTab === 'compulsory' ? 'active' : ''}
                                    onClick={() => setActiveTab('compulsory')}
                                >
                                    Compulsory subject
                                </button>
                                {/* Note: Optional subject button was hidden in the original HTML with style="display: none" */}
                            </div>
                        </div>

                        {activeTab === 'compulsory' && (
                            <div className="subject-list">
                                <ul>
                                    <li>Nepali</li>
                                    <li>English</li>
                                    <li>Social Studies</li>
                                    <li>Mass Communication</li>
                                    <li>Sociology</li>
                                    <li>Psychology</li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <FooterPassrate />
        </>
    );
};

export default Humanities;

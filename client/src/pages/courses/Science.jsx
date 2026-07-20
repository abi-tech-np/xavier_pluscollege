import React, { useEffect, useState } from 'react';
import Banner from '../../components/Banner';
import FooterPassrate from '../../components/FooterPassrate';

const Science = () => {
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
                secondHighlightColor="#A4C93A"
                bannerImage="science.png"
                overlay={false}
                pageName={pageName}
            />

            <div className="course_section">
                <div className="container">
                    <div className="courses_container">
                        <div className="section__heading-content">
                            <h2 className="section__heading">
                                <span className="color-light-green">Science (XI / XII)</span>
                            </h2>
                            <p>
                                Our two-year course focuses on understanding biology, chemistry, and physics concepts. We enhance learning by incorporating practical applications of scientific theories taught in class.
                            </p>
                            <div className="courses__btns">
                                <button
                                    className={activeTab === 'compulsory' ? 'active' : ''}
                                    onClick={() => setActiveTab('compulsory')}
                                >
                                    Compulsory subject
                                </button>
                                <button
                                    className={activeTab === 'optional' ? 'active' : ''}
                                    onClick={() => setActiveTab('optional')}
                                >
                                    Optional subject
                                </button>
                            </div>
                        </div>

                        {activeTab === 'compulsory' && (
                            <div className="subject-list">
                                <ul>
                                    <li>English</li>
                                    <li>Nepali</li>
                                    <li>Physics</li>
                                    <li>Chemistry</li>
                                    <li>Mathematics</li>
                                </ul>
                            </div>
                        )}

                        {activeTab === 'optional' && (
                            <div className="subject-list">
                                <ul>
                                    <li>Computer Science</li>
                                    <li>Biology</li>
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

export default Science;

import React, { useEffect, useState } from 'react';
import Banner from '../../components/Banner';
import FooterPassrate from '../../components/FooterPassrate';

const Law = () => {
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
                secondHighlightColor="#F69D1D"
                bannerImage="law.png"
                overlay={false}
                pageName={pageName}
            />

            <div className="course_section">
                <div className="container">
                    <div className="courses_container">
                        <div className="section__heading-content">
                            <h2 className="section__heading">
                                <span className="color-orange"> Law (XI / XII) </span>
                            </h2>
                            <p>
                                Our two-year program lays the groundwork for aspiring legal professionals. Covering essential law
                                topics, it equips students with foundational knowledge and skills for their future careers through
                                rigorous coursework and practical training.
                            </p>
                            <div className="courses__btns">
                                <button
                                    className={activeTab === 'compulsory' ? 'active' : ''}
                                    onClick={() => setActiveTab('compulsory')}
                                >
                                    XI
                                </button>
                                <button
                                    className={activeTab === 'optional' ? 'active' : ''}
                                    onClick={() => setActiveTab('optional')}
                                >
                                    XII
                                </button>
                            </div>
                        </div>

                        {activeTab === 'compulsory' && (
                            <div className="subject-list">
                                <ul>
                                    <li>Nepali</li>
                                    <li>English</li>
                                    <li>Social Studies</li>
                                    <li>Constitutional Law</li>
                                    <li>Jurisprudence Law</li>
                                    <li>Procedural Law</li>
                                </ul>
                            </div>
                        )}

                        {activeTab === 'optional' && (
                            <div className="subject-list">
                                <ul>
                                    <li> Nepali</li>
                                    <li> English</li>
                                    <li> Social Studies</li>
                                    <li> Nepalese Legal System</li>
                                    <li> Legal Drafting</li>
                                    <li> Civil and Criminal</li>
                                    <li> Law and Justice</li>
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

export default Law;

import React, { useEffect, useState } from 'react';
import Banner from '../../components/Banner';
import FooterPassrate from '../../components/FooterPassrate';

const Management = () => {
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
                secondHighlightColor="#0DA6DF"
                bannerImage="four-banner.png"
                overlay={false}
                pageName={pageName}
            />

            <div className="course_section">
                <div className="container">
                    <div className="courses_container">
                        <div className="section__heading-content">
                            <h2 className="section__heading">
                                <span className="color-blue"> Management (XI / XII) </span>
                            </h2>
                            <p>
                                We offer a two-year program to teach the basics of management. Our goal is to give students the skills they need to be successful managers by providing them with essential knowledge and principles.
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
                                    <li>Nepali</li>
                                    <li>English</li>
                                    <li>Social Studies</li>
                                    <li>Account</li>
                                    <li>Economics</li>
                                </ul>
                            </div>
                        )}

                        {activeTab === 'optional' && (
                            <div className="subject-list">
                                <ul>
                                    <li>Business Studies </li>
                                    <li>Computer Science</li>
                                    <li>Hotel Management</li>
                                    <li>Business Math</li>
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

export default Management;

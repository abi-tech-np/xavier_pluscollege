import React, { useEffect, useState } from 'react';
import Banner from '../../components/Banner';
import FooterCTA from '../../components/FooterCTA';

const ALevelScience = () => {
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
                bannerImage="science-alevel.png"
                overlay={false}
                pageName={pageName}
            />

            <div className="course_section">
                <div className="container">
                    <div className="courses_container">
                        <div className="section__heading-content">
                            <h2 className="section__heading">
                                <span className="color-light-green">Science (A-Level)</span>
                            </h2>
                            <p>
                                Offered by the prestigious University of Cambridge, Cambridge
                                International A-Level is a globally recognized program preparing
                                students for university success and future careers. Renowned for
                                their academic rigor, A-Level culminates in respected exams valued
                                by universities and employers worldwide. This rigorous preparation
                                makes A-Level a key to unlocking doors at top universities across the
                                UK, USA, Australia, and more.
                            </p>
                            <div className="courses__btns">
                                <button
                                    className={activeTab === 'compulsory' ? 'active' : ''}
                                    onClick={() => setActiveTab('compulsory')}
                                >
                                    Bio Group
                                </button>
                                <button
                                    className={activeTab === 'optional' ? 'active' : ''}
                                    onClick={() => setActiveTab('optional')}
                                >
                                    Physical Group
                                </button>
                            </div>
                        </div>

                        {activeTab === 'compulsory' && (
                            <div className="subject-list">
                                <ul>
                                    <li>English General Paper</li>
                                    <li>Physics</li>
                                    <li>Chemistry</li>
                                    <li>Biology</li>
                                    <li>Mathematics</li>
                                </ul>
                            </div>
                        )}

                        {activeTab === 'optional' && (
                            <div className="subject-list">
                                <ul>
                                    <li>English General Paper</li>
                                    <li>Physics</li>
                                    <li>Chemistry</li>
                                    <li>Mathematics</li>
                                    <li>Further Mathematics *</li>
                                    <li>Computer Science *</li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <FooterCTA />
        </>
    );
};

export default ALevelScience;

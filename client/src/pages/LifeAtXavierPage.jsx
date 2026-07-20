import React, { useEffect } from 'react';
import Banner from '../components/Banner';
import LifeAtXavier from '../components/LifeAtXavier';
import Infrastructure from '../components/Infrastructure';
import FooterCTA from '../components/FooterCTA';

const LifeAtXavierPage = () => {
    useEffect(() => {
        if (window.initApp) {
            window.initApp();
        }
    }, []);

    const pageName = [
        {
            link: '/life-at-xavier',
            name: 'Life at Xavier',
        }
    ];

    return (
        <>
            <Banner
                normalTitle="Life"
                colorTitle="at Xavier"
                firstHighlightColor="#019B9D"
                secondHighlightColor=""
                bannerImage="banner-bg.jpg"
                overlay={true}
                pageName={pageName}
            />

            <section className="lifeAtXavier__component">
                <img src="/images/homepage/course__bg-art.png" alt="" className="art" />
                <div className="container">
                    <div className="lifeAtXavier-container">
                        <div className="section__heading-content">
                            <p>
                                Find your place at Xavier! Join a thriving community where you'll feel welcomed and
                                supported. Discover your passions, develop your skills, and forge lifelong connections here.
                            </p>
                        </div>
                        <LifeAtXavier />
                    </div>
                </div>
            </section>
            <Infrastructure />

            <FooterCTA />
        </>
    );
};

export default LifeAtXavierPage;

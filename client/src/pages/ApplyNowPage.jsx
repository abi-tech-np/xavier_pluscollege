import React, { useEffect } from 'react';
import Banner from '../components/Banner';
import ApplyForm from '../components/ApplyForm';
import ContactDetail from '../components/ContactDetail';
import Brochure from '../components/Brochure';
import FooterCTA from '../components/FooterCTA';

const ApplyNowPage = () => {
    useEffect(() => {
        if (window.initApp) {
            window.initApp();
        }
    }, []);

    const pageName = [
        {
            link: '/apply-now',
            name: 'Apply now',
        }
    ];

    return (
        <>
            <Banner
                normalTitle="apply"
                colorTitle="now"
                firstHighlightColor=""
                secondHighlightColor="#EA195D"
                bannerImage="banner-bg.jpg"
                overlay={true}
                pageName={pageName}
            />

            <ApplyForm />

            <ContactDetail />
            <Brochure />

            <FooterCTA />
        </>
    );
};

export default ApplyNowPage;

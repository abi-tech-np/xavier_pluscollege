import React, { useEffect } from 'react';
import Banner from '../components/Banner';
import ContactForm from '../components/ContactForm';
import ContactDetail from '../components/ContactDetail';
import Brochure from '../components/Brochure';
import FooterPassrate from '../components/FooterPassrate';

const ContactUs = () => {
    useEffect(() => {
        // Re-initialize GSAP animations after rendering
        if (window.initApp) {
            window.initApp();
        }
    }, []);

    const pageName = [
        {
            link: '/contact-us',
            name: 'Contact us'
        }
    ];

    return (
        <>
            <Banner 
                normalTitle="contact" 
                colorTitle="us" 
                firstHighlightColor="" 
                secondHighlightColor="#F69D1D" 
                bannerImage="banner-bg.jpg" 
                overlay={true} 
                pageName={pageName} 
            />
            <ContactForm />
            <ContactDetail />
            <Brochure />
            <FooterPassrate />
        </>
    );
};

export default ContactUs;

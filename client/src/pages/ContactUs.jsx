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
            <section className="contact-form-section" style={{ padding: '60px 0', fontFamily: 'var(--primary-font, sans-serif)' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                        <h2 style={{ fontSize: '36px', color: '#3a405b', marginBottom: '15px', fontWeight: '500' }}>Any Problem?</h2>
                        <p style={{ color: '#888', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6', fontSize: '15px' }}>
                            Please fill out the form to receive your free eBrochure. Submit now to get immediate access to exclusive information about our college.
                        </p>
                    </div>
                    <ContactForm />
                </div>
            </section>
            <ContactDetail />
            <Brochure />
            <FooterPassrate />
        </>
    );
};

export default ContactUs;

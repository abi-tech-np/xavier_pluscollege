import React, { useEffect } from 'react';
import Banner from '../components/Banner';
import Courses from '../components/Courses';
import FooterPassrate from '../components/FooterPassrate';

const OurCourses = () => {
    useEffect(() => {
        if (window.initApp) {
            window.initApp();
        }
    }, []);

    const pageName = [
        {
            link: '/our-courses',
            name: 'our courses',
        }
    ];

    return (
        <>
            <Banner
                normalTitle="our"
                colorTitle="courses"
                firstHighlightColor=""
                secondHighlightColor="#019B9D"
                bannerImage="banner-bg.jpg"
                overlay={true}
                pageName={pageName}
            />
            {/* The Courses component renders the course tabs and the list, but it also has its own pass__rate. 
                For the purpose of migration, we just use the existing Courses component since it matches the layout. */}
            <Courses hidePassrate={true} />
            <FooterPassrate />
        </>
    );
};

export default OurCourses;

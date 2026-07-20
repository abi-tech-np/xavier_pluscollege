import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Banner from '../components/Banner';
import FooterCTA from '../components/FooterCTA';

const hardcodedData = {
    'ximun': {
        title: 'XIMUN',
        date: '21st Dec 2023',
        description: 'Xavier International Model United Nations, is a prestigious event where students simulate diplomatic discussions and debates on global issues. It provides a platform for young minds to engage in issues from international perspectives.',
        bannerImage: 'ximun__banner.jpg',
        galleryUrls: [
            '/images/ximun/fifteen.jpg',
            '/images/ximun/three.jpg',
            '/images/ximun/fourthteen.jpg',
            '/images/ximun/sixteen.jpg',
            '/images/ximun/one.jpg',
            '/images/ximun/six.jpg'
        ]
    },
    'holi': {
        title: 'Holi',
        date: '25th March 2024',
        description: 'At Xavier, Holi is a vibrant celebration of colors and unity, where students come together to revel in joyous festivities, spreading cheers across the campus.',
        bannerImage: 'holi 2.jpg',
        galleryUrls: [
            '/images/holi/holi +2.jpg',
            '/images/holi/ghjk.jpg',
            '/images/holi/holi 3.jpg',
            '/images/holi/holi 4.jpg',
            '/images/holi/holie.jpg',
            '/images/holi/holi 2.jpg'
        ]
    },
    'u-19': {
        title: 'U-19',
        date: '10th Jan 2024',
        description: 'Xavier’s Under 19 Inter college Basketball Tournament is a thrilling showcase of young talent, where college teams compete in fast-paced matches. With electrifying plays and passionate fans, it\'s a celebration of athleticism and sportsmanship, uniting players and spectators in the love of the game.',
        bannerImage: 'u19.jpg',
        galleryUrls: [
            '/images/u-19/two.jpg',
            '/images/u-19/three.jpg',
            '/images/u-19/four.jpg',
            '/images/u-19/five.jpg',
            '/images/u-19/six.jpg',
            '/images/u-19/seven.jpg'
        ]
    },
    '+2graduation': {
        title: '+2 Graduation',
        date: '2 Feb 2024',
        description: 'At Xavier\'s +2 graduation, students receive their degrees, marking the end of their academic journey and the beginning of new adventures with a grand celebration.',
        bannerImage: 'graduation-banner.png',
        galleryUrls: [
            '/images/graduation/two.jpg',
            '/images/graduation/graduation1.jpg',
            '/images/graduation/four.jpg',
            '/images/graduation/five.jpg',
            '/images/graduation/seven.jpg'
        ]
    },
    'rtx': {
        title: 'RTX',
        date: '15th Feb 2024',
        description: 'RTX: Rising Talent of Xavier is a captivating talent show spotlighting the diverse skills of Xavier\'s students. From dazzling performances to awe-inspiring acts, RTX is a showcase of creativity and talent within the Xavier community.',
        bannerImage: 'rtx-banner.jpg',
        galleryUrls: [
            '/images/rtx/two.jpg',
            '/images/rtx/one.jpg',
            '/images/rtx/three.jpg',
            '/images/rtx/four.jpg',
            '/images/rtx/five.jpg',
            '/images/rtx/six.jpg'
        ]
    }
};

const LifeAtXavierSinglePage = () => {
    const { slug } = useParams();
    const [eventData, setEventData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (window.initApp) {
            window.initApp();
        }
    }, [slug]);

    useEffect(() => {
        if (hardcodedData[slug]) {
            setEventData(hardcodedData[slug]);
            setLoading(false);
        } else {
            axios.get(`http://localhost:5000/api/life-at-xavier/${slug}`)
                .then(res => {
                    const dbData = res.data;
                    setEventData({
                        title: dbData.title,
                        date: new Date(dbData.date).toLocaleDateString(),
                        description: dbData.description,
                        bannerImage: 'banner-bg.jpg', // generic banner for dynamic ones
                        galleryUrls: dbData.galleryUrls || []
                    });
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Error fetching event details", err);
                    setLoading(false);
                });
        }
    }, [slug]);

    if (loading) return <div>Loading...</div>;
    if (!eventData) return <div>Event not found.</div>;

    return (
        <>
            <Banner
                normalTitle=""
                colorTitle=""
                firstHighlightColor=""
                secondHighlightColor=""
                bannerImage={eventData.bannerImage}
                overlay={false}
                pageName={[]}
            />

            <section className="acdemicAward">
                <img src="/images/homepage/course__bg-art.png" alt="" className="art" />
                <div className="container-lg">
                    <div className="academics__container">
                        <div className="section__heading-content">
                            <h2 className="section__heading">
                                <span className="subTitle">{eventData.date}</span>
                                {eventData.title}
                            </h2>
                            <p>{eventData.description}</p>
                        </div>
                    </div>
                    <div className="gallery">
                        {eventData.galleryUrls.map((url, index) => (
                            <div className={`gallery__item gallery__item--${index + 1}`} key={index}>
                                <img src={url} alt={`Gallery image ${index + 1}`} className="gallery__img" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <FooterCTA />
        </>
    );
};

export default LifeAtXavierSinglePage;

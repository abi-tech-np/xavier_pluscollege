import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getApiUrl } from '../services/apiClient';
import Banner from '../components/Banner';
import FooterPassrate from '../components/FooterPassrate';

const hardcodedNews = {
    'blood-donation-program': {
        title: 'Blood Donation Program',
        bannerImage: 'blood_donation.jpg',
        content: `<p>Xavier International College hosts a life-saving initiative with its Blood Donation Program! Recognizing the significance of donating blood to aid those in need, we unite students, faculty, and staff in this noble cause. Join us as we raise awareness, foster participation, and save lives together. Let's make a difference and build a healthier, more compassionate world. Thank you for joining Xavier International College in this vital endeavor.</p>`
    },
    'eye-camp-visit': {
        title: 'Eye Camp Visit',
        bannerImage: 'eye_camp.jpg',
        content: `<p>Recap of our recent Community Social Responsibility Event! Xavier International College, alongside Xavier Scout Crew, Nepal Scout Bagmati Province, and Tilganga Eye Hospital, successfully hosted our Eye Camp initiative. Under the guidance of Dr. Sanduk Ruit, we embarked on a mission to restore vision and hope to countless lives. Beyond medical assistance, this event symbolized our commitment to fostering a community where essential healthcare services are accessible to all. Our collaborative efforts brought light and clarity to many, illuminating brighter futures and restoring dignity. A heartfelt thank you to all volunteers, medical staff, and supporters for making this event a success. Together, we've made a significant impact, one pair of eyes at a time. Let's continue spreading the light of compassion and care.</p>`
    },
    'cricket-stadium-visit': {
        title: 'Cricket Stadium Visit',
        bannerImage: 'cricket.jpg',
        content: `<p>Relive the excitement of Xavier International College's recent visit to the cricket stadium! Our students had the extraordinary opportunity to meet the National Cricket Players of Nepal and the National Cricket Player of West Indies in an exclusive meet and greet. Rarely do such memorable events occur, where students get to interact with sporting legends. Whether you're a cricket enthusiast or simply curious about the sport, this event was undoubtedly a highlight. Though it's over, the memories linger. Stay tuned for more thrilling events and opportunities to engage at Xavier International College.</p>`
    },
    'xavier-level-up-event': {
        title: 'Xavier Level Up Event',
        bannerImage: 'levelup__banner.jpg',
        content: `<p>Experience the thrill of Xavier's recent event, 'Xavier Level Up'! Students enjoyed an enriching experience filled with engaging activities, insightful A-level discussions, and enjoyable tasks. From fostering camaraderie to promoting learning, every aspect contributed to a memorable event. Let's celebrate our collective growth and progress together! Stay informed about upcoming events and opportunities for engagement at Xavier.</p>`
    }
};

const NewsAndEventsSinglePage = () => {
    const { slug } = useParams();
    const [eventData, setEventData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (hardcodedNews[slug]) {
            setEventData(hardcodedNews[slug]);
            setLoading(false);
            return;
        }

        axios.get(getApiUrl(`/news-and-events/${slug}`))
            .then(res => {
                const data = res.data;
                data.bannerImage = data.imageUrl || 'banner-bg.jpg'; 
                setEventData(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError('News or event not found');
                setLoading(false);
            });
    }, [slug]);

    if (loading) {
        return <div style={{ paddingTop: '100px', textAlign: 'center' }}>Loading...</div>;
    }

    if (error || !eventData) {
        return <div style={{ paddingTop: '100px', textAlign: 'center' }}>{error || 'Event not found'}</div>;
    }

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

            <div className="acdemicAward">
                <img src="/images/homepage/course__bg-art.png" alt="" className="art" />
                <div className="container-lg">
                    <div className="academics__container">
                        <div className="section__heading-content">
                            <h2 className="section__heading">
                                {eventData.title}
                            </h2>
                            <div dangerouslySetInnerHTML={{ __html: eventData.content }}></div>
                        </div>
                    </div>
                </div>
            </div>

            <FooterPassrate />
        </>
    );
};

export default NewsAndEventsSinglePage;

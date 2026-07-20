import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Banner from '../components/Banner';
import FooterPassrate from '../components/FooterPassrate';

const pageData = {
    // Skill pages
    'educational-tours': {
        title: 'Educational Tours',
        bannerImage: 'edu_tours.jpg',
        content: `<p>Each year, you will have the exciting opportunity to embark on a national trip designed to enrich your personal and professional development. This trip includes a variety of immersive experiences and insightful excursions, carefully curated to help you acquire valuable life skills. By participating, you will broaden your horizons, enhance your understanding of different cultures and environments, and gain practical knowledge that can be applied in everyday life.</p>`,
        images: [
            '/images/skill/educational_tours/two.jpg',
            '/images/banner/edu_tours.jpg',
            '/images/skill/educational_tours/six.jpg',
            '/images/skill/educational_tours/three.jpg',
            '/images/skill/educational_tours/five.jpg',
            '/images/skill/educational_tours/four.jpg'
        ]
    },
    'excursions': {
        title: 'Excursions',
        bannerImage: 'excursion.jpg',
        content: `<p>Each year, you will have the exciting opportunity to participate in both a national and an international trip, each designed to offer unique and enriching experiences. These trips provide industry exposure through immersive activities and insightful excursions. The national trip will help you understand domestic industry practices and cultural nuances, while the international trip will expose you to global standards and perspectives. Through these experiences, you will develop valuable life skills, broaden your horizons, and enhance your knowledge of different cultures and professional environments.</p>`,
        images: [
            '/images/skill/excursions/one.jpg',
            '/images/skill/excursions/three.jpg',
            '/images/skill/excursions/four.jpg',
            '/images/skill/excursions/five.jpg',
            '/images/banner/excursion.jpg',
            '/images/skill/excursions/six.jpg'
        ]
    },
    'skill-training': {
        title: 'Skill Training',
        bannerImage: 'skill_training.jpg',
        content: `<p>Skill Training provides you with the vital skills needed in the 21st century, from digital marketing to AI, entrepreneurship workshops and leadership and creative writing, helping you succeed in today's competitive landscape.</p><p>Our Communication and Presentation Skills Training enhances your ability to convey ideas clearly and confidently. Learn to craft compelling messages, engage your audience, and deliver impactful presentations.</p>`,
        images: [
            '/images/skill/skill_training/one.jpg',
            '/images/skill/skill_training/two.jpg',
            '/images/skill/skill_training/three.jpg',
            '/images/skill/skill_training/five.jpg',
            '/images/skill/skill_training/four.jpg',
            '/images/skill/skill_training/six.jpg'
        ]
    },
    'xavier-clubs': {
        title: 'Xavier Clubs',
        bannerImage: 'club.jpg',
        content: `<p>Explore your interests in science, literature, technology, sports and more - there's something for everyone at Xavier. Few of the clubs are:</p><div class="club__desc"><p class="club__title">Sports Club</p><p>Train, compete, and celebrate your love of sports with the Xavier Sports Club.</p><p class="club__title">Xavier Red Cross Club</p><p>Participate in impactful initiatives like organizing eye camps and assisting with blood donation drives, addressing critical needs in your community.</p><p class="club__title">STEM Club</p><p>Dive into the fascinating world of Science, Technology, Engineering, and Math. Explore cutting-edge advancements, tinker with exciting gadgets, and collaborate to build solutions for real-world challenges.</p><p class="club__title">Literature club</p><p>Immerse yourself in the literary world and connect with fellow book lovers at the Xavier Literature Club.</p></div>`,
        images: [
            '/images/skill/xavier_clubs/four.jpg',
            '/images/skill/xavier_clubs/two.jpg',
            '/images/skill/xavier_clubs/one.jpg',
            '/images/skill/xavier_clubs/seven.jpg',
            '/images/skill/xavier_clubs/five.jpg',
            '/images/skill/xavier_clubs/six.jpg'
        ]
    },

    // Studies pages
    'career-counselling': {
        title: 'Career Counselling',
        bannerImage: 'career_banner.jpg',
        content: `<p>Our Career Counseling offers personalized guidance to help students navigate their professional journey. Expert advisors assist in identifying strengths, interests, and career goals. Through one-on-one sessions, workshops, and assessments, students gain insights into various career paths. Support in resume building, interview preparation, and job search strategies empowers informed decision-making. Our services pave the way for fulfilling careers.</p>`,
        images: [
            '/images/studies/career_counselling/one.jpg',
            '/images/studies/career_counselling/two.jpg',
            '/images/studies/career_counselling/three.jpg',
            '/images/studies/career_counselling/six.jpg',
            '/images/studies/career_counselling/five.jpg',
            '/images/studies/career_counselling/four.jpg'
        ]
    },
    'hands-on-learning': {
        title: 'Hands-on Learning',
        bannerImage: 'hands_on_learning.jpg',
        content: `<p>Our Hands-on Learning approach ensures students gain practical experience alongside theoretical knowledge. Through real-world industry exposure tours, skill workshops, and interactive tutorial sessions, students apply classroom concepts to practical scenarios. This method enhances problem-solving skills, fosters creativity, and prepares students for professional challenges. By bridging the gap between theory and practice, hands-on learning equips students with the skills needed for career success.</p>`,
        images: [
            '/images/studies/hands-on_learning/five.jpg',
            '/images/studies/hands-on_learning/one.jpg',
            '/images/studies/hands-on_learning/four.jpg',
            '/images/banner/hands_on_learning.jpg',
            '/images/studies/hands-on_learning/three.jpg',
            '/images/studies/hands-on_learning/six.jpg'
        ]
    },
    'modern-campus': {
        title: 'Modern Campus',
        bannerImage: 'modern_campus.jpg',
        content: `<p>With state-of-the-art facilities and advanced technology, it fosters a collaborative and engaging atmosphere. Students have access to cutting-edge labs, interactive classrooms, and versatile study spaces. The campus also features amenities like cafeteria, students lounge, and basketball court, ensuring a well-rounded college experience. Combining modern design with functional spaces, our campus is ideal for academic success and personal growth.</p>`,
        images: [
            '/images/studies/modern_campus/two.jpg',
            '/images/studies/modern_campus/three.jpg',
            '/images/studies/modern_campus/four.jpg',
            '/images/studies/modern_campus/five.jpg',
            '/images/banner/modern_campus.jpg',
            '/images/studies/modern_campus/six.jpg'
        ]
    }
};

const SkillAndStudiesPage = () => {
    const { slug } = useParams();
    const data = pageData[slug];

    if (!data) {
        return <div style={{ paddingTop: '100px', textAlign: 'center' }}>Page not found</div>;
    }

    return (
        <>
            <Banner
                normalTitle=""
                colorTitle=""
                firstHighlightColor=""
                secondHighlightColor=""
                bannerImage={data.bannerImage}
                overlay={false}
                pageName={[]}
            />

            <div className="acdemicAward">
                <img src="/images/homepage/course__bg-art.png" alt="" className="art" />
                <div className="container-lg">
                    <div className="academics__container">
                        <div className="section__heading-content">
                            <h2 className="section__heading">
                                {data.title}
                            </h2>
                            <div dangerouslySetInnerHTML={{ __html: data.content }}></div>
                        </div>
                    </div>

                    <div className="gallery">
                        {data.images.map((imgUrl, index) => (
                            <div className={`gallery__item gallery__item--${index + 1}`} key={index}>
                                <img src={imgUrl} alt={`Gallery image ${index + 1}`} className="gallery__img" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <FooterPassrate />
        </>
    );
};

export default SkillAndStudiesPage;

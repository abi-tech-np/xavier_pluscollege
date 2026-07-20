import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const LifeAtXavier = ({ limit }) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const url = limit ? `http://localhost:5000/api/life-at-xavier?limit=${limit}` : 'http://localhost:5000/api/life-at-xavier';
        axios.get(url)
            .then(res => {
                setItems(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const hardcodedItems = [
        {
            id: 'hc-1',
            slug: 'rtx',
            imageUrl: '/images/rtx/one.jpg',
            date: '2024-01-01',
            title: 'RTX',
            description: "RTX: Rising Talent of Xavier is a captivating talent show spotlighting the diverse skills of Xavier's students. From dazzling performances to awe-inspiring acts, RTX is a showcase of creativity and talent within the Xavier community."
        },
        {
            id: 'hc-2',
            slug: 'holi',
            imageUrl: '/images/holi/holi 2.jpg',
            date: '2024-01-01',
            title: 'Holi',
            description: "At Xavier, Holi is a vibrant celebration of colors and unity, where students come together to revel in joyous festivities, spreading cheers across the campus."
        },
        {
            id: 'hc-3',
            slug: '+2graduation',
            imageUrl: '/images/graduation/graduation__image.jpg',
            date: '2024-01-01',
            title: '+2 Graduation',
            description: "At Xavier's +2 graduation, students receive their degrees, marking the end of their academic journey and the beginning of new adventures with a grand celebration."
        },
        {
            id: 'hc-4',
            slug: 'u-19',
            imageUrl: '/images/u-19/basket-ball.jpg',
            date: '2024-01-01',
            title: 'U-19',
            description: "Xavier’s Under 19 Inter college Basketball Tournament is a thrilling showcase of young talent, where college teams compete in fast-paced matches. With electrifying plays and passionate fans, it's a celebration of athleticism and sportsmanship, uniting players and spectators in the love of the game."
        },
        {
            id: 'hc-5',
            slug: 'ximun',
            imageUrl: '/images/ximun/sixteen.jpg',
            date: '2024-01-01',
            title: 'XIMUN',
            description: "Xavier International Model United Nations, is a prestigious event where students simulate diplomatic discussions and debates on global issues. It provides a platform for young minds to engage in issues from international perspectives."
        }
    ];

    const allItems = [...items, ...hardcodedItems];

    return (
        <div className="lifeAtXavier__list">
            {loading ? (
                <p>Loading...</p>
            ) : allItems.map((item) => (
                <div className="item" key={item.id}>
                    <Link to={`/life-at-xavier/${item.slug}`}></Link>
                    <img src={item.imageUrl || '/images/placeholder.jpg'} alt={item.title} />
                    <div className="content">
                        <span>{item.date ? new Date(item.date).getFullYear() : '2024'}</span>
                        <h4 className="title">{item.title}</h4>
                        <p>{item.description}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default LifeAtXavier;

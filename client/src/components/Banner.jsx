import React from 'react';
import { Link } from 'react-router-dom';

const Banner = ({
    normalTitle = '',
    colorTitle = '',
    firstHighlightColor = '',
    secondHighlightColor = '',
    bannerImage = 'banner-bg.jpg',
    overlay = false,
    pageName = []
}) => {
    return (
        <section className="banner">
            <div className="container-lg">
                <div className={`banner__image ${overlay ? 'overlay' : ''}`}>
                    <svg width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1720 670">
                        <g filter="url(#a)">
                            <path
                                d="M134.812 418.044C74.687 407.629 18.5 378.988 0 365.97V0h1720v362.5c0-1.183-20.09 1.339-40.44 21.222-25.44 24.854-104.06 30.771-176.9 119.534-72.85 88.762-166.5 84.028-259 75.744-92.5-8.285-129.5 1.183-230.1 54.441-100.591 53.258-235.873 42.606-322.591 0-86.719-42.606-143.375-41.423-233.563-35.505-90.187 5.918-120.25-10.652-168.812-44.973-48.563-34.322-78.625-121.901-153.782-134.919Z"
                                fill="#fff" />
                        </g>
                        <image
                            href={bannerImage ? (bannerImage.startsWith('/') || bannerImage.startsWith('http') ? bannerImage : `/images/banner/${bannerImage}`) : `/images/banner/banner-bg.jpg`}
                            height="100%"
                            width="100%"
                            mask="url(#cut-off-bottom)"
                            preserveAspectRatio="xMidYMid slice"
                        />

                        <defs>
                            <filter id="a" x="-4" y="0" width="1724" height="673.5" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                                <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                                <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                <feOffset dx="-4" dy="4" />
                                <feGaussianBlur stdDeviation="5" />
                                <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                                <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
                                <feBlend in2="shape" result="effect1_innerShadow_64_3565" />
                            </filter>
                            <mask id="cut-off-bottom">
                                <path
                                    d="M134.812 418.044C74.687 407.629 18.5 378.988 0 365.97V0h1720v362.5c0-1.183-20.09 1.339-40.44 21.222-25.44 24.854-104.06 30.771-176.9 119.534-72.85 88.762-166.5 84.028-259 75.744-92.5-8.285-129.5 1.183-230.1 54.441-100.591 53.258-235.873 42.606-322.591 0-86.719-42.606-143.375-41.423-233.563-35.505-90.187 5.918-120.25-10.652-168.812-44.973-48.563-34.322-78.625-121.901-153.782-134.919Z"
                                    fill="#fff" />
                            </mask>
                        </defs>
                    </svg>
                </div>
                <div className="overlay-text">
                    <h2 className="page__title">
                        <span style={{ '--highlight-color': firstHighlightColor }}>{normalTitle}</span>{' '}
                        <span style={{ '--highlight-color': secondHighlightColor }}>{colorTitle}</span>
                    </h2>
                    {pageName && pageName.length > 0 && (
                        <ul className="breadcrumb">
                            <li><Link to="/">Home</Link></li>
                            {pageName.map((page, idx) => (
                                <React.Fragment key={idx}>
                                    {' '} | <li><Link to={page.link}>{page.name}</Link></li>
                                </React.Fragment>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Banner;

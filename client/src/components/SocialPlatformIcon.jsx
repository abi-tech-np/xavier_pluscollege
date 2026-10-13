import React from 'react';
import { ExternalLink, Globe } from 'lucide-react';

export const getPlatformMeta = (platformRaw) => {
    const platform = (platformRaw || '').toLowerCase();
    switch (platform) {
        case 'instagram':
            return {
                name: 'Instagram',
                color: '#E4405F',
                gradient: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                textColor: '#ffffff',
                badgeBg: 'rgba(228, 64, 95, 0.15)',
                badgeBorder: 'rgba(228, 64, 95, 0.4)'
            };
        case 'youtube':
            return {
                name: 'YouTube',
                color: '#FF0000',
                gradient: 'linear-gradient(135deg, #FF0000 0%, #c40000 100%)',
                textColor: '#ffffff',
                badgeBg: 'rgba(255, 0, 0, 0.15)',
                badgeBorder: 'rgba(255, 0, 0, 0.4)'
            };
        case 'facebook':
            return {
                name: 'Facebook',
                color: '#1877F2',
                gradient: 'linear-gradient(135deg, #1877F2 0%, #0d5bbd 100%)',
                textColor: '#ffffff',
                badgeBg: 'rgba(24, 119, 242, 0.15)',
                badgeBorder: 'rgba(24, 119, 242, 0.4)'
            };
        case 'twitter':
        case 'x':
            return {
                name: 'X',
                color: '#000000',
                gradient: 'linear-gradient(135deg, #24292e 0%, #0a0a0a 100%)',
                textColor: '#ffffff',
                badgeBg: 'rgba(255, 255, 255, 0.12)',
                badgeBorder: 'rgba(255, 255, 255, 0.25)'
            };
        case 'tiktok':
            return {
                name: 'TikTok',
                color: '#000000',
                gradient: 'linear-gradient(135deg, #010101 0%, #25F4EE 50%, #FE2C55 100%)',
                textColor: '#ffffff',
                badgeBg: 'rgba(37, 244, 238, 0.15)',
                badgeBorder: 'rgba(254, 44, 85, 0.4)'
            };
        case 'linkedin':
            return {
                name: 'LinkedIn',
                color: '#0A66C2',
                gradient: 'linear-gradient(135deg, #0A66C2 0%, #084d94 100%)',
                textColor: '#ffffff',
                badgeBg: 'rgba(10, 102, 194, 0.15)',
                badgeBorder: 'rgba(10, 102, 194, 0.4)'
            };
        default:
            return {
                name: 'Website',
                color: '#019B9D',
                gradient: 'linear-gradient(135deg, #019B9D 0%, #0085d7 100%)',
                textColor: '#ffffff',
                badgeBg: 'rgba(1, 155, 157, 0.15)',
                badgeBorder: 'rgba(1, 155, 157, 0.4)'
            };
    }
};

export const SocialPlatformIcon = ({ platform, size = 18, color = 'currentColor' }) => {
    const key = (platform || '').toLowerCase();

    if (key === 'instagram') {
        return (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
        );
    }

    if (key === 'youtube') {
        return (
            <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
        );
    }

    if (key === 'facebook') {
        return (
            <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
        );
    }

    if (key === 'twitter' || key === 'x') {
        return (
            <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
        );
    }

    if (key === 'tiktok') {
        return (
            <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298 0 .592.045.87.134V9.37a6.34 6.34 0 0 0-.87-.06 6.34 6.34 0 1 0 6.34 6.34V8.75a8.28 8.28 0 0 0 4.77 1.5V6.78a4.83 4.83 0 0 1-1-.09z"/>
            </svg>
        );
    }

    if (key === 'linkedin') {
        return (
            <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 0 0 1.63-1.63 1.64 1.64 0 1 0-3.27 0c0 .9.73 1.63 1.64 1.63m1.4 9.74v-8.37H5.06v8.37h2.8z"/>
            </svg>
        );
    }

    return <Globe size={size} color={color} />;
};

export const PlatformBadge = ({ platform, showName = true, className = '' }) => {
    const meta = getPlatformMeta(platform);
    return (
        <span 
            className={className}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.25rem 0.6rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: meta.textColor,
                background: meta.gradient,
                boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
                lineHeight: 1
            }}
        >
            <SocialPlatformIcon platform={platform} size={13} color="#ffffff" />
            {showName && meta.name}
        </span>
    );
};

export default SocialPlatformIcon;

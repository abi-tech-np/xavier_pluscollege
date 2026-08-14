import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigationType } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Popup from '../components/Popup';
import { initApp, cleanupApp, refreshApp } from '../js/app.js';

const Layout = () => {
    const location = useLocation();
    const navType = useNavigationType();

    useEffect(() => {
        // Handle scroll position based on navigation type and hash
        if (location.hash) {
            setTimeout(() => {
                const id = location.hash.replace('#', '');
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                    setTimeout(() => refreshApp(), 500); // refresh after smooth scroll finishes
                }
            }, 100);
        } else if (navType !== 'POP') {
            // PUSH or REPLACE navigation (link clicks or programmatic navigation)
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
        }

        // Run DOM manipulation scripts after scroll position is reset
        try {
            initApp();
        } catch (e) {
            console.error('initApp error:', e);
        }

        refreshApp();

        const handleLoad = () => {
            refreshApp();
        };
        
        // Add load listener for initial page load when images/fonts finish
        window.addEventListener('load', handleLoad);

        return () => {
            window.removeEventListener('load', handleLoad);
            cleanupApp();
        };
    }, [location.pathname, location.hash, location.key, navType]);

    return (
        <>
            <Header />
            <main>
                <Outlet />
            </main>
            <Footer />
            <Popup />
        </>
    );
};

export default Layout;

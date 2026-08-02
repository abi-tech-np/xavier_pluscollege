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
        // Run DOM manipulation scripts after render
        try {
            initApp();
        } catch (e) {
            console.error('initApp error:', e);
        }

        if (location.hash) {
            setTimeout(() => {
                const id = location.hash.replace('#', '');
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                    setTimeout(() => refreshApp(), 500); // refresh after smooth scroll finishes
                }
            }, 100);
        } else if (navType === 'PUSH') {
            window.scrollTo(0, 0);
            refreshApp(); // refresh after jump
        } else {
            // POP navigation (browser back/forward or reload)
            // Browser restores scroll automatically, just refresh ScrollTrigger
            setTimeout(() => refreshApp(), 100); 
        }

        const handleLoad = () => {
            refreshApp();
        };
        
        // Add load listener for initial page load when images/fonts finish
        window.addEventListener('load', handleLoad);

        return () => {
            window.removeEventListener('load', handleLoad);
            cleanupApp();
        };
    }, [location.pathname, location.hash, navType]);

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

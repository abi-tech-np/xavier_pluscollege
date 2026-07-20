import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { initApp } from '../js/app.js';

const Layout = () => {
    const location = useLocation();

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
                }
            }, 100);
        } else {
            window.scrollTo(0, 0);
        }
    }, [location.pathname, location.hash]);

    return (
        <>
            <Header />
            <main>
                <Outlet />
            </main>
            <Footer />
        </>
    );
};

export default Layout;

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Layout from './layouts/Layout';
import Home from './pages/Home';
import ContactUs from './pages/ContactUs';
import AboutUs from './pages/AboutUs';
import OurCourses from './pages/OurCourses';
import Science from './pages/courses/Science';
import Management from './pages/courses/Management';
import Humanities from './pages/courses/Humanities';
import Law from './pages/courses/Law';
import ALevelScience from './pages/courses/ALevelScience';
import ALevelNonScience from './pages/courses/ALevelNonScience';
import NewsAndEvents from './pages/NewsAndEvents';
import UpcomingEventsPage from './pages/UpcomingEventsPage';
import UpcomingEventDetailPage from './pages/UpcomingEventDetailPage';
import LifeAtXavierPage from './pages/LifeAtXavierPage';
import ApplyNowPage from './pages/ApplyNowPage';
import LifeAtXavierSinglePage from './pages/LifeAtXavierSinglePage';

import NewsAndEventsSinglePage from './pages/NewsAndEventsSinglePage';
import SkillAndStudiesPage from './pages/SkillAndStudiesPage';

// Admin Pages
import AdminLayout from './layouts/AdminLayout';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import ManageNews from './pages/admin/ManageNews';
import ManageApplications from './pages/admin/ManageApplications';
import ManageCourses from './pages/admin/ManageCourses';
import ManageContacts from './pages/admin/ManageContacts';
import ManageLifeAtXavier from './pages/admin/ManageLifeAtXavier';
import ManagePopups from './pages/admin/ManagePopups';
import ManageUpcomingEvents from './pages/admin/ManageUpcomingEvents';
import ManageRoles from './pages/admin/ManageRoles';
import ManageUsers from './pages/admin/ManageUsers';
import ManageEventSettings from './pages/admin/ManageEventSettings';
import ManageEventRegistrations from './pages/admin/ManageEventRegistrations';
import ManageMetas from './pages/admin/ManageMetas';
import ManageActivityLogs from './pages/admin/ManageActivityLogs';

const App = () => {
  useEffect(() => {
    // Global interceptor for Auth errors
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          // Token is invalid or expired
          if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUser');
            window.location.href = '/admin/login';
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="contact-us" element={<ContactUs />} />
          <Route path="about-us" element={<AboutUs />} />
          <Route path="our-courses" element={<OurCourses />} />
          <Route path="our-courses/science" element={<Science />} />
          <Route path="our-courses/management" element={<Management />} />
          <Route path="our-courses/humanities" element={<Humanities />} />
          <Route path="our-courses/law" element={<Law />} />
          <Route path="our-courses/alevel_science" element={<ALevelScience />} />
          <Route path="our-courses/alevel_non-science" element={<ALevelNonScience />} />
          <Route path="news-and-events" element={<NewsAndEvents />} />
          <Route path="news-and-events/:slug" element={<NewsAndEventsSinglePage />} />
          <Route path="upcoming-events" element={<UpcomingEventsPage />} />
          <Route path="upcoming-events/:slug" element={<UpcomingEventDetailPage />} />
          <Route path="life-at-xavier" element={<LifeAtXavierPage />} />
          <Route path="life-at-xavier/:slug" element={<LifeAtXavierSinglePage />} />
          <Route path="skill/:slug" element={<SkillAndStudiesPage />} />
          <Route path="studies/:slug" element={<SkillAndStudiesPage />} />
          <Route path="apply-now" element={<ApplyNowPage />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="news" element={<ManageNews />} />
          <Route path="applications" element={<ManageApplications />} />
          <Route path="courses" element={<ManageCourses />} />
          <Route path="contacts" element={<ManageContacts />} />
          <Route path="life-at-xaviers" element={<ManageLifeAtXavier />} />
          <Route path="popups" element={<ManagePopups />} />
          <Route path="upcoming-events" element={<ManageUpcomingEvents />} />
          <Route path="roles" element={<ManageRoles />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="event-settings" element={<ManageEventSettings />} />
          <Route path="event-registrations" element={<ManageEventRegistrations />} />
          <Route path="metas" element={<ManageMetas />} />
          <Route path="activity-logs" element={<ManageActivityLogs />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;

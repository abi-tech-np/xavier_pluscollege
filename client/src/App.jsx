import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import LifeAtXavierPage from './pages/LifeAtXavierPage';
import ApplyNowPage from './pages/ApplyNowPage';
import LifeAtXavierSinglePage from './pages/LifeAtXavierSinglePage';

import NewsAndEventsSinglePage from './pages/NewsAndEventsSinglePage';
import SkillAndStudiesPage from './pages/SkillAndStudiesPage';

const AdminRedirect = () => {
  window.location.href = 'http://localhost:8000/admin';
  return null;
};

const App = () => {
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
          <Route path="life-at-xavier" element={<LifeAtXavierPage />} />
          <Route path="life-at-xavier/:slug" element={<LifeAtXavierSinglePage />} />
          <Route path="skill/:slug" element={<SkillAndStudiesPage />} />
          <Route path="studies/:slug" element={<SkillAndStudiesPage />} />
          <Route path="apply-now" element={<ApplyNowPage />} />
          <Route path="admin" element={<AdminRedirect />} />
          <Route path="admin/*" element={<AdminRedirect />} />
          {/* Add more routes here as we migrate them */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;

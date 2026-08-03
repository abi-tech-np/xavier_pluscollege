import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ApplyForm = () => {
    const [courses, setCourses] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        contact: '',
        school: '',
        gpa: '',
        course_id: ''
    });
    const [errors, setErrors] = useState({});
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get('https://plus.xavier.edu.np/plus-api/api/courses');
                setCourses(response.data);
            } catch (error) {
                console.error("Error fetching courses", error);
            }
        };
        fetchCourses();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
        if (errors[e.target.id]) {
            setErrors({ ...errors, [e.target.id]: null });
        }
    };

    const validate = () => {
        let tempErrors = {};
        if (!formData.name) tempErrors.name = "Name is required.";
        if (!formData.email) tempErrors.email = "Email is required.";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) tempErrors.email = "Email is invalid.";
        if (!formData.address) tempErrors.address = "Address is required.";
        if (!formData.contact) tempErrors.contact = "Contact is required.";
        if (!formData.school) tempErrors.school = "School is required.";
        if (!formData.gpa) tempErrors.gpa = "GPA is required.";
        if (!formData.course_id) tempErrors.course_id = "Course is required.";
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            setIsSubmitting(true);
            try {
                await axios.post('https://plus.xavier.edu.np/plus-api/api/apply', formData);
                setIsPopupOpen(true);
                document.querySelector("html").style.overflow = "hidden";
                setFormData({
                    name: '',
                    email: '',
                    address: '',
                    contact: '',
                    school: '',
                    gpa: '',
                    course_id: ''
                });
            } catch (error) {
                console.error('Error submitting form', error);
                alert("Failed to submit application. Please try again.");
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const closePopup = () => {
        setIsPopupOpen(false);
        document.querySelector("html").style.overflowY = "auto";
    };

    return (
        <>
            <section className="apply" id="form">
                <div className="container-lg">
                    <div className="form-container">
                        <h2>Personal Information</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="input-boxes">
                                <label htmlFor="name">Name</label>
                                <input id="name" type="text" placeholder="Name" value={formData.name} onChange={handleChange} />
                                {errors.name && <span className="error">*{errors.name}</span>}
                            </div>

                            <div className="input-boxes">
                                <label htmlFor="email">Email</label>
                                <input id="email" type="text" placeholder="Email" value={formData.email} onChange={handleChange} />
                                {errors.email && <span className="error">*{errors.email}</span>}
                            </div>

                            <div className="input-boxes">
                                <label htmlFor="address">Address</label>
                                <input id="address" type="text" placeholder="Address" value={formData.address} onChange={handleChange} />
                                {errors.address && <span className="error">*{errors.address}</span>}
                            </div>
                            
                            <div className="input-boxes">
                                <label htmlFor="contact">Contact</label>
                                <input id="contact" type="text" placeholder="Contact" value={formData.contact} onChange={handleChange} />
                                {errors.contact && <span className="error">*{errors.contact}</span>}
                            </div>

                            <h2>Academic Information (SEE Level)</h2>

                            <div className="input-boxes">
                                <label htmlFor="school">Previous School name</label>
                                <input id="school" type="text" placeholder="Previous School name" value={formData.school} onChange={handleChange} />
                                {errors.school && <span className="error">*{errors.school}</span>}
                            </div>

                            <div className="input-boxes">
                                <label htmlFor="gpa">GPA</label>
                                <input id="gpa" type="number" placeholder="GPA" step="0.01" value={formData.gpa} onChange={handleChange} />
                                {errors.gpa && <span className="error">*{errors.gpa}</span>}
                            </div>

                            <div className="dropdown">
                                <h2>Choose Courses</h2>
                                <div className="input-boxes">
                                    <label htmlFor="course_id">Interested Course</label>
                                    <select id="course_id" value={formData.course_id} onChange={handleChange}>
                                        <option value=""> Select a course</option>
                                        {courses.map(course => (
                                            <option key={course.id} value={course.id}>{course.course}</option>
                                        ))}
                                    </select>
                                    {errors.course_id && <span className="error">*{errors.course_id}</span>}
                                </div>
                            </div>
                            
                            <div className="submit">
                                <button className="btn" type="submit" disabled={isSubmitting}>
                                    <span>{isSubmitting ? 'Submitting...' : 'Apply Now'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>

            <div className={`apply__popup ${isPopupOpen ? 'apply__popup-open' : ''}`}>
                <div className="apply__popup__inner">
                    <div className="apply__container">
                        <div className="apply__content">
                            <div className="img__holder">
                                <svg width="123" height="139" viewBox="0 0 123 139" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g id="pop">
                                        <g id="flyer">
                                            <path d="M83.187 5.67403C83.187 6.25203 82.717 6.54103 82.392 6.86603C79.3239 9.92834 76.2649 12.9997 73.215 16.08C72.022 17.272 72.022 17.525 73.215 18.717C76.285 21.789 79.321 24.86 82.428 27.895C83.368 28.798 83.332 29.449 82.428 30.352C77.262 35.447 72.131 40.613 67 45.78C66.133 46.647 65.519 46.756 64.651 45.816C63.3931 44.4497 62.0793 43.1359 60.713 41.878C59.846 41.083 59.882 40.468 60.713 39.638C63.856 36.531 66.963 33.351 70.143 30.28C71.083 29.376 71.047 28.762 70.107 27.859C67 24.824 63.965 21.752 60.894 18.681C59.701 17.489 59.701 17.308 60.93 16.08C66.06 10.949 71.19 5.85403 76.25 0.724032C77.153 -0.179968 77.803 -0.287968 78.67 0.688032C79.9 2.06103 81.272 3.32503 82.573 4.62603C82.898 4.91503 83.223 5.20403 83.187 5.67403Z" fill="#AE66D9"/>
                                            <path d="M43.1529 63.484C43.1899 62.906 42.7559 62.617 42.3949 62.256C39.2904 59.1095 36.1586 55.9901 32.9999 52.898C32.1699 52.103 32.0599 51.525 32.9639 50.693C34.3739 49.393 35.7459 47.983 37.0839 46.574C37.7699 45.852 38.3119 45.888 38.9979 46.574C44.2792 51.8914 49.5786 57.1907 54.8959 62.472C55.6549 63.232 55.5459 63.773 54.8239 64.496C49.5425 69.7412 44.2792 75.0046 39.0339 80.286C38.3119 81.044 37.7339 81.044 37.0109 80.286C35.674 78.8768 34.3002 77.5029 32.8909 76.166C32.0609 75.372 32.1689 74.793 32.9639 74.035C36.1079 70.927 39.2509 67.784 42.3589 64.677C42.6839 64.351 43.1169 64.062 43.1529 63.484Z" fill="#A1E52E"/>
                                        </g>
                                    </g>
                                </svg>
                            </div>
                            <div className="content">
                                <p>
                                    Thank you for <span>submitting</span> your form! We <span>appreciate</span> your interest and are excited to assist you
                                    <span>further</span>. Our team will review your submission and get back to you <span>shortly</span>.
                                </p>
                            </div>
                        </div>
                        <div className="btn__container">
                            <a href="/file/Xavier_International_College_+2_brochure_2024.pdf" className="btn" download onClick={closePopup}><span>+2 brochure</span></a>
                            <a href="/file/Xavier_International_College_A_Level_brochure_2024.pdf" className="btn" download onClick={closePopup}><span>a level brochure</span></a>
                        </div>
                    </div>
                    <button className="apply__popup__closebtn" onClick={closePopup} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" className="fbx-icon fbx-icon-close fbx-icon-default">
                            <path className="fbx-icon-close-default" d="M13.405 11.404q0 0.357-0.25 0.607l-1.214 1.214q-0.25 0.25-0.607 0.25t-0.607-0.25l-2.625-2.625-2.625 2.625q-0.25 0.25-0.607 0.25t-0.607-0.25l-1.214-1.214q-0.25-0.25-0.25-0.607t0.25-0.607l2.625-2.625-2.625-2.625q-0.25-0.25-0.25-0.607t0.25-0.607l1.214-1.214q0.25-0.25 0.607-0.25t0.607 0.25l2.625 2.625 2.625-2.625q0.25-0.25 0.607-0.25t0.607 0.25l1.214 1.214q0.25 0.25 0.25 0.607t-0.25 0.607l-2.625 2.625 2.625 2.625q0.25 0.25 0.25 0.607z"></path>
                        </svg>
                    </button>
                </div>
                <div className="apply__popup__bg-overlay" onClick={closePopup}></div>
            </div>
        </>
    );
};

export default ApplyForm;

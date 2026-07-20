import React from 'react';

const ContactDetail = () => {
    return (
        <section className="contact">
            <img src="/images/homepage/course__bg-art.png" alt="" className="art" />
            <div className="container">
                <div className="contact-container">
                    <div className="section__heading-content">
                        <h2 className="section__heading">
                            Contact
                        </h2>
                        <p>
                            Get in touch with Xavier for any queries or assistance.
                        </p>
                    </div>
                    <div className="map-container">
                        <div className="container-lg">
                            <div className="mask">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.103550595355!2d85.33464257599216!3d27.714088925193142!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1973a6729c41%3A0x72a591f5f27acf9!2sXavier%20International%20College!5e0!3m2!1sen!2snp!4v1720165100446!5m2!1sen!2snp"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </div>
                        </div>
                    </div>
                    <div className="contact_details">
                        <div className="container">
                            <div className="contact_details-container">
                                <div className="card address-card">
                                    <div className="card__body">
                                        <img src="/images/contactpage/address.png" alt="" />
                                        <h4 className="card__title">Address</h4>
                                        <p>Kalopul, Kathmandu,<br /> Nepal</p>
                                    </div>
                                </div>
                                <div className="card phone-card">
                                    <div className="card__body">
                                        <img src="/images/contactpage/phone.png" alt="" />
                                        <h4 className="card__title">Phone</h4>
                                        <p>
                                            <a href="tel:+01-4539471">01-4539471</a> |{' '}
                                            <a href="tel:+01-4539472">01-4539472</a> |{' '}
                                            <a href="tel:+01-4539491">01-4539491</a>
                                        </p>
                                    </div>
                                </div>
                                <div className="card email-card">
                                    <div className="card__body">
                                        <img src="/images/contactpage/email.png" alt="" />
                                        <h4 className="card__title">Email</h4>
                                        <p><a href="mailto:info@xavier.edu.np">info@xavier.edu.np</a></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactDetail;

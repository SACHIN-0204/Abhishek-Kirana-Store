import React from "react";
import { Link } from "react-router-dom";
import "../styles/footer.css";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                {/* About Section */}
                <div className="footer-section">
                    <h3 className="footer-title">About Us</h3>
                    <p className="footer-description">
                        Abhishek Kirana Store is your one-stop shop for quality groceries and daily essentials. 
                        We deliver fresh products at affordable prices.
                    </p>
                    <div className="social-links">
                        <a href="https://www.facebook.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="Facebook">
                            <i className="fab fa-facebook"></i>
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="Twitter">
                            <i className="fab fa-twitter"></i>
                        </a>
                        <a href="https://www.instagram.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="Instagram">
                            <i className="fab fa-instagram"></i>
                        </a>
                        <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="LinkedIn">
                            <i className="fab fa-linkedin"></i>
                        </a>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="footer-section">
                    <h3 className="footer-title">Quick Links</h3>
                    <ul className="footer-links">
                        <li><Link to="/shop">Shop</Link></li>
                        <li><Link to="/about">About Us</Link></li>
                        <li><Link to="/contact">Contact Us</Link></li>
                        <li><Link to="/faq">FAQ</Link></li>
                    </ul>
                </div>

                {/* Customer Support */}
                <div className="footer-section">
                    <h3 className="footer-title">Customer Support</h3>
                    <ul className="footer-links">
                        <li><Link to="/privacy">Privacy Policy</Link></li>
                        <li><Link to="/terms">Terms & Conditions</Link></li>
                        <li><Link to="/shipping">Shipping Info</Link></li>
                        <li><Link to="/returns">Returns</Link></li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div className="footer-section">
                    <h3 className="footer-title">Contact Info</h3>
                    <div className="contact-info">
                        <p>
                            <span className="contact-label">Email:</span>
                            <a href="mailto:info@abhishekkirana.com">info@abhishekkirana.com</a>
                        </p>
                        <p>
                            <span className="contact-label">Phone:</span>
                            <a href="tel:+917489001579">+91 7489001579</a>
                        </p>
                        <p>
                            <span className="contact-label">Address:</span>
                            Near Ram Mandir, Ambamoliya, Indore, Madhya Pradesh, India
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer Bottom */}
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Abhishek Kirana Store. All rights reserved.</p>
                <p className="footer-credits">Designed with ❤️ for quality and service</p>
            </div>
        </footer>
    )
};

export default Footer;
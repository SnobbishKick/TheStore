import React from 'react';
import { FaFacebook } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { RiVisaFill } from "react-icons/ri";
import { RiMastercardFill } from "react-icons/ri";
import { BiLogoPaypal } from "react-icons/bi";
import { FaApplePay } from "react-icons/fa";
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-about">
                <h3>About Us</h3>
                <p>
                Welcome to The Store, your one-stop shop for the latest in electronics, clothing, and footwear. Established in 2024, we're dedicated to providing stylish and high-quality products that cater to every man's unique style.                </p>
                <p>
                From cutting-edge gadgets to timeless fashion essentials, we have something for everyone.                 </p>
                <p>
                Discover the perfect blend of technology and style at The Store.
                </p>
            </div>
            <div className="footer-content">
                <div className="footer-section">
                    <h3>Popular Categories</h3>
                    <p>Smartphones</p>
                    <p>Casual Wear</p>
                    <p>Accessories</p>
                    <p>Footwear</p>
                </div>
                <div className="footer-section">
                    <h3>Brands</h3>
                    <p>Samsung</p>
                    <p>Allensolly</p>
                    <p>Sony</p>
                    <p>Nike</p>
                </div>
                <div className="footer-section">
                    <h3>Follow Us</h3>
                    <div className="social-icons">
                        <div className="social-icons1">
                            <FaTwitter />
                            <a href="#" target="_blank" rel="noopener noreferrer">Twitter</a>
                        </div>
                        <div className="social-icons1">
                            <FaFacebook />
                            <a href="#" target="_blank" rel="noopener noreferrer">Facebook</a>
                        </div>
                        <div className="social-icons1">
                            <FaInstagram />
                            <a href="#" target="_blank" rel="noopener noreferrer">Instagram</a>
                        </div>
                    </div>
                </div>
                <div className="footer-section">
                    <h3>Contact Us</h3>
                    <p>Email: support@thestore.com</p>
                    <p>Phone: +123 456 7890</p>
                </div>
            </div>
            <div className="footer-cards">
                <div className="footer-cards1">
                    <p>We accept payments with:</p>
                </div>
                <div className="footer-cards2">
                    <RiVisaFill />
                    <RiMastercardFill />
                    <BiLogoPaypal />
                    {/* <FaApplePay /> */}
                </div>
            </div>
            <div className="footer-bottom">
                <div className="footer-bottom1">
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms & Conditions</a>
                </div>
                <div className="footer-bottom1">
                    <p>&copy; 2024 THESTORE. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;

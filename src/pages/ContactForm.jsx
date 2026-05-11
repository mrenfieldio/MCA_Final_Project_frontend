import React, { useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/global.css";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Globe,
  //   Instagram,
} from "lucide-react";

import { FaLinkedinIn, FaGithub, FaInstagram, FaTwitter } from "react-icons/fa";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);

    // 🔥 Add API here later

    alert("Message sent successfully!");
  };

  return (
    
    <div className="contact-page">
         <Navbar />
      {/* HERO */}
      <section className="contact-hero">
        <div className="hero-content">
          <h1>Contact Us</h1>
          <p>
            Have questions, feedback, or partnership inquiries? Our team is here
            to help you.
          </p>
        </div>
      </section>

      {/* MAIN SECTION */}
      <section className="contact-container">
        {/* LEFT SIDE */}
        <div className="contact-info">
          <div className="info-card">
            <div className="info-icon">
              <Mail size={22} />
            </div>

            <div>
              <h3>Email</h3>
              <p>support@prolinker.com</p>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon">
              <Phone size={22} />
            </div>

            <div>
              <h3>Phone</h3>
              <p>+91 9876543210</p>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon">
              <MapPin size={22} />
            </div>

            <div>
              <h3>Office</h3>
              <p>Kochi, Kerala, India</p>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon">
              <Clock size={22} />
            </div>

            <div>
              <h3>Working Hours</h3>
              <p>Mon - Fri : 9AM - 6PM</p>
            </div>
          </div>

          {/* SOCIALS */}
          {/* <div className="social-section">
            <h3>Follow Us</h3> */}

            <div className="social-section">
              <h3>Follow Us</h3>

              <div className="social-icons">
                <button>
                  <FaLinkedinIn size={18} />
                </button>

                <button>
                  <FaTwitter size={18} />
                </button>

                <button>
                  <FaInstagram size={18} />
                </button>

                <button>
                  <FaGithub size={18} />
                </button>
              </div>
            </div>
          {/* </div> */}
        </div>

        {/* RIGHT SIDE */}
        <div className="contact-form-wrapper">
          <div className="form-header">
            <h2>Send us a message</h2>
            <p>Fill out the form below and we’ll get back to you shortly.</p>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Full Name</label>

                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>

                <input
                  type="email"
                  name="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Company / Organization</label>

              <input
                type="text"
                name="company"
                placeholder="Your company name"
                value={formData.company}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Subject</label>

              <input
                type="text"
                name="subject"
                placeholder="How can we help?"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Message</label>

              <textarea
                name="message"
                rows="6"
                placeholder="Write your message..."
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <button type="submit" className="submit-btn">
              <Send size={18} />
              Send Message
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

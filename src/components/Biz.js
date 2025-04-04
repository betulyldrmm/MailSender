import React from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaInstagram, FaTwitter } from 'react-icons/fa';
import './about.css';

const Contact = () => {
  return (
    <div className="page-container">
      <h1>İletişim</h1>
      <div className="page-content">
        <div className="contact-info">
          <div className="contact-item">
            <FaEnvelope className="contact-icon" />
            <p>info@emailmanagementsystem.com</p>
          </div>
          
          <div className="contact-item">
            <FaPhone className="contact-icon" />
            <p>+90 212 123 4567</p>
          </div>
          
          <div className="contact-item">
            <FaMapMarkerAlt className="contact-icon" />
            <p>Davutpaşa Kampüsü, YTÜ Teknoloji Geliştirme Bölgesi, 34220 Esenler/İstanbul</p>
          </div>
        </div>
        
        <div className="social-contact">
          <h2>Sosyal Medya</h2>
          <div className="social-links-contact">
            <a href="https://instagram.com/ytuskylab" target="_blank" rel="noopener noreferrer">
              <FaInstagram /> @ytuskylab
            </a>
            <a href="https://twitter.com/kullaniciadiniz" target="_blank" rel="noopener noreferrer">
              <FaTwitter /> @kullaniciadiniz
            </a>
          </div>
        </div>
        
        <div className="contact-form">
          <h2>Bizimle İletişime Geçin</h2>
          <form>
            <div className="form-group">
              <label htmlFor="name">Ad Soyad</label>
              <input type="text" id="name" name="name" required />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">E-posta</label>
              <input type="email" id="email" name="email" required />
            </div>
            
            <div className="form-group">
              <label htmlFor="subject">Konu</label>
              <input type="text" id="subject" name="subject" required />
            </div>
            
            <div className="form-group">
              <label htmlFor="message">Mesajınız</label>
              <textarea id="message" name="message" rows="5" required></textarea>
            </div>
            
            <button type="submit" className="contact-submit">Gönder</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
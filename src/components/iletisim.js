// About.js
import React from 'react';
import './iletisim.css';

const About = () => {
  return (
    <div className="page-container">
      <h1>Hakkımızda</h1>
      <div className="page-content">
        <p>Email Management System, kurumsal e-posta iletişimini yönetmek için tasarlanmış kapsamlı bir platformdur.</p>
        <p>Sistemimiz, e-postaların etkin bir şekilde organize edilmesi, izlenmesi ve yanıtlanması için geliştirilmiş özellikler sunar.</p>
        <p>Amacımız, kullanıcılarımızın iletişim süreçlerini basitleştirmek ve verimliliği artırmaktır.</p>
        
        <h2>Misyonumuz</h2>
        <p>Kurumların ve bireylerin e-posta iletişimini en verimli şekilde yönetmelerini sağlamak ve iş süreçlerini hızlandırmak.</p>
        
        <h2>Vizyonumuz</h2>
        <p>E-posta yönetimi alanında lider platform olarak, kullanıcılarımıza en yenilikçi ve kullanıcı dostu çözümleri sunmak.</p>
      </div>
    </div>
  );
};

export default About;


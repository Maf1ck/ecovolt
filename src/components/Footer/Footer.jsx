import React from "react";
import { Link } from "react-router-dom";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaInstagram, FaTelegram, FaViber } from "react-icons/fa";
import css from "./Footer.module.css";
import logo from '../../assets/img/logo.png';

const Footer = () => {
  return (
    <footer className={css.footer}>
      <div className={css.footerContainer}>
        
        {/* Логотип і опис */}
        <div className={css.footerSection}>
          <img src={logo} alt="logo" className={css.footerLogo} />
          <h3 className={css.footerTitle}>EcoVolt</h3>
          <p className={css.footerDescription}>
            Ваш надійний партнер у світі екологічних рішень. 
            Сонячні панелі, інвертори, акумулятори та все для зеленої енергії.
          </p>
          
          {/* Соціальні мережі */}
          <div className={css.socialLinks}>
            <a href="#" className={css.socialLink}><FaFacebook size={20} /></a>
            <a href="#" className={css.socialLink}><FaInstagram size={20} /></a>
            <a href="#" className={css.socialLink}><FaTelegram size={20} /></a>
            <a href="#" className={css.socialLink}><FaViber size={20} /></a>
          </div>
        </div>

        {/* Інформація */}
        <div className={css.footerSection}>
          <h4 className={css.sectionTitle}>Інформація</h4>
          <ul className={css.footerLinks}>
            <li><Link to="#" className={css.footerLink}>Про нас</Link></li>
            <li><Link to="#" className={css.footerLink}>Доставка та оплата</Link></li>
            <li><Link to="#" className={css.footerLink}>Повернення та обмін</Link></li>
            <li><Link to="#" className={css.footerLink}>Гарантія</Link></li>
            <li><Link to="#" className={css.footerLink}>Контакти</Link></li>
          </ul>
        </div>

        {/* Контакти */}
        <div className={css.footerSection}>
          <h4 className={css.sectionTitle}>Контакти</h4>
          <div className={css.contactInfo}>
            <div className={css.contactItem}>
              <FaPhone className={css.contactIcon} />
              <div>
                <p>+380 (98) 515-00-55</p>
              </div>
            </div>
            
            <div className={css.contactItem}>
              <FaEnvelope className={css.contactIcon} />
              <div>
                <p>ecovolt.technology@gmail.com</p>
              </div>
            </div>
            
            <div className={css.contactItem}>
              <FaMapMarkerAlt className={css.contactIcon} />
              <div>
                <p>Київ, Україна</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Нижня частина футера */}
      <div className={css.footerBottom}>
        <div className={css.footerBottomContainer}>
          <div className={css.bottomContent}>
            <p>&copy; 2025 EcoVolt. Всі права захищено.</p>
            <p>Розроблено з ❤️ для екологічного майбутнього</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
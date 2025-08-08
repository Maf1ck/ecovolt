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
          <h3 className={css.footerTitle}>EcoYou</h3>
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

        {/* Категорії товарів - Колонка 1 */}
        <div className={css.footerSection}>
          <h4 className={css.sectionTitle}>Сонячна енергетика</h4>
          <ul className={css.footerLinks}>
            <li><Link to="#" className={css.footerLink}>Сонячні панелі</Link></li>
            <li><Link to="#" className={css.footerLink}>Сонячні інвертори</Link></li>
            <li><Link to="#" className={css.footerLink}>Оптимізатори потужності</Link></li>
            <li><Link to="#" className={css.footerLink}>Контролер</Link></li>
            <li><Link to="#" className={css.footerLink}>Кріплення для сонячних модулів</Link></li>
            <li><Link to="#" className={css.footerLink}>Кабелі і комплектуючі</Link></li>
          </ul>
        </div>

        {/* Категорії товарів - Колонка 2 */}
        <div className={css.footerSection}>
          <h4 className={css.sectionTitle}>Енергозбереження</h4>
          <ul className={css.footerLinks}>
            <li><Link to="#" className={css.footerLink}>Акумулятори, батареї</Link></li>
            <li><Link to="#" className={css.footerLink}>Акумулятори для дронів</Link></li>
            <li><Link to="#" className={css.footerLink}>Джерела безперебійного живлення</Link></li>
            <li><Link to="#" className={css.footerLink}>Зарядні станції, портативні системи</Link></li>
            <li><Link to="#" className={css.footerLink}>Запобіжники</Link></li>
          </ul>
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
                <p>+380 (67) 123-45-67</p>
                <p>+380 (95) 123-45-67</p>
              </div>
            </div>
            
            <div className={css.contactItem}>
              <FaEnvelope className={css.contactIcon} />
              <div>
                <p>info@ecoyou.com.ua</p>
                <p>support@ecoyou.com.ua</p>
              </div>
            </div>
            
            <div className={css.contactItem}>
              <FaMapMarkerAlt className={css.contactIcon} />
              <div>
                <p>м. Кропивницький</p>
                <p>вул. Центральна, 123</p>
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
import React, { useState } from "react";
import { FaBars, FaTimes, FaShoppingCart } from "react-icons/fa";
import css from "./Header.module.css";
import { Link } from "react-router-dom";
import logo from '../../assets/img/logo.png';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [inputSearchItem, setInputSearchItem] = useState(''); // Додано стан для інпуту

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <header className={css.header}>
      <div className={css.headerLayout}>
        
        {/* Ліва частина з бургером і логотипом */}
        <div className={css.leftSection}>
          {/* Кнопка бургер */}
          <button
            className={css.burgerButton}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <FaBars size={24} />
          </button>

          {/* Логотип */}
          <img src={logo} alt="logo" className={css.logo} />
        </div>

        {/* Права частина з пошуком і кошиком */}
        <div className={css.rightSection}>
          {/* Пошук */}
          <div className={css.headerInput}>
            <input
              type="text"
              placeholder="Я шукаю..."
              value={inputSearchItem}
              onChange={(e) => setInputSearchItem(e.target.value)}
            />
            <button className={css.searchButton}>Пошук</button>
          </div>

          {/* Кошик */}
          <button className={css.cartButton}>
            <Link to="/cart" className={css.cartLink}>
              <FaShoppingCart size={24} className={css.cartIcon} />
            </Link>
          </button>
        </div>
      </div>

      {/* Сайдбар */}
      <div
        className={css.sidenav}
        style={{ width: menuOpen ? "250px" : "0" }}
      >
        {/* Кнопка закриття */}
        <FaTimes
          size={30}
          className={css.closebtn}
          onClick={toggleMenu}
        />

        {/* Посилання */}
        <Link to="#" className={css.sidenav__link}>Головна</Link>
        <Link to="#" className={css.sidenav__link}>Про Нас</Link>
        <Link to="#" className={css.sidenav__link}>Контакти</Link>
        <Link to="#" className={css.sidenav__link}>Доставка та Оплата</Link>
        <Link to="#" className={css.sidenav__link}>Перевезення та Обмін</Link>
      </div>
      
      <div
        className={css.overlay}
        style={{ display: menuOpen ? "block" : "none" }}
        onClick={toggleMenu}
      ></div>
    </header>
  );
};

export default Header;
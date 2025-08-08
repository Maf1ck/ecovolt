import React from "react";
import css from "./MainPage.module.css";
import { Link } from "react-router-dom";
import {
  FaSun,             // Сонячні панелі
  FaPowerOff,        // Сонячні інвертори
  FaBolt,            // Запобіжники
  FaBatteryFull,     // Джерела безперебійного живлення
  FaPlug,            // Кабелі і комплектуючі
  FaMicrochip,       // Контролер
  FaHammer,          // Кріплення
  FaBatteryThreeQuarters, // Акумулятори
  FaFireAlt,         // Твердопаливні котли
  FaSnowflake,       // Кондиціонери
  FaExternalLinkAlt  // Зарядні станції
} from "react-icons/fa";
import { FaGaugeHigh } from "react-icons/fa6"; // Оптимізатори потужності
import { GiMushroom } from "react-icons/gi";   // Гриби

const MainPage = () => {
  return (
    <div className={css.MainPage}>
      <div className={css.MainContent}>
        {/* Контент праворуч */}
      </div>

      <aside className={css.CategoriesAside}>
        <ul>
          <li className={css.categoryItem}>
            <Link className={css.categoryTitle}>
              <FaSun className={css.iconTitle} /> Сонячні панелі
            </Link>
          </li>
          <li className={css.categoryItem}>
            <Link className={css.categoryTitle}>
              <FaPowerOff className={css.iconTitle} /> Сонячні інвертори
            </Link>
          </li>
          <li className={css.categoryItem}>
            <Link className={css.categoryTitle}>
              <FaBolt className={css.iconTitle} /> Запобіжники
            </Link>
          </li>
          <li className={css.categoryItem}>
            <Link className={css.categoryTitle}>
              <FaBatteryFull className={css.iconTitle} /> Джерела безперебійного живлення
            </Link>
          </li>
          <li className={css.categoryItem}>
            <Link className={css.categoryTitle}>
              <FaPlug className={css.iconTitle} /> Кабелі і комплектуючі
            </Link>
          </li>
          <li className={css.categoryItem}>
            <Link className={css.categoryTitle}>
              <FaGaugeHigh className={css.iconTitle} /> Оптимізатори потужності
            </Link>
          </li>
          <li className={css.categoryItem}>
            <Link className={css.categoryTitle}>
              <FaMicrochip className={css.iconTitle} /> Контролер
            </Link>
          </li>
          <li className={css.categoryItem}>
            <Link className={css.categoryTitle}>
              <FaHammer className={css.iconTitle} /> Кріплення для сонячних модулів
            </Link>
          </li>
          <li className={css.categoryItem}>
            <Link className={css.categoryTitle}>
              <FaBatteryThreeQuarters className={css.iconTitle} /> Акумулятори, батареї
            </Link>
          </li>
          <li className={css.categoryItem}>
            <Link className={css.categoryTitle}>
              <FaBatteryFull className={css.iconTitle} /> Акумулятори для дронів
            </Link>
          </li>
          <li className={css.categoryItem}>
            <Link className={css.categoryTitle}>
              <FaExternalLinkAlt className={css.iconTitle} /> Зарядні станції, портативні системи
            </Link>
          </li>
          <li className={css.categoryItem}>
            <Link className={css.categoryTitle}>
              <GiMushroom className={css.iconTitle} /> Гриби, грибні добавки
            </Link>
          </li>
          <li className={css.categoryItem}>
            <Link className={css.categoryTitle}>
              <FaFireAlt className={css.iconTitle} /> Твердопаливні котли
            </Link>
          </li>
          <li className={css.categoryItem}>
            <Link className={css.categoryTitle}>
              <FaSnowflake className={css.iconTitle} /> Кондиціонери
            </Link>
          </li>
        </ul>
      </aside>
    </div>
  );
};

export default MainPage;

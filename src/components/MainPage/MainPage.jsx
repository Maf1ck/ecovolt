import React, { useState, useEffect } from "react";
import css from "./MainPage.module.css";
import { Link } from "react-router-dom";
import {
  FaSun,
  FaPowerOff,
  FaBolt,
  FaBatteryFull,
  FaPlug,
  FaMicrochip,
  FaHammer,
  FaBatteryThreeQuarters,
  FaFireAlt,
  FaSnowflake,
  FaExternalLinkAlt
} from "react-icons/fa";
import { FaGaugeHigh } from "react-icons/fa6";
import { GiMushroom } from "react-icons/gi";

const MainPage = () => {
  const [expandedCategories, setExpandedCategories] = useState({});

  const toggleCategory = (categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("https://ecovolt-back.onrender.com/api/products")
      .then(res => res.json())
      .then(data => {
        setProducts(data.products || []);
      })
      .catch(err => console.error(err));
  }, []);

  const categories = [
    {
      id: "solar-panels",
      title: "Сонячні панелі",
      icon: <FaSun className={css.iconTitle} />,
      subcategories: [
        { title: "Risen", link: "/risen" },
        { title: "Trina Solar", link: "/trina-solar" },
        { title: "Jinko Solar", link: "/jinko-solar" },
        { title: "Leapton", link: "/leapton" },
        { title: "Inter Energy", link: "/inter-energy" },
        { title: "Altek", link: "/altek" },
        { title: "Longi Solar", link: "/longi-solar" },
        { title: "JA Solar", link: "/ja-solar" },
        { title: "Canadian Solar", link: "/canadian-solar" },
        { title: "Sola", link: "/sola" },
        { title: "TONGWEI", link: "/tongwei" },
        { title: "Luxen", link: "/luxen" },
        { title: "Ulica", link: "/ulica" },
        { title: "Astronergy", link: "/astronergy" },
        { title: "SunPro", link: "/sunpro" },
        { title: "ZNSHINE", link: "/znshine" },
        { title: "HT-SAAE", link: "/ht-saae" },
        { title: "Horay Solar", link: "/horay-solar" },
      ],
    },
    {
      id: "inverters",
      title: "Сонячні інвертори",
      icon: <FaPowerOff className={css.iconTitle} />,
      subcategories: [
        { title: "Deye", link: "/deye" },
        { title: "Altek", link: "/altek" },
        { title: "Axioma Energy", link: "/axioma-energy" },
        { title: "LuxPower", link: "/luxpower" },
        { title: "Sofar Solar", link: "/sofar-solar" },
        { title: "BlueSun", link: "/bluesun" },
        { title: "Huawei", link: "/huawei" },
        { title: "Felicitysolar", link: "/felicitysolar" },
        { title: "Must", link: "/must" },
        { title: "Solis", link: "/solis" },
        { title: "Afore", link: "/afore" },
        { title: "Fronius", link: "/fronius" },
        { title: "Q-Power", link: "/q-power" },
      ],
    },
    {
      id: "fuses",
      title: "Запобіжники",
      icon: <FaBolt className={css.iconTitle} />,
      subcategories: [],
    },
    {
      id: "ups",
      title: "Джерела безперебійного живлення",
      icon: <FaBatteryFull className={css.iconTitle} />,
      subcategories: [],
    },
    {
      id: "cables",
      title: "Кабелі і комплектуючі",
      icon: <FaPlug className={css.iconTitle} />,
      subcategories: [],
    },
    {
      id: "optimizers",
      title: "Оптимізатори потужності",
      icon: <FaGaugeHigh className={css.iconTitle} />,
      subcategories: [],
    },
    {
      id: "controllers",
      title: "Контролер",
      icon: <FaMicrochip className={css.iconTitle} />,
      subcategories: [],
    },
    {
      id: "mounting",
      title: "Кріплення для сонячних модулів",
      icon: <FaHammer className={css.iconTitle} />,
      subcategories: [],
    },
    {
      id: "batteries",
      title: "Акумулятори, батареї",
      icon: <FaBatteryThreeQuarters className={css.iconTitle} />,
      subcategories: [],
    },
    {
      id: "drone-batteries",
      title: "Акумулятори для дронів",
      icon: <FaBatteryFull className={css.iconTitle} />,
      subcategories: [],
    },
    {
      id: "charging-stations",
      title: "Зарядні станції, портативні системи",
      icon: <FaExternalLinkAlt className={css.iconTitle} />,
      subcategories: [],
    },
    {
      id: "mushrooms",
      title: "Гриби, грибні добавки",
      icon: <GiMushroom className={css.iconTitle} />,
      subcategories: [],
    },
    {
      id: "boilers",
      title: "Твердопаливні котли",
      icon: <FaFireAlt className={css.iconTitle} />,
      subcategories: [],
    },
    {
      id: "air-conditioners",
      title: "Кондиціонери",
      icon: <FaSnowflake className={css.iconTitle} />,
      subcategories: [],
    },
  ];

  return (
    <div className={css.MainPage}>
      <aside className={css.CategoriesAside}>
        <div className={css.Categories}>
          <ul className={css.menuList}>
            <li className={css.menuItem}>
              <div className={css.categoryHeader}>
                <span
                  className={css.categoryHeaderTitle}
                  onClick={() => toggleCategory("main")}
                >
                  ▶ Товари
                </span>
                {expandedCategories["main"] && (
                  <ul className={css.categoryList}>
                    {categories.map((category) => (
                      <li key={category.id} className={css.categoryItem}>
                        <div
                          className={css.categoryTitle}
                          onClick={() => toggleCategory(category.id)}
                        >
                          <span className={css.expandIcon}>
                            {category.subcategories.length > 0 &&
                              (expandedCategories[category.id]
                                ? "▼"
                                : "▶")}
                          </span>
                          {category.icon}
                          <span className={css.categoryText}>
                            {category.title}
                          </span>
                        </div>

                        {category.subcategories.length > 0 &&
                          expandedCategories[category.id] && (
                            <ul className={css.subcategoryList}>
                              {category.subcategories.map(
                                (subcategory, index) => (
                                  <li
                                    key={index}
                                    className={css.subcategoryItem}
                                  >
                                    <Link
                                      to={subcategory.link}
                                      className={css.subcategoryLink}
                                    >
                                      {subcategory.title}
                                    </Link>
                                  </li>
                                )
                              )}
                            </ul>
                          )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
            <li className={css.menuItem}>
              <Link to="/info-delivery" className={css.menuLink}>
                Доставка і оплата
              </Link>
            </li>
            <li className={css.menuItem}>
              <Link to="/about-us" className={css.menuLink}>
                Про Нас
              </Link>
            </li>
            <li className={css.menuItem}>
              <Link to="/reviews" className={css.menuLink}>
                Відгуки
              </Link>
            </li>
            <li className={css.menuItem}>
              <Link to="/transportation-info" className={css.menuLink}>
                Перевезення та Обмін
              </Link>
            </li>
          </ul>
        </div>
      </aside>

      <div className={css.MainContent}>
        <div className={css.contentWrapper}>
          <h1>Продукти</h1>
          <ul className={css.productList}>
  {products.map(product => (
    <li key={product.id} className={css.productItem}>
      <h2 className={css.productTitle}>{product.title}</h2>
      <div 
        className={css.productDescription} 
        dangerouslySetInnerHTML={{ __html: product.description }} 
      />
    </li>
  ))}
</ul>
        </div>
      </div>
    </div>
  );
};

export default MainPage;

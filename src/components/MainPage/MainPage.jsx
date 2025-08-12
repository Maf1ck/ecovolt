import React, { useState, useEffect } from "react";
import css from "./MainPage.module.css";
import { Link } from "react-router-dom";
import axios from 'axios';
import LoadMoreBtn from "../LoadMoreBtn/LoadMoreBtn";
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
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryPages, setCategoryPages] = useState({}); // Сторінки для кожної категорії
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState(null);

  // Функція для перемикання категорій
  const toggleCategory = (categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  // Мапа категорій з їх ключами
  const categoryMap = {
    'Сонячні панелі': 'solar-panels',
    'Сонячні інвертори': 'inverters',
    'Запобіжники': 'fuses',
    'Джерела безперебійного живлення': 'ups',
    'Кабелі і комплектуючі': 'cables',
    'Оптимізатори потужності': 'optimizers',
    'Контролер': 'controllers',
    'Кріплення для сонячних модулів': 'mounting',
    'Акумулятори, батареї': 'batteries',
    'Акумулятори для дронів': 'drone-batteries',
    'Зарядні станції, портативні системи': 'charging-stations',
    'Гриби, грибні добавки': 'mushrooms',
    'Твердопаливні котли': 'boilers',
    'Кондиціонери': 'air-conditioners'
  };

  // Універсальна функція для завантаження товарів за категорією
  const fetchProductsByCategory = async (categoryKey, page = 1, append = false) => {
    try {
      if (page === 1) {
        setLoading(true);
        setProducts([]);
        setCategoryPages(prev => ({ ...prev, [categoryKey]: 1 }));
      } else {
        setLoadingMore(true);
      }

      const response = await fetch(
        `https://ecovolt-back.onrender.com/api/products/category/${categoryKey}?page=${page}&limit=8`,
        {
          headers: {
            'Cache-Control': 'no-cache'
          }
        }
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || `Не вдалося завантажити ${categoryKey}`);
      }

      if (append) {
        setProducts(prev => [...prev, ...data.products]);
      } else {
        setProducts(data.products);
      }
      
      setPagination(data.pagination);
      setCategoryPages(prev => ({ ...prev, [categoryKey]: page }));
      
      if (data.fromCache) {
        console.warn("Використано кешовані дані");
      }
    } catch (err) {
      const errorMessage = err.message || "Невідома помилка";
      setError(errorMessage);
      console.error(`Помилка завантаження ${categoryKey}:`, err);
    } finally {
      if (page === 1) {
        setLoading(false);
      } else {
        setLoadingMore(false);
      }
    }
      

  };
console.log( products);
  // Функція для завантаження звичайних товарів
  const fetchProducts = async (page = 1, append = false) => {
    if (page === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const response = await fetch(
        `https://ecovolt-back.onrender.com/api/products?page=${page}&limit=8`
      );
      const data = await response.json();

      if (response.ok) {
        if (append) {
          setProducts((prev) => [...prev, ...data.products]);
        } else {
          setProducts(data.products || []);
        }
        
        // Створюємо правильну структуру пагінації
        const paginationData = {
          ...data.pagination,
          hasMore: data.pagination.hasMore || (data.pagination.page < data.pagination.totalPages),
          showing: `${((page - 1) * 8) + 1}-${Math.min(page * 8, data.pagination.totalItems)} з ${data.pagination.totalItems}`
        };
        
        setPagination(paginationData);
        setCurrentPage(page);
      } else {
        throw new Error(data.error || 'Помилка завантаження товарів');
      }
    } catch (err) {
      setError(err.message);
      console.error("Помилка завантаження товарів:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
      console.log("Категорії:", products);

  };

  // Функція для завантаження додаткових товарів (залежно від активного фільтру)
  const handleLoadMore = () => {
    if (loadingMore) return;

    if (activeFilter && activeFilter !== null) {
      const currentCategoryPage = categoryPages[activeFilter] || 1;
      if (pagination?.hasMore) {
        fetchProductsByCategory(activeFilter, currentCategoryPage + 1, true);
      }
    } else {
      if (pagination?.hasMore) {
        fetchProducts(currentPage + 1, true);
      }
    }
  };

  // Універсальна функція для показу категорії
  const showCategory = (categoryKey, categoryTitle) => {
    setActiveFilter(categoryKey);
    setError(null);
    fetchProductsByCategory(categoryKey, 1, false);
  };

  // Функція для скидання фільтра
  const resetFilter = () => {
    setActiveFilter(null);
    setError(null);
    fetchProducts(1, false);
  };

  // Змінюємо обробник кліку для категорії
  const handleCategoryClick = (category) => {
    const categoryKey = categoryMap[category.title];
    
    if (categoryKey) {
      // Для всіх активних категорій: перемикаємо розгортання і завантажуємо товари
      const isCurrentlyExpanded = expandedCategories[category.id];
      
      if (!isCurrentlyExpanded) {
        // Якщо категорія згорнута - розгортаємо і завантажуємо товари
        setExpandedCategories(prev => ({
          ...prev,
          'main': true,
          [category.id]: true
        }));
        showCategory(categoryKey, category.title);
      } else {
        // Якщо категорія розгорнута - згортаємо її
        setExpandedCategories(prev => ({
          ...prev,
          [category.id]: false
        }));
      }
    } else {
      // Для категорій без товарів - звичайна логіка
      toggleCategory(category.id);
      resetFilter();
    }
  };

  // Початкове завантаження товарів
  useEffect(() => {
    fetchProducts(1, false);
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
                          onClick={() => handleCategoryClick(category)}
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
          <h1 className={css.pageTitle}>Товари</h1>
          
          {/* Показати активний фільтр */}
          {activeFilter && (
            <div className={css.activeFilter}>
              <p>Показано: {Object.keys(categoryMap).find(key => categoryMap[key] === activeFilter)}</p>
              <button onClick={resetFilter} className={css.clearFilterBtn}>
                Скинути фільтр
              </button>
            </div>
          )}
          
          {/* Інформація про пагінацію */}
          {pagination && (
            <div className={css.paginationInfo}>
              <p>
                Показано {pagination.showing} товарів
              </p>
            </div>
          )}

          {loading ? (
            <div className={css.loadingMessage}>
              <p>Завантаження продуктів...</p>
            </div>
          ) : error ? (
            <div className={css.errorContainer}>
              <p>Помилка завантаження: {error}</p>
              <button 
                onClick={() => {
                  if (activeFilter) {
                    fetchProductsByCategory(activeFilter, 1, false);
                  } else {
                    fetchProducts(1, false);
                  }
                }}
                className={css.retryButton}
              >
                Спробувати ще раз
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className={css.noProductsMessage}>
              <p>Продукти не знайдено</p>
            </div>
          ) : (
            <>
              <div className={css.productsGrid}>
                {products.map((product) => (
                  <div key={product.id} className={css.productCard}>
                    <div className={css.productImageContainer}>
                      <img
                        src={product.main_image}
                        alt={product.name_multilang?.uk || product.name}
                        className={css.productImage}
                        onError={(e) => {
                          e.target.src = '/placeholder-image.png';
                        }}
                      />
                    </div>
                    <div className={css.productName}>
                      {product.name_multilang?.uk || product.name || 'Назва товару'}
                    </div>
                    <div className={css.productPrice}>
                      Ціна: {product.price} грн
                    </div>
                    <div className={css.productButtonContainer}>
                      <button className={css.productButton}>Детальніше</button>
                    </div>
                  </div>
                ))}
              </div>

              {pagination?.hasMore && (
                <div className={css.loadMoreWrapper}>
                  <LoadMoreBtn 
                    handleLoadMore={handleLoadMore}
                    loading={loadingMore}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainPage;
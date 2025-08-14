import React, { useState, useCallback, memo, useEffect } from "react";
import css from "./MainPage.module.css";
import { Link } from "react-router-dom";
import LoadMoreBtn from "../LoadMoreBtn/LoadMoreBtn";
import { CATEGORIES_CONFIG, DEFAULT_IMAGES } from "../../utils/constants";
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

// Мапа іконок для категорій
const CATEGORY_ICONS = {
  "solar-panels": <FaSun className={css.iconTitle} />,
  "inverters": <FaPowerOff className={css.iconTitle} />,
  "fuses": <FaBolt className={css.iconTitle} />,
  "ups": <FaBatteryFull className={css.iconTitle} />,
  "cables": <FaPlug className={css.iconTitle} />,
  "optimizers": <FaGaugeHigh className={css.iconTitle} />,
  "controllers": <FaMicrochip className={css.iconTitle} />,
  "mounting": <FaHammer className={css.iconTitle} />,
  "batteries": <FaBatteryThreeQuarters className={css.iconTitle} />,
  "drone-batteries": <FaBatteryFull className={css.iconTitle} />,
  "charging-stations": <FaExternalLinkAlt className={css.iconTitle} />,
  "mushrooms": <GiMushroom className={css.iconTitle} />,
  "boilers": <FaFireAlt className={css.iconTitle} />,
  "air-conditioners": <FaSnowflake className={css.iconTitle} />
};

// Memoized Product Card component
const ProductCard = memo(({ product }) => {
  const handleImageError = useCallback((e) => {
    e.target.src = DEFAULT_IMAGES.PRODUCT_PLACEHOLDER;
  }, []);

  return (
    <div className={css.productCard}>
      <div className={css.productImageContainer}>
        <img
          src={product.main_image}
          alt={product.name_multilang?.uk || product.name}
          className={css.productImage}
          onError={handleImageError}
          loading="lazy"
        />
      </div>
      <div className={css.productInfo}>
        <div className={css.productName}>
          {product.name_multilang?.uk || product.name || 'Назва товару'}
        </div>
        <div className={css.productPrice}>
          {product.price ? `Ціна: ${product.price} грн` : 'Ціна за запитом'}
        </div>
      </div>
      <div className={css.productButtonContainer}>
        <button className={css.productButton} type="button">
          Детальніше
        </button>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

// Main component
const MainPage = () => {
  // Стан компонента
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});

  // Функція завантаження товарів
  const fetchProducts = useCallback(async (page = 1, append = false, category = null) => {
    try {
      // Очищаємо помилку
      setError(null);
      
      if (page === 1) {
        setLoading(true);
        if (!append) setProducts([]);
      } else {
        setLoadingMore(true);
      }

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '8'
      });
      
      if (category) {
        params.append('category', category);
      }

      console.log(`🔍 Завантажуємо товари: ${category || 'всі'}, сторінка: ${page}`);

      const response = await fetch(
        `https://ecovolt-back.onrender.com/api/products?${params}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
        }
      );

      // Перевірка статусу відповіді
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`📦 Отримано дані:`, data);

      if (!data.success) {
        throw new Error(data.error || `Не вдалося завантажити товари`);
      }

      // Перевірка чи є товари
      if (!data.products || !Array.isArray(data.products)) {
        throw new Error('Некоректна структура даних від сервера');
      }

      if (append && page > 1) {
        setProducts(prev => [...prev, ...data.products]);
      } else {
        setProducts(data.products);
      }
      
      setPagination(data.pagination);
      setCurrentPage(page);
      
      console.log(`📊 Завантажено товарів: ${data.products.length}, всього доступно: ${data.pagination?.totalItems || 'невідомо'}`);
      
    } catch (err) {
      const errorMessage = err.message || "Помилка мережі. Перевірте підключення до інтернету.";
      setError(errorMessage);
      console.error(`❌ Помилка завантаження товарів:`, err);
      
      // Якщо це перша сторінка і помилка, очищаємо продукти
      if (page === 1) {
        setProducts([]);
        setPagination(null);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // Початкове завантаження товарів
  useEffect(() => {
    fetchProducts(1, false, null);
  }, [fetchProducts]);

  // Завантаження більше товарів
  const loadMore = useCallback(() => {
    if (!pagination?.hasMore || loadingMore) return;
    
    const nextPage = currentPage + 1;
    fetchProducts(nextPage, true, activeFilter);
  }, [fetchProducts, pagination?.hasMore, loadingMore, currentPage, activeFilter]);

  // Toggle category expansion
  const toggleCategory = useCallback((categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  }, []);

  // Handle category selection
  const handleCategorySelect = useCallback((categoryKey, categoryTitle) => {
    console.log(`Вибрано категорію: ${categoryTitle} (${categoryKey})`);
    
    // Expand the main categories section and current category
    setExpandedCategories(prev => ({
      ...prev,
      'main': true,
      [categoryKey]: true
    }));

    // Set active filter and load products
    setActiveFilter(categoryKey);
    fetchProducts(1, false, categoryKey);
  }, [fetchProducts]);

  // Handle main categories toggle
  const toggleMainCategories = useCallback(() => {
    toggleCategory('main');
  }, [toggleCategory]);

  // Reset filter
  const resetFilter = useCallback(() => {
    setActiveFilter(null);
    fetchProducts(1, false, null);
  }, [fetchProducts]);

  // Retry function
  const retry = useCallback(() => {
    fetchProducts(currentPage, false, activeFilter);
  }, [fetchProducts, currentPage, activeFilter]);

  // Find active category name
  const activeCategoryName = activeFilter 
    ? CATEGORIES_CONFIG.find(cat => cat.key === activeFilter)?.title 
    : null;

  // Computed values
  const isEmpty = products.length === 0 && !loading;
  const canLoadMore = Boolean(pagination?.hasMore);
  const showingText = pagination?.showing;

  // Category Item Component
  const CategoryItem = memo(({ category, isExpanded, onToggle, onCategorySelect }) => {
    const handleCategoryClick = useCallback(() => {
      if (category.subcategories.length > 0) {
        onToggle(category.id);
      }
      
      // Always try to load category products if it has a key
      if (category.key) {
        onCategorySelect(category.key, category.title);
      }
    }, [category, onToggle, onCategorySelect]);

    return (
      <li className={css.categoryItem}>
        <div className={css.categoryTitle} onClick={handleCategoryClick}>
          <span className={css.expandIcon}>
            {category.subcategories.length > 0 && (isExpanded ? "▼" : "▶")}
          </span>
          {CATEGORY_ICONS[category.id] || <FaSun className={css.iconTitle} />}
          <span className={css.categoryText}>{category.title}</span>
        </div>

        {category.subcategories.length > 0 && isExpanded && (
          <ul className={css.subcategoryList}>
            {category.subcategories.map((subcategory, index) => (
              <li key={index} className={css.subcategoryItem}>
                <Link to={subcategory.link} className={css.subcategoryLink}>
                  {subcategory.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </li>
    );
  });

  CategoryItem.displayName = 'CategoryItem';

  // Loading skeleton component
  const ProductSkeleton = memo(() => (
    <div className={`${css.productCard} ${css.skeleton}`}>
      <div className={css.productImageContainer}>
        <div className={css.skeletonImage}></div>
      </div>
      <div className={css.productInfo}>
        <div className={css.skeletonText}></div>
        <div className={css.skeletonPrice}></div>
      </div>
      <div className={css.productButtonContainer}>
        <div className={css.skeletonButton}></div>
      </div>
    </div>
  ));

  ProductSkeleton.displayName = 'ProductSkeleton';

  // Create skeleton loading items
  const skeletonItems = Array.from({ length: 8 }, (_, i) => (
    <ProductSkeleton key={`skeleton-${i}`} />
  ));

  return (
    <div className={css.MainPage}>
      <aside className={css.CategoriesAside}>
        <div className={css.Categories}>
          <ul className={css.menuList}>
            <li className={css.menuItem}>
              <div className={css.categoryHeader}>
                <span
                  className={css.categoryHeaderTitle}
                  onClick={toggleMainCategories}
                >
                  ▶ Товари
                </span>
                {expandedCategories['main'] && (
                  <ul className={css.categoryList}>
                    {CATEGORIES_CONFIG.map((category) => (
                      <CategoryItem
                        key={category.id}
                        category={category}
                        isExpanded={expandedCategories[category.id]}
                        onToggle={toggleCategory}
                        onCategorySelect={handleCategorySelect}
                      />
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
          
          {/* Active filter indicator */}
          {activeCategoryName && (
            <div className={css.activeFilter}>
              <p>Показано: {activeCategoryName}</p>
              <button 
                onClick={resetFilter} 
                className={css.clearFilterBtn}
                type="button"
              >
                Скинути фільтр
              </button>
            </div>
          )}
          
          {/* Pagination info */}
          {showingText && !loading && (
            <div className={css.paginationInfo}>
              <p>Показано {showingText} товарів</p>
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className={css.loadingMessage}>
              <p>Завантаження товарів...</p>
              <div className={css.productsGrid}>
                {skeletonItems}
              </div>
            </div>
          )}

          {/* Error state */}
          {error && !loading && (
            <div className={css.errorContainer}>
              <div className={css.errorIcon}>⚠️</div>
              <h3>Помилка завантаження</h3>
              <p>{error}</p>
              <button 
                onClick={retry}
                className={css.retryButton}
                type="button"
              >
                Спробувати ще раз
              </button>
            </div>
          )}

          {/* Empty state */}
          {isEmpty && !loading && (
            <div className={css.noProductsMessage}>
              <div className={css.emptyIcon}>📦</div>
              <h3>Товарів не знайдено</h3>
              {activeCategoryName ? (
                <div>
                  <p>У категорії "{activeCategoryName}" немає товарів</p>
                  <button 
                    onClick={resetFilter}
                    className={css.clearFilterBtn}
                    type="button"
                  >
                    Переглянути всі товари
                  </button>
                </div>
              ) : (
                <p>Спробуйте оновити сторінку або зв'яжіться з нами</p>
              )}
            </div>
          )}

          {/* Products grid */}
          {products.length > 0 && !loading && (
            <>
              <div className={css.productsGrid}>
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Load more button */}
              {canLoadMore && (
                <div className={css.loadMoreWrapper}>
                  <LoadMoreBtn 
                    handleLoadMore={loadMore}
                    loading={loadingMore}
                  />
                </div>
              )}

              {/* No more products message */}
              {!canLoadMore && products.length > 0 && (
                <div className={css.endMessage}>
                  <p>Це всі доступні товари</p>
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
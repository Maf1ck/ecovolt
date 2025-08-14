// API Configuration
export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://ecovolt-back.onrender.com/api/products'
  : 'http://localhost:5000/api/products';

// Categories configuration
export const CATEGORIES_CONFIG = [
  {
    id: "solar-panels",
    title: "Сонячні панелі",
    key: "solar-panels",
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
    key: "inverters",
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
    key: "fuses",
    subcategories: [],
  },
  {
    id: "ups",
    title: "Джерела безперебійного живлення",
    key: "ups",
    subcategories: [],
  },
  {
    id: "cables",
    title: "Кабелі і комплектуючі",
    key: "cables",
    subcategories: [],
  },
  {
    id: "optimizers",
    title: "Оптимізатори потужності",
    key: "optimizers",
    subcategories: [],
  },
  {
    id: "controllers",
    title: "Контролер",
    key: "controllers",
    subcategories: [],
  },
  {
    id: "mounting",
    title: "Кріплення для сонячних модулів",
    key: "mounting",
    subcategories: [],
  },
  {
    id: "batteries",
    title: "Акумулятори, батареї",
    key: "batteries",
    subcategories: [],
  },
  {
    id: "drone-batteries",
    title: "Акумулятори для дронів",
    key: "drone-batteries",
    subcategories: [],
  },
  {
    id: "charging-stations",
    title: "Зарядні станції, портативні системи",
    key: "charging-stations",
    subcategories: [],
  },
  {
    id: "mushrooms",
    title: "Гриби, грибні добавки",
    key: "mushrooms",
    subcategories: [],
  },
  {
    id: "boilers",
    title: "Твердопаливні котли",
    key: "boilers",
    subcategories: [],
  },
  {
    id: "air-conditioners",
    title: "Кондиціонери",
    key: "air-conditioners",
    subcategories: [],
  },
];

// Pagination settings
export const PAGINATION_CONFIG = {
  DEFAULT_LIMIT: 8,
  MAX_LIMIT: 50
};

// Cache settings (for debugging)
export const CACHE_CONFIG = {
  MAX_AGE_WARNING: 30 * 60 * 1000, // 30 minutes
  STALE_TIME: 5 * 60 * 1000        // 5 minutes
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Помилка мережі. Перевірте підключення до інтернету.",
  SERVER_ERROR: "Помилка сервера. Спробуйте пізніше.",
  NO_PRODUCTS: "Товари не знайдено",
  LOADING_ERROR: "Не вдалося завантажити товари",
  CATEGORY_ERROR: "Невідома категорія товарів"
};

// Loading states
export const LOADING_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  LOADING_MORE: 'loadingMore',
  ERROR: 'error'
};

// Default images
export const DEFAULT_IMAGES = {
  PRODUCT_PLACEHOLDER: '/placeholder-image.png',
  CATEGORY_PLACEHOLDER: '/category-placeholder.png'
};
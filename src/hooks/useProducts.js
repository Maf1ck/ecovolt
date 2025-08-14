import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  API_BASE_URL, 
  PAGINATION_CONFIG, 
  ERROR_MESSAGES, 
  LOADING_STATES,
  CACHE_CONFIG 
} from '../utils/constants';

const useProducts = () => {
  const [state, setState] = useState({
    products: [],
    loading: true,
    loadingMore: false,
    error: null,
    pagination: null,
    activeFilter: null,
    currentPage: 1,
    categoryPages: {},
    searchQuery: '',
    sortBy: 'name',
    sortOrder: 'asc'
  });

  const abortControllerRef = useRef(null);
  const cacheRef = useRef(new Map());
  const lastFetchTimeRef = useRef(new Map());

  // Helper function to update state
  const updateState = useCallback((updates) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  // Cancel ongoing requests
  const cancelRequests = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    return abortControllerRef.current.signal;
  }, []);

  // Cache management
  const getCacheKey = useCallback((url, options = {}) => {
    return `${url}?${JSON.stringify(options)}`;
  }, []);

  const isDataStale = useCallback((cacheKey) => {
    const lastFetch = lastFetchTimeRef.current.get(cacheKey);
    if (!lastFetch) return true;
    return Date.now() - lastFetch > CACHE_CONFIG.STALE_TIME;
  }, []);

  const setCacheData = useCallback((cacheKey, data) => {
    cacheRef.current.set(cacheKey, data);
    lastFetchTimeRef.current.set(cacheKey, Date.now());
  }, []);

  // Generic fetch function with improved error handling and caching
  const fetchProducts = useCallback(async (url, options = {}) => {
    const { 
      append = false, 
      isLoadMore = false, 
      useCache = true,
      category = null,
      subcategory = null,
      page = 1
    } = options;

    const cacheKey = getCacheKey(url, { category, subcategory, page });

    // Check cache first
    if (useCache && cacheRef.current.has(cacheKey) && !isDataStale(cacheKey)) {
      const cachedData = cacheRef.current.get(cacheKey);
      const newProducts = append 
        ? [...state.products, ...cachedData.products]
        : cachedData.products;
      
      updateState({
        products: newProducts,
        pagination: cachedData.pagination,
        loading: false,
        loadingMore: false,
        error: null
      });
      return cachedData;
    }

    try {
      const signal = cancelRequests();
      
      if (!isLoadMore) {
        updateState({ 
          loading: !append, 
          loadingMore: append, 
          error: null 
        });
      } else {
        updateState({ 
          loadingMore: true, 
          error: null 
        });
      }

      const response = await fetch(url, {
        signal,
        headers: {
          'Cache-Control': 'no-cache',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || ERROR_MESSAGES.SERVER_ERROR);
      }

      // Cache the response
      if (useCache) {
        setCacheData(cacheKey, data);
      }

      // Update products
      const newProducts = append ? [...state.products, ...data.products] : data.products;
      
      updateState({
        products: newProducts,
        pagination: data.pagination,
        loading: false,
        loadingMore: false,
        error: null,
        currentPage: page
      });

      return data;

    } catch (error) {
      if (error.name === 'AbortError') {
        return null;
      }

      const errorMessage = error.message || ERROR_MESSAGES.NETWORK_ERROR;
      
      updateState({
        loading: false,
        loadingMore: false,
        error: errorMessage
      });

      throw error;
    }
  }, [state.products, getCacheKey, isDataStale, setCacheData, cancelRequests, updateState]);

  // Load all products
  const loadAllProducts = useCallback(async (options = {}) => {
    const { 
      limit = PAGINATION_CONFIG.DEFAULT_LIMIT, 
      page = 1,
      sortBy = state.sortBy,
      sortOrder = state.sortOrder,
      search = state.searchQuery
    } = options;
    
    const params = new URLSearchParams({
      limit: limit.toString(),
      page: page.toString(),
      sortBy,
      sortOrder,
      ...(search && { search })
    });

    const url = `${API_BASE_URL}?${params}`;
    return fetchProducts(url, { ...options, page });
  }, [fetchProducts, state.sortBy, state.sortOrder, state.searchQuery]);

  // Load products by category
  const loadProductsByCategory = useCallback(async (category, options = {}) => {
    const { 
      limit = PAGINATION_CONFIG.DEFAULT_LIMIT, 
      page = 1,
      subcategory = null,
      sortBy = state.sortBy,
      sortOrder = state.sortOrder,
      search = state.searchQuery
    } = options;

    const params = new URLSearchParams({
      limit: limit.toString(),
      page: page.toString(),
      sortBy,
      sortOrder,
      ...(search && { search })
    });

    const url = subcategory 
      ? `${API_BASE_URL}/${category}/${subcategory}?${params}`
      : `${API_BASE_URL}/${category}?${params}`;

    updateState({ 
      activeFilter: { category, subcategory },
      categoryPages: {
        ...state.categoryPages,
        [`${category}-${subcategory || 'all'}`]: page
      }
    });

    return fetchProducts(url, { ...options, category, subcategory, page });
  }, [fetchProducts, state.sortBy, state.sortOrder, state.searchQuery, state.categoryPages]);

  // Load more products (pagination)
  const loadMore = useCallback(async (options = {}) => {
    if (state.loadingMore || !state.pagination?.hasMore) {
      return;
    }

    const nextPage = state.currentPage + 1;
    const { 
      limit = PAGINATION_CONFIG.DEFAULT_LIMIT,
      sortBy = state.sortBy,
      sortOrder = state.sortOrder,
      search = state.searchQuery
    } = options;

    try {
      if (state.activeFilter) {
        // Load more for specific category
        await loadProductsByCategory(
          state.activeFilter.category, 
          {
            page: nextPage,
            limit,
            subcategory: state.activeFilter.subcategory,
            append: true,
            isLoadMore: true,
            sortBy,
            sortOrder,
            search
          }
        );
      } else {
        // Load more for all products
        await loadAllProducts({
          page: nextPage,
          limit,
          append: true,
          isLoadMore: true,
          sortBy,
          sortOrder,
          search
        });
      }
    } catch (error) {
      // Error is already handled in fetchProducts
      console.error('Load more error:', error);
    }
  }, [state.loadingMore, state.pagination, state.currentPage, state.activeFilter, state.sortBy, state.sortOrder, state.searchQuery, loadProductsByCategory, loadAllProducts]);

  // Search products
  const searchProducts = useCallback(async (query, options = {}) => {
    const { 
      limit = PAGINATION_CONFIG.DEFAULT_LIMIT,
      page = 1,
      sortBy = state.sortBy,
      sortOrder = state.sortOrder
    } = options;

    updateState({ searchQuery: query });

    if (!query.trim()) {
      // If search is empty, load all products or current category
      if (state.activeFilter) {
        return loadProductsByCategory(state.activeFilter.category, {
          page,
          limit,
          subcategory: state.activeFilter.subcategory,
          sortBy,
          sortOrder
        });
      } else {
        return loadAllProducts({ page, limit, sortBy, sortOrder });
      }
    }

    // Perform search
    const searchParams = new URLSearchParams({
      search: query,
      limit: limit.toString(),
      page: page.toString(),
      sortBy,
      sortOrder
    });

    if (state.activeFilter) {
      // Search within category
      const url = state.activeFilter.subcategory
        ? `${API_BASE_URL}/${state.activeFilter.category}/${state.activeFilter.subcategory}?${searchParams}`
        : `${API_BASE_URL}/${state.activeFilter.category}?${searchParams}`;
      
      return fetchProducts(url, { 
        ...options, 
        category: state.activeFilter.category,
        subcategory: state.activeFilter.subcategory,
        page
      });
    } else {
      // Global search
      const url = `${API_BASE_URL}?${searchParams}`;
      return fetchProducts(url, { ...options, page });
    }
  }, [state.sortBy, state.sortOrder, state.activeFilter, loadProductsByCategory, loadAllProducts, fetchProducts, updateState]);

  // Sort products
  const sortProducts = useCallback(async (sortBy, sortOrder = 'asc', options = {}) => {
    updateState({ sortBy, sortOrder });

    if (state.activeFilter) {
      return loadProductsByCategory(state.activeFilter.category, {
        page: 1,
        subcategory: state.activeFilter.subcategory,
        sortBy,
        sortOrder,
        search: state.searchQuery,
        ...options
      });
    } else {
      return loadAllProducts({
        page: 1,
        sortBy,
        sortOrder,
        search: state.searchQuery,
        ...options
      });
    }
  }, [state.activeFilter, state.searchQuery, loadProductsByCategory, loadAllProducts, updateState]);

  // Reset all filters and load all products
  const resetFilter = useCallback(async (options = {}) => {
    updateState({
      activeFilter: null,
      currentPage: 1,
      searchQuery: '',
      sortBy: 'name',
      sortOrder: 'asc'
    });

    return loadAllProducts({
      page: 1,
      limit: PAGINATION_CONFIG.DEFAULT_LIMIT,
      sortBy: 'name',
      sortOrder: 'asc',
      ...options
    });
  }, [loadAllProducts, updateState]);

  // Get product by ID
  const getProductById = useCallback(async (productId) => {
    try {
      const signal = cancelRequests();
      
      updateState({ loading: true, error: null });

      const response = await fetch(`${API_BASE_URL}/${productId}`, {
        signal,
        headers: {
          'Cache-Control': 'no-cache',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Product not found: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch product');
      }

      updateState({ loading: false });
      return data.product;

    } catch (error) {
      if (error.name === 'AbortError') {
        return null;
      }

      const errorMessage = error.message || ERROR_MESSAGES.NETWORK_ERROR;
      updateState({
        loading: false,
        error: errorMessage
      });

      throw error;
    }
  }, [cancelRequests, updateState]);

  // Refresh data (force reload)
  const refreshData = useCallback(async () => {
    // Clear cache
    cacheRef.current.clear();
    lastFetchTimeRef.current.clear();

    if (state.activeFilter) {
      return loadProductsByCategory(state.activeFilter.category, {
        page: 1,
        subcategory: state.activeFilter.subcategory,
        useCache: false
      });
    } else {
      return loadAllProducts({
        page: 1,
        useCache: false
      });
    }
  }, [state.activeFilter, loadProductsByCategory, loadAllProducts]);

  // Retry last failed operation
  const retry = useCallback(async () => {
    if (state.activeFilter) {
      return loadProductsByCategory(state.activeFilter.category, {
        page: state.currentPage,
        subcategory: state.activeFilter.subcategory
      });
    } else {
      return loadAllProducts({
        page: state.currentPage
      });
    }
  }, [state.activeFilter, state.currentPage, loadProductsByCategory, loadAllProducts]);

  // Initial data load on mount
  useEffect(() => {
  if (state.products.length === 0 && !state.loading && !state.error) {
    loadAllProducts({ page: 1 }).catch(error => {
      console.error('Initial load failed:', error);
    });
  }
}, [state.products.length, state.loading, state.error, loadAllProducts]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Computed values
  const isEmpty = state.products.length === 0 && !state.loading;
  const canLoadMore = Boolean(state.pagination?.hasMore);
  const showingText = state.pagination ? state.pagination.showing : null;
  const totalPages = state.pagination?.totalPages || 0;
  const totalItems = state.pagination?.totalItems || 0;

  // Debug logging (development only)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('useProducts state:', {
        productsCount: state.products.length,
        loading: state.loading,
        loadingMore: state.loadingMore,
        error: state.error,
        activeFilter: state.activeFilter,
        currentPage: state.currentPage,
        pagination: state.pagination
      });
    }
  }, [state]);

  return {
    // Data
    products: state.products,
    pagination: state.pagination,
    activeFilter: state.activeFilter,
    searchQuery: state.searchQuery,
    sortBy: state.sortBy,
    sortOrder: state.sortOrder,
    
    // Status flags
    loading: state.loading,
    loadingMore: state.loadingMore,
    error: state.error,
    isEmpty,
    canLoadMore,
    
    // Computed values
    showingText,
    totalPages,
    totalItems,
    currentPage: state.currentPage,
    
    // Actions
    loadAllProducts,
    loadProductsByCategory,
    loadMore,
    searchProducts,
    sortProducts,
    resetFilter,
    getProductById,
    refreshData,
    retry,
    
    // Cache info (for debugging)
    cacheInfo: {
      size: cacheRef.current.size,
      keys: Array.from(cacheRef.current.keys())
    }
  };
};

export default useProducts;
// pagination.js - Handles pagination logic with session storage caching
import API from './api.js';
import { renderProducts } from './shared.js';

export class ProductPagination {
  constructor(containerId, type = 'explore') {
    this.containerId = containerId;
    this.type = type;
    this.currentPage = 1;
    this.limit = 20;
    this.currentFilters = {};
    this.isLoading = false;
    this.paginationData = null;
    this.cacheKey = 'products_cache';
  }

  async loadPage(page = 1, filters = {}) {
    if (this.isLoading) return;
    
    this.isLoading = true;
    this.currentPage = page;
    this.currentFilters = { ...filters };
    
    // Show loading state
    this.showLoading(true);
    
    try {
      // Check cache first
      const cacheKey = this.getCacheKey(page, filters);
      const cached = this.getFromCache(cacheKey);
      
      let data;
      if (cached) {
        data = cached;
        console.log('Loaded from cache:', cacheKey);
      } else {
        // Fetch from API
        data = await API.getProductsPaginated(page, this.limit, filters);
        this.saveToCache(cacheKey, data);
      }
      
      this.paginationData = data;
      
      // Show empty state if no products
      if (data.products.length === 0) {
        this.showEmptyState();
        this.hidePagination();
      } else {
        // Render products
        renderProducts(data.products, this.containerId, this.type);
        this.hideEmptyState();
        
        // Update pagination UI
        this.updatePaginationUI();
      }
      
      // Update URL/search bar
      this.updateURL();
      
      // Update results count
      this.updateResultsCount(data.pagination.totalProducts);
      
    } catch (error) {
      console.error('Failed to load products:', error);
      this.showError();
    } finally {
      this.isLoading = false;
      this.showLoading(false);
    }
  }

  async search(query, page = 1) {
    const filters = { ...this.currentFilters, search: query };
    await this.loadPage(page, filters);
  }

  async filterByCategory(category, page = 1) {
    const filters = { ...this.currentFilters, category };
    await this.loadPage(page, filters);
  }

  async nextPage() {
    if (this.paginationData?.pagination.hasNextPage) {
      await this.loadPage(this.currentPage + 1, this.currentFilters);
    }
  }

  async prevPage() {
    if (this.paginationData?.pagination.hasPrevPage) {
      await this.loadPage(this.currentPage - 1, this.currentFilters);
    }
  }

  async goToPage(page) {
    await this.loadPage(page, this.currentFilters);
  }

  // Cache Management
  getCacheKey(page, filters) {
    const filterString = JSON.stringify(filters);
    return `${this.cacheKey}_page${page}_${this.limit}_${filterString}`;
  }

  getFromCache(key) {
    try {
      const cached = sessionStorage.getItem(key);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error('Failed to read from cache:', error);
      return null;
    }
  }

  saveToCache(key, data) {
    try {
      sessionStorage.setItem(key, JSON.stringify(data));
      
      // Limit cache size (keep only last 5 pages)
      this.cleanCache();
    } catch (error) {
      console.error('Failed to save to cache:', error);
    }
  }

  cleanCache() {
    try {
      const keys = Object.keys(sessionStorage);
      const cacheKeys = keys.filter(key => key.startsWith(this.cacheKey));
      
      if (cacheKeys.length > 5) {
        // Remove oldest caches (keep newest 5)
        cacheKeys.sort().slice(0, -5).forEach(key => {
          sessionStorage.removeItem(key);
        });
      }
    } catch (error) {
      console.error('Failed to clean cache:', error);
    }
  }

  clearCache() {
    try {
      const keys = Object.keys(sessionStorage);
      keys.filter(key => key.startsWith(this.cacheKey))
          .forEach(key => sessionStorage.removeItem(key));
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  }

  // UI Updates
  showLoading(show) {
    const loadingEl = document.getElementById('loading-products');
    const gridEl = document.getElementById(this.containerId);
    
    if (loadingEl) {
      loadingEl.style.display = show ? 'flex' : 'none';
    }
    
    if (gridEl) {
      gridEl.style.opacity = show ? '0.5' : '1';
    }
  }

  showError() {
    const errorEl = document.getElementById('error-products');
    if (errorEl) {
      errorEl.style.display = 'block';
    }
  }

  showEmptyState() {
    const emptyEl = document.getElementById('empty-products');
    const gridEl = document.getElementById(this.containerId);
    
    if (emptyEl) {
      emptyEl.style.display = 'flex';
    }
    
    if (gridEl) {
      gridEl.innerHTML = '';
    }
  }

  hideEmptyState() {
    const emptyEl = document.getElementById('empty-products');
    if (emptyEl) {
      emptyEl.style.display = 'none';
    }
  }

  hidePagination() {
    const paginationEl = document.getElementById('pagination-controls');
    if (paginationEl) {
      paginationEl.innerHTML = '';
    }
  }

  updatePaginationUI() {
    const paginationEl = document.getElementById('pagination-controls');
    if (!paginationEl || !this.paginationData) return;
    
    const { currentPage, totalPages, hasNextPage, hasPrevPage } = this.paginationData.pagination;
    
    // Basic pagination for mobile
    let html = `
      <div class="pagination">
        <button class="pagination-btn ${!hasPrevPage ? 'disabled' : ''}" 
                ${!hasPrevPage ? 'disabled' : ''}
                data-action="prev">
          <i class="fas fa-chevron-left"></i> Previous
        </button>
        
        <div class="page-indicator">
          <span class="current-page">${currentPage}</span>
          <span class="total-pages">of ${totalPages}</span>
        </div>
        
        <button class="pagination-btn ${!hasNextPage ? 'disabled' : ''}" 
                ${!hasNextPage ? 'disabled' : ''}
                data-action="next">
          Next <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    `;
    
    // Add page numbers for desktop
    if (window.innerWidth > 768) {
      const pageNumbers = this.generatePageNumbers(currentPage, totalPages);
      const pageNumbersHTML = pageNumbers.map(page => {
        if (page === '...') {
          return '<span class="page-dots">...</span>';
        }
        return `
          <button class="page-number ${page === currentPage ? 'active' : ''}" 
                  data-page="${page}">
            ${page}
          </button>
        `;
      }).join('');
      
      html = html.replace('</div>', `
        <div class="page-numbers">${pageNumbersHTML}</div>
      </div>`);
    }
    
    paginationEl.innerHTML = html;
    
    // Add event listeners
    this.setupPaginationEvents();
  }

  generatePageNumbers(current, total, delta = 2) {
    const range = [];
    const rangeWithDots = [];
    
    for (let i = 1; i <= total; i++) {
      if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
        range.push(i);
      }
    }
    
    let prev = 0;
    for (let i of range) {
      if (prev) {
        if (i - prev === 2) {
          rangeWithDots.push(prev + 1);
        } else if (i - prev !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      prev = i;
    }
    
    return rangeWithDots;
  }

  setupPaginationEvents() {
    const paginationEl = document.getElementById('pagination-controls');
    if (!paginationEl) return;
    
    paginationEl.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      
      const action = btn.dataset.action;
      const page = btn.dataset.page;
      
      if (action === 'next') {
        this.nextPage();
      } else if (action === 'prev') {
        this.prevPage();
      } else if (page) {
        this.goToPage(parseInt(page));
      }
    });
  }

  updateResultsCount(total) {
    const resultsCountEl = document.getElementById('results-count');
    if (resultsCountEl) {
      const start = ((this.currentPage - 1) * this.limit) + 1;
      const end = Math.min(this.currentPage * this.limit, total);
      resultsCountEl.textContent = `Showing ${start}-${end} of ${total} products`;
    }
  }

  updateURL() {
    if (!this.paginationData) return;
    
    // Update search bar URL if needed
    const searchInput = document.getElementById('explore-search-input');
    if (searchInput && this.currentFilters.search) {
      searchInput.value = this.currentFilters.search;
    }
    
    // Update browser URL without page reload
    const params = new URLSearchParams();
    params.set('page', this.currentPage);
    
    if (this.currentFilters.search) {
      params.set('q', this.currentFilters.search);
    }
    
    if (this.currentFilters.category && this.currentFilters.category !== 'all') {
      params.set('category', this.currentFilters.category);
    }
    
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }

  // Initialize from URL
  async initFromURL() {
    const params = new URLSearchParams(window.location.search);
    const page = parseInt(params.get('page')) || 1;
    const search = params.get('q') || '';
    const category = params.get('category') || 'all';
    
    const filters = {};
    if (search) filters.search = search;
    if (category && category !== 'all') filters.category = category;
    
    // Update UI
    const searchInput = document.getElementById('explore-search-input');
    if (searchInput && search) {
      searchInput.value = search;
    }
    
    const categoryChips = document.querySelectorAll('.filter-chips .chip');
    if (categoryChips.length) {
      categoryChips.forEach(chip => {
        chip.classList.remove('active');
        if (chip.dataset.category === category) {
          chip.classList.add('active');
        }
      });
    }
    
    await this.loadPage(page, filters);
  }
}
// pagination.js - Kimi-optimized (minimal but compatible)
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
  }

  // Core: Load data without caching
  async loadPage(page = 1, filters = {}) {
    if (this.isLoading) return;
    
    this.isLoading = true;
    this.currentPage = page;
    this.currentFilters = { ...filters };
    
    this.showLoading(true);
    
    try {
      const data = await API.getProductsPaginated(page, this.limit, filters);
      this.paginationData = data;
      
      if (data.products.length === 0) {
        this.showEmptyState();
        this.hidePagination();
      } else {
        renderProducts(data.products, this.containerId, this.type);
        this.hideEmptyState();
        this.updatePaginationUI();
      }
      
      // Keep URL sync (important for sharing/bookmarks)
      this.updateURL();
      
    } catch (error) {
      console.error('Failed to load:', error);
      alert('Failed to load products');
    } finally {
      this.isLoading = false;
      this.showLoading(false);
    }
  }

  // Public API: Keep signatures identical
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

  // UI: Simplified Prev/Next only
  updatePaginationUI() {
    const paginationEl = document.getElementById('pagination-controls');
    if (!paginationEl || !this.paginationData) return;
    
    const { currentPage, hasNextPage, hasPrevPage } = this.paginationData.pagination;
    
    paginationEl.innerHTML = `
      <div class="pagination">
        <button data-action="prev" ${!hasPrevPage ? 'disabled' : ''}>Previous</button>
        <span>Page ${currentPage}</span>
        <button data-action="next" ${!hasNextPage ? 'disabled' : ''}>Next</button>
      </div>
    `;
    
    // FIX: Replace handler instead of accumulating listeners
    paginationEl.onclick = (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      
      const action = btn.dataset.action;
      if (action === 'next') this.nextPage();
      else if (action === 'prev') this.prevPage();
    };
  }

  // Keep for explore.js compatibility
  async initFromURL() {
    const params = new URLSearchParams(window.location.search);
    const page = parseInt(params.get('page')) || 1;
    const search = params.get('q') || '';
    const category = params.get('category') || 'all';
    
    const filters = {};
    if (search) filters.search = search;
    if (category && category !== 'all') filters.category = category;
    
    // Sync search input if it exists
    const searchInput = document.getElementById('explore-search-input');
    if (searchInput && search) searchInput.value = search;
    
    await this.loadPage(page, filters);
  }

  updateURL() {
    if (!this.paginationData) return;
    const params = new URLSearchParams();
    params.set('page', this.currentPage);
    if (this.currentFilters.search) params.set('q', this.currentFilters.search);
    if (this.currentFilters.category) params.set('category', this.currentFilters.category);
    
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }

  // Minimal UI helpers
  showLoading(show) {
    const loadingEl = document.getElementById('loading-products');
    if (loadingEl) loadingEl.style.display = show ? 'block' : 'none';
  }

  showEmptyState() {
    const emptyEl = document.getElementById('empty-products');
    const gridEl = document.getElementById(this.containerId);
    if (emptyEl) emptyEl.style.display = 'flex';
    if (gridEl) gridEl.innerHTML = '';
  }

  hideEmptyState() {
    const emptyEl = document.getElementById('empty-products');
    if (emptyEl) emptyEl.style.display = 'none';
  }

  hidePagination() {
    const el = document.getElementById('pagination-controls');
    if (el) el.innerHTML = '';
  }
}

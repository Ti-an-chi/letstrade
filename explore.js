// explore.js - Explore tab functionality with pagination
import { ProductPagination } from './pagination.js';

let pagination;

export async function initExploreTab() {
  try {
    // Initialize pagination
    pagination = new ProductPagination('explore-product-grid', 'explore');
    
    // Setup UI
    setupExploreUI();
    
    // Load initial page (from URL or page 1)
    await pagination.initFromURL();
    
    // Setup interactions
    setupExploreInteractions();
    
  } catch (error) {
    console.error('Failed to load explore content:', error);
    showErrorMessage('Failed to load products.');
  }
}

function setupExploreUI() {
  // Add pagination controls container if not exists
  const productsSection = document.querySelector('.explore-products-section');
  if (productsSection && !document.getElementById('pagination-controls')) {
    const paginationDiv = document.createElement('div');
    paginationDiv.id = 'pagination-controls';
    paginationDiv.className = 'pagination-controls';
    productsSection.appendChild(paginationDiv);
  }
}

function setupExploreInteractions() {
  // Search input with debounce
  const searchInput = document.getElementById('explore-search-input');
  if (searchInput) {
    let searchTimeout;
    searchInput.addEventListener('input', function() {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        const query = this.value.trim();
        if (query) {
          pagination.search(query, 1); // Reset to page 1 on new search
        } else {
          // Remove search filter if empty
          const filters = { ...pagination.currentFilters };
          delete filters.search;
          pagination.loadPage(1, filters);
        }
      }, 500);
    });
  }
  
  // Category filters
  const filterChips = document.querySelectorAll('.filter-chips .chip');
  filterChips.forEach(chip => {
    chip.addEventListener('click', function() {
      filterChips.forEach(c => c.classList.remove('active'));
      this.classList.add('active');
      
      const category = this.dataset.category;
      const filters = { ...pagination.currentFilters };
      
      if (category === 'all') {
        delete filters.category;
      } else {
        filters.category = category;
      }
      
      pagination.loadPage(1, filters); // Reset to page 1
    });
  });
  
  // Price filter
  const applyPriceBtn = document.getElementById('apply-price-filter');
  if (applyPriceBtn) {
    applyPriceBtn.addEventListener('click', () => {
      const minPriceInput = document.getElementById('min-price');
      const maxPriceInput = document.getElementById('max-price');
      
      const filters = { ...pagination.currentFilters };
      
      if (minPriceInput && minPriceInput.value) {
        filters.minPrice = parseFloat(minPriceInput.value);
      } else {
        delete filters.minPrice;
      }
      
      if (maxPriceInput && maxPriceInput.value) {
        filters.maxPrice = parseFloat(maxPriceInput.value);
      } else {
        delete filters.maxPrice;
      }
      
      pagination.loadPage(1, filters); // Reset to page 1
    });
  }
  
  // Filter toggle
  const filterToggleBtn = document.getElementById('filter-toggle-btn');
  const filterPanel = document.getElementById('filter-panel');
  const closeFilterBtn = document.getElementById('close-filter-btn');

  if (filterToggleBtn && filterPanel) {
    filterToggleBtn.addEventListener('click', function() {
      filterPanel.style.display = filterPanel.style.display === 'block' ? 'none' : 'block';
    });
  }

  if (closeFilterBtn && filterPanel) {
    closeFilterBtn.addEventListener('click', function() {
      filterPanel.style.display = 'none';
    });
  }
  
  // Close filter when clicking outside (mobile)
  document.addEventListener('click', function(e) {
    if (filterPanel && filterPanel.style.display === 'block' && 
        !e.target.closest('.filter-panel') && 
        !e.target.closest('.filter-toggle-btn')) {
      filterPanel.style.display = 'none';
    }
  });
}

// Error display function
function showErrorMessage(message) {
  const errorEl = document.createElement('div');
  errorEl.className = 'error-message';
  errorEl.innerHTML = `
    <i class="fas fa-exclamation-circle"></i>
    <span>${message}</span>
  `;
  
  // Insert at top of explore section
  const exploreSection = document.querySelector('.explore-products-section');
  if (exploreSection) {
    exploreSection.insertBefore(errorEl, exploreSection.firstChild);
    
    // Remove after 5 seconds
    setTimeout(() => {
      errorEl.remove();
    }, 5000);
  }
}
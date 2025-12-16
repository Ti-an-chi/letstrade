// explore.js - Explore tab functionality
import API from './api.js';
import { renderProducts, formatPrice } from './shared.js';

let searchTimeout = null;

export async function initExploreTab() {
  try {
    const products = await API.getSomeProducts(20, 1);
    
    // Store in session for filtering
    sessionStorage.setItem('exploreProducts', JSON.stringify(products));
    
    renderProducts(products, 'explore-product-grid', 'explore');
    updateResultsCount(products.length);
    
    // Setup search and filters
    setupExploreInteractions();
    
  } catch (error) {
    console.error('Failed to load explore content:', error);
    alert('Failed to load products.');
  }
}

function setupExploreInteractions() {
  // Search input with debounce
  const searchInput = document.getElementById('explore-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        filterExploreProducts();
      }, 500);
    });
  }
  
  // Category filters
  const filterChips = document.querySelectorAll('.filter-chips .chip');
  filterChips.forEach(chip => {
    chip.addEventListener('click', function() {
      filterChips.forEach(c => c.classList.remove('active'));
      this.classList.add('active');
      filterExploreProducts();
    });
  });
  
  // Price filter
  const applyPriceBtn = document.getElementById('apply-price-filter');
  if (applyPriceBtn) {
    applyPriceBtn.addEventListener('click', filterExploreProducts);
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
}

async function filterExploreProducts() {
  const searchInput = document.getElementById('explore-search-input');
  const activeCategory = document.querySelector('.filter-chips .chip.active');
  const minPriceInput = document.getElementById('min-price');
  const maxPriceInput = document.getElementById('max-price');
  
  const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
  const category = activeCategory ? activeCategory.dataset.category : 'all';
  const minPrice = minPriceInput ? parseFloat(minPriceInput.value) || 0 : 0;
  const maxPrice = maxPriceInput ? parseFloat(maxPriceInput.value) || Infinity : Infinity;
  
  try {
    let filteredProducts;
    
    if (searchTerm || category !== 'all' || minPrice > 0 || maxPrice < Infinity) {
      // Apply local filters
      const products = JSON.parse(sessionStorage.getItem('exploreProducts') || '[]');
      filteredProducts = products.filter(product => {
        // Search filter
        if (searchTerm && !product.name.toLowerCase().includes(searchTerm) && 
            !product.description?.toLowerCase().includes(searchTerm) &&
            !product.seller?.toLowerCase().includes(searchTerm)) {
          return false;
        }
        
        // Category filter
        if (category !== 'all' && product.category !== category) {
          return false;
        }
        
        // Price filter
        if (product.price < minPrice || product.price > maxPrice) {
          return false;
        }
        
        return true;
      });
    } else {
      // Show all products
      const products = JSON.parse(sessionStorage.getItem('exploreProducts') || '[]');
      filteredProducts = [...products];
    }
    
    renderProducts(filteredProducts, 'explore-product-grid', 'explore');
    updateResultsCount(filteredProducts.length);
    
  } catch (error) {
    console.error('Failed to filter products:', error);
  }
}

function updateResultsCount(count) {
  const resultsCountEl = document.getElementById('results-count');
  if (resultsCountEl) {
    resultsCountEl.textContent = `${count} ${count === 1 ? 'product' : 'products'}`;
  }
}
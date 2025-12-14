// Add this to the DOMContentLoaded event listener, after the existing code
document.addEventListener('DOMContentLoaded', function() {
  // ... existing code ...
  
  // Initialize explore tab when it becomes active
  document.addEventListener('click', function(e) {
    if (e.target.closest('[data-tab="tab-explore"]')) {
      setTimeout(initExploreTab, 100);
    }
  });
  
  // Initialize explore tab on page load if it's active
  if (document.getElementById('tab-explore').classList.contains('active')) {
    setTimeout(initExploreTab, 300);
  }
  
  // Explore Tab Functions
  function initExploreTab() {
    // Load products
    loadExploreProducts();
    
    // Setup filter interactions
    setupFilterHandlers();
    
    // Setup search
    setupSearchHandler();
  }
  
  function setupFilterHandlers() {
    // Category chips
    const chips = document.querySelectorAll('.filter-chips .chip');
    chips.forEach(chip => {
      chip.addEventListener('click', function() {
        chips.forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        applyFilters();
      });
    });
    
    // Price filter apply button
    const applyBtn = document.getElementById('apply-price-filter');
    if (applyBtn) {
      applyBtn.addEventListener('click', applyFilters);
    }
    
    // Price inputs on Enter key
    const priceInputs = document.querySelectorAll('#min-price, #max-price');
    priceInputs.forEach(input => {
      input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          applyFilters();
        }
      });
    });
  }
  
  function setupSearchHandler() {
    const searchInput = document.getElementById('explore-search-input');
    if (searchInput) {
      let searchTimeout;
      searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(applyFilters, 500);
      });
    }
  }
  
  function applyFilters() {
    loadExploreProducts();
  }
  
  function loadExploreProducts() {
    const productGrid = document.getElementById('explore-product-grid');
    const loadingEl = document.getElementById('loading-products');
    const emptyEl = document.getElementById('empty-products');
    const resultsCount = document.getElementById('results-count');
    
    if (!productGrid || !loadingEl) return;
    
    // Show loading
    productGrid.innerHTML = '';
    loadingEl.style.display = 'flex';
    emptyEl.style.display = 'none';
    
    // Get current filters
    const activeChip = document.querySelector('.filter-chips .chip.active');
    const category = activeChip ? activeChip.getAttribute('data-category') : 'all';
    const minPrice = document.getElementById('min-price')?.value || '';
    const maxPrice = document.getElementById('max-price')?.value || '';
    const searchQuery = document.getElementById('explore-search-input')?.value || '';
    
    // Simulate API call
    setTimeout(() => {
      // Simulated products data
      const allProducts = [
        { id: 1, name: "Wireless Bluetooth Headphones", price: 52.000, category: "electronics", seller: "TechGadgets", image: "" },
        { id: 2, name: "Premium Running Shoes", price: 79.000, category: "clothing", seller: "SportStyle", image: "" },
        { id: 3, name: "Ceramic Coffee Mug Set", price: 24.000, category: "home", seller: "HomeEssentials", image: "" },
        { id: 4, name: "Organic Face Cream", price: 32.000, category: "beauty", seller: "NaturalGlow", image: "" },
        { id: 5, name: "Smart Watch", price: 129.000, category: "electronics", seller: "TechGadgets", image: "" },
        { id: 6, name: "Cotton T-Shirt", price: 19.000, category: "clothing", seller: "BasicWear", image: "" },
        { id: 7, name: "Indoor Plant Set", price: 34.000, category: "home", seller: "GreenThumb", image: "" },
        { id: 8, name: "Lipstick Set", price: 28.000, category: "beauty", seller: "BeautyBox", image: "" },
        { id: 9, name: "Laptop Stand", price: 29.000, category: "electronics", seller: "OfficePro", image: "" },
        { id: 10, name: "Yoga Pants", price: 39.000, category: "clothing", seller: "ActiveFit", image: "" },
        { id: 11, name: "Desk Lamp", price: 42.000, category: "home", seller: "HomeEssentials", image: "" },
        { id: 12, name: "Perfume", price: 2.000, category: "beauty", seller: "LuxuryScents", image: "" }
      ];
      
      // Filter products
      let filteredProducts = allProducts.filter(product => {
        // Category filter
        if (category !== 'all' && product.category !== category) {
          return false;
        }
        
        // Price filter
        if (minPrice && product.price < parseFloat(minPrice)) {
          return false;
        }
        if (maxPrice && product.price > parseFloat(maxPrice)) {
          return false;
        }
        
        // Search filter
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          return product.name.toLowerCase().includes(query) || 
                 product.seller.toLowerCase().includes(query) ||
                 product.category.toLowerCase().includes(query);
        }
        
        return true;
      });
      
      // Update results count
      if (resultsCount) {
        resultsCount.textContent = `${filteredProducts.length} ${filteredProducts.length === 1 ? 'product' : 'products'}`;
      }
      
      // Hide loading
      loadingEl.style.display = 'none';
      
      if (filteredProducts.length === 0) {
        // Show empty state
        emptyEl.style.display = 'flex';
        return;
      }
      
      // Display products
      productGrid.innerHTML = '';
      filteredProducts.forEach(product => {
        const productCard = document.createElement('a');
        productCard.href = '#';
        productCard.className = 'explore-product-card';
        productCard.innerHTML = `
          <div class="explore-product-image">
            ${product.image ? 
              `<img src="${product.image}" alt="${product.name}" onerror="this.style.display='none'; this.parentElement.innerHTML='<i class=\\'fas fa-box\\'></i>';">` :
              `<i class="fas fa-box"></i>`
            }
          </div>
          <div class="explore-product-details">
            <h3 class="explore-product-title">${product.name}</h3>
            <p class="explore-product-price">₦${product.price.toFixed(3)}</p>
            <div class="explore-product-seller">
              <i class="fas fa-store"></i>
              <span>${product.seller}</span>
            </div>
          </div>
        `;
        
        productCard.addEventListener('click', function(e) {
          e.preventDefault();
          alert(`Viewing product: ${product.name}`);
          // In production: navigate to product detail page
        });
        
        productGrid.appendChild(productCard);
      });
    }, 800); // Simulate network delay
  }
});
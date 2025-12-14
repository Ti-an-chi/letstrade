// Add these functions to dashboard.js

// Initialize favourites tab when it becomes active
document.addEventListener('click', function(e) {
  if (e.target.closest('[data-tab="tab-fav"]')) {
    setTimeout(initFavouritesTab, 100);
  }
});

// Initialize favourites tab on page load if it's active
if (document.getElementById('tab-fav').classList.contains('active')) {
  setTimeout(initFavouritesTab, 300);
}

function initFavouritesTab() {
  // Load favourites data
  loadFavouritesData();
  
  // Setup favourites interactions
  setupFavouritesInteractions();
}

function loadFavouritesData() {
  const favouritesGrid = document.getElementById('favourites-grid');
  const loadingEl = document.getElementById('loading-favourites');
  const emptyEl = document.getElementById('empty-favourites');
  const actionsEl = document.getElementById('favourites-actions');
  
  if (!favouritesGrid || !loadingEl) return;
  
  // Show loading
  favouritesGrid.innerHTML = '';
  loadingEl.style.display = 'flex';
  emptyEl.style.display = 'none';
  actionsEl.style.display = 'none';
  
  // Simulate API call
  setTimeout(() => {
    // Simulated favourites data
    const favourites = [
      { 
        id: 1, 
        name: "Wireless Bluetooth Headphones", 
        price: 49.000, 
        seller: "TechGadgets", 
        image: "", 
        status: "available",
        addedDate: "2023-12-01"
      },
      { 
        id: 2, 
        name: "Premium Running Shoes", 
        price: 79.000, 
        seller: "SportStyle", 
        image: "", 
        status: "available",
        addedDate: "2023-11-28"
      },
      { 
        id: 3, 
        name: "Ceramic Coffee Mug Set", 
        price: 24.000, 
        seller: "HomeEssentials", 
        image: "", 
        status: "sold",
        addedDate: "2023-11-25"
      },
      { 
        id: 4, 
        name: "Organic Face Cream", 
        price: 32.000, 
        seller: "NaturalGlow", 
        image: "", 
        status: "available",
        addedDate: "2023-11-20"
      },
      { 
        id: 5, 
        name: "Smart Watch", 
        price: 129.000, 
        seller: "TechGadgets", 
        image: "", 
        status: "available",
        addedDate: "2023-11-15"
      },
      { 
        id: 6, 
        name: "Cotton T-Shirt", 
        price: 19.000, 
        seller: "BasicWear", 
        image: "", 
        status: "available",
        addedDate: "2023-11-10"
      }
    ];
    
    // Hide loading
    loadingEl.style.display = 'none';
    
    // Update count
    const countEl = document.getElementById('favourites-count');
    if (countEl) {
      countEl.textContent = `${favourites.length} ${favourites.length === 1 ? 'item' : 'items'} saved`;
    }
    
    if (favourites.length === 0) {
      // Show empty state
      emptyEl.style.display = 'flex';
      return;
    }
    
    // Show actions if we have items
    actionsEl.style.display = 'block';
    
    // Display favourites
    renderFavourites(favourites);
    
    // Setup individual item interactions
    setupFavouriteItemInteractions();
  }, 800);
}

function renderFavourites(favourites) {
  const favouritesGrid = document.getElementById('favourites-grid');
  if (!favouritesGrid) return;
  
  favouritesGrid.innerHTML = '';
  
  favourites.forEach(item => {
    const favouriteItem = document.createElement('div');
    favouriteItem.className = 'favourite-item';
    favouriteItem.dataset.id = item.id;
    favouriteItem.dataset.status = item.status;
    
    favouriteItem.innerHTML = `
      <div class="favourite-checkbox">
        <i class="fas fa-check"></i>
      </div>
      <button class="favourite-remove-btn" data-id="${item.id}">
        <i class="fas fa-times"></i>
      </button>
      <div class="favourite-image">
        ${item.image ? 
          `<img src="${item.image}" alt="${item.name}" onerror="this.style.display='none'; this.parentElement.innerHTML='<i class=\\'fas fa-box\\'></i>';` :
          `<i class="fas fa-box"></i>`
        }
      </div>
      <div class="favourite-details">
        <h3 class="favourite-title">${item.name}</h3>
        <p class="favourite-price">₦${item.price.toFixed(3)}</p>
        <div class="favourite-seller">
          <i class="fas fa-store"></i>
          <span>${item.seller}</span>
        </div>
        <span class="favourite-status status-${item.status}">
          ${item.status === 'available' ? 'In Stock' : 'Out of Stock'}
        </span>
        <div class="favourite-actions">
          <button class="favourite-action-btn buy-now-btn" data-id="${item.id}">
            <i class="fas fa-bolt"></i> Buy Now
          </button>
          <button class="favourite-action-btn add-cart-btn" data-id="${item.id}">
            <i class="fas fa-cart-plus"></i> Add to Cart
          </button>
        </div>
      </div>
    `;
    
    favouritesGrid.appendChild(favouriteItem);
  });
}

function setupFavouritesInteractions() {
  // Filter options
  const filterOptions = document.querySelectorAll('.filter-option');
  filterOptions.forEach(option => {
    option.addEventListener('click', function() {
      filterOptions.forEach(opt => opt.classList.remove('active'));
      this.classList.add('active');
      filterFavourites();
    });
  });
  
  // Sort options
  const sortSelect = document.getElementById('favourites-sort');
  if (sortSelect) {
    sortSelect.addEventListener('change', filterFavourites);
  }
  
  // Bulk remove button
  const bulkRemoveBtn = document.getElementById('bulk-remove-btn');
  if (bulkRemoveBtn) {
    bulkRemoveBtn.addEventListener('click', function() {
      const selectedItems = document.querySelectorAll('.favourite-item.selected');
      if (selectedItems.length === 0) {
        alert('Please select items to remove');
        return;
      }
      
      if (confirm(`Remove ${selectedItems.length} selected item${selectedItems.length === 1 ? '' : 's'} from favourites?`)) {
        selectedItems.forEach(item => {
          item.remove();
        });
        
        updateFavouritesCount();
        checkIfEmpty();
        toggleSelectionMode(false);
      }
    });
  }
  
  // Clear all button
  const clearAllBtn = document.getElementById('clear-all-btn');
  if (clearAllBtn) {
    clearAllBtn.addEventListener('click', function() {
      const favouritesGrid = document.getElementById('favourites-grid');
      if (!favouritesGrid || favouritesGrid.children.length === 0) {
        alert('No items to clear');
        return;
      }
      
      if (confirm('Are you sure you want to clear all favourites?')) {
        favouritesGrid.innerHTML = '';
        updateFavouritesCount();
        checkIfEmpty();
        const actionsEl = document.getElementById('favourites-actions');
        if (actionsEl) actionsEl.style.display = 'none';
      }
    });
  }
}

function setupFavouriteItemInteractions() {
  // Checkbox selection
  const checkboxes = document.querySelectorAll('.favourite-checkbox');
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('click', function(e) {
      e.stopPropagation();
      const item = this.closest('.favourite-item');
      item.classList.toggle('selected');
      this.classList.toggle('selected');
      
      // Check if we're in selection mode
      const selectedItems = document.querySelectorAll('.favourite-item.selected');
      if (selectedItems.length > 0) {
        toggleSelectionMode(true);
      } else {
        toggleSelectionMode(false);
      }
    });
  });
  
  // Remove single item
  const removeBtns = document.querySelectorAll('.favourite-remove-btn');
  removeBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const itemId = this.getAttribute('data-id');
      const item = this.closest('.favourite-item');
      
      if (confirm('Remove this item from favourites?')) {
        item.remove();
        updateFavouritesCount();
        checkIfEmpty();
      }
    });
  });
  
  // Buy Now button
  const buyNowBtns = document.querySelectorAll('.buy-now-btn');
  buyNowBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const itemId = this.getAttribute('data-id');
      const item = this.closest('.favourite-item');
      const itemName = item.querySelector('.favourite-title').textContent;
      
      alert(`Proceeding to checkout for: ${itemName}`);
      // In production: navigate to checkout
    });
  });
  
  // Add to Cart button
  const addCartBtns = document.querySelectorAll('.add-cart-btn');
  addCartBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const itemId = this.getAttribute('data-id');
      const item = this.closest('.favourite-item');
      const itemName = item.querySelector('.favourite-title').textContent;
      
      // Show success message
      showSuccessMessage(`${itemName} added to cart`);
      
      // Update cart count in profile
      const cartCount = document.getElementById('cart-count');
      if (cartCount) {
        const currentCount = parseInt(cartCount.textContent) || 0;
        cartCount.textContent = currentCount + 1;
      }
    });
  });
  
  // Item click (for selection mode)
  const favouriteItems = document.querySelectorAll('.favourite-item');
  favouriteItems.forEach(item => {
    item.addEventListener('click', function(e) {
      // Only trigger if not clicking on a button
      if (!e.target.closest('button') && !e.target.closest('.favourite-checkbox')) {
        const checkbox = this.querySelector('.favourite-checkbox');
        if (checkbox) {
          checkbox.click();
        }
      }
    });
  });
}

function filterFavourites() {
  const activeFilter = document.querySelector('.filter-option.active').dataset.filter;
  const sortValue = document.getElementById('favourites-sort').value;
  const items = document.querySelectorAll('.favourite-item');
  
  // First filter by status
  items.forEach(item => {
    const status = item.dataset.status;
    
    if (activeFilter === 'all') {
      item.style.display = 'block';
    } else if (activeFilter === 'available' && status === 'available') {
      item.style.display = 'block';
    } else if (activeFilter === 'sold' && status === 'sold') {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
  });
  
  // Then sort (in a real app, you'd reorder the DOM)
  // For now, we just show/hide based on filter
}

function updateFavouritesCount() {
  const items = document.querySelectorAll('.favourite-item');
  const countEl = document.getElementById('favourites-count');
  if (countEl) {
    countEl.textContent = `${items.length} ${items.length === 1 ? 'item' : 'items'} saved`;
  }
  
  // Also update profile favourites count
  const profileFavCount = document.getElementById('favorites-count');
  if (profileFavCount) {
    profileFavCount.textContent = items.length;
  }
}

function checkIfEmpty() {
  const items = document.querySelectorAll('.favourite-item');
  const emptyEl = document.getElementById('empty-favourites');
  const actionsEl = document.getElementById('favourites-actions');
  
  if (items.length === 0) {
    emptyEl.style.display = 'flex';
    if (actionsEl) actionsEl.style.display = 'none';
  } else {
    emptyEl.style.display = 'none';
    if (actionsEl) actionsEl.style.display = 'block';
  }
}

function toggleSelectionMode(enable) {
  const favouritesGrid = document.getElementById('favourites-grid');
  if (!favouritesGrid) return;
  
  if (enable) {
    favouritesGrid.classList.add('selection-mode');
  } else {
    favouritesGrid.classList.remove('selection-mode');
  }
}
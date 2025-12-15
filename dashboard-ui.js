// dashboard-ui.js - Part 2 of 2
import API from './api.js';
import { cachedData, currentUser, searchTimeout } from './dashboard-main.js';

// ===== UNIFIED PRODUCT RENDERING =====
function renderProducts(products, containerId, type = 'product') {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  container.innerHTML = '';
  
  products.forEach(product => {
    const productCard = document.createElement(type === 'explore' ? 'a' : 'div');
    
    if (type === 'explore') {
      productCard.href = '#';
      productCard.className = 'explore-product-card';
      productCard.addEventListener('click', function(e) {
        e.preventDefault();
        viewProductDetails(product.id);
      });
    } else {
      productCard.className = type === 'seller' ? 'product-card' : 'recommended-item';
    }
    
    const sellerInfo = `
      <div class="product-seller-info">
        <div class="seller-avatar-small">
          <i class="fas fa-store"></i>
        </div>
        <div class="seller-details">
          <h4 class="seller-name">${product.seller || 'Seller'}</h4>
          <span class="seller-rating">
            <i class="fas fa-star"></i> ${product.rating || '4.5'}
          </span>
        </div>
      </div>
    `;
    
    if (type === 'explore') {
      productCard.innerHTML = `
        <div class="explore-product-image">
          ${product.image ? `<img src="${product.image}" alt="${product.name}">` : `<i class="fas fa-box"></i>`}
        </div>
        <div class="explore-product-details">
          ${sellerInfo}
          <h3 class="explore-product-title">${product.name}</h3>
          <p class="explore-product-price">₦${formatPrice(product.price)}</p>
        </div>
      `;
    } else if (type === 'seller') {
      productCard.innerHTML = `
        <div class="product-image">
          ${product.image ? `<img src="${product.image}" alt="${product.name}">` : `<i class="fas fa-box"></i>`}
        </div>
        <div class="product-details">
          <h3 class="product-title">${product.name}</h3>
          <p class="product-price">₦${formatPrice(product.price)}</p>
          <div class="product-actions">
            <button class="action-btn edit-btn" data-id="${product.id}"><i class="fas fa-edit"></i></button>
            <button class="action-btn delete-btn" data-id="${product.id}"><i class="fas fa-trash"></i></button>
          </div>
        </div>
      `;
    } else {
      productCard.innerHTML = `
        <div class="item-image">
          ${product.image ? `<img src="${product.image}" alt="${product.name}">` : `<i class="fas fa-box"></i>`}
        </div>
        <div class="item-details">
          ${sellerInfo}
          <h3 class="item-title">${product.name}</h3>
          <p class="item-price">₦${formatPrice(product.price)}</p>
        </div>
      `;
    }
    
    container.appendChild(productCard);
  });
  
  if (type === 'seller') {
    setupSellerProductActions();
  }
}

function setupSellerProductActions() {
  const container = document.getElementById('seller-products-grid');
  if (!container) return;
  
  container.addEventListener('click', function(e) {
    const editBtn = e.target.closest('.edit-btn');
    const deleteBtn = e.target.closest('.delete-btn');
    
    if (editBtn) {
      e.preventDefault();
      const productId = editBtn.dataset.id;
      alert(`Edit product ${productId} - coming soon!`);
    }
    
    if (deleteBtn) {
      e.preventDefault();
      const productId = deleteBtn.dataset.id;
      if (confirm('Delete this product?')) {
        API.deleteProduct(productId).then(() => {
          showSuccessMessage('Product deleted');
          deleteBtn.closest('.product-card').remove();
        }).catch(error => {
          console.error('Failed to delete product:', error);
          alert('Failed to delete product.');
        });
      }
    }
  });
}

// ===== FAVOURITES RENDERING =====
function renderFavourites(favourites) {
  const container = document.getElementById('favourites-grid');
  const emptyEl = document.getElementById('empty-favourites');
  const actionsEl = document.getElementById('favourites-actions');
  
  if (!container) return;
  
  container.innerHTML = favourites.map(item => `
    <div class="favourite-item" data-id="${item.id}">
      <button class="favourite-remove-btn" data-id="${item.id}"><i class="fas fa-times"></i></button>
      <div class="favourite-image">
        ${item.image ? `<img src="${item.image}" alt="${item.name}">` : `<i class="fas fa-box"></i>`}
      </div>
      <div class="favourite-details">
        <div class="product-seller-info">
          <div class="seller-avatar-small"><i class="fas fa-store"></i></div>
          <div class="seller-details">
            <h4 class="seller-name">${item.seller}</h4>
            <span class="seller-rating"><i class="fas fa-star"></i> ${item.rating || '4.5'}</span>
          </div>
        </div>
        <h3 class="favourite-title">${item.name}</h3>
        <p class="favourite-price">₦${formatPrice(item.price)}</p>
        <span class="favourite-status status-${item.status || 'available'}">
          ${item.status === 'sold' ? 'Out of Stock' : 'In Stock'}
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
    </div>
  `).join('');
  
  if (emptyEl) emptyEl.style.display = favourites.length === 0 ? 'flex' : 'none';
  if (actionsEl) actionsEl.style.display = favourites.length === 0 ? 'none' : 'block';
}

function renderFollowedSellers(sellers) {
  const container = document.getElementById('sellers-list');
  const emptyEl = document.getElementById('empty-sellers');
  const countEl = document.getElementById('followed-count');
  
  if (!container) return;
  
  container.innerHTML = sellers.map(seller => `
    <a href="#" class="seller-card" data-id="${seller.id}">
      <div class="seller-avatar"><i class="fas fa-store"></i></div>
      <div class="seller-info">
        <h3 class="seller-name">${seller.name}</h3>
        <div class="seller-stats">
          <span class="seller-stat"><i class="fas fa-box"></i> ${seller.productCount} products</span>
          <span class="seller-stat"><i class="fas fa-star"></i> ${seller.rating}</span>
        </div>
      </div>
      <button class="unfollow-btn" data-seller-id="${seller.id}">
        <i class="fas fa-user-minus"></i> Unfollow
      </button>
    </a>
  `).join('');
  
  if (countEl) countEl.textContent = `${sellers.length} seller${sellers.length === 1 ? '' : 's'} followed`;
  if (emptyEl) emptyEl.style.display = sellers.length === 0 ? 'flex' : 'none';
}

// ===== HELPERS =====
function formatPrice(price) {
  return new Intl.NumberFormat('en-NG').format(price);
}

function updateResultsCount(count) {
  const el = document.getElementById('results-count');
  if (el) el.textContent = `${count} product${count === 1 ? '' : 's'}`;
}

function updateFavouritesCount(count) {
  const el = document.getElementById('favourites-count');
  if (!el) return;
  
  const itemCount = count ?? document.getElementById('favourites-grid')?.children.length ?? 0;
  el.textContent = `${itemCount} item${itemCount === 1 ? '' : 's'} saved`;
}

function checkIfFavouritesEmpty() {
  const grid = document.getElementById('favourites-grid');
  const emptyEl = document.getElementById('empty-favourites');
  const actionsEl = document.getElementById('favourites-actions');
  
  if (!grid) return;
  
  const isEmpty = grid.children.length === 0;
  if (emptyEl) emptyEl.style.display = isEmpty ? 'flex' : 'none';
  if (actionsEl) actionsEl.style.display = isEmpty ? 'none' : 'block';
}

function showSuccessMessage(message) {
  const mainContent = document.querySelector('.dashboard-main');
  if (!mainContent) return;
  
  const msg = document.createElement('div');
  msg.className = 'success-message';
  msg.innerHTML = `<i class="fas fa-check-circle"></i><span>${message}</span>`;
  
  mainContent.insertBefore(msg, mainContent.firstChild);
  setTimeout(() => msg.remove(), 5000);
}

function showErrorMessage(message) {
  console.error(message);
}

// ===== ACTION HELPERS =====
function viewProductDetails(productId) {
  console.log('View product:', productId);
}

function editProduct(productId) {
  alert(`Edit product ${productId} - feature coming soon!`);
}

function deleteProduct(productId) {
  if (confirm('Delete this product?')) {
    API.deleteProduct(productId).then(() => {
      showSuccessMessage('Product deleted');
      document.querySelector(`[data-id="${productId}"]`)?.remove();
    }).catch(error => {
      console.error('Failed to delete product:', error);
      alert('Failed to delete product.');
    });
  }
}

// Export for main file
export {
  renderCategories, renderProducts, renderFavourites, renderFollowedSellers,
  setupExploreInteractions, setupFavouritesInteractions, setupFavouritesTabs,
  formatPrice, updateResultsCount, updateFavouritesCount, checkIfFavouritesEmpty,
  showSuccessMessage, showErrorMessage, viewProductDetails, editProduct, deleteProduct
};

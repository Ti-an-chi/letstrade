// shared.js - Shared functions across tabs
export function renderProducts(products, containerId, type = 'product') {
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
    
    // Common seller info structure
    const sellerInfo = `
      <div class="product-seller-info">
        <div class="seller-avatar-small">
          <i class="fas fa-store"></i>
        </div>
        <div class="seller-details">
          <h4 class="seller-name">${product.seller.shop_name || 'Seller'}</h4>
          <span class="seller-rating">
            <i class="fas fa-star"></i> ${product.rating || '4.5'}
          </span>
        </div>
      </div>
    `;
    
    // Different content based on product type
    if (type === 'explore') {
      productCard.innerHTML = `
        <div class="explore-product-image">
          ${product.image ? 
            `<img src="${product.image}" alt="${product.name}">` :
            `<i class="fas fa-box"></i>`
          }
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
          ${product.image ? 
            `<img src="${product.image}" alt="${product.name}">` :
            `<i class="fas fa-box"></i>`
          }
        </div>
        <div class="product-details">
          <h3 class="product-title">${product.name}</h3>
          <p class="product-price">₦${formatPrice(product.price)}</p>
          <div class="product-actions">
            <button class="action-btn edit-btn" data-id="${product.id}">
              <i class="fas fa-edit"></i>
            </button>
            <button class="action-btn delete-btn" data-id="${product.id}">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      `;
    } else {
      // For recommended items
      productCard.innerHTML = `
        <div class="item-image">
          ${product.image ? 
            `<img src="${product.image}" alt="${product.name}">` :
            `<i class="fas fa-box"></i>`
          }
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
  
  // Setup seller product actions
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
      alert(`Edit product ${productId} - feature coming soon!`);
    }
    
    if (deleteBtn) {
      e.preventDefault();
      const productId = deleteBtn.dataset.id;
      if (confirm('Are you sure you want to delete this product?')) {
        alert(`Delete product ${productId} - feature coming soon!`);
      }
    }
  });
}

function viewProductDetails(productId) {
  // Navigate to product details page
  console.log('View product:', productId);
}

export function formatPrice(price) {
  return new Intl.NumberFormat('en-NG').format(price);
}
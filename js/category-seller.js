import API from '../api.js';

// Get category from URL
const urlParams = new URLSearchParams(window.location.search);
const categoryId = urlParams.get('category');

// Category mapping
async function categoryIno() {
  return await API.getCategories()/* || [
      { id: 'electronics', name: 'Electronics', icon: 'mobile-alt', description: 'Tech gadgets and devices' },
      { id: 'clothing', name: 'Clothing', icon: 'tshirt', description: 'Fashion and apparel' },
      { id: 'home', name: 'Home & Garden', icon: 'home', description: 'Home decor and garden items' },
      { id: 'beauty', name: 'Beauty', icon: 'spa', description: 'Cosmetics and personal care' },
      { id: 'other', name: 'Other', icon: 'box', description: 'Various products' }
    ]*/;
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
  initPage();
});

async function initPage() {
  const categoryInfo = await categoryIno();
  console.log(categoryInfo);
  // Update header with category info
  const category = categoryInfo.find(cat => cat.id === categoryId) || categoryInfo[4];
  document.getElementById('categoryTitle').textContent = category.name;
  document.getElementById('categoryDescription').textContent = category.description;
      
  await loadSellers();
}

async function loadSellers() {
  const sellersGrid = document.getElementById('sellersGrid');
  const loadingEl = document.getElementById('loadingSellers');
  const emptyEl = document.getElementById('noSellers');
  
  if (!sellersGrid) return;
  
  try {
    // Show loading
    sellersGrid.innerHTML = '';
    loadingEl.style.display = 'block';
    emptyEl.style.display = 'none';
    
    await new Promise(resolve => setTimeout(resolve, 50));
    const sellers = await API.getSellers(categoryId);
    console.log(sellers[0])
    
    // Hide loading
    loadingEl.style.display = 'none';
    
    if (sellers.length === 0) {
      emptyEl.style.display = 'block';
      return;
    }
    
    // Render sellers
    renderSellers(sellers);
    
  } catch (error) {
    console.error('Failed to load sellers:', error);
    loadingEl.style.display = 'none';
    emptyEl.innerHTML = '<i class="fas fa-exclamation-circle"></i><h3>Failed to load sellers</h3><p>Please try again later</p>';
    emptyEl.style.display = 'block';
  }
}

function renderSellers(sellers) {
  const sellersGrid = document.getElementById('sellersGrid');
  if (!sellersGrid) return;
  
  sellersGrid.innerHTML = '';
  
  sellers.forEach(seller => {
    const sellerCard = document.createElement('div'); // Changed from <a> to <div>
    sellerCard.className = 'seller-card';
    sellerCard.dataset.sellerId = seller.id; // Store ID in data attribute
    
    sellerCard.innerHTML = `
      <div class="seller-header">
        <div class="seller-avatar">
          ${seller.logo_url ?
            `<img src="${seller.logo_url}" alt="${seller.shop_name}">` :
           `<i class="fas fa-store"></i>`
          }
        </div>
        <div class="seller-info">
          <div class="seller-name">${seller.shop_name}</div>
          <div class="seller-rating">
            <i class="fas fa-star"></i>
            ${seller.rating || 5} (0 reviews)
          </div>
        </div>
      </div>
      
      <div class="seller-stats">
        <div class="stat-item">
          <span class="stat-value">0</span>
          <span class="stat-label">Products</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">0</span>
          <span class="stat-label">Followers</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">${seller.total_orders || 0}</span>
          <span class="stat-label">Orders</span>
        </div>
      </div>
      
      <div class="seller-bio">
        ${seller.bio || "No bio available"}
      </div>
      
      <div class="seller-actions">
        <button class="follow-btn" data-seller-id="${seller.id}">
          <i class="fas fa-plus"></i>
          Follow
        </button>
        <a href="/shop/${seller.id}" class="view-btn">
          <i class="fas fa-eye"></i>
          View Shop
        </a>
      </div>
    `;
    
    sellersGrid.appendChild(sellerCard);
  });
}

// Separate function for event delegation setup
function setupSellerCardListeners() {
  const sellersGrid = document.getElementById('sellersGrid');
  if (!sellersGrid) return;

  // Single event listener for the entire grid (event delegation)
  sellersGrid.addEventListener('click', function(e) {
    const sellerCard = e.target.closest('.seller-card');
    if (!sellerCard) return;
    
    const sellerId = sellerCard.dataset.sellerId;
    
    // Check if follow button was clicked
    const followBtn = e.target.closest('.follow-btn');
    if (followBtn) {
      e.preventDefault();
      handleFollowSeller(sellerId, followBtn);
      return;
    }
    
    // Check if view button was clicked (let the anchor tag handle navigation)
    const viewBtn = e.target.closest('.view-btn');
    if (viewBtn) {
      // Anchor will handle navigation naturally
      return;
    }
    
    // If the card itself was clicked (not buttons), navigate to shop
    viewSellerProfile(sellerId);
  });
}

// Handle follow/unfollow logic
async function handleFollowSeller(sellerId, button) {
  const isFollowing = button.textContent.includes('Unfollow');
  const newFollowState = !isFollowing;
  
  // Optimistic UI update
  updateFollowButtonUI(button, newFollowState);
  
  try {
    // Make API call
    const response = await fetch(`/api/sellers/${sellerId}/follow`, {
      method: newFollowState ? 'POST' : 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to update follow status');
    }
    
    // If successful, update any other UI elements if needed
    const data = await response.json();
    console.log('Follow status updated:', data);
    
  } catch (error) {
    // Revert optimistic update on error
    updateFollowButtonUI(button, isFollowing);
    alert('Failed to update follow status. Please try again.');
    console.error('Error following seller:', error);
  }
}

// Update button UI
function updateFollowButtonUI(button, isFollowing) {
  if (isFollowing) {
    button.innerHTML = '<i class="fas fa-check"></i> Unfollow';
    button.classList.add('following');
  } else {
    button.innerHTML = '<i class="fas fa-plus"></i> Follow';
    button.classList.remove('following');
  }
}

// Navigate to seller profile
function viewSellerProfile(sellerId) {
  // Update URL without reloading if using SPA, or redirect
  window.location.href = `/shop/${sellerId}`;
}

// Usage example
async function loadAndRenderSellers() {
  try {
    const response = await fetch('/api/sellers');
    const sellers = await response.json();
    
    renderSellers(sellers);
    setupSellerCardListeners(); // Setup listeners after rendering
    
  } catch (error) {
    console.error('Error loading sellers:', error);
  }
}

// Or if you prefer to keep it all in one call
function renderSellersWithListeners(sellers) {
  renderSellers(sellers);
  setupSellerCardListeners();
}

function toggleFollow(button, sellerId) {
      const isFollowing = button.classList.contains('following');
      
      if (isFollowing) {
        button.classList.remove('following');
        button.innerHTML = '<i class="fas fa-plus"></i> Follow';
        // Call API to unfollow
        console.log(`Unfollow seller ${sellerId}`);
      } else {
        button.classList.add('following');
        button.innerHTML = '<i class="fas fa-check"></i> Following';
        // Call API to follow
        console.log(`Follow seller ${sellerId}`);
      }
    }
  

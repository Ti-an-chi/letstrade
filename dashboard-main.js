// dashboard-main.js - Core dashboard functionality
import API from './api.js';
import { initHomeTab } from './home.js';
import { initExploreTab } from './explore.js';
import { initFavouritesTab } from './favourites.js';
import { initProfileTab } from './profile.js';

// Global state
let currentUser = null;
let cachedData = {
  home: { loaded: false, products: [], categories: [] },
  explore: { loaded: false, products: [], filteredProducts: [] },
  favourites: { loaded: false, items: [] },
  profile: { loaded: false, data: null }
};
let searchTimeout = null;

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
  initDashboard();
});

async function initDashboard() {
  try {
    // Load user data first
    await loadUserData();
    
    // Setup tab navigation
    setupTabNavigation();
    
    // Setup global event listeners
    setupGlobalEventListeners();
    
    // Load initial tab (Home)
    loadTabContent('tab-home');
    
  } catch (error) {
    console.error('Failed to initialize dashboard:', error);
    showErrorMessage('Failed to load dashboard. Please refresh the page.');
  }
}

// User Data Management
async function loadUserData() {
  try {
    const userData = await API.getUserData();
    currentUser = userData;
    updateUserUI(userData);
    
    if (userData?.role === 'seller') {
      updateSellerDashboard(userData);
    }
    cachedData.profile.data = userData;
    cachedData.profile.loaded = true;
  } catch (error) {
    console.error('Failed to load user data:', error);
    // Use default user data as fallback
    currentUser = {
      username: 'User',
      email: 'user@example.com',
      isSeller: false,
      role: 'buyer'
    };
    updateUserUI(currentUser);
  }
}

function updateUserUI(userData) {
  // Update header user info
  const userNameEl = document.getElementById('user-name');
  const userEmailEl = document.getElementById('user-email');
  const userAvatarEl = document.getElementById('user-avatar-img');
  const profileNameEl = document.getElementById('profile-display-name');
  const profileEmailEl = document.getElementById('profile-display-email');
  const profileRoleEl = document.getElementById('profile-role');
  
  if (userNameEl) userNameEl.textContent = userData.username;
  if (userEmailEl) userEmailEl.textContent = userData.email;
  if (profileNameEl) profileNameEl.textContent = userData.username;
  if (profileEmailEl) profileEmailEl.textContent = userData.email;
  if (profileRoleEl) profileRoleEl.textContent = userData.isSeller ? 'Seller' : 'Buyer';
  
  // Update avatar if available
  if (userAvatarEl && userData.avatarUrl) {
    userAvatarEl.src = userData.avatarUrl;
  }
  
  // Update buyer stats
  if (userData.role !== 'seller') {
    updateBuyerStats(userData);
  }
}

function updateBuyerStats(userData) {
  const ordersCountEl = document.getElementById('orders-count');
  const cartCountEl = document.getElementById('cart-count');
  const favoritesCountEl = document.getElementById('favorites-count');
  
  if (ordersCountEl) ordersCountEl.textContent = userData.ordersCount || 0;
  if (cartCountEl) cartCountEl.textContent = userData.cartCount || 0;
  if (favoritesCountEl) favoritesCountEl.textContent = userData.favoritesCount || 0;
}

function updateSellerDashboard(userData) {
  const sellerBoardEl = document.getElementById('seller-board');
  if (sellerBoardEl) {
    sellerBoardEl.style.display = 'block';
  }
  
  // Update seller stats
  const profileViewsEl = document.getElementById('profile-views');
  const totalOrdersEl = document.getElementById('total-orders');
  
  if (profileViewsEl) profileViewsEl.textContent = userData.profileViews || 0;
  if (totalOrdersEl) totalOrdersEl.textContent = userData.sellerOrders || 0;
  
  // Show seller profile link in profile tab
  const profileLinkEl = document.getElementById('seller-profile-link');
  if (profileLinkEl) {
    profileLinkEl.style.display = 'block';
    document.getElementById('profile-link-url').textContent = userData.profileLink || '';
  }
  
  // Hide become seller button
  const becomeSellerBtn = document.getElementById('become-seller-btn');
  if (becomeSellerBtn) becomeSellerBtn.style.display = 'none';
  
  // Hide kebab menu for sellers
  const profileActions = document.querySelector('.profile-actions');
  if (profileActions) {
    profileActions.style.display = 'none';
  }
}

// Tab Management
function setupTabNavigation() {
  const tabLinks = document.querySelectorAll('.nav-item[data-tab]');
  
  tabLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const tabId = this.getAttribute('data-tab');
      switchToTab(tabId);
    });
  });
  
  // Search bar goes to explore tab
  const searchBarLink = document.getElementById('search-bar-link');
  if (searchBarLink) {
    searchBarLink.addEventListener('click', function(e) {
      e.preventDefault();
      switchToTab('tab-explore');
    });
  }
}

function switchToTab(tabId) {
  // Update active tab in navigation
  const tabLinks = document.querySelectorAll('.nav-item[data-tab]');
  tabLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('data-tab') === tabId) {
      link.classList.add('active');
    }
  });
  
  // Show selected tab content
  const tabContents = document.querySelectorAll('.tab-content');
  tabContents.forEach(content => {
    content.classList.remove('active');
    if (content.id === tabId) {
      content.classList.add('active');
    }
  });
  
  // Load tab content if not already loaded
  loadTabContent(tabId);
}

async function loadTabContent(tabId) {
  if (cachedData[tabId.replace('tab-', '')]?.loaded) {
    return; // Content already loaded
  }
  
  try {
    switch(tabId) {
      case 'tab-home':
        await initHomeTab();
        break;
      case 'tab-explore':
        await initExploreTab();
        break;
      case 'tab-fav':
        await initFavouritesTab();
        break;
      case 'tab-profile':
        await initProfileTab();
        break;
    }
    
    cachedData[tabId.replace('tab-', '')].loaded = true;
    
  } catch (error) {
    console.error(`Failed to load ${tabId}:`, error);
    showErrorMessage(`Failed to load ${tabId.replace('tab-', '')} content.`);
  }
}

// Listen for tab switch events from other modules
document.addEventListener('switchTab', (e) => {
  switchToTab(e.detail);
});
// Global Event Listeners
function setupGlobalEventListeners() {
  // Kebab menu toggle
  const kebabBtn = document.getElementById('profile-kebab-btn');
  const dropdown = document.getElementById('profile-dropdown');
  const setupSellerBtn = document.getElementById('setup-seller-btn');

  if (kebabBtn && dropdown) {
    kebabBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function() {
      dropdown.style.display = 'none';
    });

    // Prevent dropdown from closing when clicking inside it
    dropdown.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  }

  if (setupSellerBtn) {
    setupSellerBtn.addEventListener('click', function() {
      dropdown.style.display = 'none';
      
      if (confirm('Ready to start your seller journey? You\'ll be able to list products and grow your business.')) {
        /*API.becomeSeller().then(response => {
          showSuccessMessage('Welcome to the seller community!');*/
          // Refresh user data
          window.location.href = sellerSignup.html;
          //loadUserData();
        //}).catch(error => {
          //console.error('Failed to become seller:', error);
          //alert('Failed to setup seller account. Please try again.');});
      }
    });
  }
}

// Helper Functions
function formatPrice(price) {
  return new Intl.NumberFormat('en-NG').format(price);
}

// UI Feedback Functions
function showSuccessMessage(message) {
  const messageEl = document.createElement('div');
  messageEl.className = 'success-message';
  messageEl.innerHTML = `
    <i class="fas fa-check-circle"></i>
    <span>${message}</span>
  `;
  
  // Insert at top of main content
  const mainContent = document.querySelector('.dashboard-main');
  if (mainContent) {
    mainContent.insertBefore(messageEl, mainContent.firstChild);
    
    // Remove after 5 seconds
    setTimeout(() => {
      messageEl.remove();
    }, 5000);
  }
}

function showErrorMessage(message) {
  console.error('Error:', message);
  // In production: show error toast/notification
}

// Export for other modules
export { 
  currentUser, 
  cachedData, 
  searchTimeout,
  formatPrice,
  showSuccessMessage,
  showErrorMessage,
  switchToTab,
  loadUserData
};
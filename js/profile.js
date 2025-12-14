// Add these functions to dashboard.js

// Initialize profile tab when it becomes active
document.addEventListener('click', function(e) {
  if (e.target.closest('[data-tab="tab-profile"]')) {
    setTimeout(initProfileTab, 100);
  }
});

// Initialize profile tab on page load if it's active
if (document.getElementById('tab-profile').classList.contains('active')) {
  setTimeout(initProfileTab, 300);
}

function initProfileTab() {
  // Load user profile data
  loadProfileData();
  
  // Setup profile interactions
  setupProfileInteractions();
  
  // Check if we're viewing own profile or other seller's profile
  const urlParams = new URLSearchParams(window.location.search);
  const sellerId = urlParams.get('seller');
  
  if (sellerId && sellerId !== 'current-user') {
    // We're viewing another seller's profile
    loadOtherSellerProfile(sellerId);
  } else {
    // We're viewing own profile
    showOwnProfile();
  }
}

function loadProfileData() {
  // In production, this would come from your API
  setTimeout(() => {
    // Simulated user data
    const userData = {
      name: "Alex Johnson",
      email: "alex@example.com",
      avatarUrl: "",
      isSeller: false, // Change to true to test seller view
      role: "buyer", // or "seller"
      ordersCount: 3,
      cartCount: 2,
      favoritesCount: 8,
      profileLink: "ontropp.com/seller/alexjohnson",
      profileViews: 125,
      totalOrders: 42,
      rating: 4.8
    };
    
    updateProfileUI(userData);
  }, 300);
}

function updateProfileUI(userData) {
  // Update basic info
  document.getElementById('profile-display-name').textContent = userData.name;
  document.getElementById('profile-display-email').textContent = userData.email;
  document.getElementById('profile-role').textContent = userData.isSeller ? 'Seller' : 'Buyer';
  
  // Update buyer stats
  document.getElementById('orders-count').textContent = userData.ordersCount;
  document.getElementById('cart-count').textContent = userData.cartCount;
  document.getElementById('favorites-count').textContent = userData.favoritesCount;
  
  // Update seller-specific elements
  const profileLinkEl = document.getElementById('seller-profile-link');
  const sellerDashboardEl = document.getElementById('profile-seller-dashboard');
  const buyerSectionEl = document.getElementById('profile-buyer-section');
  const becomeSellerBtn = document.getElementById('become-seller-btn');
  
  if (userData.isSeller) {
    // Show seller elements
    profileLinkEl.style.display = 'block';
    sellerDashboardEl.style.display = 'block';
    buyerSectionEl.style.display = 'none';
    becomeSellerBtn.style.display = 'none';
    
    // Update seller stats
    document.getElementById('seller-profile-views').textContent = userData.profileViews;
    document.getElementById('seller-total-orders').textContent = userData.totalOrders;
    document.getElementById('seller-rating').textContent = userData.rating;
    document.getElementById('profile-link-url').textContent = userData.profileLink;
    
    // Load seller products
    loadProfileSellerProducts();
  } else {
    // Show buyer elements
    profileLinkEl.style.display = 'none';
    sellerDashboardEl.style.display = 'none';
    buyerSectionEl.style.display = 'block';
    becomeSellerBtn.style.display = 'block';
  }
  
  // Load buyer favorites
  if (!userData.isSeller) {
    loadBuyerFavorites();
  }
}

function setupProfileInteractions() {
  // Edit profile button
  const editProfileBtn = document.getElementById('edit-profile-btn');
  if (editProfileBtn) {
    editProfileBtn.addEventListener('click', function() {
      alert('Edit profile feature coming soon!');
    });
  }
  
  // Edit avatar button
  const editAvatarBtn = document.getElementById('edit-avatar-btn');
  if (editAvatarBtn) {
    editAvatarBtn.addEventListener('click', function() {
      alert('Change profile picture feature coming soon!');
    });
  }
  
  // Copy profile link button
  const copyLinkBtn = document.getElementById('copy-link-btn');
  if (copyLinkBtn) {
    copyLinkBtn.addEventListener('click', function() {
      const linkUrl = document.getElementById('profile-link-url').textContent;
      navigator.clipboard.writeText(linkUrl).then(() => {
        const originalText = this.innerHTML;
        this.innerHTML = '<i class="fas fa-check"></i> Copied!';
        this.style.backgroundColor = 'var(--secondary)';
        
        setTimeout(() => {
          this.innerHTML = originalText;
          this.style.backgroundColor = '';
        }, 2000);
      });
    });
  }
  
  // Become seller button
  const becomeSellerBtn = document.getElementById('become-seller-btn');
  if (becomeSellerBtn) {
    becomeSellerBtn.addEventListener('click', function() {
      if (confirm('Are you sure you want to become a seller? You\'ll be able to list products and create your seller profile.')) {
        alert('Redirecting to seller onboarding...');
        // In production: redirect to seller onboarding
      }
    });
  }
  
  // Back to profile button (for viewing other sellers)
  const backToProfileBtn = document.getElementById('back-to-profile-btn');
  if (backToProfileBtn) {
    backToProfileBtn.addEventListener('click', function(e) {
      e.preventDefault();
      showOwnProfile();
    });
  }
}

function showOwnProfile() {
  // Hide other seller profile
  document.getElementById('other-seller-profile').style.display = 'none';
  
  // Show own profile based on user role
  loadProfileData();
}

function loadOtherSellerProfile(sellerId) {
  // Hide own profile sections
  document.getElementById('profile-seller-dashboard').style.display = 'none';
  document.getElementById('profile-buyer-section').style.display = 'none';
  document.getElementById('seller-profile-link').style.display = 'none';
  document.getElementById('become-seller-btn').style.display = 'none';
  
  // Show other seller profile
  const otherSellerProfile = document.getElementById('other-seller-profile');
  otherSellerProfile.style.display = 'block';
  
  // Simulate loading seller data
  setTimeout(() => {
    // Simulated other seller data
    const sellerData = {
      name: "Emma's Crafts",
      avatarUrl: "",
      joinDate: "January 2024",
      bio: "Handmade crafts and unique gifts. Each item is made with love and attention to detail.",
      productsCount: 24,
      followers: 156,
      rating: 4.9,
      isVerified: true
    };
    
    // Update UI
    document.getElementById('other-seller-name').textContent = sellerData.name;
    document.getElementById('other-seller-join-date').textContent = `Joined ${sellerData.joinDate}`;
    document.getElementById('other-seller-bio').textContent = sellerData.bio;
    document.getElementById('other-seller-products').textContent = sellerData.productsCount;
    document.getElementById('other-seller-followers').textContent = sellerData.followers;
    document.getElementById('other-seller-rating').textContent = sellerData.rating;
    
    // Load seller's products
    loadOtherSellerProducts(sellerId);
    
    // Setup contact and follow buttons
    const contactBtn = document.querySelector('.contact-seller-btn');
    const followBtn = document.querySelector('.follow-seller-btn');
    
    if (contactBtn) {
      contactBtn.addEventListener('click', function() {
        alert(`Contacting ${sellerData.name}...`);
      });
    }
    
    if (followBtn) {
      let isFollowing = false;
      followBtn.addEventListener('click', function() {
        isFollowing = !isFollowing;
        this.innerHTML = isFollowing ? 
          '<i class="fas fa-user-check"></i> Following' :
          '<i class="fas fa-user-plus"></i> Follow';
        this.style.backgroundColor = isFollowing ? 'var(--secondary)' : '';
        this.style.color = isFollowing ? 'var(--white)' : '';
      });
    }
  }, 500);
}

function loadProfileSellerProducts() {
  const productsGrid = document.getElementById('profile-seller-products');
  if (!productsGrid) return;
  
  // Simulated seller products
  const products = [
    { name: "Handmade Necklace", price: 24.000 },
    { name: "Organic Soap Set", price: 18.000 },
    { name: "Canvas Tote Bag", price: 32.000 },
    { name: "Ceramic Mug", price: 15.000 }
  ];
  
  displayProductsInGrid(products, productsGrid, 'seller');
}

function loadOtherSellerProducts(sellerId) {
  const productsGrid = document.getElementById('other-seller-products-grid');
  if (!productsGrid) return;
  
  // Simulated other seller products
  const products = [
    { name: "Wooden Coaster Set", price: 22.000 },
    { name: "Macrame Wall Hanging", price: 45.000 },
    { name: "Hand-painted Vase", price: 38.000 },
    { name: "Knitted Scarf", price: 28.000 },
    { name: "Custom Notebook", price: 19.000 },
    { name: "Scented Candle", price: 24.000 }
  ];
  
  displayProductsInGrid(products, productsGrid, 'public');
}

function loadBuyerFavorites() {
  const favoritesGrid = document.getElementById('favorites-grid');
  if (!favoritesGrid) return;
  
  // Simulated favorites
  const favorites = [
    { name: "Wireless Headphones", price: 49.000 },
    { name: "Running Shoes", price: 79.000 },
    { name: "Coffee Maker", price: 89.000 },
    { name: "Laptop Stand", price: 29.000 }
  ];
  
  displayProductsInGrid(favorites, favoritesGrid, 'favorite');
}

function displayProductsInGrid(products, gridElement, type = 'product') {
  gridElement.innerHTML = '';
  
  products.forEach(product => {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    
    productCard.innerHTML = `
      <div class="product-image">
        <i class="fas fa-box"></i>
      </div>
      <div class="product-details">
        <h3 class="product-title">${product.name}</h3>
        <p class="product-price">₦${product.price.toFixed(3)}</p>
        ${type === 'favorite' ? 
          '<div class="trust-indicator"><i class="fas fa-heart"></i> In favorites</div>' : 
          type === 'seller' ? 
          '<div class="product-actions"><button class="action-btn edit-btn"><i class="fas fa-edit"></i></button><button class="action-btn delete-btn"><i class="fas fa-trash"></i></button></div>' :
          ''
        }
      </div>
    `;
    
    gridElement.appendChild(productCard);
  });
}
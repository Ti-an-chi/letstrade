// ONTROPP Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Tab Navigation
  const tabLinks = document.querySelectorAll('.nav-item');
  const tabContents = document.querySelectorAll('.tab-content');
  
  // Initialize first load
  initDashboard();
  
  // Tab switching
  tabLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const tabId = this.getAttribute('data-tab');
      
      // Update active tab
      tabLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
      
      // Show selected tab content
      tabContents.forEach(content => {
        content.classList.remove('active');
      });
      document.getElementById(tabId).classList.add('active');
    });
  });
  
  // Search bar click goes to Explore tab
  const searchBar = document.getElementById('search-bar-link');
  if (searchBar) {
    searchBar.addEventListener('click', function(e) {
      e.preventDefault();
      // Switch to Explore tab
      tabLinks.forEach(l => l.classList.remove('active'));
      document.querySelector('[data-tab="tab-explore"]').classList.add('active');
      
      tabContents.forEach(content => {
        content.classList.remove('active');
      });
      document.getElementById('tab-explore').classList.add('active');
    });
  }
  
  // Initialize dashboard with user data
  function initDashboard() {
    // In production, this would come from your server API
    // For now, simulate loading user data
    setTimeout(() => {
      loadUserData({
        name: "Alex Johnson",
        email: "alex@example.com",
        avatarUrl: "",
        isSeller: false, // Change to true to test seller dashboard
        profileViews: 125,
        totalOrders: 42
      });
      
      // Load category counts
      updateCategoryCounts({
        electronics: 1234,
        clothing: 892,
        home: 567,
        beauty: 309,
        other: 215
      });
      
      // Load recommended products (simulated)
      setTimeout(loadRecommendedProducts, 500);
    }, 300);
  }
  
  // Load and display user data
  function loadUserData(userData) {
    // Update user info
    const userName = document.getElementById('user-name');
    const userEmail = document.getElementById('user-email');
    const userAvatar = document.getElementById('user-avatar-img');
    
    if (userName && userData.name) {
      userName.textContent = userData.name;
    }
    
    if (userEmail && userData.email) {
      userEmail.textContent = userData.email;
    }
    
    if (userAvatar && userData.avatarUrl) {
      userAvatar.src = userData.avatarUrl;
    }
    
    // Show/hide seller dashboard based on role
    const sellerBoard = document.getElementById('seller-board');
    if (sellerBoard) {
      if (userData.isSeller) {
        sellerBoard.style.display = 'block';
        
        // Update seller stats
        const profileViews = document.getElementById('profile-views');
        const totalOrders = document.getElementById('total-orders');
        
        if (profileViews && userData.profileViews !== undefined) {
          profileViews.textContent = userData.profileViews;
        }
        
        if (totalOrders && userData.totalOrders !== undefined) {
          totalOrders.textContent = userData.totalOrders;
        }
        
        // Load seller products
        setTimeout(loadSellerProducts, 700);
      } else {
        sellerBoard.style.display = 'none';
      }
    }
  }
  
  // Update category product counts
  function updateCategoryCounts(counts) {
    for (const category in counts) {
      const categoryCard = document.querySelector(`[data-category="${category}"]`);
      if (categoryCard) {
        const countElement = categoryCard.querySelector('.category-count');
        if (countElement) {
          countElement.textContent = `${counts[category]} products`;
        }
      }
    }
  }
  
  // Load recommended products
  function loadRecommendedProducts() {
    const recommendedList = document.getElementById('recommended-list');
    const emptyRecommendations = document.getElementById('empty-recommendations');
    const template = document.getElementById('recommended-template');
    
    if (!recommendedList || !template) return;
    
    // Simulate server data
    const products = [
      { name: "Wireless Headphones", price: 49.000, image: "" },
      { name: "Running Shoes", price: 79.000, image: "" },
      { name: "Coffee Maker", price: 89.900, image: "" },
      { name: "Laptop Stand", price: 29.900, image: "" }
    ];
    
    if (products.length === 0) {
      // Show empty state
      if (emptyRecommendations) {
        emptyRecommendations.style.display = 'block';
      }
      return;
    }
    
    // Hide empty state
    if (emptyRecommendations) {
      emptyRecommendations.style.display = 'none';
    }
    
    // Clear and populate
    recommendedList.innerHTML = '';
    
    products.forEach(product => {
      const clone = template.content.cloneNode(true);
      const item = clone.querySelector('.recommended-item');
      const title = clone.querySelector('.item-title');
      const price = clone.querySelector('.item-price');
      const img = clone.querySelector('img');
      
      if (title) title.textContent = product.name;
      if (price) price.textContent = `₦${product.price.toFixed(3)}`;
      if (img && product.image) img.src = product.image;
      
      recommendedList.appendChild(clone);
    });
  }
  
  // Load seller products
  function loadSellerProducts() {
    const productsGrid = document.getElementById('seller-products-grid');
    const template = document.getElementById('seller-product-template');
    
    if (!productsGrid || !template) return;
    
    // Simulate server data
    const sellerProducts = [
      { name: "Handmade Necklace", price: 24.900 },
      { name: "Organic Soap Set", price: 18.500 },
      { name: "Canvas Tote Bag", price: 32.000 },
      { name: "Ceramic Mug", price: 15.700 }
    ];
    
    // Clear and populate
    productsGrid.innerHTML = '';
    
    sellerProducts.forEach(product => {
      const clone = template.content.cloneNode(true);
      const title = clone.querySelector('.product-title');
      const price = clone.querySelector('.product-price');
      
      if (title) title.textContent = product.name;
      if (price) price.textContent = `₦${product.price.toFixed(3)}`;
      
      productsGrid.appendChild(clone);
    });
    
    // Add event listeners to action buttons
    setTimeout(() => {
      document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
          alert('Edit product feature coming soon!');
        });
      });
      
      document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
          if (confirm('Are you sure you want to delete this product?')) {
            this.closest('.product-card').remove();
          }
        });
      });
    }, 100);
  }
  
  // Add product button
  const addProductBtn = document.getElementById('add-product-btn');
  if (addProductBtn) {
    addProductBtn.addEventListener('click', function() {
      alert('Add product feature coming soon!');
    });
  }
  
  // Category click handlers
  document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', function(e) {
      e.preventDefault();
      const category = this.getAttribute('data-category');
      alert(`Category "${category}" clicked - will filter products`);
      // In production: navigate to filtered product list
    });
  });
});
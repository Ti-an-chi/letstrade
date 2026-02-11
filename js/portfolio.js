
    // This is THE masterpiece - The digital storefront that sellers will love

    // Get seller ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const sellerId = urlParams.get('id') || '1';
    const sellerUsername = urlParams.get('username') || 'shop-name';

    // Initialize the masterpiece
    document.addEventListener('DOMContentLoaded', function() {
      loadPortfolioData();
      setupInteractions();
      setupTabs();
    });

    async function loadPortfolioData() {
      // In production: Fetch seller data from your API
      // const sellerData = await fetchSellerData(sellerId);
      
      // For now, use mock data
      const sellerData = getMockSellerData(sellerId);
      
      // Update hero section
      updateHeroSection(sellerData);
      
      // Update stats
      updateStats(sellerData);
      
      // Load products
      await loadProducts(sellerData.products);
      
      // Load testimonials
      loadTestimonials(sellerData.testimonials);
    }

    function updateHeroSection(seller) {
      document.getElementById('shopName').textContent = seller.shopName;
      document.getElementById('shopTagline').textContent = seller.tagline;
      document.getElementById('shopBio').textContent = seller.bio;
      
      const shopAvatar = document.getElementById('shopAvatar');
      if (seller.logoUrl) {
        shopAvatar.innerHTML = `<img src="${seller.logoUrl}" alt="${seller.shopName}">`;
      }
    }

    function updateStats(seller) {
      document.getElementById('productCount').textContent = seller.stats.products;
      document.getElementById('followerCount').textContent = formatNumber(seller.stats.followers);
      document.getElementById('ratingValue').textContent = seller.stats.rating;
      document.getElementById('orderCount').textContent = formatNumber(seller.stats.orders);
    }

    async function loadProducts(products) {
      const productsGrid = document.getElementById('productsGrid');
      const loadingEl = document.getElementById('loadingProducts');
      
      if (!productsGrid) return;
      
      // Simulate loading
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (loadingEl) loadingEl.style.display = 'none';
      
      productsGrid.innerHTML = '';
      
      products.forEach(product => {
        const productCard = document.createElement('a');
        productCard.href = `#`; // Link to product detail
        productCard.className = 'portfolio-product-card';
        
        productCard.innerHTML = `
          <div class="product-image-portfolio">
            <img src="${product.image}" alt="${product.name}">
            <div class="product-overlay">
              <div class="quick-actions">
                <button class="quick-action-btn" data-action="whatsapp"data-product-id="${product.id}" data-product-name="${product.name}">
                  <i class="fab fa-whatsapp"></i> Order Now
                </button>
                <button class="quick-action-btn" data-action="favorite" data-product-id="${product.id}">
                  <i class="fas fa-heart"></i> Save
                </button>
              </div>
            </div>
          </div>
          <div class="product-details-portfolio">
            <h3 class="product-name-portfolio">${product.name}</h3>
            <div class="product-price-portfolio">₦${formatPrice(product.price)}</div>
            <div class="product-meta">
              <div class="meta-item">
                <i class="fas fa-star"></i> ${product.rating}
              </div>
              <div class="meta-item">
                <i class="fas fa-shopping-bag"></i> ${product.sold} sold
              </div>
            </div>
          </div>
        `;
        
        // Add click handlers for quick actions
        const whatsappBtn = productCard.querySelector('[data-action="whatsapp"]');
        const favoriteBtn = productCard.querySelector('[data-action="favorite"]');
        
        whatsappBtn.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          contactSeller(product.id);
        });
        
        favoriteBtn.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          toggleFavorite(product.id, this);
        });
        
        productsGrid.appendChild(productCard);
      });
    }

    function loadTestimonials(testimonials) {
      const testimonialsGrid = document.getElementById('testimonialsGrid');
      if (!testimonialsGrid) return;
      
      testimonialsGrid.innerHTML = '';
      
      testimonials.forEach(testimonial => {
        const testimonialCard = document.createElement('div');
        testimonialCard.className = 'testimonial-card';
        
        testimonialCard.innerHTML = `
          <div class="testimonial-text">"${testimonial.text}"</div>
          <div class="testimonial-author">
            <div class="author-avatar">
              <i class="fas fa-user"></i>
            </div>
            <div class="author-info">
              <h4>${testimonial.author}</h4>
              <p>${testimonial.date} • ${testimonial.product}</p>
            </div>
          </div>
        `;
        
        testimonialsGrid.appendChild(testimonialCard);
      });
    }

    function setupInteractions() {
      // WhatsApp contact
      document.getElementById('contactBtn').addEventListener('click', function() {
        const phone = '2348123456789'; // Seller's WhatsApp number
        const message = `Hi! I'm interested in your products on ONTROPP.`;
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
      });
      
      // Follow button
      const followBtn = document.getElementById('followBtn');
      let isFollowing = false;
      
      followBtn.addEventListener('click', function() {
        isFollowing = !isFollowing;
        
        if (isFollowing) {
          this.innerHTML = '<i class="fas fa-user-check"></i> Following';
          this.classList.add('following');
          showNotification('You are now following this shop');
        } else {
          this.innerHTML = '<i class="fas fa-user-plus"></i> Follow Shop';
          this.classList.remove('following');
        }
      });
      
      // Shop now button
      document.getElementById('shopNowBtn').addEventListener('click', function() {
        document.querySelector('.portfolio-tab[data-tab="products"]').click();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
      
      // Ask question button
      document.getElementById('askQuestionBtn').addEventListener('click', function() {
        const question = prompt('What would you like to ask the seller?');
        if (question) {
          const phone = '2348123456789';
          const message = `Question: ${question}`;
          const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
          window.open(url, '_blank');
        }
      });
    }

    function setupTabs() {
      const tabs = document.querySelectorAll('.portfolio-tab');
      const tabContents = document.querySelectorAll('.tab-content');
      
      tabs.forEach(tab => {
        tab.addEventListener('click', function() {
          const tabId = this.dataset.tab;
          
          // Update active tab
          tabs.forEach(t => t.classList.remove('active'));
          this.classList.add('active');
          
          // Show selected content
          tabContents.forEach(content => {
            content.classList.remove('active');
          });
          document.getElementById(`${tabId}Tab`).classList.add('active');
        });
      });
    }

    function contactSeller(productId) {
      const phone = '2348123456789';
      const message = `Hi! I'm interested in product ID: ${productId}`;
      const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
    }

    function toggleFavorite(productId, button) {
      const icon = button.querySelector('i');
      
      if (icon.classList.contains('fa-heart')) {
        icon.classList.remove('fa-heart');
        icon.classList.add('fa-heart-circle-check');
        button.innerHTML = '<i class="fas fa-heart-circle-check"></i> Saved';
        showNotification('Product saved to favorites');
      } else {
        icon.classList.remove('fa-heart-circle-check');
        icon.classList.add('fa-heart');
        button.innerHTML = '<i class="fas fa-heart"></i> Save';
      }
    }

    function showNotification(message) {
      // Create notification element
      const notification = document.createElement('div');
      notification.className = 'notification';
      notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
      `;
      
      // Add styles for notification
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--secondary);
        color: var(--white);
        padding: 16px 24px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 1000;
        box-shadow: 0 8px 32px rgba(0,0,0,0.2);
        animation: slideIn 0.3s ease;
      `;
      
      // Add keyframes for animation
      const style = document.createElement('style');
      style.textContent = `
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `;
      document.head.appendChild(style);
      
      document.body.appendChild(notification);
      
      // Remove after 3 seconds
      setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
      }, 3000);
    }

    // Helper functions
    function formatPrice(price) {
      return new Intl.NumberFormat('en-NG').format(price);
    }

    function formatNumber(num) {
      if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
      }
      return num.toString();
    }

    // Mock data - Replace with real API calls
    function getMockSellerData(id) {
      return {
        shopName: 'TechGadgets NG',
        tagline: 'Your trusted source for authentic tech gadgets',
        bio: 'Welcome to TechGadgets NG! We specialize in authentic tech gadgets, mobile accessories, and electronics. With over 5 years of experience, we bring you quality products with warranty and excellent customer service. Our mission is to make technology accessible and affordable for everyone.',
        logoUrl: '',
        stats: {
          products: 42,
          followers: 1250,
          rating: 4.9,
          orders: 892
        },
        products: [
          {
            id: 1,
            name: 'Wireless Bluetooth Headphones',
            price: 24999,
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
            rating: 4.8,
            sold: 156
          },
          {
            id: 2,
            name: 'Smart Watch Series 5',
            price: 64999,
            image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w-400&h=400&fit=crop',
            rating: 4.9,
            sold: 89
          },
          {
            id: 3,
            name: 'Phone Case Collection',
            price: 5499,
            image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=400&fit=crop',
            rating: 4.5,
            sold: 234
          }
        ],
        testimonials: [
          {
            text: 'Amazing quality and fast delivery! The headphones exceeded my expectations.',
            author: 'Alex Johnson',
            date: '2 weeks ago',
            product: 'Wireless Headphones'
          },
          {
            text: 'Professional seller with excellent customer service. Will definitely buy again!',
            author: 'Sarah Williams',
            date: '1 month ago',
            product: 'Smart Watch'
          },
          {
            text: 'Authentic products at great prices. Highly recommended!',
            author: 'Michael Brown',
            date: '3 days ago',
            product: 'Phone Case'
          }
        ]
      };
    }

    // Share functionality
    function sharePortfolio() {
      if (navigator.share) {
        navigator.share({
          title: document.getElementById('shopName').textContent,
          text: 'Check out this amazing shop on ONTROPP!',
          url: window.location.href
        });
      } else {
        // Fallback: Copy to clipboard
        navigator.clipboard.writeText(window.location.href);
        showNotification('Link copied to clipboard!');
      }
    }

    // Add share button to hero actions
    const heroActions = document.querySelector('.hero-actions');
    if (heroActions) {
      const shareBtn = document.createElement('button');
      shareBtn.className = 'action-btn secondary';
      shareBtn.innerHTML = '<i class="fas fa-share-alt"></i> Share';
      shareBtn.addEventListener('click', sharePortfolio);
      heroActions.appendChild(shareBtn);
    }
    
    
    // Star rating system
let selectedRating = 0;

document.querySelectorAll('.stars i').forEach(star => {
  star.addEventListener('click', function() {
    selectedRating = parseInt(this.dataset.rating);
    
    // Update stars
    document.querySelectorAll('.stars i').forEach((s, index) => {
      if (index < selectedRating) {
        s.classList.add('active');
        s.style.color = '#fbbf24';
      } else {
        s.classList.remove('active');
        s.style.color = '#ddd';
      }
    });
    
    // Update text
    const texts = [
      'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'
    ];
    document.querySelector('.rating-text').textContent = texts[selectedRating - 1] || 'Tap stars to rate';
  });
  
  // Hover effect
  star.addEventListener('mouseover', function() {
    const rating = parseInt(this.dataset.rating);
    document.querySelectorAll('.stars i').forEach((s, index) => {
      s.style.color = index < rating ? '#fbbf24' : '#ddd';
    });
  });
  
  star.addEventListener('mouseout', function() {
    document.querySelectorAll('.stars i').forEach((s, index) => {
      s.style.color = index < selectedRating ? '#fbbf24' : '#ddd';
    });
  });
});

// Submit review
document.querySelector('.submit-review-btn').addEventListener('click', async function() {
  const reviewText = document.querySelector('.review-textarea').value.trim();
  
  if (selectedRating === 0) {
    alert('Please select a star rating');
    return;
  }
  
  if (!reviewText) {
    alert('Please write a review');
    return;
  }
  
  // In production: Send to your API
  const reviewData = {
    sellerId: sellerId,
    rating: selectedRating,
    text: reviewText,
    date: new Date().toISOString().split('T')[0]
  };
  
  // Show loading
  this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
  this.disabled = true;
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Success
  alert('Thank you for your review!');
  
  // Reset form
  selectedRating = 0;
  document.querySelectorAll('.stars i').forEach(s => {
    s.classList.remove('active');
    s.style.color = '#ddd';
  });
  document.querySelector('.review-textarea').value = '';
  document.querySelector('.rating-text').textContent = 'Tap stars to rate';
  
  // Reset button
  this.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Review';
  this.disabled = false;
  
  // Refresh testimonials
  // In production: reload testimonials from API
});

function orderProduct(productId, productName) {
  const sellerPhone = '2348123456789'; // From seller data
  
  // Create the message template
  const message = `Hello! I saw "${productName}" on your ONTROPP shop and I'd like to place an order. Product ID: ${productId}`;
  
  // Encode for WhatsApp
  const encodedMessage = encodeURIComponent(message);
  
  // Open WhatsApp
  const whatsappUrl = `https://wa.me/${sellerPhone}?text=${encodedMessage}`;
  window.open(whatsappUrl, '_blank');
  
  // Track order locally (optional)
  trackOrder(productId, productName);
}

function trackOrder(productId, productName) {
  // Store in localStorage to show in user's order history
  const orders = JSON.parse(localStorage.getItem('userOrders') || '[]');
  orders.push({
    id: Date.now(),
    productId,
    productName,
    date: new Date().toISOString(),
    status: 'pending' // pending, completed, cancelled
  });
  localStorage.setItem('userOrders', JSON.stringify(orders));
  
  // Notify user
  showNotification('Order initiated! Opening WhatsApp...');
}

// Update the event listener for WhatsApp button:
whatsappBtn.addEventListener('click', function(e) {
  e.preventDefault();
  e.stopPropagation();
  const productName = this.dataset.productName;
  orderProduct(productId, productName);
});
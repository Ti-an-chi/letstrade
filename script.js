// Sample data for demonstration
let products = [
    {
        id: 1,
        name: "Wireless Headphones",
        price: 59.99,
        category: "electronics",
        seller: "TechDeals",
        image: "https://via.placeholder.com/200x200?text=Headphones"
    },
    {
        id: 2,
        name: "Cotton T-Shirt",
        price: 19.99,
        category: "clothing",
        seller: "FashionHub",
        image: "https://via.placeholder.com/200x200?text=T-Shirt"
    },
    {
        id: 3,
        name: "Coffee Maker",
        price: 89.99,
        category: "home",
        seller: "HomeEssentials",
        image: "https://via.placeholder.com/200x200?text=Coffee+Maker"
    },
    {
        id: 4,
        name: "Skincare Set",
        price: 45.00,
        category: "beauty",
        seller: "BeautyCorner",
        image: "https://via.placeholder.com/200x200?text=Skincare"
    },
    {
        id: 5,
        name: "Smart Watch",
        price: 129.99,
        category: "electronics",
        seller: "TechDeals",
        image: "https://via.placeholder.com/200x200?text=Smart+Watch"
    },
    {
        id: 6,
        name: "Desk Lamp",
        price: 24.99,
        category: "home",
        seller: "HomeEssentials",
        image: "https://via.placeholder.com/200x200?text=Desk+Lamp"
    }
];
let sellerProducts = [];

// userSession.js
let currentUser = null;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize based on current page
    const path = window.location.pathname;
    const page = path.split("/").pop();
    
    if (page === "index.html" || page === "") {
        initExplorePage();
    } else if (page === "dashboard.html") {
        initDashboard();
    } else if (page === "profile.html") {
        initProfile();
    }
    
    // Set up form submissions
    setupForms();
});

// Initialize Explore Page
function initExplorePage() {
    displayProducts(products);
    
    // Set up filter chips
    const chips = document.querySelectorAll('.chip');
    chips.forEach(chip => {
        chip.addEventListener('click', function() {
            chips.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.textContent.toLowerCase();
            filterProducts(category);
        });
    });
    
    // Set up price filter
    const minPriceInput = document.querySelector('.price-filter input:nth-child(1)');
    const maxPriceInput = document.querySelector('.price-filter input:nth-child(3)');
    
    [minPriceInput, maxPriceInput].forEach(input => {
        input.addEventListener('input', function() {
            const minPrice = parseFloat(minPriceInput.value) || 0;
            const maxPrice = parseFloat(maxPriceInput.value) || Infinity;
            filterByPrice(minPrice, maxPrice);
        });
    });
}

// Display products in grid
function displayProducts(productsToShow) {
    const productGrid = document.getElementById('productGrid');
    if (!productGrid) return;
    
    productGrid.innerHTML = '';
    
    productsToShow.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <div class="product-seller">by ${product.seller}</div>
            </div>
        `;
        productGrid.appendChild(productCard);
    });
}

// Filter products by category
function filterProducts(category) {
    if (category === 'all') {
        displayProducts(products);
        return;
    }
    
    const filteredProducts = products.filter(product => 
        product.category === category
    );
    displayProducts(filteredProducts);
}

// Filter products by price
function filterByPrice(minPrice, maxPrice) {
    const filteredProducts = products.filter(product => 
        product.price >= minPrice && product.price <= maxPrice
    );
    displayProducts(filteredProducts);
}

// Initialize Dashboard
function initDashboard() {
   currentUser = window.API.getCurrentUser();
    
    document.getElementById('sellerName').textContent = currentUser.username;
            
    // Load seller's products
    sellerProducts = products.filter(product => product.seller === currentUser.username);
    document.getElementById('totalProducts').textContent = sellerProducts.length;
    document.getElementById('profileViews').textContent = Math.floor(Math.random() * 100);
    
    displaySellerProducts();
}

// Display seller's products in dashboard
function displaySellerProducts() {
    const sellerProductsGrid = document.getElementById('sellerProducts');
    if (!sellerProductsGrid) return;
    
    sellerProductsGrid.innerHTML = '';
    
    sellerProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <div style="margin-top: 8px;">
                    <button class="btn btn-secondary btn-small" style="margin-right: 4px;">Edit</button>
                    <button class="btn btn-secondary btn-small">Delete</button>
                </div>
            </div>
        `;
        sellerProductsGrid.appendChild(productCard);
    });
}

// Initialize Profile Page
function initProfile() {
    // Get seller name from URL or use default
    const urlParams = new URLSearchParams(window.location.search);
    const sellerName = urlParams.get('user') || currentUser.username;
    
    document.getElementById('profileSellerName').textContent = sellerName;
    
    // Load seller's products
    const sellerProducts = products.filter(product => product.seller === sellerName);
    displayProfileProducts(sellerProducts);
}

// Display products on profile page
function displayProfileProducts(productsToShow) {
    const profileProductsGrid = document.getElementById('profileProducts');
    if (!profileProductsGrid) return;
    
    profileProductsGrid.innerHTML = '';
    
    productsToShow.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-price">$${product.price.toFixed(2)}</div>
            </div>
        `;
        profileProductsGrid.appendChild(productCard);
    });
}

// Set up form submissions
function setupForms() {
    // Product form
    const productForm = document.getElementById('productForm');
    if (productForm) {
        productForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('productName').value;
            const description = document.getElementById('productDescription').value;
            const price = parseFloat(document.getElementById('productPrice').value);
            const category = document.getElementById('productCategory').value;
            
            // In a real app, this would upload the image and save product data
            alert(`Product "${name}" added successfully!`);
            window.location.href = 'dashboard.html';
        });
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.db.logoutSeller();
            window.location.href = 'index.html';
        });
    }
    
    if (window.location.pathname.includes('dashboard.html') || 
        window.location.pathname.includes('upload.html')) {
        const isLoggedIn = localStorage.getItem('ontrop_token');
        if (!isLoggedIn) {
            window.location.href = 'signup.html';
        }
    }
}
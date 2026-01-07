// API.js - Mock API for testing ONTROPP dashboard

// Mock database
const mockDatabase = {
  users: [
    {
      id: 1,
      username: 'john_doe',
      email: 'john@example.com',
      avatarUrl: '',
      isSeller: false,
      role: 'buyer',
      ordersCount: 3,
      cartCount: 2,
      favoritesCount: 5,
      createdAt: '2023-10-15'
    },
    {
      id: 2,
      username: 'emma_crafts',
      email: 'emma@example.com',
      avatarUrl: '',
      isSeller: true,
      role: 'seller',
      profileViews: 125,
      sellerOrders: 42,
      rating: 4.8,
      profileLink: 'ontropp.com/seller/emma_crafts',
      bio: 'Handmade crafts and unique gifts. Each item is made with love and attention to detail.',
      createdAt: '2023-01-20'
    }
  ],
  
  categories: [
    { id: 'electronics', name: 'Electronics', icon: 'mobile-alt', productCount: 24 },
    { id: 'clothing', name: 'Clothing', icon: 'tshirt', productCount: 18 },
    { id: 'home', name: 'Home & Garden', icon: 'home', productCount: 32 },
    { id: 'beauty', name: 'Beauty', icon: 'spa', productCount: 15 },
    { id: 'other', name: 'Other', icon: 'box', productCount: 8 }
  ],
  
  products: [
    {
      id: 1,
      name: 'Wireless Bluetooth Headphones',
      description: 'High-quality wireless headphones with noise cancellation',
      price: 24999,
      category: 'electronics',
      sellerId: 3,
      seller: {shop_name: 'TechGadgets'},
      image: '',
      status: 'available',
      createdAt: '2023-11-10',
      rating: 4.5
    },
    {
      id: 2,
      name: 'Premium Running Shoes',
      description: 'Comfortable running shoes for all terrains',
      price: 32999,
      category: 'clothing',
      sellerId: 4,
      seller: {shop_name: 'SportStyle'},
      image: '',
      status: 'available',
      createdAt: '2023-11-05',
      rating: 4.8
    },
    {
      id: 3,
      name: 'Handmade Ceramic Mug Set',
      description: 'Set of 4 handmade ceramic mugs',
      price: 12499,
      category: 'home',
      sellerId: 2, // Emma Crafts
      seller: {shop_name: 'emma_crafts'},
      image: '',
      status: 'available',
      createdAt: '2023-10-28',
      rating: 4.9
    },
    {
      id: 4,
      name: 'Organic Face Cream',
      description: 'Natural organic face cream for all skin types',
      price: 16250,
      category: 'beauty',
      sellerId: 5,
      seller: {shop_name: 'NaturalGlow'},
      image: '',
      status: 'available',
      createdAt: '2023-11-15',
      rating: 4.3
    },
    {
      id: 5,
      name: 'Smart Watch Series 5',
      description: 'Latest smart watch with health monitoring',
      price: 64999,
      category: 'electronics',
      sellerId: 3,
      seller: {shop_name: 'TechGadgets'},
      image: '',
      status: 'available',
      createdAt: '2023-11-01',
      rating: 4.7
    },
    {
      id: 6,
      name: 'Cotton T-Shirt Pack',
      description: 'Pack of 3 premium cotton t-shirts',
      price: 9999,
      category: 'clothing',
      sellerId: 2,
      seller: {shop_name: 'emma_crafts'},
      image: '',
      status: 'sold',
      createdAt: '2023-10-20',
      rating: 4.4
    },
    {
      id: 7,
      name: 'Indoor Plant Set',
      description: 'Set of 3 low-maintenance indoor plants',
      price: 17499,
      category: 'home',
      sellerId: 2, // Emma Crafts
      seller: {shop_name: 'emma_crafts'},
      image: '',
      status: 'available',
      createdAt: '2023-11-12',
      rating: 4.6
    },
    {
      id: 8,
      name: 'Lipstick Set',
      description: 'Set of 5 matte finish lipsticks',
      price: 14375,
      category: 'beauty',
      sellerId: 7,
      seller: {shop_name: 'BeautyBox'},
      image: '',
      status: 'available',
      createdAt: '2023-10-25',
      rating: 4.2
    },
    {
      id: 9,
      name: 'Laptop Stand',
      description: 'Adjustable aluminum laptop stand',
      price: 14999,
      category: {shop_name: 'electronics'},
      sellerId: 8,
      seller: 'OfficePro',
      image: '',
      status: 'available',
      createdAt: '2023-11-08',
      rating: 4.7
    },
    {
      id: 10,
      name: 'Yoga Pants',
      description: 'Comfortable and stretchy yoga pants',
      price: 19999,
      category: 'clothing',
      sellerId: 9,
      seller: {shop_name: 'ActiveFit'},
      image: '',
      status: 'available',
      createdAt: '2023-10-30',
      rating: 4.5
    },
    {
      id: 11,
      name: 'Desk Lamp',
      description: 'LED desk lamp with adjustable brightness',
      price: 21000,
      category: 'home',
      sellerId: 10,
      seller: {shop_name: 'HomeEssentials'},
      image: '',
      status: 'available',
      createdAt: '2023-11-03',
      rating: 4.3
    },
    {
      id: 12,
      name: 'Perfume Collection',
      description: 'Collection of 3 luxury perfumes',
      price: 29999,
      category: 'beauty',
      sellerId: 11,
      seller: {shop_name: 'LuxuryScents'},
      image: '',
      status: 'available',
      createdAt: '2023-10-18',
      rating: 4.8
    },
    {
      id: 13,
      name: 'Handwoven Basket',
      description: 'Beautiful handwoven storage basket',
      price: 8999,
      category: 'home',
      sellerId: 2, // Emma Crafts
      seller: {shop_name: 'emma_crafts'},
      image: '',
      status: 'available',
      createdAt: '2023-11-17',
      rating: 4.7
    },
    {
      id: 14,
      name: 'Phone Case',
      description: 'Protective phone case with design',
      price: 5499,
      category: 'electronics',
      sellerId: 3,
      seller: {shop_name: 'TechGadgets'},
      image: '',
      status: 'available',
      createdAt: '2023-11-14',
      rating: 4.4
    }
  ],
  
  favourites: [
    { id: 1, productId: 1, userId: 1, addedDate: '2023-12-01' },
    { id: 2, productId: 2, userId: 1, addedDate: '2023-11-28' },
    { id: 3, productId: 3, userId: 1, addedDate: '2023-11-25' },
    { id: 4, productId: 4, userId: 1, addedDate: '2023-11-20' },
    { id: 5, productId: 5, userId: 1, addedDate: '2023-11-15' }
  ],
  
  currentUserId: 1
};

// Simulate network delay
const simulateDelay = (min = 300, max = 800) => {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
};

// Helper function to get current user
const getCurrentUser = () => {
  return mockDatabase.users.find(user => user.id === mockDatabase.currentUserId);
};

// Helper function to get product by ID
const getProductById = (id) => {
  return mockDatabase.products.find(product => product.id === parseInt(id));
};

// Helper function to get seller products
const getSellerProducts = (sellerId) => {
  return mockDatabase.products.filter(product => product.sellerId === sellerId);
};

// Helper function to get user favourites
const getUserFavourites = (userId) => {
  return mockDatabase.favourites
    .filter(fav => fav.userId === userId)
    .map(fav => {
      const product = getProductById(fav.productId);
      return {
        ...product,
        addedDate: fav.addedDate
      };
    });
};

// API Methods
const API = {
  // User Data
  async getUserData() {
    await simulateDelay();
    const user = getCurrentUser();
    if (!user) {
      throw new Error('User not found');
    }
    return { ...user };
  },
  
  // Categories
  async getCategories() {
    await simulateDelay();
    return [...mockDatabase.categories];
  },
  
  // Products
  async getAllProducts() {
    await simulateDelay(500, 1000);
    return [...mockDatabase.products];
  },
  
  async getRecommendedProducts() {
    await simulateDelay();
    // Return first 4 products as recommendations
    return mockDatabase.products.slice(0, 4);
  },
  
  async getSellerProducts() {
    await simulateDelay();
    const user = getCurrentUser();
    if (!user || !user.isSeller) {
      return [];
    }
    return getSellerProducts(user.id);
  },
  
  // Favourites
  async getFavourites() {
    await simulateDelay();
    const user = getCurrentUser();
    if (!user) {
      return [];
    }
    return getUserFavourites(user.id);
  },
  
  async addToFavourites(productId) {
    await simulateDelay();
    const user = getCurrentUser();
    if (!user) {
      throw new Error('User not logged in');
    }
    
    const newFav = {
      id: mockDatabase.favourites.length + 1,
      productId: parseInt(productId),
      userId: user.id,
      addedDate: new Date().toISOString().split('T')[0]
    };
    
    mockDatabase.favourites.push(newFav);
    return { success: true, favourite: newFav };
  },
  
  async removeFromFavourites(productId) {
    await simulateDelay();
    const user = getCurrentUser();
    if (!user) {
      throw new Error('User not logged in');
    }
    
    const index = mockDatabase.favourites.findIndex(
      fav => fav.userId === user.id && fav.productId === parseInt(productId)
    );
    
    if (index > -1) {
      mockDatabase.favourites.splice(index, 1);
      return { success: true };
    }
    
    throw new Error('Favourite not found');
  },
  
  async clearAllFavourites() {
    await simulateDelay();
    const user = getCurrentUser();
    if (!user) {
      throw new Error('User not logged in');
    }
    
    mockDatabase.favourites = mockDatabase.favourites.filter(
      fav => fav.userId !== user.id
    );
    
    return { success: true };
  },
  
  // Cart
  async addToCart(productId) {
    await simulateDelay();
    const user = getCurrentUser();
    if (!user) {
      throw new Error('User not logged in');
    }
    
    // In real app, you'd add to user's cart
    // For mock, just simulate success
    return { success: true, message: 'Added to cart' };
  },
  
  // Seller Operations
  async deleteProduct(productId) {
    await simulateDelay();
    const user = getCurrentUser();
    if (!user || !user.isSeller) {
      throw new Error('Unauthorized');
    }
    
    const index = mockDatabase.products.findIndex(
      product => product.id === parseInt(productId) && product.sellerId === user.id
    );
    
    if (index > -1) {
      mockDatabase.products.splice(index, 1);
      return { success: true };
    }
    
    throw new Error('Product not found or not authorized');
  },
  
  async updateProduct(productId, updates) {
    await simulateDelay();
    const user = getCurrentUser();
    if (!user || !user.isSeller) {
      throw new Error('Unauthorized');
    }
    
    const product = mockDatabase.products.find(
      p => p.id === parseInt(productId) && p.sellerId === user.id
    );
    
    if (product) {
      Object.assign(product, updates);
      return { success: true, product };
    }
    
    throw new Error('Product not found or not authorized');
  },
  
  async createProduct(productData) {
    await simulateDelay();
    const user = getCurrentUser();
    if (!user || !user.isSeller) {
      throw new Error('Unauthorized');
    }
    
    const newProduct = {
      id: mockDatabase.products.length + 1,
      ...productData,
      sellerId: user.id,
      seller: user.username,
      status: 'available',
      createdAt: new Date().toISOString().split('T')[0],
      rating: 0
    };
    
    mockDatabase.products.push(newProduct);
    return { success: true, product: newProduct };
  },
  
  // Search
  async searchProducts(query, filters = {}) {
    await simulateDelay(200, 600);
    let results = [...mockDatabase.products];
    
    // Apply search query
    if (query) {
      const searchTerm = query.toLowerCase();
      results = results.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.seller.toLowerCase().includes(searchTerm)
      );
    }
    
    // Apply category filter
    if (filters.category && filters.category !== 'all') {
      results = results.filter(product => product.category === filters.category);
    }
    
    // Apply price filter
    if (filters.minPrice) {
      results = results.filter(product => product.price >= filters.minPrice);
    }
    
    if (filters.maxPrice) {
      results = results.filter(product => product.price <= filters.maxPrice);
    }
    
    // Apply status filter
    if (filters.status) {
      results = results.filter(product => product.status === filters.status);
    }
    
    return results;
  },
  
  async updateProfile(updates) {
    await simulateDelay();
    const user = getCurrentUser();
    if (!user) {
      throw new Error('User not logged in');
    }
    
    Object.assign(user, updates);
    return { success: true, user };
  },
  
  // Utility function to switch between buyer/seller for testing
  switchUserType(type = 'buyer') {
    if (type === 'seller') {
      mockDatabase.currentUserId = 2; // Emma Crafts (seller)
    } else {
      mockDatabase.currentUserId = 1; // John Doe (buyer)
    }
    return { success: true, currentUser: getCurrentUser() };
  },
  
  async getProductsPaginated(page = 1, limit = 20, filters = {}) {
    await simulateDelay();
    
    // Get all products (in real app, this would be a paginated API call)
    let products = [...mockDatabase.products];
    
    // Apply filters if any
    if (filters.category && filters.category !== 'all') {
      products = products.filter(p => p.category === filters.category);
    }
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm) ||
        p.seller.toLowerCase().includes(searchTerm)
      );
    }
    
    if (filters.minPrice) {
      products = products.filter(p => p.price >= filters.minPrice);
    }
    
    if (filters.maxPrice) {
      products = products.filter(p => p.price <= filters.maxPrice);
    }
    
    // Calculate pagination
    const total = products.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    // Get products for current page
    const paginatedProducts = products.slice(startIndex, endIndex);
    
    return {
      products: paginatedProducts,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        limit
      }
    };
  },
  
  async searchProducts(query, page = 1, limit = 20) {
    await simulateDelay();
    return this.getProductsPaginated(page, limit, { search: query });
  },
  
  async getProductsByCategory(category, page = 1, limit = 20) {
    await simulateDelay();
    return this.getProductsPaginated(page, limit, { category });
  }
};

// Export all API methods
export default API;

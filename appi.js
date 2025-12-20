/*========= API GATEWAY – api.js =========*/
const API = {
  baseURL: 'http://localhost:5000',
  
  // Store tokens & userId after login
  setTokens({ accessToken, refreshToken, userId }) {
    localStorage.setItem('ontrop_token', accessToken);
    localStorage.setItem('ontrop_refresh', refreshToken);
    localStorage.setItem('ontrop_userid', userId);
  },
  
  // Clear everything on logout
  clearTokens() {
    localStorage.removeItem('ontrop_token');
    localStorage.removeItem('ontrop_refresh');
    localStorage.removeItem('ontrop_userid');
    localStorage.removeItem('ontrop_user');
    localStorage.removeItem('pendingSignupEmail');
  },
  
  /*---------- Core Fetch with Auto-Refresh ----------*/
  async _fetch(path, options = {}, _retry = false) {
    const url = `${this.baseURL}${path}`;
    const token = localStorage.getItem('ontrop_token');
    
    const defaults = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    };
    
    const resp = await fetch(url, { ...defaults, ...options });
    
    if (!resp.ok) {
      let msg = 'Network error';
      let data = null;
      try {
        data = await resp.json();
        msg = data.message || msg;
      } catch {}
      
      // Auto-refresh logic: if token expired and haven't retried yet
      // ASSUMPTION: Backend returns 401 or message "Token expired" when token is invalid
      if ((msg === 'Token expired' || resp.status === 401) && !_retry) {
        try {
          await this.refresh();
          // Retry the same request with new token
          return await this._fetch(path, options, true);
        } catch (refreshError) {
          this.clearTokens();
          throw new Error('Session expired. Please login again.');
        }
      }
      
      throw new Error(msg);
    }
    return await resp.json();
  },
  
  /*--------------------- AUTH --------------------*/
  async signUpSeller({ email, password, username }) {
    return this.requestOtp(email, password, username);
  },
  
  requestOtp(email, password, username, whatsapp_number = '', role = 'user') {
    return this._fetch('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, username, whatsapp_number, role })
    });
  },
  
  verifyOtp(email, otp) {
    return this._fetch('/api/auth/verifyotp', {
      method: 'POST',
      body: JSON.stringify({ email, otp })
    });
  },
  
  resendOtp(email) {
    return this._fetch('/api/auth/resendotp', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  },
  
  async login(email, password) {
    const data = await this._fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (data.ok) this.setTokens(data);
    return data;
  },
  
  async refresh() {
    const refreshToken = localStorage.getItem('ontrop_refresh');
    if (!refreshToken) throw new Error('No refresh token');
    
    const data = await this._fetch('/api/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken })
    });
    if (data.ok) localStorage.setItem('ontrop_token', data.accessToken);
    return data;
  },
  
  async logout() {
    await this._fetch('/api/auth/logout', { method: 'POST' });
    this.clearTokens();
  },
  
  /*---------- USER DATA ----------*/
  async getUserData() {
    return this._fetch('/api/user/dashboard');
  },
  
  async updateProfile(updates) {
    // ASSUMPTION: Backend accepts PATCH /api/user/profile
    // updates can include username, email, bio, avatarUrl, etc.
    return this._fetch('/api/user/profile', {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
  },
  
  /*----------------- SELLER DATA ----------------*/
  async getSellerData() {
    return this._fetch('api/seller/stats')
  },
    
  async getMyProducts() {
    return this._fetch('/api/products/mine');
  },
    
  async getSellerProducts() {
    return this._fetch('/api/products/seller');
  },
  
  /* ---------------- PRODUCT DATA --------------- */
  
  // 1. PRODUCTS
  async getProductsPaginated(page = 1, limit = 20, filters = {}) {
    // ASSUMPTION: Backend supports pagination via query params
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters
    });
    return this._fetch(`/api/products?${params}`);
  },
  
  async searchProducts(query, page = 1, limit = 20, filters = {}) {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: limit.toString(),
      ...filters
    });
    return this._fetch(`/api/products/search?${params}`);
  },
  
  async getRecommendedProducts() {
    return this._fetch('/api/products/recommended'); // based on trending
  },
  
  async getFavourites() {
    return this._fetch('/api/user/favorites');
  },
  
  // 2. CATEGORIES
  async getCategories() {
    return this._fetch('/api/categories');
  },
  /* 
  async getCategoryCount() {
    return this._fetch('/api/stats/category');
  }, 
  */

  async getProductsByCategory(category, page = 1, limit = 20) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });
    return this._fetch(`/api/products/category/${category}?${params}`);
  },
  
  // 3. ACTIONS
  async addToFavourites(productId) {
    return this._fetch('/api/user/favorites', {
      method: 'POST',
      body: JSON.stringify({ productId })
    });
  },
  
  async removeFromFavourites(productId) {
    return this._fetch(`/api/user/favorites/${productId}`, {
      method: 'DELETE'
    });
  },
  
  async clearAllFavourites() {
    return this._fetch('/api/user/favorites', {
      method: 'DELETE'
    });
  },
  
  async addToCart(productId, quantity = 1) {
    return this._fetch('/api/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity })
    });
  },
  
  /* ---------------- SELLER ACTIONS --------------- */
  async createProduct(productData) {
    return this._fetch('/api/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    });
  },

  async deleteProduct(productId) {
    return this._fetch(`/api/products/${productId}`, {
      method: 'DELETE'
    });
  },
  
  async updateProduct(productId, updates) {
    return this._fetch(`/api/products/${productId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
  },

  /* ---------------- UTILITY ---------------- */
  startSelling(userInfo) {
    return this._fetch('/api/upgrade/', {
      method: 'POST',
      body: json.stringify(userInfo)
    });
  },
  
  /*---------- LOAD DATA (Existing Methods) ----------*/

  /*---------- PING ----------*/
  async ping() {
    const resp = await fetch(`${this.baseURL}/ping`);
    return resp.json();
  }
};

window.API = API;

/*========= API GATEWAY – api.js =========*/
const API = {
  baseURL: 'http://localhost:5000',
  
  // Store tokens & userId after login
  setTokens({ accessToken, refreshToken, userId, }) {
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
  
  /*---------- helpers ----------*/
  async _fetch(path, options = {}) {
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
      try {
        const data = await resp.json();
        msg = data.message || msg;
      } catch {}
      throw new Error(msg);
    }
    return await resp.json();
  },
  
  /*---------- AUTH ----------*/
  async signUpSeller({ email, password, username }) {
    return this.requestOtp(email, password, username);
  },
  
  // Step 1: Request OTP
  requestOtp(email, password, username, whatsapp_number = '', role = 'user') {
    return this._fetch('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, username, whatsapp_number, role })
    });
  },
  
  // Step 2: Verify OTP
  verifyOtp(email, otp) {
    return this._fetch('/api/auth/verifyotp', {
      method: 'POST',
      body: JSON.stringify({ email, otp })
    });
  },
  
  // Step 3: Resend OTP
  resendOtp(email) {
    return this._fetch('/api/auth/resendotp', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  },
  
  // Step 4: Login (auto-stores tokens)
  async login(email, password) {
    const data = await this._fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (data.ok) this.setTokens(data);
    return data;
  },
  
  // Step 5: Refresh token
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
  
  // Step 6: Logout
  async logout() {
    await this._fetch('/api/auth/logout', { method: 'POST' });
    this.clearTokens();
  },
  
  /* ---------- Load Data ---------- */
  async getCurrentUser() {
    return this._fetch('/api/user/me');
  }, 
  async getMyProducts() {
    return this._fetch('api/products/mine');
  },
  
  /*---------- UTILS ----------*/
  async ping() {
    const resp = await fetch(`${this.baseURL}/ping`);
    return resp.json();
  }
};

window.API = API;

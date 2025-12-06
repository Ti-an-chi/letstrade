/*========= API GATEWAY – api.js =========*/
const API = {
  baseURL: 'https://localhost:5000',
  
  /*---------- helpers ----------*/
async _fetch(path, options = {}) {
  const url = `${this.baseURL}/api${path}`;
  const token = localstorage.getItem('session_token');

  const defaults = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  };

  const resp = await fetch(url, { ...defaults, ...options });

  // Handle non-200 responses
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


  /*---------- auth ----------*/
  register(credentials) {
    return API._fetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },
  
  verifyOTP(email, otp) {
    return API._fetch('/auth/verifyotp', {
      method: 'POST',
      body: JSON.stringify({email, otp})
    })
  },

  resendOtp(email) {
    return API._fetch('/auth/resendotp', {
      method: 'POST',
      body: JSON.stringify({email})
    })
  },
  
  login(email, password) {
    return this._fetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },
  
  refreshToken (refreshToken) {
    return this._fetch('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({refreshToken})
    });
  },
  
  

  async pingApi() {
    const pingUrl = `${this.baseURL}`;
    const resp = await fetch(pingUrl);
    console.log(`${resp.json}, good!`)
  }
};
window.API = API;
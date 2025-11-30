/*  auth.js  – keeps your login + adds verify flow  */
/*  FIXES: DOM ready race, toggleMode re-attach, resend cooldown, continueBtn text  */

// Guard for Node tests
const isBrowser = typeof window !== 'undefined' && window.document;

const $ = id => isBrowser ? document.getElementById(id) : null;

/* ----------  DOM  ---------- */
let signupSection, verifySection, messageEl, verifyMsgEl, signupForm, authBtn,
    passwordInput, passwordStrengthEl, resendBtn, continueBtn, emailText, emailMasked;

if (isBrowser) {
  signupSection   = $('signupSection');
  verifySection   = $('verifySection');
  messageEl       = $('message');
  verifyMsgEl     = $('verifyMsg');
  signupForm      = $('signupForm');
  authBtn         = $('authBtn');
  passwordInput   = $('password');
  passwordStrengthEl = $('passwordStrength');
  resendBtn       = $('resendBtn');
  continueBtn     = $('continueBtn');
  emailText       = $('emailText');
  emailMasked     = $('emailMasked');
}

let mode = 'signup';

/* ----------  tiny helpers  ---------- */
function showMessage(txt, type = 'error') {
  if (!messageEl) return;
  messageEl.textContent = txt;
  messageEl.className   = 'message ' + type;
  messageEl.style.display = 'block';
}
function hideMessage() {
  if (messageEl) messageEl.style.display = 'none';
}

function maskEmail(e) {
  const [name, domain] = e.split('@');
  return name.length <= 3 ? name[0]+'***@'+domain
                          : name.slice(0,2)+'***'+name.slice(-1)+'@'+domain;
}

/* ----------  password strength  ---------- */
if (isBrowser && passwordInput) {
  passwordInput.addEventListener('input', () => {
    const val = passwordInput.value;
    const score = [/[a-z]/,/[A-Z]/,/[0-9]/,/[^A-Za-z0-9]/].reduce((a,r)=>a+r.test(val),0)
                + (val.length>=8?1:0);
    const msg = ['Very Weak','Weak','Fair','Good','Strong','Very Strong'];
    passwordStrengthEl.textContent = `Password Strength: ${msg[score]}`;
    passwordStrengthEl.style.color = ['#ef4444','#f97316','#eab308','#84cc16','#22c55e','#16a34a'][score];
  });
}

/* ----------  toggle sign-up / login  ---------- */
function toggleMode(e) {
  if (e) e.preventDefault();
  mode = mode === 'signup' ? 'signin' : 'signup';
  document.querySelector('.form-title').textContent = mode==='signup' ? 'Create Seller Account' : 'Log In';
  ['confPass','whatsapp','uname'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = mode==='signup' ? 'block' : 'none';
  });
  authBtn.value = mode==='signup'?'Create Account':'Log In';
  document.getElementById('toggleText').innerHTML = mode==='signup'
      ? '<p>Already have an account? <a href="#" data-toggle>Log in</a></p>'
      : '<p>Don\'t have an account? <a href="#" data-toggle>Sign up</a></p>';
  hideMessage();
}

/* ----------  form validation  ---------- */
function validateForm() {
  const email = document.getElementById('email').value.trim();
  const pass  = document.getElementById('password').value;
  if (!email.includes('@')) { showMessage('Valid email required'); return false; }
  if (pass.length < 6)      { showMessage('Password must be 6 characters or more'); return false; }
  if (mode==='signup') {
    if (!document.getElementById('username').value.trim()) { showMessage('Username required'); return false; }
    if (pass !== document.getElementById('confirmPassword').value) { showMessage('Passwords don’t match'); return false; }
    if (!document.getElementById('whatsappNumber').value.trim()) { showMessage('WhatsApp number required'); return false; }
  }
  return true;
}

/* ----------  submit handler  ---------- */
async function handleSubmit(e) {
  e.preventDefault();
  if (!validateForm()) return;
  const email = document.getElementById('email').value.trim();
  const pass  = document.getElementById('password').value;
  setLoadingState(true); hideMessage();

  try {
    if (mode==='signup') {
      const r = await window.db.signUpSeller({
        email,
        password: pass,
        username: document.getElementById('username').value.trim(),
        whatsappNumber: document.getElementById('whatsappNumber').value.trim()
      });
      if (r.error) { showMessage(r.error.message); return; }
      localStorage.setItem('pendingSignupEmail', email);
      showMessage('Account created! Check your e-mail.', 'success');
      openVerifyUI(email);
    } else { // LOGIN
      const r = await window.db.loginSeller({ email, password: pass });
      if (r.error) { showMessage(r.error.message); return; }
      if (window.UserSession) window.UserSession.setCurrentUser(r.user);
      location.href = 'dashboard.html';
    }
  } catch (err) {
    showMessage(err.message);
  } finally {
    setLoadingState(false);
  }
}

function setLoadingState(on) {
  if (!authBtn) return;
  authBtn.disabled = on;
  authBtn.value    = on ? (mode==='signup'?'Creating...':'Logging in...')
                        : (mode==='signup'?'Create Account':'Log In');
}

/* ----------  verification page logic  ---------- */
function openVerifyUI(email) {
  if (!verifySection || !signupSection) return;
  emailText.textContent   = email;
  emailMasked.textContent = maskEmail(email);
  signupSection.style.display = 'none';
  verifySection.style.display = 'block';
  hideMessage();
}

async function handleResend() {
  const email = localStorage.getItem('pendingSignupEmail');
  if (!email || !resendBtn) return;
  resendBtn.disabled = true;
  const { error } = await window.supabase.auth.resend({ type:'signup', email });
  if (error) {
    verifyMsgEl.textContent = error.message;
    verifyMsgEl.className = 'message error';
  } else {
    verifyMsgEl.textContent = 'E-mail resent';
    verifyMsgEl.className = 'message success';
  }
  verifyMsgEl.style.display = 'block';
  setTimeout(()=> resendBtn.disabled=false, 30000);
}

async function handleContinue() {
  if (!continueBtn) return;
  continueBtn.disabled = true;
  continueBtn.textContent = 'Checking…';
  const { data, error } = await window.supabase.auth.getSession();
  if (error || !data.session) {
    verifyMsgEl.textContent='No session yet – did you click the link in your e-mail?';
    verifyMsgEl.className='message error';
    verifyMsgEl.style.display='block';
    continueBtn.disabled=false;
    continueBtn.textContent='I clicked the link — Continue';
    return;
  }
  if (window.UserSession) window.UserSession.setCurrentUser(data.session.user);
  localStorage.removeItem('pendingSignupEmail');
  location.href='dashboard.html';
}

/* ----------  bootstrap  ---------- */
if (isBrowser) {
  window.addEventListener('DOMContentLoaded', () => {
    // attach delegated toggle once
    document.addEventListener('click', e => {
      if (e.target.matches('[data-toggle]')) toggleMode(e);
    });
    if (signupForm) signupForm.addEventListener('submit', handleSubmit);
    if (resendBtn)  resendBtn.addEventListener('click', handleResend);
    if (continueBtn) continueBtn.addEventListener('click', handleContinue);
    document.getElementById('toLogin2')?.addEventListener('click', e => {
      e.preventDefault();
      verifySection.style.display = 'none';
      signupSection.style.display = 'block';
      mode = 'signup';
      toggleMode();
    });

    // auto-redirect if already logged in
    (async () => {
      const { data } = await window.supabase.auth.getSession();
      if (data?.session) location.href='dashboard.html';
    })();
  });
}

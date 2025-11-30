/*  auth.js  – keeps your login + adds verify flow  */
import { UserSession } from './script.js';

const $ = id => document.getElementById(id);

/* ----------  DOM  ---------- */
const signupSection   = $('signupSection');
const verifySection   = $('verifySection');
const messageEl       = $('message');
const verifyMsgEl     = $('verifyMsg');
const signupForm      = $('signupForm');
const authBtn         = $('authBtn');
const passwordInput   = $('password');
const passwordStrengthEl = $('passwordStrength');
const resendBtn       = $('resendBtn');
const continueBtn     = $('continueBtn');
const emailText       = $('emailText');
const emailMasked     = $('emailMasked');

let mode = 'signup';

/* ----------  tiny helpers  ---------- */
function showMessage(txt, type = 'error') {
  messageEl.textContent = txt;
  messageEl.className   = 'message ' + type;
  messageEl.style.display = 'block';
}
function hideMessage() { messageEl.style.display = 'none'; }

function maskEmail(e) {
  const [name, domain] = e.split('@');
  return name.length <= 3 ? name[0]+'***@'+domain
                          : name.slice(0,2)+'***'+name.slice(-1)+'@'+domain;
}

passwordInput.addEventListener('input', () => {
  const s = Math.min(5, [/[a-z]/,/[A-Z]/,/[0-9]/,/[^A-Za-z0-9]/].reduce((a,r)=>a+r.test(passwordInput.value),0)
               + (passwordInput.value.length>=8?1:0));
  const msg = ['Very Weak','Weak','Fair','Good','Strong','Very Strong'];
  passwordStrengthEl.textContent = `Password Strength: ${msg[s]}`;
  passwordStrengthEl.style.color = ['#ef4444','#f97316','#eab308','#84cc16','#22c55e','#16a34a'][s];
});

/* ----------  toggle sign-up / login  ---------- */
document.getElementById('togBtn').addEventListener('click', toggleMode);
function toggleMode (e) {
  if (e) e.preventDefault();
  mode = mode === 'signup' ? 'signin' : 'signup';
  document.querySelector('.form-title').textContent = mode ==='signup' ? 'Create Seller Account' : 'Log In';
  authBtn.value = mode==='signup'?'Create Account':'Log In';
    ['uname','confPass','whatsapp'].forEach(id => {
    const grp  = document.getElementById(id);
    const inp  = grp.querySelector('input');
    grp.style.display   = mode === 'signup' ? 'block' : 'none';
    inp.required        = mode === 'signup';
  });
  signupForm.noValidate = mode !== 'signup';
  document.getElementById('toggleText').innerHTML = mode==='signup'
      ? '<p>Already have an account? <a href="#" id="togBtn">Log in</a></p>'
      : `<p>Don't have an account? <a href="#" id="togBtn">Sign up</a></p>`;
    document.getElementById('togBtn').onclick = toggleMode;
  hideMessage();
};

/* ----------  form validation (your code, trimmed)  ---------- */
function validateForm() {
  const email = document.getElementById('email').value.trim();
  const pass  = document.getElementById('password').value;
  if (!email.includes('@'))   { showMessage('Valid email required'); return false; }
  if (pass.length < 6)    { showMessage('Password must be 6+ characters'); return false; }
  if (mode==='signup') {
    if (!document.getElementById('username').value.trim()) { showMessage('Username required'); return false; }
    if (pass !== document.getElementById('confirmPassword').value) { showMessage('Passwords don’t match'); return false; }
    if (!document.getElementById('whatsappNumber').value.trim()) { showMessage('WhatsApp number required'); return false; }
  }
  return true;
}


/* ----------  submit handler  ---------- */
signupForm.addEventListener('submit', async e => {
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
    } else if (mode === 'signin') { // LOGIN
      const r = await window.db.loginSeller({ email, password: pass });
      if (r.error) { 
        showMessage(r.error.message); console.log('about to redirect to dashboard.html'); return; }
      showMessage('login sucessful', success);
      UserSession.setCurrentUser(r.user);
      location.href = 'dashboard.html';
    }
  } catch (err) {
    showMessage(err.message);
  } finally {
    setLoadingState(false);
  }
});

function setLoadingState(on) {
  authBtn.disabled = on;
  authBtn.value    = on ? (mode==='signup'?'Creating...':'Logging in...')
                        : (mode==='signup'?'Create Account':'Log In');
}

/* ----------  verification page logic  ---------- */
function openVerifyUI(email) {
  emailText.textContent   = email;
  emailMasked.textContent = maskEmail(email);
  signupSection.style.display = 'none';
  verifySection.style.display = 'block';
  hideMessage();
}

resendBtn.addEventListener('click', async () => {
  const email = localStorage.getItem('pendingSignupEmail');
  if (!email) return;
  resendBtn.disabled = true;
  const { error } = await window.supabase.auth.resend({ type:'signup', email });
  if (error) { verifyMsgEl.textContent = error.message; verifyMsgEl.style.display='block'; }
  else       { verifyMsgEl.textContent='E-mail resent'; verifyMsgEl.className='message success'; verifyMsgEl.style.display='block'; }
  setTimeout(()=> resendBtn.disabled=false, 30000); // 30 s cooldown
});

continueBtn.addEventListener('click', async () => {
  continueBtn.disabled = true; continueBtn.textContent='Checking…';
  const { data, error } = await window.supabase.auth.getSession();
  continueBtn.disabled = false;
  continueBtn.textContent = 'I clicked the link — Continue';
  if (error || !data.session) {
    verifyMsgEl.textContent='No session yet – did you click the link in your e-mail?';
    verifyMsgEl.style.display='block';
    continueBtn.disabled=false; continueBtn.textContent='No session yet – please click the link in your e-mail first.';
    return;
  }
  UserSession.setCurrentUser(data.session.user);
  localStorage.removeItem('pendingSignupEmail');
  location.href='dashboard.html';
});

document.getElementById('toLogin2').addEventListener('click', (e) => {
  e.preventDefault();
  verifySection.style.display = 'none';
  signupSection.style.display = 'block';
  mode = 'signup';
  toggleMode();
});

// ----------  session check on load  ---------- 
(async () => {
  const { data } = await window.supabase.auth.getSession();
  if (data?.session) location.href='dashboard.html';
})();

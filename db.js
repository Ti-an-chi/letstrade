// db.js – production-ready, friendly errors
const SUPABASE_URL = 'https://xhblzickvkwcqueftcil.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhoYmx6aWNrdmt3Y3F1ZWZ0Y2lsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4NDExNTQsImV4cCI6MjA3OTQxNzE1NH0.tjmkzeFyhpSccrdBzl2nPxyEl28Lz1aLsLAfGDi7yFw';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

/* ------------------------------------------------------------------ */
/* 1.  AUTHENTICATION                                                 */
/* ------------------------------------------------------------------ */
async function signUpSeller(req) {
  // 1.  duplicate username check
  const { data: existingUser } = await supabase
    .from('sellers')
    .select('id')
    .eq('username', req.username)
    .maybeSingle();
  if (existingUser) return { error: {message:'Username is taken. Choose another one.'} };

  // 2.  duplicate e-mail check
  const { data: existingEmail } = await supabase
    .from('sellers')
    .select('id')
    .eq('email', req.email)
    .maybeSingle();
  if (existingEmail) return { error: {message:'This e-mail is already registered. Try logging in instead.'} };

  // 3.  create auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: req.email,
    password: req.password,
    options: { emailRedirectTo: window.location.origin + '/dashboard.html' }
  });
  if (authError) return { error: {message: mapAuthError(authError)} };

  const uid = authData.user.id;

  // 4.  create seller row
  const { data: sellerData, error: sellerError } = await supabase
    .from('sellers')
    .insert([{   id: uid, username: req.username, email: req.email, whatsapp_number: req.whatsappNumber }])
    .select()
    .single();
  if (sellerError) return { error: {message: 'Could not create profile. Try again.'} };

  return { user: authData.user, seller: sellerData };
}

async function loginSeller(req) {
  const { data, error } = await supabase.auth.signInWithPassword({ email: req.email, password: req.password });
  if (error) return { error: {message: mapAuthError(error) }};

  const seller = await getCurrentSeller();
  if (!seller) return { error: {message: 'Profile not found. Contact support.'} };
  return { user: data.user, seller };
}

async function getCurrentSeller() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  
  const { data, error } = await supabase.from('sellers').select('*').eq('id', user.id).single();
  return error ? null : data;
}

async function checkAuth() {
  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session) return { isAuthenticated: false, user: null };
  const seller = await getCurrentSeller();
  return { isAuthenticated: true, user: data.session.user, seller };
}

async function isLoggedIn() {
  const { isAuthenticated } = await checkAuth();
  return isAuthenticated;
}

async function logoutSeller() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

/* ------------------------------------------------------------------ */
/* 2.  PRODUCTS                                                       */
/* ------------------------------------------------------------------ */
async function addProduct(name, category, description, price, imageUrl) {
  const seller = await getCurrentSeller();
  if (!seller) return { error: 'Please log in to add products.' };

  const { data, error } = await supabase
    .from('products')
    .insert([{ seller_id: seller.id, name, category, description, price, image_url: imageUrl }])
    .select()
    .single();
  if (error) return { error: 'Failed to add product. Try again.' };
  return { product: data };
}

async function getMyProducts() {
  const seller = await getCurrentSeller();
  if (!seller) return { error: 'Please log in.', products: [] };
  const { data, error } = await supabase.from('products').select('*').eq('seller_id', seller.id);
  return error ? { error: 'Could not load products.', products: [] } : { products: data };
}

async function updateProduct(productId, updates) {
  const seller = await getCurrentSeller();
  if (!seller) return { error: 'Please log in.' };
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', productId)
    .eq('seller_id', seller.id)
    .select()
    .single();
  if (error) return { error: 'Update failed or product not found.' };
  return { data };
}

async function deleteProduct(productId) {
  const seller = await getCurrentSeller();
  if (!seller) return { error: 'Please log in.' };
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId)
    .eq('seller_id', seller.id);
  return error ? { error: 'Delete failed or product not found.' } : { error: null };
}

/* ------------------------------------------------------------------ */
/* 3.  PUBLIC MARKETPLACE                                             */
/* ------------------------------------------------------------------ */
async function getSellerById(id) {
  const { data, error } = await supabase.from('sellers').select('*').eq('id', id).single();
  return error ? null : data;
}

async function getProductsBySellerId(id) {
  const { data, error } = await supabase.from('products').select('*').eq('seller_id', id);
  return error ? [] : data;
}

async function getAllProducts() {
  const { data, error } = await supabase.from('products').select('*');
  return error ? [] : data;
}

async function getProductById(id) {
  const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
  return error ? null : data;
}

/* ------------------------------------------------------------------ */
/* 4.  SMALL UTILS                                                    */
/* ------------------------------------------------------------------ */
function mapAuthError(err) {
  // turn supabase auth errors into UI strings
  if (!err) return 'Unknown error';
  const msg = err.message || '';
  if (msg.includes('Invalid login credentials')) return 'Wrong e-mail or password.';
  if (msg.includes('Email not confirmed'))       return 'Please confirm your e-mail first.';
  if (msg.includes('network'))                   return 'Network error – check your connection.';
  return msg;
}

/* ------------------------------------------------------- */
/* 5.  EXPORT                                              */
/* ------------------------------------------------------- */
window.db = { signUpSeller, loginSeller, logoutSeller, checkAuth, getCurrentSeller, isLoggedIn,
              addProduct, getMyProducts, updateProduct, deleteProduct,
              getSellerById, getProductsBySellerId, getAllProducts, getProductById };
              
            
        
    


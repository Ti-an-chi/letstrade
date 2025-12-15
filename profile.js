// profile.js - Profile tab functionality

export async function initProfileTab() {
  // Profile is already loaded with user data
  // Just ensure UI is updated
  const user = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
  if (user.username) {
    // UI is already updated by main.js
  }
}
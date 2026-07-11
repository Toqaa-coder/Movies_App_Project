// ============================================
// authClient.js - כלי עזר משותפים לניהול Auth בצד לקוח
// יש לכלול קובץ זה (עם <script src="authClient.js">) בכל דף
// ============================================

// שמירת הטוקן (נקרא אחרי login מוצלח)
function saveAuth(token, user) {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
}

// שליפת הטוקן השמור
function getToken() {
  return localStorage.getItem('token');
}

// שליפת פרטי המשתמש המחובר
function getCurrentUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

// יציאה מהמערכת
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'login.html';
}

// "השומר" - שמים את זה בתחילת כל דף פרטי (feed.js, profiles.js וכו')
// אם אין טוקן - מיד מפנה ל-login ולא ממשיך לטעון את הדף
function requireAuth() {
  const token = getToken();
  if (!token) {
    window.location.href = 'login.html';
    return null;
  }
  return token;
}

// עוזר לשליחת בקשות עם הטוקן מצורף אוטומטית
// שימוש: authFetch('/api/content') במקום fetch('/api/content')
async function authFetch(url, options = {}) {
  const token = getToken();
  const headers = {
    ...options.headers,
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
  const response = await fetch(url, { ...options, headers });

  // אם השרת אומר שהטוקן לא תקין/פג תוקף - מוציאים החוצה
  if (response.status === 401) {
    logout();
    return null;
  }
  return response;
}


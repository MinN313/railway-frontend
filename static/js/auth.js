// auth.js
function checkAuth() {
    if (!localStorage.getItem('token')) { window.location.href = 'login.html'; return false; }
    return true;
}
function getToken() { return localStorage.getItem('token'); }
function getCurrentUser() { const u = localStorage.getItem('user'); return u ? JSON.parse(u) : null; }
function isAdmin() { const u = getCurrentUser(); return u && u.role === 'admin'; }
function isOperator() { const u = getCurrentUser(); return u && (u.role === 'admin' || u.role === 'operator'); }
function logout() { localStorage.removeItem('token'); localStorage.removeItem('user'); window.location.href = 'login.html'; }

async function apiCall(endpoint, method = 'GET', body = null) {
    const options = { method, headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` }};
    if (body) options.body = JSON.stringify(body);
    try {
        const res = await fetch(`${API_URL}${endpoint}`, options);
        const data = await res.json();
        if (res.status === 401) { logout(); return null; }
        return data;
    } catch (e) { console.error('API Error:', e); return null; }
}

function showError(msg) {
    const el = document.getElementById('error-message');
    if (el) { el.textContent = msg; el.style.display = 'block'; setTimeout(() => el.style.display = 'none', 5000); }
    else alert('❌ ' + msg);
}
function showSuccess(msg) {
    const el = document.getElementById('success-message');
    if (el) { el.textContent = msg; el.style.display = 'block'; setTimeout(() => el.style.display = 'none', 5000); }
    else alert('✅ ' + msg);
}
function applyTheme() {
    const theme = localStorage.getItem('theme') || 'dark';
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(theme + '-theme');
}
function initSettings() { applyTheme(); updateTexts(); }

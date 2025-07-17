// Authentication States
let isLoggedIn = false;
let currentUser = null;

function updateNavbarUser() {
    const nav = document.querySelector('.auth-buttons');
    if (isLoggedIn && currentUser) {
        nav.innerHTML = `<span class="user-welcome"><i class='fa fa-user'></i> ${currentUser.name}</span> <button class="logout-btn">Çıkış</button>`;
        nav.querySelector('.logout-btn').onclick = () => {
            isLoggedIn = false;
            currentUser = null;
            updateNavbarUser();
        };
    } else {
        nav.innerHTML = `<button class="login-btn">Giriş Yap</button><button class="signup-btn">Kayıt Ol</button>`;
        nav.querySelector('.login-btn').onclick = showLoginModal;
        nav.querySelector('.signup-btn').onclick = showSignupModal;
    }
}

document.addEventListener('DOMContentLoaded', updateNavbarUser);

// Modal helpers
function closeModal() {
    const modal = document.querySelector('.auth-modal');
    if (modal) modal.remove();
}

function showLoginModal() {
    closeModal();
    const modal = document.createElement('div');
    modal.className = 'auth-modal';
    modal.innerHTML = `
        <div class="auth-content animate-modal">
            <button class="close-modal" title="Kapat">&times;</button>
            <h2>Giriş Yap</h2>
            <form id="login-form">
                <input type="email" id="login-email" placeholder="E-posta" required>
                <input type="password" id="login-password" placeholder="Şifre" required>
                <div class="auth-error" id="login-error"></div>
                <button type="submit">Giriş Yap</button>
            </form>
            <p>Henüz hesabın yok mu? <a href="#" id="to-signup">Kayıt Ol</a></p>
        </div>
    `;
    document.body.appendChild(modal);
    document.querySelector('.close-modal').onclick = closeModal;
    document.getElementById('to-signup').onclick = (e) => { e.preventDefault(); closeModal(); showSignupModal(); };
    modal.querySelector('#login-form').addEventListener('submit', handleLogin);
}

function showSignupModal() {
    closeModal();
    const modal = document.createElement('div');
    modal.className = 'auth-modal';
    modal.innerHTML = `
        <div class="auth-content animate-modal">
            <button class="close-modal" title="Kapat">&times;</button>
            <h2>Kayıt Ol</h2>
            <form id="signup-form">
                <input type="text" id="signup-name" placeholder="Ad Soyad" required>
                <input type="email" id="signup-email" placeholder="E-posta" required>
                <input type="password" id="signup-password" placeholder="Şifre" required>
                <input type="password" id="signup-password2" placeholder="Şifre Tekrar" required>
                <div class="auth-error" id="signup-error"></div>
                <button type="submit">Kayıt Ol</button>
            </form>
            <p>Hesabın var mı? <a href="#" id="to-login">Giriş Yap</a></p>
        </div>
    `;
    document.body.appendChild(modal);
    document.querySelector('.close-modal').onclick = closeModal;
    document.getElementById('to-login').onclick = (e) => { e.preventDefault(); closeModal(); showLoginModal(); };
    modal.querySelector('#signup-form').addEventListener('submit', handleSignup);
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const errorDiv = document.getElementById('login-error');
    errorDiv.textContent = '';
    // Simple demo user
    let users = JSON.parse(localStorage.getItem('animevortex_users') || '[]');
    let user = users.find(u => u.email === email && u.password === password);
    if (!user) {
        errorDiv.textContent = 'E-posta veya şifre yanlış!';
        return;
    }
    isLoggedIn = true;
    currentUser = user;
    closeModal();
    updateNavbarUser();
}

function handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const password2 = document.getElementById('signup-password2').value;
    const errorDiv = document.getElementById('signup-error');
    errorDiv.textContent = '';
    if (!name || !email || !password || !password2) {
        errorDiv.textContent = 'Tüm alanları doldurun!';
        return;
    }
    if (!/^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/.test(email)) {
        errorDiv.textContent = 'Geçerli bir e-posta girin!';
        return;
    }
    if (password.length < 6) {
        errorDiv.textContent = 'Şifre en az 6 karakter olmalı!';
        return;
    }
    if (password !== password2) {
        errorDiv.textContent = 'Şifreler eşleşmiyor!';
        return;
    }
    let users = JSON.parse(localStorage.getItem('animevortex_users') || '[]');
    if (users.find(u => u.email === email)) {
        errorDiv.textContent = 'Bu e-posta ile zaten kayıtlısınız!';
        return;
    }
    let user = { name, email, password };
    users.push(user);
    localStorage.setItem('animevortex_users', JSON.stringify(users));
    isLoggedIn = true;
    currentUser = user;
    closeModal();
    updateNavbarUser();
}

// Modal ve animasyon stilleri
const style = document.createElement('style');
style.textContent = `
.auth-modal {
    position: fixed;
    top: 0; left: 0; width: 100vw; height: 100vh;
    background: rgba(20,20,20,0.88);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    backdrop-filter: blur(6px);
    animation: fadeIn 0.2s;
}
@keyframes fadeIn {
    from { opacity: 0; } to { opacity: 1; }
}
.auth-content {
    background: rgba(34,31,31,0.98);
    padding: 2.5rem 2rem 2rem 2rem;
    border-radius: 16px;
    width: 90%;
    max-width: 400px;
    box-shadow: 0 2px 24px #e5091440;
    position: relative;
}
.animate-modal { animation: modalPop 0.25s cubic-bezier(.21,1.02,.73,1.03); }
@keyframes modalPop {
    0% { transform: scale(0.85); opacity:0; }
    100% { transform: scale(1); opacity:1; }
}
.close-modal {
    position: absolute;
    top: 0.7rem; right: 1.2rem;
    background: none;
    border: none;
    font-size: 2.2rem;
    color: #e50914;
    cursor: pointer;
    transition: color 0.2s;
    z-index: 2;
}
.close-modal:hover {
    color: #fff;
}
.auth-content h2 {
    color: #fff;
    margin-bottom: 1.3rem;
    font-size: 1.5rem;
    font-weight: 800;
    letter-spacing: 0.01em;
}
.auth-content form {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
}
.auth-content input {
    padding: 1rem;
    border: 1.5px solid #333;
    border-radius: 7px;
    background: #222;
    color: #fff;
    font-size: 1.1rem;
}
.auth-content button[type="submit"] {
    background: var(--primary-color);
    color: white;
    border: none;
    padding: 1rem;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1.05rem;
    font-weight: 700;
    margin-top: 0.7rem;
    box-shadow: 0 2px 12px #e5091440;
    transition: background 0.2s, transform 0.2s;
}
.auth-content button[type="submit"]:hover {
    background: #b0060f;
    transform: scale(1.04);
}
.auth-content a {
    color: #e50914;
    text-decoration: none;
    font-weight: 700;
}
.auth-error {
    color: #e50914;
    font-size: 1rem;
    margin-bottom: 0.2rem;
    font-weight: 700;
    min-height: 1.2em;
}
.user-welcome {
    color: #fff;
    font-weight: 700;
    font-size: 1.1rem;
    margin-right: 0.7rem;
    display: flex;
    align-items: center;
    gap: 0.4rem;
}
.logout-btn {
    background: #e50914;
    color: #fff;
    border: none;
    border-radius: 16px;
    padding: 0.5rem 1.3rem;
    font-weight: 700;
    font-size: 1rem;
    margin-left: 0.7rem;
    cursor: pointer;
    transition: background 0.2s;
}
.logout-btn:hover {
    background: #b0060f;
}
`;
document.head.appendChild(style);

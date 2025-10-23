import { loadAvatar, clearAvatar } from "./avatar.js";
import { loadTasks, clearTasks } from "./tasks.js";
import { API_BASE } from "./utils.js";

export function initAuth() {
    document.getElementById('login-btn').addEventListener('click', login);
    document.getElementById('register-btn').addEventListener('click', register);
    document.getElementById('logout').addEventListener('click', logout);
}

async function login() {
    if (!validateAuthInputs()) return;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    if (res.ok) {
        const data = await res.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('email', data.email);
        showApp();
    } else {
        // alert('Ошибка входа');
        const ex = await res.text();
        document.getElementById('invalid-credentials-err').textContent = ex;
    }
}

async function register() {
    if (!validateAuthInputs()) return;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    if (res.ok) {
        const data = await res.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('email', data.email);
        showApp();
    } else {
        const ex = await res.text();
        document.getElementById('user-exist-err').textContent = ex;
    }
}

function logout() {
    localStorage.clear();
    clearTasks();
    clearAvatar();
    document.getElementById('app').style.display = 'none';
    document.getElementById('auth-form').style.display = 'flex';
}

function validateAuthInputs() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    document.getElementById('invalid-credentials-err').textContent='';
    document.getElementById('user-exist-err').textContent = '';

    // валидация почты
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        document.getElementById('invalid-credentials-err').textContent = 'Email обязателен';
        return false;
    }

    if (!emailRegex.test(email)){
        document.getElementById('invalid-credentials-err').textContent = 'Некорректный email';
        return false;
    }

    // валидация пароля
    if (!password) {
        document.getElementById('invalid-credentials-err').textContent = 'Пароль обязателен';
        return false;
    }

    if (password.length < 6) {
        document.getElementById('invalid-credentials-err').textContent = 'Пароль должен быть не короче 6 символов';
        return false;
    }

    return true;
}

export function showApp() {
    document.getElementById('auth-form').style.display = 'none';
    document.getElementById('app').style.display = 'block';
    document.getElementById('user-email').textContent = localStorage.getItem('email');

    loadAvatar();
    loadTasks();
}
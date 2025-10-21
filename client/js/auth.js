import { loadAvatar, clearAvatar } from "./avatar.js";
import { loadTasks, clearTasks } from "./tasks.js";
import { API_BASE } from "./utils.js";

export function initAuth() {
    document.getElementById('login-btn').addEventListener('click', login);
    document.getElementById('register-btn').addEventListener('click', register);
    document.getElementById('logout').addEventListener('click', logout);
}

async function login() {
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
        alert('Ошибка входа');
    }
}

async function register() {
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
        alert('Ошибка регистрации');
    }
}

function logout() {
    localStorage.clear();
    clearTasks();
    clearAvatar();
    document.getElementById('app').style.display = 'none';
    document.getElementById('auth-form').style.display = 'flex';
}

export function showApp() {
    document.getElementById('auth-form').style.display = 'none';
    document.getElementById('app').style.display = 'block';
    document.getElementById('user-email').textContent = localStorage.getItem('email');

    loadAvatar();
    loadTasks();
}
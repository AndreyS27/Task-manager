const API_BASE = 'https://localhost:7037/api';

document.getElementById('login-btn').addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, password})
    });

    if (res.ok) {
        const data = await res.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('email', data.email);
        showApp();
    } else {
        alert('Ошибка входа');
    }
});

document.getElementById('register-btn').addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, password})
    });

    if (res.ok) {
        const data = await res.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('email', data.email);
        showApp();
    } else {
        alert('Ошибка регистрации');
    }
});

function showApp() {
    document.getElementById('auth-form').style.display = 'none';
    document.getElementById('app').style.display = 'block';
    document.getElementById('user-email').textContent = localStorage.getItem('email');
    loadTasks();
}

async function loadTasks() {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/todo`, {
        headers: {'Authorization': `Bearer ${token}`}
    });

    const tasks = await res.json();
    const tasksList = document.getElementById('tasks-list');

    if (tasks.length === 0) {
        tasksList.innerHTML = '<p>Список задач пуст</p>';
    } else {
        tasksList.innerHTML = tasks.map(t =>
            `<div><strong>${t.title}</strong> - ${t.description || ''} (${t.isCompleted ? 'Выполнено' : 'Выполняется'})</div>`
        ).join('');
    }
}

if (localStorage.getItem('token')){
    showApp();
}
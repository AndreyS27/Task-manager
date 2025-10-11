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

// Показать модальное окно добавления задачи
document.getElementById('add-task').addEventListener('click', () => {
    document.getElementById('add-task-modal').style.display = 'block';
    document.getElementById('new-task-title').value = '';
    document.getElementById('new-task-description').value = '';
});

// Скрыть модальное окно добавления задачи
document.getElementById('cancel-add').addEventListener('click', () => {
    document.getElementById('add-task-modal').style.display = 'none';
});

// Сохранить новую задачу
document.getElementById('save-task').addEventListener('click', async () => {
    const title = document.getElementById('new-task-title').value.trim();
    if (!title){
        alert('Название задачи обязательно!');
        return;
    }

    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/todo`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: title,
            description: document.getElementById('new-task-description').value || null
        })
    });

    if (res.ok) {
        document.getElementById('add-task-modal').style.display = 'none';
        loadTasks();
    } else {
        alert('Ошибка при создании задачи');
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
            `<div class='todo-container' data-id="${t.id}">
                <strong>${t.title}</strong> - ${t.description || ''} (${t.isCompleted ? 'Выполнено' : 'Выполняется'})
                <button class='update-todo'>Изменить</button>
                <button class='delete-todo'>Удалить</button>
            </div>`
        ).join('');
    }
}

document.getElementById('tasks-list').addEventListener('click', async (e) => {
    const container = e.target.closest('.todo-container');
    if (!container) return;

    const taskId = container.dataset.id;

    if (e.target.classList.contains('delete-todo')){
        if (!confirm('Удалить задачу?')) return;

        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}/todo/${taskId}`, {
            method: 'DELETE',
            headers: {'Authorization': `Bearer ${token}`}
        });

        if (res.ok) {
            loadTasks();
        } else {
            alert('Ошибка удаления');
        }
    }

    if (e.target.classList.contains('update-todo')){
        alert('Редактирование задачи пока не реализовано')
    }
})

if (localStorage.getItem('token')){
    showApp();
}
import { initAuth, showApp } from "./auth.js";
import { initAvatar, loadAvatar } from "./avatar.js";
import { initTasks, loadTasks } from './tasks.js'

document.addEventListener('DOMContentLoaded', () => {
    initAuth();
    initAvatar();
    initTasks();

    // Если пользователь авторизован показать интерфейс
    if (localStorage.getItem('token')) {
        showApp();
        loadAvatar();
        loadTasks();
    }
});

// const API_BASE = 'https://localhost:7037/api';
// let currentTaskId = null;
// let tasks = [];

// document.getElementById('login-btn').addEventListener('click', async () => {
    // const email = document.getElementById('email').value;
    // const password = document.getElementById('password').value;

    // const res = await fetch(`${API_BASE}/auth/login`, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ email, password })
    // });

    // if (res.ok) {
    //     const data = await res.json();
    //     localStorage.setItem('token', data.token);
    //     localStorage.setItem('email', data.email);
    //     showApp();
    // } else {
    //     alert('Ошибка входа');
    // }
// });

// document.getElementById('register-btn').addEventListener('click', async () => {
    // const email = document.getElementById('email').value;
    // const password = document.getElementById('password').value;

    // const res = await fetch(`${API_BASE}/auth/register`, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ email, password })
    // });

    // if (res.ok) {
    //     const data = await res.json();
    //     localStorage.setItem('token', data.token);
    //     localStorage.setItem('email', data.email);
    //     showApp();
    // } else {
    //     alert('Ошибка регистрации');
    // }
// });

// Кнопка добавления аватара
// При клике на кнопку - эмулируем клик по input
// document.getElementById('upload-avatar').addEventListener('click', () => {
//     document.getElementById('avatar-input').click();
// })

// document.getElementById('avatar-input').addEventListener('change', async (e) => {
    // const file = e.target.files[0];
    // if (!file) return;

    // if (!file.type.startsWith('image/')) {
    //     alert('Выберите изображение! (jpeg, png, gif и т.д.');
    //     return;
    // }

    // const formData = new FormData();
    // formData.append('file', file);

    // const token = localStorage.getItem('token');
    // const res = await fetch(`${API_BASE}/account/avatar`, {
    //     method: 'POST',
    //     headers: {'Authorization': `Bearer ${token}`},
    //     body: formData
    // });

    // if (res.ok) {
    //     alert('Аватар успешно загружен');
    //     loadAvatar();
    // } else {
    //     alert('Ошибка загрузки аватара');
    // }

    // e.target.value = '';
// });

// Показать модальное окно добавления задачи
// document.getElementById('add-task').addEventListener('click', () => {
    // document.getElementById('add-task-modal').style.display = 'block';
    // document.getElementById('new-task-title').value = '';
    // document.getElementById('new-task-description').value = '';
// });

// Скрыть модальное окно добавления задачи
// document.getElementById('cancel-add').addEventListener('click', () => {
//     document.getElementById('add-task-modal').style.display = 'none';
// });
// Скрыть модальное окно обновления задачи
// document.getElementById('cancel-changes').addEventListener('click', () => {
    // document.getElementById('change-task-modal').style.display = 'none';
    // currentTaskId = null;
// });

// кнопка выхода
// document.getElementById('logout').addEventListener('click', () => {
    // localStorage.clear();
    // document.getElementById('app').style.display = 'none';
    // document.getElementById('auth-form').style.display = 'flex';
// })

// Сохранить новую задачу
// document.getElementById('save-task').addEventListener('click', async () => {
    // const title = document.getElementById('new-task-title').value.trim();
    // if (!title) {
    //     alert('Название задачи обязательно!');
    //     return;
    // }

    // const token = localStorage.getItem('token');
    // const res = await fetch(`${API_BASE}/todo`, {
    //     method: 'POST',
    //     headers: {
    //         'Authorization': `Bearer ${token}`,
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({
    //         title: title,
    //         description: document.getElementById('new-task-description').value || null
    //     })
    // });

    // if (res.ok) {
    //     document.getElementById('add-task-modal').style.display = 'none';
    //     loadTasks();
    // } else {
    //     alert('Ошибка при создании задачи');
    // }
// });


// Обработчик кнопок элементов в tasks-list
// document.getElementById('tasks-list').addEventListener('click', async (e) => {
    // const container = e.target.closest('.todo-container');
    // if (!container) return;

    // const taskId = container.dataset.id;

    // if (e.target.classList.contains('delete-todo')) {
    //     if (!confirm('Удалить задачу?')) return;

    //     const token = localStorage.getItem('token');
    //     const res = await fetch(`${API_BASE}/todo/${taskId}`, {
    //         method: 'DELETE',
    //         headers: { 'Authorization': `Bearer ${token}` }
    //     });

    //     if (res.ok) {
    //         loadTasks();
    //     } else {
    //         alert('Ошибка удаления');
    //     }
    // }

    // // Показать модальное окно для редактирования задачи
    // if (e.target.classList.contains('update-todo')) {
    //     const taskId = container.dataset.id;
    //     const task = tasks.find(t => t.id == taskId);

    //     if (task) {
    //         document.getElementById('updated-title').value = task.title;
    //         document.getElementById('updated-description').value = task.description || '';
    //         document.getElementById('task-status').checked = task.isCompleted;
    //     }

    //     currentTaskId = taskId;

    //     document.getElementById('change-task-modal').style.display = 'block';
    // }
// })

// Сохранить измененную задачу
// document.getElementById('save-changes').addEventListener('click', async () => {
    // if (!currentTaskId) return;

    // const title = document.getElementById('updated-title').value.trim();
    // if (!title) {
    //     alert('Заполните название задачи!');
    //     return;
    // }

    // const token = localStorage.getItem('token');
    // const updateData = {
    //     title: title,
    //     description: document.getElementById('updated-description').value,
    //     isCompleted: document.getElementById('task-status').checked
    // };

    // const res = await fetch(`${API_BASE}/todo/${currentTaskId}`, {
    //     method: 'PUT',
    //     headers: {
    //         'Authorization': `Bearer ${token}`,
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(updateData)
    // });

    // if (res.ok) {
    //     document.getElementById('change-task-modal').style.display = 'none';
    //     currentTaskId = null;
    //     loadTasks();
    // } else {
    //     alert('Ошибка при обновлении задачи');
    // }
// })

// function showApp() {
//     document.getElementById('auth-form').style.display = 'none';
//     document.getElementById('app').style.display = 'block';
//     document.getElementById('user-email').textContent = localStorage.getItem('email');
//     loadAvatar();
//     loadTasks();
// }

// async function loadTasks() {
    // const token = localStorage.getItem('token');
    // const res = await fetch(`${API_BASE}/todo`, {
    //     headers: { 'Authorization': `Bearer ${token}` }
    // });

    // tasks = await res.json();
    // const tasksList = document.getElementById('tasks-list');

    // if (tasks.length === 0) {
    //     tasksList.innerHTML = '<p>Список задач пуст</p>';
    // } else {
    //     tasksList.innerHTML = tasks.map(t =>
    //         `<div class='todo-container' data-id="${t.id}">
    //             <div class='todo-header'>
    //                 <h4>${t.title}</h4>
    //                 Дата создания - ${formatDateTime(t.createdAt)}
    //             </div>
    //             <p>${t.description || ''}</p>
    //             ${t.isCompleted ? 
    //                 '<p style="color: green">Выполнено</p>' 
    //                 : '<p style="color: orange">Выполняется</p>'}
    //             <button class="custom-btn update-todo">Изменить</button>
    //             <button class="custom-btn delete-todo">Удалить</button>
    //         </div>`
    //     ).join('');
    // }
// }



// async function loadAvatar() {
    // const token = localStorage.getItem('token');
    // const res = await fetch(`${API_BASE}/account/avatar`, {
    //     headers: { 'Authorization': `Bearer ${token}`}
    // });

    // if (res.ok) {
    //     const data = await res.json(); // путь или null
    //     const avatarPath = data.avatarPath;
    //     const img = document.getElementById('user-avatar');

    //     if (avatarPath) {
    //         img.src = `https://localhost:7037/${avatarPath}`;
    //     } else {
    //         img.src = 'images/default-avatar.jpg';
    //     }
    // }
// }

// if (localStorage.getItem('token')) {
//     showApp();
// }
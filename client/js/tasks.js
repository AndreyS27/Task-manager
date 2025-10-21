import { API_BASE } from "./utils.js";
import { formatDateTime } from "./utils.js";

let currentTaskId = null;
let tasks = [];

export function initTasks() {
    document.getElementById('add-task')?.addEventListener('click', openAddModal);
    document.getElementById('cancel-add')?.addEventListener('click', closeAddModal);
    document.getElementById('cancel-changes')?.addEventListener('click', closeEditModal);
    document.getElementById('save-task')?.addEventListener('click', createTask);
    document.getElementById('save-changes')?.addEventListener('click', updateTask);
    document.getElementById('tasks-list')?.addEventListener('click', handleTaskActions);

    if (localStorage.getItem('token')) {
        loadTasks();
    }
}

export function clearTasks() {
    tasks = [];
    document.getElementById('tasks-list').innerHTML = '';
}

function openAddModal() {
    document.getElementById('add-task-modal').style.display = 'block';
    document.getElementById('new-task-title').value = '';
    document.getElementById('new-task-description').value = '';
}

function closeAddModal() {
    document.getElementById('add-task-moadl').style.display = 'none';
}

function closeEditModal() {
    document.getElementById('change-task-modal').style.display = 'none';
    currentTaskId = null;
}

async function createTask() {
    const title = document.getElementById('new-task-title').value.trim();
    if (!title) {
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
}

async function updateTask() {
    if (!currentTaskId) return;

    const title = document.getElementById('updated-title').value.trim();
    if (!title) {
        alert('Заполните название задачи!');
        return;
    }

    const token = localStorage.getItem('token');
    const updateData = {
        title: title,
        description: document.getElementById('updated-description').value,
        isCompleted: document.getElementById('task-status').checked
    };

    const res = await fetch(`${API_BASE}/todo/${currentTaskId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
    });

    if (res.ok) {
        closeEditModal();
        loadTasks();
    } else {
        alert('Ошибка при обновлении задачи');
    }
}

async function handleTaskActions(e) {
    const container = e.target.closest('.todo-container');
    if (!container) return;

    const taskId = container.dataset.id;

    if (e.target.classList.contains('delete-todo')) {
        if (!confirm('Удалить задачу?')) return;

        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}/todo/${taskId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
            loadTasks();
        } else {
            alert('Ошибка удаления');
        }
    }

    // Показать модальное окно для редактирования задачи
    if (e.target.classList.contains('update-todo')) {
        const taskId = container.dataset.id;
        const task = tasks.find(t => t.id == taskId);

        if (task) {
            document.getElementById('updated-title').value = task.title;
            document.getElementById('updated-description').value = task.description || '';
            document.getElementById('task-status').checked = task.isCompleted;
            currentTaskId = taskId;
            document.getElementById('change-task-modal').style.display = 'block';
        }
    }
}

export async function loadTasks() {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/todo`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    tasks = await res.json();
    const tasksList = document.getElementById('tasks-list');

    if (tasks.length === 0) {
        tasksList.innerHTML = '<p>Список задач пуст</p>';
    } else {
        tasksList.innerHTML = tasks.map(t =>
            `<div class='todo-container' data-id="${t.id}">
                <div class='todo-header'>
                    <h4>${t.title}</h4>
                    Дата создания - ${formatDateTime(t.createdAt)}
                </div>
                <p>${t.description || ''}</p>
                ${t.isCompleted ?
                '<p style="color: green">Выполнено</p>'
                : '<p style="color: orange">Выполняется</p>'}
                <button class="custom-btn update-todo">Изменить</button>
                <button class="custom-btn delete-todo">Удалить</button>
            </div>`
        ).join('');
    }
}
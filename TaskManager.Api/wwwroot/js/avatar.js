import { API_BASE } from "./utils.js";

let currentAvatarImg = null;

export function initAvatar() {
    currentAvatarImg = document.getElementById('user-avatar');
    document.getElementById('upload-avatar')?.addEventListener('click', () => {
        document.getElementById('avatar-input')?.click();
    });
    document.getElementById('avatar-input')?.addEventListener('change', handleFileSelect);
    if (localStorage.getItem('token')){
        loadAvatar();
    }
}

export function clearAvatar() {
    if (currentAvatarImg){
        currentAvatarImg.src = 'images/default-avatar.jpg';
    }
}

async function handleFileSelect(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        alert('Выберите изображение! (jpeg, png, gif и т.д.');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/account/avatar`, {
        method: 'POST',
        headers: {'Authorization': `Bearer ${token}`},
        body: formData
    });

    if (res.ok) {
        alert('Аватар успешно загружен');
        loadAvatar();
    } else {
        alert('Ошибка загрузки аватара');
    }

    e.target.value = '';
}

export async function loadAvatar() {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/account/avatar`, {
        headers: { 'Authorization': `Bearer ${token}`}
    });

    if (res.ok) {
        const data = await res.json(); // путь или null
        const avatarPath = data.avatarPath;

        if (avatarPath && currentAvatarImg) {
            currentAvatarImg.src = `${API_BASE.replace('/api', '')}${avatarPath}`;
        } else if (currentAvatarImg){
            currentAvatarImg.src = 'images/default-avatar.jpg';
        }
    }
}
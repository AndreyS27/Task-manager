# TaskManager — Менеджер задач с JWT-аутентификацией

Простой менеджер задач (To-Do List) с регистрацией, авторизацией через JWT, загрузкой аватара и полным CRUD для задач.  
Разработан как учебный проект для отработки навыков веб-разработки на **.NET 8**, **PostgreSQL**, **Entity Framework Core** и **чистом JavaScript**.

![.NET 8](https://img.shields.io/badge/.NET-8.0-512BD4?logo=.net)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-336791?logo=postgresql)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript)

---

## Возможности

- Регистрация и вход по email + пароль
- JWT-аутентификация
- Создание, редактирование, удаление задач
- Загрузка аватара пользователя
- Адаптивный интерфейс

---

## Технологии

### Backend
- **ASP.NET Core Web API (.NET 8)**
- **Entity Framework Core** + **Npgsql** (PostgreSQL)
- **JWT** для аутентификации
- **PasswordHasher** для хеширования паролей
- **Swagger** для тестирования API

### Frontend
- **JavaScript**
- **HTML5 + CSS3**
- **Fetch API** для взаимодействия с бэкендом

---

## Требования

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [PostgreSQL 15+](https://www.postgresql.org/download/)
- Браузер с поддержкой ES6 Modules (Chrome, Firefox, Edge)

---

## Локальный запуск

### 1. Клонируйте репозиторий
```bash
git clone https://github.com/AndreyS27/Task-manager.git
cd TaskManager 
```
### 2. Настройте конфигурацию
1) Создайте файл конфигурации из шаблона:
```bash
cp TaskManager.Api/appsettings.example.json TaskManager.Api/appsettings.json
```
2) Отредактируйте TaskManager.Api/appsettings.json:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=taskmanager_db;Username=postgres;Password=ваш_пароль"
  },
  "Jwt": {
    "Key": "ваш-32-символьный-секретный-ключ-здесь",
    "Issuer": "TaskManager",
    "Audience": "TaskManagerUsers",
    "ExpiresInMinutes": 60
  }
}
```
### 3. Запустите базу данных
Убедитесь, что PostgreSQL запущен и доступен по указанному в appsettings.json адресу.

### 4. Примените миграции
Из папки TaskManager.Api выполните:
```bash
dotnet ef database update
```

### 5. Запустите сервер
```bash
dotnet run
```
Сервер будет доступен по адресу:
https://localhost:7037 или http://localhost:5022
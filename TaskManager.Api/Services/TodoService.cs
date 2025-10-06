using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using TaskManager.Api.Data;
using TaskManager.Api.DTOs;
using TaskManager.Api.Models;

namespace TaskManager.Api.Services
{
    public class TodoService : ITodoService
    {
        private readonly ApplicationDbContext _context;

        public TodoService(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<TodoItemDto> CreateAsync(CreateTodoDto dto, int userId)
        {
            var todoItem = new TodoItem
            {
                Title = dto.Title,
                Description = dto.Description,
                UserId = userId
            };

            _context.TodoItems.Add(todoItem);
            await _context.SaveChangesAsync();

            return new TodoItemDto 
            { 
                Id = todoItem.Id, 
                Title = todoItem.Title,
                Description = todoItem.Description,
                IsCompleted = todoItem.IsCompleted,
                CreatedAt = todoItem.CreatedAt
            };
        }

        public async Task<bool> DeleteAsync(int todoId, int userId)
        {
            var todoItem = await _context.TodoItems
                .FirstOrDefaultAsync(t => t.Id == todoId && t.UserId == userId);

            if (todoItem == null)
            {
                return false;
            }

            _context.TodoItems.Remove(todoItem);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<TodoItemDto>> GetByUserIdAsync(int userId)
        {
            return await _context.TodoItems
                .Where(t => t.UserId == userId)
                .Select(t => new TodoItemDto
                {
                    Id = t.Id,
                    Title = t.Title,
                    Description = t.Description,
                    IsCompleted = t.IsCompleted,
                    CreatedAt = t.CreatedAt,
                })
                .ToListAsync();
        }

        public async Task<TodoItemDto?> GetByIdAsync(int todoId, int userId)
        {
            var todoItem = await _context.TodoItems
                .FirstOrDefaultAsync(t => t.Id == todoId && t.UserId == userId);

            if (todoItem == null)
            {
                return null;
            }

            return new TodoItemDto
            {
                Id = todoItem.Id,
                Title = todoItem.Title,
                Description = todoItem.Description,
                IsCompleted = todoItem.IsCompleted,
                CreatedAt = todoItem.CreatedAt
            };
        }

        public async Task<TodoItemDto?> UpdateAsync(int todoId, UpdateTodoDto dto, int userId)
        {
            var todoItem = await _context.TodoItems
                .FirstOrDefaultAsync(t => t.Id == todoId && t.UserId == userId);

            if (todoItem == null)
            {
                return null;
            }

            if (!String.IsNullOrEmpty(dto.Title))
            {
                todoItem.Title = dto.Title;
            }

            if (dto.Description != null)
            {
                todoItem.Description = dto.Description;
            }

            if (dto.IsCompleted.HasValue) 
            {
                todoItem.IsCompleted = dto.IsCompleted.Value;
            }

            await _context.SaveChangesAsync();

            return new TodoItemDto
            {
                Id = todoItem.Id,
                Title = todoItem.Title,
                Description = todoItem.Description,
                IsCompleted = todoItem.IsCompleted,
                CreatedAt = todoItem.CreatedAt
            };
        }
    }
}

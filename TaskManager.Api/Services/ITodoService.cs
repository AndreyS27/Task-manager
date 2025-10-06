using TaskManager.Api.DTOs;

namespace TaskManager.Api.Services
{
    public interface ITodoService
    {
        Task<List<TodoItemDto>> GetByUserIdAsync(int userId);
        Task<TodoItemDto?> GetByIdAsync(int id, int userId);
        Task<TodoItemDto> CreateAsync(CreateTodoDto dto, int userId);
        Task<TodoItemDto?> UpdateAsync(int id, UpdateTodoDto dto, int userId);
        Task <bool> DeleteAsync(int id, int userId);
    }
}

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TaskManager.Api.DTOs;
using TaskManager.Api.Services;

namespace TaskManager.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TodoController : ControllerBase
    {
        private readonly ITodoService _todoService;

        public TodoController(ITodoService todoService)
        {
            _todoService = todoService;
        }

        [HttpGet]
        public async Task<ActionResult<List<TodoItemDto>>> GetTodos()
        {
            var userId = GetUserId();
            var todos = await _todoService.GetByUserIdAsync(userId);
            return Ok(todos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TodoItemDto>> GetTodoById(int id)
        {
            var userId = GetUserId();
            var todo = await _todoService.GetByIdAsync(id, userId);

            if (todo == null)
                return NotFound();

            return Ok(todo);
        }

        [HttpPost]
        public async Task<ActionResult<TodoItemDto>> CreateTodo(CreateTodoDto dto)
        {
            var userId = GetUserId();
            var todo = await _todoService.CreateAsync(dto, userId);
            return CreatedAtAction(nameof(GetTodoById), new { id = todo.Id }, todo);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTodo(int id)
        {
            var userId = GetUserId();
            var deleted = await _todoService.DeleteAsync(id,userId);

            if (!deleted)
                return NotFound();

            return NoContent();
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<TodoItemDto>> UpdateTodo(int id, UpdateTodoDto dto)
        {
            var userId = GetUserId();
            var updatedTodo = await _todoService.UpdateAsync(id, dto, userId);

            if (updatedTodo == null)
                return NotFound();

            return Ok(updatedTodo);
        }

        private int GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                throw new InvalidOperationException("UserID claims is missing or invalid");
            }

            return userId;
        }
    }
}

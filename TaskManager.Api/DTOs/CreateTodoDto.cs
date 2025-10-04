namespace TaskManager.Api.DTOs
{
    public class CreateTodoDto
    {
        public string Title { get; set; } = String.Empty;
        public string? Description { get; set; }
    }
}

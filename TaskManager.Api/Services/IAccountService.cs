namespace TaskManager.Api.Services
{
    public interface IAccountService
    {
        Task<string> UploadAvatarAsync(int userId, IFormFile file);
        Task<string>? GetAvatarPathAsync(int userId);
    }
}

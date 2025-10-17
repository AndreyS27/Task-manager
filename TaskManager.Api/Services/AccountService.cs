using Microsoft.EntityFrameworkCore;
using TaskManager.Api.Data;

namespace TaskManager.Api.Services
{
    public class AccountService : IAccountService
    {
        private readonly ApplicationDbContext _context;

        public AccountService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<string> UploadAvatarAsync(int userId, IFormFile file)
        {
            //if (file == null || file.Length == 0)
            //    throw new ArgumentException("File is empty or null");

            // генерация уникального имени файла
            var fileExtenstion = Path.GetExtension(file.FileName).ToLower();
            var fileName = $"{Guid.NewGuid()}{fileExtenstion}";
            var filePath = Path.Combine("wwwroot", "uploads", "avatars", fileName);

            // сохранение файла на диск
            Directory.CreateDirectory(Path.GetDirectoryName(filePath)!);
            using (var stream = File.Create(filePath))
            {
                await file.CopyToAsync(stream);
            }

            var user = await _context.Users.FindAsync(userId);

            // удаление старого аватара
            if (!string.IsNullOrEmpty(user.AvatarPath))
            {
                var oldPath = Path.Combine("wwwroot", user.AvatarPath.TrimStart('/'));
                if (File.Exists(oldPath))
                    File.Delete(oldPath);
            }

            var urlPath = $"/uploads/avatars/{fileName}";
            user.AvatarPath = urlPath;
            await _context.SaveChangesAsync();

            return urlPath;
        }

        public async Task<string>? GetAvatarPathAsync(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            return user?.AvatarPath;
        }

        
    }
}

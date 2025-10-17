using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TaskManager.Api.Services;

namespace TaskManager.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AccountController : ControllerBase
    {
        private readonly IAccountService _accountService;

        public AccountController(IAccountService accountService)
        {
            _accountService = accountService;
        }

        [HttpPost]
        public async Task<ActionResult<string>> UploadAvatar(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("File is required and must not be empty!");

            var userId = GetUserId();
            var avatarPath = await _accountService.UploadAvatarAsync(userId, file);
            return Ok(avatarPath);
        }

        [HttpGet]
        public async Task<ActionResult<string>> GetAvatarUrl()
        {
            var userId = GetUserId();
            var avatarPath = await _accountService.GetAvatarPathAsync(userId);
            return avatarPath;
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

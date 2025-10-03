using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using TaskManager.Api.Data;
using TaskManager.Api.DTOs;
using TaskManager.Api.Models;

namespace TaskManager.Api.Services
{
    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _config;
        private readonly PasswordService _passwordService;

        public AuthService(ApplicationDbContext context, IConfiguration config, PasswordService passwordService)
        {
            _config = config;
            _context = context;
            _passwordService = passwordService;
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
        {
            if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
                throw new Exception("User already exists");

            var user = new User
            {
                Email = dto.Email,
                PasswordHash = _passwordService.HashPassword(dto.Password)
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var token = GenerateJwtToken(user);
            return new AuthResponseDto { Token = token, Email = user.Email };
        }

        public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
            if (user == null || !_passwordService.VerifyPassword(dto.Password, user.PasswordHash))
                throw new Exception("Invalid Credentials");

            var token = GenerateJwtToken(user);
            return new AuthResponseDto { Token = token, Email = user.Email };
        }

        private string GenerateJwtToken(User user)
        {
            var jwtSettings = _config.GetSection("Jwt").Get<JwtSettings>();
            var key = Encoding.UTF8.GetBytes(jwtSettings.Key);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Email, user.Email)
                }),
                Expires = DateTime.UtcNow.AddMinutes(jwtSettings.ExpiresInMinutes),
                Issuer = jwtSettings.Issuer,
                Audience = jwtSettings.Audience,
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Text.Json;

namespace TseboIQ.API.Controllers
{
    /// <summary>
    /// Profile Controller
    /// Handles candidate profile operations including CV upload and parsing
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // Require authentication for all endpoints
    public class ProfileController : ControllerBase
    {
        private readonly IProfileService _profileService;
        private readonly ICVParserService _cvParserService;
        private readonly IFileStorageService _fileStorageService;
        private readonly ILogger<ProfileController> _logger;

        public ProfileController(
            IProfileService profileService,
            ICVParserService cvParserService,
            IFileStorageService fileStorageService,
            ILogger<ProfileController> logger)
        {
            _profileService = profileService;
            _cvParserService = cvParserService;
            _fileStorageService = fileStorageService;
            _logger = logger;
        }

        /// <summary>
        /// Upload and parse CV file
        /// POST /api/profile/upload
        /// </summary>
        [HttpPost("upload")]
        [RequestSizeLimit(10_485_760)] // 10MB limit
        public async Task<IActionResult> UploadCV([FromForm] IFormFile file, [FromForm] string userId)
        {
            try
            {
                // Validate file
                if (file == null || file.Length == 0)
                {
                    return BadRequest(new { message = "No file uploaded" });
                }

                // Validate file type
                var allowedTypes = new[] { "application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document" };
                if (!allowedTypes.Contains(file.ContentType))
                {
                    return BadRequest(new { message = "Invalid file type. Only PDF and DOCX are supported." });
                }

                // Validate file size (10MB)
                if (file.Length > 10_485_760)
                {
                    return BadRequest(new { message = "File size exceeds 10MB limit." });
                }

                // Parse CV
                _logger.LogInformation($"Parsing CV for user {userId}");
                var parsedData = await _cvParserService.ParseCVAsync(file);

                // Upload file to storage
                var fileUrl = await _fileStorageService.UploadFileAsync(file, userId, "cvs");

                return Ok(new
                {
                    success = true,
                    data = parsedData,
                    fileUrl = fileUrl
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading CV");
                return StatusCode(500, new { message = "Failed to parse CV", error = ex.Message });
            }
        }

        /// <summary>
        /// Create new candidate profile
        /// POST /api/profile
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> CreateProfile([FromBody] CandidateProfileDto profileDto)
        {
            try
            {
                // Validate model
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Check if profile already exists
                var existing = await _profileService.GetProfileByUserIdAsync(profileDto.UserId);
                if (existing != null)
                {
                    return Conflict(new { message = "Profile already exists for this user" });
                }

                // Create profile
                var profile = await _profileService.CreateProfileAsync(profileDto);

                _logger.LogInformation($"Profile created for user {profileDto.UserId}");

                return CreatedAtAction(nameof(GetProfileByUserId), new { userId = profile.UserId }, profile);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating profile");
                return StatusCode(500, new { message = "Failed to create profile", error = ex.Message });
            }
        }

        /// <summary>
        /// Get profile by user ID
        /// GET /api/profile/user/{userId}
        /// </summary>
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetProfileByUserId(string userId)
        {
            try
            {
                var profile = await _profileService.GetProfileByUserIdAsync(userId);

                if (profile == null)
                {
                    return NotFound(new { message = "Profile not found" });
                }

                return Ok(profile);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error fetching profile for user {userId}");
                return StatusCode(500, new { message = "Failed to fetch profile", error = ex.Message });
            }
        }

        /// <summary>
        /// Update existing profile
        /// PUT /api/profile/{profileId}
        /// </summary>
        [HttpPut("{profileId}")]
        public async Task<IActionResult> UpdateProfile(string profileId, [FromBody] CandidateProfileDto profileDto)
        {
            try
            {
                // Validate model
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Check if profile exists
                var existing = await _profileService.GetProfileByIdAsync(profileId);
                if (existing == null)
                {
                    return NotFound(new { message = "Profile not found" });
                }

                // Update profile
                var updated = await _profileService.UpdateProfileAsync(profileId, profileDto);

                _logger.LogInformation($"Profile {profileId} updated");

                return Ok(updated);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating profile {profileId}");
                return StatusCode(500, new { message = "Failed to update profile", error = ex.Message });
            }
        }

        /// <summary>
        /// Delete profile
        /// DELETE /api/profile/{profileId}
        /// </summary>
        [HttpDelete("{profileId}")]
        public async Task<IActionResult> DeleteProfile(string profileId)
        {
            try
            {
                // Check if profile exists
                var existing = await _profileService.GetProfileByIdAsync(profileId);
                if (existing == null)
                {
                    return NotFound(new { message = "Profile not found" });
                }

                // Delete associated CV file if exists
                if (!string.IsNullOrEmpty(existing.CvFileUrl))
                {
                    await _fileStorageService.DeleteFileAsync(existing.CvFileUrl);
                }

                // Delete profile
                await _profileService.DeleteProfileAsync(profileId);

                _logger.LogInformation($"Profile {profileId} deleted");

                return Ok(new { success = true, message = "Profile deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting profile {profileId}");
                return StatusCode(500, new { message = "Failed to delete profile", error = ex.Message });
            }
        }

        /// <summary>
        /// Upload CV file only (without parsing)
        /// POST /api/profile/upload-file
        /// </summary>
        [HttpPost("upload-file")]
        [RequestSizeLimit(10_485_760)] // 10MB limit
        public async Task<IActionResult> UploadFile([FromForm] IFormFile file, [FromForm] string userId)
        {
            try
            {
                if (file == null || file.Length == 0)
                {
                    return BadRequest(new { message = "No file uploaded" });
                }

                // Upload file to storage
                var fileUrl = await _fileStorageService.UploadFileAsync(file, userId, "cvs");

                return Ok(new { fileUrl = fileUrl });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading file");
                return StatusCode(500, new { message = "Failed to upload file", error = ex.Message });
            }
        }
    }

    #region DTOs

    /// <summary>
    /// Candidate Profile Data Transfer Object
    /// </summary>
    public class CandidateProfileDto
    {
        public string? Id { get; set; }
        public string UserId { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string? Location { get; set; }
        public string? LinkedinUrl { get; set; }
        public string? PortfolioUrl { get; set; }
        public string? Summary { get; set; }
        public List<string> Skills { get; set; } = new();
        public int? ExperienceYears { get; set; }
        public List<ExperienceDto> Experience { get; set; } = new();
        public List<EducationDto> Education { get; set; } = new();
        public List<CertificationDto> Certifications { get; set; } = new();
        public List<string> Languages { get; set; } = new();
        public string? CvFileUrl { get; set; }
        public string? CvFileName { get; set; }
    }

    public class ExperienceDto
    {
        public string Id { get; set; } = string.Empty;
        public string Company { get; set; } = string.Empty;
        public string Position { get; set; } = string.Empty;
        public string? StartDate { get; set; }
        public string? EndDate { get; set; }
        public string Description { get; set; } = string.Empty;
        public List<string> Skills { get; set; } = new();
    }

    public class EducationDto
    {
        public string Id { get; set; } = string.Empty;
        public string Institution { get; set; } = string.Empty;
        public string Degree { get; set; } = string.Empty;
        public string? FieldOfStudy { get; set; }
        public string? StartDate { get; set; }
        public string? EndDate { get; set; }
        public string? Description { get; set; }
    }

    public class CertificationDto
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string? Issuer { get; set; }
        public string? IssueDate { get; set; }
        public string? ExpiryDate { get; set; }
        public string? CredentialId { get; set; }
    }

    #endregion

    #region Service Interfaces

    public interface IProfileService
    {
        Task<CandidateProfileDto> CreateProfileAsync(CandidateProfileDto profile);
        Task<CandidateProfileDto?> GetProfileByIdAsync(string profileId);
        Task<CandidateProfileDto?> GetProfileByUserIdAsync(string userId);
        Task<CandidateProfileDto> UpdateProfileAsync(string profileId, CandidateProfileDto profile);
        Task DeleteProfileAsync(string profileId);
    }

    public interface ICVParserService
    {
        Task<ParsedCVData> ParseCVAsync(IFormFile file);
    }

    public interface IFileStorageService
    {
        Task<string> UploadFileAsync(IFormFile file, string userId, string folder);
        Task DeleteFileAsync(string fileUrl);
    }

    public class ParsedCVData
    {
        public string FullName { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public List<string> Skills { get; set; } = new();
        public int? ExperienceYears { get; set; }
        public List<ExperienceDto> Experience { get; set; } = new();
        public List<EducationDto> Education { get; set; } = new();
        public List<CertificationDto> Certifications { get; set; } = new();
        public string? Summary { get; set; }
        public string RawText { get; set; } = string.Empty;
    }

    #endregion
}

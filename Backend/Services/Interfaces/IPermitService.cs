using SafetyManagementPortal.Backend.Models;
using SafetyManagementPortal.Backend.DTOs.Permit;

namespace SafetyManagementPortal.Backend.Services.Interfaces
{
    public interface IPermitService : IBaseService<Permit, PermitDto, CreatePermitDto, UpdatePermitDto>
    {
        Task<IEnumerable<PermitDto>> GetByUserIdAsync(int userId);
        Task<IEnumerable<PermitDto>> GetByStatusAsync(PermitStatus status);
        Task<IEnumerable<PermitDto>> GetExpiringPermitsAsync(int daysAhead = 30);
        Task<string> GeneratePermitNumberAsync();
        Task<PermitDto?> UpdateStatusAsync(int id, PermitStatus status, int? approvedByUserId = null, string? notes = null);
    }
}

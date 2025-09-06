using SafetyManagementPortal.Backend.Models;
using SafetyManagementPortal.Backend.DTOs.Permit;

namespace SafetyManagementPortal.Backend.Services.Interfaces
{
    public interface IPermitTypeService : IBaseService<PermitType, PermitTypeDto, CreatePermitTypeDto, UpdatePermitTypeDto>
    {
        Task<IEnumerable<PermitTypeDto>> GetByCategoryAsync(string category);
        Task<IEnumerable<PermitTypeDto>> GetByRiskLevelAsync(int riskLevel);
        Task<IEnumerable<PermitTypeDto>> GetActiveTypesAsync();
        Task<PermitTypeDto?> GetByCodeAsync(string code);
        Task<bool> CodeExistsAsync(string code, int? excludeId = null);
        Task<IEnumerable<PermitTypeDto>> GetTypesRequiringSpecialApprovalAsync();
        Task<IEnumerable<PermitTypeDto>> GetTypesRequiringFireWatchAsync();
        Task<PermitTypeDto?> GetMostUsedTypeAsync();
        Task<Dictionary<string, int>> GetPermitCountByTypeAsync();
    }
}

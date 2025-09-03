using Backend.DTOs.Common;
using Backend.DTOs.Audit;
using Backend.Models;

namespace Backend.Services.Interfaces
{
    public interface IAuditService : IBaseService<Audit, AuditDto, CreateAuditDto, UpdateAuditDto>
    {
        Task<ApiResponse<AuditDto>> StartAuditAsync(int auditId);
        Task<ApiResponse<AuditDto>> CompleteAuditAsync(int auditId, int? score = null, string? remarks = null);
        Task<ApiResponse<IEnumerable<AuditDto>>> GetAuditsByStatusAsync(AuditStatus status);
        Task<ApiResponse<IEnumerable<AuditDto>>> GetAuditsByAuditorAsync(int auditorId);
        Task<ApiResponse<IEnumerable<AuditDto>>> GetAuditsByPlantAsync(int plantId);
        Task<ApiResponse<IEnumerable<AuditDto>>> GetAuditsByDepartmentAsync(int departmentId);
        Task<ApiResponse<IEnumerable<AuditDto>>> GetOverdueAuditsAsync();
        Task<ApiResponse<AuditStatisticsDto>> GetAuditStatisticsAsync();
    }
}
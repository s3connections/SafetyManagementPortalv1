using Backend.Models;
using Backend.Dtos.Audit;

namespace Backend.Services.Interfaces
{
    public interface IAuditService : IBaseService<Audit, AuditDto, CreateAuditDto, UpdateAuditDto>
    {
        Task<IEnumerable<AuditDto>> GetByAuditorIdAsync(int auditorId);
        Task<IEnumerable<AuditDto>> GetByStatusAsync(AuditStatus status);
        Task<IEnumerable<AuditDto>> GetByDateRangeAsync(DateTime startDate, DateTime endDate);
        Task<AuditDto?> UpdateStatusAsync(int id, AuditStatus status);
        Task<decimal?> CalculateScoreAsync(int auditId);
    }
}
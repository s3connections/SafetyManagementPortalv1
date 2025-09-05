using Backend.Models;
using Backend.DTOs.Common;
using Backend.DTOs.Audit;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Services.Interfaces
{
    public interface IAuditService : IBaseService<Audit, AuditDto, CreateAuditDto, UpdateAuditDto>
    {
        Task<string> GenerateAuditNumberAsync();
        Task<List<AuditDto>> GetScheduledAuditsAsync();
        Task<List<AuditDto>> GetAuditsByTypeAsync(int auditTypeId);
        Task<AuditQuestionResponseDto> AddQuestionResponseAsync(int auditId, CreateAuditQuestionResponseDto responseDto);
    }
}
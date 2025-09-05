using Backend.Models;
using Backend.DTOs.Common;
using Backend.DTOs.Permit;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Services.Interfaces
{
    public interface IPermitService : IBaseService<Permit, PermitDto, CreatePermitDto, UpdatePermitDto>
    {
        Task<string> GeneratePermitNumberAsync();
        Task<List<PermitDto>> GetActivePermitsAsync();
        Task<List<PermitDto>> GetExpiringPermitsAsync(int daysAhead = 7);
        Task<PermitDto> ApprovePermitAsync(int permitId, string comments);
        Task<PermitDto> RejectPermitAsync(int permitId, string comments);
        Task<PermitQuestionResponseDto> AddQuestionResponseAsync(int permitId, CreatePermitQuestionResponseDto responseDto);
    }
}
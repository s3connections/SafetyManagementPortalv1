using Backend.DTOs.Permit;
using Backend.Models;

namespace Backend.Services.Interfaces
{
    public interface IPermitService : IBaseService<Permit, PermitDto, CreatePermitDto, UpdatePermitDto>
    {
        Task<ApiResponse<PermitDto>> SubmitPermitAsync(int permitId);
        Task<ApiResponse<PermitDto>> ApprovePermitAsync(int permitId, int approverId, string? comments = null);
        Task<ApiResponse<PermitDto>> RejectPermitAsync(int permitId, int approverId, string reason);
        Task<ApiResponse<IEnumerable<PermitDto>>> GetPermitsByStatusAsync(PermitStatus status);
        Task<ApiResponse<IEnumerable<PermitDto>>> GetPermitsByRequestorAsync(int requestorId);
        Task<ApiResponse<IEnumerable<PermitDto>>> GetPermitsByApproverAsync(int approverId);
        Task<ApiResponse<IEnumerable<PermitDto>>> GetPermitsByPlantAsync(int plantId);
        Task<ApiResponse<IEnumerable<PermitDto>>> GetPermitsByDepartmentAsync(int departmentId);
        Task<ApiResponse<IEnumerable<PermitDto>>> GetExpiringPermitsAsync(int days = 7);
        Task<ApiResponse<object>> GetPermitStatisticsAsync();
        Task<ApiResponse<string>> GeneratePermitNumberAsync();
    }
}
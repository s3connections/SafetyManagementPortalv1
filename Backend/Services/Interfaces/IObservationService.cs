using Backend.DTOs.Incident;
using Backend.Models;

namespace Backend.Services.Interfaces
{
    public interface IObservationService : IBaseService<IncidentObservation, IncidentObservationDto, CreateIncidentObservationDto, UpdateIncidentObservationDto>
    {
        Task<ApiResponse<IEnumerable<IncidentObservationDto>>> GetObservationsByStatusAsync(string status);
        Task<ApiResponse<IEnumerable<IncidentObservationDto>>> GetObservationsByReporterAsync(int reporterId);
        Task<ApiResponse<IEnumerable<IncidentObservationDto>>> GetObservationsByAssigneeAsync(int assigneeId);
        Task<ApiResponse<IEnumerable<IncidentObservationDto>>> GetObservationsByPlantAsync(int plantId);
        Task<ApiResponse<IEnumerable<IncidentObservationDto>>> GetObservationsByDepartmentAsync(int departmentId);
        Task<ApiResponse<IEnumerable<IncidentObservationDto>>> GetOverdueObservationsAsync();
        Task<ApiResponse<IncidentObservationDto>> AssignObservationAsync(int observationId, int assigneeId);
        Task<ApiResponse<IncidentObservationDto>> UpdateStatusAsync(int observationId, string status);
        Task<ApiResponse<object>> GetObservationStatisticsAsync();
    }
}
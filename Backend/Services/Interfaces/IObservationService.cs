using Backend.DTOs.Common;
using Backend.DTOs.Observation;
using Backend.Models;

namespace Backend.Services.Interfaces
{
    public interface IObservationService : IBaseService<Observation, ObservationDto, CreateObservationDto, UpdateObservationDto>
    {
        // Remove duplicate method definitions
        Task<ApiResponse<IEnumerable<ObservationDto>>> GetObservationsByStatusAsync(string status);
        Task<ApiResponse<IEnumerable<ObservationDto>>> GetObservationsByReporterAsync(int reporterId);
        Task<ApiResponse<IEnumerable<ObservationDto>>> GetObservationsByAssigneeAsync(int assigneeId);
        Task<ApiResponse<IEnumerable<ObservationDto>>> GetObservationsByPlantAsync(int plantId);
        Task<ApiResponse<IEnumerable<ObservationDto>>> GetObservationsByDepartmentAsync(int departmentId);
        Task<ApiResponse<IEnumerable<ObservationDto>>> GetOverdueObservationsAsync();
        Task<ApiResponse<ObservationDto>> AssignObservationAsync(int observationId, int assigneeId);
        Task<ApiResponse<ObservationDto>> UpdateStatusAsync(int observationId, string status);
        Task<ApiResponse<ObservationStatisticsDto>> GetObservationStatisticsAsync();
    }
}
using Backend.Models;
using Backend.DTOs;

namespace Backend.Services.Interfaces
{
    public interface IObservationService
    {
        Task<ApiResponse<IEnumerable<ObservationDto>>> GetAllObservationsAsync();
        Task<ApiResponse<ObservationDto>> GetObservationByIdAsync(int id);
        Task<ApiResponse<ObservationDto>> CreateObservationAsync(CreateObservationDto createObservationDto);
        Task<ApiResponse<ObservationDto>> UpdateObservationAsync(int id, UpdateObservationDto updateObservationDto);
        Task<ApiResponse<bool>> DeleteObservationAsync(int id);
        Task<ApiResponse<IEnumerable<ObservationDto>>> GetObservationsByStatusAsync(ObservationStatus status);
        Task<ApiResponse<IEnumerable<ObservationDto>>> GetObservationsByPriorityAsync(Priority priority);
        Task<ApiResponse<IEnumerable<ObservationDto>>> GetObservationsByTypeAsync(ObservationType type);
        Task<ApiResponse<IEnumerable<ObservationDto>>> GetObservationsByPlantAsync(int plantId);
        Task<ApiResponse<IEnumerable<ObservationDto>>> GetObservationsByDepartmentAsync(int departmentId);
        Task<ApiResponse<IEnumerable<ObservationDto>>> GetObservationsByUserAsync(int userId);
        Task<ApiResponse<IEnumerable<ObservationDto>>> GetObservationsByDateRangeAsync(DateTime startDate, DateTime endDate);
        Task<ApiResponse<ObservationStatisticsDto>> GetObservationStatisticsAsync();
        Task<ApiResponse<IEnumerable<ObservationDto>>> SearchObservationsAsync(string searchTerm);
    }
}
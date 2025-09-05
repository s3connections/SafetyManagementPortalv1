using Backend.Models;
using Backend.Dtos.Observation;

namespace Backend.Services.Interfaces
{
    public interface IObservationService : IBaseService<Observation, ObservationDto, CreateObservationDto, UpdateObservationDto>
    {
        Task<IEnumerable<ObservationDto>> GetByUserIdAsync(int userId);
        Task<IEnumerable<ObservationDto>> GetByStatusAsync(ObservationStatus status);
        Task<IEnumerable<ObservationDto>> GetByTypeAsync(ObservationType type);
        Task<string> GenerateTicketNumberAsync();
        Task<ObservationDto?> UpdateStatusAsync(int id, ObservationStatus status, string? notes = null);
    }
}
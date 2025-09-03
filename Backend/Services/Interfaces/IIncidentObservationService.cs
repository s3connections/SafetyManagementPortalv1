using Backend.Models;
using Backend.DTOs.Common;
using Backend.DTOs.Incident;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Services.Interfaces
{
    public interface IIncidentObservationService : IBaseService<IncidentObservation, IncidentObservationDto, CreateIncidentObservationDto, UpdateIncidentObservationDto>
    {
        Task<string> GenerateIncidentNumberAsync();
        Task<List<IncidentObservationDto>> GetByStatusAsync(int statusId);
        Task<List<IncidentObservationDto>> GetByPlantAsync(int plantId);
        Task<List<IncidentObservationDto>> GetOverdueIncidentsAsync();
    }

    
}
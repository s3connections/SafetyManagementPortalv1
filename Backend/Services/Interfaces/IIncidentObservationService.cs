using SafetyManagementPortal.Backend.Models;
using SafetyManagementPortal.Backend.DTOs.Incident;
using SafetyManagementPortal.Backend.enums;

namespace SafetyManagementPortal.Backend.Services.Interfaces
{
    public interface IIncidentObservationService : IBaseService<IncidentObservation, IncidentObservationDto, CreateIncidentObservationDto, UpdateIncidentObservationDto>
    {
        Task<IEnumerable<IncidentObservationDto>> GetByUserIdAsync(int userId);
        Task<IEnumerable<IncidentObservationDto>> GetBySeverityAsync(IncidentSeverity severity);
        Task<IEnumerable<IncidentObservationDto>> GetByTypeAsync(IncidentType type);
        Task<IEnumerable<IncidentObservationDto>> GetByDateRangeAsync(DateTime startDate, DateTime endDate);
        Task<string> GenerateIncidentNumberAsync();
        Task<IncidentObservationDto?> UpdateInvestigationStatusAsync(int id, int investigatedByUserId, string? findings = null);
        Task<IEnumerable<IncidentObservationDto>> GetPendingInvestigationsAsync();
        Task<IEnumerable<IncidentObservationDto>> GetRequiringReportingAsync();
    }
}

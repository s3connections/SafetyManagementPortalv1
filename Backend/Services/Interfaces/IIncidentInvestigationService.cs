using SafetyManagementPortal.Backend.Models;
using SafetyManagementPortal.Backend.DTOs.Common;
using SafetyManagementPortal.Backend.DTOs.Incident;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SafetyManagementPortal.Backend.Services.Interfaces
{
    public interface IIncidentInvestigationService : IBaseService<IncidentInvestigation, IncidentInvestigationDto, CreateIncidentInvestigationDto, UpdateIncidentInvestigationDto>
    {
        Task<List<IncidentInvestigationDto>> GetByInvestigatorAsync(int investigatorId);
        Task<List<IncidentInvestigationDto>> GetPendingInvestigationsAsync();
        Task<IEnumerable<IncidentInvestigationDto>> GetAllAsync(int userId);
        Task<IncidentInvestigationDto> CreateAsync(CreateIncidentInvestigationDto dto);
        Task<IncidentInvestigationDto> UpdateAsync(int id, UpdateIncidentInvestigationDto dto);
        Task<InvestigationWitnessDto> AddWitnessAsync(CreateInvestigationWitnessDto createDto);
        Task<InvestigationTimelineDto> AddTimelineEntryAsync(int investigationId, string activity, string description);
    }
}

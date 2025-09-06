using Backend.Models;
using Backend.DTOs.Common;
using Backend.DTOs.Incident;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SafetyManagementPortal.Backend.Services.Interfaces
{
    public interface IIncidentInvestigationService : IBaseService<IncidentInvestigation, IncidentInvestigationDto, CreateIncidentInvestigationDto, UpdateIncidentInvestigationDto>
    {
        Task<List<IncidentInvestigationDto>> GetByInvestigatorAsync(int investigatorId);
        Task<List<IncidentInvestigationDto>> GetPendingInvestigationsAsync();
        Task<InvestigationWitnessDto> AddWitnessAsync(CreateInvestigationWitnessDto createDto);
        Task<InvestigationTimelineDto> AddTimelineEntryAsync(int investigationId, string activity, string description);
    }
}

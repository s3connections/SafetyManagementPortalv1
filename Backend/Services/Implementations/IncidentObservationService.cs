using Microsoft.EntityFrameworkCore;
using AutoMapper;
using SafetyManagementPortal.Backend.Data;
using SafetyManagementPortal.Backend.Models;
using SafetyManagementPortal.Backend.Services.Interfaces;
using SafetyManagementPortal.Backend.DTOs.Incident;
using SafetyManagementPortal.Backend.enums;

namespace SafetyManagementPortal.Backend.Services.Implementations
{
    public class IncidentObservationService : BaseService<IncidentObservation, IncidentObservationDto, CreateIncidentObservationDto, UpdateIncidentObservationDto>, IIncidentObservationService
    {
        public IncidentObservationService(SafetyDbContext context, IMapper mapper) 
            : base(context, mapper)
        {
        }

        public override async Task<IEnumerable<IncidentObservationDto>> GetAllAsync()
        {
            var incidents = await _dbSet
                .Include(i => i.ReportedByUser)
                .Include(i => i.InvestigatedByUser)
                .Include(i => i.Plant)
                .Include(i => i.Department)
                .Where(i => i.IsActive)
                .OrderByDescending(i => i.IncidentDate)
                .ToListAsync();

            return _mapper.Map<IEnumerable<IncidentObservationDto>>(incidents);
        }

        public override async Task<IncidentObservationDto?> GetByIdAsync(int id)
        {
            var incident = await _dbSet
                .Include(i => i.ReportedByUser)
                .Include(i => i.InvestigatedByUser)
                .Include(i => i.Plant)
                .Include(i => i.Department)
                .FirstOrDefaultAsync(i => i.Id == id && i.IsActive);

            return incident == null ? null : _mapper.Map<IncidentObservationDto>(incident);
        }

        public async Task<IEnumerable<IncidentObservationDto>> GetByUserIdAsync(int userId)
        {
            var incidents = await _dbSet
                .Include(i => i.ReportedByUser)
                .Include(i => i.InvestigatedByUser)
                .Include(i => i.Plant)
                .Include(i => i.Department)
                .Where(i => i.IsActive && (i.ReportedByUserId == userId || i.InvestigatedByUserId == userId))
                .OrderByDescending(i => i.IncidentDate)
                .ToListAsync();

            return _mapper.Map<IEnumerable<IncidentObservationDto>>(incidents);
        }

        public async Task<IEnumerable<IncidentObservationDto>> GetBySeverityAsync(IncidentSeverity severity)
        {
            var incidents = await _dbSet
                .Include(i => i.ReportedByUser)
                .Include(i => i.InvestigatedByUser)
                .Include(i => i.Plant)
                .Include(i => i.Department)
                .Where(i => i.IsActive && i.Severity == severity)
                .OrderByDescending(i => i.IncidentDate)
                .ToListAsync();

            return _mapper.Map<IEnumerable<IncidentObservationDto>>(incidents);
        }

        public async Task<IEnumerable<IncidentObservationDto>> GetByTypeAsync(IncidentType type)
        {
            var incidents = await _dbSet
                .Include(i => i.ReportedByUser)
                .Include(i => i.InvestigatedByUser)
                .Include(i => i.Plant)
                .Include(i => i.Department)
                .Where(i => i.IsActive && i.IncidentType == type)
                .OrderByDescending(i => i.IncidentDate)
                .ToListAsync();

            return _mapper.Map<IEnumerable<IncidentObservationDto>>(incidents);
        }

        public async Task<IEnumerable<IncidentObservationDto>> GetByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            var incidents = await _dbSet
                .Include(i => i.ReportedByUser)
                .Include(i => i.InvestigatedByUser)
                .Include(i => i.Plant)
                .Include(i => i.Department)
                .Where(i => i.IsActive && i.IncidentDate >= startDate && i.IncidentDate <= endDate)
                .OrderByDescending(i => i.IncidentDate)
                .ToListAsync();

            return _mapper.Map<IEnumerable<IncidentObservationDto>>(incidents);
        }

        public async Task<string> GenerateIncidentNumberAsync()
        {
            var today = DateTime.Today;
            var prefix = $"INC-{today:yyyyMMdd}";
            
            var lastIncident = await _dbSet
                .Where(i => i.IncidentNumber.StartsWith(prefix))
                .OrderByDescending(i => i.IncidentNumber)
                .FirstOrDefaultAsync();

            var sequence = 1;
            if (lastIncident != null && lastIncident.IncidentNumber.Length > prefix.Length)
            {
                var lastSequence = lastIncident.IncidentNumber.Substring(prefix.Length + 1);
                if (int.TryParse(lastSequence, out var lastSeq))
                {
                    sequence = lastSeq + 1;
                }
            }

            return $"{prefix}-{sequence:D4}";
        }

        public override async Task<IncidentObservationDto> CreateAsync(CreateIncidentObservationDto createDto)
        {
            var entity = _mapper.Map<IncidentObservation>(createDto);
            entity.IncidentNumber = await GenerateIncidentNumberAsync();
            entity.CreatedAt = DateTime.UtcNow;
            entity.UpdatedAt = DateTime.UtcNow;

            _dbSet.Add(entity);
            await _context.SaveChangesAsync();

            return await GetByIdAsync(entity.Id) ?? _mapper.Map<IncidentObservationDto>(entity);
        }

        public async Task<IncidentObservationDto?> UpdateInvestigationStatusAsync(int id, int investigatedByUserId, string? findings = null)
        {
            var incident = await _dbSet.FirstOrDefaultAsync(i => i.Id == id && i.IsActive);
            if (incident == null) return null;

            incident.InvestigatedByUserId = investigatedByUserId;
            incident.InvestigationCompletedDate = DateTime.UtcNow;
            incident.UpdatedAt = DateTime.UtcNow;

            if (!string.IsNullOrEmpty(findings))
            {
                incident.RootCauseAnalysis = findings;
            }

            await _context.SaveChangesAsync();
            return await GetByIdAsync(id);
        }

        public async Task<IEnumerable<IncidentObservationDto>> GetPendingInvestigationsAsync()
        {
            var incidents = await _dbSet
                .Include(i => i.ReportedByUser)
                .Include(i => i.InvestigatedByUser)
                .Include(i => i.Plant)
                .Include(i => i.Department)
                .Where(i => i.IsActive && i.InvestigationCompletedDate == null)
                .OrderBy(i => i.IncidentDate)
                .ToListAsync();

            return _mapper.Map<IEnumerable<IncidentObservationDto>>(incidents);
        }

        public async Task<IEnumerable<IncidentObservationDto>> GetRequiringReportingAsync()
        {
            var incidents = await _dbSet
                .Include(i => i.ReportedByUser)
                .Include(i => i.InvestigatedByUser)
                .Include(i => i.Plant)
                .Include(i => i.Department)
                .Where(i => i.IsActive && i.RequiresReporting && !i.IsReportedToAuthorities)
                .OrderBy(i => i.IncidentDate)
                .ToListAsync();

            return _mapper.Map<IEnumerable<IncidentObservationDto>>(incidents);
        }
    }
}

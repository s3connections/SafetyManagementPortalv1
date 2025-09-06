using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SafetyManagementPortal.Backend.Data;
using SafetyManagementPortal.Backend.DTOs.Incident;
using SafetyManagementPortal.Backend.Models;
using SafetyManagementPortal.Backend.Services.Interfaces;

namespace SafetyManagementPortal.Backend.Services.Implementations
{
    public class IncidentInvestigationService
        : BaseService<IncidentInvestigation, IncidentInvestigationDto, CreateIncidentInvestigationDto, UpdateIncidentInvestigationDto>,
          IIncidentInvestigationService
    {
        private readonly SafetyManagementContext _db;
        private readonly IMapper _mapper;

        public IncidentInvestigationService(SafetyManagementContext ctx, IMapper mapper)
            : base(ctx, mapper)
        {
            _db = ctx;
            _mapper = mapper;
        }

        // 1. Get all investigations for a specific investigator
        public async Task<IEnumerable<IncidentInvestigationDto>> GetAllAsync(int userId)
        {
            var entities = await _db.IncidentInvestigations
                .Where(i => i.LeadInvestigatorId == userId && !i.IsDeleted)
                .ToListAsync();
            return _mapper.Map<IEnumerable<IncidentInvestigationDto>>(entities);
        }

        // 2. Get single by ID
        public override async Task<IncidentInvestigationDto> GetByIdAsync(int id)
        {
            var ent = await _db.IncidentInvestigations
                .FirstOrDefaultAsync(i => i.Id == id && !i.IsDeleted);
            return ent == null ? null : _mapper.Map<IncidentInvestigationDto>(ent);
        }

        // 3. Create new investigation
        public override async Task<IncidentInvestigationDto> CreateAsync(CreateIncidentInvestigationDto dto)
        {
            var ent = new IncidentInvestigation
            {
                IncidentObservationId = dto.IncidentObservationId,
                LeadInvestigatorId = dto.LeadInvestigatorId,
                TargetCompletionDate = dto.TargetCompletionDate,
                InitialFindings = dto.InitialFindings,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = dto.CreatedBy
            };
            _db.IncidentInvestigations.Add(ent);
            await _db.SaveChangesAsync();
            return _mapper.Map<IncidentInvestigationDto>(ent);
        }

        // 4. Update existing investigation
        public override async Task<IncidentInvestigationDto> UpdateAsync(int id, UpdateIncidentInvestigationDto dto)
        {
            var ent = await _db.IncidentInvestigations
                .FirstOrDefaultAsync(i => i.Id == id && !i.IsDeleted);
            if (ent == null) return null;

            if (dto.CompletedDate.HasValue)
            {
                ent.CompletedDate = dto.CompletedDate;
                ent.InvestigationStatus = "Completed";
            }

            ent.UpdatedAt = DateTime.UtcNow;
            ent.UpdatedBy = dto.UpdatedBy;

            await _db.SaveChangesAsync();
            return _mapper.Map<IncidentInvestigationDto>(ent);
        }

        // 5. Get by investigator ID (alias for GetAllAsync)
        public Task<List<IncidentInvestigationDto>> GetByInvestigatorAsync(int investigatorId) =>
            _db.IncidentInvestigations
               .Where(i => i.LeadInvestigatorId == investigatorId && !i.IsDeleted)
               .ProjectTo<IncidentInvestigationDto>(_mapper.ConfigurationProvider)
               .ToListAsync();

        // 6. Get pending investigations
        public Task<List<IncidentInvestigationDto>> GetPendingInvestigationsAsync() =>
            _db.IncidentInvestigations
               .Where(i => i.InvestigationStatus == "In Progress" && !i.IsDeleted)
               .ProjectTo<IncidentInvestigationDto>(_mapper.ConfigurationProvider)
               .ToListAsync();

        // 7. Add a witness
        public async Task<InvestigationWitnessDto> AddWitnessAsync(CreateInvestigationWitnessDto dto)
        {
            var w = new InvestigationWitness
            {
                IncidentObservationId = dto.IncidentObservationId,
                EmployeeId = dto.EmployeeId,
                Statement = dto.Statement,
                InterviewDate = dto.InterviewDate,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = dto.CreatedBy
            };
            _db.InvestigationWitnesses.Add(w);
            await _db.SaveChangesAsync();
            return _mapper.Map<InvestigationWitnessDto>(w);
        }

        // 8. Add a timeline entry
        public async Task<InvestigationTimelineDto> AddTimelineEntryAsync(int investigationId, string activity, string description)
        {
            var t = new InvestigationTimeline
            {
                InvestigationId = investigationId,
                Activity = activity,
                Description = description,
                ActivityDate = DateTime.UtcNow,
                PerformedById = 1,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = 1
            };
            _db.InvestigationTimelines.Add(t);
            await _db.SaveChangesAsync();
            return _mapper.Map<InvestigationTimelineDto>(t);
        }
    }
}

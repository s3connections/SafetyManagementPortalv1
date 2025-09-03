using Backend.Data;
using Backend.DTOs.Common;
using Backend.DTOs.Incident;
using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Services.Implementations
{
    public class IncidentInvestigationService : BaseService<IncidentInvestigation, IncidentInvestigationDto, CreateIncidentInvestigationDto, UpdateIncidentInvestigationDto>, IIncidentInvestigationService
    {
        public IncidentInvestigationService(SafetyManagementContext ctx) : base(ctx) { }

        private SafetyManagementContext Ctx => (SafetyManagementContext)_context;

        public override async Task<PagedResult<IncidentInvestigationDto>> GetAllAsync(SearchFilter filter)
        {
            var q = Ctx.IncidentInvestigations.Include(i => i.IncidentObservation).Include(i => i.LeadInvestigator).Where(i => !i.IsDeleted);
            var total = await q.CountAsync();
            var data = await q.Skip((filter.PageNumber - 1) * filter.PageSize).Take(filter.PageSize)
                .Select(i => new IncidentInvestigationDto { Id = i.Id, IncidentObservationId = i.IncidentObservationId, InvestigationStatus = i.InvestigationStatus, TargetCompletionDate = i.TargetCompletionDate }).ToListAsync();
            return new PagedResult<IncidentInvestigationDto> { Items = data, TotalItems = total, PageNumber = filter.PageNumber, PageSize = filter.PageSize, TotalPages = (int)Math.Ceiling((double)total / filter.PageSize) };
        }

        public override async Task<IncidentInvestigationDto> GetByIdAsync(int id)
        {
            var i = await Ctx.IncidentInvestigations.FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted);
            if (i == null) return null;
            return new IncidentInvestigationDto { Id = i.Id, InvestigationStatus = i.InvestigationStatus, TargetCompletionDate = i.TargetCompletionDate };
        }

        public override async Task<IncidentInvestigationDto> CreateAsync(CreateIncidentInvestigationDto dto)
        {
            var ent = new IncidentInvestigation { IncidentObservationId = dto.IncidentObservationId, LeadInvestigatorId = dto.LeadInvestigatorId, TargetCompletionDate = dto.TargetCompletionDate, InitialFindings = dto.InitialFindings, CreatedAt = DateTime.UtcNow, CreatedBy = 1 };
            Ctx.IncidentInvestigations.Add(ent);
            await Ctx.SaveChangesAsync();
            return new IncidentInvestigationDto { Id = ent.Id, InvestigationStatus = ent.InvestigationStatus };
        }

        public override async Task<IncidentInvestigationDto> UpdateAsync(int id, UpdateIncidentInvestigationDto dto)
        {
            var ent = await Ctx.IncidentInvestigations.FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted);
            if (ent == null) return null;
            if (dto.CompletedDate.HasValue) { ent.CompletedDate = dto.CompletedDate; ent.InvestigationStatus = "Completed"; }
            ent.UpdatedAt = DateTime.UtcNow; ent.UpdatedBy = 1; await Ctx.SaveChangesAsync();
            return new IncidentInvestigationDto { Id = ent.Id, InvestigationStatus = ent.InvestigationStatus };
        }

        public async Task<List<IncidentInvestigationDto>> GetByInvestigatorAsync(int investigatorId) => await Ctx.IncidentInvestigations.Where(i => i.LeadInvestigatorId == investigatorId && !i.IsDeleted).Select(i => new IncidentInvestigationDto { Id = i.Id, InvestigationStatus = i.InvestigationStatus }).ToListAsync();

        public async Task<List<IncidentInvestigationDto>> GetPendingInvestigationsAsync() => await Ctx.IncidentInvestigations.Where(i => i.InvestigationStatus == "In Progress" && !i.IsDeleted).Select(i => new IncidentInvestigationDto { Id = i.Id, InvestigationStatus = i.InvestigationStatus }).ToListAsync();

        public async Task<InvestigationWitnessDto> AddWitnessAsync(CreateInvestigationWitnessDto dto)
        {
            var w = new InvestigationWitness { IncidentObservationId = dto.IncidentObservationId, EmployeeId = dto.EmployeeId, Statement = dto.Statement, InterviewDate = dto.InterviewDate, CreatedAt = DateTime.UtcNow, CreatedBy = 1 };
            Ctx.InvestigationWitnesses.Add(w); await Ctx.SaveChangesAsync();
            return new InvestigationWitnessDto { Id = w.Id, Statement = w.Statement };
        }

        public async Task<InvestigationTimelineDto> AddTimelineEntryAsync(int id, string act, string desc)
        {
            var t = new InvestigationTimeline { InvestigationId = id, Activity = act, Description = desc, ActivityDate = DateTime.UtcNow, PerformedById = 1, CreatedAt = DateTime.UtcNow, CreatedBy = 1 };
            Ctx.InvestigationTimelines.Add(t); await Ctx.SaveChangesAsync();
            return new InvestigationTimelineDto { Id = t.Id, Activity = act, Description = desc };
        }
    }
}
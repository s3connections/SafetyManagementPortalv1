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
    public class IncidentObservationService : BaseService<IncidentObservation, IncidentObservationDto, CreateIncidentObservationDto, UpdateIncidentObservationDto>, IIncidentObservationService
    {
        public IncidentObservationService(SafetyManagementContext context) : base(context) { }

        public override async Task<PagedResult<IncidentObservationDto>> GetAllAsync(SearchFilter filter)
        {
            var context = (SafetyManagementContext)_context;
            var query = context.IncidentObservations
                .Include(i => i.IncidentType)
                .Include(i => i.Priority)
                .Include(i => i.Plant)
                .Include(i => i.Location)
                .Where(i => !i.IsDeleted);

            if (!string.IsNullOrEmpty(filter.SearchTerm))
                query = query.Where(i => i.Title.Contains(filter.SearchTerm) || i.IncidentNumber.Contains(filter.SearchTerm));

            var total = await query.CountAsync();
            var data = await query.Skip((filter.PageNumber - 1) * filter.PageSize)
                                  .Take(filter.PageSize)
                                  .Select(i => new IncidentObservationDto
            {
                Id = i.Id,
                Title = i.Title,
                IncidentNumber = i.IncidentNumber,
                Description = i.Description,
                DateTimeObserved = i.DateTimeObserved,
                CreatedAt = i.CreatedAt
            }).ToListAsync();

            return new PagedResult<IncidentObservationDto>
            {
                Items = data,
                TotalItems = total,
                PageNumber = filter.PageNumber,
                PageSize = filter.PageSize,
                TotalPages = (int)Math.Ceiling((double)total / filter.PageSize)
            };
        }

        public override async Task<IncidentObservationDto> GetByIdAsync(int id)
        {
            var context = (SafetyManagementContext)_context;
            var i = await context.IncidentObservations.FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted);
            if (i == null) return null;
            return new IncidentObservationDto { Id = i.Id, Title = i.Title, IncidentNumber = i.IncidentNumber, Description = i.Description };
        }

        public override async Task<IncidentObservationDto> CreateAsync(CreateIncidentObservationDto dto)
        {
            var context = (SafetyManagementContext)_context;
            var number = await GenerateIncidentNumberAsync();
            var entity = new IncidentObservation
            {
                Title = dto.Title,
                IncidentNumber = number,
                Description = dto.Description,
                IncidentTypeId = dto.IncidentTypeId,
                PriorityId = dto.PriorityId,
                PlantId = dto.PlantId,
                LocationId = dto.LocationId,
                DateTimeObserved = dto.DateTimeObserved,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = 1
            };
            context.IncidentObservations.Add(entity);
            await context.SaveChangesAsync();
            return new IncidentObservationDto { Id = entity.Id, IncidentNumber = entity.IncidentNumber, Title = entity.Title };
        }

        public override async Task<IncidentObservationDto> UpdateAsync(int id, UpdateIncidentObservationDto dto)
        {
            var context = (SafetyManagementContext)_context;
            var entity = await context.IncidentObservations.FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted);
            if (entity == null) return null;
            if (!string.IsNullOrEmpty(dto.Title)) entity.Title = dto.Title;
            if (!string.IsNullOrEmpty(dto.Description)) entity.Description = dto.Description;
            entity.UpdatedAt = DateTime.UtcNow;
            entity.UpdatedBy = 1;
            await context.SaveChangesAsync();
            return new IncidentObservationDto { Id = entity.Id, Title = entity.Title, IncidentNumber = entity.IncidentNumber };
        }

        public async Task<string> GenerateIncidentNumberAsync()
        {
            var context = (SafetyManagementContext)_context;
            var year = DateTime.Now.Year;
            var count = await context.IncidentObservations.CountAsync(i => i.CreatedAt.Year == year);
            return $"INC-{year}-{(count + 1):D6}";
        }

        public async Task<List<IncidentObservationDto>> GetByPlantAsync(int plantId)
        {
            var context = (SafetyManagementContext)_context;
            return await context.IncidentObservations.Where(i => i.PlantId == plantId && !i.IsDeleted)
                .Select(i => new IncidentObservationDto { Id = i.Id, Title = i.Title, IncidentNumber = i.IncidentNumber }).ToListAsync();
        }

        public async Task<List<IncidentObservationDto>> GetByStatusAsync(int statusId)
        {
            var context = (SafetyManagementContext)_context;
            return await context.IncidentObservations.Where(i => i.StatusId == statusId && !i.IsDeleted)
                .Select(i => new IncidentObservationDto { Id = i.Id, Title = i.Title, IncidentNumber = i.IncidentNumber }).ToListAsync();
        }

        public async Task<List<IncidentObservationDto>> GetOverdueIncidentsAsync()
        {
            var context = (SafetyManagementContext)_context;
            var cutoff = DateTime.UtcNow.AddDays(-7);
            return await context.IncidentObservations.Where(i => i.CreatedAt <= cutoff && !i.IsDeleted)
                .Select(i => new IncidentObservationDto { Id = i.Id, Title = i.Title, IncidentNumber = i.IncidentNumber }).ToListAsync();
        }
    }
}
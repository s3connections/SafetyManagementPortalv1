using Microsoft.EntityFrameworkCore;
using AutoMapper;
using Backend.Data;
using Backend.Models;
using Backend.Services.Interfaces;
using Backend.Dtos.Observation;

namespace SafetyManagementPortal.Backend.Services.Implementations
{
    public class ObservationService : BaseService<Observation, ObservationDto, CreateObservationDto, UpdateObservationDto>, IObservationService
    {
        public ObservationService(SafetyDbContext context, IMapper mapper) 
            : base(context, mapper)
        {
        }

        public override async Task<IEnumerable<ObservationDto>> GetAllAsync()
        {
            var observations = await _dbSet
                .Include(o => o.ReportedByUser)
                .Include(o => o.AssignedToUser)
                .Include(o => o.Plant)
                .Include(o => o.Department)
                .Where(o => o.IsActive)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();

            return _mapper.Map<IEnumerable<ObservationDto>>(observations);
        }

        public override async Task<ObservationDto?> GetByIdAsync(int id)
        {
            var observation = await _dbSet
                .Include(o => o.ReportedByUser)
                .Include(o => o.AssignedToUser)
                .Include(o => o.Plant)
                .Include(o => o.Department)
                .FirstOrDefaultAsync(o => o.Id == id && o.IsActive);

            return observation == null ? null : _mapper.Map<ObservationDto>(observation);
        }

        public async Task<IEnumerable<ObservationDto>> GetByUserIdAsync(int userId)
        {
            var observations = await _dbSet
                .Include(o => o.ReportedByUser)
                .Include(o => o.AssignedToUser)
                .Include(o => o.Plant)
                .Include(o => o.Department)
                .Where(o => o.IsActive && (o.ReportedByUserId == userId || o.AssignedToUserId == userId))
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();

            return _mapper.Map<IEnumerable<ObservationDto>>(observations);
        }

        public async Task<IEnumerable<ObservationDto>> GetByStatusAsync(ObservationStatus status)
        {
            var observations = await _dbSet
                .Include(o => o.ReportedByUser)
                .Include(o => o.AssignedToUser)
                .Include(o => o.Plant)
                .Include(o => o.Department)
                .Where(o => o.IsActive && o.Status == status)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();

            return _mapper.Map<IEnumerable<ObservationDto>>(observations);
        }

        public async Task<IEnumerable<ObservationDto>> GetByTypeAsync(ObservationType type)
        {
            var observations = await _dbSet
                .Include(o => o.ReportedByUser)
                .Include(o => o.AssignedToUser)
                .Include(o => o.Plant)
                .Include(o => o.Department)
                .Where(o => o.IsActive && o.ObservationType == type)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();

            return _mapper.Map<IEnumerable<ObservationDto>>(observations);
        }

        public async Task<string> GenerateTicketNumberAsync()
        {
            var today = DateTime.Today;
            var prefix = $"OBS-{today:yyyyMMdd}";
            
            var lastTicket = await _dbSet
                .Where(o => o.TicketNumber.StartsWith(prefix))
                .OrderByDescending(o => o.TicketNumber)
                .FirstOrDefaultAsync();

            var sequence = 1;
            if (lastTicket != null && lastTicket.TicketNumber.Length > prefix.Length)
            {
                var lastSequence = lastTicket.TicketNumber.Substring(prefix.Length + 1);
                if (int.TryParse(lastSequence, out var lastSeq))
                {
                    sequence = lastSeq + 1;
                }
            }

            return $"{prefix}-{sequence:D4}";
        }

        public override async Task<ObservationDto> CreateAsync(CreateObservationDto createDto)
        {
            var entity = _mapper.Map<Observation>(createDto);
            entity.TicketNumber = await GenerateTicketNumberAsync();
            entity.CreatedAt = DateTime.UtcNow;
            entity.UpdatedAt = DateTime.UtcNow;

            _dbSet.Add(entity);
            await _context.SaveChangesAsync();

            return await GetByIdAsync(entity.Id) ?? _mapper.Map<ObservationDto>(entity);
        }

        public async Task<ObservationDto?> UpdateStatusAsync(int id, ObservationStatus status, string? notes = null)
        {
            var observation = await _dbSet.FirstOrDefaultAsync(o => o.Id == id && o.IsActive);
            if (observation == null) return null;

            observation.Status = status;
            observation.UpdatedAt = DateTime.UtcNow;

            if (status == ObservationStatus.Resolved || status == ObservationStatus.Closed)
            {
                observation.CompletedDate = DateTime.UtcNow;
            }

            if (!string.IsNullOrEmpty(notes))
            {
                observation.ResolutionNotes = notes;
            }

            await _context.SaveChangesAsync();
            return await GetByIdAsync(id);
        }
    }
}

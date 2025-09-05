using Microsoft.EntityFrameworkCore;
using AutoMapper;
using Backend.Data;
using Backend.Models;
using Backend.Services.Interfaces;
using Backend.Dtos.Permit;

namespace Backend.Services.Implementations
{
    public class PermitService : BaseService<Permit, PermitDto, CreatePermitDto, UpdatePermitDto>, IPermitService
    {
        public PermitService(SafetyDbContext context, IMapper mapper) 
            : base(context, mapper)
        {
        }

        public async Task<IEnumerable<PermitDto>> GetByUserIdAsync(int userId)
        {
            var permits = await _dbSet
                .Include(p => p.RequestedByUser)
                .Include(p => p.ApprovedByUser)
                .Include(p => p.ResponsibleEngineer)
                .Include(p => p.Plant)
                .Include(p => p.Department)
                .Where(p => p.IsActive && 
                           (p.RequestedByUserId == userId || 
                            p.ResponsibleEngineerId == userId || 
                            p.ApprovedByUserId == userId))
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

            return _mapper.Map<IEnumerable<PermitDto>>(permits);
        }

        public async Task<IEnumerable<PermitDto>> GetByStatusAsync(PermitStatus status)
        {
            var permits = await _dbSet
                .Include(p => p.RequestedByUser)
                .Include(p => p.ApprovedByUser)
                .Include(p => p.ResponsibleEngineer)
                .Include(p => p.Plant)
                .Include(p => p.Department)
                .Where(p => p.IsActive && p.Status == status)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

            return _mapper.Map<IEnumerable<PermitDto>>(permits);
        }

        public async Task<IEnumerable<PermitDto>> GetExpiringPermitsAsync(int daysAhead = 30)
        {
            var cutoffDate = DateTime.UtcNow.AddDays(daysAhead);
            
            var permits = await _dbSet
                .Include(p => p.RequestedByUser)
                .Include(p => p.ApprovedByUser)
                .Include(p => p.ResponsibleEngineer)
                .Include(p => p.Plant)
                .Include(p => p.Department)
                .Where(p => p.IsActive && 
                           p.Status == PermitStatus.Approved && 
                           p.EndDate <= cutoffDate)
                .OrderBy(p => p.EndDate)
                .ToListAsync();

            return _mapper.Map<IEnumerable<PermitDto>>(permits);
        }

        public async Task<string> GeneratePermitNumberAsync()
        {
            var today = DateTime.Today;
            var prefix = $"PER-{today:yyyyMMdd}";
            
            var lastPermit = await _dbSet
                .Where(p => p.PermitNumber.StartsWith(prefix))
                .OrderByDescending(p => p.PermitNumber)
                .FirstOrDefaultAsync();

            var sequence = 1;
            if (lastPermit != null && lastPermit.PermitNumber.Length > prefix.Length)
            {
                var lastSequence = lastPermit.PermitNumber.Substring(prefix.Length + 1);
                if (int.TryParse(lastSequence, out var lastSeq))
                {
                    sequence = lastSeq + 1;
                }
            }

            return $"{prefix}-{sequence:D4}";
        }

        public async Task<PermitDto?> UpdateStatusAsync(int id, PermitStatus status, int? approvedByUserId = null, string? notes = null)
        {
            var permit = await _dbSet.FirstOrDefaultAsync(p => p.Id == id && p.IsActive);
            if (permit == null) return null;

            permit.Status = status;
            permit.UpdatedAt = DateTime.UtcNow;

            if (status == PermitStatus.Approved)
            {
                permit.ApprovedDate = DateTime.UtcNow;
                if (approvedByUserId.HasValue)
                {
                    permit.ApprovedByUserId = approvedByUserId.Value;
                }
            }

            if (!string.IsNullOrEmpty(notes))
            {
                permit.ApprovalNotes = notes;
            }

            await _context.SaveChangesAsync();
            return await GetByIdAsync(id);
        }
    }
}
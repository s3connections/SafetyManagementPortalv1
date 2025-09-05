using Microsoft.EntityFrameworkCore;
using AutoMapper;
using Backend.Data;
using Backend.Models;
using Backend.Services.Interfaces;
using Backend.Dtos.Audit;

namespace Backend.Services.Implementations
{
    public class AuditService : BaseService<Audit, AuditDto, CreateAuditDto, UpdateAuditDto>, IAuditService
    {
        public AuditService(SafetyDbContext context, IMapper mapper) 
            : base(context, mapper)
        {
        }

        public override async Task<IEnumerable<AuditDto>> GetAllAsync()
        {
            var audits = await _dbSet
                .Include(a => a.Auditor)
                .Include(a => a.Plant)
                .Include(a => a.Department)
                .Include(a => a.Questions)
                .Where(a => a.IsActive)
                .OrderByDescending(a => a.ScheduledDate)
                .ToListAsync();

            return _mapper.Map<IEnumerable<AuditDto>>(audits);
        }

        public async Task<IEnumerable<AuditDto>> GetByAuditorIdAsync(int auditorId)
        {
            var audits = await _dbSet
                .Include(a => a.Auditor)
                .Include(a => a.Plant)
                .Include(a => a.Department)
                .Include(a => a.Questions)
                .Where(a => a.IsActive && a.AuditorId == auditorId)
                .OrderByDescending(a => a.ScheduledDate)
                .ToListAsync();

            return _mapper.Map<IEnumerable<AuditDto>>(audits);
        }

        public async Task<IEnumerable<AuditDto>> GetByStatusAsync(AuditStatus status)
        {
            var audits = await _dbSet
                .Include(a => a.Auditor)
                .Include(a => a.Plant)
                .Include(a => a.Department)
                .Include(a => a.Questions)
                .Where(a => a.IsActive && a.Status == status)
                .OrderByDescending(a => a.ScheduledDate)
                .ToListAsync();

            return _mapper.Map<IEnumerable<AuditDto>>(audits);
        }

        public async Task<IEnumerable<AuditDto>> GetByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            var audits = await _dbSet
                .Include(a => a.Auditor)
                .Include(a => a.Plant)
                .Include(a => a.Department)
                .Include(a => a.Questions)
                .Where(a => a.IsActive && a.ScheduledDate >= startDate && a.ScheduledDate <= endDate)
                .OrderByDescending(a => a.ScheduledDate)
                .ToListAsync();

            return _mapper.Map<IEnumerable<AuditDto>>(audits);
        }

        public async Task<AuditDto?> UpdateStatusAsync(int id, AuditStatus status)
        {
            var audit = await _dbSet.FirstOrDefaultAsync(a => a.Id == id && a.IsActive);
            if (audit == null) return null;

            audit.Status = status;
            audit.UpdatedAt = DateTime.UtcNow;

            if (status == AuditStatus.Completed)
            {
                audit.CompletedDate = DateTime.UtcNow;
                audit.Score = await CalculateScoreAsync(id);
            }

            await _context.SaveChangesAsync();
            return await GetByIdAsync(id);
        }

        public async Task<decimal?> CalculateScoreAsync(int auditId)
        {
            var questions = await _context.AuditQuestions
                .Where(q => q.AuditId == auditId && q.Score.HasValue)
                .ToListAsync();

            if (!questions.Any()) return null;

            var totalScore = questions.Sum(q => q.Score ?? 0);
            var maxScore = questions.Count * 100; // Assuming max score per question is 100

            return Math.Round((decimal)totalScore / maxScore * 100, 2);
        }
    }
}
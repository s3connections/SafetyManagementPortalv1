using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.DTOs.Audit;
using Backend.DTOs.Common;
using Backend.Models;
using Backend.Services.Interfaces;

namespace Backend.Services.Implementations
{
    public class AuditService : BaseService<Audit, AuditDto, CreateAuditDto, UpdateAuditDto>, IAuditService
    {
        public AuditService(ApplicationDbContext context, IMapper mapper, ILogger<AuditService> logger)
            : base(context, mapper, logger)
        {
        }

        public async Task<ApiResponse<AuditDto>> StartAuditAsync(int auditId)
        {
            try
            {
                var audit = await _context.Audits.FindAsync(auditId);
                if (audit == null)
                {
                    return ApiResponse<AuditDto>.Failure("Audit not found");
                }

                if (audit.Status != AuditStatus.Scheduled)
                {
                    return ApiResponse<AuditDto>.Failure("Audit must be in scheduled status to start");
                }

                audit.Status = AuditStatus.InProgress;
                audit.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                var auditDto = _mapper.Map<AuditDto>(audit);
                return ApiResponse<AuditDto>.Success(auditDto, "Audit started successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error starting audit {AuditId}", auditId);
                return ApiResponse<AuditDto>.Failure("An error occurred while starting the audit");
            }
        }

        public async Task<ApiResponse<AuditDto>> CompleteAuditAsync(int auditId, int? score = null, string? remarks = null)
        {
            try
            {
                var audit = await _context.Audits.FindAsync(auditId);
                if (audit == null)
                {
                    return ApiResponse<AuditDto>.Failure("Audit not found");
                }

                if (audit.Status != AuditStatus.InProgress)
                {
                    return ApiResponse<AuditDto>.Failure("Audit must be in progress to complete");
                }

                audit.Status = AuditStatus.Completed;
                audit.CompletedAt = DateTime.UtcNow;
                audit.UpdatedAt = DateTime.UtcNow;
                
                if (score.HasValue)
                {
                    audit.Score = score.Value;
                }

                if (!string.IsNullOrEmpty(remarks))
                {
                    audit.Recommendations = remarks;
                }

                await _context.SaveChangesAsync();

                var auditDto = _mapper.Map<AuditDto>(audit);
                return ApiResponse<AuditDto>.Success(auditDto, "Audit completed successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error completing audit {AuditId}", auditId);
                return ApiResponse<AuditDto>.Failure("An error occurred while completing the audit");
            }
        }

        public async Task<ApiResponse<IEnumerable<AuditDto>>> GetAuditsByStatusAsync(AuditStatus status)
        {
            try
            {
                var audits = await _context.Audits
                    .Where(a => a.Status == status)
                    .Include(a => a.Auditor)
                    .Include(a => a.Plant)
                    .Include(a => a.Department)
                    .ToListAsync();

                var auditDtos = _mapper.Map<IEnumerable<AuditDto>>(audits);
                return ApiResponse<IEnumerable<AuditDto>>.Success(auditDtos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting audits by status {Status}", status);
                return ApiResponse<IEnumerable<AuditDto>>.Failure("An error occurred while retrieving audits");
            }
        }

        public async Task<ApiResponse<IEnumerable<AuditDto>>> GetAuditsByAuditorAsync(int auditorId)
        {
            try
            {
                var audits = await _context.Audits
                    .Where(a => a.AuditorId == auditorId)
                    .Include(a => a.Auditor)
                    .Include(a => a.Plant)
                    .Include(a => a.Department)
                    .ToListAsync();

                var auditDtos = _mapper.Map<IEnumerable<AuditDto>>(audits);
                return ApiResponse<IEnumerable<AuditDto>>.Success(auditDtos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting audits by auditor {AuditorId}", auditorId);
                return ApiResponse<IEnumerable<AuditDto>>.Failure("An error occurred while retrieving audits");
            }
        }

        public async Task<ApiResponse<IEnumerable<AuditDto>>> GetAuditsByPlantAsync(int plantId)
        {
            try
            {
                var audits = await _context.Audits
                    .Where(a => a.PlantId == plantId)
                    .Include(a => a.Auditor)
                    .Include(a => a.Plant)
                    .Include(a => a.Department)
                    .ToListAsync();

                var auditDtos = _mapper.Map<IEnumerable<AuditDto>>(audits);
                return ApiResponse<IEnumerable<AuditDto>>.Success(auditDtos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting audits by plant {PlantId}", plantId);
                return ApiResponse<IEnumerable<AuditDto>>.Failure("An error occurred while retrieving audits");
            }
        }

        public async Task<ApiResponse<IEnumerable<AuditDto>>> GetAuditsByDepartmentAsync(int departmentId)
        {
            try
            {
                var audits = await _context.Audits
                    .Where(a => a.DepartmentId == departmentId)
                    .Include(a => a.Auditor)
                    .Include(a => a.Plant)
                    .Include(a => a.Department)
                    .ToListAsync();

                var auditDtos = _mapper.Map<IEnumerable<AuditDto>>(audits);
                return ApiResponse<IEnumerable<AuditDto>>.Success(auditDtos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting audits by department {DepartmentId}", departmentId);
                return ApiResponse<IEnumerable<AuditDto>>.Failure("An error occurred while retrieving audits");
            }
        }

        public async Task<ApiResponse<IEnumerable<AuditDto>>> GetOverdueAuditsAsync()
        {
            try
            {
                var now = DateTime.UtcNow;
                var audits = await _context.Audits
                    .Where(a => a.Status == AuditStatus.Scheduled && a.ScheduledDate < now)
                    .Include(a => a.Auditor)
                    .Include(a => a.Plant)
                    .Include(a => a.Department)
                    .ToListAsync();

                var auditDtos = _mapper.Map<IEnumerable<AuditDto>>(audits);
                return ApiResponse<IEnumerable<AuditDto>>.Success(auditDtos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting overdue audits");
                return ApiResponse<IEnumerable<AuditDto>>.Failure("An error occurred while retrieving overdue audits");
            }
        }

        public async Task<ApiResponse<AuditStatisticsDto>> GetAuditStatisticsAsync()
        {
            try
            {
                var audits = await _context.Audits.ToListAsync();
                var now = DateTime.UtcNow;

                var statistics = new AuditStatisticsDto
                {
                    TotalAudits = audits.Count,
                    ScheduledAudits = audits.Count(a => a.Status == AuditStatus.Scheduled),
                    InProgressAudits = audits.Count(a => a.Status == AuditStatus.InProgress),
                    CompletedAudits = audits.Count(a => a.Status == AuditStatus.Completed),
                    OverdueAudits = audits.Count(a => a.Status == AuditStatus.Scheduled && a.ScheduledDate < now),
                    AuditsByType = audits.GroupBy(a => a.AuditType.ToString())
                                        .ToDictionary(g => g.Key, g => g.Count()),
                    AuditsByStatus = audits.GroupBy(a => a.Status.ToString())
                                          .ToDictionary(g => g.Key, g => g.Count())
                };

                return ApiResponse<AuditStatisticsDto>.Success(statistics);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting audit statistics");
                return ApiResponse<AuditStatisticsDto>.Failure("An error occurred while retrieving audit statistics");
            }
        }

        protected override string GenerateNumber()
        {
            return $"AUD-{DateTime.Now:yyyyMMdd}-{Random.Shared.Next(1000, 9999)}";
        }
    }
}
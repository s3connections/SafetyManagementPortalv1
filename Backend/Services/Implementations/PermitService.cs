using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SafetyManagementPortal.Backend.Data;
using SafetyManagementPortal.Backend.DTOs.Permit;
using SafetyManagementPortal.Backend.Models;
using SafetyManagementPortal.Backend.Services.Interfaces;
using SafetyManagementPortal.Backend.enums;

namespace SafetyManagementPortal.Backend.Services.Implementations
{
    public class PermitService
        : BaseService<Permit, PermitDto, CreatePermitDto, UpdatePermitDto>,
          IPermitService
    {
        private readonly SafetyManagementContext _db;
        private readonly IMapper _mapper;

        public PermitService(SafetyManagementContext db, IMapper mapper)
            : base(db, mapper)
        {
            _db = db;
            _mapper = mapper;
        }

        public async Task<PermitDto> CreatePermitAsync(CreatePermitDto dto)
        {
            var entity = new Permit
            {
                RequestedById = dto.RequestedById,
                CreatedAt = DateTime.UtcNow,
                IsActive = true
            };
            _db.Permits.Add(entity);
            await _db.SaveChangesAsync();
            return _mapper.Map<PermitDto>(entity);
        }

        public async Task<PermitDto> ApprovePermitAsync(int permitId, UpdatePermitDto dto)
        {
            var entity = await _db.Permits.FindAsync(permitId);
            if (entity == null) throw new KeyNotFoundException("Permit not found");

            entity.ApprovedById = dto.ApprovedById;
            entity.ApprovedDate = dto.ApprovedDate;
            entity.ApprovalNotes = dto.ApprovalNotes;
            entity.UpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();
            return _mapper.Map<PermitDto>(entity);
        }

        public async Task<IEnumerable<PermitDto>> GetAllAsync(int userId)
        {
            var list = await _db.Permits
                .Where(p => p.RequestedById == userId && p.IsActive)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
            return _mapper.Map<IEnumerable<PermitDto>>(list);
        }

        // Missing methods from IPermitService
        public async Task<IEnumerable<PermitDto>> GetByUserIdAsync(int userId)
        {
            var permits = await _db.Permits
                .Include(p => p.RequestedByUser)
                .Include(p => p.ApprovedByUser)
                .Where(p => p.IsActive && p.RequestedById == userId)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

            return _mapper.Map<IEnumerable<PermitDto>>(permits);
        }

        public async Task<IEnumerable<PermitDto>> GetByStatusAsync(PermitStatus status)
        {
            var permits = await _db.Permits
                .Include(p => p.RequestedByUser)
                .Include(p => p.ApprovedByUser)
                .Where(p => p.IsActive && p.Status == status)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

            return _mapper.Map<IEnumerable<PermitDto>>(permits);
        }

        public async Task<IEnumerable<PermitDto>> GetExpiringPermitsAsync(int daysAhead = 30)
        {
            var cutoffDate = DateTime.UtcNow.AddDays(daysAhead);
            
            var permits = await _db.Permits
                .Include(p => p.RequestedByUser)
                .Include(p => p.ApprovedByUser)
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
            
            var lastPermit = await _db.Permits
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
            var permit = await _db.Permits.FirstOrDefaultAsync(p => p.Id == id && p.IsActive);
            if (permit == null) return null;

            permit.Status = status;
            permit.UpdatedAt = DateTime.UtcNow;

            if (status == PermitStatus.Approved)
            {
                permit.ApprovedDate = DateTime.UtcNow;
                if (approvedByUserId.HasValue)
                {
                    permit.ApprovedById = approvedByUserId.Value;
                }
            }

            if (!string.IsNullOrEmpty(notes))
            {
                permit.ApprovalNotes = notes;
            }

            await _db.SaveChangesAsync();
            return _mapper.Map<PermitDto>(permit);
        }
    }
}

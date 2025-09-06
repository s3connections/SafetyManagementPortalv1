using Microsoft.EntityFrameworkCore;
using AutoMapper;
using SafetyManagementPortal.Backend.Data;
using SafetyManagementPortal.Backend.Models;
using SafetyManagementPortal.Backend.Services.Interfaces;
using SafetyManagementPortal.Backend.DTOs.Permit;

namespace SafetyManagementPortal.Backend.Services.Implementations
{
    public class PermitTypeService : BaseService<PermitType, PermitTypeDto, CreatePermitTypeDto, UpdatePermitTypeDto>, IPermitTypeService
    {
        public PermitTypeService(SafetyManagementContext context, IMapper mapper) 
            : base(context, mapper)
        {
        }

        public override async Task<IEnumerable<PermitTypeDto>> GetAllAsync()
        {
            var permitTypes = await _dbSet
                .Include(pt => pt.Permits)
                .Include(pt => pt.PermitTemplates)
                .Where(pt => pt.IsActive)
                .OrderBy(pt => pt.Name)
                .ToListAsync();

            var dtos = _mapper.Map<IEnumerable<PermitTypeDto>>(permitTypes);
            
            // Add computed properties
            foreach (var dto in dtos)
            {
                var permitType = permitTypes.First(pt => pt.Id == dto.Id);
                dto.PermitCount = permitType.Permits.Count;
                dto.TemplateCount = permitType.PermitTemplates.Count;
                dto.RiskLevelName = GetRiskLevelName(dto.RiskLevel);
            }

            return dtos;
        }

        public override async Task<PermitTypeDto?> GetByIdAsync(int id)
        {
            var permitType = await _dbSet
                .Include(pt => pt.Permits)
                .Include(pt => pt.PermitTemplates)
                .FirstOrDefaultAsync(pt => pt.Id == id && pt.IsActive);

            if (permitType == null) return null;

            var dto = _mapper.Map<PermitTypeDto>(permitType);
            dto.PermitCount = permitType.Permits.Count;
            dto.TemplateCount = permitType.PermitTemplates.Count;
            dto.RiskLevelName = GetRiskLevelName(dto.RiskLevel);

            return dto;
        }

        public async Task<IEnumerable<PermitTypeDto>> GetByCategoryAsync(string category)
        {
            var permitTypes = await _dbSet
                .Include(pt => pt.Permits)
                .Include(pt => pt.PermitTemplates)
                .Where(pt => pt.IsActive && pt.Category == category)
                .OrderBy(pt => pt.Name)
                .ToListAsync();

            return await MapToDto(permitTypes);
        }

        public async Task<IEnumerable<PermitTypeDto>> GetByRiskLevelAsync(int riskLevel)
        {
            var permitTypes = await _dbSet
                .Include(pt => pt.Permits)
                .Include(pt => pt.PermitTemplates)
                .Where(pt => pt.IsActive && pt.RiskLevel == riskLevel)
                .OrderBy(pt => pt.Name)
                .ToListAsync();

            return await MapToDto(permitTypes);
        }

        public async Task<IEnumerable<PermitTypeDto>> GetActiveTypesAsync()
        {
            var permitTypes = await _dbSet
                .Include(pt => pt.Permits)
                .Include(pt => pt.PermitTemplates)
                .Where(pt => pt.IsActive)
                .OrderBy(pt => pt.Name)
                .ToListAsync();

            return await MapToDto(permitTypes);
        }

        public async Task<PermitTypeDto?> GetByCodeAsync(string code)
        {
            var permitType = await _dbSet
                .Include(pt => pt.Permits)
                .Include(pt => pt.PermitTemplates)
                .FirstOrDefaultAsync(pt => pt.IsActive && pt.Code == code);

            if (permitType == null) return null;

            var dto = _mapper.Map<PermitTypeDto>(permitType);
            dto.PermitCount = permitType.Permits.Count;
            dto.TemplateCount = permitType.PermitTemplates.Count;
            dto.RiskLevelName = GetRiskLevelName(dto.RiskLevel);

            return dto;
        }

        public async Task<bool> CodeExistsAsync(string code, int? excludeId = null)
        {
            var query = _dbSet.Where(pt => pt.IsActive && pt.Code == code);
            
            if (excludeId.HasValue)
            {
                query = query.Where(pt => pt.Id != excludeId.Value);
            }

            return await query.AnyAsync();
        }

        public async Task<IEnumerable<PermitTypeDto>> GetTypesRequiringSpecialApprovalAsync()
        {
            var permitTypes = await _dbSet
                .Include(pt => pt.Permits)
                .Include(pt => pt.PermitTemplates)
                .Where(pt => pt.IsActive && pt.RequiresSpecialApproval)
                .OrderBy(pt => pt.Name)
                .ToListAsync();

            return await MapToDto(permitTypes);
        }

        public async Task<IEnumerable<PermitTypeDto>> GetTypesRequiringFireWatchAsync()
        {
            var permitTypes = await _dbSet
                .Include(pt => pt.Permits)
                .Include(pt => pt.PermitTemplates)
                .Where(pt => pt.IsActive && pt.RequiresFireWatch)
                .OrderBy(pt => pt.Name)
                .ToListAsync();

            return await MapToDto(permitTypes);
        }

        public async Task<PermitTypeDto?> GetMostUsedTypeAsync()
        {
            var permitType = await _dbSet
                .Include(pt => pt.Permits)
                .Include(pt => pt.PermitTemplates)
                .Where(pt => pt.IsActive)
                .OrderByDescending(pt => pt.Permits.Count)
                .FirstOrDefaultAsync();

            if (permitType == null) return null;

            var dto = _mapper.Map<PermitTypeDto>(permitType);
            dto.PermitCount = permitType.Permits.Count;
            dto.TemplateCount = permitType.PermitTemplates.Count;
            dto.RiskLevelName = GetRiskLevelName(dto.RiskLevel);

            return dto;
        }

        public async Task<Dictionary<string, int>> GetPermitCountByTypeAsync()
        {
            return await _dbSet
                .Where(pt => pt.IsActive)
                .Include(pt => pt.Permits)
                .ToDictionaryAsync(pt => pt.Name, pt => pt.Permits.Count);
        }

        public override async Task<PermitTypeDto> CreateAsync(CreatePermitTypeDto createDto)
        {
            // Check if code already exists
            if (!string.IsNullOrEmpty(createDto.Code) && await CodeExistsAsync(createDto.Code))
            {
                throw new InvalidOperationException($"Permit type with code '{createDto.Code}' already exists.");
            }

            var entity = _mapper.Map<PermitType>(createDto);
            entity.CreatedAt = DateTime.UtcNow;
            entity.UpdatedAt = DateTime.UtcNow;

            _dbSet.Add(entity);
            await _context.SaveChangesAsync();

            return await GetByIdAsync(entity.Id) ?? _mapper.Map<PermitTypeDto>(entity);
        }

        public override async Task<PermitTypeDto?> UpdateAsync(int id, UpdatePermitTypeDto updateDto)
        {
            var entity = await _dbSet.FirstOrDefaultAsync(pt => pt.Id == id && pt.IsActive);
            if (entity == null) return null;

            // Check if code already exists (excluding current entity)
            if (!string.IsNullOrEmpty(updateDto.Code) && await CodeExistsAsync(updateDto.Code, id))
            {
                throw new InvalidOperationException($"Permit type with code '{updateDto.Code}' already exists.");
            }

            _mapper.Map(updateDto, entity);
            entity.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return await GetByIdAsync(id);
        }

        private async Task<IEnumerable<PermitTypeDto>> MapToDto(IEnumerable<PermitType> permitTypes)
        {
            var dtos = _mapper.Map<IEnumerable<PermitTypeDto>>(permitTypes);
            
            foreach (var dto in dtos)
            {
                var permitType = permitTypes.First(pt => pt.Id == dto.Id);
                dto.PermitCount = permitType.Permits.Count;
                dto.TemplateCount = permitType.PermitTemplates.Count;
                dto.RiskLevelName = GetRiskLevelName(dto.RiskLevel);
            }

            return dtos;
        }

        private static string GetRiskLevelName(int riskLevel)
        {
            return riskLevel switch
            {
                1 => "Low",
                2 => "Medium", 
                3 => "High",
                4 => "Critical",
                _ => "Unknown"
            };
        }
    }
}

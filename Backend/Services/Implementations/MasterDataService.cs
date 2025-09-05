using Backend.Data;
using Backend.DTOs.Incident;
using Backend.Dtos.Audit;
using Backend.Dtos.Permit;
using Backend.DTOs.Employee;
using Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.DTOs.Common;

namespace Backend.Services.Implementations
{
    public class MasterDataService : IMasterDataService
    {
        private readonly SafetyManagementContext _ctx;
        public MasterDataService(SafetyManagementContext ctx){_ctx=ctx;}
        public async Task<List<PlantDto>> GetPlantsAsync()=>await _ctx.Plants.Where(p=>p.IsActive&&!p.IsDeleted).Select(p=>new PlantDto{Id=p.Id,Name=p.Name,Code=p.Code}).ToListAsync();
        public async Task<PlantDto> GetPlantByIdAsync(int id){var p=await _ctx.Plants.FirstOrDefaultAsync(x=>x.Id==id&&x.IsActive&&!x.IsDeleted);return p==null?null:new PlantDto{Id=p.Id,Name=p.Name,Code=p.Code};}
        public async Task<List<LocationDto>> GetLocationsByPlantAsync(int id)=>await _ctx.Locations.Where(l=>l.PlantId==id&&l.IsActive&&!l.IsDeleted).Select(l=>new LocationDto{Id=l.Id,Name=l.Name,Code=l.Code}).ToListAsync();
        public async Task<LocationDto> GetLocationByIdAsync(int id){var l=await _ctx.Locations.FirstOrDefaultAsync(x=>x.Id==id&&x.IsActive&&!x.IsDeleted);return l==null?null:new LocationDto{Id=l.Id,Name=l.Name,Code=l.Code};}
        public async Task<List<DepartmentDto>> GetDepartmentsAsync()=>await _ctx.Departments.Where(d=>d.IsActive&&!d.IsDeleted).Select(d=>new DepartmentDto{Id=d.Id,Name=d.Name,Code=d.Code}).ToListAsync();
        public async Task<DepartmentDto> GetDepartmentByIdAsync(int id){var d=await _ctx.Departments.FirstOrDefaultAsync(x=>x.Id==id&&x.IsActive&&!x.IsDeleted);return d==null?null:new DepartmentDto{Id=d.Id,Name=d.Name,Code=d.Code};}
        public async Task<List<CategoryDto>> GetCategoriesAsync()=>await _ctx.Categories.Where(c=>c.IsActive&&!c.IsDeleted).Select(c=>new CategoryDto{Id=c.Id,Name=c.Name}).ToListAsync();
        public async Task<CategoryDto> GetCategoryByIdAsync(int id){var c=await _ctx.Categories.FirstOrDefaultAsync(x=>x.Id==id&&x.IsActive&&!x.IsDeleted);return c==null?null:new CategoryDto{Id=c.Id,Name=c.Name};}
        public async Task<List<PriorityDto>> GetPrioritiesAsync()=>await _ctx.Priorities.Where(p=>p.IsActive&&!p.IsDeleted).Select(p=>new PriorityDto{Id=p.Id,Name=p.Name}).ToListAsync();
        public async Task<PriorityDto> GetPriorityByIdAsync(int id){var p=await _ctx.Priorities.FirstOrDefaultAsync(x=>x.Id==id&&x.IsActive&&!x.IsDeleted);return p==null?null:new PriorityDto{Id=p.Id,Name=p.Name};}
        public async Task<List<IncidentTypeDto>> GetIncidentTypesAsync()=>await _ctx.IncidentTypes.Where(i=>i.IsActive&&!i.IsDeleted).Select(i=>new IncidentTypeDto{Id=i.Id,Name=i.Name}).ToListAsync();
        public async Task<IncidentTypeDto> GetIncidentTypeByIdAsync(int id){var i=await _ctx.IncidentTypes.FirstOrDefaultAsync(x=>x.Id==id&&x.IsActive&&!x.IsDeleted);return i==null?null:new IncidentTypeDto{Id=i.Id,Name=i.Name};}
        public async Task<List<IncidentStatusDto>> GetIncidentStatusesAsync()=>await _ctx.IncidentStatuses.Where(s=>s.IsActive&&!s.IsDeleted).Select(s=>new IncidentStatusDto{Id=s.Id,Name=s.Name}).ToListAsync();
        public async Task<IncidentStatusDto> GetIncidentStatusByIdAsync(int id){var s=await _ctx.IncidentStatuses.FirstOrDefaultAsync(x=>x.Id==id&&x.IsActive&&!x.IsDeleted);return s==null?null:new IncidentStatusDto{Id=s.Id,Name=s.Name};}
        public async Task<List<AuditTypeDto>> GetAuditTypesAsync()=>await _ctx.AuditTypes.Where(a=>a.IsActive&&!a.IsDeleted).Select(a=>new AuditTypeDto{Id=a.Id,Name=a.Name}).ToListAsync();
        public async Task<AuditTypeDto> GetAuditTypeByIdAsync(int id){var a=await _ctx.AuditTypes.FirstOrDefaultAsync(x=>x.Id==id&&x.IsActive&&!x.IsDeleted);return a==null?null:new AuditTypeDto{Id=a.Id,Name=a.Name};}
        public async Task<List<PermitTypeDto>> GetPermitTypesAsync()=>await _ctx.PermitTypes.Where(p=>p.IsActive&&!p.IsDeleted).Select(p=>new PermitTypeDto{Id=p.Id,Name=p.Name}).ToListAsync();
        public async Task<PermitTypeDto> GetPermitTypeByIdAsync(int id){var p=await _ctx.PermitTypes.FirstOrDefaultAsync(x=>x.Id==id&&x.IsActive&&!x.IsDeleted);return p==null?null:new PermitTypeDto{Id=p.Id,Name=p.Name};}
    }
}
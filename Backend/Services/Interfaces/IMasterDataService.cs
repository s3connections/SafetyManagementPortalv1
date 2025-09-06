using SafetyManagementPortal.Backend.DTOs.Incident;
using SafetyManagementPortal.Backend.DTOs.Common;
using SafetyManagementPortal.Backend.DTOs.Permit;
using SafetyManagementPortal.Backend.DTOs.Audit;
using SafetyManagementPortal.Backend.DTOs.employee;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SafetyManagementPortal.Backend.Services.Interfaces
{
    public interface IMasterDataService
    {
        // Plants
        Task<List<PlantDto>> GetPlantsAsync();
        Task<PlantDto> GetPlantByIdAsync(int id);
        
        // Locations
        Task<List<LocationDto>> GetLocationsByPlantAsync(int plantId);
        Task<LocationDto> GetLocationByIdAsync(int id);
        
        // Departments
        Task<List<DepartmentDto>> GetDepartmentsAsync();
        Task<DepartmentDto> GetDepartmentByIdAsync(int id);
        
        // Categories
        Task<List<CategoryDto>> GetCategoriesAsync();
        Task<CategoryDto> GetCategoryByIdAsync(int id);
        
        // Priorities
        Task<List<PriorityDto>> GetPrioritiesAsync();
        Task<PriorityDto> GetPriorityByIdAsync(int id);
        
        // Incident Types
        Task<List<IncidentTypeDto>> GetIncidentTypesAsync();
        Task<IncidentTypeDto> GetIncidentTypeByIdAsync(int id);
        
        // Incident Statuses
        Task<List<IncidentStatusDto>> GetIncidentStatusesAsync();
        Task<IncidentStatusDto> GetIncidentStatusByIdAsync(int id);
        
        // Audit Types
        Task<List<AuditTypeDto>> GetAuditTypesAsync();
        Task<AuditTypeDto> GetAuditTypeByIdAsync(int id);
        
        // Permit Types
        Task<List<PermitTypeDto>> GetPermitTypesAsync();
        Task<PermitTypeDto> GetPermitTypeByIdAsync(int id);
    }
}

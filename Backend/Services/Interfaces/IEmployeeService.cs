using Backend.DTOs.Common;
using Backend.DTOs.Employee;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SafetyManagementPortal.Backend.Services.Interfaces
{
    public interface IEmployeeService
    {
        Task<PagedResult<EmployeeDto>> GetAllAsync(SearchFilter filter);
        Task<EmployeeDto> GetByIdAsync(int id);
        Task<EmployeeDto> GetByEmployeeIdAsync(string employeeId);
        Task<List<EmployeeDto>> GetByDepartmentAsync(int departmentId);
        Task<List<EmployeeDto>> GetByPlantAsync(int plantId);
        Task<List<EmployeeDto>> GetReportingManagersAsync(int employeeId);
    }
}

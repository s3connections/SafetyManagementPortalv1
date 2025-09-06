using Backend.DTOs.Common;
using Backend.DTOs.Employee;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace SafetyManagementPortal.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeeController : ControllerBase
    {
        private readonly IEmployeeService _svc;
        public EmployeeController(IEmployeeService s){_svc=s;}
        [HttpGet]
        public async Task<ApiResponse<PagedResult<EmployeeDto>>> Get([FromQuery]SearchFilter f)=>new ApiResponse<PagedResult<EmployeeDto>>{Success=true,Data=await _svc.GetAllAsync(f)};
        [HttpGet("{id}")]
        public async Task<ApiResponse<EmployeeDto>> Get(int id)=>new ApiResponse<EmployeeDto>{Success=true,Data=await _svc.GetByIdAsync(id)};
    }
}

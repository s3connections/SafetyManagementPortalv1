using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using SafetyManagementPortal.Backend.DTOs.Common;
using SafetyManagementPortal.Backend.DTOs.Incident;
using SafetyManagementPortal.Backend.DTOs.Employee;
using SafetyManagementPortal.Backend.DTOs.Observation;
using SafetyManagementPortal.Backend.DTOs.Permit;
using SafetyManagementPortal.Backend.DTOs.Audit;
using SafetyManagementPortal.Backend.DTOs.User;
using SafetyManagementPortal.Backend.Services.Interfaces;
using SafetyManagementPortal.Backend.Models;
using SafetyManagementPortal.Backend.enums;
using Microsoft.EntityFrameworkCore;
using System.Linq;
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

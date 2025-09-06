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
using System.Threading.Tasks;
using System.Collections.Generic;
using SafetyManagementPortal.Backend.DTOs.Department;

namespace SafetyManagementPortal.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MasterDataController : ControllerBase
    {
        private readonly IMasterDataService _svc;
        public MasterDataController(IMasterDataService s) { _svc = s; }
        
        [HttpGet("plants")]
        public async Task<ApiResponse<List<PlantDto>>> Plants() => new ApiResponse<List<PlantDto>> { Success = true, Data = await _svc.GetPlantsAsync() };
        
        [HttpGet("departments")]
        public async Task<ApiResponse<List<DepartmentDto>>> Depts() => new ApiResponse<List<DepartmentDto>> { Success = true, Data = await _svc.GetDepartmentsAsync() };
        
        [HttpGet("incident-types")]
        public async Task<ApiResponse<List<IncidentTypeDto>>> Types() => new ApiResponse<List<IncidentTypeDto>> { Success = true, Data = await _svc.GetIncidentTypesAsync() };
    }
}

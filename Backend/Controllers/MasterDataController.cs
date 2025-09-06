using Backend.DTOs.Common;
using Backend.DTOs.Incident;
using Backend.DTOs;
using Backend.DTOs.Employee;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace SafetyManagementPortal.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MasterDataController : ControllerBase
    {
        private readonly IMasterDataService _svc;
        public MasterDataController(IMasterDataService s){_svc=s;}
        [HttpGet("plants")]
        public async Task<ApiResponse<List<PlantDto>>> Plants()=>new ApiResponse<List<PlantDto>>{Success=true,Data=await _svc.GetPlantsAsync()};
        [HttpGet("departments")]
        public async Task<ApiResponse<List<DepartmentDto>>> Depts()=>new ApiResponse<List<DepartmentDto>>{Success=true,Data=await _svc.GetDepartmentsAsync()};
        [HttpGet("incident-types")]
        public async Task<ApiResponse<List<IncidentTypeDto>>> Types()=>new ApiResponse<List<IncidentTypeDto>>{Success=true,Data=await _svc.GetIncidentTypesAsync()};
    }
}

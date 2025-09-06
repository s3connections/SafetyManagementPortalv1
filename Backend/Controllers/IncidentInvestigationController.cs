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
    public class IncidentInvestigationController : ControllerBase
    {
        private readonly IIncidentInvestigationService _svc;
        public IncidentInvestigationController(IIncidentInvestigationService s){_svc=s;}
        [HttpGet]
        public async Task<ApiResponse<PagedResult<IncidentInvestigationDto>>> Get([FromQuery]SearchFilter f)=>new ApiResponse<PagedResult<IncidentInvestigationDto>>{Success=true,Data=await _svc.GetAllAsync(f)};
        [HttpGet("{id}")]
        public async Task<ApiResponse<IncidentInvestigationDto>> Get(int id)=>new ApiResponse<IncidentInvestigationDto>{Success=true,Data=await _svc.GetByIdAsync(id)};
        [HttpPost]
        public async Task<ApiResponse<IncidentInvestigationDto>> Post(CreateIncidentInvestigationDto d)=>new ApiResponse<IncidentInvestigationDto>{Success=true,Data=await _svc.CreateAsync(d)};
    }
}

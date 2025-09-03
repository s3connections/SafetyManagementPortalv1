using Backend.DTOs.Common;
using Backend.DTOs.Incident;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Backend.Controllers
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
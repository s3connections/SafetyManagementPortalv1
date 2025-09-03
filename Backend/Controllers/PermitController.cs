using Backend.DTOs.Common;
using Backend.DTOs.Permit;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PermitController : ControllerBase
    {
        private readonly IPermitService _svc;
        public PermitController(IPermitService s){_svc=s;}
        [HttpGet]
        public async Task<ApiResponse<PagedResult<PermitDto>>> Get([FromQuery]SearchFilter f)=>new ApiResponse<PagedResult<PermitDto>>{Success=true,Data=await _svc.GetAllAsync(f)};
        [HttpGet("{id}")]
        public async Task<ApiResponse<PermitDto>> Get(int id)=>new ApiResponse<PermitDto>{Success=true,Data=await _svc.GetByIdAsync(id)};
        [HttpPost]
        public async Task<ApiResponse<PermitDto>> Post(CreatePermitDto d)=>new ApiResponse<PermitDto>{Success=true,Data=await _svc.CreateAsync(d)};
        [HttpPut("{id}")]
        public async Task<ApiResponse<PermitDto>> Put(int id,UpdatePermitDto d)=>new ApiResponse<PermitDto>{Success=true,Data=await _svc.UpdateAsync(id,d)};
        [HttpPost("{id}/approve")]
        public async Task<ApiResponse<PermitDto>> Approve(int id,[FromBody]string cmt)=>new ApiResponse<PermitDto>{Success=true,Data=await _svc.ApprovePermitAsync(id,cmt)};
    }
}
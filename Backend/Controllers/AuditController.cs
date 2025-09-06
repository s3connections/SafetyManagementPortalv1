using Microsoft.AspNetCore.Mvc;
using Backend.Services.Interfaces;
using Backend.Dtos.Audit;
using Backend.Models;

namespace SafetyManagementPortal.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuditController : ControllerBase
    {
        private readonly IAuditService _auditService;

        public AuditController(IAuditService auditService)
        {
            _auditService = auditService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AuditDto>>> GetAll()
        {
            var audits = await _auditService.GetAllAsync();
            return Ok(audits);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<AuditDto>> GetById(int id)
        {
            var audit = await _auditService.GetByIdAsync(id);
            if (audit == null)
                return NotFound();

            return Ok(audit);
        }

        [HttpGet("auditor/{auditorId}")]
        public async Task<ActionResult<IEnumerable<AuditDto>>> GetByAuditorId(int auditorId)
        {
            var audits = await _auditService.GetByAuditorIdAsync(auditorId);
            return Ok(audits);
        }

        [HttpGet("status/{status}")]
        public async Task<ActionResult<IEnumerable<AuditDto>>> GetByStatus(AuditStatus status)
        {
            var audits = await _auditService.GetByStatusAsync(status);
            return Ok(audits);
        }

        [HttpGet("date-range")]
        public async Task<ActionResult<IEnumerable<AuditDto>>> GetByDateRange(
            [FromQuery] DateTime startDate, 
            [FromQuery] DateTime endDate)
        {
            var audits = await _auditService.GetByDateRangeAsync(startDate, endDate);
            return Ok(audits);
        }

        [HttpPost]
        public async Task<ActionResult<AuditDto>> Create([FromBody] CreateAuditDto createDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var audit = await _auditService.CreateAsync(createDto);
            return CreatedAtAction(nameof(GetById), new { id = audit.Id }, audit);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<AuditDto>> Update(int id, [FromBody] UpdateAuditDto updateDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var audit = await _auditService.UpdateAsync(id, updateDto);
            if (audit == null)
                return NotFound();

            return Ok(audit);
        }

        [HttpPatch("{id}/status")]
        public async Task<ActionResult<AuditDto>> UpdateStatus(int id, [FromBody] AuditStatus status)
        {
            var audit = await _auditService.UpdateStatusAsync(id, status);
            if (audit == null)
                return NotFound();

            return Ok(audit);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var result = await _auditService.DeleteAsync(id);
            if (!result)
                return NotFound();

            return NoContent();
        }

        [HttpGet("{id}/score")]
        public async Task<ActionResult<decimal?>> GetScore(int id)
        {
            var score = await _auditService.CalculateScoreAsync(id);
            return Ok(score);
        }
    }
}

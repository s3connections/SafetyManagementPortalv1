using Microsoft.AspNetCore.Mvc;
using Backend.Services.Interfaces;
using Backend.Dtos.Permit;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PermitTypeController : ControllerBase
    {
        private readonly IPermitTypeService _permitTypeService;

        public PermitTypeController(IPermitTypeService permitTypeService)
        {
            _permitTypeService = permitTypeService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PermitTypeDto>>> GetAll()
        {
            var permitTypes = await _permitTypeService.GetAllAsync();
            return Ok(permitTypes);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PermitTypeDto>> GetById(int id)
        {
            var permitType = await _permitTypeService.GetByIdAsync(id);
            if (permitType == null)
                return NotFound();

            return Ok(permitType);
        }

        [HttpGet("category/{category}")]
        public async Task<ActionResult<IEnumerable<PermitTypeDto>>> GetByCategory(string category)
        {
            var permitTypes = await _permitTypeService.GetByCategoryAsync(category);
            return Ok(permitTypes);
        }

        [HttpGet("risk-level/{riskLevel}")]
        public async Task<ActionResult<IEnumerable<PermitTypeDto>>> GetByRiskLevel(int riskLevel)
        {
            var permitTypes = await _permitTypeService.GetByRiskLevelAsync(riskLevel);
            return Ok(permitTypes);
        }

        [HttpGet("code/{code}")]
        public async Task<ActionResult<PermitTypeDto>> GetByCode(string code)
        {
            var permitType = await _permitTypeService.GetByCodeAsync(code);
            if (permitType == null)
                return NotFound();

            return Ok(permitType);
        }

        [HttpGet("active")]
        public async Task<ActionResult<IEnumerable<PermitTypeDto>>> GetActiveTypes()
        {
            var permitTypes = await _permitTypeService.GetActiveTypesAsync();
            return Ok(permitTypes);
        }

        [HttpGet("special-approval")]
        public async Task<ActionResult<IEnumerable<PermitTypeDto>>> GetTypesRequiringSpecialApproval()
        {
            var permitTypes = await _permitTypeService.GetTypesRequiringSpecialApprovalAsync();
            return Ok(permitTypes);
        }

        [HttpGet("fire-watch")]
        public async Task<ActionResult<IEnumerable<PermitTypeDto>>> GetTypesRequiringFireWatch()
        {
            var permitTypes = await _permitTypeService.GetTypesRequiringFireWatchAsync();
            return Ok(permitTypes);
        }

        [HttpGet("most-used")]
        public async Task<ActionResult<PermitTypeDto>> GetMostUsedType()
        {
            var permitType = await _permitTypeService.GetMostUsedTypeAsync();
            if (permitType == null)
                return NotFound();

            return Ok(permitType);
        }

        [HttpGet("statistics")]
        public async Task<ActionResult<Dictionary<string, int>>> GetPermitCountByType()
        {
            var statistics = await _permitTypeService.GetPermitCountByTypeAsync();
            return Ok(statistics);
        }

        [HttpPost]
        public async Task<ActionResult<PermitTypeDto>> Create(CreatePermitTypeDto createDto)
        {
            try
            {
                var permitType = await _permitTypeService.CreateAsync(createDto);
                return CreatedAtAction(nameof(GetById), new { id = permitType.Id }, permitType);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<PermitTypeDto>> Update(int id, UpdatePermitTypeDto updateDto)
        {
            try
            {
                var permitType = await _permitTypeService.UpdateAsync(id, updateDto);
                if (permitType == null)
                    return NotFound();

                return Ok(permitType);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _permitTypeService.DeleteAsync(id);
            if (!result)
                return NotFound();

            return NoContent();
        }

        [HttpGet("code-exists/{code}")]
        public async Task<ActionResult<bool>> CodeExists(string code, [FromQuery] int? excludeId = null)
        {
            var exists = await _permitTypeService.CodeExistsAsync(code, excludeId);
            return Ok(exists);
        }
    }
}
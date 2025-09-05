using Microsoft.AspNetCore.Mvc;
using Backend.Services.Interfaces;
using Backend.Dtos.Observation;
using Backend.Models;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ObservationController : ControllerBase
    {
        private readonly IObservationService _observationService;

        public ObservationController(IObservationService observationService)
        {
            _observationService = observationService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ObservationDto>>> GetAll()
        {
            var observations = await _observationService.GetAllAsync();
            return Ok(observations);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ObservationDto>> GetById(int id)
        {
            var observation = await _observationService.GetByIdAsync(id);
            if (observation == null)
                return NotFound();

            return Ok(observation);
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<ObservationDto>>> GetByUserId(int userId)
        {
            var observations = await _observationService.GetByUserIdAsync(userId);
            return Ok(observations);
        }

        [HttpGet("status/{status}")]
        public async Task<ActionResult<IEnumerable<ObservationDto>>> GetByStatus(ObservationStatus status)
        {
            var observations = await _observationService.GetByStatusAsync(status);
            return Ok(observations);
        }

        [HttpGet("type/{type}")]
        public async Task<ActionResult<IEnumerable<ObservationDto>>> GetByType(ObservationType type)
        {
            var observations = await _observationService.GetByTypeAsync(type);
            return Ok(observations);
        }

        [HttpPost]
        public async Task<ActionResult<ObservationDto>> Create([FromBody] CreateObservationDto createDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var observation = await _observationService.CreateAsync(createDto);
            return CreatedAtAction(nameof(GetById), new { id = observation.Id }, observation);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ObservationDto>> Update(int id, [FromBody] UpdateObservationDto updateDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var observation = await _observationService.UpdateAsync(id, updateDto);
            if (observation == null)
                return NotFound();

            return Ok(observation);
        }

        [HttpPatch("{id}/status")]
        public async Task<ActionResult<ObservationDto>> UpdateStatus(int id, [FromBody] UpdateStatusRequest request)
        {
            var observation = await _observationService.UpdateStatusAsync(id, request.Status, request.Notes);
            if (observation == null)
                return NotFound();

            return Ok(observation);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var result = await _observationService.DeleteAsync(id);
            if (!result)
                return NotFound();

            return NoContent();
        }

        [HttpGet("generate-ticket-number")]
        public async Task<ActionResult<string>> GenerateTicketNumber()
        {
            var ticketNumber = await _observationService.GenerateTicketNumberAsync();
            return Ok(ticketNumber);
        }
    }

    public class UpdateStatusRequest
    {
        public ObservationStatus Status { get; set; }
        public string? Notes { get; set; }
    }
}
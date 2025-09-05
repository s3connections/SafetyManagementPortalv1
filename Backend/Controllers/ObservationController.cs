using Microsoft.AspNetCore.Mvc;
using Backend.Models.Entities;
using Backend.Services;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ObservationController : ControllerBase
    {
        private readonly IObservationService _observationService;
        private readonly IWebHostEnvironment _environment;

        public ObservationController(IObservationService observationService, IWebHostEnvironment environment)
        {
            _observationService = observationService;
            _environment = environment;
        }

        [HttpGet]
        public async Task<IActionResult> GetObservations(
            [FromQuery] int page = 1,
            [FromQuery] int limit = 10,
            [FromQuery] string? status = null,
            [FromQuery] string? priority = null,
            [FromQuery] int? plantId = null,
            [FromQuery] int? departmentId = null)
        {
            try
            {
                var observations = await _observationService.GetAllAsync(page, limit, status, priority, plantId, departmentId);
                var totalCount = await _observationService.GetTotalCountAsync();
                var totalPages = (int)Math.Ceiling((double)totalCount / limit);

                var response = new
                {
                    success = true,
                    data = observations.Select(o => new
                    {
                        id = o.Id,
                        ticketNumber = o.TicketNumber,
                        observationType = o.ObservationType.ToString(),
                        hazardType = o.HazardType,
                        priority = o.Priority.ToString(),
                        stage = o.Stage.ToString(),
                        status = o.Status.ToString(),
                        description = o.Description,
                        location = o.Location,
                        plantId = o.PlantId,
                        departmentId = o.DepartmentId,
                        reportedBy = o.ReportedBy,
                        assignedTo = o.AssignedTo,
                        observationImages = string.IsNullOrEmpty(o.ObservationImages) ? new string[0] : o.ObservationImages.Split(','),
                        resolutionImages = string.IsNullOrEmpty(o.ResolutionImages) ? new string[0] : o.ResolutionImages.Split(','),
                        resolutionRemarks = o.ResolutionRemarks,
                        slaDeadline = o.SlaDeadline,
                        isActive = o.IsActive,
                        createdAt = o.CreatedAt,
                        updatedAt = o.UpdatedAt,
                        plant = new { id = o.Plant.Id, name = o.Plant.Name, code = o.Plant.Code },
                        department = new { id = o.Department.Id, name = o.Department.Name, code = o.Department.Code },
                        reporter = new { id = o.Reporter.Id, firstName = o.Reporter.FirstName, lastName = o.Reporter.LastName, employeeId = o.Reporter.EmployeeId },
                        assignedUser = o.AssignedUser == null ? null : new { id = o.AssignedUser.Id, firstName = o.AssignedUser.FirstName, lastName = o.AssignedUser.LastName, employeeId = o.AssignedUser.EmployeeId }
                    }),
                    totalCount,
                    currentPage = page,
                    totalPages,
                    message = "Observations retrieved successfully"
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetObservation(int id)
        {
            try
            {
                var observation = await _observationService.GetByIdAsync(id);
                if (observation == null)
                {
                    return NotFound(new { success = false, message = "Observation not found" });
                }

                var response = new
                {
                    success = true,
                    data = new
                    {
                        id = observation.Id,
                        ticketNumber = observation.TicketNumber,
                        observationType = observation.ObservationType.ToString(),
                        hazardType = observation.HazardType,
                        priority = observation.Priority.ToString(),
                        stage = observation.Stage.ToString(),
                        status = observation.Status.ToString(),
                        description = observation.Description,
                        location = observation.Location,
                        plantId = observation.PlantId,
                        departmentId = observation.DepartmentId,
                        reportedBy = observation.ReportedBy,
                        assignedTo = observation.AssignedTo,
                        observationImages = string.IsNullOrEmpty(observation.ObservationImages) ? new string[0] : observation.ObservationImages.Split(','),
                        resolutionImages = string.IsNullOrEmpty(observation.ResolutionImages) ? new string[0] : observation.ResolutionImages.Split(','),
                        resolutionRemarks = observation.ResolutionRemarks,
                        slaDeadline = observation.SlaDeadline,
                        isActive = observation.IsActive,
                        createdAt = observation.CreatedAt,
                        updatedAt = observation.UpdatedAt,
                        plant = new { id = observation.Plant.Id, name = observation.Plant.Name, code = observation.Plant.Code },
                        department = new { id = observation.Department.Id, name = observation.Department.Name, code = observation.Department.Code },
                        reporter = new { id = observation.Reporter.Id, firstName = observation.Reporter.FirstName, lastName = observation.Reporter.LastName, employeeId = observation.Reporter.EmployeeId },
                        assignedUser = observation.AssignedUser == null ? null : new { id = observation.AssignedUser.Id, firstName = observation.AssignedUser.FirstName, lastName = observation.AssignedUser.LastName, employeeId = observation.AssignedUser.EmployeeId }
                    },
                    message = "Observation retrieved successfully"
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateObservation([FromForm] CreateObservationDto dto, IFormFile? observationImage)
        {
            try
            {
                var observation = new Observation
                {
                    ObservationType = Enum.Parse<ObservationType>(dto.ObservationType),
                    HazardType = dto.HazardType,
                    Priority = Enum.Parse<Priority>(dto.Priority),
                    Description = dto.Description,
                    Location = dto.Location,
                    PlantId = dto.PlantId,
                    DepartmentId = dto.DepartmentId,
                    ReportedBy = dto.ReportedBy ?? 1, // Default to user 1 for now
                    AssignedTo = dto.AssignedTo
                };

                // Handle image upload
                if (observationImage != null)
                {
                    var uploadsFolder = Path.Combine(_environment.WebRootPath, "uploads", "observations");
                    Directory.CreateDirectory(uploadsFolder);

                    var uniqueFileName = Guid.NewGuid().ToString() + "_" + observationImage.FileName;
                    var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await observationImage.CopyToAsync(fileStream);
                    }

                    observation.ObservationImages = $"/uploads/observations/{uniqueFileName}";
                }

                var createdObservation = await _observationService.CreateAsync(observation);

                var response = new
                {
                    success = true,
                    data = new
                    {
                        id = createdObservation.Id,
                        ticketNumber = createdObservation.TicketNumber,
                        observationType = createdObservation.ObservationType.ToString(),
                        hazardType = createdObservation.HazardType,
                        priority = createdObservation.Priority.ToString(),
                        stage = createdObservation.Stage.ToString(),
                        status = createdObservation.Status.ToString(),
                        description = createdObservation.Description,
                        location = createdObservation.Location,
                        plantId = createdObservation.PlantId,
                        departmentId = createdObservation.DepartmentId,
                        reportedBy = createdObservation.ReportedBy,
                        assignedTo = createdObservation.AssignedTo,
                        observationImages = string.IsNullOrEmpty(createdObservation.ObservationImages) ? new string[0] : createdObservation.ObservationImages.Split(','),
                        slaDeadline = createdObservation.SlaDeadline,
                        isActive = createdObservation.IsActive,
                        createdAt = createdObservation.CreatedAt,
                        updatedAt = createdObservation.UpdatedAt
                    },
                    message = "Observation created successfully"
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateObservation(int id, [FromForm] UpdateObservationDto dto, IFormFile? resolutionImage)
        {
            try
            {
                var observation = await _observationService.GetByIdAsync(id);
                if (observation == null)
                {
                    return NotFound(new { success = false, message = "Observation not found" });
                }

                // Update properties
                if (!string.IsNullOrEmpty(dto.Status))
                    observation.Status = Enum.Parse<ObservationStatus>(dto.Status);

                if (!string.IsNullOrEmpty(dto.Stage))
                    observation.Stage = Enum.Parse<ObservationStage>(dto.Stage);

                if (dto.AssignedTo.HasValue)
                    observation.AssignedTo = dto.AssignedTo.Value;

                if (!string.IsNullOrEmpty(dto.ResolutionRemarks))
                    observation.ResolutionRemarks = dto.ResolutionRemarks;

                if (!string.IsNullOrEmpty(dto.Priority))
                    observation.Priority = Enum.Parse<Priority>(dto.Priority);

                // Handle resolution image upload
                if (resolutionImage != null)
                {
                    var uploadsFolder = Path.Combine(_environment.WebRootPath, "uploads", "resolutions");
                    Directory.CreateDirectory(uploadsFolder);

                    var uniqueFileName = Guid.NewGuid().ToString() + "_" + resolutionImage.FileName;
                    var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await resolutionImage.CopyToAsync(fileStream);
                    }

                    observation.ResolutionImages = $"/uploads/resolutions/{uniqueFileName}";
                }

                var updatedObservation = await _observationService.UpdateAsync(observation);

                var response = new
                {
                    success = true,
                    data = new
                    {
                        id = updatedObservation.Id,
                        ticketNumber = updatedObservation.TicketNumber,
                        status = updatedObservation.Status.ToString(),
                        stage = updatedObservation.Stage.ToString(),
                        resolutionRemarks = updatedObservation.ResolutionRemarks,
                        resolutionImages = string.IsNullOrEmpty(updatedObservation.ResolutionImages) ? new string[0] : updatedObservation.ResolutionImages.Split(','),
                        updatedAt = updatedObservation.UpdatedAt
                    },
                    message = "Observation updated successfully"
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("{id}/reassign")]
        public async Task<IActionResult> ReassignObservation(int id, [FromBody] ReassignObservationDto dto)
        {
            try
            {
                var observation = await _observationService.ReassignAsync(id, dto.AssignedTo, dto.Reason);

                var response = new
                {
                    success = true,
                    data = new
                    {
                        id = observation.Id,
                        ticketNumber = observation.TicketNumber,
                        assignedTo = observation.AssignedTo,
                        status = observation.Status.ToString(),
                        resolutionRemarks = observation.ResolutionRemarks,
                        updatedAt = observation.UpdatedAt
                    },
                    message = "Observation reassigned successfully"
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpGet("department/{departmentId}")]
        public async Task<IActionResult> GetObservationsByDepartment(int departmentId)
        {
            try
            {
                var observations = await _observationService.GetByDepartmentAsync(departmentId);

                var response = new
                {
                    success = true,
                    data = observations.Select(o => new
                    {
                        id = o.Id,
                        ticketNumber = o.TicketNumber,
                        observationType = o.ObservationType.ToString(),
                        priority = o.Priority.ToString(),
                        status = o.Status.ToString(),
                        description = o.Description,
                        location = o.Location,
                        createdAt = o.CreatedAt
                    }),
                    message = "Department observations retrieved successfully"
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }
    }

    public class CreateObservationDto
    {
        public string ObservationType { get; set; } = string.Empty;
        public string? HazardType { get; set; }
        public string Priority { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public int PlantId { get; set; }
        public int DepartmentId { get; set; }
        public int? ReportedBy { get; set; }
        public int? AssignedTo { get; set; }
    }

    public class UpdateObservationDto
    {
        public string? Status { get; set; }
        public string? Stage { get; set; }
        public int? AssignedTo { get; set; }
        public string? ResolutionRemarks { get; set; }
        public string? Priority { get; set; }
    }

    public class ReassignObservationDto
    {
        public int AssignedTo { get; set; }
        public string Reason { get; set; } = string.Empty;
    }
}
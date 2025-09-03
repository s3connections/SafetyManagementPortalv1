using Microsoft.AspNetCore.Mvc;
using Backend.Models.Entities;
using Backend.Services;

namespace Backend.Controllers
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
        public async Task<IActionResult> GetAudits(
            [FromQuery] int page = 1,
            [FromQuery] int limit = 10,
            [FromQuery] string? status = null,
            [FromQuery] int? plantId = null,
            [FromQuery] int? departmentId = null)
        {
            try
            {
                var audits = await _auditService.GetAllAsync(page, limit, status, plantId, departmentId);
                var totalCount = await _auditService.GetTotalCountAsync();
                var totalPages = (int)Math.Ceiling((double)totalCount / limit);

                var response = new
                {
                    success = true,
                    data = audits.Select(a => new
                    {
                        id = a.Id,
                        auditNumber = a.AuditNumber,
                        auditType = a.AuditType,
                        departmentId = a.DepartmentId,
                        plantId = a.PlantId,
                        auditorId = a.AuditorId,
                        status = a.Status.ToString(),
                        scheduledDate = a.ScheduledDate,
                        completedDate = a.CompletedDate,
                        score = a.Score,
                        remarks = a.Remarks,
                        isActive = a.IsActive,
                        createdAt = a.CreatedAt,
                        updatedAt = a.UpdatedAt,
                        plant = new { id = a.Plant.Id, name = a.Plant.Name, code = a.Plant.Code },
                        department = new { id = a.Department.Id, name = a.Department.Name, code = a.Department.Code },
                        auditor = new { id = a.Auditor.Id, firstName = a.Auditor.FirstName, lastName = a.Auditor.LastName, employeeId = a.Auditor.EmployeeId },
                        questionsCount = a.Questions.Count
                    }),
                    totalCount,
                    currentPage = page,
                    totalPages,
                    message = "Audits retrieved successfully"
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetAudit(int id)
        {
            try
            {
                var audit = await _auditService.GetByIdAsync(id);
                if (audit == null)
                {
                    return NotFound(new { success = false, message = "Audit not found" });
                }

                var response = new
                {
                    success = true,
                    data = new
                    {
                        id = audit.Id,
                        auditNumber = audit.AuditNumber,
                        auditType = audit.AuditType,
                        departmentId = audit.DepartmentId,
                        plantId = audit.PlantId,
                        auditorId = audit.AuditorId,
                        status = audit.Status.ToString(),
                        scheduledDate = audit.ScheduledDate,
                        completedDate = audit.CompletedDate,
                        score = audit.Score,
                        remarks = audit.Remarks,
                        isActive = audit.IsActive,
                        createdAt = audit.CreatedAt,
                        updatedAt = audit.UpdatedAt,
                        plant = new { id = audit.Plant.Id, name = audit.Plant.Name, code = audit.Plant.Code },
                        department = new { id = audit.Department.Id, name = audit.Department.Name, code = audit.Department.Code },
                        auditor = new { id = audit.Auditor.Id, firstName = audit.Auditor.FirstName, lastName = audit.Auditor.LastName, employeeId = audit.Auditor.EmployeeId },
                        questions = audit.Questions.Select(q => new
                        {
                            id = q.Id,
                            questionText = q.QuestionText,
                            isCompliant = q.IsCompliant,
                            remarks = q.Remarks,
                            order = q.Order
                        })
                    },
                    message = "Audit retrieved successfully"
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateAudit([FromBody] CreateAuditDto dto)
        {
            try
            {
                var audit = new Audit
                {
                    AuditType = dto.AuditType,
                    DepartmentId = dto.DepartmentId,
                    PlantId = dto.PlantId,
                    AuditorId = dto.AuditorId,
                    ScheduledDate = dto.ScheduledDate,
                    Status = AuditStatus.AUDIT_PENDING
                };

                var createdAudit = await _auditService.CreateAsync(audit);

                var response = new
                {
                    success = true,
                    data = new
                    {
                        id = createdAudit.Id,
                        auditNumber = createdAudit.AuditNumber,
                        auditType = createdAudit.AuditType,
                        departmentId = createdAudit.DepartmentId,
                        plantId = createdAudit.PlantId,
                        auditorId = createdAudit.AuditorId,
                        status = createdAudit.Status.ToString(),
                        scheduledDate = createdAudit.ScheduledDate,
                        isActive = createdAudit.IsActive,
                        createdAt = createdAudit.CreatedAt,
                        updatedAt = createdAudit.UpdatedAt
                    },
                    message = "Audit created successfully"
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAudit(int id, [FromBody] UpdateAuditDto dto)
        {
            try
            {
                var audit = await _auditService.GetByIdAsync(id);
                if (audit == null)
                {
                    return NotFound(new { success = false, message = "Audit not found" });
                }

                // Update properties
                if (!string.IsNullOrEmpty(dto.AuditType))
                    audit.AuditType = dto.AuditType;

                if (dto.DepartmentId.HasValue)
                    audit.DepartmentId = dto.DepartmentId.Value;

                if (dto.AuditorId.HasValue)
                    audit.AuditorId = dto.AuditorId.Value;

                if (dto.ScheduledDate.HasValue)
                    audit.ScheduledDate = dto.ScheduledDate.Value;

                if (!string.IsNullOrEmpty(dto.Status))
                    audit.Status = Enum.Parse<AuditStatus>(dto.Status);

                if (dto.Score.HasValue)
                    audit.Score = dto.Score.Value;

                if (!string.IsNullOrEmpty(dto.Remarks))
                    audit.Remarks = dto.Remarks;

                var updatedAudit = await _auditService.UpdateAsync(audit);

                var response = new
                {
                    success = true,
                    data = new
                    {
                        id = updatedAudit.Id,
                        auditNumber = updatedAudit.AuditNumber,
                        auditType = updatedAudit.AuditType,
                        status = updatedAudit.Status.ToString(),
                        score = updatedAudit.Score,
                        remarks = updatedAudit.Remarks,
                        updatedAt = updatedAudit.UpdatedAt
                    },
                    message = "Audit updated successfully"
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAudit(int id)
        {
            try
            {
                var result = await _auditService.DeleteAsync(id);
                if (!result)
                {
                    return NotFound(new { success = false, message = "Audit not found" });
                }

                return Ok(new { success = true, message = "Audit deleted successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("{id}/start")]
        public async Task<IActionResult> StartAudit(int id)
        {
            try
            {
                var audit = await _auditService.StartAuditAsync(id);

                var response = new
                {
                    success = true,
                    data = new
                    {
                        id = audit.Id,
                        auditNumber = audit.AuditNumber,
                        status = audit.Status.ToString(),
                        updatedAt = audit.UpdatedAt
                    },
                    message = "Audit started successfully"
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("{id}/complete")]
        public async Task<IActionResult> CompleteAudit(int id, [FromBody] CompleteAuditDto dto)
        {
            try
            {
                var audit = await _auditService.CompleteAuditAsync(id, dto.Score, dto.Remarks);

                var response = new
                {
                    success = true,
                    data = new
                    {
                        id = audit.Id,
                        auditNumber = audit.AuditNumber,
                        status = audit.Status.ToString(),
                        completedDate = audit.CompletedDate,
                        score = audit.Score,
                        remarks = audit.Remarks,
                        updatedAt = audit.UpdatedAt
                    },
                    message = "Audit completed successfully"
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpGet("department/{departmentId}")]
        public async Task<IActionResult> GetAuditsByDepartment(int departmentId)
        {
            try
            {
                var audits = await _auditService.GetByDepartmentAsync(departmentId);

                var response = new
                {
                    success = true,
                    data = audits.Select(a => new
                    {
                        id = a.Id,
                        auditNumber = a.AuditNumber,
                        auditType = a.AuditType,
                        status = a.Status.ToString(),
                        scheduledDate = a.ScheduledDate,
                        score = a.Score,
                        createdAt = a.CreatedAt
                    }),
                    message = "Department audits retrieved successfully"
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpGet("plant/{plantId}")]
        public async Task<IActionResult> GetAuditsByPlant(int plantId)
        {
            try
            {
                var audits = await _auditService.GetByPlantAsync(plantId);

                var response = new
                {
                    success = true,
                    data = audits.Select(a => new
                    {
                        id = a.Id,
                        auditNumber = a.AuditNumber,
                        auditType = a.AuditType,
                        status = a.Status.ToString(),
                        scheduledDate = a.ScheduledDate,
                        department = new { id = a.Department.Id, name = a.Department.Name },
                        createdAt = a.CreatedAt
                    }),
                    message = "Plant audits retrieved successfully"
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }
    }

    public class CreateAuditDto
    {
        public string AuditType { get; set; } = string.Empty;
        public int DepartmentId { get; set; }
        public int PlantId { get; set; }
        public int AuditorId { get; set; }
        public DateTime ScheduledDate { get; set; }
    }

    public class UpdateAuditDto
    {
        public string? AuditType { get; set; }
        public int? DepartmentId { get; set; }
        public int? AuditorId { get; set; }
        public DateTime? ScheduledDate { get; set; }
        public string? Status { get; set; }
        public decimal? Score { get; set; }
        public string? Remarks { get; set; }
    }

    public class CompleteAuditDto
    {
        public decimal? Score { get; set; }
        public string? Remarks { get; set; }
    }
}
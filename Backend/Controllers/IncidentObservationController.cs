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
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SafetyManagementPortal.Backend.Data;

namespace SafetyManagementPortal.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class IncidentObservationController : ControllerBase
    {
        private readonly SafetyManagementContext _context;

        public IncidentObservationController(SafetyManagementContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<PagedResult<IncidentObservationDto>>>> GetIncidentObservations(
            [FromQuery] SearchFilter filter)
        {
            try
            {
                var query = _context.IncidentObservations
                    .Include(i => i.IncidentType)
                        .ThenInclude(it => it.Category)
                    .Include(i => i.Priority)
                    .Include(i => i.Plant)
                    .Include(i => i.Location)
                    .Include(i => i.ReportedBy)
                    .Include(i => i.Status)
                    .Include(i => i.Witnesses)
                        .ThenInclude(w => w.Employee)
                    .Include(i => i.Attachments)
                    .Where(i => !i.IsDeleted)
                    .AsQueryable();

                // Apply filters
                if (!string.IsNullOrEmpty(filter.SearchTerm))
                {
                    query = query.Where(i => i.Title.Contains(filter.SearchTerm) ||
                                           i.Description.Contains(filter.SearchTerm) ||
                                           i.IncidentNumber.Contains(filter.SearchTerm));
                }

                if (filter.PlantId.HasValue)
                    query = query.Where(i => i.PlantId == filter.PlantId.Value);

                if (filter.LocationId.HasValue)
                    query = query.Where(i => i.LocationId == filter.LocationId.Value);

                if (filter.FromDate.HasValue)
                    query = query.Where(i => i.DateTimeObserved >= filter.FromDate.Value);

                if (filter.ToDate.HasValue)
                    query = query.Where(i => i.DateTimeObserved <= filter.ToDate.Value);

                // Apply sorting
                query = query.OrderByDescending(i => i.CreatedAt);

                var totalItems = await query.CountAsync();
                var items = await query
                    .Skip((filter.PageNumber - 1) * filter.PageSize)
                    .Take(filter.PageSize)
                    .Select(i => new IncidentObservationDto
                    {
                        Id = i.Id,
                        Title = i.Title,
                        IncidentNumber = i.IncidentNumber,
                        Description = i.Description,
                        DateTimeObserved = i.DateTimeObserved,
                        CreatedAt = i.CreatedAt,
                        UpdatedAt = i.UpdatedAt,
                        CreatedBy = i.CreatedBy,
                        UpdatedBy = i.UpdatedBy
                    })
                    .ToListAsync();

                var result = new PagedResult<IncidentObservationDto>
                {
                    Items = items,
                    TotalItems = totalItems,
                    PageNumber = filter.PageNumber,
                    PageSize = filter.PageSize,
                    TotalPages = (int)Math.Ceiling((double)totalItems / filter.PageSize)
                };

                return Ok(new ApiResponse<PagedResult<IncidentObservationDto>>
                {
                    Success = true,
                    Message = "Incident observations retrieved successfully",
                    Data = result
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<PagedResult<IncidentObservationDto>>
                {
                    Success = false,
                    Message = "An error occurred while retrieving incident observations",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<IncidentObservationDto>>> GetIncidentObservation(int id)
        {
            try
            {
                var incidentObservation = await _context.IncidentObservations
                    .Include(i => i.IncidentType)
                        .ThenInclude(it => it.Category)
                    .Include(i => i.Priority)
                    .Include(i => i.Plant)
                    .Include(i => i.Location)
                    .Include(i => i.ReportedBy)
                    .Include(i => i.Status)
                    .FirstOrDefaultAsync(i => i.Id == id && !i.IsDeleted);

                if (incidentObservation == null)
                {
                    return NotFound(new ApiResponse<IncidentObservationDto>
                    {
                        Success = false,
                        Message = "Incident observation not found"
                    });
                }

                var dto = new IncidentObservationDto
                {
                    Id = incidentObservation.Id,
                    Title = incidentObservation.Title,
                    IncidentNumber = incidentObservation.IncidentNumber,
                    Description = incidentObservation.Description,
                    DateTimeObserved = incidentObservation.DateTimeObserved,
                    CreatedAt = incidentObservation.CreatedAt,
                    UpdatedAt = incidentObservation.UpdatedAt,
                    CreatedBy = incidentObservation.CreatedBy,
                    UpdatedBy = incidentObservation.UpdatedBy
                };

                return Ok(new ApiResponse<IncidentObservationDto>
                {
                    Success = true,
                    Message = "Incident observation retrieved successfully",
                    Data = dto
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<IncidentObservationDto>
                {
                    Success = false,
                    Message = "An error occurred while retrieving the incident observation",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<IncidentObservationDto>>> CreateIncidentObservation(
            CreateIncidentObservationDto createDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new ApiResponse<IncidentObservationDto>
                    {
                        Success = false,
                        Message = "Validation failed",
                        Errors = ModelState.SelectMany(x => x.Value.Errors).Select(x => x.ErrorMessage).ToList()
                    });
                }

                // Generate incident number
                var incidentNumber = await GenerateIncidentNumber();

                var incidentObservation = new IncidentObservation
                {
                    Title = createDto.Title,
                    IncidentNumber = incidentNumber,
                    Description = createDto.Description,
                    IncidentTypeId = createDto.IncidentTypeId,
                    PriorityId = createDto.PriorityId,
                    PlantId = createDto.PlantId,
                    LocationId = createDto.LocationId,
                    DateTimeObserved = createDto.DateTimeObserved,
                    ReportedById = createDto.ReportedById,
                    ImmediateActions = createDto.ImmediateActions,
                    StatusId = 1, // Default status
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = 1 // TODO: Get from authentication context
                };

                _context.IncidentObservations.Add(incidentObservation);
                await _context.SaveChangesAsync();

                return CreatedAtAction(
                    nameof(GetIncidentObservation),
                    new { id = incidentObservation.Id },
                    new ApiResponse<IncidentObservationDto>
                    {
                        Success = true,
                        Message = "Incident observation created successfully",
                        Data = new IncidentObservationDto { Id = incidentObservation.Id, IncidentNumber = incidentObservation.IncidentNumber }
                    });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<IncidentObservationDto>
                {
                    Success = false,
                    Message = "An error occurred while creating the incident observation",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        private async Task<string> GenerateIncidentNumber()
        {
            var year = DateTime.Now.Year;
            var count = await _context.IncidentObservations
                .Where(i => i.CreatedAt.Year == year)
                .CountAsync();

            return $"INC-{year}-{(count + 1):D6}";
        }
    }
}

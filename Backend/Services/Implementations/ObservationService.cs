using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.DTOs.Common;
using Backend.DTOs.Observation;
using Backend.Models;
using Backend.Services.Interfaces;

namespace Backend.Services.Implementations
{
    public class ObservationService : BaseService<Observation, ObservationDto, CreateObservationDto, UpdateObservationDto>, IObservationService
    {
        public ObservationService(ApplicationDbContext context, IMapper mapper, ILogger<ObservationService> logger)
            : base(context, mapper, logger)
        {
        }

        public async Task<ApiResponse<IEnumerable<ObservationDto>>> GetObservationsByStatusAsync(string status)
        {
            try
            {
                if (!Enum.TryParse<ObservationStatus>(status, true, out var statusEnum))
                {
                    return ApiResponse<IEnumerable<ObservationDto>>.Failure("Invalid status value");
                }

                var observations = await _context.Observations
                    .Where(o => o.Status == statusEnum)
                    .Include(o => o.Reporter)
                    .Include(o => o.Assignee)
                    .Include(o => o.Plant)
                    .Include(o => o.Department)
                    .Include(o => o.HazardCategory)
                    .Include(o => o.HazardType)
                    .ToListAsync();

                var observationDtos = _mapper.Map<IEnumerable<ObservationDto>>(observations);
                return ApiResponse<IEnumerable<ObservationDto>>.Success(observationDtos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting observations by status {Status}", status);
                return ApiResponse<IEnumerable<ObservationDto>>.Failure("An error occurred while retrieving observations");
            }
        }

        public async Task<ApiResponse<IEnumerable<ObservationDto>>> GetObservationsByReporterAsync(int reporterId)
        {
            try
            {
                var observations = await _context.Observations
                    .Where(o => o.ReportedBy == reporterId)
                    .Include(o => o.Reporter)
                    .Include(o => o.Assignee)
                    .Include(o => o.Plant)
                    .Include(o => o.Department)
                    .Include(o => o.HazardCategory)
                    .Include(o => o.HazardType)
                    .ToListAsync();

                var observationDtos = _mapper.Map<IEnumerable<ObservationDto>>(observations);
                return ApiResponse<IEnumerable<ObservationDto>>.Success(observationDtos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting observations by reporter {ReporterId}", reporterId);
                return ApiResponse<IEnumerable<ObservationDto>>.Failure("An error occurred while retrieving observations");
            }
        }

        public async Task<ApiResponse<IEnumerable<ObservationDto>>> GetObservationsByAssigneeAsync(int assigneeId)
        {
            try
            {
                var observations = await _context.Observations
                    .Where(o => o.AssignedTo == assigneeId)
                    .Include(o => o.Reporter)
                    .Include(o => o.Assignee)
                    .Include(o => o.Plant)
                    .Include(o => o.Department)
                    .Include(o => o.HazardCategory)
                    .Include(o => o.HazardType)
                    .ToListAsync();

                var observationDtos = _mapper.Map<IEnumerable<ObservationDto>>(observations);
                return ApiResponse<IEnumerable<ObservationDto>>.Success(observationDtos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting observations by assignee {AssigneeId}", assigneeId);
                return ApiResponse<IEnumerable<ObservationDto>>.Failure("An error occurred while retrieving observations");
            }
        }

        public async Task<ApiResponse<IEnumerable<ObservationDto>>> GetOverdueObservationsAsync()
        {
            try
            {
                var now = DateTime.UtcNow;
                var observations = await _context.Observations
                    .Where(o => o.DueDate.HasValue && o.DueDate < now && 
                               o.Status != ObservationStatus.Completed && 
                               o.Status != ObservationStatus.Closed)
                    .Include(o => o.Reporter)
                    .Include(o => o.Assignee)
                    .Include(o => o.Plant)
                    .Include(o => o.Department)
                    .Include(o => o.HazardCategory)
                    .Include(o => o.HazardType)
                    .ToListAsync();

                var observationDtos = _mapper.Map<IEnumerable<ObservationDto>>(observations);
                return ApiResponse<IEnumerable<ObservationDto>>.Success(observationDtos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting overdue observations");
                return ApiResponse<IEnumerable<ObservationDto>>.Failure("An error occurred while retrieving overdue observations");
            }
        }

        public async Task<ApiResponse<ObservationDto>> AssignObservationAsync(int observationId, int assigneeId)
        {
            try
            {
                var observation = await _context.Observations.FindAsync(observationId);
                if (observation == null)
                {
                    return ApiResponse<ObservationDto>.Failure("Observation not found");
                }

                var assignee = await _context.Users.FindAsync(assigneeId);
                if (assignee == null)
                {
                    return ApiResponse<ObservationDto>.Failure("Assignee not found");
                }

                observation.AssignedTo = assigneeId;
                observation.Status = ObservationStatus.InProgress;
                observation.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                var observationDto = _mapper.Map<ObservationDto>(observation);
                return ApiResponse<ObservationDto>.Success(observationDto, "Observation assigned successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error assigning observation {ObservationId} to {AssigneeId}", observationId, assigneeId);
                return ApiResponse<ObservationDto>.Failure("An error occurred while assigning the observation");
            }
        }

        public async Task<ApiResponse<ObservationDto>> UpdateStatusAsync(int observationId, string status)
        {
            try
            {
                if (!Enum.TryParse<ObservationStatus>(status, true, out var statusEnum))
                {
                    return ApiResponse<ObservationDto>.Failure("Invalid status value");
                }

                var observation = await _context.Observations.FindAsync(observationId);
                if (observation == null)
                {
                    return ApiResponse<ObservationDto>.Failure("Observation not found");
                }

                observation.Status = statusEnum;
                observation.UpdatedAt = DateTime.UtcNow;

                if (statusEnum == ObservationStatus.Completed)
                {
                    observation.CompletedAt = DateTime.UtcNow;
                }

                await _context.SaveChangesAsync();

                var observationDto = _mapper.Map<ObservationDto>(observation);
                return ApiResponse<ObservationDto>.Success(observationDto, "Status updated successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating status for observation {ObservationId}", observationId);
                return ApiResponse<ObservationDto>.Failure("An error occurred while updating the status");
            }
        }

        protected override string GenerateNumber()
        {
            return $"OBS-{DateTime.Now:yyyyMMdd}-{Random.Shared.Next(1000, 9999)}";
        }
    }
}
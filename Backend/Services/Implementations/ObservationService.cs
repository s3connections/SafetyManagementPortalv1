using Backend.Data;
using Backend.Models;
using Backend.DTOs;
using Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using AutoMapper;

namespace Backend.Services.Implementations
{
    public class ObservationService : IObservationService
    {
        private readonly SafetyDbContext _context;
        private readonly IMapper _mapper;
        private readonly ILogger<ObservationService> _logger;

        public ObservationService(SafetyDbContext context, IMapper mapper, ILogger<ObservationService> logger)
        {
            _context = context;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<ApiResponse<IEnumerable<ObservationDto>>> GetAllObservationsAsync()
        {
            try
            {
                var observations = await _context.Observations
                    .Include(o => o.Plant)
                    .Include(o => o.Department)
                    .Include(o => o.Reporter)
                    .Include(o => o.AssignedTo)
                    .Include(o => o.HazardType)
                    .ThenInclude(ht => ht.HazardCategory)
                    .OrderByDescending(o => o.CreatedAt)
                    .ToListAsync();

                var observationDtos = _mapper.Map<IEnumerable<ObservationDto>>(observations);
                return ApiResponse<IEnumerable<ObservationDto>>.SuccessResult(observationDtos, "Observations retrieved successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving all observations");
                return ApiResponse<IEnumerable<ObservationDto>>.FailureResult(ex, "Error retrieving observations");
            }
        }

        public async Task<ApiResponse<ObservationDto>> GetObservationByIdAsync(int id)
        {
            try
            {
                var observation = await _context.Observations
                    .Include(o => o.Plant)
                    .Include(o => o.Department)
                    .Include(o => o.Reporter)
                    .Include(o => o.AssignedTo)
                    .Include(o => o.HazardType)
                    .ThenInclude(ht => ht.HazardCategory)
                    .FirstOrDefaultAsync(o => o.Id == id);

                if (observation == null)
                {
                    return ApiResponse<ObservationDto>.FailureResult($"Observation with ID {id} not found");
                }

                var observationDto = _mapper.Map<ObservationDto>(observation);
                return ApiResponse<ObservationDto>.SuccessResult(observationDto, "Observation retrieved successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving observation {ObservationId}", id);
                return ApiResponse<ObservationDto>.FailureResult(ex, "Error retrieving observation");
            }
        }

        public async Task<ApiResponse<ObservationDto>> CreateObservationAsync(CreateObservationDto createObservationDto)
        {
            try
            {
                var observation = _mapper.Map<Observation>(createObservationDto);
                observation.CreatedAt = DateTime.UtcNow;
                observation.Status = ObservationStatus.Open;

                _context.Observations.Add(observation);
                await _context.SaveChangesAsync();

                var createdObservation = await GetObservationByIdAsync(observation.Id);
                return createdObservation.Success 
                    ? ApiResponse<ObservationDto>.SuccessResult(createdObservation.Data!, "Observation created successfully")
                    : ApiResponse<ObservationDto>.FailureResult("Error retrieving created observation");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating observation");
                return ApiResponse<ObservationDto>.FailureResult(ex, "Error creating observation");
            }
        }

        public async Task<ApiResponse<ObservationDto>> UpdateObservationAsync(int id, UpdateObservationDto updateObservationDto)
        {
            try
            {
                var observation = await _context.Observations.FindAsync(id);
                if (observation == null)
                {
                    return ApiResponse<ObservationDto>.FailureResult($"Observation with ID {id} not found");
                }

                _mapper.Map(updateObservationDto, observation);
                observation.UpdatedAt = DateTime.UtcNow;

                _context.Observations.Update(observation);
                await _context.SaveChangesAsync();

                var updatedObservation = await GetObservationByIdAsync(observation.Id);
                return updatedObservation.Success 
                    ? ApiResponse<ObservationDto>.SuccessResult(updatedObservation.Data!, "Observation updated successfully")
                    : ApiResponse<ObservationDto>.FailureResult("Error retrieving updated observation");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating observation {ObservationId}", id);
                return ApiResponse<ObservationDto>.FailureResult(ex, "Error updating observation");
            }
        }

        public async Task<ApiResponse<bool>> DeleteObservationAsync(int id)
        {
            try
            {
                var observation = await _context.Observations.FindAsync(id);
                if (observation == null)
                {
                    return ApiResponse<bool>.FailureResult($"Observation with ID {id} not found");
                }

                _context.Observations.Remove(observation);
                await _context.SaveChangesAsync();

                return ApiResponse<bool>.SuccessResult(true, "Observation deleted successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting observation {ObservationId}", id);
                return ApiResponse<bool>.FailureResult(ex, "Error deleting observation");
            }
        }

        public async Task<ApiResponse<IEnumerable<ObservationDto>>> GetObservationsByStatusAsync(ObservationStatus status)
        {
            try
            {
                var observations = await _context.Observations
                    .Include(o => o.Plant)
                    .Include(o => o.Department)
                    .Include(o => o.Reporter)
                    .Include(o => o.AssignedTo)
                    .Include(o => o.HazardType)
                    .ThenInclude(ht => ht.HazardCategory)
                    .Where(o => o.Status == status)
                    .OrderByDescending(o => o.CreatedAt)
                    .ToListAsync();

                var observationDtos = _mapper.Map<IEnumerable<ObservationDto>>(observations);
                return ApiResponse<IEnumerable<ObservationDto>>.SuccessResult(observationDtos, $"Observations with status {status} retrieved successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving observations by status {Status}", status);
                return ApiResponse<IEnumerable<ObservationDto>>.FailureResult(ex, "Error retrieving observations by status");
            }
        }

        public async Task<ApiResponse<IEnumerable<ObservationDto>>> GetObservationsByPriorityAsync(Priority priority)
        {
            try
            {
                var observations = await _context.Observations
                    .Include(o => o.Plant)
                    .Include(o => o.Department)
                    .Include(o => o.Reporter)
                    .Include(o => o.AssignedTo)
                    .Include(o => o.HazardType)
                    .ThenInclude(ht => ht.HazardCategory)
                    .Where(o => o.Priority == priority)
                    .OrderByDescending(o => o.CreatedAt)
                    .ToListAsync();

                var observationDtos = _mapper.Map<IEnumerable<ObservationDto>>(observations);
                return ApiResponse<IEnumerable<ObservationDto>>.SuccessResult(observationDtos, $"Observations with priority {priority} retrieved successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving observations by priority {Priority}", priority);
                return ApiResponse<IEnumerable<ObservationDto>>.FailureResult(ex, "Error retrieving observations by priority");
            }
        }

        public async Task<ApiResponse<IEnumerable<ObservationDto>>> GetObservationsByTypeAsync(ObservationType type)
        {
            try
            {
                var observations = await _context.Observations
                    .Include(o => o.Plant)
                    .Include(o => o.Department)
                    .Include(o => o.Reporter)
                    .Include(o => o.AssignedTo)
                    .Include(o => o.HazardType)
                    .ThenInclude(ht => ht.HazardCategory)
                    .Where(o => o.Type == type)
                    .OrderByDescending(o => o.CreatedAt)
                    .ToListAsync();

                var observationDtos = _mapper.Map<IEnumerable<ObservationDto>>(observations);
                return ApiResponse<IEnumerable<ObservationDto>>.SuccessResult(observationDtos, $"Observations of type {type} retrieved successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving observations by type {Type}", type);
                return ApiResponse<IEnumerable<ObservationDto>>.FailureResult(ex, "Error retrieving observations by type");
            }
        }

        public async Task<ApiResponse<IEnumerable<ObservationDto>>> GetObservationsByPlantAsync(int plantId)
        {
            try
            {
                var observations = await _context.Observations
                    .Include(o => o.Plant)
                    .Include(o => o.Department)
                    .Include(o => o.Reporter)
                    .Include(o => o.AssignedTo)
                    .Include(o => o.HazardType)
                    .ThenInclude(ht => ht.HazardCategory)
                    .Where(o => o.PlantId == plantId)
                    .OrderByDescending(o => o.CreatedAt)
                    .ToListAsync();

                var observationDtos = _mapper.Map<IEnumerable<ObservationDto>>(observations);
                return ApiResponse<IEnumerable<ObservationDto>>.SuccessResult(observationDtos, $"Observations for plant {plantId} retrieved successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving observations by plant {PlantId}", plantId);
                return ApiResponse<IEnumerable<ObservationDto>>.FailureResult(ex, "Error retrieving observations by plant");
            }
        }

        public async Task<ApiResponse<IEnumerable<ObservationDto>>> GetObservationsByDepartmentAsync(int departmentId)
        {
            try
            {
                var observations = await _context.Observations
                    .Include(o => o.Plant)
                    .Include(o => o.Department)
                    .Include(o => o.Reporter)
                    .Include(o => o.AssignedTo)
                    .Include(o => o.HazardType)
                    .ThenInclude(ht => ht.HazardCategory)
                    .Where(o => o.DepartmentId == departmentId)
                    .OrderByDescending(o => o.CreatedAt)
                    .ToListAsync();

                var observationDtos = _mapper.Map<IEnumerable<ObservationDto>>(observations);
                return ApiResponse<IEnumerable<ObservationDto>>.SuccessResult(observationDtos, $"Observations for department {departmentId} retrieved successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving observations by department {DepartmentId}", departmentId);
                return ApiResponse<IEnumerable<ObservationDto>>.FailureResult(ex, "Error retrieving observations by department");
            }
        }

        public async Task<ApiResponse<IEnumerable<ObservationDto>>> GetObservationsByUserAsync(int userId)
        {
            try
            {
                var observations = await _context.Observations
                    .Include(o => o.Plant)
                    .Include(o => o.Department)
                    .Include(o => o.Reporter)
                    .Include(o => o.AssignedTo)
                    .Include(o => o.HazardType)
                    .ThenInclude(ht => ht.HazardCategory)
                    .Where(o => o.ReporterId == userId || o.AssignedToId == userId)
                    .OrderByDescending(o => o.CreatedAt)
                    .ToListAsync();

                var observationDtos = _mapper.Map<IEnumerable<ObservationDto>>(observations);
                return ApiResponse<IEnumerable<ObservationDto>>.SuccessResult(observationDtos, $"Observations for user {userId} retrieved successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving observations by user {UserId}", userId);
                return ApiResponse<IEnumerable<ObservationDto>>.FailureResult(ex, "Error retrieving observations by user");
            }
        }

        public async Task<ApiResponse<IEnumerable<ObservationDto>>> GetObservationsByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            try
            {
                var observations = await _context.Observations
                    .Include(o => o.Plant)
                    .Include(o => o.Department)
                    .Include(o => o.Reporter)
                    .Include(o => o.AssignedTo)
                    .Include(o => o.HazardType)
                    .ThenInclude(ht => ht.HazardCategory)
                    .Where(o => o.CreatedAt >= startDate && o.CreatedAt <= endDate)
                    .OrderByDescending(o => o.CreatedAt)
                    .ToListAsync();

                var observationDtos = _mapper.Map<IEnumerable<ObservationDto>>(observations);
                return ApiResponse<IEnumerable<ObservationDto>>.SuccessResult(observationDtos, "Observations retrieved successfully for date range");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving observations by date range {StartDate} - {EndDate}", startDate, endDate);
                return ApiResponse<IEnumerable<ObservationDto>>.FailureResult(ex, "Error retrieving observations by date range");
            }
        }

        public async Task<ApiResponse<ObservationStatisticsDto>> GetObservationStatisticsAsync()
        {
            try
            {
                var totalObservations = await _context.Observations.CountAsync();
                var openObservations = await _context.Observations.CountAsync(o => o.Status == ObservationStatus.Open);
                var inProgressObservations = await _context.Observations.CountAsync(o => o.Status == ObservationStatus.InProgress);
                var closedObservations = await _context.Observations.CountAsync(o => o.Status == ObservationStatus.Closed);
                
                var highPriorityObservations = await _context.Observations.CountAsync(o => o.Priority == Priority.High);
                var mediumPriorityObservations = await _context.Observations.CountAsync(o => o.Priority == Priority.Medium);
                var lowPriorityObservations = await _context.Observations.CountAsync(o => o.Priority == Priority.Low);

                var statistics = new ObservationStatisticsDto
                {
                    TotalObservations = totalObservations,
                    OpenObservations = openObservations,
                    InProgressObservations = inProgressObservations,
                    ClosedObservations = closedObservations,
                    HighPriorityObservations = highPriorityObservations,
                    MediumPriorityObservations = mediumPriorityObservations,
                    LowPriorityObservations = lowPriorityObservations
                };

                return ApiResponse<ObservationStatisticsDto>.SuccessResult(statistics, "Statistics retrieved successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving observation statistics");
                return ApiResponse<ObservationStatisticsDto>.FailureResult(ex, "Error retrieving observation statistics");
            }
        }

        public async Task<ApiResponse<IEnumerable<ObservationDto>>> SearchObservationsAsync(string searchTerm)
        {
            try
            {
                var observations = await _context.Observations
                    .Include(o => o.Plant)
                    .Include(o => o.Department)
                    .Include(o => o.Reporter)
                    .Include(o => o.AssignedTo)
                    .Include(o => o.HazardType)
                    .ThenInclude(ht => ht.HazardCategory)
                    .Where(o => o.Title.Contains(searchTerm) || 
                               o.Description.Contains(searchTerm) ||
                               o.Location.Contains(searchTerm) ||
                               o.Plant.Name.Contains(searchTerm) ||
                               o.Department.Name.Contains(searchTerm))
                    .OrderByDescending(o => o.CreatedAt)
                    .ToListAsync();

                var observationDtos = _mapper.Map<IEnumerable<ObservationDto>>(observations);
                return ApiResponse<IEnumerable<ObservationDto>>.SuccessResult(observationDtos, "Search completed successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching observations with term {SearchTerm}", searchTerm);
                return ApiResponse<IEnumerable<ObservationDto>>.FailureResult(ex, "Error searching observations");
            }
        }
    }
}
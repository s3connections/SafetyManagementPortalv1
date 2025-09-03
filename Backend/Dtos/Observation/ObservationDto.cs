using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs.Observation
{
    public class ObservationDto
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(20)]
        public string TicketNumber { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(2000)]
        public string Description { get; set; } = string.Empty;
        
        [Required]
        public string ObservationType { get; set; } = string.Empty;
        
        [Required]
        public string Status { get; set; } = string.Empty;
        
        [Required]
        public string Priority { get; set; } = string.Empty;
        
        public int ReportedBy { get; set; }
        public int? AssignedTo { get; set; }
        public int PlantId { get; set; }
        public int DepartmentId { get; set; }
        
        [Required]
        [MaxLength(500)]
        public string Location { get; set; } = string.Empty;
        
        public int? HazardCategoryId { get; set; }
        public int? HazardTypeId { get; set; }
        public string? ImageUrl { get; set; }
        public DateTime? DueDate { get; set; }
        public DateTime? CompletedAt { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        
        // Navigation properties for display
        public string ReporterName { get; set; } = string.Empty;
        public string AssigneeName { get; set; } = string.Empty;
        public string PlantName { get; set; } = string.Empty;
        public string DepartmentName { get; set; } = string.Empty;
        public string HazardCategoryName { get; set; } = string.Empty;
        public string HazardTypeName { get; set; } = string.Empty;
    }

    public class CreateObservationDto
    {
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(2000)]
        public string Description { get; set; } = string.Empty;
        
        [Required]
        public string ObservationType { get; set; } = string.Empty;
        
        [Required]
        public string Priority { get; set; } = string.Empty;
        
        public int PlantId { get; set; }
        public int DepartmentId { get; set; }
        
        [Required]
        [MaxLength(500)]
        public string Location { get; set; } = string.Empty;
        
        public int? HazardCategoryId { get; set; }
        public int? HazardTypeId { get; set; }
        public int? AssignedTo { get; set; }
        public DateTime? DueDate { get; set; }
    }

    public class UpdateObservationDto
    {
        [MaxLength(200)]
        public string? Title { get; set; }
        
        [MaxLength(2000)]
        public string? Description { get; set; }
        
        public string? Priority { get; set; }
        public int? AssignedTo { get; set; }
        public string? Status { get; set; }
        public DateTime? DueDate { get; set; }
    }

    public class ObservationStatisticsDto
    {
        public int TotalObservations { get; set; }
        public int OpenObservations { get; set; }
        public int InProgressObservations { get; set; }
        public int CompletedObservations { get; set; }
        public int OverdueObservations { get; set; }
        public Dictionary<string, int> ObservationsByType { get; set; } = new();
        public Dictionary<string, int> ObservationsByStatus { get; set; } = new();
        public Dictionary<string, int> ObservationsByPriority { get; set; } = new();
    }
}
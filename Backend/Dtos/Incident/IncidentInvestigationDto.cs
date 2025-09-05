using Backend.Models;
using System.ComponentModel.DataAnnotations;



namespace Backend.Dtos.Incident
{
    public class IncidentObservationDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public IncidentType? IncidentType { get; set; }
        public IncidentSeverity Severity { get; set; }
        public DateTime IncidentDate { get; set; }
        public string? Location { get; set; }
        public string IncidentNumber { get; set; } = string.Empty;
        public string? ImmediateActions { get; set; }
        public string? RootCauseAnalysis { get; set; }
        public string? CorrectiveActions { get; set; }
        public string? PreventiveActions { get; set; }
        public DateTime? InvestigationCompletedDate { get; set; }
        public string? ImagePath { get; set; }
        public bool RequiresReporting { get; set; }
        public bool IsReportedToAuthorities { get; set; }
        public DateTime? ReportedDate { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        
        // User information
        public int ReportedByUserId { get; set; }
        public string ReportedByUserName { get; set; } = string.Empty;
        public string ReportedByUserEmail { get; set; } = string.Empty;
        
        public int? InvestigatedByUserId { get; set; }
        public string? InvestigatedByUserName { get; set; }
        public string? InvestigatedByUserEmail { get; set; }
        
        // Plant and Department information
        public int? PlantId { get; set; }
        public string? PlantName { get; set; }
        
        public int? DepartmentId { get; set; }
        public string? DepartmentName { get; set; }
    }

    public class CreateIncidentObservationDto
    {
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [MaxLength(2000)]
        public string Description { get; set; } = string.Empty;

        [Required]
        public IncidentType IncidentType { get; set; }

        [Required]
        public IncidentSeverity Severity { get; set; }

        [Required]
        public DateTime IncidentDate { get; set; }

        [MaxLength(100)]
        public string? Location { get; set; }

        [MaxLength(2000)]
        public string? ImmediateActions { get; set; }

        public bool RequiresReporting { get; set; } = false;

        [Required]
        public int ReportedByUserId { get; set; }

        public int? PlantId { get; set; }
        public int? DepartmentId { get; set; }
    }

    public class UpdateIncidentObservationDto
    {
        [MaxLength(200)]
        public string? Title { get; set; }

        [MaxLength(2000)]
        public string? Description { get; set; }

        public IncidentType? IncidentType { get; set; }
        public IncidentSeverity? Severity { get; set; }
        public DateTime? IncidentDate { get; set; }

        [MaxLength(100)]
        public string? Location { get; set; }

        [MaxLength(2000)]
        public string? ImmediateActions { get; set; }

        [MaxLength(2000)]
        public string? RootCauseAnalysis { get; set; }

        [MaxLength(2000)]
        public string? CorrectiveActions { get; set; }

        [MaxLength(2000)]
        public string? PreventiveActions { get; set; }

        public bool? RequiresReporting { get; set; }
        public bool? IsReportedToAuthorities { get; set; }
        public DateTime? ReportedDate { get; set; }

        public int? InvestigatedByUserId { get; set; }
        public int? PlantId { get; set; }
        public int? DepartmentId { get; set; }
    }
}
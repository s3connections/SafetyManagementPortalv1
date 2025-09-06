using System.ComponentModel.DataAnnotations;
using SafetyManagementPortal.Backend.enums;


namespace SafetyManagementPortal.Backend.DTOs.Incident
{
    public class CreateIncidentInvestigationDto
    {
        [Required]
        [StringLength(50)]
        public string IncidentNumber { get; set; } = string.Empty;

        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        [StringLength(2000)]
        public string? Description { get; set; }

        [Required]
        public IncidentSeverity Severity { get; set; }

        [Required]
        [StringLength(200)]
        public string Location { get; set; } = string.Empty;

        [Required]
        public DateTime IncidentDate { get; set; }

        [Required]
        public DateTime ReportedDate { get; set; }

        public DateTime? InvestigationStartDate { get; set; }

        [StringLength(100)]
        public string? InvestigatorName { get; set; }

        public int? InvestigatorId { get; set; }

        [StringLength(1000)]
        public string? RootCause { get; set; }

        [StringLength(2000)]
        public string? CorrectiveActions { get; set; }

        [StringLength(2000)]
        public string? PreventiveActions { get; set; }
        public int IncidentObservationId { get; set; }
        public int LeadInvestigatorId { get; set; }
        public DateTime? TargetCompletionDate { get; set; }
        public string InitialFindings { get; set; } = string.Empty;
    }

    public class UpdateIncidentInvestigationDto
    {
        [Required]
        public int Id { get; set; }

        [StringLength(200)]
        public string? Title { get; set; }

        [StringLength(2000)]
        public string? Description { get; set; }

        public IncidentSeverity? Severity { get; set; }

        [StringLength(200)]
        public string? Location { get; set; }

        public DateTime? IncidentDate { get; set; }

        public DateTime? InvestigationStartDate { get; set; }

        public DateTime? InvestigationCompletionDate { get; set; }

        [StringLength(50)]
        public string? InvestigationStatus { get; set; }

        [StringLength(100)]
        public string? InvestigatorName { get; set; }

        public int? InvestigatorId { get; set; }

        [StringLength(1000)]
        public string? RootCause { get; set; }

        [StringLength(2000)]
        public string? CorrectiveActions { get; set; }

        [StringLength(2000)]
        public string? PreventiveActions { get; set; }

        public bool? IsCompleted { get; set; }
        public DateTime? CompletedDate { get; set; }
    }
}

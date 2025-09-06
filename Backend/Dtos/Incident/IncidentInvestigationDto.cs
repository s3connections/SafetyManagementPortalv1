using System.ComponentModel.DataAnnotations;
using SafetyManagementPortal.Backend.enums;
using SafetyManagementPortal.Backend.Models;


namespace SafetyManagementPortal.Backend.DTOs.Incident
{
    public class IncidentInvestigationDto
    {
        public int Id { get; set; }
        
        [Required]
        public string IncidentNumber { get; set; } = string.Empty;
        
        [Required]
        public string Title { get; set; } = string.Empty;
        
        public string? Description { get; set; }
        
        [Required]
        public IncidentSeverity Severity { get; set; }
        
        [Required]
        public string Location { get; set; } = string.Empty;
        
        [Required]
        public DateTime IncidentDate { get; set; }
        
        [Required]
        public DateTime ReportedDate { get; set; }
        
        public DateTime? InvestigationStartDate { get; set; }
        
        public DateTime? InvestigationCompletionDate { get; set; }
        
        public string? InvestigationStatus { get; set; }
        
        public string? InvestigatorName { get; set; }
        
        public int? InvestigatorId { get; set; }
        
        public string? RootCause { get; set; }
        
        public string? CorrectiveActions { get; set; }
        
        public string? PreventiveActions { get; set; }
        
        public bool IsCompleted { get; set; }
        
        public DateTime CreatedAt { get; set; }
        
        public DateTime? UpdatedAt { get; set; }
        
        // Navigation properties
        public List<InvestigationWitnessDto>? Witnesses { get; set; }
        public List<InvestigationTimelineDto>? Timeline { get; set; }
    }
}

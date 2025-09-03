using Backend.DTOs.Common;
using Backend.DTOs.Employee;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs.Incident
{
    public class IncidentInvestigationDto : BaseDto
    {
        public int IncidentObservationId { get; set; }
        public IncidentObservationDto IncidentObservation { get; set; }
        public int LeadInvestigatorId { get; set; }
        public EmployeeDto LeadInvestigator { get; set; }
        public DateTime TargetCompletionDate { get; set; }
        public DateTime? CompletedDate { get; set; }
        public string? InitialFindings { get; set; }
        public string? FinalReport { get; set; }
        public string? RootCause { get; set; }
        public string? RecommendedActions { get; set; }
        public string InvestigationStatus { get; set; }
        public List<InvestigationPanelDto>? PanelMembers { get; set; }
        public List<InvestigationTimelineDto>? Timeline { get; set; }
        public List<InvestigationDocumentDto>? Documents { get; set; }
    }

    public class CreateIncidentInvestigationDto
    {
        [Required]
        public int IncidentObservationId { get; set; }
        
        [Required]
        public List<int> PanelMemberIds { get; set; }
        
        [Required]
        public int LeadInvestigatorId { get; set; }
        
        [Required]
        public DateTime TargetCompletionDate { get; set; }
        
        public string? InitialFindings { get; set; }
    }

    public class UpdateIncidentInvestigationDto
    {
        public List<int>? PanelMemberIds { get; set; }
        public int? LeadInvestigatorId { get; set; }
        public DateTime? TargetCompletionDate { get; set; }
        public string? InitialFindings { get; set; }
        public string? FinalReport { get; set; }
        public string? RootCause { get; set; }
        public string? RecommendedActions { get; set; }
        public DateTime? CompletedDate { get; set; }
    }

    public class InvestigationPanelDto : BaseDto
    {
        public int InvestigationId { get; set; }
        public int EmployeeId { get; set; }
        public EmployeeDto Employee { get; set; }
        public string Role { get; set; }
        public bool IsLead { get; set; }
    }

    public class InvestigationTimelineDto : BaseDto
    {
        public int InvestigationId { get; set; }
        public string Activity { get; set; }
        public string Description { get; set; }
        public DateTime ActivityDate { get; set; }
        public int PerformedById { get; set; }
        public EmployeeDto PerformedBy { get; set; }
    }

    public class InvestigationDocumentDto : BaseDto
    {
        public int InvestigationId { get; set; }
        public string FileName { get; set; }
        public string FilePath { get; set; }
        public string DocumentType { get; set; }
        public string? Description { get; set; }
        public string? FileUrl { get; set; }
    }

    public class CreateInvestigationWitnessDto
    {
        [Required]
        public int IncidentObservationId { get; set; }
        
        [Required]
        public int EmployeeId { get; set; }
        
        [Required]
        public string Statement { get; set; }
        
        public DateTime? InterviewDate { get; set; }
    }
}
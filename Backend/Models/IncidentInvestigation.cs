using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SafetyManagementPortal.Backend.Models
{
    [Table("IncidentInvestigations")]
    public class IncidentInvestigation : BaseEntity
    {
        [Required]
        public int IncidentObservationId { get; set; }
        
        [ForeignKey("IncidentObservationId")]
        public virtual IncidentObservation IncidentObservation { get; set; }
        
        [Required]
        public int LeadInvestigatorId { get; set; }
        
        [ForeignKey("LeadInvestigatorId")]
        public virtual Employee LeadInvestigator { get; set; }
        
        [Required]
        public DateTime TargetCompletionDate { get; set; }
        
        public DateTime? CompletedDate { get; set; }
        
        public string? InitialFindings { get; set; }
        
        public string? FinalReport { get; set; }
        
        public string? RootCause { get; set; }
        
        public string? RecommendedActions { get; set; }
        
        [Required]
        [StringLength(50)]
        public string InvestigationStatus { get; set; } = "In Progress";
        
        // Navigation Properties
        public virtual ICollection<InvestigationPanel> PanelMembers { get; set; } = new List<InvestigationPanel>();
        public virtual ICollection<InvestigationTimeline> Timeline { get; set; } = new List<InvestigationTimeline>();
        public virtual ICollection<InvestigationDocument> Documents { get; set; } = new List<InvestigationDocument>();
    }
}

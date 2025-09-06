using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SafetyManagementPortal.Backend.Models
{
    [Table("InvestigationTimelines")]
    public class InvestigationTimeline : BaseEntity
    {
        [Required]
        public int InvestigationId { get; set; }
        
        [ForeignKey("InvestigationId")]
        public virtual IncidentInvestigation Investigation { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Activity { get; set; }
        
        [Required]
        public string Description { get; set; }
        
        [Required]
        public DateTime ActivityDate { get; set; }
        
        [Required]
        public int PerformedById { get; set; }
        
        [ForeignKey("PerformedById")]
        public virtual Employee PerformedBy { get; set; }
    }
}

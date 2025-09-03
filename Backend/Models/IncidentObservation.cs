using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    [Table("IncidentObservations")]
    public class IncidentObservation : BaseEntity
    {
        [Required]
        [StringLength(200)]
        public string Title { get; set; }
        
        [Required]
        [StringLength(50)]
        public string IncidentNumber { get; set; }
        
        [Required]
        public string Description { get; set; }
        
        [Required]
        public int IncidentTypeId { get; set; }
        
        [ForeignKey("IncidentTypeId")]
        public virtual IncidentType IncidentType { get; set; }
        
        [Required]
        public int PriorityId { get; set; }
        
        [ForeignKey("PriorityId")]
        public virtual Priority Priority { get; set; }
        
        [Required]
        public int PlantId { get; set; }
        
        [ForeignKey("PlantId")]
        public virtual Plant Plant { get; set; }
        
        [Required]
        public int LocationId { get; set; }
        
        [ForeignKey("LocationId")]
        public virtual Location Location { get; set; }
        
        [Required]
        public DateTime DateTimeObserved { get; set; }
        
        public int? ReportedById { get; set; }
        
        [ForeignKey("ReportedById")]
        public virtual Employee? ReportedBy { get; set; }
        
        public string? ImmediateActions { get; set; }
        
        [Required]
        public int StatusId { get; set; }
        
        [ForeignKey("StatusId")]
        public virtual IncidentStatus Status { get; set; }
        
        // Navigation Properties
        public virtual ICollection<InvestigationWitness> Witnesses { get; set; } = new List<InvestigationWitness>();
        public virtual ICollection<IncidentInvestigation> Investigations { get; set; } = new List<IncidentInvestigation>();
        public virtual ICollection<IncidentObservationAttachment> Attachments { get; set; } = new List<IncidentObservationAttachment>();
    }
}
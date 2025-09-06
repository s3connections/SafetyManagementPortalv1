using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SafetyManagementPortal.Backend.Models
{
    [Table("InvestigationWitnesses")]
    public class InvestigationWitness : BaseEntity
    {
        [Required]
        public int IncidentObservationId { get; set; }
        
        [ForeignKey("IncidentObservationId")]
        public virtual IncidentObservation IncidentObservation { get; set; }
        
        [Required]
        public int EmployeeId { get; set; }
        
        [ForeignKey("EmployeeId")]
        public virtual Employee Employee { get; set; }
        
        [Required]
        public string Statement { get; set; }
        
        public DateTime? InterviewDate { get; set; }
        
        public int? InterviewedById { get; set; }
        
        [ForeignKey("InterviewedById")]
        public virtual Employee? InterviewedBy { get; set; }
    }
}

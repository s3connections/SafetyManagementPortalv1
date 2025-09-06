using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SafetyManagementPortal.Backend.Models
{
    [Table("IncidentStatuses")]
    public class IncidentStatus : BaseEntity
    {
        [Required]
        [StringLength(50)]
        public string Name { get; set; }
        
        [Required]
        [StringLength(20)]
        public string Code { get; set; }
        
        [StringLength(500)]
        public string? Description { get; set; }
        
        [Required]
        [StringLength(7)]
        public string Color { get; set; }
        
        [Required]
        public int SortOrder { get; set; }
        
        [Required]
        public bool IsActive { get; set; } = true;
        
        // Navigation Properties
        public virtual ICollection<IncidentObservation> IncidentObservations { get; set; } = new List<IncidentObservation>();
    }
}

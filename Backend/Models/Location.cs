using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SafetyManagementPortal.Backend.Models
{
    [Table("Locations")]
    public class Location : BaseEntity
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; }
        
        [Required]
        [StringLength(20)]
        public string Code { get; set; }
        
        [StringLength(500)]
        public string? Description { get; set; }
        
        [Required]
        public int PlantId { get; set; }
        
        [ForeignKey("PlantId")]
        public virtual Plant Plant { get; set; }
        
        public int? ParentLocationId { get; set; }
        
        [ForeignKey("ParentLocationId")]
        public virtual Location? ParentLocation { get; set; }
        
        [Required]
        public bool IsActive { get; set; } = true;
        
        // Navigation Properties
        public virtual ICollection<Location> SubLocations { get; set; } = new List<Location>();
        public virtual ICollection<IncidentObservation> IncidentObservations { get; set; } = new List<IncidentObservation>();
        public virtual ICollection<Audit> Audits { get; set; } = new List<Audit>();
        public virtual ICollection<Permit> Permits { get; set; } = new List<Permit>();
    }
}

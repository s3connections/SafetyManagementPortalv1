using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SafetyManagementPortal.Backend.Models
{
    [Table("Priorities")]
    public class Priority : BaseEntity
    {
        [Required]
        [StringLength(50)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public string Code { get; set; } = string.Empty;
        
        [StringLength(500)]
        public string? Description { get; set; }

        [Required]
        [StringLength(7)]
        public string Color { get; set; } = string.Empty; // Hex color code
        
        [Required]
        public int SortOrder { get; set; }
        
        [Required]
        public int SlaHours { get; set; }
        
        // Navigation Properties
        public virtual ICollection<IncidentObservation> IncidentObservations { get; set; } = new List<IncidentObservation>();
        
        // ✅ ADDED: Navigation to new Observation model
        public virtual ICollection<Observation> Observations { get; set; } = new List<Observation>();
    }
}

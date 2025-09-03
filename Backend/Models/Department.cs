using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Department : BaseEntity
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public string Code { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Description { get; set; }

        public int PlantId { get; set; }
        public Plant? Plant { get; set; }

        [StringLength(100)]
        public string? ManagerName { get; set; }

        [EmailAddress]
        [StringLength(255)]
        public string? ManagerEmail { get; set; }

        [StringLength(20)]
        public string? ContactNumber { get; set; }

        public bool IsActive { get; set; } = true;

        // Navigation properties
        public virtual ICollection<User> Users { get; set; } = new List<User>();
        public virtual ICollection<Audit> Audits { get; set; } = new List<Audit>();
        public virtual ICollection<Permit> Permits { get; set; } = new List<Permit>();
        public virtual ICollection<IncidentObservation> Observations { get; set; } = new List<IncidentObservation>();
    }
}
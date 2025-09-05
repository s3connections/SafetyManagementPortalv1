using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Plant : BaseEntity
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Description { get; set; }

        [MaxLength(200)]
        public string? Location { get; set; }

        [MaxLength(50)]
        public string? PlantCode { get; set; }

        public bool IsOperational { get; set; } = true;

        // Navigation properties
        public virtual ICollection<Department> Departments { get; set; } = new List<Department>();
        public virtual ICollection<Observation> Observations { get; set; } = new List<Observation>();
        public virtual ICollection<Audit> Audits { get; set; } = new List<Audit>();
        public virtual ICollection<Permit> Permits { get; set; } = new List<Permit>();
    }
}
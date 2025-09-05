using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class Department : BaseEntity
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Description { get; set; }

        [MaxLength(50)]
        public string? DepartmentCode { get; set; }

        public int? PlantId { get; set; }
        
        [ForeignKey(nameof(PlantId))]
        public virtual Plant? Plant { get; set; }

        // Navigation properties
        public virtual ICollection<Observation> Observations { get; set; } = new List<Observation>();
        public virtual ICollection<Audit> Audits { get; set; } = new List<Audit>();
        public virtual ICollection<Permit> Permits { get; set; } = new List<Permit>();
    }
}
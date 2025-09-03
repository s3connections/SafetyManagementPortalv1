using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class HazardCategory
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Description { get; set; }

        [StringLength(20)]
        public string Color { get; set; } = "#1976d2";

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        // Navigation properties
        public virtual ICollection<HazardType> HazardTypes { get; set; } = new List<HazardType>();
        public virtual ICollection<Observation> Observations { get; set; } = new List<Observation>();
    }
}
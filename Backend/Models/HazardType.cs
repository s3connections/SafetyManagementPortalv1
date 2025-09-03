using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class HazardType
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Description { get; set; }

        [Required]
        public int HazardCategoryId { get; set; }

        [StringLength(20)]
        public string Color { get; set; } = "#ff9800";

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        // Navigation properties
        public virtual HazardCategory HazardCategory { get; set; } = null!;
        public virtual ICollection<Observation> Observations { get; set; } = new List<Observation>();
    }
}
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class PermitTemplate : BaseEntity
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Description { get; set; }

        public int PermitTypeId { get; set; }
        public PermitType? PermitType { get; set; }

        public bool IsActive { get; set; } = true;
        public bool IsDefault { get; set; } = false;

        [StringLength(2000)]
        public string? SafetyRequirements { get; set; }

        [StringLength(1000)]
        public string? RequiredDocuments { get; set; }

        public int ValidityDays { get; set; } = 30;

        // Navigation properties
        public virtual ICollection<PermitQuestion> Questions { get; set; } = new List<PermitQuestion>();
    }
}
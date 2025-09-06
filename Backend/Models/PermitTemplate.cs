using System.ComponentModel.DataAnnotations;

namespace SafetyManagementPortal.Backend.Models
{
    public class PermitTemplate : BaseEntity
    {
        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? Description { get; set; }

        [MaxLength(100)]
        public string? PermitType { get; set; }

        public bool IsDefault { get; set; } = false;
        public int? PermitTypeId { get; set; }

        public virtual ICollection<PermitQuestion> Questions { get; set; } = new List<PermitQuestion>();
        
    }
}

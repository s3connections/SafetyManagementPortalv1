using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SafetyManagementPortal.Backend.Models
{
    public class AuditQuestion : BaseEntity
    {
        [Required]
        [MaxLength(500)]
        public string Question { get; set; } = string.Empty;

        [MaxLength(100)]
        public string? Category { get; set; }

        public int Order { get; set; }

        public bool IsRequired { get; set; } = true;

        [MaxLength(1000)]
        public string? Answer { get; set; }

        public bool? IsCompliant { get; set; }

        [MaxLength(1000)]
        public string? Comments { get; set; }

        public int? Score { get; set; }

        // Foreign Key
        public int AuditId { get; set; }

        // Navigation Property
        [ForeignKey(nameof(AuditId))]
        public virtual Audit Audit { get; set; } = null!;
    }
}

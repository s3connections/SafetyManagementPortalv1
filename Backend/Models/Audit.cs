using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public enum AuditStatus
    {
        Scheduled,
        InProgress,
        Completed,
        Cancelled
    }

    public class Audit : BaseEntity
    {
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? Description { get; set; }

        [Required]
        public DateTime ScheduledDate { get; set; }

        public DateTime? CompletedDate { get; set; }

        [Required]
        public AuditStatus Status { get; set; } = AuditStatus.Scheduled;

        [MaxLength(100)]
        public string? AuditType { get; set; }

        public decimal? Score { get; set; }

        [MaxLength(2000)]
        public string? Findings { get; set; }

        [MaxLength(2000)]
        public string? Recommendations { get; set; }

        // Foreign Keys
        public int AuditorId { get; set; }
        public int? PlantId { get; set; }
        public int? DepartmentId { get; set; }

        // Navigation Properties
        [ForeignKey(nameof(AuditorId))]
        public virtual User Auditor { get; set; } = null!;

        [ForeignKey(nameof(PlantId))]
        public virtual Plant? Plant { get; set; }

        [ForeignKey(nameof(DepartmentId))]
        public virtual Department? Department { get; set; }

        public virtual ICollection<AuditQuestion> Questions { get; set; } = new List<AuditQuestion>();
    }
}
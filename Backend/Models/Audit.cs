using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class Audit
    {
        public int Id { get; set; }

        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        [StringLength(1000)]
        public string? Description { get; set; }

        public int AuditTypeId { get; set; }

        public int PlantId { get; set; }

        public int? LocationId { get; set; }

        public int? DepartmentId { get; set; }

        [Required]
        public string CreatedById { get; set; } = string.Empty;

        public string? AuditorId { get; set; }

        public DateTime ScheduledDate { get; set; }

        public DateTime? StartedAt { get; set; }

        public DateTime? CompletedAt { get; set; }

        [StringLength(50)]
        public string Status { get; set; } = "Scheduled"; // Scheduled, InProgress, Completed, Cancelled

        [Column(TypeName = "decimal(5,2)")]
        public decimal? ComplianceScore { get; set; }

        [StringLength(2000)]
        public string? Findings { get; set; }

        [StringLength(2000)]
        public string? Recommendations { get; set; }

        public int Priority { get; set; } = 1; // 1=Low, 2=Medium, 3=High, 4=Critical

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        // Navigation properties
        [ForeignKey("AuditTypeId")]
        public virtual AuditType AuditType { get; set; } = null!;

        [ForeignKey("PlantId")]
        public virtual Plant Plant { get; set; } = null!;

        [ForeignKey("LocationId")]
        public virtual Location? Location { get; set; }

        [ForeignKey("DepartmentId")]
        public virtual Department? Department { get; set; }

        [ForeignKey("CreatedById")]
        public virtual User CreatedBy { get; set; } = null!;

        [ForeignKey("AuditorId")]
        public virtual User? Auditor { get; set; }

        public virtual ICollection<AuditQuestionResponse> AuditQuestionResponses { get; set; } = new List<AuditQuestionResponse>();
    }
}
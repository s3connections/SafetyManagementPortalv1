using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Audit : BaseEntity
    {
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        [StringLength(1000)]
        public string? Description { get; set; }

        [Required]
        public AuditType? AuditType { get; set; }

        [Required]
        public AuditStatus Status { get; set; } = AuditStatus.Planned;

        public int PlantId { get; set; }
        public Plant? Plant { get; set; }

        public int DepartmentId { get; set; }
        public Department? Department { get; set; }

        public int AuditorId { get; set; }
        public User? Auditor { get; set; }

        public DateTime ScheduledDate { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? CompletionDate { get; set; }

        public int? Score { get; set; }
        public int? MaxScore { get; set; }

        [StringLength(2000)]
        public string? Findings { get; set; }

        [StringLength(2000)]
        public string? Recommendations { get; set; }

        [StringLength(1000)]
        public string? Remarks { get; set; }

        public Priority Priority { get; set; } = Priority.Medium;

        // Navigation properties
        public virtual ICollection<AuditQuestion> Questions { get; set; } = new List<AuditQuestion>();
        public virtual ICollection<AuditQuestionResponse> Responses { get; set; } = new List<AuditQuestionResponse>();
    }

    public enum AuditStatus
    {
        Planned = 1,
        InProgress = 2,
        Completed = 3,
        Cancelled = 4
    }
}
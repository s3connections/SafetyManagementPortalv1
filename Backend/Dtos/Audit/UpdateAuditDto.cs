using System.ComponentModel.DataAnnotations;
using Backend.Models;

namespace Backend.Dtos.Audit
{
    public class UpdateAuditDto
    {
        [MaxLength(200)]
        public string? Title { get; set; }

        [MaxLength(1000)]
        public string? Description { get; set; }

        public DateTime? ScheduledDate { get; set; }
        public AuditStatus? Status { get; set; }

        [MaxLength(100)]
        public string? AuditType { get; set; }

        [MaxLength(2000)]
        public string? Findings { get; set; }

        [MaxLength(2000)]
        public string? Recommendations { get; set; }

        public int? PlantId { get; set; }
        public int? DepartmentId { get; set; }
    }
}
using System.ComponentModel.DataAnnotations;

namespace Backend.Dtos.Audit
{
    public class CreateAuditDto
    {
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? Description { get; set; }

        [Required]
        public DateTime ScheduledDate { get; set; }

        [MaxLength(100)]
        public string? AuditType { get; set; }

        [Required]
        public int AuditorId { get; set; }

        public int? PlantId { get; set; }
        public int? DepartmentId { get; set; }
    }
}
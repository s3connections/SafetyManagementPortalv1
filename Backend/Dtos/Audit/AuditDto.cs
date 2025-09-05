using Backend.Models;

namespace Backend.Dtos.Audit
{
    public class AuditDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime ScheduledDate { get; set; }
        public DateTime? CompletedDate { get; set; }
        public AuditStatus Status { get; set; }
        public string? AuditType { get; set; }
        public decimal? Score { get; set; }
        public string? Findings { get; set; }
        public string? Recommendations { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        
        // Auditor information
        public int AuditorId { get; set; }
        public string AuditorName { get; set; } = string.Empty;
        public string AuditorEmail { get; set; } = string.Empty;
        
        // Plant and Department information
        public int? PlantId { get; set; }
        public string? PlantName { get; set; }
        
        public int? DepartmentId { get; set; }
        public string? DepartmentName { get; set; }
    }
}
using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs.Audit
{
    public class AuditDto
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(20)]
        public string AuditNumber { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(2000)]
        public string Description { get; set; } = string.Empty;
        
        [Required]
        public string AuditType { get; set; } = string.Empty;
        
        [Required]
        public string Status { get; set; } = string.Empty;
        
        public int AuditorId { get; set; }
        public int PlantId { get; set; }
        public int DepartmentId { get; set; }
        public DateTime ScheduledDate { get; set; }
        public DateTime? CompletedAt { get; set; }
        public string? Findings { get; set; }
        public string? Recommendations { get; set; }
        public int? Score { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        
        // Navigation properties for display
        public string AuditorName { get; set; } = string.Empty;
        public string PlantName { get; set; } = string.Empty;
        public string DepartmentName { get; set; } = string.Empty;
    }

    public class CreateAuditDto
    {
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(2000)]
        public string Description { get; set; } = string.Empty;
        
        [Required]
        public string AuditType { get; set; } = string.Empty;
        
        public int AuditorId { get; set; }
        public int PlantId { get; set; }
        public int DepartmentId { get; set; }
        public DateTime ScheduledDate { get; set; }
    }

    public class UpdateAuditDto
    {
        [MaxLength(200)]
        public string? Title { get; set; }
        
        [MaxLength(2000)]
        public string? Description { get; set; }
        
        public int? AuditorId { get; set; }
        public DateTime? ScheduledDate { get; set; }
        public string? Status { get; set; }
        public string? Findings { get; set; }
        public string? Recommendations { get; set; }
        public int? Score { get; set; }
    }

    public class AuditStatisticsDto
    {
        public int TotalAudits { get; set; }
        public int ScheduledAudits { get; set; }
        public int InProgressAudits { get; set; }
        public int CompletedAudits { get; set; }
        public int OverdueAudits { get; set; }
        public Dictionary<string, int> AuditsByType { get; set; } = new();
        public Dictionary<string, int> AuditsByStatus { get; set; } = new();
    }
}
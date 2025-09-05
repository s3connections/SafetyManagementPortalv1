using System.ComponentModel.DataAnnotations;

namespace Backend.Dtos.Permit
{
    public class PermitTypeDto
    {
        public int Id { get; set; }
        
        public string Name { get; set; } = string.Empty;
        
        public string? Description { get; set; }
        
        public string? Code { get; set; }
        
        public string? Category { get; set; }
        
        public bool RequiresSpecialApproval { get; set; }
        
        public int DefaultValidityHours { get; set; }
        
        public string? ColorCode { get; set; }
        
        public int RiskLevel { get; set; }
        
        public bool RequiresSafetyBriefing { get; set; }
        
        public bool RequiresFireWatch { get; set; }
        
        public bool IsActive { get; set; }
        
        public DateTime CreatedAt { get; set; }
        
        public DateTime UpdatedAt { get; set; }
        
        // Related data
        public int PermitCount { get; set; }
        
        public int TemplateCount { get; set; }
        
        public string RiskLevelName { get; set; } = string.Empty;
    }
    
    public class CreatePermitTypeDto
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;
        
        [MaxLength(500)]
        public string? Description { get; set; }
        
        [MaxLength(50)]
        public string? Code { get; set; }
        
        [MaxLength(100)]
        public string? Category { get; set; }
        
        public bool RequiresSpecialApproval { get; set; } = false;
        
        [Range(1, 8760)] // Max 1 year
        public int DefaultValidityHours { get; set; } = 24;
        
        [MaxLength(7)]
        [RegularExpression(@"^#[0-9A-Fa-f]{6}$", ErrorMessage = "Color code must be in hex format (#RRGGBB)")]
        public string? ColorCode { get; set; }
        
        [Range(1, 4)]
        public int RiskLevel { get; set; } = 1;
        
        public bool RequiresSafetyBriefing { get; set; } = false;
        
        public bool RequiresFireWatch { get; set; } = false;
    }
    
    public class UpdatePermitTypeDto
    {
        [MaxLength(100)]
        public string? Name { get; set; }
        
        [MaxLength(500)]
        public string? Description { get; set; }
        
        [MaxLength(50)]
        public string? Code { get; set; }
        
        [MaxLength(100)]
        public string? Category { get; set; }
        
        public bool? RequiresSpecialApproval { get; set; }
        
        [Range(1, 8760)]
        public int? DefaultValidityHours { get; set; }
        
        [MaxLength(7)]
        [RegularExpression(@"^#[0-9A-Fa-f]{6}$", ErrorMessage = "Color code must be in hex format (#RRGGBB)")]
        public string? ColorCode { get; set; }
        
        [Range(1, 4)]
        public int? RiskLevel { get; set; }
        
        public bool? RequiresSafetyBriefing { get; set; }
        
        public bool? RequiresFireWatch { get; set; }
        
        public bool? IsActive { get; set; }
    }
}
using System.ComponentModel.DataAnnotations;

namespace Backend.Dtos.Audit
{
    public class AuditTypeDto
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;
        
        [MaxLength(500)]
        public string? Description { get; set; }
        
        [MaxLength(50)]
        public string? Code { get; set; }
        
        public bool IsActive { get; set; } = true;
        
        public DateTime CreatedAt { get; set; }
        
        public DateTime UpdatedAt { get; set; }
        
        // Related data
        public int AuditCount { get; set; }
        
        public string? CategoryName { get; set; }
        
        public decimal? AverageScore { get; set; }
    }
    
    public class CreateAuditTypeDto
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
    }
    
    public class UpdateAuditTypeDto
    {
        [MaxLength(100)]
        public string? Name { get; set; }
        
        [MaxLength(500)]
        public string? Description { get; set; }
        
        [MaxLength(50)]
        public string? Code { get; set; }
        
        [MaxLength(100)]
        public string? Category { get; set; }
        
        public bool? IsActive { get; set; }
    }
}
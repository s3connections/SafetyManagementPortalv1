using System.ComponentModel.DataAnnotations;
using Backend.Enums;
using Backend.DTOs.Incident;


namespace SafetyManagementPortal.Backend.DTOs.Incident
{
    
    
    
    public class InvestigationTimelineDto
    {
        public int Id { get; set; }
        
        public int InvestigationId { get; set; }
        
        [Required]
        public DateTime EventDateTime { get; set; }
        
        [Required]
        [StringLength(200)]
        public string EventDescription { get; set; } = string.Empty;
        
        [StringLength(1000)]
        public string? EventDetails { get; set; }
        
        [StringLength(100)]
        public string? EventType { get; set; }
        
        [StringLength(100)]
        public string? RecordedBy { get; set; }
        
        public DateTime CreatedAt { get; set; }
        
        public DateTime? UpdatedAt { get; set; }
    }
}

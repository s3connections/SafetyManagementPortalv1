using System.ComponentModel.DataAnnotations;

namespace SafetyManagementPortal.Backend.DTOs.Incident
{
    
    
    public class CreateInvestigationWitnessDto
    {
        [Required]
        public int InvestigationId { get; set; }
        
        [Required]
        [StringLength(100)]
        public string WitnessName { get; set; } = string.Empty;
        
        [StringLength(100)]
        public string? WitnessTitle { get; set; }
        
        [StringLength(200)]
        public string? ContactInformation { get; set; }
        
        [StringLength(2000)]
        public string? Statement { get; set; }
        
        public DateTime? InterviewDate { get; set; }
        
        [StringLength(100)]
        public string? InterviewedBy { get; set; }
    }
    
    
}

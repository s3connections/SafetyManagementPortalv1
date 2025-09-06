using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SafetyManagementPortal.Backend.Models
{
    [Table("InvestigationPanels")]
    public class InvestigationPanel : BaseEntity
    {
        [Required]
        public int InvestigationId { get; set; }
        
        [ForeignKey("InvestigationId")]
        public virtual IncidentInvestigation Investigation { get; set; }
        
        [Required]
        public int EmployeeId { get; set; }
        
        [ForeignKey("EmployeeId")]
        public virtual Employee Employee { get; set; }
        
        [Required]
        [StringLength(50)]
        public string Role { get; set; }
        
        [Required]
        public bool IsLead { get; set; } = false;
    }
}

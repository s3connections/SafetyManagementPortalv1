using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SafetyManagementPortal.Backend.Models
{
    [Table("WorkflowSteps")]
    public class WorkflowStep : BaseEntity
    {
        [Required]
        public int WorkflowDefinitionId { get; set; }
        
        [ForeignKey("WorkflowDefinitionId")]
        public virtual WorkflowDefinition WorkflowDefinition { get; set; }
        
        [Required]
        [StringLength(100)]
        public string StepName { get; set; }
        
        [StringLength(500)]
        public string? Description { get; set; }
        
        [Required]
        public int StepOrder { get; set; }
        
        [Required]
        [StringLength(50)]
        public string ActionType { get; set; } // Approve, Review, Submit, etc.
        
        public int? RoleId { get; set; }
        
        [ForeignKey("RoleId")]
        public virtual Role? Role { get; set; }
        
        public int? EmployeeId { get; set; }
        
        [ForeignKey("EmployeeId")]
        public virtual Employee? Employee { get; set; }
        
        [Required]
        public bool IsActive { get; set; } = true;
    }
}

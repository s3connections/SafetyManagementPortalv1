using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    [Table("WorkflowInstances")]
    public class WorkflowInstance : BaseEntity
    {
        [Required]
        public int WorkflowDefinitionId { get; set; }
        
        [ForeignKey("WorkflowDefinitionId")]
        public virtual WorkflowDefinition WorkflowDefinition { get; set; }
        
        [Required]
        public int EntityId { get; set; }
        
        [Required]
        [StringLength(50)]
        public string EntityType { get; set; }
        
        [Required]
        public int CurrentStepId { get; set; }
        
        [ForeignKey("CurrentStepId")]
        public virtual WorkflowStep CurrentStep { get; set; }
        
        [Required]
        [StringLength(50)]
        public string Status { get; set; } = "In Progress";
        
        public DateTime? CompletedDate { get; set; }
    }
}
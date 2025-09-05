using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    [Table("AuditQuestions")]
    public class AuditQuestion : BaseEntity
    {
        [Required]
        public int AuditTypeId { get; set; }
        
        [ForeignKey("AuditTypeId")]
        public virtual AuditType AuditType { get; set; }
        
        [Required]
        public string QuestionText { get; set; }
        
        [Required]
        [StringLength(50)]
        public string ResponseType { get; set; } // Yes/No, Rating, Text, etc.
        
        [StringLength(200)]
        public string? ExpectedResponse { get; set; }
        
        [Required]
        public bool IsMandatory { get; set; } = true;
        
        [Required]
        public int SortOrder { get; set; }
        
        [Required]
        public bool IsActive { get; set; } = true;
        
        // Navigation Properties
        public virtual ICollection<AuditQuestionResponse> Responses { get; set; } = new List<AuditQuestionResponse>();
    }
}
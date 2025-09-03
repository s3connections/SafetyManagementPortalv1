using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    [Table("AuditQuestionResponses")]
    public class AuditQuestionResponse : BaseEntity
    {
        [Required]
        public int AuditId { get; set; }
        
        [ForeignKey("AuditId")]
        public virtual Audit Audit { get; set; }
        
        [Required]
        public int QuestionId { get; set; }
        
        [ForeignKey("QuestionId")]
        public virtual AuditQuestion Question { get; set; }
        
        [Required]
        [StringLength(500)]
        public string Response { get; set; }
        
        public string? Comments { get; set; }
        
        [Required]
        public bool IsCompliant { get; set; } = true;
    }
}
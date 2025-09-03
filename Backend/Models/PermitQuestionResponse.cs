using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    [Table("PermitQuestionResponses")]
    public class PermitQuestionResponse : BaseEntity
    {
        [Required]
        public int PermitId { get; set; }
        
        [ForeignKey("PermitId")]
        public virtual Permit Permit { get; set; }
        
        [Required]
        public int QuestionId { get; set; }
        
        [ForeignKey("QuestionId")]
        public virtual PermitQuestion Question { get; set; }
        
        [Required]
        [StringLength(500)]
        public string Response { get; set; }
        
        public string? Comments { get; set; }
    }
}
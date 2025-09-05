using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    [Table("PermitQuestions")]
    public class PermitQuestion : BaseEntity
    {
        [Required]
        public int PermitTypeId { get; set; }
        
        [ForeignKey("PermitTypeId")]
        public virtual PermitType PermitType { get; set; }
        
        [Required]
        public string QuestionText { get; set; }
        
        [Required]
        [StringLength(50)]
        public string ResponseType { get; set; }
        
        [StringLength(200)]
        public string? ExpectedResponse { get; set; }
        
        [Required]
        public bool IsMandatory { get; set; } = true;
        
        [Required]
        public int SortOrder { get; set; }
        
        [Required]
        public bool IsActive { get; set; } = true;
        
        // Navigation Properties
        public virtual ICollection<PermitQuestionResponse> Responses { get; set; } = new List<PermitQuestionResponse>();
    }
}
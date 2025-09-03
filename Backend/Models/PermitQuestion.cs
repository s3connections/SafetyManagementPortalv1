using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class PermitQuestion : BaseEntity
    {
        [Required]
        [StringLength(500)]
        public string QuestionText { get; set; } = string.Empty;

        [StringLength(1000)]
        public string? Description { get; set; }

        public int PermitTemplateId { get; set; }
        public PermitTemplate? PermitTemplate { get; set; }

        public QuestionType QuestionType { get; set; } = QuestionType.YesNo;

        public int DisplayOrder { get; set; }

        public bool IsRequired { get; set; } = true;
        public bool IsActive { get; set; } = true;

        [StringLength(1000)]
        public string? HelpText { get; set; }

        // For multiple choice questions
        [StringLength(2000)]
        public string? Options { get; set; }

        [StringLength(500)]
        public string? ValidationRules { get; set; }

        // Navigation properties
        public virtual ICollection<PermitQuestionResponse> Responses { get; set; } = new List<PermitQuestionResponse>();
    }
}
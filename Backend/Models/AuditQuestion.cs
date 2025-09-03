using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class AuditQuestion : BaseEntity
    {
        [Required]
        [StringLength(500)]
        public string QuestionText { get; set; } = string.Empty;

        [StringLength(1000)]
        public string? Description { get; set; }

        public int AuditTypeId { get; set; }
        public AuditType? AuditType { get; set; }

        public int CategoryId { get; set; }
        public Category? Category { get; set; }

        public QuestionType QuestionType { get; set; } = QuestionType.YesNo;

        public int MaxScore { get; set; } = 1;
        public int DisplayOrder { get; set; }

        public bool IsRequired { get; set; } = true;
        public bool IsActive { get; set; } = true;

        [StringLength(1000)]
        public string? HelpText { get; set; }

        // For multiple choice questions
        [StringLength(2000)]
        public string? Options { get; set; }

        // Navigation properties
        public virtual ICollection<AuditQuestionResponse> Responses { get; set; } = new List<AuditQuestionResponse>();
    }

    public enum QuestionType
    {
        YesNo = 1,
        MultipleChoice = 2,
        Text = 3,
        Numeric = 4,
        Rating = 5
    }
}
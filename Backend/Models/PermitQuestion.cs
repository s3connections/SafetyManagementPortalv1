using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SafetyManagementPortal.Backend.Models
{
    public enum QuestionType
    {
        YesNo,
        Text,
        Number,
        Date,
        MultipleChoice
    }

    public class PermitQuestion : BaseEntity
    {
        [Required]
        [MaxLength(500)]
        public string Question { get; set; } = string.Empty;

        [Required]
        public QuestionType Type { get; set; }

        public bool IsRequired { get; set; } = true;

        public int Order { get; set; }

        [MaxLength(100)]
        public string? Category { get; set; }

        [MaxLength(1000)]
        public string? Options { get; set; } // JSON for multiple choice options

        [MaxLength(500)]
        public string? HelpText { get; set; }

        // Foreign Keys
        public int? PermitTemplateId { get; set; }
        public int? PermitId { get; set; }

        // Navigation Properties
        [ForeignKey(nameof(PermitTemplateId))]
        public virtual PermitTemplate? PermitTemplate { get; set; }

        [ForeignKey(nameof(PermitId))]
        public virtual Permit? Permit { get; set; }

        public virtual ICollection<PermitAnswer> Answers { get; set; } = new List<PermitAnswer>();
    }
}

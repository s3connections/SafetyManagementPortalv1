using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class PermitAnswer : BaseEntity
    {
        public int PermitId { get; set; }
        public Permit? Permit { get; set; }

        public int PermitQuestionId { get; set; }
        public PermitQuestion? PermitQuestion { get; set; }

        [StringLength(2000)]
        public string? AnswerText { get; set; }

        public decimal? AnswerNumeric { get; set; }

        public bool? AnswerBoolean { get; set; }

        [StringLength(1000)]
        public string? Comments { get; set; }

        public bool IsCompliant { get; set; } = true;
    }
}
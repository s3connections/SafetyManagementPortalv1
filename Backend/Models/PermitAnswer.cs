using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class PermitAnswer : BaseEntity
    {
        [MaxLength(2000)]
        public string? TextValue { get; set; }

        public decimal? NumberValue { get; set; }

        public bool? BooleanValue { get; set; }

        public DateTime? DateValue { get; set; }

        [MaxLength(1000)]
        public string? Comments { get; set; }

        // Foreign Keys
        public int PermitId { get; set; }
        public int PermitQuestionId { get; set; }
        public int AnsweredByUserId { get; set; }

        // Navigation Properties
        [ForeignKey(nameof(PermitId))]
        public virtual Permit Permit { get; set; } = null!;

        [ForeignKey(nameof(PermitQuestionId))]
        public virtual PermitQuestion PermitQuestion { get; set; } = null!;

        [ForeignKey(nameof(AnsweredByUserId))]
        public virtual User AnsweredByUser { get; set; } = null!;
    }
}
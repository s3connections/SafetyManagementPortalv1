using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public enum PermitStatus
    {
        Draft,
        Submitted,
        UnderReview,
        Approved,
        Rejected,
        Expired,
        Cancelled
    }

    public class Permit : BaseEntity
    {
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string PermitNumber { get; set; } = string.Empty;

        [MaxLength(100)]
        public string? PermitType { get; set; }

        [MaxLength(1000)]
        public string? Description { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        [Required]
        public PermitStatus Status { get; set; } = PermitStatus.Draft;

        [MaxLength(100)]
        public string? WorkLocation { get; set; }

        [MaxLength(2000)]
        public string? SafetyRequirements { get; set; }

        [MaxLength(1000)]
        public string? ApprovalNotes { get; set; }

        public DateTime? ApprovedDate { get; set; }

        // Foreign Keys
        public int RequestedByUserId { get; set; }
        public int? ApprovedByUserId { get; set; }
        public int? ResponsibleEngineerId { get; set; }
        public int? PlantId { get; set; }
        public int? DepartmentId { get; set; }
        public int? PermitTypeId { get; set; }

        // Navigation Properties
        [ForeignKey(nameof(RequestedByUserId))]
        public virtual User RequestedByUser { get; set; } = null!;

        [ForeignKey(nameof(ApprovedByUserId))]
        public virtual User? ApprovedByUser { get; set; }

        [ForeignKey(nameof(ResponsibleEngineerId))]
        public virtual User? ResponsibleEngineer { get; set; }

        [ForeignKey(nameof(PlantId))]
        public virtual Plant? Plant { get; set; }

        [ForeignKey(nameof(DepartmentId))]
        public virtual Department? Department { get; set; }
        [ForeignKey(nameof(PermitTypeId))]
        

        public virtual ICollection<PermitQuestion> Questions { get; set; } = new List<PermitQuestion>();
        public virtual ICollection<PermitAnswer> Answers { get; set; } = new List<PermitAnswer>();
    }
}
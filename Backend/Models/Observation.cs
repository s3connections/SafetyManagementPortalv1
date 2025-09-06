using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SafetyManagementPortal.Backend.Models
{
    // ✅ FIXED: Aligned with frontend enum values
    public enum ObservationType
    {
        [Display(Name = "Safety")]
        Safety,
        
        [Display(Name = "Environmental")]
        Environmental,
        
        [Display(Name = "Quality")]
        Quality,
        
        [Display(Name = "Security")]
        Security,
        
        [Display(Name = "Other")]
        Other
    }

    // ✅ FIXED: Aligned with frontend enum values (includes Resolved)
    public enum ObservationStatus
    {
        [Display(Name = "Open")]
        Open,
        
        [Display(Name = "In Progress")]
        InProgress,
        
        [Display(Name = "Resolved")]
        Resolved, // ✅ FIXED: Match frontend expectation
        
        [Display(Name = "Closed")]
        Closed,
        
        [Display(Name = "Cancelled")]
        Cancelled
    }

    public class Observation : BaseEntity
    {
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [MaxLength(2000)]
        public string Description { get; set; } = string.Empty;

        [Required]
        public ObservationType ObservationType { get; set; }

        [Required]
        public ObservationStatus Status { get; set; } = ObservationStatus.Open;

        [MaxLength(100)]
        public string? Location { get; set; }

        [MaxLength(50)]
        public string TicketNumber { get; set; } = string.Empty;

        public DateTime? DueDate { get; set; }

        public DateTime? CompletedDate { get; set; }

        [MaxLength(1000)]
        public string? ResolutionNotes { get; set; }

        [MaxLength(500)]
        public string? ImagePath { get; set; }

        // Foreign Keys
        public int ReportedByUserId { get; set; }
        public int? AssignedToUserId { get; set; }
        public int? PlantId { get; set; }
        public int? DepartmentId { get; set; }
        
        // ✅ FIXED: Use Priority entity reference
        public int PriorityId { get; set; }

        // Navigation Properties
        [ForeignKey(nameof(ReportedByUserId))]
        public virtual User ReportedByUser { get; set; } = null!;

        [ForeignKey(nameof(AssignedToUserId))]
        public virtual User? AssignedToUser { get; set; }

        [ForeignKey(nameof(PlantId))]
        public virtual Plant? Plant { get; set; }

        [ForeignKey(nameof(DepartmentId))]
        public virtual Department? Department { get; set; }
        
        [ForeignKey(nameof(PriorityId))]
        public virtual Priority Priority { get; set; } = null!;
        
        // ✅ ADDED: Reporter navigation property (alias for ReportedByUser)
        [NotMapped]
        public virtual User Reporter => ReportedByUser;
    }
}

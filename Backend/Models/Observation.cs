using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    // ✅ UPDATED: Frontend-aligned enum values
    public enum ObservationType
    {
        [Display(Name = "Unsafe Act")]
        UnsafeAct,
        
        [Display(Name = "Unsafe Condition")]
        UnsafeCondition,
        
        [Display(Name = "Near Miss")]
        NearMiss,
        
        [Display(Name = "Good Practice")]
        GoodPractice
    }

    // ✅ UPDATED: Frontend-aligned enum values (Resolved → Completed)
    public enum ObservationStatus
    {
        [Display(Name = "Open")]
        Open,
        
        [Display(Name = "In Progress")]
        InProgress,
        
        [Display(Name = "Completed")]
        Completed,  // ✅ CHANGED: Was "Resolved"
        
        [Display(Name = "Closed")]
        Closed,
        
        [Display(Name = "Cancelled")]
        Cancelled
    }

    // ✅ NEW: Simple Priority enum to match frontend
    public enum PriorityLevel
    {
        [Display(Name = "Low")]
        Low = 1,
        
        [Display(Name = "Medium")]
        Medium = 2,
        
        [Display(Name = "High")]
        High = 3,
        
        [Display(Name = "Critical")]
        Critical = 4
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

        // ✅ NEW: Added Priority field to match frontend expectations
        [Required]
        public PriorityLevel Priority { get; set; } = PriorityLevel.Low;

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

        // Navigation Properties
        [ForeignKey(nameof(ReportedByUserId))]
        public virtual User ReportedByUser { get; set; } = null!;

        [ForeignKey(nameof(AssignedToUserId))]
        public virtual User? AssignedToUser { get; set; }

        [ForeignKey(nameof(PlantId))]
        public virtual Plant? Plant { get; set; }

        [ForeignKey(nameof(DepartmentId))]
        public virtual Department? Department { get; set; }
    }
}
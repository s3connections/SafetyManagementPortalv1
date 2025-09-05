using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models.Entities
{
    public enum ObservationType
    {
        Unsafe_Act,
        Unsafe_Condition,
        Work_Stoppage,
        Near_Miss,
        Good_Practice
    }

    public enum ObservationStatus
    {
        Open,
        Re_Assigned,
        Unsatisfied,
        Closed,
        Wrongly_Assigned
    }

    public enum ObservationStage
    {
        Open,
        In_Progress,
        Closed,
        Re_opened
    }

    public enum Priority
    {
        High,
        Medium,
        Low
    }

    public class Observation
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string TicketNumber { get; set; } = string.Empty;

        [Required]
        public ObservationType ObservationType { get; set; }

        [StringLength(100)]
        public string? HazardType { get; set; }

        [Required]
        public Priority Priority { get; set; } = Priority.Medium;

        [Required]
        public ObservationStage Stage { get; set; } = ObservationStage.Open;

        [Required]
        public ObservationStatus Status { get; set; } = ObservationStatus.Open;

        [Required]
        [StringLength(2000)]
        public string Description { get; set; } = string.Empty;

        [Required]
        [StringLength(255)]
        public string Location { get; set; } = string.Empty;

        [Required]
        public int PlantId { get; set; }

        [Required]
        public int DepartmentId { get; set; }

        [Required]
        public int ReportedBy { get; set; }

        public int? AssignedTo { get; set; }

        public string? ObservationImages { get; set; } // JSON array of image paths

        public string? ResolutionImages { get; set; } // JSON array of image paths

        [StringLength(2000)]
        public string? ResolutionRemarks { get; set; }

        public DateTime? SlaDeadline { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        [ForeignKey("PlantId")]
        public virtual Plant Plant { get; set; } = null!;

        [ForeignKey("DepartmentId")]
        public virtual Department Department { get; set; } = null!;

        [ForeignKey("ReportedBy")]
        public virtual User Reporter { get; set; } = null!;

        [ForeignKey("AssignedTo")]
        public virtual User? AssignedUser { get; set; }
    }
}
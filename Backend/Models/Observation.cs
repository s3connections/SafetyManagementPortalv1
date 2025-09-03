using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    [Table("Observations")]
    public class Observation
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [MaxLength(20)]
        public string TicketNumber { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(2000)]
        public string Description { get; set; } = string.Empty;
        
        [Required]
        [Column(TypeName = "nvarchar(50)")]
        public ObservationType ObservationType { get; set; }
        
        [Required]
        [Column(TypeName = "nvarchar(50)")]
        public ObservationStatus Status { get; set; }
        
        [Required]
        [Column(TypeName = "nvarchar(50)")]
        public Priority Priority { get; set; }
        
        [Required]
        public int ReportedBy { get; set; }
        
        [ForeignKey("ReportedBy")]
        public virtual User Reporter { get; set; } = null!;
        
        public int? AssignedTo { get; set; }
        
        [ForeignKey("AssignedTo")]
        public virtual User? Assignee { get; set; }
        
        [Required]
        public int PlantId { get; set; }
        
        [ForeignKey("PlantId")]
        public virtual Plant Plant { get; set; } = null!;
        
        [Required]
        public int DepartmentId { get; set; }
        
        [ForeignKey("DepartmentId")]
        public virtual Department Department { get; set; } = null!;
        
        [Required]
        [MaxLength(500)]
        public string Location { get; set; } = string.Empty;
        
        public int? HazardCategoryId { get; set; }
        
        [ForeignKey("HazardCategoryId")]
        public virtual HazardCategory? HazardCategory { get; set; }
        
        public int? HazardTypeId { get; set; }
        
        [ForeignKey("HazardTypeId")]
        public virtual HazardType? HazardType { get; set; }
        
        [MaxLength(500)]
        public string? ImageUrl { get; set; }
        
        public DateTime? DueDate { get; set; }
        
        public DateTime? CompletedAt { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }

    public enum ObservationType
    {
        UnsafeAct,
        UnsafeCondition,
        NearMiss,
        GoodPractice
    }

    public enum ObservationStatus
    {
        Open,
        InProgress,
        Completed,
        Closed,
        Cancelled
    }

    public enum Priority
    {
        Low,
        Medium,
        High,
        Critical
    }
}
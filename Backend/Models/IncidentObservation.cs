using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SafetyManagementPortal.Backend.Models
{
    public class IncidentObservation : BaseEntity
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
        public int? InvestigatedByUserId { get; set; }
        public DateTime? InvestigationCompletedDate { get; set; }
        public string? RootCauseAnalysis { get; set; }
        
        public int? PlantId { get; set; }
        public int? DepartmentId { get; set; }
        public int PriorityId { get; set; }

        // Navigation Properties
        [ForeignKey(nameof(ReportedByUserId))]
        public virtual User ReportedByUser { get; set; } = null!;

        [ForeignKey(nameof(AssignedToUserId))]
        public virtual User? AssignedToUser { get; set; }

        [ForeignKey(nameof(InvestigatedByUserId))]
        public virtual User? InvestigatedByUser { get; set; }

        [ForeignKey(nameof(PlantId))]
        public virtual Plant? Plant { get; set; }

        [ForeignKey(nameof(DepartmentId))]
        public virtual Department? Department { get; set; }
        
        [ForeignKey(nameof(PriorityId))]
        public virtual Priority Priority { get; set; } = null!;
        
        // ✅ ADDED: Reporter alias for consistency
        [NotMapped]
        public virtual User Reporter => ReportedByUser;
    }
}

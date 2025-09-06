using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SafetyManagementPortal.Backend.Models
{
    public enum InvestigationStage
    {
        WORK_SLIP,
        FIR,
        INVESTIGATION,
        CASE_CLOSED
    }

    public class Investigation
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string InvestigationNumber { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string EmployeeId { get; set; } = string.Empty;

        [Required]
        public DateTime IncidentDate { get; set; }

        [Required]
        [StringLength(100)]
        public string IncidentType { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Description { get; set; }

        [StringLength(100)]
        public string? BodyPartAffected { get; set; }

        [StringLength(1000)]
        public string? Witnesses { get; set; }

        [Required]
        public int ReportedById { get; set; }

        [Required]
        public int PlantId { get; set; }

        [Required]
        public int DepartmentId { get; set; }

        public int? LocationId { get; set; }

        [Required]
        public InvestigationStage Stage { get; set; } = InvestigationStage.WORK_SLIP;

        public DateTime ReportedDate { get; set; } = DateTime.UtcNow;

        // FIR Details
        public DateTime? FirCreatedAt { get; set; }
        public int? FirCreatedById { get; set; }
        [StringLength(2000)]
        public string? FirDetails { get; set; }

        // Investigation Panel
        public int? PresidingOfficerId { get; set; }
        public int? InvestigationOfficerId { get; set; }
        public DateTime? PanelAssignedAt { get; set; }

        // Case Closure
        public DateTime? CaseClosedAt { get; set; }
        public int? FinalizedById { get; set; }
        [StringLength(2000)]
        public string? FinalRemarks { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        [ForeignKey("PlantId")]
        public virtual Plant Plant { get; set; } = null!;

        [ForeignKey("DepartmentId")]
        public virtual Department Department { get; set; } = null!;

        [ForeignKey("ReportedById")]
        public virtual User ReportedBy { get; set; } = null!;

        [ForeignKey("FirCreatedById")]
        public virtual User? FirCreatedBy { get; set; }

        [ForeignKey("PresidingOfficerId")]
        public virtual User? PresidingOfficer { get; set; }

        [ForeignKey("InvestigationOfficerId")]
        public virtual User? InvestigationOfficer { get; set; }

        [ForeignKey("FinalizedById")]
        public virtual User? FinalizedBy { get; set; }
    }
}

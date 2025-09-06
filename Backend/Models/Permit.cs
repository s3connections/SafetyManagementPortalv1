using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class Permit : BaseEntity
    {
        [Required]
        [MaxLength(50)]
        public string PermitNumber { get; set; } = string.Empty;

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? Description { get; set; }

        [Required]
        public PermitStatus Status { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        [MaxLength(2000)]
        public string? HazardAssessment { get; set; }

        [MaxLength(2000)]
        public string? ControlMeasures { get; set; }

        // Foreign Keys
        public int RequestedByUserId { get; set; }
        public int? ApprovedByUserId { get; set; }
        public int PlantId { get; set; }
        public int DepartmentId { get; set; }
        public int PermitTypeId { get; set; }

        // Navigation Properties
        [ForeignKey(nameof(RequestedByUserId))]
        public virtual User RequestedBy { get; set; } = null!;

        [ForeignKey(nameof(ApprovedByUserId))]  
        public virtual User? ApprovedBy { get; set; }

        [ForeignKey(nameof(PlantId))]
        public virtual Plant Plant { get; set; } = null!;

        [ForeignKey(nameof(DepartmentId))]
        public virtual Department Department { get; set; } = null!;

        [ForeignKey(nameof(PermitTypeId))]
        public virtual PermitType PermitType { get; set; } = null!;
    }

    public enum PermitStatus
    {
        [Display(Name = "Draft")]
        Draft,
        
        [Display(Name = "Submitted")]
        Submitted,
        
        [Display(Name = "Approved")]
        Approved,
        
        [Display(Name = "Rejected")]
        Rejected,
        
        [Display(Name = "Expired")]
        Expired,
        
        [Display(Name = "Cancelled")]
        Cancelled
    }
}
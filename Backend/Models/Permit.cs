using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class Permit
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string PermitNumber { get; set; } = string.Empty;

        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        [StringLength(1000)]
        public string? Description { get; set; }

        public int PermitTypeId { get; set; }

        public int PlantId { get; set; }

        public int? LocationId { get; set; }

        public int? DepartmentId { get; set; }

        [Required]
        public string RequestedById { get; set; } = string.Empty;

        public string? ApprovedById { get; set; }

        public DateTime RequestedDate { get; set; } = DateTime.UtcNow;

        public DateTime ValidFrom { get; set; }

        public DateTime ValidTo { get; set; }

        public DateTime? ApprovedDate { get; set; }

        [StringLength(50)]
        public string Status { get; set; } = "Pending"; // Pending, Approved, Rejected, Expired, Cancelled

        [StringLength(500)]
        public string? ApprovalComments { get; set; }

        [StringLength(500)]
        public string? RejectionReason { get; set; }

        public int Priority { get; set; } = 1; // 1=Low, 2=Medium, 3=High, 4=Critical

        [StringLength(1000)]
        public string? SafetyRequirements { get; set; }

        [StringLength(1000)]
        public string? SpecialInstructions { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        // Navigation properties
        [ForeignKey("PermitTypeId")]
        public virtual PermitType PermitType { get; set; } = null!;

        [ForeignKey("PlantId")]
        public virtual Plant Plant { get; set; } = null!;

        [ForeignKey("LocationId")]
        public virtual Location? Location { get; set; }

        [ForeignKey("DepartmentId")]
        public virtual Department? Department { get; set; }

        [ForeignKey("RequestedById")]
        public virtual User RequestedBy { get; set; } = null!;

        [ForeignKey("ApprovedById")]
        public virtual User? ApprovedBy { get; set; }

        public virtual ICollection<PermitQuestionResponse> PermitQuestionResponses { get; set; } = new List<PermitQuestionResponse>();
        public virtual ICollection<PermitApprovalHistory> PermitApprovalHistories { get; set; } = new List<PermitApprovalHistory>();
        public virtual ICollection<Employee> WorkersAssigned { get; set; } = new List<Employee>();
        public virtual ICollection<Employee> SupervisorsAssigned { get; set; } = new List<Employee>();
    }
}
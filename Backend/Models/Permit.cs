using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Permit : BaseEntity
    {
        [Required]
        [StringLength(50)]
        public string PermitNumber { get; set; } = string.Empty;

        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        [StringLength(1000)]
        public string? Description { get; set; }

        public int PermitTypeId { get; set; }
        public PermitType? PermitType { get; set; }

        public int RequestorId { get; set; }
        public User? Requestor { get; set; }

        public int PlantId { get; set; }
        public Plant? Plant { get; set; }

        public int DepartmentId { get; set; }
        public Department? Department { get; set; }

        [Required]
        public PermitStatus Status { get; set; } = PermitStatus.Draft;

        public Priority Priority { get; set; } = Priority.Medium;

        public DateTime RequestedDate { get; set; } = DateTime.UtcNow;
        public DateTime? RequiredDate { get; set; }
        public DateTime? ApprovedDate { get; set; }
        public DateTime? ValidFrom { get; set; }
        public DateTime? ValidTo { get; set; }

        public int? ApproverId { get; set; }
        public User? Approver { get; set; }

        [StringLength(1000)]
        public string? ApprovalComments { get; set; }

        [StringLength(1000)]
        public string? RejectionReason { get; set; }

        [StringLength(500)]
        public string? WorkLocation { get; set; }

        [StringLength(2000)]
        public string? SafetyPrecautions { get; set; }

        [StringLength(1000)]
        public string? EquipmentRequired { get; set; }

        public bool IsEmergency { get; set; } = false;

        // Navigation properties
        public virtual ICollection<PermitApprovalHistory> ApprovalHistory { get; set; } = new List<PermitApprovalHistory>();
        public virtual ICollection<PermitQuestionResponse> QuestionResponses { get; set; } = new List<PermitQuestionResponse>();
    }

    public enum PermitStatus
    {
        Draft = 1,
        Submitted = 2,
        UnderReview = 3,
        Approved = 4,
        Rejected = 5,
        Expired = 6,
        Cancelled = 7
    }
}
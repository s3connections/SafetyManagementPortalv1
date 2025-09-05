using System.ComponentModel.DataAnnotations;
using Backend.Models;

namespace Backend.Dtos.Permit
{
    public class UpdatePermitDto
    {
        [MaxLength(200)]
        public string? Title { get; set; }

        [MaxLength(100)]
        public string? PermitType { get; set; }

        [MaxLength(1000)]
        public string? Description { get; set; }

        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public PermitStatus? Status { get; set; }

        [MaxLength(100)]
        public string? WorkLocation { get; set; }

        [MaxLength(2000)]
        public string? SafetyRequirements { get; set; }

        [MaxLength(1000)]
        public string? ApprovalNotes { get; set; }

        public int? ResponsibleEngineerId { get; set; }
        public int? PlantId { get; set; }
        public int? DepartmentId { get; set; }
    }
}
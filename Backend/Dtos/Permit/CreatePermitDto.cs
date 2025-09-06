using System.ComponentModel.DataAnnotations;
using SafetyManagementPortal.Backend.Models;

namespace SafetyManagementPortal.Backend.DTOs.Permit
{
    public class CreatePermitDto
    {
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(100)]
        public string? PermitType { get; set; }

        [MaxLength(1000)]
        public string? Description { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        [MaxLength(100)]
        public string? WorkLocation { get; set; }

        [MaxLength(2000)]
        public string? SafetyRequirements { get; set; }

        [Required]
        public int RequestedByUserId { get; set; }

        public int? ResponsibleEngineerId { get; set; }
        public int? PlantId { get; set; }
        public int? DepartmentId { get; set; }
    }
}

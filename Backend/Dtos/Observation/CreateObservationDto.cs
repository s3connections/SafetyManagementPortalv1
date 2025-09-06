using System.ComponentModel.DataAnnotations;
using SafetyManagementPortal.Backend.Models;

namespace SafetyManagementPortal.Backend.DTOs.Observation
{
    public class CreateObservationDto
    {
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [MaxLength(2000)]
        public string Description { get; set; } = string.Empty;

        [Required]
        public ObservationType ObservationType { get; set; }

        // ✅ FIXED: Use Priority entity reference instead of PriorityLevel enum
        [Required]
        public int PriorityId { get; set; }

        [MaxLength(100)]
        public string? Location { get; set; }

        public DateTime? DueDate { get; set; }

        [Required]
        public int ReportedByUserId { get; set; }

        public int? AssignedToUserId { get; set; }
        public int? PlantId { get; set; }
        public int? DepartmentId { get; set; }
    }
}

using System.ComponentModel.DataAnnotations;
using Backend.Models;

namespace Backend.Dtos.Observation
{
    public class UpdateObservationDto
    {
        [MaxLength(200)]
        public string? Title { get; set; }

        [MaxLength(2000)]
        public string? Description { get; set; }

        public ObservationType? ObservationType { get; set; }

        // ✅ FIXED: Use PriorityLevel enum instead of Priority entity
        public PriorityLevel? Priority { get; set; }

        public ObservationStatus? Status { get; set; }

        [MaxLength(100)]
        public string? Location { get; set; }

        public DateTime? DueDate { get; set; }

        [MaxLength(1000)]
        public string? ResolutionNotes { get; set; }

        public int? AssignedToUserId { get; set; }
        public int? PlantId { get; set; }
        public int? DepartmentId { get; set; }
    }
}
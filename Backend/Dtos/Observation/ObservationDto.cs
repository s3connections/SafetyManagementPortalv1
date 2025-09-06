using Backend.Models;

namespace Backend.Dtos.Observation
{
    public class ObservationDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public ObservationType ObservationType { get; set; }
        
        // ✅ FIXED: Use Priority entity instead of PriorityLevel enum
        public Priority Priority { get; set; } = null!;
        
        public ObservationStatus Status { get; set; }
        public string? Location { get; set; }
        public string TicketNumber { get; set; } = string.Empty;
        public DateTime? DueDate { get; set; }
        public DateTime? CompletedDate { get; set; }
        public string? ResolutionNotes { get; set; }
        public string? ImagePath { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        // User information
        public int ReportedByUserId { get; set; }
        public string ReportedByUserName { get; set; } = string.Empty;
        public string ReportedByUserEmail { get; set; } = string.Empty;
        public int? AssignedToUserId { get; set; }
        public string? AssignedToUserName { get; set; }
        public string? AssignedToUserEmail { get; set; }

        // Plant and Department information
        public int? PlantId { get; set; }
        public string? PlantName { get; set; }
        public int? DepartmentId { get; set; }
        public string? DepartmentName { get; set; }
    }
}
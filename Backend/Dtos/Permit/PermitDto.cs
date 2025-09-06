using SafetyManagementPortal.Backend.Models;

namespace SafetyManagementPortal.Backend.DTOs.Permit
{
    public class PermitDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string PermitNumber { get; set; } = string.Empty;
        public string? PermitType { get; set; }
        public string? Description { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public PermitStatus Status { get; set; }
        public string? WorkLocation { get; set; }
        public string? SafetyRequirements { get; set; }
        public string? ApprovalNotes { get; set; }
        public DateTime? ApprovedDate { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        
        // User information
        public int RequestedByUserId { get; set; }
        public string RequestedByUserName { get; set; } = string.Empty;
        public string RequestedByUserEmail { get; set; } = string.Empty;
        
        public int? ApprovedByUserId { get; set; }
        public string? ApprovedByUserName { get; set; }
        public string? ApprovedByUserEmail { get; set; }
        
        public int? ResponsibleEngineerId { get; set; }
        public string? ResponsibleEngineerName { get; set; }
        public string? ResponsibleEngineerEmail { get; set; }
        
        // Plant and Department information
        public int? PlantId { get; set; }
        public string? PlantName { get; set; }
        
        public int? DepartmentId { get; set; }
        public string? DepartmentName { get; set; }
    }
}

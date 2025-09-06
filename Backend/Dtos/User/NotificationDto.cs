using SafetyManagementPortal.Backend.DTOs.Common;
using SafetyManagementPortal.Backend.DTOs.Employee;

namespace SafetyManagementPortal.Backend.DTOs.User
{
    public class NotificationDto : BaseDto
    {
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty; // Email / SMS / Push …
        public int     RecipientId { get; set; }
        public EmployeeDto? Recipient { get; set; }
        public bool    IsRead     { get; set; }
        public DateTime? ReadDate { get; set; }
        public string Status { get; set; } = string.Empty;
        public int?    EntityId   { get; set; }
        public string? EntityType { get; set; }
    }
}

using SafetyManagementPortal.Backend.DTOs.Common;
using SafetyManagementPortal.Backend.DTOs.employee;

namespace SafetyManagementPortal.Backend.DTOs.User
{
    public class NotificationDto : BaseDto
    {
        public string  Title      { get; set; }
        public string  Message    { get; set; }
        public string  Type       { get; set; }   // Email / SMS / Push …
        public int     RecipientId { get; set; }
        public EmployeeDto Recipient { get; set; }
        public bool    IsRead     { get; set; }
        public DateTime? ReadDate { get; set; }
        public string  Status     { get; set; }
        public int?    EntityId   { get; set; }
        public string? EntityType { get; set; }
    }
}

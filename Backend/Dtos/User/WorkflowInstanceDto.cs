using SafetyManagementPortal.Backend.DTOs.Common;

namespace SafetyManagementPortal.Backend.DTOs.User
{
    public class WorkflowInstanceDto : BaseDto
    {
        public int    WorkflowDefinitionId { get; set; }
        public int    EntityId             { get; set; }
        public string EntityType           { get; set; }
        public int    CurrentStepId        { get; set; }
        public string Status               { get; set; }
        public DateTime? CompletedDate     { get; set; }
    }
}

using Backend.DTOs.User;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SafetyManagementPortal.Backend.Services.Interfaces
{
    public interface IWorkflowService
    {
        Task<WorkflowInstanceDto> StartWorkflowAsync(string entityType, int entityId, int workflowDefinitionId);
        Task<WorkflowInstanceDto> MoveToNextStepAsync(int workflowInstanceId);
        Task<WorkflowInstanceDto> GetWorkflowInstanceAsync(int workflowInstanceId);
        Task<List<WorkflowInstanceDto>> GetPendingWorkflowsAsync(int employeeId);
    }
}

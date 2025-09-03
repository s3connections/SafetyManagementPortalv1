using Backend.Data;
using Backend.DTOs.User;
using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Services.Implementations
{
    public class WorkflowService : IWorkflowService
    {
        private readonly SafetyManagementContext _ctx;
        public WorkflowService(SafetyManagementContext ctx){_ctx=ctx;}
        public async Task<WorkflowInstanceDto> StartWorkflowAsync(string et,int eid,int wdid){var def=await _ctx.WorkflowDefinitions.Include(s=>s.WorkflowSteps).FirstOrDefaultAsync(d=>d.Id==wdid&&d.IsActive);if(def==null)return null;var first=def.WorkflowSteps.OrderBy(s=>s.StepOrder).First();var inst=new WorkflowInstance{EntityId=eid,EntityType=et,WorkflowDefinitionId=wdid,CurrentStepId=first.Id,Status="In Progress",CreatedAt=DateTime.UtcNow,CreatedBy=1};_ctx.WorkflowInstances.Add(inst);await _ctx.SaveChangesAsync();return new WorkflowInstanceDto{Id=inst.Id,Status=inst.Status,CurrentStepId=inst.CurrentStepId};}
        public async Task<WorkflowInstanceDto> MoveToNextStepAsync(int id){var inst=await _ctx.WorkflowInstances.Include(d=>d.WorkflowDefinition).ThenInclude(s=>s.WorkflowSteps).FirstOrDefaultAsync(i=>i.Id==id&&!i.IsDeleted);if(inst==null)return null;var steps=inst.WorkflowDefinition.WorkflowSteps.OrderBy(s=>s.StepOrder).ToList();var currentIndex=steps.FindIndex(s=>s.Id==inst.CurrentStepId);if(currentIndex==steps.Count-1){inst.Status="Completed";inst.CompletedDate=DateTime.UtcNow;}else{inst.CurrentStepId=steps[currentIndex+1].Id;}inst.UpdatedAt=DateTime.UtcNow;inst.UpdatedBy=1;await _ctx.SaveChangesAsync();return new WorkflowInstanceDto{Id=inst.Id,Status=inst.Status,CurrentStepId=inst.CurrentStepId};}
        public async Task<WorkflowInstanceDto> GetWorkflowInstanceAsync(int id){var i=await _ctx.WorkflowInstances.FirstOrDefaultAsync(x=>x.Id==id&&!x.IsDeleted);return i==null?null:new WorkflowInstanceDto{Id=i.Id,Status=i.Status,CurrentStepId=i.CurrentStepId};}
        public async Task<List<WorkflowInstanceDto>> GetPendingWorkflowsAsync(int empId)=>await _ctx.WorkflowInstances.Include(s=>s.CurrentStep).Where(i=>i.Status=="In Progress"&&i.CurrentStep.EmployeeId==empId).Select(i=>new WorkflowInstanceDto{Id=i.Id,EntityType=i.EntityType,EntityId=i.EntityId,CurrentStepId=i.CurrentStepId}).ToListAsync();
    }
}
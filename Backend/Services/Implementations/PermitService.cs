using Backend.Data;
using Backend.DTOs.Common;
using Backend.DTOs.Permit;
using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
namespace Backend.Services.Implementations
{
    public class PermitService : BaseService<Permit, PermitDto, CreatePermitDto, UpdatePermitDto>, IPermitService
    {
        public PermitService(SafetyManagementContext ctx) : base(ctx) { }
        private SafetyManagementContext C => (SafetyManagementContext)_context;
        public override async Task<PagedResult<PermitDto>> GetAllAsync(SearchFilter f)
        {
            var q=C.Permits.Where(p=>!p.IsDeleted);
            var total=await q.CountAsync();
            var data=await q.Skip((f.PageNumber-1)*f.PageSize).Take(f.PageSize).Select(p=>new PermitDto{Id=p.Id,Title=p.Title,PermitNumber=p.PermitNumber,Status=p.Status}).ToListAsync();
            return new PagedResult<PermitDto>{Items=data,TotalItems=total,PageNumber=f.PageNumber,PageSize=f.PageSize,TotalPages=(int)Math.Ceiling((double)total/f.PageSize)};
        }
        public override async Task<PermitDto> GetByIdAsync(int id){var p=await C.Permits.FirstOrDefaultAsync(x=>x.Id==id&&!x.IsDeleted);return p==null?null:new PermitDto{Id=p.Id,Title=p.Title,PermitNumber=p.PermitNumber,Status=p.Status};}
        public override async Task<PermitDto> CreateAsync(CreatePermitDto d){var num=await GeneratePermitNumberAsync();var p=new Permit{Title=d.Title,PermitNumber=num,PermitTypeId=d.PermitTypeId,PlantId=d.PlantId,LocationId=d.LocationId,RequestedById=d.RequestedById,ValidFrom=d.ValidFrom,ValidTo=d.ValidTo,WorkDescription=d.WorkDescription,Status="Pending",CreatedAt=DateTime.UtcNow,CreatedBy=1};C.Permits.Add(p);await C.SaveChangesAsync();return new PermitDto{Id=p.Id,PermitNumber=p.PermitNumber,Title=p.Title};}
        public override async Task<PermitDto> UpdateAsync(int id,UpdatePermitDto d){var p=await C.Permits.FirstOrDefaultAsync(x=>x.Id==id&&!x.IsDeleted);if(p==null)return null;if(d.ValidTo.HasValue)p.ValidTo=d.ValidTo.Value;p.UpdatedAt=DateTime.UtcNow;p.UpdatedBy=1;await C.SaveChangesAsync();return new PermitDto{Id=p.Id,Title=p.Title,PermitNumber=p.PermitNumber};}
        public async Task<string> GeneratePermitNumberAsync(){var y=DateTime.Now.Year;var c=await C.Permits.CountAsync(p=>p.CreatedAt.Year==y);return $"PER-{y}-{(c+1):D6}";}
        public async Task<List<PermitDto>> GetActivePermitsAsync()=>await C.Permits.Where(p=>p.Status=="Approved"&&!p.IsDeleted).Select(p=>new PermitDto{Id=p.Id,Title=p.Title}).ToListAsync();
        public async Task<List<PermitDto>> GetExpiringPermitsAsync(int d){var cut=DateTime.UtcNow.AddDays(d);return await C.Permits.Where(p=>p.Status=="Approved"&&p.ValidTo<=cut&&!p.IsDeleted).Select(p=>new PermitDto{Id=p.Id,Title=p.Title}).ToListAsync();}
        public async Task<PermitDto> ApprovePermitAsync(int id,string cmt){var p=await C.Permits.FirstOrDefaultAsync(x=>x.Id==id&&!x.IsDeleted);if(p==null||p.Status!="Pending")return null;p.Status="Approved";p.ApprovedDate=DateTime.UtcNow;p.ApprovalComments=cmt;p.ApprovedById=1;p.UpdatedAt=DateTime.UtcNow;p.UpdatedBy=1;C.PermitApprovalHistories.Add(new PermitApprovalHistory{PermitId=id,ApprovedById=1,ApprovalType="Approval",Status="Approved",Comments=cmt,ApprovalDate=DateTime.UtcNow,CreatedAt=DateTime.UtcNow,CreatedBy=1});await C.SaveChangesAsync();return new PermitDto{Id=p.Id,Status=p.Status};}
        public async Task<PermitDto> RejectPermitAsync(int id,string cmt){var p=await C.Permits.FirstOrDefaultAsync(x=>x.Id==id&&!x.IsDeleted);if(p==null||p.Status!="Pending")return null;p.Status="Rejected";p.ApprovalComments=cmt;p.ApprovedById=1;p.UpdatedAt=DateTime.UtcNow;p.UpdatedBy=1;C.PermitApprovalHistories.Add(new PermitApprovalHistory{PermitId=id,ApprovedById=1,ApprovalType="Rejection",Status="Rejected",Comments=cmt,ApprovalDate=DateTime.UtcNow,CreatedAt=DateTime.UtcNow,CreatedBy=1});await C.SaveChangesAsync();return new PermitDto{Id=p.Id,Status=p.Status};}
        public async Task<PermitQuestionResponseDto> AddQuestionResponseAsync(int id,CreatePermitQuestionResponseDto r){var qr=new PermitQuestionResponse{PermitId=id,QuestionId=r.QuestionId,Response=r.Response,Comments=r.Comments,CreatedAt=DateTime.UtcNow,CreatedBy=1};C.PermitQuestionResponses.Add(qr);await C.SaveChangesAsync();return new PermitQuestionResponseDto{Id=qr.Id,Response=qr.Response};}
    }
}

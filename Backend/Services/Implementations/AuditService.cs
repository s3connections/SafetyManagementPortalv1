using Backend.Data;
using Backend.DTOs.Audit;
using Backend.DTOs.Common;
using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
namespace Backend.Services.Implementations
{
    public class AuditService : BaseService<Audit, AuditDto, CreateAuditDto, UpdateAuditDto>, IAuditService
    {
        public AuditService(SafetyManagementContext ctx) : base(ctx) { }
        private SafetyManagementContext C => (SafetyManagementContext)_context;
        public override async Task<PagedResult<AuditDto>> GetAllAsync(SearchFilter f)
        {
            var q = C.Audits.Where(a => !a.IsDeleted);
            var total = await q.CountAsync();
            var data = await q.Skip((f.PageNumber-1)*f.PageSize).Take(f.PageSize).Select(a=> new AuditDto { Id=a.Id, Title=a.Title, AuditNumber=a.AuditNumber, Status=a.Status}).ToListAsync();
            return new PagedResult<AuditDto>{Items=data,TotalItems=total,PageNumber=f.PageNumber,PageSize=f.PageSize,TotalPages=(int)Math.Ceiling((double)total/f.PageSize)};
        }
        public override async Task<AuditDto> GetByIdAsync(int id){var a=await C.Audits.FirstOrDefaultAsync(x=>x.Id==id&&!x.IsDeleted);return a==null?null:new AuditDto{Id=a.Id,Title=a.Title,AuditNumber=a.AuditNumber,Status=a.Status};}
        public override async Task<AuditDto> CreateAsync(CreateAuditDto d){var num=await GenerateAuditNumberAsync();var a=new Audit{Title=d.Title,AuditNumber=num,AuditTypeId=d.AuditTypeId,PlantId=d.PlantId,LocationId=d.LocationId,ScheduledDate=d.ScheduledDate,CreatedAt=DateTime.UtcNow,CreatedBy=1};C.Audits.Add(a);await C.SaveChangesAsync();return new AuditDto{Id=a.Id,AuditNumber=a.AuditNumber,Title=a.Title};}
        public override async Task<AuditDto> UpdateAsync(int id,UpdateAuditDto d){var a=await C.Audits.FirstOrDefaultAsync(x=>x.Id==id&&!x.IsDeleted);if(a==null)return null;if(!string.IsNullOrEmpty(d.Title))a.Title=d.Title;a.UpdatedAt=DateTime.UtcNow;a.UpdatedBy=1;await C.SaveChangesAsync();return new AuditDto{Id=a.Id,Title=a.Title,AuditNumber=a.AuditNumber};}
        public async Task<string> GenerateAuditNumberAsync(){var y=DateTime.Now.Year;var c=await C.Audits.CountAsync(a=>a.CreatedAt.Year==y);return $"AUD-{y}-{(c+1):D6}";}
        public async Task<List<AuditDto>> GetAuditsByTypeAsync(int t)=>await C.Audits.Where(a=>a.AuditTypeId==t&&!a.IsDeleted).Select(a=>new AuditDto{Id=a.Id,Title=a.Title}).ToListAsync();
        public async Task<List<AuditDto>> GetScheduledAuditsAsync()=>await C.Audits.Where(a=>a.Status=="Scheduled"&&!a.IsDeleted).Select(a=>new AuditDto{Id=a.Id,Title=a.Title}).ToListAsync();
        public async Task<AuditQuestionResponseDto> AddQuestionResponseAsync(int id,CreateAuditQuestionResponseDto r){var qr=new AuditQuestionResponse{AuditId=id,QuestionId=r.QuestionId,Response=r.Response,Comments=r.Comments,IsCompliant=r.IsCompliant,CreatedAt=DateTime.UtcNow,CreatedBy=1};C.AuditQuestionResponses.Add(qr);await C.SaveChangesAsync();return new AuditQuestionResponseDto{Id=qr.Id,Response=qr.Response};}
    }
}

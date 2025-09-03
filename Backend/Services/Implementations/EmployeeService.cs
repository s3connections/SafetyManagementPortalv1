using Backend.Data;
using Backend.DTOs.Common;
using Backend.DTOs.Employee;
using Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Services.Implementations
{
    public class EmployeeService : IEmployeeService
    {
        private readonly SafetyManagementContext _ctx;
        public EmployeeService(SafetyManagementContext ctx) { _ctx = ctx; }

        public async Task<PagedResult<EmployeeDto>> GetAllAsync(SearchFilter f)
        {
            var q=_ctx.Employees.Include(e=>e.Department).Include(e=>e.Plant).Where(e=>e.IsActive&&!e.IsDeleted);
            if(!string.IsNullOrEmpty(f.SearchTerm)) q=q.Where(e=>e.FirstName.Contains(f.SearchTerm)||e.LastName.Contains(f.SearchTerm)||e.Email.Contains(f.SearchTerm));
            var total=await q.CountAsync();
            var data=await q.Skip((f.PageNumber-1)*f.PageSize).Take(f.PageSize).Select(e=>new EmployeeDto{Id=e.Id,FullName=e.FullName,Email=e.Email,Designation=e.Designation}).ToListAsync();
            return new PagedResult<EmployeeDto>{Items=data,TotalItems=total,PageNumber=f.PageNumber,PageSize=f.PageSize,TotalPages=(int)Math.Ceiling((double)total/f.PageSize)};
        }
        public async Task<EmployeeDto> GetByIdAsync(int id){var e=await _ctx.Employees.Include(d=>d.Department).Include(p=>p.Plant).FirstOrDefaultAsync(x=>x.Id==id&&!x.IsDeleted);return e==null?null:new EmployeeDto{Id=e.Id,FullName=e.FullName,Email=e.Email,Designation=e.Designation};}
        public async Task<EmployeeDto> GetByEmployeeIdAsync(string emp){var e=await _ctx.Employees.FirstOrDefaultAsync(x=>x.EmployeeId==emp&&!x.IsDeleted);return e==null?null:new EmployeeDto{Id=e.Id,FullName=e.FullName,Email=e.Email};}
        public async Task<List<EmployeeDto>> GetByDepartmentAsync(int d)=>await _ctx.Employees.Where(e=>e.DepartmentId==d&&!e.IsDeleted).Select(e=>new EmployeeDto{Id=e.Id,FullName=e.FullName}).ToListAsync();
        public async Task<List<EmployeeDto>> GetByPlantAsync(int p)=>await _ctx.Employees.Where(e=>e.PlantId==p&&!e.IsDeleted).Select(e=>new EmployeeDto{Id=e.Id,FullName=e.FullName}).ToListAsync();
        public async Task<List<EmployeeDto>> GetReportingManagersAsync(int id){var list=new List<EmployeeDto>();var current=await _ctx.Employees.Include(r=>r.ReportingManager).FirstOrDefaultAsync(e=>e.Id==id&&!e.IsDeleted);while(current?.ReportingManager!=null){list.Add(new EmployeeDto{Id=current.ReportingManager.Id,FullName=current.ReportingManager.FullName});current=await _ctx.Employees.Include(r=>r.ReportingManager).FirstOrDefaultAsync(e=>e.Id==current.ReportingManagerId&&!e.IsDeleted);}return list;}
    }
}
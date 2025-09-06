using System;
using Backend.DTOs.Common;

namespace SafetyManagementPortal.Backend.DTOs.Employee
{
    public class EmployeeDto : BaseDto
    {
        public string EmployeeId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string? PhoneNumber { get; set; }
        public int DepartmentId { get; set; }
        public DepartmentDto Department { get; set; }
        public int PlantId { get; set; }
        public PlantDto Plant { get; set; }
        public string Designation { get; set; }
        public DateTime? DateOfJoining { get; set; }
        public bool IsActive { get; set; }
        public int? ReportingManagerId { get; set; }
        public EmployeeDto? ReportingManager { get; set; }
    }

    public class DepartmentDto : BaseDto
    {
        public string Name { get; set; }
        public string Code { get; set; }
        public string? Description { get; set; }
        public int? ParentDepartmentId { get; set; }
        public DepartmentDto? ParentDepartment { get; set; }
        public int? HoDId { get; set; }
        public EmployeeDto? HoD { get; set; }
        public bool IsActive { get; set; }
    }
}

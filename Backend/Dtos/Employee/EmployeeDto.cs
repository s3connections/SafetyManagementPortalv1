using System;
using System.Collections.Generic;
using SafetyManagementPortal.Backend.DTOs.Common;
using SafetyManagementPortal.Backend.DTOs.Incident;
using SafetyManagementPortal.Backend.DTOs.Employee;
using SafetyManagementPortal.Backend.DTOs.Observation;
using SafetyManagementPortal.Backend.DTOs.Permit;
using SafetyManagementPortal.Backend.DTOs.Audit;
using SafetyManagementPortal.Backend.DTOs.User;
using SafetyManagementPortal.Backend.Services.Interfaces;
using SafetyManagementPortal.Backend.Models;
using SafetyManagementPortal.Backend.enums;
using SafetyManagementPortal.Backend.DTOs.Department;

namespace SafetyManagementPortal.Backend.DTOs.Employee  // Fixed: was "employee" (lowercase)
{
    public class EmployeeDto : BaseDto
    {
        public string EmployeeId { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public int DepartmentId { get; set; }
        public DepartmentDto? Department { get; set; }
        public int PlantId { get; set; }
        public PlantDto? Plant { get; set; }
        public string? Designation { get; set; }
        public DateTime? DateOfJoining { get; set; }
        public bool IsActive { get; set; }
        public int? ReportingManagerId { get; set; }
        public EmployeeDto? ReportingManager { get; set; }
    }
}
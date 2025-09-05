using Backend.DTOs.Common;
using Backend.DTOs.Employee;
using Backend.DTOs.Incident;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs.Audit
{
    public class AuditDto : BaseDto
    {
        public string Title { get; set; }
        public string AuditNumber { get; set; }
        public int AuditTypeId { get; set; }
        public AuditTypeDto AuditType { get; set; }
        public int PlantId { get; set; }
        public PlantDto Plant { get; set; }
        public int LocationId { get; set; }
        public LocationDto Location { get; set; }
        public DateTime ScheduledDate { get; set; }
        public DateTime? ActualStartDate { get; set; }
        public DateTime? ActualEndDate { get; set; }
        public string Status { get; set; }
        public string? Scope { get; set; }
        public string? Objectives { get; set; }
        public string? Summary { get; set; }
        public string? Findings { get; set; }
        public string? Recommendations { get; set; }
        public List<EmployeeDto>? Auditors { get; set; }
        public List<EmployeeDto>? Auditees { get; set; }
        public List<AuditQuestionResponseDto>? QuestionResponses { get; set; }
    }

    public class CreateAuditDto
    {
        [Required]
        public string Title { get; set; }
        
        [Required]
        public int AuditTypeId { get; set; }
        
        [Required]
        public int PlantId { get; set; }
        
        [Required]
        public int LocationId { get; set; }
        
        [Required]
        public DateTime ScheduledDate { get; set; }
        
        [Required]
        public List<int> AuditorIds { get; set; }
        
        public List<int>? AuditeeIds { get; set; }
        
        public string? Scope { get; set; }
        
        public string? Objectives { get; set; }
    }

    public class UpdateAuditDto
    {
        public string? Title { get; set; }
        public int? AuditTypeId { get; set; }
        public int? PlantId { get; set; }
        public int? LocationId { get; set; }
        public DateTime? ScheduledDate { get; set; }
        public DateTime? ActualStartDate { get; set; }
        public DateTime? ActualEndDate { get; set; }
        public List<int>? AuditorIds { get; set; }
        public List<int>? AuditeeIds { get; set; }
        public string? Scope { get; set; }
        public string? Objectives { get; set; }
        public string? Summary { get; set; }
        public string? Findings { get; set; }
        public string? Recommendations { get; set; }
    }

    public class AuditTypeDto : BaseDto
    {
        public string Name { get; set; }
        public string Code { get; set; }
        public string? Description { get; set; }
        public int CategoryId { get; set; }
        public CategoryDto Category { get; set; }
        public bool IsActive { get; set; }
    }

    public class AuditQuestionDto : BaseDto
    {
        public int AuditTypeId { get; set; }
        public AuditTypeDto AuditType { get; set; }
        public string QuestionText { get; set; }
        public string ResponseType { get; set; } // Yes/No, Rating, Text, etc.
        public string? ExpectedResponse { get; set; }
        public bool IsMandatory { get; set; }
        public int SortOrder { get; set; }
        public bool IsActive { get; set; }
    }

    public class AuditQuestionResponseDto : BaseDto
    {
        public int AuditId { get; set; }
        public int QuestionId { get; set; }
        public AuditQuestionDto Question { get; set; }
        public string Response { get; set; }
        public string? Comments { get; set; }
        public bool IsCompliant { get; set; }
    }

    public class CreateAuditQuestionResponseDto
    {
        [Required]
        public int QuestionId { get; set; }
        
        [Required]
        public string Response { get; set; }
        
        public string? Comments { get; set; }
        
        public bool IsCompliant { get; set; } = true;
    }
}
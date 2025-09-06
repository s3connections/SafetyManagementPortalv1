using SafetyManagementPortal.Backend.DTOs.Common;
using SafetyManagementPortal.Backend.DTOs.employee;
using SafetyManagementPortal.Backend.DTOs.Incident;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SafetyManagementPortal.Backend.DTOs.User
{
    public class PermitDto : BaseDto
    {
        public string Title { get; set; } = string.Empty;
        public string PermitNumber { get; set; } = string.Empty;
        public int PermitTypeId { get; set; }
        public PermitTypeDto? PermitType { get; set; }
        public int PlantId { get; set; }
        public PlantDto? Plant { get; set; }
        public int LocationId { get; set; }
        public LocationDto? Location { get; set; }
        public int RequestedById { get; set; }
        public EmployeeDto? RequestedBy { get; set; }
        public DateTime ValidFrom { get; set; }
        public DateTime ValidTo { get; set; }
        public string WorkDescription { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string? HazardIdentification { get; set; }
        public string? SafetyMeasures { get; set; }
        public string? ApprovalComments { get; set; }
        public DateTime? ApprovedDate { get; set; }
        public int? ApprovedById { get; set; }
        public EmployeeDto? ApprovedBy { get; set; }
        public List<EmployeeDto>? Workers { get; set; }
        public List<PermitQuestionResponseDto>? QuestionResponses { get; set; }
        public List<PermitApprovalHistoryDto>? ApprovalHistory { get; set; }
    }

    public class CreatePermitDto
    {
        [Required]
        public string Title { get; set; } = string.Empty;
        
        [Required]
        public int PermitTypeId { get; set; }
        
        [Required]
        public int PlantId { get; set; }
        
        [Required]
        public int LocationId { get; set; }
        
        [Required]
        public int RequestedById { get; set; }
        
        [Required]
        public DateTime ValidFrom { get; set; }
        
        [Required]
        public DateTime ValidTo { get; set; }

        [Required]
        public string WorkDescription { get; set; } = string.Empty;
        
        public List<int>? WorkerIds { get; set; }
        
        public string? HazardIdentification { get; set; }
        
        public string? SafetyMeasures { get; set; }
        
        public List<CreatePermitQuestionResponseDto>? QuestionResponses { get; set; }
    }

    public class UpdatePermitDto
    {
        public string? Title { get; set; }
        public int? PermitTypeId { get; set; }
        public int? PlantId { get; set; }
        public int? LocationId { get; set; }
        public DateTime? ValidFrom { get; set; }
        public DateTime? ValidTo { get; set; }
        public string? WorkDescription { get; set; }
        public List<int>? WorkerIds { get; set; }
        public string? HazardIdentification { get; set; }
        public string? SafetyMeasures { get; set; }
        public string? ApprovalComments { get; set; }
    }

    public class PermitTypeDto : BaseDto
    {
        public string Name { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int CategoryId { get; set; }
        public CategoryDto? Category { get; set; }
        public int ValidityHours { get; set; }
        public bool RequiresApproval { get; set; }
        public bool IsActive { get; set; }
    }

    public class PermitQuestionDto : BaseDto
    {
        public int PermitTypeId { get; set; }
        public PermitTypeDto? PermitType { get; set; }
        public string QuestionText { get; set; } = string.Empty;
        public string ResponseType { get; set; } = string.Empty;
        public string? ExpectedResponse { get; set; }
        public bool IsMandatory { get; set; }
        public int SortOrder { get; set; }
        public bool IsActive { get; set; }
    }

    public class PermitQuestionResponseDto : BaseDto
    {
        public int PermitId { get; set; }
        public int QuestionId { get; set; }
        public PermitQuestionDto? Question { get; set; }
        public string Response { get; set; } = string.Empty;
        public string? Comments { get; set; }
    }

    public class CreatePermitQuestionResponseDto
    {
        [Required]
        public int QuestionId { get; set; }

        [Required]
        public string Response { get; set; } = string.Empty;
        
        public string? Comments { get; set; }
    }

    public class PermitApprovalHistoryDto : BaseDto
    {
        public int PermitId { get; set; }
        public int ApprovedById { get; set; }
        public EmployeeDto? ApprovedBy { get; set; }
        public string ApprovalType { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string? Comments { get; set; }
        public DateTime ApprovalDate { get; set; }
    }
}

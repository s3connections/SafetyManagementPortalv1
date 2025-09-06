using Backend.DTOs.Common;
using Backend.DTOs.Employee;
using System;
using System.Collections.Generic;

namespace SafetyManagementPortal.Backend.DTOs.Incident
{
    public class IncidentObservationDto : BaseDto
    {
        public string Title { get; set; } = string.Empty;
        public string IncidentNumber { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int IncidentTypeId { get; set; }
        public IncidentTypeDto? IncidentType { get; set; }
        public int PriorityId { get; set; }
        public PriorityDto? Priority { get; set; }
        public int PlantId { get; set; }
        public PlantDto? Plant { get; set; }
        public int LocationId { get; set; }
        public LocationDto? Location { get; set; }
        public DateTime DateTimeObserved { get; set; }
        public int? ReportedById { get; set; }
        public EmployeeDto? ReportedBy { get; set; }
        public string? ImmediateActions { get; set; }
        public int StatusId { get; set; }
        public IncidentStatusDto? Status { get; set; }
        public List<InvestigationWitnessDto>? Witnesses { get; set; }
        public List<IncidentObservationAttachmentDto>? Attachments { get; set; }
    }

    public class IncidentTypeDto : BaseDto
    {
        public string Name { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int CategoryId { get; set; }
        public CategoryDto? Category { get; set; }
        public bool IsActive { get; set; }
    }

    public class IncidentStatusDto : BaseDto
    {
        public string Name { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Color { get; set; } = string.Empty;
        public int SortOrder { get; set; }
        public bool IsActive { get; set; }
    }

    public class PriorityDto : BaseDto
    {
        public string Name { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Color { get; set; } = string.Empty;
        public int SortOrder { get; set; }
        public int SlaHours { get; set; }
        public bool IsActive { get; set; }
    }

    public class CategoryDto : BaseDto
    {
        public string Name { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int? ParentCategoryId { get; set; }
        public CategoryDto? ParentCategory { get; set; }
        public bool IsActive { get; set; }
    }

   
  

    public class LocationDto : BaseDto
    {
        public string Name { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int PlantId { get; set; }
        public PlantDto? Plant { get; set; }
        public int? ParentLocationId { get; set; }
        public LocationDto? ParentLocation { get; set; }
        public bool IsActive { get; set; }
    }

    public class InvestigationWitnessDto : BaseDto
    {
        public int IncidentObservationId { get; set; }
        public int EmployeeId { get; set; }
        public EmployeeDto? Employee { get; set; }
        public string Statement { get; set; } = string.Empty;
        public DateTime? InterviewDate { get; set; }
        public int? InterviewedById { get; set; }
        public EmployeeDto? InterviewedBy { get; set; }
    }

    public class IncidentObservationAttachmentDto : BaseDto
    {
        public int IncidentObservationId { get; set; }
        public string FileName { get; set; } = string.Empty;
        public string FilePath { get; set; } = string.Empty;
        public long FileSize { get; set; }
        public string FileType { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? FileUrl { get; set; }
    }
}

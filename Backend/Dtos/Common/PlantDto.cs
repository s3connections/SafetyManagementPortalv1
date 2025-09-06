using System;

namespace SafetyManagementPortal.Backend.DTOs.Common
{
    public class PlantDto : BaseDto
    {
        public string Name { get; set; } = string.Empty;
        public string PlantCode { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string? Description { get; set; }
        public bool IsOperational { get; set; }
        public string? ContactPerson { get; set; }
        public string? ContactEmail { get; set; }
        public string? ContactPhone { get; set; }
        public bool IsActive { get; set; }
    }
}
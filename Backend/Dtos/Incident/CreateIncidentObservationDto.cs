using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SafetyManagementPortal.Backend.DTOs.Incident
{
    public class CreateIncidentObservationDto
    {
        [Required]
        public string Title { get; set; }
        
        [Required]
        public string Description { get; set; }
        
        [Required]
        public int IncidentTypeId { get; set; }
        
        [Required]
        public int PriorityId { get; set; }
        
        [Required]
        public int PlantId { get; set; }
        
        [Required]
        public int LocationId { get; set; }
        
        [Required]
        public DateTime DateTimeObserved { get; set; }
        
        public int? ReportedById { get; set; }
        
        public string? ImmediateActions { get; set; }
        
        public List<int>? WitnessIds { get; set; }
        
        public List<CreateIncidentObservationAttachmentDto>? Attachments { get; set; }
    }

    public class CreateIncidentObservationAttachmentDto
    {
        [Required]
        public string FileName { get; set; }
        
        [Required]
        public string FileContent { get; set; } // Base64 encoded
        
        public string? Description { get; set; }
    }
}

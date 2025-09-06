using System;
using System.Collections.Generic;

namespace SafetyManagementPortal.Backend.DTOs.Incident
{
    public class UpdateIncidentObservationDto
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public int? IncidentTypeId { get; set; }
        public int? PriorityId { get; set; }
        public int? PlantId { get; set; }
        public int? LocationId { get; set; }
        public DateTime? DateTimeObserved { get; set; }
        public int? ReportedById { get; set; }
        public string? ImmediateActions { get; set; }
        public List<int>? WitnessIds { get; set; }
    }
}

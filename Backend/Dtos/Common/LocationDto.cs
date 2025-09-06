namespace SafetyManagementPortal.Backend.DTOs.Common
{
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
}
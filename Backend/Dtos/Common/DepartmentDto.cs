namespace SafetyManagementPortal.Backend.DTOs.Department
{
    public class DepartmentDto : BaseDto
    {
        public string Name { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int PlantId { get; set; }
        public Plant? Plant { get; set; }
        public int? ParentDepartmentId { get; set; }
        public DepartmentDto? ParentDepartment { get; set; }
        public string? ManagerName { get; set; }
        public string? ManagerEmail { get; set; }
        public bool IsActive { get; set; }
    }
}
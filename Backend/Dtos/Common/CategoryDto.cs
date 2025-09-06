using System;
using System.Collections.Generic;

namespace SafetyManagementPortal.Backend.DTOs.Common
{
    public class CategoryDto : BaseDto
    {
        public string Name { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int? ParentCategoryId { get; set; }
        public CategoryDto? ParentCategory { get; set; }
        public string? Color { get; set; }
        public int SortOrder { get; set; }
        public bool IsActive { get; set; }
    }
}
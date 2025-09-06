using System;
using System.Collections.Generic;

namespace SafetyManagementPortal.Backend.DTOs.Common
{
    public class SearchFilter
    {
        public string? SearchTerm { get; set; }
        public int? PlantId { get; set; }
        public int? LocationId { get; set; }
        public int? DepartmentId { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public List<int>? StatusIds { get; set; }
        public List<int>? TypeIds { get; set; }
        public List<int>? PriorityIds { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? SortBy { get; set; }
        public bool SortDescending { get; set; } = true;
    }
}

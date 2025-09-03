using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    [Table("Categories")]
    public class Category : BaseEntity
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; }
        
        [Required]
        [StringLength(20)]
        public string Code { get; set; }
        
        [StringLength(500)]
        public string? Description { get; set; }
        
        public int? ParentCategoryId { get; set; }
        
        [ForeignKey("ParentCategoryId")]
        public virtual Category? ParentCategory { get; set; }
        
        [Required]
        public bool IsActive { get; set; } = true;
        
        // Navigation Properties
        public virtual ICollection<Category> SubCategories { get; set; } = new List<Category>();
        public virtual ICollection<IncidentType> IncidentTypes { get; set; } = new List<IncidentType>();
        public virtual ICollection<AuditType> AuditTypes { get; set; } = new List<AuditType>();
        public virtual ICollection<PermitType> PermitTypes { get; set; } = new List<PermitType>();
    }
}
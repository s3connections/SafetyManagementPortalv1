using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SafetyManagementPortal.Backend.Models
{
    public class Department : BaseEntity
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Description { get; set; }

        // ✅ FIXED: Added Code property that controllers expect
        [MaxLength(50)]
        public string? Code { get; set; }
        
        [MaxLength(50)]
        public string? DepartmentCode { get; set; }

        public int? PlantId { get; set; }
        
        // ✅ ADDED: Parent department relationship
        public int? ParentDepartmentId { get; set; }
        
        [ForeignKey(nameof(PlantId))]
        public virtual Plant? Plant { get; set; }
        
        [ForeignKey(nameof(ParentDepartmentId))]
        public virtual Department? ParentDepartment { get; set; }

        // ✅ ADDED: Navigation property that services expect
        public virtual ICollection<Employee> Employees { get; set; } = new List<Employee>();
        
        // Navigation properties
        public virtual ICollection<Department> ChildDepartments { get; set; } = new List<Department>();
        public virtual ICollection<Observation> Observations { get; set; } = new List<Observation>();
        public virtual ICollection<Audit> Audits { get; set; } = new List<Audit>();
        public virtual ICollection<Permit> Permits { get; set; } = new List<Permit>();
    }
}

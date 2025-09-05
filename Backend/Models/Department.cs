using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    [Table("Departments")]
    public class Department : BaseEntity
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; }
        
        [Required]
        [StringLength(20)]
        public string Code { get; set; }
        
        [StringLength(500)]
        public string? Description { get; set; }
        
        public int? ParentDepartmentId { get; set; }
        
        [ForeignKey("ParentDepartmentId")]
        public virtual Department? ParentDepartment { get; set; }
        
        public int? HoDId { get; set; }
        
        [ForeignKey("HoDId")]
        public virtual Employee? HoD { get; set; }
        
        [Required]
        public bool IsActive { get; set; } = true;
        
        // Navigation Properties
        public virtual ICollection<Department> SubDepartments { get; set; } = new List<Department>();
        public virtual ICollection<Employee> Employees { get; set; } = new List<Employee>();
    }
}
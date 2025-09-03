using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    [Table("Employees")]
    public class Employee : BaseEntity
    {
        [Required]
        [StringLength(50)]
        public string EmployeeId { get; set; }
        
        [Required]
        [StringLength(100)]
        public string FirstName { get; set; }
        
        [Required]
        [StringLength(100)]
        public string LastName { get; set; }
        
        [NotMapped]
        public string FullName => $"{FirstName} {LastName}";
        
        [Required]
        [StringLength(255)]
        [EmailAddress]
        public string Email { get; set; }
        
        [StringLength(20)]
        public string? PhoneNumber { get; set; }
        
        [Required]
        public int DepartmentId { get; set; }

        
        [ForeignKey("DepartmentId")]
        public virtual Department? Department { get; set; }
        
        [Required]
        public int PlantId { get; set; }
        
        [ForeignKey("PlantId")]
        public virtual Plant Plant { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Designation { get; set; }
        
        public DateTime? DateOfJoining { get; set; }
        
        [Required]
        public bool IsActive { get; set; } = true;
        
        public int? ReportingManagerId { get; set; }
        
        [ForeignKey("ReportingManagerId")]
        public virtual Employee? ReportingManager { get; set; }
        
        public int? HoDId { get; set; }
        
        [ForeignKey("HoDId")]
        public virtual Employee? HeadOfDepartment { get; set; }
        
        public int? PlantHeadId { get; set; }
        
        [ForeignKey("PlantHeadId")]
        public virtual Employee? PlantHead { get; set; }
        
        // Navigation Properties
        public virtual ICollection<Employee> DirectReports { get; set; } = new List<Employee>();
        public virtual ICollection<Employee> HoDReports { get; set; } = new List<Employee>();
        public virtual ICollection<Employee> PlantHeadReports { get; set; } = new List<Employee>();
        public virtual ICollection<EmployeeRole> EmployeeRoles { get; set; } = new List<EmployeeRole>();
        public virtual ICollection<IncidentObservation> ReportedIncidents { get; set; } = new List<IncidentObservation>();
        public virtual ICollection<IncidentInvestigation> LeadInvestigations { get; set; } = new List<IncidentInvestigation>();
        public virtual ICollection<Permit> RequestedPermits { get; set; } = new List<Permit>();
        public virtual ICollection<Permit> ApprovedPermits { get; set; } = new List<Permit>();
    }
}
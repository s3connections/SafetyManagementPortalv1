using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class User : BaseEntity
    {
        [Required]
        [StringLength(100)]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string LastName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [StringLength(255)]
        public string Email { get; set; } = string.Empty;

        [StringLength(20)]
        public string? PhoneNumber { get; set; }

        [Required]
        [StringLength(50)]
        public string Role { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public string EmployeeId { get; set; } = string.Empty;

        public int DepartmentId { get; set; }
        public Department? Department { get; set; }

        public int PlantId { get; set; }
        public Plant? Plant { get; set; }

        public bool IsActive { get; set; } = true;

        [StringLength(500)]
        public string? ProfileImageUrl { get; set; }

        public DateTime? LastLoginDate { get; set; }

        // Navigation properties
        public virtual ICollection<Audit> AssignedAudits { get; set; } = new List<Audit>();
        public virtual ICollection<Permit> RequestedPermits { get; set; } = new List<Permit>();
        public virtual ICollection<Permit> ApprovedPermits { get; set; } = new List<Permit>();
        public virtual ICollection<IncidentObservation> ReportedObservations { get; set; } = new List<IncidentObservation>();
        public virtual ICollection<IncidentObservation> AssignedObservations { get; set; } = new List<IncidentObservation>();
    }
}
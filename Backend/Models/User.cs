using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class User : BaseEntity
    {
        [Required]
        [MaxLength(100)]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string LastName { get; set; } = string.Empty;

        [Required]
        [MaxLength(255)]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [MaxLength(20)]
        public string? PhoneNumber { get; set; }

        [MaxLength(100)]
        public string? EmployeeId { get; set; }

        public int? DepartmentId { get; set; }
        
        public int? PlantId { get; set; }

        // ✅ ADDED: Plant navigation property that controllers expect
        [ForeignKey(nameof(PlantId))]
        public virtual Plant? Plant { get; set; }
        
        [ForeignKey(nameof(DepartmentId))]
        public virtual Department? Department { get; set; }

        // Navigation properties
        public virtual ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
        public virtual ICollection<Observation> ReportedObservations { get; set; } = new List<Observation>();
        public virtual ICollection<Observation> AssignedObservations { get; set; } = new List<Observation>();
        public virtual ICollection<Audit> ConductedAudits { get; set; } = new List<Audit>();
        public virtual ICollection<Permit> RequestedPermits { get; set; } = new List<Permit>();
        public virtual ICollection<Permit> ApprovedPermits { get; set; } = new List<Permit>();
    }

    
}
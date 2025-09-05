using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class User : BaseEntity
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [MaxLength(255)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string Role { get; set; } = string.Empty;

        [MaxLength(20)]
        public string? PhoneNumber { get; set; }

        [MaxLength(100)]
        public string? Department { get; set; }

        public bool IsEmailVerified { get; set; } = false;
        
        public DateTime? LastLoginDate { get; set; }

        // Navigation properties
        public virtual ICollection<Observation> ReportedObservations { get; set; } = new List<Observation>();
        public virtual ICollection<Observation> AssignedObservations { get; set; } = new List<Observation>();
        public virtual ICollection<Audit> Audits { get; set; } = new List<Audit>();
        public virtual ICollection<Permit> RequestedPermits { get; set; } = new List<Permit>();
        public virtual ICollection<Permit> ApprovedPermits { get; set; } = new List<Permit>();
    }
}
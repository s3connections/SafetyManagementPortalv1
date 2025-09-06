using System.ComponentModel.DataAnnotations;

namespace SafetyManagementPortal.Backend.Models
{
    public abstract class BaseEntity
    {
        [Key]
        public int Id { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        public bool IsActive { get; set; } = true;
        
        // ✅ ADDED: Missing audit properties that services expect
        public bool IsDeleted { get; set; } = false;
        
        public int? CreatedBy { get; set; }
        
        public int? UpdatedBy { get; set; }
        
        public DateTime? DeletedAt { get; set; }
        
        public int? DeletedBy { get; set; }
    }
}

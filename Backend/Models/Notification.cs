using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    [Table("Notifications")]
    public class Notification : BaseEntity
    {
        [Required]
        [StringLength(200)]
        public string Title { get; set; }
        
        [Required]
        public string Message { get; set; }
        
        [Required]
        [StringLength(50)]
        public string Type { get; set; } // Email, SMS, Push, etc.
        
        [Required]
        public int RecipientId { get; set; }
        
        [ForeignKey("RecipientId")]
        public virtual Employee Recipient { get; set; }
        
        [Required]
        public bool IsRead { get; set; } = false;
        
        public DateTime? ReadDate { get; set; }
        
        [Required]
        [StringLength(50)]
        public string Status { get; set; } = "Pending";
        
        public int? EntityId { get; set; }
        public bool IsDeleted { get; set; }
        
        [StringLength(50)]
        public string? EntityType { get; set; }
    }
}
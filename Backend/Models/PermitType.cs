using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    [Table("PermitTypes")]
    public class PermitType : BaseEntity
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; }
        
        [Required]
        [StringLength(20)]
        public string Code { get; set; }
        
        [StringLength(500)]
        public string? Description { get; set; }
        
        [Required]
        public int CategoryId { get; set; }
        
        [ForeignKey("CategoryId")]
        public virtual Category Category { get; set; }
        
        [Required]
        public int ValidityHours { get; set; } = 8;
        
        [Required]
        public bool RequiresApproval { get; set; } = true;
        
        [Required]
        public bool IsActive { get; set; } = true;
        
        // Navigation Properties
        public virtual ICollection<Permit> Permits { get; set; } = new List<Permit>();
        public virtual ICollection<PermitQuestion> PermitQuestions { get; set; } = new List<PermitQuestion>();
    }
}
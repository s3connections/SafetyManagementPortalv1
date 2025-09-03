using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    [Table("PermitApprovalHistories")]
    public class PermitApprovalHistory : BaseEntity
    {
        [Required]
        public int PermitId { get; set; }
        
        [ForeignKey("PermitId")]
        public virtual Permit Permit { get; set; }
        
        [Required]
        public int ApprovedById { get; set; }
        
        [ForeignKey("ApprovedById")]
        public virtual Employee ApprovedBy { get; set; }
        
        [Required]
        [StringLength(50)]
        public string ApprovalType { get; set; }
        
        [Required]
        [StringLength(50)]
        public string Status { get; set; }
        
        public string? Comments { get; set; }
        
        [Required]
        public DateTime ApprovalDate { get; set; }
    }
}
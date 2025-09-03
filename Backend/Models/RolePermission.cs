using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    [Table("RolePermissions")]
    public class RolePermission : BaseEntity
    {
        [Required]
        public int RoleId { get; set; }
        
        [ForeignKey("RoleId")]
        public virtual Role Role { get; set; }
        
        [Required]
        public int PermissionId { get; set; }
        
        [ForeignKey("PermissionId")]
        public virtual Permission Permission { get; set; }
        
        [Required]
        public bool IsActive { get; set; } = true;
    }
}
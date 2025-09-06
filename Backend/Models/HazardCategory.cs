using System.ComponentModel.DataAnnotations;

namespace SafetyManagementPortal.Backend.Models
{
    public class HazardCategory
    {
        [Key]
        public int HazardCategoryId { get; set; }

        [Required, StringLength(100)]
        public string Name { get; set; } = string.Empty;
    }
}

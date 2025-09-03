using System.ComponentModel.DataAnnotations;

namespace SafetyManagement.Models
{
    public class HazardType
    {
        [Key]
        public int HazardTypeId { get; set; }

        [Required, StringLength(100)]
        public string Name { get; set; } = string.Empty;
    }
}

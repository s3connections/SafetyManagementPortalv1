using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    [Table("IncidentObservationAttachments")]
    public class IncidentObservationAttachment : BaseEntity
    {
        [Required]
        public int IncidentObservationId { get; set; }
        
        [ForeignKey("IncidentObservationId")]
        public virtual IncidentObservation IncidentObservation { get; set; }
        
        [Required]
        [StringLength(255)]
        public string FileName { get; set; }
        
        [Required]
        [StringLength(500)]
        public string FilePath { get; set; }
        
        [Required]
        public long FileSize { get; set; }
        
        [Required]
        [StringLength(100)]
        public string FileType { get; set; }
        
        [StringLength(500)]
        public string? Description { get; set; }
    }
}
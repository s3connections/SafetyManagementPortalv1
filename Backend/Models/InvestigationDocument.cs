using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    [Table("InvestigationDocuments")]
    public class InvestigationDocument : BaseEntity
    {
        [Required]
        public int InvestigationId { get; set; }
        
        [ForeignKey("InvestigationId")]
        public virtual IncidentInvestigation Investigation { get; set; }
        
        [Required]
        [StringLength(255)]
        public string FileName { get; set; }
        
        [Required]
        [StringLength(500)]
        public string FilePath { get; set; }
        
        [Required]
        [StringLength(50)]
        public string DocumentType { get; set; }
        
        [StringLength(500)]
        public string? Description { get; set; }
    }
}
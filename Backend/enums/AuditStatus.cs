using System.ComponentModel.DataAnnotations;

namespace SafetyManagementPortal.enums
{
    public enum AuditStatus
    {
        [Display(Name = "Planned")]
        Planned = 1,
        
        [Display(Name = "In Progress")]
        InProgress = 2,
        
        [Display(Name = "Completed")]
        Completed = 3,
        
        [Display(Name = "Report Submitted")]
        ReportSubmitted = 4,
        
        [Display(Name = "Closed")]
        Closed = 5
    }
}
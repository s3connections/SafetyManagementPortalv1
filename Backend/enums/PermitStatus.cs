using System.ComponentModel.DataAnnotations;

namespace SafetyManagementPortal.enums
{
    public enum PermitStatus
    {
        [Display(Name = "Draft")]
        Draft = 1,
        
        [Display(Name = "Pending Approval")]
        Pending_Approval = 2,
        
        [Display(Name = "Approved")]
        Approved = 3,
        
        [Display(Name = "Active")]
        Active = 4,
        
        [Display(Name = "Expired")]
        Expired = 5,
        
        [Display(Name = "Cancelled")]
        Cancelled = 6
    }
}
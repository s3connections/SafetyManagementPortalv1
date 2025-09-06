using System.ComponentModel.DataAnnotations;

namespace SafetyManagementPortal.enums
{
    public enum ObservationStatus
    {
        [Display(Name = "Open")]
        Open = 1,
        
        [Display(Name = "In Progress")]
        In_Progress = 2,
        
        [Display(Name = "Under Review")]
        Under_Review = 3,
        
        [Display(Name = "Closed")]
        Closed = 4
    }
}
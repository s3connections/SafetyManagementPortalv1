using System.ComponentModel.DataAnnotations;

namespace SafetyManagementPortal.enums
{
    public enum ObservationStage
    {
        [Display(Name = "Reported")]
        REPORTED = 1,
        
        [Display(Name = "Investigating")]
        INVESTIGATING = 2,
        
        [Display(Name = "Action Planning")]
        ACTION_PLANNING = 3,
        
        [Display(Name = "Implementation")]
        IMPLEMENTATION = 4,
        
        [Display(Name = "Verification")]
        VERIFICATION = 5,
        
        [Display(Name = "Completed")]
        COMPLETED = 6
    }
}
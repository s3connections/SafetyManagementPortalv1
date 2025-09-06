using System.ComponentModel.DataAnnotations;

namespace SafetyManagementPortal.enums
{
    public enum ObservationType
    {
        [Display(Name = "Unsafe Act")]
        UNSAFE_ACT = 1,
        
        [Display(Name = "Unsafe Condition")]
        UNSAFE_CONDITION = 2,
        
        [Display(Name = "Near Miss")]
        NEAR_MISS = 3,
        
        [Display(Name = "Good Practice")]
        GOOD_PRACTICE = 4
    }
}
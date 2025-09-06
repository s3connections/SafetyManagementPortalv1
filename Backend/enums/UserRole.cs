using System.ComponentModel.DataAnnotations;

namespace SafetyManagementPortal.enums
{
    public enum UserRole
    {
        [Display(Name = "Employee")]
        EMPLOYEE = 1,
        
        [Display(Name = "Safety Officer")]
        SAFETY_OFFICER = 2,
        
        [Display(Name = "Manager")]
        MANAGER = 3,
        
        [Display(Name = "Admin")]
        ADMIN = 4
    }
}
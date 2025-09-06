using SafetyManagementPortal.Backend.DTOs.User;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using System.Threading.Tasks;  // for async methods


namespace SafetyManagementPortal.Backend.Services.Interfaces
{
    public interface INotificationService
    {
        Task<NotificationDto> SendNotificationAsync(int recipientId, string title, string message, string type);
        Task<List<NotificationDto>> GetNotificationsByUserAsync(int userId);
        Task<NotificationDto> MarkAsReadAsync(int notificationId);
        Task<int> GetUnreadCountAsync(int userId);
    }
}

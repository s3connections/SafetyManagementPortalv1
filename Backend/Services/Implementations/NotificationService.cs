using SafetyManagementPortal.Backend.Data;
using SafetyManagementPortal.Backend.DTOs.User;
using SafetyManagementPortal.Backend.Models;
using SafetyManagementPortal.Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SafetyManagementPortal.Backend.Services.Implementations
{
    public class NotificationService : INotificationService
    {
        private readonly SafetyManagementContext _ctx;
        public NotificationService(SafetyManagementContext c){_ctx=c;}
        public async Task<NotificationDto> SendNotificationAsync(int rid,string title,string msg,string type){var n=new Notification{Title=title,Message=msg,Type=type,RecipientId=rid,CreatedAt=DateTime.UtcNow,CreatedBy=1};_ctx.Notifications.Add(n);await _ctx.SaveChangesAsync();return new NotificationDto{Id=n.Id,Title=title,Message=msg};}
        public async Task<List<NotificationDto>> GetNotificationsByUserAsync(int u)=>await _ctx.Notifications.Where(n=>n.RecipientId==u&&!n.IsDeleted).OrderByDescending(n=>n.CreatedAt).Select(n=>new NotificationDto{Id=n.Id,Title=n.Title,Message=n.Message,IsRead=n.IsRead}).ToListAsync();
        public async Task<NotificationDto> MarkAsReadAsync(int id){var n=await _ctx.Notifications.FirstOrDefaultAsync(x=>x.Id==id&&!x.IsDeleted);if(n==null)return null;n.IsRead=true;n.ReadDate=DateTime.UtcNow;n.UpdatedAt=DateTime.UtcNow;n.UpdatedBy=1;await _ctx.SaveChangesAsync();return new NotificationDto{Id=n.Id,IsRead=true};}
        public async Task<int> GetUnreadCountAsync(int u)=>await _ctx.Notifications.CountAsync(n=>n.RecipientId==u&&!n.IsRead&&!n.IsDeleted);
    }
}

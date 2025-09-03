using Backend.Services.Interfaces;
using Backend.Services.Implementations;
using Microsoft.Extensions.DependencyInjection;

namespace Backend.Extensions
{
    /// <summary>
    /// Registers every domain-service in one call.
    /// </summary>
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            // INCIDENT
            services.AddScoped<IIncidentObservationService, IncidentObservationService>();
            services.AddScoped<IIncidentInvestigationService, IncidentInvestigationService>();

            // AUDIT & PERMIT
            services.AddScoped<IAuditService, AuditService>();
            services.AddScoped<IPermitService, PermitService>();

            // MASTER DATA & EMPLOYEE
            services.AddScoped<IMasterDataService, MasterDataService>();
            services.AddScoped<IEmployeeService, EmployeeService>();

            // INFRASTRUCTURE
            services.AddScoped<INotificationService, NotificationService>();
            services.AddScoped<IWorkflowService,    WorkflowService>();

            return services;
        }
    }
}

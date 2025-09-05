using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Services.Interfaces;
using Backend.Services.Implementations;

namespace Backend.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
        {
            // Add Entity Framework
            services.AddDbContext<SafetyDbContext>(options =>
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

            // Add AutoMapper
            services.AddAutoMapper(typeof(Program));

            // Register services
            services.AddScoped<IObservationService, ObservationService>();
            services.AddScoped<IAuditService, AuditService>();
            services.AddScoped<IPermitService, PermitService>();

            return services;
        }

        public static IServiceCollection AddCorsPolicy(this IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddPolicy("AllowReactApp", policy =>
                {
                    policy.WithOrigins("http://localhost:3000", "https://localhost:3000")
                          .AllowAnyHeader()
                          .AllowAnyMethod()
                          .AllowCredentials();
                });
            });

            return services;
        }
    }
}
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Services;

var builder = WebApplication.CreateBuilder(args);


// Add services to the container
builder.Services.AddControllers();

// Add Entity Framework
builder.Services.AddDbContext<SafetyDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));


// Add business services
builder.Services.AddScoped<IObservationService, ObservationService>();
builder.Services.AddScoped<IAuditService, AuditService>();
builder.Services.AddScoped<IIncidentObservationService, IncidentObservationService>();

// Add CORS for React frontend  
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// Add Swagger for development
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo 
    { 
        Title = "Safety Management API", 
        Version = "v1",
        Description = "API for Safety Management System - Observations, Audits, Permits, and Investigations"
    });
});

var app = builder.Build();

// Create database and apply migrations on startup
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<SafetyDbContext>();
    context.Database.EnsureCreated(); // This will create the database and tables
}

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Safety Management API v1");
        c.RoutePrefix = string.Empty; // Makes Swagger UI available at the app's root
    });
}

app.UseHttpsRedirection();
app.UseCors("AllowReactApp");
app.UseStaticFiles(); // For serving uploaded images
app.UseRouting();
app.MapControllers();

Console.WriteLine("🚀 Safety Management API is starting...");
Console.WriteLine("📊 Swagger UI available at: https://localhost:7139");
Console.WriteLine("🔗 API Base URL: https://localhost:7139/api");

app.Run();
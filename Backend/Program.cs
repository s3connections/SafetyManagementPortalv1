using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Services.Interfaces;
using Backend.Services.Implementations;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add Entity Framework
builder.Services.AddDbContext<SafetyDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add AutoMapper
builder.Services.AddAutoMapper(typeof(Program));

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "https://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Register services
builder.Services.AddScoped<IObservationService, ObservationService>();
builder.Services.AddScoped<IIncidentObservationService, IncidentObservationService>();
builder.Services.AddScoped<IAuditService, AuditService>();
builder.Services.AddScoped<IPermitService, PermitService>();
builder.Services.AddScoped<IPermitTypeService, PermitTypeService>();

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowReactApp");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Ensure database is created and seeded
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<SafetyDbContext>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    
    try
    {
        // Create database if it doesn't exist
        await context.Database.EnsureCreatedAsync();
        logger.LogInformation("Database created successfully.");
        
        // Seed initial data if needed
        await SeedDataAsync(context, logger);
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "An error occurred while creating/seeding the database.");
    }
}

app.Run();

static async Task SeedDataAsync(SafetyDbContext context, ILogger logger)
{
    try
    {
        // Check if we need to seed data
        if (!await context.Users.AnyAsync())
        {
            // Add initial users
            var adminUser = new Backend.Models.User
            {
                Name = "System Administrator",
                Email = "admin@safetyportal.com",
                Role = "Admin",
                IsEmailVerified = true
            };

            var safetyManager = new Backend.Models.User
            {
                Name = "Safety Manager",
                Email = "safety@safetyportal.com",
                Role = "Safety_Manager",
                IsEmailVerified = true
            };

            context.Users.AddRange(adminUser, safetyManager);
            await context.SaveChangesAsync();
            
            logger.LogInformation("Initial users seeded successfully.");
        }

        // Add initial plants if needed
        if (!await context.Plants.AnyAsync())
        {
            var plant = new Backend.Models.Plant
            {
                Name = "Main Production Plant",
                Location = "Industrial Zone A",
                PlantCode = "MP001",
                IsOperational = true
            };

            context.Plants.Add(plant);
            await context.SaveChangesAsync();
            
            logger.LogInformation("Initial plants seeded successfully.");
        }
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "An error occurred while seeding data.");
    }
}
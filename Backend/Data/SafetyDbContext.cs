using Microsoft.EntityFrameworkCore;
using Backend.Models.Entities;

namespace Backend.Data
{
    public class SafetyDbContext : DbContext
    {
        public SafetyDbContext(DbContextOptions<SafetyDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Plant> Plants { get; set; }
        public DbSet<Department> Departments { get; set; }
        public DbSet<Observation> Observations { get; set; }
        public DbSet<Audit> Audits { get; set; }
        public DbSet<AuditQuestion> AuditQuestions { get; set; }
        public DbSet<Permit> Permits { get; set; }
        public DbSet<PermitTemplate> PermitTemplates { get; set; }
        public DbSet<PermitQuestion> PermitQuestions { get; set; }
        public DbSet<PermitAnswer> PermitAnswers { get; set; }
        public DbSet<Investigation> Investigations { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure User relationships
            modelBuilder.Entity<User>()
                .HasIndex(u => u.EmployeeId)
                .IsUnique();

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            // Configure Observation relationships
            modelBuilder.Entity<Observation>()
                .HasOne(o => o.Reporter)
                .WithMany(u => u.ReportedObservations)
                .HasForeignKey(o => o.ReportedBy)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Observation>()
                .HasOne(o => o.AssignedUser)
                .WithMany(u => u.AssignedObservations)
                .HasForeignKey(o => o.AssignedTo)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Observation>()
                .HasIndex(o => o.TicketNumber)
                .IsUnique();

            // Configure Audit relationships
            modelBuilder.Entity<Audit>()
                .HasOne(a => a.Auditor)
                .WithMany(u => u.ConductedAudits)
                .HasForeignKey(a => a.AuditorId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Audit>()
                .HasIndex(a => a.AuditNumber)
                .IsUnique();

            // Configure Permit relationships
            modelBuilder.Entity<Permit>()
                .HasOne(p => p.InitiatedBy)
                .WithMany(u => u.InitiatedPermits)
                .HasForeignKey(p => p.InitiatedById)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Permit>()
                .HasIndex(p => p.PermitNumber)
                .IsUnique();

            // Configure Investigation relationships
            modelBuilder.Entity<Investigation>()
                .HasOne(i => i.ReportedBy)
                .WithMany(u => u.ReportedInvestigations)
                .HasForeignKey(i => i.ReportedById)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Investigation>()
                .HasIndex(i => i.InvestigationNumber)
                .IsUnique();

            // Configure Plant relationships
            modelBuilder.Entity<Plant>()
                .HasIndex(p => p.Code)
                .IsUnique();

            // Configure Department relationships
            modelBuilder.Entity<Department>()
                .HasIndex(d => new { d.Code, d.PlantId })
                .IsUnique();

            // Configure enums as strings
            modelBuilder.Entity<User>()
                .Property(u => u.UserType)
                .HasConversion<string>();

            modelBuilder.Entity<Observation>()
                .Property(o => o.ObservationType)
                .HasConversion<string>();

            modelBuilder.Entity<Observation>()
                .Property(o => o.Priority)
                .HasConversion<string>();

            modelBuilder.Entity<Observation>()
                .Property(o => o.Stage)
                .HasConversion<string>();

            modelBuilder.Entity<Observation>()
                .Property(o => o.Status)
                .HasConversion<string>();

            modelBuilder.Entity<Audit>()
                .Property(a => a.Status)
                .HasConversion<string>();

            modelBuilder.Entity<Permit>()
                .Property(p => p.Status)
                .HasConversion<string>();

            modelBuilder.Entity<Investigation>()
                .Property(i => i.Stage)
                .HasConversion<string>();

            // Seed initial data
            SeedData(modelBuilder);
        }

        private void SeedData(ModelBuilder modelBuilder)
        {
            // Seed Plants
            modelBuilder.Entity<Plant>().HasData(
                new Plant { Id = 1, Name = "Manufacturing Plant A", Code = "MPA", Location = "Mumbai, Maharashtra", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new Plant { Id = 2, Name = "Chemical Processing Plant B", Code = "CPB", Location = "Pune, Maharashtra", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow }
            );

            // Seed Departments
            modelBuilder.Entity<Department>().HasData(
                new Department { Id = 1, Name = "Production", Code = "PROD", PlantId = 1, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new Department { Id = 2, Name = "Maintenance", Code = "MAINT", PlantId = 1, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new Department { Id = 3, Name = "Quality Control", Code = "QC", PlantId = 1, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new Department { Id = 4, Name = "Safety", Code = "SAFETY", PlantId = 1, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new Department { Id = 5, Name = "Chemical Processing", Code = "CHEM", PlantId = 2, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new Department { Id = 6, Name = "Environmental", Code = "ENV", PlantId = 2, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow }
            );

            // Seed Users
            modelBuilder.Entity<User>().HasData(
                new User 
                { 
                    Id = 1, 
                    EmployeeId = "ADMIN001", 
                    Email = "admin@safetymanagement.com", 
                    Password = "hashedpassword", // In real app, this should be properly hashed
                    FirstName = "System", 
                    LastName = "Administrator", 
                    UserType = UserRole.Admin, 
                    PlantId = 1, 
                    CreatedAt = DateTime.UtcNow, 
                    UpdatedAt = DateTime.UtcNow 
                },
                new User 
                { 
                    Id = 2, 
                    EmployeeId = "SO001", 
                    Email = "safety.officer@safetymanagement.com", 
                    Password = "hashedpassword", 
                    FirstName = "John", 
                    LastName = "Safety", 
                    UserType = UserRole.Safety_Officer, 
                    PlantId = 1, 
                    DepartmentId = 4, 
                    CreatedAt = DateTime.UtcNow, 
                    UpdatedAt = DateTime.UtcNow 
                },
                new User 
                { 
                    Id = 3, 
                    EmployeeId = "ENG001", 
                    Email = "engineer@safetymanagement.com", 
                    Password = "hashedpassword", 
                    FirstName = "Sarah", 
                    LastName = "Engineer", 
                    UserType = UserRole.Responsible_Engineer, 
                    PlantId = 1, 
                    DepartmentId = 1, 
                    CreatedAt = DateTime.UtcNow, 
                    UpdatedAt = DateTime.UtcNow 
                }
            );

            // Seed Permit Templates
            modelBuilder.Entity<PermitTemplate>().HasData(
                new PermitTemplate { Id = 1, Name = "Hot Work Permit", Description = "For welding, cutting, and other hot work activities", CreatedAt = DateTime.UtcNow },
                new PermitTemplate { Id = 2, Name = "Electrical Work Permit", Description = "For electrical maintenance and installation work", CreatedAt = DateTime.UtcNow },
                new PermitTemplate { Id = 3, Name = "Confined Space Entry Permit", Description = "For entry into confined spaces", CreatedAt = DateTime.UtcNow }
            );

            // Seed Permit Questions
            modelBuilder.Entity<PermitQuestion>().HasData(
                // Hot Work Permit Questions
                new PermitQuestion { Id = 1, PermitTemplateId = 1, QuestionText = "Is the work area clear of combustible materials?", QuestionType = "YesNo", IsRequired = true, Order = 1 },
                new PermitQuestion { Id = 2, PermitTemplateId = 1, QuestionText = "Are fire extinguishers readily available?", QuestionType = "YesNo", IsRequired = true, Order = 2 },
                new PermitQuestion { Id = 3, PermitTemplateId = 1, QuestionText = "Is gas testing completed?", QuestionType = "YesNo", IsRequired = true, Order = 3 },
                
                // Electrical Work Permit Questions
                new PermitQuestion { Id = 4, PermitTemplateId = 2, QuestionText = "Is the power source locked out?", QuestionType = "YesNo", IsRequired = true, Order = 1 },
                new PermitQuestion { Id = 5, PermitTemplateId = 2, QuestionText = "Are proper PPE requirements verified?", QuestionType = "YesNo", IsRequired = true, Order = 2 },
                
                // Confined Space Entry Permit Questions
                new PermitQuestion { Id = 6, PermitTemplateId = 3, QuestionText = "Is atmospheric testing completed?", QuestionType = "YesNo", IsRequired = true, Order = 1 },
                new PermitQuestion { Id = 7, PermitTemplateId = 3, QuestionText = "Is ventilation adequate?", QuestionType = "YesNo", IsRequired = true, Order = 2 },
                new PermitQuestion { Id = 8, PermitTemplateId = 3, QuestionText = "Is rescue equipment available?", QuestionType = "YesNo", IsRequired = true, Order = 3 }
            );
        }
    }
}
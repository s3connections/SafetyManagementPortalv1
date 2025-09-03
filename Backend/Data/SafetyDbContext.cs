using Microsoft.EntityFrameworkCore;
using Backend.Models;

namespace Backend.Data
{
    public class SafetyDbContext : DbContext
    {
        public SafetyDbContext(DbContextOptions<SafetyDbContext> options) : base(options)
        {
        }

        // User Management
        public DbSet<User> Users { get; set; }
        public DbSet<Plant> Plants { get; set; }
        public DbSet<Department> Departments { get; set; }

        // Audit Management
        public DbSet<Audit> Audits { get; set; }
        public DbSet<AuditQuestion> AuditQuestions { get; set; }
        public DbSet<AuditQuestionResponse> AuditQuestionResponses { get; set; }
        public DbSet<AuditType> AuditTypes { get; set; }

        // Permit Management
        public DbSet<Permit> Permits { get; set; }
        public DbSet<PermitTemplate> PermitTemplates { get; set; }
        public DbSet<PermitQuestion> PermitQuestions { get; set; }
        public DbSet<PermitAnswer> PermitAnswers { get; set; }
        public DbSet<PermitQuestionResponse> PermitQuestionResponses { get; set; }
        public DbSet<PermitApprovalHistory> PermitApprovalHistory { get; set; }
        public DbSet<PermitType> PermitTypes { get; set; }

        // Incident/Observation Management
        public DbSet<IncidentObservation> IncidentObservations { get; set; }
        public DbSet<IncidentObservationAttachment> IncidentObservationAttachments { get; set; }
        public DbSet<IncidentInvestigation> IncidentInvestigations { get; set; }
        public DbSet<InvestigationDocument> InvestigationDocuments { get; set; }
        public DbSet<InvestigationPanel> InvestigationPanels { get; set; }
        public DbSet<InvestigationTimeline> InvestigationTimelines { get; set; }
        public DbSet<InvestigationWitness> InvestigationWitnesses { get; set; }

        // Master Data
        public DbSet<Category> Categories { get; set; }
        public DbSet<HazardCategory> HazardCategories { get; set; }
        public DbSet<HazardType> HazardTypes { get; set; }
        public DbSet<IncidentStatus> IncidentStatuses { get; set; }
        public DbSet<IncidentType> IncidentTypes { get; set; }
        public DbSet<Location> Locations { get; set; }
        public DbSet<Priority> Priorities { get; set; }

        // Workflow & Notifications
        public DbSet<WorkflowDefinition> WorkflowDefinitions { get; set; }
        public DbSet<WorkflowInstance> WorkflowInstances { get; set; }
        public DbSet<WorkflowStep> WorkflowSteps { get; set; }
        public DbSet<Notification> Notifications { get; set; }

        // Roles & Permissions
        public DbSet<Role> Roles { get; set; }
        public DbSet<Permission> Permissions { get; set; }
        public DbSet<RolePermission> RolePermissions { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }
        public DbSet<EmployeeRole> EmployeeRoles { get; set; }
        public DbSet<Employee> Employees { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure relationships and constraints
            ConfigureUserRelationships(modelBuilder);
            ConfigureAuditRelationships(modelBuilder);
            ConfigurePermitRelationships(modelBuilder);
            ConfigureObservationRelationships(modelBuilder);
            ConfigureInvestigationRelationships(modelBuilder);

            // Configure indexes
            ConfigureIndexes(modelBuilder);

            // Seed data
            SeedMasterData(modelBuilder);
        }

        private void ConfigureUserRelationships(ModelBuilder modelBuilder)
        {
            // User -> Department relationship
            modelBuilder.Entity<User>()
                .HasOne(u => u.Department)
                .WithMany(d => d.Users)
                .HasForeignKey(u => u.DepartmentId)
                .OnDelete(DeleteBehavior.Restrict);

            // User -> Plant relationship
            modelBuilder.Entity<User>()
                .HasOne(u => u.Plant)
                .WithMany(p => p.Users)
                .HasForeignKey(u => u.PlantId)
                .OnDelete(DeleteBehavior.Restrict);

            // Department -> Plant relationship
            modelBuilder.Entity<Department>()
                .HasOne(d => d.Plant)
                .WithMany(p => p.Departments)
                .HasForeignKey(d => d.PlantId)
                .OnDelete(DeleteBehavior.Restrict);
        }

        private void ConfigureAuditRelationships(ModelBuilder modelBuilder)
        {
            // Audit -> Plant relationship
            modelBuilder.Entity<Audit>()
                .HasOne(a => a.Plant)
                .WithMany(p => p.Audits)
                .HasForeignKey(a => a.PlantId)
                .OnDelete(DeleteBehavior.Restrict);

            // Audit -> Department relationship
            modelBuilder.Entity<Audit>()
                .HasOne(a => a.Department)
                .WithMany(d => d.Audits)
                .HasForeignKey(a => a.DepartmentId)
                .OnDelete(DeleteBehavior.Restrict);

            // Audit -> Auditor relationship
            modelBuilder.Entity<Audit>()
                .HasOne(a => a.Auditor)
                .WithMany(u => u.AssignedAudits)
                .HasForeignKey(a => a.AuditorId)
                .OnDelete(DeleteBehavior.Restrict);

            // AuditQuestionResponse relationships
            modelBuilder.Entity<AuditQuestionResponse>()
                .HasOne(aqr => aqr.Audit)
                .WithMany(a => a.Responses)
                .HasForeignKey(aqr => aqr.AuditId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<AuditQuestionResponse>()
                .HasOne(aqr => aqr.AuditQuestion)
                .WithMany(aq => aq.Responses)
                .HasForeignKey(aqr => aqr.AuditQuestionId)
                .OnDelete(DeleteBehavior.Cascade);
        }

        private void ConfigurePermitRelationships(ModelBuilder modelBuilder)
        {
            // Permit -> Requestor relationship
            modelBuilder.Entity<Permit>()
                .HasOne(p => p.Requestor)
                .WithMany(u => u.RequestedPermits)
                .HasForeignKey(p => p.RequestorId)
                .OnDelete(DeleteBehavior.Restrict);

            // Permit -> Approver relationship
            modelBuilder.Entity<Permit>()
                .HasOne(p => p.Approver)
                .WithMany(u => u.ApprovedPermits)
                .HasForeignKey(p => p.ApproverId)
                .OnDelete(DeleteBehavior.Restrict);

            // Permit -> Plant relationship
            modelBuilder.Entity<Permit>()
                .HasOne(p => p.Plant)
                .WithMany(pl => pl.Permits)
                .HasForeignKey(p => p.PlantId)
                .OnDelete(DeleteBehavior.Restrict);

            // Permit -> Department relationship
            modelBuilder.Entity<Permit>()
                .HasOne(p => p.Department)
                .WithMany(d => d.Permits)
                .HasForeignKey(p => p.DepartmentId)
                .OnDelete(DeleteBehavior.Restrict);

            // PermitQuestion -> PermitTemplate relationship
            modelBuilder.Entity<PermitQuestion>()
                .HasOne(pq => pq.PermitTemplate)
                .WithMany(pt => pt.Questions)
                .HasForeignKey(pq => pq.PermitTemplateId)
                .OnDelete(DeleteBehavior.Cascade);

            // PermitAnswer -> Permit relationship
            modelBuilder.Entity<PermitAnswer>()
                .HasOne(pa => pa.Permit)
                .WithMany()
                .HasForeignKey(pa => pa.PermitId)
                .OnDelete(DeleteBehavior.Cascade);

            // PermitAnswer -> PermitQuestion relationship
            modelBuilder.Entity<PermitAnswer>()
                .HasOne(pa => pa.PermitQuestion)
                .WithMany()
                .HasForeignKey(pa => pa.PermitQuestionId)
                .OnDelete(DeleteBehavior.Cascade);
        }

        private void ConfigureObservationRelationships(ModelBuilder modelBuilder)
        {
            // IncidentObservation -> Reporter relationship
            modelBuilder.Entity<IncidentObservation>()
                .HasOne(io => io.Reporter)
                .WithMany(u => u.ReportedObservations)
                .HasForeignKey(io => io.ReporterId)
                .OnDelete(DeleteBehavior.Restrict);

            // IncidentObservation -> Assignee relationship
            modelBuilder.Entity<IncidentObservation>()
                .HasOne(io => io.AssignedTo)
                .WithMany(u => u.AssignedObservations)
                .HasForeignKey(io => io.AssignedToId)
                .OnDelete(DeleteBehavior.Restrict);

            // IncidentObservation -> Plant relationship
            modelBuilder.Entity<IncidentObservation>()
                .HasOne(io => io.Plant)
                .WithMany(p => p.Observations)
                .HasForeignKey(io => io.PlantId)
                .OnDelete(DeleteBehavior.Restrict);

            // IncidentObservation -> Department relationship
            modelBuilder.Entity<IncidentObservation>()
                .HasOne(io => io.Department)
                .WithMany(d => d.Observations)
                .HasForeignKey(io => io.DepartmentId)
                .OnDelete(DeleteBehavior.Restrict);
        }

        private void ConfigureInvestigationRelationships(ModelBuilder modelBuilder)
        {
            // Configure investigation relationships as needed
            // This is a placeholder for future investigation feature relationships
        }

        private void ConfigureIndexes(ModelBuilder modelBuilder)
        {
            // User indexes
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<User>()
                .HasIndex(u => u.EmployeeId)
                .IsUnique();

            // Plant indexes
            modelBuilder.Entity<Plant>()
                .HasIndex(p => p.Code)
                .IsUnique();

            // Department indexes
            modelBuilder.Entity<Department>()
                .HasIndex(d => new { d.Code, d.PlantId })
                .IsUnique();

            // Permit indexes
            modelBuilder.Entity<Permit>()
                .HasIndex(p => p.PermitNumber)
                .IsUnique();
        }

        private void SeedMasterData(ModelBuilder modelBuilder)
        {
            // Seed Priority data
            modelBuilder.Entity<Priority>().HasData(
                new Priority { Id = 1, Name = "Low ", Description = "Low priority", Color = "#28a745", SortOrder = 1, CreatedAt = DateTime.UtcNow },
                new Priority { Id = 2, Name = "Medium", Description = "Medium priority", Color = "#ffc107", SortOrder = 2, CreatedAt = DateTime.UtcNow },
                new Priority { Id = 3, Name = "High", Description = "High priority", Color = "#fd7e14", SortOrder = 3, CreatedAt = DateTime.UtcNow },
                new Priority { Id = 4, Name = "Critical", Description = "Critical priority", Color = "#dc3545", SortOrder = 4, CreatedAt = DateTime.UtcNow }
            );

            // Seed AuditType data
            modelBuilder.Entity<AuditType>().HasData(
                new AuditType { Id = 1, Name = "Safety Audit", Description = "Comprehensive safety audit", IsActive = true, CreatedAt = DateTime.UtcNow },
                new AuditType { Id = 2, Name = "Environmental Audit", Description = "Environmental compliance audit", IsActive = true, CreatedAt = DateTime.UtcNow },
                new AuditType { Id = 3, Name = "Process Audit", Description = "Process compliance audit", IsActive = true, CreatedAt = DateTime.UtcNow },
                new AuditType { Id = 4, Name = "Quality Audit", Description = "Quality assurance audit", IsActive = true, CreatedAt = DateTime.UtcNow }
            );

            // Seed PermitType data
            modelBuilder.Entity<PermitType>().HasData(
                new PermitType { Id = 1, Name = "Hot Work Permit", Description = "For welding, cutting, and other hot work activities", IsActive = true, CreatedAt = DateTime.UtcNow },
                new PermitType { Id = 2, Name = "Confined Space Permit", Description = "For work in confined spaces", IsActive = true, CreatedAt = DateTime.UtcNow },
                new PermitType { Id = 3, Name = "Work at Height Permit", Description = "For work at elevated locations", IsActive = true, CreatedAt = DateTime.UtcNow },
                new PermitType { Id = 4, Name = "Electrical Work Permit", Description = "For electrical maintenance and installation", IsActive = true, CreatedAt = DateTime.UtcNow }
            );
        }
    }
}
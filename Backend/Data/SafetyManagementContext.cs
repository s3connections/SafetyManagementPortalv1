using Microsoft.EntityFrameworkCore;
using Backend.Models;
using System.Linq;

namespace SafetyManagementPortal.Backend.Data
{
    public class SafetyManagementContext : DbContext
    {
        public SafetyManagementContext(DbContextOptions<SafetyManagementContext> options) : base(options)
        {
        }

        // DbSets for all entities remain unchanged
        public DbSet<Employee> Employees { get; set; }
        public DbSet<Department> Departments { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Permission> Permissions { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Plant> Plants { get; set; }
        public DbSet<Location> Locations { get; set; }
        public DbSet<Priority> Priorities { get; set; }

        public DbSet<IncidentObservation> IncidentObservations { get; set; }
        public DbSet<IncidentType> IncidentTypes { get; set; }
        public DbSet<IncidentStatus> IncidentStatuses { get; set; }
        public DbSet<IncidentInvestigation> IncidentInvestigations { get; set; }
        public DbSet<InvestigationWitness> InvestigationWitnesses { get; set; }
        public DbSet<IncidentObservationAttachment> IncidentObservationAttachments { get; set; }
        public DbSet<InvestigationDocument> InvestigationDocuments { get; set; }
        public DbSet<InvestigationTimeline> InvestigationTimelines { get; set; }
        public DbSet<InvestigationPanel> InvestigationPanels { get; set; }

        public DbSet<Audit> Audits { get; set; }
        public DbSet<AuditType> AuditTypes { get; set; }
        public DbSet<AuditQuestion> AuditQuestions { get; set; }
        public DbSet<AuditQuestionResponse> AuditQuestionResponses { get; set; }

        public DbSet<Permit> Permits { get; set; }
        public DbSet<PermitType> PermitTypes { get; set; }
        public DbSet<PermitQuestion> PermitQuestions { get; set; }
        public DbSet<PermitQuestionResponse> PermitQuestionResponses { get; set; }
        public DbSet<PermitApprovalHistory> PermitApprovalHistories { get; set; }

        public DbSet<User> Users { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }
        public DbSet<EmployeeRole> EmployeeRoles { get; set; }
        public DbSet<RolePermission> RolePermissions { get; set; }

        public DbSet<WorkflowDefinition> WorkflowDefinitions { get; set; }
        public DbSet<WorkflowStep> WorkflowSteps { get; set; }
        public DbSet<WorkflowInstance> WorkflowInstances { get; set; }

        public DbSet<Notification> Notifications { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Disable cascade delete on all foreign keys globally to avoid SQL Server multiple cascade paths issue
            foreach (var foreignKey in modelBuilder.Model.GetEntityTypes().SelectMany(e => e.GetForeignKeys()))
            {
                foreignKey.DeleteBehavior = DeleteBehavior.Restrict;
            }

            // Configure other relationships as per your original setup
            ConfigureRelationships(modelBuilder);
        }

        private void ConfigureRelationships(ModelBuilder modelBuilder)
        {
            // Employee relationships
            modelBuilder.Entity<Employee>()
                .HasOne(e => e.ReportingManager)
                .WithMany(e => e.DirectReports)
                .HasForeignKey(e => e.ReportingManagerId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Employee>()
                .HasOne(e => e.HeadOfDepartment)
                .WithMany(e => e.HoDReports)
                .HasForeignKey(e => e.HoDId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Employee>()
                .HasOne(e => e.PlantHead)
                .WithMany(e => e.PlantHeadReports)
                .HasForeignKey(e => e.PlantHeadId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Permit>()
                .HasOne(p => p.RequestedBy)
                .WithMany(e => e.RequestedPermits)
                .HasForeignKey(p => p.RequestedById)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Permit>()
                .HasOne(p => p.ApprovedBy)
                .WithMany(e => e.ApprovedPermits)
                .HasForeignKey(p => p.ApprovedById)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Employee>()
                .HasOne(e => e.Plant)
                .WithMany(p => p.Employees)
                .HasForeignKey(e => e.PlantId)
                .OnDelete(DeleteBehavior.Restrict);

            // Category relationships
            modelBuilder.Entity<Category>()
                .HasOne(c => c.ParentCategory)
                .WithMany(c => c.SubCategories)
                .HasForeignKey(c => c.ParentCategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Department>()
                .HasMany(d => d.Employees)
                .WithOne(e => e.Department)
                .HasForeignKey(e => e.DepartmentId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Department>()
                .HasOne(d => d.ParentDepartment)
                .WithMany(d => d.SubDepartments)
                .HasForeignKey(d => d.ParentDepartmentId)
                .OnDelete(DeleteBehavior.Restrict);

            // Workflow relationships
            modelBuilder.Entity<WorkflowStep>()
                .HasOne(ws => ws.WorkflowDefinition)
                .WithMany(wd => wd.WorkflowSteps)
                .HasForeignKey(ws => ws.WorkflowDefinitionId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<WorkflowInstance>()
                .HasOne(wi => wi.WorkflowDefinition)
                .WithMany(wd => wd.WorkflowInstances)
                .HasForeignKey(wi => wi.WorkflowDefinitionId)
                .OnDelete(DeleteBehavior.Restrict);

            // EmployeeRole relationships
            modelBuilder.Entity<EmployeeRole>()
                .HasOne(er => er.Employee)
                .WithMany(e => e.EmployeeRoles)
                .HasForeignKey(er => er.EmployeeId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<EmployeeRole>()
                .HasOne(er => er.Role)
                .WithMany(r => r.EmployeeRoles)
                .HasForeignKey(er => er.RoleId)
                .OnDelete(DeleteBehavior.Restrict);

            // RolePermission relationships
            modelBuilder.Entity<RolePermission>()
                .HasOne(rp => rp.Role)
                .WithMany(r => r.RolePermissions)
                .HasForeignKey(rp => rp.RoleId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<RolePermission>()
                .HasOne(rp => rp.Permission)
                .WithMany(p => p.RolePermissions)
                .HasForeignKey(rp => rp.PermissionId)
                .OnDelete(DeleteBehavior.Restrict);

            // Note: No explicit FK configuration for IncidentObservation to avoid duplicated shadow properties
        }
    }
}

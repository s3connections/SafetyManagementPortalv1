namespace SafetyManagementPortal.Backend.DTOs.Audit
{
    public class AuditQuestionDto
    {
        public int Id { get; set; }
        public string Question { get; set; } = string.Empty;
        public string? Category { get; set; }
        public int Order { get; set; }
        public bool IsRequired { get; set; }
        public string? Answer { get; set; }
        public bool? IsCompliant { get; set; }
        public string? Comments { get; set; }
        public int? Score { get; set; }
    }
}

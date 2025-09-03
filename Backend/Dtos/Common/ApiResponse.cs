using System.Text.Json.Serialization;

namespace Backend.DTOs.Common
{
    public class ApiResponse<T>
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public T? Data { get; set; }
        public List<string> Errors { get; set; } = new();
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        [JsonConstructor]
        public ApiResponse()
        {
        }

        public ApiResponse(bool success, string message, T? data = default, List<string>? errors = null)
        {
            Success = success;
            Message = message;
            Data = data;
            Errors = errors ?? new List<string>();
        }

        
        public static ApiResponse<T> Failure(string message, List<string>? errors = null)
        {
            return new ApiResponse<T>(false, message, default(T), errors);
        }

        public static ApiResponse<T> Failure(List<string> errors)
        {
            return new ApiResponse<T>(false, "Operation failed", default(T), errors);
        }
    }

    public class ApiResponse : ApiResponse<object>
    {
        public ApiResponse() : base() { }

        public ApiResponse(bool success, string message) : base(success, message) { }

        public static ApiResponse Success(string message = "Operation successful")
        {
            return new ApiResponse(true, message);
        }

        public new static ApiResponse Failure(string message, List<string>? errors = null)
        {
            var response = new ApiResponse(false, message);
            if (errors != null)
                response.Errors = errors;
            return response;
        }
    }
}
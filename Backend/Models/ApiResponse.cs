using System.Text.Json.Serialization;

namespace Backend.Models
{
    public class ApiResponse<T>
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public T? Data { get; set; }
        public List<string> Errors { get; set; } = new List<string>();
        
        [JsonIgnore]
        public Exception? Exception { get; set; }

        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        public ApiResponse()
        {
            Success = true;
        }

        public ApiResponse(T data, string message = "Success")
        {
            Success = true;
            Data = data;
            Message = message;
        }

        public ApiResponse(string message)
        {
            Success = false;
            Message = message;
        }

        public ApiResponse(List<string> errors, string message = "Validation failed")
        {
            Success = false;
            Message = message;
            Errors = errors;
        }

        public static ApiResponse<T> SuccessResult(T data, string message = "Success")
        {
            return new ApiResponse<T>(data, message);
        }

        public static ApiResponse<T> FailureResult(string message)
        {
            return new ApiResponse<T>(message);
        }

        public static ApiResponse<T> FailureResult(List<string> errors, string message = "Validation failed")
        {
            return new ApiResponse<T>(errors, message);
        }

        public static ApiResponse<T> FailureResult(Exception exception, string message = "An error occurred")
        {
            return new ApiResponse<T>
            {
                Success = false,
                Message = message,
                Exception = exception,
                Errors = new List<string> { exception.Message }
            };
        }
    }

    // Non-generic version for when no data is returned
    public class ApiResponse : ApiResponse<object>
    {
        public ApiResponse() : base() { }
        public ApiResponse(string message) : base(message) { }
        public ApiResponse(List<string> errors, string message = "Validation failed") : base(errors, message) { }

        public static ApiResponse SuccessResult(string message = "Success")
        {
            return new ApiResponse { Success = true, Message = message };
        }

        public static new ApiResponse FailureResult(string message)
        {
            return new ApiResponse(message);
        }

        public static new ApiResponse FailureResult(List<string> errors, string message = "Validation failed")
        {
            return new ApiResponse(errors, message);
        }
    }
}
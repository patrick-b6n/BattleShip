using System;

namespace BattleShip
{
    public enum ErrorType
    {
        None,
        Unknown,
        NotFound,
        InternalError,
        ValidationError,
        Unauthorized
    }

    public struct Result
    {
        public static readonly Result Success = new Result(ErrorType.None, string.Empty);
        public static readonly Result NotFound = new Result(ErrorType.NotFound, "Not Found");
        public static readonly Result Unauthorized = new Result(ErrorType.Unauthorized, "Unauthorized");

        public Result(Exception exception)
        {
            ErrorType = ErrorType.InternalError;
            Message = exception.Message;
            Exception = exception;
        }

        public Result(Result result)
        {
            ErrorType = result.ErrorType;
            Message = result.Message;
            Exception = result.Exception;
        }

        public Result(ErrorType errorType, string message, params object[] messageArgs)
        {
            ErrorType = errorType;
            Message = message;
            Exception = null;
        }

        public Result(ErrorType errorType, Exception exception, string message, params object[] messageArgs)
        {
            ErrorType = errorType;
            Message = message;
            Exception = exception;
        }

        public ErrorType ErrorType { get; }

        public Exception Exception { get; }

        public bool IsError => ErrorType != ErrorType.None;

        public bool IsSuccess => ErrorType == ErrorType.None;

        public string Message { get; }
    }
}
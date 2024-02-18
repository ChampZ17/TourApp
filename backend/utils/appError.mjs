class AppError extends Error {
  constructor(message, statusCode) {
    super();
    this.message = message;

    this.statusCode = statusCode;

    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

    this.isOperational = true;

    Error.captureStackTrace(this, this.contructor);
  }
}

export default AppError;

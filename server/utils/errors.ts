export class AppError extends Error {
  status: string;
  statusCode: number;
  isOperational: boolean;
  message: string;

  constructor(message: string, statusCode: number) {
    super();
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.statusCode = statusCode;
    this.isOperational = true;
    this.message = message;

    Error.captureStackTrace(this, this.constructor);
  }
}

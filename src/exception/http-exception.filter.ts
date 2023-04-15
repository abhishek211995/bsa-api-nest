import { ExceptionFilter, Catch, ArgumentsHost, Logger } from "@nestjs/common";
import { Response } from "express";
import { ServiceException } from "src/exception/base-exception";

@Catch(ServiceException)
export class HttpExceptionFilter implements ExceptionFilter {
  private logger: Logger;
  constructor() {
    this.logger = new Logger();
  }
  catch(exception: ServiceException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.httpStatusCode;

    response.status(status).json({
      statusCode: status,
      error: exception.getErrorMessage(),
      message: exception.message,
    });
  }
}

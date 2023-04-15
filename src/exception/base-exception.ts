import { HttpStatus } from "@nestjs/common";

export class BaseException extends Error {
  httpStatusCode: HttpStatus;
  code: string;
  message: string;
  constructor(httpStatusCode: HttpStatus, code: string, message: string) {
    super(message);
    this.httpStatusCode = httpStatusCode;
    this.code = code;
    this.message = message;
  }
  toString() {
    return `${this.code}: ${this.message}`;
  }
}

export interface ServiceExceptionParams {
  httpStatusCode?: HttpStatus;
  serviceErrorCode: string;
  message: string;
}

export class ServiceException extends BaseException {
  underLyingException: ServiceException;
  constructor(
    params: ServiceExceptionParams,
    underLyingException?: ServiceException,
  ) {
    const {
      httpStatusCode = HttpStatus.INTERNAL_SERVER_ERROR,
      serviceErrorCode,
      message,
    } = params;
    super(httpStatusCode, serviceErrorCode, message);
    this.underLyingException = underLyingException;
  }
  toString() {
    const underlyingException = this.underLyingException;
    if (!underlyingException) {
      return super.toString();
    }
    return `${super.toString()} caused by ${underlyingException.toString()}`;
  }
  getErrorMessage() {
    return super.toString();
  }
}

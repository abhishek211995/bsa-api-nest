import { HttpStatus } from "@nestjs/common";

export interface httpResponse<T> {
  data: T;
  statusCode: HttpStatus;
  message: string;
}

export function makeHTTPResponse<T>(
  tmpData: T,
  httpCode: HttpStatus = 200,
  message = "success",
): {
  data: T;
  statusCode: HttpStatus;
  message: string;
} {
  return {
    data: tmpData,
    statusCode: httpCode,
    message: message,
  };
}

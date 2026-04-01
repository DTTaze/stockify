export interface ErrorResponse {
  success: false;
  message: string;
  code: string;
  httpCode: number;
}

export interface SuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiError {
  message: string;
  status: number;
}

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

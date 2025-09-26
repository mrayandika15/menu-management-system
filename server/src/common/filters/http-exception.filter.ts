import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { Request, Response } from 'express'

interface ErrorResponse {
  data: null
  message: string
  error: string | object
  statusCode: number
  timestamp: string
  path: string
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name)

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    let status: number
    let message: string
    let error: string | object

    if (exception instanceof HttpException) {
      status = exception.getStatus()
      const exceptionResponse = exception.getResponse()
      
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse
        error = exceptionResponse
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as any
        message = responseObj.message || exception.message
        error = responseObj.message || responseObj.error || exception.message
        
        // Handle validation errors
        if (Array.isArray(responseObj.message)) {
          message = 'Validation failed'
          error = responseObj.message
        }
      } else {
        message = exception.message
        error = exception.message
      }
    } else {
      // Handle unexpected errors
      status = HttpStatus.INTERNAL_SERVER_ERROR
      message = 'Internal server error'
      error = 'Something went wrong'
      
      // Log unexpected errors
      this.logger.error(
        `Unexpected error: ${exception}`,
        exception instanceof Error ? exception.stack : undefined,
      )
    }

    const errorResponse: ErrorResponse = {
      data: null,
      message,
      error,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    }

    // Log HTTP exceptions (except 404s to reduce noise)
    if (status !== HttpStatus.NOT_FOUND) {
      this.logger.warn(
        `HTTP ${status} Error: ${message} - ${request.method} ${request.url}`,
      )
    }

    response.status(status).json(errorResponse)
  }
}
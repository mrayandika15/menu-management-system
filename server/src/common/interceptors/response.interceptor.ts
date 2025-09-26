import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

export interface ApiResponse<T> {
  data: T
  message: string
  error: null
  statusCode: number
  timestamp: string
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    const response = context.switchToHttp().getResponse()
    
    return next.handle().pipe(
      map((data) => {
        // If the response is already in the correct format, return as is
        if (data && typeof data === 'object' && 'data' in data && 'message' in data) {
          return {
            ...data,
            statusCode: response.statusCode,
            timestamp: new Date().toISOString(),
          }
        }

        // Otherwise, wrap the response in the standard format
        return {
          data,
          message: 'Success',
          error: null,
          statusCode: response.statusCode,
          timestamp: new Date().toISOString(),
        }
      }),
    )
  }
}
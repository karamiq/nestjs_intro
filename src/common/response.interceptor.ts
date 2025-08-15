import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, catchError, map, throwError } from 'rxjs';
import { HttpException } from '@nestjs/common';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => ({
        data,
        errorMessage: null,
        errorCode: 200,
      })),
      catchError((err) => {
        let errorMessage = 'Internal server error';
        let errorCode = 500;
        if (err instanceof HttpException) {
          errorMessage = err.message;
          errorCode = err.getStatus();
        } else if (err?.message) {
          errorMessage = err.message;
        }

        // Create a proper HttpException to maintain status codes
        const httpException = new HttpException(
          {
            data: {},
            errorMessage,
            errorCode,
          },
          errorCode
        );

        return throwError(() => httpException);
      })
    );
  }
}

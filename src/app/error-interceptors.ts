import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { tap, catchError, throwError } from "rxjs";
import { NotificationService } from "./notification/service.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private notificationService: NotificationService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse && event.body?.message) {
          this.notificationService.showNotification('success', event.body.message);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        let errorMsg = "An unknown error occurred!";
        if (error.error?.message) {
          errorMsg = error.error.message;
        }
        this.notificationService.showNotification('error', errorMsg);
        return throwError(() => error);
      })
    );
  }
}

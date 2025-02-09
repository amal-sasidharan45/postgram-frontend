import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notificationSubject = new Subject<{ type: string; message: string }>();
  notification$ = this.notificationSubject.asObservable();

  showNotification(type: 'success' | 'error', message: string) {
    this.notificationSubject.next({ type, message });
  }
}

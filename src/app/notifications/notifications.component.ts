import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../notification/service.service';

@Component({
  selector: 'app-notifications',
standalone:false,
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent  implements OnInit{
  message: string = '';
  messageType: string = '';
  show: boolean = false;

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.notificationService.notification$.subscribe(data => {
      this.messageType = data.type;
      this.message = data.message;
      this.show = true;

      // Auto-hide the notification after 3 seconds
      setTimeout(() => {
        this.show = false;
      }, 1000);
    });
  }

  hideNotification() {
    this.show = false;
  }
}


import { CommonModule } from '@angular/common';
import { Component, HostListener, inject, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AlertComponent } from './components/alert/alert.component';
import { HeaderComponent } from './components/header/header.component';
import { InactivityService } from './services/Inactivity-service/inactivity-service';
import { NotificationService } from './services/notification-service/notification.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, AlertComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'lockin';
  inactivityService = inject(InactivityService);
  notificationService = inject(NotificationService);

  @ViewChild('globalAlert') globalAlert!: AlertComponent;
  alertMessage: string = '';
  alertType: 'success' | 'danger' | 'warning' | 'info' = 'success';

  ngOnInit(): void {
    this.notificationService.onNotification$.subscribe(notification => {
      this.alertMessage = notification.message;
      this.alertType = notification.type;
      setTimeout(() => this.globalAlert.show());
    });
  }

  @HostListener('mousemove')
  @HostListener('keydown')
  @HostListener('click')
  @HostListener('touchstart')
  onUserActivity(): void {
    this.inactivityService.reset();
  }
}

import { CommonModule } from '@angular/common';
import { Component, HostListener, inject, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AlertComponent } from './components/alert/alert.component';
import { HeaderComponent } from './components/header/header.component';
import { ModalComponent } from './components/modal/modal.component';
import { InactivityService } from './services/Inactivity-service/inactivity-service';
import { NotificationService } from './services/notification-service/notification.service';
import { PwaService } from './services/pwa-service/pwa.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, AlertComponent, ModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'lockin';
  showModalUpdate: boolean = false;
  inactivityService = inject(InactivityService);
  notificationService = inject(NotificationService);
  pwaService = inject(PwaService);

  @ViewChild('globalAlert') globalAlert!: AlertComponent;
  alertMessage: string = '';
  alertType: 'success' | 'danger' | 'warning' | 'info' = 'success';

  ngOnInit(): void {
    this.notificationService.onNotification$.subscribe(notification => {
      this.alertMessage = notification.message;
      this.alertType = notification.type;
      setTimeout(() => this.globalAlert.show());
    });

    this.notificationService.onDismiss$.subscribe(() => {
    if (this.globalAlert) {
      this.globalAlert.dismiss();
    }
  });
  
    this.pwaService.verifyUpdate(() =>{this.showModalUpdate = true});
  }

  

  @HostListener('mousemove')
  @HostListener('keydown')
  @HostListener('click')
  @HostListener('touchstart')
  onUserActivity(): void {
    this.inactivityService.reset();
  }
}

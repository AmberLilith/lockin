import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Notification {
  message: string;
  type: 'success' | 'danger' | 'warning' | 'info';
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private notification$ = new Subject<Notification>();
  private dismiss$ = new Subject<void>();

  onNotification$ = this.notification$.asObservable();
  onDismiss$ = this.dismiss$.asObservable(); 

  show(message: string, type: Notification['type'] = 'success'): void {
    this.notification$.next({ message, type });
  }
  close(): void {
    this.dismiss$.next();
  }
}
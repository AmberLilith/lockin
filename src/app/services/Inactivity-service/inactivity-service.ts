import { inject, Injectable } from '@angular/core';
import { Auth, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { NotificationService } from '../notification-service/notification.service';

@Injectable({ providedIn: 'root' })
export class InactivityService {
  private auth = inject(Auth);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  private timer: any;
  private readonly TIMEOUT = 5 * 60 * 1000;
  private isLocked: boolean = false;

  reset(): void {
    if (!this.auth.currentUser) return; // ← só monitora se estiver logado
    if (this.isLocked) return;

    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.lock(), this.TIMEOUT);
  }

  start(): void {
    this.isLocked = false;
    this.reset();
  }

  private async lock(): Promise<void> {
    this.isLocked = true;
    clearTimeout(this.timer);
    await signOut(this.auth);
    this.notificationService.show('Sessão encerrada por inatividade', 'warning');
    this.router.navigate(['/login']);
  }
}
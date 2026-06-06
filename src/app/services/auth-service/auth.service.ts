import { Injectable, inject } from '@angular/core';
import { Auth, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut, user } from '@angular/fire/auth';

import { Router } from '@angular/router';
import { InactivityService } from '../Inactivity-service/inactivity-service';
import { NotificationService } from '../notification-service/notification.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  private router = inject(Router);
  private inactivityService = inject(InactivityService);
  private notificationService = inject(NotificationService);

  user$ = user(this.auth);

  async register(email: string, password: string): Promise<void> {
  await createUserWithEmailAndPassword(this.auth, email, password);
}

  async loginWithEmail(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(this.auth, email, password);
    this.inactivityService.start(); // ← inicia o monitoramento
    this.router.navigate(['/home']);  
    this.closeAlert();  
  }

  async loginWithGoogle(): Promise<void> {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(this.auth, provider);
    this.inactivityService.start(); // ← inicia o monitoramento
    this.router.navigate(['/home']);
    this.closeAlert();
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
    this.router.navigate(['/login']);
  }

  getCurrentUser() {
    return this.auth.currentUser;
  }

  isLoggedIn(): boolean {
    return !!this.auth.currentUser;
  }

  closeAlert(): void {
    this.notificationService.close(); 
  }
}
import { Injectable, inject } from '@angular/core';
import { Auth, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut, user } from '@angular/fire/auth';

import { Router } from '@angular/router';
import { InactivityService } from '../Inactivity-service/inactivity-service';
import { VaultCryptoService } from '../vault-crypto-service/vault-crypto.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  private router = inject(Router);
  private inactivityService = inject(InactivityService);
  private vaultCryptoService = inject(VaultCryptoService);

  user$ = user(this.auth);

  async register(email: string, password: string): Promise<void> {
  await createUserWithEmailAndPassword(this.auth, email, password);
}

  async loginWithEmail(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(this.auth, email, password);
    this.vaultCryptoService.lockVault();
    this.inactivityService.start(); // ← inicia o monitoramento
    this.router.navigate(['/home']);
  }

  async loginWithGoogle(): Promise<void> {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(this.auth, provider);
    this.vaultCryptoService.lockVault();
    this.inactivityService.start(); // ← inicia o monitoramento
    this.router.navigate(['/home']);
  }

  async logout(): Promise<void> {
    this.vaultCryptoService.lockVault();
    await signOut(this.auth);
    this.router.navigate(['/login']);
  }

  getCurrentUser() {
    return this.auth.currentUser;
  }

  isLoggedIn(): boolean {
    return !!this.auth.currentUser;
  }
}
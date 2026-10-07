import { Injectable, inject } from '@angular/core';
import { Database, ref, set, remove, update, listVal } from '@angular/fire/database';
import { AuthService } from '../auth-service/auth.service';
import { Login } from '../../models/Login';
import { CryptoService } from '../crypto-service';
import { Observable } from 'rxjs';
import { VaultCryptoService } from '../vault-crypto-service/vault-crypto.service';

@Injectable({ providedIn: 'root' })
export class LoginService {
  private db = inject(Database);
  private authService = inject(AuthService);
  private cryptoService = inject(CryptoService);
  private vaultCryptoService = inject(VaultCryptoService);

  private getBasePath(): string {
    const uid = this.authService.getCurrentUser()?.uid;
    if (!uid) throw new Error('Usuário não autenticado');
    return `${uid}/logins`;
  }

  // Agora retorna um Observable que atualiza automaticamente
  getAll(): Observable<Login[]> {
    const loginsRef = ref(this.db, this.getBasePath());
    return listVal<Login>(loginsRef);
  }

  async create(login: Omit<Login, 'id'>): Promise<void> {
    const newId = crypto.randomUUID();
    const vaultKey = this.vaultCryptoService.getActiveVaultKey();
    const encryptedPassword = await this.vaultCryptoService.encryptWithVaultKey(
      login.password,
      vaultKey
    );

    const newLogin: Login = {
      ...login,
      id: newId,
      password: encryptedPassword,
      cryptoVersion: 2
    };

    await set(ref(this.db, `${this.getBasePath()}/${newId}`), newLogin);
  }

  async update(id: string, login: Partial<Login>): Promise<void> {
    if (login.password) {
      const vaultKey = this.vaultCryptoService.getActiveVaultKey();

      login.password = await this.vaultCryptoService.encryptWithVaultKey(
        login.password,
        vaultKey
      );

      login.cryptoVersion = 2;
    }

    await update(ref(this.db, `${this.getBasePath()}/${id}`), login);
  }

  async delete(id: string): Promise<void> {
    await remove(ref(this.db, `${this.getBasePath()}/${id}`));
  }
}
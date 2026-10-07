import { Injectable, inject } from '@angular/core';
import { Database, ref, set, remove, update, listVal, get } from '@angular/fire/database';
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

  async migrateV1ToV2(): Promise<{ total: number; migrated: number; skipped: number }> {
    const vaultKey = this.vaultCryptoService.getActiveVaultKey();
    const loginsRef = ref(this.db, this.getBasePath());
    const snapshot = await get(loginsRef);

    if (!snapshot.exists()) {
      return { total: 0, migrated: 0, skipped: 0 };
    }

    const logins = snapshot.val() as Record<string, Login>;
    const entries = Object.entries(logins);

    let migrated = 0;
    let skipped = 0;

    for (const [id, login] of entries) {
      const cryptoVersion = login.cryptoVersion ?? 1;

      if (cryptoVersion === 2) {
        skipped++;
        continue;
      }

      if (cryptoVersion !== 1) {
        throw new Error(
          `Login ${id} possui versão de criptografia não suportada: ${cryptoVersion}`
        );
      }

      try {
        const plainPassword = await this.cryptoService.decrypt(
          login.password,
          1
        );

        const encryptedPassword = await this.vaultCryptoService.encryptWithVaultKey(
          plainPassword,
          vaultKey
        );

        await update(ref(this.db, `${this.getBasePath()}/${id}`), {
          password: encryptedPassword,
          cryptoVersion: 2
        });

        migrated++;
      } catch (error) {
        throw new Error(
          `Falha ao migrar o login ${login.plataformName || id}. Migração interrompida.`,
          { cause: error }
        );
      }
    }

    return {
      total: entries.length,
      migrated,
      skipped
    };
  }

  async delete(id: string): Promise<void> {
    await remove(ref(this.db, `${this.getBasePath()}/${id}`));
  }
}
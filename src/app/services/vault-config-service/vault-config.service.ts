import { inject, Injectable } from '@angular/core';
import { Database, get, ref, set } from '@angular/fire/database';
import { CryptoConfig } from '../../models/CryptoConfig';
import { AuthService } from '../auth-service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class VaultConfigService {
  private db = inject(Database);
  private authService = inject(AuthService);

  private getConfigPath(): string {
    const uid = this.authService.getCurrentUser()?.uid;

    if (!uid) {
      throw new Error('Usuário não autenticado');
    }

    return `${uid}/crypto`;
  }

  async save(config: CryptoConfig): Promise<void> {
    const configRef = ref(this.db, this.getConfigPath());
    const snapshot = await get(configRef);

    if (snapshot.exists()) {
      throw new Error('Configuração criptográfica já existe e não pode ser sobrescrita.');
    }

    await set(configRef, config);
  }

  async update(config: CryptoConfig): Promise<void> {
    const configRef = ref(this.db, this.getConfigPath());
    const snapshot = await get(configRef);

    if (!snapshot.exists()) {
      throw new Error('Configuração criptográfica não encontrada.');
    }

    await set(configRef, config);
  }

  async get(): Promise<CryptoConfig | null> {
    const snapshot = await get(ref(this.db, this.getConfigPath()));

    if (!snapshot.exists()) {
      return null;
    }

    return snapshot.val() as CryptoConfig;
  }
}

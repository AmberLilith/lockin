import { inject, Injectable } from '@angular/core';
import { VaultCryptoService } from '../vault-crypto-service/vault-crypto.service';
import { Login } from '../../models/Login';

@Injectable({
  providedIn: 'root'
})
export class LoginActionsService {
  vaultCryptoService = inject(VaultCryptoService);
  constructor() { }

  async copyUser(value: string): Promise<void> {
    await navigator.clipboard.writeText(value);
  }

  async copyPassword(login: Login): Promise<void> {
    const plain = await this.vaultCryptoService.decryptWithVaultKey(
      login.password,
      this.vaultCryptoService.getActiveVaultKey()
    );

    await navigator.clipboard.writeText(plain);

    // Limpa a área de transferência após 30 segundos SE a tela da aplicação estiver ativa.
    setTimeout(() => navigator.clipboard.writeText(''), 30000);
  }

   async copyInputPasswordValue(value: string): Promise<void> {
    await navigator.clipboard.writeText(value);
  }

  capitalize(text: string): string {
    if (!text) return text;
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }
}

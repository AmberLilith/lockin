import { inject, Injectable } from '@angular/core';
import { CryptoService } from '../crypto-service';

@Injectable({
  providedIn: 'root'
})
export class LoginActionsService {
  cryptoService = inject(CryptoService);
  constructor() { }

  async copyUser(value: string): Promise<void> {
    await navigator.clipboard.writeText(value);
  }

  async copyPassword(encryptedPassword: string): Promise<void> {
    const plain = await this.cryptoService.decrypt(encryptedPassword);
    await navigator.clipboard.writeText(plain);
    // Limpa a área de transferência após 30 segundos SE a tela da aplicação estiver ativa. Senão da erro nos bastidores, mas sem atrapalhar nada
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

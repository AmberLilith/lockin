import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VaultCryptoService {
  readonly KDF = 'PBKDF2';
  readonly PBKDF2_ITERATIONS = 600000;

  generateSalt(): Uint8Array {
    return crypto.getRandomValues(new Uint8Array(16));
  }

  generateVaultKey(): Uint8Array {
    return crypto.getRandomValues(new Uint8Array(32));
  }

  async deriveMasterKey(
    masterPassword: string,
    salt: Uint8Array,
    iterations: number = this.PBKDF2_ITERATIONS
  ): Promise<CryptoKey> {
    const passwordMaterial = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(masterPassword),
      'PBKDF2',
      false,
      ['deriveKey']
    );

    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        hash: 'SHA-256',
        salt,
        iterations
      },
      passwordMaterial,
      {
        name: 'AES-GCM',
        length: 256
      },
      false,
      ['encrypt', 'decrypt']
    );
  }
}

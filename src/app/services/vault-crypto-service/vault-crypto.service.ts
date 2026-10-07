import { Injectable } from '@angular/core';
import { CryptoConfig } from '../../models/CryptoConfig';

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

  async createCryptoConfig(masterPassword: string): Promise<CryptoConfig> {
    const salt = this.generateSalt();
    const vaultKey = this.generateVaultKey();
    const masterKey = await this.deriveMasterKey(masterPassword, salt);

    const { encryptedVaultKey, iv } = await this.encryptVaultKey(
      vaultKey,
      masterKey
    );

    return {
      version: 2,
      kdf: this.KDF,
      iterations: this.PBKDF2_ITERATIONS,
      salt: this.bytesToBase64(salt),
      iv,
      encryptedVaultKey
    };
  }

  async encryptVaultKey(
    vaultKey: Uint8Array,
    masterKey: CryptoKey
  ): Promise<{ encryptedVaultKey: string; iv: string }> {
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      masterKey,
      vaultKey
    );

    return {
      encryptedVaultKey: this.bytesToBase64(new Uint8Array(encrypted)),
      iv: this.bytesToBase64(iv)
    };
  }

  async decryptVaultKey(
    encryptedVaultKey: string,
    iv: string,
    masterKey: CryptoKey
  ): Promise<Uint8Array> {
    const encryptedBytes = this.base64ToBytes(encryptedVaultKey);
    const ivBytes = this.base64ToBytes(iv);

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: ivBytes },
      masterKey,
      encryptedBytes
    );

    return new Uint8Array(decrypted);
  }

  private bytesToBase64(bytes: Uint8Array): string {
    return btoa(String.fromCharCode(...bytes));
  }

  private base64ToBytes(value: string): Uint8Array {
    return Uint8Array.from(atob(value), char => char.charCodeAt(0));
  }
}

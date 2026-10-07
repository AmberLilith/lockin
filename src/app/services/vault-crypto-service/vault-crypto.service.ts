import { Injectable } from '@angular/core';
import { CryptoConfig } from '../../models/CryptoConfig';

@Injectable({
  providedIn: 'root'
})
export class VaultCryptoService {
  readonly KDF = 'PBKDF2';
  readonly PBKDF2_ITERATIONS = 600000;

  private activeVaultKey: Uint8Array | null = null;

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

  async unlockVaultKey(
    masterPassword: string,
    config: CryptoConfig
  ): Promise<Uint8Array> {
    if (config.version !== 2) {
      throw new Error(`Versão de configuração criptográfica não suportada: ${config.version}`);
    }

    if (config.kdf !== this.KDF) {
      throw new Error(`KDF não suportado: ${config.kdf}`);
    }

    const salt = this.base64ToBytes(config.salt);
    const masterKey = await this.deriveMasterKey(
      masterPassword,
      salt,
      config.iterations
    );

    return this.decryptVaultKey(
      config.encryptedVaultKey,
      config.iv,
      masterKey
    );
  }

  async unlockVault(masterPassword: string, config: CryptoConfig): Promise<void> {
    this.activeVaultKey = await this.unlockVaultKey(masterPassword, config);
  }

  async changeMasterPassword(
    currentPassword: string,
    newPassword: string,
    config: CryptoConfig
  ): Promise<CryptoConfig> {
    const vaultKey = await this.unlockVaultKey(currentPassword, config);
    const salt = this.generateSalt();
    const masterKey = await this.deriveMasterKey(newPassword, salt);

    const { encryptedVaultKey, iv } = await this.encryptVaultKey(
      vaultKey,
      masterKey
    );

    this.activeVaultKey = new Uint8Array(vaultKey);
    vaultKey.fill(0);

    return {
      version: 2,
      kdf: this.KDF,
      iterations: this.PBKDF2_ITERATIONS,
      salt: this.bytesToBase64(salt),
      iv,
      encryptedVaultKey
    };
  }

  isVaultUnlocked(): boolean {
    return this.activeVaultKey !== null;
  }

  getActiveVaultKey(): Uint8Array {
    if (!this.activeVaultKey) {
      throw new Error('Cofre bloqueado');
    }

    return new Uint8Array(this.activeVaultKey);
  }

  lockVault(): void {
    if (this.activeVaultKey) {
      this.activeVaultKey.fill(0);
    }

    this.activeVaultKey = null;
  }

  async encryptWithVaultKey(
    plainText: string,
    vaultKey: Uint8Array
  ): Promise<string> {
    const key = await crypto.subtle.importKey(
      'raw',
      vaultKey,
      { name: 'AES-GCM' },
      false,
      ['encrypt']
    );

    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(plainText);

    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encoded
    );

    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encrypted), iv.length);

    return this.bytesToBase64(combined);
  }

  async decryptWithVaultKey(
    cipherText: string,
    vaultKey: Uint8Array
  ): Promise<string> {
    const key = await crypto.subtle.importKey(
      'raw',
      vaultKey,
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );

    const combined = this.base64ToBytes(cipherText);
    const iv = combined.slice(0, 12);
    const data = combined.slice(12);

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      data
    );

    return new TextDecoder().decode(decrypted);
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

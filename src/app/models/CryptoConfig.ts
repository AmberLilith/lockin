export interface CryptoConfig {
  version: number;
  kdf: 'PBKDF2';
  iterations: number;
  salt: string;
  iv: string;
  encryptedVaultKey: string;
}

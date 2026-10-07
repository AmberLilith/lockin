import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';

@Injectable({ providedIn: 'root' })
export class CryptoService {

  readonly CURRENT_VERSION = 1;
  private readonly LEGACY_KEY_V1 = environment.cryptoKey;

  // Converte a chave correspondente à versão em CryptoKey
  private async getKey(cryptoVersion: number): Promise<CryptoKey> {
    let secretKey: string;

    switch (cryptoVersion) {
      case 1:
        secretKey = this.LEGACY_KEY_V1;
        break;
      default:
        throw new Error(`Versão de criptografia não suportada: ${cryptoVersion}`);
    }

    const keyMaterial = new TextEncoder().encode(secretKey.padEnd(32).slice(0, 32));

    return crypto.subtle.importKey(
      'raw',
      keyMaterial,
      { name: 'AES-GCM' },
      false,
      ['encrypt', 'decrypt']
    );
  }

  // Criptografa — retorna string base64 (iv + dados cifrados)
  async encrypt(plainText: string, cryptoVersion: number = this.CURRENT_VERSION): Promise<string> {
    const key = await this.getKey(cryptoVersion);
    const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV (recomendado para GCM)
    const encoded = new TextEncoder().encode(plainText);

    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encoded
    );

    // Concatena IV + dados cifrados e converte para base64
    const combined = new Uint8Array(iv.byteLength + encrypted.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encrypted), iv.byteLength);
    const retorno = btoa(String.fromCharCode(...combined))
    return retorno;
  }

  // Descriptografa — recebe string base64 e retorna texto original
  async decrypt(cipherText: string, cryptoVersion: number = 1): Promise<string> {
    const key = await this.getKey(cryptoVersion);
    const combined = Uint8Array.from(atob(cipherText), c => c.charCodeAt(0));

    const iv = combined.slice(0, 12);           // primeiros 12 bytes = IV
    const data = combined.slice(12);            // resto = dados cifrados

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      data
    );
    return new TextDecoder().decode(decrypted);
  }
}

/* Como usar:
const cifrado = await this.crypto.encrypt('Site Da Microsoft'); ou
teste(){
    this.cryptoService.encrypt("cu").then((encrypted:string) =>{
        //ação que usa o valor retornado
    })
    }
const original = await this.crypto.decrypt(registro.plataformName);  */
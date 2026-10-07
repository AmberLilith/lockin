import { TestBed } from '@angular/core/testing';
import { VaultCryptoService } from './vault-crypto.service';

describe('VaultCryptoService', () => {
  let service: VaultCryptoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VaultCryptoService);
  });

  it('deve criptografar e recuperar a mesma vaultKey com a mesma senha mestra', async () => {
    const masterPassword = 'senha-mestra-de-teste';
    const salt = service.generateSalt();
    const originalVaultKey = service.generateVaultKey();

    const masterKey = await service.deriveMasterKey(masterPassword, salt);

    const { encryptedVaultKey, iv } = await service.encryptVaultKey(
      originalVaultKey,
      masterKey
    );

    const recoveredVaultKey = await service.decryptVaultKey(
      encryptedVaultKey,
      iv,
      masterKey
    );

    expect(Array.from(recoveredVaultKey)).toEqual(Array.from(originalVaultKey));
  });
});

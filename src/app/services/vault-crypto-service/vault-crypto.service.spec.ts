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

  it('deve criar CryptoConfig e desbloquear a vaultKey com a mesma senha mestra', async () => {
    const masterPassword = 'outra-senha-mestra-de-teste';

    const config = await service.createCryptoConfig(masterPassword);
    const recoveredVaultKey = await service.unlockVaultKey(
      masterPassword,
      config
    );

    expect(config.version).toBe(2);
    expect(config.kdf).toBe('PBKDF2');
    expect(config.iterations).toBe(service.PBKDF2_ITERATIONS);
    expect(config.salt).toBeTruthy();
    expect(config.iv).toBeTruthy();
    expect(config.encryptedVaultKey).toBeTruthy();
    expect(recoveredVaultKey.length).toBe(32);
  });


  it('deve criptografar e descriptografar uma senha usando a vaultKey', async () => {
    const plainPassword = 'SenhaDeLogin@123';
    const vaultKey = service.generateVaultKey();

    const encryptedPassword = await service.encryptWithVaultKey(
      plainPassword,
      vaultKey
    );

    const decryptedPassword = await service.decryptWithVaultKey(
      encryptedPassword,
      vaultKey
    );

    expect(encryptedPassword).not.toBe(plainPassword);
    expect(decryptedPassword).toBe(plainPassword);
  });

});

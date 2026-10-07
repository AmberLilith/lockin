import { Component, inject, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Login } from '../../models/Login';
import { ThemeService } from '../../services/theme-service/theme-service.service';
import { LoginCardComponent } from "../login-card/login-card.component";
import { ModalComponent } from "../modal/modal.component";
import { IconComponent } from "../icon/icon.component";
import { LoginFormComponent } from '../login-form/login-form.component';
import { AlertComponent } from '../alert/alert.component';
import { LoginService } from '../../services/login-service/login.service';
import { AuthService } from '../../services/auth-service/auth.service';
import { ProgressBarComponent } from '../progress-bar/progress-bar.component';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common'; // Importante para o pipe async
import { MasterPasswordSetupComponent } from '../master-password-setup/master-password-setup.component';
import { VaultConfigService } from '../../services/vault-config-service/vault-config.service';
import { VaultCryptoService } from '../../services/vault-crypto-service/vault-crypto.service';
import { MasterPasswordUnlockComponent } from '../master-password-unlock/master-password-unlock.component';
import { CryptoConfig } from '../../models/CryptoConfig';

@Component({
  selector: 'app-list-logins',
  standalone: true,
  imports: [CommonModule, ModalComponent, LoginCardComponent, ProgressBarComponent, IconComponent, LoginFormComponent, AlertComponent, MasterPasswordSetupComponent, MasterPasswordUnlockComponent],
  templateUrl: './list-logins.component.html',
  styleUrl: './list-logins.component.css'
})
export class ListLoginsComponent implements OnInit, OnDestroy {
  themeService = inject(ThemeService);
  loginService = inject(LoginService);
  auth = inject(AuthService);
  vaultConfigService = inject(VaultConfigService);
  vaultCryptoService = inject(VaultCryptoService);
  
  showModalCreateLogin: boolean = false;
  showModalConfimExclusion: boolean = false;
  showProgressBar: boolean = true;
  showModalMasterPassword: boolean = false;
  showModalUnlockVault: boolean = false;
  unlockErrorMessage: string = '';
  cryptoConfig: CryptoConfig | null = null;
  vaultUnlocked: boolean = false;
  showModalConfirmMigration: boolean = false;
  migrationRunning: boolean = false;
  migrationMessage: string = '';
  migrationError: string = '';
  
  private loginSubscription?: Subscription;
  loginsList: Login[] = [];
  loginsListToShow: Login[] = [];
  searchTerm: string = '';

  @ViewChild('alertCreation') alertCreation!: AlertComponent;

  async ngOnInit(): Promise<void> {
    // Inscreve-se para receber atualizações do banco em tempo real
    this.loginSubscription = this.loginService.getAll().subscribe({
      next: (logins) => {
        this.loginsList = logins || [];
        this.applyFilter();
        this.showProgressBar = false;
      },
      error: () => this.showProgressBar = false
    });

    this.cryptoConfig = await this.vaultConfigService.get();

    if (!this.cryptoConfig) {
      this.showModalMasterPassword = true;
    } else if (!this.vaultCryptoService.isVaultUnlocked()) {
      this.showModalUnlockVault = true;
    }
  }

  async setupMasterPassword(masterPassword: string): Promise<void> {
    const config = await this.vaultCryptoService.createCryptoConfig(masterPassword);
    await this.vaultConfigService.save(config);
    await this.vaultCryptoService.unlockVault(masterPassword, config);

    this.cryptoConfig = config;
    this.vaultUnlocked = true;
    this.showModalMasterPassword = false;
  }

  async unlockVault(masterPassword: string): Promise<void> {
    if (!this.cryptoConfig) {
      return;
    }

    this.unlockErrorMessage = '';

    try {
      await this.vaultCryptoService.unlockVault(masterPassword, this.cryptoConfig);
      this.vaultUnlocked = true;
      this.showModalUnlockVault = false;
    } catch {
      this.unlockErrorMessage = 'Senha mestra incorreta.';
    }
  }

  async migrateEncryption(): Promise<void> {
    if (!this.vaultUnlocked || this.migrationRunning) {
      return;
    }

    this.migrationRunning = true;
    this.migrationMessage = '';
    this.migrationError = '';
    this.showModalConfirmMigration = false;

    try {
      const result = await this.loginService.migrateV1ToV2();

      this.migrationMessage =
        `Migração concluída. Total: ${result.total}, migrados: ${result.migrated}, já em v2: ${result.skipped}.`;
    } catch (error) {
      this.migrationError = error instanceof Error
        ? error.message
        : 'Falha desconhecida durante a migração.';
    } finally {
      this.migrationRunning = false;
    }
  }

  getLoginByPlataformName(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.applyFilter();
  }

  private applyFilter(): void {
    const term = this.searchTerm.trim().toLowerCase();

    this.loginsListToShow = !term
      ? this.loginsList
      : this.loginsList.filter(login =>
        login.plataformName.toLowerCase().includes(term)
      );
  }

  async save(login: Omit<Login, 'id'>): Promise<void> {
    await this.loginService.create(login);
    // Não precisa mais chamar loadLogins(), o Firebase avisará o ngOnInit
    this.showModalCreateLogin = false;
    this.alertCreation.show();
  }

  ngOnDestroy(): void {
    // Limpa a conexão com o banco ao fechar o componente
    this.loginSubscription?.unsubscribe();
  }
}
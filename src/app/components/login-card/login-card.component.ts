import { Component, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { Login } from '../../models/Login';
import { CryptoService } from '../../services/crypto-service';
import { LoginActionsService } from '../../services/Login-actions-service/login-actions-service';
import { LoginService } from '../../services/login-service/login.service';
import { IconComponent } from '../icon/icon.component';
import { LoginFormComponent } from "../login-form/login-form.component";
import { ModalComponent } from '../modal/modal.component';
import { AlertComponent } from '../alert/alert.component';
import { VaultCryptoService } from '../../services/vault-crypto-service/vault-crypto.service';

@Component({
  selector: 'login-card',
  standalone: true,
  imports: [IconComponent, ModalComponent, LoginFormComponent, AlertComponent],
  templateUrl: './login-card.component.html',
  styleUrl: './login-card.component.css'
})
export class LoginCardComponent {
  cryptoService = inject(CryptoService);
  loginActionsService = inject(LoginActionsService);
  loginService = inject(LoginService);
  vaultCryptoService = inject(VaultCryptoService);

  @Input() login!: Login;
  @Input() vaultUnlocked: boolean = false;
  @Output() onDelete = new EventEmitter<void>();
  @Output() onEdit = new EventEmitter<void>();

  decryptedPassword: string = '';
  showPass: boolean = false;
  showModalEditLogin: boolean = false;
  showModalDeleteLogin: boolean = false;

  @ViewChild('alertExclusion') alertExclusion!: AlertComponent;
  @ViewChild('alertEdition') alertEdition!: AlertComponent;

  async ngOnInit(): Promise<void> {
    await this.loadDecryptedPassword();
  }

  async ngOnChanges(): Promise<void> {
    if (this.login) {
      await this.loadDecryptedPassword();
    }
  }

  private async loadDecryptedPassword(): Promise<void> {
    const cryptoVersion = this.login.cryptoVersion ?? 1;

    if (cryptoVersion === 2) {
      if (!this.vaultCryptoService.isVaultUnlocked()) {
        this.decryptedPassword = '';
        return;
      }

      this.decryptedPassword = await this.vaultCryptoService.decryptWithVaultKey(
        this.login.password,
        this.vaultCryptoService.getActiveVaultKey()
      );
      return;
    }

    this.decryptedPassword = await this.cryptoService.decrypt(
      this.login.password,
      cryptoVersion
    );
  }

  async delete(): Promise<void> {
    await this.loginService.delete(this.login.id);
    this.showModalDeleteLogin = false;
    this.alertExclusion.show();
    this.onDelete.emit(); // notifica o pai para recarregar a lista
  }

  async edit(updatedLogin: Omit<Login, 'id'>): Promise<void> {
    await this.loginService.update(this.login.id, updatedLogin);
    this.showModalEditLogin = false;
    this.alertEdition.show();
    this.onEdit.emit();
  }
}
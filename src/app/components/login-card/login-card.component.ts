import { Component, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { Login } from '../../models/Login';
import { CryptoService } from '../../services/crypto-service';
import { LoginActionsService } from '../../services/Login-actions-service/login-actions-service';
import { IconComponent } from '../icon/icon.component';
import { LoginFormComponent } from "../login-form/login-form.component";
import { ModalComponent } from '../modal/modal.component';
import { AlertComponent } from '../alert/alert.component';

@Component({
  selector: 'login-card',
  standalone: true,
  imports: [IconComponent, ModalComponent, LoginFormComponent, AlertComponent],
  templateUrl: './login-card.component.html',
  styleUrl: './login-card.component.css'
})
export class LoginCardComponent {
  cryptoService = inject(CryptoService);
  loginActionsService = inject(LoginActionsService)
  @Input() login!: Login;
  @Output() saveEdition = new EventEmitter<void>();
  decryptedPassword: string = "cu";
  showToast: boolean = false
  showPass: boolean = false;
  showModalEditLogin: boolean = false;
  showModalDeleteLogin: boolean = false;
  displayPassword: string = '';

  @ViewChild('alertExclusion') alertExclusion!: AlertComponent;
  @ViewChild('alertEdition') alertEdition!: AlertComponent;
  async ngOnInit() {
    this.decryptedPassword = await this.cryptoService.decrypt(this.login.password);
  }

  delete() {
    this.showModalDeleteLogin = false;
    this.alertExclusion.show();
  }


  edit() {
    this.alertEdition.show();
  }


}

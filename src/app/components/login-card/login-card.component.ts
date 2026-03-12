import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Login } from '../../models/Login';
import { CryptoService } from '../../services/crypto-service';
import { LoginActionsService } from '../../services/Login-actions-service/login-actions-service';
import { IconComponent } from '../icon/icon.component';
import { LoginFormComponent } from "../login-form/login-form.component";
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'login-card',
  standalone: true,
  imports: [IconComponent, ModalComponent, LoginFormComponent],
  templateUrl: './login-card.component.html',
  styleUrl: './login-card.component.css'
})
export class LoginCardComponent {
  cryptoService = inject(CryptoService);
  loginActionsService = inject(LoginActionsService)
  @Input() login!: Login;
  @Output() saveEdition = new EventEmitter<void>();
  decryptedPassword: string = "cu";
  showToast = false
  showPass = false;
  showModalEditLogin = false;
  displayPassword: string = '';

  async ngOnInit(){
   this.decryptedPassword = await this.cryptoService.decrypt(this.login.password);
  }
}

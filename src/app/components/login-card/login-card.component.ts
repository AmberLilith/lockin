import { Component, ElementRef, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { Login } from '../../models/Login';
import { CryptoService } from '../../services/crypto-service';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'login-card',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './login-card.component.html',
  styleUrl: './login-card.component.css'
})
export class LoginCardComponent {
  cryptoService = inject(CryptoService);
  @Input() login!: Login;
  @Output() saveEdition = new EventEmitter<void>();
  decryptedPassword: string = "cu";
  showToast = false
  showPass = false;
  displayPassword: string = '';

async showPassword(encryptedPassword: string): Promise<void> {
  this.displayPassword = await this.cryptoService.decrypt(encryptedPassword);
}

  async copyUser(value: string): Promise<void>{
  await navigator.clipboard.writeText(value);
  }

  async copyPassword(encryptedPassword: string): Promise<void> {
  const plain = await this.cryptoService.decrypt(encryptedPassword);
  await navigator.clipboard.writeText(plain); 
  // Limpa a área de transferência após 30 segundos SE a tela da aplicação estiver ativa. Senão da erro nos bastidores, mas sem atrapalhar nada
  setTimeout(() => navigator.clipboard.writeText(''), 30000);
}
}

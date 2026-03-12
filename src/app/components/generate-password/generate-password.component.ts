import { Component, EventEmitter, Input, Output } from '@angular/core';

export type PasswordType = 'alphanumeric*' | 'alphanumeric' | 'only-numbers' | 'only-letters';

@Component({
  selector: 'generate-password',
  standalone: true,
  imports: [],
  templateUrl: './generate-password.component.html',
  styleUrl: './generate-password.component.css'
})
export class GeneratePasswordComponent {

  @Output() onOk = new EventEmitter<any>();
  @Output() onCancel = new EventEmitter<void>();

  selectedOption: PasswordType = 'alphanumeric*';
  passwordLength = 7

  handleOk() {
    const pass = this.generatePassword(this.selectedOption, this.passwordLength)
    this.onOk.emit(pass);
    this.onCancel.emit();
  }

  handleCancel() {
    this.onCancel.emit();
  }



  generatePassword(type: PasswordType, length: number): string {
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let charset = '';
    let password = '';

    switch (type) {
      case 'alphanumeric*':
        charset = lower + upper + numbers + special;
        // Garante pelo menos 1 de cada obrigatório
        password += lower[Math.floor(Math.random() * lower.length)];
        password += upper[Math.floor(Math.random() * upper.length)];
        password += numbers[Math.floor(Math.random() * numbers.length)];
        password += special[Math.floor(Math.random() * special.length)];
        break;
      case 'alphanumeric':
        charset = lower + upper + numbers;
        password += lower[Math.floor(Math.random() * lower.length)];
        password += upper[Math.floor(Math.random() * upper.length)];
        password += numbers[Math.floor(Math.random() * numbers.length)];
        break;
      case 'only-numbers':
        charset = numbers;
        break;
      case 'only-letters':
        charset = lower + upper;
        password += lower[Math.floor(Math.random() * lower.length)];
        password += upper[Math.floor(Math.random() * upper.length)];
        break;
    }

    // Preenche o restante aleatoriamente
    for (let i = password.length; i < length; i++) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }

    // Embaralha para os caracteres obrigatórios não ficarem sempre no início
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }
}

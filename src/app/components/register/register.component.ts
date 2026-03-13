import { Component, EventEmitter, inject, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service/auth.service';
import { IconComponent } from '../icon/icon.component';
import { AlertComponent } from '../alert/alert.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, IconComponent, AlertComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  authService = inject(AuthService);
  showPass: boolean = false;
  errorMessage: string = '';

  @Output() onSuccess = new EventEmitter<string>(); // emite o email cadastrado
  @Output() onCancel = new EventEmitter<void>();

  @ViewChild('alertWait') alertWait!: AlertComponent;

  registerFormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', Validators.required)
  });

  get email() { return this.registerFormGroup.get('email'); }
  get password() { return this.registerFormGroup.get('password'); }
  get confirmPassword() { return this.registerFormGroup.get('confirmPassword'); }

  get passwordMismatch(): boolean {
    return this.password?.value !== this.confirmPassword?.value
      && !!this.confirmPassword?.touched;
  }

  async register(): Promise<void> {
    if (this.registerFormGroup.invalid || this.passwordMismatch) {
      this.registerFormGroup.markAllAsTouched();
      return;
    }
    try {
      this.alertWait.show();
      await this.authService.register(this.email?.value!, this.password?.value!);
      this.onSuccess.emit(this.email?.value!); // envia o email para o pai
      this.alertWait.dismiss();
    } catch (error: any) {
      this.errorMessage = this.getErrorMessage(error.code);
    }
  }

  private getErrorMessage(code: string): string {
    const messages: Record<string, string> = {
      'auth/email-already-in-use': 'Este email já está cadastrado',
      'auth/invalid-email': 'Email inválido',
      'auth/weak-password': 'Senha muito fraca — mínimo 6 caracteres'
    };
    return messages[code] ?? 'Erro ao criar conta. Tente novamente';
  }
}
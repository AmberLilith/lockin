import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service/auth.service';
import { IconComponent } from '../icon/icon.component';
import { RegisterComponent } from '../register/register.component';
import { ModalComponent } from '../modal/modal.component';
import { AlertComponent } from '../alert/alert.component';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule, IconComponent, RegisterComponent, ModalComponent],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
  authService = inject(AuthService);
  showPass: boolean = false; 
  errorMessage: string = '';
  showModalRegister: boolean = false;

  loginFormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });

  get email() { return this.loginFormGroup.get('email'); }
  get password() { return this.loginFormGroup.get('password'); }

  async loginWithEmail(): Promise<void> {
    if (this.loginFormGroup.invalid) {
      this.loginFormGroup.markAllAsTouched();
      return;
    }
    try {
      await this.authService.loginWithEmail(
        this.email?.value!,
        this.password?.value!
      );
    } catch (error: any) {
      this.errorMessage = this.getErrorMessage(error.code);
    }
  }

  async loginWithGoogle(): Promise<void> {
    try {
      await this.authService.loginWithGoogle();
    } catch (error: any) {
      this.errorMessage = this.getErrorMessage(error.code);
    }
  }

  private getErrorMessage(code: string): string {
    const messages: Record<string, string> = {
      'auth/user-not-found': 'Usuário não encontrado',
      'auth/wrong-password': 'Senha incorreta',
      'auth/invalid-email': 'Email inválido',
      'auth/too-many-requests': 'Muitas tentativas. Tente mais tarde',
      'auth/popup-closed-by-user': 'Login com Google cancelado'
    };
    return messages[code] ?? 'Erro ao fazer login. Tente novamente';
  }

  onRegisterSuccess(email: string): void {
  this.showModalRegister = false;
  this.loginFormGroup.patchValue({ email }); // preenche o email automaticamente
}
}
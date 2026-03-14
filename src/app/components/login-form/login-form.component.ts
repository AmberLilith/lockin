import { Component, ElementRef, EventEmitter, inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Login } from '../../models/Login';
import { CryptoService } from '../../services/crypto-service';
import { LoginActionsService } from '../../services/Login-actions-service/login-actions-service';
import { GeneratePasswordComponent } from '../generate-password/generate-password.component';
import { IconComponent } from '../icon/icon.component';
import { ModalComponent } from '../modal/modal.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'login-form',
  standalone: true,
  imports: [IconComponent, GeneratePasswordComponent, ModalComponent, ReactiveFormsModule],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css'
})
export class LoginFormComponent implements OnInit {
  loginActionsService = inject(LoginActionsService);
  cryptoService = inject(CryptoService);

  @Input() login!: Login;
  @Output() onOk = new EventEmitter<Omit<Login, 'id'>>();
  @Output() onCancel = new EventEmitter<void>();

  showPass: boolean = false;
  showModalGenPass: boolean = false;
  decryptedPassword: string = '';

  @ViewChild('inputPassword') inputPassword!: ElementRef<HTMLInputElement>;
  @ViewChild('inputRepeatPassword') inputRepeatPassword!: ElementRef<HTMLInputElement>;

  loginFormGroup = new FormGroup({
    plataformName: new FormControl('', Validators.required),
    user: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  get plataformName() { return this.loginFormGroup.get('plataformName'); }
  get user() { return this.loginFormGroup.get('user'); }
  get password() { return this.loginFormGroup.get('password'); }

  get isEditing(): boolean { return !!this.login; }

  async ngOnInit(): Promise<void> {
    if (this.isEditing) {
      this.decryptedPassword = await this.cryptoService.decrypt(this.login.password);
      this.loginFormGroup.patchValue({
        plataformName: this.login.plataformName,
        user: this.login.user,
        password: this.decryptedPassword
      });
    }
  }

  getGeneratedPassword(value: string): void {
    this.inputPassword.nativeElement.value = value;
    this.inputRepeatPassword.nativeElement.value = value;
    this.loginFormGroup.patchValue({ password: value });
  }

  save(): void {
    if (this.loginFormGroup.invalid) {
      this.loginFormGroup.markAllAsTouched();
      return;
    }

    if (this.inputPassword.nativeElement.value !== this.inputRepeatPassword.nativeElement.value) {
      return;
    }

    this.onOk.emit({
      plataformName: this.plataformName?.value!,
      user: this.user?.value!,
      password: this.inputPassword.nativeElement.value
    });
  }

  handleCancel(): void {
    this.onCancel.emit();
  }
}
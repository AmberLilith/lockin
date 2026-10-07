import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

export interface MasterPasswordChange {
  currentPassword: string;
  newPassword: string;
}

@Component({
  selector: 'app-master-password-unlock',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './master-password-unlock.component.html',
  styleUrl: './master-password-unlock.component.css'
})
export class MasterPasswordUnlockComponent {
  @Input() errorMessage: string = '';
  @Output() onConfirm = new EventEmitter<string>();
  @Output() onChangePassword = new EventEmitter<MasterPasswordChange>();

  changeMode: boolean = false;
  changeErrorMessage: string = '';
  passwordLength: number = 20;

  form = new FormGroup({
    masterPassword: new FormControl('', Validators.required)
  });

  changeForm = new FormGroup({
    currentPassword: new FormControl('', Validators.required),
    newPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(12)
    ]),
    repeatNewPassword: new FormControl('', Validators.required)
  });

  get masterPassword() {
    return this.form.get('masterPassword');
  }

  get currentPassword() {
    return this.changeForm.get('currentPassword');
  }

  get newPassword() {
    return this.changeForm.get('newPassword');
  }

  get repeatNewPassword() {
    return this.changeForm.get('repeatNewPassword');
  }

  confirm(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const masterPassword = this.masterPassword?.value;

    if (!masterPassword) {
      return;
    }

    this.onConfirm.emit(masterPassword);
  }

  enableChangeMode(): void {
    this.changeMode = true;
    this.changeErrorMessage = '';
    this.form.reset();
  }

  cancelChange(): void {
    this.changeMode = false;
    this.changeErrorMessage = '';
    this.changeForm.reset();
  }

  generateStrongPassword(): void {
    const length = Math.max(12, Math.floor(this.passwordLength || 20));

    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    const all = lower + upper + numbers + special;

    const passwordChars: string[] = [
      this.secureRandomChar(lower),
      this.secureRandomChar(upper),
      this.secureRandomChar(numbers),
      this.secureRandomChar(special)
    ];

    while (passwordChars.length < length) {
      passwordChars.push(this.secureRandomChar(all));
    }

    this.secureShuffle(passwordChars);

    const password = passwordChars.join('');

    this.passwordLength = length;
    this.changeForm.patchValue({
      newPassword: password,
      repeatNewPassword: password
    });

    this.changeErrorMessage = '';
  }

  private secureRandomChar(charset: string): string {
    const maxValidValue = Math.floor(256 / charset.length) * charset.length;
    const random = new Uint8Array(1);

    do {
      crypto.getRandomValues(random);
    } while (random[0] >= maxValidValue);

    return charset[random[0] % charset.length];
  }

  private secureShuffle(values: string[]): void {
    for (let i = values.length - 1; i > 0; i--) {
      const maxValidValue = Math.floor(256 / (i + 1)) * (i + 1);
      const random = new Uint8Array(1);

      do {
        crypto.getRandomValues(random);
      } while (random[0] >= maxValidValue);

      const j = random[0] % (i + 1);
      [values[i], values[j]] = [values[j], values[i]];
    }
  }

  confirmChange(): void {
    this.changeErrorMessage = '';

    if (this.changeForm.invalid) {
      this.changeForm.markAllAsTouched();
      return;
    }

    if (this.newPassword?.value !== this.repeatNewPassword?.value) {
      this.changeErrorMessage = 'As novas senhas mestras não coincidem.';
      return;
    }

    const currentPassword = this.currentPassword?.value;
    const newPassword = this.newPassword?.value;

    if (!currentPassword || !newPassword) {
      return;
    }

    this.onChangePassword.emit({
      currentPassword,
      newPassword
    });
  }
}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

export interface MasterPasswordChange {
  currentPassword: string;
  newPassword: string;
}

@Component({
  selector: 'app-master-password-unlock',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './master-password-unlock.component.html',
  styleUrl: './master-password-unlock.component.css'
})
export class MasterPasswordUnlockComponent {
  @Input() errorMessage: string = '';
  @Output() onConfirm = new EventEmitter<string>();
  @Output() onChangePassword = new EventEmitter<MasterPasswordChange>();

  changeMode: boolean = false;
  changeErrorMessage: string = '';

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

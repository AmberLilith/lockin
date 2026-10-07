import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-master-password-setup',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './master-password-setup.component.html',
  styleUrl: './master-password-setup.component.css'
})
export class MasterPasswordSetupComponent {
  @Output() onConfirm = new EventEmitter<string>();

  errorMessage: string = '';

  form = new FormGroup({
    masterPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(12)
    ]),
    repeatMasterPassword: new FormControl('', [
      Validators.required
    ])
  });

  get masterPassword() {
    return this.form.get('masterPassword');
  }

  get repeatMasterPassword() {
    return this.form.get('repeatMasterPassword');
  }

  confirm(): void {
    this.errorMessage = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.masterPassword?.value !== this.repeatMasterPassword?.value) {
      this.errorMessage = 'As senhas mestras não coincidem.';
      return;
    }

    const masterPassword = this.masterPassword?.value;

    if (!masterPassword) {
      return;
    }

    this.onConfirm.emit(masterPassword);
  }
}

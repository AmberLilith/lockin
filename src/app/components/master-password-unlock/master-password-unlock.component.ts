import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

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

  form = new FormGroup({
    masterPassword: new FormControl('', Validators.required)
  });

  get masterPassword() {
    return this.form.get('masterPassword');
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
}

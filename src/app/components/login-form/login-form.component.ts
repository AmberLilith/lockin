import { Component, ElementRef, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
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
export class LoginFormComponent {
  loginActionsService = inject(LoginActionsService);
  cryptoService = inject(CryptoService);
  @Input() login!: Login
  loginFormGroup!: FormGroup
  showPass: boolean = false;
  showModalGenPass: boolean = false;
  decryptedPassword: string = "";
  displayPassword: string = "";

  @Output() onOk = new EventEmitter<any>();
    @Output() onCancel = new EventEmitter<void>();

  @ViewChild("inputPassword") inputPassword!: ElementRef<HTMLInputElement>;
  @ViewChild("inputRepeatPassword") inputRepeatPassword!: ElementRef<HTMLInputElement>;

  constructor(){
    this.loginFormGroup = new FormGroup({
      plataformName: new FormControl("",Validators.required),
      user: new FormControl("", Validators.required),
      password: new FormControl("", [Validators.required])
    })
  }

  get plataformName() {
  return this.loginFormGroup.get('plataformName');
}

get user(){
  return this.loginFormGroup.get('user');
}

get password() {
  return this.loginFormGroup.get('password');
}

  getGeneratedPassword(value: string): void{
    this.inputPassword.nativeElement.value = value;
    this.inputRepeatPassword.nativeElement.value = value;
  }  
  
    handleOk() {
      this.onOk.emit();
      this.onCancel.emit();
    }
  
    handleCancel() {
      this.onCancel.emit();
    }

  async ngOnInit(){
    if(this.login){
      this.decryptedPassword = await this.cryptoService.decrypt(this.login.password);
    }
  }
}

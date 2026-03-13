import { Component, inject, ViewChild } from '@angular/core';
import { Login } from '../../models/Login';
import { ThemeService } from '../../services/theme-service/theme-service.service';
import { LoginCardComponent } from "../login-card/login-card.component";
import { ModalComponent } from "../modal/modal.component";
import { HeaderComponent } from '../header/header.component';
import { IconComponent } from "../icon/icon.component";
import { LoginFormComponent } from '../login-form/login-form.component';
import { AlertComponent } from '../alert/alert.component';
import { LoginService } from '../../services/login-service/login.service';
import { AuthService } from '../../services/auth-service/auth.service';

@Component({
  selector: 'app-list-logins',
  standalone: true,
  imports: [ModalComponent, LoginCardComponent, HeaderComponent, IconComponent, LoginFormComponent, AlertComponent],
  templateUrl: './list-logins.component.html',
  styleUrl: './list-logins.component.css'
})
export class ListLoginsComponent {
  themeService = inject(ThemeService);
  loginService = inject(LoginService);
  auth = inject(AuthService);
  showModalCreateLogin: boolean = false;
  showModalConfimExclusion: boolean = false;

  @ViewChild('alertCreation') alertCreation!: AlertComponent;

  loginsList: Login[] = [];
  loginsListToShow: Login[] = [];

  async ngOnInit(): Promise<void> {
    await this.loadLogins();
  }

  async loadLogins(): Promise<void> {
    this.loginsList = await this.loginService.getAll();
    this.loginsListToShow = this.loginsList;
  }

  getLoginByPlataformName(searchTerm: string): void {
    const term = searchTerm.trim().toLowerCase();
    this.loginsListToShow = !term
      ? this.loginsList
      : this.loginsList.filter(login =>
        login.plataformName.toLowerCase().includes(term)
      );
  }

  async save(login: Omit<Login, 'id'>): Promise<void> {
    await this.loginService.create(login);
    await this.loadLogins();
    this.showModalCreateLogin = false;
    this.alertCreation.show();
  }
}
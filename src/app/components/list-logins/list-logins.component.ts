import { Component, inject, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Login } from '../../models/Login';
import { ThemeService } from '../../services/theme-service/theme-service.service';
import { LoginCardComponent } from "../login-card/login-card.component";
import { ModalComponent } from "../modal/modal.component";
import { IconComponent } from "../icon/icon.component";
import { LoginFormComponent } from '../login-form/login-form.component';
import { AlertComponent } from '../alert/alert.component';
import { LoginService } from '../../services/login-service/login.service';
import { AuthService } from '../../services/auth-service/auth.service';
import { ProgressBarComponent } from '../progress-bar/progress-bar.component';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common'; // Importante para o pipe async

@Component({
  selector: 'app-list-logins',
  standalone: true,
  imports: [CommonModule, ModalComponent, LoginCardComponent, ProgressBarComponent, IconComponent, LoginFormComponent, AlertComponent],
  templateUrl: './list-logins.component.html',
  styleUrl: './list-logins.component.css'
})
export class ListLoginsComponent implements OnInit, OnDestroy {
  themeService = inject(ThemeService);
  loginService = inject(LoginService);
  auth = inject(AuthService);
  
  showModalCreateLogin: boolean = false;
  showModalConfimExclusion: boolean = false;
  showProgressBar: boolean = true;
  
  private loginSubscription?: Subscription;
  loginsList: Login[] = [];
  loginsListToShow: Login[] = [];

  @ViewChild('alertCreation') alertCreation!: AlertComponent;

  ngOnInit(): void {
    // Inscreve-se para receber atualizações do banco em tempo real
    this.loginSubscription = this.loginService.getAll().subscribe({
      next: (logins) => {
        this.loginsList = logins || [];
        this.loginsListToShow = this.loginsList;
        this.showProgressBar = false;
      },
      error: () => this.showProgressBar = false
    });
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
    // Não precisa mais chamar loadLogins(), o Firebase avisará o ngOnInit
    this.showModalCreateLogin = false;
    this.alertCreation.show();
  }

  ngOnDestroy(): void {
    // Limpa a conexão com o banco ao fechar o componente
    this.loginSubscription?.unsubscribe();
  }
}
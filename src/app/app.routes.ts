import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { ListLoginsComponent } from './components/list-logins/list-logins.component';

export const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: 'home', component: ListLoginsComponent, canActivate: [authGuard] },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }
];
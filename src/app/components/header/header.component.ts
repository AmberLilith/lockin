import { Component, HostListener, inject } from '@angular/core';
import { ThemeService } from '../../services/theme-service/theme-service.service';
import { IconComponent } from '../icon/icon.component';
import { SideMenuComponent } from '../side-menu/side-menu.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [IconComponent,  SideMenuComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  themeService = inject(ThemeService);
  sidebarOpen: boolean = false;
  deferredPrompt: any;
  showInstallButton = false;

  @HostListener('window:beforeinstallprompt', ['$event'])
  onBeforeInstallPrompt(e: Event) {
    // Impede o Chrome de mostrar o aviso automático
    e.preventDefault();
    // Guarda o evento para usar depois
    this.deferredPrompt = e;
    // Mostra o seu botão customizado
    this.showInstallButton = true;
  }

  installPWA() {
    this.showInstallButton = false;
    // Dispara o prompt guardado
    this.deferredPrompt.prompt();
    // Verifica a escolha do usuário
    this.deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('Usuário aceitou a instalação');
      }
      this.deferredPrompt = null;
    });
  }
}
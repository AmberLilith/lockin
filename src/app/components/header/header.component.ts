import { Component, HostListener, inject } from '@angular/core';
import { PwaService } from '../../services/pwa-service/pwa.service';
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
  pwaService = inject(PwaService);
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

  installPWA(){
    this.pwaService.installPWA(() =>{this.showInstallButton = false});
  }
  
}
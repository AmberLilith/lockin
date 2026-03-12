import { Component, inject } from '@angular/core';
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
}
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { AuthService } from '../../services/auth-service/auth.service';

@Component({
  selector: 'side-menu',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.css'
})
export class SideMenuComponent {
  authService = inject(AuthService);

  @Input() isOpen: boolean = false;
  @Output() isOpenChange = new EventEmitter<boolean>();

  close(): void {
    this.isOpenChange.emit(false);
  }

  async logout(): Promise<void> {
    this.close();
    await this.authService.logout();
  }
}
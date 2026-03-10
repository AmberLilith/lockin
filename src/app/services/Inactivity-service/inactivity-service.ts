import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InactivityServiceService {

  private timer: any;
  private readonly TIMEOUT = 5 * 60 * 1000; // 5 minutos

  reset(): void {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.lock(), this.TIMEOUT);
  }

  private lock(): void {
    //this.router.navigate(['/login']); // TODO Descomentar após rotas estiverem prontas
  }
}

/* O reset() precisa ser chamado a cada interação do usuário. A melhor forma é no AppComponent ouvindo os eventos do mouse e teclado:
typescript@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  inactivityService = inject(InactivityService);

  @HostListener('mousemove')
  @HostListener('keydown')
  @HostListener('click')
  @HostListener('touchstart')
  onUserActivity(): void {
    this.inactivityService.reset();
  }
} */